import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import { GridPattern } from "../../../../../Landingpage/HeroSection";

const AVATAR_FALLBACK = "/dhwise-images/placeholder.png";

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

// Stylized quote marks to better match Figma (two curved shapes)
const QuoteMarksIcon = ({ color = "rgba(255,255,255,0.25)", size = 100 }) => (
  <svg
    width={size}
    height={size * 0.78}
    viewBox="0 0 256 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    <path
      d="M98 40c-30 0-54 24-54 54v6h44c5.5 0 10 4.5 10 10v26c0 30-24 54-54 54H22c-12 0-22-10-22-22V94C0 42.7 42.7 0 94 0h4c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10z"
      fill={color}
    />
    <path
      d="M234 40c-30 0-54 24-54 54v6h44c5.5 0 10 4.5 10 10v26c0 30-24 54-54 54h-22c-12 0-22-10-22-22V94c0-51.3 42.7-94 94-94h4c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10z"
      fill={color}
    />
  </svg>
);

export default function Variant1({ variant, brandData, landingPageData }) {
  const quote =
    variant?.quote ||
    landingPageData?.testimonialQuote ||
    "I feel valued as an employee and am proud to be part of a team that consistently strives for excellence.";
  const author = variant?.author || landingPageData?.testimonialAuthor || "Alison Medis";
  const role = variant?.role || landingPageData?.testimonialRole || "Project Manager";
  const avatar = variant?.image || landingPageData?.testimonialAvatar || AVATAR_FALLBACK;
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = "14h";

  const { primaryColor, heroBackgroundColor, getPrimary } = useAdPalette({
    landingPageData,
    brandData,
  });
  const [logoFailed, setLogoFailed] = React.useState(false);

  const tileLine = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const tileFill = colord(getPrimary(400)).alpha(0.08).toRgbString();
  const gridMainColor = colord(getPrimary(300)).alpha(0.5).toRgbString();
  const gridLineColor = colord(getPrimary(300)).alpha(0.12).toRgbString();

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1920px",
        background: getPrimary(900),
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Grid pattern (HeroSection-style) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <GridPattern
          gridColor={gridMainColor}
          gridLineColor={gridLineColor}
          backgroundColor="rgba(0,0,0,0)"
          gridSize={96}
          maxWidth={2000}
          style={{ opacity: 0.35 }}
        />
      </div>
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
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar image card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 277,
          width: 974,
          height: 974,
          overflow: "hidden",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <img
          src={avatar}
          alt={author}
          style={{ position: "absolute", inset: 0, width: "120%", height: "120%", objectFit: "cover", objectPosition: "50% 50%" }}
        />
        {/* purple vignette bottom-left like Figma */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 55%, ${colord(getPrimary(950)).alpha(0.85).toRgbString()} 100%)`,
          }}
        />
      </div>

      {/* Shadow under image bottom side */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 277 + 920,
          width: 640,
          height: 120,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(10px)",
          opacity: 0.35,
        }}
      />

      {/* removed old CSS grid background in favor of GridPattern */}

      {/* Quote card (sized per Figma width) */}
      <div
        style={{
          position: "absolute",
          left: 353,
          top: 1039,
          width: 727,
          height: 520,
          borderRadius: 40,
          background: `linear-gradient(180deg, ${getPrimary(600)} 0%, ${getPrimary(750)} 100%)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          zIndex: 2,
        }}
      >
        {/* Quote glyph */}
        <div style={{ position: "absolute", left: 64, top: 70 }}>
          <QuoteMarksIcon color="rgba(255,255,255,0.25)" size={110} />
        </div>

        {/* Copy */}
        <div style={{ position: "absolute", left: 100, top: 160, width: 527 }}>
          <p style={{ margin: 0, fontSize: 36, lineHeight: "44px", color: "#fff" }}>{quote}</p>
          <div style={{ width: 527, height: 1, background: "rgba(255,255,255,0.6)", marginTop: 28 }} />
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>{author}</div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.85)" }}>{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}