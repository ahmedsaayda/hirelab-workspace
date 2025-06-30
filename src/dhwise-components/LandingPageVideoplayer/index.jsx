import React from "react";
import { Button, Heading, Img } from "./..";

export default function LandingPageVideoplayer({
  time = "0:00",
  time1 = "8:24",
  ...props
}) {
  return (
    <div {...props}>
      <div className="h-[116px] w-full bg-gradient" />
      <div className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[450px] w-full bg-[url(/public/dhwise-images/img_group_72.png)] bg-cover bg-no-repeat p-2 mdx:h-auto">
        <div className="mt-[177px] flex flex-col items-center gap-[139px] mdx:gap-[104px] smx:gap-[69px]">
          <Button size="6xl" shape="square" className="w-[80px]" color="">
            <Img src="/dhwise-images/_Play button.svg" />
          </Button>
          <div className="self-stretch rounded-lg">
            <Img
              src="/dhwise-images/img_text_input_container_white_a700.svg"
              alt="image_seventeen"
              className="h-[20px] w-full rounded-tl-lg rounded-tr-lg mdx:h-auto"
            />
            <div className="flex flex-wrap justify-between gap-5">
              <Heading size="s" as="h1" className="self-start !text-white-A700">
                {time}
              </Heading>
              <Heading size="s" as="h2" className="self-start !text-white-A700">
                {time1}
              </Heading>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
