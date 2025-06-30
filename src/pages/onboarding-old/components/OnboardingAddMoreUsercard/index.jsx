import React from "react";
import { Img, Text } from "./..";

export default function OnboardingAddMoreUsercard({
  hrmanagernametext = "HR Manager Name",
  emailtext = "namename@mail.com",
  hrmanageridtext = "HR Manager ID",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-full smx:w-full pb-8 gap-[25px] smx:pb-5 border-blue_gray-50 border border-solid bg-white-A700 rounded-[12px]`}
    >
      <div className="flex flex-col items-center self-stretch">
        <div className="h-[115px] self-stretch rounded-tl-[12px] rounded-tr-[12px] bg-[#EFF8FF]" />
        <div className="relative mt-[-36px] flex w-[46%] flex-col items-center mdx:w-full">
          <Img
            src="/images/img_layer.svg"
            alt="hrmanagerphoto"
            className="h-[62px] w-full mdx:h-auto"
          />
          <Img
            src="/images/img_img.png"
            alt="hrmanageravatar"
            className="relative mt-[-58px] h-[64px] w-[64px] rounded-[50%]"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-[7px]">
        <Text size="md" as="p" className="!text-gray-900">
          {hrmanagernametext}
        </Text>
        <Text as="p" className="!font-normal !text-blue_gray-800">
          {emailtext}
        </Text>
        <Text as="p" className="!font-normal !text-blue_gray-800">
          {hrmanageridtext}
        </Text>
      </div>
      <div className="flex gap-2">
        <Img
          src="/images/img_edit_2.svg"
          alt="editicon"
          className="h-[18px] w-[18px] cursor-pointer"
        />
        <Img
          src="/images/img_trash_01.svg"
          alt="deleteicon"
          className="h-[18px] w-[18px] cursor-pointer"
        />
      </div>
    </div>
  );
}
