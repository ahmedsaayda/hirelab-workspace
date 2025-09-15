"use client";

import React, { useState, useRef, useEffect } from "react";

import { createPortal } from "react-dom";
import { Heading } from "./components";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getFonts } from "../../../Landingpage/getFonts";


export const IFrame = ({
  children,
  styles = "",
  baseColors,
  variants,
  gradients,
  fullscreen,
  device,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const iframeHead = contentRef?.contentWindow?.document?.head;

  const router = useRouter();;
  
  useEffect(() => {
    if (iframeHead) {
      const styleElement =
        iframeHead.querySelector("style") || document.createElement("style");
      styleElement.textContent = styles;
      iframeHead.appendChild(styleElement);
    }
  }, [iframeHead, styles]);

 useEffect(() => {
    if (contentRef) {
      const iframeDocument = contentRef.contentWindow?.document;
      const iframeRoot = iframeDocument?.documentElement;

      // Set CSS variables based on the theme
      if (iframeRoot) {
        // Loop through baseColors and set CSS properties
        Object.keys(baseColors).forEach((key) => {
          iframeRoot.style.setProperty(`--${key}-color`, baseColors[key]);
        });
        // Loop through variants and set light and dark colors for primary, secondary, and tertiary
        Object.keys(variants).forEach((variant) => {
          Object.keys(variants[variant]).forEach((lightDark) => {
            variants[variant][lightDark].forEach((color, index) => {
              iframeRoot.style.setProperty(
                `--${variant}-${lightDark}-${index + 1}`,
                color
              );
            });
          });
        });

        // Set gradients
        Object.keys(gradients).forEach((gradient) => {
          iframeRoot.style.setProperty(
            `--${gradient}-gradient`,
            gradients[gradient]
          );
        });

        // Add scroll adjustment for navbar height
        const navbarHeight = 128; // Navbar height
        iframeRoot.style.setProperty('--navbar-height', `${navbarHeight}px`);
        iframeRoot.style.setProperty('scroll-padding-top', `${navbarHeight}px`);
        
        // Minimal fix for CSS rendering issues in scaled iframe
        iframeRoot.style.setProperty('image-rendering', 'crisp-edges');
        iframeRoot.style.setProperty('text-rendering', 'optimizeLegibility');
      }
        const handleLinkClick = (e) => {
        const target = e.target ;
        const link = target.closest('a');

        if (link) {
          const href = link.getAttribute("href");
          if (href && href.includes("#")) {
            e.preventDefault();
            e.stopPropagation();

            // Navigate to the selected section based on the hash
            router.push(`#${href.split("#")[1]}`, { replace: true });
          }
        }
      };
      iframeDocument?.addEventListener("click", handleLinkClick, true);
      return () => {
        iframeDocument?.removeEventListener("click", handleLinkClick, true);
      };
    }
  }, [contentRef,baseColors, variants, gradients]);

  // Simple one-time styled-jsx injection after iframe content loads
  useEffect(() => {
    if (mountNode && iframeHead) {
      const timer = setTimeout(() => {
        // Extract any styled-jsx styles from the main document
        const styledJsxStyles = Array.from(document.querySelectorAll('style[data-styled-jsx]'))
          .map(style => style.textContent)
          .join('\n');
        
        if (styledJsxStyles) {
          const existingStyled = iframeHead.querySelector('style[data-styled-jsx-injected]');
          if (!existingStyled) {
            const styledElement = document.createElement('style');
            styledElement.setAttribute('data-styled-jsx-injected', 'true');
            styledElement.textContent = styledJsxStyles;
            iframeHead.appendChild(styledElement);
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mountNode, iframeHead]);

  return (
    <iframe
      {...props}
      ref={setContentRef}
      style={{
        margin: "auto",
        scrollbarWidth: "none",
        // paddingTop: "0px",
        paddingTop: fullscreen ? (device === "mobile" ? 40 : 0) : 0,
        
      }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};




export function PreviewContainer({
  pageComponent,
  fullscreen,
  setFullscreen,
  landingPageData,
  onFullscreen,
  showBackToEditButton,
}) {

  // State to track window dimensions
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 980,
  });

  // Device state management
  const [device, setDevice] = useState("desktop");

  // Listen for device changes from navbar
  useEffect(() => {
    const handleDeviceChange = (event) => {
      if (event.detail?.device) {
        setDevice(event.detail.device);
      }
    };
    
    window.addEventListener('deviceChange', handleDeviceChange);
    return () => window.removeEventListener('deviceChange', handleDeviceChange);
  }, []);

  // Expose setDevice to window for navbar access
  useEffect(() => {
    window.__setPreviewDevice = (newDevice) => {
      setDevice(newDevice);
      // Dispatch event for any other components that need to know about device changes
      window.dispatchEvent(
        new CustomEvent('deviceChange', { detail: { device: newDevice } })
      );
    };
    return () => {
      delete window.__setPreviewDevice;
    };
  }, []);

  // Update window.__previewDevice when device changes
  useEffect(() => {
    window.__previewDevice = device;
  }, [device]);

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Device sizes based on fullscreen mode and current window size
  const deviceSizes = React.useMemo(() => {
    if (fullscreen) {
      return {
        desktop: { 
          width: windowDimensions.width, 
          height: windowDimensions.height - 40 // Minimal UI space
        },
        mobile: { width: 475, height: windowDimensions.height - 40 },
      };
    } else {
      return {
        desktop: { 
          width: 1440, // Keep standard desktop width for consistent scaling
          height: windowDimensions.height - 80 // Reduced from 120 for more space
        },
        mobile: { width: 475, height: windowDimensions.height - 80 },
      };
    }
  }, [fullscreen, windowDimensions]);

  const router = useRouter();
  const { baseColors, variants, gradients } = useSelector(
    (state) => state.theme
  );
  const [containerHeight, setContainerHeight] = useState(
    deviceSizes[device].height
  );
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [styles, setStyles] = useState("");
  const [fontStyles, setFontStyles] = useState("");

  // Memoize base styles since they don't change
  const baseStyles = React.useMemo(() => {
    const styleSheets = Array.from(document.styleSheets);
    const stylesArray = styleSheets.map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        return "";
      }
    });
    
    return stylesArray.join("\n") + `
      
      html {
        scroll-behavior: smooth;
        scroll-padding-top: var(--navbar-height, 128px);
      }
      body {
        padding-top: var(--navbar-height, 128px);
      }
      
      /* Comprehensive fix for JSX styled components in iframe */
      

      
    
      
      /* JobDescription specific corner gradients - exact match from component */
      .top-left::after {
        background-image: radial-gradient(circle at 0 0, transparent 20px, white 20px);
      }
      
      .top-right::after {
        background-image: radial-gradient(circle at 100% 0, transparent 30px, white 30px);
      }
      
      .bottom-left::after {
        background-image: radial-gradient(circle at 0 100%, transparent 30px, white 30px);
      }
      
      .bottom-right::after {
        background-image: radial-gradient(circle at 100% 100%, transparent 20px, white 20px);
      }

      /* JobDescription specific arc styles - exact match from styled-jsx */
      .description-top-right::after {
        background-image: radial-gradient(circle at 100% 0, transparent 30px, white 20px);
      }

      .description-bottom-left::after {
        background-image: radial-gradient(circle at 0 100%, transparent 30px, white 20px);
      }

      .description-bottom-right::after {
        background-image: radial-gradient(circle at 100% 100%, transparent 30px, white 20px);
      }
      
      /* TextBox, EVPMission, LeaderIntroduction arc effects */
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
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
      
      /* Leader/EVP/TextBox specific arc gradients - exact match from components */
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

      /* LeaderIntroduction specific corner styles - exact match from styled-jsx */
      .corner {
        width: 30px;
        height: 40px;
        position: relative;
        overflow: hidden;
        border: 0 !important;
        outline: none !important;
        box-shadow: none !important;
      }

      .corner::after {
        content: "";
        position: absolute;
        border: 0 !important;
        outline: none !important;
        box-shadow: none !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .rightBar {
        background-color: white !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        z-index: 10 !important;
      }
      
      /* TextBox clip path effects */
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
      
      /* Fix for white bars and overlays */
      .rightBar {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        backface-visibility: hidden;
      }
      
    
      
    
      
      /* Ensure proper rendering of absolute positioned elements */
      [class*="absolute"][class*="bottom-"] {
        transform: translateZ(1px);
        -webkit-transform: translateZ(1px);
      }
      
      /* Fix for specific corner positioning issues */
      .arc {
        transform: translateZ(2px);
        -webkit-transform: translateZ(2px);
        will-change: transform;
      }
      
      /* Improve rendering quality for scaled content */
      [class*="rounded-"] {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        backface-visibility: hidden;
        border: none;
        outline: none;
      }
      
     

      
      
  
      
  
      
    
      
    
    `;
  }, []);

  useEffect(() => {
    setStyles(baseStyles);
  }, [baseStyles]);

  // Memoize font extraction to prevent unnecessary recalculations
  const fonts = React.useMemo(() => {
    return getFonts(landingPageData);
  }, [landingPageData?.titleFont, landingPageData?.subheaderFont, landingPageData?.bodyFont]);

  // Helper to check if a font is from Google Fonts (no file URL but has a family name)
  const isGoogleFont = React.useCallback((font) => {
    return font && font.family && (!font.src || font.src.includes('googleapis.com'));
  }, []);

  // Generate font styles based on landingPageData
  useEffect(() => {
    const { titleFont, subheaderFont, bodyFont } = fonts;
    if (titleFont || subheaderFont || bodyFont) {
      let fontCss = "";
      
      // Collection of Google font families to load
      const googleFontFamilies = [];
      
      // Check if each font is a Google Font and collect family names
      if (isGoogleFont(titleFont)) {
        googleFontFamilies.push(titleFont.family);
      }
      
      if (isGoogleFont(subheaderFont) && 
          !googleFontFamilies.includes(subheaderFont.family)) {
        googleFontFamilies.push(subheaderFont.family);
      }
      
      if (isGoogleFont(bodyFont) && 
          !googleFontFamilies.includes(bodyFont.family)) {
        googleFontFamilies.push(bodyFont.family);
      }
      
      // Load Google Fonts if we have any
      if (googleFontFamilies.length > 0) {
        // Format the families for the URL
        const formattedFamilies = googleFontFamilies
          .map(family => family.replace(/ /g, '+'))
          .join('&family=');
          
        // Add the Google Fonts import
        fontCss += `
          @import url('https://fonts.googleapis.com/css2?family=${formattedFamilies}:wght@400;700&display=swap');
        `;
      }

      // Add custom fonts using @font-face if they have a src
      if (titleFont?.family && titleFont?.src && !isGoogleFont(titleFont)) {
        fontCss += `
          @font-face {
            font-family: "${titleFont.family}";
            src: url("${titleFont.src}") format("truetype");
            font-weight: normal;
            font-style: normal;
          }
        `;
      }

      if (subheaderFont?.family && subheaderFont?.src && !isGoogleFont(subheaderFont)) {
        fontCss += `
          @font-face {
            font-family: "${subheaderFont.family}";
            src: url("${subheaderFont.src}") format("truetype");
            font-weight: normal;
            font-style: normal;
          }
        `;
      }

      if (bodyFont?.family && bodyFont?.src && !isGoogleFont(bodyFont)) {
        fontCss += `
          @font-face {
            font-family: "${bodyFont.family}";
            src: url("${bodyFont.src}") format("truetype");
            font-weight: normal;
            font-style: normal;
          }
        `;
      }
      
      // If bodyFont is available, apply it as the base font
      if (bodyFont?.family) {
        fontCss += `
          :root {
            --body-font: "${bodyFont.family}", sans-serif;
          }
        `;
      }

      setFontStyles(fontCss);
      
      // Direct injection of Google Fonts into the iframe
      // This is a backup to ensure Google Fonts load properly in the iframe
      if (googleFontFamilies.length > 0) {
        setTimeout(() => {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            if (iframe.contentDocument && iframe.contentDocument.head) {
              // Format the families for the URL
              const formattedFamilies = googleFontFamilies
                .map(family => family.replace(/ /g, '+'))
                .join('&family=');
                
              // Create a link element for Google Fonts
              const linkElement = iframe.contentDocument.createElement('link');
              linkElement.rel = 'stylesheet';
              linkElement.href = `https://fonts.googleapis.com/css2?family=${formattedFamilies}:wght@400;700&display=swap`;
              
              // Add it to the iframe head
              iframe.contentDocument.head.appendChild(linkElement);
            }
          });
        }, 100); // Small delay to ensure iframe is loaded
      }
    }
  }, [fonts,fullscreen,device]);

  // Updated scale calculation to fill available space
  const calculateScale = () => {
    if (!containerRef.current) return 1;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Base dimensions for scaling reference
    const baseWidth = device === "desktop" ? 1440 : 475;
    const baseHeight = device === "desktop" ? 900 : 800; // Use fixed base heights
    
    // Calculate scale to fill the entire parent container
    const widthScale = containerWidth / baseWidth;
    const heightScale = containerHeight / baseHeight;
    
    // Use the smaller scale to maintain aspect ratio, but fill as much as possible
    return Math.min(widthScale, heightScale);
  };

  // option 2 = take all width , weired height

  // const calculateScale = () => {
  //   if (!containerRef.current) return 1;
  //   const containerWidth = containerRef.current.clientWidth;
  //   const containerHeight = containerRef.current.clientHeight;
    
  //   if (device === "desktop") {
  //     // Desktop: Always scale to fit the container width, ignoring height constraints
  //     return containerWidth / 1440;
  //   } else {
  //     // Mobile: use device width and height
  //     const { width, height } = deviceSizes[device];
  //     const widthScale = containerWidth / width;
  //     const heightScale = containerHeight / height;
  //     return Math.min(widthScale, heightScale, 1);
  //   }
  // };

  useEffect(() => {
    const updateScale = () => setScale(calculateScale());
    const updateHeight = () =>
      setContainerHeight(
        containerRef?.current?.clientHeight || deviceSizes[device].height
      );
    
    updateScale();
    updateHeight();
    
    const handleResize = () => {
      updateScale();
      updateHeight();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [device, deviceSizes, fullscreen]);

     useEffect(() => {
    // Handle URL hash change
    const handleHashChange = () => {
      const hash = window.location.hash;
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe && hash) {
        const targetElement = iframe.contentWindow?.document.getElementById(hash.slice(1));
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Create a context or use a different approach to pass device info
  const enhancedPageComponent = React.useMemo(() => {
    // Since we can't easily inject props into the complex component tree,
    // we'll use a global variable approach for the device state
    (window).__previewDevice = device;
    return pageComponent;
  }, [pageComponent, device]);

  return (
    <div className="flex relative flex-col w-full h-full">
      {/* Preview header with device switcher */}
     {fullscreen && <div
    
     className="fixed top-0 left-0 right-0 flex gap-2 justify-center items-center pt-2 px-0 flex-shrink-0 bg-white border-b z-[9999] ">
        <Heading
          size="4xl"
          as="h3"
          className="!text-black-900_01 absolute left-3 px-2"
        >
          Preview
        </Heading>
         
          <div className="flex p-1 rounded-lg">
            <button
              onClick={() => {
                setDevice("mobile");
                window.__previewDevice = "mobile";
                window.dispatchEvent(
                  new CustomEvent('deviceChange', { detail: { device: 'mobile' } })
                );
              }}
              className={`h-[28px] px-3 rounded-md flex items-center justify-center font-medium transition ${
                device === "mobile"
                  ? "bg-[#5207CD] text-[#EFF8FF]"
                  : "text-[#5207CD] hover:bg-gray-100"
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => {
                setDevice("desktop");
                window.__previewDevice = "desktop";
                window.dispatchEvent(
                  new CustomEvent('deviceChange', { detail: { device: 'desktop' } })
                );
              }}
              className={`h-[28px] px-3 rounded-md flex items-center justify-center font-medium transition ${
                device === "desktop"
                  ? "bg-[#5207CD] text-[#EFF8FF]"
                  : "text-[#5207CD] hover:bg-gray-100"
              }`}
            >
              Desktop
            </button>
          </div>

          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-3 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#5207CD] rounded-md hover:bg-[#4506ac] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Go Back
          </button>
     
      </div>}
     {!fullscreen && <div className="flex relative flex-shrink-0 gap-2 justify-center items-center px-6 pt-2 bg-white border-b">
        <Heading
          size="4xl"
          as="h3"
          className="!text-black-900_01 absolute left-3 px-2"
        >
          Preview
        </Heading>
        {!fullscreen && (
          <div className="flex p-1 rounded-lg">
            <button
              onClick={() => {
                setDevice("mobile");
                window.__previewDevice = "mobile";
                window.dispatchEvent(
                  new CustomEvent('deviceChange', { detail: { device: 'mobile' } })
                );
              }}
              className={`h-[28px] px-3 rounded-md flex items-center justify-center font-medium transition ${
                device === "mobile"
                  ? "bg-[#5207CD] text-[#EFF8FF]"
                  : "text-[#5207CD] hover:bg-gray-100"
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => {
                setDevice("desktop");
                window.__previewDevice = "desktop";
                window.dispatchEvent(
                  new CustomEvent('deviceChange', { detail: { device: 'desktop' } })
                );
              }}
              className={`h-[28px] px-3 rounded-md flex items-center justify-center font-medium transition ${
                device === "desktop"
                  ? "bg-[#5207CD] text-[#EFF8FF]"
                  : "text-[#5207CD] hover:bg-gray-100"
              }`}
            >
              Desktop
            </button>
          </div>
        )}
        {!fullscreen && (
          <div className="absolute right-0">
            <button
              className="flex items-center justify-center h-[28px] w-[28px] rounded hover:bg-gray-100"
              onClick={() => setFullscreen((prev) => !prev)}
            >
              {!fullscreen && (
                <img
                  src="/images/expand-06.svg"
                  alt="expand"
                  className="h-[20px] w-[20px]"
                />
              )}
            </button>
          </div>
        )}
      </div>}

    

      {/* Preview content */}
      <div ref={containerRef} className="flex relative flex-col flex-1 justify-start items-center w-full min-h-0" 
        style={{
          overflow: "hidden",
          padding: 0,
          margin: 0,
        }}>

  
        
        <div
          style={{
            width: fullscreen && device === "desktop" ? "100%" : (device === "desktop" ? "1440px" : "475px"),
            height: fullscreen && device === "desktop" ? "100%" : (device === "desktop" ? "900px" : "800px"),
            transform: fullscreen && device === "desktop" ? "none" : `scale(${scale})`,
            transformOrigin: "center top",
            scrollbarWidth: "none",
            margin: 0,
            padding: 0,
          }}
          className="mb-auto"
        >
          {fullscreen && device === "desktop" ? (
            <div 
              style={{ 
                
                width: "100%", 
                height: "100%",
                '--primary-color': baseColors.primary,
                '--secondary-color': baseColors.secondary,
                '--tertiary-color': baseColors.tertiary,
                '--text-color': baseColors.text,
                '--background-color': baseColors.background,
                ...Object.keys(baseColors).reduce((acc, key) => {
                  acc[`--${key}-color`] = baseColors[key];
                  return acc;
                }, {}),
                ...Object.keys(variants).reduce((acc, variant) => {
                  Object.keys(variants[variant]).forEach((lightDark) => {
                    variants[variant][lightDark].forEach((color, index) => {
                      acc[`--${variant}-${lightDark}-${index + 1}`] = color;
                    });
                  });
                  return acc;
                }, {}),
                ...Object.keys(gradients).reduce((acc, gradient) => {
                  acc[`--${gradient}-gradient`] = gradients[gradient];
                  return acc;
                }, {}),
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: styles + fontStyles }} />
              {pageComponent}
            </div>
          ) : (
            <IFrame
              styles={styles + fontStyles}
              baseColors={baseColors}
              variants={variants}
              gradients={gradients}
              width={device === "desktop" ? 1440 : 475}
              height={device === "desktop" ? 900 : 800}
              className="border-0 scrollbar-hide containerrr"
              fullscreen={fullscreen}
              device={device}
            >
              {pageComponent}
            </IFrame>
          )}
        </div>
      </div>
    </div>
  );
}
