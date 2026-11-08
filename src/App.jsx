import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EMAIL, SFU_EMAIL, LINKEDIN, GITHUB, ROLES, NOW, STATS,
  WORK, RESEARCH, PROJECTS, MORE_PROJECTS, LEADERSHIP, SKILLS,
} from "./data.js";
import { useKonami, useSpotlight, prefersReducedMotion } from "./hooks.js";
import {
  CodeRain, CommandPalette, CountUp, RecallBars, RotatingRoles,
  ScrollProgress, SectionHeading, Toast,
} from "./effects.jsx";

// --- UI helpers ---
function Container({ children }) {
  return <div className="max-w-5xl mx-auto px-4 md:px-6">{children}</div>;
}

function Section({ id, index, title, accent, children }) {
  return (
    <section id={id} data-accent={accent} className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <SectionHeading index={index} title={title} />
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}

function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer " +
    "transition-transform transition-colors transition-shadow duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] transform-gpu translate-y-0 " +
    "motion-reduce:transform-none motion-reduce:transition-none " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30";

  const variants = {
    primary:
      "bg-[var(--accent)] text-white px-4 py-2 shadow-sm " +
      "hover:brightness-110 hover:-translate-y-[2px] hover:shadow-md active:scale-[.98] active:translate-y-[1px]",
    outline:
      "border px-4 py-2 shadow-sm bg-[var(--surface)] text-[var(--fg)] border-[var(--border)] " +
      "hover:bg-[var(--surface-hover)] hover:-translate-y-[2px] hover:shadow-md active:scale-[.98] active:translate-y-[1px]",
    link: "underline underline-offset-4 hover:text-[var(--accent)] hover:-translate-y-[2px]",
  };

  const Tag = props.href ? "a" : "button";
  return <Tag className={`${base} ${variants[variant]} ${className}`} {...(Tag === "button" ? { type: "button" } : {})} {...props} />;
}

const CARD =
  "spotlight relative rounded-2xl border bg-[var(--surface)] text-[var(--fg)] border-[var(--border)] " +
  "hover:shadow-md translate-y-0 hover:-translate-y-0.5 " +
  "transition-transform transition-shadow transition-colors duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] transform-gpu " +
  "motion-reduce:transform-none motion-reduce:transition-none " +
  "ring-1 ring-transparent hover:ring-[var(--accent)]/20";

function Tags({ items }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="px-2 py-1 text-xs rounded-full border bg-[var(--surface)] border-[var(--border)] font-mono">
          {t}
        </span>
      ))}
    </div>
  );
}

const SECTIONS = [
  { id: "about", label: "About", accent: "var(--accent-1)" },
  { id: "experience", label: "Experience", accent: "var(--accent-2)" },
  { id: "research", label: "Research", accent: "var(--accent-1)" },
  { id: "projects", label: "Projects", accent: "var(--accent-2)" },
  { id: "leadership", label: "Leadership", accent: "var(--accent-1)" },
  { id: "skills", label: "Skills", accent: "var(--accent-2)" },
  { id: "contact", label: "Contact", accent: "var(--accent-1)" },
];

