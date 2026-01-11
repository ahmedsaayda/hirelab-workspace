/**
 * Render-only page for Puppeteer video recording
 * This page renders ONLY the ad preview without any UI chrome
 * Used by the backend to capture exact video output
 * 
 * URL: /render-preview/[lpId]?data=BASE64_ENCODED_JSON
 * The data param contains all needed info so no API calls required
 */
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

// Import all ad templates
import JobAdStoryVariant1 from "../../src/pages/AdsEdit/components/ads/JobAd/Story/Variant1";
import JobAdStoryVariant2 from "../../src/pages/AdsEdit/components/ads/JobAd/Story/Variant2";
import JobAdStoryVariant2Inverse from "../../src/pages/AdsEdit/components/ads/JobAd/Story/Variant2Inverse";
import JobAdStoryVariant3 from "../../src/pages/AdsEdit/components/ads/JobAd/Story/Variant3";
import JobAdStoryVariant4 from "../../src/pages/AdsEdit/components/ads/JobAd/Story/Variant4";
import JobAdSquareVariant1 from "../../src/pages/AdsEdit/components/ads/JobAd/Square/Variant1";
import JobAdSquareVariant2 from "../../src/pages/AdsEdit/components/ads/JobAd/Square/Variant2";
import JobAdSquareVariant3 from "../../src/pages/AdsEdit/components/ads/JobAd/Square/Variant3";
import JobAdSquareVariant4 from "../../src/pages/AdsEdit/components/ads/JobAd/Square/Variant4";
import JobAdLandscapeVariant1 from "../../src/pages/AdsEdit/components/ads/JobAd/Landscape/Variant1";
import JobAdLandscapeVariant2 from "../../src/pages/AdsEdit/components/ads/JobAd/Landscape/Variant2";
import JobAdLandscapeVariant3 from "../../src/pages/AdsEdit/components/ads/JobAd/Landscape/Variant3";
import JobAdLandscapeVariant4 from "../../src/pages/AdsEdit/components/ads/JobAd/Landscape/Variant4";
import TestimonialStoryVariant1 from "../../src/pages/AdsEdit/components/ads/Testimonial/Story/Variant1";
import TestimonialSquareVariant1 from "../../src/pages/AdsEdit/components/ads/Testimonial/Square/Variant1";
import TestimonialLandscapeVariant1 from "../../src/pages/AdsEdit/components/ads/Testimonial/Landscape/Variant1";
import EmployerBrandStoryVariant1 from "../../src/pages/AdsEdit/components/ads/EmployerBrand/Story/Variant1";
import EmployerBrandSquareVariant1 from "../../src/pages/AdsEdit/components/ads/EmployerBrand/Square/Variant1";
import EmployerBrandLandscapeVariant1 from "../../src/pages/AdsEdit/components/ads/EmployerBrand/Landscape/Variant1";
import AboutCompanyStoryVariant1 from "../../src/pages/AdsEdit/components/ads/AboutCompany/Story/Variant1";
import AboutCompanySquareVariant1 from "../../src/pages/AdsEdit/components/ads/AboutCompany/Square/Variant1";
import AboutCompanyLandscapeVariant1 from "../../src/pages/AdsEdit/components/ads/AboutCompany/Landscape/Variant1";
import RetargetingStoryVariant1 from "../../src/pages/AdsEdit/components/ads/Retargeting/Story/Variant1";
import RetargetingSquareVariant1 from "../../src/pages/AdsEdit/components/ads/Retargeting/Square/Variant1";
import RetargetingLandscapeVariant1 from "../../src/pages/AdsEdit/components/ads/Retargeting/Landscape/Variant1";

const AD_FORMATS = [
  { id: "story", label: "Vertical (9:16)", width: 1080, height: 1920 },
  { id: "square", label: "Square (1:1)", width: 1080, height: 1080 },
  { id: "portrait", label: "Portrait (4:5)", width: 1080, height: 1350 },
];

