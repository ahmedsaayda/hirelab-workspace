import {
  Button,
  Input,
  Modal,
  Progress,
  Switch,
  message as antdmessage,
  Select,
  DatePicker,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DotIcon } from "../Vacancies/components/Icons";
import { DemoDualAxes } from "./DemoDualAxes";

import moment from "moment";
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";
import { selectDarkMode, selectUser } from "../../../redux/auth/selectors";
import VacanciesCard from "../Vacancies/components/components/VacanciesCard";
import UserService from "../../../services/UserService";
import CrudService from "../../../services/CrudService";
import ATSService from "../../../services/ATSService";
import { Heading } from "../Vacancies/components/components";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "../Vacancies/components/Skeleton/VacancyCard";
import { useRouter } from "next/router";
import { formatAvgTime } from "../../../utils/timeFormat";
import { Eye, Clock, Users, TrendingUp, ChevronRight, Filter, Briefcase, Sparkles } from "lucide-react";
const steps = [
  {
    name: "Brand Assets",
    href: "/onboarding",
    active: true,
  },
  {
    name: "Recruiter Details",
    href: "/onboarding/2",
    active: false,
  },
  {
    name: "Hiring Location",
    href: "/onboarding/4",
    active: false,
  },
  {
    name: "Create Funnel",
    active: true,
    href: "/dashboard/campaigns",
  },
];

// Modern summary cards configuration
const summaryCardsConfig = [
  {
    key: "visits",
    name: "Page Visits",
    subtitle: "Consideration",
    icon: Eye,
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    borderColor: "border-rose-100",
    textColor: "text-rose-600",
    iconBg: "bg-rose-100",
    metric: "visits",
  },
  {
    key: "engagement",
    name: "Avg. Time on Site",
    subtitle: "Engagement",
    icon: Clock,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    borderColor: "border-violet-100",
    textColor: "text-violet-600",
    iconBg: "bg-violet-100",
    metric: "avgTimeSpent",
  },
  {
    key: "candidates",
    name: "Candidates",
    subtitle: "Hiring Pipeline",
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    metric: "newApplicants",
  },
];

const totalSummary = [
  {
    name: "Consideration",
    color: "rgba(247, 86, 86, 1)",
    iconBackground: "#FFE2E5",
    icon: <Eye className="w-4 h-4 text-rose-500" />,
    metrics: [{ title: "Visits", value: 35 }],
  },
  {
    name: "Engagement",
    color: "rgba(127, 86, 217, 1)",
    iconBackground: "#F7F5FD",
    icon: <Clock className="w-4 h-4 text-violet-500" />,
    metrics: [{ title: "Avg time on site", value: "25min" }],
  },
  {
    name: "Hiring pipeline",
    color: "rgba(10, 143, 99, 1)",
    iconBackground: "rgba(226, 251, 243, 1)",
    icon: <Users className="w-4 h-4 text-emerald-500" />,
    metrics: [{ title: "Candidates", value: 45 }],
  },
];

const positions = [
  {
    title: "React Native",
    applicantsCount: 293,
    color: "rgba(14, 135, 254, 1)",
    background: "#EFF8FF",
  },
  {
    title: "UI/UX Designer",
    applicantsCount: 293,
    color: "rgba(247, 86, 86, 1)",
    background: "#FFE2E5",
  },
  {
    title: "React Native",
    applicantsCount: 293,
    color: "rgba(127, 86, 217, 1)",
    background: "#F7F5FD",
  },
];

const grayIndicatorStyling = {
  fontSize: 12,
  paddingInline: 8,
  background: "#F9FAFB",
  border: "1px solid #EAECF0",
  borderRadius: 16,
  display: "flex",
  justifyContent: "center",
  fontWeight: 500,
};

