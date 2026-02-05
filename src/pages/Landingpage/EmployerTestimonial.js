import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { Heading, Img, Slider, Text } from "./components";
import placholder from "../../assets/img/placeholder.png";
import { useHover } from "../../contexts/HoverContext";
import { useFocusContext } from "../../contexts/FocusContext";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import { getFonts } from "./getFonts";
import { scrollToElement } from "./scrollUtils.js";

// Common hook for hover functionality
const useTestimonialHover = () => {
  const { hoveredField, scrollToSection ,setLastScrollToSection,lastScrollToSection} = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const subheaderRef = useRef();
  const testimonialRefs = useRef([]);

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      testimonialTitle: titleRef,
      testimonialSubheader: subheaderRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });
    testimonialRefs.current.forEach((refs) => {
      Object.values(refs).forEach((ref) => {
        if (ref) ref.classList.remove("highlight-section");
      });
    });

    // Handle array fields (testimonials)
    const match = hoveredField.match(/testimonials\[(\d+)\]\.(\w+)/);
    if (match) {
      const [_, index, field] = match;
      
      const testimonialRef = testimonialRefs.current[parseInt(index)];
      if (testimonialRef?.[field]) {
        testimonialRef[field].classList.add("highlight-section");
      }
      return;
    }

    // Handle regular fields
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (scrollToSection === "employee-testimonials" && sectionRef.current&&lastScrollToSection !== "employee-testimonials" ) {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("employer-testimonial")
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    subheaderRef,
    testimonialRefs,
  };
};

