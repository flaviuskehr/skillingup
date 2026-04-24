import { useState } from "react";

const STEPS = ["job", "personality", "values", "result"];

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

export default function SkillingUp() {
  const [step, setStep] = useState(0);
  const [currentJob, setCurrentJob] = useState("");
  const [yearsInJob, setYearsInJob] = useState("");
  const [personality, setPersonality] = useState({});
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePersonalityAnswer = (questionId, value) => {
    setPersonality((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleValueAnswer = (questionId, value) => {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const allPersonalityAnswered = personalityQuestions.every(
    (q) => personality[q.id]
  );
  const allValuesAnswered = valueQuestions.every((q) => values[q.id]);

  const generateResult = async () => {
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

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      const parsed = JSON.parse(text);
      setResult(parsed);
      setStep(3);
    } catch (err) {
      setError("Analyse fehlgeschlagen. Bitte nochmal versuchen.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setCurrentJob("");
    setYearsInJob("");
    setPersonality({});
    setValues({});
    setResult(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F0E8",
      fontFamily: "'Georgia', serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        padding: "24px 40px",
        borderBottom: "1px solid #D4C9B0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#F5F0E8",
      }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#1A1A1A", letterSpacing: "-0.5px" }}>
            skillingup
          </div>
          <div style={{ fontSize: "11px", color: "#8A7D65", letterSpacing: "2px", marginTop: "2px" }}>
            DEIN WEG. DEIN TEMPO.
          </div>
        </div>
        {step > 0 && step < 3 && (
          <div style={{ display: "flex", gap: "8px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: "32px",
                height: "3px",
                background: i < step ? "#2D5A3D" : i === step ? "#7AB87A" : "#D4C9B0",
                borderRadius: "2px",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        )}
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>

        {/* STEP 0: Landing / Job Input */}
        {step === 0 && (
          <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
            <div style={{
              fontSize: "13px",
              letterSpacing: "3px",
              color: "#8A7D65",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}>
              Reskilling mit Persönlichkeit
            </div>
            <h1 style={{
              fontSize: "38px",
              fontWeight: "700",
              color: "#1A1A1A",
              lineHeight: "1.2",
              marginBottom: "16px",
              letterSpacing: "-1px",
            }}>
              Welcher Weg passt<br />wirklich zu dir?
            </h1>
            <p style={{
              fontSize: "16px",
              color: "#5A5040",
              lineHeight: "1.7",
              marginBottom: "40px",
            }}>
              Nicht jeder Kurs passt zu jedem Menschen. Wir finden den Weg der zu deiner Persönlichkeit, deinen Stärken und deinen Werten passt.
            </p>

            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", letterSpacing: "2px", color: "#8A7D65", display: "block", marginBottom: "8px" }}>
                DEIN AKTUELLER BERUF
              </label>
              <input
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                placeholder="z.B. Sachbearbeiter, Buchhalter, Kundenberater..."
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  fontSize: "16px",
                  fontFamily: "'Georgia', serif",
                  border: "1px solid #D4C9B0",
                  background: "#FBF8F3",
                  color: "#1A1A1A",
                  outline: "none",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ textAlign: "left", marginBottom: "36px" }}>
              <label style={{ fontSize: "12px", letterSpacing: "2px", color: "#8A7D65", display: "block", marginBottom: "8px" }}>
                JAHRE IN DIESEM BERUF
              </label>
              <input
                value={yearsInJob}
                onChange={(e) => setYearsInJob(e.target.value)}
                placeholder="z.B. 8 Jahre"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  fontSize: "16px",
                  fontFamily: "'Georgia', serif",
                  border: "1px solid #D4C9B0",
                  background: "#FBF8F3",
                  color: "#1A1A1A",
                  outline: "none",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!currentJob.trim() || !yearsInJob.trim()}
              style={{
                width: "100%",
                padding: "16px",
                background: currentJob.trim() && yearsInJob.trim() ? "#2D5A3D" : "#D4C9B0",
                color: currentJob.trim() && yearsInJob.trim() ? "#FBF8F3" : "#8A7D65",
                border: "none",
                fontSize: "14px",
                letterSpacing: "2px",
                cursor: currentJob.trim() && yearsInJob.trim() ? "pointer" : "not-allowed",
                borderRadius: "4px",
                fontFamily: "'Georgia', serif",
                transition: "all 0.2s",
              }}
            >
              MEINEN WEG FINDEN →
            </button>
          </div>
        )}

        {/* STEP 1: Personality */}
        {step === 1 && (
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#8A7D65", marginBottom: "10px" }}>
                SCHRITT 1 VON 2 — PERSÖNLICHKEIT
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1A1A1A", letterSpacing: "-0.5px", margin: 0 }}>
                Wie bist du wirklich?
              </h2>
            </div>

            {personalityQuestions.map((q) => (
              <div key={q.id} style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "15px", color: "#1A1A1A", marginBottom: "12px", lineHeight: "1.5" }}>
                  {q.question}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handlePersonalityAnswer(q.id, opt.value)}
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        background: personality[q.id] === opt.value ? "#2D5A3D" : "#FBF8F3",
                        color: personality[q.id] === opt.value ? "#F5F0E8" : "#3A3028",
                        border: `1px solid ${personality[q.id] === opt.value ? "#2D5A3D" : "#D4C9B0"}`,
                        cursor: "pointer",
                        fontSize: "14px",
                        fontFamily: "'Georgia', serif",
                        borderRadius: "4px",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => setStep(2)}
              disabled={!allPersonalityAnswered}
              style={{
                width: "100%",
                padding: "16px",
                background: allPersonalityAnswered ? "#2D5A3D" : "#D4C9B0",
                color: allPersonalityAnswered ? "#FBF8F3" : "#8A7D65",
                border: "none",
                fontSize: "14px",
                letterSpacing: "2px",
                cursor: allPersonalityAnswered ? "pointer" : "not-allowed",
                borderRadius: "4px",
                fontFamily: "'Georgia', serif",
                marginTop: "8px",
              }}
            >
              WEITER →
            </button>
          </div>
        )}

        {/* STEP 2: Values */}
        {step === 2 && (
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#8A7D65", marginBottom: "10px" }}>
                SCHRITT 2 VON 2 — WERTE
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1A1A1A", letterSpacing: "-0.5px", margin: 0 }}>
                Was zählt für dich?
              </h2>
            </div>

            {valueQuestions.map((q) => (
              <div key={q.id} style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "15px", color: "#1A1A1A", marginBottom: "12px", lineHeight: "1.5" }}>
                  {q.question}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleValueAnswer(q.id, opt.value)}
                      style={{
                        padding: "14px 18px",
                        textAlign: "left",
                        background: values[q.id] === opt.value ? "#2D5A3D" : "#FBF8F3",
                        color: values[q.id] === opt.value ? "#F5F0E8" : "#3A3028",
                        border: `1px solid ${values[q.id] === opt.value ? "#2D5A3D" : "#D4C9B0"}`,
                        cursor: "pointer",
                        fontSize: "14px",
                        fontFamily: "'Georgia', serif",
                        borderRadius: "4px",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {error && (
              <div style={{ color: "#C0392B", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
                {error}
              </div>
            )}

            <button
              onClick={generateResult}
              disabled={!allValuesAnswered || loading}
              style={{
                width: "100%",
                padding: "16px",
                background: allValuesAnswered && !loading ? "#2D5A3D" : "#D4C9B0",
                color: allValuesAnswered && !loading ? "#FBF8F3" : "#8A7D65",
                border: "none",
                fontSize: "14px",
                letterSpacing: "2px",
                cursor: allValuesAnswered && !loading ? "pointer" : "not-allowed",
                borderRadius: "4px",
                fontFamily: "'Georgia', serif",
                marginTop: "8px",
              }}
            >
              {loading ? "ANALYSE LÄUFT..." : "MEINEN WEG ANALYSIEREN →"}
            </button>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && result && (
          <div style={{ maxWidth: "680px", width: "100%" }}>
            <div style={{
              background: "#2D5A3D",
              color: "#F5F0E8",
              padding: "32px",
              borderRadius: "4px",
              marginBottom: "28px",
            }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#7AB87A", marginBottom: "12px" }}>
                DEIN PROFIL
              </div>
              <div style={{ fontSize: "22px", fontWeight: "700", lineHeight: "1.3", marginBottom: "16px" }}>
                {result.headline}
              </div>
              <div style={{ fontSize: "14px", lineHeight: "1.7", color: "#C8DFC8", opacity: 0.9 }}>
                {result.insight}
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#8A7D65", marginBottom: "20px" }}>
                DEINE 3 WEGE
              </div>

              {result.paths?.map((path, i) => (
                <div key={i} style={{
                  background: "#FBF8F3",
                  border: "1px solid #D4C9B0",
                  borderRadius: "4px",
                  padding: "24px",
                  marginBottom: "16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#8A7D65", marginBottom: "4px" }}>
                        WEG {i + 1}
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#1A1A1A" }}>
                        {path.title}
                      </div>
                    </div>
                    <div style={{
                      background: "#2D5A3D",
                      color: "#F5F0E8",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}>
                      {path.match}% Match
                    </div>
                  </div>

                  <div style={{ fontSize: "14px", color: "#5A5040", lineHeight: "1.6", marginBottom: "16px" }}>
                    {path.why}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{
                      background: "#F5F0E8",
                      padding: "12px 14px",
                      borderRadius: "4px",
                    }}>
                      <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#8A7D65", marginBottom: "6px" }}>
                        ERSTER SCHRITT
                      </div>
                      <div style={{ fontSize: "13px", color: "#2D5A3D", lineHeight: "1.5" }}>
                        {path.first_step}
                      </div>
                    </div>
                    <div style={{
                      background: "#F5F0E8",
                      padding: "12px 14px",
                      borderRadius: "4px",
                    }}>
                      <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#8A7D65", marginBottom: "6px" }}>
                        ZEITRAUM
                      </div>
                      <div style={{ fontSize: "13px", color: "#1A1A1A", lineHeight: "1.5" }}>
                        {path.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                color: "#8A7D65",
                border: "1px solid #D4C9B0",
                fontSize: "13px",
                letterSpacing: "2px",
                cursor: "pointer",
                borderRadius: "4px",
                fontFamily: "'Georgia', serif",
              }}
            >
              NOCHMAL STARTEN
            </button>
          </div>
        )}
      </main>

      <footer style={{
        padding: "16px 40px",
        borderTop: "1px solid #D4C9B0",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        color: "#8A7D65",
        letterSpacing: "1px",
      }}>
        <span>skillingup.de</span>
        <span>POWERED BY PSYCHOLOGY + AI</span>
      </footer>
    </div>
  );
}
