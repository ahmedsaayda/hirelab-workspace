import React from "react";
import { default as ModalProvider } from "react-modal";
import {
  Button,
  Heading,
  Img,
  Input,
  SelectBox,
  Switch,
  Text,
} from "../../components/components";
import StartFromScratchAddCategoryHeadingand from "../../components/components/StartFromScratchAddCategoryHeadingand";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function Startfromscratchaddcategory({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex w-[20%] flex-col items-start justify-center gap-[22px] border-r border-solid border-blue_gray-50 bg-white-A700 pb-[624px] pl-6 pr-[18px] pt-[35px] md:w-full md:p-5 md:pb-5 sm:py-5 sm:pl-5">
          <Heading
            size="4xl"
            as="h1"
            className="!font-semibold !text-black-900_f2"
          >
            Sections
          </Heading>
          <div className="flex flex-col gap-2 self-stretch">
            <Input
              size="md"
              shape="round"
              name="buttonbase_one"
              placeholder={`Header`}
              prefix={
                <Img
                  src="/images/img_flex_align_top_light_blue_a700.svg"
                  alt="flex-align-top"
                  className="h-[18px] w-[18px]"
                />
              }
              className="gap-3 font-semibold sm:pr-5"
            />
            <div className="flex justify-center rounded-lg p-2.5">
              <div className="flex items-center gap-3">
                <Img
                  src="/images/img_search_blue_gray_500_01_18x18.svg"
                  alt="search"
                  className="h-[18px] w-[18px]"
                />
                <Heading size="3xl" as="h2" className="!text-blue_gray-700">
                  Add
                </Heading>
              </div>
            </div>
            <div className="flex justify-center rounded-lg p-2.5">
              <div className="flex items-center gap-3">
                <Img
                  src="/images/img_flex_align_top.svg"
                  alt="flexalign"
                  className="h-[18px] w-[18px]"
                />
                <Heading size="3xl" as="h3" className="!text-blue_gray-700">
                  Footer
                </Heading>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[34%] flex-col gap-6 border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:w-full sm:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex items-center justify-between gap-5">
              <Heading size="7xl" as="h2" className="!text-black-900_01">
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
                <div className="flex items-center justify-between gap-5">
                  <Text as="p" className="self-end !text-blue_gray-700">
                    Headline
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
                  <div className="flex gap-3 sm:flex-col">
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
                      className="w-full gap-[35px] border border-solid border-blue_gray-100 sm:w-full sm:pr-5"
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
                      className="w-full gap-px border border-solid border-blue_gray-100 sm:w-full sm:pr-5"
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
                <div className="flex gap-2 sm:flex-col">
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
                    className="w-full gap-px border border-solid border-blue_gray-100 sm:w-full sm:pr-5"
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
                    className="w-full gap-px border border-solid border-blue_gray-100 sm:w-full sm:pr-5"
                  />
                </div>
              </div>
              <div className="flex gap-56 md:flex-row">
                {[...Array(2)].map((d, index) => (
                  <StartFromScratchAddCategoryHeadingand
                    headingtext="Remote"
                    key={"header" + index}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex self-start">
                  <Text as="p" className="!text-blue_gray-700">
                    Image
                  </Text>
                </div>
                <div className="rounded-lg border border-dashed border-blue_gray-100 bg-white-A700 pb-[5px] pl-3.5 pt-6 sm:pt-5">
                  <div className="flex items-start justify-between gap-5 pl-[73px] md:pl-5">
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
                    <div className="relative mt-[9px] h-[48px] w-[15%]">
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
            <Button
              shape="round"
              className="w-full border border-solid font-semibold sm:px-5"
            >
              Save & Next
            </Button>
          </div>
        </div>
        <div className="flex-1 border-r border-solid border-blue_gray-50 px-7 pb-8 pt-7 md:self-stretch sm:p-5">
          <div className="flex flex-col gap-[30px]">
            <div className="flex items-center gap-3 self-start">
              <Img
                src="/images/img_vertical_container_blue_gray_800_01.svg"
                alt="vertical"
                className="h-[20px] w-[20px]"
              />
              <Heading size="7xl" as="h2" className="!text-black-900_01">
                Preview
              </Heading>
            </div>
            <div className="h-px bg-blue_gray-50" />
            <div className="rounded-[12px] bg-white-A700 pb-[201px] md:pb-5">
              <div className="flex flex-col gap-6">
                <Img
                  src="/images/img_rectangle_257.png"
                  alt="image"
                  className="h-[335px] object-cover"
                />
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col items-start gap-[5px]">
                    <Text
                      as="p"
                      className="!font-normal !text-blue_gray-700_01"
                    >
                      Position
                    </Text>
                    <Heading size="4xl" as="h3" className="!text-gray-900">
                      Sr. Technical Engineer
                    </Heading>
                  </div>
                  <Input
                    size="sm"
                    shape="round"
                    name="toast_one"
                    placeholder={`Be our technical pioneer`}
                    className="!rounded-md font-semibold sm:pr-5"
                  />
                </div>
                <div className="flex justify-between gap-5 sm:flex-col">
                  <div className="flex items-center gap-2 pr-2.5">
                    <div className="flex items-center gap-1.5">
                      <Img
                        src="/images/img_search_18x18.svg"
                        alt="search"
                        className="h-[18px] w-[18px]"
                      />
                      <Heading
                        size="3xl"
                        as="h4"
                        className="!text-blue_gray-700"
                      >
                        Hours:
                      </Heading>
                    </div>
                    <Heading size="3xl" as="h5" className="!text-blue_gray-700">
                      10-12
                    </Heading>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Img
                        src="/images/img_coins_stacked_02.svg"
                        alt="coinsstacked"
                        className="h-[18px] w-[18px] self-start"
                      />
                      <Heading
                        size="3xl"
                        as="h6"
                        className="self-end !text-blue_gray-700"
                      >
                        Salary:
                      </Heading>
                    </div>
                    <Heading
                      size="3xl"
                      as="p"
                      className="self-end !text-blue_gray-700"
                    >
                      $ 2,000 -$ 2,500
                    </Heading>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Img
                      src="/images/img_briefcase_01.svg"
                      alt="briefcaseone"
                      className="h-[18px] w-[18px]"
                    />
                    <Heading size="3xl" as="p" className="!text-blue_gray-700">
                      Remote Job
                    </Heading>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
