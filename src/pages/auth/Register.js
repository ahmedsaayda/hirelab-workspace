import Cookies from "js-cookie";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Select from "../Dashboard/Vacancies/components/Select";
import { login } from "../../redux/auth/actions";
import { store } from "../../redux/store";
import AuthService from "../../services/AuthService";

import { Checkbox } from "antd";
import { useSelector } from "react-redux";
import { getPartner, selectLoading } from "../../redux/auth/selectors";
import { Button } from "../Landing/Button";
import { TextField } from "../Landing/Fields";
import { Logo } from "../Landing/Logo";
import { SlimLayout } from "../Landing/SlimLayout";
import { partner } from "../../constants";

const Login = () => {

  const router = useRouter();
  const loading = useSelector(selectLoading);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const [firstName, lastName, email, password] = new Array(4)
        .fill(0)
        .map((_, i) => e.target[i].value);

      await AuthService.register({
        firstName,
        lastName,
        email,
        password,
      });

      const result = await AuthService.login({
        email,
        password,
      });
      if (!result?.data?.accessToken)
        return message.error("Could not load user data");

      Cookies.set("accessToken", result?.data?.accessToken);
      Cookies.set("refreshToken", result?.data?.refreshToken);

      const me = await AuthService.me();
      if (!me?.data) return message.error("Could not load user data");

      store.dispatch(login(me.data.me));

      router.push("/auth/otpemail");
    },
    [router]
  );

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
              required
            />
            <TextField
              label="Last name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              required
            />
            <TextField
              className="col-span-full"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
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
              type="primary"
              variant="solid"
              color="blue"
              className="w-full hover:bg-white hover:text-blue-A200 hover:border border-blue-700_01"
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

export default Login;
