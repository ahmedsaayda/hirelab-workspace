import React from "react";
import { default as ModalProvider } from "react-modal";
import Link from "next/link";
import {
  Button,
  CheckBox,
  Heading,
  Img,
  Input,
  Radio,
  RadioGroup,
  SelectBox,
  Switch,
  Text,
  TextArea,
} from "../../components/components";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function Createanewvacancytemplate({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm rounded-[12px] bg-white-A700 md:p-5">
        <div className="flex flex-col gap-8 rounded-[12px] p-8 sm:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6 md:flex-col">
                <Heading
                  size="7xl"
                  as="h1"
                  className="self-end !text-black-900_01"
                >
                  New vacancy: Senior Product Manager
                </Heading>
                <div className="flex flex-1 items-center gap-4 mdx:flex-col mdx:self-stretch">
                  <Img
                    src="/images/img_divider.svg"
                    alt="divider"
                    className="h-[12px] w-[20%] mdx:w-full"
                  />
                  <Link href="/dashboard/vacancies/new">
                    <Text
                      size="3xl"
                      as="p"
                      className={`flex h-[30px] w-[30px] px-[10px] items-center justify-center rounded-[100%] border-[0.5px]  cursor-pointer border-solid border-light_blue-A700 text-center !font-medium !text-white bg-indigo-500 `}
                    >
                      1
                    </Text>
                    <div className="flex">
                      <Text
                        size="3xl"
                        as="p"
                        className="!font-medium !text-blue_gray-800_01 whitespace-nowrap cursor-pointer "
                      >
                        Basic info
                      </Text>
                    </div>
                  </Link>
                  <Img
                    src="/images/img_divider.svg"
                    alt="divider"
                    className="h-[12px] w-[20%] mdx:w-full"
                  />
                  <Link href="/dashboard/vacancies/new/2">
                    <Text
                      size="3xl"
                      as="p"
                      className={`flex h-[30px] w-[30px] px-[10px] items-center justify-center rounded-[100%] border-[0.5px]  cursor-pointer border-solid border-light_blue-A700 text-center !font-medium  text-indigo-500 `}
                    >
                      2
                    </Text>
                    <div className="flex cursor-pointer ">
                      <Text
                        size="3xl"
                        as="p"
                        className="!font-medium !text-blue_gray-800_01"
                      >
                        Stages
                      </Text>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="h-px bg-blue_gray-50" />
            </div>
            <div className="flex flex-col items-start gap-[25px] pt-1">
              <Heading size="4xl" as="h2" className="!text-blue_gray-700">
                Job Specifications
              </Heading>
              <div className="flex flex-col gap-6 self-stretch">
                <div className="flex gap-6 md:flex-col">
                  <div className="flex w-full flex-col items-start gap-[9px]">
                    <Text as="p" className="!text-blue_gray-700">
                      Tone
                    </Text>
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
                      placeholder={`Type category`}
                      options={dropDownOptions}
                      className="gap-px self-stretch border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Job Title
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
                      name="arrowdown_one"
                      placeholder={`Category`}
                      options={dropDownOptions}
                      className="gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col items-start gap-2">
                    <Text as="p" className="!text-blue_gray-700">
                      Department
                    </Text>
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
                      placeholder={`Select department`}
                      options={dropDownOptions}
                      className="gap-px self-stretch border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                </div>
                <div className="flex gap-6 md:flex-col">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Hiring Manager
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
                      name="name"
                      placeholder={`Name`}
                      options={dropDownOptions}
                      className="gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Recruiter
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
                      name="name"
                      placeholder={`Name`}
                      options={dropDownOptions}
                      className="gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between gap-5">
                      <Text as="p" className="!text-blue_gray-700">
                        Deadline
                      </Text>
                      <div className="flex gap-2">
                        <div className="flex py-px">
                          <Text as="p" className="!text-blue_gray-700_01">
                            Show
                          </Text>
                        </div>
                        <Switch />
                      </div>
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
                      placeholder={`DD-MM-YYYY`}
                      options={dropDownOptions}
                      className="gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                </div>
              </div>
              <Input
                name="employeescan"
                placeholder={`Remote`}
                prefix={
                  <Img
                    src="/images/img_globe02.svg"
                    alt="globe-02"
                    className="h-[24px] w-[24px]"
                  />
                }
                className="h-[75px] self-stretch rounded-lg border border-solid border-blue_gray-100 bg-white-A700 px-[35px] text-sm text-blue_gray-700 sm:px-5"
              >
                Employees can work from anywhere.
              </Input>
              <Input
                name="employeeswork"
                placeholder={`Hybrid`}
                prefix={
                  <Img
                    src="/images/img_markerpin06.svg"
                    alt="marker-pin-06"
                    className="h-[24px] w-[24px]"
                  />
                }
                className="h-[75px] self-stretch rounded-lg border border-solid border-blue_gray-100 bg-white-A700 px-[35px] text-sm text-blue_gray-700 sm:px-5"
              >
                Employees work partly remotely and partly in an offie space.
              </Input>
              <Heading size="4xl" as="h3" className="!text-blue_gray-700">
                Locations
              </Heading>
              <div className="flex flex-col gap-6 self-stretch">
                <div className="flex gap-6 md:flex-col">
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    Karachi
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    Islamabad
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    Amsterdam
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    Amsterdam
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    london
                  </Button>
                </div>
                <div className="flex gap-6 md:flex-col">
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    New York
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    Lahore
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-light_blue-A700 font-medium sm:px-5"
                  >
                    Leon
                  </Button>
                  <Button
                    size="7xl"
                    className="w-full rounded-[12px] border border-solid border-blue_gray-50_01 font-medium !text-blue_gray-800_01 sm:px-5"
                  >
                    Lahore
                  </Button>
                  <div className="flex w-full items-center justify-center gap-3 p-2">
                    <Button
                      size="2xl"
                      shape="circle"
                      className="w-[34px] !rounded-[17px] border-[0.5px] border-dashed border-blue_gray-100"
                    >
                      <Img src="/images/img_plus_blue_gray_300.svg" />
                    </Button>
                    <Text
                      size="3xl"
                      as="p"
                      className="!font-medium !text-blue_gray-800_01"
                    >
                      Add a location
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 self-stretch">
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
                      name="input_one"
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
                      name="arrowdown_three"
                      placeholder={`Monthly`}
                      options={dropDownOptions}
                      className="w-full gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <Input
                    shape="round"
                    name="input_three"
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
              <div className="flex flex-col gap-2 self-stretch">
                <div className="flex items-center justify-between gap-5">
                  <Text as="p" className="self-end !text-blue_gray-700">
                    Working Hours
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
                    <SelectBox
                      shape="round"
                      indicator={
                        <Img
                          src="/images/img_arrowdown_blue_gray_500.svg"
                          alt="arrow_down"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      name="arrowdown_four"
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
                      name="arrowdown_five"
                      placeholder={`Monthly`}
                      options={dropDownOptions}
                      className="w-full gap-px border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <Input
                    shape="round"
                    name="input_five"
                    placeholder={`Max`}
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
      </div>
    </>
  );
}
