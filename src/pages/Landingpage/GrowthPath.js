import { Steps } from "antd";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Heading, Img, Text } from "./components/index.jsx";
import { IconRenderer } from "../LandingpageEdit/IconsSelector.js";
// hirelab-frontend\src\pages\LandingpageEdit\IconsSelector.js
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { useHover } from "../../contexts/HoverContext.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import Growth_Path_Transparent_grid from "./svg/Growth_Path_Transparent_grid.jsx";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import { GridPattern } from "./HeroSection.js";

const ResponsiveSVGWithPoints = ({ growthPath, strokeColor, circleMiddle }) => {
  const svgRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const smallScreenPath = `
      M 0 480  
      C 100 450, 15 334, 117 270  
      C 337 233, 400 678, 470 575  
      C 559 448, 315 226, 428 133  
      C 571 29, 933 588, 771 196  
      C 661 -254, 899 258, 1135 255  
      C 1300 180, 816 -107, 1389 -36
    `;

    const largeScreenPath = `
      M-18 506C-18 506 71.4101 370.332 163.927 353.652
      C 240.461 339.854 280.955 415.541 357.258 400.605
      C 420.212 388.282 436.275 338.084 496.165 315.69
      C 607.88 273.918 701.963 377.767 803.006 315.69
      C 835.383 295.799 842.321 270.262 875.57 251.754
      C 952.866 208.726 1019.9 280.189 1104.15 251.754
      C 1165.32 231.105 1240.55 165.032 1249.87 156.713
      C 1250.51 156.135 1251.18 155.601 1251.9 155.107L1468 5
    `;

    setPathData(screenWidth < 678 ? smallScreenPath : largeScreenPath);
  }, [screenWidth]);

  // Wait for the path to be available before calculating points
  useEffect(() => {
    const updatePoints = () => {
      const path = svgRef.current?.querySelector("path");
      if (!path) return;

      // Ensure path has valid length
      const pathLength = path.getTotalLength();
      if (pathLength === 0) return;

      const pointPercentages = growthPath?.map(
        (_, index) => (index + 1) / (growthPath.length + 1)
      );
      const calculatedPoints = pointPercentages.map((percentage) => {
        const point = path.getPointAtLength(percentage * pathLength);
        return { x: point.x, y: point.y };
      });

      setPoints(calculatedPoints);
    };

    // Delay execution to ensure path is rendered
    setTimeout(updatePoints, 50);
  }, [growthPath, pathData]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="auto"
      viewBox="0 0 1440 510"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ensure path is available before accessing it */}
      {pathData && (
        <path
          d={pathData}
          stroke={strokeColor || "#EFF8FF"}
          strokeWidth="12"
          fill="none"
        />
      )}

      {/* Render points only if path exists */}
      {points.length > 0 &&
        points.map((point, index) => (
          <g key={index} transform={`translate(${point.x}, ${point.y})`}>
            <circle r="25" fill="#ffff" />
            <circle r="20" fill={circleMiddle} />
            <foreignObject x="-10" y="-10" width="20" height="20">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <IconRenderer
                  icon={growthPath[index]?.icon}
                  className="h-[18px] text-blue-500"
                />
              </div>
            </foreignObject>
            <text
              x="0"
              y="-45"
              textAnchor="middle"
              className="text-[20px] font-bold not-italic text-[#000000]"
            >
              {growthPath[index]?.title || `Stage ${index + 1}`}
            </text>
          </g>
        ))}
    </svg>
  );
};

