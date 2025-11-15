import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

const imgHeroDefault = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg";

export default function Variant2({ variant, brandData, landingPageData }) {
  const jobTitle = variant?.title || landingPageData?.vacancyTitle || "Project Manager";
  const weAreHiring = landingPageData?.weAreHiring || "WE'RE HIRING";
  const ctaText = variant?.callToAction || landingPageData?.applyButtonText || "Apply Now";

  const salaryMin = landingPageData?.salaryMin ?? 2500;
  const salaryMax = landingPageData?.salaryMax;
  const salaryRange = landingPageData?.salaryRange;
  const salaryAvailable = landingPageData?.salaryAvailable !== false;
  const salaryCurrency = landingPageData?.salaryCurrency || "$";
  const salaryTime = landingPageData?.salaryTime || "month";
  const salaryText = landingPageData?.salaryText || "Competitive Salary";

  const location = (Array.isArray(landingPageData?.location) && landingPageData.location[0])
    || landingPageData?.location || "Offenbach";
  const hoursMin = landingPageData?.hoursMin ?? 7;
  const hoursUnit = landingPageData?.hoursUnit || "daily";

  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const heroImageAdjustment =
    variant?.imageAdjustment?.heroImage ||
    landingPageData?.imageAdjustment?.jobDescriptionImage ||
    landingPageData?.imageAdjustment?.heroImage ||
    {};
  const heroObjectFit = heroImageAdjustment?.objectFit || "cover";
  const heroObjectPositionOverride =
    variant?.heroImagePosition || landingPageData?.heroImagePosition;
  const heroObjectPosition = heroObjectPositionOverride
    ? heroObjectPositionOverride
    : heroImageAdjustment?.objectPosition
    ? `${heroImageAdjustment.objectPosition.x}% ${heroImageAdjustment.objectPosition.y}%`
    : "52% 58%";

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = "14h";

  const { primaryColor, getPrimary } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);

  const formatNumber = (value) => (typeof value === "string" ? value : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  const formatSalary = () => {
    if (!salaryAvailable) return salaryText;
    if (salaryRange && salaryMax) {
      return `${salaryCurrency}${formatNumber(salaryMin)} - ${salaryCurrency}${formatNumber(salaryMax)} / ${salaryTime}`;
    }
    return `${salaryCurrency}${formatNumber(salaryMin)} / ${salaryTime}`;
  };

  const CLUSTER_SIZE = 983;
  const subtractPathD =
    "M983 742.962C983 760.688 968.63 775.058 950.904 775.058H251.066C233.34 775.058 218.971 789.427 218.971 807.153V950.904C218.971 968.63 204.601 983 186.875 983H32.0958C14.3698 983 0 968.63 0 950.904V795.925C0 778.199 14.3698 763.829 32.0958 763.829H177.26C194.986 763.829 209.355 749.459 209.355 731.733V32.0958C209.355 14.3698 223.725 0 241.451 0H950.904C968.63 0 983 14.3698 983 32.0958V742.962Z";
  const clipPathValue = `path('${subtractPathD}')`;

  return (
    <div className="relative" style={{ width: "1080px", height: "1080px", backgroundColor: getPrimary(500), overflow: "hidden" }}>
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

      {/* Masked image cluster */}
      <div
        style={{
          position: "absolute",
          top: "115px",
          left: "420px",
          width: `${CLUSTER_SIZE}px`,
          height: `${CLUSTER_SIZE}px`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            clipPath: clipPathValue,
            WebkitClipPath: clipPathValue,
          }}
        >
          <img
            src={heroImage}
            alt={jobTitle}
            style={{
              position: "absolute",
              inset: 0,
              width: "120%",
              height: "120%",
              objectFit: heroObjectFit,
              objectPosition: heroObjectPosition,
              transition: "object-position 0.3s ease-in-out",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${getPrimary(700)}99 74%, ${getPrimary(900)}DD 100%)`,
              pointerEvents: "none",
              clipPath: clipPathValue,
              WebkitClipPath: clipPathValue,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                `repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 88px), repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 88px)`,
              opacity: 0.12,
              pointerEvents: "none",
              clipPath: clipPathValue,
              WebkitClipPath: clipPathValue,
            }}
          />
        </div>
      </div>

      {/* Title + badges + CTA */}
      <div style={{ position: "absolute", left: "100px", top: "218px", width: "388px", display: "flex", flexDirection: "column", gap: "16px", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span aria-hidden style={{ fontSize: "32px", lineHeight: 1 }}>👋</span>
          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "24px", fontWeight: 500, lineHeight: "36px", color: "#dbd5fe", letterSpacing: "-0.48px", textTransform: "uppercase" }}>{weAreHiring}</p>
        </div>
        <h1 style={{ margin: 0, width: "388px", fontFamily: "'Inter', sans-serif", fontSize: "56px", fontWeight: 600, lineHeight: "72px", letterSpacing: "-1.4px", background: "linear-gradient(90deg, #B9ACFC 0%, #EEECFE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{jobTitle}</h1>
      </div>

      <div style={{ position: "absolute", left: "100px", top: "520px", width: "343px", display: "flex", flexDirection: "column", gap: "24px", zIndex: 2 }}>
        {[
          { icon: imgCoinsStacked, text: formatSalary() },
          { icon: imgVerticalContainer, text: location },
          { icon: imgClock, text: `${hoursMin} Hours / ${hoursUnit}` },
        ].map(({ icon, text }, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 24px", borderRadius: "16px", background: "linear-gradient(270deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 100%)", backdropFilter: "blur(39.895px)", WebkitBackdropFilter: "blur(39.895px)" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: primaryColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={icon} alt="badge icon" style={{ width: "20px", height: "20px" }} />
            </div>
            <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 600, lineHeight: "32px", letterSpacing: "-0.24px", color: "#ffffff", whiteSpace: "nowrap" }}>{text}</p>
          </div>
        ))}
      </div>

      <button style={{ position: "absolute", left: "687px", top: "943px", padding: "22px 48px", width: "295px", height: "82px", border: "none", borderRadius: "100px", backgroundColor: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0px 18px 35px rgba(39, 0, 133, 0.3)", zIndex: 2 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "32px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.4px" }}>{ctaText}</span>
      </button>
    </div>
  );
}