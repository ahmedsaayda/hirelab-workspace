import { ChartPieIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { BsFillSearchHeartFill } from "react-icons/bs";

import { Alert, Badge, List, Button as AntButton, Skeleton, Card, Dropdown, Menu, message, Tag } from "antd";
import Color from "color";
import Cookies from "js-cookie";
import moment from "moment";
import { refreshUserData } from "../../src/utils/userRefresh";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Intercom from '@intercom/messenger-js-sdk';
import {
  BarIcon,
  BriefcaserIcon,
  FolderIcon,
  ImageIcon,
  LinerIcon,
  SettingsrIcon,
  BrandKit,
  ToolrIcon,
  GroupOfPeople,
  CustomDomainsIcon,
  AdsPublishingIcon,
} from "../../src/pages/Dashboard/Vacancies/components/Icons.js";
import {
  User,
  CreditCard,
  Plug,
  Users,
  ArrowUpCircle,
  Settings as SettingIcon,
  ToggleRight as Toggle,
  LogOut as LogoutIcon,
  Blocks,
  PaletteIcon,
  Puzzle,
} from "lucide-react";
import {
  DEVELOPMENT,
  STANDARD_MOMENT_FORMAT,
  brandColor,
} from "../../src/data/constants";
import { setPartner } from "../../src/redux/auth/actions";
import {
  selectDarkMode,
  selectUser,
} from "../../src/redux/auth/selectors";
import { store } from "../../src/redux/store";
import CalendlyService from "../../src/services/CalendlyService";
import ChatService from "../../src/services/ChatService";
import PartnerService from "../../src/services/PartnerService";
import PublicService from "../../src/services/PublicService";
import { partner } from "../../src/constants.js";
import CalendlyEventSelector from "../../src/pages/Dashboard/CalendlyEventSelector.js";
import { Footer } from "../../src/pages/Dashboard/Footer.js";
import PhoneWidget from "../../src/pages/Dashboard/PhoneWidget.js";
import ThemeOne from "../../src/pages/Dashboard/ThemeOne.js";
import ThemeTwo from "../../src/pages/Dashboard/ThemeTwo.js";
import AuthService from "../../src/services/AuthService.js";
import TeamService from "../../src/services/TeamService.js";
import WorkspaceService from "../../src/services/WorkspaceService.js";
import { useWorkspace } from "../../src/contexts/WorkspaceContext";
import DevDataInspector from "../../src/components/DevDataInspector.jsx";
import { ApartmentOutlined, ClockCircleOutlined } from "@ant-design/icons";


export const THEME_OPTIONS = [
  { value: 1, label: "Default" },
  { value: 2, label: "Minimalistic" },
];

export const changeIndigoShades = (newShades) => {
  console.log("newShades", newShades);
  Object.keys(newShades).forEach((shade) => {
    document.documentElement.style.setProperty(
      `--indigo-${shade}`,
      newShades[shade]
    );
    document.documentElement.style.setProperty(
      `--blue-${shade}`,
      newShades[shade]
    );
  });
};

export const generateTailwindPalette = (baseColor) => {
  console.log("baseColor", baseColor);
  const base = Color(baseColor);
  let palette = {};

  // Generate lighter shades for 50 to 400
  for (let i = 50; i <= 400; i += 50) {
    palette[i] = base.lighten((4 - i / 100) * 0.2).hex();
  }

  // Base color for 500
  palette[500] = baseColor;

  // Generate darker shades for 600 to 950
  for (let i = 600; i <= 950; i += 50) {
    palette[i] = base.darken((i - 500) / 1000).hex();
  }

  return palette;
};

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [numberNewAccelerator, setNumberNewAccelerator] = useState(null);
  const [numberTickets, setNumberTickets] = useState(null);
  const [needsToSelectCalendlyType, setNeedsToSelectCalendlyType] =
    useState(false);
  const [currentTeamRole, setCurrentTeamRole] = useState(null);
  const [workspaceMenuVisible, setWorkspaceMenuVisible] = useState(false);
  const workspaceQueryRef = useRef(null);
  const {
    pendingInvitations,
    acceptWorkspaceInvitation,
    declineWorkspaceInvitation,
    loading: workspaceLoading,
    accessibleWorkspaces,
    workspaceSession,
    currentWorkspace,
    workspaceEnabled,
    switchToWorkspace,
    returnToMainSmart,
  } = useWorkspace();
  const location = useRouter();
  const router = useRouter();
  const user = useSelector(selectUser);
  console.log("user.workspaceRole :=", user?.workspaceRole, "user id :=", user?._id)

  const handleAcceptInvitation = async (token) => {
    try {
      await acceptWorkspaceInvitation(token);
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleDeclineInvitation = async (token) => {
    try {
      await declineWorkspaceInvitation(token);
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  // Helper function to return from workspace
  const handleReturnFromWorkspace = async () => {
    await returnToMainSmart();
  };
  const darkMode = useSelector(selectDarkMode);

  const Theme = useCallback(
    (props) => {
      if (theme === 1) return <ThemeOne {...props} />;
      if (theme === 2) return <ThemeTwo {...props} />;
    },
    [theme]
  );

  useEffect(() => {
    console.log("user", user);

    if (user?._id)
      Intercom({
        app_id: 'h6drq6b2',
        user_id: user?._id, // IMPORTANT: Replace "user?.id" with the variable you use to capture the user's ID
        name: `${user?.firstName} ${user?.lastName}`, // IMPORTANT: Replace "user?.name" with the variable you use to capture the user's name
        email: user?.email, // IMPORTANT: Replace "user?.email" with the variable you use to capture the user's email
        created_at: user?.createdAt, // IMPORTANT: Replace "user?.createdAt" with the variable you use to capture the user's sign-up date in a Unix timestamp (in seconds) e.g. 1704067200
      });

  }, [user]);

  // Load current team role from localStorage
  useEffect(() => {
    const currentTeam = TeamService.getCurrentTeam();
    if (currentTeam && currentTeam.role) {
      setCurrentTeamRole(currentTeam.role);

      // Redirect atsOnly users to ATS page if they're not already there
      if (currentTeam.role === 'atsOnly' &&
        !location.pathname.includes('/ats') &&
        location.pathname !== '/dashboard/settings') {
        router.push('/dashboard/ats');
      }
    }
  }, [user, location.pathname]);

  const trialDate = useMemo(() => {
    if (!partner) return null;
    if (!user) return null;

    const currentDate = new Date();
    const trialStartDate = new Date(user?.createdAt);
    trialStartDate.setDate(trialStartDate.getDate() + partner.trialDays);
    const isTrialGranted =
      user?.partnerGrantedTrialEnd &&
      currentDate <= new Date(user?.partnerGrantedTrialEnd);

    const userTier =
      !user?.subscription?.paid || !user?.subscription?.tier
        ? "free"
        : user?.subscription.tier;

    const isTrial =
      userTier === "free" && (isTrialGranted || currentDate <= trialStartDate);

    if (!isTrial) return null;

    if (isTrialGranted) return user?.partnerGrantedTrialEnd;
    if (trialStartDate) return trialStartDate;
    return null;
  }, [user, partner]);

  const handleRefresh = useCallback(async () => {
    const res = await PublicService.getPartnerConfig();
    store.dispatch(setPartner(res.data.partner));
  }, []);
  useEffect(() => {
    document.addEventListener("REFRESH.PROFILE", handleRefresh);
    return () => document.removeEventListener("REFRESH.PROFILE", handleRefresh);
  }, [handleRefresh]);
  useEffect(() => {
    if (!partner) return;
    changeIndigoShades(
      // generateTailwindPalette(partner?.themeColor ?? brandColor)
      generateTailwindPalette(brandColor)
    );
    setTheme(partner.theme);
  }, [partner]);

  useEffect(() => {
    if (numberNewAccelerator === null && user?.role === "partner") {
      PartnerService.getNumberOfNew().then(({ data }) => {
        setNumberNewAccelerator(data.totalNew);
      });
    }
  }, [user]);


  console.log("userrrrrrrrrr", user);

  useEffect(() => {
    const refresh = () =>
      ChatService.getNumberTickets().then(({ data }) =>
        setNumberTickets(data.numberTickets)
      );
    refresh();

    document.addEventListener("REFRESH.TICKETNUM", refresh);
    return () => document.removeEventListener("REFRESH.TICKETNUM", refresh);
  }, [location]);


  const checkCalendlyEventTypes = useCallback(async () => {
    if (!partner?.calendlyclientId) return;
    CalendlyService.getNeedsToSelectEventType().then(({ data }) => {
      if (data.needsToSelectEventType) setNeedsToSelectCalendlyType(true);
    });
  }, [partner]);

  useEffect(() => {
    checkCalendlyEventTypes();

    document.addEventListener(
      "CHECK.CALENDLY.EVENT.TYPES",
      checkCalendlyEventTypes
    );
    return () =>
      document.removeEventListener(
        "CHECK.CALENDLY.EVENT.TYPES",
        checkCalendlyEventTypes
      );
  }, []);

  useEffect(() => {
    if (!router?.isReady) return;

    const queryValue = router.query?.workspace;
    const workspaceId = Array.isArray(queryValue) ? queryValue[0] : queryValue;

    if (!workspaceId) return;
    if (workspaceQueryRef.current === workspaceId) return;

    const removeWorkspaceQuery = () => {
      const { workspace, ...restQuery } = router.query || {};
      router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
    };

    if (!user) return;

    const alreadyInWorkspace = Boolean(
      user?.isWorkspaceSession &&
      user?.workspaceId &&
      user.workspaceId.toString() === workspaceId
    );

    if (alreadyInWorkspace) {
      workspaceQueryRef.current = workspaceId;
      removeWorkspaceQuery();
      return;
    }

    if (!user?.allowWorkspaces) {
      workspaceQueryRef.current = workspaceId;
      removeWorkspaceQuery();
      return;
    }

    const accessible = accessibleWorkspaces?.find((ws) => {
      const id = ws?._id || ws?.id || ws?.workspaceId;
      return id && id.toString() === workspaceId && ws?.status !== "pending";
    });

    if (!accessible) {
      if (!accessibleWorkspaces || accessibleWorkspaces.length === 0) {
        return;
      }

      message.error("You do not have access to that workspace");
      workspaceQueryRef.current = workspaceId;
      removeWorkspaceQuery();
      return;
    }

    const performSwitch = async () => {
      workspaceQueryRef.current = workspaceId;
      try {
        await switchToWorkspace(workspaceId, { skipRedirect: true });
        router.replace("/dashboard", undefined, { shallow: true });
      } catch (error) {
        console.error("Error switching workspace from query:", error);
        message.error(error?.response?.data?.message || "Failed to switch workspace");
        workspaceQueryRef.current = null;
      } finally {
        removeWorkspaceQuery();
      }
    };

    performSwitch();
  }, [router, accessibleWorkspaces, switchToWorkspace, user]);

  const adminNavigation = [
    {
      name: "Admin",
      subitems: [
        {
          name: "User Management",
          href: "/dashboard/admin/users",
          icon: UsersIcon,
        },
        // {
        //   name: "Role Management",
        //   href: "/dashboard/admin/roles",
        //   icon: SettingsrIcon,
        // },
        // {
        //   name: "Analytics",
        //   href: "/dashboard/admin/analytics",
        //   icon: ChartPieIcon,
        // },

      ],
    },
  ];


  useEffect(() => {
    if (user) {
      console.log(user.email);

      // Only run Crisp user-identification when Crisp is actually enabled/loaded
      if (!window.CRISP_WEBSITE_ID) return;
      window.$crisp = window.$crisp || [];

      // set email and name
      window.$crisp.push(["set", "user:email", user.email]);
      if (user.name) {
        window.$crisp.push(["set", "user:nickname", ["default", user.name]]);
      }
    }
  }, [user]);

  const isOnboardingCompleted =
    !!user?.companyLogo && !!user?.companyUrl && !!user?.companyInfo;

  const isOnboardingCompleted2 = {
    "email": user?.email,
    "companyLogo": user?.companyLogo,
    "companyUrl": user?.companyUrl,
    "brandColors": user?.brandColors,
    "primaryColor": user?.primaryColor,
    "secondaryColor": user?.secondaryColor,
    "tertiaryColor": user?.tertiaryColor,
    isOnboardingCompleted
  };
  console.log("isOnboardingCompleted2", isOnboardingCompleted2);
  /*
  {
    "_id": {
      "$oid": "6821cdf337e75449970e9328"
    },
    "email": "shubham@test.com",
    "companyLogo": "",
    "companyUrl": "",
    "brandColors": [],
    "primaryColor": "#0066CC",
    "secondaryColor": "#333333",
    "tertiaryColor": "#666666"
  }
  */

  // Check if user is in their main/default team (not another team they were invited to)
  const isInMainTeam = user?.currentTeam ? (
    user.currentTeam.owner?.toString() === user._id?.toString() ||
    user.currentTeam._id?.toString() === user.defaultTeam?.toString()
  ) : true; // If no current team, assume main context

  // Check if user has main account access in current team (for invited team members)
  const hasMainAccessInCurrentTeam = user?.currentTeam ? (
    isInMainTeam || // Own team
    (user.currentTeam.permissions &&
      !(user.currentTeam.permissions.landingPages === 'none' &&
        user.currentTeam.permissions.mediaLibrary === 'none' &&
        user.currentTeam.permissions.teamManagement === 'none' &&
        user.currentTeam.permissions.ats === 'none'))
  ) : true;

  const canManageWorkspaces = Boolean(user?.allowWorkspaces && isInMainTeam);
  const isMainBlocked = Boolean(!workspaceSession && !isInMainTeam && !hasMainAccessInCurrentTeam);
  const workspaceRole = user?.workspaceRole || null;
  const isWorkspaceGuest = Boolean(user?.isWorkspaceSession && workspaceRole && !['owner', 'admin'].includes(workspaceRole));

  // Determine if user should only see ATS (either team ATS-only or workspace ATS-only)
  const shouldOnlySeeATS = currentTeamRole === 'atsOnly' || (user?.isWorkspaceSession && workspaceRole === 'atsOnly');

  const navigation = [
    {
      name: "Menu",
      subitems: isMainBlocked
        ? [
          {
            name: "Workspaces",
            href: "/dashboard/workspaces",
            icon: Blocks,
          },
        ]
        : shouldOnlySeeATS
          ? [
            {
              name: "ATS",
              href: "/dashboard/ats",
              icon: FolderIcon,
            },
          ]
          : [
            {
              name: "Dashboard",
              href: "/dashboard",
              icon: BarIcon,
            },
            {
              name: "Campaigns",
              href: "/dashboard/campaigns",
              icon: BriefcaserIcon,
            },
            {
              name: "ATS",
              href: "/dashboard/ats",
              icon: FolderIcon,
            },
            {
              name: "Brand Kit",
              href: "/onboarding",
              icon: PaletteIcon,
              hide: isWorkspaceGuest,
            },
            {
              name: "Domains",
              href: "/dashboard/custom-domains",
              icon: CustomDomainsIcon,
              hide: isWorkspaceGuest,
            },
            ...(canManageWorkspaces
              ? [
                {
                  name: "Workspaces",
                  href: "/dashboard/workspaces",
                  icon: Blocks,
                  hide: isWorkspaceGuest,
                },
              ]
              : []),
            {
              name: "Media Library",
              href: "/dashboard/media-library",
              icon: ImageIcon,
              hide: user?.isWorkspaceSession && workspaceRole === 'atsOnly',
            },
          ],
    },
    ...(user?.role === "admin" ? adminNavigation : []),
  ]
    .map((elem) => ({
      ...elem,
      subitems: elem.subitems
        .filter((sub) => !sub.hide)
        .map((c) => ({
          ...c,
          current: location.pathname === c.href,
          path: c.href?.replace?.("/dashboard", ""),
        })),
      current: location.pathname === elem.href,
      path: elem.href?.replace?.("/dashboard", ""),
    }))
    .filter((a) => !a?.hide);

  const userNavigation = [
    // {
    //   name: "Billing",
    //   href: "/dashboard/billing",
    //   hide: user?.role !== "recruiter",
    // },
    {
      name: "Account",
      href: "/dashboard/settings",
      logo: User,
      // hide: user?.role !== "recruiter",
    },
    {
      name: "Plan & Billing",
      href: "/dashboard/billing",
      logo: CreditCard,
      hide: isWorkspaceGuest,
    },
    {
      name: "Integrations",
      href: "/dashboard/integrations",
      logo: Puzzle,
      // hide: user?.role !== "recruiter",
    },
    {
      name: "Team Management",
      href: "/dashboard/",
      logo: Users,
      grayout: true,
      // hide: user?.role !== "recruiter",
    },
    {
      name: "Upgrade",
      href: "/dashboard/billing",
      logo: ArrowUpCircle,
      hide: isWorkspaceGuest, // Hide for workspace guests, visible for main/owners
    },
    {
      name: "SaaS Configuration",
      href: "/dashboard/partnerSettings",
      logo: SettingIcon,
      hide: user?.role !== "partner" || !DEVELOPMENT,
    },
    {
      name: "SaaS Activation",
      href: "/dashboard/partnerActivation",
      logo: SettingIcon,
      hide: user?.role !== "partner" || !DEVELOPMENT,
    },
    {
      name: "Schedule Live Meeting",
      href: "#",
      onClick: () => window.open(partner?.calendlySchedulingURL),
      hide: !partner?.calendlySchedulingURL,
    },

    // {
    //   name: (
    //     <div
    //       className="flex w-full justify-left"
    //       onClick={() => store.dispatch(setDarkMode(!darkMode))}
    //     >
    //       <DarkModeSwitch
    //         checked={darkMode}
    //         onChange={(e) => store.dispatch(setDarkMode(e))}
    //         size={20}
    //       />
    //     </div>
    //   ),
    //   href: "#",
    //   onClick: (e) => {
    //     e.preventDefault();
    //   },
    //     },
    // Add workspace return option for users in workspace sessions
    ...(user?.isWorkspaceSession ? [{
      name: "Return to Main Account",
      href: "/dashboard",
      onClick: handleReturnFromWorkspace,
      logo: ArrowUpCircle,
    }] : []),
    {
      name: "Sign out",
      href: "/dashboard",
      onClick: () => {
        AuthService.logout().finally(() => {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/";
        });
      },
      logo: LogoutIcon,
    },
  ]
    .map((elem) => ({
      ...elem,
      current: location.pathname === elem.href,
      path: elem.href.replace("/dashboard", ""),
    }))
    .filter((a) => !a?.hide);

  if (!theme) return <Skeleton active />;
  if (needsToSelectCalendlyType)
    return (
      <CalendlyEventSelector
        refresh={() => {
          CalendlyService.getNeedsToSelectEventType().then(({ data }) => {
            setNeedsToSelectCalendlyType(data.needsToSelectEventType);
          });
        }}
      />
    );
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-[100vh] dark:bg-gray-900 dark:text-gray-400">
        <Theme
          navigation={navigation}
          subMenus={[]}
          userNavigation={userNavigation}
        >
          {!localStorage.closedTrialInfo && trialDate && (
            <Alert
              type="info"
              message={
                <>
                  Your current trial period of our software is active. Be aware
                  that this trial version will expire on{" "}
                  {moment(trialDate).format(STANDARD_MOMENT_FORMAT)}. For
                  continued access and features, kindly consider{" "}
                  <Link href="/dashboard/billing">
                    upgrading to a full version
                  </Link>
                  .
                </>
              }
              banner
              closable
              onClose={() => {
                localStorage.closedTrialInfo = "true";
              }}
            />
          )}

          {!user?.isWorkspaceSession && pendingInvitations?.length > 0 && (
            <Card
              title="Pending Workspace Invitations"
              className="mb-4"
              extra={<Badge count={pendingInvitations.length} />}
            >
              <List
                dataSource={pendingInvitations}
                renderItem={(invite) => {
                  console.log("invite :", invite)
                  return (
                    <List.Item
                      actions={[
                        <AntButton
                          key="accept"
                          type="primary"
                          loading={workspaceLoading}
                          onClick={() => handleAcceptInvitation(invite.pendingToken || invite.token)}
                        >
                          Accept
                        </AntButton>,
                        <AntButton
                          key="decline"
                          danger
                          loading={workspaceLoading}
                          onClick={() => handleDeclineInvitation(invite.pendingToken || invite.token)}
                        >
                          Decline
                        </AntButton>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {invite?.companyLogo ? <img src={invite?.companyLogo} alt='Workspace Logo' className='w-10 h-10 rounded-full' /> : <ApartmentOutlined className="w-5 h-5 text-white" />}
                          </div>
                        }
                        title={
                          <div className="font-semibold text-gray-900">
                            {invite.workspaceName || invite.name || 'Workspace Invitation'}
                          </div>
                        }
                        description={
                          <div className="space-y-1 mt-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Tag
                                color={invite.role === 'admin' ? 'red' : invite.role === 'editor' ? 'blue' : 'green'}
                                className="text-xs px-2 py-0.5"
                              >
                                {invite.role === 'atsOnly' ? 'ATS Only' : invite.role?.charAt(0).toUpperCase() + invite.role?.slice(1) || 'Member'}
                              </Tag>
                              <span>Invited {moment(invite.invitedAt).fromNow()}</span>
                            </div>
                            {invite.expiresAt && (
                              <div className="flex items-center gap-2 text-sm text-orange-600">
                                <ClockCircleOutlined className="w-3 h-3" />
                                <span>Expires {moment(invite.expiresAt).fromNow()}</span>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )
                }}
              />
            </Card>
          )}

          {user?.isWorkspaceSession && (
            <Alert
              type="warning"
              message={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Blocks className="w-4 h-4" />
                    <span>
                      <strong>Workspace Mode:</strong> You are currently working in "{user.workspaceName || 'Workspace'}" workspace.
                      Your have {user.workspaceRole} access.
                      <Tag
                        color={user.workspaceRole === 'admin' ? 'red' : user.workspaceRole === 'editor' ? 'blue' : 'green'}
                        className="text-xs px-2 py-0.5"
                      >
                        {user.workspaceRole === 'atsOnly' ? 'ATS Only' : user.workspaceRole?.charAt(0).toUpperCase() + user.workspaceRole?.slice(1) || 'Viewer'}
                      </Tag>
                    </span>
                  </div>
                  <button
                    onClick={handleReturnFromWorkspace}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Return to Main Account
                  </button>
                </div>
              }
              banner
              showIcon={false}
            />
          )}

          {children}

          <Footer />
          {/* <SupportWidget /> */}
          <PhoneWidget />
        </Theme>
        <DevDataInspector datasets={{ /* will be populated per-page where applicable */ }} />
      </div>
    </div>
  );
};

export default Layout;
