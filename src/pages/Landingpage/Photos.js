import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Heading, Img, Text } from "./components";
import { motion } from "framer-motion";
import { useHover } from "../../contexts/HoverContext";
import { useFocusContext } from "../../contexts/FocusContext";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import { getFonts } from "./getFonts";
import { scrollToElement } from "./scrollUtils.js";

const usePhotosHover = () => {
  const { hoveredField, scrollToSection } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  const imagesRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      photoTitle: titleRef,
      photoText: textRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");

        const targetRef = refs[hoveredField]?.current;
        if (targetRef) {
          targetRef.classList.add("highlight-section");
        }
      }
    });
  }, [hoveredField]);

  // scroll to section
  useEffect(() => {
    if (scrollToSection === "image-carousel" && sectionRef.current) {
      scrollToElement(sectionRef.current);
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    textRef,
    imagesRef,
  };
};

const Template3 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();

  const { sectionRef, titleRef, textRef, imagesRef } = usePhotosHover();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = landingPageData?.photoImages || [];
  
  // Get image adjustments for photoImages field (per-image adjustments)
  const fieldAdjustments = landingPageData?.imageAdjustment?.photoImages || {};
  
  // Helper function to get adjustments for a specific image
  const getImageAdjustments = (imageUrl) => {
    const adjustments = fieldAdjustments[imageUrl] || {};
    const objectPosition = adjustments.objectPosition
      ? `${adjustments.objectPosition.x}% ${adjustments.objectPosition.y}%`
      : "50% 50%";
    const objectFit = adjustments.objectFit || "cover";
    return { objectPosition, objectFit };
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, images.length - 1)
    );
  };



  return (
    <div className="w-full bg-white" ref={sectionRef} id="image-carousel">
      <div className="flex justify-center bg-[#ffffff] py-24 mdx:py-5">
        <div className="container flex gap-5 justify-between px-8 mdx:flex-col mdx:px-5">
          {(() => {
            const currentImage = images[currentImageIndex] ?? "/dhwise-images/placeholder.png";
            const { objectPosition, objectFit } = getImageAdjustments(currentImage);
            return (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                className="h-[326px] w-[42%] rounded overflow-hidden mdx:w-full"
              >
                <Img
                  src={currentImage}
                  alt={`Company Image ${currentImageIndex + 1}`}
                  className="w-full h-full rounded"
                  style={{
                    objectFit: objectFit,
                    objectPosition: objectPosition,
                  }}
                />
              </motion.div>
            );
          })()}
          <div className="flex w-[44%] flex-col gap-[30px] mdx:w-full">
            <div className="relative content-center">
              <div className="mx-auto flex flex-1 flex-col items-start gap-[22px]">
                <h2
                  className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                  ref={titleRef}
                  onClick={() => handleItemClick("photoTitle")}
                >
                  {landingPageData?.photoTitle}
                </h2>
                <div className="flex flex-col items-start gap-[32px] self-stretch mdx:gap-[88px] smx:gap-[59px]">
                  <p
                    className="text-[20px] font-normal text-[#475466]"
                    ref={textRef}
                    onClick={() => handleItemClick("photoText")}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: landingPageData?.photoText?.replace?.(
                          /\n/g,
                          "<br>"
                        ),
                      }}
                    />
                  </p>
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
                  currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
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
  );
};
const Template2 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();

  const { sectionRef, titleRef, textRef, imagesRef } = usePhotosHover();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = landingPageData?.photoImages || [];
  
  // Get image adjustments for photoImages field (per-image adjustments)
  const fieldAdjustments = landingPageData?.imageAdjustment?.photoImages || {};
  
  // Helper function to get adjustments for a specific image
  const getImageAdjustments = (imageUrl) => {
    const adjustments = fieldAdjustments[imageUrl] || {};
    const objectPosition = adjustments.objectPosition
      ? `${adjustments.objectPosition.x}% ${adjustments.objectPosition.y}%`
      : "50% 50%";
    const objectFit = adjustments.objectFit || "cover";
    return { objectPosition, objectFit };
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, images.length - 1)
    );
  };


  return (
    <div className="w-full bg-white" ref={sectionRef} id="image-carousel">
      <div className="flex justify-center bg-[#ffffff] py-24 mdx:py-5">
        <div className="container flex gap-5 justify-between px-8 mdx:flex-col mdx:px-5">
          {(() => {
            const currentImage = images[currentImageIndex] ?? "/dhwise-images/placeholder.png";
            const { objectPosition, objectFit } = getImageAdjustments(currentImage);
            return (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                className="h-[326px] w-[42%] rounded overflow-hidden mdx:w-full"
              >
                <Img
                  src={currentImage}
                  alt={`Company Image ${currentImageIndex + 1}`}
                  className="w-full h-full rounded"
                  style={{
                    objectFit: objectFit,
                    objectPosition: objectPosition,
                  }}
                />
              </motion.div>
            );
          })()}
          <div className="flex w-[44%] flex-col gap-[30px] mdx:w-full">
            <div className="relative content-center">
              <div className="mx-auto flex flex-1 flex-col items-start gap-[22px]">
                <h2
                  className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                  ref={titleRef}
                  onClick={() => handleItemClick("photoTitle")}
                >
                  {landingPageData?.photoTitle}
                </h2>
                <div className="flex flex-col items-start gap-[32px] self-stretch mdx:gap-[88px] smx:gap-[59px]">
                  <p
                    className="text-[20px] font-normal text-[#475466]"
                    ref={textRef}
                    onClick={() => handleItemClick("photoText")}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: landingPageData?.photoText?.replace?.(
                          /\n/g,
                          "<br>"
                        ),
                      }}
                    />
                  </p>
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
                  currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
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
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();

  const { sectionRef, titleRef, textRef, imagesRef } = usePhotosHover();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = landingPageData?.photoImages || [];
  
  // Get image adjustments for photoImages field (per-image adjustments)
  const fieldAdjustments = landingPageData?.imageAdjustment?.photoImages || {};
  
  // Helper function to get adjustments for a specific image
  const getImageAdjustments = (imageUrl) => {
    const adjustments = fieldAdjustments[imageUrl] || {};
    const objectPosition = adjustments.objectPosition
      ? `${adjustments.objectPosition.x}% ${adjustments.objectPosition.y}%`
      : "50% 50%";
    const objectFit = adjustments.objectFit || "cover";
    return { objectPosition, objectFit };
  };

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

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 1, images.length - 1)
    );
  };
  
  // Only show navigation if there are multiple images
  const showNavigation = images.length > 1;


  // Split the title into first word and rest of words for styling
  const photoTitleParts = (landingPageData?.photoTitle || "Image Carousel").split(" ");
  const firstWord = photoTitleParts[0];
  const restWords = photoTitleParts.slice(1).join(" ");

  const {  subheaderFont, bodyFont } = getFonts(landingPageData);
  // Sliding carousel state/refs for mobile
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Go to slide by index
  const goToSlide = React.useCallback((index) => {
    if (sliderRef.current) {
      setCurrentImageIndex(index);
      const containerWidth = sliderRef.current.clientWidth;
      const scrollPosition = index * containerWidth;
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Scroll handler to update active dot
  const handleScroll = React.useCallback(() => {
    if (sliderRef.current && !isDragging) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const containerWidth = sliderRef.current.clientWidth;
      const newActiveSlide = Math.round(scrollPosition / containerWidth);
      if (newActiveSlide !== currentImageIndex && newActiveSlide >= 0 && newActiveSlide < images.length) {
        setCurrentImageIndex(newActiveSlide);
      }
    }
  }, [isDragging, currentImageIndex, images.length]);

  // Scroll timeout ref
  const scrollTimeoutRef = useRef(null);

  // Debounced scroll handler
  const debouncedHandleScroll = React.useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(handleScroll, 100);
  }, [handleScroll]);

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
  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    // Small delay to ensure scroll position has settled before checking
    setTimeout(() => {
      handleScroll();
    }, 150);
  }, [handleScroll]);

  // Responsive state for mobile/desktop
  const [isMd, setIsMd] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const checkSize = () => {
      if (containerRef.current) {
        setIsMd(containerRef.current.offsetWidth < 768);
      }
    };
    checkSize();
    const resizeObserver = new ResizeObserver(checkSize);
    resizeObserver.observe(containerRef.current);
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Add scroll event listener for better detection
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScrollEvent = (e) => {
      debouncedHandleScroll();
    };

    slider.addEventListener('scroll', handleScrollEvent, { passive: true });
    
    return () => {
      slider.removeEventListener('scroll', handleScrollEvent);
    };
  }, [debouncedHandleScroll]);

  return (
    <div
      className="w-full bg-white"
      ref={el => {
        sectionRef.current = el;
        containerRef.current = el;
      }}
      style={{ color: "black", fontFamily: bodyFont?.family }}
      id="image-carousel"
    >
      <div className="flex justify-center bg-[#ffffff] py-24 mdx:py-5">
        <div className="container flex gap-5 justify-between px-8 mdx:flex-col mdx:px-5">
          {/* Desktop & Mobile Sliding Carousel */}
          <div className={isMd ? "w-full" : "w-[42%]"}>
            <div
              ref={sliderRef}
              className="flex overflow-x-auto justify-start snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
                height: "400px", // Increased height to accommodate larger images
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
              {images.map((img, index) => {
                // Images 1, 3, 5 (indices 0, 2, 4) are larger
                // Images 2, 4 (indices 1, 3) are smaller
                const isLargeImage = index % 2 === 0;
                // More square-like dimensions to match Figma design
                const imageHeight = isLargeImage ? "320px" : "240px";
                const imageWidth = isLargeImage ? "320px" : "240px";
                const imageUrl = img ?? "/dhwise-images/placeholder.png";
                const { objectPosition, objectFit } = getImageAdjustments(imageUrl);
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 px-2 snap-start flex justify-center items-center overflow-hidden"
                    style={{
                      scrollSnapAlign: "start",
                      width: isMd ? "100%" : "100%",
                      height: "400px",
                    }}
                  >
                    <Img
                      src={imageUrl}
                      alt={`Company Image ${index + 1}`}
                      className="rounded"
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                        objectFit: objectFit,
                        objectPosition: objectPosition,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {/* Navigation Dots */}
            {showNavigation && (
              <div className="flex gap-2 justify-center mt-2">
                {Array.from({ length: images.length }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        index === currentImageIndex
                          ? getColor("primary", 500)
                          : "#d1d5db",
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex w-[44%] flex-col gap-[30px] mdx:w-full">
            <div className="relative content-center">
              <div className="mx-auto flex flex-1 flex-col items-start gap-[22px]">
                <h2
                  ref={titleRef}
                  onClick={() => handleItemClick("photoTitle")}
                  className="text-[36px] font-semibold tracking-[-0.72px]  mdx:text-[34px] smx:text-[32px]"
                  style={{ fontFamily: subheaderFont?.family }}
                >
                  <span className="" style={{ fontFamily: subheaderFont?.family }}>{firstWord}</span>{" "}
                  <span style={{ fontFamily: subheaderFont?.family }}>
                    {restWords}
                  </span>
                </h2>
                <div className="flex flex-col items-start gap-[32px] self-stretch mdx:gap-[88px] smx:gap-[59px]">
                  <p
                    className="text-[20px] font-normal "
                    ref={textRef}
                    onClick={() => handleItemClick("photoText")}
                    style={{ fontFamily: bodyFont?.family }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: landingPageData?.photoText?.replace?.(
                          /\n/g,
                          "<br>"
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Photos = (props) => {
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default Photos;
