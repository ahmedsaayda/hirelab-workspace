import React, { useRef, useState } from "react";
import { Input, message } from "antd";
import ImageSelectionModal from "../../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";

const { TextArea } = Input;

export default function AdVariantCard({
  variant,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onDownload,
  onReplace,
  isEditing,
  onSave,
  onDraftChange,
  landingPageData,
  mediaType = "image", // "image" | "video" | "both" - controls what media can be uploaded
  isDownloading = false, // Disables download button when true
}) {
  const dragRef = useRef({ dragging: false, pointerId: null });
  const [editData, setEditData] = useState({
    // Meta fields:
    // - title: Headline (40)
    // Image overlay fields
    title: variant?.title || "", // Overlay Headline
    linkDescription: variant?.linkDescription || "", // Overlay Subheadline (for non-quote ad types)
    callToAction: variant?.callToAction || "Apply Now",
    // Quote fields (for testimonial and employer-brand ad types - replaces subheadline)
    quoteText: variant?.quoteText || "",
    quoteAuthorName: variant?.quoteAuthorName || "",
    quoteAuthorPosition: variant?.quoteAuthorPosition || "",
    // Meta ad copy fields
    description: variant?.description || "", // Meta Primary Text (2200, hook 125)
    metaHeadline: variant?.metaHeadline || "", // Meta Headline (40)
    metaDescription: variant?.metaDescription || "", // Meta Description (30)
    // Media
    image: variant?.image || "",
    videoUrl: variant?.videoUrl || "",
  });

  // Check if this ad type uses quote fields instead of subheadline
  const usesQuoteFields = variant?.adTypeId === 'testimonial' || variant?.adTypeId === 'employer-brand';
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isLikelyVideoUrl = (u) => /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(String(u || ""));
  const cloudinaryVideoToPoster = (url, seconds = 0) => {
    const u = String(url || "");
    if (!u.includes("res.cloudinary.com") || !u.includes("/video/upload/")) return "";
    const sec = Number.isFinite(seconds) ? seconds : 0;
    const withTransform = u.replace("/video/upload/", `/video/upload/so_${sec}/`);
    return withTransform.replace(/\.(mp4|mov|webm|mkv)(\?.*)?$/i, ".jpg$2");
  };

  const emitDraft = (nextEditData) => {
    onDraftChange?.({ ...variant, ...nextEditData });
  };

  // If in edit mode, show expanded editor
  if (isEditing) {
    return (
      <div className="bg-white border-2 border-[#5207CD] rounded-xl p-4 transition-all">
        {/* Editor Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-base text-[#101828]">Edit Variant</h3>
          </div>
          <button
            onClick={() => onEdit(null)}
            className="p-1 rounded transition-colors hover:bg-gray-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ===== IMAGE CREATIVE SECTION ===== */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[#101828] mb-2 uppercase tracking-wide">Image Creative</h4>

          {/* 2-column grid for Media picker and Image position */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Image Picker - unified with media library */}
            <div>
              <label className="text-xs font-medium text-[#344054] block mb-1.5">
                Media ({mediaType === "video" ? "video" : mediaType === "both" ? "image/video" : "image"})
              </label>
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(true)}
                className="w-full border border-dashed border-[#d0d5dd] rounded-lg p-2 text-left hover:bg-gray-50 transition-colors h-[100px] flex flex-col items-center justify-center"
              >
                <div className="flex overflow-hidden justify-center items-center w-14 h-14 bg-gray-100 rounded mb-1">
                  {editData.image ? (
                    <img src={editData.image} alt="Selected" className="object-cover w-full h-full" />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 11l4 4 4-4" />
                    </svg>
                  )}
                </div>
                <div className="text-[10px] text-[#667085] text-center">
                  {editData.image ? "Change" : "Choose"} media
                </div>
              </button>
            </div>

            {/* Image Position - drag area */}
            <div>
              <label className="text-xs font-medium text-[#344054] block mb-1.5">Position (drag)</label>
              <div
                role="button"
                tabIndex={0}
                onPointerDown={(e) => {
                  if (!editData.image && !editData.videoUrl) return;
                  e.preventDefault();
                  dragRef.current.dragging = true;
                  dragRef.current.pointerId = e.pointerId;
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!dragRef.current.dragging) return;
                  if (!editData.image && !editData.videoUrl) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const cx = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
                  const cy = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
                  const x = Math.round((cx / rect.width) * 100);
                  const y = Math.round((cy / rect.height) * 100);
                  const next = {
                    ...editData,
                    imageAdjustment: {
                      ...(editData.imageAdjustment || {}),
                      heroImage: {
                        ...(editData.imageAdjustment?.heroImage || {}),
                        objectPosition: { x, y },
                      },
                    },
                  };
                  setEditData(next);
                  emitDraft(next);
                }}
                onPointerUp={() => {
                  dragRef.current.dragging = false;
                  dragRef.current.pointerId = null;
                }}
                onPointerCancel={() => {
                  dragRef.current.dragging = false;
                  dragRef.current.pointerId = null;
                }}
                className={`relative w-full h-[100px] rounded-lg overflow-hidden border select-none ${(editData.image || editData.videoUrl)
                  ? `border-[#e4e7ec] hover:border-[#98a2b3] ${dragRef.current.dragging ? "cursor-grabbing" : "cursor-grab"}`
                  : "border-[#eaecf0] cursor-not-allowed"
                  }`}
                style={{ touchAction: "none" }}
                title={(editData.image || editData.videoUrl) ? "Drag to position" : "Select media first"}
              >
                {(editData.image || editData.videoUrl) ? (
                  <>
                    {editData.videoUrl ? (
                      <video
                        src={editData.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={editData.image || undefined}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: editData?.imageAdjustment?.heroImage?.objectFit || "cover",
                          objectPosition: `${editData?.imageAdjustment?.heroImage?.objectPosition?.x ?? 50
                            }% ${editData?.imageAdjustment?.heroImage?.objectPosition?.y ?? 50}%`,
                          transform: editData?.imageAdjustment?.heroImage?.mirror ? "scaleX(-1)" : "none",
                          pointerEvents: "none",
                        }}
                      />
                    ) : (
                      <img
                        src={editData.image}
                        alt="Focal point preview"
                        className="w-full h-full"
                        style={{
                          objectFit: editData?.imageAdjustment?.heroImage?.objectFit || "cover",
                          objectPosition: `${editData?.imageAdjustment?.heroImage?.objectPosition?.x ?? 50
                            }% ${editData?.imageAdjustment?.heroImage?.objectPosition?.y ?? 50}%`,
                          transform: editData?.imageAdjustment?.heroImage?.mirror ? "scaleX(-1)" : "none",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        left: `${editData?.imageAdjustment?.heroImage?.objectPosition?.x ?? 50}%`,
                        top: `${editData?.imageAdjustment?.heroImage?.objectPosition?.y ?? 50}%`,
                        transform: "translate(-50%, -50%)",
                        width: 12,
                        height: 12,
                        borderRadius: 9999,
                        border: "2px solid white",
                        boxShadow: "0 0 0 2px rgba(14,135,254,0.7)",
                        background: "rgba(14,135,254,0.35)",
                      }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[#667085] bg-gray-50">
                    Select media first
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image controls row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["cover", "contain"].map((fit) => {
              const active = (editData?.imageAdjustment?.heroImage?.objectFit || "cover") === fit;
              return (
                <button
                  key={fit}
                  type="button"
                  onClick={() => {
                    const next = {
                      ...editData,
                      imageAdjustment: {
                        ...(editData.imageAdjustment || {}),
                        heroImage: {
                          ...(editData.imageAdjustment?.heroImage || {}),
                          objectFit: fit,
                        },
                      },
                    };
                    setEditData(next);
                    emitDraft(next);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${active
                    ? "bg-[#5207CD] text-white border-[#5207CD]"
                    : "bg-white text-[#344054] border-[#d0d5dd] hover:bg-gray-50"
                    }`}
                >
                  {fit}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== TEXT OVERLAY SECTION ===== */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[#101828] mb-2 uppercase tracking-wide">Text Overlay</h4>

          {/* Headline field */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-[#344054]">Headline</label>
              <span className={`text-xs ${editData.title.length > 40 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                {editData.title.length}/40
              </span>
            </div>
            <TextArea
              value={editData.title}
              onChange={(e) => {
                const next = { ...editData, title: e.target.value };
                setEditData(next);
                emitDraft(next);
              }}
              maxLength={40}
              rows={2}
              className="text-sm"
              placeholder="Enter headline for image overlay..."
            />
          </div>

          {/* Quote fields for testimonial and employer-brand ads */}
          {usesQuoteFields ? (
            <div className="space-y-3 mb-3">
              {/* Quote Text */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-[#344054]">Quote Text</label>
                  <span className={`text-xs ${editData.quoteText.length > 300 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                    {editData.quoteText.length}/300
                  </span>
                </div>
                <TextArea
                  value={editData.quoteText}
                  onChange={(e) => {
                    const next = { ...editData, quoteText: e.target.value };
                    setEditData(next);
                    emitDraft(next);
                  }}
                  maxLength={300}
                  rows={3}
                  className="text-sm"
                  placeholder="Enter quote text..."
                />
              </div>

              {/* 2-column grid for Author Name + Position */}
              <div className="grid grid-cols-2 gap-3">
                {/* Author Name */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-[#344054]">Author Name</label>
                    <span className={`text-xs ${editData.quoteAuthorName.length > 40 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                      {editData.quoteAuthorName.length}/40
                    </span>
                  </div>
                  <Input
                    value={editData.quoteAuthorName}
                    onChange={(e) => {
                      const next = { ...editData, quoteAuthorName: e.target.value };
                      setEditData(next);
                      emitDraft(next);
                    }}
                    maxLength={40}
                    className="text-sm"
                    placeholder="Full name..."
                  />
                </div>

                {/* Author Position */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-[#344054]">Position</label>
                    <span className={`text-xs ${editData.quoteAuthorPosition.length > 40 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                      {editData.quoteAuthorPosition.length}/40
                    </span>
                  </div>
                  <Input
                    value={editData.quoteAuthorPosition}
                    onChange={(e) => {
                      const next = { ...editData, quoteAuthorPosition: e.target.value };
                      setEditData(next);
                      emitDraft(next);
                    }}
                    maxLength={40}
                    className="text-sm"
                    placeholder="Job title / role..."
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Subheadline for non-quote ad types */
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#344054]">Subheadline</label>
                <span className={`text-xs ${editData.linkDescription.length > 30 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                  {editData.linkDescription.length}/30
                </span>
              </div>
              <TextArea
                value={editData.linkDescription}
                onChange={(e) => {
                  const next = { ...editData, linkDescription: e.target.value };
                  setEditData(next);
                  emitDraft(next);
                }}
                maxLength={30}
                rows={2}
                className="text-sm"
                placeholder="Enter subheadline..."
              />
            </div>
          )}

          {/* CTA */}
          <div>
            <label className="text-xs font-medium text-[#344054] block mb-1.5">Call to Action</label>
            <div className="flex gap-2">
              {["Apply Now", "Learn More"].map((cta) => {
                const active = editData.callToAction === cta;
                return (
                  <button
                    key={cta}
                    type="button"
                    onClick={() => {
                      const next = { ...editData, callToAction: cta };
                      setEditData(next);
                      emitDraft(next);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${active
                      ? "bg-[#5207CD] text-white border-[#5207CD]"
                      : "bg-white text-[#344054] border-[#d0d5dd] hover:bg-gray-50"
                      }`}
                  >
                    {cta}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== META AD COPY SECTION ===== */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-[#101828] mb-2 uppercase tracking-wide">Meta Ad Copy</h4>

          {/* Primary Text */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-[#344054]">Primary Text</label>
              <span className="text-xs text-[#667085]">{editData.description.length}/2200</span>
            </div>
            <TextArea
              value={editData.description}
              onChange={(e) => {
                const next = { ...editData, description: e.target.value };
                setEditData(next);
                emitDraft(next);
              }}
              maxLength={2200}
              rows={3}
              className="text-sm"
              placeholder="Enter primary text..."
            />
            {editData.description.length > 125 && (
              <div className="mt-1 text-[10px] text-[#667085]">
                ℹ️ First 125 chars are the "hook" visible before "See more".
              </div>
            )}
          </div>

          {/* 2-column grid for Meta Headline + Meta Description */}
          <div className="grid grid-cols-2 gap-3">
            {/* Meta Headline */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#344054]">Headline</label>
                <span className={`text-xs ${(editData.metaHeadline?.length || 0) > 40 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                  {editData.metaHeadline?.length || 0}/40
                </span>
              </div>
              <TextArea
                value={editData.metaHeadline || ""}
                onChange={(e) => {
                  const next = { ...editData, metaHeadline: e.target.value };
                  setEditData(next);
                  emitDraft(next);
                }}
                maxLength={40}
                rows={2}
                className="text-sm"
                placeholder="Meta headline..."
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#344054]">Description</label>
                <span className={`text-xs ${(editData.metaDescription?.length || 0) > 30 ? "text-amber-600 font-medium" : "text-[#667085]"}`}>
                  {editData.metaDescription?.length || 0}/30
                </span>
              </div>
              <TextArea
                value={editData.metaDescription || ""}
                onChange={(e) => {
                  const next = { ...editData, metaDescription: e.target.value };
                  setEditData(next);
                  emitDraft(next);
                }}
                maxLength={30}
                rows={2}
                className="text-sm"
                placeholder="Meta description..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => {
            onSave?.({ ...variant, ...editData });
            onEdit(null);
          }}
          className="w-full px-3 py-2 bg-[#5207CD] hover:bg-[#0c76e5] text-white font-semibold text-sm rounded-lg transition-colors"
        >
          Save Changes
        </button>

        <ImageSelectionModal
          isOpen={isImagePickerOpen}
          onClose={() => setIsImagePickerOpen(false)}
          type={mediaType === "video" ? "video" : mediaType === "both" ? "all" : "image"}
          accept={mediaType === "video" ? "video/*" : mediaType === "both" ? "image/*,video/*" : "image/*"}
          multiple={false}
          existingFiles={editData?.image ? [editData.image] : []}
          onImageSelected={(files = []) => {
            const first = files?.[0];
            const url = (typeof first === "string" ? first : (first?.url || first?.secure_url || first?.thumbnail || ""));
            if (url) {
              const isVideo = isLikelyVideoUrl(url) || String(url).includes("/video/upload/");

              // Validate media type
              if (mediaType === "image" && isVideo) {
                message.error("This template only supports images. Please select an image.");
                return;
              }
              if (mediaType === "video" && !isVideo) {
                message.error("This template only supports videos. Please select a video.");
                return;
              }

              if (isVideo) {
                const poster = cloudinaryVideoToPoster(url);
                const next = {
                  ...editData,
                  videoUrl: url,
                  // If we can derive a poster, use it; otherwise keep current image.
                  image: poster || editData.image || "",
                };
                setEditData(next);
                emitDraft(next);
                message.success("Video selected from library");
              } else {
                const next = { ...editData, image: url, videoUrl: "" };
                setEditData(next);
                emitDraft(next);
                message.success("Image selected from library");
              }
            }
            setIsImagePickerOpen(false);
          }}
        />
      </div>
    );
  }

  // Truncate text helper
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "....";
  };

  const descriptionTruncated = (variant.description?.length || 0) > 150;

  // Default card view
  return (
    <div
      className={`relative bg-white rounded-xl p-4 transition-all cursor-pointer ${selected
        ? "border-2 border-[#5207CD]"
        : "border border-[#eaecf0]"
        }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Content Container */}
      <div className="flex gap-3 items-start mb-4">
        {/* Image Thumbnail - Larger size */}
        <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {variant.image ? (
            <img
              src={variant.image}
              alt={variant.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-gray-400">
              <svg
                className="w-10 h-10"
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
          {variant.videoUrl ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-black/55 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : null}
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <h4 className="font-semibold text-sm leading-5 text-[#101828]">
            {variant.title}
          </h4>
          <p className="text-xs leading-4 text-[#475467]">
            {showFullDescription ? variant.description : truncateText(variant.description, 150)}
            {descriptionTruncated && !showFullDescription && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(true);
                }}
                className="text-[#5207CD] hover:underline ml-1 font-medium"
              >
                Read more
              </button>
            )}
            {showFullDescription && descriptionTruncated && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(false);
                }}
                className="text-[#5207CD] hover:underline ml-1 font-medium"
              >
                Show less
              </button>
            )}
          </p>
          {/* Show quote info for testimonial/employer-brand, otherwise show linkDescription */}
          {(variant?.adTypeId === 'testimonial' || variant?.adTypeId === 'employer-brand') && variant.quoteAuthorName ? (
            <p className="text-xs leading-4 text-[#667085] truncate mt-0.5">
              — {variant.quoteAuthorName}{variant.quoteAuthorPosition ? `, ${variant.quoteAuthorPosition}` : ''}
            </p>
          ) : variant.linkDescription ? (
            <p className="text-xs leading-4 text-[#667085] truncate mt-0.5">
              {variant.linkDescription}
            </p>
          ) : null}
        </div>
      </div>

      {/* Action Buttons - With text labels */}
      <div className="flex items-center w-full">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onReplace();
          }}
          title="Replace image"
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium text-[#344054] bg-white hover:bg-gray-50 border border-[#d0d5dd] rounded-l-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 16L8 11L11 14L16 9L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Image</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
          }}
          title="Edit"
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium text-[#344054] bg-white hover:bg-gray-50 border-t border-b border-[#d0d5dd] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path
              d="M8.25 3H3C2.58579 3 2.25 3.33579 2.25 3.75V15C2.25 15.4142 2.58579 15.75 3 15.75H14.25C14.6642 15.75 15 15.4142 15 15V9.75M13.7197 2.21967C14.0126 1.92678 14.4874 1.92678 14.7803 2.21967L15.7803 3.21967C16.0732 3.51256 16.0732 3.98744 15.7803 4.28033L8.03033 12.0303C7.88968 12.171 7.69891 12.25 7.5 12.25H5.25V10L13.7197 2.21967Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onDownload && !isDownloading) onDownload();
          }}
          disabled={isDownloading}
          title={isDownloading ? "Download in progress..." : "Download"}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium border-t border-b border-l border-[#d0d5dd] transition-colors ${isDownloading
            ? "text-[#98a2b3] bg-gray-100 cursor-not-allowed"
            : "text-[#344054] bg-white hover:bg-gray-50"
            }`}
        >
          {isDownloading ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2.25V11.25M9 11.25L5.25 7.5M9 11.25L12.75 7.5M2.25 12.75V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V12.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="hidden sm:inline">{isDownloading ? "Recording..." : "Download"}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
          title="Delete"
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium text-[#d92d20] bg-white hover:bg-red-50 border border-[#d0d5dd] rounded-r-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path
              d="M12 4.5V3.75C12 2.92157 11.3284 2.25 10.5 2.25H7.5C6.67157 2.25 6 2.92157 6 3.75V4.5M14.25 4.5V14.25C14.25 15.0784 13.5784 15.75 12.75 15.75H5.25C4.42157 15.75 3.75 15.0784 3.75 14.25V4.5M2.25 4.5H15.75M7.5 8.25V12M10.5 8.25V12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {/* Approved Badge */}
      {variant.approved && (
        <div className="absolute top-2 left-4 bg-[#0a8f63] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          ✓ Approved
        </div>
      )}
    </div>
  );
}
