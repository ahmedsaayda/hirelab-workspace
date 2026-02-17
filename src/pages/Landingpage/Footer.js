import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Button, Heading, Img, Text } from "./components/index.jsx";
import { scrollToElement } from "./scrollUtils.js";
import UserProfile4 from "./components/UserProfile4/index.jsx";
import UserProfileCard from "./components/UserProfileCard/index.jsx";
import { DollarSign, Clock, Briefcase } from "lucide-react";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";

import { useFocusContext } from "../../contexts/FocusContext.js";
import { useHover } from "../../contexts/HoverContext.js";
import { useRouter } from "next/router";
import CrudService from "../../services/CrudService.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";
import { GridPattern, intToHumanReadablePrice } from "./HeroSection.js";

const useFooterHover = () => {
  const {
    hoveredField,
    scrollToSection,
    setLastScrollToSection,
    lastScrollToSection,
  } = useHover();
  

  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  const ctaFooterTitleRef = useRef();
  const ctaFooterLinkRef = useRef();
  const similarJobsTitleRef = useRef();

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      footerTitle: titleRef,
      footerDescription: textRef,
      ctaFooterTitle: ctaFooterTitleRef,
      ctaFooterLink: ctaFooterLinkRef,
      similarJobsTitle: similarJobsTitleRef,
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
    if (
      scrollToSection === "footer" &&
      sectionRef.current &&
      lastScrollToSection !== "footer"
    ) {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("footer");
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    textRef,
    ctaFooterTitleRef,
    ctaFooterLinkRef,
    similarJobsTitleRef,
  };
};

