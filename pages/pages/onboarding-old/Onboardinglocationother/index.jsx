import React from "react";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { Button, Heading, Img, Input, Text } from "../components";
import Header from "../components/Header";
import OnboardingLocationOtherCheckbox from "../components/OnboardingLocationOtherCheckbox";
import OnboardingLocationOtherOrder from "../components/OnboardingLocationOtherOrder";

export default function OnboardinglocationotherPage() {
  const router = useRouter();;
  return (
    <>
      <Helmet>
        <title>Location Setup - Customize Your Hiring Preferences</title>
        <meta
          name="description"
          content="Set up your preferred hiring locations by selecting cities and defining office names in Lyon, France. Customize your address details for home or office locations to streamline your team-building process."
        />
      </Helmet>

      {/* header section */}
      <div className="w-full bg-white-A700">
        <div>
          <Header />
          <div className="flex items-start border border-solid border-blue_gray-50 mdx:flex-col">
            {/* location selection section */}
            <div className="flex items-start justify-center flex-1 gap-8 pb-8 pl-16 mdx:flex-col mdx:self-stretch mdx:p-5 mdx:pl-5">
              <div className="flex flex-1 flex-col gap-[230px] pt-6 mdx:gap-[172px] mdx:self-stretch smx:gap-[115px] smx:pt-5">
                <div className="flex flex-col gap-12">
                  <div className="flex justify-center px-6 pt-6 smx:px-5 smx:pt-5">
                    <div className="flex w-[80%] flex-col items-center gap-3 mdx:w-full">
                      <div className="flex">
                        <Heading size="lg" as="h1">
                          Location
                        </Heading>
                      </div>
                      <Text size="md" as="p" className="!font-normal">
                        Select cities you would like to hire team.
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 rounded-[12px] border border-solid border-blue_gray-50 bg-white-A700 p-6 smx:p-5">
                    <div className="flex gap-3 mdx:flex-col">
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-start">
                          <Text as="p">Country</Text>
                        </div>
                        <Input
                          shape="round"
                          name="Country Input"
                          placeholder={`France`}
                          className="smx:pr-5"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-start">
                          <Text as="p">City</Text>
                        </div>
                        <Input
                          shape="round"
                          name="City Input"
                          placeholder={`Lyon`}
                          className="smx:pr-5"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mdx:flex-col">
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-start">
                          <Text as="p">Office Name</Text>
                        </div>
                        <Input
                          shape="round"
                          type="text"
                          name="Office Name Input"
                          placeholder={`namename`}
                          className="smx:pr-5"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-start">
                          <Text as="p">Your Location</Text>
                        </div>
                        <Input
                          shape="round"
                          name="Location Input"
                          placeholder={`Lyon`}
                          className="smx:pr-5"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mdx:flex-col">
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-start">
                          <Text as="p">Street</Text>
                        </div>
                        <Input
                          shape="round"
                          type="text"
                          name="Street Input"
                          placeholder={`namename`}
                          className="smx:pr-5"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-start">
                          <Text as="p">Address</Text>
                        </div>
                        <Input
                          shape="round"
                          name="Address Input"
                          placeholder={`Lyon`}
                          className="smx:pr-5"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex self-start">
                        <Text as="p" className="!text-blue_gray-700">
                          Save Address as
                        </Text>
                      </div>
                      <div className="flex justify-start gap-16 mdx:flex-col">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col self-start pt-0.5">
                            <div className="flex flex-col items-center rounded-lg border border-solid border-light_blue-A700 bg-light_blue-A700 p-[3px]">
                              <Img
                                src="/images/img_check_white_a700.svg"
                                alt="check"
                                className="h-[10px] w-[10px] cursor-pointer"
                              />
                            </div>
                          </div>
                          <div className="flex py-px">
                            <Text as="p" className="!text-blue_gray-800">
                              Home
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col self-start pt-0.5">
                            <div className="h-[16px] w-[16px] rounded-lg border border-solid border-blue_gray-100 bg-white-A700 cursor-pointer" />
                          </div>
                          <div className="flex py-px">
                            <Text as="p" className="!text-blue_gray-800">
                              Office
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* footer section */}
                <div className="flex flex-col gap-5">
                  <div className="h-px bg-blue_gray-50" />
                  <div className="flex gap-5">
                    <Button
                      color="white_A700"
                      shape="round"
                      className="w-full font-semibold border border-solid border-blue_gray-100 smx:px-5"
                      onClick={() => router.push("/onboarding/3")}
                    >
                      Back
                    </Button>
                    <Button
                      shape="round"
                      className="w-full font-semibold border border-solid border-light_blue-A700 smx:px-5"
                      onClick={() => router.push("/onboarding/5")}
                    >
                      Add location
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-px h-full bg-blue_gray-50 mdx:h-px mdx:w-full" />
            </div>

            {/* brand style section */}
            <div className="w-[23%] px-8 mdx:w-full mdx:p-5 smx:px-5">
              {/* help section */}
              <div className="flex flex-col gap-[449px] px-4 pt-6 mdx:gap-[336px] smx:gap-56 smx:pt-5">
                <div className="flex flex-col gap-1 mdx:hidden">
                  <div className="flex flex-col gap-1 mdx:flex-row">
                    {[
                      {
                        brandstyletext: "Brand Style",
                        choosebrandstyletext: "Choose the brand style.",
                      },
                      {
                        brandstyletext: "Hiring Team",
                        choosebrandstyletext: "Set your hiring team.",
                      },
                    ].map((d, index) => (
                      <OnboardingLocationOtherOrder
                        brandstyletext={d?.brandstyletext}
                        choosebrandstyletext={d?.choosebrandstyletext}
                        key={"ordersList" + index}
                        className="cursor-pointer"
                      />
                    ))}
                  </div>
                  <div className="flex items-start gap-4 cursor-pointer">
                    <Text
                      size="md"
                      as="p"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[0.5px] border-solid border-light_blue-A700 text-center !text-light_blue-A700"
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