const Overview = () => {
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  const [landingPages, setLandingPages] = useState([]);
  const [showAllActive, setShowAllActive] = useState(false);
  const [showAllUnpublished, setShowAllUnpublished] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [loadingVacancy, setLoadingVacancy] = useState(false);
  const [newVacancyTitle, setNewVacancyTitle] = useState("");
  const [analyticsData, setAnalyticsData] = useState({
    totalVisits: 0,
    totalTimeSpent: 0,
    avgTimeSpent: '0min',
    newApplicants: 0
  });

  console.log('analyticsData ', analyticsData);

  // Filter states
  const [filterVacancy, setFilterVacancy] = useState('all');
  const [filterTimeFrame, setFilterTimeFrame] = useState('all'); // 'all', '30days', '7days'
  const [availableVacancies, setAvailableVacancies] = useState([]);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const router = useRouter();;

  const getData = async () => {
    try {
      setLoadingVacancy(true);

      // Fetch all dashboard data from the backend with server-side filtering
      // Check if user is in workspace session
      const isWorkspaceSession = user?.isWorkspaceSession && user?.workspaceId;
      const response = await UserService.getDashboardAnalytics(
        filterVacancy,
        filterTimeFrame,
        isWorkspaceSession ? user.workspaceId : null
      );
      const {
        analyticsData,
        activeVacancies,
        unpublishedVacancies,
        availableVacancies
      } = response.data;

      setShowAllActive(false);
      // Set all the state with the data from backend
      setAnalyticsData(analyticsData);
      setAvailableVacancies(availableVacancies);

      // Combine active and unpublished vacancies for the main list
      const allVacancies = [...activeVacancies, ...unpublishedVacancies];
      setLandingPages(allVacancies);

      console.log('✅ Dashboard data loaded successfully:', {
        totalVacancies: allVacancies.length,
        activeCount: activeVacancies.length,
        unpublishedCount: unpublishedVacancies.length,
        analyticsData
      });

    } catch (error) {
      console.log("Error getting dashboard data", error);
      // Set fallback data in case of error
      setAnalyticsData({
        totalVisits: 0,
        totalTimeSpent: 0,
        avgTimeSpent: '0s',
        newApplicants: 0
      });
      setLandingPages([]);
      setAvailableVacancies([]);
    } finally {
      setLoadingVacancy(false);
    }


  }

  useEffect(() => {
    getData()
  }, [showAllActive, showAllUnpublished, filterVacancy, filterTimeFrame])

  const activeVacancies = landingPages.filter((d) => d.published);
  const unpublishedVacancies = landingPages.filter((d) => !d.published);


  console.log('activeVacancies ', activeVacancies);
  console.log('unpublishedVacancies ', unpublishedVacancies);



  const onRename = (landingPage) => {
    setSelectedVacancy(landingPage);
    setNewVacancyTitle(landingPage.vacancyTitle); // Ensure this is a string
    setRenameModal(true);
  };

  const handleRename = async () => {
    if (!newVacancyTitle.trim()) {
      antdmessage.info("Please enter a new title");
      return;
    }

    try {
      await CrudService.update("LandingPageData", selectedVacancy._id, {
        vacancyTitle: newVacancyTitle,
      });
      antdmessage.success("Vacancy renamed successfully");
      setRenameModal(false);
      await getData();
    } catch (error) {
      console.error("Error renaming vacancy:", error);
      antdmessage.error("Failed to rename vacancy. Please try again.");
    }
  };

  const onDuplicate = async (landingPage) => {
    try {
      const res = await ATSService.duplicateLandingPage({
        landingPageId: landingPage._id,
      });

      antdmessage.success("Vacancy duplicated successfully");

      // Refresh dashboard data
      await getData();

      // Navigate to editor for the new copy
      const newId = res?.data?.landingPage?._id;
      if (newId) {
        router.push(`/edit-page/${newId}`);
      }
    } catch (error) {
      console.error("Error duplicating vacancy from overview:", error);
      antdmessage.error(
        error?.response?.data?.message ||
        "Failed to duplicate vacancy. Please try again."
      );
    }
  };
  const handlePublishedClick = () => {
    router.push('/dashboard/campaigns?status=published');
  };

  const handleUnpublishedClick = () => {
    router.push('/dashboard/campaigns?status=unpublished');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Section */}
      <div>
        {/* Header with Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Total Summary
            </h2>
            {(filterVacancy !== 'all' || filterTimeFrame !== 'all') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-700 bg-violet-100 rounded-full">
                <Filter className="w-3 h-3" />
                Filtered
              </span>
            )}
          </div>

          {/* Modern Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <Select
                value={filterVacancy}
                onChange={setFilterVacancy}
                size="small"
                bordered={false}
                className="min-w-[140px]"
                dropdownStyle={{ borderRadius: 12 }}
                placeholder="All Vacancies"
              >
                <Select.Option value="all">All Vacancies</Select.Option>
                {availableVacancies.map(vacancy => (
                  <Select.Option key={vacancy.value} value={vacancy.value}>
                    {vacancy.label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200">
              <Clock className="w-4 h-4 text-gray-400" />
              <Select
                value={filterTimeFrame}
                onChange={setFilterTimeFrame}
                size="small"
                bordered={false}
                className="min-w-[100px]"
                dropdownStyle={{ borderRadius: 12 }}
              >
                <Select.Option value="all">All Time</Select.Option>
                <Select.Option value="30days">30 Days</Select.Option>
                <Select.Option value="7days">7 Days</Select.Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Modern Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryCardsConfig.map((card, index) => {
            const IconComponent = card.icon;
            let value;
            switch (card.metric) {
              case "visits":
                value = analyticsData.totalVisits;
                break;
              case "avgTimeSpent":
                value = analyticsData.avgTimeSpent;
                break;
              case "newApplicants":
                value = analyticsData.newApplicants;
                break;
              default:
                value = 0;
            }

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default`}
              >
                {/* Decorative gradient orb */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.iconBg}`}>
                      <IconComponent className={`w-5 h-5 ${card.textColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${card.textColor} bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">{card.subtitle}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    <p className={`text-sm font-semibold ${card.textColor}`}>{card.name}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="hidden">
        <div className="flex flex-col md:flex-row gap-[12px]">
          <div
            className={`overflow-auto bg-white rounded-lg cursor-default dark:bg-black px-[16px] py-[24px] w-[250px] md:w-[360px]`}
          >
            <div className="flex flex-col gap-[18px]">
              <div className="text-sm font-bold">Applicants Goal</div>
              <div>
                <DemoDualAxes
                  data={[
                    { time: "Jan", value: 10, type: "Goal" },
                    { time: "Mar", value: 20, type: "Goal" },
                    { time: "Apr", value: 40, type: "Goal" },
                    { time: "Jun", value: 50, type: "Goal" },
                    { time: "Jul", value: 20, type: "Goal" },
                    { time: "Jan", value: 20, type: "Result" },
                    { time: "Mar", value: 30, type: "Result" },
                    { time: "Apr", value: 20, type: "Result" },
                    { time: "Jun", value: 10, type: "Result" },
                    { time: "Jul", value: 10, type: "Result" },
                  ]}
                  range={[
                    "rgba(14, 135, 254, 0.87)",
                    "rgba(14, 135, 254, 0.30)",
                  ]}
                />
              </div>
            </div>
          </div>
          <div
            className={`overflow-auto bg-white rounded-lg cursor-default dark:bg-black px-[16px] py-[24px] w-[250px] md:w-[360px]`}
          >
            <div className="flex flex-col gap-[18px]">
              <div className="text-sm font-bold">Hiring Goal</div>
              <div>
                <DemoDualAxes
                  data={[
                    { time: "Jan", value: 10, type: "Goal" },
                    { time: "Mar", value: 20, type: "Goal" },
                    { time: "Apr", value: 40, type: "Goal" },
                    { time: "Jun", value: 50, type: "Goal" },
                    { time: "Jul", value: 20, type: "Goal" },
                  ]}
                  range={["rgba(247, 86, 86, 0.87)", "rgba(247, 86, 86, 0.30)"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <div className="flex flex-col md:flex-row gap-[24px]">
          {positions.map((position, i) => (
            <div
              key={i}
              className={`flex flex-col bg-white rounded-lg cursor-default dark:bg-black px-[24px] py-[20px] w-[226px] gap-[16px]`}
            >
              <ConfigProvider
                theme={{
                  token: { colorPrimary: position.color },
                  algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-[4px]">
                    <div className="text-sm font-normal text-[#475467] dark:text-gray-300">
                      Position
                    </div>
                    <div key={i} className="flex justify-between items-center">
                      <div className="text-sm font-bold">{position.title}</div>
                    </div>
                  </div>
                  <div>
                    <Switch defaultChecked defaul="red" />
                  </div>
                </div>
                <div>
                  <div
                    className="flex flex-shrink items-center gap-1 px-[8px] py-[2px] rounded-xl "
                    style={{
                      color: position.color,
                      background: position.background,
                      width: "fit-content",
                    }}
                  >
                    <div className="font-semibold">
                      {position.applicantsCount} applicants
                    </div>
                  </div>
                </div>
              </ConfigProvider>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden">
        <div className="bg-white dark:bg-black rounded-lg px-[24px] py-[20px] flex flex-col md:flex-row gap-[24px]">
          <Progress
            percent={90}
            success={{ percent: 30 }}
            format={() => (
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px" }}
                >
                  512
                </div>
                <div
                  style={{ fontSize: 12, fontWeight: 400, lineHeight: "20px" }}
                >
                  Vacancies
                </div>
              </div>
            )}
            type="dashboard"
          />
          <div className="w-[200px] md:w-[260px] flex flex-col gap-[16px]">
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Mobile
              </div>
              <Progress
                percent={30}
                format={() => <div style={grayIndicatorStyling}>512</div>}
              />
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Tablet
              </div>
              <Progress
                percent={30}
                format={() => <div style={grayIndicatorStyling}>512</div>}
              />
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Tablet
              </div>
              <Progress
                percent={30}
                format={() => <div style={grayIndicatorStyling}>512</div>}
              />
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Desktop
              </div>
              <Progress
                percent={30}
                format={() => <div style={grayIndicatorStyling}>512</div>}
              />
            </div>
          </div>
          <div className="w-[200px] md:w-[260px] flex flex-col gap-[16px]">
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Facebook
              </div>
              <Progress percent={30} format={() => <></>} />
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Instagram
              </div>
              <Progress percent={30} format={() => <></>} />
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                LinkedIn
              </div>
              <Progress percent={30} format={() => <></>} />
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[70px]" style={{ fontSize: 14 }}>
                Website
              </div>
              <Progress percent={30} format={() => <></>} />
            </div>
          </div>
        </div>
      </div>

      {/* Vacancies Sections */}
      <div className="space-y-8">
        {/* Active Vacancies Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Active Vacancies
                </h2>
                {activeVacancies.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {activeVacancies.length} {activeVacancies.length === 1 ? 'campaign' : 'campaigns'} live
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                handlePublishedClick();
                setShowAllActive(true);
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors group"
            >
              See all active vacancies
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${showAllActive ? "max-h-[60vh] overflow-y-auto pr-2" : ""}`}>
            <AnimatePresence mode="wait">
              {(showAllActive ? activeVacancies : activeVacancies.slice(0, 3)).map((d, index) => (
                <motion.div
                  key={"vacancies_active_" + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <VacanciesCard
                    {...d}
                    record={d}
                    fetchData={getData}
                    onRename={() => onRename(d)}
                    onDuplicate={() => onDuplicate(d)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loadingVacancy && (
              <>
                {new Array(3).fill(0).map((x, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start w-full gap-4 px-6 py-5 bg-white rounded-2xl border border-gray-100 min-h-[320px] animate-pulse"
                  >
                    <SkeletonLoader />
                  </div>
                ))}
              </>
            )}

            {!loadingVacancy && activeVacancies.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No active vacancies</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Create a new campaign to start attracting candidates to your open positions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Unpublished Vacancies Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Unpublished Vacancies
                </h2>
                {unpublishedVacancies.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {unpublishedVacancies.length} {unpublishedVacancies.length === 1 ? 'draft' : 'drafts'} waiting
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                handleUnpublishedClick();
                setShowAllUnpublished(true);
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors group"
            >
              See all unpublished vacancies
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${showAllUnpublished ? "max-h-[60vh] overflow-y-auto pr-2" : ""}`}>
            <AnimatePresence mode="wait">
              {(showAllUnpublished ? unpublishedVacancies : unpublishedVacancies.slice(0, 3)).map((d, index) => (
                <motion.div
                  key={"vacancies_unpublished_" + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <VacanciesCard
                    {...d}
                    record={d}
                    fetchData={getData}
                    onRename={() => onRename(d)}
                    onDuplicate={() => onDuplicate(d)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {loadingVacancy && (
              <>
                {new Array(3).fill(0).map((x, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start w-full gap-4 px-6 py-5 bg-white rounded-2xl border border-gray-100 min-h-[240px] animate-pulse"
                  >
                    <SkeletonLoader />
                  </div>
                ))}
              </>
            )}

            {!loadingVacancy && unpublishedVacancies.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No drafts</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  All your campaigns are either published or you haven't created any yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={renameModal}
        onCancel={() => setRenameModal(false)}
        onOk={handleRename}
        okText="Rename"
        title={null}
        closable={false}
        centered
        width={420}
        footer={null}
        className="rounded-2xl overflow-hidden"
      >
        <div className="p-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-100 rounded-xl">
              <Briefcase className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Rename Campaign</h3>
              <p className="text-sm text-gray-500">Update the title for this vacancy</p>
            </div>
          </div>
          
          <Input
            placeholder="Enter new title for the vacancy"
            value={newVacancyTitle}
            onChange={(e) => setNewVacancyTitle(e.target.value)}
            className="h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
            style={{ fontSize: '15px' }}
          />

          <div className="flex gap-3 mt-6">
            <Button 
              className="flex-1 h-11 rounded-xl border-gray-200 text-gray-700 font-medium hover:bg-gray-50" 
              onClick={() => setRenameModal(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-11 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 border-0" 
              type="primary" 
              onClick={handleRename}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>




    </div>
  );
};

export default Overview;
