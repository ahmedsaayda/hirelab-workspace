import React, { useEffect, useRef } from "react";
import { Heading, Img, Text } from "./components";
import { useHover } from "../../contexts/HoverContext";
import { useFocusContext } from "../../contexts/FocusContext";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import { getFonts } from "./getFonts";
import { scrollToElement } from "./scrollUtils.js";

const decorativeElement = (position) => (
  <div
    className={`absolute ${position} w-[200px] h-[200px] rounded-full bg-[#E5F1FF] opacity-50`}
  />
);

// Common hook for hover functionality
const useLeaderHover = () => {
  const {
    hoveredField,
    scrollToSection,
    setLastScrollToSection,
    lastScrollToSection,
  } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const fullnameRef = useRef();
  const jobTitleRef = useRef();
  const avatarRef = useRef();

  React.useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      leaderIntroductionTitle: titleRef,
      leaderIntroductionDescription: descriptionRef,
      leaderIntroductionFullname: fullnameRef,
      leaderIntroductionJobTitle: jobTitleRef,
      leaderIntroductionAvatar: avatarRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Apply highlight to target element
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection === "leader-introduction" &&
      sectionRef.current &&
      lastScrollToSection !== "leader-introduction"
    ) {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("leader-introduction");
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    descriptionRef,
    fullnameRef,
    jobTitleRef,
    avatarRef,
  };
};

// const Template1 = ({ data }) => {
//   const refs = useLeaderHover();

