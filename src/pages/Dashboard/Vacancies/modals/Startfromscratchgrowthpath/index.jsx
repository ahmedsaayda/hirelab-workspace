import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Input, Text } from "../../components/components";
import Sidebar7 from "../../components/components/Sidebar7";
import StartFromScratchGrowthPathColumninnovatio from "../../components/components/StartFromScratchGrowthPathColumninnovatio";

const data = [
  {
    userimage: "images/img_idea.svg",
    innovationtext: "Innovation Leaders",
    pioneeringtext: "Pioneering recruitment marketing automation.",
  },
  {
    userimage: "images/img_globe.svg",
    innovationtext: "Global Presence",
    pioneeringtext: "Serving clients in over 20 countries.",
  },
  {
    userimage: "images/img_team_1.svg",
    innovationtext: "Employee-Centric",
    pioneeringtext: "Recognized for our employee benefits.",
  },
  {
    userimage: "images/img_trophy.svg",
    innovationtext: "Award-Winning",
    pioneeringtext: "Recipient of multiple industry awards.",
  },
  {
    userimage: "images/img_shines_white_a700.svg",
    innovationtext: "Cutting-Edge Technology",
    pioneeringtext: "Constantly evolving our platform.",
  },
  {
    userimage: "images/img_team_1_white_a700_37x37.svg",
    innovationtext: "Community Engagement",
    pioneeringtext: "Active in social responsibility initiatives.",
  },
];

export default function Startfromscratchgrowthpath({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar7 className="md:hidden md:gap-[19px] md:p-5 sm:pt-5" />
        <div className="flex w-[34%] flex-col gap-[227px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:w-full md:gap-[170px] sm:gap-[113px] sm:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex flex-col gap-8">
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
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start gap-2">
                <Text as="p" className="!text-blue_gray-700">
                  Step 1
                </Text>
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
                  className="gap-[35px] self-stretch border border-solid border-blue_gray-100"
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
                  name="input_five"
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
                  name="input_seven"
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
                <Heading size="3xl" as="h2" className="!text-blue_gray-700_01">
                  Add more
                </Heading>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-px bg-blue_gray-50_01" />
            <div className="flex gap-5 sm:flex-col">
              <Input
                size="md"
                shape="round"
                name="button_one"
                placeholder={`Back`}
                className="w-full border border-solid border-blue_gray-100 font-semibold !text-blue_gray-800 sm:w-full sm:px-5"
              />
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
                  className="self-start !text-black-900_01"
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
                        <div className="relative h-[616px]">
                          <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="ml-4 mt-[25px] flex flex-col items-center gap-6 self-stretch bg-gradient2 p-6 md:ml-0 sm:p-5">
                              <div className="flex w-[95%] flex-col items-center md:w-full">
                                <Text
                                  size="4xl"
                                  as="p"
                                  className="!font-satoshi !text-[17.48px] !text-white-A700"
                                >
                                  See the
                                </Text>
                                <Heading
                                  size="10xl"
                                  as="h3"
                                  className="!text-[24.97px] !text-white-A700"
                                >
                                  Company Facts
                                </Heading>
                                <Text
                                  size="md"
                                  as="p"
                                  className="relative mt-[-3px] w-[69%] text-center !font-satoshi !text-[10.82px] leading-4 !text-white-A700 md:w-full"
                                >
                                  We are seeking a talented and creative Product
                                  Designer to join our dynamic team. As a
                                  Product Designer at Hirelab Inc
                                </Text>
                              </div>
                              <div className="grid w-[95%] grid-cols-3 justify-center gap-6 md:grid-cols-2 sm:grid-cols-1">
                                {data.map((d, index) => (
                                  <StartFromScratchGrowthPathColumninnovatio
                                    {...d}
                                    key={"gridinnovation" + index}
                                    className="pb-4 md:gap-3"
                                  />
                                ))}
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
                            <Button
                              size="lg"
                              shape="square"
                              className="min-w-[107px] tracking-[0.09px] !shadow-lg"
                            >
                              Tom Jason
                            </Button>
                          </div>
                        </div>
                        <div className="relative z-[1] mt-[-2px] flex flex-col gap-px">
                          <div className="relative h-[118px] flex-1 md:h-auto md:w-full md:flex-none">
                            <div className="flex flex-col items-start gap-[13px] rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                              <Img
                                src="/images/img_vertical_container.svg"
                                alt="salary_rangeone"
                                className="h-[45px] w-[45px]"
                              />
                              <div className="flex flex-col items-start">
                                <Heading size="8xl" as="h4">
                                  Salary Range:
                                </Heading>
                                <Text
                                  size="xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  $ 110k -125k / year
                                </Text>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[118px] w-full rotate-[180deg] bg-gradient" />
                          </div>
                          <div className="flex flex-1 justify-center bg-gradient px-2 pt-2">
                            <div className="flex flex-col items-start gap-2.5 rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                              <Img
                                src="/images/img_vertical_container_blue_700_01.svg"
                                alt="vertical"
                                className="h-[45px] w-[45px]"
                              />
                              <div className="flex flex-col items-start">
                                <Heading size="8xl" as="h5">
                                  Hours:
                                </Heading>
                                <Text
                                  size="xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  Full-time
                                </Text>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-1 justify-end bg-gradient pt-2">
                            <div className="flex flex-col items-start gap-2.5 rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                              <Img
                                src="/images/img_vertical_container_blue_700_01_45x45.svg"
                                alt="vertical"
                                className="h-[45px] w-[45px]"
                              />
                              <div className="flex flex-col items-start">
                                <Heading size="8xl" as="h6">
                                  Location:
                                </Heading>
                                <Text
                                  size="xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  San Francisco, CA
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-[90px] flex justify-center bg-white-A700_f2 px-[30px] pt-[30px] sm:flex-col sm:px-5 sm:pt-5">
                          <div className="flex w-full flex-col items-start sm:w-full">
                            <Img
                              src="/images/img_image_4.png"
                              alt="image"
                              className="h-px w-[53%] object-cover"
                            />
                            <Text
                              size="xl"
                              as="p"
                              className="mt-[153px] !font-satoshi"
                            >
                              We are seeking a talented and creative Product
                              Designer to join our dynamic team.{" "}
                            </Text>
                            <div className="mt-[225px] flex gap-2.5">
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
