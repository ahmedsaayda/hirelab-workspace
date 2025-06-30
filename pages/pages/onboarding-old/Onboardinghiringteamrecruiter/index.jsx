import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
// import Select from "../../../../../src/components/Select";
const Select = ({ options, onChange, ...props }) => (
  <select onChange={onChange} {...props}>
    {options?.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
import { countries } from "../../../../src/data/constants";
import FileUpload from "../FileUpload";
import {
  Button,
  Heading,
  Img,
  Input,
  Radio,
  RadioGroup,
  Text,
} from "../components";
// import Header from "../../../src/components/Header";
const Header = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    <h1>Header Component</h1>
    {children}
  </div>
);

export default function OnboardinghiringteamrecruiterPage() {
  const [selected, setSelected] = useState("recruiter");
  const router = useRouter();;
  return (
    <>
      <Helmet>
        <title>Set Up Your Hiring Team - Recruiter Onboarding</title>
        <meta
          name="description"
          content="Easily add recruiters and hiring managers to your team during the onboarding process. Ensure a smooth start with our user-friendly platform."
        />
      </Helmet>

      {/* page header section */}
      <div className="w-full bg-white-A700">
        {/* main content section */}
        <div>
          <Header />

          {/* team onboarding section */}
          <div className="flex items-start border border-solid border-blue_gray-50 mdx:flex-col">
            <div className="flex items-start justify-center flex-1 gap-8 pl-16 mdx:flex-col mdx:self-stretch mdx:p-5 mdx:pl-5">
              {/* team details form section */}
              <div className="flex flex-1 flex-col gap-[22px] pb-[34px] pt-6 mdx:self-stretch smx:pt-5">
                <div className="flex flex-col items-center gap-12 pt-6 smx:pt-5">
                  <div className="flex w-[76%] flex-col items-center gap-3 mdx:w-full">
                    <div className="flex">
                      <Heading size="lg" as="h1">
                        Hiring Team
                      </Heading>
                    </div>
                    <Text size="md" as="p" className="!font-normal">
                      Add members to your team.
                    </Text>
                  </div>
                  <div className="flex flex-col self-stretch gap-12 ">
                    <div
                      name="roleradiogroup"
                      className="flex gap-3 mdx:flex-col"
                    >
                      <div
                        value="recruiter"
                        className={`w-full justify-center gap-[35px] rounded-[12px] items-center flex h-[90px] cursor-pointer border border-blue_gray-50 ${
                          selected === "recruiter"
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-blue_gray-800"
                        } p-[34px] text-lg font-medium smx:py-5 smx:pr-5`}
                        onClick={() => setSelected("recruiter")}
                      >
                        Recruiter
                      </div>
                      <div
                        value="hiringmanager"
                        className={`w-full justify-center gap-[35px] rounded-[12px] items-center flex h-[90px] cursor-pointer border border-blue_gray-50 ${
                          selected === "hiringmanager"
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-blue_gray-800"
                        } p-[34px] text-lg font-medium smx:py-5 smx:pr-5`}
                        onClick={() => setSelected("hiringmanager")}
                      >
                        Hiring Manager
                      </div>
                      <div
                        value="hrmanager"
                        className={`w-full justify-center gap-[35px] rounded-[12px] items-center flex h-[90px] cursor-pointer border border-blue_gray-50 ${
                          selected === "hrmanager"
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-blue_gray-800"
                        } p-[34px] text-lg font-medium smx:py-5 smx:pr-5`}
                        onClick={() => setSelected("hrmanager")}
                      >
                        HR Manager
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 rounded-[12px] border border-solid border-blue_gray-50 bg-white-A700 p-6 smx:p-5 overflow-auto">
                      <div className="flex gap-3 mdx:flex-col">
                        <div className="flex flex-col w-full gap-2">
                          <div className="flex self-start">
                            <Text as="p">Recruiter Name</Text>
                          </div>
                          <Input
                            shape="round"
                            name="Name Input"
                            placeholder={`Lara`}
                            className="smx:pr-5"
                          />
                        </div>
                        <div className="flex flex-col w-full gap-2">
                          <div className="flex self-start">
                            <Text as="p">Recruiter ID</Text>
                          </div>
                          <Input
                            shape="round"
                            name="ID Input"
                            placeholder={`Designation Title here`}
                            className="smx:pr-5"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex self-start">
                          <Text as="p">Recruiter Email</Text>
                        </div>
                        <Input
                          shape="round"
                          type="email"
                          name="Email Input"
                          placeholder={`lara@mail.com`}
                        />
                      </div>
                      <div className="flex flex-col gap-2 overflow-auto">
                        <div className="flex self-start">
                          <Text as="p">Recruiter Phone</Text>
                        </div>
                        <div className="flex items-center justify-start gap-3 rounded-lg border border-none bg-white-A700 pl-3.5">
                          <div className="flex items-center gap-1 cursor-pointer">
                            {/* <Text size="md" as="p" className="!font-normal">
                              US
                            </Text>
                            <Img
                              src="/images/img_arrow_down.svg"
                              alt="country dropdown icon"
                              className="h-[20px] w-[20px]"
                            /> */}
                            <Select
                              options={countries.map((c) => ({
                                ...c,
                                label: c.value,
                              }))}
                              onChange={(e) => {
                                console.log(e);
                              }}
                            />
                          </div>
                          <Input
                            shape="round"
                            type="text"
                            className="w-full"
                            name="Phone"
                            placeholder={`(555) 000-0000`}
                          />
                        </div>
                      </div>
                      <FileUpload />
                    </div>
                  </div>
                </div>

                {/* form actions section */}
                <div className="flex flex-col gap-5">
                  <div className="h-px bg-blue_gray-50" />
                  <div className="flex gap-5">
                    <Button
                      color="white_A700"
                      shape="round"
                      className="w-full font-semibold border border-solid border-blue_gray-100 smx:px-5"
                      onClick={() => router.push("/onboarding")}
                    >
                      Back
                    </Button>
                    <Button
                      shape="round"
                      className="w-full font-semibold border border-solid border-light_blue-A700 smx:px-5"
                      onClick={() => router.push("/onboarding/3")}
                    >
                      Add member
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-px h-full bg-blue_gray-50 mdx:h-px mdx:w-full" />
            </div>

            {/* progress tracker section */}
            <div className="w-[23%] px-8 mdx:w-full mdx:p-5 smx:px-5">
              <div className="flex flex-col gap-[449px] px-4 pb-[34px] pt-6 mdx:gap-[336px] smx:gap-56 smx:pt-5">
                <div className="flex flex-col items-start justify-start gap-1 mdx:hidden">
                  <div className="flex items-start self-start gap-4 cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Button
                        size="xs"
                        shape="circle"
                        className="w-[30px] !rounded-[15px] border border-solid border-light_blue-A700"
                      >
                        <Img src="/images/img_check_white_a700.svg" />
                      </Button>
                      <Img
                        src="/images/img_light_bulb.svg"
                        alt="lightbulb image"
                        className="h-[36px]"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <Text size="md" as="p" className="!text-blue_gray-800">
                        Brand Style
                      </Text>
                      <Text size="xs" as="p">
                        Choose the brand style.
                      </Text>
                    </div>
                  </div>
                  <div className="ml-[5px] flex cursor-pointer items-start gap-4">
                    <div className="flex w-[14%] flex-col items-center">
                      <Text
                        size="md"
                        as="p"
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[0.5px] border-solid border-light_blue-A700 text-center !text-light_blue-A700"
                      >
                        2
                      </Text>
                      <Img
                        src="/images/img_light_bulb.svg"
                        alt="lightbulb image 2"
                        className="h-[36px]"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <Text size="md" as="p" className="!text-blue_gray-800">
                        Hiring Team
                      </Text>
                      <Text size="xs" as="p">
                        Set your hiring team.
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 cursor-pointer">
                    <Text
                      size="md"
                      as="p"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[0.5px] border-solid border-blue_gray-50 text-center"
                    >
                      3
                    </Text>
                    <div className="flex flex-col items-start gap-1">
                      <Text size="md" as="p" className="!text-blue_gray-800">
                        Location
                      </Text>
                      <Text size="xs" as="p">
                        Set your location.
                      </Text>
                    </div>
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
