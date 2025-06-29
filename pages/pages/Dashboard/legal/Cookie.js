import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getPartner } from "../../../redux/auth/selectors";
import { Footer } from "../Footer";

const Cookie = () => {
  const partner = useSelector(getPartner);
  const location = useLocation();

  useEffect(() => {
    var js,
      tjs = document.getElementsByTagName("script")[0];
    if (partner.termlyCookieDataID) {
      js =
        document.getElementById("termly-jssdk") ??
        document.createElement("script");
      js.id = "termly-jssdk";
      js.src = "https://app.termly.io/embed-policy.min.js";
      tjs.parentNode.insertBefore(js, tjs);

      return () => {
        if (js) tjs.parentNode.removeChild(js);
      };
    }
  }, [partner, location]);
  return (
    <>
      {partner?.termlyCookieDataID ? (
        <div name="termly-embed" data-id={partner.termlyCookieDataID}></div>
      ) : (
        <main>
          <div
            dangerouslySetInnerHTML={{
              __html: partner?.CookieText,
            }}
          />
        </main>
      )}
    </>
  );
};

export default Cookie;
