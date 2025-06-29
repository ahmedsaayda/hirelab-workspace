import React from "react";
import { Heading, Img, Text } from "./..";

export default function StartFromScratchFooterColumnvertical({
  image = "images/img_vertical_container_blue_700_01_1x45.png",
  salaryrange = "Salary Range:",
  price = "$ 110k -125k / year",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start pt-5 gap-[53px] px-5 smx:gap-[26px] bg-white-A700_f2 rounded-[13px]`}
    >
      <Img src={image} alt="vertical" className="h-[6px] object-cover" />
      <div className="flex flex-col gap-[79px] mdx:gap-[59px] smx:gap-[39px]">
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
