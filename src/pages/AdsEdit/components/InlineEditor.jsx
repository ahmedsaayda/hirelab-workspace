import React, { useState, useEffect } from "react";
import { Input, Tooltip, Upload, message } from "antd";

const { TextArea } = Input;

export default function InlineEditor({ variant, onChange, landingPageData, onClose }) {
  const [editingField, setEditingField] = useState(null);
  const [localData, setLocalData] = useState({
    title: variant?.title || "",
    description: variant?.description || "",
    ctaText: variant?.ctaText || "Apply Now",
    image: variant?.image || "",
  });

  useEffect(() => {
    if (variant) {
      setLocalData({
        title: variant.title || "",
        description: variant.description || "",
        ctaText: variant.ctaText || "Apply Now",
        image: variant.image || "",
      });
    }
  }, [variant]);

  const handleChange = (field, value) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange?.(updated);
  };

  const availableImages = [
    landingPageData?.heroImage,
    landingPageData?.jobDescriptionImage,
    ...(landingPageData?.aboutTheCompanyImages || []),
    ...(landingPageData?.photoImages || []),
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-[#eaecf0] flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black leading-5">Editor</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close Editor"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Primary Text / Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#344054]">Primary Text</label>
            <span className="text-xs text-[#667085]">{localData.title.length}/40</span>
          </div>
          <div className="relative">
            <TextArea
              value={localData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              maxLength={40}
              rows={3}
              className="w-full text-sm"
              placeholder="Enter the main headline for your ad"
            />
            <button className="absolute right-2 bottom-2 p-1 hover:bg-gray-100 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7 3.33334H4.00004C3.26666 3.33334 2.66671 3.93329 2.66671 4.66667V12C2.66671 12.7334 3.26666 13.3333 4.00004 13.3333H11.3334C12.0668 13.3333 12.6667 12.7334 12.6667 12V9M11.7239 2.39053C12.1997 1.91473 12.9671 1.91473 13.4429 2.39053C13.9187 2.86632 13.9187 3.63373 13.4429 4.10953L7.60948 9.94299L5.33337 10.6667L6.05709 8.39055L11.7239 2.39053Z" stroke="#344054" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Headline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#344054]">Headline</label>
            <span className="text-xs text-[#667085]">{(variant?.headline || localData.title).length}/25</span>
          </div>
          <Input
            value={variant?.headline || localData.title.substring(0, 25)}
            onChange={(e) => handleChange("headline", e.target.value)}
            maxLength={25}
            className="w-full"
            placeholder="Short version for feed"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#344054]">Description</label>
            <span className="text-xs text-[#667085]">{localData.description.length}/40</span>
          </div>
          <div className="relative">
            <TextArea
              value={localData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              maxLength={40}
              rows={2}
              className="w-full text-sm"
              placeholder="Add a description"
            />
            <button className="absolute right-2 bottom-2 p-1 hover:bg-gray-100 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7 3.33334H4.00004C3.26666 3.33334 2.66671 3.93329 2.66671 4.66667V12C2.66671 12.7334 3.26666 13.3333 4.00004 13.3333H11.3334C12.0668 13.3333 12.6667 12.7334 12.6667 12V9M11.7239 2.39053C12.1997 1.91473 12.9671 1.91473 13.4429 2.39053C13.9187 2.86632 13.9187 3.63373 13.4429 4.10953L7.60948 9.94299L5.33337 10.6667L6.05709 8.39055L11.7239 2.39053Z" stroke="#344054" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-[#344054] block mb-2">Image</label>
          <div className="border-2 border-dashed border-[#d0d5dd] rounded-lg p-6 text-center hover:border-[#0e87fe] transition-colors cursor-pointer">
            {localData.image ? (
              <div className="relative">
                <img src={localData.image} alt="Ad" className="w-full h-40 object-cover rounded-lg mb-3" />
                <button
                  onClick={() => handleChange("image", "")}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#d92d20" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="text-[#0e87fe] mb-2">Click to upload</div>
                <div className="text-xs text-[#667085]">or drag and drop</div>
                <div className="text-xs text-[#667085] mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</div>
              </>
            )}
          </div>

          {/* Available Images from Landing Page */}
          {availableImages.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-medium text-[#344054] mb-2">Or choose from your page:</div>
              <div className="grid grid-cols-3 gap-2">
                {availableImages.slice(0, 6).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChange("image", img)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      localData.image === img
                        ? "border-[#0e87fe] ring-2 ring-[#0e87fe] ring-opacity-20"
                        : "border-[#e4e7ec] hover:border-[#98a2b3]"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button Text */}
        <div>
          <label className="text-sm font-medium text-[#344054] block mb-2">Call to Action</label>
          <Input
            value={localData.ctaText}
            onChange={(e) => handleChange("ctaText", e.target.value)}
            maxLength={20}
            className="w-full"
            placeholder="Apply Now"
          />
        </div>

        {/* AI Enhance Button */}
        <div className="pt-4 border-t border-[#eaecf0]">
          <button className="w-full px-4 py-2.5 bg-white border border-[#d0d5dd] text-[#344054] font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V14M14 8H2M11.5 4.5L4.5 11.5M4.5 4.5L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Enhance with AI
          </button>
        </div>
      </div>
    </div>
  );
}

