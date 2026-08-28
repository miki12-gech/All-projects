import { useState } from "react";

const ACCENT = "#f0c040";
const BG = "#0e0e14";
const CARD = "#16161f";
const BORDER = "#2a2a3a";
const TEXT = "#e8e6f0";
const MUTED = "#7a7a9a";

const docTypes = [
  {
    id: "presentation",
    icon: "🎞",
    label: "Presentation",
    desc: "Slide deck with titles, bullets & visuals",
    color: "#7c6fef",
  },
  {
    id: "pdf",
    icon: "📄",
    label: "PDF Report",
    desc: "Structured report with sections & content",
    color: "#ef6f8a",
  },
  {
    id: "word",
    icon: "📝",
    label: "Word Document",
    desc: "Professional document with headings & body",
    color: "#6fbfef",
  },
];

const tones = ["Professional", "Creative", "Academic", "Casual", "Technical"];
const lengths = ["Short (brief)", "Medium (standard)", "Long (detailed)"];

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: `3px solid ${BORDER}`,
          borderTop: `3px solid ${ACCENT}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SlidePreview({ slides }) {
  const [active, setActive] = useState(0);
  if (!slides || !slides.length) return null;
  const slide = slides[active];
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#1a1a2e,#16213e)",
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "2rem",
          minHeight: 220,
          marginBottom: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg,#7c6fef,#ef6f8a)",
          }}
        />
        <div
          style={{
            fontSize: "0.65rem",
            color: "#7c6fef",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Slide {active + 1} / {slides.length}
        </div>
        <div
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: TEXT,
            marginBottom: 12,
            fontFamily: "'Georgia', serif",
          }}
        >
          {slide.title}
        </div>
        {slide.bullets && (
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {slide.bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  color: MUTED,
                  marginBottom: 4,
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                }}
              >
                {b}
              </li>
            ))}
          </ul>
        )}
        {slide.note && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "#ffffff08",
              borderRadius: 6,
              fontSize: "0.78rem",
              color: MUTED,
              fontStyle: "italic",
            }}
          >
            📌 {slide.note}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: `2px solid ${i === active ? "#7c6fef" : BORDER}`,
              background: i === active ? "#7c6fef22" : "transparent",
              color: i === active ? "#7c6fef" : MUTED,
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function DocumentPreview({ content, type }) {
  if (!content) return null;
  return (
    <div
      style={{
        background: "#1a1a2a",
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "1.5rem",
        maxHeight: 420,
        overflowY: "auto",
      }}
    >
      {content.title && (
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: TEXT,
            marginBottom: 16,
            fontFamily: "'Georgia',serif",
            paddingBottom: 12,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {content.title}
        </div>
      )}
      {content.sections &&
        content.sections.map((sec, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontWeight: 600,
                color: type === "pdf" ? "#ef6f8a" : "#6fbfef",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.75rem",
              }}
            >
              {sec.heading}
            </div>
            <div
              style={{
                color: MUTED,
                lineHeight: 1.7,
                fontSize: "0.87rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {sec.body}
            </div>
          </div>
        ))}
    </div>
  );
}

export default function DocMaker() {
  const [docType, setDocType] = useState(null);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium (standard)");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const buildPrompt = () => {
    const lengthMap = {
      "Short (brief)": docType === "presentation" ? "5 slides" : "3 sections",
      "Medium (standard)":
        docType === "presentation" ? "8 slides" : "5 sections",
      "Long (detailed)":
        docType === "presentation" ? "12 slides" : "8 sections",
    };
    const sizeHint = lengthMap[length];

    if (docType === "presentation") {
      return `Create a ${tone.toLowerCase()} presentation on: "${topic}".
Generate exactly ${sizeHint}. Each slide needs a clear title, 3-5 bullet points, and an optional speaker note.
${extraInstructions ? `Extra instructions: ${extraInstructions}` : ""}
Respond ONLY with a valid JSON object in this format (no markdown, no extra text):
{"slides":[{"title":"...","bullets":["...","..."],"note":"..."},...]}`;
    } else {
      return `Create a ${tone.toLowerCase()} ${
        docType === "pdf" ? "PDF report" : "Word document"
      } on: "${topic}".
