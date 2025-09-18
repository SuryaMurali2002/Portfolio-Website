import { useEffect, useMemo, useRef, useState } from "react";

// --- Data: Projects / Experience / Skills ---

const PROJECTS = [
  {
    title: "HealthGPT (RAG)",
    blurb:
      "Healthcare Q&A using retrieval-augmented generation with MiniLM embeddings and safety rails.",
    tags: ["Python", "RAG", "Transformers", "Mistral-7B"],
    links: { code: "https://github.com/SuryaMurali2002/HealthGPT" },
  },
  {
    title: "Hybrid Recommender (MovieLens)",
    blurb:
      "Hybrid system combining TF-IDF with collaborative filtering, validated with Pearson correlation.",
    tags: ["Python", "TF-IDF", "scikit-learn"],
    links: { code: "https://github.com/SuryaMurali2002/Hybrid-Recommender-System" },
  },
  {
    title: "Cycle Shop Sales Analysis",
    blurb:
      "SQL + BI exploration of sales, riders, and revenue to surface KPIs and seasonal performance.",
    tags: ["SQL", "Power BI"],
    links: {},
  },
  {
    title: "Clash of Typers (Multiplayer Typing Game)",
    blurb:
      "TCP sockets with JSON protocols, concurrency control, and real-time WPM scoring for 4+ players.",
    tags: ["Python", "Sockets", "Pygame"],
    links: { code: "https://github.com/SuryaMurali2002/ClashOfTypers" },
  },
  {
    title: "Mom's Home (2D Adventure Game)",
    blurb:
      "Java game with AI pathfinding, collision detection, modular design, and JUnit/Jacoco testing.",
    tags: ["Java", "Swing/AWT", "JUnit"],
    links: {},
  },
];

const EXPERIENCE = [
  {
    role: "Associate VP, External and Community Affairs",
    org: "SFSS",
    time: "May 2025 – Present",
    bullets: [
      "Led advocacy campaigns on affordability, including proposals to expand OER by researching successful smaller-scale models like Kwantlen Polytechnic.",
      "Worked with student leaders across BC on joint actions, contributing to the Open Letter to BC Ferries for reduced student fares across SFU, UBC, and UVic.",
      "Collaborated on housing projects, supporting long-term solutions for students living off-campus.",
    ],
  },
  {
    role: "Undergraduate Senator",
    org: "SFU Senate",
    time: "May 2025 – Present",
    bullets: [
      "Shaped policy discussions around SFU’s new medical school, focusing on fair admissions and international student access.",
      "Held administrators accountable by raising student-focused questions on clarity and transparency in decision-making.",
      "Advocated for bursaries and accessibility programs, especially for part-time and international students.",
    ],
  },
  {
    role: "National Communications Coordinator",
    org: "RHA",
    time: "May 2025 – Present",
    bullets: [
      "Built partnerships with UBC’s RHA to foster joint programming and collaboration.",
      "Coordinated with PACURH schools (UC San Diego, UC Riverside, and others) to exchange best practices in residence life.",
      "Led communications and delegation preparation for SFU at major conferences (PACURH/NACURH).",
    ],
  },
  {
    role: "Food Security Volunteer",
    org: "SFSS Breakfast Program",
    time: "2024 – Present",
    bullets: [
      "Distributed meals and engaged directly with students facing affordability challenges.",
      "Created a welcoming environment that supports community and belonging on campus.",
    ],
  },
  {
    role: "Events & Student Affairs Committee Member",
    org: "SFSS",
    time: "2025 – Present",
    bullets: [
      "Planned inclusive campus events that reflect the diversity of SFU students.",
      "Collaborated across student groups to boost engagement and participation.",
    ],
  },
  {
    role: "Member, Senate Committee on University Priorities",
    org: "SFU",
    time: "2025 – Present",
    bullets: [
      "Advised on academic planning and budget allocation to align resources with student needs.",
      "Participated in discussions on institutional strategy, balancing teaching, research, and support priorities.",
    ],
  },
];

const SKILLS = [
  "Python","Pandas","PyTorch","scikit-learn","NLP","RAG",
  "React","Node.js","Tailwind","SQL","Docker","AWS",
];

