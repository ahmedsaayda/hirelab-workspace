import React from "react";
import { Text } from "./..";

export default function StartFromScratchAgendaCheckbox({ dayofweek = "Sat", ...props }) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-center w-full gap-2`}>
      <div className="w-[70%] pt-0.5">
        <div className="h-[16px] w-[16px] rounded border border-solid border-blue_gray-100 bg-white-A700" />
      </div>
      <div className="flex self-start py-px">
        <Text as="p" className="!text-blue_gray-800">
          {dayofweek}
        </Text>
      </div>
    </div>
  );
}
