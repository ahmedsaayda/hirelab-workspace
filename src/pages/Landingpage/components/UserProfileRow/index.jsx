import React from "react";
import { Heading, Text } from "./..";

export default function UserProfileRow({
  userNumber = "01",
  userLevel = "Entry-Level",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center justify-center w-[24%] mdx:w-full p-[26px] sm:p-5 rotate-[-5deg] rounded-[60px]`}
    >
      <div className="flex justify-center self-stretch px-14 mdx:px-5">
        <Heading
          size="text8xl"
          as="p"
          className="font-['GT_Haptik_Trial'] text-[50px] font-medium text-[#ffffff]"
        >
          {userNumber}
        </Heading>
      </div>
      <Text
        size="text2xl"
        as="p"
        className="font-['GT_Haptik_Trial'] text-[20px] font-medium text-[#ffffff]"
      >
        {userLevel}
      </Text>
    </div>
  );
}
