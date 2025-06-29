import React from "react";
import { Heading, Img, Text } from "./..";

export default function StartFromScratchGrowthPathColumninnovatio({
  userimage = "images/img_idea.svg",
  innovationtext = "Innovation Leaders",
  pioneeringtext = "Pioneering recruitment marketing automation.",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-full pt-4 gap-3 px-3 bg-white-A700_0c rounded-[12px]`}
    >
      <Img src={userimage} alt="innovation" className="h-[37px] w-[37px]" />
      <div className="flex flex-col items-start gap-1 self-stretch">
        <Heading
          size="5xl"
          as="h6"
          className="!text-[17.48px] !text-white-A700"
        >
          {innovationtext}
        </Heading>
        <Text
          size="md"
          as="p"
          className="w-full !font-satoshi !text-[10.82px] leading-4 !text-white-A700"
        >
          {pioneeringtext}
        </Text>
      </div>
    </div>
  );
}
