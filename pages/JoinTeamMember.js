import Cookies from "js-cookie";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Checkbox, Skeleton } from "antd";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { Button } from "../src/pages/Landing/Button";
import { TextField } from "../src/pages/Landing/Fields";
import { Logo } from "../src/pages/Landing/Logo";
import { SlimLayout } from "../src/pages/Landing/SlimLayout";
import { login } from "../src/redux/auth/actions";
import { getPartner, selectLoading } from "../src/redux/auth/selectors";
import { store } from "../src/redux/store";
import AuthService from "../src/services/AuthService";
import { partner } from "../src/constants";

const JoinTeamMember = () => {
  const router = useRouter();
  const loading = useSelector(selectLoading);

  const [tokenData, setTokenData] = useState(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!tokenData) return;

      const password = e.target[3].value;

      await AuthService.registerTeam({
        ...tokenData,
        password,
      });

      const result = await AuthService.login({
        ...tokenData,
        password,
      });
      if (!result?.data?.accessToken)
        return message.error("Could not load user data");

      Cookies.set("accessToken", result?.data?.accessToken);
      Cookies.set("refreshToken", result?.data?.refreshToken);

      const me = await AuthService.me();
      if (!me?.data) return message.error("Could not load user data");

      store.dispatch(login(me.data));

      router.push("/auth/otpemail");
    },
    [router, tokenData]
  );

  useEffect(() => {
    const token = router.query.token;
    if (!token) return;

    const tokenData = jwtDecode(token);
    if (tokenData) setTokenData(tokenData);
  }, [router.query.token]);

  if (!tokenData) return <Skeleton active />;
  return (
    <>
      <div className="flex h-[100vh] flex-col">
        <SlimLayout>
          <div className="flex justify-center">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" black />
            </Link>
          </div>
          <h2 className="mt-20 font-semibold text-[#101828] dark:text-gray-400 text-4xl ">
            Get started {partner?.trialDays > 0 ? "for free" : ""}
          </h2>
          <p className="mt-3 text-[#667085] dark:text-gray-300 text-base font-normal ">
            Already registered?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>{" "}
            to your account.
          </p>
          <form
            action="#"
            className="mt-10 grid grid-cols-1 gap-y-8"
            onSubmit={handleSubmit}
          >
            <TextField
              label="First name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              value={tokenData?.firstName ?? ""}
              readOnly
            />
            <TextField
              label="Last name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              value={tokenData?.lastName ?? ""}
              readOnly
            />
            <TextField
              className="col-span-full"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={tokenData?.email ?? ""}
              readOnly
            />
            <TextField
              className="col-span-full"
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />

            {
              <div className="flex gap-2">
                <Checkbox className="col-span-full" required />
                <label>
                  I accept the{" "}
                  <a href="/legal/privacy" target="_blank">
                    privacy policy
                  </a>{" "}
                  and{" "}
                  <a href="/legal/terms" target="_blank">
                    terms of service
                  </a>
                </label>
              </div>
            }
            <div>
              <Button
                type="submit"
                variant="solid"
                color="blue"
                className="w-full"
                loading={loading}
              >
                <span>Sign up</span>
              </Button>
            </div>
          </form>
        </SlimLayout>
      </div>
    </>
  );
};

export default JoinTeamMember;
