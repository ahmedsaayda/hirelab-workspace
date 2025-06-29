import React, { useState } from "react";
import { Button, Heading, Img, Input } from "../../components";
import { CloseSVG } from "../../images";

export default function Chooseatemplate({ isOpen, ...props }) {
  const [searchBarValue56, setSearchBarValue56] = React.useState("");
  const [selected, setSelected] = useState(0);

  return (
    <>
      <div className="rounded-[12px] bg-white-A700">
        <div className="rounded-[12px] py-8 pl-6 pr-[23px] smx:p-5">
          <div className="flex flex-col gap-[29px]">
            <div className="flex items-center justify-center w-full gap-5 mdx:pl-5">
              <Heading size="7xl" as="h1" className="!text-black-900_01">
                Choose a template
              </Heading>
            </div>
            <div className="flex flex-col gap-6">
              <Input
                shape="round"
                name="search"
                placeholder={`Search`}
                value={searchBarValue56}
                onChange={(e) => setSearchBarValue56(e)}
                prefix={
                  <Img
                    src="/images/img_search_blue_gray_500.svg"
                    alt="search"
                    className="h-[20px] w-[20px] cursor-pointer"
                  />
                }
                suffix={
                  searchBarValue56?.length > 0 ? (
                    <CloseSVG
                      onClick={() => setSearchBarValue56("")}
                      fillColor="#667084ff"
                    />
                  ) : null
                }
                className="gap-2 border border-solid border-blue_gray-100 !text-blue_gray-500 smx:pr-5"
              />
              <div className="grid grid-cols-3 justify-center gap-6 mdx:grid-cols-2 ">
                {new Array(6).fill(0).map((a, i) => (
                  <div
                    key={i}
                    className={`flex w-full flex-col items-start gap-5 rounded-lg border px-3.5 py-4 cursor-pointer ${
                      selected === i
                        ? "border-solid border-light_blue-A700 bg-gray-100_01"
                        : ""
                    }`}
                    onClick={() => setSelected(i)}
                  >
                    <Img
                      src="/images/img_rectangle_258.png"
                      alt="template_name"
                      className="h-[125px] w-full rounded-md object-cover mdx:h-auto"
                    />
                    <Heading
                      size="4xl"
                      as="h2"
                      className="!text-gray-900 whitespace-nowrap"
                    >
                      Template name
                    </Heading>
                    <div className="flex flex-col gap-3 self-stretch">
                      <Button
                        size="3xl"
                        shape="round"
                        className={`${
                          selected === i
                            ? "bg-[#0E87FE] text-[#FFFFFF]"
                            : "bg-[#EFF8FF] text-[#0E87FE]"
                        } w-full font-semibold smx:px-5 whitespace-nowrap`}
                      >
                        Choose template
                      </Button>
                      {/* <Button
                        size="3xl"
                        shape="round"
                        className="bg-white w-full border border-solid border-blue_gray-100 font-semibold !text-blue_gray-800_01 smx:px-5"
                      >
                        Preview
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
