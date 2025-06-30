import { message } from "antd";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import CalendlyService from "../../../../src/services/CalendlyService";

const Calendly = () => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const code = query.code;
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
  }, [query.code]);
  return <></>;
};

export default Calendly;
