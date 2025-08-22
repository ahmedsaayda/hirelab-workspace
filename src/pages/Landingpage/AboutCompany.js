import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Heading, Img, Text, Button } from "./components/index.jsx";
import { useHover } from "../../contexts/HoverContext.js";
import { useSelector } from "react-redux";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { getThemeData } from "../../utils/destructureTheme.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import { getTranslation } from "../../utils/translations.js";

// Common hook for hover functionality
const useAboutCompanyHover = () => {
  const {
    hoveredField,
    scrollToSection,
    setLastScrollToSection,
    lastScrollToSection,
  } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  const descriptionRef = useRef();
  const imagesRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      aboutTheCompanyTitle: titleRef,
      aboutTheCompanyText: textRef,
      aboutTheCompanyDescription: descriptionRef,
      aboutTheCompanyImages: imagesRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Handle regular fields
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection === "about-company" &&
      sectionRef.current &&
      lastScrollToSection !== "about-company"
    ) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setLastScrollToSection("about-company");
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    textRef,
    descriptionRef,
    imagesRef,
  };
};

const getImagePosition = (index) => {
  const positions = [
    "right-[60%] top-[-10%] z-20 w-[180px] h-[140px]",
    "right-[25%] top-[-10%] z-10 w-[220px] h-[180px]",
    "left-0 top-[40%] z-10 w-[200px] h-[150px]",
    "left-[35%] top-[40%] z-30 w-[240px] h-[200px]",
    "right-[5%] top-[40%] z-20 w-[180px] h-[140px]",
  ];
  return positions[index] || "";
};

