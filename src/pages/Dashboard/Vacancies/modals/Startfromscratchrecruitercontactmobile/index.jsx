import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  Button,
  Heading,
  Img,
  Input,
  Switch,
  Text,
  TextArea,
} from "../../components/components";
import Sidebar10 from "../../components/components/Sidebar10";

export default function Startfromscratchrecruitercontactmobile({
  isOpen,
  ...props
}) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar10 />
        <div className="flex flex-1 md:flex-col md:self-stretch">
          <div className="flex flex-1 flex-col gap-[100px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[75px] md:self-stretch sm:gap-[50px] sm:p-5">
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
                    placeholder={`Reach out to us`}
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-5">
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
                  <TextArea
                    shape="round"
                    name="input_three"
                    placeholder={`With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!`}
                    className="!border-blue_gray-100 leading-6 text-blue_gray-700"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-3 md:flex-col">
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
                          Job Title
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
                        name="input_five"
                        placeholder={`Manager`}
                        className="border border-solid border-blue_gray-100 sm:pr-5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 md:flex-col">
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center justify-between gap-5">
                        <Text as="p" className="self-end !text-blue_gray-700">
                          Phone
                        </Text>
                        <Switch />
                      </div>
                      <Input
                        shape="round"
                        name="phone"
                        placeholder={`+1 (415) 555-1010`}
                        className="border border-solid border-blue_gray-100 sm:pr-5"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center justify-between gap-5">
                        <Text as="p" className="self-end !text-blue_gray-700">
                          Email
                        </Text>
                        <Switch />
                      </div>
                      <Input
                        shape="round"
                        type="email"
                        name="email"
                        placeholder={`laraa45@gmail.com`}
                        className="border border-solid border-blue_gray-100 sm:pr-5"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Image
                    </Text>
                  </div>
                  <div className="flex justify-end rounded-lg border border-dashed border-blue_gray-100 bg-white-A700 pb-[5px] pt-[26px] sm:pt-5">
                    <div className="flex w-[66%] items-start justify-between gap-5 md:w-full md:p-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex flex-wrap gap-1 self-start">
                          <Heading
                            size="3xl"
                            as="h2"
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
                            as="h3"
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
          <div className="w-[37%] border-r border-solid border-blue_gray-50 px-[25px] pt-[25px] md:w-full sm:px-5 sm:pt-5">
            <Tabs
              className="flex flex-col items-center"
              selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded"
              selectedTabPanelClassName="relative tab-panel--selected"
            >
              <TabList className="relative z-[6] flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 p-2">
                <Tab className="self-start text-xs font-semibold text-white-A700">
                  Mobile
                </Tab>
                <Tab className="self-end text-xs font-medium text-light_blue-A700">
                  Desktop
                </Tab>
              </TabList>
              <div className="relative mt-[-27px] flex w-full flex-col gap-[30px] pb-[18px]">
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
                        <div className="flex flex-col items-end">
                          <div className="flex flex-col items-start self-stretch border-2 border-solid border-light_blue-A700 bg-white-A700">
                            <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                            <div className="mt-[7px] w-[92%] self-center bg-white-A700 px-4 py-6 md:w-full sm:py-5">
                              <div className="flex flex-col items-center">
                                <div className="relative h-[297px] w-[88%]">
                                  <div className="absolute right-[-0.25px] top-[0.00px] m-auto flex w-[95%] items-start justify-end">
                                    <Img
                                      src="/images/img_mask_group_286x286.png"
                                      alt="image"
                                      className="relative z-[3] h-[286px] w-[286px] object-cover"
                                    />
                                    <Img
                                      src="/images/img_user.svg"
                                      alt="user"
                                      className="relative ml-[-85px] mt-[43px] h-[86px] w-[86px] rounded-[7px]"
                                    />
                                  </div>
                                  <Img
                                    src="/images/img_polygon_2.svg"
                                    alt="polygontwo"
                                    className="absolute bottom-[0.00px] left-[0.00px] z-[4] m-auto h-[75px] w-[75px] rounded-[7px]"
                                  />
                                </div>
                                <div className="flex flex-col gap-[18px] self-stretch">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Text
                                      size="3xl"
                                      as="p"
                                      className="!font-satoshi"
                                    >
                                      Reach Out to Us
                                    </Text>
                                    <Heading size="10xl" as="h3">
                                      Recruiter contact
                                    </Heading>
                                    <Text
                                      size="3xl"
                                      as="p"
                                      className="!font-satoshi"
                                    >
                                      Ask questions directly
                                    </Text>
                                  </div>
                                  <div className="flex flex-col items-start gap-[17px]">
                                    <Heading size="6xl" as="h4">
                                      <span className="font-normal text-gray-900_01">
                                        Name:&nbsp;
                                      </span>
                                      <span className="text-gray-900_01">
                                        Sarah Johnson
                                      </span>
                                    </Heading>
                                    <Heading size="6xl" as="h5">
                                      <span className="font-normal text-gray-900_01">
                                        Title:&nbsp;
                                      </span>
                                      <span className="text-gray-900_01">
                                        Talent Acquisition Manager
                                      </span>
                                    </Heading>
                                    <Heading size="6xl" as="h6">
                                      <span className="font-normal text-gray-900_01">
                                        Phone:&nbsp;
                                      </span>
                                      <span className="text-gray-900_01">
                                        (555) 123-4567
                                      </span>
                                    </Heading>
                                    <Heading size="6xl" as="h6">
                                      <span className="font-normal text-gray-900_01">
                                        Email:&nbsp;
                                      </span>
                                      <span className="text-gray-900_01">
                                        sarah.johnson@hirelab.com
                                      </span>
                                    </Heading>
                                  </div>
                                </div>
                                <Button
                                  size="6xl"
                                  className="mt-7 w-full rounded-[22px] font-satoshi font-bold sm:px-5"
                                >
                                  APPLY NOW
                                </Button>
                              </div>
                            </div>
                            <div className="mt-1.5 h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                          <div className="relative z-[5] mt-[-46px] flex w-[35%] items-end gap-0.5 md:w-full">
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
                            <div className="mb-4 h-[8px] w-[6px] border border-solid border-light_blue-A700 bg-white-A700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
