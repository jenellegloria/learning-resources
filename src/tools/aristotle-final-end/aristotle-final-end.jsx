import { useState, useRef, useEffect } from "react";

const PHASE_LABELS = ["The Why Chain", "Value Categorization", "The Final End"];

const CATEGORY_INFO = {
  instrumental: {
    label: "Instrumental",
    color: "#C4956A",
    bg: "rgba(196,149,106,0.12)",
    border: "rgba(196,149,106,0.4)",
    description: "Valued as a means to something else — useful for what it leads to.",
    example: 'e.g., "Taking the bus" is valuable because it gets you somewhere.',
  },
  intrinsic: {
    label: "Intrinsic",
    color: "#7BA68A",
    bg: "rgba(123,166,138,0.12)",
    border: "rgba(123,166,138,0.4)",
    description: "Valued for its own sake — good in itself, not because it leads to something else.",
    example: 'e.g., "Happiness" — you don\'t want it for the sake of something further.',
  },
  both: {
    label: "Both",
    color: "#8B9EC2",
    bg: "rgba(139,158,194,0.12)",
    border: "rgba(139,158,194,0.4)",
    description: "Valued both for its own sake AND as a means to something else.",
    example:
      'e.g., "Learning" — enjoyable in itself, but also opens doors.',
  },
};

function getGuidance(text, position, totalLinks) {
  const lower = text.toLowerCase();
  const isLast = position === totalLinks - 1;
  const isFirst = position === 0;

  const instrumentalPatterns = [
    /\b(get|getting|earn|earning|make|making|pay|paying)\b.*\b(money|degree|job|grade|salary|income|credit)\b/,
    /\b(pass|passing)\b.*\b(class|course|exam|test)\b/,
    /\b(go|going|attend|attending)\b.*\b(college|university|school|class)\b/,
    /\b(degree|diploma|certificate|gpa|resume)\b/,
    /\bto (get|be able|have access|qualify|prepare)\b/,
    /\b(requirement|prerequisite|stepping stone|necessary|need to)\b/,
    /\b(in order to|so that|so i can)\b/,
    /\btransportation|commut/,
  ];

  const intrinsicPatterns = [
    /\b(happy|happiness|joy|joyful|fulfilled|fulfillment|peace|content|contentment)\b/,
    /\b(love|loving) (it|this|doing|learning|the)\b/,
    /\b(enjoy|enjoyment|pleasure|satisf|delight)\b/,
    /\b(meaning|meaningful|purpose|purposeful)\b/,
    /\b(good life|well-being|wellbeing|flourish|eudaimonia)\b/,
    /\b(beautiful|beauty|wonder|awe)\b/,
    /\bit.*makes me feel (good|alive|whole|complete)\b/,
    /\b(for its own sake|end in itself|just because)\b/,
    /\b(friendship|love|connection)\b(?!.*\b(network|career|job)\b)/,
  ];

  const bothPatterns = [
    /\b(learn|knowledge|education|understanding|wisdom)\b/,
    /\b(health|healthy|exercise|fitness)\b/,
    /\b(friendship|community|relationship)\b.*\b(and|also|plus|but)\b/,
    /\b(creative|creativity|art|music|writing)\b/,
    /\b(virtue|virtuous|good person|character)\b/,
  ];

  const instrumentalScore = instrumentalPatterns.filter((p) => p.test(lower)).length;
  const intrinsicScore = intrinsicPatterns.filter((p) => p.test(lower)).length;
  const bothScore = bothPatterns.filter((p) => p.test(lower)).length;

  if (isLast && intrinsicScore > 0) {
    return {
      suggestion: "intrinsic",
      note: "This looks like it might be your bedrock — the thing valued for its own sake. If you couldn't ask 'why?' any further, that's a strong signal of intrinsic value.",
    };
  }

  if (intrinsicScore > instrumentalScore && intrinsicScore > bothScore) {
    return {
      suggestion: "intrinsic",
      note: "This sounds like something valued for its own sake. But consider: does it also serve as a means to anything else in your chain?",
    };
  }

  if (bothScore > 0 && (instrumentalScore > 0 || intrinsicScore > 0)) {
    return {
      suggestion: "both",
      note: "This might be valued both in itself and as a means to something else. Many of the richest goods work this way.",
    };
  }

  if (instrumentalScore > intrinsicScore) {
    return {
      suggestion: "instrumental",
      note: "This looks like a means to an end — something valuable because of what it leads to, rather than for its own sake.",
    };
  }

  if (bothScore > 0) {
    return {
      suggestion: "both",
      note: "This could be valued both for itself and for what it leads to. Think about whether you'd still want it even if it didn't lead to the next link.",
    };
  }

  if (isFirst) {
    return {
      suggestion: "instrumental",
      note: "The first link in a 'why' chain is often instrumental — it's what you're doing, which usually serves some further purpose.",
    };
  }

  return {
    suggestion: null,
    note: "Think carefully: would you still want this even if it didn't lead to anything else? Or is it mainly valuable as a stepping stone?",
  };
}

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  );
};

