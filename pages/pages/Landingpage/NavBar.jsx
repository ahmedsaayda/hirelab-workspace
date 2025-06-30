import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../Landing/Button";
import useTemplatePalette from "../../hooks/useTemplatePalette";
import { useHover } from "../../../src/contexts/HoverContext";
import { Share2 } from "lucide-react";
import { calculateTextColor } from "./utils";
import { getFonts } from "./getFonts.js";
import ApplyCustomFont from "./ApplyCustomFont";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, message,Modal as AntModal, Button  as AntButton} from "antd";
import {ClipboardCheck } from "lucide-react";
import { LinkOutlined,CheckCircleFilled} from '@ant-design/icons';
// import XIcon from "../../assets/img/x_icon.png";
// import Mail from "../../assets/img/mail.webp";
// public\assets\x_icon.png
// src\pages\Landingpage\NavBar.jsx

const useHeroHover = () => {
  const { hoveredField, scrollToSection } = useHover();
  const sectionRef = useRef(null);
  // Main fields
  const vacancyTitleRef = useRef(null);
  const heroDescriptionRef = useRef(null);
  const locationRef = useRef(null);
  const hoursMinRef = useRef(null);
  const cta1TitleRef = useRef(null);
  const cta2TitleRef = useRef(null);
  // Additional fields from renderMore
  const salaryMinRef = useRef(null);
  const salaryMaxRef = useRef(null);
  const salaryTimeRef = useRef(null);
  const salaryCurrencyRef = useRef(null);
  const salaryRangeRef = useRef(null);
  const hoursMaxRef = useRef(null);
  const hoursUnitRef = useRef(null);
  const hoursRangeRef = useRef(null);
  const cta1LinkRef = useRef(null);
  const cta2LinkRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroImagePositionXRef = useRef(0);
  const heroImagePositionYRef = useRef(0);

  useLayoutEffect(() => {
    if (!hoveredField) return;

    const refs = {
      // Main fields
      vacancyTitle: vacancyTitleRef,
      heroDescription: heroDescriptionRef,
      location: locationRef,
      hoursMin: hoursMinRef,
      cta1Title: cta1TitleRef,
      cta2Title: cta2TitleRef,
      // Additional fields from renderMore
      salaryMin: salaryMinRef,
      salaryMax: salaryMaxRef,
      salaryTime: salaryTimeRef,
      salaryCurrency: salaryCurrencyRef,
      salaryRange: salaryRangeRef,
      hoursMax: hoursMaxRef,
      hoursUnit: hoursUnitRef,
      hoursRange: hoursRangeRef,
      cta1Link: cta1LinkRef,
      cta2Link: cta2LinkRef,
      // Image position fields
      heroImage: heroImageRef,
      heroImagePositionX: heroImagePositionXRef,
      heroImagePositionY: heroImagePositionYRef,
    };

    // Clear all highlights first
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        (ref.current).classList.remove("highlight-section");
      }
    });

    // Apply highlight to target element
    const targetRef = refs[hoveredField]?.current;
    if (targetRef) {
      targetRef.classList.add("highlight-section");
    }
    // targetRef.scrollIntoView({
    //   behavior: "smooth",
    //   block: "center",
    // });
  }, [hoveredField]);

  return {
    sectionRef,
    // Main fields
    vacancyTitleRef,
    heroDescriptionRef,
    locationRef,
    hoursMinRef,
    cta1TitleRef,
    cta2TitleRef,
    // Additional fields from renderMore
    salaryMinRef,
    salaryMaxRef,
    salaryTimeRef,
    salaryCurrencyRef,
    salaryRangeRef,
    hoursMaxRef,
    hoursUnitRef,
    hoursRangeRef,
    cta1LinkRef,
    cta2LinkRef,
    // Image position fields
    heroImageRef,
    heroImagePositionXRef,
    heroImagePositionYRef,
  };
};

