import { CloseOutlined, CrownOutlined } from "@ant-design/icons";
import {
  message as antdmessage,
  Divider,
  Dropdown,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { load } from "cheerio";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { CircleX, ChevronDown, ChevronUp, Search, HelpCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { formatAvgTime } from "../../../utils/timeFormat";
import {
  getPartner,
  selectDarkMode,
  selectLoading,
  selectUser,
} from "../../../redux/auth/selectors.js";
import ATSService from "../../../services/ATSService.js";
import AuthService from "../../../services/AuthService.js";
import CrudService from "../../../services/CrudService.js";
import PublicService from "../../../services/PublicService.js";
import UserService from "../../../services/UserService.js";
import WorkspaceService from "../../../services/WorkspaceService.js";
import { refreshUserData } from "../../../utils/userRefresh.js";
import Cookies from "js-cookie";
import { useWorkspace } from "../../../contexts/WorkspaceContext";

import debounce from "lodash/debounce";
import moment from "moment";
import { FaSortAmountDownAlt, FaFacebook, FaGoogle, FaLinkedin } from "react-icons/fa";
import AILoadingAnimation from "../../../../pages/AILoadingAnimation.js";
import AdsLaunchService from "../../../services/AdsLaunchService.js";
import { Button, Heading, Img, Input } from "./components/components/index.jsx";
import CreateANewVacancyInput from "./components/components/CreateANewVacancyInput/index.jsx";
import VacanciesCard from "./components/components/VacanciesCard/index.jsx";
import { CloseSVG } from "./images/index.jsx";
import Chooseatemplate from "./modals/Chooseatemplate/index.jsx";
import FilterModal, { FilterTags } from "./modals/FilterModalVacancy/index.jsx";
import FromScratchModal from "./FromScratchModal.jsx";

import SkeletonLoader from "./components/Skeleton/VacancyCard.js";
import PasteUrlModalExperimental from "./PasteUrlModalExperimental.jsx";
import PasteUrlModal from "./PasteUrlModal.jsx";
import JobDescriptionModal from "./JobDescriptionModal.jsx";
import UpgradeModal from "./components/UpgradeModal.jsx";
import CampaignTypeSelector from "./CampaignTypeSelector.jsx";
import MultiJobCampaignModal from "./MultiJobCampaignModal.jsx";
import { partner } from "../../../constants.js";
import { useSearchParams } from "next/navigation";

const { Column } = Table;

export const oauthUri = `https://www.facebook.com/v19.0/dialog/oauth?response_type=token&display=popup&client_id=${process.env.NEXT_PUBLIC_META_APP_KEY
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_LIVE_URL + "/dashboard/vacancies"
  )}&auth_type=rerequest&scope=email%2Cmanage_fundraisers%2Cread_insights%2Cpublish_video%2Ccatalog_management%2Cpages_manage_cta%2Cpages_manage_instant_articles%2Cpages_show_list%2Cread_page_mailboxes%2Cads_management%2Cads_read%2Cbusiness_management%2Cpages_messaging%2Cpages_messaging_subscriptions%2Cinstagram_basic%2Cinstagram_manage_comments%2Cinstagram_manage_insights%2Cinstagram_content_publish%2Cleads_retrieval%2Cwhatsapp_business_management%2Cinstagram_manage_messages%2Cpage_events%2Cpages_read_engagement%2Cpages_manage_metadata%2Cpages_read_user_content%2Cpages_manage_ads%2Cpages_manage_posts%2Cpages_manage_engagement%2Cwhatsapp_business_messaging%2Cinstagram_shopping_tag_products%2Cinstagram_branded_content_brand%2Cinstagram_branded_content_creator%2Cinstagram_branded_content_ads_brand%2Cinstagram_manage_events`;

const englishStages = [
  "New applied",
  "Screening",
  "Interview",
  "Test",
  "Hired",
];
const Vacancies = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const isCampaignsRoute =
    (router?.pathname && router.pathname.includes("/dashboard/campaigns")) ||
    (router?.asPath && router.asPath.includes("/dashboard/campaigns"));
  const initialView = (router?.query?.view || new URLSearchParams(router.asPath.split('?')[1] || '').get('view')) === 'timeline' ? 'timeline' : 'cards';
  const [viewMode, setViewMode] = useState(initialView);
  const initialTimeframe = new URLSearchParams(router.asPath.split('?')[1] || '').get('timeframe') || (isCampaignsRoute ? '6m' : 'all'); // default to 6m on Campaigns
  const [timeframe, setTimeframe] = useState(initialTimeframe); // all | 3m | 6m
  const initialTab = new URLSearchParams(router.asPath.split('?')[1] || '').get('tab') || 'timeline';
  const [timelineTab, setTimelineTab] = useState(initialTab); // timeline | performance | settings

  // Extract query parameters from Next.js router
  const searchParams = new URLSearchParams(router.asPath.split('?')[1] || '');
  const isNew = router.query.new || searchParams.get('new');
  const isDemo = router.query.demo === 'true' || searchParams.get('demo') === 'true';
  console.log('isNew', isNew);
  console.log('searchParams', searchParams);
  console.log('router.query', router.query);
  console.log('initialView', initialView);
  console.log('timeframe', timeframe);
  console.log('timelineTab', timelineTab);
  console.log('initialTab', initialTab);
  console.log('isDemo', isDemo);
  console.log('isCampaignsRoute', isCampaignsRoute);
  console.log('viewMode', viewMode);
  console.log('searchParams', searchParams);
  console.log('searchParams', searchParams);

  const getQueryParam = (name) => {
    return router.query[name] || searchParams.get(name);
  };
  const status = getQueryParam('status');
  console.log('statusstatusstatus', status);

  const [landingPages, setLandingPages] = useState([]);
  const [addNew, setAddNew] = useState(() => {
    // Check local storage for any saved progress
    const savedProgress = localStorage.getItem('vacancy_creation_progress');
    if (savedProgress) {
      const { type } = JSON.parse(savedProgress);
      return type;
    }
    return null;
  });
  console.log("addNew", addNew);
  const [addNewModal, setAddNewModal] = useState(false);
  const [campaignTypeSelectorOpen, setCampaignTypeSelectorOpen] = useState(false);
  const [multiJobModalOpen, setMultiJobModalOpen] = useState(false);
  const [jobTitleX, setJobTitleX] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [adHeadline, setAdHeadline] = useState("");
  const [adImage, setAdImage] = useState("");
  const [cta, setCTA] = useState("");
  const [adJobCity, setAdJobCity] = useState("");
  const [AILoading, setAILoading] = useState(false);
  const [adBudget, setAdBudget] = useState(
    localStorage?.adBudget ? Math.max(20, parseInt(localStorage?.adBudget)) : 20
  );
  const [pictureChangeModal, setPictureChangeModal] = useState(false);
  const [promote, setPromote] = useState(null);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [atsURL, setAtsURL] = useState("");
  const [resources, setResources] = useState([]);
  const [adJobInterest, setAdJobInterest] = useState([]);
  const darkMode = useSelector(selectDarkMode);
  const [backendLoading, setBackendLoading] = useState(false);
  const user = useSelector(selectUser);
  const { getWorkspaceFunnelUsage } = useWorkspace();
  const [funnelUsage, setFunnelUsage] = useState(null);
  console.log("user?.usage", user?.usage);
  const [loadingFetchData, setLoading] = useState(true);

  const {
    workspaceSession,
    currentWorkspace,
    accessibleWorkspaces,
  } = useWorkspace();

  const resolvedWorkspaceFilters = useMemo(() => {
    if (user?.isWorkspaceSession && user?.workspaceId) {
      return { scope: "workspace", id: user.workspaceId };
    }

    if (!user?.allowWorkspaces) {
      return { scope: "owner", id: user?._id };
    }

    return { scope: "owner", id: user?._id };
  }, [user]);

  // Helper function to get branding details based on workspace session
  const getBrandingDetails = async () => {
    if (resolvedWorkspaceFilters.scope === "workspace" && resolvedWorkspaceFilters.id) {
      // In workspace session - fetch workspace-specific branding
      try {
        const response = await WorkspaceService.getWorkspace(resolvedWorkspaceFilters.id);

        if (response.data) {
          const workspace = response.data.workspace || response.data;

          return {
            companyName: workspace.companyName || user?.companyName,
            companyUrl: workspace.companyWebsite || user?.companyUrl,
            companyInfo: user?.companyInfo, // Company info stays at user level
            companyLogo: workspace.companyLogo || user?.companyLogo,
            primaryColor: workspace.primaryColor || user?.primaryColor,
            secondaryColor: workspace.secondaryColor || user?.secondaryColor,
            tertiaryColor: workspace.tertiaryColor || user?.tertiaryColor,
            selectedFont: workspace.selectedFont || user?.selectedFont,
            titleFont: workspace.titleFont || user?.titleFont,
            subheaderFont: workspace.subheaderFont || user?.subheaderFont,
            bodyFont: workspace.bodyFont || user?.bodyFont,
          };
        }
      } catch (error) {
        console.error('Error fetching workspace branding:', error);
      }

      // Fallback to user branding if workspace fetch fails
      return {
        companyName: user?.companyName,
        companyUrl: user?.companyUrl,
        companyInfo: user?.companyInfo,
        companyLogo: user?.companyLogo,
        primaryColor: user?.primaryColor,
        secondaryColor: user?.secondaryColor,
        tertiaryColor: user?.tertiaryColor,
        selectedFont: user?.selectedFont,
        titleFont: user?.titleFont,
        subheaderFont: user?.subheaderFont,
        bodyFont: user?.bodyFont,
      };
    } else {
      // Main session - use user branding
      return {
        companyName: user?.companyName,
        companyUrl: user?.companyUrl,
        companyInfo: user?.companyInfo,
        companyLogo: user?.companyLogo,
        primaryColor: user?.primaryColor,
        secondaryColor: user?.secondaryColor,
        tertiaryColor: user?.tertiaryColor,
        selectedFont: user?.selectedFont,
        titleFont: user?.titleFont,
        subheaderFont: user?.subheaderFont,
        bodyFont: user?.bodyFont,
      };
    }
  };

  const [brandingDetails, setBrandingDetails] = useState(null);

  // Load branding details on component mount and when user changes
  useEffect(() => {
    const loadBrandingDetails = async () => {
      const details = await getBrandingDetails();
      setBrandingDetails(details);
    };

    if (user && resolvedWorkspaceFilters) {
      loadBrandingDetails();
    }
  }, [user, resolvedWorkspaceFilters]);
  const [searchBarValue125, setSearchBarValue125] = React.useState("");

  const [searchBarValue56, setSearchBarValue56] = React.useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [renameModal, setRenameModal] = useState(false);
  const [newVacancyTitle, setNewVacancyTitle] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [department, setDepartment] = useState("");

  const [templateModal, setTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(2);
  const [searchValue, setSearchValue] = useState("");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ key: "", value: "" });

  const templates = [
    { id: 1, name: "Template 1" },
    { id: 2, name: "Template 2" },
    { id: 3, name: "Template 3" },
    { id: 4, name: "Template 4" },
    { id: 5, name: "Template 5" },
  ];

  const [filters, setFilters] = useState({
    location: [],
    // salaryRange: [0, 200000],
    departments: [],
    skills: [],
    createdAt: "",
    unpublishedAt: "",
    publishedAt: "",
    jobTypes: [],
    experience: [],
    education: [],
    languages: [],
    industry: [],
    companySize: [],
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sorters, setSorters] = useState([{ key: 'createdAt', direction: 'desc', isDefault: true }]);
  console.log('sorters', sorters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [getFilterlocations, setLocationOptions] = useState([]);
  const filterOptions = [
    { key: "location", label: "Location" },
    { key: "salary", label: "Salary" },
    { key: "jobType", label: "Job Type" },
    { key: "experience", label: "Experience" },
    { key: "department", label: "Department" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "language", label: "Language" },
    { key: "industry", label: "Industry" },
    { key: "companySize", label: "Company Size" },
  ];

  const sorterOptions = [
    { key: "createdAt", label: "Newest", direction: "desc" },
    { key: "createdAt", label: "Oldest", direction: "asc" },
    { key: "salary", label: "Highest Salary", direction: "desc" },
    { key: "salary", label: "Lowest Salary", direction: "asc" },
    { key: "views", label: "Most Viewed", direction: "desc" },
    { key: "views", label: "Least Viewed", direction: "asc" },
    { key: "applicants", label: "Most Applicants", direction: "desc" },
    { key: "applicants", label: "Least Applicants", direction: "asc" },
  ];

  const queryImages = useCallback(async () => {
    try {
      if (!user) return;
      const result = await PublicService.cloudinarySearch({
        expression: `hirelab_${user?._id}`,
      });
      const resources = result?.data?.result?.resources;
      if (resources) setResources(resources);
    } catch (error) { }
  }, [user]);

  useEffect(() => {
    queryImages();
  }, [queryImages]);

  useEffect(() => {
    if (window.location.href.includes("?#access_token"))
      window.location.href = `${window.location.href}`.replace(
        "?#access_token",
        "?access_token"
      );
  }, []);

  // Fetch workspace funnel usage
  useEffect(() => {
    const fetchFunnelUsage = async () => {
      if (user) {
        try {
          const usage = await getWorkspaceFunnelUsage();
          setFunnelUsage(usage);
        } catch (error) {
          console.error('Error fetching funnel usage:', error);
        }
      }
    };
    fetchFunnelUsage();
  }, [user, getWorkspaceFunnelUsage]);

  useEffect(() => {
    if (isNew === "true") {
      if (landingPages && landingPages.length > 0) {
        setCampaignTypeSelectorOpen(false);
        return
      } else {
        // Show campaign type selector first to let user choose Single Job or Multi-Job
        setCampaignTypeSelectorOpen(true);
      }
    }
  }, [isNew]);

  useEffect(() => {
    const access_token = searchParams.get("access_token");
    if (!access_token) return;
    const data_access_expiration_time = searchParams.get(
      "data_access_expiration_time"
    );
    if (!data_access_expiration_time) return;

    setFacebookLoading(true);
    AuthService.updateMe({
      metaAccessToken: access_token,
      metaAccessExpiry: parseInt(data_access_expiration_time),
    })
      .then(async () => {
        await UserService.extendTokenTime();
      })
      .finally(() => {
        window.location.href = `${window.location.origin}/dashboard/vacancies/`;
      });
  }, [searchParams]);
  useEffect(() => {
    localStorage.adBudget = adBudget;
  }, [adBudget]);

  const socket = useRef(null);
  const socketPing = useRef(null);

  const debouncedFetch = useMemo(
    () =>
      debounce(
        async ({
          user,
          searchValue,
          filters,
          sorters,
          currentPage,
          itemsPerPage,
        }) => {
          setLoading(true); // Set loading to true before the fetch starts
          try {
            if (user) {
              // const formattedFilters = filters
              //   ? Object.keys(filters).reduce((acc, key) => {
              //       if (filters[key] && filters[key].length > 0) {
              //         acc[key] = filters[key];
              //       }
              //       return acc;
              //     }, {})
              //   : {};
              const formattedFilters = /* ... */
                Object.keys(filters).reduce((acc, key) => {
                  const value = filters[key];
                  if (value === undefined || value === null) return acc;

                  if (Array.isArray(value)) {
                    if (value.length > 0) acc[key] = value;
                  } else if (typeof value === 'boolean') {
                    acc[key] = value;
                  } else if (typeof value === 'string' && value.trim() !== '') {
                    acc[key] = value.trim();
                  } else if (typeof value === 'number') {
                    acc[key] = value;
                  }
                  return acc;
                }, {})
              console.log("formattedFilters", formattedFilters)
              // Build filters based on workspace session
              const baseFilters = {
                ...formattedFilters,
              };

              if (resolvedWorkspaceFilters.scope === "workspace" && resolvedWorkspaceFilters.id) {
                baseFilters.workspace = resolvedWorkspaceFilters.id;
              } else if (resolvedWorkspaceFilters.scope === "owner" && resolvedWorkspaceFilters.id) {
                // Outside of a workspace, show all user's content (don't filter by workspace)
                baseFilters.user_id = resolvedWorkspaceFilters.id;
              }

              const result = await CrudService.search(
                "LandingPageData",
                itemsPerPage,
                currentPage,
                {
                  text: searchValue,
                  filters: baseFilters,
                  sort: sorters.reduce(
                    (acc, sorter) => ({
                      ...acc,
                      [sorter.key]: sorter.direction,
                    }),
                    {}
                  ),
                  ...({}),
                }
              );
              // Try to get applicant counts, but don't let it break the main functionality
              let landingPagesWithCounts;
              try {
                // Only send minimal data needed for counting - just _id and stage references
                const minimalFunnels = result.data.items?.map(i => ({
                  _id: i._id,
                  onQualifiedAssignStage: i.onQualifiedAssignStage,
                  onRejectedAssignStage: i.onRejectedAssignStage,
                })) || [];
                console.log('🚀 CALLING countApplicants with', minimalFunnels.length, 'funnels');
                landingPagesWithCounts = await ATSService.countApplicants(minimalFunnels);
                console.log('✅ Successfully fetched applicant counts:', landingPagesWithCounts.data?.length, 'items');

                // Merge the counts back into the original items
                const countsById = new Map(landingPagesWithCounts.data?.map(c => [c._id, c]) || []);
                landingPagesWithCounts.data = result.data.items?.map(item => ({
                  ...item,
                  numberApplicants: countsById.get(item._id)?.numberApplicants || 0,
                  shortlistedApplicants: countsById.get(item._id)?.shortlistedApplicants || 0,
                  interviewedApplicants: countsById.get(item._id)?.interviewedApplicants || 0,
                }));
              } catch (countError) {
                console.error('❌ Failed to fetch applicant counts:', countError);
                console.error('❌ Error details:', countError.response?.data || countError.message);
                // Fallback: use original data with 0 applicants
                landingPagesWithCounts = { data: result.data.items };
              }

              setLandingPages(
                landingPagesWithCounts.data.map((i) => {
                  const visits = i.visits || 0;
                  const avgTimeSpentSeconds = visits > 0 ? Math.round((i.totalTimeSpent || 0) / visits) : 0;
                  const daysLive = Math.ceil((new Date() - new Date(i.createdAt)) / (1000 * 60 * 60 * 24));

                  return {
                    ...i,
                    position: "Position",
                    heading: i.vacancyTitle,
                    deadlinetwo: "Deadline:",
                    mar42024: moment(i.createdAt).format("MMM Do YYYY"),
                    // Real analytics data
                    visits: visits,
                    avgTimeSpent: formatAvgTime(avgTimeSpentSeconds),
                    applicants: i.numberApplicants || 0, // Real count if available, otherwise 0
                    // Calculate days live
                    daysLive: daysLive,
                    key: i._id,
                  };
                })
              );
              setTotalItems(result.data.total);
            }
          } catch (error) {
            console.error("Error during fetch:", error); // Log any error that occurs
          } finally {
            setLoading(false); // Set loading to false once the fetch is done (whether successful or not)
          }
        },
        800
      ),
    []
  );

  const statusFilter = useMemo(() => {
    if (status === 'published') return { published: true };
    if (status === 'unpublished') return { published: false };
    return {};
  }, [status]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      debouncedFetch({
        user,
        searchValue,
        filters: {
          ...filters,
          ...statusFilter, // Merge status filter with existing filters
        },
        sorters,
        currentPage,
        itemsPerPage,
      });
    } catch (error) {
      setLoading(false);
      console.error("Error fetching vacancies:", error);
    } finally {
      setLoading(false);
    }
  }, [
    user,
    searchValue,
    filters,
    setFilters,
    sorters,
    currentPage,
    itemsPerPage,
    status,
    resolvedWorkspaceFilters
  ]);

  const fetchAllDataByUser = async () => {
    try {
      setLoading(true);
      // Build filters based on workspace session for location options
      const locationFilters = { user_id: user._id };
      if (user.isWorkspaceSession && user.workspaceId) {
        locationFilters.workspace = user.workspaceId;
      }

      const result = await CrudService.search("LandingPageData", 999999, 1, {
        text: "",
        filters: locationFilters,
        sort: {},
        ...({}),
      });
      const locationsSet = new Set();

      result?.data?.items?.forEach((item) => {
        if (item.location) {
          if (Array.isArray(item.location)) {
            item.location.forEach((loc) => locationsSet.add(loc.trim()));
          } else if (typeof item.location === "string") {
            locationsSet.add(item.location.trim());
          }
        }
      });
      let uniqueLocations = Array.from(locationsSet)
        .filter((loc) => typeof loc === "string" && loc.trim() !== "")
        .sort((a, b) => {
          if (a === "Hybrid") return -1;
          if (b === "Hybrid") return 1;
          if (a === "Remote") return -1;
          if (b === "Remote") return 1;
          return 0;
        });
      setLocationOptions(uniqueLocations);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDataByUser();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Test Data Injection (Meta campaign test_id) for dashboard views
  const testDataLoadedRef = useRef(false);
  useEffect(() => {
    const testId = router.query.test_id || searchParams?.get("test_id");
    if (!testId || testDataLoadedRef.current || landingPages.length === 0) return;

    const hostLpId = landingPages[0]?._id;
    if (!hostLpId) return;

    AdsLaunchService.getSummary(hostLpId, { test_id: testId })
      .then((res) => {
        const data = res?.data?.data;
        if (data) {
          const insight = (data.insights || [])[0] || {};
          const leadsAction =
            Array.isArray(insight.actions) &&
            insight.actions.find((a) => a.action_type === "lead");

          const mapped = {
            _id: `test-${testId}`,
            vacancyTitle: `${data.campaign?.name || "Test Meta Campaign"} (Test Data)`,
            location: "Test Location",
            createdAt: data.campaign?.start_time || new Date().toISOString(),
            visits: Number(insight.clicks || 0),
            applicants: Number(leadsAction?.value || 0),
            adBudget: data.campaign?.daily_budget
              ? Number(data.campaign.daily_budget) / 100
              : 0,
            isTest: true,
          };

          setLandingPages((prev) => {
            const filtered = prev.filter((p) => p._id !== mapped._id);
            return [mapped, ...filtered];
          });
          testDataLoadedRef.current = true;
          antdmessage.info("Loaded test Meta campaign data from ID: " + testId);
        }
      })
      .catch((e) => console.error("Failed to load test campaign", e));
  }, [router.query.test_id, searchParams, landingPages]);

  const applyFilters = (filters) => {
    setFilters(filters);
    debouncedFetch({
      user,
      searchValue,
      filters,
      sorters,
      currentPage,
      itemsPerPage,
    });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setFilters((prevFilters) => {
      const existingFilterIndex = prevFilters.findIndex(
        (f) => f.key === filter.key
      );
      if (existingFilterIndex !== -1) {
        const newFilters = [...prevFilters];
        newFilters[existingFilterIndex] = filter;
        return newFilters;
      }
      return [...prevFilters, filter];
    });
    setCurrentPage(1);
    setFilterModalVisible(false);
  };

  const handleSorterChange = (sorter) => {
    setSorters((prevSorters) => {
      const existingSorter = prevSorters?.find((s) => s.key === sorter.key);

      if (existingSorter) {
        // If it's the same field, toggle the direction
        const newDirection = existingSorter.direction === 'asc' ? 'desc' : 'asc';
        // Remove isDefault when changing direction
        return prevSorters?.map((s) =>
          s.key === sorter.key ? { ...s, direction: newDirection, isDefault: false } : s
        );
      } else {
        // If it's a new field, add it without isDefault flag
        return [{ key: sorter.key, direction: sorter.direction, isDefault: false }];
      }
    });

    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const removeFilter = (key) => {
    setFilters((prevFilters) => prevFilters.filter((f) => f.key !== key));
    setCurrentPage(1);
  };

  const removeSorter = (key) => {
    setSorters((prevSorters) => prevSorters.filter((s) => s.key !== key));
    setCurrentPage(1);
  };

  const filterMenu = (
    <Menu>
      {filterOptions?.map((option) => (
        <Menu.Item
          key={option.key}
          onClick={() => {
            setCurrentFilter({ key: option.key, value: "" });
            setFilterModalVisible(true);
          }}
        >
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const sorterMenu = (
    <Menu>
      {sorterOptions?.map((option, index) => {
        const activeSorter = sorters.find((s) => s.key === option.key);
        const isActive = activeSorter && activeSorter.direction === option.direction;

        const label = (option.key === 'createdAt' && option.direction === 'desc')
          ? 'Newest'
          : (option.key === 'createdAt' && option.direction === 'asc')
            ? 'Oldest'
            : (option.key === 'salary' && option.direction === 'desc')
              ? 'Highest Salary'
              : (option.key === 'salary' && option.direction === 'asc')
                ? 'Lowest Salary'
                : (option.key === 'views' && option.direction === 'desc')
                  ? 'Most Viewed'
                  : (option.key === 'views' && option.direction === 'asc')
                    ? 'Least Viewed'
                    : (option.key === 'applicants' && option.direction === 'desc')
                      ? 'Most Applicants'
                      : 'Least Applicants';

        return (
          <Menu.Item
            key={`${option.key}-${index}`}
            onClick={() =>
              handleSorterChange({
                key: option.key,
                direction: option.direction,  // Use the direction provided in the options
              })
            }
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              backgroundColor: isActive ? '#e6f7ff' : 'transparent',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{label}</span>
            {isActive && (
              <span style={{ fontSize: 12, color: '#666' }}>
                {option.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </Menu.Item>
        );
      })}
    </Menu>
  );



  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const handleGenerateLP = ({ jobDescription, jobTitle }) => {
    // Safety check: Verify user hasn't reached limit before starting AI generation
    // Use workspace-specific funnel usage when in workspace session
    let currentFunnelCount, maxFunnels;

    if (user?.isWorkspaceSession && user?.workspaceId && funnelUsage?.workspaces) {
      // Find the specific workspace usage
      const workspaceUsage = funnelUsage.workspaces.find(ws => ws._id === user.workspaceId);
      currentFunnelCount = workspaceUsage?.currentFunnels ?? 0;
      maxFunnels = workspaceUsage?.maxFunnels ?? 0;
    } else {
      // Use total usage when not in workspace session
      currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? landingPages?.length ?? 0;
      maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
    }

    const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;

    if (hasReachedLimit) {
      console.log('🚫 SAFETY CHECK: Blocking AI generation - user at funnel limit');
      antdmessage.warning(`You've reached your funnel limit (${maxFunnels}). Please upgrade your plan to create more funnels.`);
      setUpgradeModalVisible(true);
      setAILoading(false);
      setAddNew(null);
      return;
    }

    socket.current = new WebSocket(
      `wss://booklified-chat-socket.herokuapp.com`
    );

    socket.current.addEventListener("open", async () => {
      socketPing.current = setInterval(
        () => socket?.current?.send(JSON.stringify({ id: "PING" })),
        30000
      );

      const brandingInfo = brandingDetails ? `
      Workspace Branding:
        Company Name: ${brandingDetails.companyName}
        Company Website: ${brandingDetails.companyWebsite}
        Company Info: ${brandingDetails.companyInfo}
        Primary Color: ${brandingDetails.primaryColor}
        Secondary Color: ${brandingDetails.secondaryColor}
        Tertiary Color: ${brandingDetails.tertiaryColor}
        Selected Font: ${brandingDetails.selectedFont?.family}
        Title Font: ${brandingDetails.titleFont?.family}
        Subheader Font: ${brandingDetails.subheaderFont?.family}
        Body Font: ${brandingDetails.bodyFont?.family}
      ` : '';

      const content =
        `      ${jobTitle && "Job Title: " + jobTitle}
      Vacancy Data:
        ${jobDescription.slice(0, 10000)}
      ${brandingInfo}` + getAiPromptContent();

      setAILoading(true);
      socket.current?.send(
        JSON.stringify({
          id: "OPEN_AI_PROMPT",
          payload: {
            content,
            model: "gpt-4o",
            app_id: "hirelab",
            partner: partner?._id,
          },
        })
      );
    });

    socket.current.addEventListener("message", async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("message.payload?.response", message.payload?.response);

        if (!message.payload?.response) {
          throw new Error("Empty response from AI");
        }

        // Clean up the response to ensure valid JSON
        let cleanResponse = message.payload.response;

        // Remove markdown code blocks if present
        cleanResponse = cleanResponse
          .replace(/```json/g, "")
          .replace(/```/g, "");

        // Remove any text before the first { and after the last }
        const firstBrace = cleanResponse.indexOf("{");
        const lastBrace = cleanResponse.lastIndexOf("}");

        if (firstBrace >= 0 && lastBrace >= 0) {
          cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
        } else {
          throw new Error("Invalid JSON structure in response");
        }

        console.log("Cleaned response:", cleanResponse);

        const result = JSON.parse(cleanResponse);
        console.log("Parsed result:", result);

        // Validate essential fields
        if (!result.vacancyTitle || !result.heroDescription) {
          throw new Error("Missing required fields in AI response");
        }

        try {
          const res = await CrudService.create("LandingPageData", {
            ...result,
            ...brandingDetails,
          });

          setAILoading(false);
          setAtsURL("");
          setJobDescription("");
          setJobTitleX("");
          setAddNew(null);
          if (socketPing.current) clearInterval(socketPing.current);

          // Refresh user data to update usage after successful vacancy creation
          await refreshUserData();
          router.push(`/edit-page/${res.data.result._id}`);
        } catch (createError) {
          // Handle plan limit errors from the API
          if (createError.response?.data?.error === "PLAN_LIMIT_EXCEEDED") {
            console.log("Plan limit exceeded, showing upgrade modal");
            antdmessage.error(createError.response?.data?.message || "You've reached your plan limit");
            setUpgradeModalVisible(true);
            setAILoading(false);
            setAddNew(null);
            if (socketPing.current) clearInterval(socketPing.current);
            return;
          }

          // Re-throw other errors
          throw createError;
        }
      } catch (error) {
        console.error("Error processing AI response:", error);
        antdmessage.error(
          "Failed to create vacancy: " +
          (error.response?.data?.message || error.message || "Invalid response from AI")
        );
        setAILoading(false);
        setBackendLoading(false);
        if (socketPing.current) clearInterval(socketPing.current);
      }
    });
  };

  const handleGenerateAt = (vacancy) => {
    socket.current = new WebSocket(
      `wss://booklified-chat-socket.herokuapp.com`
    );

    socket.current.addEventListener("open", async () => {
      socketPing.current = setInterval(
        () => socket.current?.send(JSON.stringify({ id: "PING" })),
        30000
      );

      const content = `
        ${JSON.stringify(vacancy).slice(0, 10000)}
Create ad data for recruitment ad. Take the necessary data from the provided vacancy data. Improvise if required information is missing.

Respond with json that adheres to the following jsonschema: 
{
  "image": {
    "type": "string",
    "description": "Should be one of the following: ${vacancy.heroPicture}, ${vacancy.whoWillYouReportToAvatar
        }, ${vacancy.recruiterAvatar}, ${vacancy.aboutTheJobPicture}, ${vacancy.leaderIntroductionAvatar
        },"
  },
  "headline": {
    "type": "string",
    "description": "The headline of the ad."
  },
  "cta": {
    "type": "string",
    "description": "The call to action text for the ad."
  },
  "jobCity": {
    "type": "string",
    "description": "Should be either the city of the job or ${user?.country || user?.city || "New York"
        }. This field cannot be anything other than a valid city. It cannot be 'Remote'"
  },
  "interestGroup": {
    "type": "string",
    "description": "Should be according to the job."
  }
}
        `;

      setAILoading(true);
      socket.current?.send(
        JSON.stringify({
          id: "OPEN_AI_PROMPT",
          payload: {
            content,
            model: "gpt-4o",
            app_id: "hirelab",
            partner: partner?._id,
          },
        })
      );
    });

    socket.current.addEventListener("message", async (event) => {
      const message = JSON.parse(event.data);
      const response = message.payload?.response;

      const result = JSON.parse(response);

      if (
        ["image", "headline", "cta", "jobCity", "interestGroup"].every(
          (key) => !!result?.[key]
        )
      ) {
        setAdHeadline(result.headline);
        setCTA(result.cta);
        setAdImage(result.image);
        try {
          const interestGroup = JSON.parse(result.interestGroup);
          if (Array.isArray(interestGroup))
            setAdJobInterest(result.interestGroup);
        } catch (e) {
          setAdJobInterest([result.interestGroup]);
        }
      } else {
        antdmessage.error("Unable to generate the ad creative");
      }

      setAILoading(false);
      setPromote(vacancy);
      if (socketPing.current) clearInterval(socketPing.current);
    });
  };

  const onDuplicate = async (landingPage) => {
    // Check if this landing page has ads
    const hasAds = landingPage?.ads && Object.keys(landingPage.ads || {}).some(
      (k) => !k.startsWith("_") && landingPage.ads[k]?.variants?.length > 0
    );

    const doDuplicate = async () => {
      try {
        // Use dedicated ATS service to duplicate landing page including stages
        const res = await ATSService.duplicateLandingPage({
          landingPageId: landingPage._id,
        });

        antdmessage.success("Vacancy duplicated successfully" + (hasAds ? " (ads were not copied)" : ""));

        // Refresh list and user usage
        await fetchData();
        await refreshUserData();

        // Navigate directly to the editor for the new copy
        const newId = res?.data?.landingPage?._id;
        if (newId) {
          router.push(`/edit-page/${newId}`);
        }
      } catch (error) {
        console.error("Error duplicating vacancy:", error);
        antdmessage.error(
          error?.response?.data?.message ||
          "Failed to duplicate vacancy. Please try again."
        );
      }
    };

    if (hasAds) {
      Modal.confirm({
        title: "Duplicate funnel",
        content: (
          <div className="text-sm text-gray-600">
            <p>Ad creatives and Meta ad campaigns will <strong>not</strong> be copied to the new funnel.</p>
            <p className="mt-2 text-gray-500">You'll need to create new ads for the duplicated funnel.</p>
          </div>
        ),
        okText: "Duplicate",
        cancelText: "Cancel",
        onOk: doDuplicate,
      });
    } else {
      await doDuplicate();
    }
  };

  const onRename = (landingPage) => {
    setSelectedVacancy(landingPage);
    setNewVacancyTitle(landingPage.vacancyTitle);
    setRenameModal(true);
  };

  const handleRename = async () => {
    if (!newVacancyTitle.trim()) {
      antdmessage.info("Please enter a new title");
      return;
    }

    try {
      await CrudService.update("LandingPageData", selectedVacancy?._id, {
        vacancyTitle: newVacancyTitle,
      });
      antdmessage.success("Vacancy renamed successfully");
      setRenameModal(false);
      await fetchData();
    } catch (error) {
      console.error("Error renaming vacancy:", error);
      antdmessage.error("Failed to rename vacancy. Please try again.");
    }
  };

  // Calculate the total number of applied filters
  // Calculate the total number of applied filters
  const filterCount = Object.values(filters).reduce(
    (count, values) => {
      if (Array.isArray(values)) {
        return count + values.filter((value) => value !== "").length; // Count non-empty items in array
      } else if (typeof values === "string" && values.trim() !== "") {
        return count + 1; // Count non-empty strings
      }
      return count;
    },
    0
  );

  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  console.log("user", user);
  console.log("user", user?.landingPageNum);
  console.log("user", user?.tier);
  console.log("user", user?.upgradeNeeded);
  const landingPageNum = user?.landingPageNum || 0;
  console.log("landingPageNum", landingPageNum);
  const tier = user?.tier || { id: 'free', name: 'Free Forever', maxFunnels: 1 };
  const upgradeNeeded = user?.upgradeNeeded;

  const handleCreateNewVacancy = () => {
    // Use workspace-specific funnel usage when in workspace session
    let currentFunnelCount, maxFunnels;

    if (user?.isWorkspaceSession && user?.workspaceId && funnelUsage?.workspaces) {
      // Find the specific workspace usage
      const workspaceUsage = funnelUsage.workspaces.find(ws => ws._id === user.workspaceId);
      currentFunnelCount = workspaceUsage?.currentFunnels ?? 0;
      maxFunnels = workspaceUsage?.maxFunnels ?? 0;
    } else {
      // Use total usage when not in workspace session
      currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? landingPages?.length ?? 0;
      maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
    }

    const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;
    const tierName = user?.tier?.name ?? tier?.name ?? 'Unknown';

    console.log('🎯 CREATE VACANCY LIMIT CHECK:', {
      isWorkspaceSession: user?.isWorkspaceSession,
      workspaceId: user?.workspaceId,
      currentFunnelCount,
      maxFunnels,
      hasReachedLimit,
      tierName,
      funnelUsage: funnelUsage
    });

    if (hasReachedLimit) {
      console.log('🚫 BLOCKING: User has reached funnel limit, showing upgrade modal');
      setUpgradeModalVisible(true);
      return; // Explicitly prevent further execution
    }

    console.log('✅ ALLOWING: User can create new vacancy');
    // Show campaign type selector first
    setCampaignTypeSelectorOpen(true);
  };

  // Handle campaign type selection
  const handleSelectSingleJob = () => {
    setCampaignTypeSelectorOpen(false);
    setAddNewModal(true);
  };

  const handleSelectMultiJob = () => {
    setCampaignTypeSelectorOpen(false);
    setMultiJobModalOpen(true);
  };

  const handleRefreshAfterVacancyCreation = async () => {
    // Refresh both vacancy list and user data (for updated usage/limits)
    await fetchData();
    await refreshUserData();
  };

  // Enhanced logging for debugging plan limits
  useEffect(() => {
    if (user) {
      console.log('User plan data:', {
        tier: user.tier,
        usage: user.usage,
        upgradeNeeded: user.upgradeNeeded,
        landingPageNum: user.landingPageNum,
        plans: user.plans
      });
    }
  }, [user]);

  if (facebookLoading) return <Skeleton active />;
  return (
    <>
      <div className="flex flex-col flex-1 gap-6 pt-3.5 pb-3 pl-6 mdx:self-stretch">
        <div className="flex gap-4 justify-between items-center smx:flex-col">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isCampaignsRoute ? "Campaigns" : "Vacancies"}
          </h1>
          <div className="flex gap-2 items-center"></div>
          {(() => {
            // Use workspace-specific funnel usage when in workspace session
            let currentFunnelCount, maxFunnels, tierName;

            if (user?.isWorkspaceSession && user?.workspaceId && funnelUsage?.workspaces) {
              // Find the specific workspace usage
              const workspaceUsage = funnelUsage.workspaces.find(ws => ws._id === user.workspaceId);
              currentFunnelCount = workspaceUsage?.currentFunnels ?? 0;
              maxFunnels = workspaceUsage?.maxFunnels ?? 0;
              tierName = currentWorkspace?.name ? `${currentWorkspace.name} Workspace` : 'Workspace';
            } else {
              // Use total usage when not in workspace session
              currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? landingPages?.length ?? 0;
              maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
              tierName = user?.tier?.name ?? tier?.name ?? 'Free';
            }

            const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;

            console.log('🔍 CORRECTED FUNNEL COUNT:', {
              isWorkspaceSession: user?.isWorkspaceSession,
              workspaceId: user?.workspaceId,
              currentFunnelCount,
              landingPagesLength: landingPages?.length,
              maxFunnels,
              hasReachedLimit,
              tierName,
              userUsage: user?.usage,
              userLandingPageNum: user?.landingPageNum,
              funnelUsage: funnelUsage
            });

            return (
              <div className="flex flex-col gap-2 items-end">
                {/* Usage indicator */}
                <div className="flex gap-1 items-center text-sm text-gray-500">
                  {maxFunnels === null ?
                    `${currentFunnelCount} funnels (Unlimited)` :
                    `${currentFunnelCount} / ${maxFunnels} funnels used`
                  }
                  {/* Funnel breakdown tooltip - only show when not in workspace session */}
                  {!user?.isWorkspaceSession && funnelUsage?.workspaces && (
                    <Tooltip
                      title={
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900">Funnel Allocation Breakdown</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Main Account:</span>
                              <span>{funnelUsage.mainAccountFunnels || 0} funnels</span>
                            </div>
                            {funnelUsage.workspaces.map(workspace => (
                              <div key={workspace._id} className="flex justify-between">
                                <span>{workspace.name}:</span>
                                <span>{workspace.currentFunnels || 0}/{workspace.maxFunnels || 0} funnels</span>
                              </div>
                            ))}
                            <div className="pt-1 mt-2 font-medium border-t">
                              <div className="flex justify-between">
                                <span>Total:</span>
                                <span>{funnelUsage.totalCurrentFunnels}/{funnelUsage.totalMaxFunnels} funnels</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      placement="bottomRight"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600" />
                    </Tooltip>
                  )}
                  <span className="px-2 py-1 ml-2 text-xs bg-gray-100 rounded">
                    {tierName} Plan
                  </span>
                </div>

                {/* View switch (right-aligned) */}
                {/* {isCampaignsRoute && (
                  <button
                    onClick={() => {
                      const next = viewMode === 'cards' ? 'timeline' : 'cards';
                      setViewMode(next);
                      const url = new URL(window.location.href);
                      if (next === 'cards') url.searchParams.delete('view');
                      else url.searchParams.set('view', 'timeline');
                      router.push(url.pathname + url.search, undefined, { shallow: true });
                    }}
                    className="inline-flex gap-2 items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50"
                    title="Switch view"
                  >
                    {viewMode === 'cards' ? 'Timeline view' : 'Cards view'}
                  </button>
                )} */}

                {/* Create button */}
                <button
                  onClick={hasReachedLimit ? () => setUpgradeModalVisible(true) : handleCreateNewVacancy}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm ${hasReachedLimit
                    ? 'text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  title={hasReachedLimit ? `You've reached your ${maxFunnels} funnel limit. Click to upgrade.` : (isCampaignsRoute ? 'Create a new campaign' : 'Create a new vacancy')}
                >
                  {hasReachedLimit ? (
                    <>
                      <CrownOutlined className="mr-2 text-yellow-500" />

                      Upgrade to Create More
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isCampaignsRoute ? 'Create New Campaign' : 'Create New Vacancy'}
                    </>
                  )}
                </button>
              </div>
            );
          })()}
        </div>
        <div className="flex flex-col gap-6">
          {/* Plan Limit Alert Banner */}
          {(() => {
            // Use workspace-specific funnel usage when in workspace session
            let currentFunnelCount, maxFunnels, tierName;

            if (user?.isWorkspaceSession && user?.workspaceId && funnelUsage?.workspaces) {
              // Find the specific workspace usage
              const workspaceUsage = funnelUsage.workspaces.find(ws => ws._id === user.workspaceId);
              currentFunnelCount = workspaceUsage?.currentFunnels ?? 0;
              maxFunnels = workspaceUsage?.maxFunnels ?? 0;
              tierName = currentWorkspace?.name ? `${currentWorkspace.name} Workspace` : 'Workspace';
            } else {
              // Use total usage when not in workspace session
              currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? landingPages?.length ?? 0;
              maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
              tierName = user?.tier?.name ?? tier?.name ?? 'Free';
            }

            const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;

            if (hasReachedLimit) {
              return (
                <div className="p-4 mb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0">
                      <svg className="mt-0.5 w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-orange-800">
                        Funnel Limit Reached
                      </h3>
                      <div className="mt-1 text-sm text-orange-700">
                        <p>
                          You've reached your limit of {maxFunnels} funnel{maxFunnels !== 1 ? 's' : ''} on the {tierName} plan.
                          Upgrade your plan to create more recruitment funnels and unlock additional features.
                        </p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => setUpgradeModalVisible(true)}
                          className="inline-flex gap-2 items-center px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 rounded-md transition-colors hover:bg-orange-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Upgrade Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <div className="">
            <div className="flex gap-3 w-full smx:flex-col">
              {/* Modern Search Bar */}
              <div className="relative flex-1">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={isCampaignsRoute ? "Search campaigns..." : "Search vacancies..."}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block py-2 pr-3 pl-10 w-full text-sm placeholder-gray-500 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {searchValue && (
                  <button
                    onClick={() => handleSearch("")}
                    className="flex absolute inset-y-0 right-0 items-center pr-3"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Active Sort Pills */}
              {sorters.map((sorter) => (
                <div key={sorter.key}
                  // className="inline-flex gap-1 items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg border border-blue-200"
                  className="inline-flex gap-1 items-center px-3 py-2 text-sm font-medium text-blue-700 rounded-lg border border-blue-200"
                >
                  <span>
                    {sorter.key === "createdAt" ? (sorter.direction === "asc" ? "Oldest" : "Newest") :
                      sorter.key === "salary" ? (sorter.direction === "asc" ? "Lowest Salary" : "Highest Salary") :
                        sorter.key === "views" ? (sorter.direction === "asc" ? "Least Viewed" : "Most Viewed") :
                          sorter.key === "applicants" ? (sorter.direction === "asc" ? "Least Applicants" : "Most Applicants") :
                            sorter.key}
                  </span>
                  <button
                    onClick={() => removeSorter(sorter.key)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Modern Filters Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${filterCount > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filters
                {filterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                    {filterCount}
                  </span>
                )}
              </button>

              {/* Modern Sort Button */}
              <Dropdown overlay={sorterMenu} trigger={["click"]}>
                <button className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </Dropdown>
            </div>

            <div className="flex w-full">
              {<FilterTags filters={filters} setFilters={setFilters} />}
            </div>

            {isCampaignsRoute && viewMode === 'timeline' && (
              <div className="flex gap-3 items-center mt-2">
                <label className="text-xs text-[#475467]">Timeframe</label>
                <select
                  className="text-xs px-2 py-1 rounded-md border text-[#475467]"
                  value={timeframe}
                  onChange={(e) => {
                    setTimeframe(e.target.value);
                    const url = new URL(window.location.href);
                    if (e.target.value === 'all') url.searchParams.delete('timeframe');
                    else url.searchParams.set('timeframe', e.target.value);
                    router.push(url.pathname + url.search, undefined, { shallow: true });
                  }}
                >
                  <option value="all">All time</option>
                  <option value="6m">Last 6 months</option>
                  <option value="3m">Last 3 months</option>
                </select>
                <label className="ml-4 inline-flex items-center gap-2 text-xs text-[#475467] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={status === 'published'}
                    onChange={(e) => {
                      const url = new URL(window.location.href);
                      if (e.target.checked) url.searchParams.set('status', 'published');
                      else url.searchParams.delete('status');
                      router.push(url.pathname + url.search, undefined, { shallow: true });
                    }}
                  />
                  Active only
                </label>
                <button
                  className="ml-4 text-xs px-2 py-1 rounded-md border text-[#475467]"
                  onClick={() => {
                    // Toggle chronological sort
                    const isAsc = sorters?.[0]?.key === 'createdAt' && sorters?.[0]?.direction === 'asc';
                    handleSorterChange({ key: 'createdAt', direction: isAsc ? 'desc' : 'asc' });
                  }}
                >
                  Chronological
                </button>
              </div>
            )}

            {status && (
              <div className="filter-status-indicator inline-flex bg-[#5207CD] text-white p-1 px-2 mt-1 rounded-full items-center">
                <span>{status === 'published' ? 'Published' : 'Unpublished'} {isCampaignsRoute ? 'campaigns' : 'vacancies'}</span>
                <span
                  onClick={() => router.push(isCampaignsRoute ? '/dashboard/campaigns' : '/dashboard/vacancies')}
                  className="flex justify-center items-center ml-2 transition cursor-pointer focus:outline-none"
                >
                  <CircleX size={18} fill={"#9fa3a7"} />
                </span>
              </div>
            )}

          </div>
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 gap-3 justify-center place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:place-items-stretch">
              {landingPages.map((d, index) => {
                return (
                  <VacanciesCard
                    {...d}
                    key={"vacancies" + index}
                    record={d}
                    fetchData={fetchData}
                    user={user}
                    AILoading={AILoading}
                    backendLoading={backendLoading}
                    handleGenerateAt={handleGenerateAt}
                    onDuplicate={() => onDuplicate(d)}
                    onRename={() => onRename(d)}
                  />
                );
              })}

              {loadingFetchData && (
                <>
                  {new Array(4).fill(0)?.map((x, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start w-full gap-4 px-6 py-5 sm:px-5 bg-white-A700 rounded-[12px] min-w-[254px] min-h-[241px]"
                    >
                      <SkeletonLoader />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          {viewMode === 'timeline' && (
            <div className="flex flex-col gap-6 w-full">
              {/* Header Container based on Figma */}
              <div className="h-[76px] relative w-full shrink-0">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 flex flex-col gap-[10px] items-start">
                  <h2 className="text-[30px] font-bold text-gray-900 leading-9 m-0">Campaign Timeline</h2>
                  <div className="flex gap-[4.5px]">
                    <button
                      onClick={() => {
                        setTimelineTab('timeline');
                        const url = new URL(window.location.href);
                        url.searchParams.delete('tab');
                        router.push(url.pathname + url.search, undefined, { shallow: true });
                      }}
                      className={`px-3 py-[6px] text-base leading-6 border-b-2 transition-colors ${timelineTab === 'timeline'
                        ? 'text-violet-700 border-violet-700 font-semibold'
                        : 'text-gray-500 border-transparent font-medium hover:text-gray-700'
                        }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => {
                        setTimelineTab('performance');
                        const url = new URL(window.location.href);
                        url.searchParams.set('tab', 'performance');
                        router.push(url.pathname + url.search, undefined, { shallow: true });
                      }}
                      className={`px-3 py-[6px] text-base leading-6 border-b-2 border-transparent transition-colors ${timelineTab === 'performance'
                        ? 'text-violet-700 border-violet-700 font-semibold'
                        : 'text-gray-500 font-medium hover:text-gray-700'
                        }`}
                    >
                      Performance
                    </button>
                  </div>
                </div>

                <div className="flex absolute right-0 top-1/2 gap-2 items-center -translate-y-1/2">
                  <div className="w-5 h-5 bg-[#0075ff] rounded-[2.5px] cursor-pointer"></div>
                  <span className="text-sm font-medium text-gray-700">AI Dynamic Adjustment</span>
                </div>
              </div>

              {timelineTab === 'timeline' && (
                <Timeline campaigns={landingPages} timeframe={timeframe} isDemo={isDemo} />
              )}

              {timelineTab === 'performance' && <CampaignsPerformance campaigns={landingPages} isDemo={isDemo} />}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            />
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={applyFilters}
        getFilterlocations={getFilterlocations}
      />

      <Modal
        open={addNewModal}
        onCancel={() => {
          setAddNewModal(false);
        }}
        footer={null}
        wrapClassName={`${darkMode ? "dark" : ""}`}
        destroyOnClose
        closable={true}
        maskClosable={true}
        centered
        width={640}
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
        {(() => {
          // Use workspace-specific funnel usage when in workspace session
          let currentFunnelCount, maxFunnels, tierName;

          if (user?.isWorkspaceSession && user?.workspaceId && funnelUsage?.workspaces) {
            // Find the specific workspace usage
            const workspaceUsage = funnelUsage.workspaces.find(ws => ws._id === user.workspaceId);
            currentFunnelCount = workspaceUsage?.currentFunnels ?? 0;
            maxFunnels = workspaceUsage?.maxFunnels ?? 0;
            tierName = currentWorkspace?.name ? `${currentWorkspace.name} Workspace` : 'Workspace';
          } else {
            // Use total usage when not in workspace session
            currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? landingPages?.length ?? 0;
            maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
            tierName = user?.tier?.name ?? tier?.name ?? 'Free';
          }

          const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;

          if (hasReachedLimit) {
            // Show upgrade prompt instead of creation options - Modern Design
            return (
              <div className="p-8">
                {/* Header with gradient background */}
                <div className="relative -mx-8 -mt-8 px-8 pt-12 pb-8 mb-8 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                  <div className="relative text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-5 shadow-lg shadow-amber-200">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Campaign Limit Reached
                    </h1>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      You're using <span className="font-semibold text-amber-600">{currentFunnelCount} of {maxFunnels}</span> campaigns on the <span className="font-semibold">{tierName}</span> plan
                    </p>
                  </div>
                </div>

                {/* Benefits Grid */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">
                    Unlock with Pro
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "M12 6v12m6-6H6", text: "Unlimited campaigns" },
                      { icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", text: "AI-powered tools" },
                      { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", text: "Advanced analytics" },
                      { icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z", text: "Priority support" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setAddNewModal(false);
                      setUpgradeModalVisible(true);
                    }}
                    className="w-full py-3.5 px-6 bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={() => setAddNewModal(false)}
                    className="w-full py-3 px-6 text-gray-600 font-medium rounded-xl transition-all duration-200 hover:bg-violet-50"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            );
          }

          // Show normal creation options if under limit - Modern Design
          return (
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Create a new job
                </h1>
                <p className="text-gray-500 text-sm">
                  Choose how you'd like to get started
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-4 smx:grid-cols-1">
                {/* Start from scratch */}
                <button
                  onClick={() => {
                    setAddNew("scratch");
                    setAddNewModal(false);
                  }}
                  className="group relative text-left"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 hover:-translate-y-0.5">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center mb-4 group-hover:from-violet-100 group-hover:to-purple-100 transition-colors">
                      <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                      Start from scratch
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Build your job page step by step with our guided wizard
                    </p>

                    {/* Recommended badge */}
                    <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                      Recommended
                    </div>
                  </div>
                </button>

                {/* Paste a URL */}
                <button
                  onClick={() => {
                    setAddNewModal(false);
                    setAddNew("url");
                  }}
                  className="group relative text-left"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 hover:-translate-y-0.5">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-50 to-pink-50 flex items-center justify-center mb-4 group-hover:from-fuchsia-100 group-hover:to-pink-100 transition-colors">
                      <svg className="w-6 h-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-fuchsia-600 transition-colors">
                      Paste a URL
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Import from your career site or any public job posting
                    </p>

                    {/* AI badge */}
                    <div className="absolute top-3 right-3 bg-violet-50 text-violet-600 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      AI-powered
                    </div>
                  </div>
                </button>

                {/* Paste job text */}
                <button
                  onClick={() => {
                    setAddNewModal(false);
                    setAddNew("job-description");
                  }}
                  className="group relative text-left"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 hover:-translate-y-0.5">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center mb-4 group-hover:from-amber-100 group-hover:to-orange-100 transition-colors">
                      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                      Paste job text
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Copy & paste from Indeed, LinkedIn, or any job board
                    </p>
                  </div>
                </button>

                {/* Import from ATS - Locked */}
                <div className="group relative">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 p-5 opacity-60 cursor-not-allowed">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                      </svg>
                    </div>

                    <h3 className="text-base font-semibold text-gray-500 mb-1">
                      Import from ATS
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Direct integration with your applicant tracking system
                    </p>

                    {/* Premium badge */}
                    <div className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-violet-50/50 border border-violet-100/60">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-violet-700">Pro tip:</span> Using <span className="font-medium">Paste a URL</span> lets our AI extract all job details automatically — saves you time!
                </p>
              </div>
            </div>
          );
        })()}
      </Modal>

      {false && (
        <Modal
          open={!!addNew && addNew !== "scratch"}
          onCancel={() => {
            setAddNew(null);
            setAILoading(false);
            setAtsURL("");
            setJobDescription("");
            setJobTitleX("");
          }}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          wrapClassName={`${darkMode ? "dark" : ""}`}
          destroyOnClose
          title={
            addNew === "import-ats"
              ? "Paste a URL"
              : addNew === "job-description"
                ? "Paste existing job text"
                : addNew === "scratch"
                  ? "Start from scratch"
                  : "Choose a template"
          }
        >
          {addNew === "import-ats" && (
            <div className="mt-5 mb-2">
              <input
                type="url"
                className="w-full text-xs rounded-lg border border-gray-300 dark:bg-gray-900 outline-gray-300"
                placeholder="Enter Job Post URL"
                value={atsURL}
                onChange={(e) => setAtsURL(e.target.value)}
              />
            </div>
          )}
          {addNew === "job-description" && (
            <div className="mt-5 mb-2">
              <input
                type="url"
                className="w-full text-xs rounded-lg border border-gray-300 dark:bg-gray-900 outline-gray-300"
                placeholder="Job Title"
                value={jobTitleX}
                onChange={(e) => setJobTitleX(e.target.value)}
              />
              <textarea
                {...({})}
                rows={6}
                type="url"
                className="mt-2 w-full text-xs rounded-lg border border-gray-300 dark:bg-gray-900 outline-gray-300"
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}
          {addNew === "scratch" && <></>}
          {addNew === "template" && <></>}

          {AILoading || backendLoading ? (
            <div className="flex justify-center items-center mt-2 w-full">
              <AILoadingAnimation />
            </div>
          ) : (
            <div className="flex justify-end mt-2 w-full">
              <button
                className="p-2 w-full text-sm text-white bg-indigo-500 rounded"
                onClick={async () => {
                  if (addNew === "template") {
                    setTemplateModal(false);

                    return;
                  }
                  if (AILoading) return;
                  if (backendLoading) return;

                  if (jobDescription) {
                    return handleGenerateLP({
                      jobDescription,
                      jobTitle: jobTitleX,
                    });
                  }

                  const res = await UserService.importFromATS({ url: atsURL });
                  //   const visibleText = extractVisibleText(res.data.result);

                  const $ = load(res.data.result);
                  // Remove script, style, and other non-text elements
                  $("script, style, link, meta, noscript, svg, path").remove();

                  // Get the text content of the body element
                  const bodyText = $("body").text();

                  // Extract only the visible text content (remove extra whitespace and newlines)
                  const visibleText = bodyText.replace(/\s+/g, " ").trim();
                  if (visibleText.length < 100)
                    return antdmessage.error("Unable to parse the URL");

                  handleGenerateLP({
                    jobDescription: visibleText,
                    jobTitle: jobTitleX,
                  });
                }}
                disabled={backendLoading || AILoading}
              >
                <div className="flex justify-center items-center">
                  <div>Continue</div>
                </div>
              </button>
            </div>
          )}
        </Modal>
      )}

      <Modal
        open={!!promote}
        onCancel={() => {
          setPromote(null);
        }}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        wrapClassName={`${darkMode ? "dark" : ""}`}
        destroyOnClose
        title={`Promote ${promote?.vacancyTitle ?? ""}`}
      >
        <div className="mt-5 mb-2">
          <label>Creative</label>
          <div className="relative rounded-lg overflow-hidden w-64 h-64 bg-[#000000] flex items-center">
            <img src={adImage} alt="ad_creative" />
            <Button
              {...({})}
              color="indigo"
              size="lg"
              shape="round"
              className="absolute bottom-1 end-1"
              onClick={() => setPictureChangeModal(true)}
            >
              Change Creative
            </Button>
          </div>

          <Modal
            wrapClassName={`${darkMode ? "dark" : ""}`}
            open={!!pictureChangeModal}
            onCancel={() => setPictureChangeModal(false)}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            destroyOnClose
          >
            <div className="grid grid-cols-1 gap-5 mt-2 smx:grid-cols-2 mdx:grid-cols-3 lg:grid-cols-4">
              {resources?.map((resource, i) => (
                <div key={i} className="flex relative flex-col items-center">
                  <img
                    width={150}
                    title={"Resource" + i}
                    alt={"Resource" + i}
                    src={resource.secure_url}
                    className="rounded-lg cursor-pointer"
                    onClick={async () => {
                      setAdImage(resource.secure_url);
                      setPictureChangeModal(false);
                    }}
                  />
                </div>
              ))}
            </div>
          </Modal>
        </div>
        <div className="mt-5 mb-2">
          <label>Headline</label>
          <input
            type="url"
            className="mt-2 w-full dark:bg-gray-900"
            placeholder="Enter Headline"
            value={adHeadline}
            onChange={(e) => setAdHeadline(e.target.value)}
          />
        </div>
        <div className="mt-5 mb-2">
          <label>CTA</label>
          <input
            className="mt-2 w-full dark:bg-gray-900"
            placeholder="Enter CTA"
            value={cta}
            onChange={(e) => setCTA(e.target.value)}
          />
        </div>
        <div className="mt-5 mb-2">
          <label>Location</label>
          <input
            className="mt-2 w-full dark:bg-gray-900"
            placeholder="Enter Location"
            value={adJobCity}
            onChange={(e) => setAdJobCity(e.target.value)}
          />
        </div>
        <div className="mt-5 mb-2">
          <label>Interest</label>
          <Select
            mode="tags"
            className="mt-2 w-full dark:bg-gray-900"
            placeholder="Enter Interest"
            value={adJobInterest}
            onChange={(e) => setAdJobInterest(e)}
          />
        </div>
        <div className="mt-5 mb-2">
          <label>Daily Budget</label>
          <input
            type="number"
            className="mt-2 w-full dark:bg-gray-900"
            placeholder="Enter Daily Budget"
            value={adBudget}
            min={20}
            onChange={(e) => setAdBudget(Math.max(20, Number(e.target.value)))}
          />
        </div>

        <div className="flex justify-end mt-5 mb-2 w-full">
          <button
            className="px-2 py-1 text-sm text-white bg-indigo-500 rounded"
            onClick={async () => {
              if (!adImage) return antdmessage.info("Ad creative is required");
              if (!adHeadline) return antdmessage.info("Headline is required");
              if (!cta) return antdmessage.info("CTA is required");
              if (adBudget <= 0)
                return antdmessage.info("Daily budget should be more than 0");
              const res = await UserService.postAd({
                adImage,
                adHeadline,
                cta,
                adJobCity,
                adJobInterest,
                adBudget,
                promote,
              });
              if (res.data?.url) return (window.location.href = res.data.url);
              setPromote(null);
            }}
          >
            {backendLoading ? <Spin>Post Ad</Spin> : "Post Ad"}
          </button>
        </div>
      </Modal>

      <Modal
        title={`Add ${currentFilter.key} Filter`}
        open={filterModalVisible}
        onOk={() => handleFilterChange(currentFilter)}
        onCancel={() => setFilterModalVisible(false)}
        footer={[
          <div key="footer" className="flex gap-3 justify-center mt-4">
            <Button
              {...({})}
              key="cancel"
              onClick={() => setFilterModalVisible(false)}
              className="px-4 py-2 w-1/2 text-gray-700 rounded-md border border-gray-300 transition duration-300 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              {...({})}
              key="ok"
              type="primary"
              className="w-1/2 bg-[#1677FF] hover:bg-[#125FCC] text-white transition duration-300 px-4 py-2 rounded-md"
              onClick={() => handleFilterChange(currentFilter)}
            >
              Apply Filter
            </Button>
          </div>,
        ]}
      >
        <Input
          {...({})}
          placeholder={`Enter ${currentFilter.key} value`}
          value={currentFilter.value}
          onChange={(e) => setCurrentFilter({ ...currentFilter, value: e })}
        />
      </Modal>

      <Modal
        open={renameModal}
        onCancel={() => setRenameModal(false)}
        onOk={handleRename}
        okText="Rename"
        title="Rename Vacancy"
        footer={
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <Button
              {...({})}
              type="text"
              className="w-1/2 text-gray-700 rounded-lg border-gray-300"
              onClick={() => setRenameModal(false)}
            >
              Cancel
            </Button>
            <Button
              {...({})}
              className="w-1/2 rounded-lg custom-button"
              type="primary"
              onClick={handleRename}
            >
              Rename
            </Button>
          </div>
        }
      >
        <Input
          {...({})}
          placeholder="Enter new title for the vacancy"
          value={newVacancyTitle}
          onChange={(e) => setNewVacancyTitle(e)}
          className="mt-4 rounded-lg"
          style={{ borderColor: "#D0D5DD", borderWidth: "1px" }}
        />
      </Modal>

      {addNew === "scratch" && (
        <FromScratchModal onClose={() => setAddNew(null)} ongoBack={() => { setAddNew(null); setAddNewModal(true) }} onRefresh={handleRefreshAfterVacancyCreation} />
      )}
      {addNew === "url" && (
        queryParams?.get('debug') === 'true'
          ? <PasteUrlModalExperimental onClose={() => setAddNew(null)} />
          : <PasteUrlModal onClose={() => setAddNew(null)} ongoBack={() => { setAddNew(null); setAddNewModal(true) }} onRefresh={handleRefreshAfterVacancyCreation} />
      )}
      {addNew === "job-description" && (
        <JobDescriptionModal onClose={() => setAddNew(null)} ongoBack={() => { setAddNew(null); setAddNewModal(true) }} onRefresh={handleRefreshAfterVacancyCreation} />
      )}

      {/* Campaign Type Selector Modal */}
      <CampaignTypeSelector
        isOpen={campaignTypeSelectorOpen}
        onClose={() => setCampaignTypeSelectorOpen(false)}
        onSelectSingle={handleSelectSingleJob}
        onSelectMulti={handleSelectMultiJob}
        darkMode={darkMode}
      />

      {/* Multi-Job Campaign Modal */}
      <MultiJobCampaignModal
        isOpen={multiJobModalOpen}
        onClose={() => setMultiJobModalOpen(false)}
        onGoBack={() => {
          setMultiJobModalOpen(false);
          setCampaignTypeSelectorOpen(true);
        }}
        onRefresh={handleRefreshAfterVacancyCreation}
        darkMode={darkMode}
        brandingDetails={brandingDetails}
      />

      <UpgradeModal
        open={upgradeModalVisible}
        onClose={() => {
          setUpgradeModalVisible(false);
          // Refresh user data to get updated limits
          refreshUserData();
        }}
        currentTier={tier}
        requiredTier={upgradeNeeded}
        feature="funnel"
        usage={user?.usage}
        plans={user?.plans || []}
        upgradeReason="limit"
      />
    </>
  );
};

const getAiPromptContent = () => {
  return `
   important : menuItems must not be translated and must be in english.
Create an vacancy landing page according to this vacancy data. Use EVP framework to create the most awesome job page. Improvise if required information is missing. It is important to translate the content of the page accurately, especially when it comes to benefits, tasks and responsibilities.

The content of the landing page (including the form) should have the same language from the provided vacancy data.

Respond with json that adheres to the following jsonschema: 
{
vacancyTitle: { type: String, default: "" },
heroPicture: { type: String, default: "/dhwise-images/placeholder.png" },
heroImage: { type: String, default: "/images3/img_hero_section.png" },
heroImagePosition: { type: Object, default: { x: "50%", y: "0%" } },
companyName: { type: String, default: "HireLab" },
heroDescription: {
  type: String,
  default:
    "Are you a dynamic and experienced talent looking for your next challenge? We're seeking a talented individual to join our team.",
},
cta1Title: {
  type: String,
  default: "Share",
},
cta2Title: {
  type: String,
  default: "Apply now",
},
cta1Link: {
  type: String,
  default: "#share",
},
cta2Link: {
  type: String,
  default: "#apply",
},
salary: { type: String, default: "" },
salaryRange: { type: Boolean, default: false },
salaryMin: { type: String, default: 2500 },
recruiters: {
  type: [Object],
  default: [
    {
      recruiterFullname: "John Doe",
      recruiterRole: "HR Manager",
      recruiterEmail: "info@xyztech.com",
      recruiterPhone: "123-456-7890",
      recruiterAvatar: "/dhwise-images/placeholder.png",
      recruiterPhoneEnabled: true,
      recruiterEmailEnabled: true,
    },
  ],
},
salaryMax: { type: String, default: 5000 },
salaryCurrency: { type: String, default: "EUR" },
salaryTime: { type: String, default: "Month" },
hoursRange: { type: Boolean, default: false },
hoursMin: { type: String, default: 7 },
hoursMax: { type: String, default: 10 },
hoursUnit: { type: String, default: "Week" },
published: { type: Boolean, default: true },
location: { type: [String], default: [] },
menuItems: {
  type: [Object],
  default: [
    {
      key: "Job Specifications",
    },
    {
      key: "Recruiter Contact",
    },
    {
      key: "Job Description",
    },
    {
      key: "Agenda",
    },
    {
      key: "Image Carousel",
    },
    {
      key: "Company Facts",
    },
    {
      key: "Meet CEO",
    },
    {
      key: "Employee Testimonials",
    },
    {
      key: "Candidate Process",
    },
    {
      key: "Growth Path",
    },
    {
      key: "Video",
    },
  ],
},
timeRequirement: { type: String, default: "" },
testimonialTitle: {
  type: String,
  default: "Testimonials",
},
testimonialSubheader: {
  type: String,
  default: "Testimonials",
},
testimonials: {
  type: [
    {
      comment: { type: String, default: "" },
      fullname: { type: String, default: "" },
      role: { type: String, default: "" },
      avatar: { type: String, default: "/dhwise-images/placeholder.png" },
      avatarEnabled: { type: Boolean, default: true },
    },
  ],
  default: [
    {
      comment:
        "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence. It's truly a rewarding and inspiring environment.",
      fullname: "John Doe",
      role: "CEO",
      avatar: "/dhwise-images/placeholder.png",
      avatarEnabled: true,
    },
    {
      comment:
        "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence. It's truly a rewarding and inspiring environment.",
      fullname: "John Doe",
      role: "CEO",
      avatar: "/dhwise-images/placeholder.png",
      avatarEnabled: true,
    },
  ],
},
companyFacts: {
  type: [
    {
      descriptionText: { type: String, default: "" },
      headingText: { type: String, default: "" },
      icon: {
        type: String,
        default: "/images3/img_bar_chart_square_up.svg",
      },
    },
  ],
  default: [
    {
      headingText: "Innovation Leaders",
      descriptionText: "Recruitment marketing automation.",
      icon: "/images3/bar-chart-square-up.png",
    },
    {
      headingText: "Award-Winning",
      descriptionText: "Recipient of multiple industry awards.",
      icon: "/images3/award-03.png",
    },
    {
      headingText: "Community Engagement",
      descriptionText: "Active in social responsibility initiatives.",
      icon: "/images3/zap (1).png",
    },
    {
      headingText: "Employee-Centric",
      descriptionText: "Recognized for our employee benefits.",
      icon: "/images3/message-smile-circle.png",
    },
    {
      headingText: "Global Presence",
      descriptionText: "Serving clients in over 20 countries.",
      icon: "/images3/globe-02 (1).png",
    },
    {
      headingText: "Cutting-Edge Technology",
      descriptionText: "Constantly evolving our platform.",
      icon: "/images3/chart-breakout-square.png",
    },
  ],
},
candidateProcess: {
  type: [
    {
      candidateProcessText: { type: String, default: "" },
      candidateProcessIcon: {
        type: String,
        default: "/images3/img_partner_exchange.svg",
      },
    },
  ],
  default: [
    {
      candidateProcessText: "Submit Application",
      candidateProcessIcon: "/images3/img_lock.svg",
    },
    {
      candidateProcessText: "Screening",
      candidateProcessIcon: "/images3/img_screen_search_desktop.svg",
    },
    {
      candidateProcessText: "Interview",
      candidateProcessIcon: "/images3/img_partner_exchange.svg",
    },
    {
      candidateProcessText: "Offer",
      candidateProcessIcon: "/images3/img_television.svg",
    },
  ],
},
growthPathTitle: {
  type: String,
  default: "Growth path",
},
growthPathDescription: {
  type: String,
  default: "Take a glimpse of how your career could progress.",
},
videoTitle: {
  type: String,
  default: "Interview tips",
},
videoDescription: {
  type: String,
  default: "Mastering the Interview: Essential Tips for Success",
},
footerTitle: {
  type: String,
  default: "Ready to take the next step in your career?",
},
footerDescription: {
  type: String,
  default: "Explore our exciting job opportunities and apply today!",
},
ctaFooterTitle: {
  type: String,
  default: "Apply now",
},
ctaFooterLink: {
  type: String,
  default: "#apply",
},
similarJobsTitle: {
  type: String,
  default: "You may also like",
},
createdWithText: {
  type: String,
  default: "Created with HireLab",
},
myVideo: {
  type: String,
  default:
    "https://res.cloudinary.com/dvq0ouupb/video/upload/v1730032876/zswscaduwpr9mdmxb3ou.mp4",
},
currentPath: { type: Number, default: 1 },
templateId: { type: String, default: "2" },
growthPath: {
  type: [
    {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
  ],
  default: [
    {
      title: "Entry-Level",
      description: "",
    },
    {
      title: "Mid-Level",
      description: "",
    },
    {
      title: "Senior-Level",
      description: "",
    },
    {
      title: "Executive-Level",
      description: "",
    },
  ],
},
companyFactsTitle: {
  type: String,
  default: "Our company facts",
},
companyFactsDescription: {
  type: String,
  default:
    "With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers.",
},


formIntroductionText: {
  type: String,
  default:
    "Welcome! Great to have you with us today. You can start your application here. This won't take more than a minute.",
},
formSubText: {
  type: String,
  default: "Please click next to fill out your details.",
},
formSuccessMessage: {
  type: String,
  default: "Application submitted successfully!",
},
formErrorMessage: {
  type: String,
  default: "Failed to submit application",
},
ctaApply: {
  type: String,
  default: "Apply now",
},
form: {
  title: { type: String, default: "Application Form (This should be in the same language as job)" },
  description: {
    type: String,
    default: "Please fill out the form below to apply. (This should be in the same language as job)",
  },
  fields: [
    {
      id: String,
      type: {
        type: String,
        enum: [
          "name",
          "email",
          "phone",
          "text",
          "multipleChoice",
          "motivation",
        ],
      },
      label: String,
      required: { type: Boolean, default: false },
      options: [
        {
          text: String,
          isNegative: { type: Boolean, default: false },
        },
      ],
    },
  ],
  submitText: { type: String, default: "Submit Application (This should be in the same language as job)" },
},

}
    `;
};

export default Vacancies;

// Corrected Timeline Component matching Figma design with responsiveness and real data
function Timeline({ campaigns, timeframe, isDemo }) {
  const [expanded, setExpanded] = React.useState(new Set());

  // Calculate timeframe window
  const now = new Date();
  const timeframeStart = React.useMemo(() => {
    const d = new Date();
    if (timeframe === '3m') d.setMonth(d.getMonth() - 3);
    else if (timeframe === '6m') d.setMonth(d.getMonth() - 6);
    else d.setMonth(d.getMonth() - 12); // Default to year view for 'all'
    return d;
  }, [timeframe]);

  const windowMs = now.getTime() - timeframeStart.getTime();

  // Dummy data for demo mode
  const dummyCampaigns = [
    {
      _id: "demo-1",
      vacancyTitle: "Project Manager",
      location: "Amsterdam",
      createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString(),
      visits: 3600,
      applicants: 256,
      adBudget: 45
    },
    {
      _id: "demo-2",
      vacancyTitle: "Operations Manager",
      location: "London",
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString(),
      visits: 2100,
      applicants: 137,
      adBudget: 35
    },
    {
      _id: "demo-3",
      vacancyTitle: "CS Agent",
      location: "Berlin",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
      visits: 1800,
      applicants: 112,
      adBudget: 25
    }
  ];

  const dataToRender = isDemo ? dummyCampaigns : (campaigns || []);

  // Process rows from campaigns data
  const rows = React.useMemo(() => {
    return dataToRender.map(c => {
      // Logic for bars
      const createdAt = new Date(c.createdAt);
      let startPct = 0;
      let widthPct = 0;

      if (createdAt > timeframeStart) {
        startPct = ((createdAt.getTime() - timeframeStart.getTime()) / windowMs) * 100;
        widthPct = ((now.getTime() - createdAt.getTime()) / windowMs) * 100;
      } else {
        startPct = 0;
        widthPct = ((now.getTime() - timeframeStart.getTime()) / windowMs) * 100;
      }

      // Ensure bounds
      startPct = Math.max(0, Math.min(100, startPct));
      widthPct = Math.max(0, Math.min(100 - startPct, widthPct));

      // Construct Meta channel (default for now as per requirement)
      // Only show if there is an ad budget or in demo mode
      const dailyBudget = c.adBudget || 0;
      const channels = [];

      if (dailyBudget > 0 || isDemo) {
        const daysActive = Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));
        const totalBudget = dailyBudget * daysActive;

        const metaChannel = {
          name: "Meta",
          label: "Meta Ads",
          dailyBudget: dailyBudget,
          totalBudget: totalBudget,
          color: "#3b82f6", // blue-500
          startPct,
          widthPct
        };
        channels.push(metaChannel);
      }

      const locationStr = Array.isArray(c.location) ? c.location.join(', ') : (c.location || "Remote");

      const totalBudget = channels.reduce((acc, ch) => acc + ch.totalBudget, 0);

      return {
        id: c._id,
        title: c.vacancyTitle,
        location: `${locationStr} - ${moment(c.createdAt).format('DD/MM/YYYY')} - Present`,
        budgets: { total: totalBudget },
        analytics: {
          reach: c.visits ? (c.visits * 5).toLocaleString() : "0", // Estimate
          visits: c.visits || 0,
          ctr: isDemo ? "2.9%" : "N/A",
          cpc: isDemo ? "€0.40" : "N/A"
        },
        channels: channels
      };
    });
  }, [dataToRender, timeframeStart, windowMs, isDemo]);


  const toggleRow = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const months = React.useMemo(() => {
    const m = [];
    const d = new Date(timeframeStart);
    // Move to start of month
    d.setDate(1);

    const end = new Date(now);

    while (d <= end) {
      m.push(d.toLocaleString('default', { month: 'short' }));
      d.setMonth(d.getMonth() + 1);
    }
    // Ensure we don't have too many labels if timeframe is long
    if (m.length > 12) {
      return m.filter((_, i) => i % 2 === 0);
    }
    return m;
  }, [timeframeStart]);

  return (
    <div className="bg-white border border-gray-200 rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Calendar Header */}
          <div className="flex items-center border-b border-gray-200">
            <div className="w-[343.5px] shrink-0 p-4 flex items-center justify-between sticky left-0 bg-white z-20 border-r border-gray-200">
              <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-3 h-3 text-gray-500" /></button>
              <span className="text-base font-semibold text-gray-800">{now.getFullYear()}</span>
              <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-3 h-3 text-gray-500" /></button>
            </div>
            <div className="flex flex-1 border-l border-transparent">
              {months.map((m, i) => (
                <div key={i} className={`flex-1 py-4 flex justify-center text-base ${m === 'Oct' ? 'text-violet-700 font-semibold' : 'text-gray-500 font-medium'}`}>
                  {m}
                </div>
              ))}
            </div>
            <div className="w-[150px] shrink-0"></div>
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div key={row.id} className="border-b border-gray-200 last:border-0">
              {/* Main Row */}
              <div className="flex min-h-[76px] relative group">
                {/* Left: Info - Sticky */}
                <div className="w-[343.5px] shrink-0 p-4 border-r border-gray-200 flex justify-between items-start bg-white z-20 sticky left-0 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col gap-1">
                    <div className="text-base font-bold text-gray-900">{row.title}</div>
                    <div className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[280px]">{row.location}</div>
                  </div>
                  <button onClick={() => toggleRow(row.id)} className="p-0.5 mt-0.5 shrink-0">
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expanded.has(row.id) ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Middle: Visualization */}
                <div className="flex-1 relative border-r border-gray-200 min-w-[500px]">
                  {/* Background Grid */}
                  <div className="flex absolute inset-0">
                    {months.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-gray-100 border-dashed last:border-0" />
                    ))}
                  </div>

                  {/* Overlay Metric Bar */}
                  <div className="absolute inset-0 p-2 pt-3">
                    <div className="h-8 bg-[#f5f3ff]/60 rounded text-xs flex items-center justify-between px-4 lg:px-10 text-gray-600 border border-transparent mx-4 lg:mx-20 whitespace-nowrap overflow-hidden">
                      <span className="mr-2">Reach: {row.analytics.reach}</span>
                      <span className="mr-2">Visit: {row.analytics.visits}</span>
                      <span className="mr-2">CTR {row.analytics.ctr}</span>
                      <span>CPC {row.analytics.cpc}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Total */}
                <div className="w-[150px] shrink-0 p-4 flex items-center justify-end font-bold text-gray-900 text-base bg-white">
                  Total: ${row.budgets.total.toLocaleString()}
                </div>
              </div>

              {/* Expanded Channels */}
              {expanded.has(row.id) && (
                <div className="bg-white">
                  {row.channels.map((ch, idx) => (
                    <div key={idx} className="flex min-h-[76px] border-t border-gray-100">
                      {/* Left: Channel Info - Sticky */}
                      <div className="w-[343.5px] shrink-0 p-4 border-r border-gray-200 flex items-center gap-3 bg-white z-20 sticky left-0 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-center items-center w-8 h-8 shrink-0">
                          {ch.name === 'Meta' && <FaFacebook className="w-6 h-6 text-blue-600" />}
                          {ch.name === 'Google' && <FaGoogle className="w-5 h-5 text-green-500" />}
                          {ch.name === 'LinkedIn' && <FaLinkedin className="w-6 h-6 text-blue-700" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            ${ch.dailyBudget} <span className="font-normal text-gray-500">Daily budget</span>
                          </div>
                          <div className="mt-0.5 text-xs text-gray-400">
                            ${ch.totalBudget.toLocaleString()} Total budget
                          </div>
                        </div>
                      </div>

                      {/* Middle: Bar */}
                      <div className="flex-1 relative border-r border-gray-200 min-w-[500px]">
                        <div className="flex absolute inset-0">
                          {months.map((_, i) => <div key={i} className="flex-1 border-r border-gray-100 border-dashed last:border-0" />)}
                        </div>
                        <div className="absolute inset-0 py-5">
                          <div
                            className="flex overflow-hidden relative justify-center items-center px-2 h-8 text-sm font-medium text-white whitespace-nowrap rounded-lg shadow-sm"
                            style={{
                              backgroundColor: ch.color,
                              left: `${ch.startPct}%`,
                              width: `${ch.widthPct}%`
                            }}
                          >
                            {ch.label}
                          </div>
                        </div>
                      </div>

                      {/* Right: Spacer */}
                      <div className="w-[150px] shrink-0 bg-white"></div>
                    </div>
                  ))}

                  {/* Add Channel Button Row */}
                  <div className="flex min-h-[76px] border-t border-gray-100">
                    <div className="w-[343.5px] shrink-0 flex items-center justify-center border-r border-gray-200 p-4 bg-white z-20 sticky left-0 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <button className="flex gap-2 items-center px-4 py-1.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-full transition-colors hover:bg-gray-200">
                        <Plus className="w-3.5 h-3.5" />
                        Add new channel
                      </button>
                    </div>
                    <div className="flex-1 border-r border-gray-200 bg-white min-w-[500px]"></div>
                    <div className="w-[150px] shrink-0 bg-white"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Performance tab with real data
function CampaignsPerformance({ campaigns, isDemo }) {
  // Dummy data for demo mode
  const dummyCampaigns = [
    {
      vacancyTitle: "Project Manager",
      visits: 3600,
      applicants: 256
    },
    {
      vacancyTitle: "Operations Manager",
      visits: 2100,
      applicants: 137
    },
    {
      vacancyTitle: "CS Agent",
      visits: 1800,
      applicants: 112
    }
  ];

  const dataToRender = isDemo ? dummyCampaigns : (campaigns || []);

  // Aggregate data
  const stats = React.useMemo(() => {
    let totalVisits = 0;
    let totalApplicants = 0;

    dataToRender.forEach(c => {
      totalVisits += (c.visits || 0);
      totalApplicants += (c.applicants || 0);
    });

    // Estimates/Placeholders where data is missing
    const totalReach = totalVisits > 0 ? totalVisits * 3 : 0;

    return {
      reach: totalReach,
      visits: totalVisits,
      applicants: totalApplicants,
    };
  }, [dataToRender]);

  const kpis = [
    { label: 'Reach', value: stats.reach.toLocaleString(), delta: isDemo ? '+12%' : 'N/A', positive: true, icon: <Search className="w-5 h-5" /> },
    { label: 'Visits', value: stats.visits.toLocaleString(), delta: isDemo ? '+5%' : 'N/A', positive: true, icon: <Search className="w-5 h-5" /> },
    { label: 'Time on Site', value: isDemo ? '2m 30s' : 'N/A', delta: isDemo ? '+10%' : 'N/A', positive: true, icon: <Search className="w-5 h-5" /> },
    { label: 'Applicants', value: stats.applicants.toLocaleString(), delta: isDemo ? '+21%' : 'N/A', positive: true, icon: <Search className="w-5 h-5" /> },
    { label: 'Cost Per Applicant', value: isDemo ? '€15.50' : 'N/A', delta: isDemo ? '↓ 8%' : 'N/A', positive: true, icon: <Search className="w-5 h-5" /> },
  ];

  // Channels - Only Meta for now as per requirement
  const channels = [
    {
      name: 'Meta',
      applicants: stats.applicants,
      cpa: isDemo ? '€18.20' : 'N/A',
      ctr: isDemo ? '2.5%' : 'N/A',
      color: '#3b82f6',
      icon: <FaFacebook className="w-5 h-5 text-white" />
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">

        {/* Main content */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          {/* KPI tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {kpis.map((k) => (
              <div key={k.label} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between h-[120px]">
                <div className="text-sm font-medium text-gray-500">{k.label}</div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-gray-900">{k.value}</div>
                  <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${k.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    <span className="mr-1">{k.positive ? '↑' : '↓'}</span>
                    {k.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Channels cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {channels.map((c) => (
              <div key={c.name} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex gap-3 items-center mb-4">
                  <div className={`flex justify-center items-center w-8 h-8 rounded-lg`} style={{ backgroundColor: c.color }}>
                    {c.icon}
                  </div>
                  <div className="text-base font-semibold text-gray-800">{c.name}</div>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-gray-800">Applicants</span>
                  <span className="text-sm font-semibold text-gray-800">{c.applicants.toLocaleString()}</span>
                </div>

                <div className="overflow-hidden mb-4 h-2 bg-gray-100 rounded-full">
                  <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: c.color }} />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div>CPA: {c.cpa}</div>
                  <div>CTR: {c.ctr}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel strip */}
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-8 text-base font-semibold text-gray-800">Campaign Funnel</div>
            <div className="flex justify-between items-start px-4 md:px-12 lg:px-24">
              {/* Step 1: Reach */}
              <div className="flex z-10 flex-col items-center w-24">
                <div className="mb-2 text-sm text-gray-500">Reach</div>
                <div className="text-2xl font-bold text-gray-900">{stats.reach.toLocaleString()}</div>
              </div>

              {/* Connector 1 */}
              <div className="flex relative flex-col flex-1 items-center mx-4 mt-3">
                {/* Line */}
                <div className="w-full h-[2px] bg-gray-200 relative">
                  {/* Optional Tick/Arrow on line */}
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Badge below line */}
                <div className="px-2.5 py-0.5 mt-4 text-xs font-semibold text-green-700 bg-green-50 rounded-full border border-green-100">
                  {isDemo ? '3.1%' : (stats.reach > 0 ? ((stats.visits / stats.reach) * 100).toFixed(1) + '%' : '0%')}
                </div>
              </div>

              {/* Step 2: Visits/Clicks */}
              <div className="flex z-10 flex-col items-center w-24">
                <div className="mb-2 text-sm text-gray-500">Clicks</div>
                <div className="text-2xl font-bold text-gray-900">{stats.visits.toLocaleString()}</div>
              </div>

              {/* Connector 2 */}
              <div className="flex relative flex-col flex-1 items-center mx-4 mt-3">
                {/* Line */}
                <div className="w-full h-[2px] bg-gray-200 relative">
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Badge below line */}
                <div className="px-2.5 py-0.5 mt-4 text-xs font-semibold text-green-700 bg-green-50 rounded-full border border-green-100">
                  {isDemo ? '13%' : (stats.visits > 0 ? ((stats.applicants / stats.visits) * 100).toFixed(1) + '%' : '0%')}
                </div>
              </div>

              {/* Step 3: Applies */}
              <div className="flex z-10 flex-col items-center w-24">
                <div className="mb-2 text-sm text-gray-500">Applies</div>
                <div className="text-2xl font-bold text-violet-700">{stats.applicants.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Campaigns table */}
          <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="text-base font-semibold text-gray-800">Campaigns</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="text-xs font-medium text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Campaign</th>
                    <th className="px-6 py-4 font-medium">Channel</th>
                    <th className="px-6 py-4 font-medium">Spend</th>
                    <th className="px-6 py-4 font-medium">Applicants</th>
                    <th className="px-6 py-4 font-medium">CPA</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataToRender.map((r, i) => (
                    <tr key={i} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-800">{r.vacancyTitle}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-[#8b5cf6] text-white border-transparent">
                            <FaFacebook className="w-3 h-3" />
                            Meta
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{isDemo ? '€2,500' : 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-600">{r.applicants || 0}</td>
                      <td className="px-6 py-4 text-gray-600">{isDemo ? '€18.24' : 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
