import React, { useRef, useLayoutEffect, useEffect } from "react";
import { Heading, Img, Text } from "./components";
import { useHover } from "../../contexts/HoverContext";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import { getFonts } from "./getFonts";
import { scrollToElement } from "./scrollUtils.js";
const useEvpHover = () => {
  const { hoveredField, scrollToSection ,setLastScrollToSection,lastScrollToSection} = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const fullnameRef = useRef();
  const jobTitleRef = useRef();
  const avatarRef = useRef();

  React.useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      evpMissionTitle: titleRef,
      evpMissionDescription: descriptionRef,
      evpMissionFullname: fullnameRef,
      evpMissionCompanyName: jobTitleRef,
      evpMissionAvatar: avatarRef,
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
    if (scrollToSection === "evp-mission" && sectionRef.current&&lastScrollToSection !== "evp-mission") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("evp-mission")
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
const Template2 = ({ landingPageData, fetchData }) => {
  const { hoveredField } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const nameRef = useRef();
  const companyRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      evpMissionTitle: titleRef,
      evpMissionDescription: descriptionRef,
      evpMissionFullname: nameRef,
      evpMissionCompanyName: companyRef,
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
      targetRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hoveredField]);

  return (
    <div ref={sectionRef} className="evp-mission-section">
      <div className="flex justify-center bg-[#ffffff] py-[38px] smx:py-5">
        <div className="container flex justify-center px-6 mb-14 mdx:px-5">
          <div className="flex justify-center items-start px-14 w-full mdx:flex-col mdx:px-5">
            <div className="relative mb-[46px] min-h-[354px] w-[58%] mdx:w-full">
              <div className="absolute bottom-[-0.13px] left-0 right-0 m-auto flex w-[76%] flex-col items-start gap-6">
                <div ref={titleRef} className="w-full">
                  <Heading
                    as="h2"
                    className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px] p-2"
                  >
                    {landingPageData?.evpMissionTitle}
                  </Heading>
                </div>
                <div ref={descriptionRef} className="w-full">
                  <Text
                    size="text_xl_regular"
                    as="p"
                    className="w-[86%] text-[20px] font-normal leading-[30px] text-[#475466] mdx:w-full p-2"
                  >
                    {landingPageData?.evpMissionDescription}
                  </Text>
                </div>
                <div className="flex flex-col gap-1 justify-center items-start self-stretch">
                  <div ref={nameRef} className="w-full">
                    <Heading
                      size="text_lg_semibold"
                      as="h3"
                      className="text-[18px] font-semibold text-[#5207CD] p-2"
                    >
                      — {landingPageData?.evpMissionFullname}
                    </Heading>
                  </div>
                  <div ref={companyRef} className="w-full">
                    <Text
                      size="text_md_regular"
                      as="p"
                      className="text-[16px] font-normal text-[#475466] p-2"
                    >
                      CEO of {landingPageData?.evpMissionCompanyName}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 m-auto h-[156px] w-[156px] rounded-[78px] bg-gradient-to-b from-[#83c0fd19] to-[#5207CD19]" />
            </div>
            {landingPageData?.evpMissionAvatar && (
              <Img
                src={landingPageData?.evpMissionAvatar}
                alt="Ceo Image"
                className="h-[344px] w-[28%] self-end rounded object-contain mdx:w-full mdx:self-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Template3 = ({ landingPageData, fetchData }) => {
  const { hoveredField } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const nameRef = useRef();
  const companyRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      evpMissionTitle: titleRef,
      evpMissionDescription: descriptionRef,
      evpMissionFullname: nameRef,
      evpMissionCompanyName: companyRef,
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
      targetRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hoveredField]);

  return (
    <div ref={sectionRef} className="evp-mission-section">
      <div className="flex justify-center bg-[#ffffff] py-[38px] smx:py-5">
        <div className="container flex justify-center px-6 mb-14 mdx:px-5">
          <div className="flex justify-center items-start px-14 w-full mdx:flex-col mdx:px-5">
            <div className="relative mb-[46px] h-[354px] w-[58%] mdx:w-full">
              <div className="absolute bottom-[-0.13px] left-0 right-0 m-auto flex w-[76%] flex-col items-start gap-6">
                <div ref={titleRef} className="w-full">
                  <Heading
                    as="h2"
                    className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px] p-2"
                  >
                    {landingPageData?.evpMissionTitle}
                  </Heading>
                </div>
                <div ref={descriptionRef} className="w-full">
                  <Text
                    size="text_xl_regular"
                    as="p"
                    className="w-[86%] text-[20px] font-normal leading-[30px] text-[#475466] mdx:w-full p-2"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          landingPageData?.evpMissionDescription?.replace?.(
                            /\n/g,
                            "<br></br>"
                          ),
                      }}
                    />
                  </Text>
                </div>
                <div className="flex flex-col gap-1 justify-center items-start self-stretch">
                  <div ref={nameRef} className="w-full">
                    <Heading
                      size="text_lg_semibold"
                      as="h3"
                      className="text-[18px] font-semibold text-[#5207CD] p-2"
                    >
                      — {landingPageData?.evpMissionFullname}
                    </Heading>
                  </div>
                  <div ref={companyRef} className="w-full">
                    <Text
                      size="text_md_regular"
                      as="p"
                      className="text-[16px] font-normal text-[#475466] p-2"
                    >
                      CEO of {landingPageData?.evpMissionCompanyName}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 m-auto h-[156px] w-[156px] rounded-[78px] bg-gradient-to-b from-[#83c0fd19] to-[#5207CD19]" />
            </div>
            {landingPageData?.evpMissionAvatar && (
              <Img
                src={landingPageData?.evpMissionAvatar}
                alt="Ceo Image"
                className="h-[344px] w-[28%] self-end rounded object-contain mdx:w-full mdx:self-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Template1 = ({ landingPageData }) => {
  console.log("landingPageData", landingPageData);
  const refs = useEvpHover();

  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#26B0C6";
  const secondaryColor = landingPageData?.secondaryColor || "#F7E733";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

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
const {  subheaderFont, bodyFont } = getFonts(landingPageData);
  return (
    <div
      ref={refs.sectionRef}
      className="overflow-hidden relative px-4 py-16 w-full bg-white md:px-8"
      id="evp-mission"
      style={{color:"black",fontFamily: bodyFont?.family}}
    >
      {/* Add clip path styles */}
      <style>{clipPathStyles}</style>

      {/* Decorative Elements */}

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 items-center md:grid-cols-2 md:gap-16">
          {/* Content Section */}
          <div>
            <div ref={refs.titleRef}>
              <h2
                className="mb-6 text-3xl font-bold md:text-4xl"
                style={{ fontFamily: subheaderFont?.family }}
              >
                {landingPageData?.evpMissionTitle?.split(" ")[0] || "Meet"}{" "}
                <span style={{ fontFamily: subheaderFont?.family }}>
                  {landingPageData?.evpMissionTitle?.split(" ").slice(1).join(" ") ||
                    "Our CEO"}
                </span>
              </h2>
            </div>

            <div ref={refs.descriptionRef}>
              <p
                className="mb-8 leading-relaxed"
                style={{ fontFamily: bodyFont?.family }}
                dangerouslySetInnerHTML={{
                  __html:
                    (landingPageData?.evpMissionDescription ||
                      "With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!"
                    )?.replace?.(/\n/g, "<br>")
                }}
              >
              </p>
            </div>

            <div className="mb-4">
            
              <div className="flex items-center">
                <div
                  className="mr-3 w-1 h-10"
                  style={{ backgroundColor: getColor("primary", 500) }}
                ></div>
                <div>
                  <div className="font-medium" >
                    {landingPageData?.evpMissionFullname || "John Smith"}
                  </div>
                  <div
                    ref={refs.jobTitleRef}
                    
                  >
                    {landingPageData?.evpMissionCompanyName || "CEO of Hirelab"}
                  </div>
                </div>
              </div>
            </div>
          </div>  

          {/* Image Section with Advanced Cropping Effect */}
          <div className="relative order-first md:order-last rounded-2xl " style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
            <div className="overflow-hidden relative ">
              <div ref={refs.avatarRef} className="relative aspect-[5/5] md:aspect-[4/4] w-full h-full">
              
              {/* Main Image */}
              <div className="overflow-hidden absolute inset-0 rounded-3xl">
                  <Img
                    src={
                      landingPageData?.evpMissionAvatar ||
                       "/dhwise-images/placeholder.png"
                    }
                    alt={`${landingPageData?.evpMissionCompanyName || "CEO"}`}
                    className="object-cover w-full h-full"
                    style={{
                      objectPosition: landingPageData?.imageAdjustment?.evpMissionAvatar?.objectPosition
                        ? `${landingPageData.imageAdjustment.evpMissionAvatar.objectPosition.x}% ${landingPageData.imageAdjustment.evpMissionAvatar.objectPosition.y}%`
                        : "50% 50%",
                      objectFit:
                        landingPageData?.imageAdjustment?.evpMissionAvatar?.objectFit || "cover",
                      transition: "object-position 0.3s ease-in-out",
                    }}
                  />

                <div
                  className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t"
                  style={{
                    backgroundImage: `linear-gradient(to top, ${getColor("primary", 50)} 1%, transparent 50%)`,
                  }}
                ></div>
              </div>

              {/* Clip path overlay for desktop */}
              <div className="hidden absolute inset-0 md:block">
                <div className="w-full h-full clip-path-desktop"></div>
              </div>

              {/* Clip path overlay for mobile */}
              <div className="absolute inset-0 md:hidden">
                <div className="w-full h-full clip-path-mobile"></div>
              </div>
            </div>
          </div>
          {/* Right Bar Decoration */}
            <div className="rightBar z-10 absolute top-[-1px] left-[-1px] bottom-[110px] w-[85px] bg-white rounded-b-2xl ">
              
              <div className={  `z-40 absolute h-[60px] w-[60px] bottom-[0px] mb-7 left-[-60px] rounded-xl smx:hidden `} style={{background: `${getColor("tertiary", 200)}`}} />

              
              <div className="absolute bottom-[-30px] left-[-10px] ">
                <div className="arc leader-bottom-right"></div>
              </div>
              <div className="absolute right-[-30px] top-[-9px]">
                <div className="arc leader-bottom-right"></div>
              </div>
            </div>

            {/* Bottom Bar Decoration */}
            <div className="absolute z-10 left-[110px] bottom-[-1px] right-[-1px] h-[85px] bg-white rounded-tl-2xl">
              <div className={  `z-90 absolute h-[80px] w-[80px] bottom-[-60px] left-[90px] rounded-xl smx:hidden `} style={{background: `${getColor("tertiary", 200)}`}}/>
              <div className="absolute left-[-30px] bottom-[-10px] ">
                <div className="arc leader-top-left"></div>
              </div>
              <div className="absolute top-[-30px] right-[-10px]">
                <div className="arc leader-top-left"></div>
              </div>
            </div>

            <style jsx>{`
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
      background-image: radial-gradient(circle at 0 0, transparent 30px, white 20px);
    }

    .leader-top-right::after {
      background-image: radial-gradient(circle at 100% 0, transparent 20px, white 20px);
    }

    .leader-bottom-left::after {
      background-image: radial-gradient(circle at 0 100%, transparent 20px, white 20px);
    }

    .leader-bottom-right::after {
      background-image: radial-gradient(circle at 100% 100%, transparent 30px, white 20px);
    }
  `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

const EVPMission = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 data={props?.landingPageData} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default EVPMission;
