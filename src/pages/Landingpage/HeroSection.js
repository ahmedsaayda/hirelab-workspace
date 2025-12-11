import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { currencies } from "../../data/currencies.js";
import { Button, Heading, Img, Text } from "../../dhwise-components/index.jsx";
import { useHover } from "../../contexts/HoverContext.js";
import { scrollToElement } from "./scrollUtils.js";
import { Share2, ArrowRight, X } from "lucide-react";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { useRouter } from "next/router";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { FiBriefcase } from "react-icons/fi";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import cn from "classnames";
import { getTranslation, getTimeUnitTranslation, getSalaryTimeTranslation } from "../../utils/translations";
import Image from "next/image.js";
// hirelab-frontend\src\pages\Landingpage\HeroSection.js
// hirelab-frontend\src\utils\destructureTheme.js
//
export function intToHumanReadablePrice(price) {
  if (typeof Number(price) !== "number" || isNaN(price)) {
    return "Invalid input";
  }

  const absPrice = Math.abs(price);

  if (absPrice >= 1e9) {
    return (price / 1e9).toFixed(1) + "B";
  } else if (absPrice >= 1e6) {
    return (price / 1e6).toFixed(1) + "M";
  } else if (absPrice >= 1e3) {
    return (price / 1e3).toFixed(1) + "K";
  } else {
    return price.toString();
  }
}
//
// Common hook for hover functionality
const useHeroHover = () => {
  const { hoveredField, scrollToSection } = useHover();
  const sectionRef = useRef();
  // Main fields
  const weAreHiringRef = useRef();
  const vacancyTitleRef = useRef();
  const heroDescriptionRef = useRef();
  const locationRef = useRef();
  const hoursMinRef = useRef();
  const cta1TitleRef = useRef();
  const cta2TitleRef = useRef();
  // Additional fields from renderMore
  const salaryMinRef = useRef();
  const salaryMaxRef = useRef();
  const salaryTimeRef = useRef();
  const salaryCurrencyRef = useRef();
  const salaryRangeRef = useRef();
  const salaryTextRef = useRef();
  const hoursMaxRef = useRef();
  const hoursUnitRef = useRef();
  const hoursRangeRef = useRef();
  const cta1LinkRef = useRef();
  const cta2LinkRef = useRef();
  // Image position fields
  const heroImageRef = useRef();
  const heroImagePositionXRef = useRef();
  const heroImagePositionYRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      // Main fields
      weAreHiring: weAreHiringRef,
      vacancyTitle: vacancyTitleRef,
      heroDescription: heroDescriptionRef,
      location: locationRef,
      hoursMin: hoursMinRef,
      cta1Title: cta1TitleRef,
      cta2Title: cta2TitleRef,
      // Additional fields from renderMore
      salaryMin: salaryMinRef,
      salaryMax: salaryMaxRef,
      salaryTime: salaryTimeRef,
      salaryCurrency: salaryCurrencyRef,
      salaryRange: salaryRangeRef,
      salaryText: salaryTextRef,
      hoursMax: hoursMaxRef,
      hoursUnit: hoursUnitRef,
      hoursRange: hoursRangeRef,
      cta1Link: cta1LinkRef,
      cta2Link: cta2LinkRef,
      // Image position fields
      heroImage: heroImageRef,
      heroImagePositionX: heroImagePositionXRef,
      heroImagePositionY: heroImagePositionYRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Apply highlight to target element
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
    // targetRef.scrollIntoView({
    //   behavior: "smooth",
    //   block: "center",
    // });
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection &&
      scrollToSection === "hero-section" &&
      sectionRef.current
    ) {
      scrollToElement(sectionRef.current);
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    // Main fields
    weAreHiringRef,
    vacancyTitleRef,
    heroDescriptionRef,
    locationRef,
    hoursMinRef,
    cta1TitleRef,
    cta2TitleRef,
    // Additional fields from renderMore
    salaryMinRef,
    salaryMaxRef,
    salaryTimeRef,
    salaryCurrencyRef,
    salaryRangeRef,
    salaryTextRef,
    hoursMaxRef,
    hoursUnitRef,
    hoursRangeRef,
    cta1LinkRef,
    cta2LinkRef,
    // Image position fields
    heroImageRef,
    heroImagePositionXRef,
    heroImagePositionYRef,
  };
};

// Add this custom hook after getFonts.js import
const useResponsiveFontSize = (
  text,
  containerRef,
  maxLines = 2,
  initialSize = 80
) => {
  const [fontSize, setFontSize] = useState(initialSize);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !text || typeof window === "undefined") return;
    
    const adjustFontSize = () => {
      // Cross-browser window width detection
      const screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      // In the editor preview we expose the device via window.__previewDevice.
      // Respect that first so switching between Desktop/Mobile preview
      // recalculates sizes correctly, without changing live page behaviour.
      const previewDevice = window.__previewDevice;
      const isMobile = previewDevice === "mobile" || screenWidth < 768;
      const textLength = text.length;
      
      // Check if text is a single word (no spaces)
      const isSingleWord = !text.trim().includes(' ');
      
      // Much more aggressive sizing - start way smaller
      let currentSize;
      
      if (isMobile) {
        // Mobile: very conservative starting sizes
        if (textLength <= 15) {
          currentSize = 32;
        } else if (textLength <= 25) {
          currentSize = 28;
        } else if (textLength <= 35) {
          currentSize = 24;
        } else if (textLength <= 45) {
          currentSize = 22;
        } else {
          currentSize = 20;
        }
      } else {
        // Desktop: conservative starting sizes
        if (textLength <= 15) {
          currentSize = 56;
        } else if (textLength <= 25) {
          currentSize = 48;
        } else if (textLength <= 35) {
          currentSize = 42;
        } else if (textLength <= 45) {
          currentSize = 38;
        } else if (textLength <= 55) {
          currentSize = 34;
        } else {
          currentSize = 30;
        }
      }
      
      // Ensure no single word ever breaks: measure the longest word
      // and shrink the font until that word fits within the container.
      {
        const containerWidth = container.offsetWidth - 20; // Account for padding
        let testSize = currentSize;

        // Pick the longest "word" (split on whitespace). If text is a single word, this is the text itself.
        const longestWord =
          (text || "")
            .split(/\s+/)
            .filter(Boolean)
            .sort((a, b) => b.length - a.length)[0] || text;

        // Create temporary element to measure word width
        const tempElement = document.createElement('span');
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        tempElement.style.fontFamily = container.style.fontFamily || 'inherit';
        tempElement.textContent = longestWord;
        document.body.appendChild(tempElement);

        // Decrease font size until the longest word fits in one line
        while (testSize > 12) { // Minimum font size
          tempElement.style.fontSize = `${testSize}px`;
          const wordWidth = tempElement.offsetWidth;
          if (wordWidth <= containerWidth) break;
          testSize -= 1;
        }

        document.body.removeChild(tempElement);
        currentSize = testSize;
      }
      
      // Apply the size directly - no complex calculations with cross-browser support
      container.style.fontSize = `${currentSize}px`;
      container.style.lineHeight = '1.1';
      
      // Different word breaking behavior for single words vs multiple words
      if (isSingleWord) {
        // For single words: prevent breaking at all costs
        container.style.wordBreak = 'keep-all';
        container.style.overflowWrap = 'normal';
        container.style.wordWrap = 'normal';
        container.style.whiteSpace = 'nowrap';
      } else {
        // For multiple words: wrap only at whitespace, never inside a word
        container.style.wordBreak = 'keep-all';
        container.style.overflowWrap = 'normal';
        container.style.wordWrap = 'normal'; // IE fallback
        container.style.whiteSpace = 'normal';
      }
      
      // Cross-browser hyphenation control
      container.style.hyphens = 'none';
      container.style.webkitHyphens = 'none';
      container.style.msHyphens = 'none';
      container.style.mozHyphens = 'none';
      
      setFontSize(currentSize);
    };

    // Immediate execution
    adjustFontSize();
    
    // Cross-browser resize handler with debouncing
    let resizeTimeout;
    const handleResize = () => {
      // Debounce to prevent excessive calls
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        adjustFontSize();
      }, 100);
    };
    
    // Cross-browser event listener setup
    if (window.addEventListener) {
      window.addEventListener("resize", handleResize, false);
      // Fired by PreviewContainer when switching between Desktop/Mobile preview
      window.addEventListener("deviceChange", handleResize, false);
    } else if (window.attachEvent) {
      // IE8 and older
      window.attachEvent("onresize", handleResize);
    }
    
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Cross-browser event listener cleanup
      if (window.removeEventListener) {
        window.removeEventListener("resize", handleResize, false);
        window.removeEventListener("deviceChange", handleResize, false);
      } else if (window.detachEvent) {
        // IE8 and older
        window.detachEvent("onresize", handleResize);
      }
    };
  }, [text, containerRef, maxLines, initialSize]);

  return fontSize;
};

