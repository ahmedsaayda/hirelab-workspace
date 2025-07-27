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

export function resetWarned() {
  // Clear all warnings - for Ant Design compatibility
  Object.keys(warned).forEach(key => {
    delete warned[key];
  });
}

// Additional exports for rc-util compatibility
export function getNodeRef(element) {
  if (element && typeof element === 'object' && element.current) {
    return element.current;
  }
  return element;
}

export function getDOM(element) {
  if (!element) return null;
  if (element.nodeType) return element;
  if (element.current && element.current.nodeType) return element.current;
  return null;
}

export function findDOMNode(component) {
  if (component && component.nodeType) return component;
  if (component && component.current && component.current.nodeType) return component.current;
  return null;
}

export default warning; 