const Template3 = ({ landingPageData, fetchData }) => {
  const { baseColors, variants, gradients, textColors } = useSelector(
    (state) => state.theme
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = landingPageData?.aboutTheCompanyImages || [];
  const refs = useAboutCompanyHover();

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, images.length - 1)
    );
  };

  return (
    <>
      <div ref={refs.sectionRef}>
        <div className="flex justify-center bg-[#ffffff] py-24 mdx:py-5">
          <div className="container flex gap-5 justify-between px-8 mdx:flex-col mdx:px-5">
            <div ref={refs.imagesRef} className="w-[42%] mdx:w-full">
              <Img
                src={
                  images[currentImageIndex] ?? "/dhwise-images/placeholder.png"
                }
                alt={`Company Image ${currentImageIndex + 1}`}
                className="h-[326px] w-full rounded object-contain"
              />
            </div>
            <div className="flex w-[44%] flex-col gap-[30px] mdx:w-full">
              <div className="relative content-center">
                <div className="mx-auto flex flex-1 flex-col items-start gap-[22px]">
                  <div ref={refs.titleRef}>
                    <Heading
                      as="h2"
                      className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                    >
                      {landingPageData?.aboutTheCompanyTitle} template 3
                    </Heading>
                  </div>
                  <div className="flex flex-col items-start gap-[32px] self-stretch mdx:gap-[88px] smx:gap-[59px]">
                    <div ref={refs.textRef}>
                      <Text
                        size="text_xl_regular"
                        as="p"
                        className="text-[20px] font-normal text-[#475466]"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              landingPageData?.aboutTheCompanyText?.replace?.(
                                /\n/g,
                                "<br>"
                              ),
                          }}
                        />
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <Button
                  color="light_blue_A700_7f"
                  size="4xl"
                  variant="outline"
                  shape="circle"
                  className={`w-[56px] rounded-[28px] !border px-4 ${
                    currentImageIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handlePrevious}
                  disabled={currentImageIndex === 0}
                >
                  <Img
                    src="/images3/img_arrow_left_light_blue_a700.svg"
                    alt="Previous"
                  />
                </Button>
                <Button
                  color="light_blue_A700_7f"
                  size="4xl"
                  variant="outline"
                  shape="circle"
                  className={`w-[56px] rounded-[28px] !border px-4 ${
                    currentImageIndex === images.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNext}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <Img
                    src="/images3/img_arrow_right_light_blue_a700.svg"
                    alt="Next"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Template2 = ({ landingPageData, fetchData }) => {
  // Get the actual images from landingPageData
  const actualImages = landingPageData?.aboutTheCompanyImages || [];
  // Define the total number of image slots (default 5)
  const totalSlots = 5;
  // Default image URL (can be changed as needed)
  const defaultImageUrl = "/dhwise-images/placeholder.png";
  // Create an array that fills missing slots with the default image.
  const finalImages =
    actualImages.length < totalSlots
      ? [
          ...actualImages,
          ...Array(totalSlots - actualImages.length).fill(defaultImageUrl),
        ]
      : actualImages;

  const refs = useAboutCompanyHover();


  return (
    <div
      ref={refs.sectionRef}
      className="bg-[#f8f9fb] container w-full mx-auto"
    >
      <div
        className="relative h-[688px] bg-cover bg-no-repeat py-24 mdx:h-auto mdx:py-5"
        style={{ backgroundImage: "url(/images3/img_group_17.png)" }}
      >
        <div className="ml-auto h-[254px] w-[254px] rounded-[126px] bg-[#5207CD33] blur-[200.00px] backdrop-opacity-[0.5]" />
        <div className="container flex absolute top-0 right-0 bottom-0 left-0 justify-between items-center px-8 my-auto h-max mdx:relative mdx:flex-col mdx:gap-12 mdx:px-5">
          <div className="w-[40%] mdx:w-full">
            <div className="flex flex-col items-start gap-[22px]">
              <div ref={refs.titleRef}>
                <h2 className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] sm:text-[32px]">
                  {landingPageData?.aboutTheCompanyTitle}
                </h2>
              </div>
              <div ref={refs.textRef}>
                <p className="text-[20px] font-normal text-[#475466]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: landingPageData?.aboutTheCompanyText?.replace(
                        /\n/g,
                        "<br>"
                      ),
                    }}
                  />
                </p>
              </div>
            </div>
          </div>

          <div
            ref={refs.imagesRef}
            className="relative w-[60%] h-[400px] mdx:w-full mdx:h-[500px]"
          >
            {finalImages.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden absolute rounded-lg shadow-lg ${getImagePosition(
                  index
                )}`}
              >
                <img
                  src={image}
                  alt={`Team member ${index + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => (e.target.src = defaultImageUrl)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const scrollRef = useRef(null);
  const refs = useAboutCompanyHover();
  const { handleItemClick } = useFocusContext();

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

  // Get the actual images from landingPageData or use defaults
  const actualImages = landingPageData?.aboutTheCompanyImages || [];

  // Default images if none are provided
  const defaultImages = [
    {
      src: "/dhwise-images/placeholder.png",
      alt: "Modern office desk with Apple monitor",
    },
    {
      src: "/dhwise-images/placeholder.png",
      alt: "Smiling employee",
    },
    {
      src: "/dhwise-images/placeholder.png",
      alt: "Modern office buildings",
    },
    {
      src: "/dhwise-images/placeholder.png",
      alt: "Office team meeting",
    },
  ];

  // Create an array of image objects for rendering
  const images =
    actualImages.length > 0
      ? actualImages.map((src, index) => ({
          src: src,
          alt: `Company image ${index + 1}`,
        }))
      : defaultImages;

  // Update active slide when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollPosition = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.scrollWidth / images.length;
        const newActiveSlide = Math.round(scrollPosition / itemWidth);

        if (newActiveSlide !== activeSlide) {
          setActiveSlide(newActiveSlide);
        }
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [activeSlide, images.length]);

  // Process the company description text
  const companyText = landingPageData?.aboutTheCompanyText?.replace?.(
    /\n/g,
    "<br>"
  );

  // Get description text and create truncated version
  const description =
    landingPageData?.aboutTheCompanyDescription ||
    "Some text can be placed here..";
  const words = description.split(" ");
  const shouldTruncate = words.length > 32;
  const truncatedDescription = shouldTruncate
    ? words.slice(0, 32).join(" ") + "..."
    : description;

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

  const textColor = calculateTextColor(getColor("primary", 500));


  return (
    <div
      id="about-the-company"
      ref={refs.sectionRef}
      className="px-4 py-16 w-full bg-white md:px-8"
      style={{ color: "black" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center max-w-[640px] mx-auto">
          <h2
            ref={refs.titleRef}
            onClick={() => handleItemClick("aboutTheCompanyTitle")}
            className="mb-2 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.aboutTheCompanyTitle?.split(" ")[0] || "Discover"}{" "}
            <span style={{ fontFamily: subheaderFont?.family }}>
              {landingPageData?.aboutTheCompanyTitle
                ?.split(" ")
                .slice(1)
                .join(" ") || "Our Company"}
            </span>
          </h2>
          <div
            ref={refs.textRef}
            onClick={() => handleItemClick("aboutTheCompanyText")}
            className="mx-auto mb-8 max-w-2xl"
          >
            <h3 style={{ fontFamily: subheaderFont?.family }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: companyText,
                }}
              />
            </h3>
          </div>
          <div className="mb-8">
            <p
              ref={refs.descriptionRef}
              onClick={() => handleItemClick("aboutTheCompanyDescription")}
              style={{ color: "#1a3e4c", fontFamily: bodyFont?.family }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: (showFullDescription ? description : truncatedDescription)
                    ?.replace?.(/\n/g, "<br>")
                }}
              />
            </p>

            {shouldTruncate && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="px-6 py-3 h-[38px] font-medium rounded-full transition-colors"
                  style={{
                    backgroundColor: getColor("primary", 500),
                    color: textColor,
                    fontFamily: bodyFont?.family,
                  }}
                >
                  {showFullDescription ? getTranslation(landingPageData?.lang, 'readLess') : getTranslation(landingPageData?.lang, 'readMore')}
                </Button>
              </div>
            )}
          </div>
        </div>
        {/*  */}
        {/* Desktop Image Gallery */}
        <div ref={refs.imagesRef} className="hidden gap-4 md:flex">
          {images.map((image, index) => {
            const isOdd = index % 2 === 0;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl ${
                  isOdd ? "h-64" : "h-48 m-auto px-2"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`object-cover w-full h-full rounded-2xl ${isOdd ? "h-64" : "h-48 m-auto"
                    }`}
                  style={{
                    objectPosition: "50% 50%",
                    objectFit: "cover",
                    transition: "object-position 0.3s ease-in-out",
                  }}
                  onError={(e) => (e.target.src = "/dhwise-images/placeholder.png")}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile Image Carousel */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-2 w-full snap-center"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-64"
                    onError={(e) =>
                      (e.target.src = "/dhwise-images/placeholder.png")
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicator - Only Progress Bar, No Bullets */}
          <div className="flex justify-center mt-6">
            <div className="relative w-32 h-1 bg-gray-200 rounded-full">
              <div
                className="absolute h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: getColor("primary", 500),
                  width: `${100 / images.length}%`,
                  left: `${(100 / images.length) * activeSlide}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutCompany = (props) => {
  // console the values  ofthe about company section

  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default AboutCompany;
