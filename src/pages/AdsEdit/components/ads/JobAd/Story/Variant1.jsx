import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import useFitTextOneLine from "../../shared/useFitTextOneLine";

/**
 * Job Ad Story Variant 1 - Pixel-perfect recreation of the selected Figma frame.
 * The design includes the story UI header (progress bar, profile, controls)
 * inside the artboard, so this component renders everything exactly as shown
 * in Figma while keeping core text fields dynamic.
 */

// Image/icon assets (use public paths; no localhost)
const imgImage37 = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg"; // clock fallback
const ICONS_FALLBACK = ["⏸", "🔇", "⋯"]; // story controls fallback

export default function Variant1({ variant, brandData, landingPageData }) {
  // Dynamic copy (with fallbacks so preview always looks complete)
  const rawJobTitle = variant?.title || landingPageData?.vacancyTitle || "Project Manager";
  const weAreHiring = landingPageData?.weAreHiring || "WE'RE HIRING";
  const ctaText = variant?.callToAction || landingPageData?.applyButtonText || "Apply Now";

  const salaryMin = landingPageData?.salaryMin || 2500;
  const salaryMax = landingPageData?.salaryMax;
  const salaryCurrency = landingPageData?.salaryCurrency || "$";
  const salaryTime = landingPageData?.salaryTime || "month";
  const salaryRange = landingPageData?.salaryRange;
  const salaryAvailable = landingPageData?.salaryAvailable !== false;
  const salaryText = landingPageData?.salaryText || "Competitive Salary";

  const location = Array.isArray(landingPageData?.location)
    ? landingPageData.location[0]
    : landingPageData?.location || "Offenbach";

  const hoursMin = landingPageData?.hoursMin || 7;
  const hoursUnit = landingPageData?.hoursUnit || "daily";

  const heroImage = variant?.image || landingPageData?.heroImage || imgImage37;
  const heroAdj = landingPageData?.imageAdjustment?.heroImage;
  const heroObjectFit = heroAdj?.objectFit || "cover";
  const heroObjectPosition = heroAdj?.objectPosition
    ? `${heroAdj.objectPosition.x}% ${heroAdj.objectPosition.y}%`
    : "50% 50%";

  const { primaryColor, getGradient, getPrimary, getContrastColor } = useAdPalette({
    landingPageData,
    brandData
  });
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = "14h";

  const [logoFailed, setLogoFailed] = React.useState(false);

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
    cleaned = cleaned
      .replace(/[:;|•.\-–—]{2,}/g, ":")
      .replace(/^[\s:;|•.\-–—]+/, "")
      .replace(/[\s:;|•.\-–—]+$/, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    return cleaned;
  };
  const jobTitle = sanitizeJobTitle(rawJobTitle, weAreHiring);
  const MAX_TITLE_CHARS = 40;
  const truncateTitle = (text, max = MAX_TITLE_CHARS) => {
    if (!text) return text;
    if (text.length <= max) return text;
    const sliced = text.slice(0, max);
    return sliced.replace(/\s+\S*$/, "");
  };
  const jobTitleLimited = truncateTitle(jobTitle);

  const formatNumber = (value) => {
    if (typeof value === "string") return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
    text: jobTitleLimited,
    maxFontSize: 80,
    minFontSize: 28,
    step: 1,
    lineHeight: 1.1,
  });

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1920px",
        backgroundColor: getPrimary(500),
        overflow: "hidden"
      }}
    >
      {/* Background image (flipped exactly like Figma) */}
      <div
        style={{
          position: "absolute",
          left: "-28px",
          top: "-188px",
          width: "1476px",
          height: "2108px",
          overflow: "hidden"
        }}
      >
        <img
          src={heroImage}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: heroObjectFit,
            objectPosition: heroObjectPosition,
            transform: "rotate(180deg) scaleY(-1)"
          }}
        />
      </div>

      {/* Vertical gradient overlay (derives from primary palette instead of fixed purple) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${colord(getPrimary(500)).alpha(0).toRgbString()} 46%, ${colord(getPrimary(900)).alpha(0.92).toRgbString()} 101%)`
        }}
      />

      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          bottom: "-2397px",
          left: "calc(50% + 97px)",
          transform: "translateX(-50%)",
          width: "5176px",
          height: "3882px",
          opacity: 0.25,
          backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%),
            repeating-linear-gradient(to right, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 172.533px),
            repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 172.533px)`
        }}
      />

      {/* Accent block on the right */}
      <div
        style={{
          position: "absolute",
          left: "calc(50% + 630.5px)",
          top: "762px",
          width: "515px",
          height: "515px",
          backgroundColor: primaryColor,
          opacity: 0.7,
          borderRadius: "40px",
          transform: "translateX(-50%)"
        }}
      />

      {/* Top story UI (progress bar + profile + controls) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45px",
          width: "972px",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#d9d9d9",
            borderRadius: "5px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: "65%",
              height: "100%",
              backgroundColor: "#ffffff",
              borderRadius: "5px"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px"
            }}
          >
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "102px",
                backgroundColor: "#dbd5fe",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {brandLogo && !logoFailed ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "40px",
                    color: "#5e15eb"
                  }}
                >
                  {brandName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "40px",
                  color: "#ffffff",
                  lineHeight: 1
                }}
              >
                {brandName}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "40px",
                  color: "rgba(255,255,255,0.74)",
                  lineHeight: 1
                }}
              >
                {timePosted}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px"
            }}
          >
            {ICONS_FALLBACK.map((glyph, index) => (
              <div key={index} style={{
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
              }}>
                <span style={{ fontSize: "28px", color: "#fff", lineHeight: 1 }}>{glyph}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom content card */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "917px",
          height: "759px",
          background: getGradient("primary", "180deg", [600, 900]),
          borderTopRightRadius: "80px",
          boxShadow: `0px -20px 80px ${colord(getPrimary(900)).alpha(0.5).toRgbString()}`,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "88px 88px",
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-89px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "655px",
            height: "178px",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "96px",
            transform: "translateX(-50%)",
            width: "648px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px"
            }}
          >
            <span aria-hidden style={{ fontSize: "40px", lineHeight: 1 }}>👋</span>
            <p
              style={{
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                fontSize: "32px",
                fontWeight: 500,
                lineHeight: "44px",
                color: "rgba(219, 213, 254, 0.92)",
                letterSpacing: "0.32px",
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              {weAreHiring}
            </p>
          </div>

          <h1
            style={{
              margin: 0,
              width: "640px",
              fontFamily: "'Inter', sans-serif",
              fontSize: `${fittedTitleSize}px`,
              fontWeight: 600,
              lineHeight: "88px",
              letterSpacing: "-1.6px",
              background: "linear-gradient(90deg, #B9ACFC 0%, #EEECFE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip",
              textAlign: "center",
            }}
            ref={titleRef}
          >
            {jobTitleLimited}
          </h1>
        </div>

        <div
          style={{
            position: "absolute",
            top: "312px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "636px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "24px"
          }}
        >
          {[
            { text: formatSalary(), icon: imgCoinsStacked },
            { text: location, icon: imgVerticalContainer },
            { text: `${hoursMin} Hours / ${hoursUnit}`, icon: imgClock }
          ].map(({ text, icon }, idx) => (
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
                WebkitBackdropFilter: "blur(24px)"
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  backgroundColor: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <img src={icon} alt="badge icon" style={{ width: "20px", height: "20px", filter: getContrastColor(primaryColor) === "#ffffff" ? "brightness(0) invert(1)" : "none" }} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: getContrastColor(primaryColor),
                  letterSpacing: "-0.24px",
                  lineHeight: "32px",
                  whiteSpace: "nowrap"
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>

        <button
          style={{
            position: "absolute",
            left: "50%",
            bottom: "72px",
            transform: "translateX(-50%)",
            padding: "28px 64px",
            borderRadius: "120px",
            border: "none",
            background: getGradient("primary", "90deg", [400, 700]),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0px 18px 35px ${colord(getPrimary(900)).alpha(0.3).toRgbString()}`
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "40px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.48px"
            }}
          >
            {ctaText}
          </span>
        </button>
      </div>
    </div>
  );
}