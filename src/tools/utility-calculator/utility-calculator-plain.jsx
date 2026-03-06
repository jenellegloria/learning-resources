import { useState } from "react";

// ─── SCORING ─────────────────────────────────────────────────────────────────

const genId = () => Math.random().toString(36).substr(2, 9);

const makeCons = () => ({
  id: genId(), text: "", valence: "negative",
  certainty: 5, intensity: 5, extent: "1", duration: 5,
  pleasureTier: 1.0,
  prefFrustration: 0,
});

const makeOption = (label = "") => ({
  id: genId(), label, consequences: [makeCons()],
});

function rawScore(c) {
  if (!c.text.trim() || c.valence === "uncertain") return null;
  const ext = Math.max(parseFloat(c.extent) || 0, 0);
  return (c.certainty / 10) * c.intensity * ext * (c.duration / 10);
}

function benthamScore(c) {
  const s = rawScore(c); if (s === null) return null;
  return c.valence === "positive" ? s : -s;
}
function millScore(c) {
  const b = benthamScore(c); if (b === null) return null;
  return b * (c.pleasureTier ?? 1.0);
}
function prefScore(c) {
  const b = benthamScore(c); if (b === null) return null;
  const ext = Math.max(parseFloat(c.extent) || 0, 0);
  return b - (c.prefFrustration ?? 0) * ext * (c.certainty / 10);
}

function totalFW(cons, fw) {
  const fn = fw === "bentham" ? benthamScore : fw === "mill" ? millScore : prefScore;
  return cons.reduce((t, c) => { const s = fn(c); return s !== null ? t + s : t; }, 0);
}

