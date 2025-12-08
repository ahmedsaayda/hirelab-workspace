import React, { useRef, useState, useEffect } from "react";
import { Modal, Input, Select, message } from "antd";
import ImageSelectionModal from "../../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";

const { TextArea } = Input;
const { Option } = Select;

export default function AdEditModal({ open, onClose, variant, onSave, landingPageData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    callToAction: "Apply Now",
  });
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  useEffect(() => {
    if (variant) {
      setFormData({
        title: variant.title || "",
        description: variant.description || "",
        image: variant.image || "",
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

  const handleImageSelect = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl,
    });
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
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ad Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter ad title..."
            maxLength={100}
            showCount
            size="large"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <TextArea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter ad description..."
            rows={4}
            maxLength={250}
            showCount
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
            <Option value="Join Us">Join Us</Option>
            <Option value="Get Started">Get Started</Option>
            <Option value="See Opportunities">See Opportunities</Option>
            <Option value="View Job">View Job</Option>
          </Select>
        </div>

        {/* Image Selection - unified single field opens media library (choose or upload) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ad Image
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
                  {formData.image ? "Change image" : "Click to choose or upload"}
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
      type="image"
      accept="image/*"
      multiple={false}
      existingFiles={formData?.image ? [formData.image] : []}
      onImageSelected={(files = []) => {
        const first = files?.[0];
        const url =
          first?.thumbnail ||
          first?.url ||
          first?.secure_url ||
          (typeof first === "string" ? first : "");
        if (url) {
          setFormData((prev) => ({ ...prev, image: url }));
          message.success("Image selected from library");
        }
        setIsImagePickerOpen(false);
      }}
    />
    </>
  );
}

