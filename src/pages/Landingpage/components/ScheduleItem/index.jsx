import { Text, Heading } from "./..";
import React from "react";

export default function ScheduleItem({
  itemNumber = "// 1.",
  timeRange = "9:00 AM - 10:00 AM",
  eventName = "Morning Check-In & Team Sync",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex justify-center items-center gap-[26px] p-1.5 bg-[#213326] flex-1 rounded`}
    >
      <Heading
        size="text6xl"
        as="p"
        className="font-['GT_America_Trial'] text-[34px] font-medium text-[#ffffff] sm:text-[28px]"
      >
        {itemNumber}
      </Heading>
      <div className="flex flex-1 flex-col items-start justify-center gap-1.5 sm:gap-1.5">
        <Text
          size="text2xl"
          as="p"
          className="font-['GT_America_Trial'] text-[20px] font-medium text-[#ffffff] sm:text-[17px]"
        >
          {timeRange}
        </Text>
        <Text
          size="textxl"
          as="p"
          className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff] sm:text-[15px]"
        >
          {eventName}
        </Text>
      </div>
    </div>
  );
}
