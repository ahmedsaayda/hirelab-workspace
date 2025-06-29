import React from "react";
import { Button, Heading, Img } from "./..";

export default function UserProfileIconButton({
  textContent = "Interview",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[50%] sm:w-full gap-3`}
    >
      <Button
        size="4xl"
        className="w-[54px] rounded-[26px] border-[1.12px] border-solid border-[#eaecf0] px-3"
      >
        <Img src="/images3/img_bar_chart_square_up.svg" />
      </Button>
      <div className="flex justify-center self-stretch">
        <Heading
          size="headinglg"
          as="h5"
          className="text-[20px] font-semibold text-[#0f1728]"
        >
          {textContent}
        </Heading>
      </div>
    </div>
  );
}
