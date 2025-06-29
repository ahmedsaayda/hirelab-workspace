import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, CheckBox, Heading, Img, Input, Text } from "../../components";
import Sidebar6 from "../../components/Sidebar6";

const data = [
  {
    position: "Position",
    company: "Company",
    mission: "Mission",
    testimonial: "Testimonial",
    aboutus: "About us",
  },
  {
    position: "Contact Details",
    company: "Name of Recruiter",
    mission: "Email address",
    testimonial: "Phone number",
    aboutus: "Locations",
  },
];

export default function Startfromscratchjobspecifications({
  isOpen,
  ...props
}) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar6 />
        <div className="flex w-[34%] flex-col gap-60 border-r border-solid border-blue_gray-50 px-[30px] pb-8 pt-[30px] md:w-full md:gap-[180px] sm:gap-[120px] sm:p-5">
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
                <div className="flex flex-col gap-2">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Tasks
                    </Text>
                  </div>
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
                    className="gap-[35px] border border-solid border-blue_gray-100"
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
        <div className="w-[59%] border-r border-solid border-blue_gray-50 pl-[25px] pr-2.5 pt-[25px] md:w-full sm:pl-5 sm:pt-5">
          <div className="flex flex-col gap-[31px]">
            <div>
              <div className="flex flex-col gap-[25px]">
                <div className="flex items-center justify-between gap-5">
                  <Heading
                    size="7xl"
                    as="h2"
                    className="self-start !text-black-900_01"
                  >
                    Preview
                  </Heading>
                  <div className="flex items-start gap-3.5 rounded-md bg-gray-100_01">
                    <Text
                      size="lg"
                      as="p"
                      className="mt-1.5 !font-medium !text-light_blue-A700"
                    >
                      Mobile
                    </Text>
                    <Button
                      size="sm"
                      className="min-w-[74px] rounded font-semibold"
                    >
                      Desktop
                    </Button>
                  </div>
                  <Img
                    src="/images/img_expand_06.svg"
                    alt="expandsix"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <div className="h-px bg-blue_gray-50" />
              </div>
            </div>
            <div>
              <div className="relative h-[609px]">
                <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                  <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="ml-4 mt-[25px] flex flex-col items-center gap-6 self-stretch bg-white-A700_f2 px-[25px] pb-6 pt-[25px] md:ml-0 sm:p-5">
                    <div className="flex w-[65%] flex-col items-center md:w-full">
                      <Text
                        size="4xl"
                        as="p"
                        className="!font-satoshi !text-[17.48px]"
                      >
                        Let’s check the
                      </Text>
                      <Heading size="10xl" as="h3" className="!text-[24.97px]">
                        Job Specifics
                      </Heading>
                      <Text
                        size="md"
                        as="p"
                        className="relative mt-[-3px] w-full text-center !font-satoshi !text-[10.82px] leading-4"
                      >
                        We are seeking a talented and creative Product Designer
                        to join our dynamic team. As a Product Designer at
                        Hirelab Inc
                      </Text>
                    </div>
                    <div className="flex w-[95%] gap-6 md:w-full md:flex-col">
                      <div className="flex w-full flex-col items-center gap-3 rounded-[12px] bg-white-A700_d8 px-3 pb-[11px] pt-4">
                        <div className="flex flex-col items-center gap-1">
                          <Img
                            src="/images/img_vertical_container.svg"
                            alt="benefits_and"
                            className="h-[37px] w-[37px]"
                          />
                          <div className="flex flex-col items-center pl-2.5 pr-[9px]">
                            <Heading
                              size="5xl"
                              as="h4"
                              className="!text-[17.48px]"
                            >
                              Benefits and Perks
                            </Heading>
                            <Text
                              size="s"
                              as="p"
                              className="!font-satoshi !text-[9.99px]"
                            >
                              What you can expect:
                            </Text>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 self-stretch">
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="image"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Competitive compensation package
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="image"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="self-end !font-satoshi !text-[9.99px] !font-medium"
                            >
                              Flexible working hours
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="image"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Health, dental, and vision insurance
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px] self-start">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="image"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="self-end !font-satoshi !text-[9.99px] !font-medium"
                            >
                              401(k) retirement plan
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="image"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Generous vacation and paid time off
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="image"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Opportunities for professional development and
                              growth
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-center gap-3 rounded-[12px] bg-white-A700_d8 px-3 pb-[87px] pt-4 md:pb-5">
                        <div className="flex flex-col items-center gap-1">
                          <Img
                            src="/images/img_vertical_container.svg"
                            alt="dollarbag"
                            className="h-[37px] w-[37px]"
                          />
                          <div className="flex flex-col items-center pl-7 pr-[29px] sm:px-5">
                            <Heading
                              size="5xl"
                              as="h5"
                              className="!text-[17.48px]"
                            >
                              Tasks
                            </Heading>
                            <Text
                              size="s"
                              as="p"
                              className="!font-satoshi !text-[9.99px]"
                            >
                              Your main responsibilities:
                            </Text>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 self-stretch">
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="self-end !font-satoshi !text-[9.99px] !font-medium"
                            >
                              UI/UX Design (40%)
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="self-end !font-satoshi !text-[9.99px] !font-medium"
                            >
                              User Research (20%)
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Collaboration with cross-functional teams (20%)
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="self-end !font-satoshi !text-[9.99px] !font-medium"
                            >
                              Iterative Design (10%)
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="self-end !font-satoshi !text-[9.99px] !font-medium"
                            >
                              Data-Driven Insights (10%)
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-center gap-3 rounded-[12px] bg-white-A700_d8 px-3 pb-[19px] pt-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <Img
                            src="/images/img_vertical_container.svg"
                            alt="dollarbag"
                            className="h-[37px] w-[37px]"
                          />
                          <div className="flex flex-col items-center px-[27px] sm:px-5">
                            <Heading
                              size="5xl"
                              as="h6"
                              className="!text-[17.48px]"
                            >
                              Requirements
                            </Heading>
                            <Text
                              size="s"
                              as="p"
                              className="!font-satoshi !text-[9.99px]"
                            >
                              What we expect from you:
                            </Text>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 self-stretch">
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Proven experience as a Product Designer
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Proficiency in design tools (e.g., Adobe Suite,
                              Sketch, Figma)
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Strong understanding of user-centered design
                              principles
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Excellent communication and collaboration skills
                            </Text>
                          </div>
                          <div className="flex items-center gap-[7px]">
                            <Img
                              src="/images/img_check_badge_svgrepo_com.svg"
                              alt="checkbadge"
                              className="h-[15px] w-[15px]"
                            />
                            <Text
                              size="s"
                              as="p"
                              className="w-[90%] !font-satoshi !text-[9.99px] !font-medium leading-4"
                            >
                              Ability to work in a fast-paced, startup
                              environment
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[25px] h-[4px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                </div>
                <div className="absolute bottom-[0.00px] right-[0.00px] m-auto flex w-[19%] flex-col items-end gap-2">
                  <div className="mr-1.5 flex items-center justify-between gap-5 self-stretch md:mr-0">
                    <Img
                      src="/images/img_save.svg"
                      alt="save"
                      className="h-[24px]"
                    />
                    <div className="mb-[5px] h-[8px] w-[8px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  </div>
                  <div className="flex bg-light_blue-A700 shadow-lg">
                    <Text
                      size="5xl"
                      as="p"
                      className="!font-normal tracking-[0.09px] !text-white-A700"
                    >
                      Tom Jason
                    </Text>
                  </div>
                </div>
              </div>
              <div className="relative z-[1] mt-[-5px] flex flex-col gap-px">
                <div className="relative h-[128px] flex-1 md:h-auto md:w-full md:flex-none">
                  <div className="flex w-[31%] flex-col items-start gap-[13px] rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                    <Img
                      src="/images/img_vertical_container.svg"
                      alt="salary_rangeone"
                      className="h-[45px] w-[45px]"
                    />
                    <div className="flex flex-col items-start">
                      <Heading size="8xl" as="h5">
                        Salary Range:
                      </Heading>
                      <Text size="xl" as="p" className="!font-satoshi">
                        $ 110k -125k / year
                      </Text>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[128px] w-full rotate-[180deg] bg-gradient" />
                </div>
                <div className="flex flex-1 justify-center bg-gradient px-2.5 pt-2.5">
                  <div className="flex w-[32%] flex-col items-start gap-2.5 rounded-[15px] bg-white-A700_f2 px-5 pt-5 md:w-full">
                    <Img
                      src="/images/img_vertical_container_blue_700_01.svg"
                      alt="vertical"
                      className="h-[45px] w-[45px]"
                    />
                    <div className="flex flex-col items-start">
                      <Heading size="8xl" as="h5">
                        Hours:
                      </Heading>
                      <Text size="xl" as="p" className="!font-satoshi">
                        Full-time
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-end bg-gradient pt-2.5">
                  <div className="flex w-[31%] flex-col items-start gap-2.5 rounded-[15px] bg-white-A700_f2 px-5 pt-5 md:w-full">
                    <Img
                      src="/images/img_vertical_container_blue_700_01_45x45.svg"
                      alt="vertical"
                      className="h-[45px] w-[45px]"
                    />
                    <div className="flex flex-col items-start">
                      <Heading size="8xl" as="h5">
                        Location:
                      </Heading>
                      <Text size="xl" as="p" className="!font-satoshi">
                        San Francisco, CA
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[82px] flex bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                <div className="flex w-[31%] flex-col items-start md:w-full">
                  <Img
                    src="/images/img_image_5.png"
                    alt="image"
                    className="h-px w-[53%] object-cover"
                  />
                  <Text size="xl" as="p" className="mt-[146px] !font-satoshi">
                    We are seeking a talented and creative Product Designer to
                    join our dynamic team.{" "}
                  </Text>
                  <div className="mt-[217px] flex gap-2.5">
                    <Img
                      src="/images/img_vertical_container_black_900_01.png"
                      alt="vertical"
                      className="h-px object-cover"
                    />
                    <Img
                      src="/images/img_button.png"
                      alt="button"
                      className="h-px object-cover"
                    />
                    <Img
                      src="/images/img_container.png"
                      alt="container"
                      className="h-px object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-1 gap-px md:flex-row md:self-stretch">
                  {data.map((d, index) => (
                    <div
                      key={"listposition" + index}
                      className="flex flex-col items-start gap-[30px] px-[25px] sm:px-5"
                    >
                      <Heading as="p">{d.position}</Heading>
                      <Heading as="p">{d.company}</Heading>
                      <Heading as="p">{d.mission}</Heading>
                      <Heading as="p">{d.testimonial}</Heading>
                      <Heading as="p">{d.aboutus}</Heading>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
