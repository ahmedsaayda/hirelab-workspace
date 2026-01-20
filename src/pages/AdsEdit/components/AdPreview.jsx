import React from "react";
import StoryOverlay from "./StoryFrame";
import FeedContext from "./FeedContext";
import MobileDeviceFrame from "./MobileDeviceFrame";
import CreatomatPreview, { shouldUseCreatomatPreview } from "./CreatomatPreview";

export default function AdPreview({ variant, format, platform, brandData, landingPageData, adType, refEl }) {
  if (!variant) return null;

  const { width, height, aspectRatio } = format;

  // Calculate scale to fit within container while maintaining aspect ratio
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const calculateScale = () => {
      const container = document.querySelector('.ad-preview-container');
      if (!container) return 0.2;

      // Target height should be relatively large to show phone frame properly
      const containerHeight = container.clientHeight - 64;
      // Phone frame height is fixed at 812px (logic in MobileDeviceFrame is 812px)
      const targetHeight = 812;

      // Scale based on available height vs phone frame height
      let calculatedScale = containerHeight / targetHeight;

      return Math.min(Math.max(calculatedScale, 0.3), 1);
    };

    // Initial calculation
    const timer = setTimeout(() => {
      const newScale = calculateScale();
      setScale(newScale);
    }, 100); // Small delay to ensure container is rendered

    // Recalculate on window resize
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

  // Handle async component loading for custom templates
  const [TemplateComponent, setTemplateComponent] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Normalize helpers
  const normalizeAdTypeId = (raw) => {
    if (!raw) return null;
    const s = String(raw).toLowerCase();
    // common aliases -> canonical keys used in componentMap
    if (s === 'employerbrand' || s === 'employer_brand') return 'employer-brand';
    if (s === 'testimonials') return 'testimonial';
    if (s === 'aboutcompany' || s === 'about_company' || s === 'about-company') return 'company';
    return s;
  };

  const normalizedAdTypeId = normalizeAdTypeId(
    variant?.adTypeId || adType?.id || adType?.slug || adType
  );

  // Some callers label 4:5 as "portrait"; map to our landscape path bucket
  const normalizedFormatId = (format?.id === 'portrait' ? 'landscape' : format?.id);

  React.useEffect(() => {
    // IMPORTANT: don't reload the template component on every variant edit (e.g. dragging focal point).
    // Only reload when the template identity changes: adType + format + variantNumber.
    if (!normalizedAdTypeId || !normalizedFormatId) {
      setTemplateComponent(null);
      setIsLoading(false);
      return;
    }

    const variantNumber = variant?.variantNumber || 1; // Default to variant 1
    const componentLoader = getComponentLoader(normalizedAdTypeId, variantNumber, normalizedFormatId);
    if (!componentLoader) {
      console.warn(`No component found for: ${normalizedAdTypeId}/${normalizedFormatId}/${variantNumber}`);
      setTemplateComponent(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const component = await componentLoader();
        if (!cancelled) setTemplateComponent(() => component);
      } catch (error) {
        console.error('Error loading template component:', error, {
          adTypeId: normalizedAdTypeId,
          formatId: normalizedFormatId,
          variantNumber,
        });
        if (!cancelled) setTemplateComponent(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [normalizedAdTypeId, normalizedFormatId, variant?.variantNumber]);

  // Get component loader for specific ad type, variant, and format
  // Uses Universal templates for ALL ad types - single source of truth
  const getComponentLoader = (adTypeId, templateNumber, formatId) => {
    // Universal template loaders - used for all ad types
    const universalTemplates = {
      story: {
        1: () => import('./ads/Universal/Story/Template1.jsx').then(m => m.default),
        // Future templates can be added here:
        // 2: () => import('./ads/Universal/Story/Template2.jsx').then(m => m.default),
      },
      square: {
        1: () => import('./ads/Universal/Square/Template1.jsx').then(m => m.default),
      },
      landscape: {
        1: () => import('./ads/Universal/Landscape/Template1.jsx').then(m => m.default),
      },
      portrait: {
        1: () => import('./ads/Universal/Landscape/Template1.jsx').then(m => m.default),
      },
    };

    const templatesForFormat = universalTemplates[formatId];
    if (!templatesForFormat) return null;

    // Direct match for template number
    const direct = templatesForFormat[templateNumber];
    if (direct) return direct;

    // Fallback to template 1 if requested template doesn't exist
    return templatesForFormat[1] || null;
  };

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

  // Check if this variant uses video (should show Creatomate preview)
  const useCreatomatPreview = shouldUseCreatomatPreview(variant);

  // Render based on format
  const renderPreview = () => {
    // Determine if this is a story format
    const isStoryFormat = format?.id === 'story' || format?.aspectRatio === '9:16';

    // Check if there's a custom creative override for this format
    const customCreativeUrl = variant?.customCreatives?.[format?.id];

    let content;

    // If custom creative exists, show it instead of template
    if (customCreativeUrl) {
      content = (
        <div className="w-full h-full relative">
          <img
            src={customCreativeUrl}
            alt="Custom creative"
            className="w-full h-full object-contain bg-gray-100"
          />
        </div>
      );
    } else if (isLoading && !useCreatomatPreview) {
      content = (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading ad...</div>
          </div>
        </div>
      );
    } else if (useCreatomatPreview) {
      // Use Creatomate Preview SDK for video backgrounds
      // This shows the exact preview that will be rendered by Creatomate
      content = (
        <CreatomatPreview
          format={format?.id === 'portrait' ? 'portrait' : format?.id || 'square'}
          variant={variant}
          brandData={brandData}
          landingPageData={landingPageData}
          className="w-full h-full"
        />
      );
    } else if (TemplateComponent && typeof TemplateComponent === 'function') {
      // Use our coded React template for image backgrounds
      content = (
        <TemplateComponent
          variant={variant}
          brandData={brandData}
          landingPageData={landingPageData}
          // We render shared StoryFrame chrome in preview for story formats.
          // Individual templates should hide any built-in chrome when this is false.
          showStoryChrome={!isStoryFormat}
        />
      );
    } else {
      // Show clean placeholder for all unimplemented variants
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
              {width} × {height}px ({aspectRatio})
            </div>
          </div>
        </div>
      );
    }

    // Capture ref should be on the actual content div if we want to capture the ad image
    // However, here we are wrapping it in device frames which we DON'T want to capture as part of the ad image
    // We need to figure out where to put refEl.
    // Ideally, refEl should be on the div wrapping 'content' that is inside the frame but has the correct dimensions
    // But for now, let's wrap the content in the appropriate context

    if (isStoryFormat) {
      // For stories, we want the creative to fit within the phone frame
      // without any clipping. Scale based on the constraining dimension.
      const frameWidth = 375;
      const frameHeight = 812;

      // Calculate scale factors for both dimensions
      const scaleByWidth = frameWidth / width;
      const scaleByHeight = frameHeight / height;

      // Use the smaller scale to ensure content fits completely (contain behavior)
      const contentScale = Math.min(scaleByWidth, scaleByHeight);

      return (
        <StoryOverlay brandData={brandData}>
          <div className="w-full h-full flex items-center justify-center bg-[#000000]">
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
              <div ref={refEl} style={{ width: `${width}px`, height: `${height}px`, pointerEvents: "none" }}>
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
          // Primary Text (above media) - from Meta Ad Copy only
          text={variant?.description || ""}
          // Headline (below media) - from Meta Ad Copy only, no fallback to text overlay
          title={variant?.metaHeadline || ""}
          // Description (below headline) - from Meta Ad Copy only, no fallback to text overlay
          description={variant?.metaDescription || ""}
          // CTA button
          ctaText={variant?.callToAction || "Learn More"}
        >
          {/* 
             We need to ensure the ad content (1080x1080 or 1080x1350) scales to fit 
             inside the FeedContext content area (which is ~375px wide).
             The TemplateComponent renders at full resolution (e.g. 1080px).
             We need to scale it down.
          */}
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
                transform: `scale(${375 / width})`, // Scale to fit phone width
                pointerEvents: "none",
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
          <MobileDeviceFrame isStory={format?.id === 'story' || format?.aspectRatio === '9:16'}>
            {renderPreview()}
          </MobileDeviceFrame>
        </div>
      </div>
    </div>
  );
}
