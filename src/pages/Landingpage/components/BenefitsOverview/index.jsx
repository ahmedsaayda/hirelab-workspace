import React from "react";
import { Button, Heading, Img, Text } from "..";
import { IconRenderer } from "../../../LandingpageEdit/IconsSelector";

export default function BenefitsOverview({
  buttonApplyNow = "Apply now",
  buttonApplyNowLink = "#apply",
  headingText = "Benefits",
  headingDescription = "What you should expect",
  benefits = [],
  icon = "/images3/img_check_circle.svg",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} w-[32%] mdx:w-full relative flex flex-col items-center `}
    >
      <div className="flex flex-col items-center self-stretch h-full">
        <Button
          size="xl"
          shape="round"
          className="relative z-[3] w-[48px] rounded-[10px] border border-solid border-[#eaecf0] px-3"
        >
          {<IconRenderer icon={icon} />}
        </Button>
        <div className="relative mt-[-24px] flex flex-col justify-between gap-[34px] self-stretch rounded-[16px] border border-solid border-[#eaecf0] bg-[#ffffff] p-8 sm:p-5 h-full">
          <div>
            <div className="mt-4 flex flex-col items-center gap-2.5 px-14 mdx:px-5">
              <Heading
                size="heading5xl"
                as="h1"
                className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728]"
              >
                {headingText}
              </Heading>
              <Text
                size="text_md_regular"
                as="p"
                className="text-[16px] font-normal text-[#475466]"
              >
                {headingDescription}
              </Text>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 justify-left">
                  <Img
                    src={"/images3/img_check_circle.svg"}
                    alt="Check Circle Icon"
                    className="h-[24px] w-[24px] rounded-[50%]"
                  />
                  <Text
                    size="text_md_regular"
                    as="p"
                    className="text-[16px] font-normal text-[#475466]"
                  >
                    {benefit}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <Button
            color="light_blue_A700"
            href={buttonApplyNowLink}
            size="2xl"
            shape="round"
            className="self-stretch rounded-lg border border-solid border-[#0E87FE] px-[33px] font-semibold sm:px-5 mt-auto"
          >
            {buttonApplyNow}
          </Button>
        </div>
      </div>
    </div>
  );
}
