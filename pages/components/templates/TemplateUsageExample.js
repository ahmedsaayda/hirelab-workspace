import React, { useState } from "react";
import ExampleTemplate from "./ExampleTemplate";

/**
 * Component to demonstrate how to use the ExampleTemplate with different color schemes
 */
const TemplateUsageExample = () => {
  // Default template colors
  const defaultColors = {
    primaryColor: "#2e9eac", // Default teal
    secondaryColor: "#e1ce11", // Default yellow
    tertiaryColor: "#44b566", // Default green
  };

  // State for custom colors
  const [customColors, setCustomColors] = useState({
    primaryColor: "",
    secondaryColor: "",
    tertiaryColor: "",
  });

  // State for active template
  const [activeTemplate, setActiveTemplate] = useState("default");

  // Predefined color schemes
  const colorSchemes = {
    default: {
      primaryColor: "#2e9eac", // Teal
      secondaryColor: "#e1ce11", // Yellow
      tertiaryColor: "#44b566", // Green
    },
    blue: {
      primaryColor: "#1976d2", // Blue
      secondaryColor: "#ff9800", // Orange
      tertiaryColor: "#4caf50", // Green
    },
    purple: {
      primaryColor: "#6a1b9a", // Purple
      secondaryColor: "#ffc107", // Amber
      tertiaryColor: "#26a69a", // Teal
    },
    red: {
      primaryColor: "#d32f2f", // Red
      secondaryColor: "#ffeb3b", // Yellow
      tertiaryColor: "#2196f3", // Blue
    },
    dark: {
      primaryColor: "#263238", // Dark Blue Grey
      secondaryColor: "#ffc107", // Amber
      tertiaryColor: "#4caf50", // Green
    },
  };

  // Handle color input change
  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setCustomColors((prev) => ({
      ...prev,
      [name]: value,
    }));
    setActiveTemplate("custom");
  };

  // Apply a predefined color scheme
  const applyColorScheme = (schemeName) => {
    setActiveTemplate(schemeName);
    setCustomColors({
      primaryColor: "",
      secondaryColor: "",
      tertiaryColor: "",
    });
  };

  // Get the current colors to use
  const getCurrentColors = () => {
    if (activeTemplate === "custom") {
      return {
        primaryColor: customColors.primaryColor || defaultColors.primaryColor,
        secondaryColor:
          customColors.secondaryColor || defaultColors.secondaryColor,
        tertiaryColor:
          customColors.tertiaryColor || defaultColors.tertiaryColor,
      };
    }
    return colorSchemes[activeTemplate];
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Template Color Customization
        </h1>

        {/* Predefined Color Schemes */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
            }}
          >
            Predefined Color Schemes
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {Object.keys(colorSchemes).map((scheme) => (
              <button
                key={scheme}
                onClick={() => applyColorScheme(scheme)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    activeTemplate === scheme ? "#333" : "#f0f0f0",
                  color: activeTemplate === scheme ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {scheme}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
            }}
          >
            Custom Colors
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Primary Color
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type="color"
                  value={
                    customColors.primaryColor || defaultColors.primaryColor
                  }
                  onChange={handleColorChange}
                  name="primaryColor"
                  style={{
                    width: "3rem",
                    height: "2.5rem",
                    marginRight: "0.5rem",
                  }}
                />
                <input
                  type="text"
                  value={customColors.primaryColor}
                  onChange={handleColorChange}
                  name="primaryColor"
                  placeholder={defaultColors.primaryColor}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Secondary Color
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type="color"
                  value={
                    customColors.secondaryColor || defaultColors.secondaryColor
                  }
                  onChange={handleColorChange}
                  name="secondaryColor"
                  style={{
                    width: "3rem",
                    height: "2.5rem",
                    marginRight: "0.5rem",
                  }}
                />
                <input
                  type="text"
                  value={customColors.secondaryColor}
                  onChange={handleColorChange}
                  name="secondaryColor"
                  placeholder={defaultColors.secondaryColor}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Tertiary Color
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type="color"
                  value={
                    customColors.tertiaryColor || defaultColors.tertiaryColor
                  }
                  onChange={handleColorChange}
                  name="tertiaryColor"
                  style={{
                    width: "3rem",
                    height: "2.5rem",
                    marginRight: "0.5rem",
                  }}
                />
                <input
                  type="text"
                  value={customColors.tertiaryColor}
                  onChange={handleColorChange}
                  name="tertiaryColor"
                  placeholder={defaultColors.tertiaryColor}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => applyColorScheme("custom")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTemplate === "custom" ? "#333" : "#f0f0f0",
              color: activeTemplate === "custom" ? "#fff" : "#333",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Apply Custom Colors
          </button>
        </div>
      </div>

      {/* Template Preview */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Template Preview
        </h2>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <ExampleTemplate
            defaultColors={defaultColors}
            customColors={
              activeTemplate === "default" ? null : getCurrentColors()
            }
          >
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "0.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.75rem",
                }}
              >
                Custom Content
              </h3>
              <p>
                This is custom content passed as children to the template. It
                demonstrates how the template can be used as a container for
                custom content while maintaining the consistent styling.
              </p>
            </div>
          </ExampleTemplate>
        </div>
      </div>

      {/* Usage Instructions */}
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
            marginBottom: "1rem",
          }}
        >
          How to Use
        </h2>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontFamily: "monospace",
            overflowX: "auto",
            marginBottom: "1rem",
          }}
        >
          <pre>{`
// Import the template component
import ExampleTemplate from './components/templates/ExampleTemplate';

// Use with default colors
<ExampleTemplate>
  Your content here
</ExampleTemplate>

// Use with custom colors
<ExampleTemplate
  customColors={{
    primaryColor: '#1976d2',
    secondaryColor: '#ff9800',
    tertiaryColor: '#4caf50'
  }}
>
  Your content here
</ExampleTemplate>
          `}</pre>
        </div>
        <p>
          Each template can define its own default colors, and users can
          override these with custom colors. The template will automatically
          generate appropriate shades for each color.
        </p>
      </div>
    </div>
  );
};

export default TemplateUsageExample;
