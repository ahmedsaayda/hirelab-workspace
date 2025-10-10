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
import Sidebar17, { sectionMap } from "../Dashboard/Vacancies/components/components/Sidebar17/index.jsx";
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
import ImageSelectionModal from "../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";
import { useDispatch } from "react-redux";
import { setActiveSection, setMediaLimits } from "../../redux/landingPage/mediaUploadReducer.js";
import VacancyCreationDebugModal from "./VacancyCreationDebugModal.jsx";
import eventEmitter from "../../utils/eventEmitter.js";
import { PreviewContainer } from "../Dashboard/Vacancies/components/preview-container.jsx";
import LandingPageService from "../../services/landingPageService.js";

export const renderSection = ({
  section,
  fetchData,
  landingPageData = defaultLandingPageData,
  setLandingPageData,
  key=section?.key || "section", // Use stable key instead of Math.random()
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
        onClickApply={() => {}}
        lpId={landingPageData?._id}
        isEdit={true}
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
  console.log("render Editor the key is",section?.key)
  console.log("render Editor the section is",section)
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
        key: "Employee Testimonials",
        name: "Employee Testimonials",
        icon: <img src="/icons2/users-01.svg" alt=" "></img>,
      },
      {
        key: "Leader Introduction",
        name: "Leader Introduction",
        icon: <img src="/icons2/user-01.svg" alt=" "></img>,
      },
      {
        key: "Recruiter Contact",
        name: "Recruiter Contact",
        icon: <img src="/icons2/message-chat-circle.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "JOB EXPLANATION",
    items: [
      {
        key: "Agenda",
        name: "Agenda",
        icon: <img src="/icons2/calendar.svg" alt=" "></img>,
      },
      {
        key: "Job Specifications",
        name: "Job Specifications",
        icon: <img src="/icons2/briefcase-01.svg" alt=" "></img>,
      },
      {
        key: "Job Description",
        name: "Job Description",
        icon: <img src="/icons2/edit-04.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "COMPANY",
    items: [
      {
        key: "About The Company",
        name: "About The Company",
        icon: <img src="/icons2/intersect-circle.svg" alt=" "></img>,
      },
      {
        key: "EVP / Mission",
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
        key: "Company Facts",
        name: "Company Facts",
        icon: <img src="/icons2/zap.svg" alt=" "></img>,
      },
    ],
  },
  {
    title: "PROCESS",
    items: [
      {
        key: "Candidate Process",
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
      {
        key: "Image Carousel",
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
            onClick={() => !isAlreadyAdded && onClick(item.key)}
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

export default function LandingpageEdit({paramsId}) {
  const dispatch = useDispatch();
  let lpId = paramsId;
  const router = useRouter();
  if(!lpId) lpId = router.query.lpId;
  console.log("lpId",lpId)
  const user = useSelector(selectUser);
  const { setScrollToSection, hoveredField, setHoveredField } = useHover();
  const [landingPageData, setLandingPageData] = useState(null);
  const [activeKey, setActiveKey] = useState("flexaligntop");
  console.log("the activeKey is",activeKey)
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
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const pendingNavigationRef = useRef(null);
  const navigationOverrideRef = useRef(false);
  const hasUnpublishedChangesRef = useRef(false);
  const sessionHasChangesRef = useRef(false);
  const ackKey = useMemo(() => (lpId ? `lp-guard-ack:${lpId}:page` : null), [lpId]);

  // image 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const openModal = () => setIsImageOpen(true);
  const closeModal = () => setIsImageOpen(false);

  // 🔥 NEW: Auto-save and change detection system
  const autoSaveTimeoutRef = useRef(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [hasImmediateUnsavedChanges, setHasImmediateUnsavedChanges] = useState(false);
  
  
  const combinedSections = [
    { key: "flexaligntop" },
    ...(landingPageData?.menuItems ?? []).filter(item => item.active).sort((a, b) => (a.sort || 0) - (b.sort || 0)),
    { key: "flexalign" },
    { key: "search" },
  ];
  const activeSection = combinedSections.find(section => section.key === activeKey) || combinedSections[0];
  const activeIdx = combinedSections.findIndex(section => section.key === activeKey);
  
  const fetchData = useCallback(() => {
    console.log("will fetch data for id",lpId)
    if(!lpId) {
      return;
    }
    try{
      if (lpId) {
        CrudService.getSingle("LandingPageData", lpId,"landing page edit").then((res) => {
          if (res.data) {
            // Add showHirelabBranding flag based on user's subscription status
            const showHirelabBranding = !user?.subscription?.paid;
            const landingPageDataWithBranding = {
              ...res.data,
              showHirelabBranding
            };
            setLandingPageData(landingPageDataWithBranding);
            
            // 🔥 Check for unpublished changes after loading data
            checkForUnpublishedChanges(landingPageDataWithBranding);
          }
        },"landing page id");

      }
    }catch(err){
      message.error("Failed to load landing page data");
      console.log("error fetching data",err)
    }
  }, [lpId, user?.subscription?.paid]);

  useEffect(() => {
    // Guard on unpublished changes (post-autosave)
    hasUnpublishedChangesRef.current = hasUnpublishedChanges;
  }, [hasUnpublishedChanges]);

  const handleExitCancel = useCallback(() => {
    pendingNavigationRef.current = null;
    setIsExitModalVisible(false);
  }, []);

  const handleExitConfirm = useCallback(() => {
    const nextNav = pendingNavigationRef.current;
    pendingNavigationRef.current = null;
    setIsExitModalVisible(false);

    if (!nextNav) {
      return;
    }

    navigationOverrideRef.current = true;
    if (ackKey) sessionStorage.setItem(ackKey, 'ack');
    sessionHasChangesRef.current = false;

    // Execute navigation after a short delay to ensure modal closes first
    setTimeout(() => {
      try {
        if (typeof nextNav.exec === "function") {
          nextNav.exec();
        }
      } finally {
        // Reset override after navigation completes or fails
        setTimeout(() => {
          navigationOverrideRef.current = false;
        }, 100);
      }
    }, 10);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = (url, opts = {}) => {
      if (navigationOverrideRef.current) return;

      // Respect prior acknowledgement if no new edits since last acknowledgement
      const acknowledged = ackKey ? sessionStorage.getItem(ackKey) === 'ack' : false;
      if (acknowledged && !sessionHasChangesRef.current) {
        return;
      }

      if (!hasUnpublishedChangesRef.current) {
        return;
      }

      // Prevent guard when navigating to the same path
      if (url === router.asPath) {
        return;
      }

      pendingNavigationRef.current = {
        exec: () => router.push(url, undefined, opts),
      };

      setIsExitModalVisible(true);

      const error = new Error("Route change aborted due to unpublished changes.");
      error.cancelled = true;
      router.events.emit("routeChangeError", error, url, opts);
      throw error;
    };

    const handleRouteChangeComplete = () => {
      navigationOverrideRef.current = false;
    };

    const handleRouteChangeError = () => {
      navigationOverrideRef.current = false;
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router]);

  useEffect(() => {
    router.beforePopState(() => {
      if (navigationOverrideRef.current || !hasUnpublishedChangesRef.current) {
        return true;
      }

      pendingNavigationRef.current = { exec: () => router.back() };
      setIsExitModalVisible(true);
      return false;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  useEffect(() => {
    if (!hasImmediateUnsavedChanges) {
      setIsExitModalVisible(false);
      pendingNavigationRef.current = null;
    }
  }, [hasImmediateUnsavedChanges]);


  // Handle browser refresh/close with native dialog
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnpublishedChangesRef.current) {
        e.preventDefault();
        const message = "You're leaving this page but there are unpublished changes, are you sure you want to exit?";
        e.returnValue = message;
        return message;
      }
    };

    const handleKeydown = (e) => {
      // Intercept refresh shortcuts and show our modal instead
      const isRefresh = (e.key === 'F5') || (e.key.toLowerCase() === 'r' && (e.ctrlKey || e.metaKey));
      if (isRefresh && hasUnpublishedChangesRef.current) {
        e.preventDefault();
        e.stopPropagation();
        pendingNavigationRef.current = { exec: () => window.location.reload() };
        setIsExitModalVisible(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeydown, { capture: true });
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeydown, { capture: true });
    };
  }, []);

  // 🔥 NEW: Function to check for unpublished changes (PAGE SCOPE ONLY)
  const checkForUnpublishedChanges = useCallback((currentData = landingPageData) => {
    if (!currentData?.published || !currentData?.publishedVersion) {
      setHasUnpublishedChanges(false);
      return false;
    }

    try {
      // Compare current page data (excluding form) with published page data
      const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        const { _id, __v, updatedAt, createdAt, publishedAt, unpublishedAt, publishedVersion, showHirelabBranding, debugData, ...rest } = obj;
        return rest;
      };

      // PAGE SCOPE: Compare everything except form
      const stripForm = (obj) => {
        const { form, ...rest } = sanitize(obj || {});
        return rest;
      };

      const currentPageData = stripForm(currentData);
      const publishedPageData = stripForm(currentData.publishedVersion);

      // Quick comparison using JSON.stringify
      const hasChanges = JSON.stringify(currentPageData) !== JSON.stringify(publishedPageData);
      
      console.log("🔍 PAGE Change Detection:", {
        hasChanges,
        currentDataKeys: Object.keys(currentPageData).length,
        publishedDataKeys: Object.keys(publishedPageData).length,
        published: currentData.published
      });

      setHasUnpublishedChanges(hasChanges);
      return hasChanges;
    } catch (error) {
      console.warn('Error in change detection:', error);
      setHasUnpublishedChanges(false);
      return false;
    }
  }, [landingPageData]);

  // 🔥 NEW: Auto-save function that DOESN'T touch publishedVersion
  const performAutoSave = useCallback(async (dataToSave) => {
    if (!lpId || !dataToSave) return false;

    setIsAutoSaving(true);
    try {
      // Clean data for saving (remove system fields)
      const { _id, showHirelabBranding, debugData, ...cleanData } = dataToSave;
      
      console.log("💾 Auto-saving page changes (not touching publishedVersion)");
      
      const response = await CrudService.update("LandingPageData", lpId, cleanData, "landing page edit");
      
      if (response?.data) {
        // Update local state with fresh data from server
        setLandingPageData(response.data);
        
        // Clear immediate unsaved changes after successful auto-save
        setHasImmediateUnsavedChanges(false);
        
        // Re-check for unpublished changes
        setTimeout(() => {
          checkForUnpublishedChanges(response.data);
        }, 100);
      }
      
      return true;
    } catch (error) {
      console.error("❌ Auto-save failed:", error);
      message.error("Failed to save changes");
      return false;
    } finally {
      setIsAutoSaving(false);
    }
  }, [lpId, checkForUnpublishedChanges]);

  // 🔥 NEW: Debounced auto-save
  const debouncedAutoSave = useCallback((dataToSave) => {
    // If exit modal is open, pause autosave until the user decides
    if (isExitModalVisible) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave(dataToSave);
    }, 1500); // 1.5 second debounce
  }, [performAutoSave, isExitModalVisible]);

  // 🔥 NEW: Enhanced setLandingPageData that triggers auto-save and change detection
  const updateLandingPageData = useCallback((newData) => {
    // Mark as having immediate unsaved changes
    setHasImmediateUnsavedChanges(true);
    sessionHasChangesRef.current = true; // any edit in this session invalidates previous acknowledgements
    
    if (typeof newData === 'function') {
      setLandingPageData(prevData => {
        const updatedData = newData(prevData);

        if (updatedData) {
          if (lpId) {
            debouncedAutoSave(updatedData);
          }
          checkForUnpublishedChanges(updatedData);
        }

        return updatedData;
      });
    } else {
      setLandingPageData(newData);

      if (newData) {
        if (lpId) {
          debouncedAutoSave(newData);
        }
        checkForUnpublishedChanges(newData);
        sessionHasChangesRef.current = true;
      }
    }
  }, [debouncedAutoSave, lpId, checkForUnpublishedChanges]);

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
  }, [viewportWidth, activeKey]);

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

      // Update sort values based on new order
      const updatedMenuItems = (landingPageData?.menuItems ?? []).map(item => {
        const newIndex = reorderedItems.findIndex(reorderedItem => reorderedItem.key === item.key);
        if (newIndex !== -1) {
          // This item is active and has been reordered
          return { ...item, sort: newIndex + 1 };
        }
        // Keep inactive items with their original sort or assign high sort value
        return item;
      });

      // Update the state
      updateLandingPageData((prevData) => ({
        ...prevData,
        menuItems: updatedMenuItems,
      }));
    },
    [lpId, landingPageData?.menuItems, updateLandingPageData]
  );


  const addSection = (key) => {
    // Check if a section with this key already exists and is active
    const existingMenuItems = landingPageData?.menuItems ?? [];
    const existingSectionIndex = existingMenuItems.findIndex(item => item.key === key);

    if (existingSectionIndex !== -1 && existingMenuItems[existingSectionIndex].active) {
      // If section already exists and is active, show an error message
      message.error(`This section is already active on the page.`);
      return;
    }

    let newMenuItems;
    if (existingSectionIndex !== -1) {
      // Section exists but is inactive, activate it
      newMenuItems = existingMenuItems.map((item, index) => 
        index === existingSectionIndex 
          ? { ...item, active: true, visible: true }
          : item
      );
    } else {
      // Section doesn't exist, add it with proper defaults
      const getNextSortOrder = () => {
        const maxSort = Math.max(...existingMenuItems.map(item => item.sort || 0), 0);
        return maxSort + 1;
      };

      const newItem = {
        key,
        label: key, // Default label, will be overridden by AI translations
        active: true,
        visible: true,
        sort: getNextSortOrder()
      };
      newMenuItems = [...existingMenuItems, newItem];
    }

    updateLandingPageData((d) => ({
      ...d,
      menuItems: newMenuItems,
    }));

    setActiveKey(key);
    setAddMenuItem(false);
    const sectionToScroll = sectionMap[key];
    setScrollToSection(sectionToScroll);
  };

  const removeSection = (i) => {
    const currentActiveMenuItems = (landingPageData?.menuItems ?? []).filter(item => item.active);
    const dynamicIndex = i - 1;
    
    if (dynamicIndex < 0 || dynamicIndex >= currentActiveMenuItems.length) return;
    
    const sectionToRemove = currentActiveMenuItems[dynamicIndex];
    
    // Mark the section as inactive instead of removing it
    const newMenuItems = (landingPageData?.menuItems ?? []).map(item => 
      item.key === sectionToRemove.key 
        ? { ...item, active: false, visible: false }
        : item
    );

    updateLandingPageData((prevData) => ({
      ...prevData,
      menuItems: newMenuItems,
    }));
    
    // Update activeKey based on remaining active sections
    const removedSection = currentActiveMenuItems[i - 1];
    
    if (activeKey === removedSection?.key) {
      // If we're removing the currently active section, switch to hero section
      if (i > 1) {
        const previousSection = currentActiveMenuItems[i - 2];
        setActiveKey(previousSection?.key || "flexaligntop");
      } else {
        setActiveKey("flexaligntop");
      }
    }
  };

  const handleUp = (i) => {
    if (i <= 1) return;
    
    const currentActiveItems = (landingPageData?.menuItems ?? []).filter(item => item.active);
    if (i - 2 < 0 || i - 1 >= currentActiveItems.length) return;
    
    const currentItem = currentActiveItems[i - 1];
    const itemAbove = currentActiveItems[i - 2];
    
    // Swap sort values
    const newMenuItems = (landingPageData?.menuItems ?? []).map(item => {
      if (item.key === currentItem.key) {
        return { ...item, sort: itemAbove.sort };
      } else if (item.key === itemAbove.key) {
        return { ...item, sort: currentItem.sort };
      }
      return item;
    });
    
    updateMenuItems(newMenuItems);
  };

  const handleDown = (i) => {
    const currentActiveItems = (landingPageData?.menuItems ?? []).filter(item => item.active);
    if (i >= currentActiveItems.length) return;
    
    const currentItem = currentActiveItems[i - 1];
    const itemBelow = currentActiveItems[i];
    
    // Swap sort values
    const newMenuItems = (landingPageData?.menuItems ?? []).map(item => {
      if (item.key === currentItem.key) {
        return { ...item, sort: itemBelow.sort };
      } else if (item.key === itemBelow.key) {
        return { ...item, sort: currentItem.sort };
      }
      return item;
    });
    
    updateMenuItems(newMenuItems);
  };

  const updateMenuItems = (newMenuItems) => {
    updateLandingPageData((d) => ({ ...d, menuItems: newMenuItems }));
  };

  const handleSectionVisibilityUpdate = (sectionKey, visible) => {
    const updatedMenuItems = (landingPageData?.menuItems ?? []).map((item) => {
      if (item.key === sectionKey) {
        return { ...item, visible };
      }
      return item;
    });
    
    updateMenuItems(updatedMenuItems);
  };

  //get selected Media card
  const getSelectedMedia = (data) => {
    if (activeSection.key === "flexaligntop") {
      if (data[0].type === "section-template") {
        const { type, ...templateDataWithoutType } = data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      } else {
        updateLandingPageData((prev) => ({
          ...prev,
          heroImage: data[0]?.thumbnail,
        }));
      }
    } else if (activeSection.key === "Leader Introduction") {
      if (data[0].type === "section-template") {
        const { type, ...templateDataWithoutType } = data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      } else {
        updateLandingPageData((prev) => ({
          ...prev,
          // ceoAvatar: data[0]?.thumbnail,
          leaderIntroductionAvatar: data[0]?.thumbnail,
        }));
      }
    } else if (activeSection.key === "Video") {
      const {sectionName,type,  ...VideoTemplateData} = data[0]?.templateData
      updateLandingPageData((prev) => ({
        ...prev,
        ...VideoTemplateData
      }));
    } else if (activeSection.key === "EVP / Mission") {
      if(data[0].type === "section-template"){
        const { sectionName,type, ...templateDataWithoutType } = data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }else{
        updateLandingPageData((prev) => ({
          ...prev,
          evpMissionAvatar: data[0]?.thumbnail,
        }));        
      }

    } else if (activeSection.key === "Image Carousel") {
      
      updateLandingPageData((prev) => ({
        ...prev,
        photoImages: [
          ...(prev.photoImages || []),
          ...data.map((d) => d.thumbnail),
        ],
      }));
    } 
    else if (activeSection.key === "Employee Testimonials") {
      updateLandingPageData((prev) => ({
        ...prev,
        testimonials: data,
      }));
    } else if (activeSection.key === "Recruiter Contact") {
      // alert("adding data in " + activeSection.key)
      if (data[0].type === "section-template") {
        const { type, sectionName, ...templateDataWithoutType } =
          data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }
    } else if (activeSection.key === "Company Facts") {
      // alert("adding data in " + activeSection.key)
      if (data[0].type === "section-template") {
        const { type, sectionName, ...templateDataWithoutType } =
          data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }
    } else if (activeSection.key === "Candidate Process") {
      alert("adding data in " + activeSection.key)
      if (data[0].type === "section-template") {
        const { type, sectionName, ...templateDataWithoutType } =
          data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }
    } else if (activeSection.key === "Job Description"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      updateLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    } else if (activeSection.key === "About The Company"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      updateLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    }else if (activeSection.key === "Job Specifications"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      updateLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    }else if (activeSection.key === "Agenda"){
      const {sectionName,type,  ...templateData} = data[0]?.templateData
      updateLandingPageData((prev) => ({
        ...prev,
        ...templateData
      }));
    }else if (activeSection.key === "Text Box"){
      if(data[0].type === "section-template"){
        const { sectionName,type, ...templateDataWithoutType } = data[0].templateData;

        updateLandingPageData((prev) => ({
          ...prev,
          ...templateDataWithoutType,
        }));
      }else{
        updateLandingPageData((prev) => ({
          ...prev,
          textBoxImage: data[0]?.thumbnail,
        }));        
      }

    }

  };


  const handleAIGenerate = (result) => {
    updateLandingPageData((prev) => ({
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
  }, [activeKey, activeSection])
  

  // 🔥 NEW: Proper publish handler for PAGE scope
  const handlePublish = async () => {
    if (!landingPageData) return;

    message.loading("Publishing page changes...", 0);
    setIsAutoSaving(false); // Stop auto-saving during publish
    
    try {
      // Use the proper scope-based publish endpoint
      const res = await LandingPageService.publishLandingPage(lpId, "page");
      
      console.log("✅ PAGE publish response:", res);
      message.destroy();
      message.success("Page published successfully!");
      
      // Refresh data to get latest publishedVersion
      setTimeout(() => {
        fetchData();
      }, 500);
      
    } catch (err) {
      message.destroy();
      message.error("Failed to publish: " + (err.message || "Unknown error"));
      console.error("❌ Publish failed:", err);
    }
  };

  if (!landingPageData) return <Skeleton active />;

  //if full screen like the editor , render it in a full page
  if (fullscreen) {

    return (
      <div className="relative flex items-center justify-center min-h-[calc(100vh-50px)] ">
        <PreviewContainer
          pageComponent={
            <>
              <NavBar
                landingPageData={landingPageData}
                onClickApply={() => {}}
                fullscreen={fullscreen}
                setFullscreen={setFullscreen}
                showBackToEditButton={true}
                lpId={lpId}
                isEdit={true}
                isMovilePreview={true}
              />
              <div
                key="hero-section"
                                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveKey("flexaligntop");
                  }}
                  style={{
                    paddingTop:10
                  }}
              >
                <HeroSection
                  landingPageData={landingPageData}
                  fetchData={() => {}}
                />
              </div>
              {[
                // { key: "flexaligntop" },
                ...(landingPageData?.menuItems ?? [])?.sort((a, b) => a?.sort - b?.sort),
                { key: "flexalign" },
                { key: "search" },
              ]
              .filter(section => {
                // Always show special keys like flexalign and search
                if (section.key === "flexalign" || section.key === "search") return true;
                // For menuItems, only show if active and visible
                return section.active && section.visible !== false;
              })
              
              .map((section, idx) => {
                return (
                  <div
                    key={`section-${idx}`}
                                          onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveKey(section.key);
                      }}
                    className="cursor-pointer"
                  >
                    {renderSection({
                      section,
                      fetchData,
                      landingPageData,
                      setLandingPageData: updateLandingPageData,
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
        setLandingPageData={updateLandingPageData}
        reload={fetchData}
        isAutoSaving={isAutoSaving}
        hasUnpublishedChanges={hasUnpublishedChanges}
        lpId={lpId}
        onNavigateAttempt={(href) => {
          const acknowledged = ackKey ? sessionStorage.getItem(ackKey) === 'ack' : false;
          if (!hasUnpublishedChangesRef.current || (acknowledged && !sessionHasChangesRef.current)) {
            router.push(href);
            return;
          }
          pendingNavigationRef.current = { exec: () => router.push(href) };
          setIsExitModalVisible(true);
        }}
      />
      <div className="flex flex-grow overflow-hidden justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 mdx:flex-col mdx:p-5 p-3 pl-0">
        <div
          className={` py-4 flex flex-shrink-0  lg:min-w-[590px] flex-grow ${
            fullscreen ? "w-0 overflow-hidden" : "w-full lg:w-[35%]"
          } transition-all duration-300 justify-center  `}
          style={{ scrollbarWidth: "none" ,}}
        >
          <Sidebar17
            handleUp={handleUp}
            handleDown={handleDown}
            removeSection={removeSection}
            activeKey={activeKey}
            activeIdx={activeIdx}
            onReorder={onReorder}
            items={(landingPageData?.menuItems ?? []).filter(item => item.active).sort((a, b) => (a.sort || 0) - (b.sort || 0))}
            onClickAdd={(key, idx) => {
              if (key === "search") setAddMenuItem(true);
              else setActiveKey(key);
            }}
            setActiveKey={setActiveKey}
            onSectionVisibilityUpdate={handleSectionVisibilityUpdate}
          />
          <div className="lg:min-w-[450px] flex flex-grow flex-col border-r border-solid border-blue_gray-50  p-0 smx:self-stretch max-h-full">
            <div className="flex flex-col gap-[15px]  flex-grow lg:overflow-auto relative ">
              <div className="h-px bg-blue_gray-50" />
              <div className="flex gap-5 justify-between items-center mx-3">
                <Heading size="3xl" as="h1" className="!text-black-900_01">
                  {activeSection?.key
                    ?.replace?.("flexaligntop", "Hero")
                    ?.replace?.("form-editor", "Form Editor")
                    ?.replace?.("flexalign", "Footer")
                    ?.replace?.("About Company", "About The Company")}
                </Heading>

                {activeSection && (
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
                      ].find(s => s.key === activeKey)?.key
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
                     
                    </button>


                  

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
                  section: activeSection,
                  fetchData,
                  landingPageData,
                  setLandingPageData: updateLandingPageData,
                  availableJobs,
                  jobsLoading,
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`overflow-scroll overflow-x-hidden  ${
            fullscreen ? "w-full" : "w-full"
          } transition-all duration-300 border-r border-solid border-blue_gray-50 px-2  mdx:w-full p-1`}
          style={{ scrollbarWidth: "none" ,}}
        >
         

          <div className=" h-[650px] overflow-x-hidden overflow-y-auto lg:h-[calc(100vh-100px)] min-h-[450px]  text-sm text-center text-gray-400 border border-blue-600 rounded-lg"
            style={{
              scrollbarWidth: "none",
              padding:0,
              }}>

          <PreviewContainer
            pageComponent={
              <div style={{
                width:"100%",
              }}>
                <NavBar
                  landingPageData={landingPageData}
                  onClickApply={() => {}}
                  fullscreen={fullscreen}
                  showBackToEditButton={false}
                  lpId={lpId}
                  isEdit={true}
                  setLandingPageData={updateLandingPageData}
                />
                            <div
                  key="hero-section"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveKey("flexaligntop");
                  }}
                >
                  <HeroSection
                    landingPageData={landingPageData}
                    fetchData={() => {}}
                  />
                </div>
                {[
                  // { key: "flexaligntop" },
                  ...(landingPageData?.menuItems ?? [])?.sort((a, b) => a.sort - b.sort),
                  { key: "flexalign" ,id:"footer",visible:true,active:true,sort:1000,},
                  { key: "search" ,id:"search",visible:true,active:true,sort:1001,},
                ].map((section, idx) => {
                  const isHidden = section.visible === false;
                  console.log("section===>", section);
                  const isActive = section.active;
                  if(!isActive){
                    console.log("section", section);
                    return null;
                  }
                  return (
                    <div
                      key={`section-${idx}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveKey(section.key);
                      }}
                      className={`cursor-pointer ${isHidden ? 'opacity-20 blur-xl pointer-events-none relative' : ''}`}
                      style={isHidden ? { 
                        filter: 'grayscale(50%) blur(5px)',
                        opacity: 0.5,
                        transition: 'all 0.3s ease'
                      } : {}}
                    >
                    
                      {renderSection({
                        section,
                        fetchData,
                        landingPageData,
                        setLandingPageData: updateLandingPageData,
                        similarJobs,
                        similarJobsLoading,
                      })}
                    </div>
                  );
                })}
              </div>
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
              existingItems={(landingPageData?.menuItems ?? []).filter(item => item.active)}
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
                updateLandingPageData((d) => ({ ...d, templateId: `${i + 1}` }));
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
                      ? "bg-[#5207CD] text-[#FFFFFF]"
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

      <Modal
        open={isExitModalVisible}
        onCancel={handleExitCancel}
        footer={null}
        maskClosable={false}
        maxWidth={420}
        style={{
          maxWidth: 220,
        }}
      >
        <div className="flex flex-col gap-5">
          <Heading size="3xl" as="h3" className="!text-black-900_01">
            You're leaving this page but there are unpublished changes, are you sure you want to exit?
          </Heading>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleExitCancel}
            >
              No, go back
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={async () => {
                const nextNav = pendingNavigationRef.current;
                if (!nextNav) return;
                try {
                  await LandingPageService.publishLandingPage(lpId, 'page');
                } catch (e) {
                  // If publish fails, fallback to autosave to avoid losing work
                  await performAutoSave(landingPageData);
                }
                handleExitConfirm();
              }}
            >
              Publish & exit
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-[#5207CD] text-white hover:bg-[#0C7CE6]"
              onClick={handleExitConfirm}
            >
              Yes, exit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}