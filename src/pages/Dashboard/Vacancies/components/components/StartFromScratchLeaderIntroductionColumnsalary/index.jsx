import React from "react";
import { Text, Heading, Img } from "..";

export default function StartFromScratchLeaderIntroductionColumnsalary({
  image = "images/img_vertical_container.svg",
  salaryrange = "Salary Range:",
  price = "$ 110k -125k / year",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start w-full pt-5 px-5 bg-white-A700_f2 rounded-[15px]`}
    >
      <Img src={image} alt="salary_rangeone" className="h-[45px] w-[45px]" />
      <div className="flex flex-col items-start">
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
