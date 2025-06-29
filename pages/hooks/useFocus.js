import { useRef, useCallback } from "react";

const useFocus = () => {
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
    if (focusRefs.current[key]) {
      focusRefs.current[key].focus();
    }
  }, []);

  return { setFocusRef, focusInput };
};

export default useFocus;
