import React from "react";
import { Heading, Img, Text } from "./..";

export default function UserProfile5({
  userName = "Caitlyn King",
  userRole = "Project Manager",
  userPhoneNumber = "+1 (415) 555-1010",
  userEmail = "elison@gmail.com",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[50%] mdx:w-full gap-5 p-[18px] bg-[#213326] rounded`}
    >
      <div className="flex gap-3 self-stretch">
        <div className="flex h-[56px] w-[20%] flex-col items-center rounded-[28px] bg-[url(/public/images3/img_avatar_60x60.png)] bg-cover bg-no-repeat">
          <div className="h-[56px] w-[56px] rounded-[28px] border-[0.66px] border-solid border-[#ffffff14]" />
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-1">
          <Heading
            size="headingmd"
            as="h6"
            className="font-['GT_America_Trial'] text-[18px] font-bold uppercase text-[#ffffff]"
          >
            {userName}
          </Heading>
          <Heading
            size="textlg"
            as="p"
            className="font-['GT_America_Trial'] text-[16px] font-normal text-[#ffffff]"
          >
            {userRole}
          </Heading>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 self-stretch">
        <div className="flex items-center gap-2">
          <Img
            src="/images3/img_phone_base_white.svg"
            alt="Phone Icon"
            className="h-[18px] w-[18px]"
          />
          <Text
            as="p"
            className="font-['GT_America_Trial'] text-[14px] font-normal text-[#ffffff]"
          >
            {userPhoneNumber}
          </Text>
        </div>
        <div className="flex flex-1 items-center gap-2 px-1.5">
          <Img
            src="/images3/img_mail_01_base_white.svg"
            alt="Email Icon"
            className="h-[18px] w-[18px]"
          />
          <Text
            as="p"
            className="font-['GT_America_Trial'] text-[14px] font-normal text-[#ffffff]"
          >
            {userEmail}
          </Text>
        </div>
      </div>
    </div>
  );
}
