// Content sourced from Surya's resume (Nov 2026).

export const EMAIL = "suryamurali2002@gmail.com";
export const SFU_EMAIL = "sma284@sfu.ca";
export const LINKEDIN = "https://www.linkedin.com/in/surya-murali-5a32b9310/";
export const GITHUB = "https://github.com/SuryaMurali2002";

export const ROLES = [
  "AI Implementation",
  "ML Research",
  "Full-stack Builder",
  "Automation Engineer",
];

export const NOW = "Leading PhishForge, a capstone benchmark for AI phishing detectors";

// Impact numbers shown in the hero strip (count-up animated).
export const STATS = [
  { value: 389, suffix: "", label: "pytest tests shipped at Glencore co-op" },
  { value: 85, suffix: "%", label: "less ASN prep time (2h → ~15–20 min)" },
  { value: 425, suffix: "", label: "synthetic phishing pages generated" },
  { value: 16400, suffix: "+", label: "medical records indexed for RAG" },
];

export const WORK = [
  {
    role: "AI Implementation Intern",
    team: "Operations Software & Automation",
    org: "Access World Canada (Glencore)",
    where: "Toronto, ON · Co-op",
    time: "Jun 2026 – Nov 2026",
    bullets: [
      "Built a Python tool (pandas, openpyxl, Streamlit) that turns customer shipment workbooks into Oracle Fusion Advance Shipment Notice upload files, cutting prep from about 2 hours to 15–20 minutes including review; output passed Oracle upload validation on a live shipment.",
      "Designed validation for fields Oracle accepts silently but that block goods receipt downstream, with plain-language fix guidance for non-technical staff; wrote 389 pytest tests plus a Playwright end-to-end suite that caught two defects unit tests had missed.",
      "Shipped a zero-install Windows package on signed embedded Python with an allowlisted file set, hash-pinned dependencies, verified loopback-only networking, and an automated scan blocking confidential identifiers.",
      "Delivered a formula-only Excel carrier capability master (lane search, data-quality checks, 1,000-carrier capacity) generated from a YAML schema with 16 tests, built for hand-off to non-technical owners.",
      "Triaged 35 proposed AI use cases and ran repeated-trial evaluations on 18, documenting run-to-run output variance for the company's AI governance review.",
    ],
    tags: ["Python", "pandas", "Streamlit", "Oracle Fusion", "pytest", "Playwright"],
  },
];

export const RESEARCH = {
  title: "PhishForge: Blind-Spot Benchmark for AI Phishing Detectors",
  context: "CMPT 495 capstone · faculty-supervised · SFU",
  time: "Jan 2026 – Present",
  bullets: [
    "Lead the generation pipeline, attack vectors, analysis and write-up for a benchmark that synthesizes phishing pages each denying one evidence class, then profiles where AI detectors fail.",
    "Generated a 425-sample corpus across 12 sectors, 5 locales, 8 scenarios and 15 brands with a local code LLM served by Ollama, behind a circularity firewall separating the generator from the detector under test.",
    "Showed an agentic detector defaulted to benign whenever no brand was identified: 6.3% recall on brand-less pages vs 98.5% on branded, traced to a single routing rule; all five screenshot detectors in the harness proved brand-anchored.",
    "Built four evidence-denial vectors (deferred rendering, brand-cue perturbation, obfuscated submission target, off-origin POST) with build-time verification gates; reported a confirmed negative result and fixed a silent 2,048-token context truncation in the generator.",
  ],
  tags: ["Python", "Ollama", "ChromaDB", "LLM eval", "Security"],
  // Headline comparison rendered as animated bars.
  recall: [
    { label: "Branded pages", value: 98.5 },
    { label: "Brand-less pages", value: 6.3 },
  ],
};

