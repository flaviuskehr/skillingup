import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle2, X } from "lucide-react";
import { de, en } from "./i18n.js";
import "./App.css";

/* ─── SVG icons ──────────────────────────────────────────── */
const LinkedinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ─── Analytics ──────────────────────────────────────────── */
const track = (event, data = {}) => {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(event, data);
  }
};

/* ─── Static data ─────────────────────────────────────────── */
const TEAM = [
  {
    initials: "CK",
    name: "Carolin Kehr",
    role: "Co-Founderin · HR & Psychologie",
    tagline: `„Ich habe 10 Jahre erlebt, wie Menschen in beruflichen Übergängen allein gelassen werden. Das wollte ich ändern."`,
    bio: "Carolin ist HR-Führungskraft mit über einem Jahrzehnt Erfahrung bei Bosch, Covestro und Bayer – lokal und global. Sie hat Talentprogramme entwickelt, Transformationen begleitet und Hunderte von Menschen durch Karrierewechsel geführt. Für skillingup bringt sie das, was kein Algorithmus ersetzen kann: das Verständnis dafür, was Menschen wirklich brauchen, wenn sich ihr Berufsweg verändert. Zertifiziert in Positiver Psychologie (Inntal Institut, DACH-PP).",
    linkedin: "https://www.linkedin.com/in/go-to-carolin-k",
    credentials: ["10+ Jahre HR-Führung", "Bosch · Covestro · Bayer", "Zert. Positive Psychologie", "Group Lead Offboarding @ Bosch"],
  },
  {
    initials: "FK",
    name: "Flavius Kehr",
    role: "Co-Founder · UX & Technologie",
    tagline: `„Ich baue seit Jahren Produkte für SAP. Irgendwann habe ich gemerkt: Das wichtigste Design-Problem unserer Zeit ist nicht ein Interface – sondern wie Menschen ihren nächsten Schritt finden."`,
    bio: "Flavius ist Head of UX und Product Lead bei SAP, Design-Thinking-Keynote-Speaker und systemischer Coach in Ausbildung. Er kennt aus seiner täglichen Arbeit, wie Technologie Arbeitsprozesse verändert – und was das für die Menschen bedeutet, die davon betroffen sind. Bei skillingup verbindet er psychologische Tiefe mit dem Werkzeugkasten moderner KI.",
    linkedin: "https://www.linkedin.com/in/flaviuskehr",
    credentials: ["Head of UX @ SAP", "Design Thinking Keynote Speaker", "Systemischer Coach i.A.", "UX360 Research Europe 2024"],
  },
];

const TESTIMONIALS = [
  {
    initial: "S",
    name: "Sandra K., 41",
    transition: "Sachbearbeiterin Kfz-Versicherung → heute UX-Researcherin",
    highlight: `„Der erste Moment, wo ich wieder Richtung gespürt habe."`,
    text: "Ich dachte, mit 40 Jahren fängt man nicht nochmal von vorne an. skillingup hat mir nicht gesagt, was gerade gefragt ist – sondern warum meine Fähigkeit, Kundenbeschwerden zu verstehen, genau das ist, was UX-Teams suchen. Das war der erste Moment seit Monaten, wo ich wieder Richtung gespürt habe.",
    featured: false,
  },
  {
    initial: "M",
    name: "Michael R., 48",
    transition: "Lagerleiter Logistik → in Umschulung Supply-Chain-Beratung",
    highlight: `„Die Analyse hat mich erwischt – weil sie ehrlich war."`,
    text: "Meine erste Reaktion war: Das ist doch alles KI-Quatsch. Dann habe ich trotzdem die drei Fragen beantwortet – und die Analyse hat mich erwischt. Nicht weil sie glamourös war, sondern weil sie ehrlich war. Ich dachte, mein nächster Job muss komplett anders sein. Stimmt gar nicht.",
    featured: true,
  },
  {
    initial: "K",
    name: "Kathrin M., 35",
    transition: "Bürokauffrau Verwaltung → systemische Beraterin i.A.",
    highlight: `„Die Seite hat nicht so getan, als wäre alles einfach."`,
    text: "Was mir am meisten geholfen hat: Die Seite hat nicht so getan, als wäre alles einfach. Der erste konkrete Schritt war klein – eine Informationsveranstaltung in meiner Stadt. Aber ich bin hingegangen. Und das hat alles verändert.",
    featured: false,
  },
];

