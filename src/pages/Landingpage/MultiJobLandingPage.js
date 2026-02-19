import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "antd";
import Image from "next/image.js";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.js";
import LinkedJobs from "./LinkedJobs.js";
import RecruiterContact from "./RecruiterContact.js";
import AboutCompany from "./AboutCompany.js";
import CompanyFacts from "./CompanyFacts.js";
import EmployerTestimonial from "./EmployerTestimonial.js";
import CandidateProcess from "./CandidateProcess.js";
import LeaderIntroduction from "./LeaderIntroduction.js";
import GrowthPath from "./GrowthPath.js";
import Video from "./Video.js";
import TextBox from "./TextBox.js";
import Photos from "./Photos.js";
import EVPMission from "./EVPMission.js";
import Agenda from "./Agenda.js";
import JobSpecification from "./JobSpecification.js";
import JobDescription from "./JobDescription.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import MetaPixel from "./MetaPixel.jsx";
import eventEmitter from "../../utils/eventEmitter.js";
import { scrollToElement } from "./scrollUtils.js";

// Helper function to get image transform styles (zoom, mirror)
const getImageTransform = (adjustments) => {
  if (!adjustments) return 'none';
  const zoom = adjustments.zoom || 100;
  const mirrorX = adjustments.mirrorX || false;
  const mirrorY = adjustments.mirrorY || false;
  if (zoom === 100 && !mirrorX && !mirrorY) return 'none';
  return `scale(${zoom / 100})${mirrorX ? ' scaleX(-1)' : ''}${mirrorY ? ' scaleY(-1)' : ''}`;
};

// Responsive title sizing, capped at 2 lines (based on HeroSection.js behavior)
const useResponsiveTitleSize = (text, containerRef, maxLines = 2, initialSize = 56) => {
  const [fontSize, setFontSize] = useState(initialSize);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !text || typeof window === "undefined") return;

    const adjustFontSize = () => {
      const screenWidth =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const isMobile = screenWidth < 768;
      const textLength = text.length;
      const isSingleWord = !text.trim().includes(" ");

      let currentSize;
      if (isMobile) {
        if (textLength <= 18) currentSize = 32;
        else if (textLength <= 30) currentSize = 28;
        else if (textLength <= 45) currentSize = 24;
        else if (textLength <= 60) currentSize = 20;
        else if (textLength <= 80) currentSize = 18;
        else currentSize = 16;
      } else {
        if (textLength <= 18) currentSize = 64;
        else if (textLength <= 30) currentSize = 56;
        else if (textLength <= 45) currentSize = 48;
        else if (textLength <= 60) currentSize = 42;
        else if (textLength <= 80) currentSize = 36;
        else if (textLength <= 100) currentSize = 32;
        else currentSize = 28;
      }

      const containerWidth = Math.max(0, container.offsetWidth - 20);
      let testSize = currentSize;
      const longestWord =
        (text || "")
          .split(/\s+/)
          .filter(Boolean)
          .sort((a, b) => b.length - a.length)[0] || text;

      const tempElement = document.createElement("span");
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.whiteSpace = "nowrap";
      tempElement.style.fontFamily = container.style.fontFamily || "inherit";
      tempElement.textContent = longestWord;
      document.body.appendChild(tempElement);

      while (testSize > 14) {
        tempElement.style.fontSize = `${testSize}px`;
        if (tempElement.offsetWidth <= containerWidth) break;
        testSize -= 1;
      }

      document.body.removeChild(tempElement);
      currentSize = Math.min(currentSize, testSize);

      container.style.wordBreak = "keep-all";
      container.style.overflowWrap = "normal";
      container.style.whiteSpace = isSingleWord ? "nowrap" : "normal";
      container.style.hyphens = "none";
      container.style.webkitHyphens = "none";
      container.style.msHyphens = "none";
      container.style.mozHyphens = "none";

      setFontSize(currentSize);
    };

    adjustFontSize();

    let resizeTimeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(adjustFontSize, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("deviceChange", handleResize);

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("deviceChange", handleResize);
    };
  }, [text, containerRef, maxLines, initialSize]);

  return fontSize;
};