const Template2 = ({ landingPageData, fetchData }) => {
  const refs = useTestimonialHover();
  const { handleItemClick } = useFocusContext();
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle card active
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

  // Initialize testimonial refs array
  React.useEffect(() => {
    refs.testimonialRefs.current =
      landingPageData?.testimonials?.map(() => ({
        fullname: null,
        role: null,
        comment: null,
        avatar: null,
      })) || [];
  }, [landingPageData?.testimonials?.length]);

  // Default testimonials
  const defaultTestimonials = [
    {
      fullname: "John Doe",
      role: "Project Manager",
      comment: "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence.",
      avatar: "/dhwise-images/placeholder.png",
      avatarEnabled: true,
    },
    {
      fullname: "Alison Medis",
      role: "Project Manager",
      comment: "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence.",
      avatar: "/dhwise-images/placeholder.png",
      avatarEnabled: true,
    },
    {
      fullname: "Jessica Jones",
      role: "Project Manager",
      comment: "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence.",
      avatar: "/dhwise-images/placeholder.png",
      avatarEnabled: true,
    },
  ];

  const testimonials = landingPageData?.testimonials?.length > 0 
    ? landingPageData.testimonials 
    : defaultTestimonials;

  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  // Get visible cards (prev, active, next)
  const getVisibleCards = () => {
    const prevIndex = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    const nextIndex = activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1;
    return [
      { ...testimonials[prevIndex], originalIndex: prevIndex, position: 'prev' },
      { ...testimonials[activeIndex], originalIndex: activeIndex, position: 'active' },
      { ...testimonials[nextIndex], originalIndex: nextIndex, position: 'next' },
    ];
  };

  const visibleCards = getVisibleCards();

  // Quote icon SVG - proper double quote marks
  const QuoteIcon = ({ color = "#efefef", size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path
        d="M32 24C24 24 18 30 18 38C18 42 20 45.5 23 48C20.5 50 17 51 17 51C17 51 22 53 28 53C36 53 42 47 42 38C42 30 36 24 32 24ZM32 24V24M56 24C48 24 42 30 42 38C42 42 44 45.5 47 48C44.5 50 41 51 41 51C41 51 46 53 52 53C60 53 66 47 66 38C66 30 60 24 56 24Z"
        fill={color}
      />
    </svg>
  );

  return (
    <div
      id="employee-testimonials"
      ref={refs.sectionRef}
      className="w-full bg-white relative overflow-hidden"
      style={{ fontFamily: bodyFont?.family || "Inter, sans-serif", minHeight: "900px" }}
    >
      {/* Earth Sphere Background - Globe with diagonal lines */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none hidden lg:block"
        style={{ top: "378px", width: "990px", height: "911px" }}
      >
        {/* Globe SVG with curved diagonal lines */}
        <svg width="100%" height="100%" viewBox="0 0 990 600" fill="none" preserveAspectRatio="xMidYMin slice">
          {/* Curved lines forming globe shape */}
          {Array.from({ length: 50 }).map((_, i) => {
            const startY = i * 15;
            const controlY = startY - 30 - Math.sin((i / 50) * Math.PI) * 50;
            return (
              <path
                key={i}
                d={`M 100 ${startY + 50} Q 495 ${controlY + 50} 890 ${startY + 80}`}
                stroke={getColor("primary", 200)}
                strokeWidth="1.5"
                strokeDasharray="8 4"
                fill="none"
                opacity="0.7"
              />
            );
          })}
        </svg>
      </div>

      {/* Users Section - Avatars and Decorations */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none hidden lg:block"
        style={{ top: "0", width: "1440px", height: "700px" }}
      >
        {/* Avatar 1 - Left (Woman) */}
        <div 
          className="absolute"
          style={{ left: "347px", top: "381px", width: "108px", height: "108px" }}
        >
          {/* Blue glow ring */}
          <div 
            className="absolute rounded-full"
            style={{
              left: "-30px",
              top: "-30px",
              width: "168px",
              height: "168px",
              background: "radial-gradient(circle, rgba(204, 229, 255, 0.6) 0%, rgba(204, 229, 255, 0) 70%)",
            }}
          />
          {/* Avatar */}
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ border: `3px solid ${getColor("primary", 200)}` }}>
            <Img
              src={testimonials[0]?.avatar || placholder}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Avatar 2 - Right (Woman) */}
        <div 
          className="absolute"
          style={{ left: "956px", top: "435px", width: "108px", height: "108px" }}
        >
          {/* Blue glow ring */}
          <div 
            className="absolute rounded-full"
            style={{
              left: "-30px",
              top: "-30px",
              width: "168px",
              height: "168px",
              background: "radial-gradient(circle, rgba(204, 229, 255, 0.6) 0%, rgba(204, 229, 255, 0) 70%)",
            }}
          />
          {/* Avatar */}
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ border: `3px solid ${getColor("primary", 200)}` }}>
            <Img
              src={testimonials[2]?.avatar || placholder}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Avatar 3 - Center (Man) */}
        <div 
          className="absolute"
          style={{ left: "652px", top: "480px", width: "108px", height: "108px" }}
        >
          {/* Blue glow ring */}
          <div 
            className="absolute rounded-full"
            style={{
              left: "-30px",
              top: "-30px",
              width: "168px",
              height: "168px",
              background: "radial-gradient(circle, rgba(204, 229, 255, 0.6) 0%, rgba(204, 229, 255, 0) 70%)",
            }}
          />
          {/* Avatar */}
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ border: `3px solid ${getColor("primary", 200)}` }}>
            <Img
              src={testimonials[1]?.avatar || placholder}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Orange/Peach Dot - Top Left */}
        <div 
          className="absolute rounded-full"
          style={{ 
            left: "304px", 
            top: "370px", 
            width: "36px", 
            height: "36px",
            background: "linear-gradient(180deg, #ffb899 0%, #ff8a65 100%)",
          }}
        />

        {/* Small Orange Dot - Right */}
        <div 
          className="absolute rounded-full"
          style={{ left: "1098px", top: "489px", width: "16px", height: "16px", backgroundColor: getColor("secondary", 500) }}
        />

        {/* Rocket Icon Container */}
        <div 
          className="absolute rounded-full bg-white flex items-center justify-center overflow-hidden"
          style={{
            left: "783px",
            top: "348px",
            width: "80px",
            height: "80px",
            boxShadow: "0px 32.88px 50.815px 11.956px rgba(0, 0, 0, 0.03)",
          }}
        >
          <span style={{ fontSize: "44px" }}>🚀</span>
        </div>

        {/* Waving Hand Icon Container */}
        <div 
          className="absolute rounded-full bg-white flex items-center justify-center overflow-hidden"
          style={{
            left: "455px",
            top: "520px",
            width: "80px",
            height: "80px",
            boxShadow: "0px 32.88px 50.815px 11.956px rgba(0, 0, 0, 0.03)",
          }}
        >
          <span style={{ fontSize: "44px" }}>👋</span>
        </div>
      </div>

      {/* Title Section - top: 200px in Figma */}
      <div className="flex flex-col gap-[28px] items-center relative z-10 pt-[200px]">
        {/* Title with blue gradient highlight */}
        <div className="relative inline-grid">
          <div 
            className="col-start-1 row-start-1 h-[24px] rounded-[8px]"
            style={{
              background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
              marginLeft: "0",
              marginTop: "20px",
              width: "292px",
            }}
          />
          <h2
            ref={refs.titleRef}
            onClick={() => handleItemClick("testimonialTitle")}
            className="col-start-1 row-start-1 font-semibold cursor-pointer text-center"
            style={{
              fontFamily: titleFont?.family || "Inter, sans-serif",
              fontSize: "48px",
              lineHeight: "60px",
              letterSpacing: "-1.44px",
              color: "#292929",
            }}
          >
            {landingPageData?.testimonialTitle || "Testimonials"}
          </h2>
        </div>

        {/* Subtitle */}
        <p
          ref={refs.subheaderRef}
          onClick={() => handleItemClick("testimonialSubheader")}
          className="cursor-pointer text-center"
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            color: "#7c7c7c",
            fontFamily: subheaderFont?.family || "Inter, sans-serif",
          }}
        >
          {landingPageData?.testimonialSubheader || "You don't have to take our word for it."}
        </p>
      </div>

      {/* Testimonial Cards - top: 664px in Figma (about 350px below title) */}
      <div className="flex gap-[40px] items-center justify-center relative z-10 mt-[280px] lg:mt-[350px] px-4 md:px-8">
        {visibleCards.map((testimonial, idx) => {
          const isActive = testimonial.position === 'active';
          const originalIndex = testimonial.originalIndex;

          return (
            <div
              key={`${originalIndex}-${testimonial.position}`}
              className={`flex flex-col overflow-hidden transition-all duration-300 ${
                isActive ? '' : 'opacity-50 hidden md:flex'
              }`}
              style={{
                width: isActive ? "416px" : "320px",
                borderRadius: isActive ? "24px" : "18px",
                boxShadow: isActive 
                  ? "0px 32.88px 50.815px 11.956px rgba(0, 0, 0, 0.03)"
                  : "0px 25.287px 39.08px 9.195px rgba(0, 0, 0, 0.03)",
                backgroundColor: isActive ? getColor("primary", 200) : "#ffffff",
              }}
              ref={(el) => {
                if (el && isActive) {
                  refs.testimonialRefs.current[originalIndex] = {
                    fullname: el.querySelector(".testimonial-fullname"),
                    role: el.querySelector(".testimonial-role"),
                    comment: el.querySelector(".testimonial-comment"),
                    avatar: el.querySelector(".testimonial-avatar"),
                  };
                }
              }}
            >
              {/* Body */}
              <div
                className="flex flex-col bg-white overflow-hidden"
                style={{
                  gap: isActive ? "32px" : "24px",
                  padding: isActive ? "32px 32px 48px 32px" : "24px 24px 40px 24px",
                  borderRadius: isActive ? "24px" : "18px",
                }}
              >
                {/* Quote Icon */}
                <QuoteIcon color={isActive ? getColor("primary", 200) : "#efefef"} size={isActive ? 80 : 60} />

                {/* Comment */}
                <p
                  className="testimonial-comment cursor-pointer"
                  onClick={() => handleItemClick(`testimonials[${originalIndex}].comment`)}
                  style={{
                    fontSize: isActive ? "18px" : "12px",
                    lineHeight: isActive ? "28px" : "20px",
                    color: isActive ? "#292929" : "#525252",
                    fontFamily: bodyFont?.family || "Inter, sans-serif",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: testimonial.comment?.replace?.(/\n/g, "<br>") || "",
                  }}
                />
              </div>

              {/* Bottom - User Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: isActive ? "24px 32px" : "16px 24px",
                  backgroundColor: isActive ? getColor("primary", 200) : "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: isActive ? "16px" : "12px" }}>
                  {/* Avatar */}
                  {testimonial.avatarEnabled !== false && (
                    <div
                      className="testimonial-avatar rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() => handleItemClick(`testimonials[${originalIndex}].avatar`)}
                      style={{
                        width: isActive ? "64px" : "48px",
                        height: isActive ? "64px" : "48px",
                        flexShrink: 0,
                      }}
                    >
                      <Img
                        src={testimonial.avatar || placholder}
                        alt={testimonial.fullname}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Name & Role */}
                  <div style={{ display: "flex", flexDirection: "column", gap: isActive ? "4px" : "2px" }}>
                    <p
                      className="testimonial-fullname font-semibold cursor-pointer"
                      onClick={() => handleItemClick(`testimonials[${originalIndex}].fullname`)}
                      style={{
                        fontSize: isActive ? "20px" : "16px",
                        lineHeight: "24px",
                        color: isActive ? "#004fa3" : "#292929",
                        fontFamily: titleFont?.family || "Inter, sans-serif",
                        margin: 0,
                      }}
                    >
                      {testimonial.fullname}
                    </p>
                    <p
                      className="testimonial-role cursor-pointer"
                      onClick={() => handleItemClick(`testimonials[${originalIndex}].role`)}
                      style={{
                        fontSize: isActive ? "16px" : "12px",
                        lineHeight: isActive ? "24px" : "20px",
                        color: isActive ? "#004fa3" : "#292929",
                        fontFamily: bodyFont?.family || "Inter, sans-serif",
                        margin: 0,
                      }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-[16px] items-center justify-center relative z-10 mt-12 pb-24">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="flex items-center justify-center rounded-full transition-all"
          style={{
            width: "44px",
            height: "44px",
            border: "1px solid #fbb693",
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
            border: "1px solid #fbb693",
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
  );
};

const Template3 = ({ landingPageData, fetchData }) => {
  const refs = useTestimonialHover();
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef(null);

  // Initialize testimonial refs array
  React.useEffect(() => {
    refs.testimonialRefs.current =
      landingPageData?.testimonials?.map(() => ({
        fullname: null,
        role: null,
        comment: null,
        avatar: null,
      })) || [];
  }, [landingPageData?.testimonials?.length]);

  // Determine if there are enough testimonials to show navigation
  const showNavigation = (landingPageData?.testimonials?.length || 0) > 
    (sliderRef?.current?.state?.itemsInSlide || 1);

  return (
    <div ref={refs.sectionRef}>
      <div className="flex justify-center bg-[#f5f5f2] py-24 mdx:py-5">
        <div className="container flex justify-center mdx:px-5">
          <div className="px-8 w-full smx:px-5">
            <div className="flex flex-col gap-12 items-center">
              <div ref={refs.titleRef}>
                <Heading
                  as="h2"
                  className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                >
                  {landingPageData?.testimonialTitle}
                </Heading>
              </div>
              <div ref={refs.subheaderRef}>
                <Heading
                  as="h4"
                  className="text-[24px] font-medium text-center tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                >
                  {landingPageData?.testimonialSubheader}
                </Heading>
              </div>
              <div className="flex flex-col gap-6 items-center self-stretch px-14 mdx:px-5">
                <div className="mx-auto flex w-[88%] gap-8 mdx:mx-0 mdx:w-full mdx:flex-col">
                  <Slider
                    autoPlay
                    autoPlayInterval={2000}
                    responsive={{
                      0: { items: 1 },
                      551: { items: 1 },
                      1051: { items: 2 },
                    }}
                    disableDotsControls
                    activeIndex={sliderState}
                    onSlideChanged={(e) => {
                      setSliderState(e?.item);
                    }}
                    ref={sliderRef}
                    className="pl-[1px]"
                    items={landingPageData?.testimonials?.map?.(
                      (testimonial, index) => (
                        <div className="px-4" key={index}>
                          <div
                            className="flex flex-col gap-[22px] rounded border border-solid border-[#eaecf0] bg-[#ffffff] p-6 smx:p-5"
                            ref={(el) => {
                              if (el) {
                                refs.testimonialRefs.current[index] = {
                                  fullname: el.querySelector(
                                    ".testimonial-fullname"
                                  ),
                                  role: el.querySelector(".testimonial-role"),
                                  comment: el.querySelector(
                                    ".testimonial-comment"
                                  ),
                                  avatar: el.querySelector(
                                    ".testimonial-avatar"
                                  ),
                                };
                              }
                            }}
                          >
                            {!!testimonial?.avatarEnabled && (
                              <div className="testimonial-avatar">
                                <Img
                                  src={testimonial.avatar || placholder}
                                  alt="Profile"
                                  className="h-[58px] w-[58px] rounded-[28px] object-cover"
                                />
                              </div>
                            )}
                            <div className="testimonial-fullname">
                              <Heading
                                size="headingmd"
                                as="h3"
                                className="text-[18px] font-semibold text-[#101828]"
                              >
                                {testimonial.fullname}
                              </Heading>
                            </div>
                            <div className="testimonial-role">
                              <Heading
                                size="headings"
                                as="h4"
                                className="text-[16px] font-semibold text-[#475467]"
                              >
                                {testimonial.role}
                              </Heading>
                            </div>
                            <div className="testimonial-comment">
                              <Text
                                as="p"
                                className="text-[14px] font-normal leading-5 text-[#475467]"
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: testimonial.comment.replace(
                                      /\n/g,
                                      "<br>"
                                    ),
                                  }}
                                />
                              </Text>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  />
                </div>
                {showNavigation && (
                  <div className="flex justify-center items-center">
                    {landingPageData?.testimonials?.map?.((_, i) => {
                      const itemsInSlide = sliderRef?.current?.state?.itemsInSlide || 1;
                      const shouldShowDot = i % itemsInSlide === 0 || i === 0;
                      
                      if (!shouldShowDot) return null;
                      
                      const isActive = sliderState >= i && 
                        sliderState < (i + itemsInSlide);
                      
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (sliderRef?.current) {
                              sliderRef.current.slideTo(i);
                            }
                          }}
                          className={`mr-[5px] inline-block h-[10px] w-[10px] cursor-pointer rounded-[50%] ${
                            isActive ? "bg-[#5207CD]" : "bg-[#cfd4dc]"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const refs = useTestimonialHover();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);
  const [visibleItemsCount, setVisibleItemsCount] = useState(1);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

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

  // Initialize testimonial refs array
  React.useEffect(() => {
    refs.testimonialRefs.current =
      landingPageData?.testimonials?.map(() => ({
        fullname: null,
        role: null,
        comment: null,
        avatar: null,
      })) || [];
  }, [landingPageData?.testimonials?.length]);

  // Prepare testimonials data
  const testimonials =
    landingPageData?.testimonials?.map((testimonial) => ({
      id: testimonial.id || Math.random().toString(36).substr(2, 9),
      name: testimonial.fullname || "Team Member",
      role: testimonial.role || "Role",
      image: testimonial.avatar || placholder,
      quote: testimonial.comment || "No testimonial provided",
      avatarEnabled: testimonial.avatarEnabled !== false, // Default to true if not specified
    })) || [];

  // If no testimonials are provided, use some defaults
  const defaultTestimonials = [
    {
      id: 1,
      name: "Alison Medis",
      role: "Project Manager",
      image: placholder,
      quote:
        "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling.",
      avatarEnabled: true,
    },
    {
      id: 2,
      name: "Michael Bright",
      role: "Project Manager",
      image: placholder,
      quote:
        "I feel valued as an employee and am proud to be part of a team that consistently strives for excellence.",
      avatarEnabled: true,
    },
    {
      id: 3,
      name: "Alison Medis",
      role: "Project Manager",
      image: placholder,
      quote:
        "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling.",
      avatarEnabled: true,
    },
    {
      id: 4,
      name: "Michael Bright",
      role: "Project Manager",
      image: placholder,
      quote:
        "I feel valued as an employee and am proud to be part of a team that consistently strives for excellence.",
      avatarEnabled: true,
    },
  ];

  const finalTestimonials =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  // Detect number of visible items based on screen size
  useEffect(() => {
    const updateVisibleItemsCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItemsCount(3); // lg screens
      } else if (window.innerWidth >= 768) {
        setVisibleItemsCount(2); // md screens
      } else {
        setVisibleItemsCount(1); // sm screens
      }
    };

    updateVisibleItemsCount();
    window.addEventListener('resize', updateVisibleItemsCount);
    return () => window.removeEventListener('resize', updateVisibleItemsCount);
  }, []);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (window.scrollTimeout) {
        clearTimeout(window.scrollTimeout);
      }
    };
  }, []);

  // Function to navigate directly to a specific slide
  const goToSlide = (index) => {
    if (sliderRef.current && cardRefs.current[index]) {
      const safeIndex = Math.max(0, Math.min(index, finalTestimonials.length - 1));
      setActiveSlide(safeIndex);
      setIsProgrammaticScroll(true);
      
      // Use the actual card position instead of calculated position
      const targetCard = cardRefs.current[safeIndex];
      if (targetCard) {
        const containerRect = sliderRef.current.getBoundingClientRect();
        const cardRect = targetCard.getBoundingClientRect();
        
        // On mobile (single item), center the card; on larger screens, align to start
        const isMobile = window.innerWidth < 768;
        let scrollPosition;
        
        if (isMobile) {
          // Center the card in the viewport
          const cardCenter = cardRect.left + cardRect.width / 2;
          const containerCenter = containerRect.left + containerRect.width / 2;
          scrollPosition = sliderRef.current.scrollLeft + (cardCenter - containerCenter);
        } else {
          // Align to start
          scrollPosition = sliderRef.current.scrollLeft + (cardRect.left - containerRect.left);
        }
        
        sliderRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        
        // Reset programmatic scroll flag after animation completes
        setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, 500);
      }
    }
  };

  // Handle automatic scrolling to the active slide (removed to prevent conflicts)
  // The goToSlide function now handles all navigation directly

  // Store refs for each card to track their offsetLeft
  const cardRefs = useRef([]);

  // Immediate scroll handler for real-time dot updates
  const handleScrollImmediate = React.useCallback(() => {
    if (sliderRef.current && !isDragging && !isProgrammaticScroll) {
      const containerRect = sliderRef.current.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      
      // Find the card that's closest to the center of the viewport
      let closestIdx = 0;
      let minDistance = Infinity;
      
      cardRefs.current.forEach((card, idx) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - containerCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestIdx = idx;
          }
        }
      });
      
      if (closestIdx !== activeSlide) {
        setActiveSlide(closestIdx);
      }
    }
  }, [isDragging, isProgrammaticScroll, activeSlide]);

  // Debounced scroll handler for final position
  const debouncedHandleScroll = React.useCallback(() => {
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(handleScrollImmediate, 10);
  }, [handleScrollImmediate]);

  // Mouse and touch event handlers for dragging
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
    const walk = (x - startX) * 2; // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsProgrammaticScroll(false);
    // Use a small delay to ensure the scroll position has settled
    setTimeout(() => {
      handleScrollImmediate();
    }, 10);
  };

  // Check if navigation should be shown
  const showNavigation = finalTestimonials.length > 1;

  // TestimonialCard component - with auto height adjustment
  const TestimonialCard = ({ testimonial, index }) => {
    return (
      <div
        className="flex overflow-hidden relative flex-col bg-[#FAFAFA] rounded-2xl p-5"
        ref={(el) => {
          if (el) {
            refs.testimonialRefs.current[index] = {
              fullname: el.querySelector(".testimonial-fullname"),
              role: el.querySelector(".testimonial-role"),
              comment: el.querySelector(".testimonial-comment"),
              avatar: testimonial.avatarEnabled
                ? el.querySelector(".testimonial-avatar")
                : null,
            };
          }
        }}
        style={{
          fontFamily: bodyFont?.family,
          color: "black"
        }}
      >
        {/* Header part - always same height */}
        <div className="flex items-center p-3 pb-3 m-4  bg-white rounded-full ">
          {testimonial.avatarEnabled && (
            <div className="mr-4 testimonial-avatar">
              <Img
                src={testimonial.image}
                alt={testimonial.name}
                className="rounded-full w-[50px] h-[50px] object-cover"
              />
            </div>
          )}
          <div>
            <h3
              className="text-lg font-bold testimonial-fullname"
              style={{
                fontFamily: bodyFont?.family
              }}
            >
              {testimonial.name}
            </h3>
            <p
              className="testimonial-role"
              
            >
              {testimonial.role}
            </p>
          </div>
        </div>

        <div className="flex-grow p-6 pt-0 pb-10" style={{ overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto' }}>
          <p
            className="leading-relaxed testimonial-comment"
            style={{ wordBreak: 'break-word' }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: testimonial.quote.replace(/\n/g, "<br>"),
              }}
            />
          </p>
          <div
            className="absolute -bottom-3 right-5 font-serif text-7xl leading-none opacity-40"
            style={{ color: getColor("primary", 500) }}
          >
            &#8221;
          </div>
        </div>
      </div>
    );
  };

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  return (
    <div
      ref={refs.sectionRef}
      className="px-4 py-16 w-full bg-white md:px-8"
      id="employee-testimonials"
      style={{color:"black"}}
    >
             <div className="mx-auto max-w-7xl px-4">
         <div className="mb-12 text-center">
           <div ref={refs.titleRef}>
             <h2
               className="mb-3 text-3xl font-bold md:text-4xl"
               style={{ 
                 fontFamily: subheaderFont?.family
                }}
             >
               {landingPageData?.testimonialTitle || "Testimonials"}
             </h2>
           </div>
           <div ref={refs.subheaderRef}>
        <p
              style={{
                fontFamily: subheaderFont?.family
              }}
              dangerouslySetInnerHTML={{
                __html: (landingPageData?.testimonialSubheader ?? "")?.replace?.(/\n/g, "<br>")
              }}
            >
            </p>
           </div>
         </div>

         {/* Testimonial Slider - Mobile uses snap-center for proper single-item centering */}
         <div className="relative overflow-hidden">
         <div
           ref={sliderRef}
           className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 px-4 md:px-6"
           style={{
             scrollbarWidth: "none",
             msOverflowStyle: "none",
             WebkitOverflowScrolling: "touch",
             scrollSnapType: "x mandatory",
           }}
          onScroll={() => {
            if (!isProgrammaticScroll) {
              handleScrollImmediate();
              debouncedHandleScroll();
            }
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
                     {finalTestimonials.map((testimonial, index) => (
             <div
               key={testimonial.id}
               className="flex-shrink-0 w-[85%] snap-center md:w-[calc(50%-1rem)] md:snap-start lg:w-[calc(33.333%-1rem)]"
               ref={el => cardRefs.current[index] = el}
             >
               <TestimonialCard testimonial={testimonial} index={index} />
             </div>
           ))}
        </div>
        </div>

        {/* ✅ Navigation Dots — OUTSIDE the scrollable div */}
        {showNavigation && (
          <div className="flex gap-2 justify-center mt-8">
            {finalTestimonials.map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => goToSlide(pageIndex)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    activeSlide === pageIndex
                      ? getColor("primary", 500)
                      : "#d1d5db"
                }}
                aria-label={`Go to slide ${pageIndex + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmployerTestimonial = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default EmployerTestimonial;
