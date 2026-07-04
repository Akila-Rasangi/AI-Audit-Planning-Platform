import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg: "#f7f5f0",
  surface: "#ffffff",
  surfaceAlt: "#f0ede6",
  border: "#d4cfc4",
  borderDark: "#b8b0a0",
  ink: "#1a1614",
  inkMid: "#4a423c",
  inkLight: "#8a7f76",
  inkFaint: "#c4bdb4",
  gold: "#8b6914",
  goldLight: "#c49a1e",
  goldBg: "#fdf8ed",
  goldBorder: "#e8d08a",
  red: "#8b1a1a",
  redBg: "#fdf0f0",
  green: "#1a5c2e",
  greenBg: "#f0f7f2",
  blue: "#1a3a6b",
  blueBg: "#f0f4fb",
  stamp: "#c41e1e",
};

// ─────────────────────────────────────────────────────────────────────────────
// TINY UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.inkLight, marginBottom: 6, fontFamily: "'Georgia', serif" }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    {label && <Label>{label}</Label>}
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%", boxSizing: "border-box",
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 3, padding: "9px 12px",
      fontSize: 13, color: C.ink, fontFamily: "'Georgia', serif",
      outline: "none",
    }}
  />
);

const TextArea = ({ value, onChange, rows = 4, placeholder }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    style={{
      width: "100%", boxSizing: "border-box",
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 3, padding: "9px 12px",
      fontSize: 13, color: C.ink, fontFamily: "'Georgia', serif",
      outline: "none", resize: "vertical", lineHeight: 1.7,
    }}
  />
);

const Dropdown = ({ value, onChange, options, placeholder = "Select…" }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      width: "100%", boxSizing: "border-box",
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 3, padding: "9px 12px",
      fontSize: 13, color: value ? C.ink : C.inkLight,
      fontFamily: "'Georgia', serif", outline: "none",
    }}
  >
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Btn = ({ onClick, disabled, variant = "primary", children, small, fullWidth }) => {
  const v = {
    primary:   { bg: C.gold,    color: "#fff",    border: C.gold },
    secondary: { bg: "transparent", color: C.gold, border: C.gold },
    ghost:     { bg: "transparent", color: C.inkMid, border: C.border },
    danger:    { bg: "transparent", color: C.red,  border: C.red },
    success:   { bg: C.green,   color: "#fff",    border: C.green },
    stamp:     { bg: C.stamp,   color: "#fff",    border: C.stamp },
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v.bg, color: v.color,
        border: `1.5px solid ${v.border}`,
        borderRadius: 3,
        padding: small ? "6px 14px" : "10px 24px",
        fontSize: small ? 11 : 12,
        fontWeight: 700, letterSpacing: 0.8,
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontFamily: "'Georgia', serif",
        width: fullWidth ? "100%" : "auto",
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
};

const Pill = ({ color = C.gold, bg, children }) => (
  <span style={{
    background: bg || color + "18", color,
    border: `1px solid ${color}40`,
    borderRadius: 2, padding: "2px 8px",
    fontSize: 10, fontWeight: 700,
    letterSpacing: 1.2, textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
  }}>{children}</span>
);

const Radio = ({ value, current, onChange, label }) => (
  <button
    onClick={() => onChange(value)}
    style={{
      padding: "7px 16px", borderRadius: 3,
      border: `1.5px solid ${current === value ? C.gold : C.border}`,
      background: current === value ? C.goldBg : "transparent",
      color: current === value ? C.gold : C.inkMid,
      fontSize: 12, fontWeight: 700, cursor: "pointer",
      fontFamily: "'Georgia', serif", letterSpacing: 0.5,
    }}
  >{label}</button>
);

const RadioGroup = ({ label, value, onChange, options }) => (
  <Field label={label}>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map(o => <Radio key={o.value} value={o.value} current={value} onChange={onChange} label={o.label} />)}
    </div>
  </Field>
);

const HR = () => <div style={{ borderTop: `1px solid ${C.border}`, margin: "24px 0" }} />;

const Card = ({ children, accent, style: s }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderLeft: accent ? `3px solid ${accent}` : undefined,
    borderRadius: 4, padding: "20px 24px", marginBottom: 16,
    ...s,
  }}>{children}</div>
);

const SectionHead = ({ title, sub, action }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "'Georgia', serif" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>{sub}</div>}
    </div>
    {action}
  </div>
);

// Collapsible
const Accordion = ({ title, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: C.surfaceAlt, border: "none",
        padding: "13px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", cursor: "pointer",
        fontFamily: "'Georgia', serif", fontSize: 13, fontWeight: 700, color: C.ink,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {title} {badge && <Pill>{badge}</Pill>}
        </span>
        <span style={{ fontSize: 11, color: C.inkLight }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "20px 24px", background: C.surface }}>{children}</div>}
    </div>
  );
};

// AI output panel
const AIPanel = ({ content, loading, title = "AI Analysis" }) => (
  <div style={{
    background: C.goldBg, border: `1px solid ${C.goldBorder}`,
    borderRadius: 4, padding: "20px 24px", marginTop: 16,
  }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
      textTransform: "uppercase", color: C.gold,
      fontFamily: "'Georgia', serif", marginBottom: 14,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: loading ? C.goldLight : C.green,
        display: "inline-block",
        animation: loading ? "blink 1.2s infinite" : "none",
      }} />
      {title} — {loading ? "Processing…" : "Complete"}
    </div>
    {loading
      ? <div style={{ color: C.inkLight, fontSize: 13, fontStyle: "italic" }}>Please wait while the AI analyses your data against current standards…</div>
      : <div style={{ color: C.ink, fontSize: 13, lineHeight: 1.85, whiteSpace: "pre-wrap", fontFamily: "'Georgia', serif" }}>{content}</div>
    }
    <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP NAVIGATOR
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Client Setup" },
  { id: 2, label: "Risk Questionnaire" },
  { id: 3, label: "Financials & Ratios" },
  { id: 4, label: "Audit Plan" },
  { id: 5, label: "Approval" },
  { id: 6, label: "Audit Programs" },
];

const StepBar = ({ current, completed }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 36, overflowX: "auto" }}>
    {STEPS.map((s, i) => {
      const done = completed.includes(s.id);
      const active = current === s.id;
      return (
        <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              border: `2px solid ${done ? C.green : active ? C.gold : C.border}`,
              background: done ? C.greenBg : active ? C.goldBg : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: done ? C.green : active ? C.gold : C.inkFaint,
              fontSize: 11, fontWeight: 700, fontFamily: "'Georgia', serif",
            }}>
              {done ? "✓" : s.id}
            </div>
            <div style={{
              fontSize: 9.5, letterSpacing: 0.8, textTransform: "uppercase",
              color: active ? C.gold : done ? C.green : C.inkFaint,
              fontWeight: active || done ? 700 : 400,
              whiteSpace: "nowrap", fontFamily: "'Georgia', serif",
            }}>{s.label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 48, height: 1.5, background: done ? C.green : C.border, margin: "0 6px", marginBottom: 20, flexShrink: 0 }} />
          )}
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OLLAMA AI — via backend proxy (no API key needed)
// ─────────────────────────────────────────────────────────────────────────────
// OLLAMA API — Free, runs locally, no API key needed
// ─────────────────────────────────────────────────────────────────────────────
async function callClaude(system, user) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user }),
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);

      if (!res.ok) {
        return `AI Error: ${data.error || "Request failed"}`;
      }

      return data.response || "No response received.";
    } catch {
      return `Backend returned non-JSON response.\n\nURL: ${API_BASE}/api/ai/generate\n\nResponse starts with:\n${text.substring(0, 200)}`;
    }
  } catch (e) {
    return `Cannot connect to backend API.\n\nError: ${e.message}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_URL;
const API_TOKEN = process.env.REACT_APP_LIBRARY_TOKEN;

async function saveLibrary(lib) {
  try {
    await fetch(`${API_BASE}/api/library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-library-token": API_TOKEN,
      },
      body: JSON.stringify({
        data: lib,
        updatedBy: lib.updatedBy || "Q&A Manager",
      }),
    });
  } catch (e) {
    console.error("Library save failed:", e);
  }
}

