import React from "react";
import { Button, Img, Text } from "./..";

export default function BenefitsOverview2({
  mainImage = "/images3/img_experts_pana_1.svg",
  headingText = "*What you should expect*",
  competitiveCompensationText = "Competitive compensation package",
  flexibleWorkingText = "Flexible working hours",
  healthDentalVisionText = "Health, dental, and vision insurance",
  retirementPlanText = "401(k) retirement plan",
  vacationTimeOffText = "Generous vacation and paid time off",
  professionalDevelopmentText = "Opportunities for professional development and growth",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[50%] mdx:w-full gap-5 py-[22px] sm:py-5`}
    >
      <Img
        src={mainImage}
        alt="Main Image"
        className="mx-3.5 h-[240px] w-full"
      />
      <div className="relative h-[332px] self-stretch">
        <div className="absolute left-0 right-0 top-0 m-auto flex flex-1 flex-col items-center gap-5">
          <Text
            size="text4xl"
            as="p"
            className="font-['GT_Haptik_Trial'] text-[26px] font-medium tracking-[-0.52px] text-[#f9f9f9]"
          >
            {headingText}
          </Text>
          <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex items-center gap-3 self-stretch">
              <Button
                color="purple_A100"
                shape="circle"
                className="w-[28px] rounded-[14px] px-1.5"
              >
                <Img src="/images3/img_checkmark_base_white.svg" />
              </Button>
              <Text
                size="textxl"
                as="p"
                className="self-end font-['GT_Haptik_Trial'] text-[18px] font-normal text-[#ffffff]"
              >
                {competitiveCompensationText}
              </Text>
            </div>
            <div className="flex items-center gap-3 self-stretch">
              <Button
                color="purple_A100"
                shape="circle"
                className="w-[28px] rounded-[14px] px-1.5"
              >
                <Img src="/images3/img_checkmark_base_white.svg" />
              </Button>
              <Text
                size="textxl"
                as="p"
                className="self-end font-['GT_Haptik_Trial'] text-[18px] font-normal text-[#ffffff]"
              >
                {flexibleWorkingText}
              </Text>
            </div>
            <div className="flex items-center gap-3 self-stretch">
              <Button
                color="purple_A100"
                shape="circle"
                className="w-[28px] rounded-[14px] px-1.5"
              >
                <Img src="/images3/img_checkmark_base_white.svg" />
              </Button>
              <Text
                size="textxl"
                as="p"
                className="self-end font-['GT_Haptik_Trial'] text-[18px] font-normal text-[#ffffff]"
              >
                {healthDentalVisionText}
              </Text>
            </div>
            <div className="flex items-center gap-3 self-stretch">
              <Button
                color="purple_A100"
                shape="circle"
                className="w-[28px] rounded-[14px] px-1.5"
              >
                <Img src="/images3/img_checkmark_base_white.svg" />
              </Button>
              <Text
                size="textxl"
                as="p"
                className="self-end font-['GT_Haptik_Trial'] text-[18px] font-normal text-[#ffffff]"
              >
                {retirementPlanText}
              </Text>
            </div>
            <div className="flex items-center gap-3 self-stretch">
              <Button
                color="purple_A100"
                shape="circle"
                className="w-[28px] rounded-[14px] px-1.5"
              >
                <Img src="/images3/img_checkmark_base_white.svg" />
              </Button>
              <Text
                size="textxl"
                as="p"
                className="self-end font-['GT_Haptik_Trial'] text-[18px] font-normal text-[#ffffff]"
              >
                {vacationTimeOffText}
              </Text>
            </div>
            <Button
              color="purple_A100"
              shape="circle"
              className="w-[28px] rounded-[14px] px-1.5"
            >
              <Img src="/images3/img_checkmark_base_white.svg" />
            </Button>
          </div>
        </div>
        <Text
          size="textxl"
          as="p"
          className="absolute bottom-0 right-0 m-auto w-[90%] font-['GT_Haptik_Trial'] text-[18px] font-normal leading-7 text-[#ffffff]"
        >
          {professionalDevelopmentText}
        </Text>
      </div>
    </div>
  );
}