// --- App ---
export default function App() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [rainMode, setRainMode] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(0);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
    } catch { /* storage blocked */ }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const toggleRain = useCallback(() => {
    if (prefersReducedMotion()) {
      showToast("Code rain is off because your system prefers reduced motion.");
      return;
    }
    showToast(rainMode ? "rain.stop()" : "rain.start({ mode: 'downpour' })");
    setRainMode(!rainMode);
  }, [rainMode, showToast]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast(`Copied ${EMAIL}`);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }, [showToast]);

  useKonami(toggleRain);
  useSpotlight();

  // Hello, fellow dev-tools opener.
  useEffect(() => {
    console.log(
      "%c> hi, I'm Surya.%c\nPress Ctrl/⌘+K for the command palette, or try the Konami code. ↑↑↓↓←→←→BA",
      "font: 600 14px ui-monospace, monospace; color: #6aa9f0",
      "font: 12px ui-monospace, monospace"
    );
  }, []);

  // Command palette shortcut
  useEffect(() => {
    const onKey = (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });

  const commands = useMemo(
    () => [
      { label: "Home", group: "Go to", action: () => go("home") },
      ...SECTIONS.map((s) => ({ label: s.label, group: "Go to", action: () => go(s.id) })),
      { label: "Toggle dark / light theme", group: "Action", keywords: "mode", action: toggleTheme },
      { label: "Toggle code rain", group: "Easter egg", keywords: "matrix rain konami", action: toggleRain },
      { label: "Copy email address", group: "Action", keywords: "contact mail", action: copyEmail },
      { label: "Open GitHub", group: "Link", action: () => window.open(GITHUB, "_blank", "noopener") },
      { label: "Open LinkedIn", group: "Link", action: () => window.open(LINKEDIN, "_blank", "noopener") },
    ],
    [toggleTheme, toggleRain, copyEmail]
  );

  // Update active section + --accent based on scroll
  useEffect(() => {
    const accentFor = Object.fromEntries(SECTIONS.map((s) => [s.id, s.accent]));
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActive(id);
            document.documentElement.style.setProperty("--accent", accentFor[id] || "var(--accent-1)");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Staggered reveal for items with [data-reveal]
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("revealed");
            io.unobserve(ent.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Timeline line grows as you scroll through Experience + Research
  const timelineRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = timelineRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      el.style.setProperty("--progress", p);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Apply theme attr and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* storage blocked */ }
  }, [theme]);

  const NavLink = ({ id, children }) => (
    <a href={`#${id}`} className={`relative py-1 transition ${active === id ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`}>
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute inset-x-0 -bottom-1 h-[2px] rounded-full transition-all duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)]
                    ${active === id ? "bg-[var(--accent)] opacity-100" : "opacity-0"}`}
      />
    </a>
  );

  const showRain = theme === "dark" || rainMode;

  return (
    <div className="min-h-screen">
      <div aria-hidden className="gradient-bg" />
      <div aria-hidden className="grain-bg" />
      {showRain && <CodeRain intense={rainMode} />}
      <ScrollProgress />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-[var(--navbar)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--navbar)]/60 border-[var(--border)]">
        <Container>
          <div className="h-14 flex items-center justify-between">
            <a href="#home" className="font-semibold font-mono">
              <span className="text-[var(--accent)]">~/</span>surya
            </a>

            <nav className="hidden md:flex items-center gap-5 text-sm">
              {SECTIONS.map((s) => <NavLink key={s.id} id={s.id}>{s.label}</NavLink>)}
            </nav>

            <div className="flex items-center gap-2">
              <button
                className="hidden md:inline-flex h-9 px-2.5 items-center gap-1.5 justify-center rounded-lg border border-[var(--border)] text-xs font-mono text-[color:var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)]"
                aria-label="Open command palette"
                onClick={() => setPaletteOpen(true)}
              >
                <kbd className="kbd">{isMac ? "⌘" : "Ctrl"}</kbd><kbd className="kbd">K</kbd>
              </button>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)]"
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
                )}
              </button>
              <button
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  {open ? (
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden pb-4">
              <div className="grid gap-2 text-sm">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)} className="py-2 hover:text-[var(--accent)]">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Container>
      </header>

      <main>
        {/* Hero */}
        <section id="home" data-accent="var(--accent-1)" className="pt-20 md:pt-28 pb-8">
          <Container>
            <div className="text-center" data-reveal>
              <a
                href="#research"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-1 text-xs text-[color:var(--muted)] hover:text-[var(--fg)]"
              >
                <span className="pulse-dot" aria-hidden />
                <span className="font-mono">now:</span> {NOW}
              </a>
              <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight">
                <span className="name-shine">Surya Murali</span>
              </h1>
              <p className="mt-4 text-xl md:text-2xl h-8">
                <RotatingRoles roles={ROLES} />
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-[color:var(--muted)] leading-7">
                Computer Science student at SFU (Statistics minor, 2027). I build AI tools that hold up in real operations,
                and research where AI systems quietly fail.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Button href="#experience">See my work</Button>
                <Button variant="outline" href={`mailto:${EMAIL}`}>Contact me</Button>
                <Button variant="outline" href={GITHUB} target="_blank" rel="noreferrer">GitHub</Button>
              </div>
              <p className="mt-4 text-xs font-mono text-[color:var(--muted)] hidden md:block">
                tip: press <kbd className="kbd">/</kbd> to navigate like a terminal
              </p>
            </div>

            {/* Impact stats */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
              {STATS.map((s, i) => (
                <div key={s.label} className={`${CARD} p-4 text-left`} data-reveal style={{ "--d": `${i * 90}ms` }}>
                  <div className="text-2xl md:text-3xl font-semibold text-[var(--accent)]">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--muted)] leading-5">{s.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* About */}
        <Section id="about" index={1} title="About Me" accent="var(--accent-1)">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 aspect-square profile-frame" data-reveal>
              <img
                src="/profile.png"
                alt="Surya Murali"
                loading="lazy"
                decoding="async"
                width="640"
                height="640"
                className="rounded-2xl border border-[var(--border)] object-cover w-full h-full shadow-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-4 text-[var(--fg)] leading-7" data-reveal style={{ "--d": "120ms" }}>
              <p>Hi, I’m Surya 👋🏽 I was born and raised in New Delhi, India, in a Tamil family, and now I live in Vancouver, Canada while studying Computer Science (with a Statistics minor) at SFU.</p>
              <p>On the tech side, I just wrapped a co-op as an AI Implementation Intern at Access World (Glencore), turning messy shipment spreadsheets into validated Oracle uploads. I’m also leading PhishForge, a capstone research project that stress-tests AI phishing detectors to find their blind spots.</p>
              <p>Outside of code I’m in student government, as an SFSS Associate VP and an SFU Senator, because I like fixing things for people, not just for computers.</p>
              <p>I love playing fingerstyle guitar, working out at the gym, and annoying my friends with weird jokes. Music is a big part of me: alternative rock, indie, and whatever random bands I find. Lately I’ve been learning Japanese, and one day I want to travel Japan and speak it fluently.</p>
              <p>At the end of the day, I just enjoy building things, playing music, and finding ways to laugh a little louder.</p>
            </div>
          </div>
        </Section>

        <div ref={timelineRef} className="timeline-wrap">
          {/* Experience */}
          <Section id="experience" index={2} title="Experience" accent="var(--accent-2)">
            <div className="relative">
              <div aria-hidden className="timeline" />
              {WORK.map((w) => (
                <div key={w.role} className="relative pl-8 md:pl-12" data-reveal>
                  <span aria-hidden className="timeline-dot" />
                  <article className={`${CARD} p-5 md:p-6`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-lg">
                        {w.role} <span className="text-[color:var(--muted)] font-normal">· {w.team}</span>
                      </h3>
                      <span className="text-sm font-mono text-[color:var(--muted)]">{w.time}</span>
                    </div>
                    <p className="mt-1 text-sm">
                      <span className="text-[var(--accent)] font-medium">{w.org}</span>
                      <span className="text-[color:var(--muted)]"> · {w.where}</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)] leading-6">
                      {w.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2"><span className="font-mono text-[var(--accent)]">▹</span><span>{b}</span></li>
                      ))}
                    </ul>
                    <Tags items={w.tags} />
                  </article>
                </div>
              ))}
            </div>
          </Section>

          {/* Research */}
          <Section id="research" index={3} title="Research" accent="var(--accent-1)">
            <div className="relative">
              <div aria-hidden className="timeline" />
              <div className="relative pl-8 md:pl-12" data-reveal>
                <span aria-hidden className="timeline-dot" />
                <article className={`${CARD} p-5 md:p-6`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-lg">{RESEARCH.title}</h3>
                    <span className="text-sm font-mono text-[color:var(--muted)]">{RESEARCH.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">{RESEARCH.context}</p>
                  <div className="mt-4 grid md:grid-cols-5 gap-6">
                    <ul className="md:col-span-3 space-y-2 text-sm text-[color:var(--muted)] leading-6">
                      {RESEARCH.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2"><span className="font-mono text-[var(--accent)]">▹</span><span>{b}</span></li>
                      ))}
                    </ul>
                    <div className="md:col-span-2 rounded-xl border border-[var(--border)] p-4 self-start bg-[var(--bg)]/40">
                      <p className="text-xs font-mono text-[var(--accent)] mb-3">// key finding</p>
                      <RecallBars data={RESEARCH.recall} />
                    </div>
                  </div>
                  <Tags items={RESEARCH.tags} />
                </article>
              </div>
            </div>
          </Section>
        </div>

        {/* Projects */}
        <Section id="projects" index={4} title="Projects" accent="var(--accent-2)">
          <div className="grid md:grid-cols-2 gap-5">
            {PROJECTS.map((p, i) => (
              <article key={p.title} className={`${CARD} group p-5 flex flex-col`} data-reveal style={{ "--d": `${(i % 2) * 120}ms` }}>
                <span className="self-start text-[11px] font-mono px-2 py-0.5 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]">
                  {p.badge}
                </span>
                <h3 className="mt-3 font-semibold text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)] leading-6 flex-1">{p.blurb}</p>
                <Tags items={p.tags} />
                {(p.links.code || p.links.live) && (
                  <div className="mt-4 flex gap-4 text-sm">
                    {p.links.code && <Button variant="link" href={p.links.code} target="_blank" rel="noreferrer">Code ↗</Button>}
                    {p.links.live && <Button variant="link" href={p.links.live} target="_blank" rel="noreferrer">Live ↗</Button>}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10" data-reveal>
            <p className="text-sm font-mono text-[color:var(--muted)]">$ ls ./more-builds</p>
            <ul className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {MORE_PROJECTS.map((m) => (
                <li key={m.title} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  {m.href ? (
                    <a href={m.href} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">{m.title} ↗</a>
                  ) : (
                    <span>{m.title}</span>
                  )}
                  <span className="text-xs font-mono text-[color:var(--muted)]">{m.tags.join(" · ")}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Leadership */}
        <Section id="leadership" index={5} title="Leadership" accent="var(--accent-1)">
          <div className="grid md:grid-cols-3 gap-4">
            {LEADERSHIP.map((e, i) => (
              <article key={e.role} className={`${CARD} p-5`} data-reveal style={{ "--d": `${i * 100}ms` }}>
                <p className="text-xs font-mono text-[color:var(--muted)]">{e.time}</p>
                <h3 className="mt-2 font-semibold leading-snug">{e.role}</h3>
                <p className="text-sm text-[var(--accent)]">{e.org}</p>
                <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)] leading-6">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section id="skills" index={6} title="Skills" accent="var(--accent-2)">
          <div className="grid md:grid-cols-2 gap-4">
            {SKILLS.map((g, i) => (
              <div key={g.group} className={`${CARD} p-5`} data-reveal style={{ "--d": `${(i % 2) * 100}ms` }}>
                <h3 className="text-sm font-mono text-[var(--accent)]">{g.group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="skill-chip px-2.5 py-1 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" index={7} title="Contact" accent="var(--accent-1)">
          <div className={`${CARD} p-6 md:p-8`} data-reveal>
            <p className="text-lg">Want to talk about AI tooling, research, or a role? My inbox is open.</p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Or reach me at my SFU address: <a className="underline hover:text-[var(--accent)]" href={`mailto:${SFU_EMAIL}`}>{SFU_EMAIL}</a>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`mailto:${EMAIL}`}>Email me</Button>
              <Button variant="outline" onClick={copyEmail}>Copy email</Button>
              <Button variant="outline" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</Button>
              <Button variant="outline" href={GITHUB} target="_blank" rel="noreferrer">GitHub</Button>
            </div>
          </div>
        </Section>
      </main>

      <footer className="py-16 text-center text-sm text-[color:var(--muted)]">
        <p>© {new Date().getFullYear()} Surya Murali. Built with React & Tailwind v4.</p>
        <p className="mt-2 font-mono text-xs opacity-70">psst… ↑ ↑ ↓ ↓ ← → ← → B A</p>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <Toast message={toast} />
    </div>
  );
}
