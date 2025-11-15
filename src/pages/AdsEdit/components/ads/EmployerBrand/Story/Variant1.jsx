import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import { GridPattern } from "../../../../../Landingpage/HeroSection";

const HERO_FALLBACK = "/dhwise-images/placeholder.png";

const PauseIcon = ({ color = "#fff" }) => (
  <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" width="7" height="28" rx="2" fill={color} />
    <rect x="14.5" width="7" height="28" rx="2" fill={color} />
  </svg>
);

const SpeakerMuteIcon = ({ color = "#fff" }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.25 5.5L8.75 9.333H4.5C3.11929 9.333 2 10.4523 2 11.833V16.167C2 17.5477 3.11929 18.667 4.5 18.667H8.75L14.25 22.5V5.5Z"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M19 11L25 17" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M25 11L19 17" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const MenuDotsIcon = ({ color = "#fff" }) => (
  <svg width="30" height="6" viewBox="0 0 30 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: 3 }).map((_, index) => (
      <circle key={index} cx={index * 12 + 3} cy="3" r="3" fill={color} />
    ))}
  </svg>
);

export default function Variant1({ variant, brandData, landingPageData }) {
  const headlineRaw = variant?.title || landingPageData?.employerBrandTitle || "We Have Been Recognized";
  const heroImage = variant?.image || landingPageData?.heroImage || HERO_FALLBACK;
  const heroAdj = landingPageData?.imageAdjustment?.heroImage;
  const heroObjectFit = heroAdj?.objectFit || "cover";
  const heroObjectPosition = heroAdj?.objectPosition
    ? `${heroAdj.objectPosition.x}% ${heroAdj.objectPosition.y}%`
    : "50% 50%";
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = variant?.timeStamp || "14h";

  const { primaryColor, heroBackgroundColor, getPrimary } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);
  const gridMainColor = colord(getPrimary(300)).alpha(0.5).toRgbString();
  const gridLineColor = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const BORDER_WIDTH = 8;
  const CARD_RADIUS = 80; // equals 5rem at 16px base
  const borderGradient = `linear-gradient(180deg, ${getPrimary(500)} 0%, ${getPrimary(950)} 100%)`;

  // Two-line preferred headline behavior (balanced split with clamp to 2)
  const MAX_HEADLINE_CHARS = 60;
  const truncate = (s) => {
    if (!s) return s;
    if (s.length <= MAX_HEADLINE_CHARS) return s;
    const cut = s.slice(0, MAX_HEADLINE_CHARS);
    return cut.replace(/\s+\S*$/, "");
  };
  const headline = truncate(headlineRaw);
  const splitIntoTwoLines = (text) => {
    const words = (text || "").trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return null;
    const total = words.join("").length;
    const target = Math.ceil(total / 2);
    let idx = 1;
    let sum = 0;
    let best = Infinity;
    for (let i = 1; i < words.length; i++) {
      sum += words[i - 1].length;
      const d = Math.abs(sum - target);
      if (d < best) {
        best = d;
        idx = i;
      }
    }
    return [words.slice(0, idx).join(" "), words.slice(idx).join(" ")];
  };
  const forceTwo = splitIntoTwoLines(headline);
  const [titleSize, setTitleSize] = React.useState(108);
  const titleRef = React.useRef(null);
  const allowedLines = 2;
  React.useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    // start big and shrink until exactly two lines (or less)
    let size = 112;
    el.style.display = "block";
    el.style.WebkitLineClamp = "unset";
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
    const getLines = () => {
      const lh = Math.round(size * 1.1);
      return Math.ceil(el.scrollHeight / lh);
    };
    let guard = 0;
    while (guard < 120 && getLines() > allowedLines && size > 60) {
      size -= 2;
      el.style.fontSize = `${size}px`;
      el.style.lineHeight = `${Math.round(size * 1.1)}px`;
      guard += 1;
    }
    setTitleSize(size);
    // restore clamp
    el.style.display = "-webkit-box";
    el.style.WebkitLineClamp = String(allowedLines);
    el.style.maxHeight = `${Math.round(size * 1.1) * allowedLines}px`;
    el.style.overflow = "hidden";
  }, [headline]);

  const backgroundGradient = `linear-gradient(160deg, ${heroBackgroundColor || "#140035"} 0%, ${getPrimary(700)} 40%, ${getPrimary(
    900
  )} 100%)`;
  const chromeIconBg = "rgba(255,255,255,0.14)";

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1920px",
        background: backgroundGradient,
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Hero background pattern (softened) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <GridPattern
          gridColor={gridMainColor}
          gridLineColor={gridLineColor}
          backgroundColor="rgba(0,0,0,0)"
          gridSize={96}
          maxWidth={2000}
          style={{ borderRadius: 0, opacity: 0.25 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.18), rgba(20,0,45,0) 60%)",
        }}
      />

      {/* Top story chrome */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45px",
          width: "972px",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          zIndex: 3,
        }}
      >
        <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "5px", overflow: "hidden" }}>
          <div style={{ width: "82%", height: "100%", backgroundColor: "#ffffff", borderRadius: "5px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "102px",
                backgroundColor: "rgba(255,255,255,0.12)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.25)",
              }}
            >
              {brandLogo && !logoFailed ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span style={{ fontWeight: 600, fontSize: "40px", color: primaryColor || "#fff" }}>
                  {brandName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontWeight: 600, fontSize: "40px", lineHeight: 1 }}>{brandName}</span>
              <span style={{ fontWeight: 400, fontSize: "40px", color: "rgba(255,255,255,0.74)", lineHeight: 1 }}>{timePosted}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {[PauseIcon, SpeakerMuteIcon, MenuDotsIcon].map((Icon, index) => (
              <div
                key={index}
                style={{
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: chromeIconBg,
                }}
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Headline (2-line preferred) */}
      <div style={{ position: "absolute", left: "164px", top: "272px", width: "752px", zIndex: 2 }}>
        <h1
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: `${titleSize}px`,
            lineHeight: `${Math.round(titleSize * 1.1)}px`,
            letterSpacing: "-2.4px",
            textAlign: "center",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
          ref={titleRef}
        >
          {forceTwo ? (
            <>
              {forceTwo[0]}
              <br />
              {forceTwo[1]}
            </>
          ) : (
            headline
          )}
        </h1>
      </div>

      {/* Hero frame with top-only rounded gradient border */}
      <div
        style={{
          position: "absolute",
          left: "100px",
          top: "556px",
          width: "880px",
          height: "1364px",
          padding: `${BORDER_WIDTH}px ${BORDER_WIDTH}px 0 ${BORDER_WIDTH}px`, // top + sides only
          borderRadius: `${CARD_RADIUS}px ${CARD_RADIUS}px 0 0`,
          background: borderGradient,
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: `${CARD_RADIUS - BORDER_WIDTH}px ${CARD_RADIUS - BORDER_WIDTH}px 0 0`,
            overflow: "hidden",
            background: "#0000",
          }}
        >
          <img
            src={heroImage}
            alt="employer brand"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: heroObjectFit,
              objectPosition: heroObjectPosition,
            }}
          />
          {/* Subtle brand-colored bottom shadow (~20% height fade) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "20px",
              background: `linear-gradient(to top, ${colord(primaryColor || getPrimary(700)).alpha(0.6).toRgbString()} 0%, rgba(0,0,0,0) 100%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Removed vertical accent lines to avoid unwanted frame-like borders */}

    </div>
  );
}