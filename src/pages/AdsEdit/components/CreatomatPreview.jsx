import React, { useEffect, useRef, useState } from "react";

/**
 * Creatomate Preview Component
 * 
 * Uses the Creatomate Preview SDK to show a live preview of the ad template.
 * This is the SAME preview that will be rendered when exported.
 * 
 * Requires: npm install @creatomate/preview
 * And: NEXT_PUBLIC_CREATOMATE_PLAYER_TOKEN env variable
 */

// "Clarity" Template IDs - MUST match TEMPLATES in videoRecordController.js
const CREATOMATE_TEMPLATES = {
  clarity: {
    story: "fd4d3d28-6a72-4f21-b350-939f99472840",
    portrait: "a8e33385-7b60-435d-b9d0-1e9b4c2de3d7",
    square: "af16c58d-96d5-4295-a183-b610b224887e",
  },
};

// Default font family
const DEFAULT_FONT_FAMILY = "Noto Sans";

// Player token for Creatomate Preview SDK
const CREATOMATE_PLAYER_TOKEN = process.env.NEXT_PUBLIC_CREATOMATE_PLAYER_TOKEN || "";

/**
 * Get font family from landing page or brand data
 */
function getFontFamily(landingPageData, brandData) {
  if (landingPageData?.selectedFont?.family) {
    return landingPageData.selectedFont.family;
  }
  if (landingPageData?.titleFont?.family) {
    return landingPageData.titleFont.family;
  }
  if (brandData?.selectedFont?.family) {
    return brandData.selectedFont.family;
  }
  return DEFAULT_FONT_FAMILY;
}

/**
 * Check if URL is a video
 */
function isVideoUrl(url) {
  if (!url) return false;
  return /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(url);
}

/**
 * Calculate logo width percentages based on aspect ratio
 * Must match the logic in videoRecordController.js
 */
function calculateLogoWidths(aspectRatio) {
  const targetLogoHeight = 6;
  const horizontalPadding = 4;
  
  if (!aspectRatio || aspectRatio <= 0) {
    aspectRatio = 2; // Default to moderately wide
  }
  
  let logoWidth = targetLogoHeight * aspectRatio;
  const minWidth = 8;
  const maxWidth = 40;
  logoWidth = Math.max(minWidth, Math.min(maxWidth, logoWidth));
  
  const bgWidth = logoWidth + horizontalPadding;
  
  return {
    logoWidth: `${logoWidth.toFixed(2)}%`,
    logoBackgroundWidth: `${bgWidth.toFixed(2)}%`,
  };
}

/**
 * Get image dimensions from URL (client-side)
 */
