import React from "react";
import StoryFrame from "./StoryFrame";

export default function AdPreview({ variant, format, platform, brandData, landingPageData, adType }) {
  if (!variant) return null;

  const { width, height, aspectRatio } = format;

  // Calculate scale to fit within container while maintaining aspect ratio
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const calculateScale = () => {
      const container = document.querySelector('.ad-preview-container');
      if (!container) return 0.2;

      const containerWidth = container.clientWidth - 64;
      const containerHeight = container.clientHeight - 64;

      const widthScale = containerWidth / width;
      const heightScale = containerHeight / height;

      let calculatedScale = Math.min(widthScale, heightScale);

      // Apply a slight reduction so the creative has breathing room inside the preview
      if (format?.id === 'story' || format?.aspectRatio === '9:16') {
        calculatedScale *= 0.88;
      } else if (format?.id === 'portrait' || format?.aspectRatio === '4:5') {
        calculatedScale *= 0.9;
      } else {
        calculatedScale *= 0.92;
      }

      return Math.min(Math.max(calculatedScale, 0.3), 0.92);
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
  }, [width, height]);

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
    // Load component if we have the required data (removed template check)
    if (normalizedAdTypeId && normalizedFormatId) {
      setIsLoading(true);
      const loadComponent = async () => {
        try {
          const variantNumber = variant?.variantNumber || 1; // Default to variant 1
          const componentLoader = getComponentLoader(normalizedAdTypeId, variantNumber, normalizedFormatId);
          if (componentLoader) {
            const component = await componentLoader();
            setTemplateComponent(() => component);
          } else {
            console.warn(`No component found for: ${normalizedAdTypeId}/${normalizedFormatId}/${variantNumber}`);
            setTemplateComponent(null);
          }
        } catch (error) {
          console.error('Error loading template component:', error, {
            adTypeId: normalizedAdTypeId,
            formatId: normalizedFormatId,
            variantNumber: variant?.variantNumber
          });
          setTemplateComponent(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadComponent();
    } else {
      console.warn('Missing required data:', { 
        adTypeId: normalizedAdTypeId, 
        formatId: normalizedFormatId,
        variant: variant 
      });
      setTemplateComponent(null);
      setIsLoading(false);
    }
  }, [variant, format, normalizedAdTypeId, normalizedFormatId]);

  // Get component loader for specific ad type, variant, and format
  const getComponentLoader = (adTypeId, variantNumber, formatId) => {
    console.log('Loading component for:', { adTypeId, variantNumber, formatId });
    
    const componentMap = {
      // Job ads
      job: {
        story: {
          1: () => import('./ads/JobAd/Story/Variant1.jsx').then(m => m.default),
          2: () => import('./ads/JobAd/Story/Variant2.jsx').then(m => m.default),
        },
        square: {
          1: () => import('./ads/JobAd/Square/Variant1.jsx').then(m => m.default),
          2: () => import('./ads/JobAd/Square/Variant2.jsx').then(m => m.default),
        },
        landscape: {
          1: () => import('./ads/JobAd/Landscape/Variant1.jsx').then(m => m.default),
          2: () => import('./ads/JobAd/Landscape/Variant2.jsx').then(m => m.default),
        },
        portrait: {
          1: () => import('./ads/JobAd/Landscape/Variant1.jsx').then(m => m.default),
          2: () => import('./ads/JobAd/Landscape/Variant2.jsx').then(m => m.default),
        },
      },
      // Employer brand ads - try multiple possible IDs
      'employer-brand': {
        story: { 1: () => import('./ads/EmployerBrand/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/EmployerBrand/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/EmployerBrand/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/EmployerBrand/Landscape/Variant1.jsx').then(m => m.default) },
      },
      'employer_brand': {
        story: { 1: () => import('./ads/EmployerBrand/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/EmployerBrand/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/EmployerBrand/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/EmployerBrand/Landscape/Variant1.jsx').then(m => m.default) },
      },
      employerBrand: {
        story: { 1: () => import('./ads/EmployerBrand/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/EmployerBrand/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/EmployerBrand/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/EmployerBrand/Landscape/Variant1.jsx').then(m => m.default) },
      },
      // Testimonial ads - try multiple possible IDs
      testimonial: {
        story: { 1: () => import('./ads/Testimonial/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/Testimonial/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/Testimonial/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/Testimonial/Landscape/Variant1.jsx').then(m => m.default) },
      },
      testimonials: {
        story: { 1: () => import('./ads/Testimonial/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/Testimonial/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/Testimonial/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/Testimonial/Landscape/Variant1.jsx').then(m => m.default) },
      },
      // About company ads - try multiple possible IDs
      company: {
        story: { 1: () => import('./ads/AboutCompany/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/AboutCompany/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
      },
      'about-company': {
        story: { 1: () => import('./ads/AboutCompany/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/AboutCompany/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
      },
      'about_company': {
        story: { 1: () => import('./ads/AboutCompany/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/AboutCompany/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
      },
      aboutCompany: {
        story: { 1: () => import('./ads/AboutCompany/Story/Variant1.jsx').then(m => m.default) },
        square: { 1: () => import('./ads/AboutCompany/Square/Variant1.jsx').then(m => m.default) },
        landscape: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
        portrait: { 1: () => import('./ads/AboutCompany/Landscape/Variant1.jsx').then(m => m.default) },
      },
    };

    const loader = componentMap[adTypeId]?.[formatId]?.[variantNumber];
    console.log('Component loader found:', !!loader, 'for', { adTypeId, formatId, variantNumber });
    return loader || null;
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

  // Render based on format
  const renderPreview = () => {
    // Determine if this is a story format
    const isStoryFormat = format?.id === 'story' || format?.aspectRatio === '9:16';

    // Show loading state while component is loading
    if (isLoading) {
      const loadingContent = (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading ad...</div>
          </div>
        </div>
      );
      return isStoryFormat ? <StoryFrame brandData={brandData}>{loadingContent}</StoryFrame> : loadingContent;
    }

    // Check if we have a loaded custom template component
    if (TemplateComponent && typeof TemplateComponent === 'function') {
      const templateContent = <TemplateComponent variant={variant} brandData={brandData} landingPageData={landingPageData} />;
      return templateContent;
    }

    // Show clean placeholder for all unimplemented variants
    const placeholderContent = (
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
    return isStoryFormat ? <StoryFrame brandData={brandData}>{placeholderContent}</StoryFrame> : placeholderContent;
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full h-full bg-gray-50 overflow-hidden">
      <div className="ad-preview-container flex items-center justify-center p-8 w-full h-full overflow-hidden">
        <div
          className="bg-white shadow-lg rounded-lg"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: `${width}px`,
            height: `${height}px`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}