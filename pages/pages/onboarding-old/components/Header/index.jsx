import React from "react";
import { Button, Img } from "./..";

export default function Header({ ...props }) {
  return (
    <header
      {...props}
      className={`${props.className} flex justify-center items-center bg-white-A700`}
    >
      <div className=" flex items-center justify-between gap-5 px-8 py-5 mdx:p-5 smx:flex-col smx:px-5 mx-auto w-full">
        <Img
          src="/images/img_header_logo.png"
          alt="logoimage"
          className="h-[32px] w-[109px] object-contain"
        />
        <div className="flex gap-5">
          <Button
            size="lg"
            shape="round"
            className="min-w-[73px] border border-solid border-[#D0D5DD] font-semibold !text-white-A700 text-sm bg-[#FFFFFF]"
          >
            Log out
          </Button>
          <Button
            shape="round"
            leftIcon={
              <Img
                src="/images/img_search_white_a700.svg"
                alt="search"
                className="h-[18px] w-[18px]"
              />
            }
            className="min-w-[199px] gap-2 border border-solid border-light_blue-A700 font-semibold"
          >
            Invite your colleague
          </Button>
        </div>
      </div>
    </header>
  );
}
