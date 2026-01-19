import React from "react";
import EditorRender from "./EditorRender";
import ImageUploader from "./ImageUploader";
import { useHover } from "../../contexts/HoverContext";
import { Text } from "../Dashboard/Vacancies/components/components";

/**
 * MultiJobHeroEdit - Editor for the multi-job hero section
 * Uses the same EditorRender pattern as HeroSectionEdit for consistency
 */
const MultiJobHeroEdit = ({ landingPageData, setLandingPageData, fetchData }) => {
  const { setHoveredField, setScrollToSection } = useHover();

  const handleChange = (key, value) => {
    document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
    setLandingPageData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClick = () => {
    const lastItem = localStorage.getItem("lastItem");
    if (lastItem !== "hero-section") {
      setScrollToSection("hero-section");
      localStorage.setItem("lastItem", "hero-section");
    }
  };

  return (
    <div onClick={handleClick}>
      <EditorRender
        landingPageData={landingPageData}
        setLandingPageData={setLandingPageData}
        items={[
          {
            key: "multiJobHeroTitle",
            label: "Headline",
            max: 60,
          },
          {
            key: "heroDescription",
            label: "Description",
            max: 680,
            textarea: true,
          },
          {
            key: "multiJobCtaText",
            label: "Button Text",
            max: 30,
          },
        ]}
        renderMore={
          <div className="flex flex-col gap-2 w-full">
            {/* Tip for headline */}
            <div className="px-2 -mt-2 mb-2">
              <Text as="p" className="text-xs text-gray-400">
                Tip: <span className="underline decoration-amber-400">Keep it short and inspiring (4-6 words work best)</span>
              </Text>
            </div>

            {/* Hero Image */}
            <div
              onMouseEnter={() => setHoveredField("heroImage")}
              onMouseLeave={() => setHoveredField(null)}
              className="flex flex-col col-span-2 gap-2 px-2 mt-5 w-full"
            >
              <Text as="p" className="self-start !text-blue_gray-700 font-medium text-sm">
                Hero Image
              </Text>
              <ImageUploader
                defaultImage={landingPageData?.heroImage}
                imageAdjustments={landingPageData?.imageAdjustment || {}}
                fieldKey="heroImage"
                isSettingDisabled={false}
                onImageUpload={(url) => {
                  handleChange("heroImage", url);
                }}
                onImageAdjustmentChange={(fieldKey, adjustments) => {
                  setLandingPageData((d) => ({
                    ...d,
                    imageAdjustment: {
                      ...(d.imageAdjustment || {}),
                      [fieldKey]: adjustments,
                    },
                  }));
                  document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
                }}
                allowedTabs={["image"]}
              />
              <Text as="p" className="text-xs text-gray-400">
                Images are pulled from Unsplash based on your company/industry
              </Text>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default MultiJobHeroEdit;