Generate a document with a title and exactly ${sizeHint}. Each section has a heading and detailed body paragraphs.
${extraInstructions ? `Extra instructions: ${extraInstructions}` : ""}
Respond ONLY with a valid JSON object in this format (no markdown, no extra text):
{"title":"...","sections":[{"heading":"...","body":"..."},...]}`;
    }
  };

  const generate = async () => {
    if (!docType || !topic.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      // ✅ NEW — calls your own Vercel backend
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(), docType }),
      });
   
      const data = await res.json();
      const raw = data.content?.map((c) => c.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportTxt = () => {
    if (!result) return;
    let text = "";
    if (result.slides) {
      result.slides.forEach((s, i) => {
        text += `SLIDE ${i + 1}: ${s.title}\n`;
        s.bullets?.forEach((b) => (text += `  • ${b}\n`));
        if (s.note) text += `  Note: ${s.note}\n`;
        text += "\n";
      });
    } else {
      text = `${result.title}\n${"=".repeat(result.title?.length || 0)}\n\n`;
      result.sections?.forEach((s) => {
        text += `${s.heading}\n${"-".repeat(s.heading.length)}\n${s.body}\n\n`;
      });
    }
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${topic.slice(0, 30).replace(/\s+/g, "_")}_${docType}.txt`;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "0 0 4rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#11111a",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: `linear-gradient(135deg,${ACCENT},#e08020)`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
          }}
        >
          ✦
        </div>
        <div>
          <div
            style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: -0.3 }}
          >
            DocForge AI
          </div>
          <div style={{ color: MUTED, fontSize: "0.72rem" }}>
            Presentations · PDFs · Word Documents
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Step 1 */}
        <div style={{ marginBottom: "2rem" }}>
          <StepLabel n={1} label="Choose document type" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {docTypes.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setDocType(d.id);
                  setResult(null);
                }}
                style={{
                  background:
                    docType === d.id ? `${d.color}18` : CARD,
                  border: `2px solid ${docType === d.id ? d.color : BORDER}`,
                  borderRadius: 12,
                  padding: "1.1rem 0.8rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  color: TEXT,
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{d.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: docType === d.id ? d.color : TEXT,
                    marginBottom: 4,
                  }}
                >
                  {d.label}
                </div>
                <div style={{ fontSize: "0.72rem", color: MUTED, lineHeight: 1.4 }}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: "1.5rem" }}>
          <StepLabel n={2} label="Describe your topic" />
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The future of renewable energy in Africa, Marketing strategy for a new SaaS product, Machine learning fundamentals..."
            rows={3}
            style={{
              width: "100%",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              color: TEXT,
              fontSize: "0.9rem",
              padding: "0.85rem 1rem",
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Step 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
          <div>
            <StepLabel n={3} label="Tone" small />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: `1px solid ${tone === t ? ACCENT : BORDER}`,
                    background: tone === t ? `${ACCENT}18` : "transparent",
                    color: tone === t ? ACCENT : MUTED,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    fontWeight: tone === t ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <StepLabel n={4} label="Length" small />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: `1px solid ${length === l ? ACCENT : BORDER}`,
                    background: length === l ? `${ACCENT}18` : "transparent",
                    color: length === l ? ACCENT : MUTED,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: length === l ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Extra instructions */}
        <div style={{ marginBottom: "1.8rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", color: MUTED, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Extra instructions (optional)
          </label>
          <input
            value={extraInstructions}
            onChange={(e) => setExtraInstructions(e.target.value)}
            placeholder="e.g. Include statistics, focus on Gen Z audience, add a conclusion..."
            style={{
              width: "100%",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              color: TEXT,
              fontSize: "0.85rem",
              padding: "0.7rem 1rem",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={!docType || !topic.trim() || loading}
          style={{
            width: "100%",
            padding: "0.95rem",
            borderRadius: 10,
            border: "none",
            background:
              !docType || !topic.trim()
                ? "#2a2a3a"
                : `linear-gradient(135deg,${ACCENT},#e08020)`,
            color: !docType || !topic.trim() ? MUTED : "#111",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: !docType || !topic.trim() ? "not-allowed" : "pointer",
            letterSpacing: 0.3,
            transition: "all 0.2s",
            marginBottom: "2rem",
          }}
        >
          {loading ? "Generating..." : "✦ Generate Document"}
        </button>

        {loading && <Spinner />}

        {error && (
          <div
            style={{
              background: "#2a1a1a",
              border: "1px solid #5a2020",
              borderRadius: 10,
              padding: "1rem",
              color: "#ef6f8a",
              fontSize: "0.87rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "1rem", color: ACCENT }}>
                ✓ Your{" "}
                {docType === "presentation"
                  ? "Presentation"
                  : docType === "pdf"
                  ? "PDF Report"
                  : "Word Document"}{" "}
                is ready
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={copyAll}
                  style={btnStyle("#2a2a3a", BORDER, MUTED)}
                >
                  {copied ? "✓ Copied" : "Copy JSON"}
                </button>
                <button
                  onClick={exportTxt}
                  style={btnStyle(`${ACCENT}18`, ACCENT, ACCENT)}
                >
                  ↓ Export .txt
                </button>
              </div>
            </div>

            {docType === "presentation" && result.slides ? (
              <SlidePreview slides={result.slides} />
            ) : (
              <DocumentPreview content={result} type={docType} />
            )}

            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "#1a1a2a",
                borderRadius: 8,
                fontSize: "0.75rem",
                color: MUTED,
                border: `1px solid ${BORDER}`,
              }}
            >
              💡 Export as .txt to copy into PowerPoint, Word, or any PDF maker.
              You can also hit Generate again with different settings!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepLabel({ n, label, small }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: small ? 8 : 12,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: ACCENT,
          color: "#111",
          fontSize: "0.65rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontSize: small ? "0.75rem" : "0.82rem",
          fontWeight: 600,
          color: MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function btnStyle(bg, border, color) {
  return {
    padding: "6px 14px",
    borderRadius: 7,
    border: `1px solid ${border}`,
    background: bg,
    color: color,
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}