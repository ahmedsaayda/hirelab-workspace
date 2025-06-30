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
import Sidebar161 from "../../components/components/Sidebar161";
import StartFromScratchFooterColumnvertical from "../../components/components/StartFromScratchFooterColumnvertical";
import StartFromScratchFooterTooltip from "../../components/components/StartFromScratchFooterTooltip";

const data = [
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
const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function Startfromscratchfooter({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="w-[41%] md:w-full">
          <div className="flex sm:flex-col">
            <Sidebar161 />
            <div className="relative h-[848px] flex-1 sm:w-full sm:flex-none sm:self-stretch">
              <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-max w-[98%] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] sm:p-5">
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
                <div className="mt-8 h-px bg-blue_gray-50" />
                <div className="mt-[31px] flex flex-col gap-2">
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
                <div className="mt-[197px] flex justify-between gap-5 sm:flex-col">
                  <div className="flex gap-2">
                    <div className="flex">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Social Sharing
                      </Text>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex">
                      <Text as="p" className="!text-blue_gray-700_01">
                        Show Recommended Jobs
                      </Text>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-start gap-2">
                  <div className="flex">
                    <Text as="p" className="!text-blue_gray-700">
                      Recommended Job 1
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
                    name="arrowdown"
                    placeholder={`Your company Facts`}
                    options={dropDownOptions}
                    className="gap-px self-stretch border border-solid border-blue_gray-100 sm:pr-5"
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
                <div className="mt-[220px] flex flex-col gap-5">
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
              <div className="absolute left-[0.00px] top-[26%] m-auto flex w-[93%] flex-col items-end gap-[5px]">
                <div className="flex w-[90%] justify-between gap-5 md:w-full">
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
                <div className="relative h-[123px] self-stretch">
                  <div className="absolute bottom-0 right-[0.00px] top-0 my-auto flex h-max w-[90%] justify-center rounded-lg border border-solid border-blue_gray-100 bg-white-A700 p-3">
                    <Text
                      size="3xl"
                      as="p"
                      className="w-full leading-6 !text-blue_gray-700"
                    >
                      With the Core App development team we are on our way to
                      become the worlds user friendliest consumer app for job
                      connections with employers. We are just missing one
                      person. You!
                    </Text>
                  </div>
                  <StartFromScratchFooterTooltip />
                </div>
              </div>
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
            <div className="relative h-[732px] md:h-auto">
              <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start gap-[23px] border-2 border-solid border-light_blue-A700 bg-white-A700">
                <div className="flex items-start gap-[11px] self-stretch md:flex-col">
                  <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="flex flex-1 flex-col items-end gap-[25px] md:self-stretch">
                    <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                    <div className="flex items-start self-stretch rounded-[15px] bg-white-A700_f2 px-[30px] pb-7 pt-[30px] md:flex-col sm:p-5">
                      <div className="flex w-[31%] flex-col items-start gap-[11px] md:w-full">
                        <Img
                          src="/images/img_image_22x114.png"
                          alt="image"
                          className="h-[22px] w-[55%] object-cover"
                        />
                        <Text
                          size="xl"
                          as="p"
                          className="w-[91%] !font-satoshi leading-5 md:w-full"
                        >
                          We are seeking a talented and creative Product
                          Designer to join our dynamic team.{" "}
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
                            <Heading as="h3">{d.position}</Heading>
                            <Heading as="h4">{d.company}</Heading>
                            <Heading as="h5">{d.mission}</Heading>
                            <Heading as="h6">{d.testimonial}</Heading>
                            <Heading as="p">{d.aboutus}</Heading>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[7px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
              </div>
              <div className="absolute right-[0.00px] top-[33%] m-auto flex w-[19%] flex-col items-end gap-2">
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
              <div className="flex w-[97%] flex-col items-center gap-12">
                <div className="flex w-[87%] md:w-full">
                  <div className="flex w-full items-center md:flex-col">
                    <div className="flex flex-1 items-center md:flex-col md:self-stretch">
                      <div className="relative z-[1] flex w-full flex-col items-start gap-2">
                        <div className="flex flex-col items-start self-stretch">
                          <Text
                            size="4xl"
                            as="p"
                            className="!font-satoshi !text-[17.48px]"
                          >
                            See the
                          </Text>
                          <Heading
                            size="10xl"
                            as="h4"
                            className="!text-[24.97px]"
                          >
                            Details for Position
                          </Heading>
                          <Text
                            size="md"
                            as="p"
                            className="w-full !font-satoshi !text-[10.82px] leading-4"
                          >
                            <>
                              We are seeking a talented and creative Product
                              Designer to join our dynamic team. As a Product
                              Designer at Hirelab Inc, you will play a crucial
                              role in shaping the user experience and visual
                              identity of our products.
                              <br />
                              You will work closely with cross-functional teams
                              to translate ideas and concepts into innovative
                              and user-friendly designs.
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
                          src="/images/img_mask_group.png"
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
                </div>
                <div className="flex gap-[30px] self-stretch pt-[30px] md:flex-col sm:pt-5">
                  {data.map((d, index) => (
                    <StartFromScratchFooterColumnvertical
                      {...d}
                      key={"horizontal" + index}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-[0.00px] left-0 right-0 z-[2] m-auto h-[453px] w-[97%] rotate-[180deg] bg-gradient" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
