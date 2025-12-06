// Fallback warning module for rc-util with all expected exports (CommonJS)
// IMPORTANT: This file must be CommonJS so it can be required from Node-based SSR
const warned = {};

function warning(valid, message) {
  if (typeof console !== "undefined" && console.warn && !valid) {
    console.warn(message);
  }
}

function noteOnce(valid, message) {
  if (typeof console !== "undefined" && console.warn && !valid) {
    const key = `${message}`;
    if (!warned[key]) {
      console.warn(message);
      warned[key] = true;
    }
  }
}

function warningOnce(valid, message) {
  return noteOnce(valid, message);
}

function note(valid, message) {
  return warning(valid, message);
}

module.exports = {
  default: warning,
  warning,
  noteOnce,
  warningOnce,
  note,
};