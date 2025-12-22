import React, { useState, useEffect, useMemo } from "react";
import { Modal, Input, Select, message as antdMessage, Spin, Empty } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectUser } from "../../../redux/auth/selectors.js";
import CrudService from "../../../services/CrudService.js";
import AiService from "../../../services/AiService.js";
import UploadService from "../../../services/UploadService.js";
import { refreshUserData } from "../../../utils/userRefresh.js";

const { TextArea } = Input;
const { Option } = Select;

/**
 * MultiJobCampaignModal - Modern, minimalistic wizard for creating multi-job campaigns
 */
const MultiJobCampaignModal = ({
    isOpen,
    onClose,
    onGoBack,
    onRefresh,
    darkMode = false,
    brandingDetails = null
}) => {
    const router = useRouter();
    const user = useSelector(selectUser);

    const [currentStep, setCurrentStep] = useState(0);

    // Form state
    const [campaignTitle, setCampaignTitle] = useState("");
    const [heroTitle, setHeroTitle] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [jobsSectionTitle, setJobsSectionTitle] = useState("Our Open Positions");
    const [jobsSectionDescription, setJobsSectionDescription] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [selectedTemplate, setSelectedTemplate] = useState("1");

    // Linked campaigns
    const [availableCampaigns, setAvailableCampaigns] = useState([]);
    const [selectedCampaigns, setSelectedCampaigns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingCampaigns, setLoadingCampaigns] = useState(false);

    // AI and loading states
    const [isLoading, setIsLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    const languageOptions = [
        "English", "German", "Dutch", "French", "Spanish", "Italian",
        "Portuguese", "Polish", "Turkish", "Arabic", "Chinese", "Japanese"
    ];

    useEffect(() => {
        if (isOpen) {
            fetchAvailableCampaigns();
        }
    }, [isOpen]);

    const fetchAvailableCampaigns = async () => {
        setLoadingCampaigns(true);
        try {
            const filters = {
                campaignType: { $ne: "multi" },
            };

            if (user?.isWorkspaceSession && user?.workspaceId) {
                filters.workspace = user.workspaceId;
            } else {
                filters.user_id = user?._id;
            }

            const response = await CrudService.search("LandingPageData", 100, 1, {
                filters,
                sorters: [{ key: "createdAt", direction: "desc" }]
            });

            setAvailableCampaigns(response.data.items || []);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            antdMessage.error("Failed to load available campaigns");
        } finally {
            setLoadingCampaigns(false);
        }
    };

    const filteredCampaigns = useMemo(() => {
        if (!searchQuery.trim()) return availableCampaigns;

        const query = searchQuery.toLowerCase();
        return availableCampaigns.filter(campaign =>
            campaign.vacancyTitle?.toLowerCase().includes(query) ||
            campaign.department?.toLowerCase().includes(query) ||
            campaign.location?.some(loc => loc?.toLowerCase?.().includes(query))
        );
    }, [availableCampaigns, searchQuery]);

    const toggleCampaignSelection = (campaignId) => {
        setSelectedCampaigns(prev => {
            if (prev.includes(campaignId)) {
                return prev.filter(id => id !== campaignId);
            } else {
                return [...prev, campaignId];
            }
        });
    };

    const selectedCampaignObjects = useMemo(() => {
        return availableCampaigns.filter(c => selectedCampaigns.includes(c._id));
    }, [availableCampaigns, selectedCampaigns]);

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) {
            antdMessage.warning("Please describe your company or hiring campaign");
            return;
        }

        setAiGenerating(true);
        try {
            const selectedJobTitles = selectedCampaignObjects.map(c => c.vacancyTitle).join(", ");
            const departments = [...new Set(selectedCampaignObjects.map(c => c.department).filter(Boolean))].join(", ");

            const prompt = `Generate employer brand content for a multi-job career page.

User's description: ${aiPrompt}

Company: ${brandingDetails?.companyName || user?.companyName || "Company"}
${selectedJobTitles ? `Open Positions: ${selectedJobTitles}` : ""}
${departments ? `Departments: ${departments}` : ""}

Generate the following in ${selectedLanguage}:
1. heroTitle: An inspiring headline for the career page (max 60 chars)
2. heroDescription: A compelling paragraph about why candidates should join (150-200 words)
3. jobsSectionTitle: A title for the jobs listing section (max 40 chars)
4. jobsSectionDescription: Brief intro text for the jobs section (1-2 sentences)

Respond in JSON format only:
{
  "heroTitle": "...",
  "heroDescription": "...",
  "jobsSectionTitle": "...",
  "jobsSectionDescription": "..."
}`;

            const response = await AiService.generateSectionContent({
                sectionName: "multiJobHero",
                prompt,
                fields: [
                    { key: "heroTitle", label: "Hero Title", type: "text", maxLength: 60 },
                    { key: "heroDescription", label: "Hero Description", type: "textarea", maxLength: 500 },
                    { key: "jobsSectionTitle", label: "Jobs Section Title", type: "text", maxLength: 40 },
                    { key: "jobsSectionDescription", label: "Jobs Section Description", type: "text", maxLength: 150 }
                ],
                vacancyContext: {
                    title: campaignTitle,
                    companyInfo: brandingDetails?.companyName || user?.companyName,
                }
            });

            let result = response.data?.data?.content || response.data?.content;
            if (typeof result === "string") {
                result = result.replace(/```json/g, "").replace(/```/g, "").trim();
                const firstBrace = result.indexOf("{");
                const lastBrace = result.lastIndexOf("}");
                if (firstBrace >= 0 && lastBrace >= 0) {
                    result = result.substring(firstBrace, lastBrace + 1);
                }
                result = JSON.parse(result);
            }

            if (result.heroTitle) setHeroTitle(result.heroTitle);
            if (result.heroDescription) setHeroDescription(result.heroDescription);
            if (result.jobsSectionTitle) setJobsSectionTitle(result.jobsSectionTitle);
            if (result.jobsSectionDescription) setJobsSectionDescription(result.jobsSectionDescription);

            antdMessage.success("Content generated!");
        } catch (error) {
            console.error("AI generation error:", error);
            antdMessage.error("Failed to generate content. Please try again.");
        } finally {
            setAiGenerating(false);
        }
    };

    const handleCreateCampaign = async () => {
        if (!campaignTitle.trim()) {
            antdMessage.warning("Please enter a campaign title");
            return;
        }

        if (selectedCampaigns.length === 0) {
            antdMessage.warning("Please select at least one job campaign to link");
            return;
        }

        setIsLoading(true);
        try {
            // Multi-job campaign default sections:
            // Hero (Flexible) → Jobs Recommendation → Recruiter Contacts → About the Company → Company Facts → Testimonials
            const multiJobMenuItems = [
                {
                    id: "linked-jobs",
                    key: "Linked Jobs",
                    label: "Our Open Positions",
                    active: true,
                    visible: true,
                    sort: 1
                },
                {
                    id: "recruiter-contact",
                    key: "Recruiter Contact",
                    label: "Meet the Team",
                    active: true,
                    visible: true,
                    sort: 2
                },
                {
                    id: "about-company",
                    key: "About The Company",
                    label: "About Us",
                    active: true,
                    visible: true,
                    sort: 3
                },
                {
                    id: "company-facts",
                    key: "Company Facts",
                    label: "Why Join Us",
                    active: true,
                    visible: true,
                    sort: 4
                },
                {
                    id: "testimonials",
                    key: "Employee Testimonials",
                    label: "What Our Team Says",
                    active: true,
                    visible: true,
                    sort: 5
                },
            ];

            // Fetch hero image from Unsplash based on campaign/company context
            let heroImage = "";
            try {
                const companyName = brandingDetails?.companyName || user?.companyName || "";
                const searchQuery = `${campaignTitle} ${companyName} careers team office`.trim();
                console.log(`MultiJobCampaignModal: Searching Unsplash with query: "${searchQuery}"`);

                const imageResponse = await AiService.searchUnsplash(searchQuery, 3);

                if (imageResponse?.data?.success && imageResponse.data.data?.length > 0) {
                    // Get a random image from the results for variety
                    const randomIndex = Math.floor(Math.random() * imageResponse.data.data.length);
                    const selectedImage = imageResponse.data.data[randomIndex];

                    // Upload to Cloudinary
                    console.log("MultiJobCampaignModal: Uploading Unsplash image to Cloudinary...");
                    const uploadRes = await UploadService.upload(selectedImage.url, 10);
                    if (uploadRes?.data?.secure_url) {
                        heroImage = uploadRes.data.secure_url;
                        console.log("MultiJobCampaignModal: Image uploaded successfully:", heroImage);
                    }
                }
            } catch (imgError) {
                console.error("MultiJobCampaignModal: Failed to fetch/upload hero image:", imgError);
                // Continue without hero image - user can add one later
            }

            const companyName = brandingDetails?.companyName || user?.companyName || "Our Company";

            const campaignData = {
                campaignType: "multi",
                vacancyTitle: campaignTitle,
                multiJobHeroTitle: heroTitle || campaignTitle,
                heroDescription: heroDescription || `Explore exciting career opportunities at ${companyName}`,
                heroImage, // Dynamic Unsplash image
                jobsSectionTitle,
                jobsSectionDescription,
                linkedCampaigns: selectedCampaigns,
                lang: selectedLanguage,
                language: selectedLanguage,
                templateId: selectedTemplate,
                menuItems: multiJobMenuItems,
                companyName,
                companyUrl: brandingDetails?.companyUrl || user?.companyUrl,
                companyLogo: brandingDetails?.companyLogo || user?.companyLogo,
                primaryColor: brandingDetails?.primaryColor || user?.primaryColor,
                secondaryColor: brandingDetails?.secondaryColor || user?.secondaryColor,
                tertiaryColor: brandingDetails?.tertiaryColor || user?.tertiaryColor,
                selectedFont: brandingDetails?.selectedFont || user?.selectedFont,
                titleFont: brandingDetails?.titleFont || user?.titleFont,
                subheaderFont: brandingDetails?.subheaderFont || user?.subheaderFont,
                bodyFont: brandingDetails?.bodyFont || user?.bodyFont,
                user_id: user?._id,
                workspace: user?.isWorkspaceSession ? user.workspaceId : undefined,
                // For multi-job campaigns, use URL apply type (candidates apply on individual job pages)
                applyType: 'url',
                cta2Link: '#linked-jobs',
                // No form needed for multi-job career pages
                form: { title: "", fields: [] },

                // Default Recruiter Contact section
                recruiterContactTitle: "Meet the Team",
                recruiterContactText: "Have questions? Our talent team is here to help you find your perfect role.",
                recruiters: user?.fullName || user?.name ? [
                    {
                        recruiterFullname: user?.fullName || user?.name || "",
                        recruiterRole: "Talent Acquisition",
                        recruiterEmail: user?.email || "",
                        recruiterPhone: "",
                        recruiterImage: user?.avatar || "",
                    }
                ] : [],

                // Default About Company section
                aboutTheCompanyTitle: "About Us",
                aboutTheCompanyDescription: `At ${companyName}, we believe in empowering our team members to do their best work. We're committed to creating an inclusive environment where everyone can thrive and grow their careers.`,

                // Default Company Facts section
                facts: [
                    { emoji: "🌍", title: "Global Team", description: "Work with talented people from around the world" },
                    { emoji: "📈", title: "Growth", description: "Continuous learning and career development opportunities" },
                    { emoji: "⚖️", title: "Work-Life Balance", description: "Flexible working arrangements" },
                    { emoji: "💡", title: "Innovation", description: "Be part of cutting-edge projects" },
                ],

                // Default Testimonials section (empty - to be filled)
                testimonials: [],
            };

            // Use CrudService.create directly to ensure menuItems is not overwritten
            const response = await CrudService.create("LandingPageData", campaignData);

            antdMessage.success("Multi-job campaign created!");

            await refreshUserData();
            if (onRefresh) onRefresh();

            router.push(`/edit-page/${response.data.result._id}`);

        } catch (error) {
            console.error("Error creating campaign:", error);
            antdMessage.error(error.response?.data?.message || "Failed to create campaign");
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 0, label: "Details" },
        { id: 1, label: "Jobs" },
        { id: 2, label: "Create" }
    ];

    const canProceed = () => {
        if (currentStep === 0) return campaignTitle.trim().length > 0;
        if (currentStep === 1) return selectedCampaigns.length > 0;
        return true;
    };

    // Step 1: Campaign Details
    const renderStep0 = () => (
        <div className="space-y-6">
            {/* Campaign Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign name
                </label>
                <input
                    type="text"
                    placeholder="e.g., Engineering Careers 2025"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                    This is for your reference only
                </p>
            </div>

            {/* Language */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                </label>
                <Select
                    size="large"
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    className="w-full"
                    style={{ height: 48 }}
                >
                    {languageOptions.map(lang => (
                        <Option key={lang} value={lang}>{lang}</Option>
                    ))}
                </Select>
            </div>

            {/* AI Content Generator */}
            <div className="relative rounded-2xl bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-fuchsia-50/40 p-5 border border-violet-100/60">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                    </div>
                    <span className="font-medium text-violet-800">AI Content Assistant</span>
                </div>

                <textarea
                    placeholder="Describe your company culture, values, or what makes you special..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-violet-100 bg-white/80 focus:border-violet-200 focus:ring-2 focus:ring-violet-50 outline-none transition-all resize-none mb-3"
                />

                <button
                    onClick={handleAIGenerate}
                    disabled={aiGenerating || !aiPrompt.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-xl hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    {aiGenerating ? (
                        <>
                            <Spin size="small" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                            Generate
                        </>
                    )}
                </button>
            </div>

            {/* Hero Content */}
            <div className="grid grid-cols-1 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero headline
                    </label>
                    <input
                        type="text"
                        placeholder="Join Our Amazing Team"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        placeholder="Describe why candidates should join your company..."
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );

    // Step 2: Link Jobs
    const renderStep1 = () => (
        <div className="space-y-5">
            {/* Search */}
            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by job title, department, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                />
            </div>

            {/* Selection counter */}
            {selectedCampaigns.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-violet-50/60 rounded-xl border border-violet-100/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-violet-400 text-white text-xs font-bold flex items-center justify-center">
                            {selectedCampaigns.length}
                        </div>
                        <span className="text-sm font-medium text-violet-600">
                            job{selectedCampaigns.length !== 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedCampaigns([])}
                        className="text-xs text-gray-500 hover:text-violet-600 font-medium transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Campaign List */}
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {loadingCampaigns ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : filteredCampaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">
                            {availableCampaigns.length === 0
                                ? "No single job campaigns found"
                                : "No campaigns match your search"
                            }
                        </p>
                    </div>
                ) : (
                    filteredCampaigns.map(campaign => {
                        const isSelected = selectedCampaigns.includes(campaign._id);
                        return (
                            <div
                                key={campaign._id}
                                onClick={() => toggleCampaignSelection(campaign._id)}
                                className={`
                                    relative p-3.5 rounded-xl cursor-pointer transition-all duration-200
                                    ${isSelected
                                        ? 'bg-violet-50 border-2 border-violet-200 shadow-sm'
                                        : 'bg-white border border-gray-100 hover:border-violet-100 hover:bg-violet-50/30'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3.5">
                                    {/* Thumbnail */}
                                    <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${isSelected ? 'ring-2 ring-violet-200' : ''}`}>
                                        {campaign.heroImage ? (
                                            <img
                                                src={campaign.heroImage}
                                                alt={campaign.vacancyTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium truncate ${isSelected ? 'text-violet-900' : 'text-gray-900'}`}>
                                            {campaign.vacancyTitle || "Untitled Campaign"}
                                        </h4>

                                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs ${isSelected ? 'text-violet-600' : 'text-gray-500'}`}>
                                            {campaign.department && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                                    </svg>
                                                    {campaign.department}
                                                </span>
                                            )}
                                            {campaign.location?.[0] && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                    {campaign.location[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selection indicator */}
                                    <div className="flex-shrink-0">
                                        <div className={`
                                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${isSelected
                                                ? 'bg-violet-500 border-violet-500'
                                                : 'border-gray-300 bg-white'
                                            }
                                        `}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Tip */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100/80">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <p className="text-xs text-amber-700">
                    Selected jobs will appear as cards on your career page. Visitors can click to view full details.
                </p>
            </div>
        </div>
    );

    // Step 3: Review & Create
    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Success Icon */}
            <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-violet-100 mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">Ready to create</h3>
                <p className="text-gray-500 text-sm mt-1">Review your campaign details</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Campaign Name</span>
                    <span className="font-medium text-gray-900">{campaignTitle}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Language</span>
                    <span className="font-medium text-gray-900">{selectedLanguage}</span>
                </div>

                <div className="pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Hero Title</span>
                    <p className="font-medium text-gray-900 mt-1">{heroTitle || campaignTitle}</p>
                </div>

                <div>
                    <span className="text-sm text-gray-500">Linked Jobs ({selectedCampaigns.length})</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCampaignObjects.slice(0, 4).map(campaign => (
                            <span
                                key={campaign._id}
                                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1.5 rounded-lg"
                            >
                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                </svg>
                                {campaign.vacancyTitle?.substring(0, 20)}{campaign.vacancyTitle?.length > 20 ? '...' : ''}
                            </span>
                        ))}
                        {selectedCampaigns.length > 4 && (
                            <span className="text-xs text-gray-500 px-2.5 py-1.5">
                                +{selectedCampaigns.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Button */}
            <button
                onClick={handleCreateCampaign}
                disabled={isLoading}
                className="w-full py-4 bg-violet-500 text-white font-semibold rounded-xl hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-100 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Spin size="small" />
                        <span>Creating...</span>
                    </>
                ) : (
                    <>
                        <span>Create Career Page</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={560}
            centered
            destroyOnClose
            wrapClassName={darkMode ? "dark" : ""}
            closable={true}
            styles={{
                content: {
                    padding: 0,
                    borderRadius: 24,
                    overflow: 'hidden'
                },
                mask: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }
            }}
        >
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={currentStep === 0 ? onGoBack : () => setCurrentStep(prev => prev - 1)}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Multi-Job Career Page
                        </h2>
                        <p className="text-sm text-gray-500">
                            Showcase multiple positions
                        </p>
                    </div>
                </div>

                {/* Step Indicator - Minimal dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-2">
                            <div
                                className={`
                                    h-1.5 rounded-full transition-all duration-300
                                    ${idx < currentStep
                                        ? 'bg-violet-400 w-2'
                                        : idx === currentStep
                                            ? 'bg-violet-500 w-8'
                                            : 'bg-gray-200 w-2'
                                    }
                                `}
                            />
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {currentStep === 0 && renderStep0()}
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                </div>

                {/* Navigation - only show on steps 0 and 1 */}
                {currentStep < 2 && (
                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            disabled={!canProceed()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white font-medium rounded-xl hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span>{currentStep === 1 ? "Review" : "Continue"}</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MultiJobCampaignModal;
