import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

/**
 * Universal Portrait/Landscape Template - Full-width image layout
 */

const imgHeroDefault = "/dhwise-images/placeholder.png";

export default function Variant2({ variant, brandData, landingPageData }) {
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

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;

  const { primaryColor, secondaryColor, getPrimary, getContrastColor } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);
  const ctaTextColor = getContrastColor(primaryColor);

  // Helper to wrap text into lines
  const wrapText = (text, maxCharsPerLine = 18) => {
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
  const titleFontSize = 52;

  // ===== QUOTE-BASED ADS (Testimonial / Employer Brand) =====
  if (isQuoteAdType) {
    const quoteLines = wrapText(quoteText, 38);
    const quoteFontSize = 26;
    const authorFontSize = 20;

    return (
      <div className="relative" style={{ width: "1080px", height: "1350px", backgroundColor: "#ffffff", overflow: "hidden" }}>
        {/* Title at top */}
        <div style={{
          position: "absolute",
          top: "50px",
          left: "55px",
          right: "120px",
          zIndex: 10
        }}>
          <div style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: "900",
            fontFamily: "Arial Black, Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-1px",
            color: secondaryColor,
            lineHeight: "1.1",
          }}>
            {titleLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        {/* Arrow icon top right */}
        <svg
          style={{ position: "absolute", top: "50px", right: "55px", zIndex: 10 }}
          width="40"
          height="40"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path d="M36 0V36H28.5V12L4.5 36L0 31.5L24 7.5H0V0H36Z" fill={primaryColor} />
        </svg>

        {/* Full-width image */}
        <div style={{
          position: "absolute",
          top: `${50 + (titleLines.length * 60) + 20}px`,
          left: "55px",
          right: "55px",
          bottom: "55px",
          borderRadius: "10px",
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
            padding: "10px 18px 10px 28px",
            borderRadius: "0 5px 5px 0",
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

          {/* Quote overlay at bottom */}
          {quoteText && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "220px",
              right: "20px",
              backgroundColor: "rgba(255,255,255,0.75)",
              borderRadius: "8px",
              padding: "20px 24px",
              zIndex: 20,
              display: "flex",
              flexDirection: "row",
            }}>
              {/* Left spacer */}
              <div style={{ width: "50px", minWidth: "50px", flexShrink: 0 }} />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: `${quoteFontSize}px`,
                  fontWeight: "500",
                  fontFamily: "Arial, sans-serif",
                  fontStyle: "italic",
                  color: secondaryColor,
                  lineHeight: "1.4",
                  marginBottom: quoteAuthorName ? "14px" : "0",
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
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== REGULAR ADS (Job, Company, Retargeting) =====
  return (
    <div className="relative" style={{ width: "1080px", height: "1350px", backgroundColor: "#ffffff", overflow: "hidden" }}>
      {/* Brand Logo */}
      <div style={{ position: "absolute", top: "50px", left: "55px", zIndex: 10 }}>
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            onError={() => setLogoFailed(true)}
            style={{ height: "50px", width: "auto", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "26px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
            {brandName}
          </span>
        )}
      </div>

      {/* Arrow icon top right - aligned with title */}
      <svg
        style={{ position: "absolute", top: "120px", right: "55px", zIndex: 10 }}
        width="40"
        height="40"
        viewBox="0 0 36 36"
        fill="none"
      >
        <path d="M36 0V36H28.5V12L4.5 36L0 31.5L24 7.5H0V0H36Z" fill={primaryColor} />
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: "120px",
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
          color: secondaryColor,
          lineHeight: "1.1",
        }}>
          {titleLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Full-width Image - extends to bottom, starts right after title */}
      <div style={{
        position: "absolute",
        top: `${120 + (titleLines.length * 60) + 20}px`,
        left: "55px",
        right: "55px",
        bottom: "55px",
        borderRadius: "10px",
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

        {/* CTA Button - inside image at exact top left corner */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: 20,
        }}>
          <div style={{
            backgroundColor: primaryColor,
            color: ctaTextColor,
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            padding: "16px 32px",
            borderRadius: "0 0 5px 0",
            display: "inline-block",
          }}>
            {ctaText}
          </div>
        </div>

        {/* Link Description overlay below CTA */}
        {linkDescription && (
          <div style={{
            position: "absolute",
            top: "100px",
            left: "-8px",
            zIndex: 20,
          }}>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "0 6px 6px 0",
              padding: "14px 24px 14px 28px",
              display: "inline-block",
            }}>
              <span style={{
                fontSize: "26px",
                fontWeight: "600",
                fontFamily: "Arial, sans-serif",
                color: secondaryColor,
              }}>
                {linkDescription}
              </span>
            </div>
          </div>
        )}

        {/* White chevrons at bottom right - pointing left */}
        <svg
          style={{ position: "absolute", bottom: "30px", right: "30px", zIndex: 20 }}
          width="160"
          height="80"
          viewBox="0 0 160 80"
          fill="none"
        >
          <path d="M40 5L10 40L40 75" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
          <path d="M80 5L50 40L80 75" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
          <path d="M120 5L90 40L120 75" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
          <path d="M160 5L130 40L160 75" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
