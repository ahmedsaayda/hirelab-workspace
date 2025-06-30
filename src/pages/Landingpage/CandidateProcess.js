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
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { Mail, FileText, Users, Tag } from "lucide-react";
import { useHover } from "../../contexts/HoverContext.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { IconRenderer } from "../LandingpageEdit/IconsSelector.js";
import { getFonts } from "./getFonts.js";

const Template2 = ({ landingPageData, fetchData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const stepsPerPage = 4;

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

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      Math.max(prevIndex - (isMobile ? 1 : stepsPerPage), 0)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + (isMobile ? 1 : stepsPerPage),
        landingPageData?.candidateProcess?.length -
          (isMobile ? 1 : stepsPerPage)
      )
    );
  };

  
  return (
    <div
      className="flex flex-col justify-center items-center py-24 mdx:py-5"
      style={{ backgroundColor: variantPl4 }}
    >
      <div className="container flex flex-col items-center gap-[46px] px-8 mdx:px-5">
        {/* Header Section */}
        <div className="flex flex-col gap-3.5 items-center">
          <Heading
            as="h2"
            className="text-[36px] font-semibold tracking-[-0.72px]  mdx:text-[34px] smx:text-[32px]"
            style={{ color: variantPd5 }}
          >
            {landingPageData?.candidateProcessTitle}
          </Heading>
          <Text
            size="text_xl_regular"
            as="p"
            className="text-[20px] font-normal "
            style={{ color: variantPd5 }}
          >
            {landingPageData?.candidateProcessDescription}
          </Text>
        </div>

        {/* Desktop View - Hidden on mobile */}
        <div className="hidden flex-row gap-6 self-stretch md:flex">
          <Suspense fallback={<div>Loading...</div>}>
            {landingPageData?.candidateProcess
              ?.slice(currentIndex, currentIndex + stepsPerPage)
              ?.map?.((d, index) => (
                <ApplicationSubmission
                  {...d}
                  headingText={("0" + (currentIndex + index + 1)).slice(-2)}
                  key={"desktop" + index}
                  className="flex-1 bg-[#F5F5F2] flex flex-col justify-end"
                  textColor="#000000"
                />
              ))}
          </Suspense>
        </div>

        {/* Mobile View - Hidden on desktop */}
        {/* <div className="flex w-full md:hidden">
          <Suspense fallback={<div>Loading...</div>}>
            {landingPageData?.candidateProcess
              ?.slice(currentIndex, currentIndex + 1)
              ?.map?.((d, index) => (
                <ApplicationSubmission
                  {...d}
                  headingText={("0" + (currentIndex + index + 1)).slice(-2)}
                  key={"mobile" + index}
                  className="w-full bg-[#F5F5F2] flex flex-col justify-end"
                  textColor="#000000"
                />
              ))}
          </Suspense>
        </div> */}

        {/* Navigation Buttons - Show on both views */}
        {/* {landingPageData?.candidateProcess?.length > 1 && (
          <div className="flex justify-between mt-4 w-full">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded border disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentIndex + 1 >= landingPageData?.candidateProcess?.length
              }
              className="px-4 py-2 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )} */}
        <div className="min-h-[auto] w-full bg-gray-100  md:hidden">
          <div className="">
            <CustomCarousel
              themeData={themeData}
              data={landingPageData?.candidateProcess}
              ApplicationSubmission={ApplicationSubmission}
            />
          </div>
        </div>
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
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
          >
            {step.description}
          </p>
        )}

        <div
          className="absolute right-16 bottom-14 translate-y-1/2  leading-none opacity-20"
          style={{ color: getColor("primary", 500),fontSize:"250px" ,fontWeight:"100",letterSpacing:"2px" }}
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
    if (sliderRef.current && !isDragging) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const containerWidth = sliderRef.current.clientWidth;
      const newActiveSlide = Math.round(scrollPosition / containerWidth);
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    }
  }, [isDragging, activeSlide]);

  const debouncedHandleScroll = useCallback(() => {
    clearTimeout(window.candidateProcessScrollTimeout);
    window.candidateProcessScrollTimeout = setTimeout(handleScroll, 100);
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
      handleScroll();
    }, 50);
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
              __html: landingPageData?.candidateProcessDescription ||
                "Take a glimpse of how our application process looks like."
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
