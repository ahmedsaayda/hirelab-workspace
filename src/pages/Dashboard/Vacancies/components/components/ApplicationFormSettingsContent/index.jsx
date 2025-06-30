import React from "react";
import { Heading, Switch, Text } from "./..";

export default function ApplicationFormSettingsContent({
  progresstext = "Enable or disable a progress bar that shows respondents how far they are in completing the form.",
  progresslabel = "Progress Bar",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex smx:flex-col justify-between items-start gap-5 flex-1`}
    >
      <div className="flex w-[58%] flex-col items-start gap-[74px] pb-10 mdx:gap-[55px] smx:w-full smx:gap-[37px] smx:pb-5">
        <Text
          as="p"
          className="w-full !font-normal leading-5 !text-blue_gray-700_01"
        >
          {progresstext}
        </Text>
        <Heading size="3xl" as="p" className="!text-blue_gray-800">
          {progresslabel}
        </Heading>
      </div>
      <Switch />
    </div>
  );
}
