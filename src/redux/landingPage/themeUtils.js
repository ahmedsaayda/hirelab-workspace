// src\redux\landingPage\themeUtils.js
import { lighten, darken } from 'polished';

// Generate 4 light variants and 5 dark variants for a given color.
export const generateVariants = (color) => {
  const lightVariants = [];
  const darkVariants = [];

  // Generate lighter variants (using increments of 0.1)
  for (let i = 1; i <= 4; i++) {
    lightVariants.push(lighten(0.1 * i, color));
  }
  
  // Generate darker variants (using increments of 0.1)
  for (let i = 1; i <= 5; i++) {
    darkVariants.push(darken(0.1 * i, color));
  }
  
  return { light: lightVariants, dark: darkVariants };
};

// Generate a simple linear gradient based on the given color.
export const generateGradient = (color) => {
  const { light, dark } = generateVariants(color);
  // Use the first light and dark variants for the gradient
  return `linear-gradient(45deg, ${light[0]}, ${dark[0]})`;
};
