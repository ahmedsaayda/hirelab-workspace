import React from "react";
import { Heading, Img, Text } from "./..";

export default function UserProfile1({
  userImage = "/images3/img_image_64x64.png",
  userName = "Alison Medis",
  userRole = "Project Manager",
  userDescription = "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence. It’s truly a rewarding and inspiring environment.",
  avatarEnabled = true,
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[32%] mdx:w-full gap-[22px] p-6 sm:p-5 border-[#eaecf0] border border-solid bg-[#ffffff] rounded-[16px]`}
    >
      <div className="flex self-stretch gap-4">
        {avatarEnabled && (
          <Img
            src={userImage}
            alt="Profile Image"
            className="h-[64px] w-[64px] rounded-[32px] object-cover"
          />
        )}
        <div className="flex flex-1 flex-col items-start justify-center gap-2.5">
          <Heading
            size="headingxl"
            as="h5"
            className="text-[22px] font-semibold text-[#5207CD]"
          >
            {userName}
          </Heading>
          <Heading
            size="headings"
            as="h6"
            className="text-[16px] font-semibold text-[#475467]"
          >
            {userRole}
          </Heading>
        </div>
      </div>
      <Text
        as="p"
        className="w-full text-[14px] font-normal leading-5 text-[#475467]"
      >
        {userDescription}
      </Text>
    </div>
  );
}
