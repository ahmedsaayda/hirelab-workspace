import React, { useEffect, useRef, useState } from "react";

/**
 * Creatomate Preview SDK wrapper for video ad previews
 * Used when a creative has a video background instead of an image
 * 
 * @see https://github.com/Creatomate/creatomate-preview
 */

// Template IDs from backend - should match TEMPLATES in videoRecordController.js
const CREATOMATE_TEMPLATES = {
  story: process.env.NEXT_PUBLIC_CREATOMATE_TEMPLATE_STORY || "fc4da16f-0589-4b63-add5-748cebc5352c",
  square: process.env.NEXT_PUBLIC_CREATOMATE_TEMPLATE_SQUARE || "cab95b2c-5ebe-484e-b28e-d9c862e9c56e",
  portrait: process.env.NEXT_PUBLIC_CREATOMATE_TEMPLATE_PORTRAIT || "6eb4dec1-21b3-4d2e-b282-b40055a73f1a",
};

// Video player token for preview SDK (read-only, different from API key)
const CREATOMATE_PLAYER_TOKEN = process.env.NEXT_PUBLIC_CREATOMATE_PLAYER_TOKEN || "";

export default function CreatomatPreview({
  format = "square", // "story" | "square" | "portrait"
  variant,
  brandData,
  landingPageData,
  className = "",
}) {
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Extract video and other data from variant
  const videoUrl = variant?.videoUrl || "";
  const heroImage = variant?.image || landingPageData?.heroImage || "";
  const title = variant?.title || landingPageData?.vacancyTitle || "";
  const linkDescription = variant?.linkDescription || "";
  const primaryColor = landingPageData?.primaryColor || brandData?.primaryColor || "#5207CD";
  const logo = landingPageData?.logo || brandData?.companyLogo || "";

  // Get image adjustment settings
  const heroImageAdjustment =
    variant?.imageAdjustment?.heroImage ||
    landingPageData?.imageAdjustment?.jobDescriptionImage ||
    landingPageData?.imageAdjustment?.heroImage ||
    {};
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

    // Dynamically import the SDK - Next.js will bundle this correctly
    const loadSDK = async () => {
      try {
        // Use standard dynamic import - webpack/Next.js will handle this
        const module = await import('@creatomate/preview');
        if (module && module.Preview) {
          window.Creatomate = module;
          setSdkLoaded(true);
          console.log("✅ Creatomate Preview SDK loaded successfully");
        } else {
          throw new Error('Module loaded but Preview not found');
        }
      } catch (err) {
        console.warn("Creatomate Preview SDK not available:", err.message);
        // Don't show error - just fallback to image preview
        setSdkLoaded(false);
        setIsLoading(false);
      }
    };

    loadSDK();
  }, []);

  // Initialize preview when SDK is loaded
  useEffect(() => {
    if (!sdkLoaded || !containerRef.current || !CREATOMATE_PLAYER_TOKEN) {
      if (!CREATOMATE_PLAYER_TOKEN) {
        setError("Missing Creatomate player token");
        setIsLoading(false);
      }
      return;
    }

    const templateId = CREATOMATE_TEMPLATES[format] || CREATOMATE_TEMPLATES.square;

    try {
      // Clean up previous instance
      if (previewRef.current) {
        previewRef.current.dispose?.();
        previewRef.current = null;
      }

      // Create new preview instance
      const preview = new window.Creatomate.Preview(
        containerRef.current,
        "player",
        CREATOMATE_PLAYER_TOKEN
      );

      previewRef.current = preview;

      // Set up event handlers
      preview.onReady = async () => {
        try {
          // Load the template
          await preview.loadTemplate(templateId);

          // Apply modifications based on variant data
          const modifications = {
            "Background.source": videoUrl || heroImage || "",
            "Logo.source": logo,
            "Headline.text": title,
            "Subheadline.text": linkDescription,
            "Background.x_alignment": `${bgX}%`,
            "Background.y_alignment": `${bgY}%`,
            "Background.fit": bgFit,
          };

          // Apply primary color gradient if template supports it
          if (primaryColor) {
            // Calculate gradient end color (darker version)
            const gradientEnd = darkenColor(primaryColor, 20);
            modifications["PrimaryColorShape.fill_color"] = [
              { offset: "0%", color: primaryColor },
              { offset: "100%", color: gradientEnd },
            ];
          }

          await preview.setModifications(modifications);
          setIsLoading(false);
          
          // Autoplay the video since click events are blocked
          try {
            await preview.play();
          } catch (playErr) {
            console.warn("Autoplay failed (browser may require user interaction):", playErr);
          }
        } catch (err) {
          console.error("Error loading Creatomate template:", err);
          setError("Failed to load template");
          setIsLoading(false);
        }
      };

      preview.onError = (err) => {
        console.error("Creatomate preview error:", err);
        setError(err.message || "Preview error");
        setIsLoading(false);
      };

      // Loop video when it ends
      preview.onStateChange = (state) => {
        if (state === "ended") {
          preview.setTime(0);
          preview.play().catch(() => {});
        }
      };
    } catch (err) {
      console.error("Error initializing Creatomate preview:", err);
      setError(err.message || "Failed to initialize preview");
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (previewRef.current) {
        previewRef.current.dispose?.();
        previewRef.current = null;
      }
    };
  }, [sdkLoaded, format, videoUrl, heroImage, title, linkDescription, logo, primaryColor, bgX, bgY, bgFit]);

  // Update modifications when data changes
  useEffect(() => {
    if (!previewRef.current || isLoading || error) return;

    const updateModifications = async () => {
      try {
        await previewRef.current.setModifications({
          "Background.source": videoUrl || heroImage || "",
          "Headline.text": title,
          "Subheadline.text": linkDescription,
          "Background.x_alignment": `${bgX}%`,
          "Background.y_alignment": `${bgY}%`,
        });
      } catch (err) {
        console.warn("Error updating Creatomate modifications:", err);
      }
    };

    updateModifications();
  }, [videoUrl, heroImage, title, linkDescription, bgX, bgY, isLoading, error]);

  // Helper to darken a hex color
  const darkenColor = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  };

  // Render fallback if SDK not available or no video
  if (error || !CREATOMATE_PLAYER_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">
            {error || "Video preview unavailable"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Video will render correctly when published
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5207CD] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading video preview...</p>
          </div>
        </div>
      )}

      {/* Creatomate preview container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "200px" }}
      />
    </div>
  );
}

/**
 * Check if a variant should use Creatomate preview (has video)
 */
export function shouldUseCreatomatPreview(variant) {
  const videoUrl = variant?.videoUrl || "";
  return !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
}

