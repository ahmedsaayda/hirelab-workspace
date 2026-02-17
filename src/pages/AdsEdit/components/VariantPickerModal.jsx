import React, { useState, useMemo, useEffect } from "react";
import { Modal, Spin } from "antd";
import TemplateService from "../../../services/TemplateService";

/**
 * Fallback templates when API is unavailable
 * These are used when the backend hasn't been seeded yet
 */
const FALLBACK_TEMPLATES = [
    {
        templateNumber: 1,
        templateId: "clarity",
        name: "Clarity",
        description: "Clean, modern layout with strong typography and a prominent CTA",
        mediaType: "both",
        previewImage: null,
        formats: {
            story: "fd4d3d28-6a72-4f21-b350-939f99472840",
            portrait: "a8e33385-7b60-435d-b9d0-1e9b4c2de3d7",
            square: "af16c58d-96d5-4295-a183-b610b224887e",
        },
    },
];

/**
 * Fetch active templates from the API
 * Returns fallback templates if API fails
 */
async function fetchTemplates() {
    try {
        const response = await TemplateService.getActiveTemplates();
        const templates = response.data;
        
        if (!templates || templates.length === 0) {
            return FALLBACK_TEMPLATES;
        }
        
        // Transform API response to match expected format
        return templates.map((t, index) => ({
            templateNumber: index + 1,
            templateId: t.templateId,
            name: t.name,
            description: t.description,
            mediaType: t.mediaType,
            previewImage: t.previewImage,
            formats: t.formats,
        }));
    } catch (error) {
        console.warn("[VariantPickerModal] Failed to fetch templates, using fallback:", error.message);
        return FALLBACK_TEMPLATES;
    }
}

// Export for use in other components
export const UNIVERSAL_TEMPLATES = FALLBACK_TEMPLATES;

// Legacy support: map old ad-type-specific configs to universal
export const VARIANT_TEMPLATES = {
    job: FALLBACK_TEMPLATES,
    "employer-brand": FALLBACK_TEMPLATES,
    company: FALLBACK_TEMPLATES,
    testimonial: FALLBACK_TEMPLATES,
    retargeting: FALLBACK_TEMPLATES,
};

/**
 * Get the media type allowed for a specific template
 * Now uses universal templates - adTypeId is kept for backwards compatibility but ignored
 */
export function getVariantMediaType(adTypeId, templateNumber) {
    const template = FALLBACK_TEMPLATES.find((t) => t.templateNumber === templateNumber);
    return template?.mediaType || "both";
}

/**
 * Get a template by number
 */
export function getTemplateByNumber(templateNumber) {
    return FALLBACK_TEMPLATES.find((t) => t.templateNumber === templateNumber) || FALLBACK_TEMPLATES[0];
}

import CreatomatPreview from "./CreatomatPreview";

// Placeholder image for preview
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60";

// Raw template preview - uses Creatomate preview for all templates
function RawTemplatePreview({ templateId, variant, brandData, landingPageData }) {
    return (
        <CreatomatPreview
            format="square" // Use square for consistent preview in modal
            variant={variant}
            brandData={brandData}
            landingPageData={landingPageData}
            templateName={templateId || "clarity"}
            className="w-full h-full"
        />
    );
}

/**
 * Modal to pick a template for the ad set (global setting)
 * This applies to ALL creatives within the ad set
 */
