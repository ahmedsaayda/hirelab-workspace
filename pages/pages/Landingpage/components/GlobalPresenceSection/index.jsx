import React from "react";
import { Heading, Img, Text } from "./..";

export default function GlobalPresenceSection({
  globalPresenceImage = "/images3/img_world_pana_1.svg",
  globalPresenceTitle = "Global Presence",
  globalPresenceDescription = "Serving clients in over 20 countries.",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center sm:w-full gap-6`}
    >
      <Img
        src={globalPresenceImage}
        alt="World Image"
        className="mx-10 h-[120px] w-[120px]"
      />
      <div className="flex flex-col items-center gap-2 self-stretch">
        <Text
          size="textxl"
          as="p"
          className="font-['GT_Haptik_Trial'] text-[18px] font-medium text-[#ffffff]"
        >
          {globalPresenceTitle}
        </Text>
        <Heading
          size="textlg"
          as="p"
          className="self-stretch text-center font-['GT_Haptik_Trial'] text-[16px] font-normal leading-6 text-[#ffffff]"
        >
          {globalPresenceDescription}
        </Heading>
      </div>
    </div>
  );
}
