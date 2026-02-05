import React, {
  Suspense,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { Heading, Img, Text } from "./components/index.jsx";
import { scrollToElement } from "./scrollUtils.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import { useHover } from "../../contexts/HoverContext.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { Phone, Mail } from "lucide-react";
import { getThemeData } from "../../utils/destructureTheme.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils.js";

import placeholder from '../../assets/img/placeholder.png';

function UserProfile({
  userImage = "/images3/img_image.png",
  userName = "Alison Medis",
  userRole = "Project Manager",
  userPhone = "+1 (415) 555-1010",
  userEmail = "elison@gmail.com",
  recruiterPhoneEnabled = true,
  recruiterEmailEnabled = true,
  index,
  ...props
}) {
  const { hoveredField } = useHover();

  // Check if this card should be highlighted
  const isHighlighted =
    hoveredField?.startsWith(`companyContact`) &&
    hoveredField?.includes(`[${index}]`);

  return (
    <div
      {...props}
      className={`${
        props.className
      } flex sm:flex-col items-center w-[50%] mdx:w-full gap-5 p-6 sm:p-5 border-[#eaecf0] border border-solid bg-[#ffffff] rounded-[16px] ${
        isHighlighted ? "highlight-section" : ""
      }`}
    >
      <Img
        src={userImage}
        alt="Profile Image"
        className="h-[150px] w-[150px] rounded-[74px] object-cover"
      />
      <div className="flex flex-1 flex-col gap-[26px]">
        <div className="flex flex-col gap-2.5 items-start">
          <Heading
            size="heading4xl"
            as="h3"
            className="text-[28px] font-semibold text-[#101828]"
          >
            {userName}
          </Heading>
          <Heading
            size="headings"
            as="h6"
            className="text-[16px] font-semibold text-[#475467]"
          >
            {userRole}
          </Heading>
        </div>
        <div className="flex flex-col gap-3">
          {!!recruiterPhoneEnabled && (
            <div className="flex gap-2">
              <Img
                src="/images3/img_phone.svg"
                alt="Phone Icon"
                className="h-[18px] w-[18px]"
              />
              <Text as="p" className="text-[14px] font-medium text-[#475467]">
                {userPhone}
              </Text>
            </div>
          )}
          {!!recruiterEmailEnabled && (
            <div className="flex gap-2">
              <Img
                src="/images3/img_mail_01.svg"
                alt="Email Icon"
                className="h-[18px] w-[18px]"
              />
              <Text
                as="p"
                className="text-[14px] font-medium text-[#475467]"
                style={{ overflowWrap: "anywhere" }}
              >
                {userEmail}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserProfile3({
  userName = "Caitlyn King",
  userRole = "Project Manager",
  userPhoneNumber = "+1 (415) 555-1010",
  userEmail = "elison@gmail.com",
  userAvatar = "/public/images/img_avatar.png",
  index,
  recruiterPhoneEnabled = true,
  recruiterEmailEnabled = true,
  ...props
}) {
  const { handleItemClick } = useFocusContext();
  const { hoveredField } = useHover();

  // Check if this card should be highlighted
  const isHighlighted =
    hoveredField?.startsWith(`companyContact`) &&
    hoveredField?.includes(`[${index}]`);

  return (
    <div
      {...props}
      className={`${
        props.className
      } mdx:min-h-fit min-h-full flex flex-col items-center justify-left gap-5 p-4 border-[#d0d5dd] border border-solid rounded pr-8 flex-1 mdx:w-full ${
        isHighlighted ? "highlight-section" : ""
      }`}
    >
      <div className="flex gap-3 self-stretch">
        <div
          className={`flex flex-col items-center bg-no-repeat bg-cover h-[56px] rounded-[28px]`}
          style={{
            backgroundImage: `url(${userAvatar})`,
          }}
        >
          <div className="h-[56px] w-[56px] rounded-[28px] border-[0.66px] border-solid border-[#0f172814]" />
        </div>
        <div className="flex flex-col flex-1 gap-1 justify-center items-start">
          <Heading
            onClick={() => handleItemClick(`recruiterFullname[${index}]`)}
            size="text_lg_semibold"
            as="h6"
            className="text-[18px] font-semibold !text-[#000000]"
          >
            {userName}
          </Heading>
          <Text
            onClick={() => handleItemClick(`recruiterRole[${index}]`)}
            size="text_md_regular"
            as="p"
            className="text-[16px] font-normal !text-[#000000]"
          >
            {userRole}
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 self-stretch">
        {!!recruiterPhoneEnabled && (
          <a
            //recruiterPhone
            onClick={() => handleItemClick(`recruiterPhone[${index}]`)}
            href={`tel:${userPhoneNumber}`}
            className="flex gap-2 justify-start w-full"
          >
            <Img
              src="/images3/img_phone_light_blue_a700.svg"
              alt="Phone Icon"
              className="h-[18px] w-[18px]"
            />
            <Text as="p" className="text-[14px] font-medium !text-[#000000]">
              {userPhoneNumber}
            </Text>
          </a>
        )}
        {!!recruiterEmailEnabled && (
          <a
            //recruiterEmail
            onClick={() => handleItemClick(`recruiterEmail[${index}]`)}
            href={`mailto:${userEmail}`}
            className="flex gap-2 justify-start w-full"
          >
            <Img
              src="/images3/img_mail_01_light_blue_a700.svg"
              alt="Email Icon"
              className="h-[18px] w-[18px]"
            />
            <Text as="p" className="text-[14px] font-medium !text-[#000000]">
              {userEmail}
            </Text>
          </a>
        )}
      </div>
    </div>
  );
}

const useRecruiterContactHover = () => {
  const {
    hoveredField,
    scrollToSection,
    setLastScrollToSection,
    lastScrollToSection,
  } = useHover();
  const sectionRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();

  const recruitersRefs = useRef({});

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      recruiterContactTitle: titleRef,
      recruiterContactText: textRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-section");
      }
    });

    // Clear highlights from recruitersRefs
    Object.values(recruitersRefs.current).forEach((ref) => {
      if (ref) {
        ref.classList.remove("highlight-section");
      }
    });

    // Handle regular fields
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }

    // Handle recruiter fields - use exact hoveredField as key
    if (recruitersRefs.current[hoveredField]) {
      recruitersRefs.current[hoveredField].classList.add("highlight-section");
    }
  }, [hoveredField]);

  useEffect(() => {
    if (
      scrollToSection === "recruiter-contact" &&
      sectionRef.current &&
      lastScrollToSection !== "recruiter-contact"
    ) {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("recruiter-contact");
    }
  }, [scrollToSection]);

  return {
    sectionRef,
    titleRef,
    textRef,
    recruitersRefs,
  };
};

