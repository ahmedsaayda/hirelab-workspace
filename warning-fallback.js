// Fallback warning module for rc-util with all expected exports.
// This file MUST be CommonJS (no ES `export`) so it can be loaded
// by both Node and the Next.js Rust compiler without syntax errors.

const warned = {};

function warning(valid, message) {
  if (typeof console !== "undefined" && console.warn && !valid) {
    console.warn(message);
  }
}

function noteOnce(valid, message) {
  if (typeof console !== "undefined" && console.warn && !valid) {
    const key = String(message);
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

// CommonJS exports compatible with `require` and `import`.
module.exports = warning;
module.exports.default = warning;
module.exports.warning = warning;
module.exports.noteOnce = noteOnce;
module.exports.warningOnce = warningOnce;
module.exports.note = note;