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

  // With 40 char headline limit, use 20 chars per line = 2 lines max
  const titleLines = wrapText(jobTitle, 20);
  const titleFontSize = 56;

  // ===== QUOTE-BASED ADS (Testimonial / Employer Brand) =====
  // Safe zone: Instagram story UI (progress bars + profile) takes ~280px from top
  if (isQuoteAdType) {
    const quoteLines = wrapText(quoteText, 35);
    const quoteFontSize = 28;
    const authorFontSize = 22;

    return (
      <div className="relative" style={{ width: "1080px", height: "1920px", backgroundColor: "#ffffff", overflow: "hidden" }}>
        {/* Brand Logo - positioned below Instagram story UI safe zone */}
        <div style={{ position: "absolute", top: "300px", left: "60px", zIndex: 10 }}>
          {brandLogo && !logoFailed ? (
            <img
              src={brandLogo}
              alt={brandName}
              onError={() => setLogoFailed(true)}
              style={{ height: "70px", width: "auto", objectFit: "contain" }}
            />
          ) : (
            <span style={{ fontSize: "32px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
              {brandName}
            </span>
          )}
        </div>

        {/* Title - with breathing room below logo */}
        <div style={{
          position: "absolute",
          top: "400px",
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

        {/* Full-width image - moved down for breathing room */}
        <div style={{
          position: "absolute",
          top: titleLines.length > 2 ? "620px" : "560px",
          left: "60px",
          right: "60px",
          bottom: "60px",
          borderRadius: "12px",
          overflow: "hidden",
          border: `30px solid ${primaryColor}`,
        }}>

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

          {/* Quote overlay - positioned slightly below center for safe zone */}
          {quoteText && (
            <div style={{
              position: "absolute",
              top: "55%",
              left: "24px",
              right: "24px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.75)",
              borderRadius: "10px",
              padding: "28px 32px",
              zIndex: 20,
            }}>
              <div style={{
                fontSize: `${quoteFontSize}px`,
                fontWeight: "500",
                fontFamily: "Arial, sans-serif",
                fontStyle: "italic",
                color: primaryColor,
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
                    color: primaryColor,
                  }}>
                    {quoteAuthorName}
                  </div>
                  {quoteAuthorPosition && (
                    <div style={{
                      fontSize: `${authorFontSize - 2}px`,
                      fontWeight: "400",
                      fontFamily: "Arial, sans-serif",
                      color: primaryColor,
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
  // Safe zone: Instagram story UI (progress bars + profile) takes ~280px from top
  return (
    <div className="relative" style={{ width: "1080px", height: "1920px", backgroundColor: "#ffffff", overflow: "hidden" }}>
      {/* Brand Logo - positioned below Instagram story UI safe zone */}
      <div style={{ position: "absolute", top: "300px", left: "60px", zIndex: 10 }}>
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            onError={() => setLogoFailed(true)}
            style={{ height: "70px", width: "auto", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "32px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
            {brandName}
          </span>
        )}
      </div>

      {/* Title - with breathing room below logo */}
      <div style={{
        position: "absolute",
        top: "400px",
        left: "60px",
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

      {/* Full-width Image - moved down for breathing room */}
      <div style={{
        position: "absolute",
        top: titleLines.length > 2 ? "620px" : "560px",
        left: "60px",
        right: "60px",
        bottom: "60px",
        borderRadius: "12px",
        overflow: "hidden",
        border: `30px solid ${primaryColor}`,
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

        {/* CTA Button - inside image at top left corner */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: 20,
        }}>
          <div style={{
            backgroundColor: secondaryColor,
            color: ctaTextColor,
            fontSize: "22px",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            padding: "18px 36px",
            borderRadius: "0 0 8px 0",
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
                color: primaryColor,
              }}>
                {linkDescription}
              </span>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
