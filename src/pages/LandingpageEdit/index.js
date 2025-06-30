import { Modal, Skeleton, message } from "antd";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router";
import CrudService from "../../services/CrudService.js";
import PublicService from "../../services/PublicService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors.js";
import { changeIndigoShades, generateTailwindPalette } from "../Dashboard/index.js";
import {
  Button,
  Heading,
  Img,
  Input,
  Text,
  TextArea,
} from "../Dashboard/Vacancies/components/components/index.jsx";
import Sidebar17 from "../Dashboard/Vacancies/components/components/Sidebar17/index.jsx";
import Header from "../Dashboard/Vacancies/components/components/Header/index.jsx";
import Agenda from "../Landingpage/Agenda.js";
import CandidateProcess from "../Landingpage/CandidateProcess.js";
import EVPMission from "../Landingpage/EVPMission.js";
import EmployerTestimonial from "../Landingpage/EmployerTestimonial.js";
import Footer from "../Landingpage/Footer.js";
import FormE from "../Landingpage/Form.js";
import GrowthPath from "../Landingpage/GrowthPath.js";
import HeroSection from "../Landingpage/HeroSection.js";
import JobDescription from "../Landingpage/JobDescription.js";
import JobSpecification from "../Landingpage/JobSpecification.js";
import LeaderIntroduction from "../Landingpage/LeaderIntroduction.js";
import Photos from "../Landingpage/Photos.js";
import RecruiterContact from "../Landingpage/RecruiterContact.js";
import Video from "../Landingpage/Video.js";
import FormEditor from "./FormEditor.js";
import { defaultLandingPageData } from "../onboarding/components/brand-style-form.jsx";
// import PreviewContainer from "../../../src/components/preview-container.jsx";
// Placeholder for PreviewContainer
const PreviewContainer = ({ children, className }) => (
  <div className={className}>{children}</div>
);
import CompanyFacts from "../Landingpage/CompanyFacts.js";
import AboutCompany from "../Landingpage/AboutCompany.js";
import TextBox from "../Landingpage/TextBox.js";
import { AiOutlineFolderOpen } from "react-icons/ai";
import MediaLibrary from "../Dashboard/Vacancies/components/mediaLibrary/index.jsx";
import { ImagePlus } from "lucide-react";
import {
  AboutCompanyEdit,
  LeaderIntroductionEdit,
  VideoEdit,
  AgendaEdit,
  CandidateProcessEdit,
  EVPMissionEdit,
  EmployerTestimonialEdit,
  FooterEdit,
  GrowthPathEdit,
  HeroSectionEdit,
  JobDescriptionEdit,
  JobSpecificationEdit,
  CompanyFactsEdit,
  PhotosEdit,
  RecruiterContactEdit,
  TextBoxEdit,
} from "./allEditors.jsx";
import LandingpagePage from "../Landingpage/index.js";
import AIEditModal from "../Dashboard/Vacancies/AIEditModal.jsx";
import { useHover } from "../../contexts/HoverContext.js";
import NavBar from "../Landingpage/NavBar.jsx";
// hirelab-frontend\src\pages\LandingpageEdit\index.js
// hirelab-frontend\src\components\mediaLibrary\ImageModal\ImageSelectionModal.jsx
import ImageSelectionModal from "../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";
import { useDispatch } from "react-redux";
import { setActiveSection, setMediaLimits } from "../../redux/landingPage/mediaUploadReducer.js";
import VacancyCreationDebugModal from "./VacancyCreationDebugModal.jsx";
import eventEmitter from "../../utils/eventEmitter.js";

