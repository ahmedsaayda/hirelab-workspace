import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Heading, Img, Text } from "./components";

import { useHover } from "../../contexts/HoverContext";
import { useFocusContext } from "../../contexts/FocusContext";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette";
import { getFonts } from "./getFonts";
import { scrollToElement } from "./scrollUtils.js";

const useTextBoxHover = () => {
  const { hoveredField, scrollToSection,setLastScrollToSection,lastScrollToSection } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  const descriptionRef = useRef();
  const imageRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      textBoxTitle: titleRef,
      textBoxText: textRef,
      textBoxDescription: descriptionRef,
      textBoxImage: imageRef,
    };

    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
  }, [hoveredField]);

  // scroll to section
  useEffect(() => {
    if (scrollToSection === "text-box" &&
       sectionRef.current && lastScrollToSection !== "text-box") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("text-box")
    }
  }, [scrollToSection]);

  return { sectionRef, titleRef, textRef, descriptionRef, imageRef };
};

const Template1 = ({ landingPageData, fetchData }) => {
  const { sectionRef, titleRef, textRef, descriptionRef, imageRef } =
    useTextBoxHover();
  const { handleItemClick } = useFocusContext();

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
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Split the title into first word and rest of words for styling
  const textBoxTitleParts = (landingPageData?.textBoxTitle || "Text Box").split(" ");
  const firstWord = textBoxTitleParts[0];
  const restWords = textBoxTitleParts.slice(1).join(" ");

  const {  subheaderFont, bodyFont } = getFonts(landingPageData);
  return (
    <div className="w-full bg-white py-16 md:py-24" ref={sectionRef} id="text-box">
      <div className="flex justify-center bg-[#ffffff]">
        <div className="container flex justify-center px-6 mdx:px-5">
          <div className="flex justify-center items-start px-14 w-full mdx:flex-col mdx:px-5">
            <div className="relative w-[58%] mdx:w-full">
              <div className="flex w-[76%] flex-col items-start gap-6">
                {landingPageData?.textBoxImage || (
                  <Img
                    src={landingPageData?.textBoxImage || "https://res.cloudinary.com/dvq0ouupb/image/upload/v1742810526/f8adpqdf3bhfp3bqgauk.png"}
                    alt="Ceo Image"
                    className="h-[344px] w-full self-end rounded object-contain mdx:w-full mdx:self-auto"
                    onClick={() => handleItemClick("textBoxImage")}
                    ref={imageRef}
                  />
                )}
                <h2
                  onClick={() => handleItemClick("textBoxTitle")}
                  ref={titleRef}
                  className="text-[36px] text-center font-semibold tracking-[-0.72px] mdx:text-[34px] smx:text-[32px]"
                  style={{fontFamily: subheaderFont?.family }}
                >
                  <span className="text-[#1a3e4c]" style={{fontFamily: subheaderFont?.family }}>{firstWord}</span>{" "}
                  <span style={{ color: getColor("primary", 500),fontFamily: subheaderFont?.family }}>
                    {restWords}
                  </span>
                </h2>
                <h3
                  onClick={() => handleItemClick("textBoxText")}
                  ref={textRef}
                  className="w-[86%] text-center text-[20px] font-normal leading-[16px] text-[#475466] mdx:w-full"
                  style={{fontFamily: bodyFont?.family }}
               >
                  {landingPageData?.textBoxText}
                </h3>
                <p
                  onClick={() => handleItemClick("textBoxDescription")}
                  ref={descriptionRef}
                  className="w-[86%] text-center text-[20px] font-normal leading-[16px] text-[#475466] mdx:w-full"
                  style={{fontFamily: bodyFont?.family }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: landingPageData?.textBoxDescription?.replace?.(
                        /\n/g,
                        "<br>"
                      ),
                    }}
                  />
                </p>
              </div>
              <div 
                className="absolute left-[-78px] top-[-78px] h-[156px] w-[156px] rounded-[78px] -z-10" 
                style={{
                  background: `linear-gradient(to bottom, ${getColor("primary", 100)}19, ${getColor("primary", 500)}19)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Template3 = ({ landingPageData, fetchData }) => {
  const { sectionRef, titleRef, textRef, descriptionRef, imageRef } =
    useTextBoxHover();
  const { handleItemClick } = useFocusContext();
  
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
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Split the title into first word and rest of words for styling
  const textBoxTitleParts = (landingPageData?.textBoxTitle || "Text Box").split(" ");
  const firstWord = textBoxTitleParts[0];
  const restWords = textBoxTitleParts.slice(1).join(" ");
  const {  subheaderFont, bodyFont } = getFonts(landingPageData);
  return (
    <div className="w-full bg-white py-16 md:py-24" ref={sectionRef} id="text-box"
    style={{color:"black",fontFamily: bodyFont?.family}}
    >
      <div className="flex justify-center bg-[#ffffff]">
        <div className="container flex justify-center px-6 mdx:px-5">
          <div className="flex justify-center items-start px-14 w-full mdx:flex-col mdx:px-5">
            <div className="relative lg:w-[58%] flex w-full">
              <div className="flex w-full m-auto lg:w-[76%] flex-col items-start gap-6">
                <h2
                  onClick={() => handleItemClick("textBoxTitle")}
                  ref={titleRef}
                  className="text-[36px] text-center md:text-left font-semibold tracking-[-0.72px] mdx:text-[34px] smx:text-[32px]"
                  style={{fontFamily: subheaderFont?.family }}
                >
                  <span  style={{fontFamily: subheaderFont?.family }}>{firstWord}</span>{" "}
                  <span style={{ fontFamily: subheaderFont?.family }}>
                    {restWords}
                  </span>
                </h2>
                <h3
                  onClick={() => handleItemClick("textBoxText")}
                  ref={textRef}
                  className="w-[86%] text-center md:text-left text-[20px] font-normal leading-relaxed  mdx:w-full"
                  style={{ fontFamily: subheaderFont?.family }}
                  dangerouslySetInnerHTML={{
                    __html: landingPageData?.textBoxText
                  }}
                >
                </h3>
                <p
                  
                  onClick={() => handleItemClick("textBoxDescription")}
                  ref={descriptionRef}
                  className="w-[86%] text-center md:text-left  font-normal leading-relaxed  mdx:w-full"
                  style={{fontFamily: bodyFont?.family }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: landingPageData?.textBoxDescription?.replace?.(
                        /\n/g,
                        "<br></br>"
                      ),
                    }}
                  />
                </p>
              </div>
              <div 
                className="absolute left-[-78px] top-[-78px] h-[156px] w-[156px] rounded-3xl -z-10" 
                style={{
                  background: `linear-gradient(to bottom, ${getColor("tertiary", 100)}19, ${getColor("tertiary", 500)}19)`
                }}
              />
            </div>
            {(
  <div
    className="relative w-[50%] self-end mdx:w-full mdx:self-auto rounded-2xl"
    style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
  >
    {/* Shadow Wrapper */}
    <div className="overflow-hidden relative shadow-md rounded-3xl">
      <div className="relative aspect-[1/1] w-full h-full">
        {/* Main Image with clip-path */}
        <div className="overflow-hidden absolute inset-0 rounded-3xl">
                      <Img
                        src={
                          landingPageData?.textBoxImage ||
                          "/dhwise-images/placeholder.png"
                        }
                        alt="Ceo Image"
                        className="clip-path object-cover w-full h-full"
                        onClick={() => handleItemClick("textBoxImage")}
                        ref={imageRef}
                        style={{
                          objectPosition: landingPageData?.imageAdjustment?.textBoxImage?.objectPosition
                            ? `${landingPageData.imageAdjustment.textBoxImage.objectPosition.x}% ${landingPageData.imageAdjustment.textBoxImage.objectPosition.y}%`
                            : "50% 50%",
                          objectFit:
                            landingPageData?.imageAdjustment?.textBoxImage?.objectFit || "cover",
                          transition: "object-position 0.3s ease-in-out",
                        }}
                      />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `linear-gradient(to top, ${getColor("primary", 50)} 1%, transparent 50%)`,
            }}
          />
        </div>

        {/* Clip Path Shape Overlays */}
        <div className="hidden absolute inset-0 md:block">
          <div className="w-full h-full clip-path-desktop"></div>
        </div>
        <div className="absolute inset-0 md:hidden">
          <div className="w-full h-full clip-path-mobile"></div>
        </div>
      </div>
    </div>

    {/* Optional Decorative Corners */}
    <div className="absolute top-[-1px] left-[-1px] bottom-[110px] w-[85px] bg-white rounded-b-2xl z-10">
      <div
        className="z-40 absolute h-[70px] w-[70px] bottom-[0px] mb-7 left-[-80px] rounded-xl"
        style={{ background: `${getColor("tertiary", 200)}` }}
      />
      <div className="absolute bottom-[-30px] left-[-10px]">
        <div className="arc leader-bottom-right"></div>
      </div>
      <div className="absolute right-[-30px] top-[-9px]">
        <div className="arc leader-bottom-right"></div>
      </div>
    </div>

    <div className="absolute z-10 left-[110px] bottom-[-1px] right-[-1px] h-[85px] bg-white rounded-tl-2xl">
      <div
        className="z-90 absolute h-[100px] w-[100px] bottom-[-60px] left-[90px] rounded-xl"
        style={{ background: `${getColor("tertiary", 200)}` }}
      />
      <div className="absolute left-[-30px] bottom-[-10px]">
        <div className="arc leader-top-left"></div>
      </div>
      <div className="absolute top-[-30px] right-[-10px]">
        <div className="arc leader-top-left"></div>
      </div>
    </div>

    {/* Styles */}
    <style jsx>{`
      .clip-path {
        clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
      }
      .clip-path-desktop {
        clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
        background-color: rgba(255, 255, 255, 0.05);
      }
      .clip-path-mobile {
        clip-path: circle(70% at 50% 50%);
        background-color: rgba(255, 255, 255, 0.05);
      }
      .arc {
        width: 40px;
        height: 40px;
        position: relative;
        overflow: hidden;
      }
      .arc::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .leader-top-left::after {
        background-image: radial-gradient(circle at 0 0, transparent 30px, white 20px);
      }
      .leader-bottom-right::after {
        background-image: radial-gradient(circle at 100% 100%, transparent 30px, white 20px);
      }
    `}</style>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

const TextBox = (props) => {
  if (props?.landingPageData?.templateId === "2")
    return <Template1 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template3 {...props} />;

  return <Template3 {...props} />;
};

export default TextBox;
