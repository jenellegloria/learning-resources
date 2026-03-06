import { Link } from "react-router-dom";

const tools = [
  {
    id: "kant-categorical-imperative",
    title: "Kant's Categorical Imperative",
    subtitle: "Universal Law & Humanity Formulations",
    description:
      "Interactive walkthrough of Kant's moral philosophy — from Good Will through both formulations of the Categorical Imperative, with visual illustrations and guided student exercises.",
    tags: ["Deontology", "Kant", "Ethics"],
    icon: "⚖️",
    accent: "#c8b48c",
  },
  // To add a new tool, create a folder in src/tools/, add a route in main.jsx,
  // and add an entry here. Example:
  // {
  //   id: "trolley-problem",
  //   title: "The Trolley Problem",
  //   subtitle: "Exploring Consequentialism vs. Deontology",
  //   description: "Interactive scenarios...",
  //   tags: ["Consequentialism", "Thought Experiments"],
  //   icon: "🚃",
  //   accent: "#8cabc8",
  // },
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
          background: "linear-gradient(160deg, #0a0a0f 0%, #12121f 40%, #0d1117 100%)",
          padding: "80px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            opacity: 0.025,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(200,180,140,0.5) 50px),
              repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(200,180,140,0.5) 50px)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 64 }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: "#5a5a6a",
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
                color: "#e8dcc8",
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
                color: "#7a7a8a",
                marginTop: 16,
                lineHeight: 1.7,
                maxWidth: 540,
              }}
            >
              A collection of interactive tools for exploring core concepts in
              ethics and moral philosophy.
            </p>
          </div>

          {/* Tool Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/${tool.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "rgba(20,20,32,0.7)",
                    border: "1px solid rgba(200,180,140,0.08)",
                    borderRadius: 16,
                    padding: "32px 36px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,180,140,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,180,140,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, ${tool.accent}, transparent)`,
                      opacity: 0.6,
                    }}
                  />

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                    <div
                      style={{
                        fontSize: 36,
                        flexShrink: 0,
                        width: 60,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(200,180,140,0.05)",
                        borderRadius: 12,
                      }}
                    >
                      {tool.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 24,
                          fontWeight: 500,
                          color: "#e8dcc8",
                          margin: 0,
                        }}
                      >
                        {tool.title}
                      </h2>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15,
                          color: "#8a7d6b",
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
                          color: "#8a8a9a",
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
                              color: "#6a6a7a",
                              padding: "4px 10px",
                              borderRadius: 4,
                              background: "rgba(200,180,140,0.05)",
                              border: "1px solid rgba(200,180,140,0.08)",
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
                        color: "#5a5a6a",
                        alignSelf: "center",
                      }}
                    >
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer hint */}
          <div
            style={{
              marginTop: 64,
              padding: "20px 0",
              borderTop: "1px solid rgba(200,180,140,0.06)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "#3a3a4a",
              lineHeight: 1.8,
            }}
          >
            To add new tools, create a component in{" "}
            <span style={{ color: "#5a5a6a" }}>src/tools/</span>, add a route in{" "}
            <span style={{ color: "#5a5a6a" }}>main.jsx</span>, and register it in{" "}
            <span style={{ color: "#5a5a6a" }}>App.jsx</span>.
          </div>
        </div>
      </div>
    </>
  );
}
