import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components/components";
import Sidebar17 from "../../components/components/Sidebar17";
import StartFromScratchGrowthPathColumninnovatio from "../../components/components/StartFromScratchGrowthPathColumninnovatio";
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
    userimage: "images/img_idea.svg",
    innovationtext: "Innovation Leaders",
    pioneeringtext: "Pioneering recruitment marketing automation.",
  },
  {
    userimage: "images/img_globe.svg",
    innovationtext: "Global Presence",
    pioneeringtext: "Serving clients in over 20 countries.",
  },
  {
    userimage: "images/img_team_1.svg",
    innovationtext: "Employee-Centric",
    pioneeringtext: "Recognized for our employee benefits.",
  },
  {
    userimage: "images/img_trophy.svg",
    innovationtext: "Award-Winning",
    pioneeringtext: "Recipient of multiple industry awards.",
  },
  {
    userimage: "images/img_shines_white_a700.svg",
    innovationtext: "Cutting-Edge Technology",
    pioneeringtext: "Constantly evolving our platform.",
  },
  {
    userimage: "images/img_team_1_white_a700_37x37.svg",
    innovationtext: "Community Engagement",
    pioneeringtext: "Active in social responsibility initiatives.",
  },
];
const data2 = [
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

export default function Startfromscratchaboutcompany({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex w-[41%] justify-center md:w-full sm:flex-col">
          <Sidebar17 />
          <div className="flex flex-1 flex-col gap-8 border-r border-solid border-blue_gray-50 px-[31px] pb-9 pt-[31px] sm:self-stretch sm:p-5">
            <div className="flex flex-col gap-[31px]">
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
                    placeholder={`Developing sustainable futures for our children and generations to come.`}
                    className="border border-solid border-blue_gray-100"
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
                    size="md"
                    shape="round"
                    name="input_five"
                    placeholder={`With the Core App development team we are on our way to become the worlds user friendliest consumer app for job connections with employers. We are just missing one person. You!`}
                    className="!border-blue_gray-100 leading-6 text-blue_gray-700"
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex">
                    <Text as="p" className="!text-blue_gray-700">
                      Facts
                    </Text>
                  </div>
                  <Input
                    shape="round"
                    name="input_seven"
                    placeholder={`Your company Facts`}
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
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Image
                    </Text>
                  </div>
                  <div className="flex flex-col gap-3">
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
                          <Text
                            size="lg"
                            as="p"
                            className="!text-blue_gray-700"
                          >
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
                    <div className="relative h-[88px] rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 pb-3 pl-4 pr-2 pt-2">
                      <div className="absolute bottom-[12.00px] left-0 right-0 m-auto flex w-[98%] items-center gap-3 sm:relative sm:flex-col">
                        <Img
                          src="/images/img_user_white_a700.svg"
                          alt="user"
                          className="h-[40px] w-[40px] sm:w-full"
                        />
                        <div className="flex flex-1 flex-col gap-[5px] sm:self-stretch">
                          <div className="flex flex-col items-start">
                            <Text as="p" className="!text-blue_gray-800">
                              Dashboard recording.mp4
                            </Text>
                            <Text
                              as="p"
                              className="!font-normal !text-blue_gray-700_01"
                            >
                              16 MB
                            </Text>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <div className="h-[8px] flex-1 rounded bg-light_blue-A700" />
                            <Text as="p" className="!text-blue_gray-800">
                              100%
                            </Text>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="2xl"
                        shape="round"
                        className="absolute right-[8.00px] top-[8.00px] m-auto w-[36px]"
                      >
                        <Img src="/images/img_trash_01.svg" />
                      </Button>
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
        <div className="w-[59%] border-r border-solid border-blue_gray-50 pl-[25px] pr-2.5 pt-[25px] md:w-full sm:pl-5 sm:pt-5">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-5">
              <Heading
                size="7xl"
                as="h2"
                className="self-start !text-[#000000]_01"
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
            <div className="relative h-[844px] md:h-auto">
              <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                <div className="ml-4 mt-[25px] flex flex-col items-center gap-6 self-stretch bg-gradient2 p-6 md:ml-0 sm:p-5">
                  <div className="flex w-[95%] flex-col items-center md:w-full">
                    <Text
                      size="4xl"
                      as="p"
                      className="!font-satoshi !text-[17.48px] !text-white-A700"
                    >
                      See the
                    </Text>
                    <Heading
                      size="10xl"
                      as="h3"
                      className="!text-[24.97px] !text-white-A700"
                    >
                      Company Facts
                    </Heading>
                    <Text
                      size="md"
                      as="p"
                      className="relative mt-[-3px] w-[69%] text-center !font-satoshi !text-[10.82px] leading-4 !text-white-A700 md:w-full"
                    >
                      We are seeking a talented and creative Product Designer to
                      join our dynamic team. As a Product Designer at Hirelab
                      Inc
                    </Text>
                  </div>
                  <div className="grid w-[95%] grid-cols-3 justify-center gap-6 md:grid-cols-2 sm:grid-cols-1">
                    {data1.map((d, index) => (
                      <StartFromScratchGrowthPathColumninnovatio
                        {...d}
                        key={"gridinnovation" + index}
                        className="pb-4 md:gap-3"
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-6 h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
              </div>
              <div className="absolute bottom-[27%] right-[0.00px] m-auto flex w-[19%] flex-col items-end gap-2">
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
              <div className="flex w-[97%] flex-col gap-[54px] sm:gap-[27px]">
                <div className="flex gap-[30px] md:flex-col">
                  {data.map((d, index) => (
                    <StartFromScratchLeaderIntroductionColumnsalary
                      {...d}
                      key={"listsalary" + index}
                      className="gap-[13px] pb-[19px] md:w-full"
                    />
                  ))}
                </div>
                <div className="flex rounded-[10px] bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                  <div className="flex w-[31%] flex-col items-start md:w-full">
                    <Img
                      src="/images/img_image_6.png"
                      alt="image"
                      className="h-px w-[53%] object-cover"
                    />
                    <Text size="xl" as="p" className="mt-[41px] !font-satoshi">
                      We are seeking a talented and creative Product Designer to
                      join our dynamic team.{" "}
                    </Text>
                    <div className="mt-[113px] flex gap-2.5">
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
                    {data2.map((d, index) => (
                      <div
                        key={"listposition" + index}
                        className="flex flex-col items-start gap-[30px] px-[25px] sm:px-5"
                      >
                        <Heading as="h4">{d.position}</Heading>
                        <Heading as="h5">{d.company}</Heading>
                        <Heading as="h6">{d.mission}</Heading>
                        <Heading as="p">{d.testimonial}</Heading>
                        <Heading as="p">{d.aboutus}</Heading>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[0.00px] left-0 right-0 m-auto h-[252px] w-[97%] rotate-[180deg] bg-gradient" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