// --- UI helpers ---
function Container({ children }) {
  return <div className="max-w-5xl mx-auto px-4 md:px-6">{children}</div>;
}
function Section({ id, title, children, accent }) {
  return (
    <section id={id} data-accent={accent} className="scroll-mt-24 py-16 md:py-24 will-change-transform">
      <Container>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-6">{children}</div>
      </Container>
    </section>
  );
}

function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium " +
    // slower + smoother + GPU
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
    link:
      "underline underline-offset-4 " +
      "hover:opacity-80 hover:-translate-y-[2px]",
  };

  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

// --- App ---
export default function App() {
  const EMAIL = "suryamurali2002@gmail.com";
  const LINKEDIN = "https://www.linkedin.com/in/surya-murali-5a32b9310/";

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")
  );

  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  const accents = useMemo(
    () => ({
      home: "var(--accent-1)",
      about: "var(--accent-1)",
      projects: "var(--accent-1)",
      experience: "var(--accent-2)",
      skills: "var(--accent-1)",
      contact: "var(--accent-2)",
    }),
    []
  );

  // Update active section + --accent based on scroll
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActive(id);
            const token = accents[id] || "var(--accent-1)";
            document.documentElement.style.setProperty("--accent", token);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [accents]);

  // One-time reveal animation for items with [data-reveal]
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("opacity-100", "translate-y-0");
            io.unobserve(ent.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Apply theme attr and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Dark mode code-rain background
  useEffect(() => {
    if (theme !== "dark") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    onResize();
    window.addEventListener("resize", onResize);

    const glyphs = "01{}[]()<>=+-*/&|^%$#@".split("");
    const columnWidth = 16;
    const fontSize = 14;

    const initDrops = () => {
      const columns = Math.ceil(canvas.width / columnWidth);
      return Array.from({ length: columns }, () => Math.floor(Math.random() * (canvas.height / fontSize)));
    };
    let drops = initDrops();

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.fillStyle = "rgba(150, 200, 255, 0.9)";
      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[(Math.random() * glyphs.length) | 0];
        const x = i * columnWidth;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0; else drops[i]++;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const resetDrops = () => {
      drops = initDrops();
    };
    window.addEventListener("resize", resetDrops);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", resetDrops);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [theme]);

  const NavLink = ({ href, id, children }) => (
    <a
      href={href}
      className={`relative py-1 transition ${
        active === id ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"
      }`}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute inset-x-0 -bottom-1 h-[2px] rounded-full
                    transition-all duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)]
                    ${active === id ? "bg-[var(--accent)] opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />
    </a>
  );

  return (
    <div className="min-h-screen">
      <div aria-hidden className="gradient-bg" />
      <div aria-hidden className="grain-bg" />
      {theme === "dark" && <canvas ref={canvasRef} className="code-rain" />}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-[var(--navbar)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--navbar)]/60 border-[var(--border)]">
        <Container>
          <div className="h-14 flex items-center justify-between">
            <a href="#home" className="font-semibold">Surya Murali</a>

            <nav className="hidden md:flex items-center gap-6 text-sm group">
              <NavLink href="#about" id="about">About</NavLink>
              <NavLink href="#projects" id="projects">Projects</NavLink>
              <NavLink href="#experience" id="experience">Experience</NavLink>
              <NavLink href="#skills" id="skills">Skills</NavLink>
              <NavLink href="#contact" id="contact">Contact</NavLink>
              <a href="#home" className="underline hover:text-[var(--accent)]">Top</a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                aria-label="Toggle menu"
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
              <button
                className="hidden md:inline-flex h-9 px-3 items-center justify-center rounded-lg border text-sm transition-colors hover:bg-gray-100"
                aria-label="Toggle theme"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden pb-4">
              <div className="grid gap-2 text-sm">
                {["about","projects","experience","skills","contact"].map((id) => (
                  <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="py-2 hover:text-[var(--accent)]">
                    {id[0].toUpperCase()+id.slice(1)}
                  </a>
                ))}
                <a href="#home" onClick={() => setOpen(false)} className="py-2 underline">
                  Top
                </a>
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Hero */}
      <section id="home" data-accent="var(--accent-1)" className="pt-16 md:pt-24">
        <Container>
          <div className="text-center" data-reveal>
            <h1 className="text-5xl font-bold tracking-tight">Surya Murali</h1>
            <p className="mt-4 text-xl text-[color:var(--muted)]">
              Data Science • Machine Learning • Full-stack
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Button href="#projects">View Projects</Button>
              <Button variant="outline" href={`mailto:${EMAIL}`}>Contact Me</Button>
              <Button variant="outline" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* About */}
      <Section id="about" title="About Me" accent="var(--accent-1)">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 aspect-square" data-reveal>
            <img
              src="/profile.png"
              alt="Surya Murali"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width="640"
              height="640"
              className="rounded-2xl border object-cover w-full h-full shadow-sm ring-1 ring-black/5"
            />
          </div>
          <div className="md:col-span-2 space-y-4 text-[var(--fg)] leading-7" data-reveal>
            <p>Hi, I’m Surya 👋🏽 I was born and raised in New Delhi, India, in a Tamil family, and now I live in Vancouver, Canada while studying Computer Science at SFU.</p>
            <p>I love playing fingerstyle guitar, working out at the gym, and annoying my friends with weird jokes. Music is a big part of me, I’m always listening to alternative rock, indie, and whatever random bands I find.</p>
            <p>Lately I’ve been getting into learning Japanese, and one of my dreams is to travel Japan and someday speak the language fluently. That dream isn’t the strongest right now because between school, co-curriculars, and lazy phases I tend to drop the ball, but it’s still there.</p>
            <p>On the tech side, I’m into data science working with machine learning and analytics-and I’ve been dipping my toes into web development to bring some of my ideas to life.</p>
            <p>At the end of the day, I just enjoy building things, playing music, and finding ways to laugh a little louder.</p>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Projects" accent="var(--accent-1)">
        <div className="grid md:grid-cols-2 gap-5">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group rounded-2xl border p-5 bg-[var(--surface)] text-[var(--fg)] border-[var(--border)]
                         hover:shadow-md translate-y-0 hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]
                         transition-transform transition-shadow transition-colors duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] transform-gpu
                         motion-reduce:transform-none motion-reduce:transition-none
                         ring-1 ring-transparent hover:ring-[var(--accent)]/20"
              data-reveal
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{p.blurb}</p>
                </div>
                <div className="shrink-0 flex gap-3">
                  {p.links?.code && (
                    <Button variant="link" href={p.links.code} target="_blank" rel="noreferrer" className="text-sm">
                      Code
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="px-2 py-1 text-xs rounded-full border bg-[var(--surface)] border-[var(--border)] group-hover:bg-[var(--surface-hover)]">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience" accent="var(--accent-2)">
        <div className="space-y-4">
          {EXPERIENCE.map((e) => (
            <article
              key={e.role}
              className="rounded-2xl border p-4 bg-[var(--surface)] text-[var(--fg)] border-[var(--border)]
                         hover:shadow-md translate-y-0 hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]
                         transition-transform transition-shadow transition-colors duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] transform-gpu
                         motion-reduce:transform-none motion-reduce:transition-none
                         ring-1 ring-transparent hover:ring-[var(--accent)]/20"
              data-reveal
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {e.role} · <span className="text-[color:var(--muted)]">{e.org}</span>
                </h3>
                <span className="text-sm text-[color:var(--muted)]">{e.time}</span>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-[color:var(--muted)] space-y-1">
                {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills" accent="var(--accent-1)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SKILLS.map((s) => (
            <div
              key={s}
              className="rounded-xl border px-3 py-2 text-sm text-center bg-[var(--surface)] text-[var(--fg)] border-[var(--border)]
                         hover:bg-[var(--surface-hover)] translate-y-0 hover:-translate-y-0.5
                         transition-transform transition-colors duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] transform-gpu
                         motion-reduce:transform-none motion-reduce:transition-none"
              data-reveal
            >
              {s}
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact" accent="var(--accent-2)">
        <div
          className="rounded-2xl border p-6 space-y-3 text-[var(--fg)] bg-[var(--surface)] border-[var(--border)]
                     hover:shadow-md translate-y-0 hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]
                     transition-transform transition-shadow transition-colors duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] transform-gpu
                     motion-reduce:transform-none motion-reduce:transition-none
                     ring-1 ring-transparent hover:ring-[var(--accent)]/20"
          data-reveal
        >
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" href={`mailto:${EMAIL}`}>Email Me</Button>
            <Button variant="outline" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</Button>
          </div>
        </div>
      </Section>

      <footer className="py-16 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Surya Murali. Built with React & Tailwind v4.
      </footer>
    </div>
  );
}
