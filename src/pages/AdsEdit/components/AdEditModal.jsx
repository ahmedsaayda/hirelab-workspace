import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Upload, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function AdEditModal({ open, onClose, variant, onSave, landingPageData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    callToAction: "Apply Now",
  });

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

  const handleImageUpload = ({ file }) => {
    if (file.status === "done") {
      setFormData({
        ...formData,
        image: file.response.url,
      });
      message.success("Image uploaded successfully");
    }
  };

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

        {/* Image Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ad Image
          </label>

          {/* Current Image Preview */}
          {formData.image && (
            <div className="mb-3 relative group">
              <img
                src={formData.image}
                alt="Current"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

          {/* Image Selection Tabs */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
              <button className="px-3 py-1.5 text-sm font-medium bg-white text-gray-900 rounded border border-gray-300">
                From Landing Page
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                Upload New
              </button>
            </div>

            {/* Available Images Grid */}
            <div className="p-3">
              {availableImages.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {availableImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        formData.image === img
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {formData.image === img && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">No images available from landing page</p>
                </div>
              )}
            </div>
          </div>
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
  );
}

