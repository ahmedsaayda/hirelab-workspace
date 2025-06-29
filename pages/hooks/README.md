# Template Palette System

This system provides a way to manage template-specific color palettes without affecting the global app styling. It's designed for a SaaS application where users can choose from multiple templates and customize the branding colors for each template.

## Key Features

- **Template-specific colors**: Each template can define its own default colors
- **User customization**: Users can override default colors with their own branding colors
- **Automatic shade generation**: Generates appropriate shades for each color (50-950)
- **Isolated styling**: Doesn't affect the global app styling
- **Works with Tailwind**: Can be used with Tailwind CSS classes

## Usage

### Basic Usage

```jsx
import useTemplatePalette from "../../hooks/useTemplatePalette";

const MyTemplate = ({
  defaultColors = {
    primaryColor: "#2e9eac", // Default teal
    secondaryColor: "#e1ce11", // Default yellow
    tertiaryColor: "#44b566", // Default green
  },
  customColors = null,
  children,
}) => {
  const { getColor, getStyle, getGradient, getGradientStyle, palettes } =
    useTemplatePalette(defaultColors, customColors);

  return (
    <div style={getStyle("neutral", 50)}>
      <header style={getStyle("primary", 600)}>
        <h1 style={{ color: "#fff" }}>My Template</h1>
      </header>

      <main>
        <div style={{ color: getColor("primary", 800) }}>
          This text uses the primary color (800 shade).
        </div>

        <div style={getGradientStyle("secondary", "to right", [200, 600])}>
          This has a secondary color gradient background.
        </div>

        {children}
      </main>
    </div>
  );
};
```

### With Tailwind CSS

```jsx
import useTemplatePalette from "../../hooks/useTemplatePalette";

const MyTailwindTemplate = ({ defaultColors, customColors, children }) => {
  const { getColor, getStyle, getGradientStyle } = useTemplatePalette(
    defaultColors,
    customColors
  );

  return (
    <div className="min-h-screen" style={getStyle("neutral", 50)}>
      <header className="py-4" style={getStyle("primary", 600)}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">My Template</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: getColor("neutral", 900) }}
          >
            Content Area
          </h2>

          <div className="prose max-w-none">
            <p style={{ color: getColor("neutral", 800) }}>
              This is an example of how to use the template palette hook with
              Tailwind CSS.
            </p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};
```

## API Reference

### `useTemplatePalette(defaultColors, customColors)`

A custom hook that generates and manages template-specific color palettes.

#### Parameters

- `defaultColors` (Object): Default template colors
  - `primaryColor` (string): Default primary color (hex)
  - `secondaryColor` (string): Default secondary color (hex)
  - `tertiaryColor` (string): Default tertiary color (hex)
- `customColors` (Object, optional): User's custom colors
  - `primaryColor` (string): Custom primary color (hex)
  - `secondaryColor` (string): Custom secondary color (hex)
  - `tertiaryColor` (string): Custom tertiary color (hex)

#### Returns

- `colors` (Object): Current base colors
- `palettes` (Object): All palettes with their shades
- `getColor(paletteType, shade)`: Get a specific color from a palette
- `getGradient(paletteType, direction, shades)`: Generate a gradient based on a palette
- `getStyle(paletteType, shade, property)`: Get CSS style object for a specific color
- `getGradientStyle(paletteType, direction, shades)`: Get CSS style object for a gradient
- `updateColors(newColors)`: Update colors programmatically
- `getPrimary(shade)`: Shorthand for `getColor('primary', shade)`
- `getSecondary(shade)`: Shorthand for `getColor('secondary', shade)`
- `getTertiary(shade)`: Shorthand for `getColor('tertiary', shade)`
- `getNeutral(shade)`: Shorthand for `getColor('neutral', shade)`

## Example Components

- `ExampleTemplate.js`: Basic example template using inline styles
- `TailwindExampleTemplate.js`: Example template using Tailwind CSS
- `TemplateUsageExample.js`: Demo of how to use templates with different color schemes

## Implementation Details

The system uses the `colord` library to generate color shades. Each palette includes 11 shades (50-950) for each color:

- **50-400**: Lighter shades
- **500**: Base color
- **600-950**: Darker shades

The neutral palette is a fixed grayscale palette that doesn't change based on user customization.

## Best Practices

1. Define default colors for each template
2. Use the `getColor` and `getStyle` functions for dynamic styling
3. Apply styles inline to avoid global CSS conflicts
4. Use Tailwind for layout and spacing, and inline styles for colors
5. Keep the palette system isolated to template components