export const PROJECTS = [
  {
    title: "SFU C2C: AI Course & Internship Planner",
    badge: "🏆 People's Choice · XHacks",
    blurb:
      "Full-stack advising platform built in 24 hours (team of 4) that parses uploaded transcripts into role-targeted course roadmaps. Hybrid regex + LLM-fallback parser with parallel calls to the SFU Courses API and a cached internship dataset.",
    tags: ["Next.js 14", "TypeScript", "OpenAI API", "Tailwind"],
    links: { code: "https://github.com/SuryaMurali2002/Xhack_hackathon" },
  },
  {
    title: "SFSS Gondola Petition Website",
    badge: "26,000-student campaign",
    blurb:
      "Petition site on a custom domain for a transit advocacy campaign, with Supabase PostgreSQL for signature management and a responsive, SEO-tuned front end.",
    tags: ["React", "TypeScript", "Supabase", "Tailwind"],
    links: {
      code: "https://github.com/SuryaMurali2002/SFSS-Gondola-Website-",
      live: "https://sfss-gondola-website.vercel.app",
    },
  },
  {
    title: "Kaeru: AI Financial Concierge",
    badge: "StormHacks 2025",
    blurb:
      "Voice-driven assistant built in 24 hours (team of 4) that cancels subscriptions by phone via VAPI and Twilio on a serverless AWS backend; fraud detection with Bedrock and Step Functions hit 80–90% success in controlled tests.",
    tags: ["AWS Lambda", "Cognito", "DynamoDB", "Step Functions", "Twilio"],
    links: {},
  },
  {
    title: "HealthGPT: Retrieval-Augmented Chatbot",
    badge: "−75% GPU memory",
    blurb:
      "RAG pipeline over 16,400+ curated MedQuAD records with cosine-similarity search and multi-turn context chaining; quantized Mistral-7B for offline inference.",
    tags: ["Python", "Transformers", "Mistral-7B", "MiniLM"],
    links: { code: "https://github.com/SuryaMurali2002/HealthGPT" },
  },
];

export const MORE_PROJECTS = [
  {
    title: "Hybrid Recommender (MovieLens)",
    tags: ["Python", "TF-IDF", "scikit-learn"],
    href: "https://github.com/SuryaMurali2002/Hybrid-Recommender-System",
  },
  {
    title: "Clash of Typers (multiplayer typing game)",
    tags: ["Python", "Sockets", "Pygame"],
    href: "https://github.com/SuryaMurali2002/ClashOfTypers",
  },
  { title: "Mom's Home (2D adventure game)", tags: ["Java", "JUnit"] },
  { title: "Cycle Shop Sales Analysis", tags: ["SQL", "Power BI"] },
];

export const LEADERSHIP = [
  {
    role: "Associate VP, External and Community Affairs",
    org: "Simon Fraser Student Society",
    time: "May 2025 – Present",
    bullets: [
      "Led affordability advocacy, including proposals to expand Open Educational Resources modelled on smaller-scale successes like Kwantlen Polytechnic.",
      "Worked with student leaders across BC on joint actions, including the Open Letter to BC Ferries for reduced student fares across SFU, UBC, and UVic.",
    ],
  },
  {
    role: "Undergraduate Senator",
    org: "SFU Senate",
    time: "May 2025 – Present",
    bullets: [
      "Shaped policy discussion around SFU's new medical school, focusing on fair admissions and international student access.",
      "Member of the Senate Committee on University Priorities, advising on academic planning and budget allocation.",
    ],
  },
  {
    role: "National Communications Coordinator",
    org: "Residence Hall Association",
    time: "May 2025 – Present",
    bullets: [
      "Built partnerships with UBC's RHA and PACURH schools to exchange residence-life best practices.",
      "Led communications and delegation prep for SFU at PACURH/NACURH conferences.",
    ],
  },
];

export const SKILLS = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "HTML", "CSS"] },
  { group: "Frameworks & Web", items: ["React", "Next.js", "FastAPI", "Streamlit", "Spring Boot", "Node.js", "Tailwind CSS", "REST APIs"] },
  { group: "Data & ML", items: ["pandas", "NumPy", "openpyxl", "scikit-learn", "PyTorch", "Hugging Face", "Ollama", "LangGraph", "Power BI"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "ChromaDB", "DynamoDB", "Supabase"] },
  { group: "Cloud (AWS)", items: ["Lambda", "API Gateway", "Cognito", "S3", "Step Functions", "Bedrock"] },
  { group: "Testing & Delivery", items: ["pytest", "Playwright", "JUnit", "Git", "GitHub Actions", "Linux"] },
];
