import { useEffect, useMemo, useRef, useState } from "react";
import { GLYPHS, prefersReducedMotion, useInView } from "./hooks.js";

/* ------------------------------------------------------------------ */
/* Text scramble: characters cycle through code-rain glyphs, then lock  */
/* in left-to-right on a staggered timer.                               */
/* ------------------------------------------------------------------ */
export function ScrambleText({ text, start = true, speed = 28, className = "" }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!start || prefersReducedMotion()) {
      setOut(text);
      return;
    }
    let frame = 0;
    const lockAt = [...text].map((_, i) => i * 1.6 + 6 + Math.random() * 4);
    const id = setInterval(() => {
      frame++;
      let done = true;
      const next = [...text]
        .map((ch, i) => {
          if (ch === " " || frame >= lockAt[i]) return ch;
          done = false;
          return GLYPHS[(Math.random() * GLYPHS.length) | 0];
        })
        .join("");
      setOut(next);
      if (done) clearInterval(id);
    }, speed);
    const finish = () => { clearInterval(id); setOut(text); };
    window.addEventListener("beforeprint", finish);
    return () => { clearInterval(id); window.removeEventListener("beforeprint", finish); };
  }, [text, start, speed]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

export function RotatingRoles({ roles, interval = 3200 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), interval);
    return () => clearInterval(id);
  }, [roles.length, interval]);
  return (
    <span className="font-mono text-[var(--accent)]">
      <ScrambleText text={roles[i]} />
      <span className="caret" aria-hidden>_</span>
    </span>
  );
}

/* Section heading: mono index + title that decodes the first time it is seen. */
export function SectionHeading({ index, title }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  return (
    <h2 ref={ref} className="text-2xl md:text-3xl font-semibold tracking-tight flex items-baseline gap-3">
      <span className="font-mono text-base text-[var(--accent)]">{String(index).padStart(2, "0")}.</span>
      <ScrambleText text={title} start={inView} />
      <span aria-hidden className="hidden sm:block flex-1 h-px bg-[var(--border)] self-center ml-2" />
    </h2>
  );
}

// While printing, every animated number snaps to its final value.
let printing = false;
if (typeof window !== "undefined") {
  window.addEventListener("beforeprint", () => { printing = true; });
  window.addEventListener("afterprint", () => { printing = false; });
}

/* ------------------------------------------------------------------ */
/* Count-up number, eased, starts when visible.                         */
/* ------------------------------------------------------------------ */
export function CountUp({ value, suffix = "", decimals = 0, duration = 1600 }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    const finish = () => setN(value);
    window.addEventListener("beforeprint", finish);
    return () => window.removeEventListener("beforeprint", finish);
  }, [value]);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setN(value);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = printing ? 1 : Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* Animated horizontal bars (PhishForge recall finding). */
export function RecallBars({ data }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  return (
    <div ref={ref} className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs font-mono text-[color:var(--muted)]">
            <span>{d.label}</span>
            <span className="text-[var(--fg)]"><CountUp value={d.value} decimals={1} suffix="%" duration={1400} /></span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-[var(--surface-hover)] overflow-hidden">
            <div
              className="bar h-full rounded-full bg-[var(--accent)]"
              style={{ width: inView ? `${d.value}%` : "0%", "--w": `${d.value}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-[color:var(--muted)]">Detector recall, %. One routing rule explained the gap.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thin accent bar showing page scroll progress.                        */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div aria-hidden ref={ref} className="scroll-progress" />;
}

/* ------------------------------------------------------------------ */
/* Code rain. On by default in dark mode; the Konami code turns it on   */
/* in light mode too. Glyph colour follows the current section accent.  */
/* ------------------------------------------------------------------ */
export function CodeRain({ intense = false }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let frame = 0;
    let color = "rgba(150, 200, 255, 0.9)";

    const columnWidth = 16;
    const fontSize = 14;
    let drops = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.ceil(canvas.width / columnWidth) }, () =>
        Math.floor(Math.random() * (canvas.height / fontSize))
      );
    };
    resize();
    window.addEventListener("resize", resize);

    const readAccent = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      color = isDark && !intense ? "rgba(150, 200, 255, 0.9)" : accent || color;
    };
    readAccent();

    const draw = () => {
      frame++;
      if (frame % 30 === 0) readAccent();
      // Fade previous glyphs to transparent so the canvas works on light and dark.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.fillStyle = color;
      for (let i = 0; i < drops.length; i++) {
        const text = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const y = drops[i] * fontSize;
        ctx.fillText(text, i * columnWidth, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [intense]);
  return <canvas ref={canvasRef} aria-hidden className={`code-rain ${intense ? "code-rain--intense" : ""}`} />;
}

/* ------------------------------------------------------------------ */
/* Toast                                                                */
/* ------------------------------------------------------------------ */
export function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast font-mono text-sm ${message ? "toast--show" : ""}`}
    >
      {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Command palette (Ctrl/⌘ + K, or "/").                                */
/* ------------------------------------------------------------------ */
export function CommandPalette({ open, onClose, commands }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => (c.label + " " + (c.group || "") + " " + (c.keywords || "")).toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  const run = (cmd) => {
    if (!cmd) return;
    onClose();
    cmd.action();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((v) => Math.min(v + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((v) => Math.max(v - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(results[sel]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm palette-fade" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden palette-pop text-left"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 border-b border-[var(--border)]">
          <span className="font-mono text-[var(--accent)]">&gt;</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, open a link, toggle theme…"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[color:var(--muted)]"
            aria-label="Search commands"
          />
          <kbd className="kbd">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-auto py-2" role="listbox">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-[color:var(--muted)] font-mono">no matches. try "rain" 👀</li>
          )}
          {results.map((c, i) => (
            <li
              key={c.label}
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              onClick={() => run(c)}
              className={`mx-2 px-3 py-2 rounded-lg text-sm flex items-center justify-between cursor-pointer ${
                i === sel ? "bg-[var(--surface-hover)] text-[var(--accent)]" : ""
              }`}
            >
              <span>{c.label}</span>
              <span className="text-xs font-mono text-[color:var(--muted)]">{c.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
