import React from "react";
import { Heading, Img, Text } from "./..";

export default function UserProfile6({
  userDescription = "Working at HireLab has been an incredible experience. The collaborative culture, opportunities for growth, and supportive leadership make every day fulfilling. I feel valued as an employee and am proud to be part of a team that consistently strives for excellence. It’s truly a rewarding and inspiring environment.",
  userName = "Alison Medis",
  userRole = "Project Manager",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[32%] mdx:w-full gap-6 p-6 sm:p-5 bg-[#213326]`}
    >
      <Img
        src="/images3/img_forward.svg"
        alt="Forward Image"
        className="h-[34px]"
      />
      <Text
        size="text2xl"
        as="p"
        className="self-stretch text-center font-['GT_America_Trial'] text-[20px] font-normal leading-6 text-[#f9f9f9]"
      >
        {userDescription}
      </Text>
      <div className="flex justify-center self-stretch px-14 mdx:px-5">
        <div className="flex flex-col items-center">
          <Heading
            size="headingmd"
            as="h6"
            className="font-['GT_America_Trial'] text-[18px] font-bold uppercase text-[#f9f9f9]"
          >
            {userName}
          </Heading>
          <Text
            as="p"
            className="font-['GT_America_Trial'] text-[14px] font-normal text-[#f9f9f9]"
          >
            {userRole}
          </Text>
        </div>
      </div>
    </div>
  );
}
