import { useEffect, useRef, useState } from "react";
import { CALENDLY_EMBED, CALENDLY_URL, EMAIL } from "../data.js";
import { ArrowUpRight, Close } from "./Icons.jsx";

export default function BookingDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open) {
      setLoaded(false);
      setScheduled(false);
      setMounted(true);
      if (!el.open) el.showModal();
      document.documentElement.classList.add("is-locked");
    } else {
      if (el.open) el.close();
      document.documentElement.classList.remove("is-locked");
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    function handleClose() {
      document.documentElement.classList.remove("is-locked");
      onClose();
    }

    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    function handleMessage(event) {
      if (!event.origin.endsWith("calendly.com")) return;
      if (event.data?.event === "calendly.event_scheduled") setScheduled(true);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="booking"
      aria-labelledby="booking-title"
      onClick={handleBackdropClick}
    >
      <div className="booking__panel">
        <header className="booking__head">
          <div>
            <h2 className="booking__title" id="booking-title">
              {scheduled ? "You're booked" : "Book a 30-minute call"}
            </h2>
            <p className="booking__sub">
              {scheduled
                ? "Check your inbox for the invite and the meeting link."
                : "Pick a slot that works for you. Video or voice, whichever you prefer."}
            </p>
          </div>
          <button
            type="button"
            className="booking__close"
            onClick={onClose}
            aria-label="Close booking"
          >
            <Close />
          </button>
        </header>

        <div className="booking__frame">
          {scheduled ? (
            <div className="booking__done">
              <p className="booking__done-mark" aria-hidden="true">
                ✓
              </p>
              <p className="booking__done-text">
                The calendar sent a confirmation to your email. Reply to it with
                anything you want me to look at before we talk.
              </p>
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Back to the site
              </button>
            </div>
          ) : (
            <>
              {!loaded && (
                <div className="booking__loading" role="status">
                  <span className="booking__spinner" aria-hidden="true" />
                  <span>Loading the calendar</span>
                </div>
              )}
              {mounted && (
                <iframe
                  title="Calendly booking calendar for a 30-minute call with Dy ann Razonado"
                  src={CALENDLY_EMBED}
                  onLoad={() => setLoaded(true)}
                  loading="lazy"
                />
              )}
            </>
          )}
        </div>

        <footer className="booking__foot">
          <span>Time zone shown in your local time.</span>
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
            Open in Calendly <ArrowUpRight size={13} />
          </a>
          <a className="booking__mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </footer>
      </div>
    </dialog>
  );
}
