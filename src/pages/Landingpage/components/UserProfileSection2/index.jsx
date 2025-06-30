import React from "react";
import { Button, Heading, Img, Text } from "./..";

export default function UserProfileSection2({
  headingText = "Innovation Leaders",
  paragraphText = "Recruitment marketing automation.",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-full gap-5 p-[22px] sm:p-5 bg-[#213326] rounded`}
    >
      <Button
        color="white_A700_19"
        size="4xl"
        shape="square"
        className="w-[58px] px-2"
      >
        <Img src="/images3/img_bar_chart_square_up_gray_50_01.svg" />
      </Button>
      <div className="flex flex-col items-center gap-2 self-stretch px-14 mdx:px-5">
        <Heading
          size="heading2xl"
          as="h4"
          className="font-['GT_America_Trial'] text-[24px] font-bold uppercase text-[#ffffff]"
        >
          {headingText}
        </Heading>
        <Text
          size="text2xl"
          as="p"
          className="self-stretch text-center font-['GT_America_Trial'] text-[20px] font-normal leading-[30px] text-[#f9f9f9]"
        >
          {paragraphText}
        </Text>
      </div>
    </div>
  );
}
