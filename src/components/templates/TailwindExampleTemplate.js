import React from "react";
import useTemplatePalette from "../../hooks/useTemplatePalette";

/**
 * Example template component that uses the template palette hook with Tailwind CSS
 * This component demonstrates how to use the hook with Tailwind by applying styles inline
 *
 * @param {Object} props - Component props
 * @param {Object} props.defaultColors - Default template colors
 * @param {Object} props.customColors - User's custom colors (optional)
 * @param {React.ReactNode} props.children - Child components
 */
const TailwindExampleTemplate = ({
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

  // Helper function to create Tailwind-like class names with dynamic colors
  const tw = (baseClasses, colorStyles = {}) => {
    // Convert style object to inline style string
    const styleString = Object.entries(colorStyles)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join("; ");

    return {
      className: baseClasses,
      style: colorStyles,
    };
  };

  return (
    <div {...tw("min-h-screen", getStyle("neutral", 50))}>
      {/* Header */}
      <header {...tw("py-4", getStyle("primary", 600))}>
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl font-bold text-white">
            Tailwind Example Template
          </h1>
          <p style={{ color: getColor("primary", 100) }}>
            Using the template palette hook with Tailwind CSS
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {/* Primary Card */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div
              className="p-4"
              style={{
                backgroundColor: getColor("primary", 500),
                color: "#fff",
              }}
            >
              <h2 className="text-xl font-semibold">Primary Section</h2>
            </div>
            <div className="p-4">
              <p className="mb-4" style={{ color: getColor("neutral", 800) }}>
                This section uses the primary color palette.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(palettes.primary).map((shade) => (
                  <div
                    key={`primary-${shade}`}
                    className="flex justify-center items-center w-8 h-8 text-xs rounded"
                    style={{
                      backgroundColor: palettes.primary[shade],
                      color: parseInt(shade) > 500 ? "#fff" : "#000",
                    }}
                    title={`${palettes.primary[shade]}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
              <button
                className="px-4 py-2 mt-4 rounded transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: getColor("primary", 600),
                  color: "#fff",
                }}
              >
                Primary Button
              </button>
            </div>
          </div>

          {/* Secondary Card */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div
              className="p-4"
              style={{
                backgroundColor: getColor("secondary", 500),
                color: getColor("neutral", 900),
              }}
            >
              <h2 className="text-xl font-semibold">Secondary Section</h2>
            </div>
            <div className="p-4">
              <p className="mb-4" style={{ color: getColor("neutral", 800) }}>
                This section uses the secondary color palette.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(palettes.secondary).map((shade) => (
                  <div
                    key={`secondary-${shade}`}
                    className="flex justify-center items-center w-8 h-8 text-xs rounded"
                    style={{
                      backgroundColor: palettes.secondary[shade],
                      color: parseInt(shade) > 700 ? "#fff" : "#000",
                    }}
                    title={`${palettes.secondary[shade]}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
              <button
                className="px-4 py-2 mt-4 rounded transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: getColor("secondary", 500),
                  color: getColor("neutral", 900),
                }}
              >
                Secondary Button
              </button>
            </div>
          </div>

          {/* Tertiary Card */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div
              className="p-4"
              style={{
                backgroundColor: getColor("tertiary", 500),
                color: "#fff",
              }}
            >
              <h2 className="text-xl font-semibold">Tertiary Section</h2>
            </div>
            <div className="p-4">
              <p className="mb-4" style={{ color: getColor("neutral", 800) }}>
                This section uses the tertiary color palette.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(palettes.tertiary).map((shade) => (
                  <div
                    key={`tertiary-${shade}`}
                    className="flex justify-center items-center w-8 h-8 text-xs rounded"
                    style={{
                      backgroundColor: palettes.tertiary[shade],
                      color: parseInt(shade) > 500 ? "#fff" : "#000",
                    }}
                    title={`${palettes.tertiary[shade]}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
              <button
                className="px-4 py-2 mt-4 rounded transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: getColor("tertiary", 500),
                  color: "#fff",
                }}
              >
                Tertiary Button
              </button>
            </div>
          </div>
        </div>

        {/* Gradient Examples */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow">
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ color: getColor("neutral", 900) }}
          >
            Gradient Examples
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              className="flex justify-center items-center h-24 font-bold rounded"
              style={getGradientStyle("primary", "45deg", [300, 700])}
            >
              <span className="text-white">Primary Gradient</span>
            </div>

            <div
              className="flex justify-center items-center h-24 font-bold rounded"
              style={getGradientStyle("secondary", "to right", [200, 600])}
            >
              <span style={{ color: getColor("neutral", 900) }}>
                Secondary Gradient
              </span>
            </div>

            <div
              className="flex justify-center items-center h-24 font-bold rounded"
              style={getGradientStyle("tertiary", "to bottom", [200, 800])}
            >
              <span className="text-white">Tertiary Gradient</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ color: getColor("neutral", 900) }}
          >
            Content Area
          </h2>

          <div className="max-w-none prose">
            <p style={{ color: getColor("neutral", 800) }}>
              This is an example of how to use the template palette hook with
              Tailwind CSS. You can easily change the colors by passing
              different values to the <code>defaultColors</code> or{" "}
              <code>customColors</code> props.
            </p>

            <h3
              className="mt-6 mb-2 text-xl font-semibold"
              style={{ color: getColor("primary", 800) }}
            >
              Features
            </h3>
            <ul
              className="pl-5 list-disc"
              style={{ color: getColor("neutral", 700) }}
            >
              <li>Works with Tailwind CSS classes</li>
              <li>Isolated color palette for each template instance</li>
              <li>Default colors defined by the template</li>
              <li>Optional custom colors provided by the user</li>
              <li>Automatically generates appropriate shades for each color</li>
            </ul>

            <div
              className="p-4 mt-6 rounded-r"
              style={{
                backgroundColor: getColor("secondary", 50),
                borderLeft: `4px solid ${getColor("secondary", 500)}`,
              }}
            >
              <h4
                className="mb-2 font-bold"
                style={{ color: getColor("secondary", 900) }}
              >
                Note
              </h4>
              <p style={{ color: getColor("secondary", 800) }}>
                This approach allows you to use Tailwind's utility classes for
                layout and spacing, while applying dynamic colors through inline
                styles.
              </p>
            </div>
          </div>

          {/* Custom Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-4 mt-8"
        style={{ backgroundColor: getColor("neutral", 800), color: "#fff" }}
      >
        <div className="container px-4 mx-auto">
          <p>Tailwind Example Template &copy; 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default TailwindExampleTemplate;
