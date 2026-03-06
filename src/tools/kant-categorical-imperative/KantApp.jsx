import { useState, useEffect, useRef, useCallback } from "react";

const SECTIONS = [
  "Introduction",
  "Good Will",
  "Universal Law",
  "False Promise",
  "Humanity Formula",
  "Practice Lab",
];

const MAXIM_EXAMPLES = [
  {
    id: "false-promise",
    maxim: "When I need money, I will make a promise I intend to break.",
    universal: "Everyone who needs money makes promises they intend to break.",
    contradiction: "If everyone made false promises, no one would believe promises anymore. The very institution of promising would collapse — making it impossible to make a false promise at all.",
    type: "contradiction-in-conception",
    label: "Contradiction in Conception",
    icon: "💔",
  },
  {
    id: "neglect-talents",
    maxim: "I will let my talents rust and devote my life only to enjoyment.",
    universal: "Everyone neglects their talents and pursues only idle pleasure.",
    contradiction: "A rational being necessarily wills the development of their capacities, since they serve all sorts of possible purposes. You cannot rationally will a world where no one develops any ability.",
    type: "contradiction-in-will",
    label: "Contradiction in Will",
    icon: "🌱",
  },
  {
    id: "refuse-help",
    maxim: "I will never help others, even when I easily could.",
    universal: "No one ever helps anyone else, regardless of circumstances.",
    contradiction: "You cannot rationally will this, because you yourself will inevitably need the help of others. Willing universal non-assistance contradicts what you would necessarily will for yourself.",
    type: "contradiction-in-will",
    label: "Contradiction in Will",
    icon: "🤝",
  },
  {
    id: "suicide",
    maxim: "When life threatens more pain than pleasure, I will end it out of self-love.",
    universal: "Everyone ends their life whenever suffering outweighs pleasure.",
    contradiction: "Self-love is a feeling whose function is to promote life. Using that same impulse to destroy life is a contradiction — the principle that should sustain life is employed to annihilate it.",
    type: "contradiction-in-conception",
    label: "Contradiction in Conception",
    icon: "⚖️",
  },
];

const HUMANITY_SCENARIOS = [
  {
    id: "h1",
    scenario: "A company pays fair wages but only because it fears labor shortages — workers are valued solely for their productivity.",
    meansOnly: true,
    explanation: "Workers are treated as replaceable instruments of profit. Their dignity as persons isn't recognized — they're valued only for what they produce.",
  },
  {
    id: "h2",
    scenario: "A teacher stays late to help a struggling student understand a difficult concept, genuinely caring about the student's growth.",
    meansOnly: false,
    explanation: "The teacher respects the student as a rational being with their own capacity for understanding. The student's development is valued as an end in itself.",
  },
  {
    id: "h3",
    scenario: "A friend only maintains the friendship because the other person has useful business connections.",
    meansOnly: true,
    explanation: "The 'friend' treats the other person merely as a means to business advantage. The person's own worth, feelings, and autonomy are irrelevant to the relationship.",
  },
  {
    id: "h4",
    scenario: "A doctor explains all treatment options honestly to a patient, including risks, and respects their decision even when disagreeing.",
    meansOnly: false,
    explanation: "The doctor respects the patient's rational autonomy — their capacity to make informed decisions about their own life. The patient is treated as an end in themselves.",
  },
  {
    id: "h5",
    scenario: "A politician makes campaign promises they know they can't keep in order to win votes.",
    meansOnly: true,
    explanation: "Voters are treated as mere means to gaining power. By deceiving them, the politician undermines their rational agency — their ability to make informed choices.",
  },
];

const PRACTICE_MAXIMS = [
  {
    maxim: "I will cheat on this exam because I need a good grade.",
    hints: {
      universal: "Think: what if everyone cheated whenever they needed a good grade?",
      contradiction: "What would happen to the meaning of grades and exams?",
      humanity: "Are you treating other students and the institution fairly?",
    },
  },
  {
    maxim: "I will lie on my resume to get this job.",
    hints: {
      universal: "Universalize: everyone lies on resumes when they want a job.",
      contradiction: "What happens to the hiring process if no resume is trustworthy?",
      humanity: "Are you treating the employer as a rational agent who deserves truth?",
    },
  },
  {
    maxim: "I will donate to charity, but only to impress others.",
    hints: {
      universal: "This one is tricky — Kant distinguishes acting IN ACCORDANCE with duty vs. FROM duty.",
      contradiction: "Does the universalized version produce a logical contradiction, or a different problem?",
      humanity: "Who is being treated as a mere means here — the recipients, the observers, or yourself?",
    },
  },
];

