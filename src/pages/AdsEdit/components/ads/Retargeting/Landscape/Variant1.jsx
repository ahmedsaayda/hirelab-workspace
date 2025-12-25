import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";

/**
 * Retargeting Ad Landscape/Portrait (4:5) Variant 1
 * Based on Job Ad Landscape Variant 1 but with retargeting-specific copy defaults.
 */

// Image/icon assets (use public paths; no localhost)
const imgImage37 = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg"; // clock fallback

export default function Variant1({ variant, brandData, landingPageData }) {
  // Canvas
  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1350; // 4:5 Portrait
  const scaleY = (n) => Math.round((n / 1920) * CANVAS_HEIGHT);
  const scaleX = (n) => Math.round((n / 1080) * CANVAS_WIDTH);

  // Dynamic copy
  const rawTitle = variant?.title || "Still Interested?";
  const labelText = "DON'T MISS OUT";
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
    : landingPageData?.location || "Offenbach";

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

  const badgeTextColor = isCardLight ? "#101828" : getContrastColor(primaryColor);
  const badgeIconFilter = isCardLight && badgeTextColor === "#101828" ? "brightness(0)" : (getContrastColor(primaryColor) === "#ffffff" ? "brightness(0) invert(1)" : "none");

  // CTA Button Contrast
  const ctaBgColor = getPrimary(500); 
  const ctaTextColor = getContrastColor(ctaBgColor);

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;

  const [logoFailed, setLogoFailed] = React.useState(false);

  const mainTitle = rawTitle.replace(/\s{2,}/g, " ").trim();
  const MAX_TITLE_CHARS = 50;
  const truncateTitle = (text, max = MAX_TITLE_CHARS) => {
    if (!text) return text;
    if (text.length <= max) return text;
    const sliced = text.slice(0, max);
    return sliced.replace(/\s+\S*$/, "") + "...";
  };
  const titleText = truncateTitle(mainTitle);

  const splitIntoTwoLines = (text) => {
    const words = (text || "").trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return null;
    const totalChars = words.join("").length;
    const target = Math.ceil(totalChars / 2);
    let idx = 1;
    let sum = 0;
    let bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      sum += words[i - 1].length;
      const diff = Math.abs(sum - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        idx = i;
      }
    }
    return [words.slice(0, idx).join(" "), words.slice(idx).join(" ")];
  };
  const wordCount = (titleText || "").trim().split(/\s+/).filter(Boolean).length;
  const len = (titleText || "").length;
  // Default to 2 lines
  const allowedLines = wordCount > 3 && len > 30 ? 3 : 2;
  const forceTwoLines =
    allowedLines >= 2 && wordCount >= 2 && len <= 30
      ? splitIntoTwoLines(titleText)
      : null;

  const computeTitleFontSize = (text) => {
    const l = (text || "").length;
    if (l <= 14) return 108;
    if (l <= 22) return 98;
    if (l <= 30) return 88;
    if (l <= 36) return 78;
    if (l <= 42) return 70;
    return 64;
  };
  const initialTitleFontSize = computeTitleFontSize(titleText);
  const [dynamicTitleSize, setDynamicTitleSize] = React.useState(initialTitleFontSize);
  const titleRef = React.useRef(null);
  const titleLineHeight = Math.round(dynamicTitleSize * 1.07);

  React.useEffect(() => {
    setDynamicTitleSize(initialTitleFontSize);
  }, [titleText, initialTitleFontSize]);

  React.useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const shrinkToFit = () => {
      let size = dynamicTitleSize;
      const original = {
        display: el.style.display,
        WebkitLineClamp: el.style.WebkitLineClamp,
        maxHeight: el.style.maxHeight,
        overflow: el.style.overflow,
      };
      el.style.display = "block";
      el.style.WebkitLineClamp = "unset";
      el.style.maxHeight = "none";
      el.style.overflow = "visible";
      const getLines = () => {
        const lh = Math.round(size * 1.07);
        return Math.ceil(el.scrollHeight / lh);
      };
      let lines = getLines();
      let guard = 0;
      while (guard < 120 && lines > allowedLines && size > 54) {
        size -= 2;
        el.style.fontSize = `${size}px`;
        el.style.lineHeight = `${Math.round(size * 1.07)}px`;
        lines = getLines();
        guard += 1;
      }
      setDynamicTitleSize(size);
      el.style.display = original.display || "-webkit-box";
      el.style.WebkitLineClamp = String(allowedLines);
      el.style.maxHeight = `${Math.round(size * 1.07) * allowedLines}px`;
      el.style.overflow = "hidden";
    };
    const id = requestAnimationFrame(shrinkToFit);
    return () => cancelAnimationFrame(id);
  }, [titleText, allowedLines, dynamicTitleSize]);

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

  return (
    <div
      className="relative"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
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
          background: `linear-gradient(180deg, ${colord(getPrimary(500)).alpha(0).toRgbString()} 44%, ${colord(
            getPrimary(900)
          )
            .alpha(0.92)
            .toRgbString()} 100%)`,
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

      {/* Brand at top-left */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "80px",
          height: "45px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            style={{ height: "45px", width: "auto", objectFit: "contain" }}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "44px",
              color: "#ffffff",
              letterSpacing: "0.2px",
            }}
          >
            {brandName}
          </span>
        )}
      </div>

      {/* Accent block on the right */}
      <div
        style={{
          position: "absolute",
          left: "905px",
          top: "302px",
          width: "338px",
          height: "338px",
          backgroundColor: primaryColor,
          opacity: 0.7,
          borderRadius: "40px",
        }}
      />

      {/* Bottom content card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "880px",
          width: "905px",
          height: "470px",
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
        {/* Ellipse glow */}
        <div
          style={{
            position: "absolute",
            top: "-85px",
            left: "223px",
            width: "460px",
            height: "125px",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 75%)",
            filter: "blur(0.2px)",
          }}
        />

        {/* Left column: subtitle + title */}
        <div style={{ position: "absolute", left: "80px", top: "64px", width: "324px", height: "198px" }}>
          <div style={{ display: "flex", alignItems: "center", height: "36px" }}>
            <span aria-hidden style={{ fontSize: "36px", lineHeight: 1, marginRight: "16px" }}>
              ⏱
            </span>
            <span
              style={{
                marginTop: "6px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "22px",
                fontWeight: 500,
                color: subtitleColor,
                letterSpacing: "0.32px",
                textTransform: "uppercase",
              }}
            >
              {labelText}
            </span>
          </div>
          <div style={{ marginTop: "24px" }}>
            <h1
              style={{
                margin: 0,
                width: "324px",
                fontFamily: "'Inter', sans-serif",
                fontSize: `${dynamicTitleSize}px`,
                fontWeight: 700,
                lineHeight: `${titleLineHeight}px`,
                letterSpacing: "-1px",
                background: titleGradient,
                WebkitBackgroundClip: isCardLight ? "border-box" : "text",
                WebkitTextFillColor: isCardLight ? titleColor : "transparent",
                backgroundClip: isCardLight ? "border-box" : "text",
                color: titleColor,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: allowedLines,
                maxHeight: `${titleLineHeight * allowedLines}px`,
                overflow: "hidden",
              }}
              ref={titleRef}
            >
              {forceTwoLines ? (
                <>
                  {forceTwoLines[0]}
                  <br />
                  {forceTwoLines[1]}
                </>
              ) : (
                titleText
              )}
            </h1>
          </div>
        </div>

        {/* Right column: stacked badges */}
        <div
          style={{
            position: "absolute",
            left: "482px",
            top: "124px",
            width: "343px",
            height: "276px",
            display: "flex",
            flexDirection: "column",
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
                background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 20px rgba(12, 9, 32, 0.22)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
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
                  fontSize: "26px",
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

        {/* CTA Button */}
        <button
          style={{
            position: "absolute",
            left: "80px",
            top: "324px",
            width: "291px",
            height: "82px",
            padding: "0 24px",
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
              fontSize: "28px",
              fontWeight: 700,
              color: ctaTextColor,
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

