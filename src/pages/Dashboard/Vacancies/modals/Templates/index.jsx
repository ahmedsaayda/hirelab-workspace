import React from "react";
import { default as ModalProvider } from "react-modal";
const CloseSVG = ({ onClick, fillColor, height = 16, width = 16 }) => (
  <svg onClick={onClick} style={{ fill: fillColor, cursor: 'pointer' }} width={width} height={height} viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);
import { Button, Heading, Img, Input } from "../../components/components";
import TemplatesButtonbase from "../../components/components/TemplatesButtonbase";
import TemplatesButtonbase1 from "../../components/components/TemplatesButtonbase1";

const data = [
  { title: "Template #1", department: "Department", vacancy: "Vacancy" },
  { title: "Template #2", department: "Department", vacancy: "Vacancy" },
  { title: "Template #3", department: "Department", vacancy: "Vacancy" },
];

export default function Templates({ isOpen, ...props }) {
  const [searchBarValue150, setSearchBarValue150] = React.useState("");
  const [searchBarValue151, setSearchBarValue151] = React.useState("");
  const [searchBarValue153, setSearchBarValue153] = React.useState("");

  return (
    <>
      <div className="container-sm pl-[156px] pr-[155px] md:p-5 md:px-5">
        <div className="rounded-[12px] bg-white-A700">
          <div className="flex flex-col gap-8 rounded-[12px] border-r border-solid border-blue_gray-50 p-8 sm:p-5">
            <div className="flex flex-col gap-[31px]">
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-8 md:flex-col">
                  <Heading
                    size="7xl"
                    as="h1"
                    className="mb-[7px] self-end !text-black-900_01"
                  >
                    Add template
                  </Heading>
                  <Input
                    name="search"
                    placeholder={`Search`}
                    value={searchBarValue153}
                    onChange={(e) => setSearchBarValue153(e)}
                    prefix={
                      <Img
                        src="/images/img_search_blue_gray_500.svg"
                        alt="search"
                        className="h-[20px] w-[20px] cursor-pointer"
                      />
                    }
                    suffix={
                      searchBarValue153?.length > 0 ? (
                        <CloseSVG
                          onClick={() => setSearchBarValue153("")}
                          fillColor="#667084ff"
                        />
                      ) : null
                    }
                    className="flex-grow gap-2 rounded-[22px] text-blue_gray-500 sm:pr-5"
                  />
                  <Img
                    src="/images/img_arrow_right_blue_gray_400.svg"
                    alt="arrowright"
                    className="h-[24px] w-[24px] md:w-full"
                  />
                </div>
                <div className="h-px bg-blue_gray-50" />
              </div>
              <div className="flex gap-6 md:flex-col">
                <div className="flex w-full flex-col items-center gap-4 border-r border-solid border-blue_gray-50 bg-white-A700 pb-12 pr-6 md:pb-5 sm:pr-5">
                  <div className="flex self-start px-4">
                    <Heading
                      as="h2"
                      className="!font-semibold !text-blue_gray-500_01"
                    >
                      RECRUITER
                    </Heading>
                  </div>
                  <div className="flex flex-col items-center self-stretch pt-2.5">
                    <div className="flex items-center gap-3">
                      <Img
                        src="/images/img_user_01_blue_gray_500_01.svg"
                        alt="userone"
                        className="h-[18px] w-[18px]"
                      />
                      <Heading
                        size="3xl"
                        as="h3"
                        className="!text-blue_gray-700"
                      >
                        Name of recruiter
                      </Heading>
                    </div>
                    <Input
                      size="md"
                      shape="round"
                      type="text"
                      name="name"
                      placeholder={`Name of recruiter`}
                      prefix={
                        <Img
                          src="/images/img_user_01.svg"
                          alt="user-01"
                          className="h-[18px] w-[18px]"
                        />
                      }
                      className="mt-[18px] gap-3 self-stretch font-semibold sm:pr-5"
                    />
                    <div className="mt-2 flex justify-center self-stretch rounded-lg p-2.5">
                      <div className="flex items-center gap-3">
                        <Img
                          src="/images/img_user_01_blue_gray_500_01.svg"
                          alt="userone"
                          className="h-[18px] w-[18px]"
                        />
                        <Heading
                          size="3xl"
                          as="h4"
                          className="!text-blue_gray-700"
                        >
                          Name of recruiter
                        </Heading>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-4 border-r border-solid border-blue_gray-50 bg-white-A700">
                  <div className="flex self-start px-4">
                    <Heading
                      as="h5"
                      className="!font-semibold !text-blue_gray-500_01"
                    >
                      DEPARTMENT
                    </Heading>
                  </div>
                  <div className="flex flex-col gap-[18px] self-stretch pb-2.5">
                    <Input
                      size="md"
                      shape="round"
                      name="search"
                      placeholder={`IT`}
                      value={searchBarValue151}
                      onChange={(e) => setSearchBarValue151(e)}
                      prefix={
                        <Img
                          src="/images/img_search_light_blue_a700_18x18.svg"
                          alt="search"
                          className="h-[18px] w-[18px] cursor-pointer"
                        />
                      }
                      suffix={
                        searchBarValue151?.length > 0 ? (
                          <CloseSVG
                            onClick={() => setSearchBarValue151("")}
                            height={18}
                            width={18}
                            fillColor="#0E87FEff"
                          />
                        ) : null
                      }
                      className="flex-grow gap-3 font-semibold sm:pr-5"
                    />
                    <div className="flex items-center gap-3">
                      <Img
                        src="/images/img_search_1.svg"
                        alt="search"
                        className="h-[18px] w-[18px] self-start"
                      />
                      <Heading
                        size="3xl"
                        as="h6"
                        className="self-end !text-blue_gray-700"
                      >
                        Marketing
                      </Heading>
                    </div>
                    <div className="flex items-center gap-3">
                      <Img
                        src="/images/img_trend_up_01.svg"
                        alt="trendupone"
                        className="h-[18px] w-[18px]"
                      />
                      <Heading
                        size="3xl"
                        as="p"
                        className="!text-blue_gray-700"
                      >
                        Sales
                      </Heading>
                    </div>
                    <div className="flex items-center gap-3">
                      <Img
                        src="/images/img_credit_card_lock.svg"
                        alt="creditcard"
                        className="h-[18px] w-[18px]"
                      />
                      <Heading
                        size="3xl"
                        as="p"
                        className="!text-blue_gray-700"
                      >
                        Finance
                      </Heading>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-4 bg-white-A700">
                  <div className="flex self-start px-4">
                    <Heading
                      as="p"
                      className="!font-semibold !text-blue_gray-500_01"
                    >
                      VACANCY
                    </Heading>
                  </div>
                  <div className="flex flex-col gap-2 self-stretch">
                    <div className="flex justify-center rounded-lg p-2.5">
                      <div className="flex items-center gap-3">
                        <Img
                          src="/images/img_flex_align_top.svg"
                          alt="flexaligntop"
                          className="h-[18px] w-[18px]"
                        />
                        <Heading
                          size="3xl"
                          as="p"
                          className="!text-blue_gray-700"
                        >
                          Back office
                        </Heading>
                      </div>
                    </div>
                    <Input
                      size="md"
                      shape="round"
                      name="search"
                      placeholder={`Marketing`}
                      value={searchBarValue150}
                      onChange={(e) => setSearchBarValue150(e)}
                      prefix={
                        <Img
                          src="/images/img_search_2.svg"
                          alt="search"
                          className="h-[18px] w-[18px] cursor-pointer"
                        />
                      }
                      suffix={
                        searchBarValue150?.length > 0 ? (
                          <CloseSVG
                            onClick={() => setSearchBarValue150("")}
                            height={18}
                            width={18}
                            fillColor="#0E87FEff"
                          />
                        ) : null
                      }
                      className="gap-3 font-semibold sm:pr-5"
                    />
                    <div className="flex flex-col gap-2 md:flex-row sm:flex-col">
                      {[...Array(2)].map((d, index) => (
                        <TemplatesButtonbase
                          trendupimage="images/img_trend_up_01.svg"
                          importtext="Sales"
                          key={"listsalesone" + index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white-A700 pr-6 sm:pr-5">
                <div className="flex flex-col gap-4">
                  <div className="flex self-start px-4">
                    <Heading
                      as="p"
                      className="!font-semibold !text-blue_gray-500_01"
                    >
                      AVAILABLE TEMPLATES
                    </Heading>
                  </div>
                  <div className="flex gap-4 md:flex-col">
                    {data.map((d, index) => (
                      <TemplatesButtonbase1
                        {...d}
                        key={"templates" + index}
                        className="bg-gray-100_01"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="h-px bg-blue_gray-50_01" />
              <div className="flex gap-5">
                <Button
                  shape="round"
                  className="w-full border border-solid border-blue_gray-100 font-semibold sm:px-5"
                >
                  Back
                </Button>
                <Button
                  shape="round"
                  className="w-full border border-solid border-light_blue-A700 font-semibold sm:px-5"
                >
                  Add templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
