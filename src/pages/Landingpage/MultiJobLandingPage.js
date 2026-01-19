import React, { useMemo } from "react";
import { Skeleton } from "antd";
import Image from "next/image.js";
import NavBar from "./NavBar.jsx";
import { GridPattern } from "./HeroSection.js";
import Footer from "./Footer.js";
import LinkedJobs from "./LinkedJobs.js";
import RecruiterContact from "./RecruiterContact.js";
import AboutCompany from "./AboutCompany.js";
import CompanyFacts from "./CompanyFacts.js";
import EmployerTestimonial from "./EmployerTestimonial.js";
import { getFonts } from "./getFonts.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import MetaPixel from "./MetaPixel.jsx";

const MultiJobHeroSection = ({ landingPageData, isEdit = false }) => {
  const primaryColor = landingPageData?.primaryColor || "#2D1B69";
  const secondaryColor = landingPageData?.secondaryColor || "#7C3AED";
  const tertiaryColor = landingPageData?.tertiaryColor || "#8B5CF6";

  const { getColor } = useTemplatePalette(
    { primaryColor: "#2D1B69", secondaryColor: "#7C3AED", tertiaryColor: "#8B5CF6" },
    { primaryColor, secondaryColor, tertiaryColor }
  );

  const { titleFont, bodyFont } = getFonts(landingPageData);

  const gridPatternProps = useMemo(() => ({
    gridColor: "#8B5CF680",
    gridLineColor: "#A78BFA20",
    backgroundColor: primaryColor,
    gridSize: 56,
    maxWidth: 1600,
    key: "multijob-hero-" + primaryColor + "-" + tertiaryColor
  }), [primaryColor, tertiaryColor]);

  const heroTitle = landingPageData?.multiJobHeroTitle || landingPageData?.heroTitle || "Let Your Talent Be Rewarded";
  const heroDescription = landingPageData?.heroDescription || "We are an employee-owned, international organisation.";
  const heroImage = landingPageData?.heroImage || "/dhwise-images/placeholder.png";
  const ctaText = landingPageData?.multiJobCtaText || landingPageData?.ctaText || "See Open Roles";

  const scrollToJobs = () => {
    const jobsSection = document.getElementById("linked-jobs");
    if (jobsSection) jobsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // CSS polygon for L-shaped visible area (inverted L cutout)
  // Cutout: top-left bar (0-25%, 0-70%) and bottom-right bar (25-100%, 70-100%)
  // Visible: top-right rectangle + bottom-left rectangle forming an L
  const lShapeClip = "polygon(25% 0%, 100% 0%, 100% 70%, 25% 70%, 25% 100%, 0% 100%, 0% 70%, 25% 70%, 25% 0%)";

  return (
    <section className="relative w-full bg-white px-4 pt-4 pb-16">
      {/* Hero background - FIXED height */}
      <div 
        className="rounded-[32px]" 
        style={{ 
          backgroundColor: primaryColor, 
          height: "75vh",
          minHeight: "550px",
          maxHeight: "700px",
          position: "relative"
        }}
      >
        <GridPattern key={gridPatternProps.key} gridColor={gridPatternProps.gridColor} gridLineColor={gridPatternProps.gridLineColor} backgroundColor={gridPatternProps.backgroundColor} gridSize={gridPatternProps.gridSize} maxWidth={gridPatternProps.maxWidth} />
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at center top, rgba(180,160,255,0.35) 0%, rgba(140,100,255,0.15) 40%, transparent 80%)" }} />

        {/* Content */}
        <div className="relative z-10 h-full px-8 md:px-16 lg:px-20 py-12 md:py-16">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center h-full">
              
              {/* Left content */}
              <div className="flex flex-col items-start justify-center order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: titleFont?.family || "'DM Serif Display', serif", background: "linear-gradient(180deg, #FFFFFF 0%, #D8CCF5 50%, #A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {heroTitle}
                </h1>
                <p 
                  className="text-base md:text-lg leading-[1.75] max-w-[500px] mb-8" 
                  style={{ 
                    fontFamily: bodyFont?.family || "Inter, sans-serif", 
                    color: "rgba(220, 210, 240, 0.85)",
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {heroDescription}
                </p>
                <button onClick={scrollToJobs} className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ backgroundColor: getColor("tertiary", 400), color: "#1a1a2e", fontFamily: bodyFont?.family || "Inter, sans-serif" }}>
                  {ctaText}
                </button>
              </div>

              {/* Right - Image with CSS polygon L-shape clip */}
              <div className="relative order-1 md:order-2 flex items-start justify-end" style={{ height: "100%" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "500px", marginTop: "20px" }}>
                  {/* Image container with CSS polygon clip-path */}
                  <div 
                    className="rounded-2xl overflow-hidden"
                    style={{ 
                      position: "relative", 
                      width: "100%", 
                      paddingBottom: "130%",
                      clipPath: lShapeClip,
                      WebkitClipPath: lShapeClip
                    }}
                  >
                    <Image 
                      src={heroImage} 
                      alt="Team collaboration" 
                      className="object-cover absolute inset-0 w-full h-full" 
                      style={{ 
                        objectPosition: landingPageData?.imageAdjustment?.heroImage?.objectPosition 
                          ? landingPageData.imageAdjustment.heroImage.objectPosition.x + "% " + landingPageData.imageAdjustment.heroImage.objectPosition.y + "%" 
                          : "50% 25%" 
                      }} 
                      width={500} 
                      height={650} 
                      sizes="(max-width: 768px) 100vw, 50vw" 
                      loading="eager" 
                      priority 
                    />
                  </div>
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
    return <div className="min-h-screen bg-white"><div className="max-w-7xl mx-auto px-4 py-8"><Skeleton active paragraph={{ rows: 20 }} /></div></div>;
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
