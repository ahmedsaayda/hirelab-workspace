import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import useFitTextOneLine from "../../shared/useFitTextOneLine";

/**
 * Retargeting Ad Story Variant 1
 * Uses the same visual language as JobAd Story Variant1, but with retargeting defaults.
 */

// Image/icon assets (use public paths; no localhost)
const imgImage37 = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg"; // clock fallback

export default function Variant1({ variant, brandData, landingPageData }) {
  const rawTitle = variant?.title || landingPageData?.vacancyTitle || "Still Interested?";
  const labelText = landingPageData?.weAreHiring || "DON'T MISS OUT";
  const ctaText = variant?.callToAction || "Finish Application";

  const salaryMin = landingPageData?.salaryMin || 2500;
  const salaryMax = landingPageData?.salaryMax;
  const salaryCurrency = landingPageData?.salaryCurrency || "$";
  const salaryTime = landingPageData?.salaryTime || "month";
  const salaryRange = landingPageData?.salaryRange;
  const salaryAvailable = landingPageData?.salaryAvailable !== false;
  const salaryText = landingPageData?.salaryText || "Competitive Salary";

  const location = Array.isArray(landingPageData?.location)
    ? landingPageData.location[0]
    : landingPageData?.location || "Remote";

  const hoursMin = landingPageData?.hoursMin || 7;
  const hoursUnit = landingPageData?.hoursUnit || "daily";

  const heroImage = variant?.image || landingPageData?.heroImage || imgImage37;
  const videoUrl = variant?.videoUrl || "";
  const isCapture =
    typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const heroAdj = variant?.imageAdjustment?.heroImage || landingPageData?.imageAdjustment?.heroImage;
  const heroObjectFit = heroAdj?.objectFit || "cover";
  const heroObjectPosition = heroAdj?.objectPosition
    ? `${heroAdj.objectPosition.x}% ${heroAdj.objectPosition.y}%`
    : "50% 50%";
  const heroMirror = Boolean(heroAdj?.mirror);

  const { primaryColor, getGradient, getPrimary, getContrastColor } = useAdPalette({
    landingPageData,
    brandData,
  });

  const cardBgColor = getPrimary(800);
  const cardTextColor = getContrastColor(cardBgColor);
  const isCardLight = cardTextColor === "#000000";

  const titleColor = isCardLight ? "#101828" : "transparent";
  const titleGradient = isCardLight ? "none" : "linear-gradient(90deg, #B9ACFC 0%, #EEECFE 100%)";
  const subtitleColor = isCardLight ? "#475467" : "rgba(219, 213, 254, 0.92)";
  
  // Badge Styles
  const badgeCircleBg = isCardLight ? "#101828" : primaryColor; // Use dark circle if card is light, primary if card is dark
  const badgeIconFilter = isCardLight 
    ? "invert(1) brightness(2)" // White icon on dark circle
    : (getContrastColor(primaryColor) === "#ffffff" ? "brightness(0) invert(1)" : "none");

  const badgeTextColor = isCardLight ? "#101828" : getContrastColor(primaryColor);

  // CTA Button Contrast
  const ctaBgColor = getPrimary(500); // Approximate gradient mid-point
  const ctaTextColor = getContrastColor(ctaBgColor);
  const ctaFontSize = ctaText?.length > 9 ? 34 : 40;

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
    text: rawTitle,
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
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          left: "-28px",
          top: "-188px",
          width: "1476px",
          height: "2108px",
          overflow: "hidden",
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
            transform: heroMirror ? "scaleX(-1)" : "none",
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
              objectPosition: heroObjectPosition,
              transform: heroMirror ? "scaleX(-1)" : "none",
            }}
          />
        )}
      </div>

      {/* Vertical gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${colord(getPrimary(500))
            .alpha(0)
            .toRgbString()} 46%, ${colord(getPrimary(900)).alpha(0.92).toRgbString()} 101%)`,
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
            repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 172.533px)`,
        }}
      />

      {/* Accent block */}
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
          transform: "translateX(-50%)",
        }}
      />

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
          overflow: "hidden",
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
            pointerEvents: "none",
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
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
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
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <span aria-hidden style={{ fontSize: "40px", lineHeight: 1 }}>
              ⏱
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                fontSize: "32px",
                fontWeight: 500,
                lineHeight: "44px",
                color: subtitleColor,
                letterSpacing: "0.32px",
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              {labelText}
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
              background: titleGradient,
              WebkitBackgroundClip: isCardLight ? "border-box" : "text",
              WebkitTextFillColor: isCardLight ? titleColor : "transparent",
              backgroundClip: isCardLight ? "border-box" : "text",
              color: titleColor,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip",
              textAlign: "center",
            }}
            ref={titleRef}
          >
            {rawTitle}
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
            gap: "24px",
          }}
        >
          {[
            { text: formatSalary(), icon: imgCoinsStacked },
            { text: location, icon: imgVerticalContainer },
            { text: `${hoursMin} Hours / ${hoursUnit}`, icon: imgClock },
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
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 20px rgba(12, 9, 32, 0.22)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  backgroundColor: badgeCircleBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={icon}
                  alt="badge icon"
                  style={{
                    width: "20px",
                    height: "20px",
                    filter: badgeIconFilter,
                  }}
                />
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "28px",
                  fontWeight: 600,
                  color: badgeTextColor,
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
            // Meta Story/Reels UI safe-zone (native CTA / controls). Keep our CTA above it.
            bottom: "120px",
            transform: "translateX(-50%)",
            padding: "28px 64px",
            borderRadius: "120px",
            border: "none",
            background: getGradient("primary", "90deg", [400, 700]),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0px 18px 35px ${colord(getPrimary(900)).alpha(0.3).toRgbString()}`,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: `${ctaFontSize}px`,
              fontWeight: 700,
              color: ctaTextColor,
              letterSpacing: "-0.48px",
              whiteSpace: "nowrap",
            }}
          >
            {ctaText}
          </span>
        </button>
      </div>
    </div>
  );
}
