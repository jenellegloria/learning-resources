import { useState, useRef, useEffect } from "react";

const STEPS = [
  "intro",
  "imagine",
  "brainstorm",
  "goldenMean",
  "guided",
  "apply",
  "visualize",
];

const STEP_LABELS = [
  "What is Virtue?",
  "Imagine Excellence",
  "Brainstorm Virtues",
  "The Golden Mean",
  "Guided Practice",
  "Apply It",
  "Your Scale",
];

const excessMatches = [
  "self-indulgence", "indulgence", "gluttony", "excess",
  "licentiousness", "hedonism", "overindulgence", "intemperance",
  "debauchery", "decadence", "greed", "pleasure-seeking",
  "self indulgence", "over-indulgence", "profligacy",
  "hedonist", "wild", "self-indulgent", "selfish",
  "greedy", "glutton", "out of control", "no self-control",
  "partying", "addicted", "obsessed", "reckless",
  "wasteful", "spoiled", "undisciplined",
];
const deficiencyMatches = [
  "insensibility", "asceticism", "deprivation", "joylessness",
  "abstinence", "self-denial", "austerity", "denial",
  "repression", "self denial", "puritanism", "rigidity",
  "numbness", "anhedonia",
  "boring", "bland", "empty", "ascetic", "deprived",
  "joyless", "cold", "numb", "lifeless", "dull",
  "uptight", "strict", "frigid", "shut down",
  "no fun", "killjoy", "passionless",
];

const feedbackForModeration = (excess, deficiency) => {
  const ex = excess.toLowerCase().trim();
  const def = deficiency.toLowerCase().trim();
  const hints = { excess: null, deficiency: null, overall: null };
  let exGood = false;
  let defGood = false;

  if (ex === "" && def === "") {
    hints.overall = "Give it a try! Think about what happens when someone goes too far with pleasures, and what happens when someone denies themselves entirely.";
    return hints;
  }

  if (excessMatches.some(m => ex.includes(m))) {
    exGood = true;
    hints.excess = "That's right! The excess is self-indulgence — someone who gives in to every pleasure without restraint. They always want more and can't say no.";
  } else if (ex.includes("too much moderation") || ex.includes("extreme moderation")) {
    hints.excess = "Careful — remember, the excess isn't 'too much virtue.' You can't have too much moderation, because moderation IS the excellence. The excess is about the behavior — going too far with pleasures. What do you call someone who gives in to every desire?";
  } else if (ex.includes("lust") || ex.includes("addiction")) {
    hints.excess = "You're in the right area! Those are related to overindulgence. But think bigger — what's the general word for someone who chases every pleasure without self-control?";
  } else if (ex) {
    hints.excess = "Not quite. Think about it this way: moderation is about how we handle pleasures and desires. What do you call someone who chases every pleasure, eats too much, drinks too much, and can never say no? What's that lifestyle called?";
  }

  if (deficiencyMatches.some(m => def.includes(m))) {
    defGood = true;
    hints.deficiency = "Spot on! The deficiency is a kind of insensibility — someone so strict with themselves that they can't enjoy anything at all. Aristotle thought this was just as much a problem as overindulgence.";
  } else if (def.includes("coward") || def.includes("fear")) {
    hints.deficiency = "That's more related to courage than moderation. For moderation, think about the other extreme: what if someone denied themselves ALL pleasure? What if they couldn't enjoy anything at all?";
  } else if (def) {
    hints.deficiency = "Not quite. The deficiency of moderation is about someone who goes too far the other direction — not chasing too much pleasure, but cutting out ALL pleasure. They can't enjoy food, fun, or anything. What would you call someone who is completely joyless and shut down?";
  }

  if (exGood && defGood) {
    hints.overall = "You nailed both! Moderation (temperance) sits right between self-indulgence and insensibility — enjoying life's pleasures in the right way, at the right time, in the right amount.";
  } else if (exGood || defGood) {
    hints.overall = "You've got one side figured out — now see if you can get the other!";
  }

  return hints;
};

