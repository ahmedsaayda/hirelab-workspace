import React from "react";
import { Heading, Img } from "..";
import { IconRenderer } from "../../../LandingpageEdit/IconsSelector";

export default function ApplicationSubmission({
  headingText = "01",
  candidateProcessText = "Submit Application",
  candidateProcessIcon = "/images3/img_lock.svg",
  textColor,
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col justify-between items-start w-[24%] mdx:w-full gap-0.5 px-6 py-3.5 sm:px-2 rounded`}
    >
      <Heading
        size="heading6xl"
        as="h1"
        className={`text-[50px] font-semibold text-[${textColor}]`}
      >
        {headingText}
      </Heading>
      <div className="flex items-center self-stretch justify-between gap-5 mt-auto mb-2">
        <Heading
          size="headinglg"
          as="h5"
          className={`text-[20px] font-semibold text-[${textColor}] break-words`}
          style={{ wordBreak: "break-word" }}
        >
          {candidateProcessText}
        </Heading>
        <IconRenderer
          icon={candidateProcessIcon}
          className={`mb-1 h-[18px] self-end text-blue-500`}
        />
      </div>
    </div>
  );
}
