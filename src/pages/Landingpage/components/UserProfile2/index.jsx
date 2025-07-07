import React from "react";
import { Heading, Img, Text } from "./..";

export default function UserProfile2({
  userName = "Caitlyn King",
  userRole = "Project Manager",
  phoneNumber = "+1 (415) 555-1010",
  emailAddress = "elison@gmail.com",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[50%] mdx:w-full`}
    >
      <div className="flex h-[64px] w-[18%] flex-col items-center rounded-[32px] bg-[url(/public/images3/img_avatar.png)] bg-cover bg-no-repeat">
        <div className="h-[64px] w-[64px] rounded-[32px] border-[0.75px] border-solid border-[#0f172814]" />
      </div>
      <Heading
        size="text_lg_semibold"
        as="h6"
        className="mt-[22px] text-[18px] font-semibold text-[#0f1728]"
      >
        {userName}
      </Heading>
      <Text
        size="text_md_regular"
        as="p"
        className="mt-1 text-[16px] font-normal text-[#475466]"
      >
        {userRole}
      </Text>
      <div className="mt-5 flex items-center gap-3 self-stretch">
        <div className="flex flex-1 justify-center gap-2">
          <Img
            src="/images3/img_phone.svg"
            alt="Phone Icon"
            className="h-[18px] w-[18px]"
          />
          <Text as="p" className="text-[14px] font-medium text-[#475467]">
            {phoneNumber}
          </Text>
        </div>
        <div className="h-[8px] w-[8px] rounded bg-[#5207CD]" />
        <div className="flex flex-1 justify-center gap-2">
          <Img
            src="/images3/img_mail_01.svg"
            alt="Email Icon"
            className="h-[18px] w-[18px]"
          />
          <Text as="p" className="text-[14px] font-medium text-[#475467]">
            {emailAddress}
          </Text>
        </div>
      </div>
    </div>
  );
}
