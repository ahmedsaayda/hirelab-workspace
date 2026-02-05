import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { Heading, Text, CustomCarousel } from "./components/index.jsx";
import ApplicationSubmission from "./components/ApplicationSubmission/index.jsx";
import { scrollToElement } from "./scrollUtils.js";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { Mail, FileText, Users, Tag } from "lucide-react";
import { useHover } from "../../contexts/HoverContext.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { IconRenderer } from "../LandingpageEdit/IconsSelector.js";
import { getFonts } from "./getFonts.js";

const Template2 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();
  const { sectionRef, titleRef, descriptionRef, processStepRefs } =
    useCandidateProcessHover();

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

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

  // Default process steps with icons
  const defaultSteps = [
    {
      candidateProcessText: "Receive Application",
      description: "We welcome applications through our online career portal",
      candidateProcessIcon: "Mail",
    },
    {
      candidateProcessText: "CV Screening",
      description: "Our experienced recruiters meticulously review applications",
      candidateProcessIcon: "FileText",
    },
    {
      candidateProcessText: "Interview",
      description: "Candidates will be invited to participate in interviews",
      candidateProcessIcon: "Users",
    },
    {
      candidateProcessText: "Negotiation",
      description: "We are open to discussing the offer with you",
      candidateProcessIcon: "Tag",
    },
  ];

  const processSteps = landingPageData?.candidateProcess?.length > 0
    ? landingPageData.candidateProcess
    : defaultSteps;

  // Icon images from Figma
  const iconImages = [
    "http://localhost:3845/assets/3f8905d8398ec52fa2a792a4d4d214948b2aaba2.png",
    "http://localhost:3845/assets/7337b135ad2af19a4a9933e3cd1859de23d181e4.png",
    "http://localhost:3845/assets/fc23afe609dc51c1e8a305fecbc36b3540db1d88.png",
    "http://localhost:3845/assets/ddd5e5e53e438588a6aeab694f2b0fa51094027a.png",
  ];

  // Vertical line SVG
  const imgLine3 = "http://localhost:3845/assets/ae49b4987db90f6ea1042272bbc7c2b410624209.svg";

  // Parse title for gradient highlight
  const title = landingPageData?.candidateProcessTitle || "Our Application Process";
  const titleWords = title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const restWords = titleWords.slice(0, -1).join(" ");

  return (
    <div
      ref={sectionRef}
      id="candidate-process"
      className="w-full bg-white pt-[200px] pb-[100px] px-[72px]"
      style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}
    >
      {/* Title Section */}
      <div className="flex flex-col gap-[28px] items-center mb-[64px]">
        {/* Title with blue gradient highlight */}
        <div className="relative inline-grid">
          <div
            className="col-start-1 row-start-1 h-[24px] rounded-[8px]"
            style={{
              background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
              marginLeft: "347px",
              marginTop: "20px",
              width: "187px",
            }}
          />
          <h2
            ref={titleRef}
            onClick={() => handleItemClick("candidateProcessTitle")}
            className="col-start-1 row-start-1 font-semibold cursor-pointer text-center"
            style={{
              fontFamily: titleFont?.family || "Inter, sans-serif",
              fontSize: "48px",
              lineHeight: "60px",
              letterSpacing: "-1.44px",
              color: "#292929",
            }}
          >
            {title}
          </h2>
        </div>
        {/* Subtitle */}
        <p
          ref={descriptionRef}
          onClick={() => handleItemClick("candidateProcessDescription")}
          className="cursor-pointer text-center"
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            color: "#7c7c7c",
            fontFamily: subheaderFont?.family || "Inter, sans-serif",
          }}
        >
          {landingPageData?.candidateProcessDescription || "Take a glimpse of how our application process looks like."}
        </p>
      </div>

      {/* Process Cards Container */}
      <div className="flex flex-col items-center gap-[20px]">
        {processSteps.map((step, index) => {
          const stepNumber = ("0" + (index + 1)).slice(-2);
          const isEven = index % 2 === 1; // 0-indexed, so odd indices are even steps (2, 4)
          const iconSrc = iconImages[index % iconImages.length];

          return (
            <div
              key={index}
              className="relative flex items-center overflow-hidden rounded-[24px] h-[176px] w-[636px]"
              style={{
                marginLeft: isEven ? "64px" : "0",
                boxShadow: "0px 32.88px 50.815px 11.956px rgba(0,0,0,0.03)",
              }}
            >
              {/* Orange sidebar - Left for odd steps (1, 3), Right for even steps (2, 4) */}
              {!isEven && (
                <>
                  <div className="h-[176px] w-[64px] shrink-0" style={{ backgroundColor: getColor("secondary", 500) }} />
                  <div
                    className="absolute left-[40px] top-0 h-[177px] w-[47px] mix-blend-soft-light opacity-50"
                    style={{
                      background: "linear-gradient(to left, rgba(0,0,0,0.3), rgba(0,0,0,0))",
                    }}
                  />
                </>
              )}

              {/* White Body */}
              <div className="bg-white flex gap-[32px] h-[176px] items-center px-[40px] py-[24px] rounded-[24px] w-[572px]">
                {/* Step Number */}
                <div className="flex flex-col gap-[12px] items-center justify-center w-[64px] shrink-0 text-center">
                  <p
                    className="font-normal text-[20px] leading-[24px] text-[#7c7c7c]"
                    style={{ fontFamily: bodyFont?.family }}
                  >
                    STEP
                  </p>
                  <p
                    className="font-semibold text-[48px] leading-[60px] tracking-[-1.44px] text-black"
                    style={{ fontFamily: titleFont?.family }}
                  >
                    {stepNumber}
                  </p>
                </div>

                {/* Vertical Divider */}
                <div className="flex items-center justify-center h-full shrink-0">
                  <div className="w-[1px] h-[128px] bg-[#efefef]" />
                </div>

                {/* Content */}
                <div className="flex gap-[32px] items-center flex-1">
                  {/* Icon */}
                  <div
                    ref={(el) => {
                      processStepRefs.current[`candidateProcess[${index}].icon`] = el;
                    }}
                    onClick={() => handleItemClick(`candidateProcess[${index}].icon`)}
                    className="shrink-0 w-[80px] h-[80px] cursor-pointer"
                  >
                    <img
                      src={iconSrc}
                      alt={step.candidateProcessText}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-[20px] flex-1">
                    <p
                      ref={(el) => {
                        processStepRefs.current[`candidateProcess[${index}].candidateProcessText`] = el;
                      }}
                      onClick={() => handleItemClick(`candidateProcess[${index}].candidateProcessText`)}
                      className="font-semibold text-[24px] leading-[32px] text-[#292929] cursor-pointer"
                      style={{ fontFamily: subheaderFont?.family }}
                    >
                      {step.candidateProcessText || `Step ${index + 1}`}
                    </p>
                    <p
                      ref={(el) => {
                        processStepRefs.current[`candidateProcess[${index}].description`] = el;
                      }}
                      onClick={() => handleItemClick(`candidateProcess[${index}].description`)}
                      className="font-normal text-[16px] leading-[24px] text-[#525252] cursor-pointer"
                      style={{ fontFamily: bodyFont?.family }}
                    >
                      {step.description || "Description goes here"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orange sidebar - Right for even steps (2, 4) */}
              {isEven && (
                <>
                  <div className="h-[176px] w-[64px] shrink-0" style={{ backgroundColor: getColor("secondary", 500) }} />
                  <div
                    className="absolute right-[40px] top-0 h-[177px] w-[47px] mix-blend-soft-light opacity-50"
                    style={{
                      background: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0))",
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="flex flex-col items-center gap-[16px] md:hidden mt-8">
        {processSteps.map((step, index) => {
          const stepNumber = ("0" + (index + 1)).slice(-2);
          const iconSrc = iconImages[index % iconImages.length];

          return (
            <div
              key={index}
              className="relative flex items-center overflow-hidden rounded-[16px] w-full max-w-[400px]"
              style={{
                boxShadow: "0px 16px 32px 8px rgba(0,0,0,0.03)",
              }}
            >
              {/* Orange sidebar */}
              <div className="h-full min-h-[140px] w-[48px] shrink-0" style={{ backgroundColor: getColor("secondary", 500) }} />

              {/* White Body */}
              <div className="bg-white flex flex-col gap-[16px] p-[20px] flex-1">
                <div className="flex items-center gap-[16px]">
                  {/* Step Number */}
                  <div className="flex flex-col items-center">
                    <p className="text-[12px] text-[#7c7c7c]">STEP</p>
                    <p className="font-semibold text-[32px] leading-[40px] text-black">
                      {stepNumber}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-[1px] h-[60px] bg-[#efefef]" />

                  {/* Icon */}
                  <div className="w-[48px] h-[48px]">
                    <img
                      src={iconSrc}
                      alt={step.candidateProcessText}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-[8px]">
                  <p className="font-semibold text-[18px] leading-[24px] text-[#292929]">
                    {step.candidateProcessText || `Step ${index + 1}`}
                  </p>
                  <p className="font-normal text-[14px] leading-[20px] text-[#525252]">
                    {step.description || "Description goes here"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Template3 = Template2;
// Add this custom hook for CandidateProcess hover functionality
const useCandidateProcessHover = () => {
  const { hoveredField, scrollToSection,setLastScrollToSection,lastScrollToSection } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  // Object to store process step refs
  const processStepRefs = useRef({});

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      candidateProcessTitle: titleRef,
      candidateProcessDescription: descriptionRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Clear highlights from process step elements
    Object.values(processStepRefs.current).forEach((ref) => {
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

    // Handle process step fields - use exact hoveredField as key
    if (processStepRefs.current[hoveredField]) {
      processStepRefs.current[hoveredField].classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (scrollToSection === "candidate-process" && sectionRef.current&&lastScrollToSection !== "candidate-process") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("candidate-process")
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    descriptionRef,
    processStepRefs,
  };
};

const Template1 = ({ landingPageData, fetchData }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { handleItemClick } = useFocusContext();
  const { sectionRef, titleRef, descriptionRef, processStepRefs } =
    useCandidateProcessHover();

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

  // Map the icons to each process step
  const iconMap = {
    1: <Mail className="w-5 h-5" style={{ color: getColor("primary", 500) }} />,
    2: (
      <FileText
        className="w-5 h-5"
        style={{ color: getColor("primary", 500) }}
      />
    ),
    3: (
      <Users className="w-5 h-5" style={{ color: getColor("primary", 500) }} />
    ),
    4: <Tag className="w-5 h-5" style={{ color: getColor("primary", 500) }} />,
  };

  // Prepare process steps data
  const processSteps = landingPageData?.candidateProcess?.map(
    (step, index) => ({
      id: index + 1,
      title: step.candidateProcessText || `Step ${index + 1}`,
      icon: step.candidateProcessIcon,
      number: `0${index + 1}`,
      description: step.description || "",
    })
  ) || [
    {
      id: 1,
      title: "Submit Application",
      icon: iconMap[1],
      number: "01",
    },
    {
      id: 2,
      title: "CV Screening",
      icon: iconMap[2],
      number: "02",
    },
    {
      id: 3,
      title: "Interview & Assessment",
      icon: iconMap[3],
      number: "03",
    },
    {
      id: 4,
      title: "Follow-Up & Negotiation",
      icon: iconMap[4],
      number: "04",
    },
  ];

  // Process Card component
  const ProcessCard = ({ step, index }) => {
    return (
      <div className="overflow-hidden relative p-6 md:h-full h-fit min-h-[255px] bg-gray-50 rounded-lg">
        <div className="flex items-center mb-4">
          <div
            ref={(el) => {
              processStepRefs.current[`candidateProcess[${index}].icon`] = el;
            }}
            onClick={() => handleItemClick(`candidateProcess[${index}].icon`)}
            className="flex justify-center items-center w-10 h-10 rounded-full"
            style={{ border:`1px solid ${getColor("secondary", 500)}` }}
          >
            <IconRenderer
            icon={step.icon}
            landingPageData={landingPageData}
            style={{ color: getColor("secondary", 500) }}
            />
          </div>
        </div>

        <h3
          ref={(el) => {
            processStepRefs.current[
              `candidateProcess[${index}].candidateProcessText`
            ] = el;
          }}
          onClick={() =>
            handleItemClick(`candidateProcess[${index}].candidateProcessText`)
          }
          className="text-xl font-semibold text-[#1a3e4c] mb-2 relative z-10"
        >
          {step.title}
        </h3>

        {step.description && (
          <p
            ref={(el) => {
              processStepRefs.current[
                `candidateProcess[${index}].description`
              ] = el;
            }}
            onClick={() =>
              handleItemClick(`candidateProcess[${index}].description`)
            }
            className="relative z-10 mb-4 text-gray-600"
            dangerouslySetInnerHTML={{
              __html: step.description?.replace?.(/\n/g, "<br>")
            }}
          >
          </p>
        )}

        <div
          className="absolute right-2 md:right-4 bottom-14 translate-y-1/2  opacity-20 leading-none"
          style={{ color: getColor("primary", 500),fontSize:"250px" ,fontWeight:"100",letterSpacing:"2px", fontVariantNumeric: "tabular-nums" }}
        >
          {step.number}
        </div>
      </div>
    ); 
  };

  const {  subheaderFont, bodyFont } = getFonts(landingPageData);

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const slideWidth = sliderRef.current.clientWidth;
      const newActiveSlide = Math.round(scrollPosition / slideWidth);
      
      if (newActiveSlide !== activeSlide && newActiveSlide >= 0 && newActiveSlide < processSteps.length) {
        setActiveSlide(newActiveSlide);
      }
    }
  }, [activeSlide, processSteps.length]);

  const debouncedHandleScroll = useCallback(() => {
    if (window.candidateProcessScrollTimeout) {
      clearTimeout(window.candidateProcessScrollTimeout);
    }
    window.candidateProcessScrollTimeout = setTimeout(handleScroll, 50);
  }, [handleScroll]);

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
    const walk = (x - startX);
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX);
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    handleScroll(); // Immediately check scroll position when drag ends
  };

  return (
    <div
      className="px-4 py-16 w-full bg-white md:px-8"
      id="candidate-process"
      ref={sectionRef}
      style={{
        fontFamily: bodyFont?.family,
        color: "black"
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            ref={titleRef}
            onClick={() => handleItemClick("candidateProcessTitle")}
            className="text-3xl md:text-4xl font-bold mb-3 "
            style={{fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.candidateProcessTitle?.split(" ")[0] ||
              "Our Application"}{" "}
            <span style={{ fontFamily: subheaderFont?.family }}>
              {landingPageData?.candidateProcessTitle
                ?.split(" ")
                .slice(1)
                .join(" ") || "Process"}
            </span>
          </h2>
        <h3
            ref={descriptionRef}
            onClick={() => handleItemClick("candidateProcessDescription")}
            style={{ fontFamily: subheaderFont?.family }}
            dangerouslySetInnerHTML={{
              __html: (landingPageData?.candidateProcessDescription ||
                "")?.replace?.(/\n/g, "<br>")
            }}
          >
          </h3>
        </div>

        {/* Desktop Grid */}
        <div className="hidden gap-6 md:grid md:grid-cols-2">
          {processSteps.map((step, index) => (
            <ProcessCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto justify-start snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
            }}
            onScroll={debouncedHandleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
          >
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex-shrink-0 w-full px-2 snap-start"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProcessCard step={step} index={index} />
              </div>
            ))}
          </div>

          {/* Carousel Navigation Dots */}
          <div className="flex gap-2 justify-center mt-8">
            {processSteps.map((_, index) => (
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
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateProcess = (props) => {
  if (props?.landingPageData?.templateId === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default CandidateProcess;
