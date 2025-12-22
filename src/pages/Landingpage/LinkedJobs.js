import React, { useState, useEffect, useMemo } from "react";
import { Skeleton } from "antd";
import Link from "next/link";
import { 
  MapPin, 
  ArrowUpRight, 
  Search,
  Clock,
  Briefcase
} from "lucide-react";
import CrudService from "../../services/CrudService.js";
import PublicService from "../../services/PublicService.js";
import useTemplatePalette from "../../../pages/hooks/useTemplatePalette.js";
import { getFonts } from "./getFonts.js";

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

  const { titleFont, bodyFont } = useMemo(() => getFonts(landingPageData), [landingPageData]);

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
              const response = await PublicService.getOne(campaignId);
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

  const JobCard = ({ job }) => {
    const isHovered = hoveredJob === job._id;
    
    const cardContent = (
      <div 
        className="group bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300"
        style={{
          boxShadow: isHovered 
            ? '0 20px 40px -12px rgba(0,0,0,0.15)'
            : '0 1px 3px rgba(0,0,0,0.08)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setHoveredJob(job._id)}
        onMouseLeave={() => setHoveredJob(null)}
        onClick={() => onClickJob?.(job)}
      >
        {job.heroImage && (
          <div className="relative h-44 overflow-hidden bg-gray-100">
            <img
              src={job.heroImage}
              alt={job.vacancyTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 p-5 flex flex-col">
          {job.department && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {job.department}
              </span>
            </div>
          )}

          <h3
            className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
            style={{ fontFamily: titleFont?.family }}
          >
            {job.vacancyTitle || "Open Position"}
          </h3>

          {job.heroDescription && (
            <p
              className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1"
              style={{ fontFamily: bodyFont?.family }}
            >
              {job.heroDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
            {job.location?.length > 0 && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {Array.isArray(job.location) ? job.location[0] : job.location}
              </span>
            )}
            {job.contractType && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {job.contractType}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-500">
              View role
            </span>
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: primaryColor,
                color: 'white',
              }}
            >
              <ArrowUpRight size={16} />
            </div>
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
    <section id="linked-jobs" className="py-20 bg-gray-50">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LinkedJobs;
