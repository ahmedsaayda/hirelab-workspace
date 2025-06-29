import React, {
  Suspense,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { Heading, Img, Text } from "./components";
import { useFocusContext } from "../../contexts/FocusContext";
import { useHover } from "../../contexts/HoverContext";
import useTemplatePalette from "../../hooks/useTemplatePalette";
import { Phone, Mail } from "lucide-react";
import { getThemeData } from "../../utils/destructureTheme.js";
import { getFonts } from "./getFonts.js";
import { calculateTextColor } from "./utils";

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
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
  const refs = useRecruiterContactHover();

  return (
    <>
      <div ref={refs.sectionRef}>
        <div className="flex flex-col items-center gap-[52px] bg-[#f8f9fb] py-[22px] sm:gap-[26px] sm:py-5">
          <div className="container mt-[72px] flex flex-col items-center px-14 mdx:px-5">
            <div className="flex flex-col gap-3.5 items-center">
              <div ref={refs.titleRef}>
                <Heading
                  as="h2"
                  className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] sm:text-[32px]"
                >
                  {landingPageData?.recruiterContactTitle}
                </Heading>
              </div>
              <div ref={refs.textRef}>
                <Text
                  size="text_xl_regular"
                  as="p"
                  className="text-[20px] font-normal text-[#475466]"
                >
                  {landingPageData?.recruiterContactText}
                </Text>
              </div>
            </div>
          </div>
          <div className="flex items-start self-stretch mdx:flex-col">
            <div className="flex flex-1 justify-center items-start px-14 mb-7 mdx:flex-col mdx:self-stretch mdx:px-5">
              <div className="h-[68px] w-[68px] self-end rounded-[34px] bg-[#0E87FE33] mdx:self-auto" />
              <div className="mb-11 ml-[42px] mt-2.5 flex w-[86%] gap-16 mdx:ml-0 mdx:w-full mdx:flex-col">
                {landingPageData?.recruiters?.map?.((recruiter, index) => (
                  <UserProfile
                    key={index}
                    index={index}
                    userName={recruiter?.recruiterFullname}
                    userRole={recruiter?.recruiterRole}
                    userEmail={recruiter?.recruiterEmail}
                    userPhoneNumber={recruiter?.recruiterPhone}
                    userImage={
                      recruiter?.recruiterAvatar ||
                      "/public/images/img_avatar.png"
                    }
                    recruiterEmailEnabled={recruiter?.recruiterEmailEnabled}
                    recruiterPhoneEnabled={recruiter?.recruiterPhoneEnabled}
                  />
                ))}
              </div>
              <div className="ml-7 h-[22px] w-[22px] rounded-[10px] bg-[#0E87FE33] mdx:ml-0" />
            </div>
            <Img
              src="/images3/img_ellipse_6.png"
              alt="Ellipse Image"
              className="h-[50px] w-[2%] self-end object-contain mdx:w-full mdx:self-auto"
            />
          </div>
        </div>
      </div>
    </>
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

  // Scroll handler to update active dot
  const handleScroll = React.useCallback(() => {
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
  const debouncedHandleScroll = React.useCallback(() => {
    clearTimeout(window.recruiterContactScrollTimeout);
    window.recruiterContactScrollTimeout = setTimeout(handleScroll, 100);
  }, [handleScroll]);

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
      handleScroll();
    }, 50);
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
  const ContactCard = ({ recruiter, index }) => {
    const name = recruiter?.recruiterFullname || "Contact Name";
    const role = recruiter?.recruiterRole || "Role";
    const phone = recruiter?.recruiterPhone || "+1 (000) 000-0000";
    const email = recruiter?.recruiterEmail || "email@example.com";
    const image = recruiter?.recruiterAvatar || placeholder;
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
        <div className="flex gap-8">
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
            dangerouslySetInnerHTML={{ __html: landingPageData?.recruiterContactText || "" }}
          >
          </p>
        </div>

        {/* Desktop Layout */}
        {!isMd && (
          <div className="hidden gap-24 justify-center md:flex">
            {recruiters.map((recruiter, index) => (
              <ContactCard key={index} recruiter={recruiter} index={index} />
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
              onScroll={debouncedHandleScroll}
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
                  <ContactCard recruiter={recruiter} index={index} />
                </div>
              ))}
            </div>
            {/* Carousel Navigation Dots */}
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
