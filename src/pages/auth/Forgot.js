import Cookies from "js-cookie";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "../../../src/redux/auth/actions";
import { store } from "../../../src/redux/store";
import AuthService from "../../../src/services/AuthService";

import { useSelector } from "react-redux";
import { getPartner, selectLoading } from "../../../src/redux/auth/selectors";
import { Button } from "../Landing/Button";
import { TextField } from "../Landing/Fields";
import { Logo } from "../Landing/Logo";
import { SlimLayout } from "../Landing/SlimLayout";

const Login = () => {
  const router = useRouter();;
  const loading = useSelector(selectLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AuthService.requestPasswordReset({ email: e.target[0].value });
    localStorage.forgotEmail = e.target[0].value;
    router.push("/auth/passwordreset");
  };

  return (
    <div className="flex h-[100vh] flex-col">
      <SlimLayout>
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" black />
          </Link>
        </div>
        <h2 className="mt-20 font-semibold text-[#101828] dark:text-gray-400 text-4xl ">
          Password reset
        </h2>
        <p className="mt-3 text-[#667085] dark:text-gray-300 text-base font-normal ">
          Forgot your password? Type your email, and we will send an verification code.
        </p>
        <form
          action="#"
          className="mt-10 grid grid-cols-1 gap-y-8"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          <div>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
              loading={loading}
            >
              <span>Request Verification Code</span>
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-indigo-500 font-semibold">
              Back to login
            </Link>
          </div>
        </form>
      </SlimLayout>
    </div>
  );
};

export default Login;