// export const Template2 = React.memo(({
export const Template2 = React.memo(({
  landingPageData,
  jobPostingsList,
  jobListings,
  similarJobs: propSimilarJobs,
  similarJobsLoading: propSimilarJobsLoading,
  onClickApply,
  lpId,
  isEdit,
  isMultiJob = false,
}) => {
  const {
    sectionRef,
    titleRef,
    textRef,
    ctaFooterTitleRef,
    ctaFooterLinkRef,
    similarJobsTitleRef,
  } = useFooterHover();
  const { handleItemClick } = useFocusContext();
  const router = useRouter();

  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  // Extract colors for Template 2 theme
  const primaryColor = landingPageData?.primaryColor || "#0068D6";
  const secondaryColor = landingPageData?.secondaryColor || "#f5590c";
  const tertiaryColor = landingPageData?.tertiaryColor || "#3396FF";

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

  // Handle apply button click
  const handleApplyClick = () => {
    if (isEdit) {
      if (onClickApply) {
        onClickApply();
      }
    } else {
      // Check if external apply link is set
      if (landingPageData?.externalApplyLink) {
        window.open(landingPageData.externalApplyLink, '_blank', 'noopener,noreferrer');
      } else if (lpId) {
        const formUrl = `/lp/${lpId}/apply`;
        router.push(formUrl);
      }
    }
  };

  // Similar jobs fetching logic (same as Template1)
  const [localSimilarJobs, setLocalSimilarJobs] = useState([]);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  
  const similarJobs = propSimilarJobs !== undefined ? propSimilarJobs : localSimilarJobs;
  const isLoading = propSimilarJobsLoading !== undefined ? propSimilarJobsLoading : localIsLoading;

  // Memoize dependencies to prevent unnecessary re-renders
  const similarJobsIds = useMemo(() => landingPageData?.similarJobs, [landingPageData?.similarJobs]);
  const showSimilarJobs = useMemo(() => !!landingPageData?.showSimilarJobs, [landingPageData?.showSimilarJobs]);
  const shouldFetchLocally = useMemo(() => propSimilarJobs === undefined, [propSimilarJobs]);

  // Debounced fetch function
  const fetchTimeoutRef = useRef(null);
  const debouncedFetchSimilarJobs = useCallback(async () => {
    if (!shouldFetchLocally || !similarJobsIds?.length || !showSimilarJobs) {
      setLocalSimilarJobs([]);
      return;
    }

    setLocalIsLoading(true);
    try {
      const res = await CrudService.search("LandingPageData", 100, 1, {
        filters: { _id: { $in: similarJobsIds } },
      });
      
      if (res?.data?.items) {
        setLocalSimilarJobs(res?.data?.items);
      }
    } catch (err) {
      console.error("Error fetching similar jobs:", err);
      setLocalSimilarJobs([]);
    } finally {
      setLocalIsLoading(false);
    }
  }, [shouldFetchLocally, similarJobsIds, showSimilarJobs]);

  // Local fetching for backward compatibility with debouncing
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(debouncedFetchSimilarJobs, 100);
    
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [debouncedFetchSimilarJobs]);

  // SVG assets from Figma
  const imgEllipse13 = "http://localhost:3845/assets/3c1fa8c8eacc5635f9f84368d9c2b8946f896fc5.png";
  const imgEllipse14 = "http://localhost:3845/assets/d8bf608104ffc721710e62be4dfe2f691e646a13.png";
  const imgEllipse15 = "http://localhost:3845/assets/bcd513f40cc1afade28c8b30e7edf1ee0892851e.png";
  const imgEllipse5 = "http://localhost:3845/assets/febd12f9041f56f9fb5536b7b31e65bc18d89c2b.svg";
  const imgEllipse1 = "http://localhost:3845/assets/c5e26140361f6d4aa127aac3d23e57c91254b87d.svg";
  const imgEllipse6 = "http://localhost:3845/assets/29a68828192ecb0b8cb9a14b5f6e1fcc24098a4d.svg";
  const imgEllipse7 = "http://localhost:3845/assets/812f813467591ba9f7f8286c21977ab44d92469f.svg";
  const imgEllipse8 = "http://localhost:3845/assets/e48647c4c02b67c10097737af45287afaae9c573.svg";
  const imgEllipse16 = "http://localhost:3845/assets/b2ac1452d3500d26e99451b73b8630a00b9d09eb.svg";
  const imgEllipse17 = "http://localhost:3845/assets/5ae8d675f8d757770ca0a78015e8debe48efe007.svg";
  const imgEllipse18 = "http://localhost:3845/assets/eb55535b6b2f6a2527544c383a8fd7a7b6277023.svg";

  // Parse title - split into lines
  const title = landingPageData?.footerTitle || "Ready To Take The Next Step In Your Career?";
  const titleLines = title.split(/(?<=\s)(?=In Your|in your)/i);
  const mainTitle = titleLines[0] || title;
  const highlightedTitle = titleLines[1] || "";

  return (
    <div ref={sectionRef} className="w-full bg-white" id="footer">
      {/* CTA Section */}
      <div className="relative px-[24px] pt-[100px] pb-[100px]">
        {/* Background layers */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[50px] hidden lg:block pointer-events-none" style={{ width: "1288px", height: "173px" }}>
          <div className="w-full h-full opacity-20 rounded-[32px]" style={{ transform: "scaleY(-1)", backgroundColor: getColor("primary", 100) }} />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-[35px] hidden lg:block pointer-events-none" style={{ width: "1340px", height: "173px" }}>
          <div className="w-full h-full opacity-40 rounded-[32px]" style={{ transform: "scaleY(-1)", backgroundColor: getColor("primary", 100) }} />
        </div>

        {/* Main CTA Container */}
        <div
          className="relative mx-auto overflow-hidden rounded-[32px]"
          style={{
            maxWidth: "1392px",
            height: "512px",
            background: `linear-gradient(to bottom, ${getColor("primary", 50)}, ${getColor("primary", 200)})`,
          }}
        >
          {/* Decorative circular arcs */}
          <div className="absolute left-[569px] top-[100px] w-[150px] h-[150px] pointer-events-none hidden lg:block">
            <img alt="" className="block max-w-none w-full h-full" src={imgEllipse5} />
          </div>
          <div className="absolute left-[996px] top-[278px] w-[732px] h-[732px] pointer-events-none hidden lg:block">
            <img alt="" className="block max-w-none w-full h-full" src={imgEllipse1} />
          </div>
          <div className="absolute left-[876px] top-[-22px] w-[1332px] h-[1332px] pointer-events-none hidden lg:block">
            <img alt="" className="block max-w-none w-full h-full" src={imgEllipse6} />
          </div>
          <div className="absolute left-[735px] top-[-365px] w-[2018px] h-[2018px] pointer-events-none hidden lg:block">
            <img alt="" className="block max-w-none w-full h-full" src={imgEllipse7} />
          </div>

          {/* Floating avatars */}
          <div className="absolute left-[719px] top-[330px] w-[108px] h-[108px] pointer-events-none hidden lg:block">
            <img alt="Avatar 1" className="block max-w-none w-[233px] h-[233px] absolute" style={{ left: "-58%", top: "-28%" }} src={imgEllipse13} />
          </div>
          <div className="absolute left-[916px] top-[175px] w-[174px] h-[174px] pointer-events-none hidden lg:block">
            <img alt="Avatar 2" className="block max-w-none w-[300px] h-[300px] absolute" style={{ left: "-36%", top: "-17%" }} src={imgEllipse14} />
          </div>
          <div className="absolute left-[1208px] top-[238px] w-[108px] h-[108px] pointer-events-none hidden lg:block">
            <img alt="Avatar 3" className="block max-w-none w-[233px] h-[233px] absolute" style={{ left: "-58%", top: "-28%" }} src={imgEllipse15} />
          </div>

          {/* Small decorative circles */}
          <div className="absolute left-[1166px] top-[153px] w-[72px] h-[72px] pointer-events-none hidden lg:block">
            <img alt="" className="block max-w-none w-full h-full" src={imgEllipse8} />
          </div>

          {/* Secondary color dots */}
          <div 
            className="absolute left-[639px] top-[384px] w-[31px] h-[31px] rounded-full pointer-events-none hidden lg:block"
            style={{ backgroundColor: getColor("secondary", 500) }}
          />
          <div 
            className="absolute left-[1288px] top-[412px] w-[12px] h-[12px] rounded-full pointer-events-none hidden lg:block"
            style={{ backgroundColor: getColor("secondary", 500) }}
          />
          <div 
            className="absolute left-[1027px] top-[90px] w-[20px] h-[20px] rounded-full pointer-events-none hidden lg:block"
            style={{ backgroundColor: getColor("secondary", 500) }}
          />

          {/* Content */}
          <div className="absolute left-[72px] top-[100px] w-[413px] flex flex-col gap-[64px] items-start">
            {/* Text */}
            <div className="flex flex-col gap-[28px] items-start justify-center w-full">
              {/* Title */}
              <div className="relative w-[343px] min-h-[164px]">
                <h2
                  ref={titleRef}
                  onClick={() => handleItemClick("footerTitle")}
                  className="font-semibold cursor-pointer whitespace-nowrap relative"
                  style={{
                    fontFamily: titleFont?.family || "Inter, sans-serif",
                    fontSize: "48px",
                    lineHeight: "60px",
                    letterSpacing: "-1.44px",
                    color: "#292929",
                  }}
                >
                  <span>Ready To Take </span>
                  <br />
                  <span>The Next Step </span>
                  <br />
                  <span className="relative inline-block" style={{ color: getColor("secondary", 500) }}>
                    {/* Lighter gradient highlight - positioned at bottom, behind text */}
                    <span
                      className="absolute rounded-[8px] -z-10"
                      style={{
                        background: `linear-gradient(to right, ${getColor("secondary", 100)}, transparent)`,
                        width: "100%",
                        height: "12px",
                        left: "0",
                        bottom: "8px",
                      }}
                    />
                    In Your Career?
                  </span>
                </h2>
              </div>
              {/* Description */}
              <p
                ref={textRef}
                onClick={() => handleItemClick("footerDescription")}
                className="cursor-pointer text-center"
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#464646",
                  fontFamily: bodyFont?.family || "Inter, sans-serif",
                }}
              >
                {landingPageData?.footerDescription || "Explore our exciting job opportunities and apply today!"}
              </p>
            </div>

            {/* Apply Button */}
            {!isMultiJob && (
              <button
                ref={ctaFooterTitleRef}
                onClick={() => {
                  handleItemClick("ctaFooterTitle");
                  handleApplyClick();
                }}
                className="flex items-center justify-center gap-[10px] h-[44px] px-[28px] rounded-[30px] cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: getColor("secondary", 500),
                  color: calculateTextColor(getColor("secondary", 500)),
                  fontFamily: bodyFont?.family || "Inter, sans-serif",
                }}
              >
                <span
                  className="font-semibold text-[16px] leading-[24px] text-center whitespace-nowrap"
                >
                  {landingPageData?.ctaFooterTitle || "Apply Now"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {landingPageData?.showSimilarJobs && landingPageData?.similarJobs?.length > 0 && (
        <div 
          className="w-full bg-white flex flex-col gap-[64px] items-center px-[72px] py-[100px] mdx:px-[24px] mdx:py-[60px]"
          style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}
        >
          {/* Title Section */}
          <div className="flex flex-col gap-[28px] items-center">
            {/* Title with blue gradient highlight */}
            <div className="relative inline-grid">
              <div
                className="col-start-1 row-start-1 h-[24px] rounded-[8px]"
                style={{
                  background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
                  marginLeft: "191px",
                  marginTop: "20px",
                  width: "211px",
                }}
              />
              <h2
                onClick={() => handleItemClick("similarJobsTitle")}
                ref={similarJobsTitleRef}
                className="col-start-1 row-start-1 font-semibold cursor-pointer text-center"
                style={{
                  fontFamily: titleFont?.family || "Inter, sans-serif",
                  fontSize: "48px",
                  lineHeight: "60px",
                  letterSpacing: "-1.44px",
                  color: "#292929",
                }}
              >
                {landingPageData?.similarJobsTitle || "You May Also Like"}
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
              You don't have to take our word for it.
            </p>
          </div>

          {/* Job Cards */}
          <div className="flex gap-[24px] items-center flex-wrap justify-center">
            {isLoading ? (
              <div className="text-gray-400">Loading similar jobs...</div>
            ) : similarJobs.length > 0 ? (
              similarJobs.map((job, index) => {
                // Determine work type from location
                const workType = job.location?.includes("Remote") 
                  ? "Remote" 
                  : job.location?.includes("Hybrid") 
                    ? "Hybrid" 
                    : "Onsite";
                
                // Format salary
                const salaryText = job.salaryMin 
                  ? `${job.currency || "$"}${job.salaryMin}${job.salaryMax ? ` - ${job.currency || "$"}${job.salaryMax}` : ""} / month`
                  : "Competitive";
                
                // Format hours
                const hoursText = job.hoursPerWeek 
                  ? `${job.hoursPerWeek}h/week` 
                  : job.workTimePerWeek || "Full-time";

                return (
                  <a
                    key={job._id || index}
                    href={isEdit ? "#" : `/lp/${job._id}`}
                    className="bg-white flex gap-[24px] items-center overflow-hidden p-[16px] rounded-[24px] w-[636px] max-w-full cursor-pointer hover:shadow-lg transition-shadow"
                    style={{
                      boxShadow: "0px 32.88px 50.815px 11.956px rgba(0,0,0,0.03)",
                      textDecoration: "none",
                    }}
                    onClick={(e) => isEdit && e.preventDefault()}
                  >
                    {/* Hero Image */}
                    <div className="overflow-hidden rounded-[16px] shrink-0 w-[200px] h-[200px] bg-gray-100">
                      {job.heroImage ? (
                        <img
                          src={job.heroImage}
                          alt={job.vacancyTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-[24px] items-start justify-center flex-1">
                      {/* Text */}
                      <div className="flex flex-col gap-[20px] items-start w-full max-w-[368px]">
                        <p
                          className="font-semibold text-[24px] leading-[32px] text-[#292929] w-full line-clamp-1"
                          style={{ fontFamily: subheaderFont?.family || "Inter, sans-serif" }}
                        >
                          {job.vacancyTitle || "Job Title"}
                        </p>
                        <p
                          className="font-normal text-[16px] leading-[24px] text-[#7c7c7c] w-full line-clamp-2"
                          style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}
                        >
                          {job.heroDescription || "Job description goes here..."}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-[8px] items-start flex-wrap">
                        {/* Salary Tag */}
                        <div className="flex gap-[6px] items-center pl-[4px] pr-[12px] py-[4px] rounded-[100px]" style={{ backgroundColor: getColor("primary", 50) }}>
                          <div className="flex items-center justify-center rounded-full w-[24px] h-[24px]" style={{ backgroundColor: getColor("primary", 200) }}>
                            <svg width="12" height="12" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.5 1.5C6.5 2.05228 5.26878 2.5 3.75 2.5C2.23122 2.5 1 2.05228 1 1.5M6.5 1.5C6.5 0.947715 5.26878 0.5 3.75 0.5C2.23122 0.5 1 0.947715 1 1.5M6.5 1.5V2.25M1 1.5V7.5C1 8.05228 2.23122 8.5 3.75 8.5M3.75 4.5C3.66573 4.5 3.58234 4.49862 3.5 4.49592C2.09837 4.44999 1 4.02164 1 3.5M3.75 6.5C2.23122 6.5 1 6.05228 1 5.5M11 4.75C11 5.30228 9.76878 5.75 8.25 5.75C6.73122 5.75 5.5 5.30228 5.5 4.75M11 4.75C11 4.19772 9.76878 3.75 8.25 3.75C6.73122 3.75 5.5 4.19772 5.5 4.75M11 4.75V8.5C11 9.05228 9.76878 9.5 8.25 9.5C6.73122 9.5 5.5 9.05228 5.5 8.5V4.75M11 6.625C11 7.17728 9.76878 7.625 8.25 7.625C6.73122 7.625 5.5 7.17728 5.5 6.625" stroke={getColor("primary", 700)} strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="font-normal text-[14px] leading-[20px] text-[#292929] text-center whitespace-nowrap">
                            {salaryText}
                          </p>
                        </div>

                        {/* Work Type Tag */}
                        <div className="flex gap-[6px] items-center pl-[4px] pr-[12px] py-[4px] rounded-[100px]" style={{ backgroundColor: getColor("primary", 50) }}>
                          <div className="flex items-center justify-center rounded-full w-[24px] h-[24px]" style={{ backgroundColor: getColor("primary", 200) }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 6.68722C9.7659 7.03442 11 7.82736 11 8.75C11 9.99264 8.76142 11 6 11C3.23858 11 1 9.99264 1 8.75C1 7.82736 2.2341 7.03442 4 6.68722M6 8.5V4.5M6 4.5C6.82843 4.5 7.5 3.82843 7.5 3C7.5 2.17157 6.82843 1.5 6 1.5C5.17157 1.5 4.5 2.17157 4.5 3C4.5 3.82843 5.17157 4.5 6 4.5Z" stroke={getColor("primary", 700)} strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="font-normal text-[14px] leading-[20px] text-[#292929] text-center whitespace-nowrap">
                            {workType}
                          </p>
                        </div>

                        {/* Hours Tag */}
                        <div className="flex gap-[6px] items-center pl-[4px] pr-[12px] py-[4px] rounded-[100px]" style={{ backgroundColor: getColor("primary", 50) }}>
                          <div className="flex items-center justify-center rounded-full w-[24px] h-[24px]" style={{ backgroundColor: getColor("primary", 200) }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_similar_t2)">
                                <path d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke={getColor("primary", 700)} strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_similar_t2">
                                  <rect width="12" height="12" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <p className="font-normal text-[14px] leading-[20px] text-[#292929] text-center whitespace-nowrap">
                            {hoursText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="text-gray-400">No similar jobs found</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="container px-8 mx-auto mt-8 mb-10 w-full mdx:px-5">
        <footer className="flex flex-col gap-16 items-center sm:gap-8">
          <div className="flex flex-col gap-8 self-stretch">
            <div className="h-px bg-[#eaecf0]" />
            <div className="flex gap-5 justify-between items-center sm:flex-col">
              <Text
                size="text_md_regular"
                as="p"
                className="text-[16px] font-normal text-[#98a1b2]"
              >
                © {new Date().getFullYear()} {landingPageData?.companyName || "Hirelab"}. All rights reserved.
              </Text>
              <div className="flex w-[14%] justify-between gap-5 sm:w-full">
                <a href="#">
                  <Img
                    src="/images3/img_social_icon.svg"
                    alt="Social Icon 1"
                    className="h-[24px] w-[24px]"
                  />
                </a>
                <a href="#">
                  <Img
                    src="/images3/img_social_icon_gray_400.svg"
                    alt="Social Icon 2"
                    className="h-[24px] w-[24px]"
                  />
                </a>
                <a href="#">
                  <Img
                    src="/images3/img_link.svg"
                    alt="Link Icon"
                    className="h-[24px] w-[24px]"
                  />
                </a>
                <a href="#">
                  <Img
                    src="/images3/img_social_icon_gray_400_24x24.svg"
                    alt="Social Icon 3"
                    className="h-[24px] w-[24px]"
                  />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});
// });

const Template3 = React.memo(({ landingPageData, jobPostingsList, jobListings, onClickApply, lpId, isEdit, isMultiJob = false }) => {
  const {
    sectionRef,
    titleRef,
    textRef,
    ctaFooterTitleRef,
    ctaFooterLinkRef,
    similarJobsTitleRef,
  } = useFooterHover();
  const { handleItemClick } = useFocusContext();
  const router = useRouter();
  const currentPath = router.pathname?.split("/")[1];

  return (
    <div ref={sectionRef} className="w-full">
      <div className="flex flex-col items-center gap-16 bg-[#222222] py-[46px] mdx:py-5 smx:gap-8">
        <div className="container mt-4 mdx:px-5">
          <div className="flex flex-col gap-16 smx:gap-8">
            <div className="flex flex-col items-center gap-[30px] px-14 mdx:px-5">
              <div className="flex flex-col items-center gap-[18px] px-14 mdx:px-5">
                <h2
                  onClick={() => handleItemClick("footerTitle")}
                  ref={titleRef}
                  size="display_sm_semibold"
                  as="h2"
                  className="text-[30px] font-semibold text-[#ffffff] mdx:text-[28px] smx:text-[26px]"
                >
                  {landingPageData?.footerTitle}
                </h2>
                <p
                  onClick={() => handleItemClick("footerDescription")}
                  ref={textRef}
                  size="text_xl_regular"
                  as="p"
                  className="text-[20px] font-normal text-[#ffffff]"
                >
                  {landingPageData?.footerDescription}
                </p>
              </div>
              {!isMultiJob && (
                <div className="flex">
                  <Button
                    color="light_blue_A700"
                    href={landingPageData?.ctaFooterLink}
                    size="2xl"
                    shape="round"
                    className="min-w-[252px] rounded-lg border border-solid border-[#5207CD] px-[33px] font-semibold smx:px-5"
                  >
                    {landingPageData?.ctaFooterTitle}
                  </Button>
                </div>
              )}
            </div>
            <Img
              src="/images3/img_horizontal_container.svg"
              alt="Horizontal Image"
              className="h-px"
            />
          </div>
        </div>

        {/* related content section */}
        {landingPageData?.showSimilarJobs && (
          <div className="self-stretch">
            <div className="flex justify-center bg-[#222222]">
              <div className="container flex justify-center mb-6 mdx:px-5">
                <div className="px-8 w-full smx:px-5">
                  <div className="flex flex-col gap-8 items-start">
                    <h2
                      onClick={() => handleItemClick("similarJobsTitle")}
                      ref={similarJobsTitleRef}
                      size="display_xs_semibold"
                      as="h2"
                      className="text-[24px] font-semibold text-[#ffffff] mdx:text-[22px]"
                    >
                      {landingPageData?.similarJobsTitle || "You May Also Like"}
                    </h2>
                    <div className="flex gap-8 self-stretch mdx:flex-col">
                      <Suspense fallback={<div>Loading feed...</div>}>
                        {jobPostingsList?.map((d, index) => (
                          <UserProfile4
                            applyButtonText={landingPageData?.ctaFooterTitle}
                            applyButtonLink={landingPageData?.ctaFooterLink}
                            {...d}
                            key={"cardsList" + index}
                          />
                        ))}
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mdx:px-5">
          <footer className="flex flex-col gap-16 smx:gap-8">
            <Img
              src="/images3/img_horizontal_container.svg"
              alt="Footer Image"
              className="h-px"
            />
            <div className="flex flex-col gap-8 items-center px-14 mx-8 mdx:mx-0 mdx:px-5">
              <Img
                src="/images3/img_footer_logo.png"
                alt="Footer Logo"
                className="h-[30px] w-[116px] object-contain"
              />
            </div>
            <div className="px-8 smx:px-5">
              <div className="flex gap-5 justify-between items-center smx:flex-col">
                <Text
                  size="text_md_regular"
                  as="p"
                  className="text-[16px] font-normal text-[#ffffff]"
                >
                  © {new Date().getFullYear()}{landingPageData?.companyName || "Hirelab"}. All rights reserved.
                </Text>
                <div className="flex w-[14%] justify-between gap-5 smx:w-full">
                  <a href="#">
                    <Img
                      src="/images3/img_social_icon_base_white.svg"
                      alt="Social Icon"
                      className="h-[24px] w-[24px]"
                    />
                  </a>
                  <a href="#">
                    <Img
                      src="/images3/img_social_icon_base_white_24x24.svg"
                      alt="Social Icon 24x24"
                      className="h-[24px] w-[24px]"
                    />
                  </a>
                  <a href="#">
                    <Img
                      src="/images3/img_link_base_white.svg"
                      alt="Link Icon"
                      className="h-[24px] w-[24px]"
                    />
                  </a>
                  <a href="#">
                    <Img
                      src="/images3/img_social_icon_24x24.svg"
                      alt="Social Icon Large"
                      className="h-[24px] w-[24px]"
                    />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
});

const Template1 = React.memo(({ landingPageData, jobPostingsList, jobListings, similarJobs: propSimilarJobs, similarJobsLoading: propSimilarJobsLoading, onClickApply, lpId, isEdit, isMultiJob = false }) => {


  const {
    sectionRef,
    titleRef,
    textRef,
    ctaFooterTitleRef,
    ctaFooterLinkRef,
    similarJobsTitleRef,
  } = useFooterHover();
  const { handleItemClick } = useFocusContext();
  const router = useRouter();
  const currentPath = useMemo(() => router.pathname?.split("/")[1], [router.pathname]);

  // Handle apply button click - similar to NavBar functionality
  const handleApplyClick = () => {
    if (isEdit) {
      // In edit mode, just call the onClickApply function (placeholder)
      if (onClickApply) {
        onClickApply();
      }
    } else {
      // Public view - check if external apply link is set
      if (landingPageData?.externalApplyLink) {
        window.open(landingPageData.externalApplyLink, '_blank', 'noopener,noreferrer');
      } else if (lpId) {
        const formUrl = `/lp/${lpId}/apply`;
        router.push(formUrl);
      }
    }
  };

  // Use props if provided, otherwise fall back to local state (for backward compatibility)
  const [localSimilarJobs, setLocalSimilarJobs] = useState([]);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  
  const similarJobs = propSimilarJobs !== undefined ? propSimilarJobs : localSimilarJobs;
  const isLoading = propSimilarJobsLoading !== undefined ? propSimilarJobsLoading : localIsLoading;

  // Memoize dependencies to prevent unnecessary re-renders
  const similarJobsIds = useMemo(() => landingPageData?.similarJobs, [landingPageData?.similarJobs]);
  const showSimilarJobs = useMemo(() => !!landingPageData?.showSimilarJobs, [landingPageData?.showSimilarJobs]);
  const shouldFetchLocally = useMemo(() => propSimilarJobs === undefined, [propSimilarJobs]);

  // Debounced fetch function
  const fetchTimeoutRef = useRef(null);
  const debouncedFetchSimilarJobs = useCallback(async () => {
    if (!shouldFetchLocally || !similarJobsIds?.length || !showSimilarJobs) {
      setLocalSimilarJobs([]);
      return;
    }

    setLocalIsLoading(true);
    try {
      const res = await CrudService.search("LandingPageData", 100, 1, {
        filters: { _id: { $in: similarJobsIds } },
      });
      
      if (res?.data?.items) {
        setLocalSimilarJobs(res?.data?.items);
      }
    } catch (err) {
      console.error("Error fetching similar jobs:", err);
      setLocalSimilarJobs([]);
    } finally {
      setLocalIsLoading(false);
    }
  }, [shouldFetchLocally, similarJobsIds, showSimilarJobs]);

  // Local fetching for backward compatibility with debouncing
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(debouncedFetchSimilarJobs, 100);
    
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [debouncedFetchSimilarJobs]);

  const [activeSlide, setActiveSlide] = useState(0);

  // Sliding carousel state/refs for mobile
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Go to slide by index
  const goToSlide = useCallback((index) => {
    if (sliderRef.current) {
      setActiveSlide(index);
      const containerWidth = sliderRef.current.clientWidth;
      const scrollPosition = index * containerWidth;
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Scroll handler to update active dot
  const scrollTimeoutRef = useRef(null);
  const handleScroll = useCallback(() => {
    if (sliderRef.current && !isDragging) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const containerWidth = sliderRef.current.clientWidth;
      const newActiveSlide = Math.round(scrollPosition / containerWidth);
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    }
  }, [isDragging, activeSlide]);

  // Debounced scroll handler
  const debouncedHandleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(handleScroll, 100);
  }, [handleScroll]);

  // Mouse/touch drag handlers
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  }, []);
  
  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);
  
  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => {
      handleScroll();
    }, 50);
  }, [handleScroll]);

  // Simplified color extraction - only recalculate when colors actually change
  const customColors = useMemo(() => {
    return {
      primaryColor: landingPageData?.primaryColor || "#26B0C6",
      secondaryColor: landingPageData?.secondaryColor || "#F7E733", 
      tertiaryColor: landingPageData?.tertiaryColor || "#44b566",
    };
  }, [
    landingPageData?.primaryColor, 
    landingPageData?.secondaryColor, 
    landingPageData?.tertiaryColor, 
  ]);

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#26B0C6",
      secondaryColor: "#F7E733",
      tertiaryColor: "#44b566",
    },
    customColors
  );
  

  
  const { subheaderFont, bodyFont } = useMemo(() => {
    const fonts = getFonts(landingPageData);
    return fonts;
  }, [landingPageData]);

  // Ensure we have job listings

  // Stable JobCard styles - only recalculate when font or colors change
  const jobCardStyles = useMemo(() => {
    const primaryColor50 = getColor("primary", 50);
    const primaryColor500 = getColor("primary", 500);
    
    return {
      container: { color: "black", fontFamily: bodyFont?.family },
      badge: {
        color: calculateTextColor(primaryColor50),
        background: primaryColor50,
        padding: "10px 10px",
        borderRadius: "10px",
      },
      applyButton: {
        backgroundColor: primaryColor500,
        color: calculateTextColor(primaryColor500),
      }
    };
  }, [bodyFont?.family, customColors.primaryColor]); // Only depend on actual color values

  // Job Card component - properly memoized to prevent unnecessary re-renders
  const JobCard = React.memo(({ job }) => {
    if (!job) return null;
    
    const workType = useMemo(() => {
      if (job.location?.includes("Remote")) return "Remote";
      else if (job.location?.includes("Hybrid")) return "Hybrid";
      else return "Onsite";
    }, [job.location]);
    
    return (
      <div
        style={jobCardStyles.container}
        className="flex overflow-hidden flex-col h-full rounded-xl  max-w-[370px] mx-auto w-full"
        id="footer"
      >
        {/* Job Image */}
        <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden">
          {job.heroImage ? (
            <Img
              src={job.heroImage}
              alt={job.vacancyTitle}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <div className="text-xl text-gray-300">No Image</div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex flex-col flex-grow py-6 ">
          <h3 className="text-xl font-bold mb-2 h-[56px] line-clamp-2 overflow-hidden text-ellipsis leading-tight">{job.vacancyTitle}</h3>
          <p className="line-clamp-2 h-[40px] mb-4 text-sm overflow-hidden text-ellipsis">
            {job.heroDescription}
          </p>

          {/* Job Specs */}
          <div className="flex flex-wrap gap-4 mb-6">
            {!!job.salaryMin && (
              <div
                className="flex items-center text-sm gap-1"
                style={jobCardStyles.badge}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 1.5C6.5 2.05228 5.26878 2.5 3.75 2.5C2.23122 2.5 1 2.05228 1 1.5M6.5 1.5C6.5 0.947715 5.26878 0.5 3.75 0.5C2.23122 0.5 1 0.947715 1 1.5M6.5 1.5V2.25M1 1.5V7.5C1 8.05228 2.23122 8.5 3.75 8.5M3.75 4.5C3.66573 4.5 3.58234 4.49862 3.5 4.49592C2.09837 4.44999 1 4.02164 1 3.5M3.75 6.5C2.23122 6.5 1 6.05228 1 5.5M11 4.75C11 5.30228 9.76878 5.75 8.25 5.75C6.73122 5.75 5.5 5.30228 5.5 4.75M11 4.75C11 4.19772 9.76878 3.75 8.25 3.75C6.73122 3.75 5.5 4.19772 5.5 4.75M11 4.75V8.5C11 9.05228 9.76878 9.5 8.25 9.5C6.73122 9.5 5.5 9.05228 5.5 8.5V4.75M11 6.625C11 7.17728 9.76878 7.625 8.25 7.625C6.73122 7.625 5.5 7.17728 5.5 6.625"
                    stroke={getColor("secondary", 500)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {intToHumanReadablePrice(job.salaryMin)} -{" "}
                {intToHumanReadablePrice(job.salaryMax)}/
                {landingPageData?.salaryTime?.toLowerCase?.() || "Month"}
              </div>
            )}
            <div
              className="flex items-center text-sm gap-1"
              style={jobCardStyles.badge}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 6.68722C9.7659 7.03442 11 7.82736 11 8.75C11 9.99264 8.76142 11 6 11C3.23858 11 1 9.99264 1 8.75C1 7.82736 2.2341 7.03442 4 6.68722M6 8.5V4.5M6 4.5C6.82843 4.5 7.5 3.82843 7.5 3C7.5 2.17157 6.82843 1.5 6 1.5C5.17157 1.5 4.5 2.17157 4.5 3C4.5 3.82843 5.17157 4.5 6 4.5Z"
                  stroke={getColor("secondary", 500)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {workType}
            </div>
            <div
              className="flex items-center text-sm gap-1"
              style={jobCardStyles.badge}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1_2958)">
                  <path
                    d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
                    stroke={getColor("secondary", 500)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_2958">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {job.hoursRange
                ? `${job.hoursMin}-${job.hoursMax}`
                : `${job.hoursMin}`}{" "}
              / {job.hoursUnit || "Week"}
            </div>
          </div>

          {/* Apply Button */}
          <a
            href={`/lp/${job._id}`}
            target="_blank"
            className="py-3 w-full font-medium text-center rounded-full transition-colors mt-auto"
            style={jobCardStyles.applyButton}
          >
            {job?.ctaFooterTitle??landingPageData?.ctaFooterTitle??"Learn More"}
          </a>
        </div>
      </div>
    );
  });

  // Memoize font and color calculations
  const textColor = useMemo(() => calculateTextColor(getColor("primary", 500)), [getColor]);
  
  const getColorBrightness = useCallback((color) => {
    const rgb = color?.match(/^#(\w{6})$/)?.[1];
    if (!rgb) return 0;
    const r = parseInt(rgb.slice(0, 2), 16);
    const g = parseInt(rgb.slice(2, 4), 16);
    const b = parseInt(rgb.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }, []);

  const getBackgroundColor = useCallback((primaryColor) => {
    const brightness = getColorBrightness(primaryColor);
    return brightness > 128
      ? getColor("primary", 900)
      : getColor("primary", 500);
  }, [getColorBrightness, getColor]);

  const applyButtonColor = useMemo(() => {
    let color = getBackgroundColor(getColor("primary", 500));
    if (getColorBrightness(landingPageData?.primaryColor) > 128) {
      color = getColor("primary", 400);
    }
    return color;
  }, [getBackgroundColor, getColor, getColorBrightness, landingPageData?.primaryColor]);

  // Simplified and stable GridPattern props - only depend on actual color changes
  const gridPatternProps = useMemo(() => {
    const primaryColor500 = landingPageData?.primaryColor || "#26B0C6";
    const tertiaryColor300 = landingPageData?.tertiaryColor || "#44b566";
    const tertiaryColor50 = `${tertiaryColor300}20`; // Add transparency
    
    return {
      gridColor: tertiaryColor300,
      gridLineColor: tertiaryColor50,
      backgroundColor: primaryColor500,
      gridSize: 50,
    };
  }, [landingPageData?.primaryColor, landingPageData?.tertiaryColor]);

  // Memoize title text calculations
  const footerTitleParts = useMemo(() => {
    if (!landingPageData?.footerTitle) return { firstPart: "", secondPart: "" };
    const words = landingPageData.footerTitle.split(" ");
    const midPoint = Math.ceil(words.length / 2);
    return {
      firstPart: words.slice(0, midPoint).join(" "),
      secondPart: words.slice(midPoint).join(" ")
    };
  }, [landingPageData?.footerTitle]);

  // Memoize similar jobs title parts
  const similarJobsTitleParts = useMemo(() => {
    const title = landingPageData?.similarJobsTitle || "You May Also Like";
    const words = title.split(" ");
    return {
      firstWord: words[0] || "",
      restWords: words.slice(1).join(" ") || "",
    };
  }, [landingPageData?.similarJobsTitle]);

  // Stable style objects - only recalculate when actual font/color values change
  const titleStyle = useMemo(() => ({
    fontFamily: subheaderFont?.family,
    color: textColor
  }), [subheaderFont?.family, customColors.primaryColor]);

  const descriptionStyle = useMemo(() => ({
    fontFamily: bodyFont?.family,
    color: textColor
  }), [bodyFont?.family, customColors.primaryColor]);

  // const ctaButtonStyle = useMemo(() => ({
  //   backgroundColor: getColor("primary", 600),
  //   color: textColor,
  //   fontFamily: bodyFont?.family,
  // }), [customColors.primaryColor, bodyFont?.family,textColor,landingPageData?.primaryColor]);
  // console.log("ctaButtonStyle", ctaButtonStyle);

  // Create a stable GridPattern component that only re-renders when colors actually change
  const MemoizedGridPattern = useMemo(() => {
    return (
      <GridPattern
        gridColor={gridPatternProps.gridColor}
        gridLineColor={gridPatternProps.gridLineColor}
        backgroundColor={gridPatternProps.backgroundColor}
        gridSize={gridPatternProps.gridSize}
      />
    );
  }, [gridPatternProps.gridColor, gridPatternProps.gridLineColor, gridPatternProps.backgroundColor, gridPatternProps.gridSize]);

  return (
    <div
      className="pt-16 pb-5 bg-white overflow-hidden w-full"
      ref={sectionRef}
      style={{ color: textColor }}
    >
   
      
      {/* CTA Banner */}
      <div className="px-4 mx-auto mb-16 max-w-6xl md:px-8">
        <div className="overflow-hidden relative p-8 text-center rounded-xl md:p-12">
          {MemoizedGridPattern}
          {/* Background Pattern */}
          {/* <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white rounded-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-lg"></div>
            <div className="absolute right-1/4 bottom-1/4 w-20 h-20 bg-white rounded-lg"></div>
          </div> */}

          <div className="relative z-10">
            <h2
              className="mx-auto mb-2 text-2xl font-bold  md:text-3xl w-fit"
              onClick={() => handleItemClick("footerTitle")}
              ref={titleRef}
              style={titleStyle}
            >
              {footerTitleParts.firstPart}
              <br />
              <span style={titleStyle}>
                {footerTitleParts.secondPart}
              </span>
            </h2>
            <p
              onClick={() => handleItemClick("footerDescription")}
              ref={textRef}
              className="mx-auto mb-8 text-white/80 w-fit"
              style={descriptionStyle}
            >
              {landingPageData?.footerDescription ||
                "Explore our exciting job opportunities and apply today!"}
            </p>
            {!isMultiJob && (
              <button
                onClick={() => {
                  handleItemClick("ctaFooterTitle");
                  handleApplyClick();
                }}
                ref={ctaFooterTitleRef}
                className="inline-block px-8 py-3 font-medium rounded-full transition-colors"
                style={{
                  backgroundColor: getColor("primary", 600),
                  color: textColor,
                  fontFamily: bodyFont?.family,
                }}
              >
                {landingPageData?.ctaFooterTitle || "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {landingPageData?.showSimilarJobs &&landingPageData?.similarJobs?.length > 0 && (
        <div className="px-4 mx-auto max-w-[1300px] md:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#1a3e4c] w-fit mx-auto"
            onClick={() => handleItemClick("similarJobsTitle")}
            ref={similarJobsTitleRef}
            style={{ color: "black", fontFamily: subheaderFont?.family }}
          >
            {similarJobsTitleParts.firstWord}{" "}
            <span style={{ color: "black" }}>
              {similarJobsTitleParts.restWords}
            </span>
          </h2>

          {/* Desktop Grid */}
          <div className="hidden md:flex justify-center items-stretch gap-2">
            {similarJobs.map((job, index) => (
              <React.Fragment key={job.id || index}>
                {index > 0 && (
                  <div className="mx-3 w-px bg-gray-200 self-stretch my-3"></div>
                )}
                <div className="max-w-[368px]">
                  <JobCard job={job} />
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto justify-start snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
              }}
              onScroll={debouncedHandleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              {similarJobs.map((job, index) => (
                <div
                  key={job.id || index}
                  className="flex-shrink-0 w-full px-2 snap-start"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
            {/* Carousel Navigation Dots */}
            <div className="flex gap-2 justify-center mt-8">
              {similarJobs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: index === activeSlide ? getColor("primary", 500) : "#e5e7eb",
                  }}
                  aria-label={`Go to job ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Footer Copyright */}
      <div className="container px-8 mx-auto mt-16 mdx:px-5">
        <div className="flex flex-col gap-8 self-stretch">
          <div className="h-px bg-[#eaecf0]" />
          <div className="text-center">
            <Text as="p" className="text-[16px] font-normal text-[#98a1b2]">
              &copy; {new Date().getFullYear()} {landingPageData?.companyName || "Hirelab"}. All rights reserved.
            </Text>
            {/* Show "Created by Hirelab" for free users on both public pages and edit mode */}
            {landingPageData?.showHirelabBranding && (
              <Text as="p" className="text-[14px] font-normal text-[#98a1b2] mt-2">
                Created by{" "}
                <a 
                  href={isEdit?"#":"https://hirelab.io/"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#5207CD] hover:underline"
                >
                  Hirelab
                </a>
              </Text>
            )}
          </div>
            {/* <div className="flex gap-5 justify-between sm:w-full">
              <a href="#">
                <Img
                  src="/images3/img_social_icon.svg"
                  alt="Social Icon 1"
                  className="h-[24px] w-[24px]"
                />
              </a>
              <a href="#">
                <Img
                  src="/images3/img_social_icon_gray_400.svg"
                  alt="Social Icon 2"
                  className="h-[24px] w-[24px]"
                />
              </a>
              <a href="#">
                <Img
                  src="/images3/img_link.svg"
                  alt="Link Icon"
                  className="h-[24px] w-[24px]"
                />
              </a>
              <a href="#">
                <Img
                  src="/images3/img_social_icon_gray_400_24x24.svg"
                  alt="Social Icon 3"
                  className="h-[24px] w-[24px]"
                />
              </a>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
});

export default function TemplateThreePage(props) {
  const jobPostingsList = [
    {
      userImage: "/images3/img_image_152x344.png",
      createdWithText: props?.landingPageData?.createdWithText,
      jobTitle: "Product Designer",
      jobDescription:
        "The Product Designer will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
      applyButtonText: props?.landingPageData?.ctaFooterTitle,
    },
    {
      userImage: "/images3/img_image_3.png",
      createdWithText: props?.landingPageData?.createdWithText,
      jobTitle: "Recruiter",
      jobDescription:
        "The Recruiter will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
      applyButtonText: props?.landingPageData?.ctaFooterTitle,
    },
    {
      userImage: "/images3/img_image_4.png",
      createdWithText: props?.landingPageData?.createdWithText,
      jobTitle: "Marketer",
      jobDescription:
        "The Marketer will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
      applyButtonText: props?.landingPageData?.ctaFooterTitle,
    },
  ];
  const jobListings = [
    {
      createdWithText: props?.landingPageData?.createdWithText,
      monthlyEarningsText: "2500$ / month",
      workTypeText: "Hybrid",
      workHoursText: "8h/day",
      jobTitle: "Product Designer",
      jobDescription:
        "The Product Designer will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
      seeMoreInfoText: props?.landingPageData?.ctaFooterTitle,
      seeMoreInfoLink: props?.landingPageData?.ctaFooterLink,
    },
    {
      createdWithText: props?.landingPageData?.createdWithText,
      monthlyEarningsText: "2500$ / month",
      workTypeText: "Hybrid",
      workHoursText: "8h/day",
      jobTitle: "Recruiter",
      jobDescription:
        "The Recruiter will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
      seeMoreInfoText: props?.landingPageData?.ctaFooterTitle,
      seeMoreInfoLink: props?.landingPageData?.ctaFooterLink,
    },
    {
      createdWithText: props?.landingPageData?.createdWithText,
      monthlyEarningsText: "2500$ / month",
      workTypeText: "Hybrid",
      workHoursText: "8h/day",
      jobTitle: "Marketer",
      jobDescription:
        "The Marketer will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
      seeMoreInfoText: props?.landingPageData?.ctaFooterTitle,
      seeMoreInfoLink: props?.landingPageData?.ctaFooterLink,
    },
  ];


  if (props?.landingPageData?.templateId === "3")
    return (
      <Template3
        jobPostingsList={jobPostingsList}
        jobListings={jobListings}
        {...props}
      />
    );
  if (props?.landingPageData?.templateId === "2")
    return (
      <Template2
        jobPostingsList={jobPostingsList}
        jobListings={jobListings}
        {...props}
      />
    );
  if (props?.landingPageData?.templateId === "1")
    return (
      <Template1
        jobPostingsList={jobPostingsList}
        jobListings={jobListings}
        {...props}
      />
    );

  return <Template3 />;
}
