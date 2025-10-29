import { ChartPieIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { BsFillSearchHeartFill } from "react-icons/bs";

import { Alert, Badge, Skeleton, message } from "antd";
import Color from "color";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
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
} from "./Vacancies/components/Icons.js";
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
} from "lucide-react";
import {
  DEVELOPMENT,
  STANDARD_MOMENT_FORMAT,
  brandColor,
} from "../../data/constants.js";
import { setDarkMode, setPartner } from "../../redux/auth/actions.js";
import {
  getPartner,
  selectDarkMode,
  selectUser,
} from "../../redux/auth/selectors.js";
import { store } from "../../redux/store.js";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import AuthService from "../../services/AuthService.js";
import CalendlyService from "../../services/CalendlyService.js";
import ChatService from "../../services/ChatService.js";
import PartnerService from "../../services/PartnerService.js";
import PublicService from "../../services/PublicService.js";
import Billing from "./Billing.js";
import CalendlyEventSelector from "./CalendlyEventSelector.js";
import { Footer } from "./Footer.js";
import Legal from "./legal/index.js";
// import MediaLibrary from "./MediaLibrary/index";
// import MediaLibrary from "../../../src/components/mediaLibrary/index";
import MyDashboard from "./MyDashboard/index.js";
import NewVacancy from "./NewVacancy/index.js";
import NewVacancyTwo from "./NewVacancyTwo/index.js";
import PartnerActivation from "./PartnerActivation.js";
import PartnerSettings from "./PartnerSettings.js";
import PartnerStats from "./PartnerStats.js";
import PartnerUsers from "./PartnerUsers.js";
import PhoneWidget from "./PhoneWidget.js";
import Settings from "./Settings.js";
import StatsDashboard from "./StatsDashboard.js";
import SupportTickets from "./SupportTickets/index.js";
import TemplateComponent from "./TemplateComponent/index.js";
import ThemeOne from "./ThemeOne.js";
import ThemeTwo from "./ThemeTwo.js";
import Vacancy from "./Vacancy/index.js";
import MyMediaLibrary from "./Vacancies/components/mediaLibrary/index.jsx";
import Vacancies from "./Vacancies/index.jsx";
import UserManagement from "./Admin/UserManagement/index.js";
import RoleManagement from "./Admin/RoleManagement/index.js";
import WorkspaceManagement from "./Workspaces/index.js";
import WorkspaceReturnButton from "../../components/WorkspaceReturnButton.js";
import { partner } from "../../constants.js";
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

