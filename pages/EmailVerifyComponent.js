import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "../src/services/AuthService";

const EmailVerifyComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token;
    if (!token) return;

    AuthService.updateEmailConfirm({ token })
      .then(() => {
        router.push("/dashboard/settings");
      })
      .catch(() => router.push("/dashboard/settings"));
  }, [router.query.token, router]);
  return <></>;
};

export default EmailVerifyComponent;
