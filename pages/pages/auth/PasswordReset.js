import Cookies from "js-cookie";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import AuthService from "../../service/AuthService";

import { message } from "antd";
import { useSelector } from "react-redux";
import { selectLoading } from "../../redux/auth/selectors";
import { Button } from "../Landing/Button";
import { TextField } from "../Landing/Fields";
import { Logo } from "../Landing/Logo";
import { SlimLayout } from "../Landing/SlimLayout";

const PasswordReset = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();;
  const loading = useSelector(selectLoading);

  useEffect(() => {
    let interval;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            clearInterval(interval);
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }

        if (seconds === 1 && minutes === 0) {
          setIsActive(false);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const resetTimer = () => {
    setIsActive(true);
    setMinutes(1);
    setSeconds(0);
  };

  const formRef = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);

  const focusNextInput = (currentRef, nextRef) => {
    if (currentRef.current.value.length >= currentRef.current.maxLength) {
      nextRef.current && nextRef.current.focus();
    }
  };
  const focusPrevInput = (currentRef, prevRef) => {
    if (currentRef.current.value.length === 0) {
      prevRef.current && prevRef.current.focus();
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (e.target[1].value !== e.target[2].value)
        return message.error("Confirmed password does not match");
      if (!localStorage.forgotEmail) return;
      await AuthService.resetPassword({
        OTP: e.target[0].value,
        email: localStorage.forgotEmail,
        newPassword: e.target[1].value,
      });
      router.push("/dashboard");
    },
    []
  );

  const handleResend = useCallback(async () => {
    if (!localStorage.forgotEmail) return;

    await AuthService.requestPasswordReset({ email: localStorage.forgotEmail });

    if (isActive) return;
    resetTimer();
  }, [isActive]);

  return (
    <div className="flex h-[100vh] flex-col">
      <SlimLayout>
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" black />
          </Link>
        </div>
        <h2 className="mt-20 font-semibold text-[#101828] dark:text-gray-400 text-4xl ">
          Set New Password
        </h2>
        <p className="mt-3 text-[#667085] dark:text-gray-300 text-base font-normal ">
          Please verify OTP and enter a new password
        </p>
        <form
          action="#"
          className="mt-10 grid grid-cols-1 gap-y-8"
          onSubmit={handleSubmit}
        >
          <TextField label="OTP" name="otp" type="text" required />
          <TextField
            label="New Password"
            name="new-password"
            type="password"
            required
          />
          <TextField
            label="Confirm Password"
            name="confirm-password"
            type="password"
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
              <span>Continue</span>
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

export default PasswordReset;
