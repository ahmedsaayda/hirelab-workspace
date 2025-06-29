import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, CheckBox, Heading, Img, Input, Text } from "../../components";
import Sidebar6 from "../../components/Sidebar6";

export default function Startfromscratchjobspecificationsmobile({
  isOpen,
  ...props
}) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar6 />
        <div className="flex flex-1 md:flex-col md:self-stretch">
          <div className="flex flex-1 flex-col gap-60 border-r border-solid border-blue_gray-50 px-[30px] pb-8 pt-[30px] md:gap-[180px] md:self-stretch sm:gap-[120px] sm:p-5">
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
                <div className="flex justify-between gap-5">
                  <CheckBox
                    name="benefits"
                    label="Benefits"
                    id="benefits"
                    className="gap-2.5 p-px text-sm font-medium text-blue_gray-800"
                  />
                  <CheckBox
                    name="tasks"
                    label="Tasks"
                    id="tasks"
                    className="gap-2.5 p-px text-sm font-medium text-blue_gray-800"
                  />
                  <CheckBox
                    name="requirements"
                    label="Requirements"
                    id="requirements"
                    className="gap-2.5 p-px text-sm font-medium text-blue_gray-800"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex">
                    <Text as="p" className="!text-blue_gray-700">
                      Benefits
                    </Text>
                  </div>
                  <Input
                    shape="round"
                    name="input_one"
                    placeholder={`Competitive compensation package`}
                    suffix={
                      <Img
                        src="/images/img_trash_01_red_700.svg"
                        alt="trash-01"
                        className="h-[20px] w-[20px]"
                      />
                    }
                    className="gap-[35px] self-stretch border border-solid border-blue_gray-100"
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
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-start gap-[9px]">
                    <Text as="p" className="!text-blue_gray-700">
                      Tasks
                    </Text>
                    <Input
                      shape="round"
                      name="input_three"
                      placeholder={`UI/UX Design`}
                      suffix={
                        <Img
                          src="/images/img_trash_01_red_700.svg"
                          alt="trash-01"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      className="gap-[35px] self-stretch border border-solid border-blue_gray-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Img
                      src="/images/img_plus_blue_gray_700_01.svg"
                      alt="plus"
                      className="h-[20px] w-[20px]"
                    />
                    <Heading
                      size="3xl"
                      as="h3"
                      className="!text-blue_gray-700_01"
                    >
                      Add more
                    </Heading>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <Text as="p" className="!text-blue_gray-700">
                      Requirements
                    </Text>
                    <Input
                      shape="round"
                      name="input_five"
                      placeholder={`Proven experience as a Product Designer`}
                      suffix={
                        <Img
                          src="/images/img_trash_01_red_700.svg"
                          alt="trash-01"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      className="gap-[35px] self-stretch border border-solid border-blue_gray-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Img
                      src="/images/img_plus_blue_gray_700_01.svg"
                      alt="plus"
                      className="h-[20px] w-[20px]"
                    />
                    <Heading
                      size="3xl"
                      as="h4"
                      className="!text-blue_gray-700_01"
                    >
                      Add more
                    </Heading>
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
          <div className="w-[37%] border-r border-solid border-blue_gray-50 pl-[25px] pr-[11px] pt-[25px] md:w-full sm:pl-5 sm:pt-5">
            <div className="flex flex-col gap-7">
              <div className="flex items-center justify-between gap-5">
                <Heading
                  size="7xl"
                  as="h2"
                  className="self-start !text-black-900_01"
                >
                  Preview
                </Heading>
                <div className="flex items-center gap-3.5 rounded-md bg-gray-100_01">
                  <Button
                    size="sm"
                    className="min-w-[65px] rounded font-semibold"
                  >
                    Mobile
                  </Button>
                  <Text
                    size="lg"
                    as="p"
                    className="mb-[5px] self-end !font-medium !text-light_blue-A700"
                  >
                    Desktop
                  </Text>
                </div>
                <Img
                  src="/images/img_expand_06.svg"
                  alt="expandsix"
                  className="h-[20px] w-[19%]"
                />
              </div>
              <div className="h-px bg-blue_gray-50" />
              <div className="relative h-[732px]">
                <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-max w-[95%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                  <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="mt-[7px] flex w-[92%] flex-col gap-6 self-center bg-white-A700_f2 px-4 pt-6 md:w-full sm:pt-5">
                    <div className="flex flex-col items-center">
                      <Text size="3xl" as="p" className="!font-satoshi">
                        Let’s check the
                      </Text>
                      <Heading size="10xl" as="h3">
                        Job Specifics
                      </Heading>
                      <Text
                        size="3xl"
                        as="p"
                        className="relative mt-[-3px] w-full text-center !font-satoshi leading-6"
                      >
                        We are seeking a talented and creative Product Designer
                        to join our dynamic team. As a Product Designer at
                        Hirelab Inc
                      </Text>
                    </div>
                    <div className="flex flex-col gap-[152px] md:gap-[114px] sm:gap-[76px]">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-1 flex-col gap-3 rounded-[20px] bg-white-A700_d8 p-3">
                          <div className="flex flex-col items-center gap-2.5">
                            <Img
                              src="/images/img_authenticity.svg"
                              alt="benefits_and"
                              className="h-[45px] w-[45px]"
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <Heading size="6xl" as="h4">
                                Benefits and Perks
                              </Heading>
                              <Text size="lg" as="p" className="!font-satoshi">
                                What you can expect:
                              </Text>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="image"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="self-end !font-satoshi !font-medium"
                              >
                                Competitive compensation package
                              </Text>
                            </div>
                            <div className="flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="image"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="self-end !font-satoshi !font-medium"
                              >
                                Flexible working hours
                              </Text>
                            </div>
                            <div className="flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="image"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="self-end !font-satoshi !font-medium"
                              >
                                Health, dental, and vision insurance
                              </Text>
                            </div>
                            <div className="flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="image"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="self-end !font-satoshi !font-medium"
                              >
                                401(k) retirement plan
                              </Text>
                            </div>
                            <div className="flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="image"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="self-end !font-satoshi !font-medium"
                              >
                                Generous vacation and paid time off
                              </Text>
                            </div>
                            <div className="flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="image"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="w-[94%] !font-satoshi !font-medium leading-5"
                              >
                                Opportunities for professional development and
                                growth
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 rounded-[20px] bg-white-A700_d8 px-3 pt-3">
                          <div className="flex flex-col items-center gap-2.5">
                            <Img
                              src="/images/img_authenticity.svg"
                              alt="authenticity"
                              className="h-[45px] w-[45px]"
                            />
                            <div className="flex flex-col items-center gap-1">
                              <Heading size="6xl" as="h5">
                                Requirements
                              </Heading>
                              <Text size="lg" as="p" className="!font-satoshi">
                                What we expect from you:
                              </Text>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-[9px] self-start">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="checkbadge"
                                className="h-[19px] w-[19px]"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="self-end !font-satoshi !font-medium"
                              >
                                Proven experience as a Product Designer
                              </Text>
                            </div>
                            <div className="mt-2.5 flex items-center gap-[9px]">
                              <Img
                                src="/images/img_check_badge_svgrepo_com.svg"
                                alt="checkbadge"
                                className="h-[19px] w-[19px] self-end"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="w-[94%] !font-satoshi !font-medium leading-5"
                              >
                                Proficiency in design tools (e.g., Adobe Suite,
                                Sketch, Figma)
                              </Text>
                            </div>
                            <div className="mt-4 flex items-start gap-[9px] self-start">
                              <Img
                                src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                                alt="checkbadge"
                                className="mt-2.5 h-px object-cover"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="!font-satoshi !font-medium"
                              >
                                Strong understanding of user-centered design
                                principles
                              </Text>
                            </div>
                            <div className="mt-[66px] flex gap-[9px] self-start">
                              <Img
                                src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                                alt="checkbadge"
                                className="h-px object-cover"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="!font-satoshi !font-medium"
                              >
                                Excellent communication and collaboration skills
                              </Text>
                            </div>
                            <div className="mt-24 flex gap-[9px] self-start">
                              <Img
                                src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                                alt="checkbadge"
                                className="h-px object-cover"
                              />
                              <Text
                                size="lg"
                                as="p"
                                className="!font-satoshi !font-medium"
                              >
                                Ability to work in a fast-paced, startup
                                environment
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-[280px] bg-white-A700_d8 px-3 pt-3 md:gap-[210px] sm:gap-[140px]">
                        <div className="flex flex-col items-center gap-[219px] md:gap-[164px] sm:gap-[109px]">
                          <Img
                            src="/images/img_completed_task.png"
                            alt="completedtask"
                            className="h-px object-cover"
                          />
                          <div className="flex flex-col gap-[248px] md:gap-[186px] sm:gap-[124px]">
                            <Heading size="6xl" as="h6">
                              Tasks
                            </Heading>
                            <Text size="lg" as="p" className="!font-satoshi">
                              Your main responsibilities:
                            </Text>
                          </div>
                        </div>
                        <div className="flex flex-col gap-[29px]">
                          <div className="flex gap-[9px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                              alt="checkbadge"
                              className="h-px object-cover"
                            />
                            <Text
                              size="lg"
                              as="p"
                              className="!font-satoshi !font-medium"
                            >
                              UI/UX Design (40%)
                            </Text>
                          </div>
                          <div className="flex gap-[9px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                              alt="checkbadge"
                              className="h-px object-cover"
                            />
                            <Text
                              size="lg"
                              as="p"
                              className="!font-satoshi !font-medium"
                            >
                              User Research (20%)
                            </Text>
                          </div>
                          <div className="flex gap-[9px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                              alt="checkbadge"
                              className="h-px object-cover"
                            />
                            <Text
                              size="lg"
                              as="p"
                              className="!font-satoshi !font-medium"
                            >
                              Collaboration with cross-functional teams (20%)
                            </Text>
                          </div>
                          <div className="flex gap-[9px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                              alt="checkbadge"
                              className="h-px object-cover"
                            />
                            <Text
                              size="lg"
                              as="p"
                              className="!font-satoshi !font-medium"
                            >
                              Iterative Design (10%)
                            </Text>
                          </div>
                          <div className="flex gap-[9px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com_blue_700_01.png"
                              alt="checkbadge"
                              className="h-px object-cover"
                            />
                            <Text
                              size="lg"
                              as="p"
                              className="!font-satoshi !font-medium"
                            >
                              Data-Driven Insights (10%)
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[489px] h-px w-[6px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="mt-[492px] h-px w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
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
      </div>
    </>
  );
}
