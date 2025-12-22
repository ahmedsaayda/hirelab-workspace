import React, { useState, useCallback } from "react";
import { Input, Button, Collapse, message } from "antd";
import { Sparkles, Image as ImageIcon, Type, FileText, MousePointerClick } from "lucide-react";
import { useFocusContext } from "../../contexts/FocusContext.js";
import AiService from "../../services/AiService.js";
import ImageSelectionModal from "../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";

const { TextArea } = Input;

/**
 * MultiJobHeroEdit - Editor for the multi-job hero section
 */
const MultiJobHeroEdit = ({
  landingPageData,
  setLandingPageData,
  fetchData,
}) => {
  const { setFocusRef } = useFocusContext();
  const [aiLoading, setAiLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const updateField = useCallback((field, value) => {
    setLandingPageData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, [setLandingPageData]);

  // AI Generate hero content
  const handleAIGenerate = async () => {
    setAiLoading(true);
    try {
      const companyName = landingPageData?.companyName || "our company";
      const prompt = `Generate a compelling career page hero section for ${companyName}. 
      Create an inspiring headline (max 6 words) and a brief description (max 150 characters) 
      that would attract top talent to explore job opportunities.`;

      const response = await AiService.generateSectionContent({
        sectionType: "multiJobHero",
        prompt,
        language: landingPageData?.lang || "English",
        context: {
          companyName: landingPageData?.companyName,
          industry: landingPageData?.industry,
        }
      });

      if (response?.data?.content) {
        const content = response.data.content;
        if (content.title) {
          updateField("multiJobHeroTitle", content.title);
        }
        if (content.description) {
          updateField("heroDescription", content.description);
        }
        message.success("Content generated successfully!");
      }
    } catch (error) {
      console.error("AI generation failed:", error);
      message.error("Failed to generate content. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle image selection from media library
  const handleImageSelect = (imageUrl) => {
    if (imageUrl) {
      updateField("heroImage", imageUrl);
    }
    setShowMediaLibrary(false);
  };

  const heroTitle = landingPageData?.multiJobHeroTitle || landingPageData?.vacancyTitle || "";
  const heroDescription = landingPageData?.heroDescription || "";
  const heroImage = landingPageData?.heroImage || "";
  const ctaText = landingPageData?.multiJobCtaText || "See Open Roles";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Career Page Hero</h3>
        <Button
          type="primary"
          icon={<Sparkles size={16} />}
          onClick={handleAIGenerate}
          loading={aiLoading}
          className="flex items-center gap-2"
        >
          Generate with AI
        </Button>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Type size={14} className="text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Headline</label>
          <span className="text-xs text-gray-400 ml-auto">{heroTitle.length}/60</span>
        </div>
        <Input
          value={heroTitle}
          onChange={(e) => updateField("multiJobHeroTitle", e.target.value)}
          placeholder="Let Your Talent Be Rewarded"
          maxLength={60}
          className="rounded-lg"
          onFocus={() => setFocusRef?.("multiJobHeroTitle")}
        />
        <p className="text-xs text-gray-400 mt-1">
          Tip: Keep it short and inspiring (4-6 words work best)
        </p>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText size={14} className="text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Description</label>
          <span className="text-xs text-gray-400 ml-auto">{heroDescription.length}/200</span>
        </div>
        <TextArea
          value={heroDescription}
          onChange={(e) => updateField("heroDescription", e.target.value)}
          placeholder="We are an employee-owned organization making a positive impact..."
          maxLength={200}
          rows={3}
          className="rounded-lg"
          onFocus={() => setFocusRef?.("heroDescription")}
        />
      </div>

      {/* CTA Button Text */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MousePointerClick size={14} className="text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Button Text</label>
          <span className="text-xs text-gray-400 ml-auto">{ctaText.length}/30</span>
        </div>
        <Input
          value={ctaText}
          onChange={(e) => updateField("multiJobCtaText", e.target.value)}
          placeholder="See Open Roles"
          maxLength={30}
          className="rounded-lg"
          onFocus={() => setFocusRef?.("multiJobCtaText")}
        />
      </div>

      {/* Hero Image */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={14} className="text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Hero Image</label>
        </div>
        
        {heroImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="primary" 
                size="small"
                onClick={() => setShowMediaLibrary(true)}
              >
                Change
              </Button>
              <Button 
                size="small"
                onClick={() => updateField("heroImage", "")}
                danger
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => setShowMediaLibrary(true)}
          >
            <ImageIcon size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to add image</span>
            <span className="text-xs text-gray-400 mt-1">Recommended: 800x600px</span>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Images are pulled from Unsplash based on your company/industry
        </p>
      </div>

      {/* Image Selection Modal */}
      <ImageSelectionModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onImageSelected={handleImageSelect}
        multiple={false}
        maxFiles={1}
        type="image"
      />
    </div>
  );
};

export default MultiJobHeroEdit;

