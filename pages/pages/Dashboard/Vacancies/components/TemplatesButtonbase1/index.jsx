import React from "react";
import { Heading, Img, Text } from "./..";

export default function TemplatesButtonbase1({
  title = "Template #1",
  department = "Department",
  vacancy = "Vacancy",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex justify-center items-center w-full gap-3 p-4 rounded-lg`}
    >
      <Img
        src="/images/img_rectangle_258.png"
        alt="templateone"
        className="h-[96px] w-[34%] rounded-md object-cover"
      />
      <div className="flex w-[51%] flex-col items-start gap-2">
        <Heading size="3xl" as="p" className="!text-light_blue-A700">
          {title}
        </Heading>
        <div className="flex items-center gap-2 self-stretch">
          <Text size="lg" as="p" className="!text-light_blue-A700">
            {department}
          </Text>
          <div className="h-[6px] w-[6px] self-start rounded-[3px] bg-light_blue-A700" />
          <Text size="lg" as="p" className="!text-light_blue-A700">
            {vacancy}
          </Text>
        </div>
      </div>
    </div>
  );
}