// Grid pattern matching Figma design (64px squares + mask + highlighted blocks)
const MultiJobGridPattern = ({ primaryColor }) => {
  const gridSize = 64;
  // Positions are in grid cells relative to the center of the hero
  const gridSquares = [
    { x: 2, y: -3 },
    { x: 4, y: -2 },
    { x: 3, y: -1 },
    { x: 5, y: 0 },
    { x: -2, y: 1 },
    { x: 6, y: 1 },
    { x: 0, y: 2 },
    { x: 3, y: 2 },
    { x: -4, y: 3 },
    { x: -1, y: 3 },
    { x: 1, y: 4 },
    { x: 5, y: 4 }
  ];

  return (
    <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(to right, rgba(220,220,220,0.6) 1px, transparent 1px), " +
            "linear-gradient(to bottom, rgba(220,220,220,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: "center",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0) 100%)"
        }}
      >
        {gridSquares.map((square, index) => (
          <div
            key={`grid-square-${index}`}
            style={{
              position: "absolute",
              top: `calc(50% + ${square.y * gridSize}px)`,
              left: `calc(50% + ${square.x * gridSize}px)`,
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              backgroundColor: "#FAFAFA",
              opacity: 0.35,
              transform: "translate(-32px, -32px)"
            }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, " +
            primaryColor +
            " 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, " +
            primaryColor +
            " 100%)"
        }}
      />
    </div>
  );
};