const Template1 = ({ landingPageData, fetchData }) => {
  const menuItemsArray = landingPageData?.menuItems.map((item) => item.key);

  // Apply custom fonts from landingPageData

  const { handleItemClick } = useFocusContext();

  const router = useRouter();
  const currentPath = router.pathname?.split("/")[1];
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (Array.isArray(landingPageData?.location)) {
      // Prioritize showing Hybrid over Remote, then other locations
      if (landingPageData.location.includes("Hybrid")) {
        return "Hybrid";
      } else if (landingPageData.location.includes("Remote")) {
        return "Remote";
      } else {
        return landingPageData.location[0];
      }
    }
    return landingPageData?.location;
  });
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.slice(1) || "job-specifications"
  );

  const refs = useHeroHover();
  const navRef = useRef(null);
  const navRef2 = useRef(null);

  // Update selectedLocation when landingPageData.location changes
  useEffect(() => {
    if (Array.isArray(landingPageData?.location)) {
      // Prioritize showing Hybrid over Remote, then other locations
      if (landingPageData.location.includes("Hybrid")) {
        setSelectedLocation("Hybrid");
      } else if (landingPageData.location.includes("Remote")) {
        setSelectedLocation("Remote");
      } else if (landingPageData.location.length > 0) {
        setSelectedLocation(landingPageData.location[0]);
      } else {
        setSelectedLocation("");
      }
    } else if (landingPageData?.location) {
      setSelectedLocation(landingPageData.location);
    } else {
      setSelectedLocation("");
    }
  }, [landingPageData?.location]);
  const location = Array.isArray(landingPageData?.location)
    ? landingPageData?.location.join(" ")
    : landingPageData?.location || "";

  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#2e9eac";
  const secondaryColor = landingPageData?.secondaryColor || "#e1ce11";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#2e9eac",
      secondaryColor: "#e1ce11",
      tertiaryColor: "#44b566",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Background color for the hero section (dark teal)

  useEffect(() => {
    if (!navRef.current) return;

    const navElement = navRef.current;
    const navPosition = navElement.getBoundingClientRect().top + window.scrollY;

    const handleScroll = () => {
      if (window.scrollY >= navPosition - 44) {
        setIsNavFixed(true);
        // dispatch event
        window.dispatchEvent(new Event("navFixed-template3"));
      } else {
        setIsNavFixed(false);
        // dispatch event
        window.dispatchEvent(new Event("navUnfixed-template3"));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentHash(hash || "job-specifications");
    };

    // Set initial hash
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleNavigate = (id) => {
    //job-specifications , //job-specifications
    window.location.href = `#${id}`;
    // find the element with the id and scroll to it
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  const titleContainerRef = useRef(null);
  const titleFontSize = useResponsiveFontSize(
    landingPageData?.vacancyTitle,
    titleContainerRef,
    2,
    80
  );


  const textColor = calculateTextColor(getColor("primary", 500), landingPageData?.yiqThreshold);

  const getBackgroundColor = (primaryColor) => {
    const brightness = getColorBrightness(primaryColor);
    return brightness > 128
      ? getColor("primary", 900)
      : getColor("primary", 500);
  };

  const getColorBrightness = (color) => {
    const rgb = color.match(/^#(\w{6})$/)?.[1];
    if(!rgb) return 0;
    const r = parseInt(rgb.slice(0, 2), 16);
    const g = parseInt(rgb.slice(2, 4), 16);
    const b = parseInt(rgb.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const navigationTextColor = calculateTextColor(
    getBackgroundColor(landingPageData?.primaryColor),
    landingPageData?.yiqThreshold
  );

  // Stabilize GridPattern props to prevent flickering
  const gridPatternProps = useMemo(() => {
    // Get stable color values by directly using the color values instead of getColor function
    const primaryColor500 = landingPageData?.primaryColor || "#2e9eac";
    const tertiaryColor300 = landingPageData?.tertiaryColor || "#44b566";
    const tertiaryColor50 = `${tertiaryColor300}20`; // Add light transparency
    
    return {
      gridColor: `${tertiaryColor300}80`, // Semi-transparent tertiary color
      gridLineColor: tertiaryColor50,
      backgroundColor: primaryColor500,
      gridSize: 40,
      maxWidth: 1000,
      // Use a stable key based on the actual color values to prevent unnecessary re-renders
      key: `hero-${primaryColor500}-${tertiaryColor300}`
    };
  }, [landingPageData?.primaryColor, landingPageData?.tertiaryColor]);

  // Create a memoized GridPattern component to prevent re-renders
  const MemoizedGridPattern = useMemo(() => (
    <GridPattern
      key={gridPatternProps.key}
      gridColor={gridPatternProps.gridColor}
      gridLineColor={gridPatternProps.gridLineColor}
      backgroundColor={gridPatternProps.backgroundColor}
      gridSize={gridPatternProps.gridSize}
      maxWidth={gridPatternProps.maxWidth}
    />
  ), [gridPatternProps]);

  return (
    <div 
    className="bg-white px-4 w-full min-h-[380px] lg:min-h-[600px] "
    >
      <div
        ref={refs.sectionRef}
        className="relative mx-auto w-full rounded-lg hero-section"
        style={{
          color: textColor,
          fontFamily: bodyFont?.family,
        }}
      >
        {MemoizedGridPattern}
        {/* Blur effect at the top center of the hero section like a lamp is glowing through the top */}
        <div className="absolute top-0 left-0 w-1/2 translate-x-1/2  bg-gradient-to-r from-white  to-white opacity-10 blur-[50px] rounded-full" />
        <div className="mx-auto rounded-b-xl">
          <div className="overflow-hidden relative px-6 pt-10 rounded-lg md:px-8 md:pt-10">
            {" "}
            {/* <SimpleGridBackground /> */}
            <div className="flex flex-col items-center mx-auto mt-10 max-w-2xl text-center md:mt-0">
              <span
                ref={refs.weAreHiringRef}
                onClick={() => handleItemClick("weAreHiring")}
                style={{
                  fontFamily: bodyFont?.family,
                }}
                className="mb-4 text-xs md:text-sm"
              >
               👋 {" "}{" "}{landingPageData?.weAreHiring || getTranslation(landingPageData?.lang, 'weAreHiring')}
              </span>

              <h2
                className="mb-8 w-full max-w-full font-semibold text-center"
                ref={(el) => {
                  refs.vacancyTitleRef.current = el;
                  titleContainerRef.current = el;
                }}
                onClick={() => handleItemClick("vacancyTitle")}
                key={`${getColor("secondary", 500)}-${getColor(
                  "primary",
                  500
                )}`}
                style={{
                  fontFamily: titleFont?.family,
                  fontSize: `${titleFontSize}px`,
                  lineHeight: 1.1,
                  textAlign: "center",
                  width: "100%",
                  padding: "0 10px",
                  display: "block",
                  boxSizing: "border-box",
                  maxWidth: "100%",
                  // Note: Word breaking and wrapping styles are handled dynamically in useResponsiveFontSize
                }}
                lang="en"
              >
                {landingPageData?.vacancyTitle}
              </h2>

              {/*  */}
              <div
                ref={refs.heroDescriptionRef}
                className="mb-6 max-w-2xl md:mb-12"
                onClick={() => handleItemClick("heroDescription")}
              >
                <p
                  style={{
                    fontFamily: subheaderFont?.family,
                    color: textColor
                  }}
                  className="text-sm leading-relaxed md:text-base text-white/80"
                  dangerouslySetInnerHTML={{
                    __html: (landingPageData?.heroDescription ||
                      "Provide a compelling description of the job and the company. This will be displayed in the hero section of the landing page.")?.replace?.(/\n/g, "<br>")
                  }}
                >
                </p>
              </div>
            </div>
            {/* Job Title and Job Description */}
            {/* Mobile Badges - Visible only on small screens */}
            <div className="flex flex-wrap gap-2 justify-center mb-6 lg:hidden">
              {(landingPageData?.salaryAvailable === false || landingPageData?.salaryMin) && (
                <div
                  className="flex gap-2 items-center p-2 rounded-xl border shadow-lg border-white/10 lg:min-h-[75px]"
                  style={{
                    background:
                      "linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                    "backdrop-filter": "blur(34px)",
                  }}
                >
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: getColor("secondary", 500), color: textColor }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.75 3.75C9.75 4.57843 7.90317 5.25 5.625 5.25C3.34683 5.25 1.5 4.57843 1.5 3.75M9.75 3.75C9.75 2.92157 7.90317 2.25 5.625 2.25C3.34683 2.25 1.5 2.92157 1.5 3.75M9.75 3.75V4.875M1.5 3.75V12.75C1.5 13.5784 3.34683 14.25 5.625 14.25M5.625 8.25C5.49859 8.25 5.37351 8.24793 5.25 8.24388C3.14756 8.17499 1.5 7.53246 1.5 6.75M5.625 11.25C3.34683 11.25 1.5 10.5784 1.5 9.75M16.5 8.625C16.5 9.45343 14.6532 10.125 12.375 10.125C10.0968 10.125 8.25 9.45343 8.25 8.625M16.5 8.625C16.5 7.79657 14.6532 7.125 12.375 7.125C10.0968 7.125 8.25 7.79657 8.25 8.625M16.5 8.625V14.25C16.5 15.0784 14.6532 15.75 12.375 15.75C10.0968 15.75 8.25 15.0784 8.25 14.25V8.625M16.5 11.4375C16.5 12.2659 14.6532 12.9375 12.375 12.9375C10.0968 12.9375 8.25 12.2659 8.25 11.4375"
                        stroke="#FAFAFA"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    {landingPageData?.salaryAvailable === false ? (
                      <p
                        ref={refs.salaryTextRef}
                        onClick={() => handleItemClick("salaryText")}
                        className="text-xs font-light"
                        style={{ color: textColor }}
                      >
                        {landingPageData?.salaryText || getTranslation(landingPageData?.lang, 'competitiveSalary') || 'Competitive Salary'}
                      </p>
                    ) : (
                      <p className="text-xs font-light"
                        style={{
                          color: textColor
                        }}
                      >
                        {landingPageData?.salaryMin &&
                          intToHumanReadablePrice(
                            landingPageData?.salaryMin
                          )}{" "}
                        {landingPageData?.salaryRange &&
                          landingPageData?.salaryMax &&
                          "-"}{" "}
                        {landingPageData?.salaryRange &&
                          landingPageData?.salaryMax &&
                          intToHumanReadablePrice(landingPageData?.salaryMax)}
                        {landingPageData?.salaryCurrency &&
                          ` ${landingPageData?.salaryCurrency}`}
                        /{getSalaryTimeTranslation(landingPageData?.lang, landingPageData?.salaryTime)?.toLowerCase?.() || getSalaryTimeTranslation(landingPageData?.lang, "Year")?.toLowerCase?.()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div
                className="flex gap-2 items-center p-2 rounded-xl border shadow-lg border-white/10 lg:min-h-[75px]"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                  "backdrop-filter": "blur(34px)",
                  color: textColor
                }}
              >
                <div
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: getColor("secondary", 500) , color: textColor}}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span
                  ref={refs.hoursRangeRef}
                  className="text-xs font-medium text-white md:text-sm"
                  style={{
                    color: textColor
                  }}
                >
                  {landingPageData?.hoursRange ? (
                    <>
                      <span
                        ref={refs.hoursMinRef}
                        onClick={() => handleItemClick("hoursMin")}
                      >
                        {landingPageData?.hoursMin || "7"}
                      </span>
                      <span style={{ color: textColor }} >
                         -
                      </span>
                        
                      <span
                        ref={refs.hoursMaxRef}
                        onClick={() => handleItemClick("hoursMax")}
                      >
                        {landingPageData?.hoursMax || "10"}
                      </span>
                    </>
                  ) : (
                    <span
                      ref={refs.hoursMinRef}
                      onClick={() => handleItemClick("hoursMin")}
                      style={{
                        color: textColor
                      }}
                    >
                      {landingPageData?.hoursMin || "7"}
                    </span>
                  )}
                  <span
                  style={{
                    color:textColor
                  }}
                  > {getTranslation(landingPageData?.lang, 'hour')} / </span>
                  <span
                    ref={refs.hoursUnitRef}
                    onClick={() => handleItemClick("hoursUnit")}
                    style={{
                      color: textColor
                    }}
                  >
                    {getTimeUnitTranslation(landingPageData?.lang, landingPageData?.hoursUnit)}
                  </span>
                </span>
              </div>
            </div>
            {/* Mobile Location Badge - Visible only on small screens */}
            <div className="flex justify-center mx-auto mb-6 lg:hidden">
              <div
                className="flex gap-3 items-center p-3 rounded-xl border shadow-lg border-white/10 lg:min-h-[75px] relative z-[500]"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)",
                  backdropFilter: "blur(34px)",
                  position: "relative",
                }}
              >
                <div
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: getColor("secondary", 500) , color: textColor}}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 10.0308C14.6489 10.5516 16.5 11.741 16.5 13.125C16.5 14.989 13.1421 16.5 9 16.5C4.85786 16.5 1.5 14.989 1.5 13.125C1.5 11.741 3.35114 10.5516 6 10.0308M9 12.75V6.75M9 6.75C10.2426 6.75 11.25 5.74264 11.25 4.5C11.25 3.25736 10.2426 2.25 9 2.25C7.75736 2.25 6.75 3.25736 6.75 4.5C6.75 5.74264 7.75736 6.75 9 6.75Z"
                      stroke="#FAFAFA"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div
                  ref={refs.locationRef}
                  className="flex gap-1 items-center cursor-pointer relative z-[550]"
                  onClick={() => {
                    if (
                      Array.isArray(landingPageData?.location) &&
                      landingPageData?.location.length > 1
                    ) {
                      setShowLocationDropdown(!showLocationDropdown);
                    }
                    handleItemClick("location");
                  }}
                >
                  <span className="text-xs font-medium md:text-sm"
                  style={{
                    color: textColor,
                  }}
                  >
                    {selectedLocation}
                  </span>
                  {Array.isArray(landingPageData?.location) &&
                    landingPageData?.location.length > 1 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${
                          showLocationDropdown ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                </div>

                {/* Location Dropdown */}
                {showLocationDropdown &&
                  Array.isArray(landingPageData?.location) && (
                    <div
                      className="overflow-x-hidden scrollbar-hide absolute left-0 top-full z-[2000] mt-2 w-full min-w-[200px] bg-white rounded-lg shadow-lg"
                      style={{
                        // background:"linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                        background: getColor("primary", 500),
                        backdropFilter: "blur(34px)",
                        position: "absolute",
                        maxHeight: "220px",
                        overflowY: "scroll",
                        color: calculateTextColor(
                          getColor("primary", 500),
                          landingPageData?.yiqThreshold
                        ),
                        scrollbarWidth: "none", /* Firefox */
                        msOverflowStyle: "none", /* Internet Explorer 10+ */
                      }}
                    >
                      <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
                        <span className="text-xs font-medium">{getTranslation(landingPageData?.lang, 'locations')}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLocationDropdown(false);
                          }}
                          className="p-1 rounded-full transition-colors hover:bg-white/10"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                      {landingPageData?.location
                        .filter((loc) => loc !== selectedLocation)
                        .map((loc, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 text-xs font-medium cursor-pointer md:text-sm hover:bg-white/10"
                            onClick={() => {
                              setSelectedLocation(loc);
                              setShowLocationDropdown(false);
                            }}
                            style={{
                              color: calculateTextColor(
                                getColor("primary", 500),
                                landingPageData?.yiqThreshold
                              ),
                            }}
                          >
                            {loc}
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            </div>
            {/* Main Content with Image and Info */}
            <div className=" mt-10 -mb-[10px] xl:mb-[-8px] max-w-[1300px] mx-auto ">
              {/* Image Container */}
              <div className="relative mx-auto max-w-3xl shadow-xl">
               <div className="relative">
                <Image
                  src={
                    landingPageData?.heroImage ||
                    "/dhwise-images/placeholder.png"
                  }
                  alt="Project Manager candidate"
                  className="object-cover  aspect-[200/140] w-full lg:w-[50vw] xl:w-[75vw] xl:mb-0 max-h-[450px] smx:max-h-[300px] rounded-t-[64px] max-w-[684px] mx-auto"
                  style={{
                    border: "10px solid transparent" /*2*/,

                    background: `linear-gradient(90deg, ${getColor(
                      "primary",
                      800
                    )}, ${getColor("primary", 950)}) border-box` /*3*/,
                    mask: `
                        "linear-gradient(#000 0 0) padding-box", 
                        "linear-gradient(#000 0 0)",
                      "mask-composite": "exclude",`,
                       objectPosition: landingPageData?.imageAdjustment
                        ?.heroImage?.objectPosition
                        ? `${landingPageData.imageAdjustment.heroImage.objectPosition.x}% ${landingPageData.imageAdjustment.heroImage.objectPosition.y}%`
                        : "50% 50%",
                      objectFit:
                        landingPageData?.imageAdjustment?.heroImage
                          ?.objectFit || "cover",
                      transition: "object-position 0.3s ease-in-out",
                  }}    
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 33vw"	
                  loading="eager"
                  fetchPriority="high"
                />

                </div>

                {/* Info Badges - Only visible on medium screens and up */}

                <div className="hidden absolute -left-[5%] lg:-left-[12%] xl:-left-[32%] top-0 w-1 h-full  lg:block ">
                  {/* Salary */}
                  <div className=" absolute -left-0 top-[15%]"
                  style={{transform: "translateX(-50px)"}}
                  >
                    <div
                      className="flex gap-3 items-center p-3 rounded-xl border shadow-lg border-white/10 lg:min-h-[75px] relative z-[500]"
                      style={{
                        // background:
                        //   "linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                        // "backdrop-filter": "blur(34px)",
                        fontWeight: "600",
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: getColor("secondary", 500) }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.75 3.75C9.75 4.57843 7.90317 5.25 5.625 5.25C3.34683 5.25 1.5 4.57843 1.5 3.75M9.75 3.75C9.75 2.92157 7.90317 2.25 5.625 2.25C3.34683 2.25 1.5 2.92157 1.5 3.75M9.75 3.75V4.875M1.5 3.75V12.75C1.5 13.5784 3.34683 14.25 5.625 14.25M5.625 8.25C5.49859 8.25 5.37351 8.24793 5.25 8.24388C3.14756 8.17499 1.5 7.53246 1.5 6.75M5.625 11.25C3.34683 11.25 1.5 10.5784 1.5 9.75M16.5 8.625C16.5 9.45343 14.6532 10.125 12.375 10.125C10.0968 10.125 8.25 9.45343 8.25 8.625M16.5 8.625C16.5 7.79657 14.6532 7.125 12.375 7.125C10.0968 7.125 8.25 7.79657 8.25 8.625M16.5 8.625V14.25C16.5 15.0784 14.6532 15.75 12.375 15.75C10.0968 15.75 8.25 15.0784 8.25 14.25V8.625M16.5 11.4375C16.5 12.2659 14.6532 12.9375 12.375 12.9375C10.0968 12.9375 8.25 12.2659 8.25 11.4375"
                            stroke="#FAFAFA"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      {landingPageData?.salaryAvailable === false ? (
                        <span
                          ref={refs.salaryTextRef}
                          className="font-medium whitespace-nowrap"
                          onClick={() => handleItemClick("salaryText")}
                          style={{ color: textColor }}
                        >
                          {landingPageData?.salaryText || getTranslation(landingPageData?.lang, 'competitiveSalary') || 'Competitive Salary'}
                        </span>
                      ) : (
                        <span
                          ref={refs.salaryRangeRef}
                          className="font-medium whitespace-nowrap"
                          onClick={() => handleItemClick("salaryMin")}
                          style={{
                            color:textColor
                          }}
                        >
                          {landingPageData?.salaryRange ? (
                            <>
                              <span ref={refs.salaryMinRef}>
                                {landingPageData?.salaryCurrency ?? "$"}{" "}
                                {landingPageData?.salaryMin || ""}
                              </span>
                              <span> - </span>
                              <span ref={refs.salaryMaxRef}>
                                {landingPageData?.salaryCurrency ?? "$"}{" "}
                                {landingPageData?.salaryMax || ""}
                              </span>
                            </>
                          ) : (
                            <span ref={refs.salaryMinRef}>
                              {landingPageData?.salaryCurrency ?? "$"}{" "}
                              {landingPageData?.salaryMin || ""}
                            </span>
                          )}
                          <span> / </span>
                          <span
                            ref={refs.salaryTimeRef}
                            onClick={() => handleItemClick("salaryTime")}
                            style={{
                              color:textColor
                            }}
                          >
                            {getSalaryTimeTranslation(landingPageData?.lang, landingPageData?.salaryTime)?.toLowerCase?.() || getSalaryTimeTranslation(landingPageData?.lang, "Month")?.toLowerCase?.()}
                          </span>
                        </span>
                      )}
                    </div>
                    <svg
                      width="151"
                      height="43"
                      viewBox="0 0 151 43"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-[85%] -bottom-[50%]"
                    >
                      <circle cx="139" cy="31" r="6" fill="white" />
                      <circle
                        cx="139"
                        cy="31"
                        r="9"
                        stroke="white"
                        stroke-opacity="0.4"
                        stroke-width="6"
                      />
                      <path
                        d="M140 30.5L30 30.5L0.500003 0.99999"
                        stroke="url(#paint0_linear_4016_11282)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_4016_11282"
                          x1="-1.18142e-06"
                          y1="1"
                          x2="140"
                          y2="30"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="white" stop-opacity="0" />
                          <stop offset="1" stop-color="white" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
             

                <div className="hidden absolute top-0 xl:left-[20%] h-full w-[50%] translate-x-[100%]   lg:block ">
                  {/* Location */}
                  <div className="hidden absolute right-20 xl:right-[40] top-[5%] xl:translate-x-[75%] 2xl:translate-x-[100%] translate-x-[75%] lg:block">
                    <div
                      className="flex gap-3 items-center p-3 rounded-xl border shadow-lg border-white/10 lg:min-h-[75px]  z-[500]"
                      style={{
                        background:
                          "linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                        backdropFilter: "blur(34px)",
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: getColor("secondary", 500) }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 10.0308C14.6489 10.5516 16.5 11.741 16.5 13.125C16.5 14.989 13.1421 16.5 9 16.5C4.85786 16.5 1.5 14.989 1.5 13.125C1.5 11.741 3.35114 10.5516 6 10.0308M9 12.75V6.75M9 6.75C10.2426 6.75 11.25 5.74264 11.25 4.5C11.25 3.25736 10.2426 2.25 9 2.25C7.75736 2.25 6.75 3.25736 6.75 4.5C6.75 5.74264 7.75736 6.75 9 6.75Z"
                            stroke="#FAFAFA"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div
                        ref={refs.locationRef}
                        className="flex gap-1 items-center cursor-pointer relative z-[550]"
                        onClick={() => {
                          if (
                            Array.isArray(landingPageData?.location) &&
                            landingPageData?.location.length > 1
                          ) {
                            setShowLocationDropdown(!showLocationDropdown);
                          }
                          handleItemClick("location");
                        }}
                      >
                        <span className="font-medium"
                        style={{
                          color:textColor
                        }}
                        >
                          {selectedLocation}
                        </span>
                        {Array.isArray(landingPageData?.location) &&
                          landingPageData?.location.length > 1 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`transition-transform ${
                                showLocationDropdown ? "rotate-180" : ""}`}
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          )}
                      </div>

                      {/* Location Dropdown */}
                      {showLocationDropdown &&
                        Array.isArray(landingPageData?.location) && (
                          <div
                            className="overflow-x-hidden scrollbar-hide absolute left-0 top-full z-[2000] mt-2 w-full min-w-[200px] bg-white rounded-lg shadow-lg"
                            style={{
                              // background:"linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                              background: getColor("primary", 500),
                              backdropFilter: "blur(34px)",
                              position: "absolute",
                              maxHeight: "220px",
                              overflowY: "scroll",
                              color: calculateTextColor(
                                getColor("primary", 500),
                                landingPageData?.yiqThreshold
                              ),
                              scrollbarWidth: "none", /* Firefox */
                              msOverflowStyle: "none", /* Internet Explorer 10+ */
                            }}
                          >
                            <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
                              <span className="text-xs font-medium"
                              style={{
                                color:textColor
                              }}
                              
                              >
                                {getTranslation(landingPageData?.lang, 'locations')}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowLocationDropdown(false);
                                }}
                                className="p-1 rounded-full transition-colors hover:bg-white/10"
                              >
                                <X size={16} className="text-white" />
                              </button>
                            </div>
                            {landingPageData?.location
                              .filter((loc) => loc !== selectedLocation)
                              .map((loc, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 text-xs font-medium cursor-pointer lg:text-sm hover:bg-white/10"
                                  onClick={() => {
                                    setSelectedLocation(loc);
                                    setShowLocationDropdown(false);
                                  }}
                                  style={{
                                    color: calculateTextColor(
                                      getColor("primary", 500),
                                      landingPageData?.yiqThreshold
                                    ),
                                  }}
                                >
                                  {loc}
                                </div>
                              ))}
                          </div>
                        )}
                    </div>
                    <svg
                      width="181"
                      height="43"
                      viewBox="0 0 181 43"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-[90%] -bottom-[50%]"
                      
                    >
                      <circle cx="12" cy="31" r="6" fill="white" />
                      <circle
                        cx="12"
                        cy="31"
                        r="9"
                        stroke="white"
                        stroke-opacity="0.4"
                        stroke-width="6"
                      />
                      <path
                        d="M12 30.5L151 30.5L180.5 0.999989"
                        stroke="url(#paint0_linear_4014_9871)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_4014_9871"
                          x1="180"
                          y1="0.999998"
                          x2="-46"
                          y2="30"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="white" stop-opacity="0" />
                          <stop offset="1" stop-color="white" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {/* Hours */}
                  <div className="hidden absolute right-[8rem] top-[60%] translate-x-[100%] lg:block">
                    <div
                      className="flex gap-3 items-center p-3 rounded-xl border shadow-lg border-white/10 lg:min-h-[75px]"
                      style={{
                        background:
                          "linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%)",
                        "backdrop-filter": "blur(34px)",
                      }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: getColor("secondary", 500) ,color:textColor}} 
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <span
                        ref={refs.hoursRangeRef}
                        className="font-medium text-white"
                      >
                        {landingPageData?.hoursRange ? (
                          <>
                            <span
                              ref={refs.hoursMinRef}
                              onClick={() => {
                                handleItemClick("hoursMin");
                              }}
                              style={{
                                color:textColor
                              }}
                            >
                              {landingPageData?.hoursMin || "7"}
                            </span>
                            <span style={{ color:textColor }}>-</span>
                            <span
                              ref={refs.hoursMaxRef}
                              onClick={() => {
                                handleItemClick("hoursMax");
                              }}
                              style={{
                                color:textColor
                              }}
                            >
                              {landingPageData?.hoursMax || "10"}
                            </span>
                          </>
                        ) : (
                          <span
                            ref={refs.hoursMinRef}
                            onClick={() => {
                              handleItemClick("hoursMin");
                            }}
                            style={{
                              color:textColor
                            }}
                          >
                            {landingPageData?.hoursMin || "7"}
                          </span>
                        )}
                        <span
                          style={{
                            color:textColor
                          }}
                        > {getTranslation(landingPageData?.lang, 'hours')} / </span>
                        <span
                          ref={refs.hoursUnitRef}
                          onClick={() => {
                            handleItemClick("hoursUnit");
                          }}
                          style={{
                            color:textColor
                          }}
                        >
                          {getTimeUnitTranslation(landingPageData?.lang, landingPageData?.hoursUnit)}
                        </span>
                      </span>
                    </div>
                    <svg
                      width="164"
                      height="24"
                      viewBox="0 0 164 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-[100%] -bottom-[20%]"

                    >
                      <circle cx="12" cy="12" r="6" fill="white" /> 
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="white"
                        stroke-opacity="0.4"
                        stroke-width="6"
                      />
                      <path
                        d="M12.5 11.5L164 11.5"
                        stroke="url(#paint0_linear_4016_11295)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_4016_11295"
                          x1="164"
                          y1="11"
                          x2="-4"
                          y2="11"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="white" stop-opacity="0" />
                          <stop offset="1" stop-color="white" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Template3 = ({ landingPageData, fetchData }) => {
  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  const refs = useHeroHover();

  const location = Array.isArray(landingPageData?.location)
    ? landingPageData?.location.join(" ")
    : landingPageData?.location || "";

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);
  return (
    <div ref={refs.sectionRef} className="hero-section">
      <div
        ref={refs.heroImageRef}
        className="relative pb-[226px] pt-[160px]  flex flex-col items-center "
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${landingPageData?.heroImage})`,
          // backgroundImage: `linear-gradient(${variantPl1},${variantPl4} , url(${landingPageData?.heroImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${landingPageData?.heroImagePosition?.x} ${landingPageData?.heroImagePosition?.y}`,
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="container flex relative z-10 flex-col gap-9 items-end pr-14 pl-14 mdx:px-5">
          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="w-full">
              <Heading
                ref={refs.vacancyTitleRef}
                size="heading8xl"
                as="h1"
                className={`text-center text-[60px] font-semibold tracking-[-1.20px] mdx:text-[52px] smx:text-[46px] mt-[130px]`}
                style={{
                  color: variantPd5,
                  fontFamily: titleFont?.family,
                }}
              >
                {landingPageData?.vacancyTitle}
              </Heading>
            </div>
            <div className="w-full">
              <Text
                ref={refs.heroDescriptionRef}
                size="text_xl_regular"
                as="p"
                className={`self-stretch font-normal text-center text-[20px] leading-[30px]`}
                style={{
                  color: variantPd5,
                  fontFamily: subheaderFont?.family,
                }}
              >
                {landingPageData?.heroDescription}
              </Text>
            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-5 rounded border border-solid border-[#e8ebef] bg-[#ffffff] p-[22px] mdx:flex-col smx:p-5">
            {landingPageData?.salaryMin &&
              !isNaN(landingPageData?.salaryMin) && (
                <>
                  <div className="flex gap-2 items-center">
                    <img
                      src="/images3/img_coins_stacked_03.svg"
                      alt="Coins Image"
                      className="h-[18px] w-[18px]"
                    />
                    <div className="flex items-center">
                      {landingPageData?.salaryRange ? (
                        <>
                          <div ref={refs.salaryMinRef} className="inline">
                            {intToHumanReadablePrice(
                              parseFloat(landingPageData?.salaryMin)
                            )}
                          </div>
                          <span>-</span>
                          <div ref={refs.salaryMaxRef} className="inline">
                            {intToHumanReadablePrice(
                              parseFloat(landingPageData?.salaryMax)
                            )}
                          </div>
                          <div ref={refs.salaryCurrencyRef} className="inline">
                            {
                              currencies.find(
                                (c) => c.iso === landingPageData?.salaryCurrency
                              )?.symbol
                            }
                          </div>
                          {" / "}
                          <div
                            ref={refs.salaryTimeRef}
                            className="inline lowercase"
                          >
                            {landingPageData?.salaryTime}
                          </div>
                        </>
                      ) : (
                        <>
                          <div ref={refs.salaryMinRef} className="inline">
                            {intToHumanReadablePrice(
                              parseFloat(landingPageData?.salaryMin)
                            )}
                          </div>
                          <div ref={refs.salaryCurrencyRef} className="inline">
                            {
                              currencies.find(
                                (c) => c.iso === landingPageData?.salaryCurrency
                              )?.symbol
                            }
                          </div>
                          {" / "}
                          <div
                            ref={refs.salaryTimeRef}
                            className="inline lowercase"
                          >
                            {landingPageData?.salaryTime}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="h-[20px] w-px rounded-[50%] bg-[#e8ebef] mdx:h-px mdx:w-[20px] mdx:px-5" />
                </>
              )}

            <div ref={refs.locationRef} className="flex gap-2 items-center">
              <img
                src="/images3/img_vertical_container.svg"
                alt="Location Image"
                className="h-[18px] w-[18px]"
              />
              <Heading
                size="textlg"
                as="h3"
                className="text-[16px] font-medium text-[#050b38] max-w-[200px]"
              >
                {location}
              </Heading>
            </div>
            <div className="h-[20px] w-px rounded-[50%] bg-[#e8ebef] mdx:h-px mdx:w-[20px] mdx:px-5" />
            <div ref={refs.hoursMinRef} className="flex gap-2 items-center">
              <img
                src="/images3/img_search.svg"
                alt="Search Image"
                className="h-[18px] w-[18px]"
              />
              <div className="flex items-center">
                {landingPageData?.hoursRange ? (
                  <>
                    <span>{landingPageData?.hoursMin}</span>
                    <span>-</span>
                    <div ref={refs.hoursMaxRef} className="inline">
                      {landingPageData?.hoursMax}{" "}
                    </div>
                    {"hr / "}
                    <div ref={refs.hoursUnitRef} className="inline">
                      {landingPageData?.hoursUnit}
                    </div>
                  </>
                ) : (
                  <>
                    <span>{landingPageData?.hoursMin}</span>
                    {" hr/ "}
                    <div ref={refs.hoursUnitRef} className="inline">
                      {landingPageData?.hoursUnit}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-1 gap-4 mdx:self-stretch">
              <div ref={refs.cta1TitleRef} className="w-full">
                <Button
                  href={landingPageData?.cta1Link}
                  // color={`${textColors?.heading}`}
                  size="lg"
                  className={`w-full rounded border border-solid border-[#5207CD] px-[33px] font-semibold smx:px-5`}
                  style={{
                    borderColor: variantPl2,
                    backgroundColor: basePrimary,
                    color: variantPl1,
                  }}
                >
                 <Share2 size={20} color="#5207CD" />
                </Button>
              </div>
              <div ref={refs.cta2TitleRef} className="w-full">
                <Button
                  href={landingPageData?.cta2Link}
                  // color={`${textHeadingColor}`}
                  size="lg"
                  className={`w-full font-semibold whitespace-nowrap rounded border border-solid px-[19px]`}
                  style={{
                    borderColor: variantPl2,
                    backgroundColor: basePrimary,
                    color: variantPl1,
                  }}
                >
                  {landingPageData?.cta2Title}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Template2 = ({ landingPageData, fetchData }) => {
  const refs = useHeroHover();
  const location = Array.isArray(landingPageData?.location)
    ? landingPageData?.location.join(" ")
    : landingPageData?.location || "";

  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  return (
    <div ref={refs.sectionRef} className="hero-section">
      <div className="bg-white">
        <div className="container flex flex-col gap-8 items-start px-4 py-8 mx-auto md:py-16 lg:flex-row lg:gap-16">
          <div className="space-y-8 w-full lg:w-1/2">
            <div className="space-y-4">
              <div>
                <h1
                  ref={refs.vacancyTitleRef}
                  className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl"
                  style={{
                    color: variantPd5,
                    fontFamily: titleFont?.family,
                  }}
                >
                  {landingPageData?.vacancyTitle}
                </h1>
              </div>
              <div>
                <p
                  ref={refs.heroDescriptionRef}
                  className="max-w-xl text-lg text-gray-600 md:text-xl"
                  style={{
                    color: variantPd5,
                    fontFamily: subheaderFont?.family,
                  }}
                >
                  {landingPageData?.heroDescription}
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-center gap-5 rounded-[12px] border border-solid border-gray-300 bg-[#ffffff] p-[22px] mdx:w-full smx:flex-col smx:p-5">
              {landingPageData?.salaryMin &&
                !isNaN(landingPageData?.salaryMin) && (
                  <>
                    <div className="flex flex-1 gap-2 items-center smr:justify-center smx:justify-start smx:self-stretch">
                      <Img
                        src="/images3/img_coins_stacked_03.svg"
                        alt="Coins Image"
                        className="h-[18px] w-[18px]"
                      />
                      <div className="flex items-center">
                        {landingPageData?.salaryRange ? (
                          <>
                            <div ref={refs.salaryMinRef} className="inline">
                              {intToHumanReadablePrice(
                                parseFloat(landingPageData?.salaryMin)
                              )}
                            </div>
                            <span>-</span>
                            <div ref={refs.salaryMaxRef} className="inline">
                              {intToHumanReadablePrice(
                                parseFloat(landingPageData?.salaryMax)
                              )}
                            </div>
                            <div
                              ref={refs.salaryCurrencyRef}
                              className="inline"
                            >
                              {
                                currencies.find(
                                  (c) =>
                                    c.iso === landingPageData?.salaryCurrency
                                )?.symbol
                              }
                            </div>
                            {" / "}
                            <div
                              ref={refs.salaryTimeRef}
                              className="inline lowercase"
                            >
                              {landingPageData?.salaryTime}
                            </div>
                          </>
                        ) : (
                          <>
                            <div ref={refs.salaryMinRef} className="inline">
                              {intToHumanReadablePrice(
                                parseFloat(landingPageData?.salaryMin)
                              )}
                            </div>
                            <div
                              ref={refs.salaryCurrencyRef}
                              className="inline"
                            >
                              {
                                currencies.find(
                                  (c) =>
                                    c.iso === landingPageData?.salaryCurrency
                                )?.symbol
                              }
                            </div>
                            {" / "}
                            <div
                              ref={refs.salaryTimeRef}
                              className="inline lowercase"
                            >
                              {landingPageData?.salaryTime}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="h-[8px] w-[8px] rounded bg-[#5207CD] smx:hidden" />
                  </>
                )}

              <div className="flex gap-2 items-center smr:justify-center smx:justify-start smx:w-full">
                <Img
                  src="/images3/img_vertical_container.svg"
                  alt="Location Image"
                  className="h-[18px] w-[18px]"
                />
                <div className="flex items-center">{location}</div>
              </div>
              <div className="h-[8px] w-[8px] rounded bg-[#5207CD] smx:hidden" />
              <div className="flex flex-1 gap-2 items-center smr:justify-center smx:justify-start smx:w-full smx:self-stretch">
                <Img
                  src="/images3/img_search.svg"
                  alt="Search Image"
                  className="h-[18px] w-[18px]"
                />
                <div className="flex items-center">
                  {landingPageData?.hoursRange ? (
                    <>
                      <span>{landingPageData?.hoursMin}</span>
                      <span>-</span>
                      <div ref={refs.hoursMaxRef} className="inline">
                        {landingPageData?.hoursMax}{" "}
                      </div>
                      {"hr / "}
                      <div ref={refs.hoursUnitRef} className="inline">
                        {landingPageData?.hoursUnit}
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{landingPageData?.hoursMin}</span>
                      {" hr/ "}
                      <div ref={refs.hoursUnitRef} className="inline">
                        {landingPageData?.hoursUnit}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                color="light_blue_A700"
                href={landingPageData?.cta1Link}
                shape="round"
                size="3xl"
                style={{
                  borderColor: variantPl2,
                  backgroundColor: basePrimary,
                  color: "#fff",
                }}
                className="min-w-[170px] gap-2 rounded-lg border border-solid border-[#5207CD] px-[33px] font-semibold smx:px-5"
              >
                <Share2 size={20} />
              </Button>
              <Button
                color="light_blue_A700"
                href={landingPageData?.cta2Link}
                shape="round"
                size="3xl"
                style={{
                  borderColor: variantPl2,
                  backgroundColor: basePrimary,
                  color: "#fff",
                }}
                className="min-w-[170px] gap-2 rounded-lg border border-solid border-[#5207CD] px-[33px] font-semibold smx:px-5"
              >
                {landingPageData?.cta2Title}
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative z-10">
              <div
                ref={refs.heroImageRef}
                className="overflow-hidden rounded-full border-4 border-white shadow-xl aspect-square"
              >
                <img
                  src={landingPageData?.heroImage}
                  alt="Team collaboration"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div>
              <div
                className="absolute top-[0px] right-[0px] w-[150px] h-[150px] rounded-full opacity-50"
                style={{ backgroundColor: variantPl1 }}
              ></div>
              <div
                className="absolute bottom-[40px] left-[0px] w-[150px] h-[150px] rounded-full"
                style={{ backgroundColor: variantPl2 }}
              ></div>
              <div
                className="absolute top-[50px] left-[-30px] w-[80px] h-[80px] rounded-full opacity-30"
                style={{ backgroundColor: variantPl3 }}
              ></div>
              <div
                className="absolute bottom-[140px] right-[0px] w-[30px] h-[30px] rounded-full"
                style={{ backgroundColor: variantPl4 }}
              ></div>
            </div>
            {/* <div className="absolute bottom-[-30px] right-[100px] w-[60px] h-[60px] rounded-full bg-blue-500 opacity-20"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;
  return <Template3 {...props} />;
};

export function GridPattern({
  gridColor = "#ffffff", // Using hex color
  gridLineColor = "#ffffff", // Using hex color
  backgroundColor = "#1e3a4a",
  gridSize = 30,
  maxWidth = 900,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      drawPattern(ctx, width, height);
    };

    const drawPattern = (ctx, width, height) => {
      // Clear canvas and set background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Calculate the actual width to use (constrained by maxWidth)
      const patternWidth = Math.min(width, maxWidth);

      // Calculate the left offset to center the pattern
      const leftOffset = Math.floor((width - patternWidth) / 2);

        // RESPONSIVE ADJUSTMENT: Dynamic grid size calculation
      const minGridSize = 20;  // Minimum size for mobile
      const responsiveGridSize = Math.max(
        minGridSize, 
        Math.min(gridSize, patternWidth / 15) // Adjust divisor for density
      );

      // Calculate grid dimensions
      const cols = Math.ceil(patternWidth / responsiveGridSize);
      const actualPatternWidth = cols * responsiveGridSize;
      
      // FIX: Recalculate leftOffset based on actual grid width
      const centeredLeftOffset = (width - actualPatternWidth) / 2;
      const rightEdge = centeredLeftOffset + actualPatternWidth;

      const rows = Math.ceil(height / responsiveGridSize);

      // Calculate the actual right edge of the pattern

      // Calculate center points for circular fade
      const centerX = width / 2;
      const centerY = height / 2; // Centered vertically
      const maxDistance = Math.sqrt(
        Math.pow(width / 2, 2) + Math.pow(height / 2, 2)
      );

      // Draw grid lines with circular fade effect
      ctx.strokeStyle = gridLineColor; // Using hex color
      ctx.lineWidth = 0.3; // Thin line width

      // Vertical lines with circular fade
      for (let x = 0; x <= cols; x++) {
        const xPos = centeredLeftOffset + x * responsiveGridSize;

        // Skip if outside the pattern width
        if (xPos < centeredLeftOffset || xPos > rightEdge) continue;

        for (let y = 0; y < rows; y++) {
          const yPos = y * responsiveGridSize;

          // Calculate distance from center point
          const distance = Math.sqrt(
            Math.pow(xPos - centerX, 2) + Math.pow(yPos - centerY, 2)
          );

          // Normalize distance (0 to 1)
          const normalizedDistance = Math.min(
            1,
            distance / maxDistance
          );

          // Circular fade - stronger at center, fades toward edges
          const fadeFactor = Math.max(0, 1 - normalizedDistance * 1.5);

          // Skip drawing if fade is too low
          if (fadeFactor < 0.05) continue;

          // Set opacity based on circular fade - using globalAlpha with hex color
          // Subtle grid lines

          // Draw a short segment of the line
          ctx.globalAlpha = 0.3 * fadeFactor;
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos, yPos + responsiveGridSize);
          ctx.stroke();
        }
      }

      // Horizontal lines with circular fade
      for (let y = 0; y <= rows; y++) {
        const yPos = y * responsiveGridSize;

        for (let x = 0; x < cols; x++) {
          const xPos = centeredLeftOffset + x * responsiveGridSize;

          // Skip if outside the pattern width
          if (xPos < centeredLeftOffset || xPos > rightEdge - responsiveGridSize) continue;

          // Calculate distance from center point
          const distance = Math.sqrt(
            Math.pow(xPos + gridSize / 2 - centerX, 2) +
              Math.pow(yPos - centerY, 2)
          );

          // Normalize distance (0 to 1)
          const normalizedDistance = Math.min(
            1,
            distance / maxDistance
          );

          // Circular fade - stronger at center, fades toward edges
          const fadeFactor = Math.max(0, 1 - normalizedDistance * 1.5);

          // Skip drawing if fade is too low
          if (fadeFactor < 0.05) continue;

          // Set opacity based on circular fade - using globalAlpha with hex color
          ctx.globalAlpha = 0.1 * fadeFactor; // Subtle grid lines

          // Draw a short segment of the line
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos + gridSize, yPos);
          ctx.stroke();
        }
      }

      // Reset global alpha
      ctx.globalAlpha = 1.0;

      // Define the exact positions of the squares based on the marked image
      // These are grid coordinates (x, y) that will be multiplied by gridSize
      // The coordinates are based on a 20x12 grid (approximate)
      const squarePositions = [
        // Top section
        [10, 2], // Top center X
        [9, 4], // Upper middle X

        // Upper middle section
        [7, 5], // Left X
        [13, 5], // Right X
        [17, 5], // Far right X

        // Middle section
        [11, 6], // Center X
        [8, 7], // Left-center X
        [15, 7], // Right-center X

        // Lower middle section
        [3, 8], // Far left X
        [7, 8], // Left X
        [11, 8], // Center X
        [18, 8], // Far right X

        // Lower section
        [8, 10], // Left X
        [13, 10], // Center-right X
        [18, 10], // Far right X

        // Bottom section
        [2, 11], // Far left X
        [5, 13], // Left X
        [15, 13], // Right X
      ];

      // RESPONSIVE SCALING: Adjust square positions
      const baseCols = 20;  // Original reference columns
      const baseRows = 14;  // Original reference rows
      const colScale = cols / baseCols;
      const rowScale = rows / baseRows;


      // Draw the squares at the specified positions
       squarePositions.forEach(([gridX, gridY]) => {
        const x = Math.floor(gridX * colScale);
        const y = Math.floor(gridY * rowScale);
        const distX = Math.abs(x - cols/2) / (cols/2);
        const distY = Math.abs(y - rows/2) / (rows/2);
        const dist = Math.sqrt(distX * distX + distY * distY);
        const opacity = 0.35 * Math.max(0, 1 - dist * 0.7);

        ctx.fillStyle = gridColor;
        ctx.globalAlpha = opacity;
        ctx.fillRect(
          leftOffset + x * responsiveGridSize,
          y * responsiveGridSize,
          responsiveGridSize,
          responsiveGridSize
        );
      });
    };

    // Initial setup
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas.parentElement);

    return () => resizeObserver.disconnect();
  }, [gridColor, gridLineColor, backgroundColor, gridSize, maxWidth]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "30px",
        ...style,
      }}
    />
  );
}

export default HeroSection;
