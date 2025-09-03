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
import { getTranslation } from "../../utils/translations";
import AiService from "../../services/AiService";
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
                  onClick={() => { onClickApply && onClickApply(); }} // Open form editor when "Apply now" is clicked
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


const Template1 = ({ landingPageData, onClickApply, showBackToEditButton, fullscreen, setFullscreen, lpId, isEdit, setLandingPageData, isMovilePreview=false }) => {
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
    },
    // Pass landingPageData colors as customColors to ensure updates
    {
      primaryColor,
      secondaryColor,
      tertiaryColor,
    }
  );

  // Background color for the hero section (dark teal)
  const bgColor = "#1a3e4c";
  const navBgColor = "#1a4a5c";
  const logo = landingPageData?.companyLogo || "/images3/Button.png";
  const [isFixed, setIsFixed] = useState(false);
  const [isTemplate3NavFixed, setIsTemplate3NavFixed] = useState(false);
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.slice(1) || "video"
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  // const [isScrolled, setIsScrolled] = useState(false);
  const[shareIcon, setShareIcon] = useState(<Share2 size={20}/>);
  const [modalVisible, setModalVisible] = useState(false);
  const [link, setLink] = useState('');
  const [applyLinkModalVisible, setApplyLinkModalVisible] = useState(false);
  const [useAIFormCreation, setUseAIFormCreation] = useState(false);
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  const [areTabsOverflowing, setAreTabsOverflowing] = useState(false);


  const handleApplyClick = () => {
    if (isEdit) {
      // In edit mode, check if form exists, if not show simplified creation modal
      if (!landingPageData?.form?.fields || landingPageData.form.fields.length === 0) {
        setUseAIFormCreation(false); // Reset AI preference
        setApplyLinkModalVisible(true);
      } else {
        // Form exists, open form editor directly
        handleOpenFormEditor();
      }
    } else {
      // Public view - always redirect to custom form
      const formUrl = `/lp/${lpId}/apply`;
      router.push(formUrl);
    }
  };

  const handleOpenFormEditor = () => {
    const formEditorUrl = `/form-editor/${lpId}`;
    router.push(formEditorUrl);
  };

  const handleGenerateAIForm = async () => {
    if (!landingPageData) {
      message.error('Landing page data not available');
      return;
    }

    setIsGeneratingForm(true);
    
    try {
      // Build comprehensive job description for better AI generation
      let fullJobDescription = landingPageData.heroDescription || '';
      
      // Add job specifications if available
      if (landingPageData.specifications && landingPageData.specifications.length > 0) {
        fullJobDescription += '\n\nJob Specifications:\n';
        landingPageData.specifications.forEach(spec => {
          if (spec.enabled && spec.bulletPoints && spec.bulletPoints.length > 0) {
            fullJobDescription += `\n${spec.title}:\n`;
            spec.bulletPoints.forEach(point => {
              fullJobDescription += `- ${point.bullet}\n`;
            });
          }
        });
      }

      // Map language names to codes for AI service
      const getLanguageCode = (langName) => {
        const languageMap = {
          'Dutch': 'nl',
          'English': 'en',
          'German': 'de',
          'French': 'fr',
          'Spanish': 'es',
          'Italian': 'it',
          'Portuguese': 'pt',
          'Russian': 'ru',
          'Chinese': 'zh',
          'Japanese': 'ja',
          'Korean': 'ko',
          'Arabic': 'ar',
          'Hindi': 'hi'
        };
        return languageMap[langName] || 'en';
      };

      console.log("🤖 Generating AI form with data:", {
        jobTitle: landingPageData.vacancyTitle,
        jobDescription: fullJobDescription,
        location: landingPageData.location,
        companyInfo: landingPageData.companyInfo || landingPageData.aboutTheCompanyDescription,
        language: getLanguageCode(landingPageData.lang)
      });

      const formResponse = await AiService.generateApplicationForm({
        inputType: 'text',
        inputData: {
          jobTitle: landingPageData.vacancyTitle || 'Position',
          jobDescription: fullJobDescription,
          location: landingPageData.location || [],
          companyInfo: landingPageData.companyInfo || landingPageData.aboutTheCompanyDescription || ''
        },
        language: getLanguageCode(landingPageData.lang),
        formComplexity: 'standard'
      });

      if (formResponse.data.success) {
        const generatedForm = formResponse.data.data.form;
        console.log("🤖 AI Form Generated Successfully:", generatedForm);

        // Ensure contact information is first and properly localized
        const ensureContactFirst = (form) => {
          if (!form.fields || form.fields.length === 0) return form;
          
          // Find contact field
          const contactFieldIndex = form.fields.findIndex(field => field.type === 'contact');
          
          if (contactFieldIndex === -1) {
            // No contact field exists, create one with proper language
            const contactField = {
              id: `contact_${Date.now()}`,
              type: 'contact',
              label: getTranslation(landingPageData?.lang, 'contactInformation') || 'Contact Information',
              placeholder: '',
              required: true,
              visible: true,
              isLeadCapture: true,
              firstName: { 
                visible: true, 
                required: true,
                label: getTranslation(landingPageData?.lang, 'firstName') || 'First Name',
                placeholder: getTranslation(landingPageData?.lang, 'firstNamePlaceholder') || 'Enter your first name'
              },
              lastName: { 
                visible: true, 
                required: true,
                label: getTranslation(landingPageData?.lang, 'lastName') || 'Last Name',
                placeholder: getTranslation(landingPageData?.lang, 'lastNamePlaceholder') || 'Enter your last name'
              },
              email: { 
                visible: true, 
                required: true,
                label: getTranslation(landingPageData?.lang, 'email') || 'Email',
                placeholder: getTranslation(landingPageData?.lang, 'emailPlaceholder') || 'Enter your email address'
              },
              phone: { 
                visible: true, 
                required: false,
                label: getTranslation(landingPageData?.lang, 'phone') || 'Phone',
                placeholder: getTranslation(landingPageData?.lang, 'phonePlaceholder') || 'Enter your phone number'
              }
            };
            return {
              ...form,
              fields: [contactField, ...form.fields]
            };
          } else if (contactFieldIndex !== 0) {
            // Contact field exists but not first, move it to first position
            const contactField = form.fields[contactFieldIndex];
            const otherFields = form.fields.filter((_, index) => index !== contactFieldIndex);
            
            // Update labels to match page language
            const updatedContactField = {
              ...contactField,
              label: getTranslation(landingPageData?.lang, 'contactInformation') || contactField.label,
              firstName: {
                ...contactField.firstName,
                label: getTranslation(landingPageData?.lang, 'firstName') || contactField.firstName?.label || 'First Name',
                placeholder: getTranslation(landingPageData?.lang, 'firstNamePlaceholder') || contactField.firstName?.placeholder || 'Enter your first name'
              },
              lastName: {
                ...contactField.lastName,
                label: getTranslation(landingPageData?.lang, 'lastName') || contactField.lastName?.label || 'Last Name',
                placeholder: getTranslation(landingPageData?.lang, 'lastNamePlaceholder') || contactField.lastName?.placeholder || 'Enter your last name'
              },
              email: {
                ...contactField.email,
                label: getTranslation(landingPageData?.lang, 'email') || contactField.email?.label || 'Email',
                placeholder: getTranslation(landingPageData?.lang, 'emailPlaceholder') || contactField.email?.placeholder || 'Enter your email address'
              },
              phone: {
                ...contactField.phone,
                label: getTranslation(landingPageData?.lang, 'phone') || contactField.phone?.label || 'Phone',
                placeholder: getTranslation(landingPageData?.lang, 'phonePlaceholder') || contactField.phone?.placeholder || 'Enter your phone number'
              }
            };
            
            return {
              ...form,
              fields: [updatedContactField, ...otherFields]
            };
          }
          
          return form;
        };

        const optimizedForm = ensureContactFirst(generatedForm);

        // Update the landing page with the optimized form
        const updateData = {
          form: optimizedForm,
          applyType: 'form',
          cta2Link: '#apply'
        };

        await CrudService.update("LandingPageData", lpId, updateData);
        
        // Update local state
        setLandingPageData(prev => ({
          ...prev,
          form: optimizedForm,
          applyType: 'form',
          cta2Link: '#apply'
        }));

        message.success("🤖 AI form generated successfully! Contact information has been prioritized first.");
        
        // Close modal and reset state after successful generation
        setApplyLinkModalVisible(false);
        setUseAIFormCreation(false);
        
        // Open form editor to show the generated form
        handleOpenFormEditor();
      } else {
        throw new Error(formResponse.data.error || "Failed to generate form");
      }
    } catch (error) {
      console.error("Error generating AI form:", error);
      message.error("Failed to generate form: " + (error.message || "Unknown error"));
    } finally {
      setIsGeneratingForm(false);
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
      message.success(getTranslation(landingPageData?.lang, 'linkCopiedToClipboard'));
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
  const visibleMenuItemsArray = landingPageData?.menuItems?.filter(item => item.visible !== false).map((item) => item.key);

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

  // Listen for hash changes - support both parent window and iframe
  useEffect(() => {
    const handleHashChange = (targetWindow = window) => {
      const hash = targetWindow.location.hash.slice(1);
      setCurrentHash(hash || "video"); // Start with first menu item instead of job-specifications
    };

    // Set initial hash
    handleHashChange();

    // Add event listener for hash changes in parent window
    window.addEventListener("hashchange", () => handleHashChange(window));

    // Also listen for hash changes in iframe if in edit mode
    if (isEdit || isEditPage) {
      const checkIframeHash = () => {
        const iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0) {
          const iframe = iframes[iframes.length - 1];
          const iframeWindow = iframe.contentWindow;
          if (iframeWindow) {
            try {
              handleHashChange(iframeWindow);
              iframeWindow.addEventListener("hashchange", () => handleHashChange(iframeWindow));
            } catch (e) {
              // Handle cross-origin restrictions silently
            }
          }
        }
      };
      
      // Check after a short delay to ensure iframe is loaded
      const timeoutId = setTimeout(checkIframeHash, 500);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("hashchange", () => handleHashChange(window));
      };
    }

    return () => {
      window.removeEventListener("hashchange", () => handleHashChange(window));
    };
  }, [isEdit, isEditPage]);


  

  const handleNavigate = (id) => {
    console.log('id to navigate:', id);
    console.log('Navigating to:', id);
    console.log(`isEdit: ${isEdit}, isEditPage: ${isEditPage}`);
    
    // Immediately update current hash for instant UI feedback
    setCurrentHash(id);
    
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

    // Try multiple selector strategies to find the element
    let element = targetDocument.getElementById(id);
    
    if (!element) {
      // Try finding by data attribute or other common patterns
      element = targetDocument.querySelector(`[data-section="${id}"]`) ||
                targetDocument.querySelector(`[data-id="${id}"]`) ||
                targetDocument.querySelector(`.section-${id}`) ||
                targetDocument.querySelector(`div[id*="${id}"]`);
    }
    
    console.log('Found element:', element);

    if (element) {
      const navbarHeight = 128;
      const elementRect = element.getBoundingClientRect();
      const currentScrollTop = targetWindow.pageYOffset || targetWindow.scrollY || 0;
      const offsetPosition = Math.max(0, elementRect.top + currentScrollTop - navbarHeight);
      
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
      
      // Also check for data attributes
      const elementsWithDataId = Array.from(targetDocument.querySelectorAll('[data-section], [data-id]')).map(el => 
        el.getAttribute('data-section') || el.getAttribute('data-id')
      );
      console.log('Available data-section/data-id:', elementsWithDataId);
    }
  };


  const scrollRef = useRef(null);

  // Measure whether tabs overflow to decide alignment/controls
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const update = () => {
      const overflowing = container.scrollWidth > container.clientWidth;
      setAreTabsOverflowing(overflowing);
      setScrollPosition(container.scrollLeft || 0);
    };

    // Initial measure (after render)
    const raf = requestAnimationFrame(update);

    window.addEventListener('resize', update);
    container.addEventListener('scroll', update, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
      container.removeEventListener('scroll', update);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [landingPageData?.menuItems]);

  const scrollTabs = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollAmount = containerWidth * 0.8; // Scroll 80% of visible width
    
    if (!areTabsOverflowing) return;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    // Update scroll position for gradient overlays
    setTimeout(() => {
      setScrollPosition(container.scrollLeft);
    }, 100);
  };

  // Auto-scroll active item into view
  const scrollActiveItemIntoView = () => {
    const container = scrollRef.current;
    if (!container) return;

    const activeButton = container.querySelector(`button[data-tab-id="${currentHash}"]`);
    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    
    // Check if button is visible
    const isVisible = buttonRect.left >= containerRect.left && 
                     buttonRect.right <= containerRect.right;
    
    if (!isVisible) {
      // Calculate scroll position to center the active item
      const buttonCenter = activeButton.offsetLeft + (activeButton.offsetWidth / 2);
      const containerCenter = container.clientWidth / 2;
      const scrollPosition = buttonCenter - containerCenter;
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll when currentHash changes
  useEffect(() => {
    scrollActiveItemIntoView();
  }, [currentHash]);

  // Scroll spy to detect which section is in view
  useEffect(() => {
    let targetWindow = window;
    let targetDocument = window.document;

    // Get the correct window and document (iframe for edit mode)
    if (isEdit || isEditPage) {
      const iframes = document.querySelectorAll('iframe');
      if (iframes.length > 0) {
        const iframe = iframes[iframes.length - 1];
        targetWindow = iframe.contentWindow;
        targetDocument = iframe.contentDocument || iframe.contentWindow.document;
      }
    }

    const handleScroll = () => {
      if (!landingPageData?.menuItems) return;

      const navbarHeight = 128;
      const currentScrollTop = targetWindow.pageYOffset || targetWindow.scrollY || 0;
      
      // Find the section that's currently most visible
      let currentSection = null;
      let minDistance = Infinity;

      landingPageData.menuItems
        .filter(item => item.active && item.visible && item.id)
        .forEach(item => {
          const element = targetDocument.getElementById(item.id) ||
                         targetDocument.querySelector(`[data-section="${item.id}"]`) ||
                         targetDocument.querySelector(`[data-id="${item.id}"]`);
          
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + currentScrollTop;
            const distance = Math.abs(elementTop - currentScrollTop - navbarHeight);
            
            if (distance < minDistance && rect.top <= navbarHeight + 100) {
              minDistance = distance;
              currentSection = item.id;
            }
          }
        });

      if (currentSection && currentSection !== currentHash) {
        setCurrentHash(currentSection);
      }
    };

    if (targetWindow) {
      targetWindow.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      setTimeout(handleScroll, 100);
    }

    return () => {
      if (targetWindow) {
        targetWindow.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isEdit, isEditPage, landingPageData?.menuItems, currentHash]);

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
        top:isMovilePreview?0: fullscreen?44: 0,
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
          <div className="flex items-center gap-5">
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
              {getTranslation(landingPageData?.lang, 'share')} {shareIcon}
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
              {getTranslation(landingPageData?.lang, 'applyNow')}
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
                  {getTranslation(landingPageData?.lang, 'pagePublished')}<CheckCircleFilled style={{ color: 'green', fontSize: 24,marginLeft: '8px' }} />
                </div>
                <div style={{ color: '#888', marginBottom: '24px' }}>
                  {getTranslation(landingPageData?.lang, 'letsShareWithTheWorld')}
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
                    {getTranslation(landingPageData?.lang, 'copyLink')} <LinkOutlined />
                  </AntButton>
                </div>

                <div style={{ color: '#666', marginBottom: '10px' }}>
                  {getTranslation(landingPageData?.lang, 'shareWithYourLovedOnes')}
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
      {/* Apply Form Creation Modal */}
      <AntModal
        title="Create your application form"
        open={applyLinkModalVisible}
        onCancel={() => {
          setApplyLinkModalVisible(false);
          setUseAIFormCreation(false); // Reset AI preference
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <div className="py-4">
          <div className="mb-6">
            <p className="text-gray-600 mb-6 text-center">
              How would you like to create your application form? Contact information will be collected first.
            </p>
          </div>
          
          {/* AI vs Manual Form Creation */}
          <div className="space-y-4 mb-8">
            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                useAIFormCreation 
                  ? 'border-[#5207CD] bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setUseAIFormCreation(true)}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  name="formCreationType"
                  value="ai"
                  checked={useAIFormCreation}
                  defaultChecked={true}
                  onChange={() => setUseAIFormCreation(true)}
                  className="mr-4 mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900 mb-2">🤖 Generate with AI</div>
                  <div className="text-gray-600">
                    Let AI create a customized application form based on your job requirements. Contact information will be collected first, followed by relevant job-specific questions.
                  </div>
                </div>
              </div>
            </div>
         
          </div>
          
          <div className="flex justify-end items-center gap-3">
            <AntButton
              onClick={() => {
                setApplyLinkModalVisible(false);
                setUseAIFormCreation(false);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </AntButton>
           
            <AntButton
              onClick={async () => {
                if (useAIFormCreation) {
                  // For AI generation, keep modal open and start generation
                  await handleGenerateAIForm();
                } else {
                  // For manual creation, ensure contact-first configuration and open form editor
                  const updateData = {
                    applyType: 'form',
                    cta2Link: '#apply'
                  };
                  
                  try {
                    await CrudService.update("LandingPageData", lpId, updateData);
                    setLandingPageData((d) => ({
                      ...d,
                      ...updateData
                    }));
                    message.success("Form configuration saved");
                    setApplyLinkModalVisible(false);
                    setUseAIFormCreation(false);
                    handleOpenFormEditor();
                  } catch (err) {
                    message.error("Failed to save configuration: " + (err.message || "Unknown error"));
                  }
                }
              }}
              loading={isGeneratingForm}
              disabled={isGeneratingForm}
              className="px-6 py-2 bg-[#5207CD] text-white rounded-md hover:bg-[#0C7CE6]"
            >
              {isGeneratingForm 
                ? '🤖 Generating...' 
                : useAIFormCreation 
                  ? '🤖 Generate with AI' 
                  : 'Create Form'
              }
            </AntButton>
          </div>
        </div>
      </AntModal>

{/* Sections navigation */}
      <div
        className="h-16 w-full transition-all duration-100 z-[88888] border-t border-gray-200"
        style={{
          backgroundColor: "white",
          zIndex: 100,
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div
          className="relative flex items-center max-w-7xl mx-auto h-full px-12"
          style={{
            position: "relative"
          }}
        >
        {/* Left gradient overlay - shows when scrolled right */}
        <div 
          className="absolute left-2 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to right, white 60%, transparent)",
            zIndex: 10,
            opacity: areTabsOverflowing && scrollPosition > 0 ? 1 : 0,
          }}
        />
        
        {/* Right gradient overlay - shows when can scroll more to the right */}
        <div 
          className="absolute right-2 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to left, white 60%, transparent)",
            zIndex: 10,
            opacity: areTabsOverflowing && scrollRef.current && scrollPosition < (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) ? 1 : 0,
          }}
        />

        <button
          onClick={() => scrollTabs("left")}
          className="absolute left-2 z-20 p-1 rounded-full bg-white shadow-md hover:bg-gray-200 flex-shrink-0"
          style={{ zIndex: 20, display: areTabsOverflowing ? 'block' : 'none' }}
        >
          <ChevronLeft size={20} style={{ color: getColor("primary", 500) }} />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center overflow-x-auto scrollbar-hide flex-1"
          style={{ 
            scrollBehavior: "smooth",
            minWidth: 0,  // Allow flex item to shrink below its content size
            WebkitOverflowScrolling: "touch",  // Smooth scrolling on iOS
            justifyContent: areTabsOverflowing ? "flex-start" : "center"  // Center when few, left when overflow
          }}
        >
        {   


    landingPageData?.menuItems
                  ?.filter((tab) => !!tab?.active && !!tab?.visible && !!tab?.id)
                  ?.map((tab) => {
                    return {
                      ...tab,
                      id: tab.id||tab.key,
                    }
                  })
                  ?.sort((a, b) => (a.sort || 0) - (b.sort || 0))
                  ?.map((tab, index) => (
                    <button
                      key={index}
                      data-tab-id={tab.id}
                      onClick={() => handleNavigate(tab.id)}
                      className="px-3 py-2 md:px-6 md:py-4 text-sm md:text-base whitespace-nowrap transition-all flex-shrink-0 min-w-max"
                      style={{
                        color: textColor === "#000000" ? textColor : getColor("primary", 500),
                        fontWeight: currentHash === tab.id ? "700" : "400",
                        fontFamily: bodyFont?.family,
                        marginRight: "8px"
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
          className="absolute right-2 z-20 p-1 rounded-full bg-white shadow-md hover:bg-gray-100 flex-shrink-0"
          style={{ zIndex: 20, display: areTabsOverflowing ? 'block' : 'none' }}
        >
          <ChevronRight size={20} style={{ color: getColor("primary", 500) }} />
        </button>
        </div>
      </div>
    </div>
  );
};

const NavBar = ({ landingPageData, onClickApply, showBackToEditButton, fullscreen, setFullscreen, lpId, isEdit, setLandingPageData, isMovilePreview=false }) => {
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
        isMovilePreview={isMovilePreview}
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
