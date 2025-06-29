import React from "react";
import { default as ModalProvider } from "react-modal";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button, Heading, Img, Input, Text } from "../../components";
import Sidebar2 from "../../components/Sidebar2";
import StartFromScratchImageMobileFileupload from "../../components/StartFromScratchImageMobileFileupload";

export default function Startfromscratchimagemobile({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex flex-1 justify-center md:flex-col md:self-stretch">
          <Sidebar2 />
          <div className="flex flex-1 flex-col gap-[122px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[91px] md:self-stretch sm:gap-[61px] sm:p-5">
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
                      <Text as="p" className="!text-light_blue-A700">
                        Sub Header{" "}
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
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Image
                    </Text>
                  </div>
                  <div className="flex flex-col gap-3">
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
                          <Text
                            size="lg"
                            as="p"
                            className="!text-blue_gray-700"
                          >
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
                    <div className="flex flex-col gap-3">
                      {[...Array(2)].map((d, index) => (
                        <StartFromScratchImageMobileFileupload
                          dashboard="Dashboard image.png"
                          filesize="16 MB"
                          percentage="100%"
                          key={"listfilesize" + index}
                        />
                      ))}
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
          <div className="flex flex-col items-end gap-[89px] md:gap-[66px] sm:gap-11">
            <div className="flex items-center self-stretch sm:flex-col">
              <div className="relative z-[6] h-px w-[8px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
              <Tabs
                className="relative ml-[-5px] flex flex-1 flex-col items-center sm:ml-0 sm:self-stretch"
                selectedTabClassName="!text-white-A700 bg-light_blue-A700 rounded"
                selectedTabPanelClassName="relative tab-panel--selected"
              >
                <TabList className="relative z-[5] flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 p-2">
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
                          <div className="flex items-start sm:flex-col">
                            <div className="relative z-[3] h-[5px] w-[5px] flex-1 border border-solid border-light_blue-A700 bg-white-A700 sm:self-stretch" />
                            <div className="relative ml-[-5px] h-[763px] w-[98%] sm:ml-0 sm:w-full">
                              <div className="absolute left-0 right-0 top-[0.00px] m-auto h-[732px] w-full border-2 border-solid border-light_blue-A700 bg-white-A700" />
                              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[751px] w-[92%] md:h-auto">
                                <div className="h-[720px] w-full bg-white-A700_f2" />
                                <div className="absolute left-0 right-0 top-[24.97px] m-auto flex flex-col items-center gap-0.5">
                                  <Text
                                    size="3xl"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Let’s check out the
                                  </Text>
                                  <Heading size="10xl" as="h3">
                                    Images of our Company
                                  </Heading>
                                </div>
                                <div className="absolute bottom-[-24.93px] left-0 right-0 m-auto grid w-[87%] grid-cols-2 justify-center gap-[27px] md:grid-cols-1">
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_158.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-74px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[39px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="h4"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_159.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-73px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[38px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="h5"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_160.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-74px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[39px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="h6"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_161.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-73px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[38px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="p"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_162.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-74px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[39px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="p"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_163.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-73px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[38px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="p"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full">
                                    <div className="flex w-full flex-col">
                                      <Img
                                        src="/images/img_rectangle_164.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-74px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-3 pt-[39px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="p"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                      <Img
                                        src="/images/img_rectangle_163.png"
                                        alt="image"
                                        className="h-[149px] w-[149px] rounded-lg object-cover"
                                      />
                                      <div className="relative mt-[-75px] flex flex-col items-start rounded-lg bg-gradient1 px-2 pb-[13px] pt-[39px] sm:pt-5">
                                        <Heading
                                          size="md"
                                          as="p"
                                          className="!text-[9.99px] !text-white-A700"
                                        >
                                          Event held in company
                                        </Heading>
                                        <Text
                                          size="xs"
                                          as="p"
                                          className="!text-[7.49px] !text-white-A700"
                                        >
                                          Short description to be placed here
                                        </Text>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-[6%] right-[0.00px] m-auto flex flex-col items-start gap-2">
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
                            <div className="relative z-[4] ml-[-5px] h-[5px] w-[5px] flex-1 border border-solid border-light_blue-A700 bg-white-A700 sm:ml-0 sm:self-stretch" />
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
