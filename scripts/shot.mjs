// Screenshot helper that drives Edge over CDP so the CSS viewport matches the
// requested width exactly (headless Edge clamps real windows to ~500px).
//
//   node scripts/shot.mjs --url http://localhost:5199/ --out .impeccable/review/mobile.png --width 390 --height 900

import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const url = opt("url", "http://localhost:5199/");
const out = resolve(opt("out", ".impeccable/review/shot.png"));
const width = Number(opt("width", 1440));
const height = Number(opt("height", 1000));
const mobile = args.includes("--mobile");
const fullPage = !args.includes("--viewport-only");
const port = 9300 + Math.floor(Math.random() * 500);

const profile = resolve(tmpdir(), `edge-cdp-${Date.now()}`);
const browser = spawn(
  EDGE,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-prefers-reduced-motion",
    "--force-device-scale-factor=1",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDevtools() {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return (await res.json()).webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(150);
  }
  throw new Error("devtools endpoint never came up");
}

function connect(wsUrl) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(wsUrl);
    ws.addEventListener("open", () => res(ws));
    ws.addEventListener("error", (e) => rej(new Error("ws error")));
  });
}

let nextId = 1;
const pending = new Map();
const listeners = [];

function send(ws, method, params = {}, sessionId) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej, method }));
}

function once(eventName, sessionId) {
  return new Promise((res) => {
    listeners.push({ eventName, sessionId, res });
  });
}

function cleanup() {
  try {
    browser.kill();
  } catch {
    /* ignore */
  }
}

try {
  const wsUrl = await waitForDevtools();
  const ws = await connect(wsUrl);

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej, method } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) rej(new Error(`${method}: ${msg.error.message}`));
      else res(msg.result);
      return;
    }
    if (msg.method) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        const l = listeners[i];
        if (l.eventName === msg.method && (!l.sessionId || l.sessionId === msg.sessionId)) {
          listeners.splice(i, 1);
          l.res(msg.params);
        }
      }
    }
  });

  const { targetId } = await send(ws, "Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send(ws, "Target.attachToTarget", { targetId, flatten: true });

  await send(ws, "Page.enable", {}, sessionId);
  await send(ws, "Runtime.enable", {}, sessionId);
  await send(
    ws,
    "Emulation.setDeviceMetricsOverride",
    {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: width,
      screenHeight: height,
    },
    sessionId
  );

  const loaded = once("Page.loadEventFired", sessionId);
  await send(ws, "Page.navigate", { url }, sessionId);
  await Promise.race([loaded, sleep(15000)]);
  await sleep(1200);

  if (fullPage) {
    // Walk the page so lazy-loaded media and reveal observers fire.
    await send(
      ws,
      "Runtime.evaluate",
      {
        awaitPromise: true,
        expression: `(async () => {
          const step = Math.round(innerHeight * 0.8);
          const max = document.documentElement.scrollHeight;
          for (let y = 0; y < max; y += step) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 600));
          const imgs = Array.from(document.images).filter((i) => !i.complete || i.naturalWidth === 0);
          return { pending: imgs.map((i) => i.currentSrc || i.src) };
        })()`,
        returnByValue: true,
      },
      sessionId
    );
    await sleep(800);
  }

  const clickSelector = opt("click", null);
  if (clickSelector) {
    await send(
      ws,
      "Runtime.evaluate",
      {
        expression: `document.querySelector(${JSON.stringify(clickSelector)})?.click()`,
        returnByValue: true,
      },
      sessionId
    );
    await sleep(3200);
  }

  const probe = await send(
    ws,
    "Runtime.evaluate",
    {
      expression: `(() => {
        const w = document.documentElement.clientWidth;
        const bad = [];
        document.querySelectorAll("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > w + 1 || r.left < -1) {
            bad.push(el.tagName + "." + (el.className || "-") + " " + Math.round(r.left) + ".." + Math.round(r.right));
          }
        });
        return { w, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, bad: bad.slice(0, 12) };
      })()`,
      returnByValue: true,
    },
    sessionId
  );

  const metrics = await send(ws, "Page.getLayoutMetrics", {}, sessionId);
  const css = metrics.cssContentSize || metrics.contentSize;

  const shot = await send(
    ws,
    "Page.captureScreenshot",
    fullPage
      ? {
          format: "png",
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width, height: Math.ceil(css.height), scale: 1 },
        }
      : { format: "png", captureBeyondViewport: false },
    sessionId
  );

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(shot.data, "base64"));

  console.log(
    JSON.stringify(
      { out, viewport: probe.result.value, contentHeight: Math.ceil(css.height) },
      null,
      2
    )
  );

  ws.close();
  cleanup();
  process.exit(0);
} catch (err) {
  cleanup();
  console.error(String(err && err.message ? err.message : err));
  process.exit(1);
}
