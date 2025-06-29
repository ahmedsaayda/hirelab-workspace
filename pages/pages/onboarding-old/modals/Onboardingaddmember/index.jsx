import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, Heading, Img, Input, Text } from "../../components";
import OnboardingAddMemberInput from "../../components/OnboardingAddMemberInput";

const data = [
  { recruiter: "Recruiter" },
  { recruiter: "Manager" },
  { recruiter: "HR Manager" },
];

export default function Onboardingaddmember({ isOpen, ...props }) {
  return (
    <ModalProvider
      {...props}
      appElement={document.getElementById("root")}
      isOpen={isOpen}
      className="min-w-[1376px]"
    >
      {/* member addition section */}
      <div className="container-xs pl-[272px] pr-[271px]">
        {/* member form modal section */}
        <div className="flex flex-col gap-5 rounded-[12px] bg-white-A700 pb-8 pl-6 pr-[23px] pt-[31px] smx:p-5">
          {/* member information container section */}
          <div className="flex flex-col gap-[31px]">
            {/* member title row section */}
            <div className="flex items-center justify-between gap-5 pl-[330px] mdx:pl-5">
              <Heading size="md" as="h1" className="!text-black-900">
                Add member
              </Heading>
              <Img
                src="/images/img_arrow_right.svg"
                alt="arrow image"
                className="h-[24px] w-[24px] cursor-pointer"
              />
            </div>

            {/* member role selection list section */}
            <div className="flex gap-6 mdx:flex-col">
              {data.map((d, index) => (
                <OnboardingAddMemberInput
                  {...d}
                  key={"inputsList" + index}
                  className="cursor-pointer bg-white-A700"
                />
              ))}
            </div>
          </div>

          {/* member details input fields section */}
          <div className="flex flex-col gap-6 rounded-[12px] border border-solid border-blue_gray-50 bg-white-A700 p-6 smx:p-5">
            <div className="flex gap-3 mdx:flex-col">
              <div className="flex w-full flex-col gap-2">
                <div className="flex self-start">
                  <Text as="p">HR Manager Name</Text>
                </div>
                <Input
                  shape="round"
                  name="Name Input"
                  placeholder={`Lia`}
                  className="smx:pr-5"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className="flex self-start">
                  <Text as="p">HR Manager ID</Text>
                </div>
                <Input
                  shape="round"
                  name="ID Input"
                  placeholder={`Designation Title here`}
                  className="smx:pr-5"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex self-start">
                <Text as="p">HR Manager Email</Text>
              </div>
              <Input
                shape="round"
                type="email"
                name="Email Input"
                placeholder={`lia@mail.com`}
                className="smx:pr-5"
              />
            </div>

            {/* member image upload section */}
            <div className="flex flex-col gap-2">
              <div className="flex self-start">
                <Text as="p">Image</Text>
              </div>
              <div className="cursor-pointer rounded-lg border border-dashed border-blue_gray-100 bg-white-A700 pb-[5px] pl-3.5 pt-6 smx:pt-5">
                <div className="flex items-start justify-between gap-5 pl-[237px] mdx:pl-5">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex flex-wrap gap-1 self-start">
                      <Heading as="h2" className="!text-light_blue-A700">
                        Click to upload
                      </Heading>
                      <Text as="p" className="!font-normal">
                        or drag and drop
                      </Text>
                    </div>
                    <Text size="xs" as="p">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </Text>
                  </div>
                  <div className="relative mt-[9px] h-[48px] w-[10%]">
                    <div className="absolute left-[0.00px] top-[0.00px] m-auto flex items-center px-px">
                      <Heading
                        size="xs"
                        as="h3"
                        className="relative z-[1] mb-[5px] flex items-center justify-center self-end rounded-sm bg-red-700 p-0.5 !font-plusjakartasans !text-white-A700"
                      >
                        PNG
                      </Heading>
                      <Img
                        src="/images/img_file.svg"
                        alt="file image"
                        className="relative ml-[-22px] h-[40px]"
                      />
                    </div>
                    <Img
                      src="/images/img_cursor.svg"
                      alt="cursor image"
                      className="absolute bottom-[0.00px] right-[0.00px] z-[2] m-auto h-[20px] w-[20px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* form submission section */}
          <div className="flex flex-col gap-5">
            <div className="h-px bg-blue_gray-50" />
            <div className="flex gap-5">
              <Button
                color="white_A700"
                shape="round"
                className="w-full border border-solid border-blue_gray-100 font-semibold smx:px-5"
              >
                Cancel
              </Button>
              <Button
                shape="round"
                className="w-full border border-solid border-light_blue-A700 font-semibold smx:px-5"
              >
                Add member
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalProvider>
  );
}
