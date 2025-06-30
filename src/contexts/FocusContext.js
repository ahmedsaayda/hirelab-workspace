import React, { createContext, useContext, useRef, useCallback } from "react";
import eventEmitter from "../utils/eventEmitter";

const FocusContext = createContext();

export const FocusProvider = ({ children }) => {
  const focusRefs = useRef({});

  const setFocusRef = useCallback(
    (key) => (element) => {
      if (element) {
        focusRefs.current[key] = element;
      }
    },
    []
  );

  const focusInput = useCallback((key) => {
    console.log(
      "Attempting to focus on:",
      key,
      "Available refs:",
      Object.keys(focusRefs.current)
    );

    // Emit an event so other components can respond (like opening collapses)
    eventEmitter.emit("focusField", { key });

    // Check for array fields (for specificationsRefs)
    const arrayMatch = key.match(/^([^[]+)\[(\d+)\]\.(.*)$/);
    if (arrayMatch) {
      const [, arrayKey, index, fieldKey] = arrayMatch;
      console.log("Found array field:", arrayKey, index, fieldKey);

      // Emit event to notify that we need to open this specific collapse panel
      eventEmitter.emit("openCollapsePanel", { arrayKey, index });

      // Delay focus to allow collapse to open
      setTimeout(() => {
        if (focusRefs.current[key]) {
          console.log("Focusing on:", key);
          focusRefs.current[key].focus();
        } else {
          console.log("No ref found for:", key, "after panel opened");
        }
      }, 300); // Delay to ensure collapse opens
    } else if (focusRefs.current[key]) {
      // Regular field, just focus it
      console.log("Focusing on regular field:", key);
      focusRefs.current[key].focus();
    } else {
      console.log("No ref found for:", key);
    }
  }, []);

  const handleItemClick = (key) => {
    console.log("key", key);
    // First emit event to open panel
    eventEmitter.emit("focusField", { key });
    // Then focus with slight delay to allow panel to open
    setTimeout(() => {
      focusInput(key);
    }, 50);
  };

  return (
    <FocusContext.Provider value={{ setFocusRef, handleItemClick }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusContext = () => {
  return useContext(FocusContext);
};
