import React from "react";
import { Heading } from "./..";

export default function PricingInfo({
  descriptionText = "// 1.",
  priceLabel = "ENTRY-LEVEL",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[24%] mdx:w-full gap-5 p-[22px] sm:p-5 bg-[#213326] rounded`}
    >
      <Heading
        size="text6xl"
        as="p"
        className="font-['GT_America_Trial'] text-[34px] font-medium text-[#ffffff]"
      >
        {descriptionText}
      </Heading>
      <div className="flex justify-center self-stretch px-14 mdx:px-5">
        <Heading
          size="heading2xl"
          as="h4"
          className="font-['GT_America_Trial'] text-[24px] font-bold uppercase text-[#ffffff]"
        >
          {priceLabel}
        </Heading>
      </div>
    </div>
  );
}
