import { message } from "antd";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import CalendlyService from "../../../service/CalendlyService";

const Calendly = () => {
  let [searchParams] = useSearchParams();
  const router = useRouter();;

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    CalendlyService.requestToken({
      code,
      redirect_uri: `${window.location.origin.replace(
        "http://",
        "https://"
      )}/calendly`,
    })
      .then(() => {
        message.success(
          "Your Calendly account has been successfully connected"
        );
        document.dispatchEvent(new CustomEvent("CHECK.CALENDLY.EVENT.TYPES"));
        router.push("/dashboard/settings#integrations");
      })
      .catch(() => router.push("/dashboard/settings#integrations"));
  }, [searchParams, navigate]);
  return <></>;
};

export default Calendly;
