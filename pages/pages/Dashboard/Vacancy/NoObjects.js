import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { selectDarkMode } from "../../../redux/auth/selectors";
import CrudService from "../../../service/CrudService";
import OnboardUser from "../OnboardUser";

const NoObjects = ({ props, onboarding, setOnboarding }) => {
  const darkMode = useSelector(selectDarkMode);
  return (
    <>
      <div className="container mx-auto p-4 flex-column" id="vacancyContainer">
        <div className="relative flex items-center mb-3 ">
          <div className="flex flex-col w-full  items-start">
            <h1 className="text-3xl font-semibold mb-1">{props.title}</h1>
            <p className="font-normal text-base text-[#475467]">
              {props.subtitle}
            </p>
          </div>
          <button
            className="bg-gradient text-sm  hover:bg-indigo-700 text-white font-semibold  leading-6 whitespace-nowrap py-2.5 px-4 rounded-md"
            onClick={props.create}
          >
            {props.buttontext}
          </button>
        </div>
        <div className="py-9 h-full">
          <div className="flex flex-col items-center justify-center  md:p-5 ">
            <img alt="user onboarding" src="/noHeroes.png" />
            <div className="flex flex-col text-center justify-end align-center ">
              <p className="text-base font-semibold mt-1 px-10">
                {props.centraltext}
              </p>
              <p className="text-sm font-normal text-[#667085]">
                Create one now.
              </p>

              <div className="flex w-full justify-between mt-5 gap-2">
                <Link
                  href="/dashboard/home"
                  className="w-full bg-white border border-1 border-[#D0D5DD] text-[#344054] dark:bg-gray-600 dark:text-gray-400 rounded-md py-2.5 px-4  text-sm leading-6 font-semibold"
                >
                  Maybe Later
                </Link>
                <button
                  onClick={props.create}
                  className="w-full bg-gradient text-white dark:bg-gray-600 dark:text-gray-400 rounded-md py-2.5 px-4 text-sm leading-6 font-semibold"
                >
                  + Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={onboarding}
        wrapClassName={`${darkMode ? "dark" : ""}`}
        onCancel={() => setOnboarding(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
      >
        <OnboardUser />
      </Modal>
    </>
  );
};

export default NoObjects;
