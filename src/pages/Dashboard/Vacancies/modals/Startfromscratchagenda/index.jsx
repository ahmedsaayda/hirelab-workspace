import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Text } from "../../components/components";
import Sidebar1 from "../../components/components/Sidebar1";
import StartFromScratchAgendaCheckbox from "../../components/components/StartFromScratchAgendaCheckbox";
import StartFromScratchLeaderIntroductionColumnsalary from "../../components/components/StartFromScratchLeaderIntroductionColumnsalary";

const data = [
  {
    image: "images/img_vertical_container.svg",
    salaryrange: "Salary Range:",
    price: "$ 110k -125k / year",
  },
  {
    image: "images/img_vertical_container_blue_700_01.svg",
    salaryrange: "Hours:",
    price: "Full-time",
  },
  {
    image: "images/img_vertical_container_blue_700_01_45x45.svg",
    salaryrange: "Location:",
    price: "San Francisco, CA",
  },
];

export default function Startfromscratchagenda({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar1 className="md:hidden md:gap-[30px] md:p-5 sm:pt-5" />
        <div className="flex w-[34%] flex-col gap-[158px] border-r border-solid border-blue_gray-50 px-[30px] pb-8 pt-[30px] md:w-full md:gap-[118px] sm:gap-[79px] sm:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex items-center justify-between gap-5">
              <Heading size="7xl" as="h1" className="!text-[#000000]_01">
                Start from scratch
              </Heading>
              <Img
                src="/images/img_arrow_right_blue_gray_400.svg"
                alt="arrowright"
                className="h-[24px] w-[24px]"
              />
            </div>
            <div className="h-px bg-blue_gray-50" />
            <div className="flex gap-[9px] sm:flex-col">
              <div className="flex flex-1 gap-[9px] md:flex-row sm:self-stretch">
                <div className="flex flex-col items-center gap-2 px-2.5">
                  <div className="flex flex-col pt-0.5">
                    <div className="flex flex-col items-center rounded border border-solid border-light_blue-A700 bg-gray-100_01 p-0.5">
                      <Img
                        src="/images/img_check_light_blue_a700_12x12.svg"
                        alt="mon"
                        className="h-[12px] w-[12px]"
                      />
                    </div>
                  </div>
                  <div className="flex self-start py-px">
                    <Text as="p" className="!text-blue_gray-800">
                      Mon
                    </Text>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 px-3">
                  <div className="flex flex-col pt-0.5">
                    <div className="flex flex-col items-center rounded border border-solid border-light_blue-A700 bg-gray-100_01 p-0.5">
                      <Img
                        src="/images/img_check_light_blue_a700_12x12.svg"
                        alt="check"
                        className="h-[12px] w-[12px]"
                      />
                    </div>
                  </div>
                  <div className="flex self-start py-px">
                    <Text as="p" className="!text-blue_gray-800">
                      Tue
                    </Text>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 px-2.5">
                  <Img
                    src="/images/img_input.svg"
                    alt="input"
                    className="h-[18px]"
                  />
                  <div className="flex self-start py-px">
                    <Text as="p" className="!text-blue_gray-800">
                      Wed
                    </Text>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 px-3">
                  <div className="flex flex-col pt-0.5">
                    <div className="flex flex-col items-center rounded border border-solid border-light_blue-A700 bg-gray-100_01 p-0.5">
                      <Img
                        src="/images/img_check_light_blue_a700_12x12.svg"
                        alt="check"
                        className="h-[12px] w-[12px]"
                      />
                    </div>
                  </div>
                  <div className="flex self-start py-px">
                    <Text as="p" className="!text-blue_gray-800">
                      Thu
                    </Text>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 px-4">
                  <div className="flex flex-col pt-0.5">
                    <div className="flex flex-col items-center rounded border border-solid border-light_blue-A700 bg-gray-100_01 p-0.5">
                      <Img
                        src="/images/img_check_light_blue_a700_12x12.svg"
                        alt="check"
                        className="h-[12px] w-[12px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col py-px">
                    <Text
                      as="p"
                      className="h-[17px] w-[17px] !text-blue_gray-800"
                    >
                      Fri
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex w-[28%] gap-[9px] md:flex-row sm:w-full">
                {[...Array(2)].map((d, index) => (
                  <StartFromScratchAgendaCheckbox
                    dayofweek="Sat"
                    key={"listsat" + index}
                    className="px-[13px]"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-5">
              <Img
                src="/images/img_arrow_left_black_900_01.svg"
                alt="arrowleft"
                className="h-[24px] w-[24px] self-start"
              />
              <Button
                size="sm"
                shape="round"
                className="min-w-[92px] border border-solid border-blue_gray-100 font-medium !text-blue_gray-700"
              >
                Thursday
              </Button>
              <Img
                src="/images/img_arrow_right.svg"
                alt="arrowright"
                className="h-[24px] w-[24px] self-start"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-1 flex-col gap-2 rounded-[12px] bg-gray-100_01 px-3 py-2.5">
                <div className="flex justify-between gap-5">
                  <div className="flex w-[36%] items-start justify-center gap-[7px]">
                    <div className="h-[9px] w-[9px] bg-light_blue-A700" />
                    <Text size="xl" as="p" className="!text-blue_gray-500_01">
                      10:00 am - 2:00 pm
                    </Text>
                  </div>
                  <Img
                    src="/images/img_more_vertical.svg"
                    alt="1000_am_200_pm"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <div className="flex">
                  <Heading size="3xl" as="h2" className="!text-gray-900">
                    Assignment Submission
                  </Heading>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-[12px] bg-gray-100_01 px-3 py-2.5">
                <div className="flex justify-between gap-5">
                  <div className="flex w-[35%] items-start justify-center gap-[7px]">
                    <div className="h-[9px] w-[9px] bg-light_blue-A700" />
                    <Text size="xl" as="p" className="!text-blue_gray-500_01">
                      11:00 am - 3:00 pm
                    </Text>
                  </div>
                  <Img
                    src="/images/img_more_vertical.svg"
                    alt="morevertical"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <div className="flex">
                  <Heading size="3xl" as="h3" className="!text-gray-900">
                    Meeting with recruiters
                  </Heading>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-start gap-2.5 rounded-[12px] bg-gray-100_01 px-3 py-2.5">
                <div className="flex justify-between gap-5 self-stretch">
                  <div className="flex w-[34%] items-start justify-center gap-[7px]">
                    <div className="h-[9px] w-[9px] bg-light_blue-A700" />
                    <Text size="xl" as="p" className="!text-blue_gray-500_01">
                      2:00 pm - 7:00 pm
                    </Text>
                  </div>
                  <Img
                    src="/images/img_more_vertical.svg"
                    alt="morevertical"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <Heading size="3xl" as="h4" className="!text-gray-900">
                  Meeting with recruiters
                </Heading>
              </div>
              <div className="flex flex-1 flex-col items-start gap-2.5 rounded-[12px] bg-pink-50 px-3 py-2.5">
                <div className="flex justify-between gap-5 self-stretch">
                  <div className="flex w-[34%] items-start justify-center gap-[7px]">
                    <div className="h-[9px] w-[9px] bg-red-A200" />
                    <Text size="xl" as="p" className="!text-blue_gray-500_01">
                      5:00 pm - 8:00 pm
                    </Text>
                  </div>
                  <Img
                    src="/images/img_more_vertical.svg"
                    alt="morevertical"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <Heading size="3xl" as="h5" className="!text-gray-900">
                  Meeting with recruiters
                </Heading>
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
                Save & Next
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[59%] border-r border-solid border-blue_gray-50 pl-[25px] pr-2.5 pt-[25px] md:w-full sm:pl-5 sm:pt-5">
          <div>
            <Tabs
              className="flex flex-col gap-[25px]"
              selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded"
              selectedTabPanelClassName="relative tab-panel--selected"
            >
              <div className="flex items-center justify-between gap-5">
                <Heading
                  size="7xl"
                  as="h2"
                  className="self-start !text-[#000000]_01"
                >
                  Preview
                </Heading>
                <TabList className="flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 px-[9px] pb-2 pt-[9px]">
                  <Tab className="self-start text-xs font-medium text-light_blue-A700">
                    Mobile
                  </Tab>
                  <Tab className="self-end text-xs font-semibold text-white-A700">
                    Desktop
                  </Tab>
                </TabList>
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
                      <div>
                        <div className="relative h-[567px]">
                          <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="ml-4 mt-[25px] flex flex-col items-center gap-[58px] self-stretch bg-white-A700_f2 px-6 pb-[79px] pt-6 md:ml-0 md:pb-5 sm:gap-[29px] sm:p-5">
                              <div className="flex w-[95%] flex-col items-center md:w-full">
                                <Text
                                  size="4xl"
                                  as="p"
                                  className="!font-satoshi !text-[17.48px]"
                                >
                                  Let’s check the
                                </Text>
                                <Heading
                                  size="10xl"
                                  as="h3"
                                  className="!text-[24.97px]"
                                >
                                  What Your Week Looks Like
                                </Heading>
                                <Text
                                  size="md"
                                  as="p"
                                  className="w-[69%] text-center !font-satoshi !text-[10.82px] leading-4 md:w-full"
                                >
                                  We are seeking a talented and creative Product
                                  Designer to join our dynamic team. As a
                                  Product Designer at Hirelab Inc
                                </Text>
                              </div>
                              <div className="flex w-[59%] flex-col items-end gap-10 md:w-full">
                                <div className="flex flex-col items-start gap-9 self-stretch">
                                  <div className="flex justify-between gap-5 self-stretch">
                                    <div className="flex flex-col items-start gap-0.5 rounded-md border border-solid border-blue-A200 bg-blue-A200 px-4 pb-[5px] pt-2 shadow-8xl">
                                      <Heading
                                        size="lg"
                                        as="h4"
                                        className="!text-[10.82px] !text-white-A700"
                                      >
                                        Assignment Submission
                                      </Heading>
                                      <Heading
                                        size="s"
                                        as="h5"
                                        className="!text-[7.49px] !text-white-A700"
                                      >
                                        10:00 am - 02:00 pm
                                      </Heading>
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5 rounded-md border border-solid border-orange-A200 bg-orange-A200 px-4 pb-[5px] pt-2 shadow-9xl">
                                      <Heading
                                        size="lg"
                                        as="h6"
                                        className="!text-[10.82px] !text-white-A700"
                                      >
                                        Meeting with recruiters
                                      </Heading>
                                      <Heading
                                        size="s"
                                        as="p"
                                        className="!text-[7.49px] !text-white-A700"
                                      >
                                        05:00 pm - 08:00 pm
                                      </Heading>
                                    </div>
                                  </div>
                                  <div className="ml-[54px] flex flex-col items-start gap-0.5 rounded-md border border-solid border-pink-300 bg-pink-300 px-4 pb-[5px] pt-2 shadow-7xl md:ml-0">
                                    <Heading
                                      size="lg"
                                      as="p"
                                      className="!text-[10.82px] !text-white-A700"
                                    >
                                      Meeting with recruiters
                                    </Heading>
                                    <Heading
                                      size="s"
                                      as="p"
                                      className="!text-[7.49px] !text-white-A700"
                                    >
                                      11:00 am - 03:00 pm
                                    </Heading>
                                  </div>
                                </div>
                                <div className="mr-[83px] flex flex-col items-start gap-0.5 rounded-md border border-solid border-green-500 bg-green-500 px-4 pb-[5px] pt-2 shadow-6xl md:mr-0">
                                  <Heading
                                    size="lg"
                                    as="p"
                                    className="!text-[10.82px] !text-white-A700"
                                  >
                                    Meeting with recruiters
                                  </Heading>
                                  <Heading
                                    size="s"
                                    as="p"
                                    className="!text-[7.49px] !text-white-A700"
                                  >
                                    02:00 pm - 07:00 pm
                                  </Heading>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                          <div className="absolute bottom-[0.00px] right-[0.00px] m-auto flex w-[19%] flex-col items-end gap-2">
                            <div className="mr-1.5 flex items-center justify-between gap-5 self-stretch md:mr-0">
                              <Img
                                src="/images/img_save.svg"
                                alt="save"
                                className="h-[24px]"
                              />
                              <div className="mb-[5px] h-[8px] w-[8px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            </div>
                            <div className="flex bg-light_blue-A700 shadow-lg">
                              <Text
                                size="5xl"
                                as="p"
                                className="!font-normal tracking-[0.09px] !text-white-A700"
                              >
                                Tom Jason
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="relative z-[1] mt-[-5px] h-[158px] md:h-auto">
                          <div className="flex w-full gap-[30px] md:flex-col">
                            {data.map((d, index) => (
                              <StartFromScratchLeaderIntroductionColumnsalary
                                {...d}
                                key={"listsalary" + index}
                                className="gap-[13px] pb-[19px] md:w-full"
                              />
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[158px] w-full rotate-[180deg] bg-gradient" />
                        </div>
                        <div className="mt-[53px] flex justify-center bg-white-A700_f2 px-[30px] pt-[30px] sm:flex-col sm:px-5 sm:pt-5">
                          <div className="flex w-full flex-col items-start sm:w-full">
                            <Img
                              src="/images/img_image_2.png"
                              alt="image"
                              className="h-px w-[53%] object-cover"
                            />
                            <Text
                              size="xl"
                              as="p"
                              className="mt-[104px] !font-satoshi"
                            >
                              We are seeking a talented and creative Product
                              Designer to join our dynamic team.{" "}
                            </Text>
                            <div className="mt-44 flex gap-2.5">
                              <Img
                                src="/images/img_vertical_container_black_900_01.png"
                                alt="vertical"
                                className="h-px object-cover"
                              />
                              <Img
                                src="/images/img_button.png"
                                alt="button"
                                className="h-px object-cover"
                              />
                              <Img
                                src="/images/img_container.png"
                                alt="container"
                                className="h-px object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex w-full flex-col items-start gap-[30px] px-[25px] sm:w-full sm:px-5">
                            <Heading as="p">Position</Heading>
                            <Heading as="p">Company</Heading>
                            <Heading as="p">Mission</Heading>
                            <Heading as="p">Testimonial</Heading>
                            <Heading as="p">About us</Heading>
                          </div>
                          <div className="flex w-full flex-col items-start gap-[30px] px-[30px] sm:w-full sm:px-5">
                            <Heading as="p">Contact Details</Heading>
                            <Text size="lg" as="p" className="!font-satoshi">
                              Name of Recruiter
                            </Text>
                            <Text size="lg" as="p" className="!font-satoshi">
                              Email address
                            </Text>
                            <Text size="lg" as="p" className="!font-satoshi">
                              Phone number
                            </Text>
                            <Text size="lg" as="p" className="!font-satoshi">
                              Locations
                            </Text>
                          </div>
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