// ─── Animated Background ───
function KantBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
      background: "linear-gradient(160deg, #0a0a0f 0%, #12121f 40%, #0d1117 100%)",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(200,180,140,0.5) 50px),
          repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(200,180,140,0.5) 50px)`,
      }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${300 + i * 120}px`, height: `${300 + i * 120}px`,
          borderRadius: "50%",
          border: "1px solid rgba(200,180,140,0.04)",
          left: `${10 + i * 15}%`, top: `${20 + i * 8}%`,
          animation: `kantOrbit ${20 + i * 5}s linear infinite`,
        }} />
      ))}
      <style>{`
        @keyframes kantOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Nav Sidebar ───
function NavSidebar({ current, onNav }) {
  return (
    <nav style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 260, zIndex: 100,
      background: "rgba(10,10,18,0.95)", borderRight: "1px solid rgba(200,180,140,0.12)",
      display: "flex", flexDirection: "column", padding: "32px 0",
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ padding: "0 24px 32px", borderBottom: "1px solid rgba(200,180,140,0.08)" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600,
          color: "#c8b48c", letterSpacing: "0.02em",
        }}>Kant's</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#8a7d6b",
          fontStyle: "italic", marginTop: 2,
        }}>Categorical Imperative</div>
      </div>
      <div style={{ flex: 1, padding: "24px 0", display: "flex", flexDirection: "column", gap: 2 }}>
        {SECTIONS.map((s, i) => (
          <button key={s} onClick={() => onNav(i)} style={{
            background: current === i ? "rgba(200,180,140,0.1)" : "transparent",
            border: "none", cursor: "pointer", padding: "12px 24px",
            display: "flex", alignItems: "center", gap: 14, textAlign: "left",
            borderLeft: current === i ? "3px solid #c8b48c" : "3px solid transparent",
            transition: "all 0.25s ease",
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              color: current === i ? "#c8b48c" : "#5a5a6a", fontWeight: 500,
            }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 15,
              color: current === i ? "#e8dcc8" : "#7a7a8a", fontWeight: current === i ? 600 : 400,
            }}>{s}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(200,180,140,0.08)" }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#4a4a5a",
          lineHeight: 1.6,
        }}>
          Interactive Teaching Tool<br />Ethics &amp; Moral Philosophy
        </div>
      </div>
    </nav>
  );
}

// ─── Section Wrapper ───
function Section({ children }) {
  return (
    <div style={{
      marginLeft: 260, position: "relative", zIndex: 10,
      minHeight: "100vh", padding: "60px 80px 80px",
      maxWidth: 1100, boxSizing: "border-box",
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ number, title, subtitle }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#c8b48c",
        letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8,
      }}>Section {number}</div>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300,
        color: "#e8dcc8", margin: 0, lineHeight: 1.2,
      }}>{title}</h1>
      {subtitle && <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#8a7d6b",
        fontStyle: "italic", marginTop: 8, lineHeight: 1.6,
      }}>{subtitle}</p>}
    </div>
  );
}

function Prose({ children, style }) {
  return (
    <div style={{
      fontFamily: "'Source Serif 4', serif", fontSize: 16.5, color: "#b0aaa0",
      lineHeight: 1.85, maxWidth: 640, ...style,
    }}>{children}</div>
  );
}

function Callout({ children, accent }) {
  return (
    <div style={{
      background: "rgba(200,180,140,0.04)", border: "1px solid rgba(200,180,140,0.1)",
      borderLeft: `3px solid ${accent || "#c8b48c"}`, borderRadius: "0 8px 8px 0",
      padding: "20px 24px", margin: "28px 0", maxWidth: 640,
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#d4c8b0",
        lineHeight: 1.7, fontStyle: "italic",
      }}>{children}</div>
    </div>
  );
}

// ─── INTRODUCTION ───
function IntroSection() {
  const [reveal, setReveal] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setReveal(r => Math.min(r + 1, 4)), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <Section>
      <SectionTitle number="01" title="The Moral Law Within"
        subtitle="What makes an action truly moral?" />
      <Prose>
        <p style={{ opacity: reveal >= 0 ? 1 : 0, transition: "opacity 0.8s ease" }}>
          Most moral theories ask: <em>What outcome should I aim for?</em> or <em>What kind of person should I be?</em>{" "}
          Kant asks something radically different: <em>What principle am I acting on — and could every rational being endorse it?</em>
        </p>
        <p style={{ opacity: reveal >= 1 ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
          For Kant, morality has nothing to do with consequences, feelings, or self-interest.
          It is grounded entirely in <em>reason</em>. A truly moral action is one performed from{" "}
          <strong style={{ color: "#c8b48c" }}>duty</strong> — because reason reveals it as the right thing to do,
          not because it's pleasant, profitable, or popular.
        </p>
        <p style={{ opacity: reveal >= 2 ? 1 : 0, transition: "opacity 0.8s ease 0.6s" }}>
          The supreme principle of morality is the <strong style={{ color: "#c8b48c" }}>Categorical Imperative</strong> — a
          command of reason that applies unconditionally, to every rational being, in every situation.
          Not "do this <em>if</em> you want happiness" (that would be hypothetical), but "do this, <em>period</em>."
        </p>
      </Prose>
      <div style={{
        opacity: reveal >= 3 ? 1 : 0, transition: "opacity 1s ease 0.8s",
        marginTop: 48, display: "flex", gap: 24,
      }}>
        {[
          { label: "Hypothetical Imperative", desc: '"If you want X, do Y."', sub: "Conditional on desires", dim: true },
          { label: "Categorical Imperative", desc: '"Do Y — period."', sub: "Unconditional command of reason", dim: false },
        ].map(c => (
          <div key={c.label} style={{
            flex: 1, maxWidth: 300, padding: "28px 24px", borderRadius: 12,
            background: c.dim ? "rgba(80,80,100,0.08)" : "rgba(200,180,140,0.08)",
            border: `1px solid ${c.dim ? "rgba(80,80,100,0.15)" : "rgba(200,180,140,0.2)"}`,
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              color: c.dim ? "#5a5a6a" : "#c8b48c", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 10,
            }}>{c.label}</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
              color: c.dim ? "#6a6a7a" : "#e8dcc8", fontStyle: "italic", marginBottom: 8,
            }}>{c.desc}</div>
            <div style={{
              fontFamily: "'Source Serif 4', serif", fontSize: 13, color: c.dim ? "#4a4a5a" : "#8a7d6b",
            }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── GOOD WILL ───
function GoodWillSection() {
  const [selected, setSelected] = useState(null);
  const motives = [
    { id: "fear", label: "Fear of punishment", icon: "😰", moral: false, why: "This is acting from inclination (avoiding pain), not from duty. The action conforms to duty but isn't done for duty's sake." },
    { id: "reward", label: "Hope for reward", icon: "🎁", moral: false, why: "Acting for personal gain is acting from inclination. Even if the action is right, the motive robs it of moral worth." },
    { id: "sympathy", label: "Natural sympathy", icon: "💛", moral: false, why: "Surprisingly, even acting from natural feeling — because it 'feels good' to help — lacks moral worth for Kant. It's still inclination, not duty." },
    { id: "duty", label: "Respect for moral law", icon: "⭐", moral: true, why: "Only this motive gives an action true moral worth. You do right because it IS right — because reason reveals it as your duty, regardless of how you feel." },
  ];

  return (
    <Section>
      <SectionTitle number="02" title="Good Will & Duty"
        subtitle="Nothing in the world can be called good without qualification except a good will." />
      <Prose>
        <p>
          Kant begins with a striking claim: intelligence, courage, wealth, even happiness can be
          used for evil. The only thing that is good <em>in itself</em> is a <strong style={{ color: "#c8b48c" }}>good will</strong> —
          the will that acts from duty, motivated by respect for the moral law.
        </p>
        <p>
          But what does "acting from duty" really mean? Imagine you find a lost wallet and return it.
          The <em>action</em> is the same regardless of why you do it — but Kant says the <em>motive</em> is everything.
          Click each motivation below:
        </p>
      </Prose>
      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 640 }}>
        {motives.map(m => (
          <button key={m.id} onClick={() => setSelected(m.id)} style={{
            background: selected === m.id
              ? (m.moral ? "rgba(140,180,100,0.12)" : "rgba(180,100,100,0.1)")
              : "rgba(40,40,55,0.5)",
            border: `1px solid ${selected === m.id
              ? (m.moral ? "rgba(140,180,100,0.3)" : "rgba(180,100,100,0.25)")
              : "rgba(200,180,140,0.08)"}`,
            borderRadius: 10, padding: "20px 18px", cursor: "pointer",
            textAlign: "left", transition: "all 0.3s ease",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#d4c8b0", fontWeight: 500,
            }}>{m.label}</div>
            {selected === m.id && (
              <div style={{
                marginTop: 12, fontFamily: "'Source Serif 4', serif", fontSize: 13.5,
                color: m.moral ? "#a8c878" : "#c89898", lineHeight: 1.7,
              }}>{m.why}</div>
            )}
          </button>
        ))}
      </div>
      {selected && (
        <Callout accent={motives.find(m => m.id === selected)?.moral ? "#8cb464" : "#c87878"}>
          Key distinction: Acting <strong>in accordance with</strong> duty (doing the right thing) vs.
          acting <strong>from</strong> duty (doing it <em>because</em> it's right). Only the latter has moral worth.
        </Callout>
      )}
    </Section>
  );
}

// ─── UNIVERSAL LAW FORMULATION ───
function UniversalLawSection() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Identify Your Maxim", desc: "A maxim is your subjective principle of action — the personal rule you're following. It typically takes the form: 'When in situation S, I will do A in order to achieve purpose P.'" },
    { label: "Universalize It", desc: "Imagine your maxim as a universal law of nature — everyone in the same situation acts the same way, as reliably as gravity pulls things down." },
    { label: "Test for Contradiction", desc: "Can you even conceive of this world without contradiction? (Contradiction in conception.) Could you rationally will to live in it? (Contradiction in will.)" },
    { label: "Draw Your Conclusion", desc: "If universalizing produces a contradiction, the action is morally impermissible. The maxim fails the test — it cannot become a universal law." },
  ];

  return (
    <Section>
      <SectionTitle number="03" title="The Universal Law Formulation"
        subtitle={`"Act only according to that maxim whereby you can at the same time will that it should become a universal law."`} />
      <Prose>
        <p>
          This is the first formulation of the Categorical Imperative. It's a test: before you act, ask whether
          the principle behind your action could be consistently willed as a law for everyone.
        </p>
        <p>The test has four steps. Walk through them:</p>
      </Prose>
      <div style={{ marginTop: 36, maxWidth: 640 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            display: "flex", alignItems: "flex-start", gap: 18, width: "100%",
            background: "transparent", border: "none", cursor: "pointer",
            padding: "18px 0", borderBottom: i < 3 ? "1px solid rgba(200,180,140,0.06)" : "none",
            textAlign: "left",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600,
              background: step === i ? "rgba(200,180,140,0.15)" : "rgba(40,40,55,0.4)",
              color: step === i ? "#c8b48c" : "#5a5a6a",
              border: `1px solid ${step === i ? "rgba(200,180,140,0.3)" : "rgba(200,180,140,0.06)"}`,
              transition: "all 0.3s ease",
            }}>{i + 1}</div>
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 17,
                color: step === i ? "#e8dcc8" : "#7a7a8a", fontWeight: 500,
                transition: "color 0.3s ease",
              }}>{s.label}</div>
              <div style={{
                maxHeight: step === i ? 200 : 0, overflow: "hidden",
                transition: "max-height 0.5s ease, opacity 0.4s ease",
                opacity: step === i ? 1 : 0,
              }}>
                <div style={{
                  fontFamily: "'Source Serif 4', serif", fontSize: 14.5, color: "#9a9488",
                  lineHeight: 1.75, marginTop: 8, paddingRight: 12,
                }}>{s.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Callout>
        Two types of failure: A <strong>Contradiction in Conception</strong> means the universalized
        world is logically impossible (like false promises destroying promising itself). A{" "}
        <strong>Contradiction in Will</strong> means you <em>could</em> conceive the world, but couldn't
        rationally <em>want</em> to live in it.
      </Callout>
    </Section>
  );
}

// ─── FALSE PROMISE VISUALIZATION ───
function FalsePromiseSection() {
  const [phase, setPhase] = useState(0);
  const totalPhases = 5;

  const phaseData = [
    {
      title: "The Individual Maxim",
      desc: "You need money. You consider borrowing with a promise to repay — even though you know you won't.",
      visual: "individual",
    },
    {
      title: "Universalizing the Maxim",
      desc: "Now imagine this as a law of nature: everyone in financial need makes promises they intend to break.",
      visual: "spreading",
    },
    {
      title: "Trust Begins to Erode",
      desc: "As false promises multiply, people start to doubt every promise they hear. Why would anyone believe a promise?",
      visual: "eroding",
    },
    {
      title: "The Institution Collapses",
      desc: "Promising becomes meaningless. No one believes any promise, so no one can successfully make a false promise. The very act you tried to universalize becomes impossible.",
      visual: "collapsed",
    },
    {
      title: "Contradiction in Conception",
      desc: "Your maxim is self-defeating: it requires the institution of promising to work, but universalizing it destroys that institution. It cannot even be CONCEIVED as a universal law without contradiction.",
      visual: "contradiction",
    },
  ];

  const p = phaseData[phase];

  return (
    <Section>
      <SectionTitle number="04" title="The False Promise"
        subtitle="A visual demonstration of contradiction in conception" />
      <Prose>
        <p>
          This is Kant's most famous example. Step through the visualization to see how
          universalizing a false promise leads to a logical self-contradiction:
        </p>
      </Prose>

      {/* Visualization */}
      <div style={{
        marginTop: 32, background: "rgba(15,15,25,0.8)", borderRadius: 16,
        border: "1px solid rgba(200,180,140,0.1)", overflow: "hidden", maxWidth: 680,
      }}>
        <div style={{ padding: "32px 36px 24px" }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            color: "#c8b48c", letterSpacing: "0.1em", marginBottom: 6,
          }}>PHASE {phase + 1} OF {totalPhases}</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 24,
            color: "#e8dcc8", fontWeight: 500,
          }}>{p.title}</div>
        </div>

        {/* Visual Area */}
        <div style={{
          height: 280, position: "relative", margin: "0 36px",
          borderRadius: 12, background: "rgba(8,8,16,0.6)",
          border: "1px solid rgba(200,180,140,0.05)", overflow: "hidden",
        }}>
          <PromiseVisual phase={phase} />
        </div>

        <div style={{ padding: "20px 36px" }}>
          <div style={{
            fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "#9a9488",
            lineHeight: 1.75,
          }}>{p.desc}</div>
        </div>

        {/* Controls */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 36px 24px", borderTop: "1px solid rgba(200,180,140,0.06)",
        }}>
          <button onClick={() => setPhase(Math.max(0, phase - 1))} disabled={phase === 0}
            style={{
              background: "rgba(200,180,140,0.08)", border: "1px solid rgba(200,180,140,0.15)",
              borderRadius: 8, padding: "8px 20px", cursor: phase > 0 ? "pointer" : "default",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: phase > 0 ? "#c8b48c" : "#3a3a4a",
              opacity: phase > 0 ? 1 : 0.4,
            }}>← Back</button>
          <div style={{ display: "flex", gap: 6 }}>
            {[...Array(totalPhases)].map((_, i) => (
              <div key={i} style={{
                width: i === phase ? 24 : 8, height: 8, borderRadius: 4,
                background: i === phase ? "#c8b48c" : "rgba(200,180,140,0.15)",
                transition: "all 0.3s ease", cursor: "pointer",
              }} onClick={() => setPhase(i)} />
            ))}
          </div>
          <button onClick={() => setPhase(Math.min(totalPhases - 1, phase + 1))} disabled={phase === totalPhases - 1}
            style={{
              background: "rgba(200,180,140,0.08)", border: "1px solid rgba(200,180,140,0.15)",
              borderRadius: 8, padding: "8px 20px", cursor: phase < totalPhases - 1 ? "pointer" : "default",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: phase < totalPhases - 1 ? "#c8b48c" : "#3a3a4a",
              opacity: phase < totalPhases - 1 ? 1 : 0.4,
            }}>Next →</button>
        </div>
      </div>

      {/* Other maxim examples */}
      <div style={{ marginTop: 56 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#c8b48c",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20,
        }}>Kant's Other Examples</div>
        <MaximCards />
      </div>
    </Section>
  );
}

function PromiseVisual({ phase }) {
  const figures = phase === 0 ? 1 : phase === 1 ? 8 : phase === 2 ? 8 : 8;
  const cols = 4;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {phase === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12, filter: "drop-shadow(0 0 16px rgba(200,180,140,0.3))" }}>🤞</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#c8b48c",
              fontStyle: "italic",
            }}>"I promise to repay you..."</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#6a5a4a",
              marginTop: 6,
            }}>(intending not to)</div>
          </div>
        </div>
      )}
      {phase === 1 && (
        <div style={{
          position: "absolute", inset: 20, display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8,
          alignItems: "center", justifyItems: "center",
        }}>
          {[...Array(figures)].map((_, i) => (
            <div key={i} style={{
              fontSize: 32, opacity: 0, animation: `fadeScale 0.4s ease ${i * 0.1}s forwards`,
            }}>🤞</div>
          ))}
        </div>
      )}
      {phase === 2 && (
        <div style={{
          position: "absolute", inset: 20, display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8,
          alignItems: "center", justifyItems: "center",
        }}>
          {[...Array(figures)].map((_, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, opacity: 0.5 + (i % 3 === 0 ? 0 : 0.3) }}>
                {i % 3 === 0 ? "🤞" : "🤨"}
              </div>
              {i % 3 !== 0 && (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: "#c87878",
                  marginTop: 2,
                }}>doubt</div>
              )}
            </div>
          ))}
        </div>
      )}
      {phase === 3 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column",
        }}>
          <div style={{
            fontSize: 20, color: "#c87878", fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600, marginBottom: 16, textAlign: "center",
          }}>
            THE INSTITUTION OF PROMISING
          </div>
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 300,
          }}>
            {"PROMISE".split("").map((ch, i) => (
              <span key={i} style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700,
                color: "rgba(200,100,100,0.3)", textDecoration: "line-through",
                animation: `crumble 0.5s ease ${i * 0.12}s forwards`,
              }}>{ch}</span>
            ))}
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#6a4a4a",
            marginTop: 16,
          }}>No one believes. No one can promise.</div>
        </div>
      )}
      {phase === 4 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              position: "relative", display: "inline-block", marginBottom: 20,
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: "50%",
                border: "2px solid rgba(200,100,100,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "contradictPulse 2s ease infinite",
              }}>
                <div style={{
                  fontSize: 18, fontFamily: "'IBM Plex Mono', monospace",
                  color: "#c87878", fontWeight: 700,
                }}>✕</div>
              </div>
              <div style={{
                position: "absolute", top: -8, left: -8, right: -8, bottom: -8,
                borderRadius: "50%", border: "1px dashed rgba(200,100,100,0.2)",
                animation: "kantOrbit 8s linear infinite",
              }} />
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#c8b48c",
              fontWeight: 500, maxWidth: 280,
            }}>
              The maxim destroys the very conditions it depends on
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes crumble {
          to { transform: translateY(8px) rotate(${Math.random() * 20 - 10}deg); opacity: 0.15; }
        }
        @keyframes contradictPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,100,100,0.2); }
          50% { box-shadow: 0 0 30px 10px rgba(200,100,100,0.1); }
        }
      `}</style>
    </div>
  );
}

