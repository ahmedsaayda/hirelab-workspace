import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

const imgHeroDefault = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg";

export default function Variant2({ variant, brandData, landingPageData }) {
  const jobTitle = variant?.title ?? landingPageData?.vacancyTitle ?? "";
  const weAreHiring = landingPageData?.weAreHiring || "WE'RE HIRING";
  const ctaText = variant?.callToAction ?? landingPageData?.applyButtonText ?? "Apply Now";
  const linkDescription = variant?.linkDescription ?? "";

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
      : "52% 58%";

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = "14h";

  const { primaryColor, secondaryColor, getPrimary, getContrastColor } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);

  // CTA Text Contrast - use the primary color as the background
  const ctaTextColor = getContrastColor(primaryColor);

  // Helper to wrap text into lines for SVG text elements
  const wrapText = (text, maxCharsPerLine = 18) => {
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
  // Increased to 16 chars per line to prevent 4+ line titles
  const titleLines = wrapText(jobTitle, 16);
  const titleFontSize = 52;
  const titleLineHeight = titleFontSize * 1.1;
  const logoBottom = 115; // Logo ends around y=115
  const ctaTop = 289; // CTA button starts at y=289
  const availableSpace = ctaTop - logoBottom;
  const totalTitleHeight = titleFontSize + (titleLines.length - 1) * titleLineHeight;
  const titleStartY = logoBottom + (availableSpace - totalTitleHeight) / 2 + titleFontSize * 0.85;

  const formatNumber = (value) => (typeof value === "string" ? value : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  const formatSalary = () => {
    if (!salaryAvailable) return salaryText;
    if (salaryRange && salaryMax) {
      return `${salaryCurrency}${formatNumber(salaryMin)} - ${salaryCurrency}${formatNumber(salaryMax)} / ${salaryTime}`;
    }
    return `${salaryCurrency}${formatNumber(salaryMin)} / ${salaryTime}`;
  };

  const CLUSTER_SIZE = 1115;
  const subtractPathD =
    "M1115 841.81C1115 861.066 1099.41 876.652 1080.15 876.652H285.664C266.409 876.652 250.823 892.238 250.823 911.493V1080.15C250.823 1099.41 235.237 1115 215.981 1115H37.1333C17.8775 1115 2.29187 1099.41 2.29187 1080.15V897.427C2.29187 878.171 17.8775 862.585 37.1333 862.585H204.498C223.754 862.585 239.339 847 239.339 827.744V37.1333C239.339 17.8775 254.925 2.29187 274.18 2.29187H1080.15C1099.41 2.29187 1115 17.8775 1115 37.1333V841.81Z";
  const clipPathValue = `path('${subtractPathD}')`;

  return (
    <div className="relative" style={{ width: "1080px", height: "1350px", backgroundColor: getPrimary(500), overflow: "hidden" }}>
      {/* Background grid pattern */}
     

      <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width={1080}
  zoomAndPan="magnify"
  viewBox="0 0 810 1012.49997"
  height={1350}
  preserveAspectRatio="xMidYMid meet"
  version={1.0}
  style={{ position: "absolute", inset: 0 }}
>
  <defs>
    <filter x="0%" y="0%" width="100%" height="100%" id="e14698007e">
      <feColorMatrix
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
        colorInterpolationFilters="sRGB"
      />
    </filter>
    <filter x="0%" y="0%" width="100%" height="100%" id="f6fe68b6ba">
      <feColorMatrix
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
        colorInterpolationFilters="sRGB"
      />
    </filter>
    <g />
    <clipPath id="ae7275d07b">
      <path
        d="M 0.199219 0 L 809.800781 0 L 809.800781 1012 L 0.199219 1012 Z M 0.199219 0 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="a5519fda40">
      <path
        d="M 710.835938 153.144531 L 746.820312 153.144531 L 746.820312 189.125 L 710.835938 189.125 Z M 710.835938 153.144531 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="ceca5d3bba">
      <path
        d="M 64 59.324219 L 257.671875 59.324219 L 257.671875 111.796875 L 64 111.796875 Z M 64 59.324219 "
        clipRule="nonzero"
      />
    </clipPath>
    <mask id="2124d0c9a5"></mask>
    <clipPath id="9b08ef31f8">
      <path
        d="M 63.515625 289.128906 L 306.582031 289.128906 L 306.582031 349.835938 L 63.515625 349.835938 Z M 63.515625 289.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="1605f1c57b">
      <path
        d="M 71.011719 289.128906 L 298.898438 289.128906 C 300.886719 289.128906 302.792969 289.917969 304.199219 291.324219 C 305.605469 292.730469 306.394531 294.636719 306.394531 296.625 L 306.394531 342.339844 C 306.394531 344.328125 305.605469 346.234375 304.199219 347.640625 C 302.792969 349.046875 300.886719 349.835938 298.898438 349.835938 L 71.011719 349.835938 C 69.023438 349.835938 67.117188 349.046875 65.710938 347.640625 C 64.304688 346.234375 63.515625 344.328125 63.515625 342.339844 L 63.515625 296.625 C 63.515625 294.636719 64.304688 292.730469 65.710938 291.324219 C 67.117188 289.917969 69.023438 289.128906 71.011719 289.128906 Z M 71.011719 289.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="dfe0d6986e">
      <path
        d="M 0.515625 0.128906 L 243.527344 0.128906 L 243.527344 60.835938 L 0.515625 60.835938 Z M 0.515625 0.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="46120573c5">
      <path
        d="M 8.011719 0.128906 L 235.898438 0.128906 C 237.886719 0.128906 239.792969 0.917969 241.199219 2.324219 C 242.605469 3.730469 243.394531 5.636719 243.394531 7.625 L 243.394531 53.339844 C 243.394531 55.328125 242.605469 57.234375 241.199219 58.640625 C 239.792969 60.046875 237.886719 60.835938 235.898438 60.835938 L 8.011719 60.835938 C 6.023438 60.835938 4.117188 60.046875 2.710938 58.640625 C 1.304688 57.234375 0.515625 55.328125 0.515625 53.339844 L 0.515625 7.625 C 0.515625 5.636719 1.304688 3.730469 2.710938 2.324219 C 4.117188 0.917969 6.023438 0.128906 8.011719 0.128906 Z M 8.011719 0.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="55f0f39cd0">
      <rect x={0} width={244} y={0} height={61} />
    </clipPath>
    <clipPath id="c8cd783473">
      <path
        d="M 0.199219 461.082031 L 267.261719 461.082031 L 267.261719 576.523438 L 0.199219 576.523438 Z M 0.199219 461.082031 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="61bab396ca">
      <path
        d="M 350.0625 289.128906 L 759.894531 289.128906 L 759.894531 1012 L 350.0625 1012 Z M 350.0625 289.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="3b725d912c">
      <path
        d="M 356.8125 289.128906 L 753.148438 289.128906 C 756.875 289.128906 759.894531 292.148438 759.894531 295.875 L 759.894531 1017.980469 C 759.894531 1021.703125 756.875 1024.726562 753.148438 1024.726562 L 356.8125 1024.726562 C 353.085938 1024.726562 350.0625 1021.703125 350.0625 1017.980469 L 350.0625 295.875 C 350.0625 292.148438 353.085938 289.128906 356.8125 289.128906 Z M 356.8125 289.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="c7d44465fe">
      <path
        d="M 0.0625 0.128906 L 409.894531 0.128906 L 409.894531 723 L 0.0625 723 Z M 0.0625 0.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="141e3aa43a">
      <path
        d="M 6.8125 0.128906 L 403.148438 0.128906 C 406.875 0.128906 409.894531 3.148438 409.894531 6.875 L 409.894531 728.980469 C 409.894531 732.703125 406.875 735.726562 403.148438 735.726562 L 6.8125 735.726562 C 3.085938 735.726562 0.0625 732.703125 0.0625 728.980469 L 0.0625 6.875 C 0.0625 3.148438 3.085938 0.128906 6.8125 0.128906 Z M 6.8125 0.128906 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="462b155ff1">
      <rect x={0} width={410} y={0} height={723} />
    </clipPath>
    <clipPath id="274085f93e">
      <path
        d="M 374.839844 309.8125 L 735.410156 309.8125 L 735.410156 1012 L 374.839844 1012 Z M 374.839844 309.8125 "
        clipRule="nonzero"
      />
    </clipPath>
  </defs>
  <g clipPath="url(#ae7275d07b)">
    <path
      fill="#ffffff"
      d="M 0.199219 0 L 809.800781 0 L 809.800781 1012 L 0.199219 1012 Z M 0.199219 0 "
      fillOpacity={1}
      fillRule="nonzero"
    />
    <path
      fill="#ffffff"
      d="M 0.199219 0 L 809.800781 0 L 809.800781 1012 L 0.199219 1012 Z M 0.199219 0 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>
  {/* Arrow icon */}
  <g clipPath="url(#a5519fda40)">
    <path
      fill={primaryColor}
      d="M 746.839844 153.144531 L 746.839844 189.113281 L 739.640625 189.113281 L 739.640625 165.433594 L 715.925781 189.148438 L 710.835938 184.054688 L 734.550781 160.34375 L 710.871094 160.34375 L 710.871094 153.144531 Z M 746.839844 153.144531 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>

  {/* Brand Logo */}
  {brandLogo && !logoFailed ? (
    <foreignObject x="63" y="45" width="200" height="60">
      <img
        src={brandLogo}
        alt={brandName}
        onError={() => setLogoFailed(true)}
        style={{
          height: "50px",
          width: "auto",
          objectFit: "contain",
        }}
      />
    </foreignObject>
  ) : (
    <text
      x="63"
      y="80"
      style={{
        fontSize: "28px",
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
    x="63"
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
      <tspan key={i} x="63" dy={i === 0 ? 0 : "1.1em"}>
        {line}
      </tspan>
    ))}
  </text>
  {/* CTA Button with text */}
  <g clipPath="url(#9b08ef31f8)">
    <g clipPath="url(#1605f1c57b)">
      <g transform="matrix(1, 0, 0, 1, 63, 289)">
        <g clipPath="url(#55f0f39cd0)">
          <g clipPath="url(#dfe0d6986e)">
            <g clipPath="url(#46120573c5)">
              <path
                fill={primaryColor}
                d="M 0.515625 0.128906 L 243.34375 0.128906 L 243.34375 60.835938 L 0.515625 60.835938 Z M 0.515625 0.128906 "
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
x="185" y="322"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "32px",
                        fontWeight: 700,
                        fill: ctaTextColor,
                      }}
                    >
                      {ctaText}
                    </text>

  {/* Subheadline / Link Description with text effect background */}
  {linkDescription && (() => {
    const lines = wrapText(linkDescription, 18);
    const fontSize = 22;
    const lineHeight = fontSize * 1.3;
    const paddingX = 10;
    const paddingY = 6;
    const centerX = 203;
    const startY = 400;
    
    // Calculate width based on longest line (approximate: ~0.55 * fontSize per character)
    const charWidth = fontSize * 0.55;
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const bgWidth = maxLineLength * charWidth + paddingX * 2;
    
    return (
      <g>
        {/* Background rectangles for each line - all same width */}
        {lines.map((line, i) => (
          <rect
            key={`bg-${i}`}
            x={centerX - bgWidth / 2}
            y={startY - fontSize + paddingY / 2 + i * lineHeight}
            width={bgWidth}
            height={fontSize + paddingY}
            fill="#fdfdfd"
            rx="4"
            ry="4"
          />
        ))}
        {/* Text on top */}
        <text
          x={centerX}
          y={startY}
          textAnchor="middle"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "600",
            fontFamily: "Arial, sans-serif",
          }}
          fill={secondaryColor}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={centerX} dy={i === 0 ? 0 : `${lineHeight}px`}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  })()}

  <g clipPath="url(#c8cd783473)">
    <path
      fill={secondaryColor}
      d="M -35.15625 461.105469 L -56.578125 481.554688 L -20.882812 518.957031 L -56.578125 556.359375 L -35.15625 576.828125 L 20.066406 518.957031 Z M -35.285156 569.828125 L -49.601562 556.191406 L -14.058594 518.957031 L -49.601562 481.722656 L -35.285156 468.085938 L 13.269531 519.003906 Z M 26.628906 461.105469 L 5.207031 481.554688 L 40.90625 518.957031 L 5.207031 556.359375 L 26.628906 576.828125 L 81.851562 518.976562 Z M 26.472656 569.828125 L 12.1875 556.191406 L 47.726562 518.957031 L 12.1875 481.722656 L 26.472656 468.085938 L 75.03125 519.003906 Z M 88.425781 461.105469 L 66.992188 481.554688 L 102.703125 518.957031 L 66.992188 556.359375 L 88.425781 576.828125 L 143.648438 518.976562 Z M 88.257812 569.828125 L 73.957031 556.191406 L 109.507812 518.957031 L 73.957031 481.722656 L 88.257812 468.085938 L 136.824219 519.003906 Z M 150.210938 461.105469 L 128.789062 481.554688 L 164.488281 518.957031 L 128.789062 556.359375 L 150.210938 576.828125 L 205.417969 518.957031 Z M 150.046875 569.828125 L 135.769531 556.191406 L 171.3125 518.957031 L 135.769531 481.722656 L 150.046875 468.085938 L 198.613281 519.003906 Z M 212 461.105469 L 190.605469 481.554688 L 226.304688 518.957031 L 190.605469 556.359375 L 212 576.828125 L 267.222656 518.976562 Z M 211.84375 569.828125 L 197.558594 556.191406 L 233.097656 518.957031 L 197.558594 481.722656 L 211.84375 468.085938 L 260.398438 519.003906 Z M 211.84375 569.828125 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>
  <g clipPath="url(#61bab396ca)">
    <g clipPath="url(#3b725d912c)">
      <g transform="matrix(1, 0, 0, 1, 350, 289)">
        <g clipPath="url(#462b155ff1)">
          <g clipPath="url(#c7d44465fe)">
            <g clipPath="url(#141e3aa43a)">
              {/* Image/Video clipped to the rounded rectangle shape */}
              <foreignObject x="0" y="0" width="410" height="735">
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
              {/* Primary color border around the image */}
              <rect
                x="5"
                y="5"
                width="400"
                height="725"
                rx="6.75"
                ry="6.75"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="30"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  <g clipPath="url(#274085f93e)">
    <g transform="matrix(0.204274, 0, 0, 0.204006, 277.093498, 170.373285)" />
  </g>
</svg>

    </div>
  );
}