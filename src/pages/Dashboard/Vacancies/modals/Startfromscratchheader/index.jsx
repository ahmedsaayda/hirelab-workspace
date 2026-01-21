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
import Sidebar9 from "../../components/components/Sidebar9";
import StartFromScratchHeaderColumnvertical from "../../components/components/StartFromScratchHeaderColumnvertical";

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
const data1 = [
  {
    image: "images/img_vertical_container_blue_700_01_1x45.png",
    salaryrange: "Salary Range:",
    price: "$ 110k -125k / year",
  },
  {
    image: "images/img_vertical_container_1x45.png",
    salaryrange: "Hours:",
    price: "Full-time",
  },
  {
    image: "images/img_location_pin_svgrepo_com.png",
    salaryrange: "Location:",
    price: "San Francisco, CA",
  },
];
const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function Startfromscratchheader({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex w-[41%] justify-center md:w-full sm:flex-col">
          <Sidebar9 className="md:hidden md:gap-[19px] sm:pt-5" />
          <div className="flex flex-1 flex-col gap-6 border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] sm:self-stretch sm:p-5">
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
                  <div className="flex justify-between gap-5">
                    <div className="flex items-center gap-2">
                      <Img
                        src="/images/img_magic_wand_01.svg"
                        alt="magicwandone"
                        className="h-[20px] w-[20px]"
                      />
                      <Text as="p" className="self-end !text-light_blue-A700">
                        Headline
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
                <div className="flex justify-between gap-5">
                  <div className="flex gap-2">
                    <div className="flex">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Remote
                      </Text>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex pb-px pt-0.5">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Hybrid
                      </Text>
                    </div>
                    <Switch />
                  </div>
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
                className="h-[20px] w-[10%]"
              />
            </div>
            <div className="h-px bg-blue_gray-50" />
            <div className="flex flex-col gap-[193px] md:gap-36 sm:gap-24">
              <div className="relative h-[732px]">
                <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-max w-[97%]">
                  <div>
                    <div className="border-2 border-solid border-light_blue-A700 bg-white-A700 pb-[30px] sm:pb-5">
                      <div className="flex flex-col items-center">
                        <div className="flex justify-between gap-5 self-stretch">
                          <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                          <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                        </div>
                        <div className="mt-[25px] flex w-[18%] items-center justify-center gap-2 md:w-full">
                          <Img
                            src="/images/img_user_red_a200_01.svg"
                            alt="user"
                            className="h-[33px] w-[33px]"
                          />
                          <Img
                            src="/images/img_settings_gray_900.svg"
                            alt="settings"
                            className="mb-1 h-[20px] w-[73%] self-end"
                          />
                        </div>
                        <div className="mt-3.5 flex items-center gap-[11px] self-stretch md:flex-col">
                          <div className="mb-[17px] h-[8px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                          <div className="flex flex-1 flex-col items-center md:self-stretch">
                            <Img
                              src="/images/img_image_300x719.png"
                              alt="image"
                              className="h-[300px] w-full rounded-[20px] object-cover md:h-auto"
                            />
                            <div className="mt-5 flex flex-col items-center gap-[5px]">
                              <div className="flex">
                                <Text
                                  size="6xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  Segment is hiring for
                                </Text>
                              </div>
                              <Heading
                                size="12xl"
                                as="h3"
                                className="bg-gradient3 bg-clip-text !text-transparent"
                              >
                                Product Designer
                              </Heading>
                            </div>
                            <div className="mt-3 flex gap-[15px]">
                              <Button
                                variant="outline"
                                color="undefined_undefined"
                                className="min-w-[136px] rounded-[19px] font-satoshi font-bold"
                              >
                                See Description
                              </Button>
                              <Button className="min-w-[107px] rounded-[19px] font-satoshi font-bold">
                                Apply Now
                              </Button>
                            </div>
                            <Text
                              size="lg"
                              as="p"
                              className="mt-5 w-full text-center !font-satoshi leading-[18px]"
                            >
                              We are seeking a talented and creative Product
                              Designer to join our dynamic team. As a Product
                              Designer at Hirelab Inc, you will play a crucial
                              role in shaping the user experience and visual
                              identity of our products. You will work closely
                              with cross-functional teams to translate ideas and
                              concepts into innovative and user-friendly
                              designs.
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-[-26px] h-[87px] rotate-[180deg] bg-gradient" />
                  </div>
                  <div className="relative mt-[-37px] flex gap-[30px] pt-[30px] md:flex-col sm:pt-5">
                    {data1.map((d, index) => (
                      <StartFromScratchHeaderColumnvertical
                        {...d}
                        key={"horizontal" + index}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-[10%] right-[0.00px] m-auto flex w-[19%] flex-col items-end gap-1.5">
                  <div className="mr-1.5 flex items-start justify-between gap-5 self-stretch md:mr-0">
                    <Img
                      src="/images/img_save.svg"
                      alt="save"
                      className="h-[24px]"
                    />
                    <div className="h-[8px] w-[8px] border border-solid border-light_blue-A700 bg-white-A700" />
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
              <div className="flex bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                <div className="flex w-[31%] flex-col items-start md:w-full">
                  <Img
                    src="/images/img_image_3.png"
                    alt="image"
                    className="h-px w-[53%] object-cover"
                  />
                  <Text size="xl" as="p" className="mt-64 !font-satoshi">
                    We are seeking a talented and creative Product Designer to
                    join our dynamic team.{" "}
                  </Text>
                  <div className="mt-[328px] flex gap-2.5">
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
          </div>
        </div>
      </div>
    </>
  );
}
