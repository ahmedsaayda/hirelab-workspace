import React from "react";
import { Heading, Img, Text } from "./..";

export default function UserProfile({
  userImage = "/images3/img_image.png",
  userName = "Alison Medis",
  userRole = "Project Manager",
  userPhone = "+1 (415) 555-1010",
  userEmail = "elison@gmail.com",
  recruiterPhoneEnabled = true,
  recruiterEmailEnabled = true,
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex sm:flex-col items-center w-[50%] mdx:w-full gap-5 p-6 sm:p-5 border-[#eaecf0] border border-solid bg-[#ffffff] rounded-[16px]`}
    >
      <Img
        src={userImage}
        alt="Profile Image"
        className="h-[150px] w-[150px] rounded-[74px] object-cover"
      />
      <div className="flex flex-1 flex-col gap-[26px]">
        <div className="flex flex-col items-start gap-2.5">
          <Heading
            size="heading4xl"
            as="h3"
            className="text-[28px] font-semibold text-[#101828]"
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
        <div className="flex flex-col gap-3">
          {!!recruiterPhoneEnabled && (
            <div className="flex gap-2">
              <Img
                src="/images3/img_phone.svg"
                alt="Phone Icon"
                className="h-[18px] w-[18px]"
              />
              <Text as="p" className="text-[14px] font-medium text-[#475467]">
                {userPhone}
              </Text>
            </div>
          )}
          {!!recruiterEmailEnabled && (
            <div className="flex gap-2">
              <Img
                src="/images3/img_mail_01.svg"
                alt="Email Icon"
                className="h-[18px] w-[18px]"
              />
              <Text
                as="p"
                className="text-[14px] font-medium text-[#475467]"
                style={{ overflowWrap: "anywhere" }}
              >
                {userEmail}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
