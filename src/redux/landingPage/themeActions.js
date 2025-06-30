// src\redux\landingPage\themeActions.js
import { SET_BASE_COLORS, SET_TEXT_COLORS } from './themeTypes';

// Expects an object like: { primary: '#xxxxxx', secondary: '#xxxxxx', tertiary: '#xxxxxx' }
export const setBaseColors = (baseColors) => ({
  type: SET_BASE_COLORS,
  payload: baseColors,
});
// Expects an object like: { heading : "#xxxxx", subHeading: "#xxxxxx"}
export const setTextColors = (textColors) => ({
  type: SET_TEXT_COLORS,
  payload: textColors,
});
