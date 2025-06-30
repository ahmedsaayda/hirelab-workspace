import React, { useEffect } from 'react'
import { getFonts } from './getFonts';

function ApplyCustomFont({
    landingPageData
}) {
    // Helper function to check if a font is from Google Fonts
    const isGoogleFont = (font) => {
      return font && font.family && (!font.src || font.src.includes('googleapis.com'));
    };

    // Helper function to load Google Fonts
    const loadGoogleFont = (fontFamily) => {
      const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Only add if not already added
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      }
      
      return fontFamily;
    };
    
    // Helper function to load and apply custom fonts
    const applyCustomFont = (fontData) => {
      if (!fontData || !fontData.family) return '';
      
      // If it's a Google Font, load it via the Google Fonts API
      if (isGoogleFont(fontData)) {
        return loadGoogleFont(fontData.family);
      }
      
      // For custom fonts with a src, use @font-face
      if (fontData.src) {
        // Create a unique font-face name using the family as an identifier
        const fontFaceId = `font-face-${fontData.family}`;
        
        // Check if this font-face is already added to avoid duplicates
        if (!document.getElementById(fontFaceId)) {
          const style = document.createElement('style');
          style.id = fontFaceId;
          style.textContent = `
            @font-face {
              font-family: "${fontData.family}";
              src: url("${fontData.src}") format("truetype");
              font-weight: normal;
              font-style: normal;
            }
          `;
          document.head.appendChild(style);
        }
      }
      
      return fontData.family;
    };

  useEffect(() => {
    if (landingPageData) {
      const { titleFont, subheaderFont, bodyFont } = getFonts(landingPageData);
      
      // Load fonts (both Google and custom)
      if (titleFont) applyCustomFont(titleFont);
      if (subheaderFont) applyCustomFont(subheaderFont);
      if (bodyFont) applyCustomFont(bodyFont);
      
      // Apply the body font to the HTML element if available
      if (bodyFont?.family) {
        const htmlContent = document.querySelector('html');
        if (htmlContent) {
          htmlContent.style.fontFamily = `"${bodyFont.family}", sans-serif`;
        }
      }
    }
  }, [landingPageData]);
  
  return null
}

export default ApplyCustomFont