const Template3 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();
  const refs = useRecruiterContactHover();

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

  return (
    <>
      <div ref={refs.sectionRef} style={{ backgroundColor: variantPl4 }}>
        <div className="flex justify-center py-24 mdx:py-5">
          <div className="container flex gap-5 justify-center items-start px-8 mdx:flex-col mdx:px-5">
            <div className="flex flex-col gap-3.5 items-start w-1/3 mdx:w-full">
              <div ref={refs.titleRef}>
                <Heading
                  as="h2"
                  className="text-[36px] font-semibold tracking-[-0.72px] mdx:text-[34px] sm:text-[32px]"
                  onClick={() => handleItemClick("recruiterContactTitle")}
                  style={{ color: variantPd5 }}
                >
                  {landingPageData?.recruiterContactTitle}
                </Heading>
              </div>
              <div ref={refs.textRef}>
                <Text
                  size="text_xl_regular"
                  as="p"
                  className="text-[20px] font-normal "
                  onClick={() => handleItemClick("recruiterContactText")}
                  style={{ color: variantPd5 }}
                >
                  {landingPageData?.recruiterContactText}
                </Text>
              </div>
            </div>
            <div className="flex flex-row flex-wrap flex-1 gap-5 justify-center items-end w-2/3 h-full mdx:w-full mdx:flex-col mdx:self-stretch mdx:items-start">
              {landingPageData?.recruiters?.map?.((recruiter, index) => (
                <UserProfile3
                  key={index}
                  index={index}
                  userName={recruiter?.recruiterFullname}
                  userRole={recruiter?.recruiterRole}
                  userEmail={recruiter?.recruiterEmail}
                  userPhoneNumber={recruiter?.recruiterPhone}
                  userAvatar={
                    recruiter?.recruiterAvatar ||
                    "/public/images/img_avatar.png"
                  }
                  recruiterEmailEnabled={recruiter?.recruiterEmailEnabled}
                  recruiterPhoneEnabled={recruiter?.recruiterPhoneEnabled}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Template2 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();
  const { recruitersRefs, sectionRef, textRef, titleRef } = useRecruiterContactHover();
  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  // Extract colors for Template 2 blue theme
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

  // Get recruiters data
  const recruiters = landingPageData?.recruiters || [];

  // Split title to highlight last words
  const titleParts = React.useMemo(() => {
    const title = landingPageData?.recruiterContactTitle || "Reach Out To Us!";
    const words = title.split(" ");
    const midpoint = Math.ceil(words.length / 2);
    return {
      firstPart: words.slice(0, midpoint).join(" "),
      lastPart: words.slice(midpoint).join(" ")
    };
  }, [landingPageData?.recruiterContactTitle]);

  // Determine grid columns based on number of recruiters
  const getGridClass = () => {
    if (recruiters.length === 1) return "justify-center";
    if (recruiters.length === 2) return "justify-center";
    return "justify-center";
  };

  return (
    <div
      id="recruiter-contact"
      ref={sectionRef}
      className="w-full bg-white py-16 md:py-24 px-4 md:px-8"
      style={{ fontFamily: bodyFont?.family || "Inter, sans-serif" }}
    >
      <div className="container mx-auto max-w-[1296px]">
        {/* Header Section */}
        <div className="mb-16 md:mb-20 text-center">
          {/* Title with highlighted last part */}
          <div className="relative inline-block mb-7">
            <h2
              ref={titleRef}
              onClick={() => handleItemClick("recruiterContactTitle")}
              className="text-4xl md:text-5xl font-semibold tracking-tight cursor-pointer"
              style={{
                fontFamily: titleFont?.family || "Inter, sans-serif",
                letterSpacing: "-0.03em",
                lineHeight: 1.25,
              }}
            >
              <span style={{ color: "#292929" }}>{titleParts.firstPart} </span>
              <span className="relative">
                {/* Gradient highlight behind text */}
                <span
                  className="absolute left-0 bottom-1 h-[24px] w-full rounded-lg -z-10"
                  style={{
                    background: `linear-gradient(to right, ${getColor("primary", 200)}, transparent)`,
                  }}
                />
                <span style={{ color: "#292929" }}>{titleParts.lastPart}</span>
              </span>
            </h2>
          </div>

          {/* Description */}
          <p
            ref={textRef}
            onClick={() => handleItemClick("recruiterContactText")}
            className="text-base max-w-2xl mx-auto cursor-pointer"
            style={{
              color: "#7c7c7c",
              fontFamily: subheaderFont?.family || "Inter, sans-serif",
              lineHeight: 1.5,
            }}
          >
            {landingPageData?.recruiterContactText || "Some text can be placed here...."}
          </p>
        </div>

        {/* Recruiter Cards */}
        <div className={`flex flex-wrap gap-6 ${getGridClass()}`}>
          {recruiters.map((recruiter, index) => {
            const name = recruiter?.recruiterFullname || "Contact Name";
            const role = recruiter?.recruiterRole || "Role";
            const phone = recruiter?.recruiterPhone || "+1 (000) 000-0000";
            const email = recruiter?.recruiterEmail || "email@example.com";
            const image = recruiter?.recruiterAvatar || "/dhwise-images/placeholder.png";
            const phoneEnabled = recruiter?.recruiterPhoneEnabled !== false;
            const emailEnabled = recruiter?.recruiterEmailEnabled !== false;

            return (
              <div
                key={index}
                className="flex flex-col items-center bg-white rounded-3xl overflow-hidden w-full max-w-[416px] pt-10 px-6"
                style={{
                  boxShadow: "0px 44px 68px 16px rgba(0, 0, 0, 0.03)",
                }}
              >
                {/* Profile Image with Orange Arc Ring */}
                <div className="mb-12">
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: "236px",
                      height: "236px",
                    }}
                  >
                    {/* Full orange ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `1.5px solid ${getColor("secondary", 500)}`,
                      }}
                    />
                    {/* Inner image container with shadow */}
                    <div
                      className="relative overflow-hidden rounded-full"
                      style={{
                        width: "180px",
                        height: "180px",
                        boxShadow: "0px 44px 68px 16px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                        ref={(el) => {
                          recruitersRefs.current[`recruiters[${index}].recruiterAvatar`] = el;
                        }}
                        onClick={() => handleItemClick(`recruiters[${index}].recruiterAvatar`)}
                      />
                    </div>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center mb-8">
                  <h3
                    ref={(el) => {
                      recruitersRefs.current[`recruiters[${index}].recruiterFullname`] = el;
                    }}
                    onClick={() => handleItemClick(`recruiters[${index}].recruiterFullname`)}
                    className="text-[32px] font-semibold mb-5 cursor-pointer leading-[36px]"
                    style={{
                      color: "#292929",
                      fontFamily: titleFont?.family,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {name}
                  </h3>
                  <p
                    ref={(el) => {
                      recruitersRefs.current[`recruiters[${index}].recruiterRole`] = el;
                    }}
                    onClick={() => handleItemClick(`recruiters[${index}].recruiterRole`)}
                    className="text-base cursor-pointer leading-6"
                    style={{
                      color: "#7c7c7c",
                      fontFamily: bodyFont?.family,
                    }}
                  >
                    {role}
                  </p>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-col gap-4 w-[320px]">
                  {phoneEnabled && (
                    <a
                      href={`tel:${phone}`}
                      ref={(el) => {
                        recruitersRefs.current[`recruiters[${index}].recruiterPhone`] = el;
                      }}
                      onClick={() => handleItemClick(`recruiters[${index}].recruiterPhone`)}
                      className="flex items-center justify-center gap-3 px-5 py-4 rounded-full transition-all hover:shadow-md cursor-pointer"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(34px)",
                        border: "1px solid #dcdcdc",
                      }}
                    >
                      <Phone
                        size={24}
                        strokeWidth={2}
                        style={{ color: "#292929" }}
                      />
                      <span
                        className="font-semibold text-base leading-6"
                        style={{
                          color: "#292929",
                          fontFamily: bodyFont?.family,
                        }}
                      >
                        {phone}
                      </span>
                    </a>
                  )}

                  {emailEnabled && (
                    <a
                      href={`mailto:${email}`}
                      ref={(el) => {
                        recruitersRefs.current[`recruiters[${index}].recruiterEmail`] = el;
                      }}
                      onClick={() => handleItemClick(`recruiters[${index}].recruiterEmail`)}
                      className="flex items-center justify-center gap-3 px-5 py-4 rounded-full transition-all hover:shadow-md cursor-pointer"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(34px)",
                        border: "1px solid #dcdcdc",
                      }}
                    >
                      <Mail
                        size={24}
                        strokeWidth={2}
                        style={{ color: "#292929" }}
                      />
                      <span
                        className="font-semibold text-base leading-6"
                        style={{
                          color: "#292929",
                          fontFamily: bodyFont?.family,
                        }}
                      >
                        {email}
                      </span>
                    </a>
                  )}
                </div>

                {/* Bottom Blue Accent Bar */}
                <div
                  className="w-[320px] h-3 rounded-t-2xl mt-12"
                  style={{
                    backgroundColor: getColor("primary", 200),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Template1 = ({ landingPageData, fetchData }) => {
  const { handleItemClick } = useFocusContext();
  const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);

  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#2e9eac";
  const secondaryColor = landingPageData?.secondaryColor || "#e1ce11";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#2e9eac",
      secondaryColor: "#e1ce11",
      tertiaryColor: "#44b566",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  const { recruitersRefs, sectionRef, textRef, titleRef } =
    useRecruiterContactHover();
  const [activeSlide, setActiveSlide] = useState(0);

  // Add hover states for phone and email icons at the Template1 level
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [hoveredEmail, setHoveredEmail] = useState(null);

  // Get recruiters data from landingPageData or use defaults
  const recruiters = landingPageData?.recruiters || [
    {
      recruiterFullname: "Alison Medis",
      recruiterRole: "Project Manager",
      recruiterPhone: "+1 (415) 555-1010",
      recruiterEmail: "alison@gmail.com",
      recruiterAvatar: "/images3/img_image.png",
      phoneIconStyle: "filled",
      emailIconStyle: "outlined",
    },
    {
      recruiterFullname: "Lara Martinson",
      recruiterRole: "Manager",
      recruiterPhone: "+1 (415) 555-1010",
      recruiterEmail: "lara@gmail.com",
      recruiterAvatar: "/images3/img_image.png",
      phoneIconStyle: "outlined",
      emailIconStyle: "outlined",
    },
  ];

  const [isMd, setIsMd] = useState(false);
  const containerRef = useRef(null);

  // Sliding carousel state/refs for mobile
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Go to slide by index
  const goToSlide = (index) => {
    if (sliderRef.current) {
      setActiveSlide(index);
      const containerWidth = sliderRef.current.clientWidth;
      const scrollPosition = index * containerWidth;
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Immediate scroll handler for real-time dot updates
  const handleScrollImmediate = React.useCallback(() => {
    if (sliderRef.current && !isDragging) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const containerWidth = sliderRef.current.clientWidth;
      const newActiveSlide = Math.round(scrollPosition / containerWidth);
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    }
  }, [isDragging, activeSlide]);

  // Debounced scroll handler for final position
  const debouncedHandleScroll = React.useCallback(() => {
    clearTimeout(window.recruiterContactScrollTimeout);
    window.recruiterContactScrollTimeout = setTimeout(handleScrollImmediate, 10);
  }, [handleScrollImmediate]);

  // Mouse/touch drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      handleScrollImmediate();
    }, 10);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const checkSize = () => {
      // Check the container width instead of window width
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setIsMd(containerWidth < 768);
      }
    };

    // Initial check
    checkSize();

    // Use ResizeObserver to detect changes in the container size
    const resizeObserver = new ResizeObserver(checkSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Function to render a contact card
  const ContactCard = ({ recruiter, index, isMobile }) => {
    const name = recruiter?.recruiterFullname || "Contact Name";
    const role = recruiter?.recruiterRole || "Role";
    const phone = recruiter?.recruiterPhone || "+1 (000) 000-0000";
    const email = recruiter?.recruiterEmail || "email@example.com";
    const image = recruiter?.recruiterAvatar || "/dhwise-images/placeholder.png";
    const phoneIconStyle = recruiter?.phoneIconStyle || "outlined";
    const emailIconStyle = recruiter?.emailIconStyle || "outlined";
    const phoneEnabled = !!recruiter?.recruiterPhoneEnabled || false;
    const emailEnabled = !!recruiter?.recruiterEmailEnabled || false;
    //{ hoveredField: 'recruiters[0].recruiterFullname' }
    const textColor = calculateTextColor(getColor("primary", 500));
    return (
      <div
        className="flex flex-col items-center"
        style={{
          fontFamily: bodyFont?.family,
        }}
      >
        {/* Profile Image */}
        <div className="relative mb-5 w-32 h-32">
          <div
            className="absolute inset-0 rounded-full"
            // style={{ backgroundColor: getColor("primary", 100) + "4D" }} // 30% opacity
          ></div>
          <img
            src={image} 
            alt={name}
            className="object-cover w-full h-full rounded-full"
          />
        </div>

        {/* Name and Role */}
        <h3
          className="mb-1 text-2xl font-bold"
          style={{ color: "black", fontFamily: bodyFont?.family }}
          onClick={() =>
            handleItemClick(`recruiters[${index}].recruiterFullname`)
          }
          ref={(el) => {
            recruitersRefs.current[`recruiters[${index}].recruiterFullname`] =
              el;
          }}
        >
          {name}
        </h3>
        <p
          className="mb-6"
          style={{ color: "black", fontFamily: bodyFont?.family }}
          onClick={() => handleItemClick(`recruiters[${index}].recruiterRole`)}
          ref={(el) => {
            recruitersRefs.current[`recruiters[${index}].recruiterRole`] = el;
          }}
        >
          {role}
        </p>

        {/* Contact Information */}
        <div className={`flex ${isMobile ? 'flex-col' : ''} gap-8`}>
          {/* On mobile, show email first; on desktop, show phone first */}
          {isMobile ? (
            <>
              {emailEnabled && (
                <a
                  href={`mailto:${email}`}
                  className="flex flex-col gap-3 items-center transition-colors group"
                  onClick={() =>
                    handleItemClick(`recruiters[${index}].recruiterEmail`)
                  }
                  ref={(el) => {
                    recruitersRefs.current[`recruiters[${index}].recruiterEmail`] =
                      el;
                  }}
                  onMouseEnter={() => setHoveredEmail(index)}
                  onMouseLeave={() => setHoveredEmail(null)}
                >
                  <div
                    className="flex justify-center items-center w-10 h-10 rounded-full transition-transform group-hover:scale-105 border"
                    style={{
                      borderColor: getColor("primary", 300),
                      backgroundColor:
                        hoveredEmail === index
                          ? getColor("primary", 500)
                          : "transparent",
                      color:
                        hoveredEmail === index ? "#fff" : getColor("primary", 500),
                      transition:
                        "background-color 0.2s, color 0.2s, border-color 0.2s",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <span
                    style={{
                      fontFamily: bodyFont?.family,
                    }}
                    className="text-sm"
                  >
                    {email}
                  </span>
                </a>
              )}

              {phoneEnabled && (
                <a
                  href={`tel:${phone}`}
                  className="flex flex-col gap-3 items-center transition-colors group"
                  onClick={() =>
                    handleItemClick(`recruiters[${index}].recruiterPhone`)
                  }
                  ref={(el) => {
                    recruitersRefs.current[`recruiters[${index}].recruiterPhone`] =
                      el;
                  }}
                  onMouseEnter={() => setHoveredPhone(index)}
                  onMouseLeave={() => setHoveredPhone(null)}
                >
                  <div
                    className="flex justify-center items-center w-10 h-10 rounded-full transition-transform group-hover:scale-105 border"
                    style={{
                      borderColor: getColor("primary", 300),
                      backgroundColor:
                        hoveredPhone === index
                          ? getColor("primary", 500)
                          : "transparent",
                      color:
                        hoveredPhone === index
                          ? textColor
                          : getColor("primary", 500),
                      transition:
                        "background-color 0.2s, color 0.2s, border-color 0.2s",
                      fontFamily: bodyFont?.family,
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <span
                    style={{
                      fontFamily: bodyFont?.family,
                    }}
                    className="text-sm"
                  >
                    {phone}
                  </span>
                </a>
              )}
            </>
          ) : (
            <>
              {phoneEnabled && (
                <a
                  href={`tel:${phone}`}
                  className="flex flex-col gap-3 items-center transition-colors group"
                  onClick={() =>
                    handleItemClick(`recruiters[${index}].recruiterPhone`)
                  }
                  ref={(el) => {
                    recruitersRefs.current[`recruiters[${index}].recruiterPhone`] =
                      el;
                  }}
                  onMouseEnter={() => setHoveredPhone(index)}
                  onMouseLeave={() => setHoveredPhone(null)}
                >
                  <div
                    className="flex justify-center items-center w-10 h-10 rounded-full transition-transform group-hover:scale-105 border"
                    style={{
                      borderColor: getColor("primary", 300),
                      backgroundColor:
                        hoveredPhone === index
                          ? getColor("primary", 500)
                          : "transparent",
                      color:
                        hoveredPhone === index
                          ? textColor
                          : getColor("primary", 500),
                      transition:
                        "background-color 0.2s, color 0.2s, border-color 0.2s",
                      fontFamily: bodyFont?.family,
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <span
                    style={{
                      fontFamily: bodyFont?.family,
                    }}
                    className="text-sm"
                  >
                    {phone}
                  </span>
                </a>
              )}

              {emailEnabled && (
                <a
                  href={`mailto:${email}`}
                  className="flex flex-col gap-3 items-center transition-colors group"
                  onClick={() =>
                    handleItemClick(`recruiters[${index}].recruiterEmail`)
                  }
                  ref={(el) => {
                    recruitersRefs.current[`recruiters[${index}].recruiterEmail`] =
                      el;
                  }}
                  onMouseEnter={() => setHoveredEmail(index)}
                  onMouseLeave={() => setHoveredEmail(null)}
                >
                  <div
                    className="flex justify-center items-center w-10 h-10 rounded-full transition-transform group-hover:scale-105 border"
                    style={{
                      borderColor: getColor("primary", 300),
                      backgroundColor:
                        hoveredEmail === index
                          ? getColor("primary", 500)
                          : "transparent",
                      color:
                        hoveredEmail === index ? "#fff" : getColor("primary", 500),
                      transition:
                        "background-color 0.2s, color 0.2s, border-color 0.2s",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <span
                    style={{
                      fontFamily: bodyFont?.family,
                    }}
                    className="text-sm"
                  >
                    {email}
                  </span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="recruiter-contact"
      className="overflow-hidden relative px-4 py-16 w-full bg-white md:px-8"
      ref={(el) => {
        sectionRef.current = el;
        containerRef.current = el;
      }}
      style={{
        color: "black",
      }}
    >
      {/* Decorative Elements */}
      {/* <div
        className="absolute top-0 left-0 w-32 h-32 rounded-br-[32px]"
        style={{ backgroundColor: getColor("primary", 100) + "33" }} // 20% opacity
      ></div>
      <div
        className="absolute left-20 top-24 w-16 h-16 rounded-lg"
        style={{ backgroundColor: getColor("primary", 100) + "1A" }} // 10% opacity
      ></div>
      <div
        className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-[32px]"
        style={{ backgroundColor: getColor("primary", 100) + "33" }} // 20% opacity
      ></div> */}

      <svg
        className="absolute top-0 left-0 smx:hidden"
        width="241"
        height="318"
        viewBox="0 0 241 318"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_5026_11275)">
          <rect
            x="-76"
            width="208"
            height="208"
            rx="24"
            fill={getColor("tertiary", 200)}

          />
          <rect
            x="132"
            y="208"
            width="95"
            height="95"
            rx="16"
            fill={getColor("tertiary", 50)}
          />
        </g>
        <defs>
          <clipPath id="clip0_5026_11275">
            <rect width="241" height="318" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {/* Content */}
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2
            ref={titleRef}
            className="mb-3 text-[2.5rem] font-bold"
            style={{ fontFamily: subheaderFont?.family }}
            onClick={() => handleItemClick("recruiterContactTitle")}
          >
            {landingPageData?.recruiterContactTitle
              ? landingPageData?.recruiterContactTitle
                  .split(" ")
                  .slice(
                    0,
                    Math.ceil(
                      landingPageData?.recruiterContactTitle?.split(" ")
                        .length / 2
                    )
                  )
                  .join(" ")
              : ""}{" "}
            <span style={{ fontFamily: subheaderFont?.family }}>
              {landingPageData?.recruiterContactTitle
                ? landingPageData?.recruiterContactTitle
                    .split(" ")
                    .slice(
                      Math.ceil(
                        landingPageData?.recruiterContactTitle?.split(" ")
                          .length / 2
                      )
                    )
                    .join(" ")
                : ""}
            </span>
          </h2>
          <p
            ref={textRef}
            className="text-lg"
            style={{ fontFamily: bodyFont?.family }}
            onClick={() => handleItemClick("recruiterContactText")}
            dangerouslySetInnerHTML={{
              __html: (landingPageData?.recruiterContactText || "")?.replace?.(/\n/g, "<br>")
            }}
          >
          </p>
        </div>

        {/* Desktop Layout */}
        {!isMd && (
          <div className="hidden gap-24 justify-center md:flex">
            {recruiters.map((recruiter, index) => (
              <ContactCard key={index} recruiter={recruiter} index={index} isMobile={false} />
            ))}
          </div>
        )}

        {/* Mobile Layout with Carousel */}
        {isMd && (
          <div>
            <div
              ref={sliderRef}
              className="flex overflow-x-auto justify-start snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
              }}
              onScroll={(e) => {
                handleScrollImmediate();
                debouncedHandleScroll();
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              {recruiters.map((recruiter, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-2 snap-start"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ContactCard recruiter={recruiter} index={index} isMobile={true} />
                </div>
              ))}
            </div>
            {/* Carousel Navigation Dots - Only show if more than one recruiter */}
            {recruiters.length > 1 && (
              <div className="flex gap-2 justify-center mt-8">
                {recruiters.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors`}
                    style={{
                      backgroundColor:
                        index === activeSlide
                          ? getColor("primary", 500)
                          : "#d1d5db",
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RecruiterContact = (props) => {
  if (props?.landingPageData?.templateId?.toLowerCase() === "3")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "2")
    return <Template2 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default RecruiterContact;
