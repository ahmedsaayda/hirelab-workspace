import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const HoverContext = createContext();

export function HoverProvider({ children }) {
  const [hoveredField, setHoveredField] = useState(null);
  const [scrollToSection, setScrollToSection] = useState(null);
  const [lastScrollToSection, setLastScrollToSection] = useState(null);
  const hoverTimeoutRef = useRef(null);
  console.log({
    hoveredField,
    scrollToSection,
    lastScrollToSection,
  });

  useEffect(() => {
    console.log("scrollToSection changed", scrollToSection)
  }, [scrollToSection])

  useEffect(() => {
    console.log("hoveredField changed", hoveredField)
  }, [hoveredField])


  const setHoveredFieldDebounced = (field) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredField(field);
    }, 50);
  };

  const setScrollToSectionWithDebug = (section) => {
    console.log({
      section,
      lastScrollToSection,
    })
    if(lastScrollToSection !== section) {
      setScrollToSection(section)
    }
  }
  

  console.log("lastScrollToSection", lastScrollToSection)

  return (
    <HoverContext.Provider
      value={{
        hoveredField,
        setHoveredField: setHoveredFieldDebounced,
        scrollToSection,
        setScrollToSection: setScrollToSectionWithDebug,
        lastScrollToSection,
        setLastScrollToSection,
      }}
    >
      {children}
    </HoverContext.Provider>
  );
}

export function useHover() {
  const context = useContext(HoverContext);
  if (!context) {
    throw new Error("useHover must be used within a HoverProvider");
  }
  return context;
}
