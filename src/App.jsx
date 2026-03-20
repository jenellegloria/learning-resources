import { Link } from "react-router-dom";

const tools = [
  {
    id: "kant-categorical-imperative",
    title: "Kant's Categorical Imperative",
    subtitle: "Universal Law & Humanity Formulations",
    description:
      "Walkthrough Kant's moral philosophy, from the Good Will through two formulations of the Categorical Imperative.",
    tags: ["Deontology", "Kant", "Ethics"],
    accent: "#b07d4a",
  },
  {
    id: "utility-calculator",
    title: "Utility Calculator",
    subtitle: "Bentham, Mill & Preference Utilitarianism",
    description:
      "Apply the utilitarian calculus to any moral situation. Compare between Betham, Mill, and Preference Utilitarianism.",
    tags: ["Utilitarianism", "Consequentialism", "Ethics"],
    accent: "#3a6ea8",
  },
  {
    id: "aristotle-golden-mean",
    title: "Aristotle's Golden Mean",
    subtitle: "Virtue Ethics & the Doctrine of the Mean",
    description:
      "Guided activity for exploring Aristotle's virtue ethics, particularly the idea of virtues as the mean between extremes of excess and deficiency.",
    tags: ["Virtue Ethics", "Aristotle", "Character"],
    accent: "#4a8a5a",
  },
  {
    id: "trolley-problem",
    title: "The Trolley Problem",
    subtitle: "Consequentialism vs. Deontology",
    description:
      "Work through classic and variant trolley scenarios. Where do your intuitions align with consequentialist vs. deontological ethics? ",
    tags: ["Consequentialism", "Deontology", "Thought Experiments"],
    accent: "#a03a3a",
  },
  {
    id: "aristotle-final-end",
    title: "Aristotle's Final End",
    subtitle: "Telos, Eudaimonia & the Why Chain",
    description:
      "Why are you here on this learning resource webpage? Follow a chain from that question to (maybe) the meaning of human life",
    tags: ["Virtue Ethics", "Aristotle", "Eudaimonia"],
    accent: "#3a7a6a",
  },
  {
    id: "care-ethics-nursing",
    title: "Care Ethics in Nursing",
    subtitle: "Reflections on Applying Care Ethics to Nursing Scenarios",
    description:
      "Learn about Nel Noddings' Care Ethics framework for moral theorizing by reflecting on how to apply it to various scenarios.",
    tags: ["Noddings", "Ethics of Care", "Nursing"],
    accent: "#a78ed5"
  }
];

export default function App() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f2ed",
          padding: "80px 40px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 64 }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: "#8a8070",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Interactive Teaching Tools
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 52,
                fontWeight: 300,
                color: "#1a1612",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Learning Resources
            </h1>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: 17,
                color: "#5a5248",
                marginTop: 16,
                lineHeight: 1.7,
                maxWidth: 540,
              }}
            >
              A collection of interactive tools for learning.
            </p>
          </div>

          {/* Tool Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/${tool.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #ddd8d0",
                    borderRadius: 12,
                    padding: "28px 32px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#bbb4a8";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ddd8d0";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${tool.accent}, transparent)`,
                    }}
                  />

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 24,
                          fontWeight: 500,
                          color: "#1a1612",
                          margin: 0,
                        }}
                      >
                        {tool.title}
                      </h2>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15,
                          color: "#7a6e60",
                          fontStyle: "italic",
                          marginTop: 2,
                        }}
                      >
                        {tool.subtitle}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontSize: 14.5,
                          color: "#4a4640",
                          lineHeight: 1.7,
                          marginTop: 12,
                          marginBottom: 14,
                        }}
                      >
                        {tool.description}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: 10,
                              color: "#6a6258",
                              padding: "4px 10px",
                              borderRadius: 4,
                              background: "#f0ece6",
                              border: "1px solid #ddd8d0",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 18,
                        color: "#9a9288",
                        alignSelf: "center",
                        flexShrink: 0,
                      }}
                    >
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 64,
              padding: "20px 0",
              borderTop: "1px solid #ddd8d0",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "#aaa49a",
              lineHeight: 1.8,
            }}
          >
            <div style={{ display: "none" }}>
              To add new tools, create a component in{" "}
              <span style={{ color: "#8a8070" }}>src/tools/</span>, add a route in{" "}
              <span style={{ color: "#8a8070" }}>main.jsx</span>, and register it in{" "}
              <span style={{ color: "#8a8070" }}>App.jsx</span>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
