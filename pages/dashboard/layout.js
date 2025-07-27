import { ChartPieIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";
import { BsFillSearchHeartFill } from "react-icons/bs";

import { Alert, Badge, Skeleton, message } from "antd";
import Color from "color";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const Layout = ({children}) => {
  const [theme, setTheme] = useState(null);
  const [numberNewAccelerator, setNumberNewAccelerator] = useState(null);
  const [numberTickets, setNumberTickets] = useState(null);
  const [needsToSelectCalendlyType, setNeedsToSelectCalendlyType] =
    useState(false);
  const location = useRouter();
  const router = useRouter();
  const user = useSelector(selectUser);
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

    if(user?._id)
    Intercom({
      app_id: 'h6drq6b2',
      user_id: user?._id, // IMPORTANT: Replace "user?.id" with the variable you use to capture the user's ID
      name: `${user?.firstName} ${user?.lastName}`, // IMPORTANT: Replace "user?.name" with the variable you use to capture the user's name
      email: user?.email, // IMPORTANT: Replace "user?.email" with the variable you use to capture the user's email
      created_at: user?.createdAt, // IMPORTANT: Replace "user?.createdAt" with the variable you use to capture the user's sign-up date in a Unix timestamp (in seconds) e.g. 1704067200
    });
    
  }, [user]);

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

  const navigation = [
    {
      name: "Menu",
      subitems: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: BarIcon,
        },
        {
          name: "Vacancies",
          href: "/dashboard/vacancies",
          icon: BriefcaserIcon,
        },
        // {
        //   name: "Tools",
        //   href: "/dashboard/tools",
        //   icon: ToolrIcon,
        // },

        {
          name: "Media Library",
          href: "/dashboard/media-library",
          icon: ImageIcon,
        },
        {
          name: "ATS",
          href: "/dashboard/ats",
          icon: FolderIcon,
          // icon: GroupOfPeople,
        },
        {
          name: "Brand Kit",
          href: "/onboarding",
          isOnboardingCompleted: isOnboardingCompleted,
          icon: BrandKit,
        },
        {
          name: "Ads Publishing",
          href: "/dashboard/ads-publishing",
          icon: AdsPublishingIcon,
        },
        {
          name: "Domains",
          href: "/dashboard/custom-domains",
          icon: CustomDomainsIcon,
        },

        // {
        //   name: "Analytics",
        //   href: "/dashboard/analytics",
        //   icon: LinerIcon,
        // },
      ],
    },
    

    // {
    //   name: "My Users",
    //   href: "/dashboard/partnerUsers",
    //   icon: UsersIcon,
    //   hide: user?.role !== "partner",
    // },
    // {
    //   name: "My Stats",
    //   href: "/dashboard/partnerStats",
    //   icon: ChartPieIcon,
    //   hide: user?.role !== "partner",
    // },

    // {
    //   name: (
    //     <>
    //       Support Tickets
    //       <Badge count={numberTickets} offset={[0, 0]}></Badge>
    //     </>
    //   ),
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
    //   hide: !["partner", "admin"].includes(user?.role),
    // },
    ...(user?.role === "admin" ? adminNavigation : []),
  ]
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
      // hide: user?.role !== "recruiter",
    },
    {
      name: "Integrations",
      href: "/dashboard/settings",
      logo: Blocks,
      grayout: true,
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
      // hide: user?.role !== "recruiter",
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
    // },
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
         
         {children}

          <Footer />
          {/* <SupportWidget /> */}
          <PhoneWidget />
        </Theme>
      </div>
    </div>
  );
};

export default Layout;