function MaximCards() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
      {MAXIM_EXAMPLES.map(m => (
        <div key={m.id} onClick={() => setOpen(open === m.id ? null : m.id)} style={{
          background: "rgba(20,20,32,0.7)", border: "1px solid rgba(200,180,140,0.08)",
          borderRadius: 12, cursor: "pointer", overflow: "hidden",
          transition: "border-color 0.3s ease",
          borderColor: open === m.id ? "rgba(200,180,140,0.2)" : "rgba(200,180,140,0.08)",
        }}>
          <div style={{
            padding: "18px 22px", display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 22 }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#d4c8b0",
              }}>{m.maxim}</div>
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
              color: m.type === "contradiction-in-conception" ? "#c89898" : "#98a8c8",
              padding: "4px 8px", borderRadius: 4,
              background: m.type === "contradiction-in-conception" ? "rgba(200,120,120,0.1)" : "rgba(120,140,200,0.1)",
            }}>{m.label}</div>
          </div>
          {open === m.id && (
            <div style={{
              padding: "0 22px 20px", borderTop: "1px solid rgba(200,180,140,0.06)",
              paddingTop: 16,
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                color: "#6a6a7a", letterSpacing: "0.08em", marginBottom: 6,
              }}>UNIVERSALIZED</div>
              <div style={{
                fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#9a9488",
                lineHeight: 1.7, marginBottom: 14, fontStyle: "italic",
              }}>{m.universal}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                color: "#6a6a7a", letterSpacing: "0.08em", marginBottom: 6,
              }}>THE CONTRADICTION</div>
              <div style={{
                fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#b0aaa0",
                lineHeight: 1.7,
              }}>{m.contradiction}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── HUMANITY FORMULATION ───
