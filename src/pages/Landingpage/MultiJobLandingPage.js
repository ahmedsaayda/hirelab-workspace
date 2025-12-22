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
            router.push(`/l/${job._id}`);
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

            {/* Hero Section - Custom for Multi-Job */}
            <section
                className="relative py-20 md:py-32"
                style={{
                    background: `linear-gradient(135deg, ${getColor("primary", 600)} 0%, ${getColor("primary", 800)} 100%)`
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Company Logo */}
                        {landingPageData?.companyLogo && (
                            <div className="mb-8">
                                <img
                                    src={landingPageData.companyLogo}
                                    alt={landingPageData.companyName || "Company"}
                                    className="h-16 mx-auto object-contain"
                                />
                            </div>
                        )}

                        {/* Hero Title */}
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                            style={{ fontFamily: titleFont?.family }}
                        >
                            {landingPageData?.multiJobHeroTitle || landingPageData?.vacancyTitle || "Join Our Team"}
                        </h1>

                        {/* Hero Description */}
                        <p
                            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
                            style={{ fontFamily: subheaderFont?.family }}
                        >
                            {landingPageData?.heroDescription || "Explore exciting career opportunities and find your next role with us."}
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 md:gap-16 text-white/80">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    {linkedJobs.length}
                                </div>
                                <div className="text-sm uppercase tracking-wide">
                                    Open Positions
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    {departments.length - 1}
                                </div>
                                <div className="text-sm uppercase tracking-wide">
                                    Departments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Jobs Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: titleFont?.family }}
                        >
                            {landingPageData?.jobsSectionTitle || getTranslation(lang, "ourOpenPositions") || "Our Open Positions"}
                        </h2>
                        {landingPageData?.jobsSectionDescription && (
                            <p
                                className="text-lg text-gray-600 max-w-2xl mx-auto"
                                style={{ fontFamily: bodyFont?.family }}
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
                                        placeholder="Search positions..."
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
                                            {dept === "all" ? "All Departments" : dept}
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
                                    ? "No job positions have been linked to this campaign yet"
                                    : "No positions match your search criteria"
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
                                />
                            ))}
                        </div>
                    )}

                    {/* Results count */}
                    {filteredJobs.length > 0 && (
                        <div className="text-center mt-8 text-gray-500">
                            Showing {filteredJobs.length} of {linkedJobs.length} position{linkedJobs.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </section>

            {/* Recruiter Contacts Section */}
            {(landingPageData?.recruiters?.length > 0 || landingPageData?.recruiterContactTitle) && (
                <RecruiterContact
                    landingPageData={landingPageData}
                    isEdit={isEdit}
                />
            )}

            {/* About the Company Section */}
            {(landingPageData?.aboutTheCompanyDescription || landingPageData?.companyInfo) && (
                <AboutCompany
                    landingPageData={{
                        ...landingPageData,
                        // Map companyInfo to aboutTheCompanyDescription if needed
                        aboutTheCompanyDescription: landingPageData?.aboutTheCompanyDescription || landingPageData?.companyInfo,
                        aboutTheCompanyTitle: landingPageData?.aboutTheCompanyTitle || "About Us",
                    }}
                    isEdit={isEdit}
                />
            )}

            {/* Company Facts Section */}
            {landingPageData?.facts?.length > 0 && (
                <CompanyFacts
                    landingPageData={landingPageData}
                    isEdit={isEdit}
                />
            )}

            {/* Testimonials Section */}
            {landingPageData?.testimonials?.length > 0 && (
                <EmployerTestimonial
                    landingPageData={landingPageData}
                    isEdit={isEdit}
                />
            )}

            {/* Footer */}
            <footer
                className="py-8 text-center text-white/70 text-sm"
                style={{ backgroundColor: getColor("primary", 900) }}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <p>
                        © {new Date().getFullYear()} {landingPageData?.companyName || "Company"}. All rights reserved.
                    </p>
                    {landingPageData?.createdWithText && (
                        <p className="mt-2 text-white/50 text-xs">
                            {landingPageData.createdWithText}
                        </p>
                    )}
                </div>
            </footer>
        </div>
    );
};

/**
 * JobCard - Individual job listing card
 */
const JobCard = ({
    job,
    onClick,
    getColor,
    titleFont,
    bodyFont,
    getSalaryDisplay,
    isEdit
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
                {/* Department Badge */}
                {job.department && (
                    <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                        style={{
                            backgroundColor: `${getColor("primary", 100)}`,
                            color: getColor("primary", 700)
                        }}
                    >
                        {job.department}
                    </span>
                )}

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
                    className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between"
                >
                    <span
                        className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: getColor("primary", 600) }}
                    >
                        View Position
                        <ChevronRight className="w-4 h-4" />
                    </span>

                    {job.published && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Live
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiJobLandingPage;

