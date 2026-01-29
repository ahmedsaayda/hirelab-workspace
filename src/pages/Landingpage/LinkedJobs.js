import React, { useState, useEffect, useMemo, useRef } from "react";
import { Skeleton } from "antd";
import Link from "next/link";
import { 
  Search,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import CrudService from "../../services/CrudService.js";
import PublicService from "../../services/PublicService.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { getFonts } from "./getFonts.js";
import { useHover } from "../../contexts/HoverContext.js";
import { scrollToElement } from "./scrollUtils.js";

const LinkedJobs = ({
  landingPageData,
  isEdit = false,
  onClickJob = null,
}) => {
  const [linkedJobs, setLinkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredJob, setHoveredJob] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const sectionRef = useRef(null);
  const { scrollToSection, setLastScrollToSection, lastScrollToSection } = useHover();

  const { titleFont, bodyFont } = useMemo(() => getFonts(landingPageData), [landingPageData]);

  // Scroll to section when triggered from editor
  useEffect(() => {
    if (scrollToSection === "linked-jobs" && sectionRef.current && lastScrollToSection !== "linked-jobs") {
      scrollToElement(sectionRef.current);
      setLastScrollToSection("linked-jobs");
    }
  }, [scrollToSection, lastScrollToSection, setLastScrollToSection]);

  const defaultColors = {
    primaryColor: "#7c3aed",
    secondaryColor: "#8b5cf6", 
    tertiaryColor: "#a855f7",
  };

  const { getColor } = useTemplatePalette(defaultColors, {
    primaryColor: landingPageData?.primaryColor || defaultColors.primaryColor,
    secondaryColor: landingPageData?.secondaryColor || defaultColors.secondaryColor,
    tertiaryColor: landingPageData?.tertiaryColor || defaultColors.tertiaryColor,
  });

  const linkedCampaignsKey = JSON.stringify(landingPageData?.linkedCampaigns || []);

  useEffect(() => {
    const linkedCampaigns = landingPageData?.linkedCampaigns || [];
    
    const fetchLinkedJobs = async () => {
      if (!linkedCampaigns.length) {
        setLinkedJobs([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const jobs = [];
        for (const campaignId of linkedCampaigns) {
          try {
            let job;
            if (isEdit) {
              const response = await CrudService.getSingle("LandingPageData", campaignId);
              job = response.data;
            } else {
              const response = await PublicService.getLP(campaignId);
              job = response.data;
            }
            if (job) jobs.push(job);
          } catch (err) {
            console.error(`Failed to fetch job ${campaignId}:`, err);
          }
        }
        setLinkedJobs(jobs);
      } catch (error) {
        console.error("Error fetching linked jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedJobs();
  }, [linkedCampaignsKey, isEdit]);

  const departments = useMemo(() => {
    const depts = [...new Set(linkedJobs.map(job => job.department).filter(Boolean))];
    return ["all", ...depts];
  }, [linkedJobs]);

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
        job.location?.some?.(loc => loc?.toLowerCase?.().includes(query))
      );
    }
    return jobs;
  }, [linkedJobs, searchQuery, selectedDepartment]);

  const primaryColor = getColor("primary", 600);
  const sectionTitle = landingPageData?.jobsSectionTitle || "Open Positions";
  const sectionDescription = landingPageData?.jobsSectionDescription || "Find your next opportunity and take the next step in your career.";

  // Helper function to format price
  const intToHumanReadablePrice = (value) => {
    if (!value) return "";
    const num = parseInt(value.toString().replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) return value;
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
    }
    return num.toString();
  };

  // Get work type from location
  const getWorkType = (location) => {
    if (!location) return "Onsite";
    const locStr = Array.isArray(location) ? location.join(" ") : location;
    if (locStr.toLowerCase().includes("remote")) return "Remote";
    if (locStr.toLowerCase().includes("hybrid")) return "Hybrid";
    return "Onsite";
  };

  // Badge styles matching Footer JobCard
  const badgeStyle = {
    color: "#333",
    background: getColor("primary", 50),
    padding: "10px 10px",
    borderRadius: "10px",
  };

  const applyButtonStyle = {
    backgroundColor: primaryColor,
    color: "#fff",
  };

  const JobCard = ({ job }) => {
    if (!job) return null;
    
    const workType = getWorkType(job.location);
    
    const cardContent = (
      <div
        className="flex overflow-hidden flex-col h-full rounded-xl max-w-[370px] mx-auto w-full bg-white"
        style={{ color: "black", fontFamily: bodyFont?.family }}
        onMouseEnter={() => setHoveredJob(job._id)}
        onMouseLeave={() => setHoveredJob(null)}
        onClick={() => onClickJob?.(job)}
      >
        {/* Job Image */}
        <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden">
          {job.heroImage ? (
            <img
              src={job.heroImage}
              alt={job.vacancyTitle}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <div className="text-xl text-gray-300">No Image</div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex flex-col flex-grow py-6 px-2">
          <h3 
            className="text-xl font-bold mb-2 h-[56px] line-clamp-2 overflow-hidden text-ellipsis leading-tight"
            style={{ fontFamily: titleFont?.family }}
          >
            {job.vacancyTitle || "Open Position"}
          </h3>
          <p className="line-clamp-2 h-[40px] mb-4 text-sm overflow-hidden text-ellipsis text-gray-600">
            {job.heroDescription}
          </p>

          {/* Job Specs - matching Footer style */}
          <div className="flex flex-wrap gap-2 mb-6">
            {!!job.salaryMin && (
              <div
                className="flex items-center text-sm gap-1"
                style={badgeStyle}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 1.5C6.5 2.05228 5.26878 2.5 3.75 2.5C2.23122 2.5 1 2.05228 1 1.5M6.5 1.5C6.5 0.947715 5.26878 0.5 3.75 0.5C2.23122 0.5 1 0.947715 1 1.5M6.5 1.5V2.25M1 1.5V7.5C1 8.05228 2.23122 8.5 3.75 8.5M3.75 4.5C3.66573 4.5 3.58234 4.49862 3.5 4.49592C2.09837 4.44999 1 4.02164 1 3.5M3.75 6.5C2.23122 6.5 1 6.05228 1 5.5M11 4.75C11 5.30228 9.76878 5.75 8.25 5.75C6.73122 5.75 5.5 5.30228 5.5 4.75M11 4.75C11 4.19772 9.76878 3.75 8.25 3.75C6.73122 3.75 5.5 4.19772 5.5 4.75M11 4.75V8.5C11 9.05228 9.76878 9.5 8.25 9.5C6.73122 9.5 5.5 9.05228 5.5 8.5V4.75M11 6.625C11 7.17728 9.76878 7.625 8.25 7.625C6.73122 7.625 5.5 7.17728 5.5 6.625"
                    stroke={primaryColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {intToHumanReadablePrice(job.salaryMin)}
                {job.salaryRange && job.salaryMax && ` - ${intToHumanReadablePrice(job.salaryMax)}`}
                /{job.salaryTime?.toLowerCase?.() || "month"}
              </div>
            )}
            <div
              className="flex items-center text-sm gap-1"
              style={badgeStyle}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 6.68722C9.7659 7.03442 11 7.82736 11 8.75C11 9.99264 8.76142 11 6 11C3.23858 11 1 9.99264 1 8.75C1 7.82736 2.2341 7.03442 4 6.68722M6 8.5V4.5M6 4.5C6.82843 4.5 7.5 3.82843 7.5 3C7.5 2.17157 6.82843 1.5 6 1.5C5.17157 1.5 4.5 2.17157 4.5 3C4.5 3.82843 5.17157 4.5 6 4.5Z"
                  stroke={primaryColor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {workType}
            </div>
            {job.hoursMin && (
              <div
                className="flex items-center text-sm gap-1"
                style={badgeStyle}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_2958)">
                    <path
                      d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
                      stroke={primaryColor}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_2958">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {job.hoursRange ? `${job.hoursMin}-${job.hoursMax}` : job.hoursMin} / {job.hoursUnit || "Week"}
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div
            className="py-3 w-full font-medium text-center rounded-full transition-colors mt-auto cursor-pointer hover:opacity-90"
            style={applyButtonStyle}
          >
            {job.ctaFooterTitle || landingPageData?.ctaFooterTitle || "Learn More"}
          </div>
        </div>
      </div>
    );

    if (isEdit || onClickJob) {
      return <div className="cursor-pointer h-full">{cardContent}</div>;
    }

    return (
      <Link href={`/lp/${job._id}`} className="block h-full">
        {cardContent}
      </Link>
    );
  };

  return (
    <section ref={sectionRef} id="linked-jobs" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: titleFont?.family }}
          >
            {sectionTitle}
          </h2>
          
          {sectionDescription && (
            <p
              className="text-gray-500 max-w-xl mx-auto"
              style={{ fontFamily: bodyFont?.family }}
            >
              {sectionDescription}
            </p>
          )}
        </div>

        {(departments.length > 2 || linkedJobs.length > 4) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            {departments.length > 2 && (
              <div className="flex flex-wrap justify-center gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                    style={selectedDepartment === dept 
                      ? { backgroundColor: primaryColor, color: 'white' }
                      : { backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb' }
                    }
                  >
                    {dept === "all" ? "All" : dept}
                  </button>
                ))}
              </div>
            )}

            {linkedJobs.length > 4 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-full bg-white text-gray-900 placeholder-gray-400 text-sm border border-gray-200 focus:outline-none focus:border-gray-300 w-48"
                  style={{ fontFamily: bodyFont?.family }}
                />
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-44 bg-gray-100 animate-pulse" />
                <div className="p-5">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-100">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {linkedJobs.length === 0 ? "No positions yet" : "No matches"}
            </h3>
            <p className="text-gray-500 text-sm">
              {linkedJobs.length === 0 ? "Check back soon" : "Try different filters"}
            </p>
          </div>
        ) : (
          <JobCarousel jobs={filteredJobs} JobCard={JobCard} primaryColor={primaryColor} />
        )}
      </div>
    </section>
  );
};

// Horizontal carousel component for jobs
const JobCarousel = ({ jobs, JobCard, primaryColor }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    const container = carouselRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons, { passive: true });
      window.addEventListener('resize', checkScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [jobs]);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    
    const cardWidth = 340; // card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          <ChevronLeft size={24} style={{ color: primaryColor }} />
        </button>
      )}

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {jobs.map((job) => (
          <div
            key={job._id}
            className="flex-shrink-0 w-[300px] sm:w-[320px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          <ChevronRight size={24} style={{ color: primaryColor }} />
        </button>
      )}

      {/* Positions count */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          {jobs.length} position{jobs.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default LinkedJobs;