const MultiJobHeroSection = ({ landingPageData, isEdit = false }) => {
  const primaryColor = landingPageData?.primaryColor || "#2D1B69";
  const secondaryColor = landingPageData?.secondaryColor || "#7C3AED";
  const tertiaryColor = landingPageData?.tertiaryColor || "#8B5CF6";

  const { getColor } = useTemplatePalette(
    { primaryColor: "#2D1B69", secondaryColor: "#7C3AED", tertiaryColor: "#8B5CF6" },
    { primaryColor, secondaryColor, tertiaryColor }
  );

  const { titleFont, bodyFont } = getFonts(landingPageData);

  const heroTitle = landingPageData?.multiJobHeroTitle || landingPageData?.heroTitle || "Let Your Talent Be Rewarded";
  const heroDescription = landingPageData?.heroDescription || "We are an employee-owned, international organisation.";
  const heroImage = landingPageData?.heroImage || "/dhwise-images/placeholder.png";
  const ctaText = landingPageData?.multiJobCtaText || landingPageData?.ctaText || "See Open Roles";

  const titleColor = calculateTextColor(primaryColor, landingPageData?.yiqThreshold);
  // Button color should also be contrast-aware based on button background
  const buttonBgColor = getColor("tertiary", 400);
  const buttonTextColor = calculateTextColor(buttonBgColor, landingPageData?.yiqThreshold);
  
  const titleContainerRef = useRef(null);
  const titleFontSize = useResponsiveTitleSize(heroTitle, titleContainerRef, 2, 56);

  const scrollToJobs = () => {
    const jobsSection = document.getElementById("linked-jobs");
    if (jobsSection) {
      scrollToElement(jobsSection, 128, 24);
      return;
    }

    // Fallback for editor previews rendered inside iframes.
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      try {
        const target = iframe?.contentDocument?.getElementById("linked-jobs");
        if (target) {
          scrollToElement(target, 128, 24);
          return;
        }
      } catch (_) {
        // Ignore cross-origin/iframe access issues.
      }
    }
  };

  const clipPathId = "hero-l-shape-" + (landingPageData?._id || "default");

  return (
    <section className="relative w-full bg-white px-4 pt-4 pb-8 md:pb-32">
      {/* SVG clip-path - L-shape from Figma */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <path d="M0.2506,0.036 H0.9229 C0.9343,0.036,0.9435,0.0456,0.9435,0.0574 V0.766 C0.9435,0.778,0.9343,0.787,0.9229,0.787 H0.8047 L0.2656,0.78 C0.2509,0.78,0.2388,0.792,0.2388,0.807 V0.9438 C0.2388,0.9556,0.2296,0.9652,0.2182,0.9652 H0.0537 C0.0423,0.9652,0.033,0.9556,0.0331,0.9437 L0.0345,0.788 C0.0346,0.776,0.0438,0.767,0.0551,0.767 H0.2035 C0.2181,0.767,0.23,0.7544,0.23,0.7393 V0.0574 C0.23,0.0456,0.2392,0.036,0.2506,0.036 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Hero background */}
      <div
        className="rounded-[32px] overflow-visible relative min-h-[500px] md:min-h-[80vh]"
        style={{ backgroundColor: primaryColor, maxHeight: "900px" }}
      >
        {/* Grid pattern matching Figma */}
        <MultiJobGridPattern primaryColor={primaryColor} />

        {/* Top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[300px] md:h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at center top, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)",
            mixBlendMode: "plus-lighter"
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-16 py-10 md:py-16 overflow-visible">
          <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto overflow-visible">
            <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-center relative md:min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] md:pr-[34%] lg:pr-[32%]">
              {/* Text */}
              <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left md:w-[55%] lg:w-[52%] md:flex-shrink-0">
                <h1
                  ref={titleContainerRef}
                  className="text-3xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-4 md:mb-6 tracking-tight"
                  style={{
                    fontFamily: titleFont?.family || "'DM Serif Display', serif",
                    color: titleColor,
                    fontSize: `${titleFontSize}px`,
                    lineHeight: 1.1,
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}
                >
                  {heroTitle}
                </h1>
                <p
                  className="text-sm md:text-lg leading-[1.75] max-w-[600px] mb-6 md:mb-8"
                  style={{
                    fontFamily: bodyFont?.family || "Inter, sans-serif",
                    color: "rgba(220, 210, 240, 0.85)",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {heroDescription}
                </p>
                <button
                  onClick={scrollToJobs}
                  className="px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                    fontFamily: bodyFont?.family || "Inter, sans-serif"
                  }}
                >
                  {ctaText}
                </button>
              </div>

              {/* Mobile Image - no crop, centered, rounded corners */}
              <div className="relative w-full flex justify-center mt-4 md:hidden">
                <div className="relative w-[85%] max-w-[320px] rounded-3xl overflow-hidden">
                  <Image
                    src={heroImage}
                    alt="Team collaboration"
                    className="object-cover w-full h-full rounded-3xl"
                    style={{
                      objectPosition: landingPageData?.imageAdjustment?.heroImage?.objectPosition
                        ? landingPageData.imageAdjustment.heroImage.objectPosition.x + "% " + landingPageData.imageAdjustment.heroImage.objectPosition.y + "%"
                        : "50% 25%",
                      transform: getImageTransform(landingPageData?.imageAdjustment?.heroImage),
                    }}
                    width={400}
                    height={400}
                    sizes="85vw"
                    loading="eager"
                    priority
                  />
                </div>
              </div>

              {/* Desktop Image - L-shaped crop, much bigger */}
              <div className="hidden md:block absolute right-2 lg:right-6 xl:-right-10 2xl:-right-14 top-1/2 -translate-y-[45%] overflow-visible">
                <div
                  className="relative md:w-[520px] lg:w-[650px] xl:w-[780px] 2xl:w-[920px]"
                  style={{
                    aspectRatio: "850 / 819",
                    clipPath: "url(#" + clipPathId + ")",
                    WebkitClipPath: "url(#" + clipPathId + ")"
                  }}
                >
                  <Image
                    src={heroImage}
                    alt="Team collaboration"
                    className="object-cover w-full h-full"
                    style={{
                      objectPosition: landingPageData?.imageAdjustment?.heroImage?.objectPosition
                        ? landingPageData.imageAdjustment.heroImage.objectPosition.x + "% " + landingPageData.imageAdjustment.heroImage.objectPosition.y + "%"
                        : "50% 25%",
                      transform: getImageTransform(landingPageData?.imageAdjustment?.heroImage),
                    }}
                    width={850}
                    height={819}
                    sizes="(max-width: 1200px) 600px, 800px"
                    loading="eager"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Compute actual visible menu items for multi-job page based on rendered sections
const computeMultiJobMenuItems = (landingPageData) => {
  const sourceItems = Array.isArray(landingPageData?.menuItems) ? landingPageData.menuItems : [];
  const sourceByKey = new Map(sourceItems.map((item) => [item?.key, item]));
  const supported = [
    {
      key: "Linked Jobs",
      id: "linked-jobs",
      fallbackLabel: landingPageData?.jobsSectionTitle || "Open Positions",
      fallbackVisible: true,
    },
    {
      key: "About The Company",
      id: "about-the-company",
      fallbackLabel: landingPageData?.aboutTheCompanyTitle || "About Us",
      fallbackVisible: landingPageData?.showAboutCompany !== false,
    },
    {
      key: "Company Facts",
      id: "company-facts",
      fallbackLabel: landingPageData?.companyFactsTitle || "Why Join Us",
      fallbackVisible: landingPageData?.showCompanyFacts !== false,
    },
    {
      key: "Candidate Process",
      id: "candidate-process",
      fallbackLabel: landingPageData?.candidateProcessTitle || "Application Process",
      fallbackVisible: landingPageData?.showCandidateProcess !== false,
    },
    {
      key: "Employee Testimonials",
      id: "employee-testimonials",
      fallbackLabel: landingPageData?.testimonialTitle || "Testimonials",
      fallbackVisible: landingPageData?.showTestimonial === true,
    },
    {
      key: "Leader Introduction",
      id: "leader-introduction",
      fallbackLabel: landingPageData?.leaderIntroductionTitle || "Meet Our Leader",
      fallbackVisible: landingPageData?.showLeaderIntroduction === true,
    },
    {
      key: "Recruiter Contact",
      id: "recruiter-contact",
      fallbackLabel: landingPageData?.recruiterContactTitle || "Contact",
      fallbackVisible: landingPageData?.showRecruiterContact !== false,
    },
    {
      key: "Agenda",
      id: "agenda",
      fallbackLabel: landingPageData?.agendaTitle || "Agenda",
      fallbackVisible: false,
    },
    {
      key: "Job Specifications",
      id: "job-specifications",
      fallbackLabel: landingPageData?.jobSpecificationTitle || "Job Specifications",
      fallbackVisible: false,
    },
    {
      key: "Job Description",
      id: "job-description",
      fallbackLabel: landingPageData?.jobDescriptionTitle || "Job Description",
      fallbackVisible: false,
    },
    {
      key: "EVP / Mission",
      id: "evp-mission",
      fallbackLabel: landingPageData?.evpMissionTitle || "Our Mission",
      fallbackVisible: landingPageData?.showEvpMission === true,
    },
    {
      key: "Growth Path",
      id: "growth-path",
      fallbackLabel: landingPageData?.growthPathTitle || "Career Growth",
      fallbackVisible: landingPageData?.showGrowthPath === true,
    },
    {
      key: "Image Carousel",
      id: "image-carousel",
      fallbackLabel: landingPageData?.photoTitle || "Gallery",
      fallbackVisible: landingPageData?.showImageCarousel === true,
    },
    {
      key: "Video",
      id: "video",
      fallbackLabel: landingPageData?.videoTitle || "Video",
      fallbackVisible: landingPageData?.showVideo === true,
    },
    {
      key: "Text Box",
      id: "text-box",
      fallbackLabel: landingPageData?.textBoxTitle || "Discover More",
      fallbackVisible: landingPageData?.showTextBox === true,
    },
  ];

  const normalized = supported
    .map((entry, idx) => {
      const source = sourceByKey.get(entry.key);
      const active = source ? source.active !== false : entry.fallbackVisible;
      const visible = source ? source.visible !== false : entry.fallbackVisible;
      const sort = Number.isFinite(source?.sort) ? source.sort : idx + 1;
      return {
        id: entry.id,
        key: entry.key,
        label: source?.label || entry.fallbackLabel,
        active,
        visible,
        sort,
      };
    })
    .filter((item) => item.active && item.visible);

  return normalized.sort((a, b) => (a.sort || 0) - (b.sort || 0));
};

// Wrapper component for sections to handle click sync in edit mode
// The scroll handling is done by the child components internally via their own useHover hooks
const MultiJobSectionWrapper = ({ sectionKey, isEdit, children }) => {
  // Handle click to notify editor to switch active section
  const handleClick = (e) => {
    if (!isEdit) return;
    // Don't trigger if clicking on interactive elements
    if (e.target.tagName === "BUTTON" || e.target.tagName === "A" || e.target.tagName === "INPUT") {
      return;
    }
    // Emit event that LandingpageEdit listens for to set active key
    console.log("MultiJobSectionWrapper click, emitting setActiveKey:", sectionKey);
    eventEmitter.emit("setActiveKey", { key: sectionKey });
  };
  
  return (
    <div 
      onClick={handleClick}
      className={isEdit ? "cursor-pointer hover:outline hover:outline-2 hover:outline-blue-300 hover:outline-offset-2" : ""}
    >
      {children}
    </div>
  );
};

const MultiJobLandingPage = ({ landingPageData, isEdit = false, fullscreen = false, showBackToEditButton = false, setFullscreen }) => {
  const { bodyFont } = getFonts(landingPageData);

  if (!landingPageData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton active paragraph={{ rows: 20 }} />
        </div>
      </div>
    );
  }

  // Compute the actual visible menu items based on rendered sections
  const computedMenuItems = computeMultiJobMenuItems(landingPageData);
  const visibleSections = new Set(computedMenuItems.map((item) => item.key));
  
  // Create a modified landingPageData with correct menuItems for NavBar
  const navLandingPageData = {
    ...landingPageData,
    menuItems: computedMenuItems
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}>
      <ApplyCustomFont landingPageData={landingPageData} />
      <MetaPixel metaPixelId={landingPageData?.metaPixelId} />
      <NavBar landingPageData={navLandingPageData} isEdit={isEdit} fullscreen={fullscreen} showBackToEditButton={showBackToEditButton} setFullscreen={setFullscreen} isMultiJob={true} />
      
      <MultiJobSectionWrapper sectionKey="flexaligntop" isEdit={isEdit}>
        <MultiJobHeroSection landingPageData={landingPageData} isEdit={isEdit} />
      </MultiJobSectionWrapper>
      
      <MultiJobSectionWrapper sectionKey="Linked Jobs" isEdit={isEdit}>
        <LinkedJobs landingPageData={landingPageData} isEdit={isEdit} />
      </MultiJobSectionWrapper>
      
      {visibleSections.has("About The Company") && (
        <MultiJobSectionWrapper sectionKey="About The Company" isEdit={isEdit}>
          <AboutCompany landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Company Facts") && (
        <MultiJobSectionWrapper sectionKey="Company Facts" isEdit={isEdit}>
          <CompanyFacts landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Candidate Process") && (
        <MultiJobSectionWrapper sectionKey="Candidate Process" isEdit={isEdit}>
          <CandidateProcess landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}

      {visibleSections.has("Agenda") && (
        <div id="agenda">
          <MultiJobSectionWrapper sectionKey="Agenda" isEdit={isEdit}>
            <Agenda landingPageData={landingPageData} />
          </MultiJobSectionWrapper>
        </div>
      )}

      {visibleSections.has("Job Specifications") && (
        <div id="job-specifications">
          <MultiJobSectionWrapper sectionKey="Job Specifications" isEdit={isEdit}>
            <JobSpecification landingPageData={landingPageData} />
          </MultiJobSectionWrapper>
        </div>
      )}

      {visibleSections.has("Job Description") && (
        <div id="job-description">
          <MultiJobSectionWrapper sectionKey="Job Description" isEdit={isEdit}>
            <JobDescription landingPageData={landingPageData} />
          </MultiJobSectionWrapper>
        </div>
      )}
      
      {visibleSections.has("Employee Testimonials") && (
        <MultiJobSectionWrapper sectionKey="Employee Testimonials" isEdit={isEdit}>
          <EmployerTestimonial landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Leader Introduction") && (
        <MultiJobSectionWrapper sectionKey="Leader Introduction" isEdit={isEdit}>
          <LeaderIntroduction landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Growth Path") && (
        <MultiJobSectionWrapper sectionKey="Growth Path" isEdit={isEdit}>
          <GrowthPath landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Video") && (
        <MultiJobSectionWrapper sectionKey="Video" isEdit={isEdit}>
          <Video landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Text Box") && (
        <MultiJobSectionWrapper sectionKey="Text Box" isEdit={isEdit}>
          <TextBox landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Image Carousel") && (
        <MultiJobSectionWrapper sectionKey="Image Carousel" isEdit={isEdit}>
          <Photos landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("EVP / Mission") && (
        <MultiJobSectionWrapper sectionKey="EVP / Mission" isEdit={isEdit}>
          <EVPMission landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      {visibleSections.has("Recruiter Contact") && (
        <MultiJobSectionWrapper sectionKey="Recruiter Contact" isEdit={isEdit}>
          <RecruiterContact landingPageData={landingPageData} />
        </MultiJobSectionWrapper>
      )}
      
      <MultiJobSectionWrapper sectionKey="flexalign" isEdit={isEdit}>
        <Footer landingPageData={landingPageData} />
      </MultiJobSectionWrapper>
    </div>
  );
};

export default MultiJobLandingPage;