function HumanitySection() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const allAnswered = Object.keys(answers).length === HUMANITY_SCENARIOS.length;

  return (
    <Section>
      <SectionTitle number="05" title="The Humanity Formulation"
        subtitle={`"Act so that you treat humanity, whether in your own person or in that of another, always as an end and never merely as a means."`} />
      <Prose>
        <p>
          The second formulation captures a different dimension of the same moral law. Every rational being
          has inherent dignity — an absolute, unconditional worth that can never be reduced to a market price.
        </p>
        <p>
          This doesn't mean you can <em>never</em> use people as means — you use a taxi driver as a means of
          getting home. The key word is <strong style={{ color: "#c8b48c" }}>"merely."</strong> You must always
          also respect the other person as an autonomous rational agent with their own ends.
        </p>
        <p style={{ marginTop: 20, color: "#c8b48c", fontWeight: 500 }}>
          Exercise: For each scenario, decide — is the person being treated <em>merely</em> as a means, or also as an end?
        </p>
      </Prose>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
        {HUMANITY_SCENARIOS.map((s, i) => {
          const answered = answers[s.id] !== undefined;
          const correct = answered && answers[s.id] === s.meansOnly;
          return (
            <div key={s.id} style={{
              background: "rgba(20,20,32,0.7)", borderRadius: 12,
              border: `1px solid ${answered ? (correct ? "rgba(140,180,100,0.25)" : "rgba(200,120,100,0.25)") : "rgba(200,180,140,0.08)"}`,
              padding: "22px 24px",
            }}>
              <div style={{
                fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "#c4baa8",
                lineHeight: 1.7, marginBottom: 16,
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#5a5a6a",
                  marginRight: 10,
                }}>{i + 1}.</span>
                {s.scenario}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { val: true, label: "Merely as a means" },
                  { val: false, label: "Also as an end" },
                ].map(opt => (
                  <button key={String(opt.val)} onClick={() => handleAnswer(s.id, opt.val)}
                    disabled={answered}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 8, cursor: answered ? "default" : "pointer",
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 14,
                      background: answered && answers[s.id] === opt.val
                        ? (correct ? "rgba(140,180,100,0.15)" : "rgba(200,120,100,0.12)")
                        : "rgba(200,180,140,0.05)",
                      border: `1px solid ${answered && answers[s.id] === opt.val
                        ? (correct ? "rgba(140,180,100,0.3)" : "rgba(200,120,100,0.3)")
                        : "rgba(200,180,140,0.1)"}`,
                      color: answered && answers[s.id] === opt.val
                        ? (correct ? "#a8c878" : "#c89898")
                        : "#9a9488",
                    }}>{opt.label}</button>
                ))}
              </div>
              {answered && (
                <div style={{
                  marginTop: 14, padding: "12px 16px", borderRadius: 8,
                  background: correct ? "rgba(140,180,100,0.06)" : "rgba(200,120,100,0.06)",
                  fontFamily: "'Source Serif 4', serif", fontSize: 13.5, lineHeight: 1.7,
                  color: correct ? "#a8c878" : "#c89898",
                }}>
                  {correct ? "✓ " : "✕ "}{s.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <Callout accent="#8cb464">
          Notice the pattern: treating someone merely as a means always involves ignoring their
          rational autonomy — their capacity to make informed, free decisions about their own lives.
          Deception and coercion are paradigm violations because they bypass a person's rational agency entirely.
        </Callout>
      )}
    </Section>
  );
}

