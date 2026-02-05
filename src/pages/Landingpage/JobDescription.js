import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Heading, Img, Text } from "./components/index.jsx";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { useHover } from "../../contexts/HoverContext.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import { getTranslation } from "../../utils/translations.js";
import { scrollToElement } from "./scrollUtils.js";

const useJobDescriptionHover = () => {
  const {
    hoveredField,
    scrollToSection,
    lastScrollToSection,
    setLastScrollToSection,
  } = useHover();

  const jobDescriptionSectionRef = useRef(null);
  const jobDescriptionTitleRef = useRef(null);
  const jobDescriptionSubheaderRef = useRef(null);
  const jobDescriptionRef = useRef(null);

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      jobDescriptionTitle: jobDescriptionTitleRef,
      jobDescription: jobDescriptionRef,
      jobDescriptionSubheader: jobDescriptionSubheaderRef,
    };

    // clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
      return;
    }
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection === "job-description" &&
      jobDescriptionRef.current &&
      lastScrollToSection !== "job-description"
    ) {
      console.log("jobDescriptionRef.current", jobDescriptionRef.current);
      scrollToElement(jobDescriptionRef.current);
      setLastScrollToSection("job-description");
    }
  }, [scrollToSection]);

  return {
    jobDescriptionSectionRef,
    jobDescriptionTitleRef,
    jobDescriptionSubheaderRef,
    jobDescriptionRef,
  };
};

