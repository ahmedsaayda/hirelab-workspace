import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import { GridPattern } from "../../../../../Landingpage/HeroSection";

const AVATAR_FALLBACK = "/dhwise-images/placeholder.png";

const QuoteMarksIcon = ({ color = "rgba(255,255,255,0.25)", size = 88 }) => (
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

  const { getPrimary } = useAdPalette({ landingPageData, brandData });
  const tileLine = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const tileFill = colord(getPrimary(400)).alpha(0.08).toRgbString();
  const gridMainColor = colord(getPrimary(300)).alpha(0.5).toRgbString();
  const gridLineColor = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const [logoFailed, setLogoFailed] = React.useState(false);

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1350px",
        background: getPrimary(900),
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Grid pattern background (HeroSection style) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <GridPattern
          gridColor={gridMainColor}
          gridLineColor={gridLineColor}
          backgroundColor="rgba(0,0,0,0)"
          gridSize={96}
          maxWidth={2000}
          style={{ opacity: 0.35 }}
        />
      </div>

      {/* brand mark top-left */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 84,
          height: 96,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 3,
        }}
      >
        {brandLogo && !logoFailed ? (
          <img
            src={brandLogo}
            alt={brandName}
            style={{ height: "96px", objectFit: "contain", filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.15))" }}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span style={{ fontWeight: 700, fontSize: 58, color: "#ffffff" }}>{brandName}</span>
        )}
      </div>

      {/* image block */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 195,
          width: 845,
          height: 845,
          overflow: "hidden",
          borderTopRightRadius: 64,
        }}
      >
        <img
          src={avatar}
          alt={author}
          style={{ position: "absolute", inset: 0, width: "120%", height: "120%", objectFit: "cover", objectPosition: "50% 50%" }}
        />
        {/* bottom vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 55%, ${colord(getPrimary(950)).alpha(0.85).toRgbString()} 100%)`,
          }}
        />
      </div>

      {/* quote card */}
      <div
        style={{
          position: "absolute",
          left: 328,
          top: 750,
          width: 752,
          minHeight: 420,
          height: "auto",
          borderRadius: 40,
          background: `linear-gradient(180deg, ${getPrimary(600)} 0%, ${getPrimary(750)} 100%)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          zIndex: 2,
        }}
      >
        <div style={{ position: "absolute", left: 48, top: 41 }}>
          <QuoteMarksIcon size={88} />
        </div>
        <div style={{ padding: "120px 80px 40px 80px", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 592 }}>
            <p style={{ margin: 0, fontSize: 32, lineHeight: "40px", color: "#fff" }}>{quote}</p>
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.6)", marginTop: 28 }} />
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>{author}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.85)" }}>{role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}