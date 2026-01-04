import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

/**
 * Job Ad Story Variant 4 - Modern story format ad with dynamic content.
 */

// Image/icon assets (use public paths; no localhost)
const imgHeroDefault = "/dhwise-images/placeholder.png";

export default function Variant4({ variant, brandData, landingPageData }) {
  // Dynamic copy - allow empty values, only use fallback if undefined/null
  const jobTitle = variant?.title ?? landingPageData?.vacancyTitle ?? "";
  const ctaText = variant?.callToAction ?? landingPageData?.applyButtonText ?? "Apply Now";
  const linkDescription = variant?.linkDescription ?? "";

  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const videoUrl = variant?.videoUrl || "";
  const isCapture =
    typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);
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
      : "50% 50%";

  const { primaryColor, secondaryColor, getPrimary, getContrastColor } = useAdPalette({
    landingPageData,
    brandData
  });

  // CTA Text Contrast - use the primary color as the background
  const ctaTextColor = getContrastColor(primaryColor);

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;

  const [logoFailed, setLogoFailed] = React.useState(false);

  // Helper to wrap text into lines for SVG text elements
  const wrapText = (text, maxCharsPerLine = 35) => {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Calculate title position to center it between logo and CTA
  // Increased to 20 chars per line to prevent 4+ line titles
  const titleLines = wrapText(jobTitle, 20);
  const titleFontSize = 52;
  const titleLineHeight = titleFontSize * 1.1;
  const logoBottom = 260; // Logo ends around y=260
  const ctaTop = 451; // CTA button starts at y=451
  const availableSpace = ctaTop - logoBottom;
  const totalTitleHeight = titleFontSize + (titleLines.length - 1) * titleLineHeight;
  const titleStartY = logoBottom + (availableSpace - totalTitleHeight) / 2 + titleFontSize * 0.85;

  return (
    <div
      className="relative"
      style={{
        width: "1080px",
        height: "1920px",
        backgroundColor: getPrimary(500),
        overflow: "hidden",
      }}
    >
   <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width={1080}
  zoomAndPan="magnify"
  viewBox="0 0 810 1439.999935"
  height={1920}
  preserveAspectRatio="xMidYMid meet"
  version={1.0}
>
  <defs>
    <filter x="0%" y="0%" width="100%" height="100%" id="6cdd381a15">
      <feColorMatrix
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
        colorInterpolationFilters="sRGB"
      />
    </filter>
    <filter x="0%" y="0%" width="100%" height="100%" id="91218ac615">
      <feColorMatrix
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
        colorInterpolationFilters="sRGB"
      />
    </filter>
    <g />
    <clipPath id="49c0ba401c">
      <path
        d="M 0 1097.25 L 442.925781 1097.25 L 442.925781 1264.5 L 0 1264.5 Z M 0 1097.25 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="aceb16dbcd">
      <path
        d="M 688.398438 316.640625 L 722.148438 316.640625 L 722.148438 350.390625 L 688.398438 350.390625 Z M 688.398438 316.640625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="90c1e5eaf6">
      <rect x={0} width={170} y={0} height={32} />
    </clipPath>
    <clipPath id="0a8e57d66f">
      <path
        d="M 75.417969 228 L 259.917969 228 L 259.917969 277 L 75.417969 277 Z M 75.417969 228 "
        clipRule="nonzero"
      />
    </clipPath>
    <mask id="e0217362c3">
      <g filter="url(#6cdd381a15)">
        <g
          filter="url(#91218ac615)"
          transform="matrix(0.246658, 0, 0, 0.246269, 75.419059, 227.799632)"
        >
          <image
            x={0}
            y={0}
            width={748}
            xlinkHref="data:image/png;base64,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"
            height={201}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </mask>
    <clipPath id="40413ca647">
      <path
        d="M 75.417969 451.175781 L 305.589844 451.175781 L 305.589844 508.664062 L 75.417969 508.664062 Z M 75.417969 451.175781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="35085c1d97">
      <path
        d="M 81.417969 451.175781 L 299.414062 451.175781 C 301.003906 451.175781 302.53125 451.808594 303.65625 452.933594 C 304.78125 454.058594 305.414062 455.585938 305.414062 457.175781 L 305.414062 502.664062 C 305.414062 504.253906 304.78125 505.78125 303.65625 506.90625 C 302.53125 508.03125 301.003906 508.664062 299.414062 508.664062 L 81.417969 508.664062 C 79.828125 508.664062 78.300781 508.03125 77.175781 506.90625 C 76.050781 505.78125 75.417969 504.253906 75.417969 502.664062 L 75.417969 457.175781 C 75.417969 455.585938 76.050781 454.058594 77.175781 452.933594 C 78.300781 451.808594 79.828125 451.175781 81.417969 451.175781 Z M 81.417969 451.175781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="01b3617146">
      <path
        d="M 0.417969 0.175781 L 230.519531 0.175781 L 230.519531 57.664062 L 0.417969 57.664062 Z M 0.417969 0.175781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="a337b39c28">
      <path
        d="M 6.417969 0.175781 L 224.414062 0.175781 C 226.003906 0.175781 227.53125 0.808594 228.65625 1.933594 C 229.78125 3.058594 230.414062 4.585938 230.414062 6.175781 L 230.414062 51.664062 C 230.414062 53.253906 229.78125 54.78125 228.65625 55.90625 C 227.53125 57.03125 226.003906 57.664062 224.414062 57.664062 L 6.417969 57.664062 C 4.828125 57.664062 3.300781 57.03125 2.175781 55.90625 C 1.050781 54.78125 0.417969 53.253906 0.417969 51.664062 L 0.417969 6.175781 C 0.417969 4.585938 1.050781 3.058594 2.175781 1.933594 C 3.300781 0.808594 4.828125 0.175781 6.417969 0.175781 Z M 6.417969 0.175781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="f31e95238e">
      <rect x={0} width={231} y={0} height={58} />
    </clipPath>
    <clipPath id="4b6a0d65f4">
      <rect x={0} width={543} y={0} height={119} />
    </clipPath>
    <clipPath id="d6ed6fdd8d">
      <rect x={0} width={153} y={0} height={31} />
    </clipPath>
    <clipPath id="97bb99c23c">
      <path
        d="M 555.839844 81.128906 L 810 81.128906 L 810 190.628906 L 555.839844 190.628906 Z M 555.839844 81.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="ae6e36a173">
      <path
        d="M 352.15625 451.1875 L 810 451.1875 L 810 1440 L 352.15625 1440 Z M 352.15625 451.1875 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="addd900cb4">
      <path
        d="M 358.90625 451.1875 L 947.359375 451.1875 C 949.152344 451.1875 950.867188 451.898438 952.132812 453.164062 C 953.398438 454.429688 954.109375 456.148438 954.109375 457.9375 L 954.109375 1524.871094 C 954.109375 1526.660156 953.398438 1528.378906 952.132812 1529.644531 C 950.867188 1530.910156 949.152344 1531.621094 947.359375 1531.621094 L 358.90625 1531.621094 C 357.117188 1531.621094 355.398438 1530.910156 354.132812 1529.644531 C 352.867188 1528.378906 352.15625 1526.660156 352.15625 1524.871094 L 352.15625 457.9375 C 352.15625 456.148438 352.867188 454.429688 354.132812 453.164062 C 355.398438 451.898438 357.117188 451.1875 358.90625 451.1875 Z M 358.90625 451.1875 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="be55644d2a">
      <path
        d="M 0.15625 0.1875 L 458 0.1875 L 458 989 L 0.15625 989 Z M 0.15625 0.1875 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="6d601b2595">
      <path
        d="M 6.90625 0.1875 L 595.359375 0.1875 C 597.152344 0.1875 598.867188 0.898438 600.132812 2.164062 C 601.398438 3.429688 602.109375 5.148438 602.109375 6.9375 L 602.109375 1073.871094 C 602.109375 1075.660156 601.398438 1077.378906 600.132812 1078.644531 C 598.867188 1079.910156 597.152344 1080.621094 595.359375 1080.621094 L 6.90625 1080.621094 C 5.117188 1080.621094 3.398438 1079.910156 2.132812 1078.644531 C 0.867188 1077.378906 0.15625 1075.660156 0.15625 1073.871094 L 0.15625 6.9375 C 0.15625 5.148438 0.867188 3.429688 2.132812 2.164062 C 3.398438 0.898438 5.117188 0.1875 6.90625 0.1875 Z M 6.90625 0.1875 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="27618c2fde">
      <rect x={0} width={458} y={0} height={989} />
    </clipPath>
    <clipPath id="b8fc055a8d">
      <path
        d="M 54.71875 901.765625 L 688.503906 901.765625 L 688.503906 991.40625 L 54.71875 991.40625 Z M 54.71875 901.765625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="8a9400c66b">
      <path
        d="M 62.21875 901.765625 L 680.898438 901.765625 C 685.039062 901.765625 688.398438 905.121094 688.398438 909.265625 L 688.398438 983.90625 C 688.398438 988.046875 685.039062 991.40625 680.898438 991.40625 L 62.21875 991.40625 C 58.078125 991.40625 54.71875 988.046875 54.71875 983.90625 L 54.71875 909.265625 C 54.71875 905.121094 58.078125 901.765625 62.21875 901.765625 Z M 62.21875 901.765625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="21e6e5e867">
      <path
        d="M 0.71875 0.765625 L 634.503906 0.765625 L 634.503906 90.40625 L 0.71875 90.40625 Z M 0.71875 0.765625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="c8c302d976">
      <path
        d="M 8.21875 0.765625 L 626.898438 0.765625 C 631.039062 0.765625 634.398438 4.121094 634.398438 8.265625 L 634.398438 82.90625 C 634.398438 87.046875 631.039062 90.40625 626.898438 90.40625 L 8.21875 90.40625 C 4.078125 90.40625 0.71875 87.046875 0.71875 82.90625 L 0.71875 8.265625 C 0.71875 4.121094 4.078125 0.765625 8.21875 0.765625 Z M 8.21875 0.765625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="660a74eb43">
      <rect x={0} width={635} y={0} height={91} />
    </clipPath>
    <clipPath id="e8fbe6ca83">
      <rect x={0} width={589} y={0} height={61} />
    </clipPath>
  </defs>
  <rect
    x={-81}
    width={972}
    fill="#ffffff"
    y="-143.999994"
    height="1727.999922"
    fillOpacity={1}
  />
  <g clipPath="url(#49c0ba401c)">
    <path
      fill={secondaryColor}
      d="M 5.894531 1097.28125 L -25.074219 1126.847656 L 26.535156 1180.921875 L -25.074219 1234.992188 L 5.894531 1264.585938 L 85.730469 1180.921875 Z M 5.707031 1254.464844 L -14.984375 1234.75 L 36.398438 1180.921875 L -14.984375 1127.089844 L 5.707031 1107.375 L 75.910156 1180.988281 Z M 95.222656 1097.28125 L 64.25 1126.847656 L 115.859375 1180.921875 L 64.25 1234.992188 L 95.222656 1264.585938 L 175.058594 1180.945312 Z M 94.992188 1254.464844 L 74.34375 1234.75 L 125.722656 1180.921875 L 74.34375 1127.089844 L 94.992188 1107.375 L 165.195312 1180.988281 Z M 184.558594 1097.28125 L 153.578125 1126.847656 L 205.199219 1180.921875 L 153.574219 1234.992188 L 184.558594 1264.585938 L 264.398438 1180.945312 Z M 184.320312 1254.464844 L 163.640625 1234.75 L 215.035156 1180.921875 L 163.640625 1127.089844 L 184.320312 1107.375 L 254.53125 1180.988281 Z M 273.886719 1097.28125 L 242.914062 1126.847656 L 294.523438 1180.921875 L 242.914062 1234.992188 L 273.886719 1264.585938 L 353.695312 1180.921875 Z M 273.644531 1254.464844 L 253.007812 1234.75 L 304.386719 1180.921875 L 253.007812 1127.089844 L 273.644531 1107.375 L 343.859375 1180.988281 Z M 363.210938 1097.28125 L 332.28125 1126.847656 L 383.890625 1180.921875 L 332.28125 1234.992188 L 363.210938 1264.585938 L 443.046875 1180.945312 Z M 362.984375 1254.464844 L 342.332031 1234.75 L 393.714844 1180.921875 L 342.332031 1127.089844 L 362.984375 1107.375 L 433.183594 1180.988281 Z M 362.984375 1254.464844 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>
  {/* Arrow icon */}
  <g clipPath="url(#aceb16dbcd)">
    <path
      fill={primaryColor}
      d="M 722.488281 316.640625 L 722.488281 350.695312 L 715.671875 350.695312 L 715.671875 328.277344 L 693.21875 350.730469 L 688.398438 345.910156 L 710.851562 323.457031 L 688.429688 323.457031 L 688.429688 316.640625 Z M 722.488281 316.640625 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>

  {/* Brand Logo */}
  {brandLogo && !logoFailed ? (
    <foreignObject x="75" y="210" width="200" height="50">
      <img
        src={brandLogo}
        alt={brandName}
        onError={() => setLogoFailed(true)}
        style={{
          height: "45px",
          width: "auto",
          objectFit: "contain",
        }}
      />
    </foreignObject>
  ) : (
    <text
      x="75"
      y="240"
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
      }}
      fill={secondaryColor}
    >
      {brandName}
    </text>
  )}

  {/* Job Title - dynamically centered between logo and CTA */}
  <text
    x="75"
    y={titleStartY}
    style={{
      fontSize: `${titleFontSize}px`,
      fontWeight: "900",
      fontFamily: "Arial Black, Arial, sans-serif",
      textTransform: "uppercase",
      letterSpacing: "-1px",
    }}
    fill={secondaryColor}
  >
    {titleLines.map((line, i) => (
      <tspan key={i} x="75" dy={i === 0 ? 0 : "1.1em"}>
        {line}
      </tspan>
    ))}
  </text>
  {/* CTA Button */}
  <g clipPath="url(#40413ca647)">
    <g clipPath="url(#35085c1d97)">
      <g transform="matrix(1, 0, 0, 1, 75, 451)">
        <g clipPath="url(#f31e95238e)">
          <g clipPath="url(#01b3617146)">
            <g clipPath="url(#a337b39c28)">
              <path
                fill={primaryColor}
                d="M 0.417969 0.175781 L 230.367188 0.175781 L 230.367188 57.664062 L 0.417969 57.664062 Z M 0.417969 0.175781 "
                fillOpacity={1}
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  {/* CTA Text */}
  <text
    x="190"
    y="485"
    textAnchor="middle"
    dominantBaseline="middle"
    style={{
      fontSize: "20px",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      textTransform: "uppercase",
      letterSpacing: "1px",
    }}
    fill={ctaTextColor}
  >
    {ctaText}
  </text>
  <g clipPath="url(#97bb99c23c)">
    <path
      fill={secondaryColor}
      d="M 842.300781 190.605469 L 862.589844 171.242188 L 828.785156 135.824219 L 862.589844 100.40625 L 842.300781 81.023438 L 790.007812 135.824219 Z M 842.425781 87.652344 L 855.976562 100.5625 L 822.324219 135.824219 L 855.976562 171.082031 L 842.425781 183.996094 L 796.445312 135.78125 Z M 783.792969 190.605469 L 804.078125 171.242188 L 770.277344 135.824219 L 804.078125 100.40625 L 783.792969 81.023438 L 731.5 135.804688 Z M 783.941406 87.652344 L 797.46875 100.5625 L 763.816406 135.824219 L 797.46875 171.082031 L 783.941406 183.996094 L 737.960938 135.78125 Z M 725.277344 190.605469 L 745.570312 171.242188 L 711.757812 135.824219 L 745.570312 100.40625 L 725.277344 81.023438 L 672.984375 135.804688 Z M 725.433594 87.652344 L 738.980469 100.5625 L 705.316406 135.824219 L 738.980469 171.082031 L 725.433594 183.996094 L 679.445312 135.78125 Z M 666.769531 190.605469 L 687.054688 171.242188 L 653.25 135.824219 L 687.054688 100.40625 L 666.769531 81.023438 L 614.492188 135.824219 Z M 666.925781 87.652344 L 680.445312 100.5625 L 646.789062 135.824219 L 680.445312 171.082031 L 666.925781 183.996094 L 620.9375 135.78125 Z M 608.261719 190.605469 L 628.519531 171.242188 L 594.714844 135.824219 L 628.519531 100.40625 L 608.261719 81.023438 L 555.96875 135.804688 Z M 608.410156 87.652344 L 621.9375 100.5625 L 588.28125 135.824219 L 621.9375 171.082031 L 608.410156 183.996094 L 562.429688 135.78125 Z M 608.410156 87.652344 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>
  {/* Hero Image Area */}
  <g clipPath="url(#ae6e36a173)">
    <g clipPath="url(#addd900cb4)">
      <g transform="matrix(1, 0, 0, 1, 352, 451)">
        <g clipPath="url(#27618c2fde)">
          <g clipPath="url(#be55644d2a)">
            <g clipPath="url(#6d601b2595)">
              {/* Image/Video clipped to the rounded rectangle shape */}
              <foreignObject x="0" y="0" width="458" height="740">
                {isVideo && !videoFailed && !isCapture ? (
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
                      width: "100%",
                      height: "100%",
                      objectFit: heroObjectFit,
                      objectPosition: heroObjectPosition,
                      transform: "none",
                    }}
                  />
                ) : (
                  <img
                    src={heroImage}
                    alt="Background"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: heroObjectFit,
                      objectPosition: heroObjectPosition,
                      transform: "none",
                    }}
                  />
                )}
              </foreignObject>
              {/* Secondary color border around the image */}
              <rect
                x="5"
                y="5"
                width="448"
                height="730"
                rx="6.75"
                ry="6.75"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="10"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  {/* White box at bottom for link description - only show when text exists */}
  {linkDescription && (
    <g clipPath="url(#b8fc055a8d)">
      <g clipPath="url(#8a9400c66b)">
        <g transform="matrix(1, 0, 0, 1, 54, 901)">
          <g clipPath="url(#660a74eb43)">
            <g clipPath="url(#21e6e5e867)">
              <g clipPath="url(#c8c302d976)">
                <path
                  fill="#fdfdfd"
                  d="M 0.71875 0.765625 L 634.503906 0.765625 L 634.503906 90.40625 L 0.71875 90.40625 Z M 0.71875 0.765625 "
                  fillOpacity={1}
                  fillRule="nonzero"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  )}
  
  {/* Link Description - positioned in the white box */}
  {linkDescription && (
    <text
      x="371"
      y="951"
      textAnchor="middle"
      style={{
        fontSize: "28px",
        fontWeight: "600",
        fontFamily: "Arial, sans-serif",
      }}
      fill={secondaryColor}
    >
      {wrapText(linkDescription, 40).map((line, i) => (
        <tspan key={i} x="371" dy={i === 0 ? 0 : "1.2em"}>
          {line}
        </tspan>
      ))}
    </text>
  )}
</svg>



    </div>
  );
}