//   return (
//     <div ref={refs.sectionRef} className="px-4 py-16 mx-auto">
//       <div className="mx-auto space-y-8 max-w-3xl text-center">
//         <div ref={refs.avatarRef}>
//           <Img
//             src={
//               data?.leaderIntroductionAvatar ||
//               "/dhwise-images/placeholder.png"
//             }
//             alt={`${data?.leaderIntroductionFullname} - CEO of ${data?.companyName}`}
//             className="mx-auto w-full max-w-md rounded-lg"
//           />
//         </div>
//         <div className="space-y-4">
//           <div ref={refs.titleRef}>
//             <Heading
//               as="h2"
//               className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728]"
//             >
//               {data?.leaderIntroductionTitle || "Meet Our CEO"}
//             </Heading>
//           </div>
//           <div ref={refs.descriptionRef}>
//             <Text className="text-[20px] text-[#475466] leading-[30px]">
//               {data?.leaderIntroductionDescription}
//             </Text>
//           </div>
//           <div className="pt-4">
//             <div ref={refs.fullnameRef}>
//               <Text className="font-semibold">
//                 — {data?.leaderIntroductionFullname}
//               </Text>
//             </div>
//             <div ref={refs.jobTitleRef}>
//               <Text className="text-[#475466]">
//                 CEO of {data?.companyName || "Hirelab"}
//               </Text>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const Template2 = ({ data }) => {
  const refs = useLeaderHover();
  const { handleItemClick } = useFocusContext();
  const { titleFont, subheaderFont, bodyFont } = getFonts(data);

  // Extract colors for Template 2 theme
  const primaryColor = data?.primaryColor || "#0068D6";
  const secondaryColor = data?.secondaryColor || "#f5590c";
  const tertiaryColor = data?.tertiaryColor || "#3396FF";

  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#0068D6",
      secondaryColor: "#f5590c",
      tertiaryColor: "#3396FF",
    },
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Parse description to get bold intro and regular text
  const getDescriptionParts = () => {
    const desc = data?.leaderIntroductionDescription || 
      "With a passion for connecting exceptional talent with groundbreaking opportunities.\n\nJohn founded HireLab on the principle that the right people are the cornerstone of any successful organization. John's dedication to fostering a culture of excellence and his deep understanding of the evolving workforce.";
    
    const parts = desc.split('\n\n');
    return {
      intro: parts[0] || "",
      body: parts.slice(1).join('\n\n') || "",
    };
  };

  const descParts = getDescriptionParts();

  return (
    <div
      ref={refs.sectionRef}
      id="leader-introduction"
      className="w-full relative overflow-x-clip"
      style={{ 
        fontFamily: bodyFont?.family || "Inter, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "900px",
      }}
    >
      {/* Decorative Circular Arc - Top Right */}
      <div 
        className="absolute pointer-events-none hidden lg:block"
        style={{
          right: "-350px",
          top: "-125px",
          width: "700px",
          height: "699px",
          zIndex: 0,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 700 700" fill="none">
          <circle
            cx="350"
            cy="350"
            r="280"
            stroke="url(#gradient1)"
            strokeWidth="40"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor={getColor("primary", 200)} />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative Circular Arc - Bottom Left */}
      <div 
        className="absolute pointer-events-none hidden lg:block"
        style={{
          left: "-350px",
          bottom: "-200px",
          width: "700px",
          height: "699px",
          zIndex: 0,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 700 700" fill="none">
          <circle
            cx="350"
            cy="350"
            r="280"
            stroke="url(#gradient2)"
            strokeWidth="40"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor={getColor("primary", 200)} />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Title Section */}
      <div 
        className="flex flex-col gap-[28px] items-center relative z-10 px-[72px] pt-[200px]"
        style={{ width: "100%", maxWidth: "1440px", margin: "0 auto" }}
      >
        {/* Title with blue gradient highlight */}
        <div className="relative inline-grid">
          <div 
            className="col-start-1 row-start-1 h-[24px] rounded-[8px]"
            style={{
              background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
              marginLeft: "121px",
              marginTop: "20px",
              width: "200px",
            }}
          />
          <h2
            ref={refs.titleRef}
            onClick={() => handleItemClick("leaderIntroductionTitle")}
            className="col-start-1 row-start-1 font-semibold cursor-pointer text-center"
            style={{
              fontFamily: titleFont?.family || "Inter, sans-serif",
              fontSize: "48px",
              lineHeight: "60px",
              letterSpacing: "-1.44px",
              color: "#292929",
            }}
          >
            {data?.leaderIntroductionTitle || "Meet Our CEO"}
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="text-center"
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            color: "#7c7c7c",
            fontFamily: subheaderFont?.family || "Inter, sans-serif",
          }}
        >
          Some text can be placed here....
        </p>
      </div>

      {/* Main Container - Content Card + Image */}
      <div 
        className="relative z-10 mt-[80px] px-4 lg:px-0"
        style={{ maxWidth: "1440px", margin: "80px auto 100px" }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:pl-[72px]">
          {/* Content Card (Left) */}
          <div
            className="bg-white flex flex-col gap-[48px] items-end justify-center overflow-hidden relative"
            style={{
              width: "100%",
              maxWidth: "660px",
              height: "auto",
              minHeight: "460px",
              padding: "40px 80px",
              borderRadius: "24px",
              zIndex: 2,
            }}
          >
            {/* Background Pattern (subtle) */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23bdbdbd' stroke-width='0.5'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Description */}
            <div
              ref={refs.descriptionRef}
              onClick={() => handleItemClick("leaderIntroductionDescription")}
              className="relative z-10 text-left w-full cursor-pointer"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                color: "#292929",
                fontFamily: bodyFont?.family || "Inter, sans-serif",
              }}
            >
              <p className="font-semibold mb-4">
                {descParts.intro}
              </p>
              <p>
                {descParts.body}
              </p>
            </div>

            {/* Signature Section */}
            <div className="flex flex-col gap-[16px] items-center relative z-10">
              {/* Signature Image (handwritten style) */}
              <div
                ref={refs.fullnameRef}
                onClick={() => handleItemClick("leaderIntroductionFullname")}
                className="cursor-pointer"
                style={{
                  fontFamily: "'Allura', cursive",
                  fontSize: "32px",
                  color: getColor("secondary", 500),
                  fontStyle: "italic",
                }}
              >
                {data?.leaderIntroductionFullname || "John Smith"}
              </div>

              {/* Name and Role */}
              <div className="flex flex-col gap-[12px] items-center text-center">
                <p
                  className="font-semibold"
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#292929",
                    fontFamily: titleFont?.family || "Inter, sans-serif",
                  }}
                >
                  {data?.leaderIntroductionFullname || "John Smith"}
                </p>
                <p
                  ref={refs.jobTitleRef}
                  onClick={() => handleItemClick("leaderIntroductionJobTitle")}
                  className="cursor-pointer"
                  style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#525252",
                    fontFamily: bodyFont?.family || "Inter, sans-serif",
                  }}
                >
                  {data?.leaderIntroductionJobTitle || "CEO of Hirelab"}
                </p>
              </div>
            </div>
          </div>

          {/* Image Container (Right) */}
          <div
            ref={refs.avatarRef}
            onClick={() => handleItemClick("leaderIntroductionAvatar")}
            className="bg-white overflow-hidden relative cursor-pointer hidden lg:block"
            style={{
              width: "660px",
              height: "460px",
              borderRadius: "0 24px 24px 0",
              marginLeft: "-24px", // Overlap with content card
              zIndex: 1,
            }}
          >
            <Img
              src={data?.leaderIntroductionAvatar || "/dhwise-images/placeholder.png"}
              alt={data?.leaderIntroductionFullname || "CEO"}
              className="w-full h-full object-cover"
              style={{
                objectPosition: data?.imageAdjustment?.leaderIntroductionAvatar?.objectPosition
                  ? `${data.imageAdjustment.leaderIntroductionAvatar.objectPosition.x}% ${data.imageAdjustment.leaderIntroductionAvatar.objectPosition.y}%`
                  : "50% 50%",
                objectFit: data?.imageAdjustment?.leaderIntroductionAvatar?.objectFit || "cover",
              }}
            />
            {/* Dark gradient overlay on left edge */}
            <div 
              className="absolute top-0 left-0 h-full pointer-events-none"
              style={{
                width: "180px",
                background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",
              }}
            />
          </div>

          {/* Mobile Image (stacked below) */}
          <div
            ref={refs.avatarRef}
            onClick={() => handleItemClick("leaderIntroductionAvatar")}
            className="bg-white overflow-hidden relative cursor-pointer lg:hidden mt-4 w-full"
            style={{
              height: "300px",
              borderRadius: "24px",
            }}
          >
            <Img
              src={data?.leaderIntroductionAvatar || "/dhwise-images/placeholder.png"}
              alt={data?.leaderIntroductionFullname || "CEO"}
              className="w-full h-full object-cover"
              style={{
                objectPosition: data?.imageAdjustment?.leaderIntroductionAvatar?.objectPosition
                  ? `${data.imageAdjustment.leaderIntroductionAvatar.objectPosition.x}% ${data.imageAdjustment.leaderIntroductionAvatar.objectPosition.y}%`
                  : "50% 50%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Google Font for signature */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');
      `}</style>
    </div>
  );
};

const Template3 = ({ data }) => (
  <div className="  px-4 py-16 bg-[#F8FAFC]">
    <div className="relative mx-auto max-w-6xl">
      {decorativeElement("top-0 left-0 -translate-x-1/2 -translate-y-1/2")}
      <div className="flex flex-col gap-12 items-center md:flex-row">
        <div className="space-y-6 md:w-1/2">
          <Heading
            as="h2"
            className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728]"
          >
            {data?.meetCEOTitle || "Meet Our CEO"}
          </Heading>
          <Text className="text-[20px] text-[#475466] leading-[30px]">
            {data?.leaderIntroductionDescription}
          </Text>
          <div>
            <Text className="font-semibold text-[#0066FF]">
              — {data?.ceoName}
            </Text>
            <Text className="text-[#475466]">
              CEO of {data?.companyName || "Hirelab"}
            </Text>
          </div>
        </div>
        <div className="md:w-1/2">
          <Img
            src={
              data?.leaderIntroductionAvatar ||
              "/placeholder.svg?height=200&width=300"
            }
            alt={`${data?.leaderIntroductionFullname} - CEO of ${data?.companyName}`}
            className="clip-path w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

const Template4 = ({ data }) => (
  <div className="px-4 py-16 mx-auto">
    <div className="relative mx-auto max-w-6xl">
      {decorativeElement("top-0 left-0 -translate-x-1/4 -translate-y-1/4")}
      <div className="flex flex-col gap-12 items-center md:flex-row-reverse">
        <div className="space-y-6 md:w-1/2">
          <Heading
            as="h2"
            className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728]"
          >
            {data?.meetCEOTitle || "Meet Our CEO"}
          </Heading>
          <Text className="text-[20px] text-[#475466] leading-[30px]">
            {data?.leaderIntroductionDescription}
          </Text>
          <div>
            <Text className="font-semibold">— {data?.ceoName}</Text>
            <Text className="text-[#475466]">
              CEO of {data?.companyName || "Hirelab"}
            </Text>
          </div>
        </div>
        <div className="relative md:w-1/2">
          {decorativeElement("top-0 left-0 -translate-x-1/4 -translate-y-1/4")}
          <Img
            src={
              data?.leaderIntroductionAvatar ||
              "/placeholder.svg?height=400&width=300"
            }
            alt={`${data?.leaderIntroductionFullname} - CEO of ${data?.companyName}`}
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

const Template5 = ({ data }) => (
  <div className="px-4 py-16 mx-auto">
    <div className="relative mx-auto max-w-6xl">
      {decorativeElement("top-0 left-0 -translate-x-1/2 -translate-y-1/2")}
      {decorativeElement("bottom-0 right-0 translate-x-1/2 translate-y-1/2")}
      <div className="flex flex-col gap-12 items-center md:flex-row">
        <div className="space-y-6 md:w-1/2">
          <Heading
            as="h2"
            className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728]"
          >
            {data?.meetCEOTitle || "Meet Our CEO"}
          </Heading>
          <Text className="text-[20px] text-[#475466] leading-[30px]">
            {data?.leaderIntroductionDescription}
          </Text>
          <div>
            <Text className="font-semibold">— {data?.ceoName}</Text>
            <Text className="text-[#475466]">
              CEO of {data?.companyName || "Hirelab"}
            </Text>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <Img
              src={
                data?.leaderIntroductionAvatar ||
                "/placeholder.svg?height=400&width=300"
              }
              alt={`${data?.leaderIntroductionFullname} - CEO of ${data?.companyName}`}
              className="w-full rounded-lg"
            />
            <div className="absolute right-0 bottom-0 left-0 p-4 text-white rounded-b-lg bg-black/30">
              <Text className="font-semibold">{data?.ceoName}</Text>
              <Text className="opacity-90">
                CEO of {data?.companyName || "Hirelab"}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Template1 = ({ data }) => {
  const refs = useLeaderHover();

  // Extract colors for dependency tracking
  const primaryColor = data?.primaryColor || "#26B0C6";
  const secondaryColor = data?.secondaryColor || "#F7E733";
  const tertiaryColor = data?.tertiaryColor || "#44b566";

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#26B0C6",
      secondaryColor: "#F7E733",
      tertiaryColor: "#44b566",
    },
    // Pass data colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Create custom CSS for clip paths
  const clipPathStyles = `
    .clip-path-desktop {
      clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%, 0 0);
    }
    .clip-path-mobile {
      clip-path: polygon(0 0, 100% 0, 100% 70%, 30% 100%, 0 100%, 0 0);
    }
  `;

  const { titleFont, subheaderFont, bodyFont } = getFonts(data);

  return (
    <div
      ref={refs.sectionRef}
      className="overflow-hidden relative px-4 py-16 w-full bg-white md:px-8"
      id="leader-introduction"
      style={{ color: "black", fontFamily: bodyFont?.family }}
    >
      {/* Add clip path styles */}
      <style>{clipPathStyles}</style>

      {/* Decorative Elements */}

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 items-center smr:grid-cols-2 smr:gap-16">
          {/* Content Section */}
          <div className="z-10 smx:order-1 order-1">
            <div ref={refs.titleRef} style={{}}>
              <h2
                className="mb-6 text-3xl font-bold md:text-4xl"
                style={{
                  fontFamily: subheaderFont?.family,
                }}
              >
                {data?.leaderIntroductionTitle?.split(" ")[0] || "Meet"}{" "}
                <span style={{ fontFamily: subheaderFont?.family }}>
                  {data?.leaderIntroductionTitle
                    ?.split(" ")
                    .slice(1)
                    .join(" ") || "Our CEO"}
                </span>
              </h2>
            </div>

            <div ref={refs.descriptionRef}>
              <p
                className="mb-8 leading-relaxed"
                style={{
                  fontFamily: bodyFont?.family,
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    (data?.leaderIntroductionDescription || "")?.replace?.(/\n/g, "<br>")
                }}
              >
              </p>
            </div>

            <div className="mb-4">
              <div ref={refs.fullnameRef} className="mb-4 text-3xl font-script">
                {data?.leaderIntroductionFullname || "John Smith"}
              </div>
              <div
                ref={refs.jobTitleRef}
                className="text-sm text-gray-600"
                style={{ fontFamily: bodyFont?.family }}
              >
                {data?.leaderIntroductionJobTitle || ""}
              </div>
           
            </div>
          </div>

          {/* Image Section with Advanced Cropping Effect */}
          <div
            className="relative  smx:order-2 order-1 rounded-2xl  "
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          >
            {/* Shadow Wrapper */}
            <div className="overflow-hidden relative shadow-md">
              <div
                ref={refs.avatarRef}
                className="relative aspect-[5/5] md:aspect-[4/4] w-full h-full"
              >
                {/* Main Image */}
                <div className="overflow-hidden absolute inset-0 rounded-3xl">
                  <Img
                    src={
                      data?.leaderIntroductionAvatar ||
                      "/dhwise-images/placeholder.png"
                    }
                    alt={`${data?.leaderIntroductionFullname || "CEO"}`}
                    className="clip-path object-cover w-full h-full"
                    style={{
                      objectPosition: data?.imageAdjustment
                        ?.leaderIntroductionAvatar?.objectPosition
                        ? `${data.imageAdjustment.leaderIntroductionAvatar.objectPosition.x}% ${data.imageAdjustment.leaderIntroductionAvatar.objectPosition.y}%`
                        : "50% 50%",
                      objectFit:
                        data?.imageAdjustment?.leaderIntroductionAvatar
                          ?.objectFit || "cover",
                      transition: "object-position 0.3s ease-in-out",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t"
                    style={{
                      backgroundImage: `linear-gradient(to top, ${getColor(
                        "primary",
                        200
                      )} 1%, transparent 50%)`,
                    }}
                  ></div>
                </div>

                {/* Desktop Clip Path Overlay */}
                <div className="hidden absolute inset-0 md:block">
                  <div className="w-full h-full clip-path-desktop"></div>
                </div>

                {/* Mobile Clip Path Overlay */}
                <div className="absolute inset-0 md:hidden">
                  <div className="w-full h-full clip-path-mobile"></div>
                </div>
              </div>
            </div>

            {/* Right Bar Decoration (match JobDescription cut-out) */}
            <div className="rightBar z-10 absolute top-[-10px] right-[-3px] bottom-[110px] w-[87px] bg-white rounded-bl-2xl">
              <div className="absolute bottom-[-30px] right-[3px]">
                <div className="corner bottom-left"></div>
              </div>
              <div className="absolute left-[-30px] top-0">
                <div className="corner bottom-left"></div>
              </div>
            </div>

            {/* Bottom Bar Decoration (match JobDescription cut-out) */}
            <div className="absolute z-10 left-[-1px] bottom-[-2px] right-[110px] h-[97px] bg-white rounded-tr-2xl rounded-br-none">
              <div className="absolute right-[-30px] bottom-[-10px]">
                <div className="corner top-right"></div>
              </div>
              <div className="absolute top-[-30px] left-0">
                <div className="corner top-right"></div>
              </div>
            </div>

            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Allura&family=Herr+Von+Muellerhoff&family=Parisienne&display=swap');

              .allura-regular {
                font-family: "Allura", cursive;
                font-weight: 400;
                font-style: normal;
              }

              .corner {
                width: 30px;
                height: 40px;
                position: relative;
                overflow: hidden;
                border: 0 !important;
                outline: none !important;
                box-shadow: none !important;
              }

              .corner::after {
                content: "";
                position: absolute;
                border: 0 !important;
                outline: none !important;
                box-shadow: none !important;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
              }

              .top-right::after {
                background-image: radial-gradient(circle at 100% 0, transparent 30px, white 30px);
              }

              .bottom-left::after {
                background-image: radial-gradient(circle at 0 100%, transparent 30px, white 30px);
              }

              .rightBar {
                background-color: white !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                z-index: 10 !important;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderIntroduction = ({ landingPageData }) => {
    // if (landingPageData?.templateId?.toLowerCase() === "3")
  //   return <TemplateX data={landingPageData} />;
  if (landingPageData?.templateId === "1")
    return <Template1 data={landingPageData} />;
  if (landingPageData?.templateId === "2")
    return <Template2 data={landingPageData} />;
  if (landingPageData?.templateId === "3")
    return <Template3 data={landingPageData} />;
  if (landingPageData?.templateId === "4")
    return <Template4 data={landingPageData} />;
  if (landingPageData?.templateId === "5")
    return <Template5 data={landingPageData} />;

  return <Template3 data={landingPageData} />;
};

export default LeaderIntroduction;
