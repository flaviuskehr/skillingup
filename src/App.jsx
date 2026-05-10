import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Heart,
  Compass,
  CheckCircle2,
  Shield,
  ArrowRight,
  Mail,
} from "lucide-react";
import "./App.css";

// Create a free form at formspree.io and replace YOUR_FORM_ID below
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const personalityQuestions = [
  {
    id: "energy",
    question: "Wie tankst du Energie auf?",
    options: [
      { label: "Im Austausch mit anderen Menschen", value: "extravert" },
      { label: "In Ruhe, alleine oder in kleiner Runde", value: "introvert" },
    ],
  },
  {
    id: "work",
    question: "Was liegt dir mehr?",
    options: [
      { label: "Konkrete Aufgaben mit klarem Ergebnis", value: "structured" },
      { label: "Offene Probleme, die Kreativität brauchen", value: "creative" },
    ],
  },
  {
    id: "decision",
    question: "Wie triffst du Entscheidungen?",
    options: [
      { label: "Logisch und datenbasiert", value: "analytical" },
      { label: "Aus dem Bauch, mit Blick auf Menschen", value: "empathic" },
    ],
  },
  {
    id: "change",
    question: "Wie gehst du mit Veränderung um?",
    options: [
      { label: "Ich suche aktiv nach Neuem", value: "pioneer" },
      { label: "Ich brauche Zeit um mich anzupassen", value: "steady" },
    ],
  },
];

