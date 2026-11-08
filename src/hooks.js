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
