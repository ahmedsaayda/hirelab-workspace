import React from "react";
import { Heading, Img } from "..";

export default function TemplatesButtonbase({
  trendupimage = "images/img_trend_up_01.svg",
  importtext = "Sales",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex justify-center items-center p-2.5 flex-1 rounded-lg`}>
      <div className="flex items-center gap-3">
        <Img src={trendupimage} alt="sales" className="h-[18px] w-[18px]" />
        <Heading size="3xl" as="p" className="!text-blue_gray-700">
          {importtext}
        </Heading>
      </div>
    </div>
  );
}
