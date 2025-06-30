import React from "react";
import { Text } from "./..";

export default function CreateANewVacancyTemplateOtherLocationCheckbox({ officetext = "Office", ...props }) {
  return (
    <div {...props} className={`${props.className} flex items-center`}>
      <div className="w-[15%] self-start pt-0.5">
        <div className="h-[16px] w-[16px] rounded-lg border border-solid border-blue_gray-100 bg-white-A700" />
      </div>
      <div className="flex py-px">
        <Text as="p" className="!text-blue_gray-800">
          {officetext}
        </Text>
      </div>
    </div>
  );
}
