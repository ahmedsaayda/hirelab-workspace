import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Skeleton, Spin } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { currencies } from "../../../src/data/currencies";
import { getPartner, selectLoading } from "../../../src/redux/auth/selectors";
import AuthService from "../../../src/services/AuthService";
import { featureMap } from "../Landing/Pricing";
import { partner } from "../../../src/constants";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Subscription = () => {
  const [auth, setAuth] = useState(null);
  const [frequency, setFrequency] = useState(0);
  const router = useRouter();;
  const loading = useSelector(selectLoading);

  const myCurrency = useMemo(
    () => currencies.find((c) => c.iso === partner?.currency)?.symbol ?? "$",
    []
  );

  useEffect(() => {
    AuthService.me().then((data) => {
      setAuth(data.data);
    });
  }, []);

  if (!auth) return <Skeleton active />;
  return (
    <>
      <div
        className="fixed left-0 top-0 w-[100vw] h-[100vh]"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          backgroundImage: `url('/images/screenshots/payroll.png')`,
          filter: "blur(10px)",
        }}
      />
      <div className="bg-transparent sm:p-32">
        <div className="bg-white dark:bg-gray-900 py-8 sm:py-12 rounded-lg">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Account Activation
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-400  sm:text-5xl">
                Unlock the potential
              </p>
            </div>
            {auth?.upgradeNeeded ? (
              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                To access the plethora of tools and resources available on our
                platform, please choose a subscription plan that aligns with
                your requirements. Based on your current usage, we recommend
                subscribing to the {auth.upgradeNeeded?.name} package or a
                higher-tier plan.
              </p>
            ) : (
              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                To unlock the full suite of tools and resources available
                through our platform, please select a subscription plan that
                best fits your needs.
              </p>
            )}

            <div className="mt-16 flex justify-center">
              <RadioGroup
                value={frequency}
                onChange={setFrequency}
                className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
              >
                <RadioGroup.Label className="sr-only">
                  Payment frequency
                </RadioGroup.Label>
                {[0, 1].map((option) => (
                  <RadioGroup.Option
                    key={option}
                    value={option}
                    className={({ checked }) =>
                      classNames(
                        checked ? "bg-indigo-600 text-white" : "text-gray-500",
                        "cursor-pointer rounded-full px-2.5 py-1"
                      )
                    }
                  >
                    <span>{option === 0 ? "Monthly" : "Annually"}</span>
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {partner?.pricing
                ?.filter?.(
                  (t) =>
                    // If a value here is null, it means unlimited
                    !auth?.upgradeNeeded ||
                    ((t.maxFunnels === null ||
                      t.maxFunnels >= auth.upgradeNeeded.maxFunnels) &&
                      (t.maxCandidates === null ||
                        t.maxCandidates >= auth.upgradeNeeded.maxCandidates) &&
                      (t.maxMessaging === null ||
                        t.maxMessaging >= auth.upgradeNeeded.maxMessaging) &&
                      (t.maxTeamSize === null ||
                        t.maxTeamSize >= auth.upgradeNeeded.maxTeamSize))
                )
                ?.map((tier, i) => (
                  <div
                    key={i}
                    className={classNames(
                      tier.featured
                        ? "ring-2 ring-indigo-600"
                        : "ring-1 ring-gray-200",
                      "rounded-3xl p-8 xl:p-10"
                    )}
                  >
                    <div className="flex items-center justify-between gap-x-4">
                      <h3
                        id={i}
                        className={classNames(
                          tier.featured
                            ? "text-indigo-600"
                            : "text-gray-900 dark:text-gray-400 ",
                          "text-lg font-semibold leading-8"
                        )}
                      >
                        {tier.name}
                      </h3>
                      {tier.featured ? (
                        <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                          Most popular
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {tier.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-400 ">
                        {myCurrency}
                        {tier[
                          frequency === 0 ? "monthlyPrice" : "annualPrice"
                        ] / 100}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">
                        / {frequency === 0 ? "month" : "year"}
                      </span>
                    </p>

                    <p className="order-first font-display text-sm font-light tracking-tight text-black dark:text-gray-400 ">
                      + {myCurrency}
                      {tier[
                        frequency === 0
                          ? "extraPerTeamMonthly"
                          : "extraPerTeamAnnual"
                      ] / 100}{" "}
                      per team mate
                    </p>

                    <a
                      onClick={async () => {
                        if (loading) return;

                        const res = await AuthService.createSubscription({
                          tier: tier._id,
                          return_url: window.location.href,
                          interval: frequency === 0 ? "month" : "year",
                        });

                        if (res.data.paymentLink)
                          window.location.href = res.data.paymentLink;
                        else router.push("/dashboard");
                      }}
                      aria-describedby={i}
                      className={classNames(
                        tier.featured
                          ? "bg-indigo-600 text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500"
                          : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                        "cursor-pointer mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      {loading ? <Spin>Buy Plan</Spin> : <>Buy plan</>}
                    </a>
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {featureMap[feature]}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>

            <div
              className="mt-10 flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500 cursor-pointer"
              onClick={() => {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                window.location.href = "/";
              }}
            >
              <div className="border w-24 rounded-lg p-1">Sign out</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
