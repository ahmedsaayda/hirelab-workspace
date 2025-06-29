import React from "react";
import { Text, Heading, Img } from "./..";

export default function StartFromScratchGrowthPathMobileRowinnovation({
  userimage = "images/img_idea.svg",
  innovationtitle = "Innovation Leaders",
  pioneeringtext = "Pioneering recruitment marketing automation.",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex items-center pt-4 gap-[22px] px-4 bg-white-A700_0c`}>
      <Img src={userimage} alt="innovation" className="h-[50px] w-[50px]" />
      <div className="flex flex-1 flex-col items-start">
        <Heading size="4xl" as="h6" className="!font-bold !text-white-A700">
          {innovationtitle}
        </Heading>
        <Text as="p" className="w-full !font-satoshi !font-normal leading-[22px] !text-white-A700">
          {pioneeringtext}
        </Text>
      </div>
    </div>
  );
}
