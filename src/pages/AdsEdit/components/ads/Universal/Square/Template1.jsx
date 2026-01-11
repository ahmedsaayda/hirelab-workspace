import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

const imgHeroDefault = "/dhwise-images/placeholder.png";

export default function Template1({ variant, brandData, landingPageData }) {
  const jobTitle = variant?.title ?? landingPageData?.vacancyTitle ?? "";
  const ctaText = variant?.callToAction ?? landingPageData?.applyButtonText ?? "Apply Now";

  // Check if this is a quote-based ad type (testimonial or employer-brand)
  const isQuoteAdType = variant?.adTypeId === 'testimonial' || variant?.adTypeId === 'employer-brand';

  // Quote fields for testimonial/employer-brand ads
  const quoteText = variant?.quoteText || "";
  const quoteAuthorName = variant?.quoteAuthorName || "";
  const quoteAuthorPosition = variant?.quoteAuthorPosition || "";

  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const videoUrl = variant?.videoUrl || "";
  const isCapture = typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);

  const heroImageAdjustment = variant?.imageAdjustment?.heroImage || landingPageData?.imageAdjustment?.heroImage || {};
  const heroObjectFit = heroImageAdjustment?.objectFit || "cover";
  const heroObjectPosition = variant?.heroImagePosition ||
    (heroImageAdjustment?.objectPosition ? `${heroImageAdjustment.objectPosition.x}% ${heroImageAdjustment.objectPosition.y}%` : "50% 50%");

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;

  const { primaryColor, secondaryColor, getPrimary, getContrastColor } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);
  const ctaTextColor = getContrastColor(primaryColor);

  // Helper to wrap text into lines
  const wrapText = (text, maxCharsPerLine = 20) => {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(word => {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const titleLines = wrapText(jobTitle, 18);
  const titleFontSize = 48;
  const titleLineHeight = titleFontSize * 1.1;

  // ===== QUOTE-BASED ADS (Testimonial / Employer Brand) =====
  // Layout: Title at top, full-width image below with quote overlay, NO CTA
  if (isQuoteAdType) {
    const quoteLines = wrapText(quoteText, 40);
    const quoteFontSize = 24;
    const quoteLineHeight = quoteFontSize * 1.3;
    const authorFontSize = 20;

    return (
      <div className="relative" style={{ width: "1080px", height: "1080px", backgroundColor: "#ffffff", overflow: "hidden" }}>
        {/* Title at top */}
        <div style={{
          position: "absolute",
          top: "40px",
          left: "55px",
          right: "100px",
          zIndex: 10
        }}>
          <div style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: "900",
            fontFamily: "Arial Black, Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-1px",
            color: primaryColor,
            lineHeight: "1.1",
          }}>
            {titleLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        {/* Arrow icon top right */}
        <svg
          style={{ position: "absolute", top: "40px", right: "55px", zIndex: 10 }}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path
            d="M36 0V36H28.5V12L4.5 36L0 31.5L24 7.5H0V0H36Z"
            fill={secondaryColor}
          />
        </svg>

        {/* Full-width image with border */}
        <div style={{
          position: "absolute",
          top: titleLines.length > 2 ? "200px" : "180px",
          left: "55px",
          right: "55px",
          bottom: "55px",
          borderRadius: "8px",
          overflow: "hidden",
          border: `8px solid ${secondaryColor}`,
        }}>
          {/* Brand Logo on image */}
          <div style={{
            position: "absolute",
            top: "80px",
            left: "-8px",
            zIndex: 20,
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "8px 16px 8px 28px",
            borderRadius: "0 4px 4px 0",
          }}>
            {brandLogo && !logoFailed ? (
              <img
                src={brandLogo}
                alt={brandName}
                onError={() => setLogoFailed(true)}
                style={{ height: "56px", width: "auto", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: "18px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
                {brandName}
              </span>
            )}
          </div>

          {/* Image/Video */}
          {isVideo && !videoFailed && !isCapture ? (
            <video
              src={videoUrl}
              crossOrigin="anonymous"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroImage}
              onError={() => setVideoFailed(true)}
              style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition }}
            />
          ) : (
            <img
              src={heroImage}
              alt="Background"
              style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition }}
            />
          )}

          {/* Quote overlay at bottom of image */}
          {quoteText && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
              backgroundColor: "rgba(255,255,255,0.75)",
              borderRadius: "8px",
              padding: "18px 20px",
              zIndex: 20,
              display: "flex",
              flexDirection: "row",
            }}>
              {/* Left spacer */}
              <div style={{ width: "50px", minWidth: "50px", flexShrink: 0 }} />

              {/* Content */}
              <div style={{ flex: 1 }}>
                {/* Quote text */}
                <div style={{
                  fontSize: `${quoteFontSize}px`,
                  fontWeight: "500",
                  fontFamily: "Arial, sans-serif",
                  fontStyle: "italic",
                  color: secondaryColor,
                  lineHeight: "1.4",
                  marginBottom: quoteAuthorName ? "12px" : "0",
                }}>
                  "{quoteText}"
                </div>

                {/* Author info */}
                {quoteAuthorName && (
                  <div>
                    <div style={{
                      fontSize: `${authorFontSize}px`,
                      fontWeight: "700",
                      fontFamily: "Arial, sans-serif",
                      color: secondaryColor,
                    }}>
                      {quoteAuthorName}
                    </div>
                    {quoteAuthorPosition && (
                      <div style={{
                        fontSize: `${authorFontSize - 2}px`,
                        fontWeight: "400",
                        fontFamily: "Arial, sans-serif",
                        color: secondaryColor,
                        opacity: 0.7,
                      }}>
                        {quoteAuthorPosition}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== REGULAR ADS (Job, Company, Retargeting) =====
  // Layout: Logo + Title on white top, Image with brand color bottom section, CTA at bottom
  return (
    <div className="relative" style={{ width: "1080px", height: "1080px", backgroundColor: "#ffffff", overflow: "hidden" }}>
      {/* Brand Logo */}
      <div style={{ position: "absolute", top: "40px", left: "55px", zIndex: 10 }}>
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            onError={() => setLogoFailed(true)}
            style={{ height: "45px", width: "auto", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "24px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
            {brandName}
          </span>
        )}
      </div>

      {/* Arrow icon top right - fixed position aligned with logo */}
      <svg
        style={{ position: "absolute", top: "40px", right: "55px", zIndex: 10 }}
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
      >
        <path
          d="M36 0V36H28.5V12L4.5 36L0 31.5L24 7.5H0V0H36Z"
          fill={secondaryColor}
        />
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: "100px",
        left: "55px",
        right: "120px",
        zIndex: 10,
      }}>
        <div style={{
          fontSize: `${titleFontSize}px`,
          fontWeight: "900",
          fontFamily: "Arial Black, Arial, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "-1px",
          color: primaryColor,
          lineHeight: "1.1",
        }}>
          {titleLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Bottom section with brand color background */}
      <div style={{
        position: "absolute",
        top: `${100 + (titleLines.length * 55) + 20}px`,
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: secondaryColor,
      }}>
        {/* Image with border - top aligned with brand color section */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "55px",
          right: "55px",
          bottom: "90px",
          borderRadius: "8px",
          overflow: "hidden",
          border: `8px solid ${secondaryColor}`,
        }}>
          {isVideo && !videoFailed && !isCapture ? (
            <video
              src={videoUrl}
              crossOrigin="anonymous"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroImage}
              onError={() => setVideoFailed(true)}
              style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition }}
            />
          ) : (
            <img
              src={heroImage}
              alt="Background"
              style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition }}
            />
          )}
        </div>

        {/* CTA Button - positioned in brand color bar below image */}
        <div style={{
          position: "absolute",
          bottom: "15px",
          left: "55px",
          zIndex: 20,
        }}>
          <div style={{
            backgroundColor: primaryColor,
            color: ctaTextColor,
            fontSize: "22px",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            padding: "18px 40px",
            borderRadius: "4px",
            display: "inline-block",
          }}>
            {ctaText}
          </div>
        </div>

        {/* White chevrons at bottom right - pointing right */}
        <svg
          style={{ position: "absolute", bottom: "20px", right: "55px", zIndex: 20 }}
          width="160"
          height="60"
          viewBox="0 0 160 60"
          fill="none"
        >
          <path d="M5 5L25 30L5 55" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M35 5L55 30L35 55" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M65 5L85 30L65 55" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M95 5L115 30L95 55" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M125 5L145 30L125 55" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
