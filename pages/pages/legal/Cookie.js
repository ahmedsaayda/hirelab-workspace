import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getPartner } from "../../redux/auth/selectors";
import { Container } from "../Landing/Container";
import { Footer } from "../Landing/Footer";
import { Header } from "../Landing/Header";

const Cookie = () => {
  const partner = useSelector(getPartner);
  const router = useRouter();

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
  }, [partner, router.pathname]);

  return (
    <>
      <Header />

      {partner?.termlyCookieDataID ? (
        <div name="termly-embed" data-id={partner.termlyCookieDataID}></div>
      ) : (
        <main>
          <Container className="pb-16 pt-20 text-left lg:pt-32">
            <div
              dangerouslySetInnerHTML={{
                __html: partner?.CookieText,
              }}
            />
          </Container>
        </main>
      )}

      <Footer />
    </>
  );
};

export default Cookie;
