import React from "react";
import { Img } from "./..";

export default function HomePageMacbookpro16({
  macbookprosixte = "images/img_macbook_pro_16.png",
  screenmockup = "images/img_screen_mockup_replace_517x586.png",
  shadowOne = "images/img_shadow.png",
  ...props
}) {
  return (
    <div {...props}>
      <div className="relative z-[3] h-[594px] self-stretch mdx:h-auto">
        <Img
          src={macbookprosixte}
          alt="macbookprosixte"
          className="h-[594px] w-full object-cover"
        />
        <div className="absolute right-[-0.23px] top-[9.98px] m-auto flex w-[86%] flex-col items-end">
          <Img
            src="/dhwise-images/img_camera.png"
            alt="camera_one"
            className="mr-[170px] h-[4px] w-[4px] object-cover mdx:mr-0"
          />
          <Img
            src={screenmockup}
            alt="screenmockup"
            className="mt-[3px] h-[517px] w-full object-cover mdx:h-auto"
          />
          <Img
            src="/dhwise-images/img_logo.png"
            alt="logo_one"
            className="mr-36 mt-3 h-[7px] w-[13%] object-cover mdx:mr-0"
          />
        </div>
      </div>
      <Img
        src={shadowOne}
        alt="shadow_one"
        className="relative mt-[-4px] h-[6px] w-full object-cover"
      />
    </div>
  );
}
