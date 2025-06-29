import React from "react";
import { Steps } from "antd";
import { useRouter } from "next/router";

const steps = [
  { title: "Brand Style", path: "/onboarding" },
  { title: "Hiring team", path: "/onboarding/hiring-team" },
  { title: "Location", path: "/onboarding/location" },
  ///onboarding/hiring-team
];

export function Stepper() {
  const router = useRouter();
  const pathname = router.pathname;
  console.log(pathname);
  //exemples of the pathname : '/onboarding/hiring-team' ,/onboarding , /onboarding/hiring-team/recruiter?id=3  , /onboarding/location , /onboarding/location/add ,
  const currentStep = steps.findIndex((step) => {
    console.log(pathname);
    console.log(step.path);
    return pathname === step.path;
  });

  console.log("currentStep", currentStep); //currentStep should now return the correct step index

  return (
    <div className="z-10 px-6 py-4 bg-white border-gray-200 md:border-b">
      <Steps
        rootClassName="flex justify-center  text-indigo-500"
        className="w-full text-xs "
        current={currentStep}
        items={steps.map((step, index) => ({
          ...step,
          // title: step.title,
          // status:
          //   index < currentStep
          //     ? "finish"
          //     : index === currentStep
          //     ? "process"
          //     : "wait",
        }))}
      />
    </div>
  );
}
