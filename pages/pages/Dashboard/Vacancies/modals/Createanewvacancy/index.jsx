import React from "react";
import { default as ModalProvider } from "react-modal";
import { Heading, Img } from "../../components";
import CreateANewVacancyInput from "../../components/CreateANewVacancyInput";

const data = [
  { text: "Start from scratch" },
  { text: "Import from ATS" },
  { text: "Upload existing job text" },
  { text: "Paste a URL" },
];

export default function Createanewvacancy({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm pl-[272px] pr-[271px] md:p-5 md:px-5">
        <div className="flex flex-col gap-[29px] rounded-[12px] bg-white-A700 py-8 pl-6 pr-[23px] sm:p-5">
          <div className="flex items-center justify-between gap-5 pl-[286px] md:pl-5">
            <Heading size="7xl" as="h1" className="!text-black-900_01">
              Create a new vacancy
            </Heading>
            <Img
              src="/images/img_arrow_right_blue_gray_400.svg"
              alt="arrowright"
              className="h-[24px] w-[24px] self-start"
            />
          </div>
          <div className="grid grid-cols-2 justify-center gap-6 md:grid-cols-1">
            {data.map((d, index) => (
              <CreateANewVacancyInput {...d} key={"gridplusone" + index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
