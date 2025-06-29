/**
 * Converts a hex color to HSL color space
 */
function hexToHSL(hex) {
    hex = hex.replace("#", "")
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("")
    }
    const r = Number.parseInt(hex.substr(0, 2), 16) / 255
    const g = Number.parseInt(hex.substr(2, 2), 16) / 255
    const b = Number.parseInt(hex.substr(4, 2), 16) / 255
  
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2
  
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h *= 60
    }
  
    return { h, s: s * 100, l: l * 100 }
  }
  
  /**
   * Converts HSL values to a hex color
   */
  function HSLToHex(h, s, l) {
    h = h % 360
    s /= 100
    l /= 100
  
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2
  
    let r = 0,
      g = 0,
      b = 0
  
    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }
  
    const rHex = Math.round((r + m) * 255)
      .toString(16)
      .padStart(2, "0")
    const gHex = Math.round((g + m) * 255)
      .toString(16)
      .padStart(2, "0")
    const bHex = Math.round((b + m) * 255)
      .toString(16)
      .padStart(2, "0")
  
    return `#${rHex}${gHex}${bHex}`
  }
  
  /**
   * Clamps a value between min and max
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }
  
 
  
  /**
   * Generates a balanced color palette from a primary color
   * Ensures colors have appropriate brightness and contrast regardless of primary color
   */
  export function generateColorPalette(primaryHex) {
    try {
      // Convert primary to HSL
      const { h, s, l } = hexToHSL(primaryHex)
  
      // Store original primary color
      const primary = primaryHex
  
      // Determine if primary is dark or light
      const isDarkPrimary = l < 50
  
      // Calculate secondary color (complementary with adjusted lightness)
      // Use 180° hue shift for complementary color
      const secondaryHue = (h + 180) % 360
      // Ensure secondary has good contrast with primary by adjusting lightness
      const secondaryLightness = isDarkPrimary
        ? clamp(l + 30, 55, 75) // If primary is dark, make secondary lighter
        : clamp(l - 30, 25, 45) // If primary is light, make secondary darker
  
      const secondary = HSLToHex(secondaryHue, s, secondaryLightness)
  
      // Calculate tertiary color (triadic with adjusted lightness)
      // Use 120° hue shift for triadic harmony
      const tertiaryHue = (h + 120) % 360
      // Ensure tertiary has good contrast and is distinct from secondary
      const tertiaryLightness = isDarkPrimary
        ? clamp(l + 40, 60, 80) // If primary is dark, make tertiary lighter
        : clamp(l - 20, 30, 50) // If primary is light, make tertiary darker
  
      const tertiary = HSLToHex(tertiaryHue, s, tertiaryLightness)
  
      // Calculate hero background (darker, more saturated version of primary)
      // For very dark primaries, slightly lighten the hero background
      const heroBackgroundLightness =
        l < 15
          ? clamp(l + 10, 15, 25) // Prevent completely black backgrounds
          : clamp(l - 15, 10, 30) // Otherwise, make it darker than primary
  
      const heroBackgroundSaturation = clamp(s + 10, 0, 100) // Slightly more saturated
      const heroBackground = HSLToHex(h, heroBackgroundSaturation, heroBackgroundLightness)
  
      // Calculate hero title color (high contrast with hero background)
      // Always ensure good contrast with the hero background
      const heroTitleLightness =
        heroBackgroundLightness < 50
          ? 95 // Light text for dark backgrounds
          : 15 // Dark text for light backgrounds
  
      // Reduce saturation for text to improve readability
      const heroTitleSaturation = 10 // Low saturation for text
      const heroTitleColor = HSLToHex(h, heroTitleSaturation, heroTitleLightness)
  
      return {
        primary,
        secondary,
        tertiary,
        heroBackground,
        heroTitleColor,
      }
    } catch (error) {
      console.error("Error generating color palette:", error)
      // Fallback palette
      return {
        primary: "#3B82F6",
        secondary: "#F59E0B",
        tertiary: "#10B981",
        heroBackground: "#1E3A8A",
        heroTitleColor: "#FFFFFF",
      }
    }
  }
  