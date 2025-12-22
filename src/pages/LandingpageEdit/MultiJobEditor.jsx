import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, Input, Select, message, Spin, Empty, Skeleton, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectUser } from "../../redux/auth/selectors.js";
import CrudService from "../../services/CrudService.js";
import AiService from "../../services/AiService.js";
import {
    Briefcase, MapPin, Building2, Clock, DollarSign,
    ChevronRight, Plus, X, Sparkles, Trash2, GripVertical,
    Eye, Edit3, ExternalLink, Search, CheckCircle2, Save,
    ArrowLeft, Settings, Layers
} from "lucide-react";
import AIEditModal from "../Dashboard/Vacancies/AIEditModal.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const { TextArea } = Input;
const { Option } = Select;

/**
 * MultiJobEditor - Editor component for multi-job campaigns
 * Allows editing hero content, managing linked campaigns, and AI generation
 */
const MultiJobEditor = ({
    landingPageData,
    setLandingPageData,
    onSave,
    saving = false
}) => {
    const router = useRouter();
    const user = useSelector(selectUser);

    // Local edit state
    const [heroTitle, setHeroTitle] = useState(landingPageData?.multiJobHeroTitle || "");
    const [heroDescription, setHeroDescription] = useState(landingPageData?.heroDescription || "");
    const [jobsSectionTitle, setJobsSectionTitle] = useState(landingPageData?.jobsSectionTitle || "Our Open Positions");
    const [jobsSectionDescription, setJobsSectionDescription] = useState(landingPageData?.jobsSectionDescription || "");

    // Linked campaigns state
    const [linkedCampaignIds, setLinkedCampaignIds] = useState(landingPageData?.linkedCampaigns || []);
    const [linkedCampaigns, setLinkedCampaigns] = useState([]);
    const [loadingLinked, setLoadingLinked] = useState(false);

    // Available campaigns for adding
    const [availableCampaigns, setAvailableCampaigns] = useState([]);
    const [loadingAvailable, setLoadingAvailable] = useState(false);
    const [addCampaignModalOpen, setAddCampaignModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // AI state
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiGenerating, setAiGenerating] = useState(false);

    // Active editor section
    const [activeSection, setActiveSection] = useState("hero");

    // Has unsaved changes
    const [hasChanges, setHasChanges] = useState(false);

    // Sync local state with landingPageData
    useEffect(() => {
        setHeroTitle(landingPageData?.multiJobHeroTitle || landingPageData?.vacancyTitle || "");
        setHeroDescription(landingPageData?.heroDescription || "");
        setJobsSectionTitle(landingPageData?.jobsSectionTitle || "Our Open Positions");
        setJobsSectionDescription(landingPageData?.jobsSectionDescription || "");
        setLinkedCampaignIds(landingPageData?.linkedCampaigns || []);
    }, [landingPageData]);

    // Fetch linked campaigns data
    useEffect(() => {
        const fetchLinkedCampaigns = async () => {
            if (!linkedCampaignIds?.length) {
                setLinkedCampaigns([]);
                return;
            }

            setLoadingLinked(true);
            try {
                const response = await CrudService.search("LandingPageData", 100, 1, {
                    filters: { _id: { $in: linkedCampaignIds } }
                });

                // Sort by the order in linkedCampaignIds
                const campaignsMap = {};
                response.data.items.forEach(c => campaignsMap[c._id] = c);
                const sorted = linkedCampaignIds.map(id => campaignsMap[id]).filter(Boolean);

                setLinkedCampaigns(sorted);
            } catch (error) {
                console.error("Error fetching linked campaigns:", error);
            } finally {
                setLoadingLinked(false);
            }
        };

        fetchLinkedCampaigns();
    }, [linkedCampaignIds]);

    // Fetch available campaigns for adding
    const fetchAvailableCampaigns = useCallback(async () => {
        setLoadingAvailable(true);
        try {
            const filters = {
                campaignType: { $ne: "multi" },
                _id: { $nin: linkedCampaignIds }
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
            console.error("Error fetching available campaigns:", error);
        } finally {
            setLoadingAvailable(false);
        }
    }, [user, linkedCampaignIds]);

    useEffect(() => {
        if (addCampaignModalOpen) {
            fetchAvailableCampaigns();
        }
    }, [addCampaignModalOpen, fetchAvailableCampaigns]);

    // Filter available campaigns
    const filteredAvailable = useMemo(() => {
        if (!searchQuery.trim()) return availableCampaigns;
        const query = searchQuery.toLowerCase();
        return availableCampaigns.filter(c =>
            c.vacancyTitle?.toLowerCase().includes(query) ||
            c.department?.toLowerCase().includes(query)
        );
    }, [availableCampaigns, searchQuery]);

    // Handle updates
    const handleFieldChange = (field, value) => {
        setHasChanges(true);

        switch (field) {
            case "heroTitle":
                setHeroTitle(value);
                setLandingPageData(prev => ({ ...prev, multiJobHeroTitle: value, vacancyTitle: value }));
                break;
            case "heroDescription":
                setHeroDescription(value);
                setLandingPageData(prev => ({ ...prev, heroDescription: value }));
                break;
            case "jobsSectionTitle":
                setJobsSectionTitle(value);
                setLandingPageData(prev => ({ ...prev, jobsSectionTitle: value }));
                break;
            case "jobsSectionDescription":
                setJobsSectionDescription(value);
                setLandingPageData(prev => ({ ...prev, jobsSectionDescription: value }));
                break;
        }
    };

    // Add campaign to linked list
    const handleAddCampaign = (campaignId) => {
        const newLinked = [...linkedCampaignIds, campaignId];
        setLinkedCampaignIds(newLinked);
        setLandingPageData(prev => ({ ...prev, linkedCampaigns: newLinked }));
        setHasChanges(true);
        setAddCampaignModalOpen(false);
    };

    // Remove campaign from linked list
    const handleRemoveCampaign = (campaignId) => {
        const newLinked = linkedCampaignIds.filter(id => id !== campaignId);
        setLinkedCampaignIds(newLinked);
        setLandingPageData(prev => ({ ...prev, linkedCampaigns: newLinked }));
        setHasChanges(true);
    };

    // Reorder campaigns via drag and drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(linkedCampaignIds);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);

        setLinkedCampaignIds(items);
        setLandingPageData(prev => ({ ...prev, linkedCampaigns: items }));
        setHasChanges(true);
    };

    // AI Content Generation
    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) {
            message.warning("Please describe what you want to generate");
            return;
        }

        setAiGenerating(true);
        try {
            const linkedJobTitles = linkedCampaigns.map(c => c.vacancyTitle).join(", ");
            const departments = [...new Set(linkedCampaigns.map(c => c.department).filter(Boolean))].join(", ");

            // Determine the job category/group for focused messaging
            const jobCategory = departments || "careers";

            const prompt = `Generate employer brand content for a multi-job career page.

IMPORTANT: This is a MULTI-JOB CAMPAIGN page. Focus on the JOB GROUP/CATEGORY, not individual job titles.
- If it's sales roles: Write about what ${landingPageData?.companyName || "the company"} does for SALES people (commission, bonuses, competitions, training)
- If it's tech roles: Write about engineering culture, tech stack, innovation
- If it's customer service: Write about customer success culture, growth paths
- The "About the Company" content should be specifically written for THIS job category's audience

User request: ${aiPrompt}

Company: ${landingPageData?.companyName || user?.companyName || "Company"}
Job Category/Department Focus: ${jobCategory}
${linkedJobTitles ? `Example positions in this category: ${linkedJobTitles}` : ""}

Generate branded, category-specific content in ${landingPageData?.lang || "English"}:
1. heroTitle: An inspiring headline for ${jobCategory} careers (max 60 chars)
2. heroDescription: Why ${jobCategory} professionals should join - what does the company DO for these people? Include specifics like training, growth, culture, perks relevant to this job category (150-200 words)
3. jobsSectionTitle: A title for the jobs listing section (max 40 chars)
4. jobsSectionDescription: Brief intro text for the jobs section (1-2 sentences)
5. companyInfo: About the company section written specifically for ${jobCategory} candidates - what makes this company great for them? (100-150 words)

Respond in JSON format only:
{
  "heroTitle": "...",
  "heroDescription": "...",
  "jobsSectionTitle": "...",
  "jobsSectionDescription": "...",
  "companyInfo": "..."
}`;

            const response = await AiService.generateSectionContent({
                sectionName: "multiJobHero",
                prompt,
                fields: [
                    { key: "heroTitle", label: "Hero Title", type: "text", maxLength: 60 },
                    { key: "heroDescription", label: "Hero Description", type: "textarea", maxLength: 500 },
                    { key: "jobsSectionTitle", label: "Jobs Section Title", type: "text", maxLength: 40 },
                    { key: "jobsSectionDescription", label: "Jobs Section Description", type: "text", maxLength: 150 },
                    { key: "companyInfo", label: "About Company (for this job category)", type: "textarea", maxLength: 500 }
                ],
                vacancyContext: {
                    title: landingPageData?.vacancyTitle,
                    companyInfo: landingPageData?.companyName || user?.companyName,
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

            // Apply AI-generated content
            if (result.heroTitle) handleFieldChange("heroTitle", result.heroTitle);
            if (result.heroDescription) handleFieldChange("heroDescription", result.heroDescription);
            if (result.jobsSectionTitle) handleFieldChange("jobsSectionTitle", result.jobsSectionTitle);
            if (result.jobsSectionDescription) handleFieldChange("jobsSectionDescription", result.jobsSectionDescription);
            if (result.companyInfo) {
                setLandingPageData(prev => ({ ...prev, companyInfo: result.companyInfo }));
                setHasChanges(true);
            }

            message.success("Content generated successfully!");
            setAiModalOpen(false);
            setAiPrompt("");
        } catch (error) {
            console.error("AI generation error:", error);
            message.error("Failed to generate content. Please try again.");
        } finally {
            setAiGenerating(false);
        }
    };

    // Get salary display helper
    const getSalaryDisplay = (job) => {
        if (!job.salaryMin && !job.salaryMax) return null;
        const currency = job.salaryCurrency || "EUR";
        const time = job.salaryTime || "Month";
        if (job.salaryRange && job.salaryMin && job.salaryMax) {
            return `${currency} ${parseInt(job.salaryMin).toLocaleString()} - ${parseInt(job.salaryMax).toLocaleString()} / ${time}`;
        }
        if (job.salaryMin) {
            return `${currency} ${parseInt(job.salaryMin).toLocaleString()} / ${time}`;
        }
        return null;
    };

    return (
        <div className="flex h-full">
            {/* Left Sidebar - Navigation */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-900">Multi-Job Editor</h2>
                    <p className="text-xs text-gray-500 mt-1">Career page with multiple positions</p>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    <button
                        onClick={() => setActiveSection("hero")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === "hero"
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        Hero Section
                    </button>

                    <button
                        onClick={() => setActiveSection("jobs")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === "jobs"
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Layers className="w-4 h-4" />
                        Linked Jobs
                        <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {linkedCampaigns.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveSection("recruiter")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === "recruiter"
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        Recruiter Contact
                    </button>

                    <button
                        onClick={() => setActiveSection("about")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === "about"
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        About Company
                    </button>

                    <button
                        onClick={() => setActiveSection("settings")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === "settings"
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </nav>

                {/* AI Assistant Button */}
                <div className="p-3 border-t">
                    <button
                        onClick={() => setAiModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Assistant
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Hero Section Editor */}
                    {activeSection === "hero" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hero Title
                                        </label>
                                        <Input
                                            size="large"
                                            placeholder="Join Our Amazing Team"
                                            value={heroTitle}
                                            onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
                                            className="rounded-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            The main headline displayed on your career page
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hero Description
                                        </label>
                                        <TextArea
                                            placeholder="Describe why candidates should join your company..."
                                            value={heroDescription}
                                            onChange={(e) => handleFieldChange("heroDescription", e.target.value)}
                                            rows={5}
                                            className="rounded-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            A compelling paragraph about your company and culture
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs Section</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Section Title
                                        </label>
                                        <Input
                                            placeholder="Our Open Positions"
                                            value={jobsSectionTitle}
                                            onChange={(e) => handleFieldChange("jobsSectionTitle", e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Section Description
                                        </label>
                                        <Input
                                            placeholder="Find your perfect role..."
                                            value={jobsSectionDescription}
                                            onChange={(e) => handleFieldChange("jobsSectionDescription", e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Linked Jobs Editor */}
                    {activeSection === "jobs" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Linked Job Campaigns</h3>
                                    <p className="text-sm text-gray-500">
                                        Drag to reorder. These will appear on your career page.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAddCampaignModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Jobs
                                </button>
                            </div>

                            {loadingLinked ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white rounded-xl p-4">
                                            <Skeleton active />
                                        </div>
                                    ))}
                                </div>
                            ) : linkedCampaigns.length === 0 ? (
                                <Empty
                                    description="No jobs linked yet"
                                    className="bg-white rounded-xl py-12"
                                >
                                    <button
                                        onClick={() => setAddCampaignModalOpen(true)}
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                                    >
                                        Add Your First Job
                                    </button>
                                </Empty>
                            ) : (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="linked-jobs">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-3"
                                            >
                                                {linkedCampaigns.map((campaign, index) => (
                                                    <Draggable
                                                        key={campaign._id}
                                                        draggableId={campaign._id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${snapshot.isDragging ? "shadow-lg border-indigo-300" : "border-transparent"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    {/* Drag handle */}
                                                                    <div
                                                                        {...provided.dragHandleProps}
                                                                        className="text-gray-400 hover:text-gray-600 cursor-grab"
                                                                    >
                                                                        <GripVertical className="w-5 h-5" />
                                                                    </div>

                                                                    {/* Thumbnail */}
                                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                        {campaign.heroImage ? (
                                                                            <img
                                                                                src={campaign.heroImage}
                                                                                alt={campaign.vacancyTitle}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <Briefcase className="w-6 h-6 text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-gray-900 truncate">
                                                                            {campaign.vacancyTitle || "Untitled"}
                                                                        </h4>
                                                                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                                            {campaign.department && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Building2 className="w-3 h-3" />
                                                                                    {campaign.department}
                                                                                </span>
                                                                            )}
                                                                            {campaign.location?.[0] && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <MapPin className="w-3 h-3" />
                                                                                    {campaign.location[0]}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Status & Actions */}
                                                                    <div className="flex items-center gap-2">
                                                                        {campaign.published ? (
                                                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                                                Live
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                                Draft
                                                                            </span>
                                                                        )}

                                                                        <Tooltip title="Edit job">
                                                                            <button
                                                                                onClick={() => window.open(`/edit-page/${campaign._id}`, '_blank')}
                                                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                                                            >
                                                                                <ExternalLink className="w-4 h-4" />
                                                                            </button>
                                                                        </Tooltip>

                                                                        <Tooltip title="Remove from campaign">
                                                                            <button
                                                                                onClick={() => handleRemoveCampaign(campaign._id)}
                                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                        </div>
                    )}

                    {/* Recruiter Contact Editor */}
                    {activeSection === "recruiter" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Contact Section</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Add section title and description for the recruiter contact area.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Section Title
                                        </label>
                                        <Input
                                            placeholder="Meet the Team"
                                            value={landingPageData?.recruiterContactTitle || ""}
                                            onChange={(e) => {
                                                setLandingPageData(prev => ({ ...prev, recruiterContactTitle: e.target.value }));
                                                setHasChanges(true);
                                            }}
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Section Description
                                        </label>
                                        <Input
                                            placeholder="Have questions? Our talent team is here to help..."
                                            value={landingPageData?.recruiterContactText || ""}
                                            onChange={(e) => {
                                                setLandingPageData(prev => ({ ...prev, recruiterContactText: e.target.value }));
                                                setHasChanges(true);
                                            }}
                                            className="rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Add your recruiters and talent team members.
                                </p>

                                <div className="space-y-4">
                                    {(landingPageData?.recruiters || []).map((recruiter, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Recruiter {index + 1}</span>
                                                <button
                                                    onClick={() => {
                                                        const newRecruiters = (landingPageData?.recruiters || []).filter((_, i) => i !== index);
                                                        setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                                        setHasChanges(true);
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input
                                                    placeholder="Full Name"
                                                    value={recruiter.recruiterFullname || ""}
                                                    onChange={(e) => {
                                                        const newRecruiters = [...(landingPageData?.recruiters || [])];
                                                        newRecruiters[index] = { ...newRecruiters[index], recruiterFullname: e.target.value };
                                                        setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                                        setHasChanges(true);
                                                    }}
                                                    className="rounded-lg"
                                                />
                                                <Input
                                                    placeholder="Role (e.g., Talent Acquisition)"
                                                    value={recruiter.recruiterRole || ""}
                                                    onChange={(e) => {
                                                        const newRecruiters = [...(landingPageData?.recruiters || [])];
                                                        newRecruiters[index] = { ...newRecruiters[index], recruiterRole: e.target.value };
                                                        setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                                        setHasChanges(true);
                                                    }}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input
                                                    placeholder="Email"
                                                    value={recruiter.recruiterEmail || ""}
                                                    onChange={(e) => {
                                                        const newRecruiters = [...(landingPageData?.recruiters || [])];
                                                        newRecruiters[index] = { ...newRecruiters[index], recruiterEmail: e.target.value };
                                                        setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                                        setHasChanges(true);
                                                    }}
                                                    className="rounded-lg"
                                                />
                                                <Input
                                                    placeholder="Phone (optional)"
                                                    value={recruiter.recruiterPhone || ""}
                                                    onChange={(e) => {
                                                        const newRecruiters = [...(landingPageData?.recruiters || [])];
                                                        newRecruiters[index] = { ...newRecruiters[index], recruiterPhone: e.target.value };
                                                        setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                                        setHasChanges(true);
                                                    }}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <Input
                                                placeholder="Profile Image URL"
                                                value={recruiter.recruiterImage || ""}
                                                onChange={(e) => {
                                                    const newRecruiters = [...(landingPageData?.recruiters || [])];
                                                    newRecruiters[index] = { ...newRecruiters[index], recruiterImage: e.target.value };
                                                    setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                                    setHasChanges(true);
                                                }}
                                                className="rounded-lg"
                                            />
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            const newRecruiters = [...(landingPageData?.recruiters || []), {
                                                recruiterFullname: "",
                                                recruiterRole: "",
                                                recruiterEmail: "",
                                                recruiterPhone: "",
                                                recruiterImage: "",
                                            }];
                                            setLandingPageData(prev => ({ ...prev, recruiters: newRecruiters }));
                                            setHasChanges(true);
                                        }}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Team Member
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About Company Editor */}
                    {activeSection === "about" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Tell candidates about your company culture and what makes you special.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Description
                                        </label>
                                        <TextArea
                                            placeholder="At our company, we believe in..."
                                            value={landingPageData?.companyInfo || ""}
                                            onChange={(e) => {
                                                setLandingPageData(prev => ({ ...prev, companyInfo: e.target.value }));
                                                setHasChanges(true);
                                            }}
                                            rows={6}
                                            className="rounded-lg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Focus on what this job group (e.g., sales, engineering) will experience
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Facts</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Highlight key facts that make your company attractive to candidates.
                                </p>

                                <div className="space-y-3">
                                    {(landingPageData?.facts || []).map((fact, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Input
                                                value={fact.emoji || ""}
                                                onChange={(e) => {
                                                    const newFacts = [...(landingPageData?.facts || [])];
                                                    newFacts[index] = { ...newFacts[index], emoji: e.target.value };
                                                    setLandingPageData(prev => ({ ...prev, facts: newFacts }));
                                                    setHasChanges(true);
                                                }}
                                                className="w-16 rounded-lg text-center"
                                                placeholder="🎯"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    value={fact.title || ""}
                                                    onChange={(e) => {
                                                        const newFacts = [...(landingPageData?.facts || [])];
                                                        newFacts[index] = { ...newFacts[index], title: e.target.value };
                                                        setLandingPageData(prev => ({ ...prev, facts: newFacts }));
                                                        setHasChanges(true);
                                                    }}
                                                    placeholder="Title"
                                                    className="rounded-lg"
                                                />
                                                <Input
                                                    value={fact.description || ""}
                                                    onChange={(e) => {
                                                        const newFacts = [...(landingPageData?.facts || [])];
                                                        newFacts[index] = { ...newFacts[index], description: e.target.value };
                                                        setLandingPageData(prev => ({ ...prev, facts: newFacts }));
                                                        setHasChanges(true);
                                                    }}
                                                    placeholder="Description"
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newFacts = (landingPageData?.facts || []).filter((_, i) => i !== index);
                                                    setLandingPageData(prev => ({ ...prev, facts: newFacts }));
                                                    setHasChanges(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            const newFacts = [...(landingPageData?.facts || []), { emoji: "✨", title: "", description: "" }];
                                            setLandingPageData(prev => ({ ...prev, facts: newFacts }));
                                            setHasChanges(true);
                                        }}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Fact
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {activeSection === "settings" && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <Select
                                        size="large"
                                        value={landingPageData?.lang || "English"}
                                        onChange={(value) => setLandingPageData(prev => ({ ...prev, lang: value }))}
                                        className="w-full"
                                    >
                                        {["English", "German", "Dutch", "French", "Spanish", "Italian", "Portuguese", "Polish", "Turkish", "Arabic"].map(lang => (
                                            <Option key={lang} value={lang}>{lang}</Option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Footer Text
                                    </label>
                                    <Input
                                        value={landingPageData?.createdWithText || "Created with HireLab"}
                                        onChange={(e) => setLandingPageData(prev => ({ ...prev, createdWithText: e.target.value }))}
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Campaign Modal */}
            <Modal
                open={addCampaignModalOpen}
                onCancel={() => setAddCampaignModalOpen(false)}
                title="Add Job Campaigns"
                footer={null}
                width={600}
            >
                <div className="mt-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            size="large"
                            placeholder="Search campaigns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-lg"
                        />
                    </div>

                    {/* Available campaigns list */}
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                        {loadingAvailable ? (
                            <div className="flex justify-center py-8">
                                <Spin />
                            </div>
                        ) : filteredAvailable.length === 0 ? (
                            <Empty
                                description={
                                    availableCampaigns.length === 0
                                        ? "No more campaigns available to add"
                                        : "No campaigns match your search"
                                }
                            />
                        ) : (
                            filteredAvailable.map(campaign => (
                                <div
                                    key={campaign._id}
                                    onClick={() => handleAddCampaign(campaign._id)}
                                    className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-indigo-500 hover:shadow-sm cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {campaign.heroImage ? (
                                                <img
                                                    src={campaign.heroImage}
                                                    alt={campaign.vacancyTitle}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Briefcase className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {campaign.vacancyTitle || "Untitled"}
                                            </h4>
                                            <div className="flex gap-3 text-xs text-gray-500">
                                                {campaign.department && (
                                                    <span>{campaign.department}</span>
                                                )}
                                                {campaign.location?.[0] && (
                                                    <span>{campaign.location[0]}</span>
                                                )}
                                            </div>
                                        </div>

                                        <Plus className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>

            {/* AI Generation Modal */}
            <Modal
                open={aiModalOpen}
                onCancel={() => setAiModalOpen(false)}
                title={
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        AI Content Assistant
                    </div>
                }
                footer={null}
                width={500}
            >
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-600">
                        Describe your company, culture, or what makes you special.
                        AI will generate compelling career page content.
                    </p>

                    <TextArea
                        placeholder="e.g., We're a fast-growing tech startup focused on AI solutions. We value innovation, collaboration, and work-life balance..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={4}
                        className="rounded-lg"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setAiModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAIGenerate}
                            disabled={aiGenerating || !aiPrompt.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {aiGenerating ? (
                                <>
                                    <Spin size="small" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MultiJobEditor;

