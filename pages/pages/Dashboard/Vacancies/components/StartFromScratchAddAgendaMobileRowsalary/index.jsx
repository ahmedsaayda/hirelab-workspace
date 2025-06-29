import React from "react";
import { Text, Heading, Img } from "./..";

export default function StartFromScratchAddAgendaMobileRowsalary({
  image = "images/img_vertical_container.svg",
  salarylabel = "Salary Range:",
  salaryvalue = "$ 110k -125k / year",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex items-center pt-5 gap-3 bg-white-A700_f2`}>
      <Img src={image} alt="salary_rangeone" className="h-[50px] w-[50px]" />
      <div className="flex flex-col">
        <Heading size="6xl" as="h6">
          {salarylabel}
        </Heading>
        <Text as="p" className="!font-satoshi !font-normal">
          {salaryvalue}
        </Text>
      </div>
    </div>
  );
}
