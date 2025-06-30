import React from "react";
import { Switch, Text } from "./..";

export default function StartFromScratchAddCategoryHeadingand({ headingtext = "Remote", ...props }) {
  return (
    <div {...props} className={`${props.className} flex items-center gap-2`}>
      <div className="flex">
        <Text as="p" className="!text-blue_gray-700_01">
          {headingtext}
        </Text>
      </div>
      <Switch />
    </div>
  );
}
