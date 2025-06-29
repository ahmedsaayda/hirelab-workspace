import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Slider, Text } from "../../components";
import Sidebar4 from "../../components/Sidebar4";
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

export default function Startfromscratchemployeetestimonials({
  isOpen,
  ...props
}) {
  const [sliderState, setSliderState] = React.useState(0);
  const sliderRef = React.useRef(null);

  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <div className="flex w-[41%] justify-center md:w-full sm:flex-col">
          <Sidebar4 className="md:hidden md:gap-[30px] sm:pt-5" />
          <div className="flex flex-1 flex-col gap-[403px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:gap-[302px] sm:gap-[201px] sm:self-stretch sm:p-5">
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
              <div className="flex flex-col gap-3 rounded-lg border border-solid border-blue_gray-100 bg-white-A700 p-3">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex w-[22%] items-center justify-center gap-3">
                    <Img
                      src="/images/img_avatar.png"
                      alt="avatar"
                      className="h-[40px] w-[40px] rounded-[50%]"
                    />
                    <div className="flex py-px">
                      <Text as="p" className="!text-gray-900">
                        John
                      </Text>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Img
                      src="/images/img_edit_2.svg"
                      alt="edittwo"
                      className="h-[18px] w-[18px]"
                    />
                    <Img
                      src="/images/img_trash_01_red_700.svg"
                      alt="trashone"
                      className="h-[18px] w-[18px]"
                    />
                  </div>
                </div>
                <Text
                  as="p"
                  className="!font-normal leading-6 !text-blue_gray-700_01"
                >
                  With the Core App development team we are on our way to become
                  the worlds user friendliest consumer app for job connections
                  with employers. We are just missing one person. You!
                </Text>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="h-px bg-blue_gray-50_01" />
              <div className="flex flex-col gap-5">
                <Button shape="round" className="w-full font-semibold sm:px-5">
                  Add testimonial
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
          </div>
        </div>
        <div className="w-[59%] border-r border-solid border-blue_gray-50 pl-[25px] pr-2.5 pt-[25px] md:w-full sm:pl-5 sm:pt-5">
          <div className="flex flex-col gap-[31px]">
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
            <div className="flex flex-col gap-6">
              <div className="relative h-[725px] md:h-auto">
                <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                  <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="ml-4 mt-[25px] flex flex-col items-center gap-5 self-stretch bg-white-A700 p-6 md:ml-0 sm:p-5">
                    <div className="flex w-[95%] flex-col items-center md:w-full">
                      <Text
                        size="4xl"
                        as="p"
                        className="!font-satoshi !text-[17.48px]"
                      >
                        See our latest
                      </Text>
                      <Heading size="10xl" as="h3" className="!text-[24.97px]">
                        Employee Testimonials
                      </Heading>
                      <Text
                        size="md"
                        as="p"
                        className="relative mt-[-3px] w-[69%] text-center !font-satoshi !text-[10.82px] leading-4 md:w-full"
                      >
                        We are seeking a talented and creative Product Designer
                        to join our dynamic team. As a Product Designer at
                        Hirelab Inc
                      </Text>
                    </div>
                    <div className="mx-[7px] flex w-[95%] max-w-[635px] gap-3.5 md:mx-0 md:w-full md:flex-col">
                      <Slider
                        autoPlay
                        autoPlayInterval={2000}
                        responsive={{
                          0: { items: 1 },
                          550: { items: 2 },
                          1050: { items: 4 },
                        }}
                        renderDotsItem={(props) => {
                          return props?.isActive ? (
                            <div className="mr-[7.49px] h-[9px] w-[9px] bg-blue-700_01" />
                          ) : (
                            <div className="mr-[7.49px] h-[6px] w-[6px] bg-white_A700_cc" />
                          );
                        }}
                        activeIndex={sliderState}
                        onSlideChanged={(e) => {
                          setSliderState(e?.item);
                        }}
                        ref={sliderRef}
                        items={[...Array(12)].map(() => (
                          <React.Fragment key={Math.random()}>
                            <div className="flex flex-col gap-2.5">
                              <div className="flex flex-col gap-1.5 rounded-[12px] border border-solid border-blue-700_01 bg-white-A700_ea py-3 pl-[9px] pr-2.5">
                                <Img
                                  src="/images/img_frame_1173.svg"
                                  alt="image"
                                  className="h-[17px]"
                                />
                                <Text
                                  size="xl"
                                  as="p"
                                  className="!font-satoshi !text-[13.31px] !font-medium leading-[19px]"
                                >
                                  “We are seeking a talented and creative
                                  Product Designer to join our dynamic team. As
                                  a Product Designer at Hirelab Inc”
                                </Text>
                              </div>
                              <div className="flex items-center gap-1">
                                <Img
                                  src="/images/img_rectangle_167.png"
                                  alt="circleimage"
                                  className="h-[41px] w-[41px] rounded-[50%]"
                                />
                                <div className="flex flex-col items-start gap-[3px]">
                                  <Heading
                                    size="2xl"
                                    as="h4"
                                    className="!text-[13.31px]"
                                  >
                                    Zain Ul Abideen
                                  </Heading>
                                  <Text
                                    size="s"
                                    as="p"
                                    className="!font-satoshi !text-[9.99px]"
                                  >
                                    Product Designer
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      />
                    </div>
                  </div>
                  <div className="mt-[23px] h-[6px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                </div>
                <div className="absolute bottom-1/4 right-[0.00px] m-auto flex w-[19%] flex-col items-end gap-2">
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
                <div className="mb-[29px] flex w-[97%] gap-[30px] md:flex-col">
                  {data.map((d, index) => (
                    <StartFromScratchLeaderIntroductionColumnsalary
                      {...d}
                      key={"listsalary" + index}
                      className="gap-[13px] pb-[19px] md:w-full"
                    />
                  ))}
                </div>
                <div className="absolute bottom-[0.95px] left-0 right-0 m-auto h-[205px] w-[97%] rotate-[180deg] bg-gradient" />
              </div>
              <div className="flex bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                <div className="flex w-[31%] flex-col items-start md:w-full">
                  <Img
                    src="/images/img_image.png"
                    alt="image"
                    className="h-px w-[53%] object-cover"
                  />
                  <Text size="xl" as="p" className="mt-20 !font-satoshi">
                    We are seeking a talented and creative Product Designer to
                    join our dynamic team.{" "}
                  </Text>
                  <div className="mt-[152px] flex gap-2.5">
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
