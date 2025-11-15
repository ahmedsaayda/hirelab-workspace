import React, { useState } from "react";
import { Input } from "antd";

const { TextArea } = Input;

export default function AdVariantCard({
  variant,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onReplace,
  isEditing,
  onSave,
  landingPageData,
}) {
  const [editData, setEditData] = useState({
    title: variant?.title || "",
    description: variant?.description || "",
    image: variant?.image || "",
  });

  // If in edit mode, show expanded editor
  if (isEditing) {
    return (
      <div className="bg-white border-2 border-[#0e87fe] rounded-xl p-4 transition-all">
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base text-[#101828]">Edit Variant</h3>
          <button
            onClick={() => onEdit(null)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Primary Text */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#344054]">Primary Text</label>
            <span className="text-xs text-[#667085]">{editData.title.length}/40</span>
          </div>
          <TextArea
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            maxLength={40}
            rows={2}
            className="text-sm"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#344054]">Description</label>
            <span className="text-xs text-[#667085]">{editData.description.length}/150</span>
          </div>
          <TextArea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            maxLength={150}
            rows={2}
            className="text-sm"
          />
        </div>

        {/* Image Picker */}
        <div className="mb-4">
          <label className="text-xs font-medium text-[#344054] block mb-2">Change Image</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              landingPageData?.heroImage,
              landingPageData?.jobDescriptionImage,
              ...(landingPageData?.aboutTheCompanyImages || []).slice(0, 4),
            ]
              .filter(Boolean)
              .slice(0, 6)
              .map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setEditData({ ...editData, image: img })}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    editData.image === img
                      ? "border-[#0e87fe] ring-2 ring-[#0e87fe] ring-opacity-20"
                      : "border-[#e4e7ec] hover:border-[#98a2b3]"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => {
            onSave?.({ ...variant, ...editData });
            onEdit(null);
          }}
          className="w-full px-4 py-2 bg-[#0e87fe] hover:bg-[#0c76e5] text-white font-semibold text-sm rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </div>
    );
  }

  // Default card view
  return (
    <div
      className={`relative bg-white rounded-xl p-4 transition-all ${
        selected
          ? "border-2 border-[#0e87fe]"
          : "border border-[#eaecf0]"
      }`}
    >
      {/* Content Container */}
      <div className="flex gap-2 items-start mb-4 pr-6">
        {/* Image Thumbnail */}
        <div className="relative w-[70px] h-[70px] flex-shrink-0 bg-gray-100 rounded-[10px] overflow-hidden">
          {variant.image ? (
            <img
              src={variant.image}
              alt={variant.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-1.5 justify-center min-w-0">
          <h4 className="font-semibold text-base leading-6 text-[#101828]">
            {variant.title}
          </h4>
          <p className="text-sm leading-5 text-[#475467]">
            {variant.description}
          </p>
        </div>
      </div>

      {/* Checkbox - Positioned absolute top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`absolute right-4 top-3 w-5 h-5 rounded-[10px] border-[1.25px] transition-all flex items-center justify-center ${
          selected
            ? "bg-[#0e87fe] border-[#0e87fe]"
            : "bg-white border-[#d0d5dd] hover:border-[#98a2b3]"
        }`}
      >
        {selected && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M10.5 3.25L4.875 8.875L2.375 6.375"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Action Buttons - Connected Group */}
      <div className="flex items-center w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplace();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#344054] leading-5 bg-white hover:bg-gray-50 border border-[#d0d5dd] rounded-l-lg transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75M15.75 9C15.75 5.27208 12.7279 2.25 9 2.25M15.75 9H17.25M9 15.75C5.27208 15.75 2.25 12.7279 2.25 9M9 15.75V17.25M2.25 9C2.25 5.27208 5.27208 2.25 9 2.25M2.25 9H0.75M9 2.25V0.75"
              stroke="#344054"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replace
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#344054] leading-5 bg-white hover:bg-gray-50 border-t border-b border-[#d0d5dd] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M8.25 3H3C2.58579 3 2.25 3.33579 2.25 3.75V15C2.25 15.4142 2.58579 15.75 3 15.75H14.25C14.6642 15.75 15 15.4142 15 15V9.75M13.7197 2.21967C14.0126 1.92678 14.4874 1.92678 14.7803 2.21967L15.7803 3.21967C16.0732 3.51256 16.0732 3.98744 15.7803 4.28033L8.03033 12.0303C7.88968 12.171 7.69891 12.25 7.5 12.25H5.25V10L13.7197 2.21967Z"
              stroke="#344054"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#d92d20] leading-5 bg-white hover:bg-red-50 border border-[#d0d5dd] rounded-r-lg transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M12 4.5V3.75C12 2.92157 11.3284 2.25 10.5 2.25H7.5C6.67157 2.25 6 2.92157 6 3.75V4.5M14.25 4.5V14.25C14.25 15.0784 13.5784 15.75 12.75 15.75H5.25C4.42157 15.75 3.75 15.0784 3.75 14.25V4.5M2.25 4.5H15.75M7.5 8.25V12M10.5 8.25V12"
              stroke="#d92d20"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Delete
        </button>
      </div>

      {/* Approved Badge */}
      {variant.approved && (
        <div className="absolute -top-2 -right-2 bg-[#0a8f63] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          ✓ Approved
        </div>
      )}
    </div>
  );
}
