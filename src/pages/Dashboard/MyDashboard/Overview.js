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
import { motion } from "framer-motion";
// hirelab-frontend\src\components\Skeleton\VacancyCard.js
// hirelab-frontend\src\pages\Dashboard\MyDashboard\Overview.js
import SkeletonLoader from "../Vacancies/components/Skeleton/VacancyCard";
import { useRouter } from "next/router";
import { formatAvgTime } from "../../../utils/timeFormat";
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

const totalSummary = [
  /*   {
      name: "Awareness",
      color: "rgba(14, 135, 254, 1)",
      iconBackground: "#EFF8FF",
      icon: (
        <svg
          width={16}
          height={17}
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="briefcase-01">
            <path
              id="Icon"
              d="M10.6663 4.86686C10.6663 4.24688 10.6663 3.93689 10.5982 3.68256C10.4133 2.99237 9.87416 2.45328 9.18398 2.26834C8.92965 2.2002 8.61966 2.2002 7.99967 2.2002C7.37969 2.2002 7.0697 2.2002 6.81537 2.26834C6.12519 2.45328 5.58609 2.99237 5.40116 3.68256C5.33301 3.93689 5.33301 4.24688 5.33301 4.86686M3.46634 14.2002H12.533C13.2797 14.2002 13.6531 14.2002 13.9383 14.0549C14.1892 13.927 14.3932 13.7231 14.521 13.4722C14.6663 13.187 14.6663 12.8136 14.6663 12.0669V7.0002C14.6663 6.25346 14.6663 5.88009 14.521 5.59487C14.3932 5.34399 14.1892 5.14002 13.9383 5.01219C13.6531 4.86686 13.2797 4.86686 12.533 4.86686H3.46634C2.7196 4.86686 2.34624 4.86686 2.06102 5.01219C1.81014 5.14002 1.60616 5.34399 1.47833 5.59487C1.33301 5.88009 1.33301 6.25346 1.33301 7.0002V12.0669C1.33301 12.8136 1.33301 13.187 1.47833 13.4722C1.60616 13.7231 1.81014 13.927 2.06102 14.0549C2.34624 14.2002 2.7196 14.2002 3.46634 14.2002Z"
              stroke="#5207CD"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      ),
      metrics: [{ title: "Reach", value: 25 }],
    }, */
  {
    name: "Consideration",
    color: "rgba(247, 86, 86, 1)",
    iconBackground: "#FFE2E5",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="users-01">
          <path
            id="Icon"
            d="M14.6663 14V12.6667C14.6663 11.4241 13.8165 10.38 12.6663 10.084M10.333 2.19384C11.3103 2.58943 11.9997 3.54754 11.9997 4.66667C11.9997 5.78579 11.3103 6.7439 10.333 7.13949M11.333 14C11.333 12.7575 11.333 12.1362 11.13 11.6462C10.8594 10.9928 10.3402 10.4736 9.68683 10.203C9.19677 10 8.57552 10 7.33301 10H5.33301C4.0905 10 3.46924 10 2.97919 10.203C2.32578 10.4736 1.80665 10.9928 1.536 11.6462C1.33301 12.1362 1.33301 12.7575 1.33301 14M8.99967 4.66667C8.99967 6.13943 7.80577 7.33333 6.33301 7.33333C4.86025 7.33333 3.66634 6.13943 3.66634 4.66667C3.66634 3.19391 4.86025 2 6.33301 2C7.80577 2 8.99967 3.19391 8.99967 4.66667Z"
            stroke="#F75656"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    ),
    metrics: [{ title: "Visits", value: 35 }],
  },
  {
    name: "Engagement",
    color: "rgba(127, 86, 217, 1)",
    iconBackground: "#F7F5FD",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="clock" clipPath="url(#clip0_235_11033)">
          <path
            id="Icon"
            d="M7.99967 4.00016V8.00016L10.6663 9.3335M14.6663 8.00016C14.6663 11.6821 11.6816 14.6668 7.99967 14.6668C4.31778 14.6668 1.33301 11.6821 1.33301 8.00016C1.33301 4.31826 4.31778 1.3335 7.99967 1.3335C11.6816 1.3335 14.6663 4.31826 14.6663 8.00016Z"
            stroke="#7F56D9"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_235_11033">
            <rect width={16} height={16} fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    metrics: [{ title: "Avg time on site", value: "25min" }],
  },
  {
    name: "Hiring pipeline",
    color: "rgba(10, 143, 99, 1)",
    iconBackground: "rgba(226, 251, 243, 1)",
    icon: (
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="file-06">
          <path
            id="Icon"
            d="M9.33366 1.51318V4.26688C9.33366 4.64025 9.33366 4.82693 9.40632 4.96954C9.47024 5.09498 9.57222 5.19697 9.69766 5.26088C9.84027 5.33354 10.027 5.33354 10.4003 5.33354H13.154M10.667 8.66683H5.33366M10.667 11.3335H5.33366M6.66699 6.00016H5.33366M9.33366 1.3335H5.86699C4.74689 1.3335 4.18683 1.3335 3.75901 1.55148C3.38269 1.74323 3.07673 2.04919 2.88498 2.42552C2.66699 2.85334 2.66699 3.41339 2.66699 4.5335V11.4668C2.66699 12.5869 2.66699 13.147 2.88498 13.5748C3.07673 13.9511 3.38269 14.2571 3.75901 14.4488C4.18683 14.6668 4.74689 14.6668 5.86699 14.6668H10.1337C11.2538 14.6668 11.8138 14.6668 12.2416 14.4488C12.618 14.2571 12.9239 13.9511 13.1157 13.5748C13.3337 13.147 13.3337 12.5869 13.3337 11.4668V5.3335L9.33366 1.3335Z"
            stroke="#0A8F63"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    ),
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
    <div className="flex flex-col gap-[24px]">
      <div>
        <div className="hidden text-xl font-semibold leading-8 mb-[12px]">
          Let's get started...
        </div>
        <div className="grid hidden grid-cols-2 gap-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {steps.map((step, i) => (
            <a
              href={step.href}
              key={i}
              className={`${step.active
                ? "bg-[#5207CD] text-white cursor-pointer"
                : "bg-white dark:bg-black cursor-default"
                } px-[16px] py-[10px] rounded-lg w-[auto]`}
            >
              <div className="flex flex-col gap-[8px]">
                <div
                  className="flex flex-shrink items-center gap-1 px-[8px] py-[2px] rounded-xl bg-[#EFF8FF] "
                  style={{
                    width: "fit-content",
                  }}
                >
                  <DotIcon />
                  <div className="text-[#5207CD] font-semibold">
                    Step {i + 1}
                  </div>
                </div>
                <div className="text-sm font-semibold">{step.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-[12px]">
          <div className="flex gap-2 items-center">
            <div className="text-xl font-semibold leading-8">
              Total summary
            </div>
            {(filterVacancy !== 'all' || filterTimeFrame !== 'all') && (
              <div className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                Filtered
              </div>
            )}
          </div>

          {/* Compact Filter Controls */}
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Vacancy:</span>
              <Select
                value={filterVacancy}
                onChange={setFilterVacancy}
                size="small"
                style={{ width: 160 }}
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

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Period:</span>
              <Select
                value={filterTimeFrame}
                onChange={setFilterTimeFrame}
                size="small"
                style={{ width: 120 }}
              >
                <Select.Option value="all">All Time</Select.Option>
                <Select.Option value="30days">30 Days</Select.Option>
                <Select.Option value="7days">7 Days</Select.Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full md:grid-cols-3 lg:grid-cols-3 gmx:flex gmx:gap-2 gmx:w-full gmx:max-w-screen gmx:overflow-x-auto">
          {totalSummary.map((step, i) => {
            // Determine if this card should show "coming soon"
            const isComingSoon = step.name === "Awareness"; // Only Awareness is coming soon now

            // Get dynamic values based on card type
            let dynamicValue = step.metrics[0].value;
            if (!isComingSoon) {
              switch (step.name) {
                case "Consideration":
                  dynamicValue = analyticsData.totalVisits;
                  break;
                case "Engagement":
                  dynamicValue = analyticsData.avgTimeSpent;
                  break;
                case "Hiring pipeline":
                  dynamicValue = analyticsData.newApplicants;
                  break;
                default:
                  break;
              }
            }

            return (
              <div
                key={i}
                className={`bg-white gmx:flex-1 gmx:min-w-[180px] dark:bg-black cursor-default px-[12px] py-[20px] rounded-lg w-auto shadow-lg ${isComingSoon ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col gap-[12px] ">
                  <div
                    style={{
                      background: step.iconBackground,
                      display: "inline-block",
                      padding: 8,
                      borderRadius: "100%",
                      width: "fit-content",
                    }}
                  >
                    {step.icon && step.icon}
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <div className="text-sm font-normal text-[#475467] dark:text-gray-300">
                      {step.name}
                    </div>
                    {isComingSoon ? (
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold">Coming Soon</div>
                        <div className="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded dark:bg-gray-700">
                          Soon
                        </div>
                      </div>
                    ) : (
                      step.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex justify-between items-center">
                          <div className="text-sm font-bold">{metric.title}</div>
                          <div
                            className="text-sm font-semibold"
                            style={{ color: step.color }}
                          >
                            {dynamicValue}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
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

      <div>
        {/* Active Vacancies Section */}
        <div>
          {(
            <div className="flex justify-between items-center px-2 pt-4 ps-0">
              <Heading size="5xl" as="p" className="!text-gray-900   ">Active vacancies {activeVacancies.length > 0 && <span className="text-gray-600 text-[10px]">{`(${activeVacancies.length})`}</span>}</Heading>
              <span
                className="text-blue-400 underline cursor-pointer"
                onClick={() => {
                  handlePublishedClick()
                  setShowAllActive(true)
                }}
              >
                See all active vacancies
              </span>
            </div>
          )}
          <div className={`grid justify-center grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3  ${showAllActive ? "h-[50vh]" : "h-fit"}  p-2 overflow-x-hidden`}>
            {(showAllActive ? activeVacancies : activeVacancies.slice(0, 3)).map((d, index) => (
              <VacanciesCard
                {...d}
                key={"vacancies_active_" + index}
                record={d}
                fetchData={getData}
                onRename={() => onRename(d)}
                onDuplicate={() => onDuplicate(d)}
              />
            ))}
            {loadingVacancy && (
              <>
                {new Array(3).fill(0).map((x, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start w-full gap-4 px-6 py-5 sm:px-5 bg-white-A700 rounded-[12px] min-w-[350px] min-h-[341px]"
                  > <SkeletonLoader /> </div>
                ))}
              </>
            )}
          </div>

        </div>

        {/* Unpublished Vacancies Section */}
        <div>
          {(
            <div className="flex justify-between items-center px-2 pt-4 ps-0">
              <Heading size="5xl" as="p" className="text-gray-900">
                Unpublished vacancies {unpublishedVacancies.length > 0 && <span className="text-gray-600 text-[10px]">{`(${unpublishedVacancies.length})`}</span>}
              </Heading>
              <span
                className="text-blue-400 underline cursor-pointer"
                onClick={() => {
                  handleUnpublishedClick()
                  setShowAllUnpublished(true)
                }}
              >
                See all unpublished vacancies
              </span>
            </div>
          )}
          <div className={`grid justify-center grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 p-2  overflow-x-hidden  ${showAllUnpublished ? "h-[50vh]" : "h-fit"} `}>
            {(showAllUnpublished ? unpublishedVacancies : unpublishedVacancies.slice(0, 3)).map((d, index) => (
              <VacanciesCard
                {...d}
                key={"vacancies_unpublished_" + index}
                record={d}
                fetchData={getData}
                onRename={() => onRename(d)}
                onDuplicate={() => onDuplicate(d)}

              />
            ))}
            {loadingVacancy && (
              <>
                {new Array(3).fill(0).map((x, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start w-full gap-4 px-6 py-5 sm:px-5 bg-white-A700 rounded-[12px] min-w-[350px] min-h-[241px]"
                  > <SkeletonLoader /> </div>
                ))}
              </>
            )}
          </div>

        </div>
      </div>

      <Modal
        open={renameModal}
        onCancel={() => setRenameModal(false)}
        onOk={handleRename}
        okText="Rename"
        title="Rename Vacancy"
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <Button type="text" className="w-1/2 text-gray-700 border-gray-300" onClick={() => setRenameModal(false)}>Cancel</Button>
            <Button className="w-1/2 custom-button" type="primary" onClick={handleRename}>Rename</Button>
          </div>
        }
      >
        <Input
          placeholder="Enter new title for the vacancy"
          value={newVacancyTitle}
          onChange={(e) => setNewVacancyTitle(e.target.value)}
          className="mt-4 rounded-lg"
          style={{ borderColor: '#D0D5DD', borderWidth: '1px' }}
        />
      </Modal>




    </div>
  );
};

export default Overview;
