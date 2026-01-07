import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "antd";

/**
 * Configuration for all available variant templates.
 * mediaType: "image" | "video" | "both" - controls what media can be uploaded
 */
export const VARIANT_TEMPLATES = {
    job: [
        {
            variantNumber: 1,
            name: "Classic",
            description: "Clean, professional layout with prominent CTA",
            mediaType: "image",
        },
        {
            variantNumber: 2,
            name: "Bold",
            description: "Eye-catching design with strong visual hierarchy",
            mediaType: "image",
        },
        {
            variantNumber: 3,
            name: "Modern",
            description: "Contemporary style with gradient overlay",
            mediaType: "image",
        },
        {
            variantNumber: 4,
            name: "Industrial",
            description: "Simplistic style",
            mediaType: "image",
        },
    ],
    "employer-brand": [
        {
            variantNumber: 1,
            name: "Culture Focus",
            description: "Highlight your company culture and values",
            mediaType: "image",
        },
    ],
    company: [
        {
            variantNumber: 1,
            name: "Company Story",
            description: "Tell your company's story with visuals",
            mediaType: "both",
        },
    ],
    testimonial: [
        {
            variantNumber: 1,
            name: "Employee Spotlight",
            description: "Feature employee testimonials",
            mediaType: "image",
        },
    ],
    retargeting: [
        {
            variantNumber: 1,
            name: "Re-engage",
            description: "Bring back interested candidates",
            mediaType: "image",
        },
    ],
};

/**
 * Get the media type allowed for a specific variant
 */
export function getVariantMediaType(adTypeId, variantNumber) {
    const templates = VARIANT_TEMPLATES[adTypeId] || [];
    const template = templates.find((t) => t.variantNumber === variantNumber);
    return template?.mediaType || "image";
}

// Placeholder image for preview
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60";

// Raw template preview - renders just the ad component without phone frames
function RawTemplatePreview({ variantNumber, adTypeId, variant, brandData, landingPageData }) {
    const [TemplateComponent, setTemplateComponent] = useState(null);

    useEffect(() => {
        // Dynamically load the square variant component
        const loadComponent = async () => {
            try {
                let module;
                // Load square format for consistent preview
                if (adTypeId === "job") {
                    switch (variantNumber) {
                        case 1:
                            module = await import("./ads/JobAd/Square/Variant1.jsx");
                            break;
                        case 2:
                            module = await import("./ads/JobAd/Square/Variant2.jsx");
                            break;
                        case 3:
                            module = await import("./ads/JobAd/Square/Variant3.jsx");
                            break;
                        case 4:
                            module = await import("./ads/JobAd/Square/Variant4.jsx");
                            break;
                        default:
                            module = await import("./ads/JobAd/Square/Variant1.jsx");
                    }
                } else if (adTypeId === "employer-brand") {
                    module = await import("./ads/EmployerBrand/Square/Variant1.jsx");
                } else if (adTypeId === "company") {
                    module = await import("./ads/AboutCompany/Square/Variant1.jsx");
                } else if (adTypeId === "testimonial") {
                    module = await import("./ads/Testimonial/Square/Variant1.jsx");
                } else if (adTypeId === "retargeting") {
                    module = await import("./ads/Retargeting/Square/Variant1.jsx");
                }

                if (module?.default) {
                    setTemplateComponent(() => module.default);
                }
            } catch (err) {
                console.warn("Failed to load template preview:", err);
            }
        };

        loadComponent();
    }, [variantNumber, adTypeId]);

    if (!TemplateComponent) {
        return (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading...</div>
            </div>
        );
    }

    return (
        <TemplateComponent
            variant={variant}
            brandData={brandData}
            landingPageData={landingPageData}
            showStoryChrome={false}
        />
    );
}

/**
 * Modal to pick a variant template when creating a new creative
 */
export default function VariantPickerModal({
    visible,
    onClose,
    onSelect,
    adTypeId,
    formatId,
    landingPageData,
    isTemplateChange = false,
}) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const templates = useMemo(() => {
        return VARIANT_TEMPLATES[adTypeId] || VARIANT_TEMPLATES.job;
    }, [adTypeId]);

    // Create preview variant data for each template
    const getPreviewVariant = (template) => {
        const brandName = landingPageData?.brandName || landingPageData?.companyName || "Your Company";
        const jobTitle = landingPageData?.jobTitle || landingPageData?.vacancyName || "Join Our Team!";
        const mediaImage = landingPageData?.mediaImages?.[0]?.url || PLACEHOLDER_IMAGE;

        return {
            id: `preview-${template.variantNumber}`,
            variantNumber: template.variantNumber,
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

        const newCreative = {
            id: `${adTypeId}-variant-${Date.now().toString(36)}`,
            variantNumber: selectedTemplate.variantNumber,
            title: "",
            description: "",
            linkDescription: "",
            callToAction: "Apply Now",
            image: "",
            videoUrl: "",
            template: `template-${selectedTemplate.variantNumber}`,
            adTypeId,
            selected: true,
            approved: false,
            source: "Manual",
            mediaType: selectedTemplate.mediaType,
        };

        onSelect(newCreative);
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

            <div className="grid grid-cols-3 gap-4">
                {templates.map((template) => {
                    const previewVariant = getPreviewVariant(template);
                    const isSelected = selectedTemplate?.variantNumber === template.variantNumber;

                    return (
                        <div
                            key={template.variantNumber}
                            onClick={() => setSelectedTemplate(template)}
                            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${isSelected
                                ? "border-[#5207CD] shadow-lg ring-2 ring-[#5207CD]/20"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                }`}
                        >
                            {/* Raw template preview - no phone frame */}
                            <div className="relative overflow-hidden aspect-square">
                                <div
                                    className="absolute"
                                    style={{
                                        width: "1080px",
                                        height: "1080px",
                                        transform: "scale(0.25)",
                                        transformOrigin: "top left",
                                    }}
                                >
                                    <RawTemplatePreview
                                        variantNumber={template.variantNumber}
                                        adTypeId={adTypeId}
                                        variant={previewVariant}
                                        brandData={previewBrandData}
                                        landingPageData={previewLandingPageData}
                                    />
                                </div>
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
