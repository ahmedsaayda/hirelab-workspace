import { Skeleton } from "antd";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import EmailVerify from "./EmailVerify";
import JoinTeamMember from "./JoinTeamMember";
import PublicPages from "./PublicPages";
import { brandColor } from "./data/constants";
import Dashboard, {
  changeIndigoShades,
  generateTailwindPalette,
} from "./pages/Dashboard";
import PartnerRegistration from "./pages/auth/PartnerRegistration";
import { login, setPartner } from "./redux/auth/actions";
import { getPartner } from "./redux/auth/selectors";
import { store } from "./redux/store";
import AuthService from "./service/AuthService";
import PublicService from "./service/PublicService";
import UserService from "./service/UserService";
import { partner } from "./constants";

function extractMongoDBId(inputString) {
  const objectIdPattern = /[0-9a-fA-F]{24}/;
  const match = inputString.match(objectIdPattern);

  if (match) {
    return match[0];
  } else {
    return null; // No valid MongoDB ObjectID found in the input string
  }
}

const RouteInit = () => {
  const router = useRouter();


  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(true);

  useEffect(() => {
    var script;

    if (partner?.termlyConsentBannerID) {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://app.termly.io/resource-blocker/${partner.termlyConsentBannerID}?autoBlock=on`;

      document.head.appendChild(script);
    }

    if (partner?.microsoftClarityID) {
      (function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", partner?.microsoftClarityID);
    }
    return () => {
      if (script) document.head.removeChild(script);
    };
  }, [partner]);

  useEffect(() => {
    setLoading(!partner);

    if (!partner) return;
    changeIndigoShades(
      // generateTailwindPalette(partner?.themeColor ?? brandColor)
      generateTailwindPalette(brandColor)
    );

    const favicon = document.querySelector('link[rel="icon"]');
    favicon.href = partner.favicon;

    // Set the apple-touch-icon dynamically
    const appleTouchIcon = document.querySelector(
      'link[rel="apple-touch-icon"]'
    );
    appleTouchIcon.href = partner.logo;

    document.title = partner.siteTitle.replace(
      /\{brandName\}/g,
      partner.brandName
    );

    document
      .querySelector('meta[name="description"]')
      .setAttribute(
        "content",
        partner.metaDescription.replace(/\{brandName\}/g, partner.brandName)
      );
  }, [partner]);

  useEffect(() => {
    if (
      ["/funnel", "/cv", "/jobportal", "/survey"].includes(router.pathname)
    ) {
      let mongoId,
        candidateId = null;

      const searchString = router.asPath.includes('?') ? router.asPath.split('?')[1] : '';
      
      mongoId =
        extractMongoDBId(router.pathname) ||
        extractMongoDBId(searchString);
      if (router.query.token) {
        const token = router.query.token;
        const decodedToken = jwt_decode(token);
        candidateId = decodedToken.candidateId;
      }

      if (mongoId || candidateId)
        PublicService.getRecruiterData(mongoId, candidateId).then(
          ({ data }) => {
            if (!data?.recruiter?.themeColor) return;
            changeIndigoShades(generateTailwindPalette(brandColor));
          }
        );
    } else {
      changeIndigoShades(
        // generateTailwindPalette(partner?.themeColor ?? brandColor)
        generateTailwindPalette(brandColor)
      );
    }
  }, [router.pathname, router.query, partner]);

  const handleRefresh = () => {
    PublicService.getPartnerConfig().then((res) => {

      if (!res.data.registered) setRegistered(false);
      store.dispatch(setPartner(res.data.partner));
      localStorage.setItem(
        "cloudinaryAPIKey",
        res.data.partner.cloudinaryAPIKey
      );
      localStorage.setItem(
        "cloudinaryCloudName",
        res.data.partner.cloudinaryCloudName
      );
      localStorage.setItem(
        "cloudinaryPreset",
        res.data.partner.cloudinaryPreset
      );
    });

    if (Cookies.get("accessToken"))
      AuthService.me().then((res) => {
        store.dispatch(login(res.data.me));
      });
  };
  useEffect(() => {
    handleRefresh();
  }, [router.pathname, router.query]);

  useEffect(() => {
    document.addEventListener("REFRESH.PROFILE", handleRefresh);
    return () => document.removeEventListener("REFRESH.PROFILE", handleRefresh);
  }, [handleRefresh]);

  const onFinishPartnerRegister = () => setRegistered(true);

  if (!registered)
    return (
      <PartnerRegistration onFinishPartnerRegister={onFinishPartnerRegister} />
    );
  if (loading && !partner)
    return (
      <div
        style={{
          overflow: "hidden",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          className="splash"
          style={{
            backgroundImage: "url('/images/background-auth.jpg')",
            height: "110vh",
            width: "110vw",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            margin: -30,
            filter: "blur(30px)",
            boxShadow: "0 0 100vh 100vw rgba(0,0,0,0.25) inset",
          }}
        ></div>
      </div>
    );

  return (
    <>

    </>
  );
};

export default RouteInit;
