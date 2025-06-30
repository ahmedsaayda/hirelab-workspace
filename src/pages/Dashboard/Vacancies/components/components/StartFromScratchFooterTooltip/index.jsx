import React from "react";
import { Heading, Img } from "./..";

export default function StartFromScratchFooterTooltip({
  aiassistanttext = "AI Assistant",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center left-[0.00px] top-[0.00px] m-auto shadow-md absolute rounded-lg`}
    >
      <Img src="/images/img_arrow_up.svg" alt="arrowup" className="h-[6px]" />
      <div className="flex rounded-lg bg-gray-900 px-2 pb-2.5 pt-2">
        <Heading as="p" className="!font-semibold !text-white-A700">
          {aiassistanttext}
        </Heading>
      </div>
    </div>
  );
}
