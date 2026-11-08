import { useEffect, useRef, useState } from "react";

// Same glyph alphabet as the dark-mode code rain, so every "decode" effect
// on the page feels like it falls out of the same stream.
export const GLYPHS = "01{}[]()<>=+-*/&|^%$#@".split("");

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Fires once when the element first scrolls into view.
export function useInView(options = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return [ref, inView];
}

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
export function useKonami(onUnlock) {
  const cb = useRef(onUnlock);
  useEffect(() => { cb.current = onUnlock; }, [onUnlock]);
  useEffect(() => {
    let i = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === KONAMI[i] ? i + 1 : (k === KONAMI[0] ? 1 : 0);
      if (i === KONAMI.length) {
        i = 0;
        cb.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

// Pointer-follow spotlight: writes --mx/--my onto whichever .spotlight card is
// under the cursor. One delegated listener for the whole page.
export function useSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

// "2026-06" → "Jun 2026". `end` null → "Present". Adds a duration for closed
// ranges, e.g. "Jun 2026 – Nov 2026 · 6 mos", so nothing is hand-maintained.
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export function formatRange(start, end) {
  const fmt = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  };
  if (!end) return `${fmt(start)} – Present`;
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const dur = months >= 12
    ? `${Math.floor(months / 12)} yr${months >= 24 ? "s" : ""}${months % 12 ? ` ${months % 12} mos` : ""}`
    : `${months} mo${months === 1 ? "" : "s"}`;
  return `${fmt(start)} – ${fmt(end)} · ${dur}`;
}

// Live clock for a given IANA zone, ticking once a minute.
export function useZonedTime(timeZone) {
  const make = () =>
    new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone }).format(new Date());
  const [t, setT] = useState(make);
  useEffect(() => {
    const id = setInterval(() => setT(make()), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return t;
}