export default function VariantPickerModal({
    visible,
    onClose,
    onSelect,
    adTypeId, // Kept for backwards compatibility, but templates are universal
    formatId,
    landingPageData,
    isTemplateChange = false,
    currentTemplateNumber = null, // Currently selected template for the ad set
}) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
    const [loading, setLoading] = useState(false);

    // Fetch templates from API when modal opens
    useEffect(() => {
        if (visible) {
            setLoading(true);
            fetchTemplates()
                .then(setTemplates)
                .finally(() => setLoading(false));
        }
    }, [visible]);

    // Create preview variant data for each template
    const getPreviewVariant = (template) => {
        const brandName = landingPageData?.brandName || landingPageData?.companyName || "Your Company";
        const jobTitle = landingPageData?.jobTitle || landingPageData?.vacancyName || "Join Our Team!";
        const mediaImage = landingPageData?.mediaImages?.[0]?.url || PLACEHOLDER_IMAGE;

        return {
            id: `preview-${template.templateNumber}`,
            templateNumber: template.templateNumber,
            variantNumber: template.templateNumber, // Legacy support
            title: jobTitle,
            description: "Join our amazing team and make an impact. We're looking for talented individuals who share our passion.",
            linkDescription: "Apply today",
            callToAction: "Apply Now",
            image: mediaImage,
            adTypeId,
            approved: false,
            selected: false,
        };
    };

    // Create preview brand data
    const previewBrandData = useMemo(() => ({
        brandName: landingPageData?.brandName || landingPageData?.companyName || "Your Company",
        brandLogo: landingPageData?.brandLogo || "",
        brandColor: landingPageData?.brandColor || landingPageData?.primaryColor || "#5207CD",
        secondaryColor: landingPageData?.secondaryColor || "#ffffff",
    }), [landingPageData]);

    // Create preview landing page data
    const previewLandingPageData = useMemo(() => ({
        ...landingPageData,
        brandName: landingPageData?.brandName || landingPageData?.companyName || "Your Company",
        brandLogo: landingPageData?.brandLogo || "",
        brandColor: landingPageData?.brandColor || landingPageData?.primaryColor || "#5207CD",
        jobTitle: landingPageData?.jobTitle || landingPageData?.vacancyName || "Join Our Team!",
    }), [landingPageData]);

    const handleSelect = () => {
        if (!selectedTemplate) return;

        // For ad set level template selection, return the template info
        // The parent will apply this to all creatives in the ad set
        const templateSelection = {
            templateNumber: selectedTemplate.templateNumber,
            templateId: selectedTemplate.templateId || "clarity", // Creatomate template ID
            templateName: selectedTemplate.name,
            mediaType: selectedTemplate.mediaType,
        };

        onSelect(templateSelection);
        setSelectedTemplate(null);
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#5207CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span>{isTemplateChange ? "Change Template" : "Choose a Template"}</span>
                </div>
            }
            open={visible}
            onCancel={() => {
                setSelectedTemplate(null);
                onClose();
            }}
            width={900}
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setSelectedTemplate(null);
                            onClose();
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSelect}
                        disabled={!selectedTemplate}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${selectedTemplate
                            ? "bg-[#5207CD]"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isTemplateChange ? "Apply Template" : "Create Creative"}
                    </button>
                </div>
            }
            styles={{
                body: { padding: "24px" },
            }}
        >
            <p className="mb-6 text-sm text-gray-600">
                {isTemplateChange
                    ? "Select a new template for this creative. Your content will be preserved."
                    : "Select a template for your new creative. You can customize the content after creation."}
            </p>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Spin size="large" />
                </div>
            ) : (
                <div className={`grid gap-4 ${templates.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : templates.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {templates.map((template) => {
                        const previewVariant = getPreviewVariant(template);
                        const isSelected = selectedTemplate?.templateNumber === template.templateNumber;
                        const isCurrent = currentTemplateNumber === template.templateNumber;

                        return (
                            <div
                                key={template.templateNumber}
                                onClick={() => setSelectedTemplate(template)}
                                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${isSelected
                                    ? "border-[#5207CD] shadow-lg ring-2 ring-[#5207CD]/20"
                                    : isCurrent
                                        ? "border-green-500 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                    }`}
                            >
                                {/* Current template badge */}
                                {isCurrent && !isSelected && (
                                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded-full">
                                        Current
                                    </div>
                                )}
                                {/* Template preview - use previewImage if available, otherwise Creatomate */}
                                <div className="relative overflow-hidden aspect-square bg-gray-100">
                                    {template.previewImage ? (
                                        <img 
                                            src={template.previewImage} 
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <RawTemplatePreview
                                            templateId={template.templateId}
                                            variant={previewVariant}
                                            brandData={previewBrandData}
                                            landingPageData={previewLandingPageData}
                                        />
                                    )}
                                </div>

                                {/* Info bar */}
                                <div className="p-3 bg-white border-t border-gray-100">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">{template.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
                                        </div>
                                    </div>
                                    {/* Media type badge */}
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full">
                                            {template.mediaType === "video" ? (
                                                <>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Video only
                                                </>
                                            ) : template.mediaType === "both" ? (
                                                <>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Image or video
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Image only
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <div className="w-6 h-6 bg-[#5207CD] rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tip */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex gap-2 text-sm text-blue-800">
                    <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        After selecting a template, you'll be able to customize the headline, description, image, and call-to-action.
                    </span>
                </div>
            </div>
        </Modal>
    );
}
