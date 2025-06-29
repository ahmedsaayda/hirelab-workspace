import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components";
import Sidebar11 from "../../components/Sidebar11";

export default function Startfromscratchjobdescriptionmobile({
  isOpen,
  ...props
}) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex flex-1 justify-center md:flex-col md:self-stretch">
          <Sidebar11 />
          <div className="flex flex-1 flex-col gap-[197px] border-r border-solid border-blue_gray-50 px-[30px] pb-8 pt-[30px] md:gap-[147px] md:self-stretch sm:gap-[98px] sm:p-5">
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
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-5">
                    <div className="flex items-center gap-2">
                      <Img
                        src="/images/img_magic_wand_01.svg"
                        alt="magicwandone"
                        className="h-[20px] w-[20px]"
                      />
                      <Text as="p" className="self-end !text-light_blue-A700">
                        Job Title
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
                    placeholder={`Discover our company`}
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
                        Sub text of Description
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
                    name="input_three"
                    placeholder={`We are proud and loud we put our employee first.`}
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
        </div>
        <div className="w-[34%] border-r border-solid border-blue_gray-50 px-[25px] pt-[25px] md:w-full sm:px-5 sm:pt-5">
          <div className="flex flex-col items-end gap-[152px] md:gap-[114px] sm:gap-[76px]">
            <div className="flex items-center self-stretch sm:flex-col">
              <div className="relative z-[4] h-px w-[8px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
              <Tabs
                className="relative ml-[-5px] flex flex-1 flex-col items-center sm:ml-0 sm:self-stretch"
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
                          <div className="flex flex-col gap-[7px] border-2 border-solid border-light_blue-A700 bg-white-A700">
                            <div className="flex justify-between gap-5">
                              <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                              <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                            </div>
                            <div className="relative h-[720px]">
                              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max w-[96%] flex-col gap-3 bg-white-A700 px-4 pt-6 sm:pt-5">
                                <div>
                                  <div className="flex items-center">
                                    <div className="flex flex-1 items-start">
                                      <Img
                                        src="/images/img_user.svg"
                                        alt="user"
                                        className="mt-[13px] h-[86px] w-[86px] rounded-[7px]"
                                      />
                                      <Img
                                        src="/images/img_mask_group_286x286.png"
                                        alt="image"
                                        className="relative ml-[-77px] h-[286px] w-[286px] object-cover"
                                      />
                                    </div>
                                    <Img
                                      src="/images/img_polygon_2.svg"
                                      alt="polygontwo"
                                      className="relative ml-[-51px] h-[75px] w-[75px] rounded-[7px]"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-[77px] md:gap-[57px] sm:gap-[38px]">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Text
                                      size="3xl"
                                      as="p"
                                      className="!font-satoshi"
                                    >
                                      About the job
                                    </Text>
                                    <Heading size="10xl" as="h3">
                                      Job Description
                                    </Heading>
                                    <Text
                                      size="lg"
                                      as="p"
                                      className="w-full text-center !font-satoshi leading-4"
                                    >
                                      <>
                                        Join Hirelab as a Product Designer and
                                        become a crucial part of our mission to
                                        revolutionize the world of recruitment
                                        marketing automation. As a Product
                                        Designer, you&#39;ll play an
                                        instrumental role in shaping the future
                                        of hiring by crafting innovative
                                        solutions that empower recruiters to
                                        discover the perfect candidates
                                        effortlessly.
                                        <br />
                                        <br />
                                        In this role, you&#39;ll have the
                                        opportunity to utilize your creative
                                        prowess and design expertise to the
                                        fullest. Collaborating closely with
                                        cross-functional teams, you&#39;ll
                                        transform ideas into visually stunning
                                        and user-centric designs. Your work will
                                        not only enhance the user experience but
                                        also streamline the hiring process for
                                        companies worldwide.
                                        <br />
                                        <br />
                                        At Hirelab, we foster an environment of
                                        constant growth and innovation.
                                        You&#39;ll be encouraged to think
                                        outside the box, challenge conventions,
                                        and push the boundaries of design.
                                        Moreover, you&#39;ll be part of a
                                        dynamic and diverse team of
                                        professionals who share your passion for
                                        excellence.
                                        <br />
                                        If you&#39;re seeking a career where
                                        your design skills can have a tangible
                                        impact and where innovation knows no
                                        bounds, join us at Hirelab and embark on
                                        a journey that will redefine recruitment
                                        for generations to come.
                                      </>
                                    </Text>
                                  </div>
                                  <Heading
                                    size="3xl"
                                    as="h4"
                                    className="flex items-center justify-center bg-blue-700_01 px-[35px] pt-[11px] !font-bold !text-white-A700 sm:px-5"
                                  >
                                    APPLY NOW
                                  </Heading>
                                </div>
                              </div>
                              <div className="absolute bottom-[18.00px] right-[0.00px] m-auto flex flex-col items-start gap-2">
                                <Img
                                  src="/images/img_save.svg"
                                  alt="save"
                                  className="h-[24px]"
                                />
                                <Button
                                  size="lg"
                                  shape="square"
                                  className="min-w-[107px] self-end tracking-[0.09px] !shadow-lg"
                                >
                                  Tom Jason
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                </div>
              </Tabs>
            </div>
            <div className="h-px w-[8px] border border-solid border-light_blue-A700 bg-white-A700" />
          </div>
        </div>
      </div>
    </>
  );
}
