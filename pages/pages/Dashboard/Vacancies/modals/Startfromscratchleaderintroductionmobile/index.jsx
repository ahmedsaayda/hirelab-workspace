import React from "react";
import { default as ModalProvider } from "react-modal";
import {
  Button,
  Heading,
  Img,
  Input,
  RatingBar,
  Text,
  TextArea,
} from "../../components";
import Sidebar1 from "../../components/Sidebar1";

export default function Startfromscratchleaderintroductionmobile({
  isOpen,
  ...props
}) {
  return (
    <>
      <div className="container-sm flex justify-center rounded-[12px] border border-solid border-blue_gray-50_01 bg-white-A700 md:flex-col md:p-5">
        <Sidebar1 className="md:hidden md:gap-[30px] md:p-5 sm:pt-5" />
        <div className="flex flex-1 flex-col gap-10 border-r border-solid border-blue_gray-50 px-[31px] pb-8 pt-[31px] md:self-stretch sm:p-5">
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
                      Header Text 1
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
                  placeholder={`Who will you report to?`}
                  className="border border-solid border-blue_gray-100 sm:pr-5"
                />
              </div>
              <div className="flex gap-3 md:flex-col">
                <div className="flex w-full flex-col gap-2">
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
                    placeholder={`Lara`}
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
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
                    placeholder={`Designation Title here`}
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
              </div>
              <div className="flex gap-3 md:flex-col">
                <div className="flex w-full flex-col gap-2">
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
                    placeholder={`Lara`}
                    className="border border-solid border-blue_gray-100 sm:pr-5"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
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
                    name="input_five"
                    placeholder={`Designation Title here`}
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
                  shape="round"
                  name="input_seven"
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
                  <div className="flex w-[66%] items-start justify-between gap-5 md:w-full md:p-5">
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
                    <div className="relative mt-[9px] h-[48px] w-[10%]">
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
        <div className="w-[34%] border-r border-solid border-blue_gray-50 pl-[26px] pt-[26px] md:w-full sm:pl-5 sm:pt-5">
          <div className="flex flex-col items-end gap-[533px] md:gap-[399px] sm:gap-[266px]">
            <div className="flex items-center self-stretch sm:flex-col">
              <div className="relative z-[4] h-px w-[8px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
              <div className="relative ml-[-5px] h-[822px] flex-1 sm:ml-0 sm:w-full sm:flex-none sm:self-stretch">
                <div className="absolute bottom-0 left-[0.00px] top-0 my-auto flex h-max w-[93%] flex-col items-center">
                  <div className="relative z-[3] flex items-center gap-3.5 rounded-md bg-gray-100_01">
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
                  <div className="relative mt-[-28px] flex w-full flex-col gap-[30px]">
                    <div className="flex items-center justify-between gap-5">
                      <Heading
                        size="7xl"
                        as="h2"
                        className="!text-black-900_01"
                      >
                        Preview
                      </Heading>
                      <Img
                        src="/images/img_expand_06.svg"
                        alt="expandsix"
                        className="h-[20px] w-[19%] self-start"
                      />
                    </div>
                    <div className="h-px bg-blue_gray-50" />
                    <div className="flex flex-col items-start border-2 border-solid border-light_blue-A700 bg-white-A700">
                      <div className="h-[5px] w-[5px] border border-solid border-light_blue-A700 bg-white-A700" />
                      <div className="relative mt-[-5px] h-[5px] w-[5px] self-end border border-solid border-light_blue-A700 bg-white-A700" />
                      <div className="mt-[7px] flex w-[92%] flex-col gap-6 self-center bg-white-A700 px-4 pt-6 md:w-full sm:pt-5">
                        <div className="flex flex-col items-center">
                          <Text size="3xl" as="p" className="!font-satoshi">
                            See our latest
                          </Text>
                          <Heading size="10xl" as="h3">
                            Employee Testimonials
                          </Heading>
                          <Text
                            size="3xl"
                            as="p"
                            className="relative mt-[-1px] w-[95%] text-center !font-satoshi leading-6 md:w-full"
                          >
                            We are seeking a talented and creative Product
                            Designer to join our dynamic team. As a Product
                            Designer at Hirelab Inc
                          </Text>
                        </div>
                        <div className="flex flex-col gap-[185px] md:gap-[138px] sm:gap-[92px]">
                          <div className="flex flex-col gap-8">
                            <div className="flex flex-1 flex-col gap-[26px]">
                              <div className="flex flex-col items-center gap-4 rounded-[20px] border-2 border-solid border-blue-700_01 bg-white-A700_ea p-4">
                                <RatingBar
                                  value={1}
                                  isEditable={true}
                                  size={25}
                                  className="flex justify-between"
                                />
                                <Text
                                  as="p"
                                  className="w-full !font-satoshi leading-[22px]"
                                >
                                  “We are seeking a talented and creative
                                  Product Designer to join our dynamic team. As
                                  a Product Designer at Hirelab Inc”
                                </Text>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Img
                                  src="/images/img_rectangle_167_44x44.png"
                                  alt="circleimage"
                                  className="h-[44px] w-[44px] rounded-[50%]"
                                />
                                <div className="flex flex-col items-start gap-1.5">
                                  <Heading
                                    size="4xl"
                                    as="h4"
                                    className="!font-bold"
                                  >
                                    Zain Ul Abideen
                                  </Heading>
                                  <Text
                                    size="lg"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Product Designer
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-[26px]">
                              <div className="flex flex-col items-center gap-4 rounded-[20px] border-2 border-solid border-blue-700_01 bg-white-A700_ea p-4">
                                <RatingBar
                                  value={1}
                                  isEditable={true}
                                  size={25}
                                  className="flex justify-between"
                                />
                                <Text
                                  as="p"
                                  className="w-full !font-satoshi leading-[22px]"
                                >
                                  “Came sooner than expected, nice packaging and
                                  good matching product!”
                                </Text>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Img
                                  src="/images/img_rectangle_168.png"
                                  alt="circleimage"
                                  className="h-[44px] w-[44px] rounded-[50%]"
                                />
                                <div className="flex flex-col items-start gap-[9px]">
                                  <Heading
                                    size="4xl"
                                    as="h5"
                                    className="!font-bold"
                                  >
                                    Alberto Silva
                                  </Heading>
                                  <Text
                                    size="3xl"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Medicoist
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-[97px] md:gap-[72px] sm:gap-12">
                              <div className="flex flex-col items-center gap-3.5 rounded-[20px] border-2 border-solid border-blue-700_01 bg-white-A700_ea px-4 pt-4">
                                <RatingBar
                                  value={1}
                                  isEditable={true}
                                  size={25}
                                  className="flex justify-between"
                                />
                                <Text as="p" className="!font-satoshi">
                                  “Don’t actually think they deserve one star.
                                  We have had our Newfound insured with these
                                  guys since a puppy. 8 years at £83/m.”
                                </Text>
                              </div>
                              <div className="flex items-center gap-2.5 self-start">
                                <Img
                                  src="/images/img_rectangle_167_1x44.png"
                                  alt="image"
                                  className="mt-[5px] h-px self-start rounded-[-51px] object-cover"
                                />
                                <div className="flex flex-col gap-[127px] md:gap-[95px] sm:gap-[63px]">
                                  <Heading
                                    size="4xl"
                                    as="h6"
                                    className="!font-bold"
                                  >
                                    Aly Dougherty
                                  </Heading>
                                  <Text
                                    size="3xl"
                                    as="p"
                                    className="!font-satoshi"
                                  >
                                    Web Developer
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[328px] md:gap-[246px] sm:gap-[164px]">
                            <div className="flex flex-col items-center gap-[242px] border-2 border-solid border-blue-700_01 bg-white-A700_ea px-4 pt-4 md:gap-[181px] sm:gap-[121px]">
                              <div className="flex gap-[7px] px-[15px]">
                                <Img
                                  src="/images/img_star_fall_minim.png"
                                  alt="image"
                                  className="h-px object-cover"
                                />
                                <Img
                                  src="/images/img_star_fall_minim.png"
                                  alt="image"
                                  className="h-px object-cover"
                                />
                                <Img
                                  src="/images/img_star_fall_minim.png"
                                  alt="image"
                                  className="h-px object-cover"
                                />
                                <Img
                                  src="/images/img_star_fall_minim_blue_700_01.png"
                                  alt="image"
                                  className="h-px object-cover"
                                />
                                <Img
                                  src="/images/img_star_fall_minim_blue_700_01.png"
                                  alt="image"
                                  className="h-px object-cover"
                                />
                              </div>
                              <Text as="p" className="!font-satoshi">
                                “Came sooner than expected, nice packaging and
                                good matching product!”
                              </Text>
                            </div>
                            <div className="flex gap-2.5 self-start">
                              <Img
                                src="/images/img_rectangle_167_2.png"
                                alt="image"
                                className="h-px rounded-[-166px] object-cover"
                              />
                              <div className="flex flex-col gap-[358px] md:gap-[268px] sm:gap-[179px]">
                                <Heading
                                  size="4xl"
                                  as="h6"
                                  className="!font-bold"
                                >
                                  Sarah Carter
                                </Heading>
                                <Text
                                  size="3xl"
                                  as="p"
                                  className="!font-satoshi"
                                >
                                  MedicineMarketPlace
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-[4%] right-[0.00px] m-auto flex flex-col items-start gap-2">
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
            <div className="mr-[30px] h-px w-[8px] border border-solid border-light_blue-A700 bg-white-A700 md:mr-0" />
          </div>
        </div>
      </div>
    </>
  );
}
