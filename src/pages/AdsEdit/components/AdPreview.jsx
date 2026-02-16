import React from "react";
import StoryOverlay from "./StoryFrame";
import FeedContext from "./FeedContext";
import MobileDeviceFrame from "./MobileDeviceFrame";
import CreatomatPreview from "./CreatomatPreview";

/**
 * Check if URL is a video
 */
function isVideoUrl(url) {
  if (!url) return false;
  return /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(url);
}

/**
 * AdPreview - Renders ad creative preview using Creatomate
 * 
 * ALL previews now use CreatomatPreview component which renders
 * the Creatomate template (Clarity). No more Template1.jsx.
 * 
 * The actual exported image/video comes from Creatomate API.
 * 
 * Custom uploads are also supported - if a custom creative exists
 * for the current format, it will be shown instead of Creatomate.
 */
export default function AdPreview({ variant, format, platform, brandData, landingPageData, adType, templateName = "clarity", refEl }) {
  if (!variant) return null;

  const { width, height, aspectRatio } = format;

  // Calculate scale to fit within container while maintaining aspect ratio
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const calculateScale = () => {
      const container = document.querySelector('.ad-preview-container');
      if (!container) return 0.2;

      const containerHeight = container.clientHeight - 64;
      const targetHeight = 812;
      let calculatedScale = containerHeight / targetHeight;

      return Math.min(Math.max(calculatedScale, 0.3), 1);
    };

    const timer = setTimeout(() => {
      const newScale = calculateScale();
      setScale(newScale);
    }, 100);

    const handleResize = () => {
      const newScale = calculateScale();
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get ad type label
  const AD_TYPE_LABELS = {
    'job': 'Job Ad',
    'employer-brand': 'Employer Brand Ad',
    'testimonial': 'Testimonial Ad',
    'company': 'About Company Ad',
    'retargeting': 'Retargeting Ad',
  };

  const adTypeLabel = adType?.label || AD_TYPE_LABELS[adType?.id] || 'Ad';
  const formatLabel = format.label;

  // Calculate phone frame height based on ad's aspect ratio for story format
  const isStoryFormat = format?.id === 'story' || format?.aspectRatio === '9:16';
  const frameWidth = 375;
  const frameHeight = isStoryFormat 
    ? Math.round(frameWidth * (height / width))
    : 812;

  // Render preview using Creatomate
  const renderPreview = () => {
    // Check if there's a custom creative override for this format
    const customCreativeUrl = variant?.customCreatives?.[format?.id];
    // Check if variant is in "custom upload mode" (has any custom creatives)
    const hasAnyCustomCreatives = Object.values(variant?.customCreatives || {}).some(Boolean);

    let content;

    // If custom creative exists for this format, show it (supports both image and video)
    if (customCreativeUrl) {
      const isVideo = isVideoUrl(customCreativeUrl);
      content = (
        <div className="w-full h-full relative bg-gray-100">
          {isVideo ? (
            <video
              src={customCreativeUrl}
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
          <img
            src={customCreativeUrl}
            alt="Custom creative"
              className="w-full h-full object-contain"
          />
          )}
        </div>
      );
    } else if (hasAnyCustomCreatives) {
      // Variant is in custom upload mode but this format doesn't have a custom upload
      // Show a greyed out placeholder indicating this format will be skipped
      content = (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-6 opacity-60">
            <div className="mb-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              No Custom Upload
            </div>
            <div className="text-xs text-gray-400">
              {formatLabel}
            </div>
            <div className="text-[10px] text-amber-500 mt-2 bg-amber-50 px-2 py-1 rounded-full inline-block">
              Will be skipped
            </div>
          </div>
        </div>
      );
    } else if (!variant?.image && !variant?.videoUrl && !landingPageData?.heroImage) {
      // No background media - show placeholder
      content = (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-6">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-700 mb-2">
              {adTypeLabel}
            </div>
            <div className="text-base font-medium text-gray-600 mb-4">
              {formatLabel}
            </div>
            <div className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full inline-block">
              Add image or video
            </div>
          </div>
        </div>
      );
    } else {
      // Use Creatomate Preview for ALL templates
      content = (
        <CreatomatPreview
          format={format?.id === 'portrait' ? 'portrait' : format?.id || 'square'}
          variant={variant}
          brandData={brandData}
          landingPageData={landingPageData}
          templateName={templateName}
          className="w-full h-full"
        />
      );
    }

    if (isStoryFormat) {
      const contentScale = 375 / width;

      return (
        <StoryOverlay brandData={brandData}>
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `scale(${contentScale})`,
                transformOrigin: "center center",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div ref={refEl} style={{ width: `${width}px`, height: `${height}px` }}>
                {content}
              </div>
            </div>
          </div>
        </StoryOverlay>
      );
    } else {
      return (
        <FeedContext
          key={`feed-${format?.id}-${variant?.id || variant?.title}`}
          brandData={brandData}
          text={variant?.description || ""}
          title={variant?.metaHeadline || ""}
          description={variant?.metaDescription || ""}
          ctaText={variant?.metaCTA || "Apply Now"}
        >
          <div
            className="relative w-full"
            style={{
              aspectRatio: format.aspectRatio === '1:1' ? '1/1' : '4/5',
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `scale(${375 / width})`,
              }}
            >
              <div ref={refEl} style={{ width: `${width}px`, height: `${height}px` }}>
                {content}
              </div>
            </div>
          </div>
        </FeedContext>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[600px] w-full h-full bg-gray-50 overflow-hidden">
      <div className="ad-preview-container flex items-center justify-center p-8 w-full h-full overflow-hidden">
        <div
          className="relative origin-center transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <MobileDeviceFrame isStory={isStoryFormat} height={frameHeight}>
            {renderPreview()}
          </MobileDeviceFrame>
        </div>
      </div>
    </div>
  );
}
