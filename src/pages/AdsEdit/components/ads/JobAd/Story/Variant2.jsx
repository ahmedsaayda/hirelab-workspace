import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import useFitTextOneLine from "../../shared/useFitTextOneLine";

/**
 * Job Ad Story Variant 2 – pixel-perfect match to Figma design.
 * Implements the concave right/bottom cutout using the arc-based approach
 * from JobDescription Template 1, with decorative bars and radial-gradient arcs
 * for smooth concave corners.
 */

// Assets (public paths)
const imgHeroDefault = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg"; // clock fallback

// Story controls (glyph fallbacks so they always render)
const ICONS_FALLBACK = ["⏸", "🔇", "⋯"];

export default function Variant2({ variant, brandData, landingPageData, showStoryChrome = true }) {
  // Dynamic fields
  const rawJobTitle = variant?.title || landingPageData?.vacancyTitle || "Project Manager";
  const weAreHiring = landingPageData?.weAreHiring || "WE’RE HIRING";
  const ctaText = variant?.callToAction || landingPageData?.applyButtonText || "Apply Now";

  const salaryMin = landingPageData?.salaryMin ?? 2500;
  const salaryMax = landingPageData?.salaryMax;
  const salaryRange = landingPageData?.salaryRange;
  const salaryAvailable = landingPageData?.salaryAvailable !== false;
  const salaryCurrency = landingPageData?.salaryCurrency || "$";
  const salaryTime = landingPageData?.salaryTime || "month";
  const salaryText = landingPageData?.salaryText || "Competitive Salary";

  const location = (Array.isArray(landingPageData?.location) && landingPageData.location[0])
    || landingPageData?.location || "Offenbach";
  const hoursMin = landingPageData?.hoursMin ?? 7;
  const hoursUnit = landingPageData?.hoursUnit || "daily";

  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const videoUrl = variant?.videoUrl || "";
  const isCapture =
    typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const heroObjectPosition = variant?.heroImagePosition || landingPageData?.heroImagePosition;
  const heroImageAdjustment =
    variant?.imageAdjustment?.heroImage ||
    landingPageData?.imageAdjustment?.jobDescriptionImage ||
    landingPageData?.imageAdjustment?.heroImage ||
    {};
  const fallbackObjectPosition = heroImageAdjustment?.objectPosition
    ? `${heroImageAdjustment.objectPosition.x}% ${heroImageAdjustment.objectPosition.y}%`
    : "50% 50%";
  const heroObjectFit = heroImageAdjustment?.objectFit || "cover";
  const heroMirror = Boolean(heroImageAdjustment?.mirror);

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;

  const { primaryColor, getPrimary, getContrastColor } = useAdPalette({ landingPageData, brandData });
  const primary500 = getPrimary(500);
  
  // Determine text visibility based on background contrast
  const contrastColor = getContrastColor(primary500);
  const isDarkBg = contrastColor === "#FFFFFF";

  const titleGradient = isDarkBg 
    ? "linear-gradient(90deg, #B9ACFC 0%, #EEECFE 100%)"
    : "none";
  
  const titleColor = isDarkBg ? "transparent" : "#101828";
  const subtitleColor = isDarkBg ? "#dbd5fe" : "#475467";

  // Badge styles
  const badgeCircleBg = isDarkBg ? "#FFFFFF" : "#101828";
  const badgeIconFilter = isDarkBg 
    ? "none" // Icon uses original color (usually colored), but we need to tint it to primary if it's an SVG mask? 
             // Actually images are SVGs. We might need to filter them to Primary color if circle is White.
    : "invert(1) brightness(2)"; // Make icon white if circle is dark

  // Wait, the icons are loaded as <img> tags src={icon}. They are white by default or colored?
  // imgCoinsStacked etc are usually colored SVGs or white?
  // Checking imports: /images3/img_coins_stacked_03.svg. Usually these are white strokes or colored.
  // If they are white strokes:
  // White Circle + White Icon = Invisible.
  // We need Dark/Colored Icon on White Circle.
  // We can use filter to colorize.
  
  const badgeTextColor = isDarkBg ? "#FFFFFF" : "#101828";
  
  // CTA Contrast + fit (keep single line)
  // Use getContrastColor against primary500 (button background) to decide text color
  const ctaTextColor = getContrastColor(primary500);
  const ctaFontSize = ctaText?.length > 9 ? 34 : 40;

  // Lighten the bottom overlay so the cropping effect remains visible
  const overlayGradient = `linear-gradient(180deg, ${colord(primary500).alpha(0).toRgbString()} 0%, ${colord(primary500).alpha(0.35).toRgbString()} 74%, ${colord(primary500).alpha(0.6).toRgbString()} 100%)`;

  const timePosted = "14h";
  const [logoFailed, setLogoFailed] = React.useState(false);

  const formatNumber = (value) => (typeof value === "string" ? value : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

  // Prevent "WE'RE HIRING" duplication inside the title
  const escapeRegExp = (s) => (s ? s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : s);
  const sanitizeJobTitle = (title, hiringText) => {
    if (!title) return title;
    const patterns = [
      escapeRegExp(hiringText),
      "we\\s*['’]?re\\s*hiring",
      "we\\s*are\\s*hiring",
    ].filter(Boolean);
    const regex = new RegExp(`\\b(?:${patterns.join("|")})\\b`, "ig");
    let cleaned = title.replace(regex, "");
    // Remove leading/trailing separators that may remain after phrase removal
    cleaned = cleaned
      // collapse repeated colons or separators
      .replace(/[:;|•.\-–—]{2,}/g, ":")
      // remove separators at the start
      .replace(/^[\s:;|•.\-–—]+/, "")
      // remove separators at the end
      .replace(/[\s:;|•.\-–—]+$/, "")
      // collapse extra spaces
      .replace(/\s{2,}/g, " ")
      .trim();
    return cleaned;
  };
  const jobTitle = sanitizeJobTitle(rawJobTitle, weAreHiring);
  const formatSalary = () => {
    if (!salaryAvailable) return salaryText;
    if (salaryRange && salaryMax) {
      return `${salaryCurrency}${formatNumber(salaryMin)} - ${salaryCurrency}${formatNumber(salaryMax)} / ${salaryTime}`;
    }
    return `${salaryCurrency}${formatNumber(salaryMin)} / ${salaryTime}`;
  };

  const titleRef = React.useRef(null);
  const fittedTitleSize = useFitTextOneLine({
    ref: titleRef,
    text: jobTitle,
    maxFontSize: 88,
    minFontSize: 28,
    step: 1,
    lineHeight: 1.09,
  });

  // Colors for badge icon and text to ensure readability against primary
  // Removed duplicate definition
  const shouldInvertIcon = badgeTextColor === "#ffffff";

  // Cutout geometry exported directly from Figma (job-ad-story-2)
  const CLUSTER_SIZE = 1178;
  const subtractPathD =
    "M1178 883.5C1178 908.523 1157.72 928.808 1132.69 928.808H307.714C282.691 928.808 262.406 949.093 262.406 974.115V1132.69C262.406 1157.72 242.121 1178 217.099 1178H45.3077C20.2849 1178 0 1157.72 0 1132.69V960.659C0 935.637 20.2849 915.352 45.3077 915.352H205.58C230.603 915.352 250.888 895.067 250.888 870.044V45.3077C250.888 20.2849 271.173 0 296.195 0H1132.69C1157.72 0 1178 20.2849 1178 45.3077V883.5Z";
  const maskSvg = `<svg width="${CLUSTER_SIZE}" height="${CLUSTER_SIZE}" viewBox="0 0 ${CLUSTER_SIZE} ${CLUSTER_SIZE}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="${subtractPathD}"/></svg>`;
  const maskDataUrl = React.useMemo(() => {
    try {
      return `data:image/svg+xml;base64,${btoa(maskSvg)}`;
    } catch (err) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}`;
    }
  }, [maskSvg]);

  return (
    <div
      className="relative"
      style={{ width: "1080px", height: "1920px", backgroundColor: getPrimary(500), overflow: "hidden" }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          bottom: "-2397px",
          left: "calc(50% + 41px)",
          transform: "translateX(-50%)",
          width: "5176px",
          height: "3882px",
          opacity: 0.23,
          backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 72%),
            repeating-linear-gradient(to right, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 2px, transparent 2px, transparent 172.533px),
            repeating-linear-gradient(to bottom, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 2px, transparent 2px, transparent 172.533px)`,
        }}
      />

      {/* Top story chrome (preview-only; use shared StoryFrame in Ads editor) */}
      {showStoryChrome && (
        <div
          style={{ position: "absolute", left: "50%", top: "45px", width: "972px", transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: "24px", zIndex: 3 }}
        >
        <div style={{ width: "100%", height: "6px", backgroundColor: "#d9d9d9", borderRadius: "5px", overflow: "hidden" }}>
          <div style={{ width: "65%", height: "100%", backgroundColor: "#ffffff", borderRadius: "5px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "102px", backgroundColor: "#dbd5fe", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {brandLogo && !logoFailed ? (
                <img src={brandLogo} alt={brandName} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setLogoFailed(true)} />
              ) : (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "40px", color: primaryColor }}>{brandName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "40px", color: "#ffffff", lineHeight: 1 }}>{brandName}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "40px", color: "rgba(255,255,255,0.74)", lineHeight: 1 }}>{timePosted}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {ICONS_FALLBACK.map((glyph, index) => (
              <div key={index} style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)" }}>
                <span style={{ fontSize: "28px", color: "#fff", lineHeight: 1 }}>{glyph}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* Typography + badges */}
      <div style={{ position: "absolute", top: "260px", left: "50%", transform: "translateX(-50%)", width: "711px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span aria-hidden style={{ fontSize: "40px", lineHeight: 1 }}>👋</span>
          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "36px", fontWeight: 400, lineHeight: "48px", color: subtitleColor, letterSpacing: "-0.72px", textTransform: "uppercase" }}>{weAreHiring}</p>
        </div>
        <h1
          ref={titleRef}
          style={{
            margin: 0,
            width: "711px",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: `${fittedTitleSize}px`,
            fontWeight: 600,
            lineHeight: "96px",
            letterSpacing: "-3.52px",
            background: titleGradient,
            WebkitBackgroundClip: isDarkBg ? "text" : "border-box",
            WebkitTextFillColor: isDarkBg ? "transparent" : titleColor,
            backgroundClip: isDarkBg ? "text" : "border-box",
            color: titleColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          {jobTitle}
        </h1>
        <div style={{ width: "634px", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "24px", zIndex: 2 }}>
          {[
            { icon: imgCoinsStacked, text: formatSalary() },
            { icon: imgVerticalContainer, text: location },
            { icon: imgClock, text: `${hoursMin} Hours / ${hoursUnit}` },
          ].map(({ icon, text }, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 20px",
                height: "76px",
                borderRadius: "16px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                // no visible border per design
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 20px rgba(12, 9, 32, 0.22)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div style={{ width: "44px", height: "44px", borderRadius: "22px", backgroundColor: badgeCircleBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img 
                  src={icon} 
                  alt="badge icon" 
                  style={{ 
                    width: "20px", 
                    height: "20px", 
                    // Assuming input icons are White/Light.
                    // If isDarkBg=true (Dark Background), we use White Circle. We need Dark Icon.
                    // If isDarkBg=false (Light Background), we use Dark Circle. We need White Icon.
                    filter: isDarkBg 
                      ? "invert(1) brightness(0)" // Force black icon on white circle
                      : "brightness(0) invert(1)" // Force white icon on dark circle
                  }} 
                />
              </div>
              <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 600, lineHeight: "32px", letterSpacing: "-0.24px", color: badgeTextColor, whiteSpace: "nowrap" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Masked image cluster with arc-based cutout (JobDescription Template1 exact approach) */}
      <div
        style={{
          position: "absolute",
          top: "766px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "flex-end",
          pointerEvents: "none",
          zIndex: 1,
          width: "100%",
          paddingRight: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${CLUSTER_SIZE}px`,
            height: `${CLUSTER_SIZE}px`,
            transform: heroMirror ? "scaleX(-1)" : "none",
            transformOrigin: "center",
            marginRight: "-170px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              WebkitMaskImage: `url(${maskDataUrl})`,
              maskImage: `url(${maskDataUrl})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: heroMirror ? "scaleX(-1)" : "none",
                transformOrigin: "center",
              }}
            >
              <img
                src={heroImage}
                alt={jobTitle}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: heroObjectFit,
                  objectPosition: heroObjectPosition || fallbackObjectPosition,
                  transition: "object-position 0.3s ease-in-out",
                }}
              />
              {!isCapture && isVideo && !videoFailed && (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={heroImage}
                  onError={() => setVideoFailed(true)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: heroObjectFit,
                    objectPosition: heroObjectPosition || fallbackObjectPosition,
                    transition: "object-position 0.3s ease-in-out",
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: overlayGradient,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    `repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 88px), repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 88px)`,
                  opacity: 0.12,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button style={{ position: "absolute", bottom: "90px", left: "50%", transform: "translateX(-50%)", padding: "32px 64px", width: "331px", height: "93px", border: "none", borderRadius: "100px", backgroundColor: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0px 24px 48px rgba(25, 2, 76, 0.3)", zIndex: 20 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: `${ctaFontSize}px`, fontWeight: 600, lineHeight: "52px", letterSpacing: "-0.8px", color: ctaTextColor, whiteSpace: "nowrap" }}>{ctaText}</span>
      </button>
    </div>
  );
}
