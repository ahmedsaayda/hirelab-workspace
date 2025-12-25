import React, { useRef, useState, useEffect } from "react";
import { Modal, Input, Select, message } from "antd";
import ImageSelectionModal from "../../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";

const { TextArea } = Input;
const { Option } = Select;

export default function AdEditModal({ open, onClose, variant, onSave, landingPageData }) {
  const [formData, setFormData] = useState({
    // Meta fields:
    // - description: Primary Text (2200, hook 125)
    // - title: Headline (40)
    // - linkDescription: Description (30)
    description: "",
    title: "",
    linkDescription: "",
    image: "",
    videoUrl: "",
    callToAction: "Apply Now",
  });
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  useEffect(() => {
    if (variant) {
      setFormData({
        description: variant.description || "",
        title: variant.title || "",
        linkDescription: variant.linkDescription || "",
        image: variant.image || "",
        videoUrl: variant.videoUrl || "",
        callToAction: variant.callToAction || "Apply Now",
      });
    }
  }, [variant]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      message.error("Please enter a title");
      return;
    }

    const updatedVariant = {
      ...variant,
      ...formData,
    };

    onSave(updatedVariant);
  };

  // Unified media picker—no direct upload input here

  const isLikelyVideoUrl = (u) => /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(String(u || ""));
  const cloudinaryVideoToPoster = (url, seconds = 0) => {
    const u = String(url || "");
    if (!u.includes("res.cloudinary.com") || !u.includes("/video/upload/")) return "";
    const sec = Number.isFinite(seconds) ? seconds : 0;
    const withTransform = u.replace("/video/upload/", `/video/upload/so_${sec}/`);
    return withTransform.replace(/\.(mp4|mov|webm|mkv)(\?.*)?$/i, ".jpg$2");
  };

  // Extract available images from landing page
  const availableImages = React.useMemo(() => {
    const images = [];
    
    if (landingPageData?.hero?.backgroundImage) {
      images.push(landingPageData.hero.backgroundImage);
    }
    
    if (landingPageData?.aboutCompany?.images) {
      images.push(...landingPageData.aboutCompany.images);
    }
    
    if (landingPageData?.testimonials) {
      landingPageData.testimonials.forEach((t) => {
        if (t.image) images.push(t.image);
      });
    }

    return [...new Set(images)]; // Remove duplicates
  }, [landingPageData]);

  return (
    <>
    <Modal
      title="Edit Ad Variant"
      open={open}
      onCancel={onClose}
      width={700}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Primary Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Primary Text (appears above the media in Feed)
          </label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Primary Text (hook is first 125 chars)..."
            maxLength={2200}
            showCount
            size="large"
          />
          {formData.description.length > 125 && (
            <div className="mt-1 text-xs text-gray-500">
              ℹ️ First 125 chars are visible before “See more”.
            </div>
          )}
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Headline (appears below the media in Feed)
          </label>
          <TextArea
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Headline (max 40 characters)..."
            rows={2}
            maxLength={40}
            showCount
          />
        </div>

        {/* Description (Meta) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (appears under the headline on some placements)
          </label>
          <Input
            value={formData.linkDescription}
            onChange={(e) => setFormData({ ...formData, linkDescription: e.target.value })}
            placeholder="Short description..."
            maxLength={30}
            showCount
            size="large"
          />
        </div>

        {/* Call to Action */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Call to Action
          </label>
          <Select
            value={formData.callToAction}
            onChange={(value) => setFormData({ ...formData, callToAction: value })}
            className="w-full"
            size="large"
          >
            <Option value="Apply Now">Apply Now</Option>
            <Option value="Learn More">Learn More</Option>
          </Select>
        </div>

        {/* Media Selection - unified single field opens media library (choose or upload) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ad Media (image or video)
          </label>

          <button
            type="button"
            onClick={() => setIsImagePickerOpen(true)}
            className="w-full border border-dashed border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Selected" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 11l4 4 4-4" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {formData.image ? "Change media" : "Click to choose or upload"}
                </div>
                <div className="text-xs text-gray-500">Opens media library. You can upload new or pick existing.</div>
              </div>
            </div>
          </button>
        </div>

        {/* AI Suggestions (Future Feature) */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">AI Optimization Available</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get AI-powered suggestions to improve your ad performance
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                ⚡ Generate Suggestions
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <ImageSelectionModal
      isOpen={isImagePickerOpen}
      onClose={() => setIsImagePickerOpen(false)}
      type="all"
      accept="image/*,video/*"
      multiple={false}
      existingFiles={formData?.image ? [formData.image] : []}
      onImageSelected={(files = []) => {
        const first = files?.[0];
        const url = (typeof first === "string" ? first : (first?.url || first?.secure_url || first?.thumbnail || ""));
        if (url) {
          if (isLikelyVideoUrl(url) || String(url).includes("/video/upload/")) {
            const poster = cloudinaryVideoToPoster(url);
            setFormData((prev) => ({ ...prev, videoUrl: url, image: poster || prev.image || "" }));
            message.success("Video selected from library");
          } else {
            setFormData((prev) => ({ ...prev, image: url, videoUrl: "" }));
            message.success("Image selected from library");
          }
        }
        setIsImagePickerOpen(false);
      }}
    />
    </>
  );
}

