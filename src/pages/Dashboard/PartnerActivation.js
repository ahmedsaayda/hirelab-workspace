import { CheckCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import AuthService from "../../services/AuthService";

const PartnerActivation = () => {
  const handleSubmit = async () => {
    const res = await AuthService.partnerActivation({
      return_url: window.location.href,
    });
    window.location.href = res.data.link;
  };

  return (
    <>
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              License Activated
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Congratulations! Your software license has been activated.</p>
            </div>
          </div>
        </div>
      </div>

      <a
        onClick={handleSubmit}
        className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
      >
        Billing
      </a>
    </>
  );
};

export default PartnerActivation;
