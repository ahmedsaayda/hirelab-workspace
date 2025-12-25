import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";

const HERO_FALLBACK = "/dhwise-images/placeholder.png";

export default function Variant1({ variant, brandData, landingPageData }) {
  const titleRaw =
    variant?.title ||
    landingPageData?.aboutCompanyTitle ||
    "Forward-thinking Technology Company";
  const tag = landingPageData?.aboutCompanyTag || "WE ARE HIRELAB";
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
    : "50% 40%";
  const heroMirror = Boolean(heroAdj?.mirror);

  const brandName = brandData?.companyName || brandData?.name || "hirelab";

  const { primaryColor, heroBackgroundColor, getPrimary } = useAdPalette({
    landingPageData,
    brandData,
  });

  // Two-line preferred headline
  const MAX_HEADLINE_CHARS = 60;
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
  const [titleSize, setTitleSize] = React.useState(64);
  const titleRef = React.useRef(null);
  const allowedLines = 2;
  React.useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    let size = 74;
    el.style.display = "block";
    el.style.WebkitLineClamp = "unset";
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
    const getLines = () => {
      const lh = Math.round(size * 1.1);
      return Math.ceil(el.scrollHeight / lh);
    };
    let guard = 0;
    while (guard < 120 && getLines() > allowedLines && size > 50) {
      size -= 2;
      el.style.fontSize = `${size}px`;
      el.style.lineHeight = `${Math.round(size * 1.1)}px`;
      guard += 1;
    }
    setTitleSize(size);
    el.style.display = "-webkit-box";
    el.style.WebkitLineClamp = String(allowedLines);
    el.style.maxHeight = `${Math.round(size * 1.1) * allowedLines}px`;
    el.style.overflow = "hidden";
  }, [title]);

  const tileLine = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const tileFill = colord(getPrimary(400)).alpha(0.08).toRgbString();
  const PANEL_RADIUS = 72;

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1350px",
        background: heroBackgroundColor || getPrimary(600),
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Brand top-left (text) */}
      <div
        style={{
          position: "absolute",
          left: "100px",
          top: "84px",
          height: "35px",
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "30px", color: "#ffffff" }}>{brandName}</span>
      </div>

      {/* Top hero image */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "1080px", height: "830px", overflow: "hidden" }}>
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 58%, ${colord(getPrimary(950)).alpha(0.85).toRgbString()} 100%)`,
          }}
        />
      </div>

      {/* Accent square */}
      <div
        style={{
          position: "absolute",
          right: "104px",
          top: "720px",
          width: "300px",
          height: "300px",
          background: `linear-gradient(180deg, ${getPrimary(400)} 0%, ${getPrimary(700)} 100%)`,
          opacity: 0.9,
          borderRadius: "48px",
          zIndex: 2,
        }}
      />

      {/* Bottom panel */}
      <div style={{ position: "absolute", left: 0, top: 730, width: 1080, height: 620 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: `${PANEL_RADIUS}px`,
            borderTopRightRadius: `${PANEL_RADIUS}px`,
            overflow: "hidden",
            background: getPrimary(900),
          }}
        />
        {/* tile fill */}
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

        {/* Tag */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 146,
            color: "#fff",
            fontSize: 22,
            letterSpacing: "0.2px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {tag}
        </div>
        {/* Divider */}
        <div style={{ position: "absolute", left: 100, top: 233, right: 100, height: 1, backgroundColor: "rgba(255,255,255,0.6)" }} />

        {/* Headline (2 lines) */}
        <h1
          style={{
            position: "absolute",
            left: 100,
            top: 297,
            width: 787,
            margin: 0,
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            lineHeight: `${Math.round(titleSize * 1.1)}px`,
            letterSpacing: "-1.2px",
            color: "#fff",
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
