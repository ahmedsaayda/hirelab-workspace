import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components/components";
import Sidebar18 from "../../components/components/Sidebar18";

export default function StartfromscratchEVPMissionmobile({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar18 />
        <div className="flex flex-1 flex-col gap-[197px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[147px] md:self-stretch sm:gap-[98px] sm:p-5">
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
                  className="border border-solid border-blue_gray-100 sm:pr-5"
                />
              </div>
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
                  name="input_five"
                  placeholder={`With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!`}
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
        <div className="w-[34%] border-r border-solid border-blue_gray-50 px-[25px] pt-[25px] md:w-full sm:px-5 sm:pt-5">
          <Tabs
            className="flex flex-col items-center"
            selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded"
            selectedTabPanelClassName="relative tab-panel--selected"
          >
            <TabList className="relative z-[3] flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 p-2">
              <Tab className="self-start text-xs font-semibold text-white-A700">
                Mobile
              </Tab>
              <Tab className="self-end text-xs font-medium text-light_blue-A700">
                Desktop
              </Tab>
            </TabList>
            <div className="relative mt-[-27px] flex w-full flex-col gap-[30px] pb-[18px]">
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
                      <div className="flex flex-col items-end">
                        <div className="flex flex-col items-start self-stretch border-2 border-solid border-light_blue-A700 bg-white-A700">
                          <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                          <div className="mt-[7px] flex w-[92%] flex-col gap-8 self-center bg-white-A700 px-4 py-6 md:w-full sm:py-5">
                            <div>
                              <div className="flex items-center">
                                <div className="flex flex-1 items-start">
                                  <Img
                                    src="/images/img_user.svg"
                                    alt="user"
                                    className="mt-[26px] h-[86px] w-[86px] rounded-[7px]"
                                  />
                                  <Img
                                    src="/images/img_mask_group_286x286.png"
                                    alt="image"
                                    className="relative ml-[-69px] h-[286px] w-[286px] object-cover"
                                  />
                                </div>
                                <Img
                                  src="/images/img_polygon_2.svg"
                                  alt="polygontwo"
                                  className="relative mb-[34px] ml-[-64px] h-[75px] w-[75px] self-end rounded-[7px]"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-[30px]">
                              <div className="flex flex-col items-center gap-[3px]">
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  Excited to
                                </Text>
                                <Heading size="10xl" as="h3">
                                  Meet Our CEO
                                </Heading>
                                <Text
                                  as="p"
                                  className="w-full text-center !font-satoshi !font-normal leading-6"
                                >
                                  <>
                                    Quote by CEO: &quot;At Hirelab, we&#39;re on
                                    a mission to redefine recruitment. We
                                    believe that technology and innovation can
                                    transform how companies find and hire top
                                    talent.&quot;
                                    <br />
                                    Our CEO, John Smith, envisions a future
                                    where hiring is efficient, data-driven, and
                                    tailored to individual organizations&#39;
                                    needs.
                                  </>
                                </Text>
                              </div>
                              <Button
                                size="6xl"
                                className="w-full rounded-[22px] font-satoshi font-bold sm:px-5"
                              >
                                APPLY NOW
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 h-[4px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                        </div>
                        <div className="relative mt-[-45px] flex w-[35%] items-end gap-0.5 md:w-full">
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
    </>
  );
}
