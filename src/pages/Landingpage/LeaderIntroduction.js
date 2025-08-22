import React, { useEffect, useRef } from "react";
import { Heading, Img, Text } from "./components";
import { useHover } from "../../contexts/HoverContext";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import { getFonts } from "./getFonts";
// import { Heading, Img, Text } from "./ui";

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
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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

const Template2 = ({ data }) => (
  <div className="px-4 py-16 mx-auto bg-white">
    <div className="flex flex-col gap-12 items-center mx-auto max-w-6xl md:flex-row">
      <div className="space-y-6 md:w-1/2">
        <Heading
          as="h2"
          className="text-[36px] font-semibold tracking-[-0.72px] text-[#0B4B3C]"
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
);

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
                    (data?.leaderIntroductionDescription ||
                      "With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!")?.replace?.(/\n/g, "<br>")
                }}
              >
              </p>
            </div>

            <div className="mb-4">
              <div ref={refs.fullnameRef} className="mb-4 text-3xl font-script">
                {data?.leaderIntroductionFullname || "John Smith"}
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

            {/* Right Bar Decoration */}
            <div className="rightBar z-10 absolute top-[-1px] left-[-1px] bottom-[110px] w-[85px] bg-white rounded-b-2xl ">
              <div
                className={`z-40 absolute h-[70px] w-[70px] bottom-[0px] mb-7 left-[-80px] rounded-xl   smx:left-[10px] smx:bottom-[10px] smx:h-[55px] smx:w-[55px]`}
                style={{ background: `${getColor("tertiary", 300)}` }}
              />

              <div className="absolute bottom-[-30px] left-[-10px] ">
                <div className="arc leader-bottom-right"></div>
              </div>
              <div className="absolute right-[-30px] top-[-9px]">
                <div className="arc leader-bottom-right"></div>
              </div>
            </div>

            {/* Bottom Bar Decoration */}
            <div className="absolute z-10 left-[110px] bottom-[-1px] right-[-1px] h-[85px] bg-white rounded-tl-2xl">
              <div
                className={`z-90 absolute h-[100px] w-[100px] bottom-[-60px] left-[90px] rounded-xl  smx:h-[70px] smx:w-[70px] smx:bottom-[-40px] smx:left-[50px] `}
                style={{ background: `${getColor("tertiary", 300)}` }}
              />
              <div className="absolute left-[-30px] bottom-[-10px] ">
                <div className="arc leader-top-left"></div>
              </div>
              <div className="absolute top-[-30px] right-[-10px]">
                <div className="arc leader-top-left"></div>
              </div>
            </div>

            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Allura&family=Herr+Von+Muellerhoff&family=Parisienne&display=swap');

              .allura-regular {
                font-family: "Allura", cursive;
                font-weight: 400;
                font-style: normal;
              }

              .arc {
                width: 40px;
                height: 40px;
                position: relative;
                overflow: hidden;
                border: 0;
              }

              .arc::after {
                content: "";
                position: absolute;
                border: 0;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
              }

              .leader-top-left::after {
                background-image: radial-gradient(
                  circle at 0 0,
                  transparent 30px,
                  white 20px
                );
              }

              .leader-top-right::after {
                background-image: radial-gradient(
                  circle at 100% 0,
                  transparent 20px,
                  white 20px
                );
              }

              .leader-bottom-left::after {
                background-image: radial-gradient(
                  circle at 0 100%,
                  transparent 20px,
                  white 20px
                );
              }

              .leader-bottom-right::after {
                background-image: radial-gradient(
                  circle at 100% 100%,
                  transparent 30px,
                  white 20px
                );
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
