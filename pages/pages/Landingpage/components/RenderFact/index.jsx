import React from "react";
import { Heading, Img, Text } from "..";
import { IconRenderer } from "../../../LandingpageEdit/IconsSelector";

export default function RenderFact({
  icon = "/images3/img_bar_chart_square_up.svg",
  headingText = "",
  descriptionText = "",
  ...props
}) {
  console.log(props);
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-full gap-6 p-[22px] sm:p-5  rounded
        
        `}
        style={{
          backgroundColor: "var(--primary-light-3)",
        }}

    >
      {/* <Img
        src={icon}
        alt="Bar Chart Image"
        className="h-[40px] w-[40px]"
      /> */}
      <IconRenderer icon={icon} className={"text-[color:--primary-color]"} />
      <div className="flex flex-col items-center justify-center gap-2.5 self-stretch px-[34px] sm:px-5">
        <Heading
          size="headinglg"
          as="h5"
          className="text-[20px] font-semibold text-[#0f1728]"
        >
          {headingText}
        </Heading>
        <Text
          size="text_md_regular"
          as="p"
          style={{ wordBreak: "break-word" }}
          className="text-[16px] font-normal text-center text-[#475466]"
        >
          {descriptionText}
        </Text>
      </div>
    </div>
  );
}
