import React from "react";
import { Skeleton } from "antd";
import Image from "next/image.js";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.js";
import LinkedJobs from "./LinkedJobs.js";
import RecruiterContact from "./RecruiterContact.js";
import AboutCompany from "./AboutCompany.js";
import CompanyFacts from "./CompanyFacts.js";
import EmployerTestimonial from "./EmployerTestimonial.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import MetaPixel from "./MetaPixel.jsx";

// Grid pattern matching Figma design (64px squares + mask + highlighted blocks)
const MultiJobGridPattern = ({ primaryColor }) => {
  const gridSquares = [
    { top: "14%", left: "58%" },
    { top: "24%", left: "70%" },
    { top: "34%", left: "62%" },
    { top: "46%", left: "74%" },
    { top: "56%", left: "28%" },
    { top: "62%", left: "82%" },
    { top: "70%", left: "46%" },
    { top: "74%", left: "64%" },
    { top: "78%", left: "14%" },
    { top: "82%", left: "34%" },
    { top: "86%", left: "52%" },
    { top: "88%", left: "78%" }
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
              top: square.top,
              left: square.left,
              width: "64px",
              height: "64px",
              backgroundColor: "#FAFAFA",
              opacity: 0.35
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

  const scrollToJobs = () => {
    const jobsSection = document.getElementById("linked-jobs");
    if (jobsSection) jobsSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
        className="rounded-[32px] overflow-hidden relative"
        style={{ backgroundColor: primaryColor, minHeight: "500px" }}
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
        <div className="relative z-10 px-6 md:px-16 lg:px-20 py-10 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 items-center">
              {/* Text */}
              <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left">
                <h1
                  className="text-3xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-4 md:mb-6 tracking-tight"
                  style={{
                    fontFamily: titleFont?.family || "'DM Serif Display', serif",
                    color: titleColor
                  }}
                >
                  {heroTitle}
                </h1>
                <p
                  className="text-sm md:text-lg leading-[1.75] max-w-[500px] mb-6 md:mb-8"
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
                    backgroundColor: getColor("tertiary", 400),
                    color: "#1a1a2e",
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
                        : "50% 25%"
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
              <div className="hidden md:flex relative w-full justify-end">
                <div
                  className="relative w-full max-w-none lg:w-[600px] xl:w-[700px] 2xl:w-[800px]"
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
                        : "50% 25%"
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

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}>
      <ApplyCustomFont landingPageData={landingPageData} />
      <MetaPixel metaPixelId={landingPageData?.metaPixelId} />
      <NavBar landingPageData={landingPageData} isEdit={isEdit} fullscreen={fullscreen} showBackToEditButton={showBackToEditButton} setFullscreen={setFullscreen} />
      <MultiJobHeroSection landingPageData={landingPageData} isEdit={isEdit} />
      <LinkedJobs landingPageData={landingPageData} isEdit={isEdit} />
      {landingPageData?.showAboutCompany !== false && <AboutCompany landingPageData={landingPageData} />}
      {landingPageData?.showCompanyFacts !== false && <CompanyFacts landingPageData={landingPageData} />}
      {landingPageData?.showTestimonial !== false && <EmployerTestimonial landingPageData={landingPageData} />}
      {landingPageData?.showRecruiterContact !== false && <RecruiterContact landingPageData={landingPageData} />}
      <Footer landingPageData={landingPageData} />
    </div>
  );
};

export default MultiJobLandingPage;