const TESTIMONIALS_EN = [
  {
    initial: "S",
    name: "Sandra K., 41",
    transition: "Insurance clerk → UX Researcher",
    highlight: `"The first moment I felt direction again."`,
    text: "I thought at 40 you don't start over. skillingup didn't tell me what's currently 'in demand' – it showed me why my ability to understand customer complaints is exactly what UX teams look for. That was the first moment in months where I felt direction again.",
    featured: false,
  },
  {
    initial: "M",
    name: "Michael R., 48",
    transition: "Logistics manager → Supply-chain consulting training",
    highlight: `"The analysis got me – because it was honest."`,
    text: "My first reaction: this is all AI nonsense. Then I answered the three questions anyway – and the analysis got me. Not because it was glamorous, but because it was honest. I thought my next job had to be completely different. It doesn't.",
    featured: true,
  },
  {
    initial: "K",
    name: "Kathrin M., 35",
    transition: "Office administrator → systemic consultant in training",
    highlight: `"The site didn't pretend everything was easy."`,
    text: "What helped me most: the site didn't pretend everything was easy. The first concrete step was small – an information event in my city. But I went. And that changed everything.",
    featured: false,
  },
];

const STEP = { HERO: 0, JOB: 1, PERSONALITY: 2, VALUES: 3, GATE: 4, RESULT: 5 };

