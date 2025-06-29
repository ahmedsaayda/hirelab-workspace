import { message } from "antd";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Vacancy from "./pages/Dashboard/Vacancy";
import FormEdit from "./pages/FormEdit";
import Landing from "./pages/Landing";
import { Footer } from "./pages/Landing/Footer";
import LandingpagePage from "./pages/Landingpage";
import LandingpageEdit from "./pages/LandingpageEdit";
import HomePage from "./pages/app/HomePage";
import Auth from "./pages/auth";
import Legal from "./pages/legal";
// import Onboarding from "./pages/onboarding";
// import OnboardingaddmorePage from "./pages/onboarding/Onboardingaddmore";
// import OnboardinghiringteamrecruiterPage from "./pages/onboarding/Onboardinghiringteamrecruiter";
// import OnboardinglocationotherPage from "./pages/onboarding/Onboardinglocationother";
// import Onboardingsuccess from "./pages/onboarding/modals/Onboardingsuccess";
import { getPartner } from "./redux/auth/selectors";
import AuthService from "./service/AuthService";
// import BrandStyleForm from "./pages/onboarding/components/brand-style-form";
import BrandStyleForm from "./pages/onboarding/components/brand-style-form.jsx";
import HiringTeam from "./pages/onboarding/pages/hiring-team/index.jsx";
import HiringTeamDetails from "./pages/onboarding/pages/hiring-team/[role]/index.jsx";
import Location from "./pages/onboarding/pages/location/index.jsx";
import AddLocation from "./pages/onboarding/pages/location/add/index.jsx";
import OnboardingLayout from "./pages/onboarding/OnboardingLayout.jsx"; // Import the layout component
import TestBranding from "./pages/testBranding.jsx";

const PublicPages = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!Cookies.get("accessToken")) return; // User is not authenticated
      const res = await AuthService.me().then(res => {
      }).catch(err => {
        console.error("err",err)
      })
      
      const onboardingStatus = res?.data?.onboardingStatus;

      if (onboardingStatus?.actionRequired) {
        // User is not onboarded
        if (
          onboardingStatus.step === "isEmailVerified" &&
          !router.pathname.includes("/auth/otpemail")
        )
          router.push("/auth/otpemail");
        if (
          onboardingStatus.step === "isPartnerOnboarded" &&
          !router.pathname.includes("/auth/partneronboarding")
        )
          router.push("/auth/partneronboarding");
        if (
          onboardingStatus.step === "isPartnerActivated" &&
          !router.pathname.includes("/dashboard/partnerActivation")
        )
          router.push("/dashboard/partnerActivation");
        if (
          onboardingStatus.step === "subscription" &&
          !router.pathname.includes("/auth/subscription")
        )
          router.push("/auth/subscription");
        if (
          onboardingStatus.step === "isPhoneVerified" &&
          !router.pathname.includes("/auth/otpphone")
        )
          router.push("/auth/otpphone");
        if (
          onboardingStatus.step === "kycVerified" &&
          !router.pathname.includes("/auth/kyc")
        )
          router.push("/auth/kyc");

        // if (
        //   onboardingStatus.step === "profileCompletion" 
        //   &&
        //   !location.pathname.includes("/dashboard/settings")
        // ) {
        //   message.info("Please complete your profile");
        //   router.push("/dashboard/settings");
        // }
        if (
          onboardingStatus.step === "partnerCompletion" &&
          !router.pathname.includes("/dashboard/partnerSettings")
        ) {
          message.info("Please setup your SaaS");
          router.push("/dashboard/partnerSettings");
        }

        if (
          onboardingStatus.step === "isOnboardingCompleted" &&
          !router.pathname.includes("/dashboard")
        ){
          router.push("/onboarding");
        }
      } else if (
        !router.pathname.includes("dashboard") &&
        !router.pathname.includes("/lp") &&
        !router.pathname.includes("/edit-page") &&
        !router.pathname.includes("/form-edit") &&
        !router.pathname.includes("/onboarding") &&
        !router.pathname.includes("/test-branding")
      )
        // router.push("/dashboard"); // Authenticated and onboarded user is not on dashboard, so get them onto dashboard
        router.push("/dashboard"); // Authenticated and onboarded user is not on dashboard, so get them onto dashboard
    };
    checkUser();
  }, [router.pathname]);
  return (
    <>
      {/* TODO: Convert to Next.js file-based routing */}
      {/* In Next.js, routing is handled by the file structure in the pages directory */}
      {/* These routes should be converted to individual page files: */}
      {/* - pages/index.js (Landing or redirect to /auth/login) */}
      {/* - pages/auth/[...slug].js (Auth routes) */}
      {/* - pages/legal/[...slug].js (Legal routes) */}
      {/* - pages/onboarding/[...slug].js (Onboarding routes) */}
      {/* - pages/lp/[lpId].js (LandingpagePage) */}
      {/* - pages/edit-page/[lpId].js (LandingpageEdit) */}
      {/* - pages/form-editor/[lpId].js (FormEdit) */}
      {/* - pages/test-branding.js (TestBranding) */}
      <div>
        {/* Placeholder - routing logic needs to be moved to Next.js pages structure */}
      </div>
    </>
  );
};

export default PublicPages;
