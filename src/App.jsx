import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Heart,
  Compass,
  CheckCircle2,
  Shield,
  ArrowRight,
  X,
} from "lucide-react";
import { de, en } from "./i18n.js";
import "./App.css";

const LinkedinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const track = (event, data = {}) => {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(event, data);
  }
};

const TEAM = [
  {
    initials: "CK",
    name: "Carolin Kehr",
    role: "Co-Founderin · HR & Psychologie",
    tagline:
      `„Ich habe 10 Jahre erlebt, wie Menschen in beruflichen Übergängen allein gelassen werden. Das wollte ich ändern.“`,
    bio: "Carolin ist HR-Führungskraft mit über einem Jahrzehnt Erfahrung bei Bosch, Covestro und Bayer – lokal und global. Sie hat Talentprogramme entwickelt, Transformationen begleitet und Hunderte von Menschen durch Karrierewechsel geführt. Für skillingup bringt sie das, was kein Algorithmus ersetzen kann: das Verständnis dafür, was Menschen wirklich brauchen, wenn sich ihr Berufsweg verändert. Zertifiziert in Positiver Psychologie (Inntal Institut, DACH-PP).",
    linkedin: "https://www.linkedin.com/in/go-to-carolin-k",
    credentials: [
      "10+ Jahre HR-Führung",
      "Bosch · Covestro · Bayer",
      "Zert. Positive Psychologie",
      "Group Lead Offboarding @ Bosch",
    ],
  },
  {
    initials: "FK",
    name: "Flavius Kehr",
    role: "Co-Founder · UX & Technologie",
    tagline:
      `„Ich baue seit Jahren Produkte für SAP. Irgendwann habe ich gemerkt: Das wichtigste Design-Problem unserer Zeit ist nicht ein Interface – sondern wie Menschen ihren nächsten Schritt finden."`,
    bio: "Flavius ist Head of UX und Product Lead bei SAP, Design-Thinking-Keynote-Speaker und systemischer Coach in Ausbildung. Er kennt aus seiner täglichen Arbeit, wie Technologie Arbeitsprozesse verändert – und was das für die Menschen bedeutet, die davon betroffen sind. Bei skillingup verbindet er psychologische Tiefe mit dem Werkzeugkasten moderner KI.",
    linkedin: "https://www.linkedin.com/in/flaviuskehr",
    credentials: [
      "Head of UX @ SAP",
      "Design Thinking Keynote Speaker",
      "Systemischer Coach i.A.",
      "UX360 Research Europe 2024",
    ],
  },
];

const TESTIMONIALS = [
  {
    initial: "S",
    name: "Sandra K., 41",
    former: "Sachbearbeiterin Kfz-Versicherung → heute UX-Researcherin",
    highlight: `„Der erste Moment, wo ich wieder Richtung gespürt habe."`,
    text: "Ich dachte, mit 40 Jahren fängt man nicht nochmal von vorne an. skillingup hat mir nicht gesagt, was gerade ‚gefragt' ist – sondern warum meine Fähigkeit, Kundenbeschwerden zu verstehen, genau das ist, was UX-Teams suchen. Das war der erste Moment seit Monaten, wo ich wieder Richtung gespürt habe.",
  },
  {
    initial: "M",
    name: "Michael R., 48",
    former: "Lagerleiter Logistik → in Umschulung Supply-Chain-Beratung",
    highlight: `„Die Analyse hat mich erwischt – weil sie ehrlich war."`,
    text: "Meine erste Reaktion war: Das ist doch alles KI-Quatsch. Dann habe ich trotzdem die drei Fragen beantwortet – und die Analyse hat mich erwischt. Nicht weil sie glamourös war, sondern weil sie ehrlich war.",
  },
  {
    initial: "K",
    name: "Kathrin M., 35",
    former: "Bürokauffrau Verwaltung → systemische Beraterin i.A.",
    highlight: `„Die Seite hat nicht so getan, als wäre alles einfach."`,
    text: "Was mir am meisten geholfen hat: Die Seite hat nicht so getan, als wäre alles einfach. Der erste konkrete Schritt war klein – eine Informationsveranstaltung in meiner Stadt. Aber ich bin hingegangen. Und das hat alles verändert.",
  },
];

const STEP = { HERO: 0, JOB: 1, PERSONALITY: 2, VALUES: 3, GATE: 4, RESULT: 5 };

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22, ease: "easeIn" } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const featureIcons = [Brain, Heart, Compass];

