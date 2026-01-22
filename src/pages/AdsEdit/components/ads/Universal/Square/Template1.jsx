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

  // Use linkDescription only for non-quote ad types (subheadline on image)
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



        {/* Full-width image with border */}
        <div style={{
          position: "absolute",
          top: titleLines.length > 2 ? "200px" : "180px",
          left: "55px",
          right: "55px",
          bottom: "55px",
          borderRadius: "8px",
          overflow: "hidden",
          border: `30px solid ${primaryColor}`,
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
                  color: primaryColor,
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
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== REGULAR ADS (Job, Company, Retargeting) =====
  // Layout: Logo + Title on white top, Image with border, CTA in corner of image (consistent with Story)
  return (
    <div className="relative" style={{ width: "1080px", height: "1080px", backgroundColor: "#ffffff", overflow: "hidden" }}>
      {/* Brand Logo */}
      <div style={{ position: "absolute", top: "40px", left: "55px", zIndex: 10 }}>
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            onError={() => setLogoFailed(true)}
            style={{ height: "50px", width: "auto", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "24px", fontWeight: "bold", fontFamily: "Arial", color: secondaryColor }}>
            {brandName}
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: "110px",
        left: "55px",
        right: "100px",
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

      {/* Full-width Image with border */}
      <div style={{
        position: "absolute",
        top: titleLines.length > 2 ? "280px" : "240px",
        left: "55px",
        right: "55px",
        bottom: "55px",
        borderRadius: "8px",
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
            style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition }}
          />
        ) : (
          <img
            src={heroImage}
            alt="Background"
            style={{ width: "100%", height: "100%", objectFit: heroObjectFit, objectPosition: heroObjectPosition }}
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
            left: "-8px",
            zIndex: 20,
          }}>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: "0 6px 6px 0",
              padding: "14px 24px 14px 28px",
              display: "inline-block",
            }}>
              <span style={{
                fontSize: "26px",
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
