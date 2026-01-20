import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Input, Text, TextArea } from "../../components/components";
import Sidebar16 from "../../components/components/Sidebar16";

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

export default function Startfromscratchtextbox({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex w-[41%] justify-center md:w-full sm:flex-col">
          <Sidebar16 />
          <div className="flex flex-1 flex-col gap-[149px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[111px] sm:gap-[74px] sm:self-stretch sm:p-5">
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
              <div className="flex flex-col gap-[31px]">
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
                      placeholder={`Discover our company`}
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
                      placeholder={`We are proud and loud we put our employee first.`}
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
          <div className="flex flex-col gap-[31px]">
            <div className="flex flex-col gap-[25px]">
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
            </div>
            <div>
              <div className="relative h-[638px]">
                <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start gap-[25px] border-2 border-solid border-light_blue-A700 bg-white-A700">
                  <div className="flex flex-col items-start self-stretch">
                    <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                    <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                    <div className="ml-4 mt-[25px] flex items-center self-stretch bg-white-A700 py-6 pl-6 pr-[21px] md:ml-0 md:flex-col sm:p-5">
                      <div className="flex w-full flex-col items-start gap-2">
                        <div className="flex flex-col items-start self-stretch">
                          <Text
                            size="4xl"
                            as="p"
                            className="!font-satoshi !text-[17.48px]"
                          >
                            About the job
                          </Text>
                          <Heading
                            size="10xl"
                            as="h3"
                            className="!text-[24.97px]"
                          >
                            Job Description
                          </Heading>
                          <Text
                            size="md"
                            as="p"
                            className="!font-satoshi !text-[10.82px]"
                          >
                            With you we aim to set a new standard in user
                            design.
                          </Text>
                          <Text
                            size="md"
                            as="p"
                            className="w-full !font-satoshi !text-[10.82px] leading-4"
                          >
                            <>
                              Join Hirelab as a Product Designer and become a
                              crucial part of our mission to revolutionize the
                              world of recruitment marketing automation. As a
                              Product Designer, you&#39;ll play an instrumental
                              role in shaping the future of hiring by crafting
                              innovative solutions that empower recruiters to
                              discover the perfect candidates effortlessly.
                              <br />
                              <br />
                              In this role, you&#39;ll have the opportunity to
                              utilize your creative prowess and design expertise
                              to the fullest. Collaborating closely with
                              cross-functional teams, you&#39;ll transform ideas
                              into visually stunning and user-centric designs.
                              Your work will not only enhance the user
                              experience but also streamline the hiring process
                              for companies worldwide.
                              <br />
                              <br />
                              At Hirelab, we foster an environment of constant
                              growth and innovation. You&#39;ll be encouraged to
                              think outside the box, challenge conventions, and
                              push the boundaries of design. Moreover,
                              you&#39;ll be part of a dynamic and diverse team
                              of professionals who share your passion for
                              excellence.
                              <br />
                              If you&#39;re seeking a career where your design
                              skills can have a tangible impact and where
                              innovation knows no bounds, join us at Hirelab and
                              embark on a journey that will redefine recruitment
                              for generations to come.
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
                      <div className="flex w-full flex-col items-start">
                        <Img
                          src="/images/img_user.svg"
                          alt="user"
                          className="ml-[30px] h-[95px] w-[95px] rounded-lg md:ml-0"
                        />
                        <div className="relative mt-[-82px] flex items-center self-stretch">
                          <Img
                            src="/images/img_mask_group.png"
                            alt="image"
                            className="h-[317px] w-[317px] object-cover"
                          />
                          <Img
                            src="/images/img_polygon_2.svg"
                            alt="polygontwo"
                            className="relative ml-[-63px] h-[83px] w-[83px] rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[4px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
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
                  <Button
                    size="lg"
                    shape="square"
                    className="min-w-[107px] tracking-[0.09px] !shadow-lg"
                  >
                    Tom Jason
                  </Button>
                </div>
              </div>
              <div className="mt-[5px] flex flex-col gap-px">
                <div className="flex flex-1 md:flex-col">
                  <div className="flex flex-col items-start gap-[5px] rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                    <Img
                      src="/images/img_vertical_container.svg"
                      alt="salary_rangeone"
                      className="h-[45px] w-[45px]"
                    />
                    <div className="flex flex-col items-start gap-[17px]">
                      <Heading size="8xl" as="h4">
                        Salary Range:
                      </Heading>
                      <Text size="xl" as="p" className="!font-satoshi">
                        $ 110k -125k / year
                      </Text>
                    </div>
                  </div>
                  <div className="relative ml-[-230px] h-[88px] flex-1 rotate-[180deg] bg-gradient md:ml-0 md:self-stretch" />
                </div>
                <div className="flex bg-gradient px-[260px] md:px-5">
                  <div className="flex flex-col items-start gap-[5px] rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                    <Img
                      src="/images/img_vertical_container_blue_700_01.svg"
                      alt="vertical"
                      className="h-[45px] w-[45px]"
                    />
                    <div className="flex flex-col items-start gap-[17px]">
                      <Heading size="8xl" as="h5">
                        Hours:
                      </Heading>
                      <Text size="xl" as="p" className="!font-satoshi">
                        Full-time
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-end bg-gradient">
                  <div className="flex flex-col items-start gap-[5px] rounded-[15px] bg-white-A700_f2 px-5 pt-5">
                    <Img
                      src="/images/img_vertical_container_blue_700_01_45x45.svg"
                      alt="vertical"
                      className="h-[45px] w-[45px]"
                    />
                    <div className="flex flex-col items-start gap-[17px]">
                      <Heading size="8xl" as="h6">
                        Location:
                      </Heading>
                      <Text size="xl" as="p" className="!font-satoshi">
                        San Francisco, CA
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[111px] flex bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                <div className="flex w-[31%] flex-col items-start md:w-full">
                  <Img
                    src="/images/img_image_1x114.png"
                    alt="image"
                    className="h-px w-[53%] object-cover"
                  />
                  <Text size="xl" as="p" className="mt-[175px] !font-satoshi">
                    We are seeking a talented and creative Product Designer to
                    join our dynamic team.{" "}
                  </Text>
                  <div className="mt-[246px] flex gap-2.5">
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
