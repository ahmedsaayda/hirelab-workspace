import React from "react";
import useTemplatePalette from "../../../../../../pages/hooks/useTemplatePalette";

/**
 * Example template component that uses the template palette hook
 *
 * @param {Object} props - Component props
 * @param {Object} props.defaultColors - Default template colors
 * @param {Object} props.customColors - User's custom colors (optional)
 * @param {React.ReactNode} props.children - Child components
 */
const ExampleTemplate = ({
  defaultColors = {
    primaryColor: "#2e9eac", // Default teal
    secondaryColor: "#e1ce11", // Default yellow
    tertiaryColor: "#44b566", // Default green
  },
  customColors = null,
  children,
}) => {
  // Use the template palette hook
  const { getColor, getStyle, getGradient, getGradientStyle, palettes } =
    useTemplatePalette(defaultColors, customColors);

  return (
    <div style={getStyle("neutral", 50)}>
      {/* Header */}
      <header style={getStyle("primary", 600)}>
        <div style={{ padding: "1rem", color: "#fff" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Example Template
          </h1>
          <p style={{ color: getColor("primary", 100) }}>
            Using the template palette hook
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Primary Card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: getColor("primary", 500),
                padding: "1rem",
                color: "#fff",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Primary Section
              </h2>
            </div>
            <div style={{ padding: "1rem" }}>
              <p
                style={{
                  color: getColor("neutral", 800),
                  marginBottom: "1rem",
                }}
              >
                This section uses the primary color palette.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {Object.keys(palettes.primary).map((shade) => (
                  <div
                    key={`primary-${shade}`}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "0.25rem",
                      backgroundColor: palettes.primary[shade],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: parseInt(shade) > 500 ? "#fff" : "#000",
                    }}
                    title={`${palettes.primary[shade]}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: getColor("primary", 600),
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                Primary Button
              </button>
            </div>
          </div>

          {/* Secondary Card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: getColor("secondary", 500),
                padding: "1rem",
                color: getColor("neutral", 900),
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Secondary Section
              </h2>
            </div>
            <div style={{ padding: "1rem" }}>
              <p
                style={{
                  color: getColor("neutral", 800),
                  marginBottom: "1rem",
                }}
              >
                This section uses the secondary color palette.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {Object.keys(palettes.secondary).map((shade) => (
                  <div
                    key={`secondary-${shade}`}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "0.25rem",
                      backgroundColor: palettes.secondary[shade],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: parseInt(shade) > 700 ? "#fff" : "#000",
                    }}
                    title={`${palettes.secondary[shade]}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: getColor("secondary", 500),
                  color: getColor("neutral", 900),
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                Secondary Button
              </button>
            </div>
          </div>

          {/* Tertiary Card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: getColor("tertiary", 500),
                padding: "1rem",
                color: "#fff",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Tertiary Section
              </h2>
            </div>
            <div style={{ padding: "1rem" }}>
              <p
                style={{
                  color: getColor("neutral", 800),
                  marginBottom: "1rem",
                }}
              >
                This section uses the tertiary color palette.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {Object.keys(palettes.tertiary).map((shade) => (
                  <div
                    key={`tertiary-${shade}`}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "0.25rem",
                      backgroundColor: palettes.tertiary[shade],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: parseInt(shade) > 500 ? "#fff" : "#000",
                    }}
                    title={`${palettes.tertiary[shade]}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: getColor("tertiary", 500),
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                Tertiary Button
              </button>
            </div>
          </div>
        </div>

        {/* Gradient Examples */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: getColor("neutral", 900),
              marginBottom: "1rem",
            }}
          >
            Gradient Examples
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                ...getGradientStyle("primary", "45deg", [300, 700]),
                height: "100px",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Primary Gradient
            </div>

            <div
              style={{
                ...getGradientStyle("secondary", "to right", [200, 600]),
                height: "100px",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: getColor("neutral", 900),
                fontWeight: "bold",
              }}
            >
              Secondary Gradient
            </div>

            <div
              style={{
                ...getGradientStyle("tertiary", "to bottom", [200, 800]),
                height: "100px",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Tertiary Gradient
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: getColor("neutral", 900),
              marginBottom: "1rem",
            }}
          >
            Content Area
          </h2>

          <div>
            <p
              style={{ color: getColor("neutral", 800), marginBottom: "1rem" }}
            >
              This is an example of how to use the template palette hook in a
              template component. You can easily change the colors by passing
              different values to the <code>defaultColors</code> or{" "}
              <code>customColors</code> props.
            </p>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: getColor("primary", 800),
                marginTop: "1.5rem",
                marginBottom: "0.75rem",
              }}
            >
              Features
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "1.5rem",
                color: getColor("neutral", 700),
              }}
            >
              <li>Isolated color palette for each template instance</li>
              <li>Default colors defined by the template</li>
              <li>Optional custom colors provided by the user</li>
              <li>Automatically generates appropriate shades for each color</li>
              <li>Utility functions for colors and gradients</li>
            </ul>

            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: getColor("secondary", 50),
                borderLeft: `4px solid ${getColor("secondary", 500)}`,
                borderRadius: "0 0.25rem 0.25rem 0",
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: getColor("secondary", 900),
                  marginBottom: "0.5rem",
                }}
              >
                Note
              </h4>
              <p style={{ color: getColor("secondary", 800) }}>
                The template palette hook provides a consistent way to apply
                branding colors to any template, ensuring a cohesive look and
                feel without affecting the global app styling.
              </p>
            </div>
          </div>

          {/* Custom Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: getColor("neutral", 800),
          color: "#fff",
          padding: "1rem",
          marginTop: "2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p>Template Example &copy; 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default ExampleTemplate;