// Add this custom hook for GrowthPath hover functionality
const useGrowthPathHover = () => {
  const {
    hoveredField,
    scrollToSection,
    setLastScrollToSection,
    lastScrollToSection,
  } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  // Object to store growth step refs
  const growthStepRefs = useRef({});

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      growthPathTitle: titleRef,
      growthPathDescription: descriptionRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Clear highlights from growth step elements
    Object.values(growthStepRefs.current).forEach((ref) => {
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

    // Handle growth step fields - use exact hoveredField as key
    if (growthStepRefs.current[hoveredField]) {
      growthStepRefs.current[hoveredField].classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection === "growth-path" &&
      sectionRef.current &&
      lastScrollToSection !== "growth-path"
    ) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setLastScrollToSection("growth-path");
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    descriptionRef,
    growthStepRefs,
  };
};

const Template2 = ({ landingPageData, fetchData }) => {

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

  return (
    <>
      <div style={{ backgroundColor: variantPl4 }}>
        <div>
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Growth path
            </h2>
            <p className="text-gray-600">
              Take a glimpse of how our application process looks like.
            </p>
          </div>

          <div className="relative h-[400px] w-full">
            <ResponsiveSVGWithPoints
              circleMiddle={variantPl3}
              strokeColor={basePrimary}
              growthPath={landingPageData?.growthPath}
            />
          </div>
        </div>
      </div>
    </>
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

  const [growthPath, setGrowthPath] = useState([]);

  useEffect(() => {
    setGrowthPath(landingPageData?.growthPath);
  }, [landingPageData]);


  // Function to convert hex color to RGBA
  const hexToRgba = (hex, opacity) => {
    // Remove '#' if it's present in the hex code
    if (hex?.startsWith("#")) hex = hex?.slice(1);

    // Parse the hex string into RGB values
    let r = parseInt(hex?.slice(0, 2), 16);
    let g = parseInt(hex?.slice(2, 4), 16);
    let b = parseInt(hex?.slice(4, 6), 16);

    // Return the rgba format with the opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const primaryColors = [
    basePrimary,
    variantPd1,
    variantPd2,
    variantPd3,
    variantPd4,
    variantPd5,
  ];
  return (
    <div style={{ backgroundColor: variantPl4 }}>
      <div className="container flex flex-col items-center px-14 pt-6 mdx:px-5">
        <div className="text-center">
          <Heading
            as="h2"
            className={`text-[36px] font-semibold tracking-[-0.72px] mdx:text-[34px] smx:text-[32px]`}
            style={{ color: variantPd5 }}
          >
            {landingPageData?.growthPathTitle}
          </Heading>
          <Text
            size="text_xl_regular"
            as="p"
            className="text-[20px] font-normal text-[#475466]"
            style={{ color: variantPd5 }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: landingPageData?.growthPathDescription?.replace?.(
                  /\n/g,
                  "<br>"
                ),
              }}
            />
          </Text>
        </div>
      </div>

      <div className="">
        {/* ===================== Desktop View Start================================ */}
        <div className="overflow-x-scroll relative mx-auto smx:hidden mdx:block mdr:block">
          <div className="flex relative z-10 justify-center items-end mx-auto w-fit h-fit">
            {growthPath?.map((step, index) => {
              const opacity = 0.4 + (index / growthPath.length) * 0.6;
              const marginBottom = index * 50;
              const colorIndex = index % primaryColors.length;
              const color = primaryColors[colorIndex];
              return (
                <div
                  key={step._id}
                  className={`flex relative flex-col items-center mt-4 mr-1 w-1/4 min-w-[260px] max-w-fit`}
                  style={{
                    marginBottom: index === 0 ? 0 : `${marginBottom}px`,
                    zIndex: index === 0 ? 0 : -1,
                  }}
                >
                  <div className="absolute top-0 left-0 smx:block mdx:hidden mdr:hidden">
                    <Img
                      src="/images3/img_547_1.png"
                      alt="Footer Image"
                      className="relative left-0 top-0  h-[146px] w-[180px] ml-[-35px] object-cover"
                    />
                  </div>
                  <div className="flex relative flex-col items-center w-full">
                    {index === 0 && (
                      <div className="absolute bottom-0 mb-10 smx:hidden mdx:block mdr:block">
                        <Img
                          src="/images3/img_547_1.png"
                          alt="Footer Image"
                          className="relative left-0 top-0 m-auto h-[296px] w-[380px] object-cover"
                        />
                      </div>
                    )}
                    <div
                      className="w-full text-5xl font-bold text-left text-gray-400"
                      style={{ opacity }}
                    >
                      #{String(index + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="flex justify-start items-center py-2 w-full"
                      style={{
                        borderLeft: `22px solid ${hexToRgba(color, opacity)}`,
                        borderTop: `22px solid ${hexToRgba(color, opacity)}`,
                      }}
                    >
                      <div className="px-1 py-2">
                        <Text
                          as="p"
                          className="text-[20px] font-bold not-italic text-[#475466]"
                        >
                          {step.title}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== Desktop View End================================ */}

        {/* ===================== Mobile Stacked View  */}
        {/* Ladder Section */}
        <div className="relative  min-h-[auto]  smx:block mdx:hidden mdr:hidden overflow-x-scroll">
          <div className="absolute top-0 left-0 z-10 smx:block mdx:hidden mdr:hidden">
            <Img
              src="/images3/img_547_1.png"
              alt="Footer Image"
              className="relative left-0 top-0  h-[146px] w-[180px] ml-[-35px] object-cover"
            />
          </div>
          <div className="flex relative z-10 flex-col-reverse w-fit">
            {growthPath?.map((step, index) => {
              const opacity = 0.4 + (index / growthPath.length) * 0.6;
              const marginLeft = index * 60;
              const marginBottom = 30;
              const colorIndex = index % primaryColors.length;
              const color = primaryColors[colorIndex];

              return (
                <div
                  className="relative flex flex-col items-center min-w-[260px] max-w-fit    "
                  style={{
                    marginLeft: index === 0 ? 0 : `${marginLeft}px`,
                    marginBottom: index === 0 ? 0 : `-${marginBottom}px`,
                    // marginBottom:`-${marginBottom}px`
                  }}
                >
                  <div className="flex relative flex-col items-center w-full">
                    {/* Image (Only in Step 1) */}
                    <div className="absolute bottom-0 mb-16 smx:hidden mdx:hidden mdr:block">
                      <Img
                        src="/images3/img_547_1.png"
                        alt="Footer Image"
                        className="relative left-0 top-0 m-auto h-[346px] w-[380px] object-cover"
                      />
                    </div>
                    <div className="w-full text-xl font-bold text-left text-gray-400 md:text-5xl">
                      #{String(index + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="flex justify-start items-center py-2 w-full"
                      style={{
                        borderLeft: `22px solid ${hexToRgba(color, opacity)}`,
                        borderTop: `22px solid ${hexToRgba(color, opacity)}`,
                      }}
                    >
                      <div className="px-1">
                        <Text
                          as="p"
                          className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-normal text-[#475466]"
                        >
                          {step.title}
                          {/* Entry-Level */}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();
  const { sectionRef, titleRef, descriptionRef, growthStepRefs } =
    useGrowthPathHover();

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

  const growthPath = landingPageData?.growthPath?.map((step, index) => ({
    position: step.title || `Level ${index + 1}`,
    level: index + 1,
    icon: step.icon,
  })) || [
    {
      position: "Project Coordinator",
      level: 1,
    },
    {
      position: "Associate Project Manager",
      level: 2,
    },
    {
      position: "Senior Project Manager",
      level: 3,
    },
    {
      position: "VP of Project Management",
      level: 4,
    },
  ];

  // Calculate spacing based on number of elements
  const calculateSpacing = (index, totalItems) => {
    // Calculate horizontal position to create a centered distribution
    // Start at 15% and end at 85% of container width to ensure proper margins
    const horizontalStart = 20; // Start further from edge
    const horizontalEnd = 80; // End before right edge
    const horizontalRange = horizontalEnd - horizontalStart;

    // For a single item, center it
    const leftPosition =
      totalItems === 1
        ? 50
        : horizontalStart + index * (horizontalRange / (totalItems - 1 || 1));

    // Calculate top position on a diagonal from bottom-left to top-right
    // Create more vertical spacing between steps
    const bottomOffset = 80; // Start from bottom (higher percentage)
    const topOffset = 10; // End at top (lower percentage)
    const verticalRange = bottomOffset - topOffset;

    // Add more vertical spacing between items
    const verticalGap = 15; // Gap percentage between steps
    const totalGaps = Math.max(0, totalItems - 1);
    const availableHeight = verticalRange - totalGaps * verticalGap;

    // Calculate position with gaps
    let topPosition;
    if (totalItems === 1) {
      topPosition = 50; // Center vertically
    } else {
      // Calculate the position with added vertical spacing
      const itemHeight = availableHeight / totalItems;
      topPosition = bottomOffset - index * (itemHeight + verticalGap);
    }

    return { left: leftPosition, top: topPosition };
  };

  const { subheaderFont, bodyFont } = getFonts(landingPageData);
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

  return (
    <div
      className="relative px-4 py-16 w-full bg-white md:px-8 isolate"
      id="growth-path"
      ref={sectionRef}
      style={{ color: "black" }}
    >
      {/* <Growth_Path_Transparent_grid landingPageData={landingPageData} /> */}
      <GridPattern
        gridColor={getColor("tertiary", 200)}
        gridLineColor={getColor("tertiary", 100)}
        backgroundColor="transparent"
        gridSize={50}
        className="-z-10"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            ref={titleRef}
            onClick={() => handleItemClick("growthPathTitle")}
            className="text-3xl md:text-4xl font-bold mb-3 text-[#1a3e4c]"
            style={{ fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.growthPathTitle?.split(" ")[0] || "Growth"}{" "}
            <span style={{ fontFamily: subheaderFont?.family }}>
              {landingPageData?.growthPathTitle
                ?.split(" ")
                .slice(1)
                .join(" ") || "Path"}
            </span>
          </h2>
         <h3
            ref={descriptionRef}
            onClick={() => handleItemClick("growthPathDescription")}
            style={{ fontFamily: subheaderFont?.family }}
            dangerouslySetInnerHTML={{
              __html: landingPageData?.growthPathDescription ||
                "Take a glimpse of how your career might progress with us."
            }}
          >
          </h3>
        </div>

        {/* Desktop Diagonal Path */}
        <div className="hidden md:block relative min-h-[500px]">
          {growthPath?.map((step, index) => {
            const { left, top } = calculateSpacing(index, growthPath.length);
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: "translateX(-50%)", // Center each element horizontally
                }}
              >
                <div className="flex items-center">
                  <div
                    className="flex items-center justify-between px-8 py-4 text-white rounded-full"
                    style={{
                      background: getColor("primary", 500),
                      borderRadius: "100px",
                      color: calculateTextColor(getColor("primary", 500)),
                      width: "280px", // Fixed width for all steps
                      minWidth: "280px", // Ensure minimum width
                      height: "70px", // Fixed height for all steps
                      minHeight: "70px", // Ensure minimum height
                    }}
                  >
                    <span
                      ref={(el) => {
                        growthStepRefs.current[`growthPath[${index}].title`] =
                          el;
                      }}
                      onClick={() =>
                        handleItemClick(`growthPath[${index}].title`)
                      }
                      className="font-medium"
                      style={{
                        width: "calc(100% - 50px)", // Leave space for the circle
                        maxWidth: "210px", // Maximum width for text (40 chars)
                        display: "flex",
                        alignItems: "center",
                        lineHeight: "1.2",
                        maxHeight: "2.4em", // 2 lines of text
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word", // Break words to fit
                        whiteSpace: "normal", // Allow text to wrap
                        fontFamily: bodyFont?.family,
                      }}
                    >
                      {step.position?.length > 40
                        ? `${step.position.substring(0, 37)}...`
                        : step.position}
                    </span>
                    <div
                      ref={(el) => {
                        growthStepRefs.current[`growthPath[${index}].icon`] =
                          el;
                      }}
                      onClick={() =>
                        handleItemClick(`growthPath[${index}].icon`)
                      }
                      className="flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-full"
                      style={{ backgroundColor: getColor("primary", 800) }}
                    >
                      {step.icon ? (
                        <IconRenderer
                          icon={step.icon}
                          className="h-[18px]"
                          style={{
                            color: calculateTextColor(
                              getBackgroundColor(landingPageData?.primaryColor)
                            ),
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: calculateTextColor(
                              getBackgroundColor(landingPageData?.primaryColor)
                            ),
                            fontFamily: bodyFont?.family,
                          }}
                        >
                          {step.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Path */}
        <div className="space-y-4 md:hidden">
          {growthPath?.map((step, index) => (
            <div key={index} className="flex justify-center">
              <div
                className="flex items-center px-6 py-3 w-full max-w-xs  rounded-full"
                style={{
                  background: getColor("primary", 500),
                  color: calculateTextColor(getColor("primary", 500)),
                }}
              >
                <span
                  ref={(el) => {
                    growthStepRefs.current[`growthPath[${index}].title`] = el;
                  }}
                  onClick={() => handleItemClick(`growthPath[${index}].title`)}
                  className="font-medium"
                  style={{
                    width: "calc(100% - 40px)", // Leave space for the circle
                    maxWidth: "210px", // Maximum width for text (40 chars)
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal", // Allow text to wrap
                    lineHeight: "1.2",
                    maxHeight: "2.4em", // 2 lines of text
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontFamily: bodyFont?.family,
                  }}
                >
                  {step.position?.length > 40
                    ? `${step.position.substring(0, 37)}...`
                    : step.position}
                </span>
                <div
                  ref={(el) => {
                    growthStepRefs.current[`growthPath[${index}].icon`] = el;
                  }}
                  onClick={() => handleItemClick(`growthPath[${index}].icon`)}
                  className="flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full ml-auto"
                  style={{
                    backgroundColor: getColor("primary", 800),
                  }}
                >
                  {step.icon ? (
                    <IconRenderer
                      icon={step.icon}
                      className="h-[14px]"
                      style={{
                        color: calculateTextColor(getColor("primary", 800)),
                        fontFamily: bodyFont?.family,
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: calculateTextColor(getColor("primary", 800)),
                        fontFamily: bodyFont?.family,
                      }}
                    >
                      {step.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
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
