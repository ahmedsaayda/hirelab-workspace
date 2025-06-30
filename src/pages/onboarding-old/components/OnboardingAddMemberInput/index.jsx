import React from "react";
import { Button, Img, Text } from "./..";

export default function OnboardingAddMemberInput({
  recruiter = "Recruiter",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-full gap-[18px] px-3.5 py-[26px] sm:py-5 border-light_blue-A700 border border-dashed shadow-xs rounded-lg`}
    >
      <Button
        color="gray_100"
        size="sm"
        shape="circle"
        className="w-[40px] !rounded-[20px]"
      >
        <Img src="/images/img_search_light_blue_a700.svg" />
      </Button>
      <div className="flex">
        <Text size="md" as="p" className="!text-light_blue-A700">
          {recruiter}
        </Text>
      </div>
    </div>
  );
}