const Dashboard = () => {
  const [theme, setTheme] = useState(null);
  const [me, setMe] = useState(null);
  const [numberNewAccelerator, setNumberNewAccelerator] = useState(null);
  const [numberTickets, setNumberTickets] = useState(null);
  const [needsToSelectCalendlyType, setNeedsToSelectCalendlyType] =
    useState(false);
  const location = useRouter();
  const router = useRouter();
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  const { workspaceSession, currentWorkspace } = useWorkspace();

  const Theme = useCallback(
    (props) => {
      if (theme === 1) return <ThemeOne {...props} />;
      if (theme === 2) return <ThemeTwo {...props} />;
    },
    [theme]
  );

  const trialDate = useMemo(() => {
    if (!partner) return null;
    if (!user) return null;

    const currentDate = new Date();
    const trialStartDate = new Date(user.createdAt);
    trialStartDate.setDate(trialStartDate.getDate() + partner.trialDays);
    const isTrialGranted =
      user.partnerGrantedTrialEnd &&
      currentDate <= new Date(user.partnerGrantedTrialEnd);

    const userTier =
      !user.subscription?.paid || !user.subscription?.tier
        ? "free"
        : user.subscription.tier;

    const isTrial =
      userTier === "free" && (isTrialGranted || currentDate <= trialStartDate);

    if (!isTrial) return null;

    if (isTrialGranted) return user.partnerGrantedTrialEnd;
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

  const isOnboardingCompleted =
    !!user.companyLogo && !!user.companyUrl && !!user.companyInfo;

  const adminNavigation = useMemo(() => [
    {
      name: "Admin",
      subitems: [
        {
          name: "User Management",
          component: <UserManagement />, // You'll need to create this component
          href: "/dashboard/admin/users",
          icon: UsersIcon,
        },
        // {
        //   name: "Role Management",
        //   component:  <RoleManagement />, // You'll need to create this component
        //   href: "/dashboard/admin/roles",
        //   icon: SettingsrIcon,
        // },
        // {
        //   name: "Analytics",
        //   component: <StatsDashboard />,
        //   href: "/dashboard/admin/analytics",
        //   icon: ChartPieIcon,
        // },
      ],
    },
  ], [user, workspaceSession, currentWorkspace, isOnboardingCompleted]);

  const isOnboardingCompleted2 = {
    "email": user.email,
    "companyLogo": user.companyLogo,
    "companyUrl": user.companyUrl,
    "brandColors": user.brandColors,
    "primaryColor": user.primaryColor,
    "secondaryColor": user.secondaryColor,
    "tertiaryColor": user.tertiaryColor,
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

  const navigation = useMemo(() => [
    {
      name: "Menu",
      subitems: [
        {
          name: "Dashboard",
          component: <MyDashboard />,
          href: "/dashboard",
          icon: BarIcon,
        },
        {
          name: "Vacancies",
          component: <Vacancies />,
          href: "/dashboard/vacancies",
          icon: BriefcaserIcon,
        },
        // {
        //   name: "Tools",
        //   component: <TemplateComponent />,
        //   href: "/dashboard/tools",
        //   icon: ToolrIcon,
        // },
        {
          name: "ATS",
          component: <Vacancy />,
          href: "/dashboard/ats",
          icon: FolderIcon,
          // icon: GroupOfPeople,
        },
        // Only show Brand Kit when NOT in workspace session
        ...(Boolean(currentWorkspace) ? [] : [{
          name: "Brand Kit",
          // component: <Settings />,
          href: "/onboarding",
          isOnboardingCompleted: isOnboardingCompleted,
          icon: BrandKit,
        }]),
        {
          name: "Media Library",
          // component: <MediaLibrary />,
          component: <MyMediaLibrary />,
          href: "/dashboard/media-library",
          icon: ImageIcon,
        },
        // {
        //   name: "Analytics",
        //   component: <TemplateComponent />,
        //   href: "/dashboard/analytics",
        //   icon: LinerIcon,
        // },
      ],
    },
    {
      name: "General",
      subitems: [
        {
          name: "Settings",
          component: <Settings />,
          href: "/dashboard/settings",
          icon: SettingsrIcon,
        },
        // {
        //   name: "Onboarding Demo",
        //   // component: <Settings />,
        //   href: "/onboarding",
        //   icon: SettingsrIcon,
        // },
      ],
    },

    // {
    //   name: "My Users",
    //   href: "/dashboard/partnerUsers",
    //   component: <PartnerUsers />,
    //   icon: UsersIcon,
    //   hide: me?.role !== "partner",
    // },
    // {
    //   name: "My Stats",
    //   href: "/dashboard/partnerStats",
    //   component: <PartnerStats />,
    //   icon: ChartPieIcon,
    //   hide: me?.role !== "partner",
    // },

    // {
    //   name: (
    //     <>
    //       Support Tickets
    //       <Badge count={numberTickets} offset={[0, 0]}></Badge>
    //     </>
    //   ),
    //   component: <SupportTickets />,
    //   href: "/dashboard/tickets",
    //   icon: () => (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       viewBox="0 0 24 24"
    //       fill="currentColor"
    //       className="w-6 h-6"
    //     >
    //       <path
    //         fillRule="evenodd"
    //         d="M19.449 8.448 16.388 11a4.52 4.52 0 0 1 0 2.002l3.061 2.55a8.275 8.275 0 0 0 0-7.103ZM15.552 19.45 13 16.388a4.52 4.52 0 0 1-2.002 0l-2.55 3.061a8.275 8.275 0 0 0 7.103 0ZM4.55 15.552 7.612 13a4.52 4.52 0 0 1 0-2.002L4.551 8.45a8.275 8.275 0 0 0 0 7.103ZM8.448 4.55 11 7.612a4.52 4.52 0 0 1 2.002 0l2.55-3.061a8.275 8.275 0 0 0-7.103 0Zm8.657-.86a9.776 9.776 0 0 1 1.79 1.415 9.776 9.776 0 0 1 1.414 1.788 9.764 9.764 0 0 1 0 10.211 9.777 9.777 0 0 1-1.415 1.79 9.777 9.777 0 0 1-1.788 1.414 9.764 9.764 0 0 1-10.212 0 9.776 9.776 0 0 1-1.788-1.415 9.776 9.776 0 0 1-1.415-1.788 9.764 9.764 0 0 1 0-10.212 9.774 9.774 0 0 1 1.415-1.788A9.774 9.774 0 0 1 6.894 3.69a9.764 9.764 0 0 1 10.211 0ZM14.121 9.88a2.985 2.985 0 0 0-1.11-.704 3.015 3.015 0 0 0-2.022 0 2.985 2.985 0 0 0-1.11.704c-.326.325-.56.705-.704 1.11a3.015 3.015 0 0 0 0 2.022c.144.405.378.785.704 1.11.325.326.705.56 1.11.704.652.233 1.37.233 2.022 0a2.985 2.985 0 0 0 1.11-.704c.326-.325.56-.705.704-1.11a3.016 3.016 0 0 0 0-2.022 2.985 2.985 0 0 0-.704-1.11Z"
    //         clipRule="evenodd"
    //       />
    //     </svg>
    //   ),
    //   hide: !["partner", "admin"].includes(me?.role),
    // },
    ...(me?.role === "admin" ? adminNavigation : []),
  ], [user, workspaceSession, currentWorkspace, isOnboardingCompleted])
    .map((elem) => ({
      ...elem,
      subitems: elem.subitems.map((c) => ({
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
    //   component: <Billing />,
    //   hide: me?.role !== "recruiter",
    // },
    {
      name: "Account",
      href: "/dashboard/settings",
      component: <div>Account</div>,
      logo: User,
      // hide: me?.role !== "recruiter",
    },
    {
      name: "Plan & Billing",
      href: "/dashboard/billing",
      component: <Billing />,
      logo: CreditCard,
      // hide: me?.role !== "recruiter",
    },
    {
      name: "Integrations",
      href: "/dashboard/settings",
      component: <div>Account</div>,
      logo: Blocks,
      // hide: me?.role !== "recruiter",
    },
    {
      name: "Team Management",
      href: "/dashboard/",
      component: <div>Account</div>,
      logo: Users,
      // hide: me?.role !== "recruiter",
    },
    {
      name: "Upgrade",
      href: "/dashboard/billing",
      component: <div>Account</div>,
      logo: ArrowUpCircle,
      // hide: me?.role !== "recruiter",
    },
    {
      name: "SaaS Configuration",
      href: "/dashboard/partnerSettings",
      component: <PartnerSettings />,
      logo: SettingIcon,
      hide: me?.role !== "partner" || !DEVELOPMENT,
    },
    {
      name: "SaaS Activation",
      href: "/dashboard/partnerActivation",
      component: <PartnerActivation />,
      logo: SettingIcon,
      hide: me?.role !== "partner" || !DEVELOPMENT,
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
    // },
    {
      name: "Sign out",
      href: "/dashboard",
      onClick: () => {
        // Call logout API
        import("../../services/AuthService.js").then(({ default: AuthService }) => {
          AuthService.logout().finally(() => {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            window.location.href = "/";
          });
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
          <Routes>
            {navigation
              .map((category) => category.subitems)
              .flat()
              .map((nav) => (
                <Route path={nav.path} element={nav.component} />
              ))}
            {navigation
              .map((a) => a.submenus)
              .flat()
              .filter((a) => !!a)
              .map((nav) => (
                <Route path={nav.path} element={nav.component} />
              ))}
            {userNavigation.map((nav) => (
              <Route path={nav.path} element={nav.component} />
            ))}
            <Route path="/legal/*" element={<Legal />} />
            <Route path="/vacancies/new" element={<NewVacancy />} />
            <Route path="/vacancies/new/2" element={<NewVacancyTwo />} />
            <Route path="/ats" element={<Vacancy />} />
            {/* Admin routes */}
            {me?.role === "admin" && (
              <>
                <Route path="/admin/users" element={<UserManagement />} />
                {/* <Route path="/admin/roles" element={<RoleManagement />} /> */}
                {/* <Route path="/admin/analytics" element={<StatsDashboard />} /> */}
              </>
            )}
          </Routes>
          <Footer />
          {/* <SupportWidget /> */}
          <PhoneWidget />
          <WorkspaceReturnButton user={me} />
        </Theme>
      </div>
    </div>
  );
};

export default Dashboard;
