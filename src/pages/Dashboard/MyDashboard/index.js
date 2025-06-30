import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import CalendarRangePicker from "./CalendarRangePicker.js";
import Overview from "./Overview.js";
import Reports from "./Reports.js";
import { InviteModal } from "../../onboarding/components/invite-modal.jsx";
import { Button, Heading, Img } from "../Vacancies/components/components/index.jsx";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import UpgradeModal from "../Vacancies/components/UpgradeModal.jsx";
import { selectUser } from "../../../redux/auth/selectors.js";

const calendarEvents = [
  {
    title: "Agenda Title",
    start: "08:00",
    end: "08:30",
    background: "#EFF8FF",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
          fill="#0E87FE"
        />
      </svg>
    ),
  },
  {
    title: "Title for the Agenda",
    start: "08:00",
    end: "08:30",
    background: "#FFE2E5",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.78531C3.75416 3.78531 2.82486 4.71462 2.82486 5.85687C2.82486 6.99913 3.75417 7.92843 4.89642 7.92843C6.03868 7.92843 6.96798 6.99912 6.96798 5.85687C6.96798 4.71461 6.03867 3.78531 4.89642 3.78531ZM4.89642 0.960449C7.60064 0.960449 9.79284 3.15266 9.79284 5.85687C9.79284 8.56109 7.60063 10.7533 4.89642 10.7533C2.19221 10.7533 0 8.56108 0 5.85687C0 3.15266 2.19221 0.960449 4.89642 0.960449Z"
          fill="#F75656"
        />
      </svg>
    ),
  },
  {
    title: "Agenda",
    start: "08:00",
    end: "08:30",
    background: "#EFF8FF",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
          fill="#0E87FE"
        />
      </svg>
    ),
  },
  {
    title: "Agenda",
    start: "08:00",
    end: "08:30",
    background: "#EFF8FF",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
          fill="#0E87FE"
        />
      </svg>
    ),
  },
  {
    title: "Agenda",
    start: "08:00",
    end: "08:30",
    background: "#EFF8FF",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
          fill="#0E87FE"
        />
      </svg>
    ),
  },
  {
    title: "Agenda",
    start: "08:00",
    end: "08:30",
    background: "#EFF8FF",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
          fill="#0E87FE"
        />
      </svg>
    ),
  },
  {
    title: "Agenda",
    start: "08:00",
    end: "08:30",
    background: "#EFF8FF",
    dot: (
      <svg
        width={10}
        height={11}
        viewBox="0 0 10 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vertical container"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
          fill="#0E87FE"
        />
      </svg>
    ),
  },
];

const MyDashboard = () => {
  const items = [
    {
      key: "1",
      label: "Overview",
      children: <Overview />,
    },
    {
      key: "2",
      label: "Reports",
      children: <Reports />,
    },
  ];
  const [activeKey, setActiveKey] = useState("1");
  const [showInviteModal, setShowInviteModal] = useState(true);
  const router = useRouter();
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const user = useSelector(selectUser);
  const landingPageNum = user?.landingPageNum || 0;
  const tier = user?.tier || { id: 'free', name: 'Free Forever', maxFunnels: 1 };
  const upgradeNeeded = user?.upgradeNeeded;

  useEffect(() => {
    var aTags = document.getElementsByTagName("div");
    var searchText = "MUI X Missing license key";
    var found;

    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent == searchText) {
        found = aTags[i];
        found.style = "display: none;";
        break;
      }
    }
  }, []);

  const handleTabChange = (key) => {
    setActiveKey(key);
    if (key === "2") {
      setShowInviteModal(false);
    } else {
      setShowInviteModal(true);
    }
  };

  const handleCreateNewVacancy = () => {

    router.push("/dashboard/vacancies?new=true");
    return
    // Check if user has reached their funnel limit
    if (tier.maxFunnels !== null && landingPageNum >= tier.maxFunnels) {
      setUpgradeModalVisible(true);
    } else {
      router.push("/dashboard/vacancies?new=true");
    }
  };

  return (
    <div className="flex flex-col 2xl:flex-row gap-[10px]">
      <div className="ml-[10px] w-full rounded-xl bg-white p-[24px] pr-2  2xl:w-2/3 flex flex-col gap-[24px] pt-0">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full mt-4">
          <Heading size="11xl" as="h1" className="!text-gray-900">
            Dashboard
          </Heading>
          <div className="justify-end flex flex-col md:flex-row items-center gap-4 w-full mt-4">
            {showInviteModal && (
              <>
                <Button
                  shape="round"
                  onClick={handleCreateNewVacancy}
                  size="3xl"
                  leftIcon={
                    <Img
                      src="/images/img_plus_white_a700.svg"
                      alt="text input"
                      className="h-[20px] w-[20px]"
                    />
                  }
                  className="min-w-[225px] gap-1.5 font-semibold bg-[#0E87FE] text-white px-[4px]"
                >
                  Create a New Vacancy
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} />
      </div>

      <div className=" w-full 2xl:w-1/3 flex flex-col gap-[32px]  bg-white dark:bg-black px-[10px] py-[24px] rounded-xl overflow-auto ">
        <CalendarRangePicker />
        {calendarEvents.map((calEvent, i) => (
          <div
            key={i}
            className="flex flex-col gap-[8px] p-[16px] rounded-lg"
            style={{ background: calEvent.background, width: "100%" }}
          >
            <div className="flex items-center gap-[7px]">
              {calEvent.dot && calEvent.dot}
              <div className="text-md" style={{ fontSize: 13 }}>
                {calEvent.start} - {calEvent.end}
              </div>
            </div>

            <div className="text-md font-bold">{calEvent.title}</div>
          </div>
        ))}
      </div>

      <UpgradeModal
        open={upgradeModalVisible}
        onClose={() => setUpgradeModalVisible(false)}
        currentTier={tier.name}
        requiredTier={upgradeNeeded?.name || 'a higher tier'}
        feature="vacancy"
      />
    </div>
  );
};

export default MyDashboard;
