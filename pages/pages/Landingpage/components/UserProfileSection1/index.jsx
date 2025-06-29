import React from "react";
import { Button, Heading, Img, Text } from "./..";

export default function UserProfileSection1({
  headingText = "Innovation Leaders",
  paragraphText = "Recruitment marketing automation.",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-full gap-6 p-[22px] sm:p-5 border-[#eaecf0] border border-solid bg-[#ffffff] rounded-[12px]`}
    >
      <Button
        size="xl"
        shape="round"
        className="w-[48px] rounded-[10px] border border-solid border-[#eaecf0] px-3"
      >
        <Img src="/images3/img_bar_chart_square_up.svg" />
      </Button>
      <div className="flex flex-col items-center justify-center gap-2.5 self-stretch px-[34px] sm:px-5">
        <Heading
          size="headinglg"
          as="h5"
          className="text-[20px] font-semibold text-[#0f1728]"
        >
          {headingText}
        </Heading>
        <Text
          size="text_md_regular"
          as="p"
          className="text-[16px] font-normal text-[#475466]"
        >
          {paragraphText}
        </Text>
      </div>
    </div>
  );
}
