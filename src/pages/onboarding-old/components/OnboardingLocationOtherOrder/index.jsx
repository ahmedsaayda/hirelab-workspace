import React from "react";
import { Button, Img, Text } from "./..";

export default function OnboardingLocationOtherOrder({
  brandstyletext = "Brand Style",
  choosebrandstyletext = "Choose the brand style.",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex items-start gap-4`}>
      <div className="flex flex-col items-center">
        <Button
          size="xs"
          shape="circle"
          className="w-[30px] !rounded-[15px] border border-solid border-light_blue-A700"
        >
          <Img src="/images/img_check_white_a700.svg" />
        </Button>
        <Img
          src="/images/img_light_bulb.svg"
          alt="lightbulb image"
          className="h-[36px]"
        />
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <Text size="md" as="p" className="!text-blue_gray-800">
          {brandstyletext}
        </Text>
        <Text size="xs" as="p">
          {choosebrandstyletext}
        </Text>
      </div>
    </div>
  );
}
