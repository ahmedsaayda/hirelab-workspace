import React, { useMemo } from "react";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import { ArrowDown, Sparkles } from "lucide-react";

/**
 * MultiJobHero - Modern hero section for multi-job career pages
 * Design inspired by "Let Your Talent Be Rewarded" screenshot
 */
const MultiJobHero = ({
  landingPageData,
  fetchData,
  isEdit = false,
}) => {
  const { titleFont, bodyFont } = useMemo(() => getFonts(landingPageData), [landingPageData]);

  const defaultColors = {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    tertiaryColor: "#a855f7",
  };

  const { getColor } = useTemplatePalette(defaultColors, {
    primaryColor: landingPageData?.primaryColor || defaultColors.primaryColor,
    secondaryColor: landingPageData?.secondaryColor || defaultColors.secondaryColor,
    tertiaryColor: landingPageData?.tertiaryColor || defaultColors.tertiaryColor,
  });

  const primaryColor = getColor("primary", 600);
  const primaryDark = getColor("primary", 800);
  const primaryLight = getColor("primary", 400);

  // Use multiJobHeroTitle or fallback to vacancyTitle
  const heroTitle = landingPageData?.multiJobHeroTitle || landingPageData?.vacancyTitle || "Join Our Team";
  const heroDescription = landingPageData?.heroDescription || "Discover exciting career opportunities and grow with us.";
  const heroImage = landingPageData?.heroImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80";
  const ctaText = landingPageData?.multiJobCtaText || "See Open Roles";
  const companyLogo = landingPageData?.companyLogo;
  const companyName = landingPageData?.companyName;

  // Split title into lines for dramatic effect (if title has multiple words)
  const titleWords = heroTitle.split(" ");
  const midPoint = Math.ceil(titleWords.length / 2);
  const titleLine1 = titleWords.slice(0, midPoint).join(" ");
  const titleLine2 = titleWords.slice(midPoint).join(" ");

  const scrollToJobs = () => {
    const jobsSection = document.getElementById("linked-jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculate text color for contrast
  const textColor = calculateTextColor(primaryColor);
  const isLightText = textColor === "#ffffff" || textColor === "white";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${primaryDark} 0%, ${primaryColor} 50%, ${primaryLight} 100%)`,
        }}
      />

      {/* Decorative grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large square outline bottom left */}
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-3xl border-2 opacity-20"
          style={{ borderColor: isLightText ? 'white' : 'black' }}
        />
        {/* Medium square bottom center */}
        <div 
          className="absolute bottom-10 left-1/4 w-40 h-40 rounded-2xl opacity-30"
          style={{ backgroundColor: primaryLight }}
        />
        {/* Connector shape */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-48 rounded-t-full opacity-40"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Small floating squares */}
        <div 
          className="absolute top-1/4 left-1/4 w-4 h-4 rounded opacity-30"
          style={{ backgroundColor: isLightText ? 'white' : primaryLight }}
        />
        <div 
          className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full opacity-20"
          style={{ backgroundColor: isLightText ? 'white' : primaryLight }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Text Content */}
          <div className="text-left">
            {/* Company logo/name badge */}
            {(companyLogo || companyName) && (
              <div className="flex items-center gap-3 mb-8">
                {companyLogo && (
                  <img 
                    src={companyLogo} 
                    alt={companyName || "Company"} 
                    className="h-10 w-auto object-contain"
                    style={{ filter: isLightText ? 'brightness(0) invert(1)' : 'none' }}
                  />
                )}
                {!companyLogo && companyName && (
                  <span 
                    className="text-lg font-semibold"
                    style={{ 
                      color: isLightText ? 'white' : primaryDark,
                      fontFamily: titleFont?.family 
                    }}
                  >
                    {companyName}
                  </span>
                )}
              </div>
            )}

            {/* Main Title - Large and Bold */}
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ 
                color: isLightText ? 'white' : '#1f2937',
                fontFamily: titleFont?.family 
              }}
            >
              {titleLine2 ? (
                <>
                  <span className="block">{titleLine1}</span>
                  <span className="block">{titleLine2}</span>
                </>
              ) : (
                heroTitle
              )}
            </h1>

            {/* Description */}
            <p 
              className="text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
              style={{ 
                color: isLightText ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)',
                fontFamily: bodyFont?.family 
              }}
            >
              {heroDescription}
            </p>

            {/* CTA Button */}
            <button
              onClick={scrollToJobs}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: isLightText ? 'white' : primaryDark,
                color: isLightText ? primaryDark : 'white',
                fontFamily: bodyFont?.family,
              }}
            >
              <span>{ctaText}</span>
              <ArrowDown 
                size={20} 
                className="transition-transform group-hover:translate-y-1" 
              />
            </button>
          </div>

          {/* Right - Hero Image */}
          <div className="relative">
            {/* Image container with decorative frame */}
            <div className="relative">
              {/* Decorative border/glow */}
              <div 
                className="absolute -inset-4 rounded-3xl opacity-30 blur-xl"
                style={{ backgroundColor: isLightText ? 'white' : primaryLight }}
              />
              
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Career opportunities"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                
                {/* Subtle gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(45deg, ${primaryColor} 0%, transparent 60%)`,
                  }}
                />
              </div>

              {/* Floating accent elements */}
              <div 
                className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ backgroundColor: primaryLight }}
              >
                <Sparkles 
                  size={32} 
                  style={{ color: isLightText ? 'white' : primaryDark }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiJobHero;




