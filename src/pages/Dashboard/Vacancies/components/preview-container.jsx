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
  }, [contentRef,baseColors, variants, gradients,styles]);

  return (
    <iframe
      {...props}
      ref={setContentRef}
      style={{
        margin: "auto",
        scrollbarWidth: "none",
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

  // Device sizes based on fullscreen mode
  let setdevicebasedonfullscreen;

  if (fullscreen) {
    setdevicebasedonfullscreen = {
      desktop: { width: 1440, height: 848 }, // ALWAYS 1440px for desktop
      mobile: { width: 475, height: 800 },
    };
  } else {
    setdevicebasedonfullscreen = {
      desktop: { width: 1440, height: 980 }, // ALWAYS 1440px for desktop
      mobile: { width: 475, height: 750 },
    };
  }
  
  const deviceSizes = setdevicebasedonfullscreen;
  const router = useRouter();;
  const { baseColors, variants, gradients } = useSelector(
    (state) => state.theme
  );
  const [device, setDevice] = useState("desktop");
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
  }, [fonts]);

  const calculateScale = () => {
    if (!containerRef.current) return 1;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    if (device === "desktop") {
      // Desktop: ALWAYS calculate based on 1440px width
      const widthScale = containerWidth / 1440;
      const heightScale = containerHeight / deviceSizes[device].height;
      return Math.min(widthScale, heightScale, 1);
    } else {
      // Mobile: use device width
      const { width, height } = deviceSizes[device];
      const widthScale = containerWidth / width;
      const heightScale = containerHeight / height;
      return Math.min(widthScale, heightScale, 1);
    }
  };

  useEffect(() => {
    const updateScale = () => setScale(calculateScale());
    const updateHeight = () =>
      setContainerHeight(
        containerRef?.current?.clientHeight || deviceSizes[device].height
      );
    updateScale();
    updateHeight();
    window.addEventListener("resize", () => {
      updateScale();
      updateHeight();
    });
    return () =>
      window.removeEventListener("resize", () => {
        updateScale();
        updateHeight();
      });
  }, [device]);

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
    <div className="flex flex-col h-full relative">
      {/* Floating Back to Edit Button for Mobile */}
      {showBackToEditButton && fullscreen && device === "mobile" && (
        <button
          onClick={() => {
            setFullscreen && setFullscreen(false);
          }}
          className="fixed top-8 right-4 z-[9999] px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex gap-2 items-center justify-center shadow-lg transition-all duration-200"
          style={{ zIndex: 10000 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to edit
        </button>
      )}
      
      <div className="flex relative gap-2 justify-center items-center pt-2 px-2">
        <Heading
          size="4xl"
          as="h3"
          className="!text-black-900_01 absolute left-0 px-2"
        >
          Preview
        </Heading>
        <div className="flex p-1 rounded-lg ">
          <button
            onClick={() => setDevice("mobile")}
            className={`h-[24px]  px-2 rounded-md flex items-center justify-center font-medium transition ${
              device === "mobile"
                ? "bg-[#0E87FE] text-[#EFF8FF]"
                : "text-[#0E87FE]"
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`h-[24px] px-2 rounded-md flex items-center justify-center font-medium transition ${
              device === "desktop"
                ? "bg-[#0E87FE] text-[#EFF8FF]"
                : "text-[#0E87FE]"
            }`}
          >
            Desktop
          </button>
        </div>
        {setFullscreen && (
          <div className="absolute right-0">
            <button
              className="flex items-center justify-center h-[28px] w-[28px] rounded hover:bg-gray-100"
              onClick={() => {
                // router.push(`/lp/${landingPageData?._id}`);
                setFullscreen((prev) => !prev)}}
            >
              {fullscreen ? (
                <img
                  src="/images/expand-06.svg"
                  alt="collapse"
                  className="h-[20px] w-[20px]"
                />
              ) : (
                <img
                  src="/images/expand-06.svg"
                  alt="expand"
                  className="h-[20px] w-[20px]"
                />
              )}
            </button>
          </div>
        )}
      </div>
      <div ref={containerRef} className="flex flex-1" style={{overflow: "hidden"}}>
        <div
          style={{
            width: device === "desktop" ? "1440px" : `${deviceSizes[device].width}px`,
            height: "100%",
            transform: `scale(${scale})`,
            transformOrigin: "left top",
            scrollbarWidth: "none",
          }}
          className="flex-1 mb-auto"
        >
          <IFrame
            styles={styles + fontStyles}
            baseColors={baseColors}
            variants={variants}
            gradients={gradients}
            width={device === "desktop" ? 1440 : deviceSizes[device].width}
            height={deviceSizes[device].height}
            className="border-0 scrollbar-hide"
          >
            {pageComponent}
          </IFrame>
        </div>
      </div>
    </div>
  );
}
