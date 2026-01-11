import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

/**
 * Universal Story Template - Full-width image layout
 */

const imgHeroDefault = "/dhwise-images/placeholder.png";

export default function Variant4({ variant, brandData, landingPageData }) {
  const jobTitle = variant?.title ?? landingPageData?.vacancyTitle ?? "";
  const ctaText = variant?.callToAction ?? landingPageData?.applyButtonText ?? "Apply Now";

  // Check if this is a quote-based ad type (testimonial or employer-brand)
  const isQuoteAdType = variant?.adTypeId === 'testimonial' || variant?.adTypeId === 'employer-brand';

  // Quote fields for testimonial/employer-brand ads
  const quoteText = variant?.quoteText || "";
  const quoteAuthorName = variant?.quoteAuthorName || "";
  const quoteAuthorPosition = variant?.quoteAuthorPosition || "";

  // Use linkDescription only for non-quote ad types
  const linkDescription = isQuoteAdType ? "" : (variant?.linkDescription ?? "");

  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const videoUrl = variant?.videoUrl || "";
  const isCapture = typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);

  const heroImageAdjustment = variant?.imageAdjustment?.heroImage || landingPageData?.imageAdjustment?.heroImage || {};
  const heroObjectFit = heroImageAdjustment?.objectFit || "cover";
  const heroObjectPosition = variant?.heroImagePosition ||
    (heroImageAdjustment?.objectPosition ? `${heroImageAdjustment.objectPosition.x}% ${heroImageAdjustment.objectPosition.y}%` : "50% 50%");

  const { primaryColor, secondaryColor, getPrimary, getContrastColor } = useAdPalette({
    landingPageData,
    brandData
  });

  const ctaTextColor = getContrastColor(primaryColor);
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const [logoFailed, setLogoFailed] = React.useState(false);

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
  const titleFontSize = 56;

  // ===== QUOTE-BASED ADS (Testimonial / Employer Brand) =====
  if (isQuoteAdType) {
    const quoteLines = wrapText(quoteText, 35);
    const quoteFontSize = 28;
    const authorFontSize = 22;

    return (
      <div className="relative" style={{ width: "1080px", height: "1920px", backgroundColor: "#ffffff", overflow: "hidden" }}>
        {/* Title at top */}
        <div style={{
          position: "absolute",
          top: "60px",
          left: "60px",
          right: "120px",
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
          style={{ position: "absolute", top: "60px", right: "60px", zIndex: 10 }}
          width="45"
          height="45"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path d="M36 0V36H28.5V12L4.5 36L0 31.5L24 7.5H0V0H36Z" fill={secondaryColor} />
        </svg>

        {/* Full-width image */}
        <div style={{
          position: "absolute",
          top: titleLines.length > 2 ? "280px" : "240px",
          left: "60px",
          right: "60px",
          bottom: "60px",
          borderRadius: "12px",
          overflow: "hidden",
          border: `10px solid ${secondaryColor}`,
        }}>
          {/* Brand Logo on image */}
          <div style={{
            position: "absolute",
            top: "80px",
            left: "-10px",
            zIndex: 20,
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "10px 20px 10px 34px",
            borderRadius: "0 6px 6px 0",
          }}>
            {brandLogo && !logoFailed ? (
              <img
                src={brandLogo}
                alt={brandName}
                onError={() => setLogoFailed(true)}
                style={{ height: "56px", width: "auto", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
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

          {/* Quote overlay at bottom */}
          {quoteText && (
            <div style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              right: "24px",
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "10px",
              padding: "28px 32px",
              zIndex: 20,
            }}>
              <div style={{
                fontSize: `${quoteFontSize}px`,
                fontWeight: "500",
                fontFamily: "Arial, sans-serif",
                fontStyle: "italic",
                color: secondaryColor,
                lineHeight: "1.4",
                marginBottom: quoteAuthorName ? "16px" : "0",
              }}>
                "{quoteText}"
              </div>
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
          )}
        </div>
      </div>
    );
  }

  // ===== REGULAR ADS (Job, Company, Retargeting) =====
  return (
    <div className="relative" style={{ width: "1080px", height: "1920px", backgroundColor: "#ffffff", overflow: "hidden" }}>
      {/* Brand Logo */}
      <div style={{ position: "absolute", top: "60px", left: "60px", zIndex: 10 }}>
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            onError={() => setLogoFailed(true)}
            style={{ height: "50px", width: "auto", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "28px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
            {brandName}
          </span>
        )}
      </div>

      {/* Chevrons top right - aligned with title */}
      <svg
        style={{ position: "absolute", top: "140px", right: "60px", zIndex: 10 }}
        width="160"
        height="80"
        viewBox="0 0 160 80"
        fill="none"
      >
        <path d="M40 5L10 40L40 75" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M80 5L50 40L80 75" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M120 5L90 40L120 75" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M160 5L130 40L160 75" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: "140px",
        left: "60px",
        right: "200px",
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

      {/* CTA Button */}
      <div style={{
        position: "absolute",
        top: titleLines.length > 2 ? "380px" : "320px",
        left: "60px",
        zIndex: 10,
      }}>
        <div style={{
          backgroundColor: primaryColor,
          color: ctaTextColor,
          fontSize: "22px",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "1px",
          padding: "18px 36px",
          borderRadius: "6px",
          display: "inline-block",
        }}>
          {ctaText}
        </div>
      </div>

      {/* Arrow icon next to title */}
      <svg
        style={{ position: "absolute", top: titleLines.length > 2 ? "340px" : "280px", right: "200px", zIndex: 10 }}
        width="45"
        height="45"
        viewBox="0 0 36 36"
        fill="none"
      >
        <path d="M36 0V36H28.5V12L4.5 36L0 31.5L24 7.5H0V0H36Z" fill={secondaryColor} />
      </svg>

      {/* Full-width Image */}
      <div style={{
        position: "absolute",
        top: titleLines.length > 2 ? "420px" : "360px",
        left: "60px",
        right: "60px",
        bottom: "60px",
        borderRadius: "12px",
        overflow: "visible",
        border: `10px solid ${secondaryColor}`,
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
            style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition, borderRadius: "8px" }}
          />
        ) : (
          <img
            src={heroImage}
            alt="Background"
            style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition, borderRadius: "8px" }}
          />
        )}

        {/* Link Description overlay at top left of image */}
        {linkDescription && (
          <div style={{
            position: "absolute",
            top: "100px",
            left: "-10px",
            zIndex: 20,
          }}>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: "0 6px 6px 0",
              padding: "14px 24px 14px 30px",
              display: "inline-block",
            }}>
              <span style={{
                fontSize: "28px",
                fontWeight: "600",
                fontFamily: "Arial, sans-serif",
                color: secondaryColor,
              }}>
                {linkDescription}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chevrons bottom left overlapping image - pointing right */}
      <svg
        style={{ position: "absolute", bottom: "80px", left: "20px", zIndex: 25 }}
        width="200"
        height="100"
        viewBox="0 0 200 100"
        fill="none"
      >
        <path d="M5 5L35 50L5 95" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M45 5L75 50L45 95" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M85 5L115 50L85 95" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M125 5L155 50L125 95" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M165 5L195 50L165 95" stroke={secondaryColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}
