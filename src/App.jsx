import { useEffect, useMemo, useState } from "react";
import BookingDialog from "./components/BookingDialog.jsx";
import {
  ArrowRight,
  ArrowUpRight,
  Chat,
  Sparkle,
} from "./components/Icons.jsx";
import { EMAIL, projects } from "./data.js";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function useScrollSpy() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.6] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return active;
}

function ManilaClock() {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    []
  );
  const [now, setNow] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(formatter.format(new Date()));
    }, 30000);
    return () => window.clearInterval(id);
  }, [formatter]);

  return (
    <span className="hero-meta__item">{now} local time</span>
  );
}

export default function App() {
  const [booking, setBooking] = useState(false);
  const active = useScrollSpy();

  useReveal();

  const openBooking = () => setBooking(true);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="page">
        <div className="shell">
          <header className="nav">
            <div className="nav__pill">
              <a className="wordmark" href="#home">
                Dy&nbsp;ann<span>.</span>
              </a>

              <nav className="nav__links" aria-label="Sections">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    aria-current={active === section.id ? "true" : undefined}
                  >
                    {section.label}
                  </a>
                ))}
              </nav>

              <button
                type="button"
                className="nav__cta"
                onClick={openBooking}
              >
                Book a call
              </button>
            </div>
          </header>

          <main id="main">
            <section className="hero" id="home">
              <div className="hero__copy">
                <p className="badge" data-reveal>
                  <span className="badge__mark" aria-hidden="true">
                    <Sparkle />
                  </span>
                  Open to Internship &amp; Junior Developer Opportunities
                </p>

                <h1 className="hero__title" data-reveal style={{ "--d": 60 }}>
                  I turn ideas into <em>functional web applications.</em>
                </h1>

                <p className="hero__lede" data-reveal style={{ "--d": 140 }}>
                  I'm Dy Ann, an aspiring Full-Stack Developer from the
                  Philippines. I build responsive web experiences, develop
                  backend systems, and turn real-world problems into practical
                  software solutions.
                </p>

                <div className="hero__actions" data-reveal style={{ "--d": 220 }}>
                  <a className="btn btn--primary" href="#work">
                    See My Projects
                    <ArrowUpRight />
                  </a>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={openBooking}
                  >
                    Get In Touch
                    <Chat />
                  </button>
                </div>
              </div>

              <figure className="hero__figure" data-reveal style={{ "--d": 120 }}>
                <img
                  src={`${import.meta.env.BASE_URL}profile-dark.png`}
                  alt="Portrait of Dy ann Razonado"
                  width="886"
                  height="811"
                  fetchPriority="high"
                  decoding="async"
                />
              </figure>
            </section>

            <div className="hero-meta">
              <span className="hero-meta__item">Full-stack development</span>
              <span className="hero-meta__item">
                Based in the Philippines
              </span>
              <ManilaClock />
            </div>

            <section className="about" id="about">
              <div className="section__intro">
                <p className="eyebrow" data-reveal>
                  About
                </p>
                <h2 data-reveal style={{ "--d": 60 }}>
                  I build web applications that turn ideas into working
                  solutions.
                </h2>
                <p data-reveal style={{ "--d": 120 }}>
                  I'm a BSIT student and aspiring Full-Stack Developer from the
                  Philippines, passionate about building practical web
                  applications that solve real-world problems. I enjoy turning
                  ideas into functional, user-friendly experiences through clean
                  interfaces and reliable backend systems.
                </p>
                <p data-reveal style={{ "--d": 160 }}>
                  I work across the stack, from designing interfaces and
                  developing frontend features to building APIs, managing
                  databases, and connecting everything into one working
                  application. I'm continuously learning, improving my skills,
                  and building projects that challenge me to grow as a
                  developer.
                </p>
              </div>

              <aside className="about__aside" data-reveal style={{ "--d": 120 }}>
                <dl className="facts">
                  <dt>Based in</dt>
                  <dd>The Philippines</dd>
                  <dt>Role</dt>
                  <dd>Aspiring Full-Stack Developer</dd>
                  <dt>Tech stack</dt>
                  <dd>React, Node.js, Express, MySQL</dd>
                  <dt>Availability</dt>
                  <dd>Open to Internship &amp; Opportunities</dd>
                </dl>

                <div className="services">
                  <p className="eyebrow">What I build</p>
                  <ol>
                    <li>
                      <span>01</span>— Full-Stack Web Applications
                    </li>
                    <li>
                      <span>02</span>— Database-Driven Systems &amp; APIs
                    </li>
                    <li>
                      <span>03</span>— Admin Dashboards &amp; Management Systems
                    </li>
                  </ol>
                </div>
              </aside>
            </section>

            <section className="work" id="work">
              <header className="section-head">
                <p className="eyebrow" data-reveal>
                  Selected work
                </p>
                <h2 data-reveal style={{ "--d": 60 }}>
                  Three systems, all running.
                </h2>
                <p className="section-head__note" data-reveal style={{ "--d": 120 }}>
                  Each one links to the live product. The screenshots are
                  captures of those pages, not mockups.
                </p>
              </header>

              <ul className="projects">
                {projects.map((project, i) => (
                  <li className="project" key={project.id}>
                    <a
                      className="project__media"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}, ${project.kind}, in a new tab`}
                      data-reveal
                      style={{ "--d": i * 40 }}
                    >
                      <img
                        src={project.image}
                        alt={project.alt}
                        width="1280"
                        height="886"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>

                    <div className="project__body" data-reveal style={{ "--d": 80 }}>
                      <p className="project__kicker">
                        <span>{project.index}</span>
                        {project.kind}
                      </p>
                      <h3>{project.title}</h3>
                      <p className="project__desc">{project.description}</p>
                      <ul className="tags">
                        {project.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      <a
                        className="project__link"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit the live site
                        <ArrowUpRight />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="contact" id="contact">
              <div className="contact__inner" data-reveal>
                <p className="eyebrow">Contact</p>
                <h2>Tell me what's slowing you down.</h2>
                <p className="contact__lede">
                  Book 30 minutes. You describe the problem, I tell you what I
                  would build and what it takes. If a call is not your thing,
                  email works too.
                </p>
                <div className="contact__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={openBooking}
                  >
                    Book a 30-minute call
                    <ArrowRight />
                  </button>
                  <a className="btn btn--ghost" href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                </div>
              </div>
            </section>
          </main>

          <footer className="footer">
            <span>Dy ann Razonado, {new Date().getFullYear()}</span>
            <span>Philippines</span>
            <span>Built with React</span>
          </footer>
        </div>
      </div>

      <BookingDialog open={booking} onClose={() => setBooking(false)} />
    </>
  );
}
