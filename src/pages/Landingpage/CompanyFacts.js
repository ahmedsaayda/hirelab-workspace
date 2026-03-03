import React, {
  Suspense,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { Heading, Img, Text } from "./components/index.jsx";
import RenderFact from "./components/RenderFact/index.jsx";
import { scrollToElement } from "./scrollUtils.js";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import {
  Lightbulb,
  UserPlus,
  Award,
  Globe,
  Users,
  Cpu,
  Calendar,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { useHover } from "../../contexts/HoverContext.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { IconRenderer } from "../LandingpageEdit/IconsSelector.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";

const useCompanyFactsHover = () => {
  const { hoveredField, scrollToSection,setLastScrollToSection,lastScrollToSection } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  // Object to store fact item refs
  const factItemRefs = useRef({});

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      companyFactsTitle: titleRef,
      companyFactsDescription: descriptionRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Clear highlights from fact item elements
    Object.values(factItemRefs.current).forEach((ref) => {
      if (ref) {
        ref.classList.remove("highlight-section");
      }
    });

    // Handle regular fields
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
      return;
    }

    // Handle fact item fields - use exact hoveredField as key
    if (factItemRefs.current[hoveredField]) {
      factItemRefs.current[hoveredField].classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (scrollToSection === "company-facts" && sectionRef.current&&lastScrollToSection !== "company-facts") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("company-facts")
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    descriptionRef,
    factItemRefs,
  };
};

const Template2 = ({ landingPageData, fetchData }) => {
  const { sectionRef, titleRef, descriptionRef, factItemRefs } = useCompanyFactsHover();
  const { handleItemClick } = useFocusContext();
  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);
  const [activeIndex, setActiveIndex] = useState(0);

  // Extract colors for Template 2 theme
  const primaryColor = landingPageData?.primaryColor || "#0068D6";
  const secondaryColor = landingPageData?.secondaryColor || "#f5590c";
  const tertiaryColor = landingPageData?.tertiaryColor || "#3396FF";

  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#0068D6",
      secondaryColor: "#f5590c",
      tertiaryColor: "#3396FF",
    },
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Get facts from landingPageData
  const companyFacts = landingPageData?.companyFacts || [];

  // Default facts if none are provided
  const defaultFacts = [
    {
      headingText: "Community Engagement",
      descriptionText: "Active in social responsibility initiatives.",
      icon: "Zap",
    },
    {
      headingText: "Global Presence",
      descriptionText: "Serving clients in over 20 countries.",
      icon: "Globe",
    },
    {
      headingText: "Innovation Leaders",
      descriptionText: "Recruitment marketing automation.",
      icon: "BarChart",
    },
    {
      headingText: "Employee-Centric",
      descriptionText: "Recognized for our employee benefits.",
      icon: "MessageCircle",
    },
    {
      headingText: "Award-Winning",
      descriptionText: "Recipient of multiple industry awards.",
      icon: "Award",
    },
  ];

  const facts = companyFacts.length > 0 ? companyFacts : defaultFacts;

  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  // Get visible cards (5 cards: -2, -1, 0, +1, +2)
  const getVisibleCards = () => {
    const cards = [];
    for (let offset = -2; offset <= 2; offset++) {
      let index = activeIndex + offset;
      // Wrap around
      if (index < 0) index = facts.length + index;
      if (index >= facts.length) index = index - facts.length;
      cards.push({
        ...facts[index],
        originalIndex: index,
        offset,
      });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  // Card positions based on offset
  const getCardStyle = (offset) => {
    const isActive = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;
    const isOuter = Math.abs(offset) === 2;

    // Position from center
    let left = "50%";
    let transform = "translateX(-50%)";
    
    if (offset === -2) {
      left = "calc(50% - 660px)";
    } else if (offset === -1) {
      left = "calc(50% - 330px)";
    } else if (offset === 1) {
      left = "calc(50% + 330px)";
    } else if (offset === 2) {
      left = "calc(50% + 660px)";
    }

    return {
      position: "absolute",
      left,
      transform,
      top: isAdjacent ? "0px" : "72px",
      width: "306px",
      backgroundColor: isActive ? getColor("primary", 200) : getColor("primary", 50),
      borderRadius: "24px",
      padding: "48px 24px",
      boxShadow: isActive ? "0px 32.88px 50.815px 11.956px rgba(0, 0, 0, 0.03)" : "none",
      zIndex: isActive ? 10 : isAdjacent ? 5 : 1,
      opacity: isOuter ? 0.7 : 1,
    };
  };

  const getIconContainerStyle = (offset) => {
    const isActive = offset === 0;
    return {
      width: "160px",
      height: "160px",
      borderRadius: "24px",
      backgroundColor: isActive ? getColor("primary", 100) : getColor("primary", 50),
      boxShadow: isActive 
        ? `0px 44px 84px 0px ${getColor("primary", 300)}` 
        : `0px 44px 84px 0px ${getColor("primary", 100)}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  return (
    <div
      id="company-facts"
      ref={sectionRef}
      className="w-full bg-white relative overflow-hidden"
      style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}
    >
      <div className="flex flex-col gap-[64px] items-center pt-[200px] pb-[100px]">
        {/* Title Section */}
        <div className="flex flex-col gap-[28px] items-center">
          {/* Title with blue gradient highlight */}
          <div className="relative inline-grid">
            <div 
              className="col-start-1 row-start-1 h-[24px] rounded-[8px]"
              style={{
                background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
                marginLeft: "302px",
                marginTop: "20px",
                width: "143px",
              }}
            />
            <h2
              ref={titleRef}
              onClick={() => handleItemClick("companyFactsTitle")}
              className="col-start-1 row-start-1 font-semibold cursor-pointer text-center"
              style={{
                fontFamily: titleFont?.family || "Inter, sans-serif",
                fontSize: "48px",
                lineHeight: "60px",
                letterSpacing: "-1.44px",
                color: "#292929",
              }}
            >
              {landingPageData?.companyFactsTitle || "Our Company Facts"}
            </h2>
          </div>

          {/* Subtitle */}
          <p
            ref={descriptionRef}
            onClick={() => handleItemClick("companyFactsDescription")}
            className="cursor-pointer text-center max-w-[554px]"
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              color: "#7c7c7c",
              fontFamily: subheaderFont?.family || "Inter, sans-serif",
            }}
          >
            {landingPageData?.companyFactsDescription || "With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers."}
          </p>
        </div>

        {/* Cards Carousel */}
        <div className="relative w-full h-[469px] overflow-hidden">
          <div className="absolute inset-0" style={{ width: "1440px", left: "50%", transform: "translateX(-50%)" }}>
            {visibleCards.map((fact, idx) => {
              const offset = fact.offset;
              const isActive = offset === 0;

              return (
                <div
                  key={`${fact.originalIndex}-${offset}`}
                  className="flex flex-col gap-[64px] items-center overflow-hidden transition-all duration-300"
                  style={getCardStyle(offset)}
                >
                  {/* Icon Container */}
                  <div
                    ref={(el) => {
                      if (isActive) {
                        factItemRefs.current[`companyFacts[${fact.originalIndex}].icon`] = el;
                      }
                    }}
                    onClick={() => isActive && handleItemClick(`companyFacts[${fact.originalIndex}].icon`)}
                    style={getIconContainerStyle(offset)}
                    className={isActive ? "cursor-pointer" : ""}
                  >
                    <IconRenderer
                      icon={fact.icon}
                      className="w-[96px] h-[96px]"
                      style={{ color: "#3396ff" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-[24px] items-center text-center w-full">
                    <p
                      ref={(el) => {
                        if (isActive) {
                          factItemRefs.current[`companyFacts[${fact.originalIndex}].headingText`] = el;
                        }
                      }}
                      onClick={() => isActive && handleItemClick(`companyFacts[${fact.originalIndex}].headingText`)}
                      className={`font-semibold ${isActive ? "cursor-pointer" : ""}`}
                      style={{
                        fontSize: "24px",
                        lineHeight: "32px",
                        color: "#004fa3",
                        fontFamily: titleFont?.family || "Inter, sans-serif",
                      }}
                    >
                      {fact.headingText}
                    </p>
                    <p
                      ref={(el) => {
                        if (isActive) {
                          factItemRefs.current[`companyFacts[${fact.originalIndex}].descriptionText`] = el;
                        }
                      }}
                      onClick={() => isActive && handleItemClick(`companyFacts[${fact.originalIndex}].descriptionText`)}
                      className={isActive ? "cursor-pointer" : ""}
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#004fa3",
                        fontFamily: bodyFont?.family || "Inter, sans-serif",
                      }}
                    >
                      {fact.descriptionText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-[16px] items-center justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: "44px",
              height: "44px",
              border: `1px solid ${getColor("secondary", 300)}`,
              backdropFilter: "blur(4px)",
              backgroundColor: "transparent",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={getColor("secondary", 500)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: "44px",
              height: "44px",
              border: `1px solid ${getColor("secondary", 300)}`,
              backdropFilter: "blur(4px)",
              backgroundColor: "transparent",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={getColor("secondary", 500)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
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

  // Apply the same 3 or 6 facts filtering logic
  const companyFacts = landingPageData?.companyFacts || [];
  let facts = companyFacts;
  if (companyFacts.length >= 6) {
    facts = companyFacts.slice(0, 6);
  } else if (companyFacts.length >= 3) {
    facts = companyFacts.slice(0, 3);
  }

  return (
    <>
      <div
        style={{
          backgroundColor: variantPl4,
          // color:  textHeadingColor,
        }}
      >
        <div className="flex flex-col justify-center items-center py-24 mdx:py-5">
          <div className="container flex flex-col gap-12 px-8 mdx:px-5">
            <div className="flex flex-col gap-5 items-center">
              <Heading
                as="h2"
                className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                style={{ color: variantPd4 }}
              >
                {landingPageData?.companyFactsTitle}
              </Heading>
              <Text
                size="text_xl_regular"
                as="p"
                className="self-stretch text-center text-[20px] font-normal leading-[30px] text-[#475466]"
                style={{ color: variantPd4 }}
              >
                {landingPageData?.companyFactsDescription}
              </Text>
            </div>
            <div
              className={`grid gap-8 justify-center mdx:grid-cols-2 smx:grid-cols-1 ${facts.length === 6 ? 'grid-cols-3' : 'grid-cols-3'}`}
              style={{ color: variantSd4 }}
            >
              <Suspense fallback={<div>Loading feed...</div>}>
                {facts?.map?.((d, index) => (
                  <RenderFact {...d} key={"gridTemplate" + index} />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// FactCard component for TemplateX
const FactCard = ({ fact, getColor }) => {
  // Map string icon names to Lucide components if needed
  const getIconComponent = (iconName) => {
    const iconMap = {
      Globe: (
        <Globe
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      Calendar: (
        <Calendar
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      MapPin: (
        <MapPin
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      Lightbulb: (
        <Lightbulb
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      UserPlus: (
        <UserPlus
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      Award: (
        <Award
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      Users: (
        <Users
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      ),
      Cpu: (
        <Cpu className="w-8 h-8" style={{ color: getColor("primary", 500) }} />
      ),
    };

    return (
      iconMap[iconName] || (
        <HelpCircle
          className="w-8 h-8"
          style={{ color: getColor("primary", 500) }}
        />
      )
    );
  };

  // Determine the icon to display
  let iconToDisplay;
  if (fact.icon) {
    if (typeof fact.icon === "string") {
      // If it's a URL, render as image
      if (fact.icon.startsWith("http") || fact.icon.startsWith("/")) {
        iconToDisplay = (
          <img src={fact.icon} alt={fact.headingText} className="w-8 h-8" />
        );
      } else {
        // Otherwise assume it's an icon name
        iconToDisplay = getIconComponent(fact.icon);
      }
    } else {
      // If it's already a React element, use it directly
      iconToDisplay = fact.icon;
    }
  } else {
    // Default fallback icon
    iconToDisplay = (
      <HelpCircle
        className="w-8 h-8"
        style={{ color: getColor("primary", 500) }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-8 text-center rounded-2xl border border-gray-100">
      <div
        className="flex justify-center items-center mb-6 w-24 h-24 rounded-full"
        style={{ backgroundColor: getColor("primary", 100) + "40" }}
      >
        {iconToDisplay}
      </div>
      <h3 className="mb-2 text-xl font-bold text-[#1a3e4c]">
        {fact.headingText}
      </h3>
      <p className="text-gray-600">{fact.descriptionText}</p>
    </div>
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { handleItemClick } = useFocusContext();

  // Use our custom hook for hover effects
  const { sectionRef, titleRef, descriptionRef, factItemRefs } =
    useCompanyFactsHover();

  const [isMd, setIsMd] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const checkSize = () => {
      // Check the container width instead of window width
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setIsMd(containerWidth < 768);
      }
    };

    // Initial check
    checkSize();

    // Use ResizeObserver to detect changes in the container size
    const resizeObserver = new ResizeObserver(checkSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#26B0C6";
  const secondaryColor = landingPageData?.secondaryColor || "#F7E733";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#26B0C6",
      secondaryColor: "#F7E733",
      tertiaryColor: "#44b566",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );


  // Get facts from landingPageData
  const companyFacts = landingPageData?.companyFacts || [];

  // Default facts if none are provided
  const defaultFacts = [
    {
      headingText: "Industry Leader",
      descriptionText: "A global leader in the beverage industry",
      icon: "Globe",
    },
    {
      headingText: "Established",
      descriptionText: "Over 130 years of innovative solutions",
      icon: "Calendar",
    },
    {
      headingText: "Global Reach",
      descriptionText: "Presence in over 200 countries",
      icon: "MapPin",
    },
  ];

  // Use default facts if none are provided
 const rawFacts = companyFacts.length > 0 ? companyFacts : defaultFacts;
  
  // Display 3 or 6 facts based on count to maintain design consistency
  let facts = rawFacts;
  if (rawFacts.length >= 6) {
    facts = rawFacts.slice(0, 6);
  } else if (rawFacts.length >= 3) {
    facts = rawFacts.slice(0, 3);
  }
  // If less than 3 facts, show all available facts

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);
  const textColor = calculateTextColor(getColor("primary", 500));

  // Sliding carousel state/refs for mobile
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Go to slide by index
  const goToSlide = (index) => {
    if (sliderRef.current) {
      setActiveSlide(index);
      const containerWidth = sliderRef.current.clientWidth;
      const scrollPosition = index * containerWidth;
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Immediate scroll handler for real-time dot updates
  const handleScrollImmediate = React.useCallback(() => {
    if (sliderRef.current && !isDragging) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const containerWidth = sliderRef.current.clientWidth;
      const newActiveSlide = Math.round(scrollPosition / containerWidth);
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    }
  }, [isDragging, activeSlide]);

  // Debounced scroll handler for final position
  const debouncedHandleScroll = React.useCallback(() => {
    clearTimeout(window.companyFactsScrollTimeout);
    window.companyFactsScrollTimeout = setTimeout(handleScrollImmediate, 10);
  }, [handleScrollImmediate]);

  // Mouse/touch drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      handleScrollImmediate();
    }, 10);
  };

  return (
    <div
      className="px-4 py-16 w-full bg-white md:px-8"
      id="company-facts"
      ref={(el) => {
        sectionRef.current = el;
        containerRef.current = el;
      }}
      style={{color:"black",fontFamily: subheaderFont?.family }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            ref={titleRef}
            onClick={() => handleItemClick("companyFactsTitle")}
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.companyFactsTitle || "Our Company Facts"}
          </h2>
         <h3
            ref={descriptionRef}
            onClick={() => handleItemClick("companyFactsDescription")}
            className="mx-auto max-w-3xl"
            style={{ fontFamily: subheaderFont?.family }}
            dangerouslySetInnerHTML={{
              __html: landingPageData?.companyFactsDescription ||
                ""
            }}
          >
          </h3>
        </div>

        {/* Desktop Grid */}
        {!isMd && (
          <div className={`grid gap-6 ${facts.length === 6 ? 'grid-cols-3' : 'grid-cols-3'}`}>
            {facts.map((fact, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-8 text-center rounded-2xl border border-gray-100"
              >
                <div
                  ref={(el) => {
                    factItemRefs.current[`companyFacts[${index}].icon`] = el;
                  }}
                  onClick={() => handleItemClick(`companyFacts[${index}].icon`)}
                  className="flex justify-center items-center mb-6 w-24 h-24 rounded-full"
                  style={{ backgroundColor: getColor("primary", 500)}}
                  // ------------------------------
                >
                  {/* {getIconComponent(fact)} */}
                  <IconRenderer
                    icon={fact.icon}
                    className="w-8 h-8"
                    style={{ color: textColor }}
                  />
                </div>
                <h3
                  ref={(el) => {
                    factItemRefs.current[`companyFacts[${index}].headingText`] =
                      el;
                  }}
                  onClick={() =>
                    handleItemClick(`companyFacts[${index}].headingText`)
                  }
                  className="mb-2 text-xl font-bold "
                  style={{fontFamily: bodyFont?.family }}
                >
                  {fact.headingText}
                </h3>
                <p
                  ref={(el) => {
                    factItemRefs.current[
                      `companyFacts[${index}].descriptionText`
                    ] = el;
                  }}
                  onClick={() =>
                    handleItemClick(`companyFacts[${index}].descriptionText`)
                  }
                  style={{fontFamily: bodyFont?.family }}
                >
                  {fact.descriptionText}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Carousel */}
        {isMd && (
          <div>
            <div
              ref={sliderRef}
              className="flex overflow-x-auto justify-start snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
              }}
              onScroll={(e) => {
                handleScrollImmediate();
                debouncedHandleScroll();
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              {facts.map((fact, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-2 snap-start"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="flex flex-col items-center p-8 text-center rounded-2xl border border-gray-100">
                    <div
                      ref={(el) => {
                        factItemRefs.current[
                          `companyFacts[${index}].icon`
                        ] = el;
                      }}
                      onClick={() =>
                        handleItemClick(`companyFacts[${index}].icon`)
                      }
                      className="flex justify-center items-center mb-6 w-24 h-24 rounded-full"
                      style={{ backgroundColor: getColor("primary", 500) }}
                      
                    >
                      <IconRenderer
                        icon={fact.icon}
                        className="w-8 h-8"
                        style={{ color: textColor }}
                      />
                    </div>
                    <h3
                      ref={(el) => {
                        factItemRefs.current[
                          `companyFacts[${index}].headingText`
                        ] = el;
                      }}
                      onClick={() =>
                        handleItemClick(
                          `companyFacts[${index}].headingText`
                        )
                      }
                      className="mb-2 text-xl font-bold "
                      style={{ fontFamily: bodyFont?.family }}
                    >
                      {fact.headingText}
                    </h3>
                    <p
                      ref={(el) => {
                        factItemRefs.current[
                          `companyFacts[${index}].descriptionText`
                        ] = el;
                      }}
                      onClick={() =>
                        handleItemClick(
                          `companyFacts[${index}].descriptionText`
                        )
                      }
                      style={{ fontFamily: bodyFont?.family }}
                    >
                      {fact.descriptionText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Carousel Navigation Dots */}
            {facts.length > 1 && (
              <div className="flex gap-2 justify-center mt-8">
                {facts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors`}
                    style={{
                      backgroundColor:
                        index === activeSlide
                          ? getColor("primary", 500)
                          : "#e5e7eb",
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CompanyFacts = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default CompanyFacts;
