import React from "react";
import { Button, Img, Text } from "./..";

export default function StartFromScratchImageMobileFileupload({
  dashboard = "Dashboard image.png",
  filesize = "16 MB",
  percentage = "100%",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} h-[88px] mdx:w-full pt-2 pb-3 pl-4 pr-2 border-blue_gray-50_01 border border-solid bg-white-A700 flex-1 relative rounded-[12px] mdx:flex-none`}
    >
      <div className="absolute bottom-[12.00px] left-0 right-0 m-auto flex w-full items-center gap-3 mdx:relative mdx:flex-col">
        <Img
          src="/images/img_user_white_a700.svg"
          alt="dashboard"
          className="h-[40px] w-[40px] mdx:w-full"
        />
        <div className="flex flex-1 flex-col gap-1 mdx:self-stretch">
          <div className="flex flex-col items-start">
            <Text as="p" className="!text-blue_gray-800">
              {dashboard}
            </Text>
            <Text as="p" className="!font-normal !text-blue_gray-700_01">
              {filesize}
            </Text>
          </div>
          <div className="flex items-center justify-center gap-3 mdx:flex-col">
            <div className="h-[8px] flex-1 rounded bg-light_blue-A700 mdx:self-stretch" />
            <Text as="p" className="!text-blue_gray-800">
              {percentage}
            </Text>
          </div>
        </div>
      </div>
      <Button
        size="2xl"
        shape="round"
        className="absolute right-[8.00px] top-[8.00px] m-auto w-[36px]"
      >
        <Img src="/images/img_trash_01.svg" />
      </Button>
    </div>
  );
}
