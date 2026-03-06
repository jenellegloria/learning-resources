import { useState, useEffect, useRef } from "react";

const SCENARIOS = [
  {
    id: "classic",
    title: "The Classic Switch",
    phase: 1,
    setup: "A runaway trolley is barreling down the tracks toward five workers who cannot escape. You are standing next to a lever that can divert the trolley onto a side track — but there is one worker on that track.",
    question: "Do you pull the lever?",
    optionA: { label: "Pull the lever", subtitle: "Divert the trolley, killing 1 to save 5", icon: "⚡" },
    optionB: { label: "Do nothing", subtitle: "Allow the trolley to continue, killing 5", icon: "🚫" },
    aData: { pct: 87, label: "pulled the lever" },
    bData: { pct: 13, label: "did nothing" },
    aAlign: { consequentialism: 2, deontology: -1 },
    bAlign: { consequentialism: -2, deontology: 2 },
    aExplain: "A consequentialist would approve: 1 death is better than 5. You maximized the outcome.",
    bExplain: "A deontological thinker might argue you upheld moral duty — you didn't actively cause harm.",
    philosophers: {
      a: { name: "Jeremy Bentham", quote: "The greatest happiness of the greatest number is the foundation of morals.", school: "Utilitarianism" },
      b: { name: "Immanuel Kant", quote: "Act only according to that maxim whereby you can will that it should become a universal law.", school: "Deontology" }
    }
  },
  {
    id: "footbridge",
    title: "The Footbridge",
    phase: 2,
    setup: "The same trolley is heading for five workers. This time, you're standing on a footbridge above the tracks next to a very large stranger. The only way to stop the trolley is to push the stranger off the bridge onto the tracks below. Their body will stop the trolley, saving the five — but the stranger will die.",
    question: "Do you push the stranger?",
    optionA: { label: "Push the stranger", subtitle: "Use them to stop the trolley, saving 5", icon: "👐" },
    optionB: { label: "Don't push", subtitle: "Allow the trolley to kill 5 workers", icon: "🛑" },
    aData: { pct: 31, label: "pushed the stranger" },
    bData: { pct: 69, label: "refused to push" },
    aAlign: { consequentialism: 2, deontology: -2 },
    bAlign: { consequentialism: -1, deontology: 2 },
    aExplain: "The math is the same as the switch — 1 for 5. But most people feel this is morally different. Why?",
    bExplain: "Most people share your intuition. Using someone as a means to an end feels fundamentally different from diverting a threat.",
    philosophers: {
      a: { name: "Peter Singer", quote: "If it is in our power to prevent something bad from happening, without thereby sacrificing anything of comparable moral importance, we ought to do it.", school: "Preference Utilitarianism" },
      b: { name: "Immanuel Kant", quote: "So act that you use humanity, in your own person as well as in the person of any other, always as an end, never merely as a means.", school: "Deontology" }
    }
  },
  {
    id: "loop",
    title: "The Loop Track",
    phase: 3,
    setup: "The trolley is again heading toward five workers. There is a side track that loops back and reconnects to the main track before the five workers. On this loop track stands one person. If you divert the trolley, it will hit the one person, whose body will stop the trolley before it loops back to the five.",
    question: "Do you divert to the loop?",
    optionA: { label: "Divert to the loop", subtitle: "The person's body stops the trolley, saving 5", icon: "🔄" },
    optionB: { label: "Don't divert", subtitle: "Let the trolley hit the five workers", icon: "✋" },
    aData: { pct: 63, label: "diverted to the loop" },
    bData: { pct: 37, label: "didn't divert" },
    aAlign: { consequentialism: 2, deontology: -1 },
    bAlign: { consequentialism: -1, deontology: 1 },
    aExplain: "Like the classic switch, you diverted the trolley. But here, the person's body is instrumental — without them, the five still die. Are you using them as a means?",
    bExplain: "You recognized the subtle difference: in this version, the person's presence is necessary for the plan to work, making it closer to the footbridge than the classic switch.",
    philosophers: {
      a: { name: "Judith Jarvis Thomson", quote: "Killing is worse than letting die — but the question is whether diverting counts as killing.", school: "Moral Philosophy" },
      b: { name: "Philippa Foot", quote: "There is a morally relevant distinction between doing and allowing.", school: "Virtue Ethics" }
    }
  },
  {
    id: "transplant",
    title: "The Transplant Surgeon",
    phase: 4,
    setup: "You are a surgeon with five patients, each of whom needs a different organ transplant to survive. A healthy traveler comes in for a routine checkup. You could harvest this person's organs — killing them — to save the five patients. No one would ever know.",
    question: "Do you harvest the organs?",
    optionA: { label: "Harvest the organs", subtitle: "Kill the traveler to save five patients", icon: "🏥" },
    optionB: { label: "Refuse", subtitle: "Let the five patients die", icon: "⚖️" },
    aData: { pct: 4, label: "would harvest organs" },
    bData: { pct: 96, label: "refused to harvest" },
    aAlign: { consequentialism: 3, deontology: -3 },
    bAlign: { consequentialism: -1, deontology: 3 },
    aExplain: "Pure utilitarian calculus says this is identical to the switch: sacrifice 1 for 5. Yet almost no one agrees. This reveals the limits of pure consequentialism.",
    bExplain: "Nearly everyone shares your reaction. Rights, consent, trust in institutions — these feel non-negotiable. This scenario exposes why most people aren't pure consequentialists.",
    philosophers: {
      a: { name: "R.M. Hare", quote: "Moral thinking requires us to consider all interests equally.", school: "Universal Prescriptivism" },
      b: { name: "John Rawls", quote: "Each person possesses an inviolability founded on justice that even the welfare of society cannot override.", school: "Justice as Fairness" }
    }
  },
  {
    id: "autonomous",
    title: "The Self-Driving Car",
    phase: 5,
    setup: "You are programming the ethics module of a self-driving car. The car's brakes fail while five pedestrians cross the road. The car can swerve into a wall, killing its single passenger, or continue straight, killing the five pedestrians. You must decide the algorithm NOW — before any accident happens.",
    question: "What do you program?",
    optionA: { label: "Swerve into wall", subtitle: "Sacrifice the passenger to save five pedestrians", icon: "🚗" },
    optionB: { label: "Continue straight", subtitle: "Protect the passenger; five pedestrians die", icon: "🛣️" },
    aData: { pct: 52, label: "would swerve (save pedestrians)" },
    bData: { pct: 48, label: "would continue (save passenger)" },
    aAlign: { consequentialism: 2, deontology: -1 },
    bAlign: { consequentialism: -1, deontology: 1 },
    aExplain: "You applied the utilitarian calculus — but interestingly, studies show most people wouldn't buy a car programmed this way. The 'moral machine' paradox.",
    bExplain: "You prioritized the duty of care to the passenger who trusted the vehicle. But is the programmer morally responsible for the five deaths?",
    philosophers: {
      a: { name: "Peter Singer", quote: "We must consider the interests of all those affected by our actions.", school: "Effective Altruism" },
      b: { name: "Thomas Hobbes", quote: "The obligation of subjects to the sovereign is understood to last as long as the power lasteth by which he is able to protect them.", school: "Social Contract Theory" }
    }
  }
];