export const renderSection = ({
  section,
  fetchData,
  landingPageData = defaultLandingPageData,
  setLandingPageData,
  key= Math.random(),
  similarJobs,
  similarJobsLoading,
}) => {

  // This function should render the corresponding section based on its key.
  switch (section?.key) {
    case "flexaligntop":
      return (
        <HeroSection key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
    case "form-editor":
      return (
        <FormE
          showFormEditor={false}
          setShowFormEditor={() => {}}
          landingPageData={landingPageData}
          noModal
        />
      );
    case "flexalign":
      return <Footer 
        key={key} 
        fetchData={fetchData} 
        landingPageData={landingPageData} 
        similarJobs={similarJobs}
        similarJobsLoading={similarJobsLoading}
      />;
    case "Employee Testimonials":
      return (
        <EmployerTestimonial
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );

    case "Leader Introduction":
      return (
        <LeaderIntroduction
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Company Facts":
      return (
        <CompanyFacts key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
    case "Recruiter Contact":
      return (
        <RecruiterContact
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Agenda":
      return (
        <Agenda
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
          setLandingPageData={setLandingPageData}
        />
      );
    case "Job Specifications":
      return (
        <JobSpecification
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Job Description":
      return (
        <JobDescription
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "About The Company":
      return (
        <AboutCompany key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );

    case "Image Carousel":
      return <Photos key={key} fetchData={fetchData} landingPageData={landingPageData} />;
    case "EVP / Mission":
      return (
        <EVPMission key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
    case "Candidate Process":
      return (
        <CandidateProcess
          key={key} fetchData={fetchData}
          landingPageData={landingPageData}
        />
      );
    case "Growth Path":
      return (
        <GrowthPath key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );
    case "Video":
      return <Video key={key} fetchData={fetchData} landingPageData={landingPageData} />;
    case "Text Box":
      return (
        <TextBox key={key} fetchData={fetchData} landingPageData={landingPageData} />
      );

    default:
      return <></>;
  }
};

export const renderEditor = ({
  section,
  fetchData,
  landingPageData = defaultLandingPageData,
  setLandingPageData,
  availableJobs,
  jobsLoading,
}) => {
  // This function should render the corresponding section based on its key.
  const props = { 
    fetchData, 
    landingPageData, 
    setLandingPageData,
    availableJobs,
    jobsLoading,
  };
  switch (section?.key) {
    case "flexaligntop":
      return <HeroSectionEdit {...props} />;
    case "form-editor":
      return <FormEditor {...props} />;
    case "flexalign":
      return <FooterEdit {...props} />;
    case "Employee Testimonials":
      return <EmployerTestimonialEdit {...props} />;
    case "Company Facts":
      return <CompanyFactsEdit {...props} />;
    case "Leader Introduction":
      return <LeaderIntroductionEdit {...props} />;
    case "Recruiter Contact":
      return <RecruiterContactEdit {...props} />;
    case "Agenda":
      return <AgendaEdit {...props} />;
    case "Job Specifications":
      return <JobSpecificationEdit {...props} />;
    case "Job Description":
      return <JobDescriptionEdit {...props} />;
    case "About The Company":
      return <AboutCompanyEdit {...props} />;
    case "Image Carousel":
      return <PhotosEdit {...props} />;
    case "EVP / Mission":
      return <EVPMissionEdit {...props} />;
    case "Candidate Process":
      return <CandidateProcessEdit {...props} />;
    case "Growth Path":
      return <GrowthPathEdit {...props} />;
    case "Video":
      return <VideoEdit {...props} />;
    case "Text Box":
      return <TextBoxEdit {...props} />;

    default:
      return <></>;
  }
};

const categories = [
  {
    title: "PEOPLE",
    items: [
      {
        key: "buttonbase",
        name: "Employee Testimonials",
        icon: <img src="/icons2/users-01.svg" alt=" "></img>,
      },
      {
        //Leader Introduction
        key: "leaderIntroduction",
        name: "Leader Introduction",
        icon: <img src="/icons2/user-01.svg" alt=" "></img>,
      },

      {
        key: "messagechat",
        name: "Recruiter Contact",
        icon: <img src="/icons2/message-chat-circle.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "JOB EXPLANATION",
    items: [
      {
        key: "calendar",
        name: "Agenda",
        icon: <img src="/icons2/calendar.svg" alt=" "></img>,
      },
      {
        key: "editfour",
        name: "Job Specifications",
        icon: <img src="/icons2/briefcase-01.svg" alt=" "></img>,
      },
      {
        key: "briefcaseone",
        name: "Job Description",
        icon: <img src="/icons2/edit-04.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "COMPANY",
    items: [
      {
        key: "briefcaseone",
        name: "About The Company",
        icon: <img src="/icons2/intersect-circle.svg" alt=" "></img>,
      },
      {
        key: "briefcaseone",
        name: "EVP / Mission",
        icon: (
          <svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.833 6.125C10.833 7.55737 10.1461 8.82875 9.07951 9.62762L10.1295 11.0276C10.8917 10.4576 11.5103 9.71765 11.9362 8.86656C12.3622 8.01546 12.5836 7.07672 12.583 6.125H10.833ZM6.45801 1.75C7.61833 1.75 8.73113 2.21094 9.5516 3.03141C10.3721 3.85188 10.833 4.96468 10.833 6.125H12.583C12.583 4.50055 11.9377 2.94263 10.789 1.79397C9.64038 0.64531 8.08246 0 6.45801 0V1.75ZM2.08301 6.125C2.08301 4.96468 2.54394 3.85188 3.36442 3.03141C4.18489 2.21094 5.29769 1.75 6.45801 1.75V0C4.83356 0 3.27564 0.64531 2.12698 1.79397C0.97832 2.94263 0.333009 4.50055 0.333009 6.125H2.08301ZM3.83651 9.62762C3.2917 9.22063 2.84946 8.69203 2.54503 8.08393C2.2406 7.47583 2.08239 6.80504 2.08301 6.125H0.333009C0.332396 7.07672 0.553859 8.01546 0.979787 8.86656C1.40571 9.71765 2.02435 10.4576 2.78651 11.0276L3.83651 9.62762ZM5.58038 14.6501C5.55271 13.3159 5.27706 11.9985 4.76751 10.7651L3.15051 11.4345C3.57576 12.4644 3.80763 13.5669 3.83126 14.6869L5.58038 14.6501ZM7.63226 14.1846C7.26768 14.367 6.86564 14.4619 6.45801 14.4619C6.05037 14.4619 5.64834 14.367 5.28376 14.1846L4.50151 15.75C5.10898 16.0537 5.77883 16.2118 6.45801 16.2118C7.13718 16.2118 7.80703 16.0537 8.41451 15.75L7.63226 14.1846ZM8.14851 10.766C7.63876 11.999 7.36282 13.3162 7.33476 14.6501L9.08476 14.6869C9.10838 13.5669 9.34026 12.4644 9.76551 11.4345L8.14851 10.766ZM8.41451 15.75C8.61244 15.6506 8.77947 15.4991 8.89759 15.3117C9.01571 15.1244 9.08042 14.9083 9.08476 14.6869L7.33476 14.6501C7.33717 14.5528 7.36616 14.4579 7.4186 14.3759C7.47104 14.2938 7.54492 14.2277 7.63226 14.1846L8.41451 15.75ZM3.83126 14.6869C3.84001 15.1279 4.08851 15.5435 4.50151 15.75L5.28376 14.1846C5.37109 14.2277 5.44498 14.2938 5.49742 14.3759C5.54986 14.4579 5.57885 14.5528 5.58126 14.6501L3.83126 14.6869ZM2.78651 11.0276C2.91776 11.1274 2.99563 11.1851 3.04988 11.2289C3.10501 11.2744 3.09451 11.2726 3.07001 11.2411L4.45251 10.1684C4.28888 9.95662 4.03513 9.77637 3.83651 9.62762L2.78651 11.0276ZM4.76751 10.7651C4.69926 10.5997 4.61263 10.374 4.45251 10.1684L3.07001 11.2411C3.05863 11.2254 3.05601 11.2175 3.06738 11.2411C3.09531 11.3051 3.12273 11.3692 3.14963 11.4336L4.76751 10.7651ZM9.07951 9.62762C8.88088 9.77637 8.62626 9.9575 8.46263 10.1684L9.84601 11.2411C9.82238 11.2717 9.81101 11.2744 9.86613 11.2297C9.92038 11.1851 9.99738 11.1274 10.1295 11.0285L9.07951 9.62762ZM9.76551 11.4345L9.81801 11.3094L9.84863 11.2411C9.86001 11.2175 9.85738 11.2254 9.84601 11.2411L8.46263 10.1684C8.30251 10.3749 8.21676 10.5997 8.14851 10.766L9.76551 11.4345Z"
              fill="#667085"
            />
            <path
              d="M9.07584 11.375C8.30097 11.893 7.38988 12.1694 6.45784 12.1694C5.5258 12.1694 4.61471 11.893 3.83984 11.375"
              stroke="#667085"
              stroke-width="1.66667"
            />
          </svg>
        ),
      },
      {
        key: "messagechat",
        name: "Company Facts",
        icon: <img src="/icons2/zap.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "PROCESS",
    items: [
      {
        key: "flexaligntop",
        name: "Candidate Process",
        icon: <img src="/icons2/list.svg" alt=" "></img>,
      },
      {
        key: "Growth Path",
        name: "Growth Path",
        icon: <img src="/images/trend-up-01.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "CONTENT",
    items: [
      // { key: "userone", name: "Video", icon: <img src="/icons2/video-recorder.svg" alt=" "></img>, },
      {
        key: "userone",
        name: "Image Carousel",
        icon: <img src="/icons2/image-01.svg" alt=" "></img>,
      },
      {
        key: "Video",
        name: "Video",
        icon: <img src="/images/video-recorder.svg" alt=" "></img>,
      },
      {
        key: "Text Box",
        name: "Text Box",
        icon: <img src="/icons2/type-square.svg" alt=" "></img>,
      },
    ],
  },
];

const Category = ({ title, items, onClick, existingItems }) => (
  <div className="mb-6 cursor-pointer">
    <h2 className="mb-2 text-[##475467] text-md ">{title}</h2>
    <div className="grid grid-cols-3 gap-6 mdx:grid-cols-2 smx:grid-cols-1">
      {items.map((item, index) => {
        // Check if this item is already added
        const isAlreadyAdded = existingItems.some(
          (existing) => existing.key === item.key || existing.key === item.name
        );

        return (
          <button
            key={index}
            className={`flex justify-start items-center p-3 rounded border shadow-sm 
              ${
                isAlreadyAdded
                  ? "bg-gray-100 opacity-60 cursor-not-allowed"
                  : "hover:bg-gray-100 focus:outline-none focus:ring"
              }`}
            onClick={() => !isAlreadyAdded && onClick(item.name)}
            disabled={isAlreadyAdded}
            title={isAlreadyAdded ? "This section is already added" : ""}
          >
            <span className="mr-2">{item.icon}</span>
            <span className="whitespace-nowrap text-nowrap">
              {item.name}
              {isAlreadyAdded && (
                <span className="ml-1 text-xs text-gray-500">(added)</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
//
export default function LandingpageEdit({paramsId}) {
  const dispatch = useDispatch();
  const lpId = paramsId;
  const user = useSelector(selectUser);
  const { setScrollToSection, hoveredField, setHoveredField } = useHover();
  const router = useRouter();
  const [landingPageData, setLandingPageData] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [addMenuItem, setAddMenuItem] = useState(false);
  const [templateMenu, setTemplateMenu] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(890);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Debug modal state
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  // Centralized data fetching state for jobs
  const [availableJobs, setAvailableJobs] = useState([]);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [similarJobsLoading, setSimilarJobsLoading] = useState(false);

  const [isMediaLibOpen, setIsMediaLiOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isAIModalVisible, setIsAIModalVisible] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [imageReorderData, setImageReorderData] = useState(null)

  // image 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const openModal = () => setIsImageOpen(true);
  const closeModal = () => setIsImageOpen(false);

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const hasInitiallyLoadedRef = useRef(false);
  const previousDataRef = useRef(null); // Track previous data to detect meaningful changes
  
  const [isChanged, setIsChanged] = useState(false);
  
  const combinedSections = [
    { key: "flexaligntop" },
    ...(landingPageData?.menuItems ?? []),
    { key: "flexalign" },
    { key: "search" },
  ];
  const activeSection = combinedSections[activeIdx];
  
  const fetchData = useCallback(() => {
    if (lpId) {
      CrudService.getSingle("LandingPageData", lpId).then((res) => {
        if (res.data) {
          setLandingPageData(res.data);
          // Store the initial data for comparison
          previousDataRef.current = JSON.stringify(res.data);
        }
      });
      PublicService.getLPBrand(lpId).then((res) => {
        // if (res.data?.color) {
        //   changeIndigoShades(generateTailwindPalette(res.data?.color));
        // }
      });
    }
  }, [lpId]);

  // Centralized job fetching functions
  
  // Fetch available jobs for RecommendedJobsSelector (EditorRender)
  const fetchAvailableJobs = useCallback(async () => {
    if (!user?._id) {
      setAvailableJobs([]);
      return;
    }

    setJobsLoading(true);
    try {
      
      const result = await CrudService.search(
        "LandingPageData",
        999, // Get a large number of results
        1,
        {
          text: "",
          filters: {
            user_id: user._id,
          },
          sort: { createdAt: -1 }, // Most recent first
        }
      );

      // Filter out the current job if we have an ID to exclude
      let jobList = result.data.items || [];

      if (lpId) {
        jobList = jobList.filter((job) => job._id !== lpId);
      }

      // Transform to format needed for Select component
      const options = jobList.map((job) => ({
        label: job.vacancyTitle || "Untitled Job",
        value: job._id,
        description: job.heroDescription || "",
      }));

      setAvailableJobs(options);
    } catch (error) {
      console.error("Error fetching available jobs:", error);
      message.error("Failed to load jobs");
      setAvailableJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, [user?._id, lpId]);

  // Fetch similar jobs for Footer component
  const fetchSimilarJobs = useCallback(async () => {
    const similarJobsIds = landingPageData?.similarJobs;
    const showSimilarJobs = !!landingPageData?.showSimilarJobs;

    if (!similarJobsIds?.length || !showSimilarJobs) {
      setSimilarJobs([]);
      return;
    }

    setSimilarJobsLoading(true);
    try {
      
      const res = await CrudService.search("LandingPageData", 100, 1, {
        filters: { _id: { $in: similarJobsIds } },
      });
      
      if (res?.data?.items) {
        setSimilarJobs(res?.data?.items);
      }
    } catch (err) {
      console.error("Error fetching similar jobs:", err);
      setSimilarJobs([]);
    } finally {
      setSimilarJobsLoading(false);
    }
  }, [landingPageData?.similarJobs, landingPageData?.showSimilarJobs]);

  // Memoized values to prevent unnecessary re-renders
  const similarJobsIds = useMemo(() => {
    return landingPageData?.similarJobs || [];
  }, [landingPageData?.similarJobs]);

  const showSimilarJobs = useMemo(() => {
    return !!landingPageData?.showSimilarJobs;
  }, [landingPageData?.showSimilarJobs]);

  // Effects to trigger fetching when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAvailableJobs();
    }, 300); // Debounce to prevent rapid calls

    return () => clearTimeout(timeoutId);
  }, [fetchAvailableJobs]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSimilarJobs();
    }, 300); // Debounce to prevent rapid calls

    return () => clearTimeout(timeoutId);
  }, [fetchSimilarJobs]);

  // Auto-save effect
  useEffect(() => {
    // Don't auto-save if landingPageData is null or if we're still loading initial data
    if (!landingPageData || !lpId) return;
    
    // Skip auto-save on initial load
    if (!hasInitiallyLoadedRef.current) {
      hasInitiallyLoadedRef.current = true;
      previousDataRef.current = JSON.stringify(landingPageData);
      return;
    }

    // Check if data has actually changed (excluding timestamps)
    const currentDataForComparison = { ...landingPageData };
    delete currentDataForComparison.updatedAt;
    delete currentDataForComparison.publishedAt;
    delete currentDataForComparison.createdAt;
    const currentDataString = JSON.stringify(currentDataForComparison);
    
    if (previousDataRef.current) {
      const prevDataForComparison = JSON.parse(previousDataRef.current);
      delete prevDataForComparison.updatedAt;
      delete prevDataForComparison.publishedAt;
      delete prevDataForComparison.createdAt;
      const prevDataString = JSON.stringify(prevDataForComparison);
      
      if (currentDataString === prevDataString) {
        return;
      }
    }

    
    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set a new timeout for 2 seconds
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        const res = await CrudService.update("LandingPageData", lpId, landingPageData);
        
        // Update the reference data to prevent unnecessary saves
        previousDataRef.current = JSON.stringify(landingPageData);
        
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000);
    
    // Cleanup function to clear timeout
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [landingPageData, lpId]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const handleImageSelected = (files) => {
    // Process the files as needed
    closeModal();
  };


  // using use effect to detect if the url has ?from=scratch and open the add section modal and remove the ?from=scratch from the url
  useEffect(() => {
    if (window.location.search.includes("?from=scratch")) {
      setAddMenuItem(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
      const scale = container.clientWidth / viewportWidth;
      content.style.transform = `scale(${scale})`;
      content.style.transformOrigin = "top left";
      content.style.width = `${viewportWidth}px`;
      // container.style.height = `${content.scrollHeight * scale}px`;
    }
  }, [viewportWidth, activeIdx]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute("content", `width=${viewportWidth}, initial-scale=1`);
    }
  }, [viewportWidth]);

  const handleViewportChange = (width) => {
    setViewportWidth(width);
  };

  const onReorder = useCallback(
    (newItems) => {
      // Filter out the fixed items (flexaligntop, search, flexalign)
      const reorderedItems = newItems.filter(
        (item) =>
          !["flexaligntop", "form-editor", "search", "flexalign"].includes(
            item.key
          )
      );


      // Update the state
      setLandingPageData((prevData) => ({
        ...prevData,
        menuItems: reorderedItems,
      }));

      // Update the backend
      CrudService.update("LandingPageData", lpId, {
        menuItems: reorderedItems,
      });
    },
    [lpId]
  );


  const addSection = (key) => {
    // Check if a section with this key already exists in menuItems
    const sectionExists = (landingPageData?.menuItems ?? []).some(
      (item) => item.key === key
    );

    if (sectionExists) {
      // If section already exists, show an error message
      message.error(`This section has already been added to the page.`);
      // Don't close the modal so the user can select a different section
      return;
    }

    // If the section doesn't exist, add it as before
    const newMenuItems = [...(landingPageData?.menuItems ?? []), { key }];
    CrudService.update("LandingPageData", lpId, {
      menuItems: newMenuItems,
    });
    setLandingPageData((d) => ({
      ...d,
      menuItems: newMenuItems,
    }));

    setActiveIdx(newMenuItems.length + 0);
    setAddMenuItem(false);
    const sectionToScroll = sectionMap[key];
    setScrollToSection(sectionToScroll);
  };





  const removeSection = (i) => {
    const dynamicIndex = i - 1;

    const newMenuItems = (landingPageData?.menuItems ?? []).filter(
      (item, idx) => idx !== dynamicIndex
    );

    CrudService.update("LandingPageData", lpId, {
      menuItems: newMenuItems,
    });
    setLandingPageData((prevData) => ({
      ...prevData,
      menuItems: newMenuItems,
    }));
    if (activeIdx === i) {
      if (i > 1) {
        setActiveIdx(i - 1);
      } else {
        setActiveIdx(0);
      }
    } else if (activeIdx > i) {
      setActiveIdx(activeIdx - 1);
    }
  };

  const handleUp = (i) => {
    if (i <= 1) return;
    const newMenuItems = [...landingPageData.menuItems];
    [newMenuItems[i - 2], newMenuItems[i - 1]] = [
      newMenuItems[i - 1],
      newMenuItems[i - 2],
    ];
    updateMenuItems(newMenuItems);
  };

  const handleDown = (i) => {
    if (i === landingPageData?.menuItems?.length) return;
    const newMenuItems = [...landingPageData.menuItems];
    [newMenuItems[i], newMenuItems[i - 1]] = [
      newMenuItems[i - 1],
      newMenuItems[i],
    ];
    updateMenuItems(newMenuItems);
  };

  const updateMenuItems = (newMenuItems) => {
    CrudService.update("LandingPageData", lpId, { menuItems: newMenuItems });
    setLandingPageData((d) => ({ ...d, menuItems: newMenuItems }));
  };

  //get selected Media card
  const getSelectedMedia = (data) => {
    if (activeSection.key === "flexaligntop") {
      if (data[0].type === "section-template") {
        const { type, ...templateDataWithoutType } = data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      } else {
        setLandingPageData((prev) => ({
          ...prev,
          heroImage: data[0]?.thumbnail,
        }));
      }
    } else if (activeSection.key === "Leader Introduction") {
      if (data[0].type === "section-template") {
        const { type, ...templateDataWithoutType } = data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      } else {
        setLandingPageData((prev) => ({
          ...prev,
          // ceoAvatar: data[0]?.thumbnail,
          leaderIntroductionAvatar: data[0]?.thumbnail,
        }));
      }
    } else if (activeSection.key === "Video") {
      const {sectionName,type,  ...VideoTemplateData} = data[0]?.templateData
      setLandingPageData((prev) => ({
        ...prev,
        ...VideoTemplateData
      }));
    } else if (activeSection.key === "EVP / Mission") {
      if(data[0].type === "section-template"){
        const { sectionName,type, ...templateDataWithoutType } = data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }else{
        setLandingPageData((prev) => ({
          ...prev,
          evpMissionAvatar: data[0]?.thumbnail,
        }));        
      }

    } else if (activeSection.key === "Image Carousel") {
      
      setLandingPageData((prev) => ({
        ...prev,
        photoImages: [
          ...(prev.photoImages || []),
          ...data.map((d) => d.thumbnail),
        ],
      }));
    } 
    else if (activeSection.key === "Employee Testimonials") {
      setLandingPageData((prev) => ({
        ...prev,
        testimonials: data,
      }));
    } else if (activeSection.key === "Recruiter Contact") {
      // alert("adding data in " + activeSection.key)
      if (data[0].type === "section-template") {
        const { type, sectionName, ...templateDataWithoutType } =
          data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }
    } else if (activeSection.key === "Company Facts") {
      // alert("adding data in " + activeSection.key)
      if (data[0].type === "section-template") {
        const { type, sectionName, ...templateDataWithoutType } =
          data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }
    } else if (activeSection.key === "Candidate Process") {
      alert("adding data in " + activeSection.key)
      if (data[0].type === "section-template") {
        const { type, sectionName, ...templateDataWithoutType } =
          data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }
    } else if (activeSection.key === "Job Description"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      setLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    } else if (activeSection.key === "About The Company"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      setLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    }else if (activeSection.key === "Job Specifications"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      setLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    }else if (activeSection.key === "Agenda"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      setLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    }else if (activeSection.key === "Text Box"){
      if(data[0].type === "section-template"){
        const { sectionName,type, ...templateDataWithoutType } = data[0].templateData;

        setLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }else{
        setLandingPageData((prev) => ({
          ...prev,
          textBoxImage: data[0]?.thumbnail,
        }));        
      }

    }

  };


  const handleAIGenerate = (result) => {
    setLandingPageData((prev) => ({
      ...prev,
      [selectedSection?.key]: result,
    }));
  };




  const mediaLimits = {
    // Existing sections
    flexaligntop: { 
      images: 1, 
      videos: 0, 
      mediaType: "image",
      sectionName: "Hero Section"
    },
    "About The Company": {
      images: 5 - landingPageData?.aboutTheCompanyImages?.length,
      videos: 0,
      mediaType: "image",
      sectionName: "About The Company" 
    },
    "Leader Introduction": { 
      images: 1, 
      videos: 0, 
      mediaType: "image",
      sectionName: "Leader Introduction"
    },
    Video: { 
      images: 0, 
      videos: 1, 
      mediaType: "video",
      sectionName: "Video" 
    },
    "EVP / Mission": {
      images: 1,
      videos: 0,
      mediaType: "image",
      sectionName: "EVP / Mission" 
    },
    "Image Carousel": {
      images: 12 - Number(landingPageData?.photoImages?.length),
      videos: 0,
      mediaType: "image",
      sectionName: "Image Carousel"
    },
    "Employee Testimonials": {
      images: landingPageData?.testimonials?.filter(
        (t) => !t?.avatar || t?.avatar === "/dhwise-images/placeholder.png"
      ).length || 0,
      videos: 0,
      mediaType: "image",
      sectionName: "Employee Testimonials"
    },
    "Recruiter Contact": {
      images: landingPageData?.recruiters?.filter(
        (recruiter) =>
          !recruiter.recruiterAvatar ||
          recruiter.recruiterAvatar.trim() === ""
      ).length || Infinity,
      videos: 0,
      mediaType: "image",
      sectionName: "Recruiter Contact" 
    },
  
    // New sections from switch case
    "form-editor": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Form Editor"
    },
    flexalign: {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Footer"
    },
    "Company Facts": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Company Facts"
    },
    "Agenda": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Agenda"
    },
    "Job Specifications": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Job Specifications"
    },
    "Job Description": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Job Description"
    },
    "Candidate Process": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Candidate Process"
    },
    "Growth Path": {
      images: 0,
      videos: 0,
      mediaType: "section-template",
      sectionName: "Growth Path"
    },
    "Text Box": {
      images: 1,
      videos: 0,
      mediaType: "image",
      sectionName: "Text Box"
    }
  };


  const sendRedux = ()=>{
    if (mediaLimits && activeSection) {
      dispatch(setMediaLimits(mediaLimits));
      dispatch(setActiveSection(activeSection));
    }
  }
  // even writing console log it gives error Rerender how can i fix it 
  useEffect(() => {
    sendRedux()
  }, [activeIdx, activeSection])
  

  // const mediaLimit = mediaLimits[sectionTitle] || { images: Infinity, videos: Infinity }

  
  useEffect(() => {
    const listener = (changed) => {
      setIsChanged(changed);
    };
    eventEmitter.on("changeState", listener);
    return () => {
      eventEmitter.off("changeState", listener);
    };
  }, []);

  useEffect(() => {
    if (!landingPageData || !isChanged) return;

    if (isAutoSaving) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        CrudService.update("LandingPageData", lpId, {
          ...landingPageData,
          _id: undefined,
        }).then(() => {
          message.success("Auto-saved");
          setIsChanged(false);
        });
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [landingPageData, isChanged, isAutoSaving, lpId]);

  const handlePublish = async () => {
    message.loading("Publishing...", 0);
    setIsAutoSaving(false);
    try {
      const res = await CrudService.update("LandingPageData", lpId, landingPageData);
      if (res.data) {
        setLandingPageData(res.data);
        message.destroy();
        message.success("Published successfully");
      }
    } catch (err) {
      message.destroy();
      message.error("Publishing failed");
    } finally {
        setTimeout(() => {
            setIsAutoSaving(true);
        }, 5000);
    }
  };

  const handleUnpublish = async () => {
    message.loading("Unpublishing...", 0);
    // ... existing code ...
  };

  if (!landingPageData) return <Skeleton active />;


  if (fullscreen&&false) {
    return (
      <div className="relative w-full bg-white  flex h-screen"
      style={{
        border:"3px solid red"
      }}
      >
        <div className="px-5 py-3 w-full">
          <PreviewContainer
            pageComponent={<LandingpagePage overrideParamId={lpId} fullscreen={fullscreen} showBackToEditButton={true} setFullscreen={setFullscreen} />}
            fullscreen={fullscreen}
            setFullscreen={setFullscreen}
            landingPageData={landingPageData}
            onFullscreen={() => setFullscreen(false)}
            />
          </div>
        </div>
    )

  }

  //if full screen like the editor , render it in a full page
  if (fullscreen) {

    return (
      <div className="relative">
        <PreviewContainer
          pageComponent={
            <>
              <NavBar
                landingPageData={landingPageData}
                onClickApply={() => {}}
                fullscreen={fullscreen}
                showBackToEditButton={true}
              />
              <div
                key="hero-section"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIdx(0);
                }}
              >
                <HeroSection
                  landingPageData={landingPageData}
                  fetchData={() => {}}
                />
              </div>
              {[
                // { key: "flexaligntop" },
                ...(landingPageData?.menuItems ?? []),
                { key: "flexalign" },
                { key: "search" },
              ].map((section, idx) => {
                return (
                  <div
                    key={`section-${idx}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveIdx(idx+1);
                    }}
                    className="cursor-pointer"
                  >
                    {renderSection({
                      section,
                      fetchData,
                      landingPageData,
                      setLandingPageData,
                      similarJobs,
                      similarJobsLoading,
                    })}
                  </div>
                );
              })}
            </>
          }
          landingPageData={landingPageData}
          fullscreen={fullscreen}
          setFullscreen={setFullscreen}
          showBackToEditButton={true}
        />
      </div>

    )
  }


  return (
    <div
      className="flex overflow-hidden flex-col lg:h-screen"
      style={{ scrollbarWidth: "none" }}
    >
      <Header
        landingPageData={landingPageData}
        setPublished={handlePublish}
        setLandingPageData={setLandingPageData}
        reload={fetchData}
        isAutoSaving={isAutoSaving}
        lpId={lpId}
      />
      <div className="flex flex-grow overflow-hidden justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 mdx:flex-col mdx:p-5 p-3">
        <div
          className={` py-4 flex  flex-grow ${
            fullscreen ? "w-0 overflow-hidden" : "w-[45%]"
          } transition-all duration-300 justify-center mdx:w-full smx:flex-col`}
          style={{ scrollbarWidth: "none" }}
        >
          <Sidebar17
            handleUp={handleUp}
            handleDown={handleDown}
            removeSection={removeSection}
            activeIdx={activeIdx}
            onReorder={onReorder}
            items={landingPageData?.menuItems ?? []}
            onClickAdd={(key, idx) => {
              if (key === "search") setAddMenuItem(true);
              else setActiveIdx(idx);
            }}
            setActiveIdx={setActiveIdx}
          />
          <div className="lg:min-w-[400px] flex flex-grow flex-col border-r border-solid border-blue_gray-50  p-0 smx:self-stretch max-h-full">
            <div className="flex flex-col gap-[15px]  flex-grow lg:overflow-auto relative ">
              <div className="h-px bg-blue_gray-50" />
              <div className="flex gap-5 justify-between items-center mx-3">
                <Heading size="3xl" as="h1" className="!text-black-900_01">
                  {combinedSections[activeIdx]?.key
                    ?.replace?.("flexaligntop", "Hero")
                    ?.replace?.("form-editor", "Form Editor")
                    ?.replace?.("flexalign", "Footer")
                    ?.replace?.("About Company", "About The Company")}
                </Heading>

                {activeIdx !== -1 && (
                  <div className="flex flex-row items-center">
                  {/* Auto-save indicator */}
                    {isAutoSaving && (
                    <div className=" items-center gap-2 text-sm text-blue-600 mr-2 hidden ">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span>Saving...</span>
                    </div>
                  )}
                    <button
                      onClick={() => setIsAIModalVisible(true)}
                      className="flex justify-center items-center"
                    >
                      <Img
                        src="/images2/img_magic_wand_01.svg"
                        alt="magicwandone"
                        className="h-[20px] w-[20px] cursor-pointer"
                      />
                    </button>

                    <AIEditModal
                      visible={isAIModalVisible}
                      onClose={() => setIsAIModalVisible(false)}
                      sectionName={[
                        { key: "flexaligntop" },
                        ...(landingPageData?.menuItems ?? []),
                        { key: "flexalign" },
                        { key: "search" },
                      ][activeIdx]?.key
                        ?.replace?.("flexaligntop", "Hero")
                        ?.replace?.("form-editor", "Form Editor")
                        ?.replace?.("flexalign", "Footer")
                        ?.replace?.("About Company", "About The Company")}
                      vacancyId={lpId}
                      vacancyData={landingPageData}
                      onSuccess={() => {
                        // Refresh the data after successful save
                        fetchData();
                        setIsAIModalVisible(false);
                      }}
                    />
                    <button
                      onClick={() => {
                        setIsOpen(true);
                      }}
                      title="Media Library"
                    >
                      {/* <div>
                        <img
                          src="/images/template1.svg"
                          alt="thumbnail-media-lib"
                          className="h-[25px] w-[25px] border-none"
                      />
                      </div> */}
                    </button>


                    {/* <button onClick={()=>{setIsImageOpen(true)}} >
                      File Modal 
                    </button> */}

                    <div>
                      {isOpen && (
                        <div className="flex fixed inset-0 z-50 justify-center items-center bg-opacity-80 bg-black-900">
                          <div className="flex overflow-hidden flex-col w-full h-full bg-white rounded-lg shadow-lg md:w-4/5 md:h-4/5">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 py-2 bg-gray-100 border-b border-gray-300">
                              <div className="flex gap-4 items-center">
                                <h2 className="text-xl font-semibold">
                                  {`  
                                  ${
                                    activeSection?.key
                                      ? `
                                  ${activeSection?.key
                                    ?.replace?.("flexaligntop", "Hero")
                                    ?.replace?.("form-editor", "Form Editor")
                                    ?.replace?.("flexalign", "Footer")
                                    ?.replace?.(
                                      "About Company",
                                      "About The Company"
                                    )} Section`
                                      : ""
                                  }`}
                                </h2>
                              </div>
                              <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ✖
                              </button>
                            </div>

                            {/* Modal Content */}
                            <div className="overflow-auto flex-1 p-4">
                              <MediaLibrary
                                isAddSectionButtonVisible={false}
                                getSelectedMedia={getSelectedMedia}
                                //  setGetMediaDataFromChild={setGetMediaDataFromChild}
                                activeSection={activeSection?.key}
                                mediaLimits={mediaLimits}
                                setIsMediaLiOpen={setIsOpen}
                                landingPageData={landingPageData}
                              />


                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                    <ImageSelectionModal 
                      isOpen={isImageOpen} 
                      onClose={closeModal} 
                      onImageSelected={handleImageSelected} 
                    />
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="h-px bg-blue_gray-50" /> */}
              <div className="flex flex-col gap-6 h-full">
                {renderEditor({
                  section: [
                    { key: "flexaligntop" },
                    ...(landingPageData?.menuItems ?? []),
                    { key: "flexalign" },
                    { key: "search" },
                  ][activeIdx],
                  fetchData,
                  landingPageData,
                  setLandingPageData,
                  availableJobs,
                  jobsLoading,
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`overflow-scroll overflow-x-hidden  ${
            fullscreen ? "w-full" : "w-[40%] xl:w-[60%]"
          } transition-all duration-300 border-r border-solid border-blue_gray-50 px-2  mdx:w-full p-1`}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex hidden gap-5 justify-between items-center">
            <Heading
              size="7xl"
              as="h2"
              className="self-start !text-black-900_01"
            >
              Preview
            </Heading>

            {/* <div className="h-[34px] gap-2 bg-[#EFF8FF] rounded-[6px] cursor-pointer flex justify-between items-center px-[3px] text-sm">
              <Button
                className="flex items-center justify-start !h-[28px] !px-3 border rounded shadow-sm bg-[#0E87FE] text-[#ffffff] focus:outline-none focus:ring"
                onClick={() => setTemplateMenu(true)}
              >
                Change Template
              </Button>
            </div> */}
            <button
              className="flex items-center justify-center h-[28px] w-[28px] rounded hover:bg-gray-100"
              onClick={() => setFullscreen((prev) => !prev)}
            >
              {fullscreen ? (
                <img
                  src="/images/expand-06.svg"
                  alt="collapse"
                  className="h-[20px] w-[20px]"
                />
              ) : (
                <img
                  src="/images/expand-06.svg"
                  alt="expand"
                  className="h-[20px] w-[20px]"
                />
              )}
            </button>
          </div>

          <div className=" h-[650px] overflow-x-hidden overflow-y-auto lg:h-[calc(100vh-100px)] min-h-[450px] mt-4 text-sm text-center text-gray-400 border border-blue-600 rounded-lg"
            style={{
              scrollbarWidth: "none",

            }}>

          <PreviewContainer
            pageComponent={
              <>
                <NavBar
                  landingPageData={landingPageData}
                  onClickApply={() => {}}
                  fullscreen={fullscreen}
                  showBackToEditButton={false}
                />
                            <div
                  key="hero-section"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(0);
                  }}
                >
                  <HeroSection
                    landingPageData={landingPageData}
                    fetchData={() => {}}
                  />
                </div>
                {[
                  // { key: "flexaligntop" },
                  ...(landingPageData?.menuItems ?? []),
                  { key: "flexalign" },
                  { key: "search" },
                ].map((section, idx) => {
                  return (
                    <div
                      key={`section-${idx}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveIdx(idx+1);
                      }}
                      className="cursor-pointer"
                    >
                      {renderSection({
                        section,
                        fetchData,
                        landingPageData,
                        setLandingPageData,
                        similarJobs,
                        similarJobsLoading,
                      })}
                    </div>
                  );
                })}
              </>
            }
            landingPageData={landingPageData}
            fullscreen={fullscreen}
            setFullscreen={setFullscreen}
          />
         </div>
        </div>
      </div>

      <Modal
        open={addMenuItem}
        onCancel={() => setAddMenuItem(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title="Add category"
      >
        <div className="p-6">
          <Input
            size="md"
            shape="round"
            name="search"
            placeholder={`Search`}
            // value={searchBarValue125}
            // onChange={(e) => setSearchBarValue125(e)}
            prefix={
              <Img
                src="/images/img_search_blue_gray_500.svg"
                alt="search"
                className="h-[20px] w-[20px] cursor-pointer"
              />
            }
            className="w-full gap-2 !text-blue_gray-500 smx:pr-5 mb-8 "
          />

          {categories.map((category, index) => (
            <Category
              key={index}
              title={category.title}
              items={category.items}
              onClick={(key) => {
                addSection(key);
              }}
              existingItems={landingPageData?.menuItems ?? []}
            />
          ))}
        </div>
      </Modal>

      <Modal
        open={templateMenu}
        onCancel={() => setTemplateMenu(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title="Choose template"
      >
        <div className="grid grid-cols-3 gap-6 justify-center py-3 mdx:grid-cols-2">
          {new Array(3).fill(0).map((a, i) => (
            <div
              key={i}
              className={`flex w-full flex-col items-start gap-5 rounded-lg border px-3.5 py-4 cursor-pointer ${
                landingPageData?.templateId === `${i + 1}`
                  ? "border-solid border-light_blue-A700 bg-gray-100_01"
                  : ""
              }`}
              onClick={() => {
                setLandingPageData((d) => ({ ...d, templateId: `${i + 1}` }));
                CrudService.update("LandingPageData", lpId, {
                  templateId: `${i + 1}`,
                });
                setTemplateMenu(false);
              }}
            >
              <Img
                src="/images/img_rectangle_258.png"
                alt="template_name"
                className="h-[125px] w-full rounded-md object-cover mdx:h-auto"
              />
              <Heading
                size="4xl"
                as="h2"
                className="!text-gray-900 whitespace-nowrap"
              >
                Template {i + 1}
              </Heading>
              <div className="flex flex-col gap-3 self-stretch">
                <Button
                  size="3xl"
                  shape="round"
                  className={`${
                    landingPageData?.templateId === `${i + 1}`
                      ? "bg-[#0E87FE] text-[#FFFFFF]"
                      : "bg-[#FFFFFF] text-blue_gray-800_01 border border-solid border-blue_gray-100"
                  } w-full font-semibold smx:px-5 whitespace-nowrap`}
                >
                  Choose template
                </Button>
              </div>
            </div>
          ))}
        </div>
        
      </Modal>

      {/* Sticky Debug Button - Only show if debug data exists */}
      {landingPageData?.debugData && (
        <button
          onClick={() => setIsDebugModalOpen(true)}
          className="fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          title="Debug Vacancy Creation"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" 
            />
          </svg>
        </button>
      )}

      {/* Debug Modal */}
      <VacancyCreationDebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        debugData={landingPageData?.debugData}
      />
    </div>
  );
}
