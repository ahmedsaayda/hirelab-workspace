import { useState, useEffect, useMemo } from "react";
import { colord } from "colord";

/**
 * Custom hook for managing template-specific color palettes
 *
 * @param {Object} defaultColors - Default template colors
 * @param {string} defaultColors.primaryColor - Default primary color (hex)
 * @param {string} defaultColors.secondaryColor - Default secondary color (hex)
 * @param {string} defaultColors.tertiaryColor - Default tertiary color (hex)
 * @param {string} defaultColors.heroBackgroundColor - Default hero background color (hex)
 * @param {Object} customColors - User's custom colors (optional)
 * @param {string} customColors.primaryColor - Custom primary color (hex)
 * @param {string} customColors.secondaryColor - Custom secondary color (hex)
 * @param {string} customColors.tertiaryColor - Custom tertiary color (hex)
 * @param {string} customColors.heroBackgroundColor - Custom hero background color (hex)
 * @returns {Object} Generated palette and utility functions
 */
const useTemplatePalette = (
  defaultColors = {
    primaryColor: "#2e9eac",
    secondaryColor: "#e1ce11",
    tertiaryColor: "#44b566",
    heroBackgroundColor: "#2e9eac",
  },
  customColors = null
) => {
  // Use custom colors if provided, otherwise use defaults
  const [colors, setColors] = useState({
    primary: customColors?.primaryColor || defaultColors.primaryColor,
    secondary: customColors?.secondaryColor || defaultColors.secondaryColor,
    tertiary: customColors?.tertiaryColor || defaultColors.tertiaryColor,
    heroBackground: customColors?.heroBackgroundColor || defaultColors.heroBackgroundColor,
  });

  // Update colors if custom colors change
  useEffect(() => {
    if (customColors) {
      setColors({
        primary: customColors.primaryColor || defaultColors.primaryColor,
        secondary: customColors.secondaryColor || defaultColors.secondaryColor,
        tertiary: customColors.tertiaryColor || defaultColors.tertiaryColor,
        heroBackground: customColors.heroBackgroundColor || defaultColors.heroBackgroundColor,
      });
    }
  }, [
    customColors?.primaryColor,
    customColors?.secondaryColor,
    customColors?.tertiaryColor,
    customColors?.heroBackgroundColor,
    defaultColors.primaryColor,
    defaultColors.secondaryColor,
    defaultColors.tertiaryColor,
    defaultColors.heroBackgroundColor,
  ]);

  /**
   * Generate a neutral palette (grayscale)
   * @returns {Object} Neutral palette with shades from 50-950
   */
  const neutralPalette = useMemo(
    () => ({
      50: "#fafafa",
      100: "#efefef",
      200: "#dcdcdc",
      300: "#bdbdbd",
      400: "#989898",
      500: "#7c7c7c",
      600: "#656565",
      700: "#525252",
      800: "#3d3d3d",
      900: "#292929",
      950: "#292929",
    }),
    []
  );

  /**
   * Generate a color palette based on a base color
   *
   * @param {string} baseColor - The base color in hex format
   * @returns {Object} Object with shade values from 50-950
   */
  const generateColorPalette = (baseColor) => {
    const palette = {};

    // Generate lighter shades (50-400)
    palette[50] = colord(baseColor).lighten(0.42).toHex();
    palette[100] = colord(baseColor).lighten(0.36).toHex();
    palette[200] = colord(baseColor).lighten(0.28).toHex();
    palette[300] = colord(baseColor).lighten(0.18).toHex();
    palette[400] = colord(baseColor).lighten(0.08).toHex();

    // Base color becomes 500
    palette[500] = baseColor;

    // Generate darker shades (600-950)
    palette[600] = colord(baseColor).darken(0.08).toHex();
    palette[700] = colord(baseColor).darken(0.16).toHex();
    palette[800] = colord(baseColor).darken(0.24).toHex();
    palette[900] = colord(baseColor).darken(0.32).toHex();
    palette[950] = colord(baseColor).darken(0.4).toHex();

    return palette;
  };

  // Generate palettes based on current colors
  const palettes = useMemo(
    () => ({
      neutral: neutralPalette,
      primary: generateColorPalette(colors.primary),
      secondary: generateColorPalette(colors.secondary),
      tertiary: generateColorPalette(colors.tertiary),
      heroBackground: generateColorPalette(colors.heroBackground),
    }),
    [colors.primary, colors.secondary, colors.tertiary, colors.heroBackground, neutralPalette]
  );

  /**
   * Generate a gradient based on a palette
   *
   * @param {string} paletteType - 'primary', 'secondary', 'tertiary', or 'heroBackground'
   * @param {string} direction - gradient direction (e.g., '45deg', 'to right')
   * @param {Array} shades - array of shade values to use (e.g., [300, 700])
   * @returns {string} CSS gradient value
   */
  const getGradient = (
    paletteType,
    direction = "45deg",
    shades = [300, 700]
  ) => {
    const palette = palettes[paletteType];
    if (!palette) return "";

    const colorStops = shades.map((shade) => palette[shade] || palette[500]);
    return `linear-gradient(${direction}, ${colorStops.join(", ")})`;
  };

  /**
   * Get a specific color from a palette
   *
   * @param {string} paletteType - 'neutral', 'primary', 'secondary', 'tertiary', or 'heroBackground'
   * @param {number} shade - The shade value (50-950)
   * @returns {string} The color value
   */
  const getColor = (paletteType, shade = 500) => {
    const palette = palettes[paletteType];
    return palette ? palette[shade] || palette[500] : "";
  };

  /**
   * Update colors programmatically
   *
   * @param {Object} newColors - New colors to apply
   */
  const updateColors = (newColors) => {
    setColors((prev) => ({
      ...prev,
      ...newColors,
    }));
  };

  /**
   * Get CSS style object for a specific color
   *
   * @param {string} paletteType - 'neutral', 'primary', 'secondary', 'tertiary', or 'heroBackground'
   * @param {number} shade - The shade value (50-950)
   * @param {string} property - CSS property (e.g., 'backgroundColor', 'color', 'borderColor')
   * @returns {Object} CSS style object
   */
  const getStyle = (paletteType, shade = 500, property = "backgroundColor") => {
    return {
      [property]: getColor(paletteType, shade),
    };
  };

  /**
   * Get CSS style object for a gradient
   *
   * @param {string} paletteType - 'primary', 'secondary', 'tertiary', or 'heroBackground'
   * @param {string} direction - gradient direction (e.g., '45deg', 'to right')
   * @param {Array} shades - array of shade values to use (e.g., [300, 700])
   * @returns {Object} CSS style object with background gradient
   */
  const getGradientStyle = (
    paletteType,
    direction = "45deg",
    shades = [300, 700]
  ) => {
    return {
      background: getGradient(paletteType, direction, shades),
    };
  };

  // Return the generated palettes and utility functions
  return {
    // Current colors
    colors,
    // All palettes with their shades
    palettes,
    // Utility functions
    getColor,
    getGradient,
    getStyle,
    getGradientStyle,
    updateColors,
    // Shorthand getters for common colors
    getPrimary: (shade = 500) => getColor("primary", shade),
    getSecondary: (shade = 500) => getColor("secondary", shade),
    getTertiary: (shade = 500) => getColor("tertiary", shade),
    getHeroBackground: (shade = 500) => getColor("heroBackground", shade),
    getNeutral: (shade = 500) => getColor("neutral", shade),
  };
};

export default useTemplatePalette;
