import React, { Suspense, useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback } from "react";
import { Heading, Text } from "./components/index.jsx";
import BenefitsOverview from "./components/BenefitsOverview/index.jsx";
import BenefitsOverview1 from "./components/BenefitsOverview1/index.jsx";
import { scrollToElement } from "./scrollUtils.js";
import { getThemeData } from "../../utils/destructureTheme.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { Check, Zap, FileEdit, Network } from "lucide-react";
import { useHover } from "../../contexts/HoverContext.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { useRouter } from "next/router";
import { IconRenderer } from "../LandingpageEdit/IconsSelector.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
const useJobSpecificationHover = () => {
  const { hoveredField, scrollToSection ,setLastScrollToSection,lastScrollToSection} = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  // Change this - we'll use an object to store direct references to DOM elements
  const specificationsRefs = useRef({});

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      jobSpecificationTitle: titleRef,
      jobSpecificationDescription: textRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Clear highlights from specifications elements
    Object.values(specificationsRefs.current).forEach((ref) => {
      if (ref) {
        ref.classList.remove("highlight-section");
      }
    });

    // Handle regular fields
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
      return;
    }

    // Handle specification fields - use exact hoveredField as key
    if (specificationsRefs.current[hoveredField]) {
      specificationsRefs.current[hoveredField].classList.add(
        "highlight-section"
      );
    }
  }, [hoveredField]);

  useEffect(() => {
    if (scrollToSection === "job-specifications" && sectionRef.current&&lastScrollToSection !== "job-specifications") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("job-specifications")
    }
  }, [scrollToSection]);

  /* 
  {
    'specifications[0].icon': null,
    'specifications[0].title': null,
    'specifications[0].description': null,
    'specifications[0].bulletPoints[0]': null,
    'specifications[0].bulletPoints[1]': null,
    'specifications[0].bulletPoints[2]': null,
    'specifications[1].icon': null,
    'specifications[1].title': null,
    'specifications[1].description': null,
    'specifications[1].bulletPoints[0]': null,
    'specifications[1].bulletPoints[1]': null,
    'specifications[1].bulletPoints[2]': null,
    'specifications[1].bulletPoints[3]': null,
    'specifications[2].icon': null,
    'specifications[2].title': null,
    'specifications[2].description': null,
    'specifications[2].bulletPoints[0]': null,
    'specifications[2].bulletPoints[1]': null,
    'specifications[2].bulletPoints[2]': null
  }
  */
  return {
    sectionRef,
    titleRef,
    textRef,
    specificationsRefs,
  };
};
const Template3 = ({ landingPageData, fetchData }) => {

  const themeData = getThemeData(landingPageData?.theme);

  const { basePrimary, baseSecondary, baseTertiary } = themeData;
  const { variantPl1, variantPl2, variantPl3, variantPl4 } = themeData;
  const { variantPd1, variantPd2, variantPd3, variantPd4, variantPd5 } =
    themeData;
  const { variantSl1, variantSl2, variantSl3, variantSl4 } = themeData;
  const { variantSd1, variantSd2, variantSd3, variantSd4, variantSd5 } =
    themeData;
  const { variantTl1, variantTl2, variantTl3, variantTl4 } = themeData;
  const { variantTd1, variantTd2, variantTd3, variantTd4, variantTd5 } =
    themeData;
  const { textHeadingColor, textSubHeadingColor } = themeData;

  const specifications = (landingPageData.specifications ?? []).filter(
    (spec) => spec.enabled
  );
  
  return (
    <>
      <div
        className=""
        style={{
          backgroundColor: variantPl4,
        }}
      >
        <div className="flex flex-col items-center justify-center bg-[#f5f5f2] py-24 md:py-5 mt-10">
          <div className="container flex flex-col gap-6 md:px-5">
            <div className="flex flex-col gap-3.5 items-start mx-8 md:mx-0">
              <Heading
                as="h2"
                className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] md:text-[34px] sm:text-[32px] text-center w-full"
                style={{ color: variantPd4 }}
              >
                {landingPageData?.jobSpecificationTitle}
              </Heading>
              <Text
                size="text_xl_regular"
                as="p"
                className="text-[20px] font-normal text-[#000000] text-center w-full"
                style={{ color: variantPd4 }}
              >
                {landingPageData?.jobSpecificationDescription}
              </Text>
            </div>
            <div className="flex gap-6 px-8 py-[42px] md:flex-col md:py-5 sm:p-5">
              <Suspense fallback={<div>Loading feed...</div>}>
                <div className="flex gap-2 justify-center w-full mdx:flex-col mdx:gap-10">
                  {/* <BenefitsOverview1
                    headingText={landingPageData?.benefitsTitle}
                    benefits={landingPageData?.benefits ?? []}
                    icon="/images3/img_television_light_blue_a700.png"
                  />
                  <BenefitsOverview1
                    headingText={landingPageData?.responsibilitiesTitle}
                    benefits={landingPageData?.responsibilities ?? []}
                    icon="/images3/icon (3).png"
                  />
                  <BenefitsOverview1
                    headingText={landingPageData?.tasksTitle}
                    benefits={landingPageData?.tasks ?? []}
                    icon="/images3/icon (4).png"
                  /> */}

                  {specifications?.map((spec, index) => {
                    return (
                      <BenefitsOverview1
                        key={index}
                        headingText={spec?.title}
                        headingDescription={spec?.description}
                        benefits={spec?.bulletPoints
                          ?.map((bullet) => bullet?.bullet)
                          ?.filter((bullet) => bullet !== "")}
                        icon={spec?.icon}
                      />
                    );
                  })}
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Template2 = ({ landingPageData, fetchData }) => {
  const specifications = (landingPageData.specifications ?? []).filter(
    (spec) => spec.enabled
  );
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-[#f9fafb] py-5 mdx:py-5">
        <div className="container flex flex-col gap-0.5 mt-4 mdx:px-5">
          <div className="mx-[252px] flex flex-col items-center gap-3.5 mdx:mx-0">
            <Heading
              as="h2"
              className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] sm:text-[32px]"
            >
              {landingPageData?.jobSpecificationTitle}
            </Heading>
            <Text
              size="text_xl_regular"
              as="p"
              className="text-[20px] font-normal text-[#475466]"
            >
              {landingPageData?.jobSpecificationDescription}
            </Text>
          </div>
          <div className="px-8 sm:px-5">
            <div className="flex flex-col flex-1 items-end m-auto">
              <div className="mr-72 h-[54px] w-[254px] rounded-[126px] bg-[#5207CD0f] blur-[200.00px] backdrop-opacity-[0.5] mdx:mr-0" />
              <Suspense fallback={<div>Loading feed...</div>}>
                <div
                  // className="flex gap-8 self-stretch h-full mdx:flex-col"
                  className="flex gap-2 justify-center w-full mdx:flex-col mdx:gap-10"
                >
                  {/* <BenefitsOverview
                    headingText={landingPageData?.benefitsTitle}
                    benefits={landingPageData?.benefits ?? []}
                    icon="/images3/zap-fast.png"
                    buttonApplyNow={landingPageData?.cta2Title}
                    buttonApplyNowLink={landingPageData?.cta2Link}
                  />
                  <BenefitsOverview
                    headingText={landingPageData?.responsibilitiesTitle}
                    benefits={landingPageData?.responsibilities ?? []}
                    icon="/images3/edit-05.png"
                    buttonApplyNow={landingPageData?.cta2Title}
                    buttonApplyNowLink={landingPageData?.cta2Link}
                  />
                  <BenefitsOverview
                    headingText={landingPageData?.tasksTitle}
                    benefits={landingPageData?.tasks ?? []}
                    icon="/images3/route.png"
                    buttonApplyNow={landingPageData?.cta2Title}
                    buttonApplyNowLink={landingPageData?.cta2Link}
                  /> */}
                  {specifications?.map((spec, index) => {
                    return (
                      <BenefitsOverview
                        key={index}
                        headingText={spec?.title}
                        benefits={spec?.bulletPoints
                          ?.map((bullet) => bullet?.bullet)
                          ?.filter((bullet) => bullet !== "")}
                        icon={spec?.icon}
                        buttonApplyNow={landingPageData?.cta2Title}
                        buttonApplyNowLink={landingPageData?.cta2Link}
                      />
                    );
                  })}
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Template1 = React.memo(({ landingPageData, fetchData }) => {
  const router = useRouter();
  const { handleItemClick } = useFocusContext();
  const { hoveredField } = useHover();
  
  const { sectionRef, titleRef, textRef, specificationsRefs } = useJobSpecificationHover();
  
  // Memoize colors and theme values
  const colors = useMemo(() => ({
    primaryColor: landingPageData?.primaryColor || "#26B0C6",
    secondaryColor: landingPageData?.secondaryColor || "#F7E733",
    tertiaryColor: landingPageData?.tertiaryColor || "#44b566"
  }), [landingPageData?.primaryColor, landingPageData?.secondaryColor, landingPageData?.tertiaryColor]);

  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#26B0C6",
      secondaryColor: "#F7E733",
      tertiaryColor: "#44b566",
    },
    colors
  );

  const specifications = useMemo(() => 
    landingPageData?.specifications?.filter((spec) => spec.enabled) || [],
    [landingPageData?.specifications]
  );

  const gridColumns = useMemo(() => {
    if (specifications.length === 1) return "md:grid-cols-1";
    if (specifications.length === 2) return "md:grid-cols-2";
    return "md:grid-cols-3";
  }, [specifications.length]);

  const { subheaderFont, bodyFont } = useMemo(() => 
    getFonts(landingPageData),
    [landingPageData]
  );

  const textColor = useMemo(() => 
    calculateTextColor(getColor("primary", 100)),
    [getColor]
  );

  const fallBackIcons = useMemo(() => ["Zap", "FilePenLine", "Network"], []);

  // Simple bullet point component without any height calculations
  const BulletPoint = useMemo(() => {
    return React.memo(({ index, rowIndex, item, getColor, handleItemClick, specificationsRefs }) => (
      <li className="flex items-start">
        <div className="flex-shrink-0 mt-1 mr-3">
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getColor("primary", 500) }}
          >
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.0964 0.390037L3.93643 7.30004L2.03643 5.27004C1.68643 4.94004 1.13643 4.92004 0.736435 5.20004C0.346435 5.49004 0.236435 6.00004 0.476435 6.41004L2.72643 10.07C2.94643 10.41 3.32643 10.62 3.75643 10.62C4.16643 10.62 4.55643 10.41 4.77643 10.07C5.13643 9.60004 12.0064 1.41004 12.0064 1.41004C12.9064 0.490037 11.8164 -0.319963 11.0964 0.380037V0.390037Z" fill="white"/>
            </svg>
          </div>
        </div>
        <span
          ref={(el) => {
            specificationsRefs.current[
              `specifications[${index}].bulletPoints[${rowIndex}]`
            ] = el;
          }}
          className="block"
          style={{ color: "black" }}
          onClick={() =>
            handleItemClick(
              `specifications[${index}].bulletPoints[${rowIndex}]`
            )
          }
        >
          {item.bullet}
        </span>
      </li>
    ));
  }, []);

  return (
    <div
      id="job-specifications"
      ref={sectionRef}
      className="px-4 pt-16 pb-16 w-full bg-white md:px-8"
    >
      <div className="container mx-auto">
        {/* Decorative Elements */}
        <div className="relative">
          <div
            className="absolute -top-[25px] left-1/4 w-16 h-16 rounded-lg opacity-30 smx:top-[-20px] smx:left-4 smx:w-12 smx:h-12"
            style={{ backgroundColor: getColor("tertiary", 200) }}
          ></div>
          <div
            className="absolute -top-[30px] right-1/4 w-24 h-24 rounded-lg opacity-20 smx:top-[-30px] smx:right-6 smx:w-14 smx:h-14"
            style={{ backgroundColor: getColor("tertiary", 300) }}
          ></div>
          <div
            className="absolute -top-[55px] left-1/2 w-20 h-20 rounded-lg opacity-25 smx:top-[-50px] smx:left-1/3 smx:w-16 smx:h-16"
            style={{ backgroundColor: getColor("tertiary", 200) }}
          ></div>
        </div>

        <svg height="180" viewBox="0 0 794 180" fill="none" xmlns="http://www.w3.org/2000/svg" 
          className="w-full max-w-[794px] mx-auto"
        />

        {/* Header */}
        <div className="mb-12 text-center">
          <h2
            className="mx-auto mb-4 text-3xl font-bold md:text-4xl w-fit"
            ref={titleRef}
            onClick={() => handleItemClick("jobSpecificationTitle")}
            style={{fontFamily: subheaderFont?.family }}
          >
            {landingPageData?.jobSpecificationTitle?.split(" ")[0] || ""}{" "}
            <span style={{fontFamily: subheaderFont?.family }}>
              {landingPageData?.jobSpecificationTitle
                ?.split(" ")
                .slice(1)
                .join(" ") || ""}
            </span>
          </h2>
          <h3
            style={{ fontFamily: subheaderFont?.family, color: "inherit", opacity: 0.8 }}
            ref={textRef}
            className="mx-auto max-w-2xl w-fit"
            onClick={() => handleItemClick("jobSpecificationDescription")}
            dangerouslySetInnerHTML={{
              __html: landingPageData?.jobSpecificationDescription ||
                ""
            }}
          />
        </div>

        {/* Three Column Layout */}
        <div
          className={`grid gap-8 justify-center items-start mx-auto max-w-[1260px] ${gridColumns}`}
          style={{
            fontFamily: bodyFont?.family
          }}
        >
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex flex-col p-8 bg-[#FAFAFA] rounded-xl max-w-[420px] mx-auto min-h-full w-full">
              <div className="mb-6">
                <div
                  className="flex justify-center items-center mb-4 w-12 h-12 rounded-full"
                  style={{ backgroundColor: "white", color: getColor("secondary", 500) }}
                >
                  <IconRenderer
                    icon={spec?.icon || fallBackIcons[index % 3]}
                    className="w-6 h-6"
                    style={{ color: getColor("secondary", 500) }}
                  />
                </div>
                <h3
                  ref={(el) => {
                    specificationsRefs.current[
                      `specifications[${index}].title`
                    ] = el;
                  }}
                  className="mb-1 text-xl font-bold"
                  onClick={() =>
                    handleItemClick(`specifications[${index}].title`)
                  }
                >
                  {spec?.title}
                </h3>
                <p
                  ref={(el) => {
                    specificationsRefs.current[
                      `specifications[${index}].description`
                    ] = el;
                  }}
                  className="text-sm"
                  onClick={() =>
                    handleItemClick(`specifications[${index}].description`)
                  }
                >
                  {spec?.description}
                </p>
              </div>

              <ul 
                className="flex-grow space-y-4"
                style={{ color: "black" }}
              >
                {spec?.bulletPoints?.map((item, idx) => (
                  <BulletPoint 
                    key={idx}
                    index={index}
                    rowIndex={idx}
                    item={item}
                    getColor={getColor}
                    handleItemClick={handleItemClick}
                    specificationsRefs={specificationsRefs}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const JobSpecification = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
      return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};


export default JobSpecification;
