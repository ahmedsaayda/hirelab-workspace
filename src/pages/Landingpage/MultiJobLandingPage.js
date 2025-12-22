import React, { useState, useEffect, useMemo } from "react";
import { Skeleton, Empty } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import CrudService from "../../services/CrudService.js";
import PublicService from "../../services/PublicService.js";
import { Briefcase, MapPin, Building2, Clock, DollarSign, ChevronRight, ExternalLink } from "lucide-react";
import NavBar from "./NavBar.jsx";
import HeroSection from "./HeroSection.js";
import Footer from "./Footer.js";
import RecruiterContact from "./RecruiterContact.js";
import AboutCompany from "./AboutCompany.js";
import CompanyFacts from "./CompanyFacts.js";
import EmployerTestimonial from "./EmployerTestimonial.js";
import { calculateTextColor, getColor as getColorUtil } from "./utils.js";
import { getFonts } from "./getFonts.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import ApplyCustomFont from "./ApplyCustomFont.jsx";
import { getTranslation } from "../../utils/translations.js";
import { useFocusContext } from "../../contexts/FocusContext.js";
import eventEmitter from "../../utils/eventEmitter.js";

/**
 * MultiJobLandingPage - Landing page component for multi-job campaigns
 * Displays employer brand hero + grid of linked job campaigns
 */
