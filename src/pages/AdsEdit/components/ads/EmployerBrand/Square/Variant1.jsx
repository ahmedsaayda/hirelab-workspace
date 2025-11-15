import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";
import { GridPattern } from "../../../../../Landingpage/HeroSection";

const HERO_FALLBACK = "/dhwise-images/placeholder.png";

export default function Variant1({ variant, brandData, landingPageData }) {
  const headline = variant?.title || landingPageData?.employerBrandTitle || "We Have Been Recognized";
  const heroImage = variant?.image || landingPageData?.heroImage || HERO_FALLBACK;
  const heroAdj = landingPageData?.imageAdjustment?.heroImage;
  const heroObjectFit = heroAdj?.objectFit || "cover";
  const heroObjectPosition = heroAdj?.objectPosition
    ? `${heroAdj.objectPosition.x}% ${heroAdj.objectPosition.y}%`
    : "50% 50%";
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;

  const { primaryColor, heroBackgroundColor, getPrimary } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);

  const backgroundGradient = `linear-gradient(160deg, ${heroBackgroundColor || "#140035"} 0%, ${getPrimary(700)} 40%, ${getPrimary(900)} 100%)`;
  const gridMainColor = colord(getPrimary(300)).alpha(0.75).toRgbString();
  const gridLineColor = colord(getPrimary(300)).alpha(0.12).toRgbString();
  const BORDER_WIDTH = 8;
  const CARD_RADIUS = 80; // equals 5rem at 16px base
  const borderGradient = `linear-gradient(180deg, ${getPrimary(500)} 0%, ${getPrimary(950)} 100%)`;

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1080px",
        background: backgroundGradient,
        overflow: "hidden",
        color: "#ffffff",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Grid background from HeroSection template 1 */}
      <div style={{ position: "absolute", inset: 0 }}>
        <GridPattern
          gridColor={gridMainColor}
          gridLineColor={gridLineColor}
          backgroundColor="transparent"
          gridSize={90}
          maxWidth={2200}
          style={{ opacity: 0.35 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16), rgba(20,0,45,0) 60%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}>
        {/* Brand + headline */}
        <div
          style={{
            padding: "60px 120px 0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
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
                <span style={{ fontWeight: 600, fontSize: "34px", color: primaryColor || "#fff" }}>
                  {brandName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <span style={{ fontSize: "34px", fontWeight: 600 }}>{brandName}</span>
          </div>
          <h1
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "88px",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
              maxWidth: "780px",
            }}
          >
            {headline}
          </h1>
        </div>

        {/* Hero image card - aligned with Story: top-only rounded gradient border, flat bottom */}
        <div
          style={{
            position: "absolute",
            left: "90px",
            right: "90px",
            bottom: "0px",
            top: "400px",
            padding: `${BORDER_WIDTH}px ${BORDER_WIDTH}px 0 ${BORDER_WIDTH}px`,
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
          </div>
        </div>
      </div>
    </div>
  );
}