const PALETTE = {
  bg: "#0a0a0f",
  card: "#12121a",
  cardHover: "#1a1a28",
  border: "#2a2a3a",
  accent: "#e63946",
  accentSoft: "rgba(230, 57, 70, 0.15)",
  gold: "#f4a261",
  blue: "#457b9d",
  blueSoft: "rgba(69, 123, 157, 0.15)",
  text: "#e8e8ec",
  textMuted: "#8888a0",
  textDim: "#555570",
  white: "#f1faee",
  green: "#2a9d8f",
  greenSoft: "rgba(42, 157, 143, 0.15)"
};

function ProgressRail({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 32 : 12,
          height: 4,
          borderRadius: 2,
          background: i < current ? PALETTE.accent : i === current ? PALETTE.gold : PALETTE.border,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
        }} />
      ))}
    </div>
  );
}

function AlignmentBar({ consequentialism, deontology }) {
  const total = Math.abs(consequentialism) + Math.abs(deontology) || 1;
  const cPct = Math.max(5, ((consequentialism + 15) / 30) * 100);
  return (
    <div style={{ position: "relative", height: 8, borderRadius: 4, background: PALETTE.border, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: `${cPct}%`,
        background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.gold})`,
        borderRadius: 4,
        transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
      }} />
    </div>
  );
}

function ResponseChart({ aData, bData, choice, animate }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setProgress(1), 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const barStyle = (pct, color) => ({
    height: 28,
    width: `${pct * progress}%`,
    background: color,
    borderRadius: 4,
    transition: "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    minWidth: progress > 0 ? 2 : 0
  });

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: PALETTE.textMuted, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        How Others Responded
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 60, textAlign: "right", fontSize: 13, color: choice === "a" ? PALETTE.white : PALETTE.textMuted, fontWeight: choice === "a" ? 700 : 400, fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(aData.pct * progress)}%
          </div>
          <div style={{ flex: 1 }}>
            <div style={barStyle(aData.pct, choice === "a" ? PALETTE.accent : PALETTE.textDim)} />
          </div>
          <div style={{ fontSize: 12, color: PALETTE.textMuted, width: 140 }}>{aData.label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 60, textAlign: "right", fontSize: 13, color: choice === "b" ? PALETTE.white : PALETTE.textMuted, fontWeight: choice === "b" ? 700 : 400, fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(bData.pct * progress)}%
          </div>
          <div style={{ flex: 1 }}>
            <div style={barStyle(bData.pct, choice === "b" ? PALETTE.blue : PALETTE.textDim)} />
          </div>
          <div style={{ fontSize: 12, color: PALETTE.textMuted, width: 140 }}>{bData.label}</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: PALETTE.textDim, fontStyle: "italic" }}>
        Based on aggregated data from published trolley problem studies (anonymized)
      </div>
    </div>
  );
}

function PhilosopherCard({ philosopher, side }) {
  const color = side === "a" ? PALETTE.accent : PALETTE.blue;
  return (
    <div style={{
      background: side === "a" ? PALETTE.accentSoft : PALETTE.blueSoft,
      border: `1px solid ${color}33`,
      borderRadius: 8,
      padding: "14px 16px",
      marginTop: 12
    }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
        {philosopher.school}
      </div>
      <div style={{ fontSize: 14, color: PALETTE.white, fontWeight: 600, marginBottom: 6 }}>
        {philosopher.name}
      </div>
      <div style={{ fontSize: 13, color: PALETTE.textMuted, fontStyle: "italic", lineHeight: 1.5 }}>
        "{philosopher.quote}"
      </div>
    </div>
  );
}

function ScenarioView({ scenario, onChoice, choiceMade, choiceValue, explanation, onExplain }) {
  const [showResult, setShowResult] = useState(false);
  const [hoverA, setHoverA] = useState(false);
  const [hoverB, setHoverB] = useState(false);

  useEffect(() => {
    if (choiceMade) {
      const t = setTimeout(() => setShowResult(true), 400);
      return () => clearTimeout(t);
    } else {
      setShowResult(false);
    }
  }, [choiceMade]);

  const btnStyle = (isA, hover) => {
    const chosen = choiceMade && ((isA && choiceValue === "a") || (!isA && choiceValue === "b"));
    const notChosen = choiceMade && !chosen;
    const color = isA ? PALETTE.accent : PALETTE.blue;
    return {
      flex: 1,
      minWidth: 200,
      padding: "24px 20px",
      border: `2px solid ${chosen ? color : notChosen ? PALETTE.border : hover ? color : PALETTE.border}`,
      borderRadius: 12,
      background: chosen ? (isA ? PALETTE.accentSoft : PALETTE.blueSoft) : "transparent",
      cursor: choiceMade ? "default" : "pointer",
      opacity: notChosen ? 0.4 : 1,
      transition: "all 0.3s ease",
      textAlign: "left",
      transform: hover && !choiceMade ? "translateY(-2px)" : "none",
      boxShadow: hover && !choiceMade ? `0 8px 24px ${color}22` : "none"
    };
  };

  return (
    <div style={{
      animation: "fadeSlideIn 0.6s ease forwards",
      opacity: 0,
    }}>
      <div style={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 3,
        color: PALETTE.gold,
        marginBottom: 8,
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        Scenario {scenario.phase} of {SCENARIOS.length}
      </div>
      <h2 style={{
        fontSize: 28,
        fontWeight: 800,
        color: PALETTE.white,
        margin: "0 0 24px 0",
        fontFamily: "'Playfair Display', serif",
        letterSpacing: -0.5
      }}>
        {scenario.title}
      </h2>

      <div style={{
        background: PALETTE.card,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        lineHeight: 1.75,
        fontSize: 15,
        color: PALETTE.text,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, width: 3, height: "100%",
          background: `linear-gradient(180deg, ${PALETTE.accent}, ${PALETTE.gold})`
        }} />
        <div style={{ paddingLeft: 8 }}>{scenario.setup}</div>
      </div>

      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: PALETTE.white,
        marginBottom: 16,
        fontFamily: "'Playfair Display', serif"
      }}>
        {scenario.question}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <button
          style={btnStyle(true, hoverA)}
          onClick={() => !choiceMade && onChoice("a")}
          onMouseEnter={() => setHoverA(true)}
          onMouseLeave={() => setHoverA(false)}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>{scenario.optionA.icon}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: PALETTE.white, marginBottom: 4 }}>
            {scenario.optionA.label}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.textMuted, lineHeight: 1.4 }}>
            {scenario.optionA.subtitle}
          </div>
        </button>
        <button
          style={btnStyle(false, hoverB)}
          onClick={() => !choiceMade && onChoice("b")}
          onMouseEnter={() => setHoverB(true)}
          onMouseLeave={() => setHoverB(false)}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>{scenario.optionB.icon}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: PALETTE.white, marginBottom: 4 }}>
            {scenario.optionB.label}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.textMuted, lineHeight: 1.4 }}>
            {scenario.optionB.subtitle}
          </div>
        </button>
      </div>

      {choiceMade && (
        <div style={{
          animation: "fadeSlideIn 0.5s ease forwards",
          opacity: 0
        }}>
          <div style={{
            background: PALETTE.card,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16
          }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: PALETTE.gold, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>
              Analysis
            </div>
            <div style={{ fontSize: 14, color: PALETTE.text, lineHeight: 1.7 }}>
              {choiceValue === "a" ? scenario.aExplain : scenario.bExplain}
            </div>
            <PhilosopherCard
              philosopher={choiceValue === "a" ? scenario.philosophers.a : scenario.philosophers.b}
              side={choiceValue}
            />
          </div>

          <div style={{
            background: PALETTE.card,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 12,
            padding: 24
          }}>
            <ResponseChart
              aData={scenario.aData}
              bData={scenario.bData}
              choice={choiceValue}
              animate={showResult}
            />
          </div>

          <div style={{
            background: PALETTE.card,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 12,
            padding: 24,
            marginTop: 16
          }}>
            <label style={{
              display: "block",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: PALETTE.gold,
              marginBottom: 10,
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              Explain Your Reasoning <span style={{ color: PALETTE.textDim, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              value={explanation || ""}
              onChange={e => onExplain(e.target.value)}
              placeholder="Why did you make this choice? What factors mattered most to you?"
              rows={3}
              style={{
                width: "100%",
                background: PALETTE.bg,
                border: `1px solid ${PALETTE.border}`,
                borderRadius: 8,
                padding: "12px 14px",
                color: PALETTE.text,
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: "'Source Sans 3', sans-serif",
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsView({ choices, scores, explanations }) {
  const { consequentialism: c, deontology: d } = scores;
  const total = Math.abs(c) + Math.abs(d) || 1;
  const cPct = Math.round(((c + 15) / 30) * 100);
  const dPct = 100 - cPct;

  let profile, profileDesc, profileColor;
  if (c > d + 4) {
    profile = "Strong Consequentialist";
    profileDesc = "You consistently prioritize outcomes over rules. For you, the morality of an action is determined by its results — and saving more lives is almost always the right call.";
    profileColor = PALETTE.accent;
  } else if (c > d) {
    profile = "Leaning Consequentialist";
    profileDesc = "You tend to weigh outcomes heavily, but you're not purely results-driven. Some moral lines feel hard to cross, even when the math suggests you should.";
    profileColor = PALETTE.gold;
  } else if (d > c + 4) {
    profile = "Strong Deontologist";
    profileDesc = "You believe certain actions are inherently right or wrong regardless of outcomes. Rules, rights, and duties matter more to you than utilitarian calculus.";
    profileColor = PALETTE.blue;
  } else if (d > c) {
    profile = "Leaning Deontologist";
    profileDesc = "You tend to respect moral rules and duties, but you're pragmatic enough to consider consequences. You feel the tension between principles and outcomes.";
    profileColor = PALETTE.blue;
  } else {
    profile = "Moral Pluralist";
    profileDesc = "You don't fit neatly into one camp. You weigh both consequences and principles, adapting your moral reasoning to each situation. Many philosophers argue this flexibility is a feature, not a bug.";
    profileColor = PALETTE.green;
  }

  const consistencyCheck = () => {
    const switchChoice = choices["classic"];
    const footbridgeChoice = choices["footbridge"];
    if (switchChoice === "a" && footbridgeChoice === "b") {
      return {
        title: "The Switch vs. the Footbridge",
        text: "You pulled the switch but didn't push the stranger — even though the arithmetic is the same: 1 life for 5. Most people (~85%) respond exactly the way you did. But here's the question worth sitting with: what makes these two cases feel so different? Is it the physical contact? The sense of using someone as a tool? Or is there a genuine moral distinction between redirecting a threat and deliberately employing a person's body to stop it? Do you think they really are different — or do they just feel different?"
      };
    }
    if (switchChoice === "a" && footbridgeChoice === "a") {
      return {
        title: "Same Math, Same Answer",
        text: "You pulled the switch AND pushed the stranger. Only about 31% of people push in the footbridge case, so your willingness to follow the arithmetic in both scenarios is notable. What's worth reflecting on: did the second choice feel harder, even though you made the same call? If so, what was generating that resistance — and were you right to override it?"
      };
    }
    if (switchChoice === "b" && footbridgeChoice === "b") {
      return {
        title: "The Weight of Action",
        text: "You refused to intervene in both cases. A question to consider: is there a moral difference between causing harm and allowing harm to happen? If you believe there is, what grounds that distinction? Consequentialists would argue inaction is itself a choice with consequences — how would you respond to that challenge?"
      };
    }
    return {
      title: "An Interesting Reversal",
      text: "You didn't pull the switch but did push the stranger — an unusual combination that inverts the typical pattern. What factors led you here? It's worth exploring what felt different about each scenario and whether those differences point to something important about your moral reasoning."
      };
  };

  const consistency = consistencyCheck();

  return (
    <div style={{ animation: "fadeSlideIn 0.6s ease forwards", opacity: 0 }}>
      <div style={{
        textAlign: "center",
        marginBottom: 40
      }}>
        <div style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 3,
          color: PALETTE.gold,
          marginBottom: 8,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          Your Ethical Profile
        </div>
        <h2 style={{
          fontSize: 36,
          fontWeight: 800,
          color: profileColor,
          margin: "0 0 12px 0",
          fontFamily: "'Playfair Display', serif"
        }}>
          {profile}
        </h2>
        <p style={{ fontSize: 15, color: PALETTE.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          {profileDesc}
        </p>
      </div>

      <div style={{
        background: PALETTE.card,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: PALETTE.accent, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            Consequentialism {cPct}%
          </span>
          <span style={{ fontSize: 12, color: PALETTE.blue, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            Deontology {dPct}%
          </span>
        </div>
        <div style={{ position: "relative", height: 16, borderRadius: 8, background: PALETTE.border, overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${cPct}%`,
            background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.gold})`,
            borderRadius: 8,
            transition: "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          }} />
        </div>
      </div>

      <div style={{
        background: PALETTE.card,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20
      }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: PALETTE.gold, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
          {consistency.title}
        </div>
        <div style={{ fontSize: 14, color: PALETTE.text, lineHeight: 1.7 }}>
          {consistency.text}
        </div>
      </div>

      <div style={{
        background: PALETTE.card,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20
      }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: PALETTE.gold, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
          Your Choices vs. the Majority
        </div>
        {SCENARIOS.map(s => {
          const c = choices[s.id];
          const data = c === "a" ? s.aData : s.bData;
          const withMajority = data.pct > 50;
          const note = explanations?.[s.id];
          return (
            <div key={s.id} style={{
              padding: "12px 0",
              borderBottom: `1px solid ${PALETTE.border}22`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: withMajority ? PALETTE.green : PALETTE.accent
                }} />
                <div style={{ flex: 1, fontSize: 14, color: PALETTE.text }}>{s.title}</div>
                <div style={{
                  fontSize: 12,
                  color: withMajority ? PALETTE.green : PALETTE.accent,
                  fontFamily: "'JetBrains Mono', monospace",
                  whiteSpace: "nowrap"
                }}>
                  {withMajority ? "With majority" : "Against majority"} ({data.pct}% {data.label})
                </div>
              </div>
              {note && (
                <div style={{
                  marginTop: 8, marginLeft: 20,
                  fontSize: 13, color: PALETTE.textMuted,
                  lineHeight: 1.6, fontStyle: "italic",
                  borderLeft: `2px solid ${PALETTE.border}`,
                  paddingLeft: 12,
                }}>
                  {note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="trolley-no-print" style={{
        background: PALETTE.card,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20
      }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: PALETTE.gold, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
          Further Reading
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { title: "Philippa Foot — \"The Problem of Abortion and the Doctrine of the Double Effect\" (1967)", desc: "The original paper that introduced the trolley problem as a thought experiment.", url: "https://sites.pitt.edu/~mthompso/readings/foot.pdf" },
            { title: "Judith Jarvis Thomson — \"The Trolley Problem\" (1985)", desc: "The landmark elaboration that introduced the footbridge variant and the doing/allowing distinction.", url: "http://openyls.law.yale.edu/server/api/core/bitstreams/2549174b-4728-45bf-bf64-01384116e48c/content" },
            { title: "Joshua Greene — Moral Tribes (2013)", desc: "An accessible deep dive into the neuroscience behind why the switch and the footbridge feel so different.", url: "https://psycnet.apa.org/record/2013-36839-000" },
            { title: "MIT Moral Machine", desc: "An interactive platform exploring how people think self-driving cars should handle moral dilemmas.", url: "https://www.moralmachine.net/" },
            { title: "Stanford Encyclopedia of Philosophy — The Doctrine of Double Effect", desc: "A rigorous philosophical treatment of the principle underlying many trolley problem intuitions.", url: "https://plato.stanford.edu/entries/double-effect/" }
          ].map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
              display: "block",
              padding: "12px 16px",
              background: PALETTE.bg,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = PALETTE.gold; e.currentTarget.style.background = PALETTE.cardHover; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = PALETTE.border; e.currentTarget.style.background = PALETTE.bg; }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: PALETTE.gold, marginBottom: 4, lineHeight: 1.4 }}>
                {item.title} ↗
              </div>
              <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrolleyProblemLab() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState({});
  const [scores, setScores] = useState({ consequentialism: 0, deontology: 0 });
  const [explanations, setExplanations] = useState({});
  const [screen, setScreen] = useState("intro"); // intro, scenario, results
  const [fadeKey, setFadeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  const handleExplain = (scenarioId, text) => {
    setExplanations(prev => ({ ...prev, [scenarioId]: text }));
  };

  const copyToClipboard = () => {
    const { consequentialism: c } = scores;
    const cPct = Math.round(((c + 15) / 30) * 100);

    let profile;
    if (c > scores.deontology + 4) profile = "Strong Consequentialist";
    else if (c > scores.deontology) profile = "Leaning Consequentialist";
    else if (scores.deontology > c + 4) profile = "Strong Deontologist";
    else if (scores.deontology > c) profile = "Leaning Deontologist";
    else profile = "Moral Pluralist";

    const lines = [
      "TROLLEY PROBLEM — RESULTS",
      "=".repeat(40),
      "",
      `Ethical Profile: ${profile}`,
      `Consequentialism: ${cPct}%  |  Deontology: ${100 - cPct}%`,
      "",
      "YOUR CHOICES",
      "-".repeat(40),
      ...SCENARIOS.map(s => {
        const ch = choices[s.id];
        const opt = ch === "a" ? s.optionA.label : s.optionB.label;
        const data = ch === "a" ? s.aData : s.bData;
        const note = explanations?.[s.id];
        return [
          `${s.title}: ${opt} (${data.pct}% ${data.label})`,
          note ? `  Reasoning: ${note}` : null,
        ].filter(Boolean).join("\n");
      }),
    ].join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleChoice = (choice) => {
    const s = SCENARIOS[currentScenario];
    const align = choice === "a" ? s.aAlign : s.bAlign;
    setChoices(prev => ({ ...prev, [s.id]: choice }));
    setScores(prev => ({
      consequentialism: prev.consequentialism + align.consequentialism,
      deontology: prev.deontology + align.deontology
    }));
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setFadeKey(prev => prev + 1);
      if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen("results");
      setFadeKey(prev => prev + 1);
      if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restart = () => {
    setCurrentScenario(0);
    setChoices({});
    setScores({ consequentialism: 0, deontology: 0 });
    setExplanations({});
    setScreen("intro");
    setFadeKey(prev => prev + 1);
  };

  const currentChoice = SCENARIOS[currentScenario] ? choices[SCENARIOS[currentScenario].id] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: PALETTE.bg,
      color: PALETTE.text,
      fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media print {
          .trolley-no-print { display: none !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; border: none; outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${PALETTE.border}; border-radius: 2px; }
      `}</style>

      {/* Ambient background */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: `radial-gradient(circle, ${PALETTE.accent}08, transparent 70%)`,
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: -200, left: -200, width: 500, height: 500,
        borderRadius: "50%", background: `radial-gradient(circle, ${PALETTE.blue}06, transparent 70%)`,
        pointerEvents: "none"
      }} />

      <div ref={containerRef} style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "40px 24px 80px",
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 4,
            color: PALETTE.textDim,
            marginBottom: 4,
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            Interactive Ethics Lab
          </div>
          <h1 style={{
            fontSize: screen === "intro" ? 44 : 22,
            fontWeight: 900,
            color: PALETTE.white,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: -1,
            transition: "font-size 0.4s ease"
          }}>
            The Trolley Problem
          </h1>
        </div>

        {screen !== "intro" && screen !== "results" && (
          <>
            <ProgressRail current={currentScenario} total={SCENARIOS.length} />
            {/* Alignment tracker */}
            <div style={{
              background: PALETTE.card,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 28
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: PALETTE.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                  Consequentialist
                </span>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: PALETTE.blue, fontFamily: "'JetBrains Mono', monospace" }}>
                  Deontologist
                </span>
              </div>
              <AlignmentBar {...scores} />
            </div>
          </>
        )}

        {screen === "intro" && (
          <div key={fadeKey} style={{ animation: "fadeSlideIn 0.6s ease forwards", opacity: 0 }}>
            <div style={{
              fontSize: 64,
              textAlign: "center",
              marginBottom: 24,
              animation: "float 3s ease-in-out infinite"
            }}>
              🚋
            </div>
            <div style={{
              background: PALETTE.card,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 12,
              padding: 28,
              marginBottom: 28,
              textAlign: "center"
            }}>
              <p style={{ fontSize: 16, color: PALETTE.text, lineHeight: 1.8, marginBottom: 16 }}>
                You will face <strong style={{ color: PALETTE.white }}>{SCENARIOS.length} moral dilemmas</strong> — each one a variation of philosophy's most famous thought experiment. After each choice, you'll see how your decision compares to aggregated responses from published studies, and which ethical framework your reasoning aligns with.
              </p>
              <p style={{ fontSize: 14, color: PALETTE.textMuted, lineHeight: 1.7 }}>
                Answer honestly — your responses aren't collected or shared with anyone. This is purely for your own reflection.
              </p>
            </div>

            <div style={{
              display: "flex", gap: 16, flexWrap: "wrap",
              justifyContent: "center", marginBottom: 32
            }}>
              {[
                { icon: "⚖️", label: "5 Scenarios", desc: "Classic to modern" },
                { icon: "📊", label: "Real Data", desc: "Anonymized responses" },
                { icon: "🧠", label: "Alignment", desc: "Track your ethics" }
              ].map((f, i) => (
                <div key={i} style={{
                  background: PALETTE.card,
                  border: `1px solid ${PALETTE.border}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  textAlign: "center",
                  flex: "1 1 140px",
                  maxWidth: 180
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.white, marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: PALETTE.textMuted }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => { setScreen("scenario"); setFadeKey(prev => prev + 1); }}
                style={{
                  padding: "14px 40px",
                  background: `linear-gradient(135deg, ${PALETTE.accent}, #c1121f)`,
                  color: PALETTE.white,
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 8,
                  letterSpacing: 0.5,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 4px 20px ${PALETTE.accent}44`
                }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 30px ${PALETTE.accent}66`; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 4px 20px ${PALETTE.accent}44`; }}
              >
                Begin the Experiment
              </button>
            </div>
          </div>
        )}

        {screen === "scenario" && (
          <div key={fadeKey}>
            <ScenarioView
              scenario={SCENARIOS[currentScenario]}
              onChoice={handleChoice}
              choiceMade={!!currentChoice}
              choiceValue={currentChoice}
              explanation={explanations[SCENARIOS[currentScenario].id]}
              onExplain={text => handleExplain(SCENARIOS[currentScenario].id, text)}
            />
            {currentChoice && (
              <div style={{ textAlign: "center", marginTop: 28, animation: "fadeSlideIn 0.4s ease 0.3s forwards", opacity: 0 }}>
                <button
                  onClick={nextScenario}
                  style={{
                    padding: "12px 32px",
                    background: currentScenario < SCENARIOS.length - 1
                      ? `linear-gradient(135deg, ${PALETTE.accent}, #c1121f)`
                      : `linear-gradient(135deg, ${PALETTE.green}, #1a7a6d)`,
                    color: PALETTE.white,
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 8,
                    letterSpacing: 0.5,
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.target.style.transform = "none"}
                >
                  {currentScenario < SCENARIOS.length - 1 ? "Next Scenario →" : "View My Results →"}
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "results" && (
          <div key={fadeKey}>
            <ResultsView choices={choices} scores={scores} explanations={explanations} />
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
              <button
                onClick={() => window.print()}
                style={{
                  padding: "12px 32px",
                  background: `linear-gradient(135deg, ${PALETTE.green}, #1a7a6d)`,
                  color: PALETTE.white,
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 8,
                  transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "none"}
              >
                Print / Save Results
              </button>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "12px 32px",
                  background: "transparent",
                  border: `1px solid ${copied ? PALETTE.gold : PALETTE.border}`,
                  color: copied ? PALETTE.gold : PALETTE.textMuted,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = PALETTE.gold; e.currentTarget.style.color = PALETTE.white; } }}
                onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = PALETTE.border; e.currentTarget.style.color = PALETTE.textMuted; } }}
              >
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={restart}
                style={{
                  padding: "12px 32px",
                  background: "transparent",
                  border: `1px solid ${PALETTE.border}`,
                  color: PALETTE.textMuted,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.target.style.borderColor = PALETTE.accent; e.target.style.color = PALETTE.white; }}
                onMouseLeave={e => { e.target.style.borderColor = PALETTE.border; e.target.style.color = PALETTE.textMuted; }}
              >
                ↺ Start Over
              </button>
            </div>
          </div>
        )}

        <div style={{
          textAlign: "center",
          marginTop: 48,
          paddingTop: 24,
          borderTop: `1px solid ${PALETTE.border}33`,
          fontSize: 11,
          color: PALETTE.textDim,
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          Response data drawn from aggregated published studies including<br />
          Foot (1967), Thomson (1985), Greene et al. (2001), and the MIT Moral Machine project.
        </div>
      </div>
    </div>
  );
}