// Map variant type + format to component
const getAdComponent = (type, format, variantNum) => {
  const key = `${type}-${format}-${variantNum}`;
  const components = {
    // JobAd Story
    "jobAd-story-1": JobAdStoryVariant1,
    "jobAd-story-2": JobAdStoryVariant2,
    "jobAd-story-2inverse": JobAdStoryVariant2Inverse,
    "jobAd-story-3": JobAdStoryVariant3,
    "jobAd-story-4": JobAdStoryVariant4,
    // JobAd Square
    "jobAd-square-1": JobAdSquareVariant1,
    "jobAd-square-2": JobAdSquareVariant2,
    "jobAd-square-3": JobAdSquareVariant3,
    "jobAd-square-4": JobAdSquareVariant4,
    // JobAd Landscape
    "jobAd-landscape-1": JobAdLandscapeVariant1,
    "jobAd-landscape-2": JobAdLandscapeVariant2,
    "jobAd-landscape-3": JobAdLandscapeVariant3,
    "jobAd-landscape-4": JobAdLandscapeVariant4,
    // Testimonial
    "testimonial-story-1": TestimonialStoryVariant1,
    "testimonial-square-1": TestimonialSquareVariant1,
    "testimonial-landscape-1": TestimonialLandscapeVariant1,
    // EmployerBrand
    "employerBrand-story-1": EmployerBrandStoryVariant1,
    "employerBrand-square-1": EmployerBrandSquareVariant1,
    "employerBrand-landscape-1": EmployerBrandLandscapeVariant1,
    // AboutCompany
    "aboutCompany-story-1": AboutCompanyStoryVariant1,
    "aboutCompany-square-1": AboutCompanySquareVariant1,
    "aboutCompany-landscape-1": AboutCompanyLandscapeVariant1,
    // Retargeting
    "retargeting-story-1": RetargetingStoryVariant1,
    "retargeting-square-1": RetargetingSquareVariant1,
    "retargeting-landscape-1": RetargetingLandscapeVariant1,
  };
  return components[key] || null;
};

export default function RenderPreviewPage() {
  const router = useRouter();
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [formatId, setFormatId] = useState("story");
  const containerRef = useRef(null);

  // Parse data from URL - wait for router to be ready
  useEffect(() => {
    if (!router.isReady) return;

    const { data: encodedData, format } = router.query;
    if (format) setFormatId(format);

    if (!encodedData) {
      setError("No data provided");
      window.__RENDER_READY__ = true; // Signal ready even on error
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(encodedData));
      console.log("Render page: Data loaded", decoded);
      setPageData(decoded);

      // Signal ready after component renders and video starts
      setTimeout(() => {
        setReady(true);
        window.__RENDER_READY__ = true;
        console.log("Render page: READY signal set");
      }, 2500);
    } catch (e) {
      console.error("Failed to parse data:", e);
      setError("Invalid data: " + e.message);
      window.__RENDER_READY__ = true; // Signal ready even on error
    }
  }, [router.isReady, router.query]);

  const format = AD_FORMATS.find(f => f.id === formatId) || AD_FORMATS[0];

  // Render the component
  const renderPreview = () => {
    if (!pageData) return null;

    const { variant, landingPage } = pageData;
    // Check both adType and adTypeId since data structure varies
    const rawType = variant?.adType || variant?.adTypeId || "jobAd";
    // Map adTypeId values to component keys
    const typeMap = {
      'job': 'jobAd',
      'jobAd': 'jobAd',
      'company': 'aboutCompany',
      'aboutCompany': 'aboutCompany',
      'testimonial': 'testimonial',
      'retargeting': 'retargeting',
      'employerBrand': 'employerBrand',
      'employer': 'employerBrand',
    };
    const type = typeMap[rawType] || rawType;
    const variantNum = variant?.variantNumber || 1;

    console.log("Render preview:", { rawType, type, variantNum, formatId });

    const Component = getAdComponent(type, formatId, variantNum);

    if (!Component) {
      return <div style={{ color: "red" }}>Component not found: {type}-{formatId}-{variantNum}</div>;
    }

    const commonProps = {
      brandName: landingPage?.companyName || "Company",
      brandLogo: landingPage?.logo || "",
      primaryColor: landingPage?.buttonColor || landingPage?.primaryColor || "#5207CD",
      secondaryColor: landingPage?.accentColor || "#ffffff",
    };

    if (type === "testimonial") {
      return (
        <Component
          {...commonProps}
          author={variant?.author || "Team Member"}
          avatar={variant?.avatar || variant?.heroImage || ""}
          videoUrl={variant?.videoUrl || ""}
          quote={variant?.quote || variant?.title || ""}
        />
      );
    }

    return (
      <Component
        {...commonProps}
        heroImage={variant?.heroImage || ""}
        videoUrl={variant?.videoUrl || ""}
        title={variant?.title || ""}
        linkDescription={variant?.linkDescription || ""}
      />
    );
  };

  if (error) {
    return (
      <div style={{
        width: format.width,
        height: format.height,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f00",
      }}>
        Error: {error}
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{
        width: format.width,
        height: format.height,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: ${format.width}px;
          height: ${format.height}px;
          overflow: hidden;
          background: #000;
        }
      `}</style>
      <div
        ref={containerRef}
        id="render-container"
        data-ready={ready}
        style={{
          width: format.width,
          height: format.height,
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {renderPreview()}
      </div>
    </>
  );
}

// No layout for this page
RenderPreviewPage.getLayout = (page) => page;
