import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../Landing/Button.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { useHover } from "../../contexts/HoverContext.js";
import { Share2 } from "lucide-react";
import { calculateTextColor } from "./utils.js";
import { getFonts } from "./getFonts.js";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { Modal as AntModal, Switch, Input, Spin, Button as AntButton } from "antd";
import { message } from "antd";
import { ClipboardCheck } from "lucide-react";
import { LinkOutlined,CheckCircleFilled} from '@ant-design/icons';
import CrudService from "../../services/CrudService";
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
                  className="w-full rounded border border-solid border-[#5207CD] px-[19px] font-semibold whitespace-nowrap"
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
                  className="w-full  rounded border border-solid border-[#5207CD] px-[19px] font-semibold whitespace-nowrap"
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


const Template1 = ({ landingPageData, onClickApply, showBackToEditButton, fullscreen, setFullscreen, lpId, isEdit, setLandingPageData }) => {
  console.log("lpId",lpId);
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
  // console.log("lpId",lpId);
  // if(!lpId){
  //   const {lpId : lpIdFromQuery} = router?.query || {};
  //   lpId = lpIdFromQuery;
  // }
  const isEditPage =isEdit || router.pathname?.startsWith("/edit-page/");
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
  const [applyLinkModalVisible, setApplyLinkModalVisible] = useState(false);
  const [ctaLink, setCtaLink] = useState("");
  const [initialCtaLink, setInitialCtaLink] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (landingPageData) {
      setCtaLink(landingPageData.cta2Link || '#apply');
      setInitialCtaLink(landingPageData.cta2Link || '#apply');
    }
  }, [landingPageData]);

  const handleSaveCtaLink = () => {
    if (!ctaLink.trim()) {
      message.warning("Please enter a valid URL");
      return;
    }

    CrudService.update("LandingPageData", lpId, {
      cta2Link: ctaLink
    }).then(() => {
      setLandingPageData((d) => ({
        ...d,
        cta2Link: ctaLink
      }));
      setInitialCtaLink(ctaLink);
      message.success("Apply button URL updated successfully");
      setApplyLinkModalVisible(false);
    }).catch(err => {
      message.error("Failed to update Apply button URL: " + (err.message || "Unknown error"));
    });
  };

  const handleApplyClick = () => {
    if (isEdit) {
      setCtaLink(landingPageData?.cta2Link || '');
      setApplyLinkModalVisible(true);
    } else {
      // Ensure URL has protocol, add https:// if missing
      let url = landingPageData?.cta2Link || '';
      if (url && !url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    }
  };

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
    console.log('Navigating to:', id);
    console.log(`isEdit: ${isEdit}, isEditPage: ${isEditPage}`);
    
    let targetDocument;
    let targetWindow;
    
    if (isEdit || isEditPage) {
      // In edit mode, we need to find the iframe and access its document
      const iframes = document.querySelectorAll('iframe');
      console.log('Found iframes:', iframes.length);
      
      if (iframes.length > 0) {
        // Get the last iframe (most likely the preview iframe)
        const iframe = iframes[iframes.length - 1];
        targetDocument = iframe.contentDocument || iframe.contentWindow.document;
        targetWindow = iframe.contentWindow;
        console.log('Using iframe document');
      } else {
        targetDocument = window.document;
        targetWindow = window;
        console.log('No iframe found, using window document');
      }
    } else {
      // In public view, use the current window
      targetDocument = window.document;
      targetWindow = window;
      console.log('Using current window document');
    }

    const element = targetDocument.getElementById(id);
    console.log('Found element:', element);

    if (element) {
      const navbarHeight = 128;
      const elementRect = element.getBoundingClientRect();
      const currentScrollTop = targetWindow.pageYOffset || targetWindow.scrollY || 0;
      const offsetPosition = elementRect.top + currentScrollTop - navbarHeight;
      
      console.log('Element rect top:', elementRect.top);
      console.log('Current scroll top:', currentScrollTop);
      console.log('Calculated offset position:', offsetPosition);
      
      targetWindow.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash if possible
      try {
        if (targetWindow.history && targetWindow.history.pushState) {
          targetWindow.history.pushState(null, null, `#${id}`);
        } else {
          targetWindow.location.hash = `#${id}`;
        }
      } catch (e) {
        // Silently fail if we can't update the URL (cross-origin iframe restrictions)
        console.log('Could not update URL hash:', e);
      }
    } else {
      console.log(`Element with id "${id}" not found`);
      // List all elements with IDs for debugging
      const allElementsWithIds = Array.from(targetDocument.querySelectorAll('[id]')).map(el => el.id);
      console.log('Available IDs:', allElementsWithIds);
    }
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
        top:fullscreen?44: 0,
        left: 0,
        right: 0,
        width: "100%",
        fontFamily: bodyFont?.family,
      }}
      className="px-4 z-50"
    >
      <ApplyCustomFont landingPageData={landingPageData} />
      <header className={`flex items-center px-4 w-full sm:h-16 py-2 sm:py-0 sm:px-6 lg:px-8`}>
        <div className="w-full mx-auto flex items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="mr-10 w-auto h-8" />
          </div>
          <div className="flex gap-3 justify-end w-full flex-wrap">
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              className="px-6  text-xs md:text-base whitespace-nowrap  rounded-md border transition hover:opacity-50 smx:px-3 smx:py-0.5 smx:text-xs flex items-center gap-2"
              onClick={handleShareClick}
            >
              Share {shareIcon}
            </button>


            <button
              className="px-6  text-xs md:text-base whitespace-nowrap  font-medium rounded-md transition hover:bg-yellow-300 smx:px-5 smx:py-0.5 "
              style={{
                backgroundColor: getColor("primary", 500),
                color: textColor,
                
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>
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
      {/* Apply Link Modal */}
      <AntModal
        title="Set Apply Button URL"
        open={applyLinkModalVisible}
        onCancel={() => setApplyLinkModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <div className="py-4">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Before publishing your landing page, please set the URL where candidates will be directed when they click the Apply button.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apply Button URL *
            </label>
            <Input
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="https://example.com/apply"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              This should be your application form or job posting URL
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <AntButton
              onClick={() => setApplyLinkModalVisible(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </AntButton>
            <AntButton
              onClick={handleSaveCtaLink}
              disabled={!ctaLink.trim()}
              className={`px-4 py-2 rounded-md ${
                ctaLink.trim()
                  ? 'bg-[#5207CD] text-white hover:bg-[#0C7CE6]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save URL
            </AntButton>
          </div>
        </div>
      </AntModal>

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
            className={`flex items-center scrollbar-hide ${isEditPage ? 'overflow-x-auto' : ''}`}
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

const NavBar = ({ landingPageData, onClickApply, showBackToEditButton, fullscreen, setFullscreen, lpId, isEdit, setLandingPageData }) => {
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
        lpId={lpId}
        isEdit={isEdit}
        setLandingPageData={setLandingPageData}
      />
    );
  return (
    <Template1 
      landingPageData={landingPageData} 
      onClickApply={onClickApply} 
      showBackToEditButton={showBackToEditButton}
      fullscreen={fullscreen}
      setFullscreen={setFullscreen}
      lpId={lpId}
      isEdit={isEdit}
      setLandingPageData={setLandingPageData}
    />
  );
};

export default NavBar;
