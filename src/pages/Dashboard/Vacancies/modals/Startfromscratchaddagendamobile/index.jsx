import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components/components";
import Sidebar1 from "../../components/components/Sidebar1";
import StartFromScratchAddAgendaMobileRowsalary from "../../components/components/StartFromScratchAddAgendaMobileRowsalary";

const data = [
  {
    image: "images/img_vertical_container.svg",
    salarylabel: "Salary Range:",
    salaryvalue: "$ 110k -125k / year",
  },
  {
    image: "images/img_vertical_container_blue_700_01.svg",
    salarylabel: "Hours",
    salaryvalue: "Full-time",
  },
  {
    image: "images/img_location_pin_svgrepo_com.png",
    salarylabel: "Location",
    salaryvalue: "San Francisco, CA",
  },
];

export default function Startfromscratchaddagendamobile({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex flex-1 justify-center md:flex-col md:self-stretch">
          <Sidebar1 className="md:hidden md:gap-[30px] sm:pt-5" />
          <div className="flex flex-1 flex-col gap-[70px] border-r border-solid border-blue_gray-50 px-[30px] pb-8 pt-[30px] md:gap-[52px] md:self-stretch sm:gap-[35px] sm:p-5">
            <div className="flex flex-col gap-[31px]">
              <div className="flex items-center justify-between gap-5">
                <Heading size="7xl" as="h1" className="!text-black-900_01">
                  Start from scratch
                </Heading>
                <Img
                  src="/images/img_arrow_right_blue_gray_400.svg"
                  alt="arrowright"
                  className="h-[24px] w-[24px]"
                />
              </div>
              <div className="h-px bg-blue_gray-50" />
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-5">
                    <Text as="p" className="self-end !text-blue_gray-700">
                      Task Name
                    </Text>
                    <div className="flex py-px">
                      <Text
                        as="p"
                        className="!font-normal !text-blue_gray-700_01"
                      >
                        18/40
                      </Text>
                    </div>
                  </div>
                  <Input
                    shape="round"
                    name="name"
                    placeholder={`Assignment Submission`}
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
                <div className="flex gap-3 md:flex-col">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Duration
                      </Text>
                    </div>
                    <div className="flex justify-evenly gap-3 rounded-lg border border-solid border-blue_gray-100 bg-white-A700 py-3">
                      <div className="flex w-[42%] flex-col items-center gap-1.5">
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                        <Input
                          size="xs"
                          shape="round"
                          name="frame618"
                          placeholder={`00`}
                          className="self-stretch border border-solid border-blue_gray-100 font-medium sm:px-5"
                        />
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                      </div>
                      <div className="flex w-[42%] flex-col items-center gap-1.5">
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                        <Button
                          size="sm"
                          shape="round"
                          className="w-full border border-solid border-blue_gray-100 font-medium !text-blue_gray-700 sm:px-5"
                        >
                          Hours
                        </Button>
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Day
                      </Text>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-solid border-blue_gray-100 bg-white-A700 p-3">
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                      <Input
                        size="xs"
                        shape="round"
                        name="weekday"
                        placeholder={`Thursday`}
                        className="self-stretch border border-solid border-blue_gray-100 font-medium sm:px-5"
                      />
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup_eleven"
                        className="h-[24px] w-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Time
                      </Text>
                    </div>
                    <div className="flex items-center justify-evenly rounded-lg border border-solid border-blue_gray-100 bg-white-A700 py-3">
                      <div className="flex w-[39%] flex-col items-center gap-1.5">
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                        <Input
                          size="xs"
                          shape="round"
                          name="frame618_one"
                          placeholder={`00`}
                          className="self-stretch border border-solid border-blue_gray-100 font-medium sm:px-5"
                        />
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup_fifteen"
                          className="h-[24px] w-[24px]"
                        />
                      </div>
                      <Heading
                        size="3xl"
                        as="h2"
                        className="!text-black-900_01"
                      >
                        :
                      </Heading>
                      <div className="flex w-[39%] flex-col items-center gap-1.5">
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                        <Input
                          size="xs"
                          shape="round"
                          name="frame618_two"
                          placeholder={`00`}
                          className="self-stretch border border-solid border-blue_gray-100 font-medium sm:px-5"
                        />
                        <Img
                          src="/images/img_arrow_up_black_900_01.svg"
                          alt="arrowup"
                          className="h-[24px] w-[24px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-5">
                    <div className="flex items-center gap-2">
                      <Img
                        src="/images/img_magic_wand_01.svg"
                        alt="magicwandone"
                        className="h-[20px] w-[20px] self-start"
                      />
                      <Text as="p" className="self-end !text-light_blue-A700">
                        Description
                      </Text>
                    </div>
                    <div className="flex self-start py-px">
                      <Text
                        as="p"
                        className="!font-normal !text-blue_gray-700_01"
                      >
                        18/400
                      </Text>
                    </div>
                  </div>
                  <TextArea
                    shape="round"
                    name="input_one"
                    placeholder={`We are seeking a talented and creative Product Designer to join our dynamic team. As a Product Designer at Hirelab Inc`}
                    className="!border-blue_gray-100 leading-6 text-blue_gray-700"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Image
                    </Text>
                  </div>
                  <div className="flex justify-end rounded-lg border border-dashed border-blue_gray-100 bg-white-A700 pb-[5px] pt-[26px] sm:pt-5">
                    <div className="flex w-[65%] items-start justify-between gap-5 md:w-full md:p-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex flex-wrap gap-1 self-start">
                          <Heading
                            size="3xl"
                            as="h3"
                            className="!text-light_blue-A700"
                          >
                            Click to upload
                          </Heading>
                          <Text
                            as="p"
                            className="!font-normal !text-blue_gray-700"
                          >
                            or drag and drop
                          </Text>
                        </div>
                        <Text size="lg" as="p" className="!text-blue_gray-700">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </Text>
                      </div>
                      <div className="relative mt-[9px] h-[48px] w-[10%]">
                        <div className="absolute left-[0.00px] top-[0.00px] m-auto flex items-center px-px">
                          <Heading
                            size="lg"
                            as="h4"
                            className="relative z-[1] mb-[5px] flex items-center justify-center self-end rounded-sm bg-red-700 p-0.5 !font-plusjakartasans !text-white-A700"
                          >
                            PNG
                          </Heading>
                          <Img
                            src="/images/img_file.svg"
                            alt="file"
                            className="relative ml-[-22px] h-[40px]"
                          />
                        </div>
                        <Img
                          src="/images/img_cursor.svg"
                          alt="cursor"
                          className="absolute bottom-[0.00px] right-[0.00px] z-[2] m-auto h-[20px] w-[20px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="h-px bg-blue_gray-50_01" />
              <div className="flex flex-col gap-5">
                <Button shape="round" className="w-full font-semibold sm:px-5">
                  Add agenda
                </Button>
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
                    Save & Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[32%] border-r border-solid border-blue_gray-50 pl-7 pr-[23px] pt-7 md:w-full sm:px-5 sm:pt-5">
          <div>
            <Tabs
              className="flex flex-col gap-[25px]"
              selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded"
              selectedTabPanelClassName="relative tab-panel--selected"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex w-[69%] items-start justify-between gap-5">
                  <Heading size="7xl" as="h2" className="!text-black-900_01">
                    Preview
                  </Heading>
                  <TabList className="flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 px-[5px] pb-2 pt-[5px]">
                    <Tab className="self-start text-xs font-semibold text-white-A700">
                      Mobile
                    </Tab>
                    <Tab className="self-end text-xs font-medium text-light_blue-A700">
                      Desktop
                    </Tab>
                  </TabList>
                </div>
                <Img
                  src="/images/img_expand_06.svg"
                  alt="expandsix"
                  className="h-[20px] w-[20px]"
                />
              </div>
              {[...Array(2)].map((_, index) => (
                <TabPanel
                  key={`tab-panel${index}`}
                  className="absolute items-center"
                >
                  <div className="w-full">
                    <div className="flex flex-col gap-[31px]">
                      <div className="h-px bg-blue_gray-50" />
                      <div className="flex flex-col gap-[5px]">
                        <div className="relative h-[498px]">
                          <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[98%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="relative mt-[-5px] h-[5px] w-[6px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="mt-[25px] flex w-[91%] flex-col gap-[47px] self-center bg-white-A700_f2 px-4 pb-[63px] pt-6 md:w-full md:pb-5 sm:py-5">
                              <div className="flex flex-col items-center">
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  Let's check the
                                </Text>
                                <Heading size="9xl" as="h3">
                                  What Your Week Looks Like
                                </Heading>
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="w-full text-center !font-satoshi leading-6"
                                >
                                  We are seeking a talented and creative Product
                                  Designer to join our dynamic team. As a
                                  Product Designer at Hirelab Inc
                                </Text>
                              </div>
                              <div className="ml-[7px] md:ml-0">
                                <div className="flex flex-col items-end gap-[29px]">
                                  <div className="flex flex-col items-start gap-[26px] self-stretch">
                                    <div className="flex justify-between gap-5 self-stretch">
                                      <div className="flex flex-col items-start rounded border border-solid border-blue-A200 bg-blue-A200 px-[11px] pt-[5px] shadow-4xl">
                                        <Heading
                                          size="s"
                                          as="h4"
                                          className="!text-[7.68px] !text-white-A700"
                                        >
                                          Assignment Submission
                                        </Heading>
                                        <Heading
                                          size="xs"
                                          as="h5"
                                          className="!text-[5.32px] !text-white-A700"
                                        >
                                          10:00 am - 02:00 pm
                                        </Heading>
                                      </div>
                                      <div className="flex flex-col items-start rounded border border-solid border-orange-A200 bg-orange-A200 px-[11px] pt-[5px] shadow-5xl">
                                        <Heading
                                          size="s"
                                          as="h6"
                                          className="!text-[7.68px] !text-white-A700"
                                        >
                                          Meeting with recruiters
                                        </Heading>
                                        <Heading
                                          size="xs"
                                          as="p"
                                          className="!text-[5.32px] !text-white-A700"
                                        >
                                          05:00 pm - 08:00 pm
                                        </Heading>
                                      </div>
                                    </div>
                                    <div className="ml-[38px] flex flex-col items-start gap-0.5 rounded border border-solid border-pink-300 bg-pink-300 px-[11px] pt-[5px] shadow-3xl md:ml-0">
                                      <Heading
                                        size="s"
                                        as="p"
                                        className="!text-[7.68px] !text-white-A700"
                                      >
                                        Meeting with recruiters
                                      </Heading>
                                      <Heading
                                        size="xs"
                                        as="p"
                                        className="!text-[5.32px] !text-white-A700"
                                      >
                                        11:00 am - 03:00 pm
                                      </Heading>
                                    </div>
                                  </div>
                                  <div className="mr-[59px] flex flex-col items-start rounded border border-solid border-green-500 bg-green-500 px-[11px] pt-[5px] shadow-2xl md:mr-0">
                                    <Heading
                                      size="s"
                                      as="p"
                                      className="!text-[7.68px] !text-white-A700"
                                    >
                                      Meeting with recruiters
                                    </Heading>
                                    <Heading
                                      size="xs"
                                      as="p"
                                      className="!text-[5.32px] !text-white-A700"
                                    >
                                      02:00 pm - 07:00 pm
                                    </Heading>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                          <div className="absolute bottom-[0.00px] right-[0.00px] m-auto flex w-[40%] flex-col items-start">
                            <Img
                              src="/images/img_save.svg"
                              alt="save"
                              className="h-[24px]"
                            />
                            <div className="relative z-[3] h-[8px] w-[8px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            <Button
                              size="lg"
                              shape="square"
                              className="relative mt-[-3px] min-w-[107px] self-center tracking-[0.09px] !shadow-lg"
                            >
                              Tom Jason
                            </Button>
                          </div>
                        </div>
                        <div className="relative h-[228px]">
                          <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex w-[91%] flex-col gap-6 md:relative">
                            {data.map((d, index) => (
                              <StartFromScratchAddAgendaMobileRowsalary
                                {...d}
                                key={"listsalary" + index}
                                className="flex-1 rounded-[20px] px-6 pb-5 sm:px-5"
                              />
                            ))}
                          </div>
                          <div className="absolute bottom-[11.69px] left-0 right-0 m-auto h-[158px] w-full rotate-[180deg] bg-gradient" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