const Template2 = ({ landingPageData, fetchData }) => {
  const [showMore, setShowMore] = useState(false);
  const { handleItemClick } = useFocusContext();
  const {
    jobDescriptionSectionRef,
    jobDescriptionTitleRef,
    jobDescriptionSubheaderRef,
    jobDescriptionRef,
  } = useJobDescriptionHover();
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

  const aboutTheJobText = landingPageData?.jobDescription?.replace?.(
    /\n/g,
    "<br>"
  );
  const truncatedText =
    aboutTheJobText?.split(" ").length > 50
      ? aboutTheJobText.split(" ").slice(0, 50).join(" ") + "..."
      : aboutTheJobText;

  // Split title: first word separate, rest gets highlight
  const titleParts = React.useMemo(() => {
    const title = landingPageData?.jobDescriptionTitle || "About The Job";
    const words = title.split(" ");
    return {
      firstWord: words[0] || "",
      restWords: words.slice(1).join(" ")
    };
  }, [landingPageData?.jobDescriptionTitle]);

  return (
    <div
      id="job-description"
      ref={jobDescriptionSectionRef}
      className="w-full bg-white pt-[200px] pb-[100px] px-4 md:px-8 lg:px-[72px] overflow-visible"
      style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}
    >
      <div className="flex flex-col lg:flex-row gap-[64px] items-center max-w-[1440px] mx-auto">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-[64px] min-w-0">
          {/* Title Section */}
          <div className="flex flex-col gap-[28px] items-start">
            {/* Title with highlighted part - matching Figma exactly */}
            <div className="relative inline-grid">
              {/* Blue gradient highlight - positioned behind "The Job" */}
              <div 
                className="col-start-1 row-start-1 h-[20px] rounded-[8px]"
                style={{
                  background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
                  marginLeft: "141.5px",
                  marginTop: "38px",
                  width: "160px",
                }}
              />
              <h2
                ref={jobDescriptionTitleRef}
                onClick={() => handleItemClick("jobDescriptionTitle")}
                className="col-start-1 row-start-1 font-semibold cursor-pointer text-center"
                style={{
                  fontFamily: titleFont?.family || "Inter, sans-serif",
                  fontSize: "48px",
                  lineHeight: "60px",
                  letterSpacing: "-1.44px",
                  color: "#292929",
                }}
              >
                {landingPageData?.jobDescriptionTitle || "About The Job"}
              </h2>
            </div>

            {/* Subheader */}
            <p
              ref={jobDescriptionSubheaderRef}
              onClick={() => handleItemClick("jobDescriptionSubheader")}
              className="cursor-pointer text-center"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                color: "#7c7c7c",
                fontFamily: subheaderFont?.family || "Inter, sans-serif",
              }}
            >
              {landingPageData?.jobDescriptionSubheader || "Some text can be placed here...."}
            </p>
          </div>

          {/* Description Text */}
          <div className="flex flex-col gap-[36px] items-start w-full">
            <div
              ref={jobDescriptionRef}
              onClick={() => handleItemClick("jobDescription")}
              className="cursor-pointer w-full"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                color: "#292929",
                fontFamily: bodyFont?.family || "Inter, sans-serif",
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: showMore ? aboutTheJobText : truncatedText,
                }}
              />
            </div>

            {/* Read More Button */}
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center justify-center gap-[10px] h-[44px] px-[28px] rounded-[30px] font-semibold text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: getColor("secondary", 500),
                fontSize: "16px",
                lineHeight: "24px",
                fontFamily: bodyFont?.family || "Inter, sans-serif",
              }}
            >
              {showMore ? getTranslation(landingPageData?.lang, 'readLess') : getTranslation(landingPageData?.lang, 'readMore')}
            </button>
          </div>
        </div>

        {/* Right Image Section - Grid layout matching Figma */}
        <div 
          className="relative shrink-0 hidden lg:grid overflow-visible"
          style={{
            display: "grid",
            gridTemplateColumns: "max-content",
            gridTemplateRows: "max-content",
          }}
        >
          {/* Large orange arc - positioned to right of image */}
          <div 
            className="col-start-1 row-start-1 flex items-center justify-center overflow-visible"
            style={{
              width: "300px",
              height: "300px",
              marginLeft: "420px",
              marginTop: "220px",
            }}
          >
            <svg 
              width="300" 
              height="300" 
              viewBox="0 0 300 300" 
              fill="none"
              style={{ overflow: "visible" }}
            >
              {/* Three-quarter arc from top to bottom-left */}
              <path
                d="M 150 0 A 150 150 0 1 1 0 150"
                stroke={getColor("secondary", 500)}
                strokeWidth="36"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Small orange/peach filled circle - top left */}
          <div 
            className="col-start-1 row-start-1 rounded-full"
            style={{
              width: "148px",
              height: "148px",
              marginLeft: "0",
              marginTop: "27px",
              background: "linear-gradient(180deg, #fcd5c0 0%, #fae0d2 100%)",
            }}
          />

          {/* Main Image with white border */}
          <div
            className="col-start-1 row-start-1 bg-white overflow-hidden rounded-[16px]"
            style={{
              width: "480px",
              height: "480px",
              marginLeft: "103px",
              marginTop: "0",
              padding: "20px",
              boxShadow: "0px 32.88px 50.815px 11.956px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div className="w-full h-full overflow-hidden rounded-[12px]">
              <Img
                src={landingPageData?.jobDescriptionImage || "/dhwise-images/placeholder.png"}
                alt="Job Description"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: landingPageData?.imageAdjustment?.jobDescriptionImage?.objectPosition
                    ? `${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.x}% ${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.y}%`
                    : "50% 50%",
                  objectFit: landingPageData?.imageAdjustment?.jobDescriptionImage?.objectFit || "cover",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Image Section - Simplified version */}
        <div className="relative shrink-0 lg:hidden">
          {/* Small orange circle - top left */}
          <div 
            className="absolute -left-4 -top-4 w-[80px] h-[80px] rounded-full z-0"
            style={{
              background: "linear-gradient(180deg, #fcd5c0 0%, #fae0d2 100%)",
            }}
          />

          {/* Main Image with white border */}
          <div
            className="relative z-10 bg-white overflow-hidden rounded-[16px]"
            style={{
              width: "100%",
              maxWidth: "350px",
              padding: "16px",
              boxShadow: "0px 32.88px 50.815px 11.956px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div className="w-full aspect-square overflow-hidden rounded-[12px]">
              <Img
                src={landingPageData?.jobDescriptionImage || "/dhwise-images/placeholder.png"}
                alt="Job Description"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: landingPageData?.imageAdjustment?.jobDescriptionImage?.objectPosition
                    ? `${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.x}% ${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.y}%`
                    : "50% 50%",
                  objectFit: landingPageData?.imageAdjustment?.jobDescriptionImage?.objectFit || "cover",
                }}
              />
            </div>
          </div>

          {/* Orange arc - right side */}
          <svg 
            className="absolute -right-8 top-1/2 -translate-y-1/2 z-0"
            width="100" 
            height="200" 
            viewBox="0 0 100 200" 
            fill="none"
          >
            <path
              d="M100 100C100 155.228 55.228 200 0 200C0 144.772 0 55.228 0 0C55.228 0 100 44.772 100 100"
              stroke={getColor("secondary", 500)}
              strokeWidth="2"
              fill="none"
            />
          </svg>
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

  const [showMore, setShowMore] = useState(false);
  const aboutTheJobText = landingPageData?.jobDescription?.replace?.(
    /\n/g,
    "<br>"
  );
  const truncatedText =
    aboutTheJobText?.split(" ").length > 50
      ? aboutTheJobText.split(" ").slice(0, 50).join(" ") + "..."
      : aboutTheJobText;

  return (
    <>
      <div>
        <div
          className="flex flex-col justify-center items-center py-24 mdx:py-5"
          style={{
            // borderColor: variantPl1,
            backgroundColor: variantPd4,
          }}
        >
          <div className="container flex flex-col gap-8 px-8 max-w-4xl mdx:px-5">
            <div className="flex flex-col gap-[30px]">
              <div className="flex flex-col items-center gap-[22px] px-14 mdx:px-5">
                <Heading
                  as="h2"
                  className="text-[36px] font-semibold tracking-[-0.72px]  mdx:text-[34px] sm:text-[32px]"
                  style={{ color: variantPl4 }}
                >
                  {landingPageData?.jobDescriptionTitle + "ookkk"}
                </Heading>
                <Heading
                  as="h4"
                  className="text-[16px] font-normal tracking-[-0.72px]  mdx:text-[34px] sm:text-[32px]"
                  style={{ color: variantPl4 }}
                >
                  {landingPageData?.jobDescriptionSubheader}
                </Heading>
              </div>
              <Text
                size="textxl"
                as="p"
                className="text-center text-[18px] font-normal leading-7 text-[#ffffff]"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: showMore ? aboutTheJobText : truncatedText,
                  }}
                ></span>
                {aboutTheJobText?.split(" ").length > 50 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    style={{
                      display: "inline",
                      marginLeft: "5px",
                      color: "#5207CD",
                      textDecoration: "underline",
                      textDecorationThickness: "2px",
                      textUnderlineOffset: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {showMore ? getTranslation(landingPageData?.lang, 'readLess') : getTranslation(landingPageData?.lang, 'readMore')}
                  </button>
                )}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const cornerRadius = 24;
  const cutoutSize = 120;
  const [showMore, setShowMore] = useState(false);
  const { handleItemClick } = useFocusContext();
  const {
    jobDescriptionSectionRef,
    jobDescriptionTitleRef,
    jobDescriptionSubheaderRef,
    jobDescriptionRef,
  } = useJobDescriptionHover();

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

  const aboutTheJobText = landingPageData?.jobDescription?.replace?.(
    /\n/g,
    "<br>"
  );
  const truncatedText =
    aboutTheJobText?.split(" ").length > 50
      ? aboutTheJobText.split(" ").slice(0, 50).join(" ") + "..."
      : aboutTheJobText;

  const { subheaderFont, bodyFont } = getFonts(landingPageData);

  const textColor = calculateTextColor(getColor("primary", 500));
  const getBackgroundColor = (primaryColor) => {
    const brightness = getColorBrightness(primaryColor);
    return brightness > 128
      ? getColor("primary", 900)
      : getColor("primary", 500);
  };
  const getColorBrightness = (color) => {
    const rgb = color.match(/^#(\w{6})$/)?.[1];
    if (!rgb) return 0;
    const r = parseInt(rgb.slice(0, 2), 16);
    const g = parseInt(rgb.slice(2, 4), 16);
    const b = parseInt(rgb.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  console.log(
    "jobDescriptionSectionRefprimaryColor",
    primaryColor,
    secondaryColor,
    tertiaryColor
  );




  function layoutAdjustment() {
    return (<>
      <h2
        className="text-[2.5rem] font-bold mb-2"
        style={{ fontFamily: subheaderFont?.family }}
        ref={jobDescriptionTitleRef}
        onClick={() => handleItemClick("jobDescriptionTitle")}
      >
        {landingPageData?.jobDescriptionTitle?.split(" ")[0] || ""}{" "}
        <span style={{ fontFamily: subheaderFont?.family }}>
          {landingPageData?.jobDescriptionTitle
            ?.split(" ")
            .slice(1)
            .join(" ") || ""}
        </span>
      </h2>
      <h3
        className="mb-8"
        ref={jobDescriptionSubheaderRef}
        onClick={() => handleItemClick("jobDescriptionSubheader")}
        style={{ fontFamily: subheaderFont?.family }}
      >
        {landingPageData?.jobDescriptionSubheader || ""}
      </h3></>
    )
  }
  return (
    <div
      id="job-description"
      className="overflow-hidden relative px-4 w-full bg-white md:px-8"
      ref={jobDescriptionSectionRef}
      style={{
        color: "black",
      }}
    >
      {/* Decorative Element--top right box , hidden on mobile */}
      <svg
        className="hidden absolute right-0 md:block"
        width="199"
        height="120"
        viewBox="0 0 199 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="199"
          height="120"
          rx="24"
          fill={getColor("tertiary", 200)}
        />
      </svg>

      <div className="mx-auto mb-24 max-w-6xl md:my-8">
        <div className="grid gap-8 items-start md:grid-cols-2 md:gap-16">
          <div className="lg:hidden">
            {layoutAdjustment()}

          </div>

          {/* Image Section */}

          {false && <div
            className="overflow-hidden relative rounded-3xl"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          >
            <div className="overflow-hidden relative shadow-md">
              <div className="w-full h-full flex items-center justify-center relative aspect-[3/3] md:aspect-[4/4]">
                <Img
                  src={
                    landingPageData?.jobDescriptionImage ||
                    "/dhwise-images/placeholder.png"
                  }
                  alt="Team meeting"
                  className="w-full h-full z-1"
                  style={{
                    objectPosition: landingPageData?.imageAdjustment?.jobDescriptionImage?.objectPosition
                      ? `${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.x}% ${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.y}%`
                      : "50% 50%",
                    objectFit:
                      landingPageData?.imageAdjustment?.jobDescriptionImage?.objectFit || "cover",
                    transition: "object-position 0.3s ease-in-out",
                  }}
                />
                {/* <div className={`absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-[${secondaryColor}] from-30% to-transparent to-50%`}></div> */}

                <div
                  className="absolute inset-0 z-10 bg-gradient-to-t pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to top, ${getColor(
                      "primary",
                      200
                    )} 1%, transparent 50%)`,
                  }}
                ></div>
              </div>
            </div>


          </div>}

          <div className=" relative order-first md:order-first rounded-2xl " style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
            <div className="overflow-hidden relative shadow-md">
              <div className="relative aspect-[5/5] md:aspect-[4/4] w-full h-full">

                {/* Main Image */}
                <div className="overflow-hidden absolute inset-0 rounded-3xl">
                  <Img
                    src={
                      landingPageData?.jobDescriptionImage ||
                      "/dhwise-images/placeholder.png"
                    }
                    alt="Team meeting"
                    className="object-cover w-full h-full"
                    style={{
                      objectPosition: landingPageData?.imageAdjustment?.jobDescriptionImage?.objectPosition
                        ? `${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.x}% ${landingPageData.imageAdjustment.jobDescriptionImage.objectPosition.y}%`
                        : "50% 50%",
                      objectFit:
                        landingPageData?.imageAdjustment?.jobDescriptionImage?.objectFit || "cover",
                      transition: "object-position 0.3s ease-in-out",
                    }}
                  />

                  <div
                    className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t"
                    style={{
                      backgroundImage: `linear-gradient(to top, ${getColor("primary", 50)} 1%, transparent 50%)`,
                    }}
                  ></div>
                </div>


              </div>
            </div>
            {/* Left Bar Decoration */}
            <div className="leftBar z-10 absolute top-[-1px] right-[-1px] bottom-[110px] w-[85px] bg-white rounded-b-2xl ">



              <div className="absolute bottom-[-30px] right-[-10px] ">
                <div className="arc description-bottom-left"></div>
              </div>
              <div className="absolute left-[-30px] top-[-9px]">
                <div className="arc description-bottom-left"></div>
              </div>
            </div>

            {/* Bottom Bar Decoration */}
            <div className="absolute z-10 right-[110px] bottom-[-1px] left-[-1px] h-[85px] bg-white rounded-tr-2xl">
              <div className="absolute right-[-30px] bottom-[-10px] ">
                <div className="arc description-top-right"></div>
              </div>
              <div className="absolute top-[-30px] left-[-10px]">
                <div className="arc description-top-right"></div>
              </div>
            </div>

            <style jsx>{`
               .arc {
                width: 40px;
                height: 40px;
                position: relative;
                overflow: hidden;
                 border: 0;
                }

                .arc::after {
                 content: "";
                 position: absolute;
                 border: 0;
                top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    /* .description-top-left::after {
      background-image: radial-gradient(circle at 0 0, transparent 30px, white 20px);
    } */

    .description-top-right::after {
      background-image: radial-gradient(circle at 100% 0, transparent 30px, white 20px);
    }

    .description-bottom-left::after {
      background-image: radial-gradient(circle at 0 100%, transparent 30px, white 20px);
    }

    .description-bottom-right::after {
      background-image: radial-gradient(circle at 100% 100%, transparent 30px, white 20px);
    }
  `}</style>
          </div>

          {/* Content Section */}
          <div>
            <div className="hidden lg:block">
              {layoutAdjustment()}

            </div>
            <div className="space-y-6">
              <p
                className="leading-relaxed"
                ref={jobDescriptionRef}
                onClick={() => handleItemClick("jobDescription")}
                style={{ fontFamily: bodyFont?.family }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: showMore ? aboutTheJobText : truncatedText,
                  }}
                ></span>
              </p>

              {aboutTheJobText?.split(" ").length > 50 && (
                <Button
                  onClick={() => setShowMore(!showMore)}
                  className="px-6 py-3 h-[38px] font-medium text-black rounded-full transition-colors"
                  style={{
                    backgroundColor: getColor("primary", 500),
                    color: textColor,
                    fontFamily: bodyFont?.family,
                  }}
                >
                  {showMore ? getTranslation(landingPageData?.lang, 'readLess') : getTranslation(landingPageData?.lang, 'readMore')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDescription = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

// Helper function to generate the clip path
function generateClipPath(cornerRadius, cutoutSize) {
  // Calculate dimensions (assuming square for simplicity)
  const width = 600;
  const height = 600;

  // Create the path
  return `path(
    'M ${cornerRadius},0
    L ${width - cornerRadius},0
    Q ${width},0 ${width},${cornerRadius}
    L ${width},${height - cornerRadius}
    Q ${width},${height} ${width - cornerRadius},${height}
    L ${width - cutoutSize + cornerRadius},${height}
    Q ${width - cutoutSize},${height} ${width - cutoutSize},${height - cornerRadius
    }
    L ${width - cutoutSize},${height - cutoutSize + cornerRadius}
    Q ${width - cutoutSize},${height - cutoutSize} ${width - cutoutSize + cornerRadius
    },${height - cutoutSize}
    L ${cornerRadius},${height - cutoutSize}
    Q 0,${height - cutoutSize} 0,${height - cutoutSize - cornerRadius}
    L 0,${cornerRadius}
    Q 0,0 ${cornerRadius},0
    Z'
  )`;
}

export default JobDescription;