export default function AristotleApp() {
  const [phase, setPhase] = useState(0);
  const [chain, setChain] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [categories, setCategories] = useState({});
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const [showGuidance, setShowGuidance] = useState({});
  const [argumentStep, setArgumentStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [reflection, setReflection] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const inputRef = useRef(null);
  const chainEndRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [chain.length, phase, started]);

  useEffect(() => {
    if (chainEndRef.current) {
      chainEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chain.length]);

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;
    setChain([...chain, currentAnswer.trim()]);
    setCurrentAnswer("");
  };

  const handleFinishChain = () => {
    if (chain.length >= 2) setPhase(1);
  };

  const handleCategorize = (cat) => {
    const newCats = { ...categories, [currentCatIndex]: cat };
    setCategories(newCats);
    setShowGuidance({ ...showGuidance, [currentCatIndex]: false });
    if (currentCatIndex < chain.length - 1) {
      setTimeout(() => setCurrentCatIndex(currentCatIndex + 1), 400);
    }
  };

  const allCategorized = Object.keys(categories).length === chain.length;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const getQuestion = () => {
    if (chain.length === 0) return "Why are you here? Why did you click this link, and why are you filling in the textbox below? Be honest — there's no right or wrong answer.";
    const last = chain[chain.length - 1];
    const starters = [
      `But why do you want "${last}"?`,
      `And why is "${last}" important to you?`,
      `What makes "${last}" worth pursuing?`,
      `Why does "${last}" matter?`,
    ];
    return starters[chain.length % starters.length];
  };

  const argumentSteps = [
    {
      title: "Your Chain of Reasons",
      body: `You started with "${chain[0] || "..."}" and followed the thread of "why?" until you reached "${chain[chain.length - 1] || "..."}." Each link was a reason for the one before it.`,
    },
    {
      title: "The Pattern",
      body: (() => {
        const instrumentals = chain.filter((_, i) => categories[i] === "instrumental");
        const intrinsics = chain.filter((_, i) => categories[i] === "intrinsic");
        const boths = chain.filter((_, i) => categories[i] === "both");
        let text =
          "Look at your chain. Most of the early links are instrumental — they're means to something else. ";
        if (intrinsics.length > 0)
          text += `But you eventually reached something you valued for its own sake: "${intrinsics[intrinsics.length - 1]}." `;
        if (boths.length > 0)
          text += `Some links, like "${boths[0]}," were valued both as means and as ends. `;
        text += "This pattern isn't accidental.";
        return text;
      })(),
    },
    {
      title: "The Infinite Regress Problem",
      body: `Imagine your chain never ended. Every time you said "I want X," you could only justify it by pointing to some further Y. And Y only mattered because of Z. And Z because of something else. Forever.\n\nAristotle says this would make all desire "empty and vain." If nothing is valued for its own sake, then nothing is really valued at all — every good borrows its value from the next, but no good actually has any value to lend.`,
    },
    {
      title: "The Final End",
      body: `So there must be something that stops the chain — a "final end" (telos) that is desired for its own sake and never merely for the sake of something else.\n\nYour chain stopped at "${chain[chain.length - 1] || "..."}." You couldn't go further because you'd reached something you consider good in itself.\n\nThis is exactly Aristotle's point in the opening of the Nicomachean Ethics: every pursuit aims at some good, but all these goods form a hierarchy. And that hierarchy must have a summit — a highest good — or the whole structure collapses.`,
    },
    {
      title: "The Question That Follows",
      body: `Aristotle calls this highest good eudaimonia — often translated as "happiness" or "flourishing." But what does that really consist in? That's the question the rest of the Nicomachean Ethics tries to answer.\n\nYour chain is a personal map of this ancient puzzle. The fact that you could trace your reasons from "${chain[0] || "..."}" all the way to "${chain[chain.length - 1] || "..."}" shows that Aristotle's insight isn't just abstract philosophy — it's the structure of how you actually think about what matters.`,
    },
  ];

  const buildClipboardText = () => {
    const lines = [];
    lines.push("THE WHY CHAIN — Aristotle's Final End Activity");
    lines.push("=".repeat(50));
    lines.push("");
    lines.push("YOUR WHY CHAIN:");
    chain.forEach((link, i) => {
      const q = i === 0 ? "Why are you here?" : `Why "${chain[i - 1]}"?`;
      const cat = categories[i];
      const catLabel = cat ? ` [${CATEGORY_INFO[cat].label}]` : "";
      lines.push(`  ${i + 1}. Q: ${q}`);
      lines.push(`     A: "${link}"${catLabel}`);
    });
    lines.push("");
    lines.push("VALUE CATEGORIES:");
    const intrinsics = chain.filter((_, i) => categories[i] === "intrinsic" || categories[i] === "both");
    const instrumentals = chain.filter((_, i) => categories[i] === "instrumental");
    if (intrinsics.length > 0) lines.push(`  Intrinsic / Both: ${intrinsics.map((l) => `"${l}"`).join(", ")}`);
    if (instrumentals.length > 0) lines.push(`  Instrumental: ${instrumentals.map((l) => `"${l}"`).join(", ")}`);
    if (reflection.trim()) {
      lines.push("");
      lines.push("REFLECTION:");
      lines.push(reflection.trim());
    }
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildClipboardText()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const handlePrint = () => {
    const intrinsics = chain.filter((_, i) => categories[i] === "intrinsic" || categories[i] === "both");
    const instrumentals = chain.filter((_, i) => categories[i] === "instrumental");

    const chainRows = chain
      .map((link, i) => {
        const q = i === 0 ? "Why are you here?" : `Why "${chain[i - 1]}"?`;
        const cat = categories[i];
        const catInfo = cat ? CATEGORY_INFO[cat] : null;
        const badge = catInfo
          ? `<span style="display:inline-block;padding:2px 8px;background:${catInfo.color};color:#fff;font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;margin-left:8px;">${catInfo.label}</span>`
          : "";
        return `<tr>
          <td style="padding:8px 12px;color:#888;font-style:italic;font-size:0.9rem;white-space:nowrap;">${q}</td>
          <td style="padding:8px 12px;font-size:1rem;">"${link}"${badge}</td>
        </tr>`;
      })
      .join("");

    const summaryRows = [
      intrinsics.length > 0
        ? `<tr><td style="padding:4px 12px;color:#7BA68A;font-weight:bold;">Intrinsic / Both</td><td style="padding:4px 12px;">${intrinsics.map((l) => `"${l}"`).join(", ")}</td></tr>`
        : "",
      instrumentals.length > 0
        ? `<tr><td style="padding:4px 12px;color:#C4956A;font-weight:bold;">Instrumental</td><td style="padding:4px 12px;">${instrumentals.map((l) => `"${l}"`).join(", ")}</td></tr>`
        : "",
    ].join("");

    const reflectionSection = reflection.trim()
      ? `<section style="margin-top:2rem;">
          <h2 style="font-size:1.1rem;color:#555;border-bottom:1px solid #ddd;padding-bottom:0.4rem;margin-bottom:0.75rem;">Reflection</h2>
          <p style="font-size:1rem;line-height:1.7;color:#333;">${reflection.trim().replace(/\n/g, "<br>")}</p>
        </section>`
      : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Why Chain — Aristotle's Final End</title>
  <style>
    body { font-family: Georgia, serif; max-width: 700px; margin: 2rem auto; padding: 0 1.5rem; color: #222; }
    h1 { font-size: 1.6rem; font-weight: normal; margin-bottom: 0.25rem; }
    .subtitle { color: #777; font-size: 0.9rem; margin-bottom: 2rem; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
    tr:nth-child(even) { background: #f9f7f4; }
    @media print { body { margin: 1rem auto; } }
  </style>
</head>
<body>
  <h1>The Why Chain</h1>
  <div class="subtitle">Aristotle's Final End Activity</div>
  <section>
    <h2 style="font-size:1.1rem;color:#555;border-bottom:1px solid #ddd;padding-bottom:0.4rem;margin-bottom:0.75rem;">Why Chain</h2>
    <table>${chainRows}</table>
  </section>
  <section>
    <h2 style="font-size:1.1rem;color:#555;border-bottom:1px solid #ddd;padding-bottom:0.4rem;margin-bottom:0.75rem;">Value Summary</h2>
    <table>${summaryRows}</table>
  </section>
  ${reflectionSection}
</body>
</html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  // --- INTRO SCREEN ---
  if (!started) {
    return (
      <div style={styles.container}>
        <div style={styles.innerWrap}>
          <FadeIn delay={200}>
            <div style={styles.epigraph}>
              <p style={styles.greekText}>
                Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς
                ἐφίεσθαι δοκεῖ·
              </p>
              <p style={styles.translationText}>
                "Every art and every inquiry, and similarly every action and pursuit, is thought to
                aim at some good…"
              </p>
              <p style={styles.attribution}>— Aristotle, Nicomachean Ethics I.1 (1094a1)</p>
            </div>
          </FadeIn>
          <FadeIn delay={800}>
            <h1 style={styles.title}>The Why Chain</h1>
            <p style={styles.subtitle}>
              An interactive exploration of Aristotle's argument for the highest good
            </p>
          </FadeIn>
          <FadeIn delay={1400}>
            <p style={styles.introText}>
              We're going to start with a simple question: <em>why are you here?</em> Why
              did you click this link? Then we'll keep asking <em>why</em> — following your
              chain of reasons until you reach something you can't justify by anything
              further. There are no right or wrong answers. Along the way, you'll discover
              the difference between things valued as means and things valued as ends — and
              why Aristotle believed there must be a highest good.
            </p>
          </FadeIn>
          <FadeIn delay={2000}>
            <button style={styles.beginBtn} onClick={() => setStarted(true)}>
              Begin
            </button>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.innerWrap}>
        {/* Phase indicators */}
        <div style={styles.phaseBar}>
          {PHASE_LABELS.map((label, i) => (
            <div key={i} style={styles.phaseItem}>
              <div
                style={{
                  ...styles.phaseDot,
                  background: i <= phase ? "#C4956A" : "rgba(196,149,106,0.2)",
                }}
              />
              <span
                style={{
                  ...styles.phaseLabel,
                  color: i === phase ? "#E8DDD0" : "rgba(232,221,208,0.35)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* PHASE 0: WHY CHAIN */}
        {phase === 0 && (
          <div>
            <FadeIn delay={100}>
              <h2 style={styles.sectionTitle}>Follow the thread.</h2>
              <p style={styles.sectionDesc}>
                Answer honestly. When you've reached something you can't justify by anything
                further, click "I've hit bedrock."
              </p>
            </FadeIn>

            {/* Chain visualization */}
            <div style={styles.chainContainer}>
              {chain.map((link, i) => (
                <FadeIn key={i} delay={0}>
                  <div style={styles.chainLink}>
                    <div style={styles.chainDot} />
                    {i < chain.length - 1 && <div style={styles.chainLine} />}
                    <div style={styles.chainContent}>
                      <div style={styles.chainQuestion}>
                        {i === 0 ? "Why are you here?" : `Why "${chain[i - 1]}"?`}
                      </div>
                      <div style={styles.chainAnswer}>"{link}"</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
              <div ref={chainEndRef} />
            </div>

            {/* Current question */}
            <FadeIn delay={chain.length === 0 ? 400 : 0}>
              <div style={styles.questionBox}>
                <p style={styles.currentQuestion}>{getQuestion()}</p>
                <div style={styles.inputRow}>
                  <input
                    ref={inputRef}
                    type="text"
                    style={styles.input}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer…"
                  />
                  <button
                    style={{
                      ...styles.sendBtn,
                      opacity: currentAnswer.trim() ? 1 : 0.4,
                    }}
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer.trim()}
                  >
                    →
                  </button>
                </div>
                {chain.length >= 2 && (
                  <button style={styles.bedrockBtn} onClick={handleFinishChain}>
                    ◆ I've hit bedrock
                  </button>
                )}
              </div>
            </FadeIn>
          </div>
        )}

        {/* PHASE 1: CATEGORIZATION */}
        {phase === 1 && (
          <div>
            <FadeIn delay={100}>
              <h2 style={styles.sectionTitle}>Examine each link.</h2>
              <p style={styles.sectionDesc}>
                For each reason in your chain, decide: is it valued as a <em>means</em> to something
                else, as an <em>end in itself</em>, or <em>both</em>?
              </p>
            </FadeIn>

            {/* Category legend */}
            <FadeIn delay={300}>
              <div style={styles.legendBox}>
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <div key={key} style={{ ...styles.legendItem, borderColor: info.border }}>
                    <div style={{ ...styles.legendDot, background: info.color }} />
                    <div>
                      <strong style={{ color: info.color }}>{info.label}</strong>
                      <div style={styles.legendDesc}>{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Chain with categories */}
            <div style={styles.chainContainer}>
              {chain.map((link, i) => {
                const cat = categories[i];
                const isCurrent = i === currentCatIndex;
                const isPast = i < currentCatIndex;
                const catInfo = cat ? CATEGORY_INFO[cat] : null;
                const guidance = getGuidance(link, i, chain.length);

                return (
                  <FadeIn key={i} delay={0}>
                    <div
                      style={{
                        ...styles.catChainLink,
                        borderColor: catInfo ? catInfo.border : isCurrent ? "rgba(232,221,208,0.3)" : "rgba(232,221,208,0.1)",
                        background: catInfo ? catInfo.bg : isCurrent ? "rgba(232,221,208,0.04)" : "transparent",
                        opacity: !isCurrent && !cat ? 0.4 : 1,
                      }}
                    >
                      <div style={styles.catLinkHeader}>
                        <span style={styles.catLinkNumber}>Link {i + 1}</span>
                        {catInfo && (
                          <span style={{ ...styles.catBadge, background: catInfo.color }}>
                            {catInfo.label}
                          </span>
                        )}
                      </div>
                      <p style={styles.catLinkText}>"{link}"</p>

                      {isCurrent && !cat && (
                        <div style={styles.catButtonRow}>
                          {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                            <button
                              key={key}
                              style={{
                                ...styles.catButton,
                                borderColor: info.border,
                                color: info.color,
                              }}
                              onClick={() => handleCategorize(key)}
                            >
                              {info.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {isCurrent && !cat && (
                        <div style={styles.guidanceBox}>
                          <button
                            style={styles.guidanceToggle}
                            onClick={() =>
                              setShowGuidance({ ...showGuidance, [i]: !showGuidance[i] })
                            }
                          >
                            {showGuidance[i] ? "Hide hint" : "Need a hint?"}
                          </button>
                          {showGuidance[i] && (
                            <p style={styles.guidanceText}>{guidance.note}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            {allCategorized && (
              <FadeIn delay={300}>
                <button style={styles.beginBtn} onClick={() => setPhase(2)}>
                  See Aristotle's Argument →
                </button>
              </FadeIn>
            )}
          </div>
        )}

        {/* PHASE 2: ARGUMENT */}
        {phase === 2 && (
          <div>
            <FadeIn delay={100}>
              <h2 style={styles.sectionTitle}>The Argument for a Final End</h2>
            </FadeIn>

            {/* Mini chain recap */}
            <FadeIn delay={300}>
              <div style={styles.miniChain}>
                {chain.map((link, i) => {
                  const catInfo = categories[i] ? CATEGORY_INFO[categories[i]] : null;
                  return (
                    <span key={i} style={styles.miniChainItem}>
                      <span
                        style={{
                          ...styles.miniDot,
                          background: catInfo ? catInfo.color : "#666",
                        }}
                      />
                      <span style={styles.miniLabel}>{link}</span>
                      {i < chain.length - 1 && <span style={styles.miniArrow}>→</span>}
                    </span>
                  );
                })}
              </div>
            </FadeIn>

            {/* Argument steps */}
            {argumentSteps.slice(0, argumentStep + 1).map((step, i) => (
              <FadeIn key={i} delay={200}>
                <div style={styles.argumentCard}>
                  <h3 style={styles.argTitle}>{step.title}</h3>
                  {step.body.split("\n\n").map((para, j) => (
                    <p key={j} style={styles.argBody}>
                      {para}
                    </p>
                  ))}
                </div>
              </FadeIn>
            ))}

            {argumentStep < argumentSteps.length - 1 ? (
              <button
                style={styles.continueBtn}
                onClick={() => setArgumentStep(argumentStep + 1)}
              >
                Continue →
              </button>
            ) : (
              <FadeIn delay={400}>
                <div style={styles.finalQuote}>
                  <p style={styles.greekText} >
                    εἰ δή τι τέλος ἐστὶ τῶν πρακτῶν ὃ δι᾽ αὑτὸ βουλόμεθα…
                  </p>
                  <p style={styles.finalTranslation}>
                    "If, then, there is some end of the things we do, which we desire for its own
                    sake — everything else being desired for the sake of this — clearly this must be
                    the good and the chief good."
                  </p>
                  <p style={styles.attribution}>— Nicomachean Ethics I.2 (1094a18-22)</p>
                </div>
                {/* Reflection box */}
                <div style={styles.reflectionSection}>
                  <h3 style={styles.reflectionTitle}>Your Reflection</h3>
                  <p style={styles.reflectionPrompt}>
                    Your chain ended at <em>"{chain[chain.length - 1]}"</em>. Does that feel like your actual chief good — the thing you genuinely live toward? Or when you sit with it, does something else come to mind? Do you have a final end at all, or does life feel more scattered across many competing goods? Take a moment to reflect honestly.
                  </p>
                  <textarea
                    style={styles.reflectionTextarea}
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write your reflection here…"
                    rows={5}
                  />
                </div>

                {/* Export buttons */}
                <div style={styles.exportRow}>
                  <button style={styles.exportBtn} onClick={handlePrint}>
                    Print / Save as PDF
                  </button>
                  <button
                    style={{ ...styles.exportBtn, ...styles.copyBtn }}
                    onClick={handleCopy}
                  >
                    {copySuccess ? "Copied!" : "Copy Results"}
                  </button>
                </div>

                <button
                  style={styles.restartBtn}
                  onClick={() => {
                    setPhase(0);
                    setChain([]);
                    setCategories({});
                    setCurrentCatIndex(0);
                    setShowGuidance({});
                    setArgumentStep(0);
                    setReflection("");
                  }}
                >
                  Start Over With a New Chain
                </button>
              </FadeIn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#1A1714",
    color: "#E8DDD0",
    fontFamily: "'Crimson Text', 'Georgia', serif",
    display: "flex",
    justifyContent: "center",
    padding: "2rem 1rem",
  },
  innerWrap: {
    maxWidth: 680,
    width: "100%",
  },
  epigraph: {
    textAlign: "center",
    marginBottom: "2.5rem",
    paddingTop: "2rem",
  },
  greekText: {
    fontSize: "1.05rem",
    color: "rgba(196,149,106,0.7)",
    fontStyle: "italic",
    lineHeight: 1.7,
    marginBottom: "0.75rem",
  },
  translationText: {
    fontSize: "1.2rem",
    color: "#E8DDD0",
    fontStyle: "italic",
    lineHeight: 1.6,
    marginBottom: "0.5rem",
  },
  attribution: {
    fontSize: "0.85rem",
    color: "rgba(232,221,208,0.4)",
    marginTop: "0.5rem",
  },
  title: {
    textAlign: "center",
    fontSize: "2.4rem",
    fontWeight: 400,
    letterSpacing: "0.08em",
    color: "#C4956A",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1rem",
    color: "rgba(232,221,208,0.5)",
    marginBottom: "2rem",
    fontStyle: "italic",
  },
  introText: {
    fontSize: "1.05rem",
    lineHeight: 1.8,
    color: "rgba(232,221,208,0.75)",
    textAlign: "center",
    maxWidth: 540,
    margin: "0 auto 2.5rem",
  },
  beginBtn: {
    display: "block",
    margin: "2rem auto",
    padding: "0.85rem 2.5rem",
    background: "transparent",
    border: "1px solid #C4956A",
    color: "#C4956A",
    fontSize: "1.05rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
    letterSpacing: "0.06em",
    transition: "all 0.3s ease",
  },
  phaseBar: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "2.5rem",
    paddingTop: "1rem",
  },
  phaseItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background 0.4s ease",
  },
  phaseLabel: {
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    transition: "color 0.4s ease",
  },
  sectionTitle: {
    fontSize: "1.6rem",
    fontWeight: 400,
    color: "#C4956A",
    marginBottom: "0.5rem",
  },
  sectionDesc: {
    fontSize: "1rem",
    color: "rgba(232,221,208,0.6)",
    lineHeight: 1.7,
    marginBottom: "2rem",
  },
  chainContainer: {
    marginBottom: "1.5rem",
  },
  chainLink: {
    display: "flex",
    position: "relative",
    paddingLeft: "2rem",
    marginBottom: "0.25rem",
    minHeight: "3.5rem",
  },
  chainDot: {
    position: "absolute",
    left: 0,
    top: 6,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#C4956A",
  },
  chainLine: {
    position: "absolute",
    left: 4,
    top: 18,
    bottom: -8,
    width: 2,
    background: "rgba(196,149,106,0.2)",
  },
  chainContent: {
    paddingBottom: "1rem",
  },
  chainQuestion: {
    fontSize: "0.85rem",
    color: "rgba(232,221,208,0.4)",
    marginBottom: "0.25rem",
    fontStyle: "italic",
  },
  chainAnswer: {
    fontSize: "1.1rem",
    color: "#E8DDD0",
  },
  questionBox: {
    background: "rgba(196,149,106,0.06)",
    border: "1px solid rgba(196,149,106,0.15)",
    padding: "1.5rem",
    marginTop: "1rem",
  },
  currentQuestion: {
    fontSize: "1.15rem",
    color: "#C4956A",
    marginBottom: "1rem",
    fontStyle: "italic",
  },
  inputRow: {
    display: "flex",
    gap: "0.75rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem 1rem",
    background: "rgba(232,221,208,0.06)",
    border: "1px solid rgba(232,221,208,0.15)",
    color: "#E8DDD0",
    fontSize: "1rem",
    fontFamily: "'Crimson Text', serif",
    outline: "none",
  },
  sendBtn: {
    padding: "0.75rem 1.25rem",
    background: "#C4956A",
    border: "none",
    color: "#1A1714",
    fontSize: "1.2rem",
    cursor: "pointer",
    fontWeight: 700,
    transition: "opacity 0.2s",
  },
  bedrockBtn: {
    marginTop: "1rem",
    padding: "0.6rem 1.5rem",
    background: "transparent",
    border: "1px solid rgba(123,166,138,0.4)",
    color: "#7BA68A",
    fontSize: "0.9rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  legendBox: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "2rem",
  },
  legendItem: {
    display: "flex",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderLeft: "3px solid",
    alignItems: "flex-start",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    marginTop: 5,
    flexShrink: 0,
  },
  legendDesc: {
    fontSize: "0.88rem",
    color: "rgba(232,221,208,0.55)",
    lineHeight: 1.5,
  },
  catChainLink: {
    border: "1px solid",
    padding: "1.25rem",
    marginBottom: "0.75rem",
    transition: "all 0.4s ease",
  },
  catLinkHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  catLinkNumber: {
    fontSize: "0.75rem",
    color: "rgba(232,221,208,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  catBadge: {
    fontSize: "0.7rem",
    padding: "0.2rem 0.6rem",
    color: "#1A1714",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  catLinkText: {
    fontSize: "1.1rem",
    color: "#E8DDD0",
    fontStyle: "italic",
    marginBottom: "0.75rem",
  },
  catButtonRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  catButton: {
    padding: "0.5rem 1.1rem",
    background: "transparent",
    border: "1px solid",
    fontSize: "0.9rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  guidanceBox: {
    marginTop: "0.75rem",
    borderTop: "1px solid rgba(232,221,208,0.08)",
    paddingTop: "0.75rem",
  },
  guidanceToggle: {
    background: "none",
    border: "none",
    color: "rgba(232,221,208,0.4)",
    fontSize: "0.85rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
    padding: 0,
    fontStyle: "italic",
  },
  guidanceText: {
    fontSize: "0.9rem",
    color: "rgba(232,221,208,0.55)",
    lineHeight: 1.6,
    marginTop: "0.5rem",
    fontStyle: "italic",
  },
  miniChain: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.35rem",
    padding: "1rem 1.25rem",
    background: "rgba(232,221,208,0.04)",
    border: "1px solid rgba(232,221,208,0.08)",
    marginBottom: "2rem",
  },
  miniChainItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  miniLabel: {
    fontSize: "0.85rem",
    color: "rgba(232,221,208,0.7)",
  },
  miniArrow: {
    color: "rgba(232,221,208,0.25)",
    fontSize: "0.8rem",
    margin: "0 0.15rem",
  },
  argumentCard: {
    padding: "1.5rem",
    borderLeft: "3px solid rgba(196,149,106,0.3)",
    marginBottom: "1.5rem",
    background: "rgba(196,149,106,0.04)",
  },
  argTitle: {
    fontSize: "1.15rem",
    color: "#C4956A",
    fontWeight: 400,
    marginBottom: "0.75rem",
    letterSpacing: "0.04em",
  },
  argBody: {
    fontSize: "1.02rem",
    color: "rgba(232,221,208,0.8)",
    lineHeight: 1.8,
    marginBottom: "0.75rem",
  },
  continueBtn: {
    display: "block",
    margin: "1rem auto",
    padding: "0.7rem 2rem",
    background: "transparent",
    border: "1px solid rgba(196,149,106,0.4)",
    color: "#C4956A",
    fontSize: "1rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  finalQuote: {
    textAlign: "center",
    padding: "2rem 1.5rem",
    borderTop: "1px solid rgba(196,149,106,0.2)",
    borderBottom: "1px solid rgba(196,149,106,0.2)",
    margin: "2rem 0",
  },
  finalTranslation: {
    fontSize: "1.15rem",
    color: "#E8DDD0",
    fontStyle: "italic",
    lineHeight: 1.7,
    maxWidth: 500,
    margin: "0 auto",
  },
  restartBtn: {
    display: "block",
    margin: "1.5rem auto 3rem",
    padding: "0.7rem 2rem",
    background: "transparent",
    border: "1px solid rgba(232,221,208,0.2)",
    color: "rgba(232,221,208,0.5)",
    fontSize: "0.9rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
  },
  reflectionSection: {
    margin: "2.5rem 0 1.5rem",
    padding: "1.5rem",
    background: "rgba(123,166,138,0.06)",
    border: "1px solid rgba(123,166,138,0.2)",
  },
  reflectionTitle: {
    fontSize: "1.15rem",
    fontWeight: 400,
    color: "#7BA68A",
    marginBottom: "0.75rem",
    letterSpacing: "0.04em",
  },
  reflectionPrompt: {
    fontSize: "1rem",
    color: "rgba(232,221,208,0.7)",
    lineHeight: 1.75,
    marginBottom: "1rem",
    fontStyle: "italic",
  },
  reflectionTextarea: {
    width: "100%",
    padding: "0.85rem 1rem",
    background: "rgba(232,221,208,0.05)",
    border: "1px solid rgba(123,166,138,0.25)",
    color: "#E8DDD0",
    fontSize: "1rem",
    fontFamily: "'Crimson Text', serif",
    lineHeight: 1.7,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  exportRow: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
    margin: "1.5rem 0 0.5rem",
  },
  exportBtn: {
    padding: "0.65rem 1.6rem",
    background: "transparent",
    border: "1px solid rgba(196,149,106,0.5)",
    color: "#C4956A",
    fontSize: "0.95rem",
    fontFamily: "'Crimson Text', serif",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "all 0.2s ease",
  },
  copyBtn: {
    borderColor: "rgba(139,158,194,0.5)",
    color: "#8B9EC2",
  },
};