const ScaleViz = ({ virtue, excess, deficiency, id }) => {
  const [hovered, setHovered] = useState(null);
  const beamId = `beam-${id || 'default'}`;
  const shadowId = `shadow-${id || 'default'}`;
  return (
    <div style={{ margin: "2rem auto", maxWidth: 600 }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#2d2a24",
          letterSpacing: "0.03em",
        }}>The Doctrine of the Mean</span>
      </div>
      <svg viewBox="0 0 600 260" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id={beamId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#d4a053" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <filter id={shadowId}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>
        {/* Base / Fulcrum */}
        <polygon points="300,250 270,220 330,220" fill="#78716c" opacity="0.7" />
        <rect x="290" y="215" width="20" height="8" rx="2" fill="#a8a29e" />
        {/* Beam */}
        <rect x="50" y="180" width="500" height="8" rx="4" fill={`url(#${beamId})`} filter={`url(#${shadowId})`} />
        {/* Deficiency side */}
        <g
          onMouseEnter={() => setHovered("def")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <circle cx="100" cy="110" r={hovered === "def" ? 38 : 34} fill="#dc2626" opacity={hovered === "def" ? 0.2 : 0.12} style={{ transition: "all 0.3s" }} />
          <circle cx="100" cy="110" r="28" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.5" />
          <text x="100" y="105" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="11" fill="#991b1b" fontWeight="600">DEFICIENCY</text>
          <text x="100" y="122" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="13" fill="#dc2626" fontWeight="700">{deficiency || "?"}</text>
          <text x="100" y="80" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="9" fill="#78716c" fontStyle="italic">too little</text>
          <line x1="100" y1="145" x2="100" y2="180" stroke="#dc2626" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 3" />
        </g>
        {/* Virtue center */}
        <g
          onMouseEnter={() => setHovered("virtue")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <circle cx="300" cy="100" r={hovered === "virtue" ? 48 : 44} fill="#15803d" opacity={hovered === "virtue" ? 0.18 : 0.1} style={{ transition: "all 0.3s" }} />
          <circle cx="300" cy="100" r="38" fill="none" stroke="#15803d" strokeWidth="2.5" opacity="0.6" />
          <text x="300" y="92" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="11" fill="#166534" fontWeight="600" letterSpacing="0.08em">VIRTUE</text>
          <text x="300" y="112" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="15" fill="#15803d" fontWeight="700">{virtue || "?"}</text>
          <text x="300" y="57" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="9" fill="#78716c" fontStyle="italic">the excellent mean</text>
          <line x1="300" y1="145" x2="300" y2="180" stroke="#15803d" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 3" />
        </g>
        {/* Excess side */}
        <g
          onMouseEnter={() => setHovered("ex")}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <circle cx="500" cy="110" r={hovered === "ex" ? 38 : 34} fill="#dc2626" opacity={hovered === "ex" ? 0.2 : 0.12} style={{ transition: "all 0.3s" }} />
          <circle cx="500" cy="110" r="28" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.5" />
          <text x="500" y="105" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="11" fill="#991b1b" fontWeight="600">EXCESS</text>
          <text x="500" y="122" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="13" fill="#dc2626" fontWeight="700">{excess || "?"}</text>
          <text x="500" y="80" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="9" fill="#78716c" fontStyle="italic">too much</text>
          <line x1="500" y1="145" x2="500" y2="180" stroke="#dc2626" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 3" />
        </g>
        {/* Dashed connectors */}
        <line x1="155" y1="184" x2="245" y2="184" stroke="#a8a29e" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="355" y1="184" x2="445" y2="184" stroke="#a8a29e" strokeWidth="1" strokeDasharray="4 3" />
      </svg>
    </div>
  );
};

export default function GoldenMeanActivity() {
  const [step, setStep] = useState(0);
  const [characterDesc, setCharacterDesc] = useState("");
  const [virtueInput, setVirtueInput] = useState("");
  const [virtues, setVirtues] = useState([]);
  const [modExcess, setModExcess] = useState("");
  const [modDeficiency, setModDeficiency] = useState("");
  const [modFeedback, setModFeedback] = useState(null);
  const [modSubmitted, setModSubmitted] = useState(false);
  const [modPassed, setModPassed] = useState(false);
  const [selectedVirtue, setSelectedVirtue] = useState("");
  const [userExcess, setUserExcess] = useState("");
  const [userDeficiency, setUserDeficiency] = useState("");
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const addVirtue = () => {
    const v = virtueInput.trim();
    if (v && !virtues.includes(v)) {
      setVirtues([...virtues, v]);
      setVirtueInput("");
    }
  };

  const removeVirtue = (i) => setVirtues(virtues.filter((_, idx) => idx !== i));

  const checkModeration = () => {
    const fb = feedbackForModeration(modExcess, modDeficiency);
    setModFeedback(fb);
    setModSubmitted(true);
    const ex = modExcess.toLowerCase().trim();
    const def = modDeficiency.toLowerCase().trim();
    const exOk = excessMatches.some(m => ex.includes(m));
    const defOk = deficiencyMatches.some(m => def.includes(m));
    if (exOk && defOk) setModPassed(true);
  };

  const canAdvance = () => {
    if (step === 1) return characterDesc.trim().length > 10;
    if (step === 2) return virtues.length >= 3;
    if (step === 4) return modPassed;
    if (step === 5) return selectedVirtue && userExcess.trim() && userDeficiency.trim();
    return true;
  };

  const buildResultsText = () => {
    let text = "========================================\n";
    text += "  ARISTOTLE'S GOLDEN MEAN — MY RESULTS\n";
    text += "========================================\n\n";
    text += "MY VISION OF EXCELLENCE:\n";
    text += characterDesc + "\n\n";
    text += "MY VIRTUES:\n";
    virtues.forEach((v, i) => { text += `  ${i + 1}. ${v}\n`; });
    text += "\nGUIDED PRACTICE — MODERATION:\n";
    text += `  Excess: ${modExcess}\n`;
    text += `  Virtue: Moderation\n`;
    text += `  Deficiency: ${modDeficiency}\n\n`;
    text += "MY OWN ANALYSIS:\n";
    text += `  Virtue: ${selectedVirtue}\n`;
    text += `  Excess (too much of the behavior): ${userExcess}\n`;
    text += `  Deficiency (too little of the behavior): ${userDeficiency}\n\n`;
    text += "THE SCALE:\n";
    text += `  [${userDeficiency}] <---- [ ${selectedVirtue} ] ----> [${userExcess}]\n`;
    text += `   deficiency          the excellent mean          excess\n`;
    return text;
  };

  const copyResults = async () => {
    try {
      await navigator.clipboard.writeText(buildResultsText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = buildResultsText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const printResults = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head><title>Golden Mean Results</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Serif+4:wght@400;600&display=swap');
          body { font-family: 'Source Serif 4', Georgia, serif; max-width: 640px; margin: 2rem auto; padding: 2rem; color: #2d2a24; line-height: 1.7; }
          h1 { font-family: 'Cormorant Garamond', serif; text-align: center; font-size: 2rem; color: #44403c; border-bottom: 2px solid #d4a053; padding-bottom: 0.5rem; }
          h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #78716c; margin-top: 2rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
          .desc { background: #f5f0e8; padding: 1rem 1.2rem; border-radius: 8px; font-style: italic; }
          .chip { display: inline-block; background: #f0ebe3; border: 1px solid #ddd5c8; border-radius: 20px; padding: 0.25rem 0.85rem; margin: 0.2rem; font-family: 'Cormorant Garamond', serif; font-weight: 600; }
          .scale-row { display: flex; justify-content: space-between; align-items: center; margin: 2rem 0; text-align: center; }
          .scale-item { flex: 1; padding: 1rem; }
          .scale-item.def, .scale-item.ex { color: #dc2626; }
          .scale-item.virtue { color: #15803d; font-size: 1.2rem; font-weight: 700; }
          .scale-label { font-size: 0.8rem; color: #78716c; text-transform: uppercase; letter-spacing: 0.08em; }
          .scale-bar { height: 4px; background: linear-gradient(90deg, #dc2626, #15803d, #dc2626); border-radius: 2px; margin: 0.5rem 0; }
          @media print { body { margin: 1rem; } }
        </style></head><body>
        <h1>The Golden Mean</h1>
        <p style="text-align:center;color:#78716c;">Aristotle's Ethics &mdash; My Results</p>
        <h2>My Vision of Excellence</h2>
        <div class="desc">${characterDesc.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <h2>My Virtues</h2>
        <div>${virtues.map(v => `<span class="chip">${v.replace(/</g, '&lt;')}</span>`).join(' ')}</div>
        <h2>Guided Practice: Moderation</h2>
        <div class="scale-row">
          <div class="scale-item def"><div class="scale-label">Deficiency</div>${modDeficiency.replace(/</g, '&lt;')}</div>
          <div class="scale-item virtue"><div class="scale-label">Virtue</div>Moderation</div>
          <div class="scale-item ex"><div class="scale-label">Excess</div>${modExcess.replace(/</g, '&lt;')}</div>
        </div>
        <div class="scale-bar"></div>
        <h2>My Analysis: ${selectedVirtue.replace(/</g, '&lt;')}</h2>
        <div class="scale-row">
          <div class="scale-item def"><div class="scale-label">Deficiency</div>${userDeficiency.replace(/</g, '&lt;')}</div>
          <div class="scale-item virtue"><div class="scale-label">Virtue</div>${selectedVirtue.replace(/</g, '&lt;')}</div>
          <div class="scale-item ex"><div class="scale-label">Excess</div>${userExcess.replace(/</g, '&lt;')}</div>
        </div>
        <div class="scale-bar"></div>
      </body></html>`);
      w.document.close();
      w.print();
    }
  };

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
  `;

  const base = {
    fontFamily: "'Source Serif 4', 'Georgia', serif",
    color: "#2d2a24",
    lineHeight: 1.7,
    fontSize: "1.05rem",
  };

  const heading = {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    color: "#44403c",
    letterSpacing: "0.01em",
  };

  const card = {
    background: "#fffbf5",
    border: "1px solid #e7ddd0",
    borderRadius: 12,
    padding: "2rem",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 12px rgba(120,100,70,0.06)",
  };

  const inputStyle = {
    ...base,
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid #d6cfc3",
    borderRadius: 8,
    background: "#fefdfb",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box",
  };

  const btnPrimary = {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    fontSize: "1.05rem",
    padding: "0.65rem 2rem",
    background: "#78716c",
    color: "#faf9f7",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "background 0.2s",
  };

  const btnSecondary = {
    ...btnPrimary,
    background: "#b8a98e",
    fontSize: "0.95rem",
    padding: "0.5rem 1.4rem",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#f0ebe3",
    border: "1px solid #ddd5c8",
    borderRadius: 20,
    padding: "0.3rem 0.9rem",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#57534e",
    margin: "0.25rem",
  };

  const feedbackBox = (type) => ({
    padding: "1rem 1.2rem",
    borderRadius: 8,
    marginTop: "0.75rem",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    background: type === "success" ? "#f0fdf4" : "#fffbeb",
    border: `1px solid ${type === "success" ? "#bbf7d0" : "#fde68a"}`,
    color: type === "success" ? "#166534" : "#92400e",
  });

  const progress = (
    <div style={{ display: "flex", gap: 4, marginBottom: "2rem", flexWrap: "wrap" }}>
      {STEPS.map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: i <= step ? 700 : 500,
              background: i < step ? "#78716c" : i === step ? "#d4a053" : "#e7ddd0",
              color: i <= step ? "#fff" : "#a8a29e",
              transition: "all 0.3s",
            }}
          >
            {i < step ? "✓" : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 20, height: 2, background: i < step ? "#78716c" : "#e7ddd0", transition: "all 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={card}>
            <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>What Is a Virtue?</h2>
            <p>
              In everyday language, we might use "virtue" to mean something like "a good quality." But for Aristotle, the word meant something deeper and more specific. The Greek word is <em>aretē</em> (ἀρετή) — and it's better translated as <strong>excellence</strong>.
            </p>
            <p>
              An excellence isn't just something nice to have. It's what makes something <em>outstandingly good at what it is</em>. The excellence of a knife is its sharpness. The excellence of an eye is its ability to see clearly. So what is the excellence of a <em>human being?</em>
            </p>
            <p>
              For Aristotle, human virtues are the excellences of <strong>character</strong> — the qualities that make a person genuinely good at living. Not just surviving, but <em>flourishing</em>. A virtuous person doesn't just follow rules. They have the kind of character that naturally leads them toward a well-lived life.
            </p>
            <p style={{ color: "#78716c", fontStyle: "italic", marginBottom: 0 }}>
              This is why you can never have "too much" virtue. You can't be "too excellent." That would be like saying a knife is too sharp, or an eye sees too clearly. Virtue IS the perfection — the sweet spot — the thing you're aiming at.
            </p>
          </div>
        );
      case 1:
        return (
          <div style={card}>
            <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>Imagine Excellence</h2>
            <p>
              Think of a person — real or imaginary — who has truly <em>mastered the art of living well</em>. Someone who has life figured out. They are deeply excellent as a human being.
            </p>
            <p>
              This isn't about fame, wealth, or power. It's about character. What kind of person are they? How do they handle hardship? How do they treat people? What's it like to be around them?
            </p>
            <div style={{ background: "#f5f0e8", borderRadius: 8, padding: "1.2rem", margin: "1rem 0" }}>
              <p style={{ margin: 0, fontStyle: "italic", color: "#78716c", fontSize: "0.95rem" }}>
                Describe this person below. What makes them excellent? What are their qualities? How do they act in the world?
              </p>
            </div>
            <textarea
              value={characterDesc}
              onChange={(e) => setCharacterDesc(e.target.value)}
              placeholder="They are the kind of person who..."
              rows={6}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            {characterDesc.trim().length > 0 && characterDesc.trim().length <= 10 && (
              <p style={{ color: "#b45309", fontSize: "0.9rem", marginTop: 8 }}>Tell us a bit more — really paint a picture of this person!</p>
            )}
          </div>
        );
      case 2:
        return (
          <div style={card}>
            <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>Brainstorm Virtues</h2>
            <p>
              Now that you've imagined someone excellent, let's name the specific qualities that make them that way. These are <strong>virtues</strong> — excellences of character.
            </p>
            <p>
              To get you started: think about things like courage, kindness, or wisdom. But don't stop there — what other qualities make someone truly excellent? Try to list <strong>at least five</strong>.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={virtueInput}
                onChange={(e) => setVirtueInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addVirtue()}
                placeholder="Type a virtue and press Enter..."
              />
              <button style={btnSecondary} onClick={addVirtue}>Add</button>
            </div>
            <div style={{ minHeight: 40, display: "flex", flexWrap: "wrap", gap: 4 }}>
              {virtues.map((v, i) => (
                <span key={i} style={chip}>
                  {v}
                  <span
                    onClick={() => removeVirtue(i)}
                    style={{ cursor: "pointer", opacity: 0.5, fontSize: "1.1rem", lineHeight: 1 }}
                  >×</span>
                </span>
              ))}
            </div>
            {virtues.length > 0 && virtues.length < 3 && (
              <p style={{ color: "#b45309", fontSize: "0.9rem", marginTop: 12 }}>
                Great start! Try to think of at least {3 - virtues.length} more.
              </p>
            )}
            {virtues.length >= 3 && virtues.length < 5 && (
              <p style={{ color: "#78716c", fontSize: "0.9rem", marginTop: 12 }}>
                Nice list! You can keep going if you want, or move on when you're ready.
              </p>
            )}
            {virtues.length >= 5 && (
              <p style={{ color: "#166534", fontSize: "0.9rem", marginTop: 12 }}>
                Excellent collection! You're thinking like Aristotle. Ready for the next step?
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <div style={card}>
              <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>The Doctrine of the Golden Mean</h2>
              <p>
                Here's Aristotle's big idea: every virtue is a <strong>mean between two extremes</strong>. Not a mathematical average — a <em>sweet spot</em>, the point of excellence between two ways of going wrong.
              </p>
              <p>
                This is crucial to understand: the two extremes are not "too much virtue" and "too little virtue." Remember — you can't have too much virtue, because virtue <em>is</em> the excellence. Instead, the extremes are about the <strong>underlying behavior or emotion</strong> associated with the virtue.
              </p>
            </div>
            <div style={{ ...card, borderLeft: "4px solid #d4a053" }}>
              <h3 style={{ ...heading, fontSize: "1.3rem", marginTop: 0, color: "#b45309" }}>Example: Courage</h3>
              <p>
                Courage deals with <strong>fear and confidence</strong>. Now, consider the two ways to get it wrong:
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0" }}>
                <div style={{ flex: 1, minWidth: 200, background: "#fef2f2", borderRadius: 8, padding: "1rem", border: "1px solid #fecaca" }}>
                  <strong style={{ color: "#dc2626" }}>Excess → Rashness</strong>
                  <p style={{ fontSize: "0.95rem", marginBottom: 0 }}>
                    Too much confidence, too little fear. A rash person charges into danger without thinking. They aren't brave — they're reckless. They haven't mastered fear; they've just ignored it.
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: 200, background: "#f0fdf4", borderRadius: 8, padding: "1rem", border: "1px solid #bbf7d0" }}>
                  <strong style={{ color: "#15803d" }}>Mean → Courage</strong>
                  <p style={{ fontSize: "0.95rem", marginBottom: 0 }}>
                    The right amount of confidence and fear, in the right situation. A courageous person feels fear but acts well despite it. They know when to stand firm and when to retreat.
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: 200, background: "#fef2f2", borderRadius: 8, padding: "1rem", border: "1px solid #fecaca" }}>
                  <strong style={{ color: "#dc2626" }}>Deficiency → Cowardice</strong>
                  <p style={{ fontSize: "0.95rem", marginBottom: 0 }}>
                    Too much fear, too little confidence. A cowardly person lets fear control them. They flee from everything, even things worth standing up for.
                  </p>
                </div>
              </div>
              <ScaleViz id="courage" virtue="Courage" excess="Rashness" deficiency="Cowardice" />
              <p style={{ fontStyle: "italic", color: "#78716c", fontSize: "0.95rem", marginBottom: 0 }}>
                Notice: "rashness" isn't "too much courage." Rashness is a <em>failure</em> — a lack of proper judgment about danger. Courage is the excellence. You get there by having the <em>right relationship</em> with fear and confidence.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={card}>
            <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>Guided Practice: Moderation</h2>
            <p>
              Now it's your turn. Let's try the virtue of <strong>moderation</strong> (sometimes called <em>temperance</em>). This virtue is about how we handle <strong>pleasure</strong> — things like food, drink, comfort, and fun.
            </p>
            <p>
              A moderate person enjoys life's pleasures in the right way and the right amount. But what happens when someone gets it wrong? There are two ways to miss the mark:
            </p>
            <div style={{ background: "#f5f0e8", borderRadius: 8, padding: "1rem", margin: "1rem 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#78716c" }}>
                <strong>Hint:</strong> Think about what the behavior is (pursuing pleasure). What do you call someone who goes way overboard with pleasure? And what do you call someone who shuts out all pleasure entirely?
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ ...heading, fontSize: "0.95rem", display: "block", marginBottom: 6, color: "#991b1b" }}>
                  The Excess (going overboard with pleasure):
                </label>
                <input
                  style={inputStyle}
                  value={modExcess}
                  onChange={(e) => { setModExcess(e.target.value); setModSubmitted(false); }}
                  placeholder="What do you call someone who goes too far?"
                />
                {modSubmitted && modFeedback?.excess && (
                  <div style={feedbackBox(modFeedback.excess.startsWith("That's right") || modFeedback.excess.startsWith("Spot on") ? "success" : "hint")}>
                    {modFeedback.excess}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ ...heading, fontSize: "0.95rem", display: "block", marginBottom: 6, color: "#991b1b" }}>
                  The Deficiency (shutting out all pleasure):
                </label>
                <input
                  style={inputStyle}
                  value={modDeficiency}
                  onChange={(e) => { setModDeficiency(e.target.value); setModSubmitted(false); }}
                  placeholder="What do you call someone who feels nothing?"
                />
                {modSubmitted && modFeedback?.deficiency && (
                  <div style={feedbackBox(modFeedback.deficiency.startsWith("That's right") || modFeedback.deficiency.startsWith("Spot on") ? "success" : "hint")}>
                    {modFeedback.deficiency}
                  </div>
                )}
              </div>
            </div>
            {modSubmitted && modFeedback?.overall && (
              <div style={feedbackBox(modPassed ? "success" : "hint")}>
                <strong>{modPassed ? "🎉 " : "💡 "}</strong>{modFeedback.overall}
              </div>
            )}
            <div style={{ marginTop: "1.5rem" }}>
              <button style={btnSecondary} onClick={checkModeration}>
                {modSubmitted ? "Try Again" : "Check My Answers"}
              </button>
            </div>
            {modPassed && <ScaleViz id="moderation" virtue="Moderation" excess={modExcess} deficiency={modDeficiency} />}
          </div>
        );
      case 5:
        return (
          <div style={card}>
            <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>Apply the Doctrine of the Mean</h2>
            <p>
              Now pick one of the virtues you brainstormed earlier. Your job is to figure out the two extremes — just like we did with courage and moderation.
            </p>
            <div style={{ background: "#f5f0e8", borderRadius: 8, padding: "1rem", margin: "1rem 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#78716c" }}>
                <strong>Think about it like this:</strong> What feeling or behavior does this virtue deal with? Now — what happens when someone has <em>way too much</em> of that behavior? And what happens when they have <em>way too little</em>? The virtue is the sweet spot in between.
              </p>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ ...heading, fontSize: "1rem", display: "block", marginBottom: 8 }}>
                Choose a virtue:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {virtues.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVirtue(v)}
                    style={{
                      ...chip,
                      cursor: "pointer",
                      background: selectedVirtue === v ? "#d4a053" : "#f0ebe3",
                      color: selectedVirtue === v ? "#fff" : "#57534e",
                      border: selectedVirtue === v ? "1px solid #b8860b" : "1px solid #ddd5c8",
                      transition: "all 0.2s",
                    }}
                  >{v}</button>
                ))}
              </div>
            </div>
            {selectedVirtue && (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <label style={{ ...heading, fontSize: "0.95rem", display: "block", marginBottom: 6, color: "#991b1b" }}>
                    The Excess (too much of the behavior):
                  </label>
                  <input
                    style={inputStyle}
                    value={userExcess}
                    onChange={(e) => setUserExcess(e.target.value)}
                    placeholder="What happens when someone goes overboard?"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <label style={{ ...heading, fontSize: "0.95rem", display: "block", marginBottom: 6, color: "#991b1b" }}>
                    The Deficiency (too little of the behavior):
                  </label>
                  <input
                    style={inputStyle}
                    value={userDeficiency}
                    onChange={(e) => setUserDeficiency(e.target.value)}
                    placeholder="What happens when someone has too little?"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 6:
        return (
          <div style={card}>
            <h2 style={{ ...heading, fontSize: "1.8rem", marginTop: 0 }}>Your Scale of Virtue</h2>
            <p>
              Here's a visual of the doctrine of the mean as you've applied it to <strong>{selectedVirtue}</strong>. Hover over each part of the scale to highlight it.
            </p>
            <ScaleViz
              id="user"
              virtue={selectedVirtue}
              excess={userExcess}
              deficiency={userDeficiency}
            />
            <div style={{ background: "#f5f0e8", borderRadius: 8, padding: "1.5rem", marginTop: "1.5rem" }}>
              <h3 style={{ ...heading, fontSize: "1.15rem", marginTop: 0 }}>Your Analysis</h3>
              <p style={{ marginBottom: 8 }}>
                <strong style={{ color: "#dc2626" }}>Deficiency ({userDeficiency}):</strong> When someone has too little of the behavior associated with {selectedVirtue.toLowerCase()}.
              </p>
              <p style={{ marginBottom: 8 }}>
                <strong style={{ color: "#15803d" }}>Virtue ({selectedVirtue}):</strong> The excellent mean — the sweet spot of character where a person relates to this area of life with true excellence.
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong style={{ color: "#dc2626" }}>Excess ({userExcess}):</strong> When someone goes too far in the associated behavior — not "too much virtue," but a different kind of failure.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a" }}>
              <p style={{ margin: 0, fontStyle: "italic", color: "#92400e", fontSize: "0.95rem" }}>
                Remember Aristotle's key insight: the mean is not about "being moderate in everything." It's about hitting the <em>excellent</em> target — the point where your character is truly functioning at its best. Different situations call for different responses. The wise person knows what's called for and responds with the right feeling, at the right time, toward the right people, in the right way.
              </p>
            </div>
            {/* Print / Copy buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <button
                style={{ ...btnPrimary, background: "#b45309", display: "flex", alignItems: "center", gap: 8 }}
                onClick={printResults}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print My Results
              </button>
              <button
                style={{ ...btnPrimary, background: copied ? "#15803d" : "#78716c", display: "flex", alignItems: "center", gap: 8, transition: "background 0.3s" }}
                onClick={copyResults}
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #faf8f4 0%, #f0ebe3 50%, #e8e0d4 100%)",
      ...base,
    }}>
      <style>{fonts}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }} ref={scrollRef}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8a29e", marginBottom: 4 }}>
            Aristotle's Ethics
          </div>
          <h1 style={{
            ...heading,
            fontSize: "2.4rem",
            margin: "0.3rem 0",
            background: "linear-gradient(135deg, #78716c, #b45309)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            The Golden Mean
          </h1>
          <div style={{ width: 60, height: 3, background: "#d4a053", margin: "0.8rem auto", borderRadius: 2 }} />
          <p style={{ color: "#78716c", fontSize: "0.95rem", marginTop: 8 }}>
            An Interactive Exploration of Virtue and Excellence
          </p>
        </div>

        {/* Progress */}
        {progress}

        {/* Step Label */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#a8a29e",
          marginBottom: "0.75rem",
        }}>
          Step {step + 1} of {STEPS.length} — {STEP_LABELS[step]}
        </div>

        {/* Content */}
        {renderStep()}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingBottom: "2rem" }}>
          <button
            style={{ ...btnPrimary, opacity: step === 0 ? 0.3 : 1, background: "#a8a29e" }}
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 && (
            <button
              style={{ ...btnPrimary, opacity: canAdvance() ? 1 : 0.4 }}
              onClick={() => canAdvance() && setStep(step + 1)}
              disabled={!canAdvance()}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