const S = {
  label: {
    fontSize: "11px",
    letterSpacing: "2.5px",
    color: "#8A7D65",
    display: "block",
    marginBottom: "8px",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    fontSize: "15px",
    fontFamily: "'Inter', system-ui, sans-serif",
    border: "1.5px solid #D4C9B0",
    background: "#FBF8F3",
    color: "#1A1A1A",
    outline: "none",
    borderRadius: "6px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btnPrimary: (active) => ({
    width: "100%",
    padding: "16px 24px",
    background: active ? "#2D5A3D" : "#D4C9B0",
    color: active ? "#FBF8F3" : "#8A7D65",
    border: "none",
    fontSize: "12px",
    letterSpacing: "2px",
    cursor: active ? "pointer" : "not-allowed",
    borderRadius: "6px",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: "600",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }),
  btnSecondary: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#8A7D65",
    border: "1.5px solid #D4C9B0",
    fontSize: "11px",
    letterSpacing: "2px",
    cursor: "pointer",
    borderRadius: "6px",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

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

  const t = lang === "en" ? en : de;

  const allPersonalityAnswered = t.personalityQuestions.every((q) => personality[q.id]);
  const allValuesAnswered = t.valueQuestions.every((q) => values[q.id]);

  const handlePersonalityAnswer = (id, value) =>
    setPersonality((p) => ({ ...p, [id]: value }));

  const handleValueAnswer = (id, value) =>
    setValues((v) => ({ ...v, [id]: value }));

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
  };

  const showProgress = step >= STEP.JOB && step <= STEP.VALUES;
  const progressStep = step - STEP.JOB;

  return (
    <div className="su-root">
      {/* Header */}
      <header className={`su-header ${step === STEP.HERO ? "su-header--hero" : ""}`}>
        <div
          className="su-logo"
          onClick={() => step !== STEP.RESULT && reset()}
          style={{ cursor: step > STEP.HERO ? "pointer" : "default" }}
        >
          <div className="su-logo__name">skillingup</div>
          <div className="su-logo__tagline">{t.logoTagline}</div>
        </div>
        {showProgress && (
          <div className="su-progress">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="su-progress__bar"
                style={{
                  background:
                    i < progressStep ? "#2D5A3D" : i === progressStep ? "#7AB87A" : "#D4C9B0",
                }}
              />
            ))}
          </div>
        )}
        <div className="su-lang-toggle">
          <button
            className={`su-lang-btn ${lang === "de" ? "su-lang-btn--active" : ""}`}
            onClick={() => setLang("de")}
          >
            DE
          </button>
          <button
            className={`su-lang-btn ${lang === "en" ? "su-lang-btn--active" : ""}`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </header>

      {/* Main */}
      <main className={`su-main ${step === STEP.HERO ? "su-main--hero" : ""}`}>
        <AnimatePresence mode="wait">

          {/* ── HERO ─────────────────────────────────────── */}
          {step === STEP.HERO && (
            <motion.div
              key="hero"
              className="su-hero"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {/* Badge + Headline + Body */}
              <motion.div variants={staggerItem}>
                <span className="su-badge">{t.badge}</span>
              </motion.div>

              <motion.h1 className="su-hero__headline" variants={staggerItem}>
                {t.heroHeadline[0]}<br />
                <em>{t.heroHeadline[1]}</em>
              </motion.h1>

              <motion.p className="su-hero__body" variants={staggerItem}>
                {t.heroBody}
              </motion.p>

              <motion.div className="su-trust" variants={staggerItem}>
                {t.trust.map((item) => (
                  <span key={item} className="su-trust__item">{item}</span>
                ))}
              </motion.div>

              <motion.div variants={staggerItem} className="su-cta-group">
                <motion.button
                  className="su-btn su-btn--hero"
                  onClick={() => {
                    track("analysis_started");
                    setStep(STEP.JOB);
                  }}
                  whileHover={{ scale: 1.02, background: "#234832" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {t.cta} <ArrowRight size={16} />
                </motion.button>
                <p className="su-cta-subtext">{t.ctaSubtext}</p>
              </motion.div>

              {/* Stats bar */}
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

              {/* "So funktioniert es" section */}
              <motion.div className="su-section-intro" variants={staggerItem}>
                <div className="su-team-label">{t.howItWorksLabel}</div>
                <h2 className="su-section-headline">
                  {t.howItWorksHeadline[0]}<br />
                  {t.howItWorksHeadline[1]}
                </h2>
              </motion.div>

              {/* Feature cards */}
              <motion.div className="su-features" variants={staggerItem}>
                {t.features.map(({ title, body }, idx) => {
                  const Icon = featureIcons[idx];
                  return (
                    <motion.div
                      key={title}
                      className="su-feature-card"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Icon
                        size={22}
                        color="#2D5A3D"
                        strokeWidth={1.5}
                        style={{ marginBottom: "10px" }}
                      />
                      <div className="su-feature-card__title">{title}</div>
                      <div className="su-feature-card__body">{body}</div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Methodology */}
              <motion.div className="su-methodology" variants={staggerItem}>
                <div className="su-team-label">{t.methodologyLabel}</div>
                <h2 className="su-methodology__headline">
                  {t.methodologyHeadline[0]}<br />
                  <em>{t.methodologyHeadline[1]}</em>
                </h2>
                <p className="su-methodology__body">{t.methodologyBody}</p>
                <div className="su-methodology__pillars">
                  {t.methodologyPillars.map(({ icon, title, body }) => (
                    <div key={title} className="su-methodology-pillar">
                      <div className="su-methodology-pillar__icon">{icon}</div>
                      <div className="su-methodology-pillar__title">{title}</div>
                      <p className="su-methodology-pillar__body">{body}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonials */}
              <motion.div className="su-testimonials" variants={staggerItem}>
                <div className="su-testimonials__label">{t.testimonialsLabel}</div>
                <div className="su-testimonial-grid">
                  {TESTIMONIALS.map(({ initial, name: tName, former, highlight, text }) => (
                    <div key={tName} className="su-testimonial">
                      <p className="su-quote__highlight">{highlight}</p>
                      <p className="su-testimonial__text">{text}</p>
                      <div className="su-testimonial__footer">
                        <div className="su-testimonial__avatar">{initial}</div>
                        <div>
                          <div className="su-testimonial__name">{tName}</div>
                          <div className="su-testimonial__former">{former}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social proof bar */}
              <motion.div className="su-proof-bar" variants={staggerItem}>
                {t.proofBarItems.map((item, i) => (
                  <span key={i} className="su-proof-bar__item">{item}</span>
                ))}
                <span className="su-proof-bar__sep">·</span>
                <span className="su-proof-bar__disclaimer">{t.proofBarDisclaimer}</span>
              </motion.div>

              {/* Founders / Story */}
              <motion.div className="su-story" variants={staggerItem}>
                <div className="su-team-label">{t.storyLabel}</div>
                <h2 className="su-story__headline">
                  {t.storyIntroHeadline[0]}<br />
                  <em>{t.storyIntroHeadline[1]}</em>
                </h2>
                <p className="su-story__text">{t.storyIntroBody}</p>

                <div className="su-story__photos">
                  {TEAM.map(({ initials, name: mName, role, tagline, bio, linkedin, credentials }) => (
                    <div key={mName} className="su-story__person">
                      <div className="su-photo-placeholder su-photo-placeholder--small">
                        <span className="su-photo-placeholder__initials">{initials}</span>
                      </div>
                      <div className="su-story__name">{mName}</div>
                      <div className="su-story__role">{role}</div>
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
                        <LinkedinIcon />
                        LinkedIn
                      </a>
                    </div>
                  ))}
                </div>
                <p className="su-photos-note">{t.photoNote}</p>
              </motion.div>

              {/* Final CTA */}
              <motion.div className="su-final-cta" variants={staggerItem}>
                <h2 className="su-final-cta__headline">{t.finalCtaHeadline}</h2>
                <p className="su-final-cta__body">{t.finalCtaBody}</p>
                <motion.button
                  className="su-btn su-btn--hero"
                  onClick={() => {
                    track("analysis_started");
                    setStep(STEP.JOB);
                  }}
                  whileHover={{ scale: 1.02, background: "#234832" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {t.finalCtaBtn}
                </motion.button>
                <p className="su-final-cta__subtext">{t.finalCtaSubtext}</p>
              </motion.div>

            </motion.div>
          )}

          {/* ── JOB ──────────────────────────────────────── */}
          {step === STEP.JOB && (
            <motion.div
              key="job"
              className="su-step"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-step__header">
                <div className="su-step__label">{t.step1Label}</div>
                <h2 className="su-step__headline">{t.step1Headline}</h2>
              </div>

              <div className="su-field">
                <label style={S.label}>{t.jobLabel}</label>
                <input
                  value={currentJob}
                  onChange={(e) => setCurrentJob(e.target.value)}
                  placeholder={t.jobPlaceholder}
                  style={S.input}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    currentJob.trim() &&
                    yearsInJob.trim() &&
                    (track("step_completed", { step: 1, job: currentJob }),
                    setStep(STEP.PERSONALITY))
                  }
                />
              </div>

              <div className="su-field">
                <label style={S.label}>{t.yearsLabel}</label>
                <input
                  value={yearsInJob}
                  onChange={(e) => setYearsInJob(e.target.value)}
                  placeholder={t.yearsPlaceholder}
                  style={S.input}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    currentJob.trim() &&
                    yearsInJob.trim() &&
                    (track("step_completed", { step: 1, job: currentJob }),
                    setStep(STEP.PERSONALITY))
                  }
                />
              </div>

              <motion.button
                onClick={() => {
                  track("step_completed", { step: 1, job: currentJob });
                  setStep(STEP.PERSONALITY);
                }}
                disabled={!currentJob.trim() || !yearsInJob.trim()}
                style={S.btnPrimary(currentJob.trim() && yearsInJob.trim())}
                whileHover={currentJob.trim() && yearsInJob.trim() ? { scale: 1.01 } : {}}
                whileTap={currentJob.trim() && yearsInJob.trim() ? { scale: 0.99 } : {}}
              >
                {t.next} <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* ── PERSONALITY ──────────────────────────────── */}
          {step === STEP.PERSONALITY && (
            <motion.div
              key="personality"
              className="su-step su-step--wide"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-step__header">
                <div className="su-step__label">{t.step2Label}</div>
                <h2 className="su-step__headline">{t.step2Headline}</h2>
              </div>

              {t.personalityQuestions.map((q) => (
                <div key={q.id} className="su-question">
                  <div className="su-question__text">{q.question}</div>
                  <div className="su-question__options">
                    {q.options.map((opt) => {
                      const active = personality[q.id] === opt.value;
                      return (
                        <motion.button
                          key={opt.value}
                          onClick={() => handlePersonalityAnswer(q.id, opt.value)}
                          className={`su-option ${active ? "su-option--active" : ""}`}
                          whileHover={!active ? { x: 3 } : {}}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <span
                            className={`su-option__dot ${active ? "su-option__dot--active" : ""}`}
                          />
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <motion.button
                onClick={() => {
                  track("step_completed", { step: 2 });
                  setStep(STEP.VALUES);
                }}
                disabled={!allPersonalityAnswered}
                style={{ ...S.btnPrimary(allPersonalityAnswered), marginTop: "8px" }}
                whileHover={allPersonalityAnswered ? { scale: 1.01 } : {}}
                whileTap={allPersonalityAnswered ? { scale: 0.99 } : {}}
              >
                {t.next} <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* ── VALUES ───────────────────────────────────── */}
          {step === STEP.VALUES && (
            <motion.div
              key="values"
              className="su-step su-step--wide"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="su-step__header">
                <div className="su-step__label">{t.step3Label}</div>
                <h2 className="su-step__headline">{t.step3Headline}</h2>
              </div>

              {t.valueQuestions.map((q) => (
                <div key={q.id} className="su-question">
                  <div className="su-question__text">{q.question}</div>
                  <div className="su-question__options">
                    {q.options.map((opt) => {
                      const active = values[q.id] === opt.value;
                      return (
                        <motion.button
                          key={opt.value}
                          onClick={() => handleValueAnswer(q.id, opt.value)}
                          className={`su-option ${active ? "su-option--active" : ""}`}
                          whileHover={!active ? { x: 3 } : {}}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <span
                            className={`su-option__dot ${active ? "su-option__dot--active" : ""}`}
                          />
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <motion.button
                onClick={() => {
                  track("step_completed", { step: 3 });
                  setStep(STEP.GATE);
                }}
                disabled={!allValuesAnswered}
                style={{ ...S.btnPrimary(allValuesAnswered), marginTop: "8px" }}
                whileHover={allValuesAnswered ? { scale: 1.01 } : {}}
                whileTap={allValuesAnswered ? { scale: 0.99 } : {}}
              >
                {t.startAnalysis} <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* ── GATE ─────────────────────────────────────── */}
          {step === STEP.GATE && (
            <motion.div
              key="gate"
              className="su-step su-gate"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
              >
                <CheckCircle2 size={52} color="#2D5A3D" strokeWidth={1.5} />
              </motion.div>

              <div className="su-gate__label">{t.gateLabel}</div>
              <h2 className="su-gate__headline">
                {t.gateHeadline[0]}<br />
                <em>{t.gateHeadline[1]}</em>
              </h2>
              <p className="su-gate__body">{t.gateBody}</p>

              <div className="su-field">
                <label style={S.label}>{t.nameLabel}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  style={S.input}
                />
              </div>

              <div className="su-field">
                <label style={S.label}>{t.emailLabel}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  onKeyDown={(e) =>
                    e.key === "Enter" && email.trim() && !loading && submitGate()
                  }
                  style={{ ...S.input, borderColor: error ? "#C0392B" : "#D4C9B0" }}
                />
              </div>

              {error && <p className="su-error">{error}</p>}

              <motion.button
                onClick={submitGate}
                disabled={!email.trim() || loading}
                style={S.btnPrimary(email.trim() && !loading)}
                whileHover={email.trim() && !loading ? { scale: 1.01 } : {}}
                whileTap={email.trim() && !loading ? { scale: 0.99 } : {}}
              >
                {loading ? t.loading : <>{t.submit} <ArrowRight size={14} /></>}
              </motion.button>

              <button
                className="su-skip-btn"
                onClick={skipAndShowResult}
                disabled={loading}
              >
                {t.skipEmail}
              </button>

              <div className="su-privacy">
                <Shield size={12} color="#8A7D65" strokeWidth={1.5} />
                <span>{t.privacyNote}</span>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ───────────────────────────────────── */}
          {step === STEP.RESULT && result && (
            <motion.div
              key="result"
              className="su-step su-step--result"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="su-profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="su-profile-card__label">{t.profileLabel}</div>
                <div className="su-profile-card__headline">{result.headline}</div>
                <div className="su-profile-card__insight">{result.insight}</div>
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
                      <div className="su-path-card__number">{t.pathNumber(i)}</div>
                      <div className="su-path-card__title">{path.title}</div>
                    </div>
                    <div className="su-match-badge">{path.match}% Match</div>
                  </div>
                  <div className="su-path-card__why">{path.why}</div>
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

              <div className="su-result-cta">
                <p className="su-result-cta__text">{t.resultCtaText}</p>
                <a href={t.resultCtaEmail} className="su-result-cta__link">
                  {t.resultCtaLinkText}
                </a>
              </div>

              <motion.button
                onClick={reset}
                style={S.btnSecondary}
                whileHover={{ borderColor: "#8A7D65" }}
              >
                {t.restart}
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`su-footer ${step === STEP.HERO ? "su-footer--hero su-footer--rich" : ""}`}>
        {step === STEP.HERO && (
          <div className="su-footer__trust">
            {t.footerTrustItems.map((item) => (
              <span key={item} className="su-footer__trust-item">{item}</span>
            ))}
          </div>
        )}
        <div className="su-footer__brand-row">
          <div>
            <div className="su-logo__name" style={{ fontSize: "16px" }}>skillingup</div>
            {step === STEP.HERO && (
              <>
                <div className="su-footer__tagline">{t.footerTagline}</div>
                <div className="su-footer__copy">
                  <a href="mailto:hallo@skillingup.de" className="su-footer__mail">
                    {t.footerCopy}
                  </a>
                </div>
              </>
            )}
          </div>
          <div className="su-footer__legal">
            <button
              className="su-footer__legal-btn"
              onClick={() => setLegalModal("impressum")}
            >
              {t.impressum}
            </button>
            <span className="su-footer__legal-sep">·</span>
            <button
              className="su-footer__legal-btn"
              onClick={() => setLegalModal("datenschutz")}
            >
              {t.datenschutz}
            </button>
          </div>
        </div>
      </footer>

      {/* Legal modal */}
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
                  <p>
                    Flavius Kehr<br />
                    Zehntwaldstraße 31<br />
                    76149 Karlsruhe
                  </p>
                  <h3>Kontakt</h3>
                  <p>E-Mail: <a href="mailto:hallo@skillingup.de">hallo@skillingup.de</a></p>
                  <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
                  <p>
                    Flavius Kehr<br />
                    Zehntwaldstraße 31<br />
                    76149 Karlsruhe
                  </p>
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
                  <p>
                    Flavius Kehr<br />
                    Zehntwaldstraße 31<br />
                    76149 Karlsruhe<br />
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
                    Beruf) werden ausschließlich auf unserem eigenen Server gespeichert. Es
                    werden keine externen Formulardienste eingesetzt.
                  </p>
                  <p>
                    <strong>Anthropic, Inc. (anthropic.com):</strong> Dein Profil (Beruf,
                    Persönlichkeits- und Werteangaben) wird zur KI-gestützten Analyse an
                    Anthropic übermittelt. Anthropic verarbeitet diese Daten gemäß ihrer{" "}
                    <a
                      href="https://www.anthropic.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
