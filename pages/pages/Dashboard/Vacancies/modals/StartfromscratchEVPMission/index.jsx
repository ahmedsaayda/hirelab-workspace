import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components";
import Sidebar13 from "../../components/Sidebar13";
import StartFromScratchLeaderIntroductionColumnsalary from "../../components/StartFromScratchLeaderIntroductionColumnsalary";

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

export default function StartfromscratchEVPMission({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex w-[41%] justify-center md:w-full sm:flex-col">
          <Sidebar13 />
          <div className="flex flex-1 flex-col gap-[261px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[195px] sm:gap-[130px] sm:self-stretch sm:p-5">
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
                <div className="flex gap-3 sm:flex-col">
                  <div className="flex w-full flex-col gap-2 sm:w-full">
                    <div className="flex items-center justify-between gap-5">
                      <Text as="p" className="self-end !text-blue_gray-700">
                        Name
                      </Text>
                      <div className="flex py-px">
                        <Text
                          as="p"
                          className="!font-normal !text-blue_gray-700_01"
                        >
                          4/40
                        </Text>
                      </div>
                    </div>
                    <Input
                      shape="round"
                      name="name"
                      placeholder={`Lara Martinson`}
                      className="border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-full">
                    <div className="flex items-center justify-between gap-5">
                      <Text as="p" className="self-end !text-blue_gray-700">
                        Title
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
                      placeholder={`CEO`}
                      className="border border-solid border-blue_gray-100 sm:pr-5"
                    />
                  </div>
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
                      <div className="relative mt-[9px] h-[48px] w-[15%]">
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
            <div className="relative h-[844px] md:h-auto">
              <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                <div className="ml-4 mt-[25px] flex items-center self-stretch bg-white-A700 py-6 pl-6 pr-[21px] md:ml-0 md:flex-col sm:p-5">
                  <div className="flex flex-1 items-center md:flex-col md:self-stretch">
                    <div className="relative z-[3] flex w-full flex-col items-start gap-2">
                      <div className="flex flex-col items-start self-stretch">
                        <Text
                          size="4xl"
                          as="p"
                          className="!font-satoshi !text-[17.48px]"
                        >
                          Excited to
                        </Text>
                        <Heading
                          size="10xl"
                          as="h3"
                          className="!text-[24.97px]"
                        >
                          Meet Our CEO
                        </Heading>
                        <Text
                          size="md"
                          as="p"
                          className="w-full !font-satoshi !text-[10.82px] leading-4"
                        >
                          <>
                            Quote by CEO: &quot;At Hirelab, we&#39;re on a
                            mission to redefine recruitment. We believe that
                            technology and innovation can transform how
                            companies find and hire top talent.&quot;
                            <br />
                            <br />
                            Our CEO, John Smith, envisions a future where hiring
                            is efficient, data-driven, and tailored to
                            individual organizations&#39; needs.
                          </>
                        </Text>
                      </div>
                      <Button
                        size="md"
                        className="min-w-[92px] rounded-[14px] font-satoshi font-bold"
                      >
                        APPLY NOW
                      </Button>
                    </div>
                    <div className="relative ml-[-26px] flex w-full items-start md:ml-0">
                      <Img
                        src="/images/img_user.svg"
                        alt="user"
                        className="mt-8 h-[95px] w-[95px] rounded-lg"
                      />
                      <Img
                        src="/images/img_mask_group_317x317.png"
                        alt="image"
                        className="relative ml-[-69px] h-[317px] w-[317px] object-cover"
                      />
                    </div>
                  </div>
                  <Img
                    src="/images/img_polygon_2.svg"
                    alt="polygontwo"
                    className="relative mb-[39px] ml-[-63px] h-[83px] w-[83px] self-end rounded-lg md:ml-0 md:w-full"
                  />
                </div>
                <div className="mt-[25px] h-[4px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
              </div>
              <div className="absolute bottom-0 right-[0.00px] top-0 my-auto flex h-max w-[19%] flex-col items-end gap-2">
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
                <div className="flex items-start rounded-[15px] bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                  <div className="flex w-[31%] flex-col items-start gap-[11px] md:w-full">
                    <Img
                      src="/images/img_footer_logo.png"
                      alt="footerlogo"
                      className="h-[22px] w-[114px] object-contain"
                    />
                    <Text
                      size="xl"
                      as="p"
                      className="w-[87%] !font-satoshi leading-5 md:w-full"
                    >
                      We are seeking a talented and creative Product Designer to
                      join our dynamic team.{" "}
                    </Text>
                    <div className="flex gap-2.5">
                      <Img
                        src="/images/img_vertical_container_black_900_01_21x21.svg"
                        alt="vertical"
                        className="h-[21px] w-[21px]"
                      />
                      <Img
                        src="/images/img_button_black_900_01.svg"
                        alt="button"
                        className="h-[21px] w-[21px]"
                      />
                      <Img
                        src="/images/img_container_black_900_01.svg"
                        alt="container"
                        className="h-[21px] w-[21px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 gap-px md:flex-row md:self-stretch">
                    {data1.map((d, index) => (
                      <div
                        key={"listposition" + index}
                        className="flex flex-col items-start gap-[13px] px-[25px] sm:px-5"
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
              <div className="absolute bottom-[0.00px] left-0 right-0 m-auto h-[377px] w-[97%] rotate-[180deg] bg-gradient" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
