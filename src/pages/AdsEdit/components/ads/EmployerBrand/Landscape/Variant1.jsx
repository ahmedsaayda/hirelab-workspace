import React from "react";
import { colord } from "colord";
import useAdPalette from "../../../../hooks/useAdPalette";

const imgHeroDefault = "/dhwise-images/placeholder.png";

export default function Variant1({ variant, brandData, landingPageData }) {
  const headline = variant?.title || landingPageData?.employerBrandTitle || "We Have Been Recognized";
  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const heroAdj = landingPageData?.imageAdjustment?.heroImage;
  const heroObjectFit = heroAdj?.objectFit || "cover";
  const heroObjectPosition = heroAdj?.objectPosition
    ? `${heroAdj.objectPosition.x}% ${heroAdj.objectPosition.y}%`
    : "50% 100%";
  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const { getPrimary, primaryColor } = useAdPalette({ landingPageData, brandData });
  const BORDER_WIDTH = 8;
  const CARD_RADIUS = 80; // 5rem equivalent
  const borderGradient = `linear-gradient(180deg, ${getPrimary(500)} 0%, ${getPrimary(950)} 100%)`;

  return (
    <div className="relative" style={{ width: "1080px", height: "1350px", backgroundColor: getPrimary(500), overflow: "hidden" }}>
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          bottom: "-1800px",
          left: "calc(50% - 691px)",
          width: "3844px",
          height: "2883px",
          opacity: 0.25,
          backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%),
            repeating-linear-gradient(to right, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 172.533px),
            repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 172.533px)`
        }}
      />

      {/* Brand logo top left */}
      <div style={{ position: "absolute", left: "466px", top: "74px", width: "149px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "28px", color: "#ffffff" }}>{brandName}</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: "100px",
          top: "391px",
          width: "880px",
          height: "959px",
          padding: `${BORDER_WIDTH}px ${BORDER_WIDTH}px 0 ${BORDER_WIDTH}px`,
          borderRadius: `${CARD_RADIUS}px ${CARD_RADIUS}px 0 0`,
          background: borderGradient,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: `${CARD_RADIUS - BORDER_WIDTH}px ${CARD_RADIUS - BORDER_WIDTH}px 0 0`,
            overflow: "hidden",
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
          {/* 20px brand-colored bottom shadow across full width */}
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
      
      <div style={{ position: "absolute", left: "227px", top: "191px", width: "626px" }}>
        <h1 style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "72px", fontWeight: 700, lineHeight: "86px", color: "#fff" }}>{headline}</h1>
      </div>
    </div>
  );
}