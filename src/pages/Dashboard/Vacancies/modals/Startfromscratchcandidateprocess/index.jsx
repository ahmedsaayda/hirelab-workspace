import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Input, Text } from "../../components/components";
import Sidebar5 from "../../components/components/Sidebar5";
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

export default function Startfromscratchcandidateprocess({ isOpen, ...props }) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar5 />
        <div className="flex w-[34%] flex-col gap-[227px] border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:w-full md:gap-[170px] sm:gap-[113px] sm:p-5">
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
                <div className="flex self-start">
                  <Text as="p" className="!text-blue_gray-700">
                    Step 1
                  </Text>
                </div>
                <Input
                  shape="round"
                  name="input_one"
                  placeholder={`Response`}
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
              <div className="flex flex-col items-start gap-2">
                <Text as="p" className="!text-blue_gray-700">
                  Step 2
                </Text>
                <Input
                  shape="round"
                  name="input_three"
                  placeholder={`First Interview`}
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
              <div className="flex flex-col items-start gap-2">
                <Text as="p" className="!text-blue_gray-700">
                  Step 3
                </Text>
                <Input
                  shape="round"
                  name="input_five"
                  placeholder={`Second Interview`}
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
              <div className="flex flex-col gap-2">
                <div className="flex self-start">
                  <Text as="p" className="!text-blue_gray-700">
                    Step 4
                  </Text>
                </div>
                <Input
                  shape="round"
                  name="input_seven"
                  placeholder={`Terms of Services`}
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
                <Heading size="3xl" as="h2" className="!text-blue_gray-700_01">
                  Add more
                </Heading>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-px bg-blue_gray-50_01" />
            <div className="flex gap-5 sm:flex-col">
              <Input
                size="md"
                shape="round"
                name="button_one"
                placeholder={`Back`}
                className="w-full border border-solid border-blue_gray-100 font-semibold !text-blue_gray-800 sm:w-full sm:px-5"
              />
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
            <div className="flex flex-col gap-[5px]">
              <div className="relative h-[476px]">
                <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-[97%] flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                  <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                  <div className="ml-4 mt-[25px] flex items-center self-stretch bg-white-A700 py-6 pl-6 pr-[21px] md:ml-0 md:flex-col sm:p-5">
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
                            as="h3"
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
                  <Button
                    size="lg"
                    shape="square"
                    className="min-w-[107px] tracking-[0.09px] !shadow-lg"
                  >
                    Tom Jason
                  </Button>
                </div>
              </div>
              <div className="relative h-[250px]">
                <div className="absolute left-0 right-0 top-[0.00px] m-auto flex w-full gap-[30px] md:relative md:flex-col">
                  {data.map((d, index) => (
                    <StartFromScratchLeaderIntroductionColumnsalary
                      {...d}
                      key={"listsalary" + index}
                      className="gap-[13px] pb-[19px] md:w-full"
                    />
                  ))}
                </div>
                <div className="absolute bottom-[-0.18px] left-0 right-0 m-auto w-full">
                  <div className="relative z-[2] h-[230px] rotate-[180deg] bg-gradient" />
                  <div className="relative mt-[-50px] flex rounded-[15px] bg-white-A700_f2 px-[30px] pt-[30px] md:flex-col sm:px-5 sm:pt-5">
                    <div className="flex w-[31%] flex-col items-start md:w-full">
                      <Img
                        src="/images/img_image_20x114.png"
                        alt="image"
                        className="h-[20px] w-[53%] object-cover"
                      />
                      <Text
                        size="xl"
                        as="p"
                        className="mt-[13px] !font-satoshi"
                      >
                        We are seeking a talented and creative Product Designer
                        to join our dynamic team.{" "}
                      </Text>
                      <div className="mt-[84px] flex gap-2.5">
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
                          className="flex flex-col items-start px-[25px] sm:px-5"
                        >
                          <Heading as="h4">{d.position}</Heading>
                          <Heading as="h5" className="mt-[13px]">
                            {d.company}
                          </Heading>
                          <Heading as="h6" className="mt-[41px]">
                            {d.mission}
                          </Heading>
                          <Heading as="p" className="mt-[72px]">
                            {d.testimonial}
                          </Heading>
                          <Heading as="p" className="mt-[103px]">
                            {d.aboutus}
                          </Heading>
                        </div>
                      ))}
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