const valueQuestions = [
  {
    id: "motivation",
    question: "Was motiviert dich am meisten bei der Arbeit?",
    options: [
      { label: "Menschen helfen und begleiten", value: "helping" },
      { label: "Dinge bauen und gestalten", value: "building" },
      { label: "Wissen schaffen und verstehen", value: "learning" },
      { label: "Führen und bewegen", value: "leading" },
    ],
  },
  {
    id: "constraint",
    question: "Was darf dein neuer Weg auf keinen Fall sein?",
    options: [
      { label: "Isoliert, ohne Teamkontakt", value: "no_isolation" },
      { label: "Rein administrativ, ohne Kreativität", value: "no_admin" },
      { label: "Technisch überfordernd", value: "no_tech" },
      { label: "Ohne klare Struktur und Prozesse", value: "no_chaos" },
    ],
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

// Shared style tokens
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

  const allPersonalityAnswered = personalityQuestions.every((q) => personality[q.id]);
  const allValuesAnswered = valueQuestions.every((q) => values[q.id]);

  const handlePersonalityAnswer = (id, value) =>
    setPersonality((p) => ({ ...p, [id]: value }));

  const handleValueAnswer = (id, value) =>
    setValues((v) => ({ ...v, [id]: value }));

  const submitGate = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const prompt = `Du bist ein empathischer Karriereberater mit Expertise in Persönlichkeitspsychologie und Arbeitsmarkttrends.

Eine Person verliert ihren Job durch KI-Automatisierung und sucht einen neuen Weg. Analysiere ihr Profil und gib 3 konkrete, personalisierte Reskilling-Empfehlungen.

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

    const [, claudeResult] = await Promise.allSettled([
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, name, job: currentJob, years: yearsInJob }),
      }),
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.__ENV__?.ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      }),
    ]);

    try {
      if (claudeResult.status === "rejected") throw new Error();
      const data = await claudeResult.value.json();
      if (!data.content?.[0]?.text) throw new Error();
      const parsed = JSON.parse(data.content[0].text.trim());
      setResult(parsed);
      setStep(STEP.RESULT);
    } catch {
      setError("Analyse fehlgeschlagen. Bitte nochmal versuchen.");
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
        <div className="su-logo" onClick={() => step !== STEP.RESULT && reset()} style={{ cursor: step > STEP.HERO ? "pointer" : "default" }}>
          <div className="su-logo__name">skillingup</div>
          <div className="su-logo__tagline">DEIN WEG. DEIN TEMPO.</div>
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
              <motion.div variants={staggerItem}>
                <span className="su-badge">KI-ZEITALTER · RESKILLING MIT PERSÖNLICHKEIT</span>
              </motion.div>

              <motion.h1 className="su-hero__headline" variants={staggerItem}>
                Dein Job verändert sich.<br />
                Finde deinen nächsten Schritt.
              </motion.h1>

              <motion.p className="su-hero__body" variants={staggerItem}>
                Nicht jeder Kurs passt zu jedem Menschen. skillingup analysiert deine
                Persönlichkeit und deine Werte — und zeigt dir den Weg, der wirklich zu dir passt.
              </motion.p>

              <motion.div className="su-trust" variants={staggerItem}>
                {["✓ Kostenlos", "✓ 3 Minuten", "✓ Persönlichkeitspsychologie"].map((t) => (
                  <span key={t} className="su-trust__item">{t}</span>
                ))}
              </motion.div>

              <motion.div variants={staggerItem}>
                <motion.button
                  className="su-btn su-btn--hero"
                  onClick={() => setStep(STEP.JOB)}
                  whileHover={{ scale: 1.02, background: "#234832" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  MEINEN WEG FINDEN <ArrowRight size={16} />
                </motion.button>
              </motion.div>

              <motion.div className="su-features" variants={staggerItem}>
                {[
                  {
                    Icon: Brain,
                    title: "Persönlichkeit",
                    body: "Wir analysieren wie du arbeitest, entscheidest und Energie tankst.",
                  },
                  {
                    Icon: Heart,
                    title: "Werte",
                    body: "Was darf dein nächster Job auf keinen Fall sein? Das fließt in die Analyse ein.",
                  },
                  {
                    Icon: Compass,
                    title: "3 konkrete Wege",
                    body: "Kein generischer Rat. Drei Wege mit erstem Schritt und realistischem Zeitplan.",
                  },
                ].map(({ Icon, title, body }) => (
                  <motion.div
                    key={title}
                    className="su-feature-card"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon size={22} color="#2D5A3D" strokeWidth={1.5} style={{ marginBottom: "10px" }} />
                    <div className="su-feature-card__title">{title}</div>
                    <div className="su-feature-card__body">{body}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── JOB ──────────────────────────────────────── */}
          {step === STEP.JOB && (
            <motion.div key="job" className="su-step" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="su-step__header">
                <div className="su-step__label">SCHRITT 1 VON 3 — DEIN BERUF</div>
                <h2 className="su-step__headline">Wo kommst du her?</h2>
              </div>

              <div className="su-field">
                <label style={S.label}>DEIN AKTUELLER BERUF</label>
                <input
                  value={currentJob}
                  onChange={(e) => setCurrentJob(e.target.value)}
                  placeholder="z.B. Sachbearbeiter, Buchhalter, Kundenberater..."
                  style={S.input}
                  onKeyDown={(e) => e.key === "Enter" && currentJob.trim() && yearsInJob.trim() && setStep(STEP.PERSONALITY)}
                />
              </div>

              <div className="su-field">
                <label style={S.label}>JAHRE IN DIESEM BERUF</label>
                <input
                  value={yearsInJob}
                  onChange={(e) => setYearsInJob(e.target.value)}
                  placeholder="z.B. 8"
                  style={S.input}
                  onKeyDown={(e) => e.key === "Enter" && currentJob.trim() && yearsInJob.trim() && setStep(STEP.PERSONALITY)}
                />
              </div>

              <motion.button
                onClick={() => setStep(STEP.PERSONALITY)}
                disabled={!currentJob.trim() || !yearsInJob.trim()}
                style={S.btnPrimary(currentJob.trim() && yearsInJob.trim())}
                whileHover={currentJob.trim() && yearsInJob.trim() ? { scale: 1.01 } : {}}
                whileTap={currentJob.trim() && yearsInJob.trim() ? { scale: 0.99 } : {}}
              >
                WEITER <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* ── PERSONALITY ──────────────────────────────── */}
          {step === STEP.PERSONALITY && (
            <motion.div key="personality" className="su-step su-step--wide" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="su-step__header">
                <div className="su-step__label">SCHRITT 2 VON 3 — PERSÖNLICHKEIT</div>
                <h2 className="su-step__headline">Wie bist du wirklich?</h2>
              </div>

              {personalityQuestions.map((q) => (
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
                          <span className={`su-option__dot ${active ? "su-option__dot--active" : ""}`} />
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <motion.button
                onClick={() => setStep(STEP.VALUES)}
                disabled={!allPersonalityAnswered}
                style={{ ...S.btnPrimary(allPersonalityAnswered), marginTop: "8px" }}
                whileHover={allPersonalityAnswered ? { scale: 1.01 } : {}}
                whileTap={allPersonalityAnswered ? { scale: 0.99 } : {}}
              >
                WEITER <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* ── VALUES ───────────────────────────────────── */}
          {step === STEP.VALUES && (
            <motion.div key="values" className="su-step su-step--wide" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="su-step__header">
                <div className="su-step__label">SCHRITT 3 VON 3 — WERTE</div>
                <h2 className="su-step__headline">Was zählt für dich?</h2>
              </div>

              {valueQuestions.map((q) => (
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
                          <span className={`su-option__dot ${active ? "su-option__dot--active" : ""}`} />
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <motion.button
                onClick={() => setStep(STEP.GATE)}
                disabled={!allValuesAnswered}
                style={{ ...S.btnPrimary(allValuesAnswered), marginTop: "8px" }}
                whileHover={allValuesAnswered ? { scale: 1.01 } : {}}
                whileTap={allValuesAnswered ? { scale: 0.99 } : {}}
              >
                ANALYSE STARTEN <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* ── GATE ─────────────────────────────────────── */}
          {step === STEP.GATE && (
            <motion.div key="gate" className="su-step su-gate" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
              >
                <CheckCircle2 size={52} color="#2D5A3D" strokeWidth={1.5} />
              </motion.div>

              <div className="su-gate__label">DEINE ANALYSE IST BEREIT</div>
              <h2 className="su-gate__headline">Wohin sollen wir dein Ergebnis schicken?</h2>
              <p className="su-gate__body">
                Gib deine E-Mail-Adresse ein und wir zeigen dir deine drei personalisierten
                Reskilling-Wege — direkt hier, sofort.
              </p>

              <div className="su-field">
                <label style={S.label}>NAME (OPTIONAL)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Wie sollen wir dich nennen?"
                  style={S.input}
                />
              </div>

              <div className="su-field">
                <label style={S.label}>E-MAIL-ADRESSE *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  onKeyDown={(e) => e.key === "Enter" && email.trim() && !loading && submitGate()}
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
                {loading ? (
                  "ANALYSE LÄUFT..."
                ) : (
                  <>
                    MEIN ERGEBNIS ANZEIGEN <ArrowRight size={14} />
                  </>
                )}
              </motion.button>

              <div className="su-privacy">
                <Shield size={12} color="#8A7D65" strokeWidth={1.5} />
                <span>Kein Spam. Wir respektieren deine Privatsphäre.</span>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ───────────────────────────────────── */}
          {step === STEP.RESULT && result && (
            <motion.div key="result" className="su-step su-step--result" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <motion.div
                className="su-profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="su-profile-card__label">DEIN PROFIL</div>
                <div className="su-profile-card__headline">{result.headline}</div>
                <div className="su-profile-card__insight">{result.insight}</div>
              </motion.div>

              <div className="su-paths-label">DEINE 3 WEGE</div>

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
                      <div className="su-path-card__number">WEG {i + 1}</div>
                      <div className="su-path-card__title">{path.title}</div>
                    </div>
                    <div className="su-match-badge">{path.match}% Match</div>
                  </div>
                  <div className="su-path-card__why">{path.why}</div>
                  <div className="su-path-grid">
                    <div className="su-path-detail">
                      <div className="su-path-detail__label">ERSTER SCHRITT</div>
                      <div className="su-path-detail__value su-path-detail__value--green">{path.first_step}</div>
                    </div>
                    <div className="su-path-detail">
                      <div className="su-path-detail__label">ZEITRAUM</div>
                      <div className="su-path-detail__value">{path.time}</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                onClick={reset}
                style={S.btnSecondary}
                whileHover={{ borderColor: "#8A7D65" }}
              >
                NOCHMAL STARTEN
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`su-footer ${step === STEP.HERO ? "su-footer--hero" : ""}`}>
        <span>skillingup.de</span>
        <span className="su-footer__right">
          <Mail size={11} strokeWidth={1.5} style={{ marginRight: "5px", verticalAlign: "middle" }} />
          POWERED BY PSYCHOLOGY + AI
        </span>
      </footer>
    </div>
  );
}
