import React from "react";
import { Img, SelectBox, Text } from "./..";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function AIContentAssistantGeneratedInputfield({
  tone = "Tone",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex flex-col w-full gap-2`}>
      <div className="flex self-start">
        <Text as="p" className="!text-blue_gray-700">
          {tone}
        </Text>
      </div>
      <SelectBox
        shape="round"
        indicator={
          <Img
            src="/images/img_arrowdown_blue_gray_500.svg"
            alt="arrow_down"
            className="h-[20px] w-[20px]"
          />
        }
        name="arrowdown"
        placeholder={`Category`}
        options={dropDownOptions}
        className="gap-px self-stretch border border-solid border-blue_gray-100 sm:pr-5"
      />
    </div>
  );
}
