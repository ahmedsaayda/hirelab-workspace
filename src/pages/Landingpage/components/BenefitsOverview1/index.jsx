import React from "react";
import { Button, Heading, Img, Text } from "..";
import { IconRenderer } from "../../../LandingpageEdit/IconsSelector";

export default function BenefitsOverview1({
  headingText = "What you should expect",
  headingDescription = "What you should expect",
  benefits = [],
  icon = "/images3/img_television_light_blue_a700.png",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} w-[32%] mdx:w-full relative`}
    >
      <div className="top-0 left-0 right-0 flex flex-col items-start flex-1 gap-5 m-auto ">
        {/* <Img
          src={icon}
          alt="Feature Image"
          className="h-[74px] w-[74px] object-contain"
        /> */}
        {<IconRenderer icon={icon} />}
        <Heading
          size="heading3xl"
          as="h4"
          className="text-[26px] font-semibold "
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
        <div className="flex flex-col items-start self-stretch gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3 ">
              <Img
                src="/images3/img_checkmark.svg"
                className={
                  "!w-[28px] !h-[28px] bg-[#dbf9e6] rounded-full px-1.5"
                }
                width={28}
                height={28}
                style={{ width: 28, height: 28 }}
              />
              <Text
                size="textxl"
                as="p"
                className=" text-[16px] font-normal text-[#000000]"
              >
                {benefit}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
