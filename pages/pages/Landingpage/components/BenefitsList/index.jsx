import React from "react";
import { Heading, Text } from "./..";

export default function BenefitsList({
  headingText = "What you should expect",
  text = "/",
  competitiveCompensationText = "Competitive compensation package",
  textOne = "/",
  flexibleWorkingText = "Flexible working hours",
  textTwo = "/",
  healthDentalVisionText = "Health, dental, and vision insurance",
  textThree = "/",
  retirementPlanText = "401(k) retirement plan",
  textFour = "/",
  vacationTimeOffText = "Generous vacation and paid time off",
  textFive = "/",
  professionalDevelopmentText = "Opportunities for professional development and growth",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-start w-[32%] mdx:w-full gap-5 p-[22px] sm:p-5 bg-[#213326] rounded`}
    >
      <Heading
        size="heading3xl"
        as="h4"
        className="font-['GT_America_Trial'] text-[26px] font-bold uppercase tracking-[-0.52px] text-[#ffffff]"
      >
        {headingText}
      </Heading>
      <div className="flex flex-col gap-4 self-stretch">
        <div className="flex flex-wrap items-center gap-[9px]">
          <Text
            size="textxl"
            as="p"
            className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {text}
          </Text>
          <Text
            size="textxl"
            as="p"
            className="self-end font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {competitiveCompensationText}
          </Text>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Text
            size="textxl"
            as="p"
            className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {textOne}
          </Text>
          <div className="flex flex-1">
            <Text
              size="textxl"
              as="p"
              className="self-end font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
            >
              {flexibleWorkingText}
            </Text>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Text
            size="textxl"
            as="p"
            className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {textTwo}
          </Text>
          <div className="flex flex-1">
            <Text
              size="textxl"
              as="p"
              className="self-end font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
            >
              {healthDentalVisionText}
            </Text>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Text
            size="textxl"
            as="p"
            className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {textThree}
          </Text>
          <div className="flex flex-1">
            <Text
              size="textxl"
              as="p"
              className="self-end font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
            >
              {retirementPlanText}
            </Text>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Text
            size="textxl"
            as="p"
            className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {textFour}
          </Text>
          <div className="flex flex-1">
            <Text
              size="textxl"
              as="p"
              className="self-end font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
            >
              {vacationTimeOffText}
            </Text>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Text
            size="textxl"
            as="p"
            className="font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
          >
            {textFive}
          </Text>
          <div className="flex flex-1 justify-center">
            <Text
              size="textxl"
              as="p"
              className="self-end font-['GT_America_Trial'] text-[18px] font-normal text-[#ffffff]"
            >
              {professionalDevelopmentText}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
