import React from "react";
import { Img, Text } from "./..";

export default function HomePageFaqitem1({
  timezone = "What will it cost in the future?",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex">
          <Text size="2xl" as="p" className="!font-medium !text-gray-900_01">
            {timezone}
          </Text>
        </div>
        <Img
          src="/dhwise-images/img_plus_circle.svg"
          alt="image"
          className="h-[24px] w-[24px]"
        />
      </div>
    </div>
  );
}
