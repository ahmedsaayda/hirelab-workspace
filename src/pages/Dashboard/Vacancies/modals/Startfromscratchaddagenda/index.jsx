import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components/components";
import Sidebar1 from "../../components/components/Sidebar1";
import StartFromScratchLeaderIntroductionColumnsalary from "../../components/components/StartFromScratchLeaderIntroductionColumnsalary";

const data = [
  {
    image: "images/img_vertical_container.svg",
    salaryrange: "Salary Range:",
    price: "$ 110k -125k / year",
  },
  {
    image: "images/img_vertical_container_blue_700_01.svg",
    salaryrange: "Hours:",
    price: "Full-time",
  },
  {
    image: "images/img_vertical_container_blue_700_01_45x45.svg",
    salaryrange: "Location:",
    price: "San Francisco, CA",
  },
];
const data1 = [
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

export default function Startfromscratchaddagenda({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar1 className="md:hidden md:gap-[30px] md:p-5 sm:pt-5" />
        <div className="flex w-[34%] flex-col gap-[46px] border-r border-solid border-blue_gray-50 px-[30px] pb-8 pt-[30px] md:w-full sm:p-5">
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-5">
                  <Text as="p" className="self-end !text-blue_gray-700">
                    Task Name
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
                  name="name"
                  placeholder={`Assignment Submission`}
                  className="border border-solid border-blue_gray-100 sm:pr-5"
                />
              </div>
              <div className="flex gap-[11px] sm:flex-col">
                <div className="flex w-full flex-col gap-2 sm:w-full">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Duration
                    </Text>
                  </div>
                  <div className="flex justify-evenly gap-3 rounded-lg border border-solid border-blue_gray-100 bg-white-A700 py-3">
                    <div className="flex w-[37%] flex-col items-center gap-1.5">
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                      <Button
                        size="sm"
                        shape="round"
                        className="w-full border border-solid border-blue_gray-100 font-medium !text-blue_gray-700"
                      >
                        00
                      </Button>
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                    </div>
                    <div className="flex w-[32%] flex-col items-center gap-1.5">
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                      <Button
                        size="sm"
                        shape="round"
                        className="w-full border border-solid border-blue_gray-100 font-medium !text-blue_gray-700"
                      >
                        H
                      </Button>
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-full">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Day
                    </Text>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-lg border border-solid border-blue_gray-100 bg-white-A700 p-3">
                    <Img
                      src="/images/img_arrow_up_black_900_01.svg"
                      alt="arrowup"
                      className="h-[24px] w-[24px]"
                    />
                    <Button
                      size="sm"
                      shape="round"
                      className="w-full border border-solid border-blue_gray-100 font-medium !text-blue_gray-700"
                    >
                      Thursday
                    </Button>
                    <Img
                      src="/images/img_arrow_up_black_900_01.svg"
                      alt="arrowup_eleven"
                      className="h-[24px] w-[24px]"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-full">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Time
                    </Text>
                  </div>
                  <div className="flex items-center justify-center rounded-lg border border-solid border-blue_gray-100 bg-white-A700 p-3">
                    <div className="flex flex-1 flex-col items-center gap-1.5">
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                      <Button
                        size="sm"
                        shape="round"
                        className="w-full border border-solid border-blue_gray-100 font-medium !text-blue_gray-700"
                      >
                        00
                      </Button>
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup_fifteen"
                        className="h-[24px] w-[24px]"
                      />
                    </div>
                    <Heading size="3xl" as="h2" className="!text-black-900_01">
                      :
                    </Heading>
                    <div className="flex flex-1 flex-col items-center gap-1.5">
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                      <Button
                        size="sm"
                        shape="round"
                        className="w-full border border-solid border-blue_gray-100 font-medium !text-blue_gray-700"
                      >
                        00
                      </Button>
                      <Img
                        src="/images/img_arrow_up_black_900_01.svg"
                        alt="arrowup"
                        className="h-[24px] w-[24px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-5">
                  <div className="flex items-center gap-2">
                    <Img
                      src="/images/img_magic_wand_01.svg"
                      alt="magicwandone"
                      className="h-[20px] w-[20px] self-start"
                    />
                    <Text as="p" className="self-end !text-light_blue-A700">
                      Description
                    </Text>
                  </div>
                  <div className="flex self-start py-px">
                    <Text
                      as="p"
                      className="!font-normal !text-blue_gray-700_01"
                    >
                      18/400
                    </Text>
                  </div>
                </div>
                <TextArea
                  size="sm"
                  shape="round"
                  name="input_one"
                  placeholder={`We are seeking a talented and creative Product Designer to join our dynamic team. As a Product Designer at Hirelab Inc`}
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
                  <div className="flex w-[79%] items-start justify-between gap-5 md:w-full md:p-5">
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
            <Button shape="round" className="w-full font-semibold sm:px-5">
              Add agenda
            </Button>
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
              <div className="relative h-[567px]">
                <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                  <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="ml-4 mt-[25px] flex flex-col items-center gap-[58px] self-stretch bg-white-A700_f2 px-6 pb-[79px] pt-6 md:ml-0 md:pb-5 sm:gap-[29px] sm:p-5">
                    <div className="flex w-[95%] flex-col items-center md:w-full">
                      <Text
                        size="4xl"
                        as="p"
                        className="!font-satoshi !text-[17.48px]"
                      >
                        Let's check the
                      </Text>
                      <Heading size="10xl" as="h3" className="!text-[24.97px]">
                        What Your Week Looks Like
                      </Heading>
                      <Text
                        size="md"
                        as="p"
                        className="w-[69%] text-center !font-satoshi !text-[10.82px] leading-4 md:w-full"
                      >
                        We are seeking a talented and creative Product Designer
                        to join our dynamic team. As a Product Designer at
                        Hirelab Inc
                      </Text>
                    </div>
                    <div className="flex w-[59%] flex-col items-end gap-10 md:w-full">
                      <div className="flex flex-col items-start gap-9 self-stretch">
                        <div className="flex justify-between gap-5 self-stretch">
                          <div className="flex flex-col items-start gap-0.5 rounded-md border border-solid border-blue-A200 bg-blue-A200 px-4 pb-[5px] pt-2 shadow-8xl">
                            <Heading
                              size="lg"
                              as="h4"
                              className="!text-[10.82px] !text-white-A700"
                            >
                              Assignment Submission
                            </Heading>
                            <Heading
                              size="s"
                              as="h5"
                              className="!text-[7.49px] !text-white-A700"
                            >
                              10:00 am - 02:00 pm
                            </Heading>
                          </div>
                          <div className="flex flex-col items-start gap-0.5 rounded-md border border-solid border-orange-A200 bg-orange-A200 px-4 pb-[5px] pt-2 shadow-9xl">
                            <Heading
                              size="lg"
                              as="h6"
                              className="!text-[10.82px] !text-white-A700"
                            >
                              Meeting with recruiters
                            </Heading>
                            <Heading
                              size="s"
                              as="p"
                              className="!text-[7.49px] !text-white-A700"
                            >
                              05:00 pm - 08:00 pm
                            </Heading>
                          </div>
                        </div>
                        <div className="ml-[54px] flex flex-col items-start gap-0.5 rounded-md border border-solid border-pink-300 bg-pink-300 px-4 pb-[5px] pt-2 shadow-7xl md:ml-0">
                          <Heading
                            size="lg"
                            as="p"
                            className="!text-[10.82px] !text-white-A700"
                          >
                            Meeting with recruiters
                          </Heading>
                          <Heading
                            size="s"
                            as="p"
                            className="!text-[7.49px] !text-white-A700"
                          >
                            11:00 am - 03:00 pm
                          </Heading>
                        </div>
                      </div>
                      <div className="mr-[83px] flex flex-col items-start gap-0.5 rounded-md border border-solid border-green-500 bg-green-500 px-4 pb-[5px] pt-2 shadow-6xl md:mr-0">
                        <Heading
                          size="lg"
                          as="p"
                          className="!text-[10.82px] !text-white-A700"
                        >
                          Meeting with recruiters
                        </Heading>
                        <Heading
                          size="s"
                          as="p"
                          className="!text-[7.49px] !text-white-A700"
                        >
                          02:00 pm - 07:00 pm
                        </Heading>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
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
              <div className="relative z-[3] mt-[-5px] h-[158px] md:h-auto">
                <div className="flex w-full gap-[30px] md:flex-col">
                  {data.map((d, index) => (
                    <StartFromScratchLeaderIntroductionColumnsalary
                      {...d}
                      key={"listsalary" + index}
                      className="gap-[13px] pb-[19px] md:w-full"
                    />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[158px] w-full rotate-[180deg] bg-gradient" />
              </div>
              <div className="mt-[53px] flex bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                <div className="flex w-[31%] flex-col items-start md:w-full">
                  <Img
                    src="/images/img_image_2.png"
                    alt="image"
                    className="h-px w-[53%] object-cover"
                  />
                  <Text size="xl" as="p" className="mt-[104px] !font-satoshi">
                    We are seeking a talented and creative Product Designer to
                    join our dynamic team.{" "}
                  </Text>
                  <div className="mt-44 flex gap-2.5">
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
                  {data1.map((d, index) => (
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
