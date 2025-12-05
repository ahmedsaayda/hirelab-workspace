import React from "react";

// Simple hero thumbnail that shows only the hero image, filling the card width
export default function HeroThumbnail({ landingPageData }) {
  if (!landingPageData) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400 text-xs">No preview available</div>
      </div>
    );
  }

  const heroImage =
    landingPageData?.heroImage || "/dhwise-images/placeholder.png";

  const objectPosition =
    landingPageData?.imageAdjustment?.heroImage?.objectPosition
      ? `${landingPageData.imageAdjustment.heroImage.objectPosition.x}% ${landingPageData.imageAdjustment.heroImage.objectPosition.y}%`
      : "50% 50%";

  // For the dashboard vacancy cards we want the hero image to span the full width,
  // so default to "cover" while still respecting any custom objectFit provided.
  const objectFit =
    landingPageData?.imageAdjustment?.heroImage?.objectFit || "cover";

  return (
    <div className="w-full h-full overflow-hidden bg-white">
      <img
        src={heroImage}
        alt={landingPageData?.vacancyTitle || "Vacancy hero image"}
        className="w-full h-full object-cover"
        style={{
          objectFit,
          objectPosition,
        }}
      />
    </div>
  );
}