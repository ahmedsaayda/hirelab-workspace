import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";

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

export default function Variant1({ variant, brandData, landingPageData, showStoryChrome = true }) {
  const titleRaw =
    variant?.title ||
    landingPageData?.aboutCompanyTitle;
  const tag = variant?.linkDescription || landingPageData?.aboutCompanyTag;
  const heroImage = variant?.image || landingPageData?.heroImage || HERO_FALLBACK;
  const videoUrl = variant?.videoUrl || "";
  const isCapture =
    typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const heroAdj = variant?.imageAdjustment?.heroImage || landingPageData?.imageAdjustment?.heroImage;
  const heroObjectFit = heroAdj?.objectFit || "cover";
  const heroObjectPosition = heroAdj?.objectPosition
    ? `${heroAdj.objectPosition.x}% ${heroAdj.objectPosition.y}%`
    : "50% 30%";
  const heroMirror = Boolean(heroAdj?.mirror);

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = variant?.timeStamp || "14h";

  const { primaryColor, heroBackgroundColor, getPrimary, getContrastColor } = useAdPalette({
    landingPageData,
    brandData,
  });
  const [logoFailed, setLogoFailed] = React.useState(false);

  const chromeIconBg = "rgba(255,255,255,0.14)";
  const bottomPanelColor = getPrimary(900);
  const textColor = getContrastColor(bottomPanelColor);
  const isLight = textColor === "#000000" || textColor === "#101828";
  
  const tileLine = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const tileFill = colord(getPrimary(400)).alpha(0.08).toRgbString();
  const PANEL_RADIUS = 80;

  // Two-line preferred headline behavior (balanced split with clamp to 2)
  const MAX_HEADLINE_CHARS = 64;
  const truncate = (s) => {
    if (!s) return s;
    if (s.length <= MAX_HEADLINE_CHARS) return s;
    const cut = s.slice(0, MAX_HEADLINE_CHARS);
    return cut.replace(/\s+\S*$/, "");
  };
  const title = truncate(titleRaw);
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
  const forceTwo = splitIntoTwoLines(title);
  const [titleSize, setTitleSize] = React.useState(80);
  const titleRef = React.useRef(null);
  const allowedLines = 2;
  React.useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    // start big and shrink until exactly two lines (or less)
    let size = 92;
    el.style.display = "block";
    el.style.WebkitLineClamp = "unset";
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
    const getLines = () => {
      const lh = Math.round(size * 1.1);
      return Math.ceil(el.scrollHeight / lh);
    };
    let guard = 0;
    while (guard < 120 && getLines() > allowedLines && size > 52) {
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
  }, [title]);

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1920px",
        background: heroBackgroundColor || getPrimary(600),
        overflow: "hidden",
        color: textColor,
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Top story chrome (preview-only; use shared StoryFrame in Ads editor) */}
      {showStoryChrome && (
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
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "88%", height: "100%", backgroundColor: "#ffffff", borderRadius: "5px" }} />
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
                  <span style={{ fontWeight: 600, fontSize: "40px", color: primaryColor || textColor }}>
                    {brandName?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 600, fontSize: "40px", lineHeight: 1 }}>{brandName}</span>
                <span style={{ fontWeight: 400, fontSize: "40px", color: colord(textColor).alpha(0.74).toRgbString(), lineHeight: 1 }}>
                  {timePosted}
                </span>
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
      )}

      {/* Hero image */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "1080px", height: "1480px", overflow: "hidden" }}>
        <img
          src={heroImage}
          alt="about company"
          style={{
            position: "absolute",
            inset: 0,
            width: "120%",
            height: "120%",
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
              width: "120%",
              height: "120%",
              objectFit: heroObjectFit,
              objectPosition: heroObjectPosition,
                transform: heroMirror ? "scaleX(-1)" : "none",
            }}
          />
        )}
        {/* bottom fade for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 60%, ${colord(getPrimary(950)).alpha(0.85).toRgbString()} 100%)`,
          }}
        />
      </div>

      {/* Accent square */}
      <div
        style={{
          position: "absolute",
          right: "106px",
          top: "948px",
          width: "338px",
          height: "338px",
          background: `linear-gradient(180deg, ${getPrimary(400)} 0%, ${getPrimary(700)} 100%)`,
          opacity: 0.85,
          borderRadius: "56px",
          zIndex: 4,
        }}
      />

      {/* Bottom panel with tile pattern */}
      <div style={{ position: "absolute", left: 0, top: 1117, width: 1080, height: 803 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: `${PANEL_RADIUS}px`,
            borderTopRightRadius: `${PANEL_RADIUS}px`,
            overflow: "hidden",
            background: bottomPanelColor,
          }}
        />
        {/* tiled squares */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: `${PANEL_RADIUS}px`,
            borderTopRightRadius: `${PANEL_RADIUS}px`,
            overflow: "hidden",
            backgroundImage: `
              linear-gradient(${tileFill}, ${tileFill}),
              linear-gradient(transparent 0, transparent 100%),
              linear-gradient(transparent 0, transparent 100%)
            `,
            backgroundSize: "172.533px 172.533px, 172.533px 172.533px, 172.533px 172.533px",
            backgroundPosition: "0 0, 0 0, 0 0",
            backgroundRepeat: "repeat",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: `${PANEL_RADIUS}px`,
            borderTopRightRadius: `${PANEL_RADIUS}px`,
            overflow: "hidden",
            backgroundImage: `
              repeating-linear-gradient(to right, ${tileLine} 0px, ${tileLine} 2px, transparent 2px, transparent 172.533px),
              repeating-linear-gradient(to bottom, ${tileLine} 0px, ${tileLine} 2px, transparent 2px, transparent 172.533px)
            `,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        {/* soft top glow */}
        <div
          style={{
            position: "absolute",
            top: "-103px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "619px",
            height: "205px",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Tag */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 187,
            color: textColor,
            fontSize: 24,
            letterSpacing: "0.2px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {tag}
        </div>
        {/* Divider */}
        <div style={{ position: "absolute", left: 100, top: 274, right: 100, height: 1, backgroundColor: colord(textColor).alpha(0.6).toRgbString() }} />
        {/* Headline */}
        <h1
          style={{
            position: "absolute",
            left: 100,
            top: 338,
            width: 767,
            margin: 0,
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            lineHeight: `${Math.round(titleSize * 1.1)}px`,
            letterSpacing: "-1.6px",
            color: textColor,
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
            title
          )}
        </h1>
      </div>
    </div>
  );
}