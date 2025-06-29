import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  Button,
  Heading,
  Img,
  Input,
  SelectBox,
  Switch,
  Text,
} from "../../components";
import Sidebar161 from "../../components/Sidebar161";
import StartFromScratchFooterTooltip from "../../components/StartFromScratchFooterTooltip";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function Startfromscratchfootermobile({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex-1 md:self-stretch">
          <div className="flex justify-center md:flex-col">
            <Sidebar161 />
            <div className="relative h-[848px] flex-1 md:w-full md:flex-none md:self-stretch">
              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-max w-full border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] sm:p-5">
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
                <div className="mt-8 h-px bg-blue_gray-50" />
                <div className="mt-[31px] flex flex-col gap-2">
                  <div className="flex justify-between gap-5">
                    <div className="flex items-center gap-2">
                      <Img
                        src="/images/img_magic_wand_01.svg"
                        alt="magicwandone"
                        className="h-[20px] w-[20px]"
                      />
                      <Text as="p" className="!text-light_blue-A700">
                        Header{" "}
                      </Text>
                    </div>
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
                    name="input_one"
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
                <div className="mt-6 flex gap-3 md:flex-col">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between gap-5">
                      <Text as="p" className="self-end !text-blue_gray-700">
                        Name
                      </Text>
                      <div className="flex py-px">
                        <Text
                          as="p"
                          className="!font-normal !text-blue_gray-700_01"
                        >
                          4/40
                        </Text>
                      </div>
                    </div>
                    <Input
                      shape="round"
                      name="name"
                      placeholder={`Lara Martinson`}
                      className="border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between gap-5">
                      <Text as="p" className="self-end !text-blue_gray-700">
                        Title
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
                      name="input_three"
                      placeholder={`CEO`}
                      className="border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                </div>
                <div className="mt-[149px] flex justify-between gap-5 sm:flex-col">
                  <div className="flex gap-2">
                    <div className="flex">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Social Sharing
                      </Text>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Show Recommended Jobs
                      </Text>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-start gap-2">
                  <div className="flex">
                    <Text as="p" className="!text-blue_gray-700">
                      Recommended Job 1
                    </Text>
                  </div>
                  <SelectBox
                    shape="round"
                    indicator={
                      <Img
                        src="/images/img_arrowdown_blue_gray_500.svg"
                        alt="arrow_down"
                        className="h-[20px] w-[20px]"
                      />
                    }
                    name="arrowdown"
                    placeholder={`Your company Facts`}
                    options={dropDownOptions}
                    className="gap-px self-stretch border border-solid border-blue_gray-100 sm:pr-5"
                  />
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
                <div className="mt-[171px] flex flex-col gap-5">
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
              <div className="absolute left-0 right-0 top-[37%] m-auto flex w-[96%] flex-col items-end gap-[5px]">
                <div className="flex w-[95%] justify-between gap-5 md:w-full">
                  <div className="flex items-center gap-2">
                    <Img
                      src="/images/img_magic_wand_01.svg"
                      alt="magicwandone"
                      className="h-[20px] w-[20px]"
                    />
                    <Text as="p" className="self-end !text-light_blue-A700">
                      Body Text
                    </Text>
                  </div>
                  <div className="flex py-px">
                    <Text
                      as="p"
                      className="!font-normal !text-blue_gray-700_01"
                    >
                      18/400
                    </Text>
                  </div>
                </div>
                <div className="relative h-[75px] self-stretch">
                  <div className="absolute bottom-0 right-[0.00px] top-0 my-auto flex h-max w-[95%] justify-center rounded-lg border border-solid border-blue_gray-100 bg-white-A700 p-3">
                    <Text
                      size="3xl"
                      as="p"
                      className="w-full leading-6 !text-blue_gray-700"
                    >
                      With the Core App development team we are on our way to
                      become the worlds user friendliest consumer app for job
                      connections with employers. We are just missing one
                      person. You!
                    </Text>
                  </div>
                  <StartFromScratchFooterTooltip />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-[848px] w-[34%] border-r border-solid border-blue_gray-50 pt-[25px] md:w-full sm:pt-5">
          <Tabs
            className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max w-[86%] flex-col items-center"
            selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded-[15px]"
            selectedTabPanelClassName="relative tab-panel--selected"
          >
            <TabList className="relative z-[1] flex w-[40%] flex-wrap justify-between gap-9 rounded-[17px] bg-gray-100_01 py-2 pl-[18px] pr-5 md:w-full">
              <Tab className="self-start text-xs font-semibold text-white-A700">
                Mobile
              </Tab>
              <Tab className="self-end text-xs font-semibold text-light_blue-A700">
                Desktop
              </Tab>
            </TabList>
            <div className="relative mt-[-27px] flex w-full flex-col gap-[30px]">
              <div className="flex items-center justify-between gap-5">
                <Heading size="7xl" as="h2" className="!text-black-900_01">
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
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col items-end self-stretch">
                          <div className="flex flex-col items-start self-stretch border-2 border-solid border-light_blue-A700 bg-white-A700">
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="mt-[7px] flex w-[92%] flex-col gap-6 self-center rounded-[15px] bg-white-A700_f2 px-6 pb-7 pt-[30px] md:w-full sm:p-5">
                              <div className="flex flex-col items-start gap-[11px]">
                                <Img
                                  src="/images/img_image_22x114.png"
                                  alt="image"
                                  className="h-[22px] w-[35%] object-cover"
                                />
                                <Text
                                  size="xl"
                                  as="p"
                                  className="w-[58%] !font-satoshi leading-5 md:w-full"
                                >
                                  We are seeking a talented and creative Product
                                  Designer to join our dynamic team.{" "}
                                </Text>
                                <div className="flex gap-2.5">
                                  <Img
                                    src="/images/img_vertical_container_black_900_01_21x21.svg"
                                    alt="vertical"
                                    className="h-[21px] w-[21px]"
                                  />
                                  <Img
                                    src="/images/img_button_black_900_01.svg"
                                    alt="button"
                                    className="h-[21px] w-[21px]"
                                  />
                                  <Img
                                    src="/images/img_container_black_900_01.svg"
                                    alt="container"
                                    className="h-[21px] w-[21px]"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col gap-[23px]">
                                <div className="flex flex-col items-start gap-[13px]">
                                  <Heading as="h3">Position</Heading>
                                  <Heading as="h4">Company</Heading>
                                  <Heading as="h5">Mission</Heading>
                                  <Heading as="h6">Testimonial</Heading>
                                  <Heading as="p">About us</Heading>
                                </div>
                                <div className="flex flex-col items-start gap-3.5">
                                  <Heading as="p">Contact Details</Heading>
                                  <Text
                                    size="lg"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Name of Recruiter
                                  </Text>
                                  <Text
                                    size="lg"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Email address
                                  </Text>
                                  <Text
                                    size="lg"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Phone number
                                  </Text>
                                  <Text
                                    size="lg"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Locations
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 h-[4px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                          <div className="relative mt-[-41px] flex w-[35%] items-end gap-0.5 md:w-full">
                            <Img
                              src="/images/img_save.svg"
                              alt="save"
                              className="h-[24px]"
                            />
                            <Button
                              size="lg"
                              shape="square"
                              className="mt-8 min-w-[107px] tracking-[0.09px] !shadow-lg"
                            >
                              Tom Jason
                            </Button>
                            <div className="mb-[17px] h-[8px] w-[6px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                        </div>
                        <div className="flex w-[92%] flex-col gap-[31px] bg-white-A700 px-4 pt-6 md:w-full sm:pt-5">
                          <div className="ml-[11px] flex items-start md:ml-0">
                            <Img
                              src="/images/img_user.svg"
                              alt="user"
                              className="mt-[26px] h-[86px] w-[86px] rounded-[7px]"
                            />
                            <Img
                              src="/images/img_mask_group_146x286.png"
                              alt="image"
                              className="relative ml-[-69px] h-[146px] w-[77%] object-cover"
                            />
                          </div>
                          <div className="flex flex-col items-end gap-[149px] md:gap-[111px] sm:gap-[74px]">
                            <Img
                              src="/images/img_polygon_2_blue_700_01.png"
                              alt="polygontwo"
                              className="mr-[18px] h-px w-[23%] object-cover md:mr-0"
                            />
                            <div className="flex flex-col gap-[433px] self-stretch md:gap-[324px] sm:gap-[216px]">
                              <div className="flex flex-col items-center gap-[193px] md:gap-36 sm:gap-24">
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  See the
                                </Text>
                                <Heading size="10xl" as="h4">
                                  Details for Position
                                </Heading>
                                <Text
                                  as="p"
                                  className="w-full text-center !font-satoshi !font-normal leading-6"
                                >
                                  <>
                                    We are seeking a talented and creative
                                    Product Designer to join our dynamic team.
                                    As a Product Designer at Hirelab Inc, you
                                    will play a crucial role in shaping the user
                                    experience and visual identity of our
                                    products.
                                    <br />
                                    You will work closely with cross-functional
                                    teams to translate ideas and concepts into
                                    innovative and user-friendly designs.
                                  </>
                                </Text>
                              </div>
                              <Heading
                                size="3xl"
                                as="p"
                                className="flex items-center justify-center bg-blue-700_01 px-[35px] pt-[11px] !font-bold !text-white-A700 sm:px-5"
                              >
                                APPLY NOW
                              </Heading>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              ))}
            </div>
          </Tabs>
          <div className="absolute bottom-[0.00px] left-0 right-0 m-auto h-[170px] w-full rotate-[180deg] bg-gradient" />
        </div>
      </div>
    </>
  );
}
