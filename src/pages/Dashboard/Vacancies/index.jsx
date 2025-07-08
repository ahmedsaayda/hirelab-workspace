import { CloseOutlined } from "@ant-design/icons";
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

import { CircleX, ChevronDown, ChevronUp, Search } from "lucide-react";
import {
  getPartner,
  selectDarkMode,
  selectLoading,
  selectUser,
} from "../../../redux/auth/selectors.js";
import AuthService from "../../../services/AuthService.js";
import CrudService from "../../../services/CrudService.js";
import PublicService from "../../../services/PublicService.js";
import UserService from "../../../services/UserService.js";

import debounce from "lodash/debounce";
import moment from "moment";
import { FaSortAmountDownAlt } from "react-icons/fa";
import AILoadingAnimation from "../../../../pages/AILoadingAnimation.js";
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
  
  // Extract query parameters from Next.js router
  const searchParams = new URLSearchParams(router.asPath.split('?')[1] || '');
  const isNew = router.query.new || searchParams.get('new');

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
  const [jobTitleX, setJobTitleX] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [adHeadline, setAdHeadline] = useState("");
  const [adImage, setAdImage] = useState("");
  const [cta, setCTA] = useState("");
  const [adJobCity, setAdJobCity] = useState("");
  const [AILoading, setAILoading] = useState(false);
  const [adBudget, setAdBudget] = useState(
    localStorage?.adBudget ? parseInt(localStorage?.adBudget) : 25
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
  console.log("user", user);
  const [loadingFetchData, setLoading] = useState(true);
  const brandingDetails = {
    companyName: user?.companyName,
    companyUrl: user?.companyUrl,
    companyInfo: user?.companyInfo,
    companyLogo: user?.companyLogo,
    primaryColor: user?.primaryColor,
    secondaryColor: user?.secondaryColor,
    tertiaryColor: user?.tertiaryColor,
    selectedFont: user?.selectedFont,
  };
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

  useEffect(() => {
    if (isNew === "true" ) {
      if (landingPages && landingPages.length > 0) {
         setAddNewModal(false);
         return
      }else {

        setAddNewModal(true);
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
              const result = await CrudService.search(
                "LandingPageData",
                itemsPerPage,
                currentPage,
                {
                  text: searchValue,
                  filters: {
                    user_id: user._id,
                    ...formattedFilters,
                  },
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
              setLandingPages(
                result.data.items.map((i) => {
                  const visits = i.visits || 0;
                  const avgTimeSpent = visits > 0 ? Math.round((i.totalTimeSpent || 0) / visits) : 0;
                  const daysLive = Math.ceil((new Date() - new Date(i.createdAt)) / (1000 * 60 * 60 * 24));
                  
                  return {
                    ...i,
                    position: "Position",
                    heading: i.vacancyTitle,
                    deadlinetwo: "Deadline:",
                    mar42024: moment(i.createdAt).format("MMM Do YYYY"),
                    // Real analytics data
                    visits: visits,
                    avgTimeSpent: avgTimeSpent,
                    applicants: 0, // For now, showing as 0
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
    status
  ]);

  const fetchAllDataByUser = async () => {
    try {
      setLoading(true);
      const result = await CrudService.search("LandingPageData", 999999, 1, {
        text: "",
        filters: {
          user_id: user._id,
        },
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
    socket.current = new WebSocket(
      `wss://booklified-chat-socket.herokuapp.com`
    );

    socket.current.addEventListener("open", async () => {
      socketPing.current = setInterval(
        () => socket?.current?.send(JSON.stringify({ id: "PING" })),
        30000
      );

      const content =
        `      ${jobTitle && "Job Title: " + jobTitle}
      Vacancy Data:
        ${jobDescription.slice(0, 10000)}` + getAiPromptContent();

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

        router.push(`/edit-page/${res.data.result._id}`);
      } catch (error) {
        console.error("Error processing AI response:", error);
        antdmessage.error(
          "Failed to create vacancy: " +
          (error.message || "Invalid response from AI")
        );
        setBackendLoading(false);
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
    try {
      const { _id, ...vacancyData } = landingPage;
      const res = await CrudService.create("LandingPageData", {
        ...brandingDetails,
        ...vacancyData,
        vacancyTitle: `${vacancyData.vacancyTitle} (Copy)`,
      });
      antdmessage.success("Vacancy duplicated successfully");
      await fetchData();
    } catch (error) {
      console.error("Error duplicating vacancy:", error);
      antdmessage.error("Failed to duplicate vacancy. Please try again.");
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
    setAddNewModal(true);

    return;
    // Check if user has reached their funnel limit
    if (tier.maxFunnels !== null && landingPageNum >= tier.maxFunnels) {
      setUpgradeModalVisible(true);
    } else {
      setAddNewModal(true);
    }
  };

  const handleRefreshAfterVacancyCreation = () => {
    fetchData();
  }

  if (facebookLoading) return <Skeleton active />;
  return (
    <>
      <div className="flex flex-col flex-1 gap-6 pl-6 pt-3.5 pb-3 mdx:self-stretch">
        <div className="flex gap-4 justify-between items-center smx:flex-col">
          <h1 className="text-2xl font-semibold text-gray-900">
            Vacancies
          </h1>
          <button
            onClick={handleCreateNewVacancy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Vacancy
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="">
            <div className="flex gap-3 w-full smx:flex-col">
              {/* Modern Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search vacancies..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {searchValue && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Active Sort Pills */}
              {sorters.map((sorter) => (
                <div key={sorter.key} className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
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
                className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                  filterCount > 0 
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
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
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

            {status && (
              <div className="filter-status-indicator inline-flex bg-[#5207CD] text-white p-1 px-2 mt-1 rounded-full items-center">
                <span>{status === 'published' ? 'Published' : 'Unpublished'} vacancies</span>
                <span
                  onClick={() => router.push('/dashboard/vacancies')}
                  className="flex justify-center items-center ml-2 cursor-pointer transition focus:outline-none"
                >
                  <CircleX size={18} fill={"#9fa3a7"} />
                </span>
              </div>
            )}

          </div>
          <div className="grid grid-cols-1 gap-3 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        wrapClassName={`${darkMode ? "dark" : ""}`}
        destroyOnClose
        closable={false}
      >
        <div className="flex flex-col gap-[29px] rounded-[12px] bg-white-A700 py-1 pl-6 pr-[23px] sm:p-5">
          <div className="flex gap-5 justify-center items-center w-full md:pl-5">
            <Heading
              size="7xl"
              as="h1"
              className="!text-black-900_01 w-full text-center"
            >
              Create a new vacancy
            </Heading>

            <Img
              src="/images/img_arrow_right_blue_gray_400.svg"
              alt="arrowright"
              className="h-[24px] w-[24px] self-start cursor-pointer"
              onClick={() => setAddNewModal(false)}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 justify-center smx:grid-cols-1">
            {[
              {
                text: "Start from scratch",
                subtext:"Best used when you don't have a job description ready",
                imageIcon: "/images/img_plus.svg",
                onClick: async () => {
                  setAddNew("scratch");
                  setAddNewModal(false);
                },
                locked: false,
              },
              {
                text: "Paste a URL",
                subtext:"Best used with public job page URLs (ie. URLs from your company career site)",
                imageIcon: "/images/folder.svg",
                onClick: () => {
                  setAddNewModal(false);
                  setAddNew("url");
                },
                locked: false,
              },
              {
                text: "Paste existing job text",
                subtext:"Best used for gated or private job pages. (ie job boards like Indeed)",
                imageIcon: "/images/magic-wand-01.svg",
                onClick: () => {
                  setAddNewModal(false);
                  setAddNew("job-description");
                },
                locked: false,
              },
              {
                text: "Import from ATS",
                subtext:"Used only with direct external ATS integation",
                imageIcon: "/images/layout-alt-01.svg",
                onClick: () => {
                  setAddNewModal(false);
                  setAddNew("import-ats");
                },
                locked: true,
              },
            ]?.map((d, index) => (
              <CreateANewVacancyInput {...d} key={"gridplusone" + index} />
            ))}
          </div>
        </div>
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
                {...({} )}
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
              {...({} )}
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
            onChange={(e) => setAdBudget(Number(e.target.value))}
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
              {...({} )}
              key="cancel"
              onClick={() => setFilterModalVisible(false)}
              className="px-4 py-2 w-1/2 text-gray-700 rounded-md border border-gray-300 transition duration-300 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              {...({} )}
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
          {...({} )}
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
              {...({} )}
              type="text"
              className="w-1/2 text-gray-700 rounded-lg border-gray-300"
              onClick={() => setRenameModal(false)}
            >
              Cancel
            </Button>
            <Button
              {...({} )}
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
          {...({} )}
          placeholder="Enter new title for the vacancy"
          value={newVacancyTitle}
          onChange={(e) => setNewVacancyTitle(e)}
          className="mt-4 rounded-lg"
          style={{ borderColor: "#D0D5DD", borderWidth: "1px" }}
        />
      </Modal>

      {addNew === "scratch" && (
        <FromScratchModal onClose={() => setAddNew(null)}  ongoBack={( ) => { setAddNew(null) ; setAddNewModal(true)}} onRefresh={handleRefreshAfterVacancyCreation}/>
      )}
      {addNew === "url" && (
        queryParams?.get('debug') === 'true' 
          ? <PasteUrlModalExperimental onClose={() => setAddNew(null)}  />
          : <PasteUrlModal onClose={() => setAddNew(null)} ongoBack={( ) => { setAddNew(null) ; setAddNewModal(true)}} onRefresh={handleRefreshAfterVacancyCreation} />
      )}
      {addNew === "job-description" && (
        <JobDescriptionModal onClose={() => setAddNew(null)} ongoBack={( ) => { setAddNew(null) ; setAddNewModal(true)}} onRefresh={handleRefreshAfterVacancyCreation} />
      )}

      <UpgradeModal
        open={upgradeModalVisible}
        onClose={() => setUpgradeModalVisible(false)}
        currentTier={tier.name}
        requiredTier={upgradeNeeded?.name || 'a higher tier'}
        feature="vacancy"
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
hoursUnit: { type: String, default: "Hours" },
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