/* ─── Framer Motion variants ─────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22, ease: "easeIn" } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── Component ──────────────────────────────────────────── */
export default function SkillingUp() {
  const [step, setStep] = useState(STEP.HERO);
  const [currentJob, setCurrentJob] = useState("");
  const [yearsInJob, setYearsInJob] = useState("");
  const [personality, setPersonality] = useState({});
  const [values, setValues] = useState({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [legalModal, setLegalModal] = useState(null);
  const [lang, setLang] = useState("de");
  const [scrolled, setScrolled] = useState(false);

  const t = lang === "en" ? en : de;
  const testimonials = lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allPersonalityAnswered = t.personalityQuestions.every((q) => personality[q.id]);
  const allValuesAnswered = t.valueQuestions.every((q) => values[q.id]);

  const handlePersonalityAnswer = (id, value) =>
    setPersonality((p) => ({ ...p, [id]: value }));

  const handleValueAnswer = (id, value) =>
    setValues((v) => ({ ...v, [id]: value }));

  /* — preserved exactly — */
  const buildPrompt = () =>
    `Du bist ein empathischer Karriereberater mit Expertise in Persönlichkeitspsychologie und Arbeitsmarkttrends.

Eine Person befindet sich in einer beruflichen Neuorientierung und sucht einen neuen Weg. Analysiere ihr Profil und gib 3 konkrete, personalisierte Reskilling-Empfehlungen.

PROFIL:
- Aktueller Beruf: ${currentJob}
- Jahre im Beruf: ${yearsInJob}
- Energie: ${personality.energy === "extravert" ? "Extrovertiert - tankt durch Menschen" : "Introvertiert - braucht Ruhe"}
- Arbeitsstil: ${personality.work === "structured" ? "Strukturiert, konkrete Ergebnisse" : "Kreativ, offene Probleme"}
- Entscheidungen: ${personality.decision === "analytical" ? "Analytisch, datenbasiert" : "Empathisch, menschenorientiert"}
- Veränderung: ${personality.change === "pioneer" ? "Sucht aktiv Neues" : "Braucht Zeit zur Anpassung"}
- Motivation: ${values.motivation}
- Muss vermeiden: ${values.constraint}

Antworte NUR mit einem JSON-Objekt (kein Markdown, keine Backticks), exakt in diesem Format:
{
  "headline": "Ein kurzer, motivierender Satz über die Person (max 15 Wörter)",
  "insight": "Eine ehrliche psychologische Einschätzung der Person und ihrer Stärken (2-3 Sätze)",
  "paths": [
    {
      "title": "Berufsbezeichnung",
      "match": 95,
      "why": "Warum das zu dieser Person passt (1-2 Sätze)",
      "first_step": "Konkret: Was kann die Person diese Woche tun?",
      "time": "Realistischer Zeitraum bis Berufseinstieg"
    }
  ]
}`;

  /* — preserved exactly — */
  const submitGate = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, job: currentJob, years: yearsInJob }),
    }).catch(() => {});

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            window.__ENV__?.ANTHROPIC_API_KEY ||
            import.meta.env.VITE_ANTHROPIC_API_KEY ||
            "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await response.json();
      if (!data.content?.[0]?.text) throw new Error();
      const parsed = JSON.parse(data.content[0].text.trim());
      setResult(parsed);
      setStep(STEP.RESULT);
      track("analysis_completed", { job: currentJob });
      track("email_submitted", { job: currentJob });
    } catch {
      setError(t.analysisError);
    } finally {
      setLoading(false);
    }
  };

  /* — preserved exactly — */
  const skipAndShowResult = async () => {
    track("email_skipped");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            window.__ENV__?.ANTHROPIC_API_KEY ||
            import.meta.env.VITE_ANTHROPIC_API_KEY ||
            "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await response.json();
      if (!data.content?.[0]?.text) throw new Error();
      const parsed = JSON.parse(data.content[0].text.trim());
      setResult(parsed);
      setStep(STEP.RESULT);
      track("analysis_completed", { job: currentJob });
    } catch {
      setError(t.analysisError);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(STEP.HERO);
    setCurrentJob("");
    setYearsInJob("");
    setPersonality({});
    setValues({});
    setEmail("");
    setName("");
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const startFlow = () => {
    track("analysis_started");
    setStep(STEP.JOB);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const isLanding = step === STEP.HERO;
  const showProgress = step >= STEP.JOB && step <= STEP.VALUES;
  const progressStep = step - STEP.JOB;

  const testimonialsHeadlineDE = ["Echte Menschen.", "Echte Veränderungen."];
  const testimonialsHeadlineEN = ["Real people.", "Real changes."];
  const testimonialsHeadline = lang === "en" ? testimonialsHeadlineEN : testimonialsHeadlineDE;

  return (
    <div className="su-root">

      {/* ═══════════════ HEADER ═══════════════════ */}
      <header className={`su-header${scrolled ? " su-header--scrolled" : ""}`}>
        <button
          className="su-logo-wordmark"
          onClick={reset}
          aria-label="skillingup – Startseite"
        >
          skillingup
        </button>

        <div className="su-header-center">
          {showProgress && (
            <div className="su-progress">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="su-progress__seg"
                  data-state={i < progressStep ? "done" : i === progressStep ? "active" : "idle"}
                />
              ))}
            </div>
          )}
        </div>

        <div className="su-header-right">
          <div className="su-lang-toggle">
            <button
              className={`su-lang-btn${lang === "de" ? " su-lang-btn--active" : ""}`}
              onClick={() => setLang("de")}
            >DE</button>
            <button
              className={`su-lang-btn${lang === "en" ? " su-lang-btn--active" : ""}`}
              onClick={() => setLang("en")}
            >EN</button>
          </div>
          {isLanding && (
            <button className="su-header-cta" onClick={startFlow}>
              {lang === "en" ? "Start analysis" : "Analyse starten"}
            </button>
          )}
        </div>
      </header>

      {/* ═══════════════ MAIN ═════════════════════ */}
      <main className="su-main">
        <AnimatePresence mode="wait">

          {/* ─────────── LANDING ─────────────────── */}
          {step === STEP.HERO && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >

              {/* §1 HERO */}
              <section className="su-hero">
                <div className="su-hero__inner">
                  <motion.div
                    className="su-hero__content"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.span className="su-badge" variants={staggerItem}>
                      {t.badge}
                    </motion.span>

                    <motion.h1 className="su-hero__headline" variants={staggerItem}>
                      {t.heroHeadline[0]}<br />
                      <em>{t.heroHeadline[1]}</em>
                    </motion.h1>

                    <motion.p className="su-hero__body" variants={staggerItem}>
                      {t.heroBody}
                    </motion.p>

                    <motion.div className="su-trust-chips" variants={staggerItem}>
                      {t.trust.map((item) => (
                        <span key={item} className="su-trust-chip">{item}</span>
                      ))}
                    </motion.div>

                    <motion.div className="su-cta-group" variants={staggerItem}>
                      <motion.button
                        className="su-btn-primary"
                        onClick={startFlow}
                        whileHover={{ y: -1, boxShadow: "0 8px 32px rgba(45,90,61,0.45)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {t.cta} <ArrowRight size={16} />
                      </motion.button>
                      <p className="su-cta-subtext">{t.ctaSubtext}</p>
                    </motion.div>

                    <motion.div className="su-stats-bar" variants={staggerItem}>
                      {t.stats.map(({ value, label }) => (
                        <div key={label} className="su-stat">
                          <div className="su-stat__value">{value}</div>
                          <div className="su-stat__label">{label}</div>
                        </div>
                      ))}
                    </motion.div>
                    <motion.p className="su-stats-disclaimer" variants={staggerItem}>
                      {t.statsDisclaimer}
                    </motion.p>
                  </motion.div>
                </div>
              </section>

              {/* §2 HOW IT WORKS */}
              <section className="su-how">
                <div className="su-section-inner">
                  <span className="su-section-label">{t.howItWorksLabel}</span>
                  <h2 className="su-section-headline">
                    {t.howItWorksHeadline[0]}<br />
                    <em>{t.howItWorksHeadline[1]}</em>
                  </h2>
                  <div className="su-how-cards">
                    {t.features.map(({ title, body }, idx) => (
                      <div key={title} className="su-how-card">
                        <div className="su-how-card__number">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="su-how-card__title">{title}</div>
                        <p className="su-how-card__body">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* §3 METHODOLOGY */}
              <section className="su-methodology">
                <div className="su-methodology-inner">
                  <span className="su-methodology-label">{t.methodologyLabel}</span>
                  <h2 className="su-methodology-headline">
                    {t.methodologyHeadline[0]}<br />
                    <em>{t.methodologyHeadline[1]}</em>
                  </h2>
                  <p className="su-methodology-body">{t.methodologyBody}</p>
                  <hr className="su-methodology-rule" />
                  <div className="su-pillars">
                    {t.methodologyPillars.map(({ icon, title, body }) => (
                      <div key={title} className="su-pillar">
                        <div className="su-pillar__icon">{icon}</div>
                        <div className="su-pillar__title">{title}</div>
                        <p className="su-pillar__body">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* §4 TESTIMONIALS */}
              <section className="su-testimonials">
                <div className="su-section-inner">
                  <span className="su-section-label">{t.testimonialsLabel}</span>
                  <h2 className="su-section-headline">
                    {testimonialsHeadline[0]}<br />
                    <em>{testimonialsHeadline[1]}</em>
                  </h2>
                  <div className="su-testimonial-grid">
                    {testimonials.map(({ initial, name: n, transition, highlight, text, featured }) => (
                      <div
                        key={n}
                        className={`su-testimonial${featured ? " su-testimonial--featured" : ""}`}
                      >
                        <div className="su-quote-mark">"</div>
                        <p className="su-testimonial__highlight">{highlight}</p>
                        <hr className="su-testimonial__rule" />
                        <p className="su-testimonial__text">{text}</p>
                        <div className="su-testimonial__footer">
                          <div className="su-testimonial__avatar">{initial}</div>
                          <div>
                            <div className="su-testimonial__name">{n}</div>
                            <div className="su-testimonial__transition">{transition}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="su-proof-bar">
                    {t.proofBarItems.map((item, i) => (
                      <span key={i} className="su-proof-bar__item">{item}</span>
                    ))}
                    <span className="su-proof-bar__sep" aria-hidden="true">·</span>
                    <span className="su-proof-bar__disclaimer">{t.proofBarDisclaimer}</span>
                  </div>
                </div>
              </section>

              {/* §5 FOUNDERS */}
              <section className="su-founders">
                <div className="su-section-inner">
                  <span className="su-section-label">{t.storyLabel}</span>
                  <h2 className="su-section-headline">
                    {t.storyIntroHeadline[0]}<br />
                    <em>{t.storyIntroHeadline[1]}</em>
                  </h2>
                  <p className="su-founders__intro">{t.storyIntroBody}</p>

                  <div className="su-founders-grid">
                    {TEAM.map(({ initials, name: fn, role, tagline, bio, linkedin, credentials }) => (
                      <div key={fn} className="su-founder-card">
                        <div className="su-founder-avatar">{initials}</div>
                        <div className="su-founder-name">{fn}</div>
                        <div className="su-founder-role">{role}</div>
                        <p className="su-founder-tagline">{tagline}</p>
                        <p className="su-founder-bio">{bio}</p>
                        <div className="su-credentials">
                          {credentials.map((c) => (
                            <span key={c} className="su-credential-chip">{c}</span>
                          ))}
                        </div>
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="su-linkedin-btn"
                        >
                          <LinkedinIcon /> LinkedIn
                        </a>
                      </div>
                    ))}
                  </div>
                  <p className="su-founders__photo-note">{t.photoNote}</p>
                </div>
              </section>

              {/* §6 FINAL CTA */}
              <section className="su-final-cta">
                <div className="su-final-cta__inner">
                  <h2 className="su-final-cta__headline">{t.finalCtaHeadline}</h2>
                  <p className="su-final-cta__body">{t.finalCtaBody}</p>
                  <motion.button
                    className="su-btn-primary"
                    onClick={startFlow}
                    whileHover={{ y: -1, boxShadow: "0 8px 32px rgba(45,90,61,0.45)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {t.finalCtaBtn}
                  </motion.button>
                  <p className="su-final-cta__subtext">{t.finalCtaSubtext}</p>
                </div>
              </section>

            </motion.div>
          )}

          {/* ─────────── JOB ─────────────────────── */}
          {step === STEP.JOB && (
            <motion.div
              key="job"
              className="su-flow"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-flow__container">
                <div className="su-step-label">{t.step1Label}</div>
                <h2 className="su-step-headline">{t.step1Headline}</h2>

                <div className="su-field">
                  <label className="su-field-label">{t.jobLabel}</label>
                  <input
                    className="su-field-input"
                    value={currentJob}
                    onChange={(e) => setCurrentJob(e.target.value)}
                    placeholder={t.jobPlaceholder}
                    onKeyDown={(e) =>
                      e.key === "Enter" && currentJob.trim() && yearsInJob.trim() &&
                      (track("step_completed", { step: 1, job: currentJob }), setStep(STEP.PERSONALITY))
                    }
                  />
                </div>

                <div className="su-field">
                  <label className="su-field-label">{t.yearsLabel}</label>
                  <input
                    className="su-field-input"
                    value={yearsInJob}
                    onChange={(e) => setYearsInJob(e.target.value)}
                    placeholder={t.yearsPlaceholder}
                    onKeyDown={(e) =>
                      e.key === "Enter" && currentJob.trim() && yearsInJob.trim() &&
                      (track("step_completed", { step: 1, job: currentJob }), setStep(STEP.PERSONALITY))
                    }
                  />
                </div>

                <motion.button
                  className="su-btn-flow"
                  disabled={!currentJob.trim() || !yearsInJob.trim()}
                  onClick={() => {
                    track("step_completed", { step: 1, job: currentJob });
                    setStep(STEP.PERSONALITY);
                  }}
                  whileHover={currentJob.trim() && yearsInJob.trim() ? { scale: 1.01 } : {}}
                  whileTap={currentJob.trim() && yearsInJob.trim() ? { scale: 0.99 } : {}}
                >
                  {t.next} <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─────────── PERSONALITY ─────────────── */}
          {step === STEP.PERSONALITY && (
            <motion.div
              key="personality"
              className="su-flow su-flow--wide"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-flow__container">
                <div className="su-step-label">{t.step2Label}</div>
                <h2 className="su-step-headline">{t.step2Headline}</h2>

                {t.personalityQuestions.map((q) => (
                  <div key={q.id} className="su-question">
                    <div className="su-question__text">{q.question}</div>
                    <div className="su-options">
                      {q.options.map((opt) => {
                        const active = personality[q.id] === opt.value;
                        return (
                          <motion.button
                            key={opt.value}
                            className={`su-option${active ? " su-option--active" : ""}`}
                            onClick={() => handlePersonalityAnswer(q.id, opt.value)}
                            whileHover={!active ? { x: 2 } : {}}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span className={`su-option__dot${active ? " su-option__dot--active" : ""}`} />
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <motion.button
                  className="su-btn-flow"
                  disabled={!allPersonalityAnswered}
                  onClick={() => {
                    track("step_completed", { step: 2 });
                    setStep(STEP.VALUES);
                  }}
                  whileHover={allPersonalityAnswered ? { scale: 1.01 } : {}}
                  whileTap={allPersonalityAnswered ? { scale: 0.99 } : {}}
                >
                  {t.next} <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─────────── VALUES ──────────────────── */}
          {step === STEP.VALUES && (
            <motion.div
              key="values"
              className="su-flow su-flow--wide"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-flow__container">
                <div className="su-step-label">{t.step3Label}</div>
                <h2 className="su-step-headline">{t.step3Headline}</h2>

                {t.valueQuestions.map((q) => (
                  <div key={q.id} className="su-question">
                    <div className="su-question__text">{q.question}</div>
                    <div className="su-options">
                      {q.options.map((opt) => {
                        const active = values[q.id] === opt.value;
                        return (
                          <motion.button
                            key={opt.value}
                            className={`su-option${active ? " su-option--active" : ""}`}
                            onClick={() => handleValueAnswer(q.id, opt.value)}
                            whileHover={!active ? { x: 2 } : {}}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span className={`su-option__dot${active ? " su-option__dot--active" : ""}`} />
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <motion.button
                  className="su-btn-flow"
                  disabled={!allValuesAnswered}
                  onClick={() => {
                    track("step_completed", { step: 3 });
                    setStep(STEP.GATE);
                  }}
                  whileHover={allValuesAnswered ? { scale: 1.01 } : {}}
                  whileTap={allValuesAnswered ? { scale: 0.99 } : {}}
                >
                  {t.startAnalysis} <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─────────── GATE ────────────────────── */}
          {step === STEP.GATE && (
            <motion.div
              key="gate"
              className="su-flow"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-flow__container">
                <motion.div
                  className="su-gate-icon"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle2 size={48} color="var(--color-primary)" strokeWidth={1.5} />
                </motion.div>

                <div className="su-step-label">{t.gateLabel}</div>
                <h2 className="su-step-headline">
                  {t.gateHeadline[0]}<br /><em>{t.gateHeadline[1]}</em>
                </h2>
                <p className="su-gate-body">{t.gateBody}</p>

                <div className="su-field">
                  <label className="su-field-label">{t.nameLabel}</label>
                  <input
                    className="su-field-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                  />
                </div>

                <div className="su-field">
                  <label className="su-field-label">{t.emailLabel}</label>
                  <input
                    type="email"
                    className={`su-field-input${error ? " su-field-input--error" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    onKeyDown={(e) =>
                      e.key === "Enter" && email.trim() && !loading && submitGate()
                    }
                  />
                </div>

                {error && <p className="su-error">{error}</p>}

                <motion.button
                  className="su-btn-flow"
                  disabled={!email.trim() || loading}
                  onClick={submitGate}
                  whileHover={email.trim() && !loading ? { scale: 1.01 } : {}}
                  whileTap={email.trim() && !loading ? { scale: 0.99 } : {}}
                >
                  {loading ? t.loading : <>{t.submit} <ArrowRight size={14} /></>}
                </motion.button>

                <div className="su-privacy">
                  <Shield size={12} color="var(--color-ink-muted)" strokeWidth={1.5} />
                  <span>{t.privacyNote}</span>
                </div>

                <button
                  className="su-skip-link"
                  onClick={skipAndShowResult}
                  disabled={loading}
                >
                  {t.skipEmail}
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────── RESULT ──────────────────── */}
          {step === STEP.RESULT && result && (
            <motion.div
              key="result"
              className="su-flow su-flow--result"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-flow__container">
                <motion.div
                  className="su-profile-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="su-profile-card__label">{t.profileLabel}</div>
                  <div className="su-profile-card__headline">{result.headline}</div>
                  <p className="su-profile-card__insight">{result.insight}</p>
                </motion.div>

                <p className="su-result-intro">{t.resultIntro}</p>
                <div className="su-paths-label">{t.pathsLabel}</div>

                {result.paths?.map((path, i) => (
                  <motion.div
                    key={i}
                    className="su-path-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    whileHover={{ y: -3 }}
                  >
                    <div className="su-path-card__header">
                      <div>
                        <div className="su-path-number">{t.pathNumber(i)}</div>
                        <div className="su-path-title">{path.title}</div>
                      </div>
                      <div className="su-match-badge">{path.match}% Match</div>
                    </div>
                    <p className="su-path-why">{path.why}</p>
                    <div className="su-path-grid">
                      <div className="su-path-detail">
                        <div className="su-path-detail__label">{t.firstStepLabel}</div>
                        <div className="su-path-detail__value su-path-detail__value--green">
                          {path.first_step}
                        </div>
                      </div>
                      <div className="su-path-detail">
                        <div className="su-path-detail__label">{t.timeLabel}</div>
                        <div className="su-path-detail__value">{path.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="su-result-cta-box">
                  <p className="su-result-cta-box__text">{t.resultCtaText}</p>
                  <a href={t.resultCtaEmail} className="su-result-cta-box__link">
                    {t.resultCtaLinkText}
                  </a>
                </div>

                <motion.button
                  className="su-btn-secondary"
                  onClick={reset}
                  whileHover={{ borderColor: "var(--color-ink-muted)" }}
                >
                  {t.restart}
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ═══════════════ FOOTER ═══════════════════ */}
      {isLanding ? (
        <footer className="su-footer">
          <div className="su-footer__grid">
            <div className="su-footer__col">
              <div className="su-footer-logo">skillingup</div>
              <p className="su-footer-tagline">{t.footerTagline}</p>
              <p className="su-footer-copy">
                <a href="mailto:hallo@skillingup.de" className="su-footer-mail">
                  {t.footerCopy}
                </a>
              </p>
            </div>
            <div className="su-footer__col su-footer__col--links">
              <button className="su-footer-link" onClick={() => setLegalModal("impressum")}>
                {t.impressum}
              </button>
              <button className="su-footer-link" onClick={() => setLegalModal("datenschutz")}>
                {t.datenschutz}
              </button>
            </div>
            <div className="su-footer__col su-footer__col--trust">
              {t.footerTrustItems.map((item) => (
                <span key={item} className="su-footer-trust-item">{item}</span>
              ))}
            </div>
          </div>
          <div className="su-footer__bottom">
            <span className="su-footer-powered">{t.footerRight}</span>
          </div>
        </footer>
      ) : (
        <footer className="su-footer su-footer--minimal">
          <button className="su-footer-link" onClick={() => setLegalModal("impressum")}>
            {t.impressum}
          </button>
          <span className="su-footer-sep">·</span>
          <button className="su-footer-link" onClick={() => setLegalModal("datenschutz")}>
            {t.datenschutz}
          </button>
        </footer>
      )}

      {/* ═══════════════ LEGAL MODAL ══════════════ */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            className="su-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              className="su-modal"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="su-modal__close"
                onClick={() => setLegalModal(null)}
                aria-label="Schließen"
              >
                <X size={18} />
              </button>

              {legalModal === "impressum" && (
                <div className="su-legal">
                  <h2>Impressum</h2>
                  <p><strong>Angaben gemäß § 5 TMG</strong></p>
                  <p>Flavius Kehr<br />Zehntwaldstraße 31<br />76149 Karlsruhe</p>
                  <h3>Kontakt</h3>
                  <p>E-Mail: <a href="mailto:hallo@skillingup.de">hallo@skillingup.de</a></p>
                  <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
                  <p>Flavius Kehr<br />Zehntwaldstraße 31<br />76149 Karlsruhe</p>
                  <h3>Haftungsausschluss</h3>
                  <p>
                    Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die
                    Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
                    keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
                    für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                    verantwortlich.
                  </p>
                </div>
              )}

              {legalModal === "datenschutz" && (
                <div className="su-legal">
                  <h2>Datenschutzerklärung</h2>
                  <h3>1. Verantwortlicher</h3>
                  <p>Flavius Kehr<br />Zehntwaldstraße 31<br />76149 Karlsruhe<br />
                    E-Mail: <a href="mailto:hallo@skillingup.de">hallo@skillingup.de</a>
                  </p>
                  <h3>2. Welche Daten wir erheben</h3>
                  <p>Bei der Nutzung von skillingup verarbeitest du folgende Daten:</p>
                  <ul>
                    <li>E-Mail-Adresse (Pflichtfeld im Ergebnis-Formular)</li>
                    <li>Vorname (optional)</li>
                    <li>Aktueller Beruf und Berufserfahrung</li>
                    <li>Antworten zu Persönlichkeit und Werten aus dem Fragebogen</li>
                  </ul>
                  <h3>3. Zweck der Verarbeitung</h3>
                  <p>
                    Deine Daten werden ausschließlich verwendet, um deine personalisierte
                    Karriereanalyse zu erstellen und dich über die Weiterentwicklung von
                    skillingup zu informieren. Es findet kein Verkauf oder Weitergabe an
                    Werbetreibende statt.
                  </p>
                  <h3>4. Datenspeicherung und externe Dienstleister</h3>
                  <p>
                    <strong>E-Mail-Speicherung:</strong> Deine Formulareingaben (E-Mail, Name,
                    Beruf) werden ausschließlich auf unserem eigenen Server gespeichert.
                    Es werden keine externen Formulardienste eingesetzt.
                  </p>
                  <p>
                    <strong>Anthropic, Inc. (anthropic.com):</strong> Dein Profil (Beruf,
                    Persönlichkeits- und Werteangaben) wird zur KI-gestützten Analyse an
                    Anthropic übermittelt. Anthropic verarbeitet diese Daten gemäß ihrer{" "}
                    <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">
                      Datenschutzerklärung
                    </a>.
                  </p>
                  <p>
                    <strong>Google Fonts (fonts.googleapis.com):</strong> Beim Laden der Seite
                    werden Schriftarten von Google-Servern geladen. Dabei kann deine IP-Adresse
                    an Google übermittelt werden.
                  </p>
                  <p>
                    <strong>Umami Analytics:</strong> Wir verwenden Umami, eine
                    datenschutzfreundliche Analysesoftware, betrieben auf unserem eigenen Server.
                    Es werden keine personenbezogenen Daten oder Cookies gesetzt.
                  </p>
                  <h3>5. Deine Rechte (DSGVO)</h3>
                  <p>Du hast jederzeit das Recht auf:</p>
                  <ul>
                    <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
                    <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                    <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
                    <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                    <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                  </ul>
                  <p>
                    Für alle Anfragen:{" "}
                    <a href="mailto:hallo@skillingup.de">hallo@skillingup.de</a>
                  </p>
                  <h3>6. Beschwerderecht</h3>
                  <p>
                    Du hast das Recht, dich bei der zuständigen Aufsichtsbehörde zu beschweren.
                    In Baden-Württemberg: Landesbeauftragter für den Datenschutz und die
                    Informationsfreiheit, Lautenschlagerstraße 20, 70173 Stuttgart.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