async function loadLibrary() {
  try {
    const res = await fetch(`${API_BASE}/api/library`, {
      headers: { "x-library-token": API_TOKEN },
    });
    const json = await res.json();
    if (!json.library || Object.keys(json.library).length === 0) {
      return null;
    }
    return json.library;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT LIBRARY STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
const defaultLibrary = {
  lastUpdated: "",
  updatedBy: "",
  knowledgeCutoffNote: "Claude's built-in knowledge of SLAuS, SLFRS, IFRS, and IAS is current to approximately mid-2025. Any standards, amendments, or CA Sri Lanka circulars issued after that date must be manually added below by the Q&A Manager.",
  // Standards updates panel
  standardsUpdates: "",
  // Firm documents (stored as text after reading)
  auditPrograms: {
    ppe: "", intangibles: "", inventory: "", receivables: "",
    cash: "", payables: "", revenue: "", equity: "", borrowings: "",
    opex: "", tax: "", managementOverride: "", goingConcern: "",
  },
  materiality: "",
  riskProfiles: "",
  otherDocs: "",
  // Firm settings
  firmName: "BakerTilly Edirisinghe & Co.",
  methodology: "Global Focus Version 08",
  password: "admin2024",
};

// ─────────────────────────────────────────────────────────────────────────────
// ── ADMIN LIBRARY TOOL ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AdminLibrary({ onClose }) {
  const [lib, setLib] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("standards");
  const fileRefs = useRef({});

  useEffect(() => {
    loadLibrary().then(l => setLib(l || { ...defaultLibrary }));
  }, []);

  const update = (path, val) => {
    setLib(prev => {
      const next = { ...prev };
      if (path.includes(".")) {
        const [a, b] = path.split(".");
        next[a] = { ...next[a], [b]: val };
      } else {
        next[path] = val;
      }
      return next;
    });
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    const updated = { ...lib, lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) };
    await saveLibrary(updated);
    setLib(updated);
    setSaving(false);
    setSaved(true);
  };

  const readFile = (key, nested) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (nested) update(`${nested}.${key}`, `[File: ${file.name}]\n\n${text.substring(0, 8000)}`);
    else update(key, `[File: ${file.name}]\n\n${text.substring(0, 8000)}`);
  };

  const TABS = [
    { id: "standards", label: "Standards & Updates" },
    { id: "programs", label: "Audit Programs" },
    { id: "materiality", label: "Materiality & Risk" },
    { id: "settings", label: "Firm Settings" },
  ];

  if (!lib) return <div style={{ padding: 40, color: C.inkLight, fontFamily: "'Georgia', serif" }}>Loading library…</div>;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: C.ink, padding: "0 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: C.goldLight, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>
              {lib.firmName} · Q&A Manager Portal
            </div>
            <div style={{ fontSize: 19, color: "#fff", fontWeight: 400 }}>Knowledge Library & Standards Centre</div>
            <div style={{ fontSize: 11, color: "#ffffff60", marginTop: 2 }}>{lib.methodology}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            {lib.lastUpdated && (
              <div style={{ fontSize: 11, color: "#ffffff80", marginBottom: 8 }}>
                Last updated: {lib.lastUpdated}<br />
                {lib.updatedBy && `By: ${lib.updatedBy}`}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {saved && <span style={{ fontSize: 11, color: C.goldLight, alignSelf: "center" }}>✓ Saved</span>}
              <Btn variant="primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Library"}
              </Btn>
              <Btn variant="ghost" onClick={onClose} small>← Back to Planning</Btn>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge cutoff banner */}
      <div style={{ background: C.goldBg, borderBottom: `1px solid ${C.goldBorder}`, padding: "12px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", fontSize: 12, color: C.gold, lineHeight: 1.6 }}>
          <strong>⚠ Knowledge Currency Notice:</strong> {lib.knowledgeCutoffNote}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "13px 20px",
              border: "none", borderBottom: `2.5px solid ${activeTab === t.id ? C.gold : "transparent"}`,
              background: "transparent",
              color: activeTab === t.id ? C.gold : C.inkMid,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Georgia', serif", letterSpacing: 0.5,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 40px" }}>

        {/* TAB: Standards & Updates */}
        {activeTab === "standards" && (
          <div>
            <SectionHead
              title="Standards Updates Panel"
              sub="Paste any new CA Sri Lanka circulars, IAASB updates, IASB amendments, or regulatory notices here. This text is injected into every AI call in the planning tool, ensuring all AI outputs reference the latest guidance."
            />

            <Card accent={C.gold}>
              <Label>What Claude already knows (built-in, up to mid-2025)</Label>
              <div style={{ fontSize: 12, color: C.inkMid, lineHeight: 1.8, marginBottom: 16 }}>
                ✓ SLAuS (all standards, based on ISAs) &nbsp;·&nbsp;
                ✓ SLFRS for SMEs &nbsp;·&nbsp;
                ✓ Full SLFRSs / IFRSs &nbsp;·&nbsp;
                ✓ LKASs / IASs &nbsp;·&nbsp;
                ✓ Companies Act No. 7 of 2007 &nbsp;·&nbsp;
                ✓ EPF/ETF Act &nbsp;·&nbsp;
                ✓ BOI regulations &nbsp;·&nbsp;
                ✓ CSE Listing Rules &nbsp;·&nbsp;
                ✓ CBSL prudential requirements &nbsp;·&nbsp;
                ✓ BakerTilly Global Focus methodology
              </div>
              <div style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>
                ⚠ Any updates after mid-2025 must be added manually below.
              </div>
            </Card>

            <HR />

            <Field label="Standards Updates, CA Sri Lanka Circulars & New Amendments (paste text below)">
              <TextArea
                value={lib.standardsUpdates}
                onChange={v => update("standardsUpdates", v)}
                rows={14}
                placeholder={`Paste content here. Examples:\n\n[CA Sri Lanka Circular - January 2026]\nSubject: Amendment to SLAuS 600 — Special Considerations - Audits of Group Financial Statements\nSummary: ...\n\n[IAASB - December 2025]\nISA 240 (Revised) — The Auditor's Responsibilities Relating to Fraud in an Audit of Financial Statements now requires...\n\n[IASB Amendment - 2025]\nIFRS 18 Presentation and Disclosure in Financial Statements effective 1 January 2027 — early adoption permitted...`}
              />
            </Field>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                style={{ display: "none" }}
                ref={el => fileRefs.current["standards"] = el}
                onChange={readFile("standardsUpdates")}
              />
              <Btn variant="secondary" small onClick={() => fileRefs.current["standards"].click()}>
                Upload Standards Document
              </Btn>
              <span style={{ fontSize: 11, color: C.inkLight }}>.txt, .pdf, .docx supported</span>
            </div>

            <HR />
            <Field label="Updated By (Q&A Manager Name)">
              <TextInput value={lib.updatedBy} onChange={v => update("updatedBy", v)} placeholder="e.g. Malini Perera, Q&A Manager" />
            </Field>
          </div>
        )}

        {/* TAB: Audit Programs */}
        {activeTab === "programs" && (
          <div>
            <SectionHead
              title="Firm Audit Programs"
              sub="Upload or paste your firm's standard audit programs for each area. The planning tool will reference these when generating engagement-specific programs."
            />

            {[
              { key: "ppe", label: "Property, Plant & Equipment" },
              { key: "intangibles", label: "Intangible Assets" },
              { key: "inventory", label: "Inventories" },
              { key: "receivables", label: "Trade Receivables" },
              { key: "cash", label: "Cash & Cash Equivalents" },
              { key: "payables", label: "Trade Payables & Accruals" },
              { key: "revenue", label: "Revenue" },
              { key: "equity", label: "Equity" },
              { key: "borrowings", label: "Borrowings & Debt" },
              { key: "opex", label: "Operating Expenses & Payroll" },
              { key: "tax", label: "Income Tax (Current & Deferred)" },
              { key: "managementOverride", label: "Management Override of Controls (SLAuS 240)" },
              { key: "goingConcern", label: "Going Concern (SLAuS 570)" },
            ].map(item => (
              <Accordion key={item.key} title={item.label} defaultOpen={false}>
                <Field label={`${item.label} Audit Program`}>
                  <TextArea
                    value={lib.auditPrograms[item.key]}
                    onChange={v => update(`auditPrograms.${item.key}`, v)}
                    rows={8}
                    placeholder={`Paste your firm's standard ${item.label} audit program here…`}
                  />
                </Field>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  style={{ display: "none" }}
                  ref={el => fileRefs.current[item.key] = el}
                  onChange={readFile(item.key, "auditPrograms")}
                />
                <Btn variant="secondary" small onClick={() => fileRefs.current[item.key].click()}>
                  Upload {item.label} Program
                </Btn>
                {lib.auditPrograms[item.key] && (
                  <span style={{ marginLeft: 12, fontSize: 11, color: C.green }}>✓ Program loaded ({lib.auditPrograms[item.key].length} chars)</span>
                )}
              </Accordion>
            ))}
          </div>
        )}

        {/* TAB: Materiality & Risk */}
        {activeTab === "materiality" && (
          <div>
            <SectionHead
              title="Materiality Methodology & Risk Profiles"
              sub="Upload your BakerTilly Global Focus materiality methodology and any firm-specific industry risk profiles."
            />

            <Field label="Materiality Methodology (Global Focus)">
              <TextArea
                value={lib.materiality}
                onChange={v => update("materiality", v)}
                rows={10}
                placeholder="Paste or upload your materiality methodology document…"
              />
            </Field>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              <input type="file" accept=".txt,.pdf,.docx" style={{ display: "none" }}
                ref={el => fileRefs.current["materiality"] = el}
                onChange={readFile("materiality")} />
              <Btn variant="secondary" small onClick={() => fileRefs.current["materiality"].click()}>Upload Materiality Doc</Btn>
              {lib.materiality && <span style={{ fontSize: 11, color: C.green }}>✓ Loaded</span>}
            </div>

            <HR />

            <Field label="Industry Risk Profiles (firm experience — used in risk questionnaire)">
              <TextArea
                value={lib.riskProfiles}
                onChange={v => update("riskProfiles", v)}
                rows={10}
                placeholder={`Document your firm's risk knowledge by industry. For example:\n\nMANUFACTURING: Key risks — inventory valuation, cut-off, cost allocation, BOI compliance...\nNFP: Key risks — donor fund restriction adherence, grant compliance, cash controls...\nTRADING: Key risks — FX exposure, goods in transit cut-off, supplier credit terms...`}
              />
            </Field>

            <HR />

            <Field label="Other Firm Documents (Any additional reference material)">
              <TextArea
                value={lib.otherDocs}
                onChange={v => update("otherDocs", v)}
                rows={6}
                placeholder="Any other firm policies, templates, or reference documents…"
              />
            </Field>
          </div>
        )}

        {/* TAB: Settings */}
        {activeTab === "settings" && (
          <div>
            <SectionHead title="Firm Settings" sub="Configure firm-level settings for the planning tool." />
            <Field label="Firm Name"><TextInput value={lib.firmName} onChange={v => update("firmName", v)} /></Field>
            <Field label="Methodology Name"><TextInput value={lib.methodology} onChange={v => update("methodology", v)} /></Field>
            <Field label="Admin Password (protects this library from trainee access)">
              <TextInput value={lib.password} onChange={v => update("password", v)} type="password" />
            </Field>
            <Card accent={C.blue} style={{ background: C.blueBg }}>
              <div style={{ fontSize: 12, color: C.blue, lineHeight: 1.8 }}>
                <strong>Access Control:</strong> This Library is password-protected. Only partners and the Q&A Manager should know this password. Planning staff access the main planning tool only — they cannot view or edit the library.<br /><br />
                The planning tool automatically loads all library content (standards updates, audit programs, risk profiles) into every AI call, without exposing the raw documents to planning staff.
              </div>
            </Card>
          </div>
        )}

        <HR />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          {saved && <span style={{ fontSize: 12, color: C.green, alignSelf: "center" }}>✓ Library saved successfully</span>}
          <Btn onClick={save} disabled={saving}>{saving ? "Saving…" : "Save All Changes"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PLANNING TOOL ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function PlanningTool({ library, onOpenAdmin }) {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  // Engagement standards update (per-session, entered by manager)
  const [sessionUpdates, setSessionUpdates] = useState("");
  const [showSessionPanel, setShowSessionPanel] = useState(false);

  // Step 1
  const [client, setClient] = useState({ name: "", regNo: "", fy: "", entityType: "", industry: "", manager: "", partner: "", senior: "", assistant: "", engagement: "continuation", framework: "", uploads: [] });

  // Step 2
  const [riskAnswers, setRiskAnswers] = useState({});
  const [riskAI, setRiskAI] = useState("");

  // Step 3
  const [fin, setFin] = useState({ revenue: "", costOfSales: "", grossProfit: "", opEx: "", pbt: "", pat: "", totalAssets: "", currentAssets: "", cash: "", inventory: "", receivables: "", totalLiabilities: "", currentLiabilities: "", equity: "", priorRevenue: "", priorPbt: "", priorTotalAssets: "", priorEquity: "", notes: "" });
  const [ratiosAI, setRatiosAI] = useState("");
  const [mat, setMat] = useState({ benchmark: "", percentage: "", om: "", pm: "", ct: "", justification: "" });

  // Step 4
  const [planAI, setPlanAI] = useState("");
  const [editedPlan, setEditedPlan] = useState("");

  // Step 5
  const [approvalStatus, setApprovalStatus] = useState("");
  const [managerComments, setManagerComments] = useState("");

  // Step 6
  const [programsAI, setProgramsAI] = useState("");

  const complete = id => setCompleted(p => p.includes(id) ? p : [...p, id]);
  const setC = k => v => setClient(p => ({ ...p, [k]: v }));
  const setF = k => v => setFin(p => ({ ...p, [k]: v }));

  // Build the system context that includes library content
  const buildSystemContext = (role) => {
    const lib = library || defaultLibrary;
    const programs = Object.entries(lib.auditPrograms || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `[FIRM AUDIT PROGRAM — ${k.toUpperCase()}]\n${v.substring(0, 600)}`)
      .join("\n\n");

    const updates = [lib.standardsUpdates, sessionUpdates].filter(Boolean).join("\n\n");

    return `You are a senior audit professional at ${lib.firmName}, Sri Lanka.
You apply the ${lib.methodology} audit planning methodology.
You operate under SLAuS (Sri Lanka Auditing Standards, based on ISAs), SLFRS, LKAS, and relevant Sri Lanka regulations including the Companies Act No. 7 of 2007, EPF/ETF Act, BOI regulations, and CSE Listing Rules.

KNOWLEDGE CURRENCY:
Claude's built-in knowledge covers SLAuS, IFRS, IAS, SLFRS up to approximately mid-2025. Always apply the most current versions of standards known to you. Flag any areas where post-2025 updates may be relevant.

${updates ? `STANDARDS UPDATES & NEW GUIDANCE (added by Q&A Manager — treat as authoritative):\n${updates}\n` : ""}
${lib.materiality ? `FIRM MATERIALITY METHODOLOGY:\n${lib.materiality.substring(0, 800)}\n` : ""}
${lib.riskProfiles ? `FIRM INDUSTRY RISK PROFILES:\n${lib.riskProfiles.substring(0, 600)}\n` : ""}
${programs ? `FIRM AUDIT PROGRAMS (reference these when generating procedures):\n${programs}\n` : ""}
${lib.otherDocs ? `OTHER FIRM DOCUMENTS:\n${lib.otherDocs.substring(0, 400)}\n` : ""}

Your role: ${role}
Always cite relevant SLAuS standards. Be specific to the Sri Lanka economic and regulatory context. Reference CA Sri Lanka guidance where applicable.`;
  };

  // ── Risk questions (dynamic) ──────────────────────────────────────────────
  const getQuestions = () => {
    const base = [
      { id: "q1", section: "Control Environment", text: "Is management integrity and ethical conduct considered high, based on your experience with this client?", type: "risk3" },
      { id: "q2", section: "Control Environment", text: "Is there adequate segregation of duties in finance and accounting functions?", type: "risk3" },
      { id: "q3", section: "Control Environment", text: "Are those charged with governance (board/directors) independent from management?", type: "risk3" },
      { id: "q4", section: "Control Environment", text: "Is there a risk of management override of controls? (Always a significant risk per SLAuS 240)", type: "risk3" },
      { id: "q5", section: "Control Environment", text: "Are accounting personnel adequately competent and supervised?", type: "risk3" },
      { id: "q6", section: "Control Environment", text: "Is there an internal audit function or audit committee?", type: "yesno" },
      { id: "q7", section: "Going Concern", text: "Are there any indicators of going concern difficulty (losses, overdrafts, negative equity, loan covenant breaches)?", type: "yesno" },
      { id: "q8", section: "Going Concern", text: "Has the entity breached any loan covenants or banking arrangements during the year?", type: "yesno" },
      { id: "q9", section: "Going Concern", text: "Is the entity dependent on a small number of customers or suppliers?", type: "risk3" },
      { id: "q10", section: "Related Parties & Fraud", text: "Are there significant related party transactions? Are they conducted at arm's length?", type: "risk3" },
      { id: "q11", section: "Related Parties & Fraud", text: "Have any fraud risks or irregularities been identified in prior years?", type: "yesno" },
      { id: "q12", section: "Related Parties & Fraud", text: "Is there pressure on management to meet revenue or profit targets?", type: "yesno" },
      { id: "q13", section: "Revenue & Recognition", text: "Is revenue recognition straightforward, or are there complex arrangements (multiple performance obligations, variable consideration, long-term contracts)?", type: "risk3" },
      { id: "q14", section: "Revenue & Recognition", text: "Are there unusual revenue transactions near year-end that could indicate cut-off issues?", type: "yesno" },
      { id: "q15", section: "Regulatory & Compliance", text: "Is the entity compliant with EPF/ETF obligations?", type: "yesno" },
      { id: "q16", section: "Regulatory & Compliance", text: "Are there outstanding tax disputes or Inland Revenue Department (IRD) assessments?", type: "yesno" },
      { id: "q17", section: "Regulatory & Compliance", text: "Is the entity subject to sector-specific regulation (CBSL, SEC, Insurance Board, etc.)?", type: "yesno" },
      { id: "q18", section: "IT & Information Systems", text: "Does the entity use accounting software? Is it adequately controlled?", type: "risk3" },
      { id: "q19", section: "IT & Information Systems", text: "Are there IT general controls in place (access controls, backups, change management)?", type: "risk3" },
    ];

    const extra = [];
    const et = client.entityType;
    const ind = client.industry;

    if (et === "listed") extra.push(
      { id: "ql1", section: "Listed Company — CSE", text: "Have all related party transactions been disclosed per CSE Listing Rules and Section 9 of the Listing Rules?", type: "yesno" },
      { id: "ql2", section: "Listed Company — CSE", text: "Has the entity met CSE quarterly reporting deadlines?", type: "yesno" },
      { id: "ql3", section: "Listed Company — CSE", text: "Has the entity complied with mandatory dividend and corporate governance requirements?", type: "yesno" },
      { id: "ql4", section: "Listed Company — CSE", text: "Are there any ongoing SEC investigations or regulatory queries?", type: "yesno" },
    );

    if (et === "nfp") extra.push(
      { id: "qn1", section: "Not-for-Profit — Specific", text: "Are donor fund restrictions being properly tracked, segregated, and honoured?", type: "risk3" },
      { id: "qn2", section: "Not-for-Profit — Specific", text: "Have grant agreements and donor-specific reporting conditions been reviewed and met?", type: "risk3" },
      { id: "qn3", section: "Not-for-Profit — Specific", text: "Is there adequate segregation between restricted and unrestricted funds in the accounting system?", type: "risk3" },
      { id: "qn4", section: "Not-for-Profit — Specific", text: "Are project expenditure reports to donors prepared accurately and on time?", type: "yesno" },
      { id: "qn5", section: "Not-for-Profit — Specific", text: "Upload donor grant agreements and project reports for this engagement:", type: "upload" },
    );

    if (et === "boi" || ind === "manufacturing") extra.push(
      { id: "qm1", section: "Manufacturing / BOI", text: "Is the entity BOI-registered? Are concessionary tax rates correctly applied?", type: "yesno" },
      { id: "qm2", section: "Manufacturing / BOI", text: "Is inventory valuation (FIFO/WAC) consistently applied? Are physical counts performed at year-end?", type: "risk3" },
      { id: "qm3", section: "Manufacturing / BOI", text: "Are there significant work-in-progress balances with complex cost allocation?", type: "risk3" },
      { id: "qm4", section: "Manufacturing / BOI", text: "Are there import duty concessions being used, and is compliance being monitored?", type: "yesno" },
    );

    if (ind === "financial") extra.push(
      { id: "qf1", section: "Financial Services", text: "Is the entity subject to CBSL minimum capital and prudential requirements?", type: "yesno" },
      { id: "qf2", section: "Financial Services", text: "Are ECL provisions under SLFRS 9 adequately estimated with appropriate model assumptions?", type: "risk3" },
      { id: "qf3", section: "Financial Services", text: "Are there significant non-performing loan portfolios?", type: "risk3" },
    );

    if (ind === "trading") extra.push(
      { id: "qt1", section: "Trading / Retail", text: "Are there significant foreign currency import/export transactions with FX exposure?", type: "risk3" },
      { id: "qt2", section: "Trading / Retail", text: "Is there a risk of cut-off errors around year-end for goods in transit or consignment stock?", type: "risk3" },
    );

    if (ind === "construction") extra.push(
      { id: "qc1", section: "Construction", text: "Are there long-term contracts requiring percentage of completion (SLFRS 15) accounting?", type: "risk3" },
      { id: "qc2", section: "Construction", text: "Are contract modifications, variations, and claims properly captured and assessed?", type: "risk3" },
      { id: "qc3", section: "Construction", text: "Is there a risk of understated costs to inflate percentage of completion?", type: "risk3" },
    );

    if (ind === "hospitality") extra.push(
      { id: "qh1", section: "Hospitality / Tourism", text: "Is there significant seasonal revenue concentration and related going concern risk in off-season?", type: "risk3" },
      { id: "qh2", section: "Hospitality / Tourism", text: "Are advance bookings and deposits properly recognised (SLFRS 15)?", type: "risk3" },
    );

    if (ind === "property") extra.push(
      { id: "qp1", section: "Real Estate / Property", text: "Are investment properties valued at fair value (LKAS 40)? Is the valuation methodology robust?", type: "risk3" },
      { id: "qp2", section: "Real Estate / Property", text: "Are development costs correctly capitalised vs expensed?", type: "risk3" },
    );

    return [...base, ...extra];
  };

  // ── Ratio computation ─────────────────────────────────────────────────────
  const n = v => { const x = parseFloat(v); return isNaN(x) || x === 0 ? null : x; };

  const computeRatios = () => {
    const { revenue: rv, costOfSales: cos, grossProfit: gp0, pbt, totalAssets: ta, currentAssets: ca, currentLiabilities: cl, cash, inventory: inv, receivables: rec, totalLiabilities: tl, equity: eq, priorRevenue: prv, priorPbt: ppbt, priorTotalAssets: pta, priorEquity: peq } = fin;
    const [R, C2, GP, PBT, TA, CA, CL, CASH, INV, REC, TL, EQ, PRV, PPBT, PTA, PEQ] = [rv, cos, gp0, pbt, ta, ca, cl, cash, inv, rec, tl, eq, prv, ppbt, pta, peq].map(n);
    const gp = GP ?? (R && C2 ? R - C2 : null);
    const pct = (a, b) => a !== null && b ? ((a / b) * 100).toFixed(1) + "%" : "—";
    const rat = (a, b) => a !== null && b ? (a / b).toFixed(2) + "x" : "—";
    const chg = (a, b) => a !== null && b ? (((a - b) / Math.abs(b)) * 100).toFixed(1) + "%" : "—";
    const flag = (cond) => cond ? "⚠" : "";

    return [
      { name: "Gross Profit Margin", val: pct(gp, R), warn: gp !== null && R && gp / R < 0.1 },
      { name: "Net Profit Margin (PBT)", val: pct(PBT, R), warn: PBT !== null && PBT < 0 },
      { name: "Current Ratio", val: rat(CA, CL), warn: CA !== null && CL && CA / CL < 1 },
      { name: "Quick Ratio", val: CA !== null && INV !== null && CL ? ((CA - INV) / CL).toFixed(2) + "x" : "—", warn: CA !== null && INV !== null && CL && (CA - INV) / CL < 0.8 },
      { name: "Cash Ratio", val: rat(CASH, CL), warn: false },
      { name: "Debt to Equity", val: rat(TL, EQ), warn: TL !== null && EQ && TL / EQ > 2 },
      { name: "Return on Assets", val: pct(PBT, TA), warn: false },
      { name: "Return on Equity", val: pct(PBT, EQ), warn: false },
      { name: "Receivables Days", val: REC !== null && R ? ((REC / R) * 365).toFixed(0) + " days" : "—", warn: false },
      { name: "Inventory Days", val: INV !== null && C2 ? ((INV / C2) * 365).toFixed(0) + " days" : "—", warn: false },
      { name: "Revenue Growth YoY", val: chg(R, PRV), warn: false },
      { name: "PBT Growth YoY", val: chg(PBT, PPBT), warn: false },
      { name: "Total Assets Growth", val: chg(TA, PTA), warn: false },
      { name: "Equity Growth", val: chg(EQ, PEQ), warn: false },
    ].filter(r => r.val !== "—");
  };

  const autoMateriality = () => {
    const R = n(fin.revenue), PBT = n(fin.pbt), EQ = n(fin.equity), TA = n(fin.totalAssets);
    let bName = "", pct = 0, base = 0;
    if (R && R > 0) { bName = "Revenue"; pct = 0.02; base = R; }
    else if (PBT && PBT > 0) { bName = "Net Profit Before Tax"; pct = 0.10; base = PBT; }
    else if (EQ && EQ > 0) { bName = "Net Assets (Equity)"; pct = 0.05; base = EQ; }
    else if (TA) { bName = "Total Assets"; pct = 0.01; base = TA; }
    if (base) {
      const om = base * pct, pm = om * 0.70, ct = om * 0.05;
      setMat({ benchmark: bName, percentage: (pct * 100).toFixed(1), om: om.toFixed(0), pm: pm.toFixed(0), ct: ct.toFixed(0), justification: `Benchmark: ${bName} at ${(pct * 100).toFixed(1)}% (BakerTilly Global Focus). PM = 70% of OM (moderate risk). CT = 5% of OM.` });
    }
  };

  // ── AI Calls ──────────────────────────────────────────────────────────────
  const runRiskAI = async () => {
    setLoading(true);
    const qs = getQuestions().filter(q => q.type !== "upload").map(q => `Q: ${q.text}\nA: ${riskAnswers[q.id] || "Not answered"}${riskAnswers[q.id + "_c"] ? `\nComment: ${riskAnswers[q.id + "_c"]}` : ""}`).join("\n\n");
    const sys = buildSystemContext("Assess the overall risk profile of this audit engagement and provide a structured risk assessment.");
    const msg = `CLIENT: ${client.name} | Entity: ${client.entityType} | Industry: ${client.industry} | FY: ${client.fy}

Risk questionnaire responses:
${qs}

Provide:
1. Overall Inherent Risk Assessment (Low / Moderate / High) with clear reasoning
2. Top 5 identified risk areas with explanation
3. Control environment assessment summary
4. Significant risks identified (as defined in SLAuS 315 / ISA 315 Revised)
5. Going concern assessment
6. Sri Lanka-specific regulatory risks (EPF/ETF, BOI, CSE, CBSL as applicable)
7. Any areas where post-mid-2025 standards updates may be relevant — flag for Q&A Manager review

Be professional, concise, and specific to the Sri Lanka context.`;
    const r = await callClaude(sys, msg);
    setRiskAI(r); setLoading(false); complete(2);
  };

  const runRatiosAI = async () => {
    setLoading(true);
    autoMateriality();
    const ratios = computeRatios();
    const sys = buildSystemContext("Perform analytical review procedures and assess financial risks per SLAuS 520.");
    const msg = `CLIENT: ${client.name} | Industry: ${client.industry} | FY: ${client.fy}

Computed financial ratios:
${ratios.map(r => `${r.name}: ${r.val}${r.warn ? " ⚠ FLAGGED" : ""}`).join("\n")}

Team notes: ${fin.notes || "None"}

Prior risk assessment summary:
${riskAI.substring(0, 500)}

Provide per SLAuS 520:
1. Analytical review commentary — explain significant movements (>5% threshold) and flag audit implications
2. Risk-rated account balances (High / Moderate / Low inherent risk per area)
3. Going concern financial indicators assessment (SLAuS 570)
4. Key financial statement risks at assertion level
5. Recommended audit focus areas
6. Preliminary assessment of whether materiality benchmark selection appears appropriate

Reference SLAuS 315, SLAuS 520, SLAuS 570. Apply Sri Lanka economic context.`;
    const r = await callClaude(sys, msg);
    setRatiosAI(r); setLoading(false); complete(3);
  };

  const runPlanAI = async () => {
    setLoading(true);
    const sys = buildSystemContext("Generate a comprehensive Overall Audit Plan following BakerTilly Global Focus methodology and SLAuS requirements.");
    const msg = `Generate a complete Overall Audit Plan.

ENGAGEMENT DETAILS:
Client: ${client.name} | Reg No: ${client.regNo}
Entity Type: ${client.entityType} | Industry: ${client.industry}
Financial Year End: ${client.fy}
Framework: ${client.framework || "SLFRS for SMEs / LKASs / SLFRSs"}
Engagement: ${client.engagement}
Partner: ${client.partner} | Manager: ${client.manager} | Senior: ${client.senior}

MATERIALITY (Global Focus):
Benchmark: ${mat.benchmark} | Percentage: ${mat.percentage}%
Overall Materiality (OM): LKR ${parseInt(mat.om || 0).toLocaleString()}
Performance Materiality (PM): LKR ${parseInt(mat.pm || 0).toLocaleString()}
Clearly Trivial (CT): LKR ${parseInt(mat.ct || 0).toLocaleString()}
Justification: ${mat.justification}

RISK ASSESSMENT FINDINGS:
${riskAI.substring(0, 700)}

ANALYTICAL REVIEW FINDINGS:
${ratiosAI.substring(0, 700)}

Produce the Overall Audit Plan with these sections:
1. ENGAGEMENT OVERVIEW
2. OVERALL MATERIALITY (OM, PM, CT with full Global Focus justification)
3. RISK OF MATERIAL MISSTATEMENT — Financial statement level & assertion level
4. OVERALL AUDIT STRATEGY (nature, timing, extent; substantive vs controls balance)
5. SIGNIFICANT RISKS (each with planned response per SLAuS 330)
6. AREAS BELOW PERFORMANCE MATERIALITY
7. FRAUD RISK ASSESSMENT (SLAuS 240 — including management override)
8. GOING CONCERN ASSESSMENT (SLAuS 570)
9. ENGAGEMENT TEAM & SPECIALIST REQUIREMENTS
10. KEY DATES & TIMELINE
11. STANDARDS CURRENCY NOTE (flag any areas where post-mid-2025 updates may apply)
12. ENGAGEMENT PARTNER CONCLUSION ON PLANNING

Use formal audit plan language. Reference SLAuS throughout. Tailor to Sri Lanka context including local regulatory requirements.`;
    const r = await callClaude(sys, msg);
    setPlanAI(r); setEditedPlan(r); setLoading(false); complete(4);
  };

  const runProgramsAI = async () => {
    setLoading(true);
    const sys = buildSystemContext("Generate detailed, engagement-specific audit programs based on the approved audit plan.");
    const msg = `Generate detailed audit programs for this engagement.

CLIENT: ${client.name} | FY: ${client.fy} | Industry: ${client.industry}

APPROVED AUDIT PLAN (summary):
${editedPlan.substring(0, 1200)}

MANAGER COMMENTS: ${managerComments || "None"}

Performance Materiality: LKR ${parseInt(mat.pm || 0).toLocaleString()}

For each HIGH RISK and SIGNIFICANT RISK area in the approved plan, generate a detailed audit program including:
— Audit objective
— Financial statement assertions addressed (Existence/Occurrence, Completeness, Valuation/Accuracy, Rights & Obligations, Cut-off, Classification, Presentation & Disclosure)
— Test of controls (where applicable — note if controls reliance is planned)
— Substantive procedures (test of details and analytical procedures)
— Sample size guidance (calibrated to PM of LKR ${parseInt(mat.pm || 0).toLocaleString()})
— Working paper reference placeholder
— SLAuS reference

Mandatory programs to include regardless of risk level:
• Management Override of Controls (SLAuS 240.32-33 — journal entry testing, accounting estimates review, significant transactions review)
• Going Concern procedures (SLAuS 570) ${riskAI.includes("going concern") || riskAI.includes("Going Concern") ? "— ELEVATED — detailed procedures required" : "— standard"}

Tailor all procedures to ${client.industry} industry context and Sri Lanka regulatory requirements.
If firm audit programs were provided in the library, align procedures with those programs.`;
    const r = await callClaude(sys, msg);
    setProgramsAI(r); setLoading(false); complete(6);
  };

  // ── File upload ───────────────────────────────────────────────────────────
  const handleUpload = e => {
    const files = Array.from(e.target.files);
    setClient(p => ({ ...p, uploads: [...p.uploads, ...files.map(f => f.name)] }));
  };

  const ratios = (n(fin.revenue) || n(fin.totalAssets)) ? computeRatios() : [];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: C.ink, padding: "0 40px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: C.goldLight, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>
              {library?.firmName || "BakerTilly Edirisinghe & Co"} · AI Audit Planning
            </div>
            <div style={{ fontSize: 18, color: "#fff", fontWeight: 400 }}>
              {client.name || "New Engagement"}
              {client.fy && <span style={{ fontSize: 12, color: "#ffffff60", marginLeft: 12 }}>FY {client.fy}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {approvalStatus === "approved" && <Pill color={C.green}>✓ Plan Approved</Pill>}
            <button
              onClick={() => setShowSessionPanel(p => !p)}
              style={{ background: sessionUpdates ? C.goldBg : "transparent", border: `1px solid ${sessionUpdates ? C.gold : "#ffffff30"}`, borderRadius: 3, padding: "6px 12px", color: sessionUpdates ? C.gold : "#ffffff80", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Georgia', serif", letterSpacing: 0.5 }}
            >
              {sessionUpdates ? "✓ " : ""}Standards Update
            </button>
            <Btn variant="ghost" small onClick={onOpenAdmin}>Library Admin</Btn>
          </div>
        </div>
      </div>

      {/* Session standards update panel */}
      {showSessionPanel && (
        <div style={{ background: C.goldBg, borderBottom: `1px solid ${C.goldBorder}`, padding: "20px 40px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <Label>Engagement-Level Standards Update (optional — add any circulars specific to this engagement or new since library was last updated)</Label>
            <TextArea value={sessionUpdates} onChange={setSessionUpdates} rows={4} placeholder="Paste any additional CA Sri Lanka circulars, sector-specific updates, or notes for this engagement…" />
            <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
              <Btn small variant="primary" onClick={() => setShowSessionPanel(false)}>Save & Close</Btn>
              <span style={{ fontSize: 11, color: C.inkLight, alignSelf: "center" }}>
                Library last updated: {library?.lastUpdated || "Unknown"} by {library?.updatedBy || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 40px" }}>
        <StepBar current={step} completed={completed} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <SectionHead title="Step 1 — Client & Engagement Setup" sub="Complete all fields. Entity type and industry selections drive the risk questionnaire in Step 2." />

            <Accordion title="Client Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
                <div>
                  <Field label="Client Name"><TextInput value={client.name} onChange={setC("name")} placeholder="Full legal name" /></Field>
                  <Field label="Company Registration No."><TextInput value={client.regNo} onChange={setC("regNo")} /></Field>
                  <Field label="Financial Year End"><TextInput value={client.fy} onChange={setC("fy")} placeholder="e.g. 31 March 2025" /></Field>
                  <RadioGroup label="New or Continuing Engagement?" value={client.engagement} onChange={setC("engagement")} options={[{ value: "new", label: "New Client" }, { value: "continuation", label: "Continuing" }]} />
                </div>
                <div>
                  <Field label="Entity Type">
                    <Dropdown value={client.entityType} onChange={setC("entityType")} options={[
                      { value: "sme", label: "SME — Private Company" },
                      { value: "nfp", label: "Not-for-Profit / NGO" },
                      { value: "large_private", label: "Large Private Company" },
                      { value: "listed", label: "Listed Company (CSE)" },
                      { value: "boi", label: "BOI Entity" },
                    ]} />
                  </Field>
                  <Field label="Industry / Sector">
                    <Dropdown value={client.industry} onChange={setC("industry")} options={[
                      { value: "manufacturing", label: "Manufacturing" },
                      { value: "trading", label: "Trading / Retail" },
                      { value: "services", label: "Services / Professional" },
                      { value: "construction", label: "Construction" },
                      { value: "financial", label: "Financial Services" },
                      { value: "hospitality", label: "Hospitality / Tourism" },
                      { value: "healthcare", label: "Healthcare" },
                      { value: "agriculture", label: "Agriculture / Plantation" },
                      { value: "property", label: "Real Estate / Property" },
                      { value: "nfp_sector", label: "NGO / Development Sector" },
                      { value: "other", label: "Other" },
                    ]} />
                  </Field>
                  <Field label="Financial Reporting Framework">
                    <Dropdown value={client.framework} onChange={setC("framework")} options={[
                      { value: "slfrs_sme", label: "SLFRS for SMEs" },
                      { value: "slfrs_full", label: "Full SLFRSs / IFRSs" },
                      { value: "lkas", label: "LKASs (Sri Lanka Accounting Standards)" },
                    ]} />
                  </Field>
                </div>
              </div>
            </Accordion>

            <Accordion title="Engagement Team" defaultOpen={false}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
                <div>
                  <Field label="Engagement Partner"><TextInput value={client.partner} onChange={setC("partner")} /></Field>
                  <Field label="Engagement Manager"><TextInput value={client.manager} onChange={setC("manager")} /></Field>
                </div>
                <div>
                  <Field label="Audit Senior / In-charge"><TextInput value={client.senior} onChange={setC("senior")} /></Field>
                  <Field label="Audit Assistant(s)"><TextInput value={client.assistant} onChange={setC("assistant")} /></Field>
                </div>
              </div>
            </Accordion>

            <Accordion title="Document Uploads (Financials, Prior Year File, Donor Agreements)" defaultOpen={false}>
              <p style={{ fontSize: 12, color: C.inkLight, marginBottom: 16, lineHeight: 1.7 }}>
                Upload prior year financials, trial balance, engagement letter, NFP donor agreements, or any client-specific documents. These are available to the team for reference during this engagement.
              </p>
              <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleUpload} />
              <Btn variant="secondary" onClick={() => fileRef.current.click()}>📎 Upload Documents</Btn>
              {client.uploads.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {client.uploads.map((f, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.inkMid, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>✓ {f}</div>
                  ))}
                </div>
              )}
            </Accordion>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Btn onClick={() => { complete(1); setStep(2); }} disabled={!client.name || !client.fy || !client.entityType || !client.industry}>
                Continue to Risk Questionnaire →
              </Btn>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <SectionHead
              title="Step 2 — Risk Assessment Questionnaire"
              sub={`Questions adapt to entity type (${client.entityType || "—"}) and industry (${client.industry || "—"}). Answer all sections — this replaces the need for external research and encodes your team's client knowledge.`}
            />

            {(() => {
              const questions = getQuestions();
              const sections = [...new Set(questions.map(q => q.section))];
              return sections.map(sec => (
                <Accordion key={sec} title={sec} defaultOpen={sec === "Control Environment"}>
                  {questions.filter(q => q.section === sec).map(q => {
                    if (q.type === "upload") return (
                      <div key={q.id} style={{ padding: "12px 16px", background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 4, marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, marginBottom: 10 }}>⚠ {q.text}</div>
                        <Btn small variant="secondary" onClick={() => fileRef.current.click()}>Upload Donor / Grant Agreement</Btn>
                      </div>
                    );
                    return (
                      <div key={q.id} style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 13, color: C.ink, marginBottom: 10, lineHeight: 1.6 }}>{q.text}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                          {(q.type === "risk3"
                            ? [{ v: "Low", l: "Low Risk" }, { v: "Moderate", l: "Moderate Risk" }, { v: "High", l: "High Risk" }]
                            : [{ v: "Yes", l: "Yes" }, { v: "No", l: "No" }, { v: "N/A", l: "N/A" }]
                          ).map(o => <Radio key={o.v} value={o.v} current={riskAnswers[q.id] || ""} onChange={v => setRiskAnswers(p => ({ ...p, [q.id]: v }))} label={o.l} />)}
                        </div>
                        <TextArea
                          value={riskAnswers[q.id + "_c"] || ""}
                          onChange={v => setRiskAnswers(p => ({ ...p, [q.id + "_c"]: v }))}
                          rows={2}
                          placeholder="Comments (optional)…"
                        />
                      </div>
                    );
                  })}
                </Accordion>
              ));
            })()}

            {riskAI && <AIPanel content={riskAI} loading={false} title="Risk Assessment Analysis" />}
            {loading && <AIPanel content="" loading={true} title="Risk Assessment Analysis" />}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="secondary" onClick={runRiskAI} disabled={loading}>
                  {loading ? "Analysing…" : "🤖 Run AI Risk Assessment"}
                </Btn>
                {riskAI && <Btn onClick={() => { complete(2); setStep(3); }}>Continue to Financials →</Btn>}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div>
            <SectionHead title="Step 3 — Financial Statements & Ratio Analysis" sub="Enter key financial figures. Ratios are computed automatically. Materiality is suggested using the BakerTilly Global Focus methodology." />

            <Accordion title="Statement of Comprehensive Income (LKR)">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 20px" }}>
                {[["Revenue", "revenue"], ["Cost of Sales", "costOfSales"], ["Gross Profit (auto if blank)", "grossProfit"], ["Operating Expenses", "opEx"], ["Profit Before Tax", "pbt"], ["Profit After Tax", "pat"]].map(([l, k]) => (
                  <Field key={k} label={l}><TextInput value={fin[k]} onChange={setF(k)} type="number" placeholder="0" /></Field>
                ))}
              </div>
            </Accordion>

            <Accordion title="Statement of Financial Position (LKR)">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 20px" }}>
                {[["Total Assets", "totalAssets"], ["Current Assets", "currentAssets"], ["Cash & Equivalents", "cash"], ["Inventory", "inventory"], ["Trade Receivables", "receivables"], ["Total Liabilities", "totalLiabilities"], ["Current Liabilities", "currentLiabilities"], ["Equity / Net Assets", "equity"]].map(([l, k]) => (
                  <Field key={k} label={l}><TextInput value={fin[k]} onChange={setF(k)} type="number" placeholder="0" /></Field>
                ))}
              </div>
            </Accordion>

            <Accordion title="Prior Year Comparatives (LKR)" defaultOpen={false}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0 16px" }}>
                {[["Revenue", "priorRevenue"], ["PBT", "priorPbt"], ["Total Assets", "priorTotalAssets"], ["Equity", "priorEquity"]].map(([l, k]) => (
                  <Field key={k} label={`PY ${l}`}><TextInput value={fin[k]} onChange={setF(k)} type="number" placeholder="0" /></Field>
                ))}
              </div>
            </Accordion>

            <Field label="Team Notes (unusual transactions, context for AI)">
              <TextArea value={fin.notes} onChange={setF("notes")} rows={3} placeholder="e.g. Client changed inventory valuation method; large one-off disposal; FX gain included in revenue…" />
            </Field>

            {ratios.length > 0 && (
              <Accordion title="Computed Financial Ratios">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {ratios.map(r => (
                    <div key={r.name} style={{ background: r.warn ? C.goldBg : C.surfaceAlt, border: `1px solid ${r.warn ? C.goldBorder : C.border}`, borderRadius: 4, padding: "12px 16px" }}>
                      <div style={{ fontSize: 9.5, color: C.inkLight, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{r.name}</div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: r.warn ? C.gold : C.ink }}>{r.val}</div>
                      {r.warn && <div style={{ fontSize: 10, color: C.gold, marginTop: 3 }}>⚠ Review required</div>}
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {mat.om && (
              <Accordion title="Materiality — BakerTilly Global Focus" badge="Auto-computed">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[{ l: "Overall Materiality (OM)", v: "LKR " + parseInt(mat.om).toLocaleString(), c: C.gold }, { l: "Performance Materiality (PM)", v: "LKR " + parseInt(mat.pm).toLocaleString(), c: C.blue }, { l: "Clearly Trivial (CT)", v: "LKR " + parseInt(mat.ct).toLocaleString(), c: C.inkLight }].map(m => (
                    <div key={m.l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 9.5, color: C.inkLight, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{m.l}</div>
                      <div style={{ fontSize: 19, fontWeight: 700, color: m.c }}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.inkLight, fontStyle: "italic", marginBottom: 16 }}>{mat.justification}</div>
                <HR />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  <Field label="Override Benchmark">
                    <Dropdown value={mat.benchmark} onChange={v => setMat(p => ({ ...p, benchmark: v }))} options={[
                      { value: "Revenue", label: "Revenue (0.5–2%)" },
                      { value: "Net Profit Before Tax", label: "Net PBT (0.5–10%)" },
                      { value: "Net Assets (Equity)", label: "Net Assets (1–5%)" },
                      { value: "Total Assets", label: "Total Assets (0.5–1%)" },
                    ]} />
                  </Field>
                  <Field label="Override Percentage (%)">
                    <TextInput value={mat.percentage} onChange={v => setMat(p => ({ ...p, percentage: v }))} type="number" />
                  </Field>
                </div>
                <Field label="Justification (for working papers)">
                  <TextArea value={mat.justification} onChange={v => setMat(p => ({ ...p, justification: v }))} rows={3} />
                </Field>
              </Accordion>
            )}

            {ratiosAI && <AIPanel content={ratiosAI} loading={false} title="Analytical Review & Financial Risk Assessment" />}
            {loading && <AIPanel content="" loading={true} title="Analytical Review" />}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="secondary" onClick={runRatiosAI} disabled={loading || !fin.revenue}>
                  {loading ? "Analysing…" : "🤖 Run Analytical Review & Ratios"}
                </Btn>
                {ratiosAI && <Btn onClick={() => { complete(3); setStep(4); }}>Continue to Audit Plan →</Btn>}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div>
            <SectionHead title="Step 4 — Overall Audit Plan" sub="The AI generates a comprehensive plan drawing on all information gathered, your firm's library, and the latest SLAuS/SLFRS standards." />

            {!planAI && !loading && (
              <Card style={{ textAlign: "center", padding: "48px 40px", border: `1px dashed ${C.border}` }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📋</div>
                <div style={{ fontSize: 15, color: C.inkMid, marginBottom: 20 }}>Ready to generate the Overall Audit Plan</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxWidth: 480, margin: "0 auto 24px", textAlign: "left" }}>
                  {["Engagement overview", "Materiality (Global Focus)", "Risk of material misstatement", "Overall audit strategy", "Significant risks & responses", "Fraud risk (SLAuS 240)", "Going concern (SLAuS 570)", "Team & timeline", "Standards currency note", "Partner conclusion"].map(item => (
                    <div key={item} style={{ fontSize: 12, color: C.inkLight }}>✓ {item}</div>
                  ))}
                </div>
              </Card>
            )}

            {loading && <AIPanel content="" loading={true} title="Generating Overall Audit Plan" />}

            {planAI && (
              <Accordion title="Overall Audit Plan — Review & Edit before Submission" badge="Draft">
                <div style={{ fontSize: 11, color: C.inkLight, marginBottom: 12, fontStyle: "italic" }}>
                  You may edit the plan below before sending for manager approval. All changes are preserved.
                </div>
                <TextArea value={editedPlan} onChange={setEditedPlan} rows={32} />
              </Accordion>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <Btn variant="ghost" onClick={() => setStep(3)}>← Back</Btn>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="secondary" onClick={runPlanAI} disabled={loading}>
                  {loading ? "Generating…" : planAI ? "🔄 Regenerate Plan" : "🤖 Generate Audit Plan"}
                </Btn>
                {planAI && <Btn onClick={() => { complete(4); setStep(5); }}>Send for Approval →</Btn>}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <div>
            <SectionHead title="Step 5 — Manager Review & Approval" sub={`Reviewing manager: ${client.manager || "—"}. Review the plan, make edits directly, add comments, then approve or return.`} />

            {/* Summary strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { l: "Client", v: client.name, c: C.gold },
                { l: "FY", v: client.fy, c: C.ink },
                { l: "Overall Materiality", v: mat.om ? "LKR " + parseInt(mat.om).toLocaleString() : "—", c: C.gold },
                { l: "Perf. Materiality", v: mat.pm ? "LKR " + parseInt(mat.pm).toLocaleString() : "—", c: C.blue },
              ].map(m => (
                <div key={m.l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px 16px" }}>
                  <div style={{ fontSize: 9.5, color: C.inkLight, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{m.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: m.c }}>{m.v || "—"}</div>
                </div>
              ))}
            </div>

            <Accordion title="Audit Plan — Manager Edit View" badge={approvalStatus === "approved" ? "APPROVED" : "Pending"}>
              <TextArea value={editedPlan} onChange={setEditedPlan} rows={28} />
            </Accordion>

            <Accordion title="Manager Decision">
              <Field label="Manager Comments / Review Notes">
                <TextArea value={managerComments} onChange={setManagerComments} rows={5} placeholder="Document your review conclusions, queries for the team, or required amendments…" />
              </Field>

              {approvalStatus && (
                <div style={{
                  padding: "14px 18px", borderRadius: 4, marginBottom: 20,
                  background: approvalStatus === "approved" ? C.greenBg : C.redBg,
                  border: `1.5px solid ${approvalStatus === "approved" ? C.green : C.red}`,
                  color: approvalStatus === "approved" ? C.green : C.red,
                  fontWeight: 700, fontSize: 13,
                }}>
                  {approvalStatus === "approved"
                    ? "✓ PLAN APPROVED — Detailed audit programs may now be generated."
                    : "✗ PLAN RETURNED — Please revise and resubmit for approval."}
                  {managerComments && <div style={{ fontWeight: 400, fontSize: 12, marginTop: 8, color: "inherit" }}>Comments: {managerComments}</div>}
                </div>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="success" onClick={() => { setApprovalStatus("approved"); complete(5); }}>
                  ✓ Approve Plan
                </Btn>
                <Btn variant="danger" onClick={() => setApprovalStatus("rejected")}>
                  ✗ Return for Revision
                </Btn>
              </div>
            </Accordion>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <Btn variant="ghost" onClick={() => setStep(4)}>← Back to Plan</Btn>
              <div style={{ display: "flex", gap: 12 }}>
                {approvalStatus === "rejected" && (
                  <Btn variant="secondary" onClick={() => { setApprovalStatus(""); setStep(4); }}>Revise Plan</Btn>
                )}
                {approvalStatus === "approved" && (
                  <Btn onClick={() => { complete(5); setStep(6); }}>Generate Audit Programs →</Btn>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6 ── */}
        {step === 6 && (
          <div>
            <SectionHead title="Step 6 — Audit Programs" sub="Detailed audit programs generated based on the approved plan, your firm's standard programs, and current SLAuS requirements." />

            {approvalStatus === "approved" && (
              <Card accent={C.green} style={{ background: C.greenBg, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: C.green, lineHeight: 1.7 }}>
                  <strong>✓ Plan Approved</strong> by {client.manager || "Manager"}.
                  {managerComments && <> Manager comments: <em>{managerComments}</em></>}
                </div>
              </Card>
            )}

            {!programsAI && !loading && (
              <Card style={{ textAlign: "center", padding: "48px 40px", border: `1px dashed ${C.border}` }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
                <div style={{ fontSize: 14, color: C.inkMid, marginBottom: 8 }}>Plan approved — ready to generate detailed audit programs</div>
                <div style={{ fontSize: 12, color: C.inkLight }}>Programs will be calibrated to PM of LKR {mat.pm ? parseInt(mat.pm).toLocaleString() : "—"} and tailored to {client.industry} industry</div>
              </Card>
            )}

            {loading && <AIPanel content="" loading={true} title="Generating Audit Programs" />}

            {programsAI && (
              <Accordion title="Audit Programs — Ready for Working Paper File" badge="Approved">
                <div style={{ color: C.ink, fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "'Georgia', serif" }}>
                  {programsAI}
                </div>
              </Accordion>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <Btn variant="ghost" onClick={() => setStep(5)}>← Back</Btn>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="secondary" onClick={runProgramsAI} disabled={loading}>
                  {loading ? "Generating…" : programsAI ? "🔄 Regenerate Programs" : "🤖 Generate Audit Programs"}
                </Btn>
                {programsAI && (
                  <Btn variant="success" onClick={() => { complete(6); alert("Audit planning complete. Save or print this session for your working paper file. Engagement: " + client.name + " | FY: " + client.fy); }}>
                    ✓ Mark Planning Complete
                  </Btn>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 40px", textAlign: "center", fontSize: 10, color: C.inkFaint, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {library?.firmName || "BakerTilly Edirisinghe & Co"} · AI Audit Planning System · {library?.methodology || "Global Focus"} · Strictly Confidential
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ROOT — LOGIN GATE + MODE SWITCH ──────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function Root() {
  const [mode, setMode] = useState("planning"); // planning | admin
  const [library, setLibrary] = useState(null);
  const [adminPw, setAdminPw] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    loadLibrary().then(l => { if (l) setLibrary(l); });
  }, []);

  const tryAdmin = async () => {
    const lib = library || defaultLibrary;
    if (adminPw === lib.password) {
      setMode("admin"); setShowAdminLogin(false); setAdminError("");
    } else {
      setAdminError("Incorrect password. Contact the Q&A Manager.");
    }
  };

  const handleAdminClose = async () => {
    const updated = await loadLibrary();
    if (updated) setLibrary(updated);
    setMode("planning");
  };

  if (mode === "admin") return <AdminLibrary onClose={handleAdminClose} />;

  return (
    <div>
      {/* Admin login modal */}
      {showAdminLogin && (
        <div style={{ position: "fixed", inset: 0, background: "#0d0b0880", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "36px 40px", width: 360, fontFamily: "'Georgia', serif" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Library Admin Access</div>
            <div style={{ fontSize: 12, color: C.inkLight, marginBottom: 20, lineHeight: 1.6 }}>
              This area is restricted to Partners and the Q&A Manager. Enter the admin password to continue.
            </div>
            <Field label="Admin Password">
              <TextInput value={adminPw} onChange={setAdminPw} type="password" placeholder="Enter password" />
            </Field>
            {adminError && <div style={{ fontSize: 12, color: C.red, marginBottom: 12 }}>{adminError}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={tryAdmin}>Enter Library</Btn>
              <Btn variant="ghost" onClick={() => { setShowAdminLogin(false); setAdminPw(""); setAdminError(""); }}>Cancel</Btn>
            </div>
            <div style={{ marginTop: 16, fontSize: 10, color: C.inkFaint }}>Default password: admin2024 — change this in Library Settings.</div>
          </div>
        </div>
      )}

      <PlanningTool library={library} onOpenAdmin={() => setShowAdminLogin(true)} />
    </div>
  );
}