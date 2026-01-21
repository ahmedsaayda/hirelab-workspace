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
} from "../../components/components";
import Sidebar9 from "../../components/components/Sidebar9";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function Startfromscratchheadermobile({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar9 className="md:hidden md:gap-[19px] md:p-5 sm:pt-5" />
        <div className="flex flex-1 md:flex-col md:self-stretch">
          <div className="flex flex-1 flex-col gap-6 border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:self-stretch sm:p-5">
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
                    name="input_one"
                    placeholder={`Sr. Technical Engineer`}
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
                        Headline
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
                    placeholder={`Be our technical pioneer`}
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-5">
                    <Text as="p" className="self-end !text-blue_gray-700">
                      Salary
                    </Text>
                    <div className="flex gap-2 self-start">
                      <div className="flex pb-px pt-0.5">
                        <Text
                          as="p"
                          className="!font-normal !text-blue_gray-700_01"
                        >
                          Range
                        </Text>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3 md:flex-col">
                      <Input
                        shape="round"
                        name="input_five"
                        placeholder={`Min`}
                        suffix={
                          <Img
                            src="/images/img_arrowdown_blue_gray_500.svg"
                            alt="arrow_down"
                            className="h-[20px] w-[20px]"
                          />
                        }
                        className="w-full gap-[35px] border border-solid border-blue_gray-100 sm:pr-5"
                      />
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
                        placeholder={`Monthly`}
                        options={dropDownOptions}
                        className="w-full gap-px border border-solid border-blue_gray-100 sm:pr-5"
                      />
                    </div>
                    <Input
                      shape="round"
                      name="input_seven"
                      placeholder={`Min`}
                      suffix={
                        <Img
                          src="/images/img_arrowdown_blue_gray_500.svg"
                          alt="arrow_down"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      className="gap-[35px] border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-5">
                    <Text as="p" className="self-end !text-blue_gray-700">
                      Hours
                    </Text>
                    <div className="flex gap-2">
                      <div className="flex pb-px pt-0.5">
                        <Text
                          as="p"
                          className="!font-normal !text-blue_gray-700_01"
                        >
                          Range
                        </Text>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <SelectBox
                      shape="round"
                      indicator={
                        <Img
                          src="/images/img_arrowdown_blue_gray_500.svg"
                          alt="arrow_down"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      name="arrowdown_one"
                      placeholder={`Min`}
                      options={dropDownOptions}
                      className="w-full gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                    <SelectBox
                      shape="round"
                      indicator={
                        <Img
                          src="/images/img_arrowdown_blue_gray_500.svg"
                          alt="arrow_down"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      name="arrowdown_two"
                      placeholder={`Max`}
                      options={dropDownOptions}
                      className="w-full gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-5">
                  <div className="flex gap-2">
                    <div className="flex">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Remote
                      </Text>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex pb-px pt-0.5">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Hybrid
                      </Text>
                    </div>
                    <Switch />
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
              <Button
                shape="round"
                className="w-full border border-solid border-light_blue-A700 font-semibold sm:px-5"
              >
                Save & Next
              </Button>
            </div>
          </div>
          <Tabs
            className="flex w-[37%] flex-col gap-[25px] border-r border-solid border-blue_gray-50 pl-[25px] pr-[11px] pt-[25px] md:w-full sm:pl-5 sm:pt-5"
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
              <TabList className="flex flex-wrap gap-[26px] rounded-md bg-gray-100_01 p-2">
                <Tab className="self-start text-xs font-semibold text-white-A700">
                  Mobile
                </Tab>
                <Tab className="self-end text-xs font-medium text-light_blue-A700">
                  Desktop
                </Tab>
              </TabList>
              <Img
                src="/images/img_expand_06.svg"
                alt="expandsix"
                className="h-[20px] w-[19%]"
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
                    <div className="relative h-[732px]">
                      <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max w-[95%] flex-col gap-[7px] border-2 border-solid border-light_blue-A700 bg-white-A700 pb-2">
                        <div className="flex justify-between gap-5">
                          <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                        </div>
                        <div className="flex items-center gap-[11px]">
                          <div className="mb-11 h-[8px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                          <div className="relative h-[711px] flex-1 px-4 py-[54px] md:h-auto md:py-5">
                            <Img
                              src="/images/img_rectangle_169.png"
                              alt="image"
                              className="h-[603px] w-full rounded-[40px] object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max w-[85%] flex-col items-center">
                              <div className="flex w-[47%] items-center justify-center gap-2 md:w-full">
                                <Img
                                  src="/images/img_user_red_a200_01.svg"
                                  alt="user"
                                  className="h-[33px] w-[33px]"
                                />
                                <Img
                                  src="/images/img_settings_white_a700.svg"
                                  alt="settings"
                                  className="mb-1 h-[20px] w-[73%] self-end"
                                />
                              </div>
                              <Text
                                size="3xl"
                                as="p"
                                className="mt-[26px] !font-satoshi !text-white-A700"
                              >
                                Segment is hiring for
                              </Text>
                              <Heading
                                size="11xl"
                                as="h3"
                                className="text-shadow-ts1 !font-black !text-white-A700"
                              >
                                Product Designer
                              </Heading>
                              <div className="mt-6 flex gap-4">
                                <Button
                                  size="6xl"
                                  variant="outline"
                                  color="undefined_undefined"
                                  className="min-w-[114px] rounded-[21px] font-satoshi font-bold sm:px-5"
                                >
                                  Share Job
                                </Button>
                                <Button
                                  size="6xl"
                                  className="min-w-[120px] rounded-[21px] font-satoshi font-bold sm:px-5"
                                >
                                  Apply Now
                                </Button>
                              </div>
                              <Text
                                as="p"
                                className="mt-6 w-full text-center !font-satoshi leading-6 !text-white-A700"
                              >
                                We are seeking a talented and creative Product
                                Designer to join our dynamic team. As a Product
                                Designer at Hirelab Inc, you will play a crucial
                                role in shaping the user experience and visual
                                identity of our products. You will work closely
                                with cross-functional teams to translate ideas
                                and concepts into innovative and user-friendly
                                designs.
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-[18.00px] right-[0.00px] m-auto flex w-[34%] flex-col items-end gap-1.5">
                        <div className="mr-1.5 flex items-start justify-between gap-5 self-stretch md:mr-0">
                          <Img
                            src="/images/img_save.svg"
                            alt="save"
                            className="h-[24px]"
                          />
                          <div className="h-[8px] w-[8px] border border-solid border-light_blue-A700 bg-white-A700" />
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
                  </div>
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
