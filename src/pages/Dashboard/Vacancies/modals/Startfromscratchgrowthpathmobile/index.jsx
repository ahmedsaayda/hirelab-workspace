import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Input, Text } from "../../components/components";
import Sidebar7 from "../../components/components/Sidebar7";
import StartFromScratchGrowthPathMobileRowinnovation from "../../components/components/StartFromScratchGrowthPathMobileRowinnovation";

const data = [
  {
    userimage: "images/img_idea.svg",
    innovationtitle: "Innovation Leaders",
    pioneeringtext: "Pioneering recruitment marketing automation.",
  },
  {
    userimage: "images/img_globe.svg",
    innovationtitle: "Global Presence",
    pioneeringtext: "Serving clients in over 20 countries.",
  },
  {
    userimage: "images/img_team_1.svg",
    innovationtitle: "Employee-Centric",
    pioneeringtext: "Recognized for our employee benefits.",
  },
  {
    userimage: "images/img_trophy.svg",
    innovationtitle: "Award-Winning",
    pioneeringtext: "Recipient of multiple industry awards.",
  },
  {
    userimage: "images/img_shines.png",
    innovationtitle: "Cutting-Edge Technology",
    pioneeringtext: "Constantly evolving our platform.",
  },
  {
    userimage: "images/img_team_1_white_a700.png",
    innovationtitle: "Community Engagement",
    pioneeringtext: "Active in social responsibility initiatives.",
  },
];

export default function Startfromscratchgrowthpathmobile({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex flex-1 justify-center md:flex-col md:self-stretch">
          <Sidebar7 className="md:hidden md:gap-[19px] sm:pt-5" />
          <div className="flex flex-1 flex-col gap-[227px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[170px] md:self-stretch sm:gap-[113px] sm:p-5">
            <div className="flex flex-col gap-[31px]">
              <div className="flex flex-col gap-8">
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
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Step 1
                    </Text>
                  </div>
                  <Input
                    shape="round"
                    name="input_one"
                    placeholder={`Your company Facts`}
                    suffix={
                      <Img
                        src="/images/img_trash_01_red_700.svg"
                        alt="trash-01"
                        className="h-[20px] w-[20px]"
                      />
                    }
                    className="gap-[35px] border border-solid border-blue_gray-100"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Text as="p" className="!text-blue_gray-700">
                    Step 2
                  </Text>
                  <Input
                    shape="round"
                    name="input_three"
                    placeholder={`Your company Facts`}
                    suffix={
                      <Img
                        src="/images/img_trash_01_red_700.svg"
                        alt="trash-01"
                        className="h-[20px] w-[20px]"
                      />
                    }
                    className="gap-[35px] self-stretch border border-solid border-blue_gray-100"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Text as="p" className="!text-blue_gray-700">
                    Step 3
                  </Text>
                  <Input
                    shape="round"
                    name="trashOne"
                    placeholder={`Your company Facts`}
                    suffix={
                      <Img
                        src="/images/img_trash_01_red_700.svg"
                        alt="trash-01"
                        className="h-[20px] w-[20px]"
                      />
                    }
                    className="gap-[35px] self-stretch border border-solid border-blue_gray-100"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Step 4
                    </Text>
                  </div>
                  <Input
                    shape="round"
                    name="input_five"
                    placeholder={`Your company Facts`}
                    suffix={
                      <Img
                        src="/images/img_trash_01_red_700.svg"
                        alt="trash-01"
                        className="h-[20px] w-[20px]"
                      />
                    }
                    className="gap-[35px] border border-solid border-blue_gray-100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Img
                    src="/images/img_plus_blue_gray_700_01.svg"
                    alt="plus"
                    className="h-[20px] w-[20px]"
                  />
                  <Heading
                    size="3xl"
                    as="h2"
                    className="!text-blue_gray-700_01"
                  >
                    Add more
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
        </div>
        <div className="w-[34%] border-r border-solid border-blue_gray-50 px-[25px] pt-[25px] md:w-full sm:px-5 sm:pt-5">
          <div className="flex flex-col gap-[248px] md:gap-[186px] sm:gap-[124px]">
            <Tabs
              className="flex flex-col items-center"
              selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded"
              selectedTabPanelClassName="relative tab-panel--selected"
            >
              <TabList className="relative z-[1] flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 p-2">
                <Tab className="self-start text-xs font-semibold text-white-A700">
                  Mobile
                </Tab>
                <Tab className="self-end text-xs font-medium text-light_blue-A700">
                  Desktop
                </Tab>
              </TabList>
              <div className="relative mt-[-27px] flex w-full flex-col gap-[30px]">
                <div className="flex items-center justify-between gap-5">
                  <Heading size="7xl" as="h2" className="!text-[#000000]_01">
                    Preview
                  </Heading>
                  <Img
                    src="/images/img_expand_06.svg"
                    alt="expandsix"
                    className="h-[20px] w-[19%] self-start"
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
                        <div className="flex flex-col gap-[7px] border-2 border-solid border-light_blue-A700 bg-white-A700">
                          <div className="flex justify-between gap-5">
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                          <div className="relative h-[688px]">
                            <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max w-[96%] flex-col gap-[60px] bg-gradient2 px-4 pt-[60px] md:pt-5 sm:gap-[30px]">
                              <div className="flex flex-col items-center">
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="!font-satoshi !text-white-A700"
                                >
                                  See the
                                </Text>
                                <Heading
                                  size="10xl"
                                  as="h3"
                                  className="!text-white-A700"
                                >
                                  Company Facts
                                </Heading>
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="relative mt-[-1px] w-full text-center !font-satoshi leading-6 !text-white-A700"
                                >
                                  We are seeking a talented and creative Product
                                  Designer to join our dynamic team. As a
                                  Product Designer at Hirelab Inc
                                </Text>
                              </div>
                              <div className="flex flex-col gap-[22px]">
                                {data.map((d, index) => (
                                  <StartFromScratchGrowthPathMobileRowinnovation
                                    {...d}
                                    key={"listinnovation" + index}
                                    className="flex-1 justify-center rounded-[20px] pb-4"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="absolute bottom-[0.00px] right-[0.00px] m-auto flex flex-col items-start gap-2">
                              <Img
                                src="/images/img_save.svg"
                                alt="save"
                                className="h-[24px]"
                              />
                              <Text
                                size="5xl"
                                as="p"
                                className="text-shadow-ts flex items-center justify-center self-end bg-light_blue-A700 px-[7px] py-px !font-normal tracking-[0.09px] !text-white-A700"
                              >
                                Tom Jason
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                ))}
              </div>
            </Tabs>
            <div className="flex justify-between gap-5">
              <div className="h-px w-[8px] border border-solid border-light_blue-A700 bg-white-A700" />
              <div className="h-px w-[8px] border border-solid border-light_blue-A700 bg-white-A700" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