function fmtNum(n) {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (a >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(1) + "K";
  if (a >= 1) return n.toFixed(1);
  if (a >= 0.01) return n.toFixed(2);
  return n.toFixed(3);
}
function sfmt(n) { return (n >= 0 ? "+" : "") + fmtNum(n); }

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const PLEASURE_TIERS = [
  { value: 0.5,  label: "Bodily / sensory" },
  { value: 0.75, label: "Social / relational" },
  { value: 1.0,  label: "Baseline (no adjustment)" },
  { value: 1.4,  label: "Intellectual / creative" },
  { value: 1.75, label: "Moral / civic" },
];

const PREF_WEIGHTS = [
  { value: 0,   label: "None — no future preferences at stake" },
  { value: 0.25, label: "Minimal — mild disruption" },
  { value: 0.5,  label: "Moderate — clear desires frustrated" },
  { value: 1.0,  label: "Strong — deep life-plans thwarted" },
  { value: 2.0,  label: "Total — all future preferences eliminated (e.g. death)" },
];

const CERT_ANCHORS = { 1: "Nearly impossible", 3: "Unlikely", 5: "Coin flip", 7: "Probable", 10: "Virtually certain" };
const INT_ANCHORS_NEG = { 1: "Trivial annoyance", 3: "Noticeable pain", 5: "Significant suffering", 7: "Devastating", 10: "Death / worst possible" };
const INT_ANCHORS_POS = { 1: "Slight convenience", 3: "Noticeable benefit", 5: "Significant improvement", 7: "Life-changing good", 10: "Best possible outcome" };
const DUR_ANCHORS = { 1: "Momentary (×0.1)", 3: "Days–weeks (×0.3)", 5: "Months–years (×0.5)", 7: "A generation (×0.7)", 10: "Permanent (×1.0)" };

const FRAMEWORKS = {
  bentham:    { name: "Bentham (Hedonic)",      short: "Bentham" },
  mill:       { name: "Mill (Qualitative)",     short: "Mill" },
  preference: { name: "Preference Utilitarian", short: "Preference" },
};

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  page:      { minHeight: "100vh", background: "#fff", color: "#000", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, padding: "24px 32px", maxWidth: 860, margin: "0 auto", boxSizing: "border-box" },
  h1:        { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 18, fontWeight: "bold", margin: "0 0 4px" },
  h2:        { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 14, fontWeight: "bold", margin: "0 0 8px" },
  h3:        { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, fontWeight: "bold", margin: "0 0 6px" },
  label:     { display: "block", fontWeight: "bold", marginBottom: 4, fontSize: 12 },
  input:     { width: "100%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, border: "1px solid #999", padding: "4px 6px", boxSizing: "border-box", background: "#fff", color: "#000" },
  textarea:  { width: "100%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, border: "1px solid #999", padding: "4px 6px", boxSizing: "border-box", background: "#fff", color: "#000", resize: "vertical" },
  btn:       { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, background: "#d4d0c8", border: "1px solid", borderColor: "#fff #808080 #808080 #fff", padding: "3px 12px", cursor: "pointer", color: "#000" },
  btnSmall:  { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, background: "#d4d0c8", border: "1px solid", borderColor: "#fff #808080 #808080 #fff", padding: "2px 8px", cursor: "pointer", color: "#000" },
  btnActive: { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, background: "#d4d0c8", border: "1px solid", borderColor: "#808080 #fff #fff #808080", padding: "3px 12px", cursor: "pointer", color: "#000" },
  hr:        { border: "none", borderTop: "1px solid #999", margin: "16px 0" },
  panel:     { border: "1px solid #999", padding: "10px 12px", marginBottom: 12, background: "#f0f0f0" },
  panelInset:{ border: "1px solid", borderColor: "#808080 #fff #fff #808080", padding: "6px 10px", background: "#fff", marginBottom: 8 },
  mono:      { fontFamily: "Courier New, monospace", fontSize: 11 },
  select:    { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, border: "1px solid #999", background: "#fff", padding: "2px 4px", color: "#000" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function SysSlider({ label, value, onChange, anchors, min = 1, max = 10 }) {
  const anchorKeys = Object.keys(anchors).map(Number).sort((a, b) => a - b);
  const nearest = anchorKeys.reduce((b, k) => Math.abs(k - value) < Math.abs(b - value) ? k : b, anchorKeys[0]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: "bold", fontSize: 12 }}>{label}</span>
        <span style={{ ...S.mono }}>{value} — {anchors[nearest]}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: "100%", margin: "4px 0", cursor: "pointer", accentColor: "#000" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#666" }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function ConsRow({ c, idx, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const [showMill, setShowMill] = useState(false);
  const [showPref, setShowPref] = useState(false);
  const unc = c.valence === "uncertain";
  const s = rawScore(c);
  const ext = Math.max(parseFloat(c.extent) || 0, 0);
  const bScore = benthamScore(c);
  const mScore = millScore(c);
  const pScore = prefScore(c);

  return (
    <div style={{ ...S.panel, padding: "8px 10px" }}>
      {/* Top row */}
      <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#666", whiteSpace: "nowrap", marginTop: 5, minWidth: 20 }}>C{idx + 1}</span>
        <input type="text" placeholder="Describe this consequence…" value={c.text} onChange={e => onChange({ ...c, text: e.target.value })}
          style={{ ...S.input, flex: 1 }} />
        <select value={c.valence} onChange={e => onChange({ ...c, valence: e.target.value })} style={{ ...S.select }}>
          <option value="positive">+ Positive</option>
          <option value="negative">− Negative</option>
          <option value="uncertain">? Uncertain</option>
        </select>
        <button onClick={() => setExpanded(v => !v)} style={{ ...S.btnSmall, whiteSpace: "nowrap" }}>
          {expanded ? "▲ Less" : "▼ More"}
        </button>
        <button onClick={onRemove} style={{ ...S.btnSmall }}>✕</button>
      </div>

      {/* Score preview (always shown if filled) */}
      {!unc && c.text.trim() && s !== null && (
        <div style={{ ...S.mono, fontSize: 10, color: "#333", marginBottom: expanded ? 8 : 0, paddingLeft: 26 }}>
          ({c.certainty}/10) × {c.intensity} × {ext.toLocaleString()} × ({c.duration}/10) = {bScore !== null ? sfmt(bScore) : "—"} utils [Bentham]
          {mScore !== bScore ? ` / ${mScore !== null ? sfmt(mScore) : "—"} [Mill ×${c.pleasureTier}]` : ""}
          {pScore !== bScore ? ` / ${pScore !== null ? sfmt(pScore) : "—"} [Pref +frust]` : ""}
        </div>
      )}
      {unc && c.text.trim() && (
        <div style={{ fontSize: 11, color: "#666", fontStyle: "italic", paddingLeft: 26 }}>Not scored (uncertain valence)</div>
      )}

      {/* Expanded sliders */}
      {expanded && !unc && (
        <div style={{ paddingLeft: 26, marginTop: 8, borderTop: "1px solid #ccc", paddingTop: 8 }}>
          <div style={{ ...S.mono, fontSize: 10, marginBottom: 10, background: "#f8f8f8", padding: "4px 6px", border: "1px solid #ddd" }}>
            formula: (certainty/10) × intensity × extent × (duration/10)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <SysSlider label="Certainty" value={c.certainty} onChange={v => onChange({ ...c, certainty: v })} anchors={CERT_ANCHORS} />
            <SysSlider label="Intensity" value={c.intensity} onChange={v => onChange({ ...c, intensity: v })} anchors={c.valence === "positive" ? INT_ANCHORS_POS : INT_ANCHORS_NEG} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ ...S.label }}>Extent (number of people affected)</label>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <input type="number" min="0" value={c.extent} onChange={e => onChange({ ...c, extent: e.target.value })}
                style={{ ...S.input, width: 100 }} />
              {["1", "10", "100", "1000", "10000", "100000", "1000000"].map(v => (
                <button key={v} onClick={() => onChange({ ...c, extent: v })} style={{ ...S.btnSmall, background: c.extent === v ? "#a0a0a0" : "#d4d0c8" }}>
                  {v.length > 3 ? (parseInt(v) >= 1e6 ? "1M" : parseInt(v) >= 1e5 ? "100K" : parseInt(v) >= 1e4 ? "10K" : "1K") : v}
                </button>
              ))}
            </div>
          </div>
          <SysSlider label="Duration" value={c.duration} onChange={v => onChange({ ...c, duration: v })} anchors={DUR_ANCHORS} />

          {/* Fecundity note */}
          <div style={{ fontSize: 11, color: "#555", borderLeft: "3px solid #999", paddingLeft: 8, marginBottom: 10 }}>
            <strong>Fecundity:</strong> Does this cascade into further harms or benefits? Add those as separate consequences rather than adjusting sliders here.
          </div>

          {/* Mill / Pref toggles */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button onClick={() => setShowMill(v => !v)} style={showMill ? S.btnActive : S.btnSmall}>
              {showMill ? "▼" : "▸"} Mill: pleasure tier
            </button>
            <button onClick={() => setShowPref(v => !v)} style={showPref ? S.btnActive : S.btnSmall}>
              {showPref ? "▼" : "▸"} Preference: future weight
            </button>
          </div>

          {showMill && (
            <div style={{ ...S.panelInset }}>
              <div style={{ fontWeight: "bold", fontSize: 11, marginBottom: 6 }}>Mill — Pleasure Tier</div>
              <p style={{ fontSize: 11, color: "#555", margin: "0 0 8px" }}>Mill holds that intellectual and moral pleasures are qualitatively superior to bodily ones. Select the tier of this consequence.</p>
              {PLEASURE_TIERS.map(t => (
                <label key={t.value} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer", fontSize: 12 }}>
                  <input type="radio" name={`tier-${c.id}`} checked={c.pleasureTier === t.value} onChange={() => onChange({ ...c, pleasureTier: t.value })} />
                  {t.label} <span style={{ ...S.mono, fontSize: 10, color: "#666" }}>×{t.value}</span>
                </label>
              ))}
            </div>
          )}

          {showPref && (
            <div style={{ ...S.panelInset }}>
              <div style={{ fontWeight: "bold", fontSize: 11, marginBottom: 6 }}>Preference Util — Future Preference Frustration</div>
              <p style={{ fontSize: 11, color: "#555", margin: "0 0 8px" }}>
                {c.valence === "negative"
                  ? "Does this consequence frustrate future preferences beyond immediate experience? A painless death eliminates all future preferences — serious negative even if unfelt."
                  : "Does this satisfy preferences beyond immediate felt experience?"}
              </p>
              {PREF_WEIGHTS.map(p => (
                <label key={p.value} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer", fontSize: 12 }}>
                  <input type="radio" name={`pref-${c.id}`} checked={c.prefFrustration === p.value} onChange={() => onChange({ ...c, prefFrustration: p.value })} />
                  {p.label} <span style={{ ...S.mono, fontSize: 10, color: "#666" }}>×{p.value}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OptionBlock({ opt, optIdx, onChange, onRemove, canRemove }) {
  const updateCons = (id, updated) => onChange({ ...opt, consequences: opt.consequences.map(c => c.id === id ? updated : c) });
  const removeCons = (id) => { if (opt.consequences.length > 1) onChange({ ...opt, consequences: opt.consequences.filter(c => c.id !== id) }); };
  const addCons = () => onChange({ ...opt, consequences: [...opt.consequences, makeCons()] });

  const bTotal = totalFW(opt.consequences, "bentham");
  const mTotal = totalFW(opt.consequences, "mill");
  const pTotal = totalFW(opt.consequences, "preference");

  return (
    <div style={{ border: "2px solid #000", padding: "12px 14px", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: "bold", fontSize: 12, whiteSpace: "nowrap" }}>Option {optIdx + 1}:</span>
        <input type="text" placeholder="Name this option (e.g. 'Do nothing', 'Report to authorities'…)"
          value={opt.label} onChange={e => onChange({ ...opt, label: e.target.value })}
          style={{ ...S.input }} />
        {canRemove && <button onClick={onRemove} style={{ ...S.btnSmall }}>Remove</button>}
      </div>

      {/* Score summary */}
      <div style={{ ...S.mono, fontSize: 11, background: "#f8f8f8", border: "1px solid #ddd", padding: "4px 8px", marginBottom: 10, display: "flex", gap: 20, flexWrap: "wrap" }}>
        <span>Bentham: <strong>{sfmt(bTotal)}</strong></span>
        <span>Mill: <strong>{sfmt(mTotal)}</strong></span>
        <span>Preference: <strong>{sfmt(pTotal)}</strong></span>
      </div>

      <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Consequences:</div>
      {opt.consequences.map((c, i) => (
        <ConsRow key={c.id} c={c} idx={i}
          onChange={updated => updateCons(c.id, updated)}
          onRemove={() => removeCons(c.id)} />
      ))}
      <button onClick={addCons} style={{ ...S.btnSmall }}>+ Add consequence</button>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────

function ResultsTable({ options, situation }) {
  const fwKeys = ["bentham", "mill", "preference"];
  const [copied, setCopied] = useState(false);

  // For each framework, rank options by score
  const rankings = {};
  fwKeys.forEach(fw => {
    const scored = options.map(o => ({ id: o.id, label: o.label || `Option ${options.indexOf(o) + 1}`, score: totalFW(o.consequences, fw) }));
    scored.sort((a, b) => b.score - a.score);
    rankings[fw] = scored;
  });

  // Check consensus
  const winners = fwKeys.map(fw => rankings[fw][0].id);
  const unanimous = winners.every(w => w === winners[0]);

  const copyResults = () => {
    const pad = (str, len) => String(str).padEnd(len);
    const padL = (str, len) => String(str).padStart(len);
    const colW = Math.max(16, ...options.map(o => (o.label || "Option").length + 2));
    const numW = 12;

    const divider = "─".repeat(colW + numW * 3 + 10);
    const header = `${pad("Option", colW)}${padL("Bentham", numW)}${padL("Mill", numW)}${padL("Preference", numW)}`;

    const rows = options.map(o => {
      const name = o.label || `Option ${options.indexOf(o) + 1}`;
      const b = sfmt(totalFW(o.consequences, "bentham"));
      const m = sfmt(totalFW(o.consequences, "mill"));
      const p = sfmt(totalFW(o.consequences, "preference"));
      const winner = fwKeys.some(fw => rankings[fw][0].id === o.id);
      return `${pad(name + (winner ? " *" : ""), colW)}${padL(b, numW)}${padL(m, numW)}${padL(p, numW)}`;
    }).join("\n");

    const verdictLine = unanimous
      ? `All three frameworks agree: ${rankings.bentham[0].label} is preferred.`
      : `Frameworks disagree. See per-framework rankings below.`;

    const perFW = fwKeys.map(fw => {
      const lines = rankings[fw].map((r, i) => `  ${i + 1}. ${r.label} (${sfmt(r.score)} utils)`).join("\n");
      return `${FRAMEWORKS[fw].name}:\n${lines}`;
    }).join("\n\n");

    const consDetails = options.map(o => {
      const header2 = `\n${o.label || `Option ${options.indexOf(o) + 1}`}`;
      const rows2 = o.consequences
        .filter(c => c.text.trim())
        .map(c => {
          const s = rawScore(c);
          const ext = Math.max(parseFloat(c.extent) || 0, 0);
          const b = benthamScore(c);
          return `  [${c.valence}] ${c.text}\n    (${c.certainty}/10) × ${c.intensity} × ${ext.toLocaleString()} × (${c.duration}/10) = ${b !== null ? sfmt(b) : "unscored"} utils [Bentham]`;
        }).join("\n");
      return header2 + "\n" + (rows2 || "  (no consequences entered)");
    }).join("\n");

    const text = [
      "UTILITY CALCULUS REPORT",
      "═".repeat(40),
      `Situation: ${situation}`,
      "",
      "VERDICT",
      verdictLine,
      "",
      "SCORE TABLE (utils)",
      "* = preferred in at least one framework",
      divider,
      header,
      divider,
      rows,
      divider,
      "",
      "PER-FRAMEWORK RANKINGS",
      perFW,
      "",
      "CONSEQUENCE BREAKDOWN",
      consDetails,
      "",
      "Formula: score = (certainty/10) × intensity × extent × (duration/10)",
      "Mill applies a pleasure-tier multiplier. Preference Util subtracts future-preference frustration.",
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ marginTop: 24 }}>
      <hr style={S.hr} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={S.h2}>Results</div>
        <button onClick={copyResults} style={{ ...S.btn, fontSize: 11 }}>
          {copied ? "✓ Copied!" : "Copy results"}
        </button>
      </div>

      {/* Situation echo */}
      <div style={{ fontSize: 11, color: "#555", marginBottom: 12, fontStyle: "italic" }}>
        Situation: "{situation}"
      </div>

      {/* Consensus */}
      <div style={{ border: "1px solid #000", padding: "8px 10px", marginBottom: 16, background: unanimous ? "#f0f0f0" : "#fff8e0" }}>
        {unanimous
          ? <><strong>All three frameworks agree:</strong> {rankings.bentham[0].label} is the preferred option.</>
          : <><strong>Frameworks disagree.</strong> The choice of ethical framework changes the verdict — see table below.</>}
      </div>

      {/* Per-framework rankings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {fwKeys.map(fw => (
          <div key={fw} style={{ border: "1px solid #999", padding: "8px 10px" }}>
            <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 2, borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
              {FRAMEWORKS[fw].name}
            </div>
            {fw === "bentham" && <div style={{ fontSize: 10, color: "#666", margin: "4px 0 8px", lineHeight: 1.4 }}>Pure felt pleasure/pain. Painless death = zero (unfelt).</div>}
            {fw === "mill" && <div style={{ fontSize: 10, color: "#666", margin: "4px 0 8px", lineHeight: 1.4 }}>Multiplies by pleasure tier. Higher intellectual/moral goods outweigh bodily ones in kind.</div>}
            {fw === "preference" && <div style={{ fontSize: 10, color: "#666", margin: "4px 0 8px", lineHeight: 1.4 }}>Adds penalty for frustrated future preferences. Painless death can score very negatively.</div>}
            <div>
              {rankings[fw].map((r, i) => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3, fontSize: 12, fontWeight: i === 0 ? "bold" : "normal" }}>
                  <span>{i + 1}. {r.label || `Option ${options.findIndex(o => o.id === r.id) + 1}`}</span>
                  <span style={{ ...S.mono, fontSize: 11, marginLeft: 8 }}>{sfmt(r.score)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Divergence explainer */}
      {!unanimous && (
        <div style={{ border: "1px solid #ccc", padding: "8px 10px", fontSize: 11, marginBottom: 16, background: "#fafafa" }}>
          <strong>Why do they differ?</strong>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
            <li style={{ marginBottom: 4 }}><strong>Bentham → Mill:</strong> If you assigned different pleasure tiers to consequences, Mill's multipliers shift the ranking. Bodily harms (×0.5) weigh less than moral goods (×1.75) regardless of raw intensity.</li>
            <li style={{ marginBottom: 4 }}><strong>Bentham → Preference:</strong> Diverges most when consequences involve death or incapacitation. Bentham scores a painless death at zero; Preference Util adds a heavy negative for frustrated future preferences — making it a serious harm even if unfelt.</li>
            <li><strong>All agree:</strong> Frameworks converge when consequences are clearly felt, symmetrically distributed, and don't involve qualitative pleasure differences or death.</li>
          </ul>
        </div>
      )}

      {/* Raw scores table */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 6 }}>Score table (utils)</div>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#e0e0e0" }}>
              <th style={{ border: "1px solid #999", padding: "4px 8px", textAlign: "left" }}>Option</th>
              {fwKeys.map(fw => <th key={fw} style={{ border: "1px solid #999", padding: "4px 8px", textAlign: "right" }}>{FRAMEWORKS[fw].short}</th>)}
            </tr>
          </thead>
          <tbody>
            {options.map((o, i) => {
              const isWinner = fw => rankings[fw][0].id === o.id;
              return (
                <tr key={o.id} style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f5" }}>
                  <td style={{ border: "1px solid #999", padding: "4px 8px" }}>{o.label || `Option ${i + 1}`}</td>
                  {fwKeys.map(fw => (
                    <td key={fw} style={{ border: "1px solid #999", padding: "4px 8px", textAlign: "right", fontFamily: "Courier New, monospace", fontWeight: isWinner(fw) ? "bold" : "normal" }}>
                      {sfmt(totalFW(o.consequences, fw))}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>Bold = highest score in that framework. Bar charts omitted — focus on the numbers.</div>
      </div>

      {/* Limits note */}
      <div style={{ borderLeft: "3px solid #000", paddingLeft: 10, fontSize: 11, color: "#444", lineHeight: 1.6 }}>
        <strong>On the limits of the calculus.</strong> Bentham's framework structures reasoning but cannot replace moral judgment. It assumes all pleasures and pains are commensurable, underweights rights and distributive justice, and ignores moral character. The point is not to automate the verdict — it is to surface the assumptions hidden in your intuitions.
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [situation, setSituation] = useState("");
  const [stakeholders, setStakeholders] = useState("");
  const [options, setOptions] = useState([makeOption(), makeOption()]);
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const updateOption = (id, updated) => setOptions(options.map(o => o.id === id ? updated : o));
  const removeOption = (id) => setOptions(options.filter(o => o.id !== id));
  const addOption = () => setOptions([...options, makeOption()]);

  const canCompute = situation.trim() && options.every(o => o.label.trim()) && options.length >= 2;

  if (!started) {
    return (
      <div style={S.page}>
        <div style={S.h1}>Utility Calculator</div>
        <div style={{ fontSize: 11, color: "#555", marginBottom: 16 }}>A tool for applying utilitarian calculus to moral situations. Based on Bentham, Mill, and preference utilitarianism.</div>
        <hr style={S.hr} />
        <div style={{ fontFamily: "Courier New, monospace", fontSize: 11, background: "#f0f0f0", border: "1px solid #999", padding: "8px 12px", marginBottom: 16 }}>
          score = (certainty/10) × intensity × extent × (duration/10)<br />
          <span style={{ color: "#555" }}>Mill: × pleasure_tier | Preference: − future_preference_frustration</span>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>
          Enter any moral situation with two or more options. For each option, identify its consequences and rate them on Bentham's four dimensions: certainty, intensity, extent, and duration.
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 20 }}>
          Optionally expand each consequence to apply Mill's qualitative pleasure tiers, or add preference-utilitarian future-preference weights. Results compare all three frameworks simultaneously.
        </p>
        <button onClick={() => setStarted(true)} style={{ ...S.btn, padding: "5px 20px", fontSize: 13 }}>
          Start →
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={S.h1}>Utility Calculator</div>
        <button onClick={() => { setSituation(""); setStakeholders(""); setOptions([makeOption(), makeOption()]); setShowResults(false); }} style={S.btnSmall}>Reset</button>
      </div>
      <div style={{ ...S.mono, fontSize: 10, color: "#555", marginBottom: 14 }}>
        score = (certainty/10) × intensity × extent × (duration/10)
      </div>
      <hr style={S.hr} />

      {/* Situation */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Moral Situation</label>
        <textarea rows={3} placeholder="Describe the situation in your own words. Who is involved? What is at stake? What decision needs to be made?"
          value={situation} onChange={e => setSituation(e.target.value)}
          style={S.textarea} />
      </div>

      {/* Stakeholders */}
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Stakeholders (optional)</label>
        <input type="text" placeholder="List the groups or individuals affected, separated by commas"
          value={stakeholders} onChange={e => setStakeholders(e.target.value)}
          style={S.input} />
        <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>Identifying stakeholders helps you set accurate Extent values for each consequence.</div>
      </div>

      <hr style={S.hr} />

      {/* Options */}
      <div style={{ ...S.h2, marginBottom: 10 }}>Options ({options.length})</div>
      {options.map((o, i) => (
        <OptionBlock
          key={o.id} opt={o} optIdx={i}
          onChange={updated => updateOption(o.id, updated)}
          onRemove={() => removeOption(o.id)}
          canRemove={options.length > 2}
        />
      ))}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={addOption} style={S.btn}>+ Add option</button>
      </div>

      <hr style={S.hr} />

      {/* Compute */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <button onClick={() => setShowResults(true)} disabled={!canCompute} style={{ ...S.btn, background: canCompute ? "#d4d0c8" : "#e8e8e8", color: canCompute ? "#000" : "#999", padding: "5px 20px" }}>
          Compute →
        </button>
        {!canCompute && <span style={{ fontSize: 11, color: "#999" }}>
          {!situation.trim() ? "Enter a situation." : options.some(o => !o.label.trim()) ? "Name all options." : ""}
        </span>}
      </div>

      {showResults && <ResultsTable options={options} situation={situation} />}
    </div>
  );
}
