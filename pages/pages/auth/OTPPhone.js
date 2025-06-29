import Cookies from "js-cookie";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectLoading } from "../../redux/auth/selectors";
import AuthService from "../../service/AuthService";

const OTP = () => {
  const [me, setMe] = useState(null);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();;
  const loading = useSelector(selectLoading);

  useEffect(() => {
    AuthService.me().then((data) => setMe(data.data.me));
  }, []);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await AuthService.otpVerify({
        OTP: `${e.target[0].value}${e.target[1].value}${e.target[2].value}${e.target[3].value}`,
      });
      router.push("/dashboard");
    },
    [navigate]
  );

  const handleResend = useCallback(async () => {
    await AuthService.otpRequest({ purpose: "phone" });
    if (isActive) return;
    resetTimer();
  }, [isActive]);

  useEffect(() => {
    AuthService.otpRequest({ purpose: "phone" });
  }, []);

  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
        <div className="relative bg-white dark:bg-gray-900 px-6 pt-10 pb-9 shadow-xl dark:shadow-gray-400/50 hover:shadow-gray-600/50  mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Phone Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>
                  We have sent a code via SMS to{" "}
                  {me?.phone?.slice(0, 4) + "**" + me?.phone?.slice(-3)}
                </p>
              </div>
            </div>
            <div>
              <form
                onSubmit={handleSubmit}
                ref={formRef}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.target.submit();
                }}
              >
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    <div className="w-16 h-16 ">
                      <input
                        ref={inputRef1}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 dark:border-gray-600  text-lg bg-white dark:bg-gray-900 focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        autoFocus
                        maxLength={1}
                        onChange={() => focusNextInput(inputRef1, inputRef2)}
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        ref={inputRef2}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 dark:border-gray-600  text-lg bg-white dark:bg-gray-900 focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        maxLength={1}
                        onChange={() => focusNextInput(inputRef2, inputRef3)}
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        ref={inputRef3}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 dark:border-gray-600  text-lg bg-white dark:bg-gray-900 focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        maxLength={1}
                        onChange={() => focusNextInput(inputRef3, inputRef4)}
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        ref={inputRef4}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 dark:border-gray-600  text-lg bg-white dark:bg-gray-900 focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        maxLength={1}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-5">
                    <div>
                      <Button
                        loading={loading}
                        type="submit"
                        color=""
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Verify
                      </Button>
                    </div>
                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't receive the code?</p>{" "}
                      <a
                        className="flex flex-row items-center text-blue-600"
                        href="#"
                        rel="noopener noreferrer"
                        onClick={handleResend}
                      >
                        Resend{" "}
                        {isActive && (
                          <>
                            (
                            {`${String(minutes).padStart(2, "0")}:${String(
                              seconds
                            ).padStart(2, "0")}`}
                            )
                          </>
                        )}
                      </a>
                    </div>

                    <div
                      className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500 cursor-pointer"
                      onClick={() => {
                        Cookies.remove("accessToken");
                        Cookies.remove("refreshToken");
                        window.location.href = "/";
                      }}
                    >
                      Sign out
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