const MultiJobLandingPage = ({
    landingPageData,
    isEdit = false,
    onClickJob = null,
    showBackToEditButton = false,
    fullscreen = false,
    setFullscreen = null
}) => {
    const router = useRouter();
    const [linkedJobs, setLinkedJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    // Focus context for click-to-edit functionality
    const { handleItemClick } = useFocusContext() || {};

    // Helper function to handle click in edit mode - navigates to correct section
    const handleEditClick = (sectionKey, fieldKey) => {
        if (!isEdit) return;

        // Emit event to switch to the correct section in the editor
        eventEmitter.emit("switchSection", { sectionKey });

        // If there's a specific field, focus on it
        if (fieldKey && handleItemClick) {
            handleItemClick(fieldKey);
        }
    };

    // Get fonts and colors
    const { titleFont, subheaderFont, bodyFont } = useMemo(() =>
        getFonts(landingPageData), [landingPageData]
    );

    const colors = useMemo(() => ({
        primaryColor: landingPageData?.primaryColor || "#0066CC",
        secondaryColor: landingPageData?.secondaryColor || "#333333",
        tertiaryColor: landingPageData?.tertiaryColor || "#666666"
    }), [landingPageData?.primaryColor, landingPageData?.secondaryColor, landingPageData?.tertiaryColor]);

    const { getColor } = useTemplatePalette(
        {
            primaryColor: "#0066CC",
            secondaryColor: "#333333",
            tertiaryColor: "#666666"
        },
        colors
    );

    // Fetch linked job campaigns
    useEffect(() => {
        const fetchLinkedJobs = async () => {
            if (!landingPageData?.linkedCampaigns?.length) {
                setLinkedJobs([]);
                setLoadingJobs(false);
                return;
            }

            setLoadingJobs(true);
            try {
                const response = await CrudService.search("LandingPageData", 100, 1, {
                    filters: {
                        _id: { $in: landingPageData.linkedCampaigns }
                    }
                });

                setLinkedJobs(response.data.items || []);
            } catch (error) {
                console.error("Error fetching linked jobs:", error);
                setLinkedJobs([]);
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchLinkedJobs();
    }, [landingPageData?.linkedCampaigns]);

    // Get unique departments for filtering
    const departments = useMemo(() => {
        const depts = [...new Set(linkedJobs.map(job => job.department).filter(Boolean))];
        return ["all", ...depts];
    }, [linkedJobs]);

    // Filter jobs based on search and department
    const filteredJobs = useMemo(() => {
        let jobs = linkedJobs;

        if (selectedDepartment !== "all") {
            jobs = jobs.filter(job => job.department === selectedDepartment);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            jobs = jobs.filter(job =>
                job.vacancyTitle?.toLowerCase().includes(query) ||
                job.department?.toLowerCase().includes(query) ||
                job.location?.some(loc => loc?.toLowerCase?.().includes(query)) ||
                job.heroDescription?.toLowerCase().includes(query)
            );
        }

        return jobs;
    }, [linkedJobs, searchQuery, selectedDepartment]);

    // Handle job card click
    const handleJobClick = (job) => {
        if (onClickJob) {
            onClickJob(job);
        } else if (!isEdit) {
            // Navigate to the job's landing page
            router.push(`/lp/${job._id}`);
        }
    };

    // Get salary display
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

    const textColor = calculateTextColor(getColor("primary", 100));
    const lang = landingPageData?.lang || "English";

    return (
        <div className="min-h-screen bg-white">
            <ApplyCustomFont landingPageData={landingPageData} />

            {/* Navigation */}
            <NavBar
                landingPageData={landingPageData}
                fullscreen={fullscreen}
                showBackToEditButton={showBackToEditButton}
                setFullscreen={setFullscreen}
                isEdit={isEdit}
                isMultiJob={true}
            />

            {/* Hero Section - Modern & Visually Rich */}
            <section
                className="relative min-h-[90vh] flex items-center overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${getColor("primary", 50)} 0%, white 40%, ${getColor("primary", 100)} 100%)`
                }}
            >
                {/* Decorative shapes */}
                {/* Large circle - top right */}
                <div
                    className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
                    style={{ backgroundColor: getColor("primary", 300) }}
                />

                {/* Medium circle - bottom left */}
                <div
                    className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15"
                    style={{ backgroundColor: getColor("primary", 400) }}
                />

                {/* Floating ring - top left */}
                <div
                    className="absolute top-24 left-[15%] w-20 h-20 rounded-full border-4 opacity-20 hidden lg:block"
                    style={{ borderColor: getColor("primary", 400) }}
                />

                {/* Small filled circle - mid right */}
                <div
                    className="absolute top-[40%] right-[8%] w-8 h-8 rounded-full opacity-30 hidden lg:block"
                    style={{ backgroundColor: getColor("primary", 500) }}
                />

                {/* Dotted pattern - subtle background */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(${getColor("primary", 600)} 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Diagonal lines accent - top */}
                <div
                    className="absolute top-0 right-[20%] w-40 h-40 opacity-10 hidden lg:block"
                    style={{
                        background: `repeating-linear-gradient(45deg, ${getColor("primary", 400)}, ${getColor("primary", 400)} 2px, transparent 2px, transparent 12px)`
                    }}
                />

                {/* Blob shape - bottom right */}
                <div
                    className="absolute bottom-[15%] right-[5%] w-32 h-32 opacity-15 hidden lg:block"
                    style={{
                        backgroundColor: getColor("primary", 300),
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
                    }}
                />

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left - Text Content */}
                        <div className="text-center lg:text-left">
                            {/* Company Logo */}
                            {landingPageData?.companyLogo && (
                                <div className="mb-8">
                                    <img
                                        src={landingPageData.companyLogo}
                                        alt={landingPageData.companyName || "Company"}
                                        className="h-12 lg:h-14 object-contain mx-auto lg:mx-0"
                                    />
                                </div>
                            )}

                            {/* Badge with icon */}
                            <div
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 shadow-sm"
                                style={{
                                    backgroundColor: 'white',
                                    border: `1px solid ${getColor("primary", 200)}`
                                }}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                                    style={{ backgroundColor: getColor("primary", 500) }}
                                />
                                <span
                                    className="text-sm font-semibold"
                                    style={{ color: getColor("primary", 700) }}
                                >
                                    We're Hiring
                                </span>
                            </div>

                            {/* Hero Title */}
                            <h1
                                className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] ${isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 hover:outline-offset-2 transition-all' : ''}`}
                                style={{
                                    fontFamily: titleFont?.family,
                                    color: getColor("primary", 800)
                                }}
                                onClick={() => handleEditClick("flexaligntop", "multiJobHeroTitle")}
                            >
                                {landingPageData?.multiJobHeroTitle || landingPageData?.vacancyTitle || "Build Your Career With Us"}
                            </h1>

                            {/* Hero Description */}
                            <p
                                className={`text-lg lg:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed ${isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 hover:outline-offset-2 transition-all' : ''}`}
                                style={{
                                    fontFamily: bodyFont?.family,
                                    color: getColor("primary", 600)
                                }}
                                onClick={() => handleEditClick("flexaligntop", "heroDescription")}
                            >
                                {landingPageData?.heroDescription || "Join a team where your talents are valued and your growth is our priority. Discover opportunities that match your passion."}
                            </p>

                            {/* CTA Button */}
                            <a
                                href={isEdit ? undefined : "#linked-jobs"}
                                className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-base text-white transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 ${isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 hover:outline-offset-2' : ''}`}
                                style={{
                                    backgroundColor: getColor("primary", 600),
                                    fontFamily: bodyFont?.family,
                                    boxShadow: `0 10px 40px -10px ${getColor("primary", 500)}`
                                }}
                                onClick={(e) => {
                                    if (isEdit) {
                                        e.preventDefault();
                                        handleEditClick("flexaligntop", "multiJobCtaText");
                                    }
                                }}
                            >
                                {landingPageData?.multiJobCtaText || getTranslation(lang, "exploreOpportunities")}
                                <svg
                                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Right - Hero Image with decorative elements */}
                        <div className="relative">
                            {landingPageData?.heroImage ? (
                                <div
                                    className={`relative ${isEdit ? 'cursor-pointer' : ''}`}
                                    onClick={() => handleEditClick("flexaligntop", "heroImage")}
                                >
                                    {/* Decorative shapes around image */}
                                    <div
                                        className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl rotate-12 opacity-60 hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 200) }}
                                    />
                                    <div
                                        className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 200) }}
                                    />
                                    <div
                                        className="absolute top-1/2 -right-8 w-16 h-16 rounded-full opacity-40 hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 300) }}
                                    />

                                    {/* Main image */}
                                    <div
                                        className="relative rounded-3xl overflow-hidden"
                                        style={{
                                            boxShadow: `0 30px 60px -15px ${getColor("primary", 400)}`
                                        }}
                                    >
                                        <img
                                            src={landingPageData.heroImage}
                                            alt="Join our team"
                                            className="w-full h-[420px] lg:h-[520px] object-cover"
                                        />
                                        {/* Subtle gradient overlay */}
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{
                                                background: `linear-gradient(180deg, ${getColor("primary", 500)} 0%, transparent 30%)`
                                            }}
                                        />
                                    </div>

                                    {/* Floating accent dots */}
                                    <div
                                        className="absolute -top-3 right-12 w-4 h-4 rounded-full hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 400) }}
                                    />
                                    <div
                                        className="absolute bottom-12 -left-3 w-3 h-3 rounded-full hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 500) }}
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div
                                        className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl rotate-12 opacity-60 hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 200) }}
                                    />
                                    <div
                                        className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl hidden lg:block"
                                        style={{ backgroundColor: getColor("primary", 200) }}
                                    />
                                    <div
                                        className="relative rounded-3xl h-[420px] lg:h-[520px] flex items-center justify-center"
                                        style={{
                                            backgroundColor: getColor("primary", 100),
                                            boxShadow: `0 30px 60px -15px ${getColor("primary", 300)}`
                                        }}
                                    >
                                        <div className="text-center p-8">
                                            <div
                                                className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                                style={{ backgroundColor: getColor("primary", 200) }}
                                            >
                                                <svg
                                                    className="w-10 h-10"
                                                    fill="none"
                                                    stroke={getColor("primary", 400)}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p
                                                className="text-lg font-semibold"
                                                style={{ color: getColor("primary", 600) }}
                                            >
                                                Add a hero image
                                            </p>
                                            <p
                                                className="text-sm mt-2"
                                                style={{ color: getColor("primary", 400) }}
                                            >
                                                Showcase your team & workplace
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom wave transition */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" className="w-full h-auto" preserveAspectRatio="none">
                        <path
                            d="M0 50C200 90 400 100 720 80C1040 60 1240 70 1440 50V100H0V50Z"
                            fill="#f9fafb"
                        />
                    </svg>
                </div>
            </section>

            {/* Jobs Section */}
            <section id="linked-jobs" data-section="linked-jobs" className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl md:text-4xl text-gray-900 mb-4 ${isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 hover:outline-offset-2 transition-all' : ''}`}
                            style={{
                                fontFamily: titleFont?.family,
                                fontWeight: (() => {
                                    const weight = landingPageData?.jobsSectionTitleWeight || 'bold';
                                    switch (weight) {
                                        case 'extrabold': return 800;
                                        case 'bold': return 700;
                                        case 'semibold': return 600;
                                        case 'medium': return 500;
                                        case 'normal': return 400;
                                        default: return 700; // Default to bold
                                    }
                                })()
                            }}
                            onClick={() => handleEditClick("Linked Jobs", "jobsSectionTitle")}
                        >
                            {landingPageData?.jobsSectionTitle || getTranslation(lang, "ourOpenPositions") || "Our Open Positions"}
                        </h2>
                        {landingPageData?.jobsSectionDescription && (
                            <p
                                className={`text-lg text-gray-600 max-w-2xl mx-auto ${isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 hover:outline-offset-2 transition-all' : ''}`}
                                style={{ fontFamily: bodyFont?.family }}
                                onClick={() => handleEditClick("Linked Jobs", "jobsSectionDescription")}
                            >
                                {landingPageData.jobsSectionDescription}
                            </p>
                        )}
                    </div>

                    {/* Filters */}
                    {linkedJobs.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={getTranslation(lang, "searchPositions")}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                        style={{ fontFamily: bodyFont?.family }}
                                    />
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Department Filter */}
                            {departments.length > 2 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept}
                                            onClick={() => setSelectedDepartment(dept)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedDepartment === dept
                                                ? 'text-white'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={selectedDepartment === dept ? {
                                                backgroundColor: getColor("primary", 600)
                                            } : {}}
                                        >
                                            {dept === "all" ? getTranslation(lang, "allDepartments") : dept}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Jobs Grid */}
                    {loadingJobs ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                    <Skeleton active />
                                </div>
                            ))}
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <Empty
                            description={
                                linkedJobs.length === 0
                                    ? getTranslation(lang, "noPositionsLinked")
                                    : getTranslation(lang, "noPositionsMatch")
                            }
                            className="py-12"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    onClick={() => handleJobClick(job)}
                                    getColor={getColor}
                                    titleFont={titleFont}
                                    bodyFont={bodyFont}
                                    getSalaryDisplay={getSalaryDisplay}
                                    isEdit={isEdit}
                                    lang={lang}
                                />
                            ))}
                        </div>
                    )}

                    {/* Results count */}
                    {filteredJobs.length > 0 && (
                        <div className="text-center mt-8 text-gray-500">
                            {getTranslation(lang, "showingXofY")
                                .replace("{count}", filteredJobs.length)
                                .replace("{total}", linkedJobs.length)} {linkedJobs.length !== 1
                                    ? getTranslation(lang, "positions")
                                    : getTranslation(lang, "position")}
                        </div>
                    )}
                </div>
            </section>

            {/* Recruiter Contacts Section */}
            {(landingPageData?.recruiters?.length > 0 || landingPageData?.recruiterContactTitle) && (
                <section
                    id="recruiter-contact"
                    data-section="recruiter-contact"
                    className={isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 transition-all' : ''}
                    onClick={() => handleEditClick("Recruiter Contact")}
                >
                    <RecruiterContact
                        landingPageData={landingPageData}
                        isEdit={isEdit}
                    />
                </section>
            )}

            {/* About the Company Section */}
            {(landingPageData?.aboutTheCompanyDescription || landingPageData?.companyInfo) && (
                <section
                    id="about-company"
                    data-section="about-company"
                    className={isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 transition-all' : ''}
                    onClick={() => handleEditClick("About The Company")}
                >
                    <AboutCompany
                        landingPageData={{
                            ...landingPageData,
                            // Map companyInfo to aboutTheCompanyDescription if needed
                            aboutTheCompanyDescription: landingPageData?.aboutTheCompanyDescription || landingPageData?.companyInfo,
                            aboutTheCompanyTitle: landingPageData?.aboutTheCompanyTitle || "About Us",
                        }}
                        isEdit={isEdit}
                    />
                </section>
            )}

            {/* Company Facts Section */}
            {landingPageData?.facts?.length > 0 && (
                <section
                    id="company-facts"
                    data-section="company-facts"
                    className={isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 transition-all' : ''}
                    onClick={() => handleEditClick("Company Facts")}
                >
                    <CompanyFacts
                        landingPageData={{
                            ...landingPageData,
                            // Map facts array to companyFacts format expected by CompanyFacts component
                            companyFacts: landingPageData?.facts?.map(fact => ({
                                icon: fact.emoji || "✨",
                                headingText: fact.title || "",
                                descriptionText: fact.description || ""
                            })) || [],
                            companyFactsTitle: landingPageData?.companyFactsTitle || "Our company facts",
                            companyFactsDescription: landingPageData?.companyFactsDescription || ""
                        }}
                        isEdit={isEdit}
                    />
                </section>
            )}

            {/* Testimonials Section */}
            {landingPageData?.testimonials?.length > 0 && (
                <section
                    id="testimonials"
                    data-section="testimonials"
                    className={isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 transition-all' : ''}
                    onClick={() => handleEditClick("Employee Testimonials")}
                >
                    <EmployerTestimonial
                        landingPageData={landingPageData}
                        isEdit={isEdit}
                    />
                </section>
            )}

            {/* Footer - Use actual Footer component for editor compatibility */}
            <div
                className={isEdit ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-purple-400 transition-all' : ''}
                onClick={() => handleEditClick("flexalign")}
            >
                <Footer
                    landingPageData={landingPageData}
                    isEdit={isEdit}
                    isMultiJob={true}
                    onClickApply={() => { }}
                    lpId={landingPageData?._id}
                />
            </div>
        </div>
    );
};

/**
 * JobCard - Individual job listing card (simplified - no department tags or Live indicators)
 */
const JobCard = ({
    job,
    onClick,
    getColor,
    titleFont,
    bodyFont,
    getSalaryDisplay,
    isEdit,
    lang = "English"
}) => {
    const salary = getSalaryDisplay(job);

    return (
        <div
            onClick={onClick}
            className={`
        group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 
        transition-all duration-300 hover:shadow-lg hover:border-transparent hover:-translate-y-1
        ${!isEdit ? 'cursor-pointer' : ''}
      `}
            style={{
                '--hover-border-color': getColor("primary", 500)
            }}
        >
            {/* Hero Image */}
            {job.heroImage && (
                <div className="h-40 overflow-hidden">
                    <img
                        src={job.heroImage}
                        alt={job.vacancyTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Job Title */}
                <h3
                    className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors"
                    style={{ fontFamily: titleFont?.family }}
                >
                    {job.vacancyTitle || "Untitled Position"}
                </h3>

                {/* Description */}
                {job.heroDescription && (
                    <p
                        className="text-sm text-gray-600 mb-4 line-clamp-2"
                        style={{ fontFamily: bodyFont?.family }}
                    >
                        {job.heroDescription}
                    </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {job.location?.[0] && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location.join(", ")}
                        </span>
                    )}

                    {job.contractType && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {job.contractType}
                        </span>
                    )}

                    {salary && (
                        <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            {salary}
                        </span>
                    )}
                </div>

                {/* View Button */}
                <div
                    className="mt-4 pt-4 border-t border-gray-100 flex items-center"
                >
                    <span
                        className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: getColor("primary", 600) }}
                    >
                        {getTranslation(lang, "viewPosition")}
                        <ChevronRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MultiJobLandingPage;