// ─── PRACTICE LAB ───
function PracticeSection() {
  const [currentMaxim, setCurrentMaxim] = useState(0);
  const [responses, setResponses] = useState({});
  const [showHint, setShowHint] = useState({});
  const [submitted, setSubmitted] = useState({});

  const pm = PRACTICE_MAXIMS[currentMaxim];

  const updateResponse = (field, val) => {
    setResponses(prev => ({
      ...prev,
      [currentMaxim]: { ...(prev[currentMaxim] || {}), [field]: val },
    }));
  };

  const fields = [
    { key: "universal", label: "Step 1: Universalize this maxim", placeholder: "Write out the maxim as if it were a universal law of nature...", hintKey: "universal" },
    { key: "contradiction", label: "Step 2: Identify the contradiction", placeholder: "What contradiction arises? Is it a contradiction in conception or in will?", hintKey: "contradiction" },
    { key: "humanity", label: "Step 3: Apply the Humanity Formulation", placeholder: "Who is being treated merely as a means? Whose rational autonomy is being violated?", hintKey: "humanity" },
    { key: "verdict", label: "Step 4: Your verdict", placeholder: "Is this action morally permissible according to Kant? Why or why not?", hintKey: null },
  ];

  return (
    <Section>
      <SectionTitle number="06" title="Practice Lab"
        subtitle="Apply both formulations to new scenarios" />
      <Prose>
        <p>
          Now it's your turn. For each maxim below, work through both formulations of the Categorical Imperative.
          Use the hint buttons if you get stuck — they'll nudge you in the right direction without giving away the answer.
        </p>
      </Prose>

      {/* Maxim selector */}
      <div style={{ display: "flex", gap: 10, marginTop: 32, marginBottom: 32 }}>
        {PRACTICE_MAXIMS.map((m, i) => (
          <button key={i} onClick={() => setCurrentMaxim(i)} style={{
            padding: "10px 18px", borderRadius: 8, cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
            background: currentMaxim === i ? "rgba(200,180,140,0.12)" : "rgba(30,30,45,0.5)",
            border: `1px solid ${currentMaxim === i ? "rgba(200,180,140,0.25)" : "rgba(200,180,140,0.08)"}`,
            color: currentMaxim === i ? "#c8b48c" : "#6a6a7a",
          }}>Scenario {i + 1}</button>
        ))}
      </div>

      <div style={{
        background: "rgba(200,180,140,0.04)", border: "1px solid rgba(200,180,140,0.12)",
        borderRadius: 12, padding: "22px 26px", maxWidth: 640, marginBottom: 28,
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#6a6a7a",
          letterSpacing: "0.1em", marginBottom: 8,
        }}>THE MAXIM</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#e8dcc8",
          fontStyle: "italic", lineHeight: 1.5,
        }}>"{pm.maxim}"</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8,
            }}>
              <label style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#c8b48c", fontWeight: 500,
              }}>{f.label}</label>
              {f.hintKey && (
                <button onClick={() => setShowHint(prev => ({ ...prev, [`${currentMaxim}-${f.key}`]: true }))}
                  style={{
                    background: "rgba(200,180,140,0.06)", border: "1px solid rgba(200,180,140,0.12)",
                    borderRadius: 6, padding: "4px 12px", cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#8a7d6b",
                  }}>
                  {showHint[`${currentMaxim}-${f.key}`] ? "Hint shown" : "Show hint"}
                </button>
              )}
            </div>
            {showHint[`${currentMaxim}-${f.key}`] && f.hintKey && (
              <div style={{
                fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#8a7d6b",
                fontStyle: "italic", marginBottom: 8, padding: "8px 12px",
                background: "rgba(200,180,140,0.04)", borderRadius: 6,
              }}>💡 {pm.hints[f.hintKey]}</div>
            )}
            <textarea
              value={responses[currentMaxim]?.[f.key] || ""}
              onChange={e => updateResponse(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box", resize: "vertical",
                background: "rgba(15,15,25,0.6)", border: "1px solid rgba(200,180,140,0.1)",
                borderRadius: 10, padding: "14px 16px",
                fontFamily: "'Source Serif 4', serif", fontSize: 14.5, color: "#c4baa8",
                lineHeight: 1.7, outline: "none",
              }}
            />
          </div>
        ))}
      </div>

      {!submitted[currentMaxim] ? (
        <button
          onClick={() => setSubmitted(prev => ({ ...prev, [currentMaxim]: true }))}
          disabled={!responses[currentMaxim]?.verdict}
          style={{
            marginTop: 24, padding: "12px 32px", borderRadius: 10, cursor: "pointer",
            fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
            background: responses[currentMaxim]?.verdict ? "rgba(200,180,140,0.12)" : "rgba(40,40,55,0.3)",
            border: `1px solid ${responses[currentMaxim]?.verdict ? "rgba(200,180,140,0.25)" : "rgba(200,180,140,0.06)"}`,
            color: responses[currentMaxim]?.verdict ? "#c8b48c" : "#4a4a5a",
          }}>Submit Analysis</button>
      ) : (
        <div style={{
          marginTop: 24, padding: "20px 24px", borderRadius: 12,
          background: "rgba(140,180,100,0.06)", border: "1px solid rgba(140,180,100,0.15)",
          maxWidth: 640,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#a8c878",
            fontWeight: 500, marginBottom: 8,
          }}>✓ Analysis submitted</div>
          <div style={{
            fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#8a9a6a",
            lineHeight: 1.7,
          }}>
            Share your responses with the class or your instructor for discussion.
            There can be genuine philosophical debate about how to apply these formulations —
            that's part of what makes Kant so rich.
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── MAIN APP ───
export default function KantApp() {
  const [section, setSection] = useState(0);

  const renderSection = () => {
    switch (section) {
      case 0: return <IntroSection />;
      case 1: return <GoodWillSection />;
      case 2: return <UniversalLawSection />;
      case 3: return <FalsePromiseSection />;
      case 4: return <HumanitySection />;
      case 5: return <PracticeSection />;
      default: return <IntroSection />;
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "#0a0a0f", position: "relative" }}>
        <KantBackground />
        <NavSidebar current={section} onNav={setSection} />
        {renderSection()}
        {/* Bottom nav */}
        <div style={{
          marginLeft: 260, padding: "0 80px 48px", position: "relative", zIndex: 10,
          display: "flex", justifyContent: "space-between", maxWidth: 1100,
        }}>
          {section > 0 ? (
            <button onClick={() => setSection(section - 1)} style={{
              background: "rgba(200,180,140,0.06)", border: "1px solid rgba(200,180,140,0.12)",
              borderRadius: 10, padding: "12px 28px", cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#8a7d6b",
            }}>← {SECTIONS[section - 1]}</button>
          ) : <div />}
          {section < SECTIONS.length - 1 ? (
            <button onClick={() => setSection(section + 1)} style={{
              background: "rgba(200,180,140,0.1)", border: "1px solid rgba(200,180,140,0.2)",
              borderRadius: 10, padding: "12px 28px", cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#c8b48c",
            }}>{SECTIONS[section + 1]} →</button>
          ) : <div />}
        </div>
      </div>
    </>
  );
}
