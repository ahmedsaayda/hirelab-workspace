import React from "react";
import { Heading, Img, Text } from "./..";
import { useFocusContext } from "../../../../../src/contexts/FocusContext";

export default function UserProfile3({
  userName = "Caitlyn King",
  userRole = "Project Manager",
  userPhoneNumber = "+1 (415) 555-1010",
  userEmail = "elison@gmail.com",
  userAvatar = "/public/images/img_avatar.png",
  index,
  recruiterPhoneEnabled = true,
  recruiterEmailEnabled = true,
  ...props
}) {
  const { handleItemClick } = useFocusContext();
  return (
    <div
      {...props}
      className={`${props.className}  mdx:min-h-fit min-h-full    flex flex-col items-center justify-left  gap-5 p-4 border-[#d0d5dd] border border-solid rounded pr-8 flex-1  mdx:w-full`}
    >
      <div className="flex self-stretch gap-3">
        <div
          className={`flex h-[56px] flex-col items-center rounded-[28px] bg-cover bg-no-repeat`}
          style={{
            backgroundImage: `url(${userAvatar})`,
          }}
        >
          <div className="h-[56px] w-[56px] rounded-[28px] border-[0.66px] border-solid border-[#0f172814]" />
        </div>
        <div className="flex flex-col items-start justify-center flex-1 gap-1">
          <Heading
            onClick={() => handleItemClick(`recruiterFullname[${index}]`)}
            size="text_lg_semibold"
            as="h6"
            className="text-[18px] font-semibold !text-[#000000]"
          >
            {userName}
          </Heading>
          <Text
            onClick={() => handleItemClick(`recruiterRole[${index}]`)}
            size="text_md_regular"
            as="p"
            className="text-[16px] font-normal !text-[#000000]"
          >
            {userRole}
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap self-stretch gap-5">
        {!!recruiterPhoneEnabled && (
          <a
            //recruiterPhone
            onClick={() => handleItemClick(`recruiterPhone[${index}]`)}
            href={`tel:${userPhoneNumber}`}
            className="flex justify-start w-full gap-2"
          >
            <Img
              src="/images3/img_phone_light_blue_a700.svg"
              alt="Phone Icon"
              className="h-[18px] w-[18px]"
            />
            <Text as="p" className="text-[14px] font-medium !text-[#000000]">
              {userPhoneNumber}
            </Text>
          </a>
        )}
        {!!recruiterEmailEnabled && (
          <a
            //recruiterEmail
            onClick={() => handleItemClick(`recruiterEmail[${index}]`)}
            href={`mailto:${userEmail}`}
            className="flex justify-start w-full gap-2"
          >
            <Img
              src="/images3/img_mail_01_light_blue_a700.svg"
              alt="Email Icon"
              className="h-[18px] w-[18px]"
            />
            <Text as="p" className="text-[14px] font-medium !text-[#000000]">
              {userEmail}
            </Text>
          </a>
        )}
      </div>
    </div>
  );
}
