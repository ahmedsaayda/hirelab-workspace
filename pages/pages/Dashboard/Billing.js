import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Skeleton, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { currencies } from "../../data/currencies";
import { getPartner, selectLoading } from "../../redux/auth/selectors";
import AuthService from "../../service/AuthService";
import CornerRibbon from "react-corner-ribbon";
import { padding } from "polished";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Billing = () => {
  const [me, setMe] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const partner = useSelector(getPartner);
  const [frequency, setFrequency] = useState(0); // 0: monthly, 1: annual
  const loading = useSelector(selectLoading);
  const [plans, setPlans] = useState([]);

  const myCurrency = useMemo(
    () => currencies.find((c) => c.iso === partner?.currency)?.symbol ?? "€",
    [partner]
  );

  useEffect(() => {
    AuthService.me().then((data) => {
      setMe(data.data);
      if (data.data?.plans) setPlans(data.data.plans);
    });
    AuthService.getSubscription().then((data) => setSubscription(data.data));
  }, []);

  if (!me) return <Skeleton active />;

  return (
    <div className="bg-transparent sm:p-8">
      <div className="bg-white dark:bg-gray-900 py-4 sm:py-8 rounded-lg">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-7 text-indigo-600 mb-2">
              Try any paid plan for 7 days, completely free.
            </h2>
            <p className="text-lg text-gray-700">
              Choose a plan and get access to all its features
            </p>
          </div>
          <div className="mt-8 flex justify-center">
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
                  <span>
                    {option === 0 ? "Monthly pricing" : "Annual pricing per month"}
                  </span>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
          {plans.length > 0 && (
            <div className="isolate mx-auto mt-10 grid max-w-7xl gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={classNames(
                    plan.featured
                      ? "ring-2 ring-indigo-600"
                      : "ring-1 ring-gray-200",
                    "rounded-3xl p-8 xl:p-10 flex flex-col justify-between",
                    "relative"
                  )}
                >
                  {plan.featured && (

                    <CornerRibbon
                      position="top-right"
                      backgroundColor="red"
                      fontColor="#fff"
                      style={{
                        fontWeight: "bold",
                        fontSize: 12,
                        letterSpacing: 1,
                        padding: 10,
                        paddingRight: 50,
                        paddingLeft: 50,
                        top: -2,
                        right: -2
                      }}
                    >
                      MOST POPULAR
                    </CornerRibbon>

                        )}
                  <div>
                    <div className="flex items-center justify-between gap-x-4">
                      <h3
                        className={classNames(
                          plan.featured
                            ? "text-indigo-600"
                            : "text-gray-900 dark:text-gray-400 ",
                          "text-lg font-semibold leading-8"
                        )}
                      >
                        {plan.name}
                      </h3>
                      {plan.featured ? (
                        <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                          
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {plan.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-400 ">
                        {plan.monthlyPrice === null && plan.annualPrice === null
                          ? "Contact us"
                          : frequency === 0
                          ? `${myCurrency}${plan.monthlyPrice}`
                          : `${myCurrency}${plan.annualPrice}`}
                      </span>
                      {plan.monthlyPrice !== null && plan.annualPrice !== null && (
                        <span className="text-sm font-semibold leading-6 text-gray-600">
                          / {frequency === 0 ? "month" : "month (annual)"}
                        </span>
                      )}
                    </p>
                    {plan.note && (
                      <p className="text-xs text-gray-500 mt-2">{plan.note}</p>
                    )}
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
                    >
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <button
                      className={classNames(
                        plan.featured
                          ? "bg-indigo-600 text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500"
                          : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                        "w-full cursor-pointer rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                      disabled={plan.cta === "Current Plan"}
                      onClick={async () => {
                        if (plan.cta === "Contact Us") {
                          window.location.href = "mailto:support@yourdomain.com";
                        } else if (plan.cta === "Upgrade") {
                          // Simulate upgrade
                          message.success(`Upgraded to ${plan.name}`);
                        }
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Billing Management and Invoices buttons below the plans */}
          <div className="max-w-7xl mx-auto mt-8 flex flex-col gap-4">
            <a
              onClick={async () => {
                if (subscription?.link) window.location.href = subscription?.link;
                else {
                  const res = await AuthService.userActivation({
                    return_url: window.location.href,
                  });
                  window.location.href = res.data.link;
                }
              }}
              className={classNames(
                "w-full",
                "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                "cursor-pointer block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              )}
            >
              Billing Management
            </a>
            <a
              onClick={async () => {
                if (subscription?.link) window.location.href = subscription?.link;
                else {
                  const res = await AuthService.userActivation({
                    return_url: window.location.href,
                  });
                  window.location.href = res.data.link;
                }
              }}
              className={classNames(
                 "w-full",
                "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
                "cursor-pointer block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              )}
            >
              Invoices
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
