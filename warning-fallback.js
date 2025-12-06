// Fallback warning module for rc-util with all expected exports
const warned = {};

export function warning(valid, message) {
  if (typeof console !== 'undefined' && console.warn && !valid) {
    console.warn(message);
  }
}

export function noteOnce(valid, message) {
  if (typeof console !== 'undefined' && console.warn && !valid) {
    const key = `${message}`;
    if (!warned[key]) {
      console.warn(message);
      warned[key] = true;
    }
  }
}

export function warningOnce(valid, message) {
  return noteOnce(valid, message);
}

export function note(valid, message) {
  return warning(valid, message);
}

export default warning; 