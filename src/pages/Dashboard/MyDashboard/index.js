import { Tabs, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CalendarRangePicker from "./CalendarRangePicker.js";
import Overview from "./Overview.js";
import Reports from "./Reports.js";
import { InviteModal } from "../../onboarding/components/invite-modal.jsx";
import { Button, Heading, Img } from "../Vacancies/components/components/index.jsx";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import UpgradeModal from "../Vacancies/components/UpgradeModal.jsx";
import { selectUser } from "../../../redux/auth/selectors.js";
import AuthService from "../../../services/AuthService";
import { CrownOutlined, PlusOutlined } from "@ant-design/icons";
import { refreshUserData } from "../../../utils/userRefresh.js";
import { useWorkspace } from "../../../contexts/WorkspaceContext";
import { HelpCircle } from "lucide-react";
import CandidateChatService from "../../../services/CandidateChatService.js";
import moment from "moment";

// Helper to normalize to date key (YYYY-MM-DD) in local time
const toDateKey = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

const MyDashboard = () => {
  const items = [
    {
      key: "1",
      label: "Overview",
      children: <Overview />,
    },
    /*    {
         key: "2",
         label: "Reports",
         children: <Reports />,
       }, */
  ];
  const [activeKey, setActiveKey] = useState("1");
  const [showInviteModal, setShowInviteModal] = useState(true);
  const router = useRouter();
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const user = useSelector(selectUser);
  const { getWorkspaceFunnelUsage, currentWorkspace } = useWorkspace();
  const [funnelUsage, setFunnelUsage] = useState(null);
  const tier = user?.tier || { id: 'free', name: 'Free Forever', maxFunnels: 1 };
  const upgradeNeeded = user?.upgradeNeeded;

  // Interview calendar state
  const [interviewEvents, setInterviewEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Add effect to check for subscription changes
  useEffect(() => {
    refreshUserData();
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

  // Enhanced logging for debugging plan limits
  useEffect(() => {
    if (user) {
      console.log('Dashboard - User plan data:', {
        tier: user.tier,
        usage: user.usage,
        upgradeNeeded: user.upgradeNeeded,
        landingPageNum: user.landingPageNum,
        funnelUsage: funnelUsage,
        plans: user.plans
      });
    }
  }, [user, funnelUsage]);

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

  const loadInterviewEvents = useCallback(async () => {
    // Ensure a team is selected (same logic as CandidateChat)
    const currentTeam = JSON.parse(
      typeof window !== "undefined"
        ? window.localStorage.getItem("currentTeam") || "null"
        : "null"
    );
    if (!currentTeam) {
      setInterviewEvents([]);
      return;
    }

    setCalendarLoading(true);
    try {
      // Load first 100 chats, which is typically plenty for upcoming interviews
      const response = await CandidateChatService.getTeamChats(1, 100);
      const chats = response.data?.chats || [];

      const events = [];

      chats.forEach((chat) => {
        const candidate = chat.candidateId || {};
        if (!candidate.meetingScheduled || !candidate.interviewMeetingTimestamp) {
          return;
        }

        const start = new Date(candidate.interviewMeetingTimestamp);
        const end = candidate.interviewMeetingTimestampEnd
          ? new Date(candidate.interviewMeetingTimestampEnd)
          : new Date(start.getTime() + 60 * 60 * 1000);

        events.push({
          id: `${chat._id}-${start.toISOString()}`,
          chatId: chat._id,
          candidateId: candidate._id,
          candidateName: chat.candidateName || candidate.formData?.fullname || candidate.formData?.name || "Candidate",
          jobTitle: chat.jobTitle,
          start,
          end,
          timezone: candidate.interviewMeetingTimezone || "UTC",
          meetingLink: candidate.interviewMeetingLink || null,
        });
      });

      // Sort by start time
      events.sort((a, b) => a.start - b.start);
      setInterviewEvents(events);
    } catch (error) {
      console.error("Error loading interview events for calendar:", error);
      // Fallback to empty list on error
      setInterviewEvents([]);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  // Initial load of interview events
  useEffect(() => {
    loadInterviewEvents();
  }, [loadInterviewEvents]);

  // Derive highlighted dates and events for the currently selected day
  const highlightedDates = useMemo(
    () => Array.from(new Set(interviewEvents.map((e) => toDateKey(e.start)))),
    [interviewEvents]
  );

  const eventsForSelectedDate = useMemo(() => {
    const key = toDateKey(selectedDate);
    return interviewEvents.filter((e) => toDateKey(e.start) === key);
  }, [interviewEvents, selectedDate]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    if (key === "2") {
      setShowInviteModal(false);
    } else {
      setShowInviteModal(true);
    }
  };

  const handleCreateNewVacancy = () => {
    console.log('🎯 DASHBOARD CREATE VACANCY LIMIT CHECK');

    // Use workspace funnel usage data for accurate counting
    const currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? user?.landingPageNum ?? 0;
    const maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
    const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;
    const tierName = user?.tier?.name ?? tier?.name ?? 'Unknown';

    console.log('Dashboard limit check:', {
      currentFunnelCount,
      maxFunnels,
      hasReachedLimit,
      tierName,
      funnelUsage: funnelUsage,
      note: 'Dashboard now uses workspace funnel usage data'
    });

    if (hasReachedLimit) {
      console.log('🚫 DASHBOARD BLOCKING: User has reached funnel limit, showing upgrade modal');
      setUpgradeModalVisible(true);
      return; // Explicitly prevent further execution
    }

    console.log('✅ DASHBOARD ALLOWING: User can create new vacancy');
    router.push("/dashboard/campaigns?new=true");
  };

  return (
    <div className="flex flex-col mdr:flex-row gap-[10px]">
      <div className="ml-[10px] w-full rounded-xl bg-white p-[24px] pr-2 lg:w-[70%] flex flex-col gap-[24px] pt-0">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full mt-4">
          <Heading size="11xl" as="h1" className="!text-gray-900">
            Dashboard
          </Heading>
          <div className="justify-end flex flex-col md:flex-row items-center gap-4 w-full mt-4">
            {showInviteModal && (
              <>
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
                    currentFunnelCount = funnelUsage?.totalCurrentFunnels ?? user?.landingPageNum ?? 0;
                    maxFunnels = user?.planFeatures?.maxFunnels ?? user?.tier?.maxFunnels ?? tier?.maxFunnels ?? 1;
                    tierName = user?.tier?.name ?? tier?.name ?? 'Free';
                  }

                  const hasReachedLimit = maxFunnels !== null && currentFunnelCount >= maxFunnels;

                  return (
                    <div className="flex flex-col items-end gap-2">
                      {/* Usage indicator */}
                      <div className="text-sm text-gray-500 text-right flex items-center gap-1">
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
                                  <div className="border-t pt-1 mt-2 font-medium">
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
                            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                          </Tooltip>
                        )}
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                          {tierName} Plan
                        </span>
                      </div>

                      {/* Create button */}
                      <Button
                        shape="round"
                        onClick={hasReachedLimit ? () => setUpgradeModalVisible(true) : handleCreateNewVacancy}
                        size="3xl"
                        leftIcon={
                          hasReachedLimit ? (
                            <CrownOutlined className="mr-2 text-yellow-500" />
                          ) : (
                            <PlusOutlined className="mr-2 text-white" />
                          )
                        }
                        className={`min-w-[225px] gap-1.5 font-semibold px-[4px] ${hasReachedLimit
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-[#5207CD] text-white'
                          }`}
                        title={hasReachedLimit ? `You've reached your ${maxFunnels} funnel limit. Click to upgrade.` : 'Create a new vacancy'}
                      >
                        {hasReachedLimit ? 'Upgrade to Create More' : 'Create a New Campaign'}
                      </Button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>

        {/* <Tabs activeKey={activeKey} onChange={handleTabChange} items={items} /> */}
        <Overview />
      </div>

      <div className="w-full lg:w-[30%] flex flex-col gap-[32px] bg-white dark:bg-black px-[10px] py-[24px] rounded-xl overflow-auto">
        <CalendarRangePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          highlightedDates={highlightedDates}
        />

        {calendarLoading && (
          <div className="px-4 py-3 text-sm text-gray-500 border border-dashed rounded-lg">
            Loading interviews...
          </div>
        )}

        {!calendarLoading && eventsForSelectedDate.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 border border-dashed rounded-lg">
            No interviews scheduled for this date.
          </div>
        )}

        {!calendarLoading &&
          eventsForSelectedDate.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-[8px] p-[16px] rounded-lg cursor-pointer hover:shadow-sm border border-gray-100"
              style={{ background: "#EFF8FF", width: "100%" }}
              onClick={() =>
                router.push(`/dashboard/candidate-chat?chatId=${event.chatId}`)
              }
            >
              <div className="flex items-center gap-[7px]">
                <svg
                  width={10}
                  height={11}
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.89642 3.35709C3.75416 3.35709 2.82486 4.2864 2.82486 5.42865C2.82486 6.57091 3.75417 7.50021 4.89642 7.50021C6.03868 7.50021 6.96798 6.5709 6.96798 5.42865C6.96798 4.28639 6.03867 3.35709 4.89642 3.35709ZM4.89642 0.532227C7.60064 0.532227 9.79284 2.72444 9.79284 5.42865C9.79284 8.13287 7.60063 10.3251 4.89642 10.3251C2.19221 10.3251 0 8.13286 0 5.42865C0 2.72444 2.19221 0.532227 4.89642 0.532227Z"
                    fill="#5207CD"
                  />
                </svg>
                <div className="text-md" style={{ fontSize: 13 }}>
                  {moment(event.start).format("HH:mm")} -{" "}
                  {moment(event.end).format("HH:mm")}{" "}
                  {event.timezone ? `(${event.timezone})` : ""}
                </div>
              </div>

              <div className="text-md font-bold">
                {event.candidateName}
                {event.jobTitle ? ` — ${event.jobTitle}` : ""}
              </div>
              {event.meetingLink && (
                <div className="text-xs text-purple-600 underline">
                  Join link available
                </div>
              )}
            </div>
          ))}
      </div>

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
    </div>
  );
};

export default MyDashboard;
