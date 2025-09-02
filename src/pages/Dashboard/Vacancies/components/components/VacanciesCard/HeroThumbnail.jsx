import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import HeroSection from "../../../../../Landingpage/HeroSection.js";
import NavBar from "../../../../../Landingpage/NavBar.jsx";
import { getFonts } from "../../../../../Landingpage/getFonts.js";

// Simplified iframe for thumbnail rendering
const ThumbnailIFrame = ({ children, styles = "", landingPageData, ...props }) => {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const iframeHead = contentRef?.contentWindow?.document?.head;

  useEffect(() => {
    if (iframeHead && styles) {
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

      if (iframeRoot) {
        // Set basic CSS variables for the hero section
        iframeRoot.style.setProperty('--primary-color', landingPageData?.primaryColor || '#2e9eac');
        iframeRoot.style.setProperty('--secondary-color', landingPageData?.secondaryColor || '#e1ce11');
        iframeRoot.style.setProperty('--tertiary-color', landingPageData?.tertiaryColor || '#44b566');
        
        // Prevent any interactions in the thumbnail
        iframeRoot.style.pointerEvents = 'none';
        iframeRoot.style.userSelect = 'none';
        
        // Set body styles
        if (iframeDocument.body) {
          iframeDocument.body.style.margin = '0';
          iframeDocument.body.style.padding = '0';
          iframeDocument.body.style.overflow = 'hidden';
          iframeDocument.body.style.pointerEvents = 'none';
        }
      }

      // Disable all link interactions and form submissions
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      iframeDocument?.addEventListener("click", handleClick, true);
      iframeDocument?.addEventListener("submit", handleClick, true);
      
      return () => {
        iframeDocument?.removeEventListener("click", handleClick, true);
        iframeDocument?.removeEventListener("submit", handleClick, true);
      };
    }
  }, [contentRef, landingPageData]);

  return (
    <iframe
      {...props}
      ref={setContentRef}
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        userSelect: 'none',
        ...props.style
      }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

export default function HeroThumbnail({ landingPageData }) {
  const [styles, setStyles] = useState("");
  const [scale, setScale] = useState(0.22);
  const containerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  // No cropping by default; keep 0 to avoid cutting content
  const CROP_TOP = 0;

  // Calculate optimal scale based on container size
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Calculate scale to fit the container while maintaining aspect ratio
        const scaleX = containerWidth / 1440; // Desktop width
        // Base hero height
        const scaleY = containerHeight / 800;
        
        // Fill the container width (cover), allowing vertical crop via overflow hidden
        const calculatedScale = Math.max(0.08, scaleX);
        setScale(calculatedScale);
      }
    };

    const debouncedUpdateScale = () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(updateScale, 100);
    };

    updateScale();
    
    // Add resize observer for more responsive updates
    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdateScale();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Also listen to window resize as fallback
    window.addEventListener('resize', debouncedUpdateScale);
    
    // Use a small delay to ensure container is rendered
    const timeoutId = setTimeout(updateScale, 100);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedUpdateScale);
      clearTimeout(timeoutId);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Generate styles for the iframe
  useEffect(() => {
    // Get basic styles from the current document
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

    // Get fonts
    const fonts = getFonts(landingPageData);
    let fontCss = "";

    // Handle Google Fonts
    const googleFontFamilies = [];
    
    if (fonts.titleFont?.family && (!fonts.titleFont?.src || fonts.titleFont.src.includes('googleapis.com'))) {
      googleFontFamilies.push(fonts.titleFont.family);
    }
    
    if (fonts.subheaderFont?.family && 
        (!fonts.subheaderFont?.src || fonts.subheaderFont.src.includes('googleapis.com')) && 
        !googleFontFamilies.includes(fonts.subheaderFont.family)) {
      googleFontFamilies.push(fonts.subheaderFont.family);
    }
    
    if (fonts.bodyFont?.family && 
        (!fonts.bodyFont?.src || fonts.bodyFont.src.includes('googleapis.com')) && 
        !googleFontFamilies.includes(fonts.bodyFont.family)) {
      googleFontFamilies.push(fonts.bodyFont.family);
    }

    // Add Google Fonts import
    if (googleFontFamilies.length > 0) {
      const formattedFamilies = googleFontFamilies
        .map(family => family.replace(/ /g, '+'))
        .join('&family=');
      fontCss += `@import url('https://fonts.googleapis.com/css2?family=${formattedFamilies}:wght@400;700&display=swap');`;
    }

    // Add custom fonts with @font-face
    if (fonts.titleFont?.family && fonts.titleFont?.src && !fonts.titleFont.src.includes('googleapis.com')) {
      fontCss += `
        @font-face {
          font-family: "${fonts.titleFont.family}";
          src: url("${fonts.titleFont.src}") format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      `;
    }

    if (fonts.subheaderFont?.family && fonts.subheaderFont?.src && !fonts.subheaderFont.src.includes('googleapis.com')) {
      fontCss += `
        @font-face {
          font-family: "${fonts.subheaderFont.family}";
          src: url("${fonts.subheaderFont.src}") format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      `;
    }

    if (fonts.bodyFont?.family && fonts.bodyFont?.src && !fonts.bodyFont.src.includes('googleapis.com')) {
      fontCss += `
        @font-face {
          font-family: "${fonts.bodyFont.family}";
          src: url("${fonts.bodyFont.src}") format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      `;
    }

    // Additional thumbnail-specific styles
    const thumbnailStyles = `
      /* Thumbnail specific styles */
      * {
        pointer-events: none !important;
        user-select: none !important;
      }
      
      body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        transform-origin: top left !important;
      }
      
      /* Hide any interactive elements */
      button, input, textarea, select, a {
        pointer-events: none !important;
        cursor: default !important;
      }
      
      /* Ensure the hero section fills the viewport */
      .hero-section {
        min-height: 100vh !important;
        width: 100% !important;
      }
      
      /* Hide any scrollbars */
      ::-webkit-scrollbar {
        display: none !important;
      }
      
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
    `;

    setStyles(stylesArray.join("\n") + fontCss + thumbnailStyles);
  }, [landingPageData]);

  // If no landingPageData, show placeholder
  if (!landingPageData) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400 text-xs">No preview available</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-white"
    >
      <div
        style={{
          width: '1440px', // Desktop width
          height: '800px', // Match hero height
          transform: `scale(${scale})`, // Dynamic scale based on container size
          transformOrigin: 'top center',
          pointerEvents: 'none',
          position: 'absolute',
          top: -CROP_TOP,
          left: '50%',
          marginLeft: '-720px', // Half of 1440px to center it
        }}
      >
        <ThumbnailIFrame
          landingPageData={landingPageData}
          styles={styles}
          width={1440}
          height={800}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Removed NavBar from thumbnail to avoid top white bar */}
            <HeroSection 
              landingPageData={landingPageData} 
              fetchData={() => {}} 
            />
          </div>
        </ThumbnailIFrame>
      </div>
    </div>
  );
} 