const Template3 = ({ landingPageData, onClickApply }) => {
  const [showApplyButton, setShowApplyButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowApplyButton(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const logo = landingPageData?.companyLogo || "/images3/Button.png";
  return (
    <header
      className="sticky top-0 px-4 py-4 w-full bg-transparent sm:px-6 lg:px-8"
      style={{ zIndex: 999, background: "rgba(0,0,0,0.8)" }}
    >
      <div className="container flex justify-between items-center mx-auto w-full">
        <Link href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="mr-10 w-auto h-8" />
        </Link>
        <div>
          <nav>
            <ul className="flex items-center space-x-6">
              <div
                className={`transition-all duration-300 ease-in-out ${
                  showApplyButton
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                <Button
                  {...({} )}
                  color="light_blue_A700"
                  size="lg"
                  className="w-full rounded border border-solid border-[#0E87FE] px-[19px] font-semibold whitespace-nowrap"
                  onClick={() => {
                    onClickApply();
                  }} // Open form editor when "Apply now" is clicked
                >
                  {landingPageData?.ctaApply}
                </Button>
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const Template2 = ({ landingPageData, onClickApply }) => {
  const [showApplyButton, setShowApplyButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowApplyButton(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const logo = landingPageData?.companyLogo || "/images3/Button.png";
  return (
    <header
      className="sticky top-0 px-4 py-4 w-full bg-transparent sm:px-6 lg:px-8"
      style={{ zIndex: 999, background: "rgba(0,0,0,0.8)" }}
    >
      <div className="container flex justify-between items-center mx-auto w-full">
        <Link href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="mr-10 w-auto h-8" />
        </Link>
        <div>
          <nav>
            <ul className="flex items-center space-x-6">
              <div
                className={`transition-all duration-300 ease-in-out ${
                  showApplyButton
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                <Button
                  {...({} )}
                  color="light_blue_A700"
                  size="lg"
                  className="w-full rounded border border-solid border-[#0E87FE] px-[19px] font-semibold whitespace-nowrap"
                  onClick={() => {}} // Open form editor when "Apply now" is clicked
                >
                  {landingPageData?.ctaApply}
                </Button>
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const Template1Old = ({ landingPageData, onClickApply }) => {
  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#2e9eac";
  const secondaryColor = landingPageData?.secondaryColor || "#e1ce11";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";
  const x = {
    primaryColor: "#2e9eac",
    secondaryColor: "#e1ce11",
    tertiaryColor: "#44b566",
  };

  

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#2e9eac",
      secondaryColor: "#e1ce11",
      tertiaryColor: "#44b566",
      heroBackgroundColor: "white",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
      heroBackgroundColor: "white",
    }
  );

  // Background color for the hero section (dark teal)
  const bgColor = "#1a3e4c";
  const navBgColor = "#1a4a5c";
  const logo = landingPageData?.companyLogo || "/images3/Button.png";
  const [isFixed, setIsFixed] = useState(false);
  const [isTemplate3NavFixed, setIsTemplate3NavFixed] = useState(false);
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.slice(1) || "job-specifications"
  );

  const menuItemsArray = landingPageData?.menuItems?.map((item) => item.key);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 64);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("navFixed-template3", () => {
      setIsTemplate3NavFixed(true);
    });
    window.addEventListener("navUnfixed-template3", () => {
      setIsTemplate3NavFixed(false);
    });
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentHash(hash || "job-specifications");
    };

    // Set initial hash
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);


  const handleNavigate = (id) => {
    // Dispatch a custom event that the iframe can listen to
    const event = new CustomEvent('navigateToSection', { detail: { id } });
    window.dispatchEvent(event);
    // Update the URL hash
    window.location.hash = `#${id}`;
  };
  const textColor = calculateTextColor(getColor("primary", 900));
  const navigationTextColor = calculateTextColor(getColor("primary", 800));
  return (
    <>
      <header
        style={{
          backgroundColor: !isTemplate3NavFixed
            ? "transparent"
            : getColor("primary", 800),
          zIndex: 999,
          transition: "background-color 0.6s ease",
        }}
        className={`flex ${
          isFixed ? "fixed top-0" : "absolute"
        }  items-center px-4 w-full h-16 sm:px-6 lg:px-8`}
      >
        <div className="w-full max-w-[1500px] mx-auto flex items-center ">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="mr-10 w-auto h-8" />
          </div>
          <div className="flex gap-3 justify-end w-full ">
            <button
              style={{
                color: textColor,
                borderColor: textColor,
              }}
              className="px-6 py-2 text-sm text-white rounded-full border transition hover:opacity-50"
            >
              <Share2 size={20} />
            </button>
            <button
              className="px-6 py-2 text-sm font-medium text-black rounded-full transition hover:bg-yellow-300"
              style={{
                backgroundColor: getColor("primary", 800),
                color: textColor,
                fontSize: "20px",
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      {isTemplate3NavFixed && (
        <div
          className="fixed top-16 left-0 right-0 h-16 mx-auto transition-all duration-100 z-[88888]"
          style={{
            backgroundColor: getColor("primary", 800),
            zIndex: 100,
            width: "100%",
          }}
        >
          <div
            className="flex justify-center items-center mx-auto"
            style={{
              width: "100%",
            }}
          >
            <div className="flex overflow-x-auto items-center scrollbar-hide">
              {[
                {
                  id: "job-specifications",
                  label: "Summary",
                  enabled: menuItemsArray?.includes("Job Specifications"),
                },
                {
                  id: "recruiter-contact",
                  label: "Contacts",
                  enabled: menuItemsArray?.includes("Recruiter Contact"),
                },
                {
                  id: "job-description",
                  label: "Description",
                  enabled: menuItemsArray?.includes("Job Description"),
                },
                {
                  id: "agenda",
                  label: "Agenda",
                  enabled: menuItemsArray?.includes("Agenda"),
                },
                {
                  id: "about-the-company",
                  label: "About Us",
                  enabled: menuItemsArray?.includes("About The Company"),
                },
                {
                  id: "company-facts",
                  label: "Company Facts",
                  enabled: menuItemsArray?.includes("Company Facts"),
                },
                {
                  id: "leader-introduction",
                  label: "Leader Intro",
                  enabled: menuItemsArray?.includes("Leader Introduction"),
                },
                {
                  id: "testimonials",
                  label: "Testimonials",
                  enabled: menuItemsArray?.includes("Employee Testimonials"),
                },
                {
                  id: "application-process",
                  label: "Application Process",
                  enabled: menuItemsArray?.includes("Candidate Process"),
                },
                {
                  id: "growth-path",
                  label: "Growth Path",
                  enabled: menuItemsArray?.includes("Growth Path"),
                },
              ]
                .filter((tab) => tab.enabled)
                ?.map((tab, index) => (
                  <>
                    <button
                      key={index}
                      onClick={() => handleNavigate(tab.id)}
                      className="px-4 py-3 md:px-5 md:py-4 text-xs md:text-sm whitespace-nowrap transition-colors"
                      style={{
                        color:
                          currentHash === tab.id
                            ? getColor("secondary", 500)
                            : navigationTextColor,
                        opacity: currentHash === tab.id ? 1 : 0.6,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = getColor(
                          "secondary",
                          500
                        );
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                          currentHash === tab.id
                            ? getColor("secondary", 500)
                            : navigationTextColor;
                      }}
                    >
                      {tab.label}
                    </button>
                  </>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const Template1 = ({ landingPageData, onClickApply, showBackToEditButton, fullscreen, setFullscreen }) => {
  // Get device from global variable set by PreviewContainer
  const [device, setDevice] = useState((window ).__previewDevice || "desktop");
  
  // Listen for device changes
  useEffect(() => {
    const checkDevice = () => {
      const currentDevice = (window ).__previewDevice || "desktop";
      setDevice(currentDevice);
    };
    
    // Check immediately
    checkDevice();
    
    // Set up an interval to check for changes
    const interval = setInterval(checkDevice, 100);
    
    return () => clearInterval(interval);
  }, []);
  // Extract colors for dependency tracking
  const primaryColor = landingPageData?.primaryColor || "#2e9eac";
  const secondaryColor = landingPageData?.secondaryColor || "#e1ce11";
  const tertiaryColor = landingPageData?.tertiaryColor || "#44b566";

  const router = useRouter();
  const {lpId} = router.query;
  const isEditPage = router.pathname.startsWith("/edit-page/");
  const [isScrolled, setIsScrolled] = useState(false);

  // Add debug logs
  

  // Use our template palette hook with the default colors
  const { getColor } = useTemplatePalette(
    {
      primaryColor: "#2e9eac",
      secondaryColor: "#e1ce11",
      tertiaryColor: "#44b566",
      heroBackgroundColor: "white",
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
      heroBackgroundColor: "white",
    }
  );

  // Background color for the hero section (dark teal)
  const bgColor = "#1a3e4c";
  const navBgColor = "#1a4a5c";
  const logo = landingPageData?.companyLogo || "/images3/Button.png";
  const [isFixed, setIsFixed] = useState(false);
  const [isTemplate3NavFixed, setIsTemplate3NavFixed] = useState(false);
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.slice(1) || "job-specifications"
  );
  // const [isScrolled, setIsScrolled] = useState(false);
  const[shareIcon, setShareIcon] = useState(<Share2 size={20}/>);
  const [modalVisible, setModalVisible] = useState(false);
  const [link, setLink] = useState('');

const handleShareClick = () => {
    const generatedLink = `${process.env.NEXT_PUBLIC_LIVE_URL}/lp/${lpId}`;
    setLink(generatedLink); // Save the generated link
    setModalVisible(true); // Show the modal
  };


const handlemediaLink = (platform) => {
  const url = link; 
  navigator.clipboard.writeText(url).then(() => {
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share?url=${url}&title=&summary=&source=`, '_blank');
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/direct/new/?text=${url}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=&hashtag=`, '_blank');
        break;
      case 'tiktok':
        window.open(`https://www.tiktok.com/create-reactive-video?url=${url}`, '_blank');
      case 'twitter':
        const twitterLoginUrl = 'https://twitter.com/i/flow/login';
        window.open(twitterLoginUrl, '_blank');
        break;
     case 'email':
       const gmailUrl = (`https://mail.google.com/mail/?view=cm&fs=1&to=recipient@example.com&su=Check out this link!&body=Hi,%0A%0ACheck out this link: ${"  "} ${url}`);
        window.open(gmailUrl, '_blank'); 
        break;
      default:
        console.log('Unknown platform');
    }
  });
};

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setShareIcon(<ClipboardCheck size={20} />);  
      message.success('Link copied to clipboard!');
      setTimeout(() => {
        setShareIcon(<Share2 size={20} />);
      }, 3000);
    });
  };

  const handleModalClose = () => {
    setModalVisible(false); 
  };


 useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);


  const menuItemsArray = landingPageData?.menuItems?.map((item) => item.key);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 64);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("navFixed-template3", () => {
      setIsTemplate3NavFixed(true);
    });
    window.addEventListener("navUnfixed-template3", () => {
      setIsTemplate3NavFixed(false);
    });
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentHash(hash || "job-specifications");
    };

    // Set initial hash
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);


  

  const handleNavigate = (id) => {
    // Dispatch a custom event that the iframe can listen to
    const event = new CustomEvent('navigateToSection', { detail: { id } });
    window.dispatchEvent(event);
    // Update the URL hash
    window.location.hash = `#${id}`;
  };


  const scrollRef = useRef(null);

  const scrollTabs = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
  };

  const textColor = calculateTextColor(getColor("primary", 500));
  const navigationTextColor = calculateTextColor(getColor("primary", 800));
  const getBackgroundColor = (primaryColor) => {
    const brightness = getColorBrightness(primaryColor);
    return brightness > 128
      ? getColor("primary", 900)
      : getColor("primary", 500);
  };
  const getColorBrightness = (color) => {
    const rgb = color.match(/^#(\w{6})$/)?.[1];
    if(!rgb) return 0;
    const r = parseInt(rgb.slice(0, 2), 16);
    const g = parseInt(rgb.slice(2, 4), 16);
    const b = parseInt(rgb.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  const { bodyFont } = getFonts(landingPageData);

  
  return (
    <div
      style={{
        backgroundColor: "white",
        zIndex: 999,
        transition: "background-color 0.6s ease",
        position: "fixed",
        top: -2,
        left: 0,
        right: 0,
        width: "100%",
        fontFamily: bodyFont?.family,
      }}
      className="px-4 z-50"
    >
      <ApplyCustomFont landingPageData={landingPageData} />
      <header className={`flex items-center px-4 w-full h-16 sm:px-6 lg:px-8`}>
        <div className="w-full mx-auto flex items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="mr-10 w-auto h-8" />
          </div>
          <div className="flex gap-3 justify-end w-full">
            {isEditPage && lpId && !isScrolled && showBackToEditButton && fullscreen && device === "desktop" && (
              <button
                onClick={() => {
                  setFullscreen(false);
                  router.push(`/edit-page/${lpId}`);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex gap-2 items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to edit
              </button>
            )}
            <button
              style={{
                color: getColor("primary", 800),
                borderColor: getColor("primary", 800),
                height: "45px",
                fontSize: "16px",
              }}
              className="px-6 py-4 text-sm rounded-lg border transition hover:opacity-50 smx:px-3 smx:py-0.5 smx:text-xs flex items-center gap-2"
              onClick={handleShareClick}
            >
              Share {shareIcon}
            </button>
            <AntModal
              title={null}
              visible={modalVisible}
              onCancel={handleModalClose}
              footer={null}
              centered
              // style={{ width: 300 }}
              bodyStyle={{ padding: '32px', textAlign: 'center', borderRadius: '16px' }}
            >
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Page Published<CheckCircleFilled style={{ color: 'green', fontSize: 24,marginLeft: '8px' }} />
                </div>
                <div style={{ color: '#888', marginBottom: '24px' }}>
                  Let's Share with the World !..
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f5f5f5',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    marginBottom: '16px',
                    wordBreak: 'break-all'
                  }}
                >
                  <span style={{ color: '#000' }}>{link}</span>
                  <AntButton type="primary" onClick={handleCopyLink}>
                    Copy Link <LinkOutlined />
                  </AntButton>
                </div>

                <div style={{ color: '#666', marginBottom: '10px' }}>
                  Share with your loved ones:
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <AntButton shape="circle"  onClick={()=>handlemediaLink('linkedin')}>
                    <img src="https://www.linkedin.com/favicon.ico" style={{ width: 20, height: 20 }} />
                  </AntButton>
                  <AntButton shape="circle" onClick={()=>handlemediaLink('instagram')}>
                    <img src="https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png" style={{ width: 20, height: 20 }} />
                  </AntButton>
                  <AntButton shape="circle"  onClick={()=>handlemediaLink('facebook')}>
                    <img src="https://www.facebook.com/favicon.ico" style={{ width: 20, height: 20 }} />
                  </AntButton>
                  <AntButton shape="circle"  onClick={()=>handlemediaLink('tiktok')}>
                    <img src="https://www.tiktok.com/favicon.ico" style={{ width: 20, height: 20 }} />
                  </AntButton>
                  <AntButton shape="circle"  onClick={()=>handlemediaLink('twitter')}>
                    <img src="https://abs.twimg.com/favicons/twitter.3.ico" style={{ width: 20, height: 20 }} />
                  </AntButton>
                  <AntButton shape="circle" onClick={() => handlemediaLink('email')}>
                    <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" style={{ width: 24, height: 24 }} />
                  </AntButton>
                </div>
              </div>
            </AntModal>

            <button
              className="px-6 py-2 text-sm font-medium text-black rounded-lg transition hover:bg-yellow-300 smx:px-5 smx:py-0.5 smx:text-xs"
              style={{
                backgroundColor: getColor("primary", 500),
                color: textColor,
                fontSize: "16px",
              }}
              // onClick={onClickApply}
              onClick={()=>{
                // Ensure URL has protocol, add https:// if missing
                let url = landingPageData?.cta2Link || '';
                if (url && !url.match(/^https?:\/\//i)) {
                  url = 'https://' + url;
                }
                window.open(url, '_blank');
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <div
        className="w-full h-16 mx-auto transition-all duration-100 z-[88888] border-t border-gray-200"
        style={{
          backgroundColor: "white",
          zIndex: 100,
          width: "100%",
        }}
      >
        <div
          className="relative flex justify-between items-center mx-auto"
          style={{ width: "100%" }}
        >
          <button
            onClick={() => scrollTabs("left")}
            className="m-auto p-1 z-10 rounded-full bg-white shadow-md hover:bg-gray-200"
          >
            <ChevronLeft size={25} className={getColor("primary", 500)} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto items-center scrollbar-hide"
            style={{ scrollBehavior: "smooth", paddingLeft: "1px", paddingRight: "1px" }}
          >
            {[
              {
                id: "job-specifications",
                label: "Summary",
                enabled: menuItemsArray?.includes("Job Specifications"),
              },
              {
                id: "recruiter-contact",
                label: "Contacts",
                enabled: menuItemsArray?.includes("Recruiter Contact"),
              },
              {
                id: "job-description",
                label: "Description",
                enabled: menuItemsArray?.includes("Job Description"),
              },
              {
                id: "agenda",
                label: "Agenda",
                enabled: menuItemsArray?.includes("Agenda"),
              },
              {
                id: "about-the-company",
                label: "About Us",
                enabled: menuItemsArray?.includes("About The Company"),
              },
              {
                id: "company-facts",
                label: "Company Facts",
                enabled: menuItemsArray?.includes("Company Facts"),
              },
              {
                id: "leader-introduction",
                label: "Leader Intro",
                enabled: menuItemsArray?.includes("Leader Introduction"),
              },
              {
                id: "testimonials",
                label: "Testimonials",
                enabled: menuItemsArray?.includes("Employee Testimonials"),
              },
              {
                id: "candidate-process",
                label: "Application Process",
                enabled: menuItemsArray?.includes("Candidate Process"),
              },
              {
                id: "growth-path",
                label: "Growth Path",
                enabled: menuItemsArray?.includes("Growth Path"),
              },
            ]
              .filter((tab) => tab.enabled)
              ?.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(tab.id)}
                  className="px-2 py-2 md:px-5 md:py-4 text-sm md:text-lg whitespace-nowrap transition-all"
                  style={{
                    color: textColor === "#000000" ? textColor : getColor("primary", 500),
                    fontWeight: currentHash === tab.id ? "700" : "400",
                    fontFamily: bodyFont?.family,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.fontWeight = "700";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.fontWeight = currentHash === tab.id ? "700" : "400";
                  }}
                >
                  {tab.label}
                </button>
              ))}
          </div>
          <button
            onClick={() => scrollTabs("right")}
            className="m-auto z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <ChevronRight size={25} className={getColor("primary", 500)} />
          </button>
        </div>
      </div>
    </div>
  );
};

const NavBar = ({ landingPageData, onClickApply, showBackToEditButton, fullscreen, setFullscreen }) => {
  if (landingPageData?.templateId?.toLowerCase() === "3")
    return (
      <Template3
        landingPageData={landingPageData}
        onClickApply={onClickApply}
      />
    );
  if (landingPageData?.templateId === "2")
    return (
      <Template2
        landingPageData={landingPageData}
        onClickApply={onClickApply}
      />
    );
  if (landingPageData?.templateId === "1")
    return (
      <Template1
        landingPageData={landingPageData}
        onClickApply={onClickApply}
        showBackToEditButton={showBackToEditButton}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />
    );
  return (
    <Template1 
      landingPageData={landingPageData} 
      onClickApply={onClickApply} 
      showBackToEditButton={showBackToEditButton}
      fullscreen={fullscreen}
      setFullscreen={setFullscreen}
    />
  );
};

export default NavBar;
