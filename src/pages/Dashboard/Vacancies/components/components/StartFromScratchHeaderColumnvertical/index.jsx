import React from "react";
import { Heading, Img, Text } from "./..";

export default function StartFromScratchHeaderColumnvertical({
  image = "images/img_vertical_container_blue_700_01_1x45.png",
  salaryrange = "Salary Range:",
  price = "$ 110k -125k / year",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start pt-5 gap-[73px] px-5 mdx:gap-[54px] smx:gap-9 bg-white-A700_f2 rounded-[3px]`}
    >
      <Img src={image} alt="vertical" className="h-px object-cover" />
      <div className="flex flex-col gap-[99px] mdx:gap-[74px] smx:gap-[49px]">
        <Heading size="8xl" as="h5">
          {salaryrange}
        </Heading>
        <Text size="xl" as="p" className="!font-satoshi">
          {price}
        </Text>
      </div>
    </div>
  );
}