function getImageAspectRatio(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      resolve(img.width / img.height);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

export default function CreatomatPreview({
  format = "square",
  variant,
  brandData,
  landingPageData,
  templateName = "clarity",
  className = "",
}) {
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const isVideoRef = useRef(false); // Ref to avoid stale closures
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [logoWidths, setLogoWidths] = useState(calculateLogoWidths(2)); // Default for wide logo
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract data
  // Check for video ONLY from variant.videoUrl - NOT from fallback sources
  const videoUrl = variant?.videoUrl || "";
  const heroImage = variant?.image || landingPageData?.heroImage || "";
  const backgroundSource = videoUrl || heroImage;
  
  // IMPORTANT: isVideo should only be true if the variant's videoUrl is set and is a video
  // NOT if the fallback heroImage happens to be a video
  const isVideo = !!videoUrl && isVideoUrl(videoUrl);
  
  // Keep ref in sync to avoid stale closures
  isVideoRef.current = isVideo;
  
  
  const title = variant?.title || landingPageData?.vacancyTitle || "";
  const linkDescription = variant?.linkDescription || "";
  const ctaText = variant?.callToAction || "Apply Now";
  
  // Brand colors
  const primaryColor = landingPageData?.primaryColor || brandData?.primaryColor || "#2a29fc";
  const secondaryColor = landingPageData?.secondaryColor || brandData?.secondaryColor || primaryColor || "#00990d";
  
  // Logo
  const logo = landingPageData?.companyLogo || 
               landingPageData?.logo || 
               brandData?.companyLogo || 
               brandData?.logo || "";
  
  // Font family
  const fontFamily = getFontFamily(landingPageData, brandData);

  // Image adjustment settings
  const heroImageAdjustment =
    variant?.imageAdjustment?.heroImage ||
    landingPageData?.imageAdjustment?.jobDescriptionImage ||
    landingPageData?.imageAdjustment?.heroImage || {};
  const bgX = heroImageAdjustment?.objectPosition?.x ?? 50;
  const bgY = heroImageAdjustment?.objectPosition?.y ?? 50;
  const bgFit = heroImageAdjustment?.objectFit || "cover";

  // Load Creatomate Preview SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.Creatomate) {
      setSdkLoaded(true);
      return;
    }

    // Dynamically import the SDK
    const loadSDK = async () => {
      try {
        const module = await import("@creatomate/preview");
        if (module && module.Preview) {
          window.Creatomate = module;
          setSdkLoaded(true);
          console.log("✅ Creatomate Preview SDK loaded");
        } else {
          throw new Error("Preview not found in module");
        }
      } catch (err) {
        console.error("❌ Failed to load Creatomate Preview SDK:", err.message);
        setError("Install @creatomate/preview: npm install @creatomate/preview");
        setIsLoading(false);
      }
    };

    loadSDK();
  }, []);

  // Calculate logo dimensions when logo URL changes
  useEffect(() => {
    if (!logo) {
      setLogoWidths(calculateLogoWidths(2)); // Default
      return;
    }
    
    getImageAspectRatio(logo).then((ar) => {
      if (ar) {
        setLogoWidths(calculateLogoWidths(ar));
      }
    });
  }, [logo]);

  // Initialize preview when SDK is loaded
  useEffect(() => {
    if (!sdkLoaded || !containerRef.current) return;

    if (!CREATOMATE_PLAYER_TOKEN) {
      setError("Missing NEXT_PUBLIC_CREATOMATE_PLAYER_TOKEN");
      setIsLoading(false);
      return;
    }

    const templateSet = CREATOMATE_TEMPLATES[templateName] || CREATOMATE_TEMPLATES.clarity;
    const templateId = templateSet[format] || templateSet.square;

    // Build modifications for Clarity template
    const modifications = {
      "Background.source": backgroundSource || "",
      "Background.x_alignment": `${bgX}%`,
      "Background.y_alignment": `${bgY}%`,
      "Background.fit": bgFit,
      "Logo.source": logo,
      "Logo.width": logoWidths.logoWidth,
      "LogoBackground.width": logoWidths.logoBackgroundWidth,
      "Headline.text": title,
      "Headline.font_family": fontFamily,
      "Headline.fill_color": primaryColor,
      "Subheadline.text": linkDescription,
      "Subheadline.font_family": fontFamily,
      "Subheadline.fill_color": primaryColor,
      "CTA.text": ctaText,
      "CTA.font_family": fontFamily,
      "CTA.background_color": secondaryColor,
    };

    try {
      // Cleanup previous instance
      if (previewRef.current) {
        previewRef.current.dispose?.();
        previewRef.current = null;
      }

      // Create Creatomate Preview instance
      const preview = new window.Creatomate.Preview(
        containerRef.current,
        "player",
        CREATOMATE_PLAYER_TOKEN
      );

      previewRef.current = preview;

      preview.onReady = async () => {
        try {
          await preview.loadTemplate(templateId);
          await preview.setModifications(modifications);
          
          
          setIsLoading(false);
          setIsPlaying(false);
          
          // For images, seek to end and PAUSE to show static final state
          // The template has animations, but for static images we want to show the final frame frozen
          if (!isVideoRef.current) {
            setTimeout(async () => {
              console.log("[CreatomatPreview] IMAGE - seeking to end and pausing");
              try {
                // Disable looping
                if (preview.setLoop) await preview.setLoop(false);
                // Seek to end of animation
                await preview.setTime(2.99);
                // PAUSE to freeze on final frame
                if (preview.pause) await preview.pause();
                console.log("[CreatomatPreview] ✓ Image preview paused at final frame");
              } catch (e) {
                console.log("[CreatomatPreview] pause failed:", e?.message || e);
              }
            }, 300);
          }
        } catch (err) {
          console.error("Creatomate template error:", err);
          setError("Failed to load template");
          setIsLoading(false);
        }
      };

      preview.onError = (err) => {
        console.error("Creatomate error:", err);
        setError(err.message || "Preview error");
        setIsLoading(false);
      };

      // Track playback state
      preview.onStateChange = (state) => {
        // For images: forcibly pause if somehow started playing
        if (!isVideoRef.current && state === "playing") {
          console.log("[CreatomatPreview] IMAGE started playing - forcing pause");
          preview.pause?.().catch(() => {});
          preview.setTime?.(2.99).catch(() => {});
          return;
        }
        
        if (state === "playing") {
          setIsPlaying(true);
        } else if (state === "paused" || state === "ended") {
          setIsPlaying(false);
          // Loop video when ended (only for actual videos)
          if (state === "ended" && isVideoRef.current) {
            preview.setTime(0);
          }
        }
      };
    } catch (err) {
      console.error("Creatomate init error:", err);
      setError(err.message);
      setIsLoading(false);
    }

    return () => {
      if (previewRef.current) {
        previewRef.current.dispose?.();
        previewRef.current = null;
      }
    };
  }, [sdkLoaded, format, templateName, logoWidths]);

  // Handle click to play/pause video (only for video backgrounds)
  const handleClick = () => {
    if (!previewRef.current || isLoading || error || !isVideo) return;
    
    if (isPlaying) {
      previewRef.current.pause?.().catch(() => {});
      setIsPlaying(false);
    } else {
      previewRef.current.play?.().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Update modifications when data changes
  useEffect(() => {
    if (!previewRef.current || isLoading || error) return;

    const modifications = {
      "Background.source": backgroundSource || "",
      "Background.x_alignment": `${bgX}%`,
      "Background.y_alignment": `${bgY}%`,
      "Background.fit": bgFit,
      "Logo.source": logo,
      "Logo.width": logoWidths.logoWidth,
      "LogoBackground.width": logoWidths.logoBackgroundWidth,
      "Headline.text": title,
      "Headline.font_family": fontFamily,
      "Headline.fill_color": primaryColor,
      "Subheadline.text": linkDescription,
      "Subheadline.font_family": fontFamily,
      "Subheadline.fill_color": primaryColor,
      "CTA.text": ctaText,
      "CTA.font_family": fontFamily,
      "CTA.background_color": secondaryColor,
    };

    previewRef.current.setModifications(modifications)
      .then(async () => {
        // After modifications are applied, handle positioning
        if (!isVideoRef.current) {
          // Image: seek to end of animation and PAUSE (static preview)
          try {
            await previewRef.current.setTime?.(2.99);
            await previewRef.current.pause?.();
          } catch (e) {
            console.warn("[CreatomatPreview] setTime/pause after mods failed:", e);
          }
        }
      })
      .catch((err) => {
        console.warn("Error updating modifications:", err);
      });
  }, [backgroundSource, title, linkDescription, ctaText, logo, logoWidths, primaryColor, secondaryColor, fontFamily, bgX, bgY, bgFit, isLoading, error, isVideo]);

  // Error state - show instructions
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-white ${className}`}>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-sm font-medium mb-2">Creatomate Preview SDK Required</p>
          <p className="text-xs text-gray-400 font-mono bg-gray-800 p-2 rounded">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-full ${isVideo ? 'cursor-pointer' : ''} ${className}`}
      onClick={isVideo ? handleClick : undefined}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading Creatomate preview...</p>
          </div>
        </div>
      )}


      {/* 
        FOR IMAGES: Block ALL interaction with the Creatomate SDK 
        The SDK has built-in play controls that we need to disable for static images
      */}
      {!isVideo && !isLoading && (
        <div className="absolute inset-0 z-20" style={{ pointerEvents: 'auto' }} />
      )}

      {/* Creatomate Preview SDK container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ 
          minHeight: "200px",
          // For images, block SDK interactions
          pointerEvents: isVideo ? 'auto' : 'none'
        }}
      />
    </div>
  );
}

/**
 * Always use Creatomate preview
 */
export function shouldUseCreatomatPreview() {
  return true;
}

/**
 * Check if variant has video background
 */
export function hasVideoBackground(variant) {
  const videoUrl = variant?.videoUrl || "";
  return !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
}
