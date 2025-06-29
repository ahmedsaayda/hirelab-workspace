import React from "react";
import MegaMenu1 from "../MegaMenu1";
import { Button, Heading, Img, Text } from "./..";

export default function Header2({ ...props }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuOpen1, setMenuOpen1] = React.useState(false);

  return (
    <header {...props}>
      <div className="blue_gray_50_00_blue_gray_50_00_border flex w-full justify-center border-b-[0.5px] border-solid bg-white-A700 p-[18px]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-8 mdx:flex-col smx:px-5">
          <div className="flex w-[46%] items-center justify-between gap-5 mdx:w-full smx:flex-col">
            <div className="flex gap-2">
              <Text size="4xl" as="p" className="uppercase !text-gray-900_02">
                <span className="font-semibold text-gray-900_02">H</span>
                <span className="font-semibold text-gray-900_02">ireLab</span>
              </Text>
              <Img
                src="/dhwise-images/img_mask_group.png"
                alt="image"
                className="h-[30px] object-cover"
              />
            </div>
            <div className="flex w-[72%] items-center justify-between gap-5 smx:w-full">
              <a href="Home" target="_blank" rel="noreferrer">
                <Heading as="h6" className="!text-blue_gray-700_01">
                  Home
                </Heading>
              </a>
              <ul className="flex gap-8">
                <li
                  onMouseLeave={() => {
                    setMenuOpen(false);
                  }}
                  onMouseEnter={() => {
                    setMenuOpen(true);
                  }}
                >
                  <div className="flex cursor-pointer">
                    <div className="flex gap-2">
                      <Heading as="h6" className="!text-indigo-500">
                        Products
                      </Heading>
                      <Img
                        src="/dhwise-images/img_arrow_down_light_blue_a700.svg"
                        alt="arrowdown_one"
                        className="h-[20px] w-[20px]"
                      />
                    </div>
                  </div>
                  {menuOpen ? <MegaMenu1 /> : null}
                </li>
                <li
                  onMouseLeave={() => {
                    setMenuOpen1(false);
                  }}
                  onMouseEnter={() => {
                    setMenuOpen1(true);
                  }}
                >
                  <div className="flex cursor-pointer">
                    <div className="flex gap-2">
                      <Heading
                        as="h6"
                        className="cursor-pointer !text-blue_gray-700_01 hover:text-indigo-500"
                      >
                        Resources
                      </Heading>
                      <Img
                        src="/dhwise-images/img_arrow_down_blue_gray_700_01.svg"
                        alt="arrowdown_three"
                        className="h-[20px] w-[20px]"
                      />
                    </div>
                  </div>
                  {menuOpen1 ? <MegaMenu1 /> : null}
                </li>
              </ul>
              <a
                href="Pricing"
                target="_blank"
                rel="noreferrer"
                className="mb-1 self-end"
              >
                <Heading as="h6" className="!text-blue_gray-700_01">
                  Pricing
                </Heading>
              </a>
            </div>
          </div>
          <Button
            color="indigo"
            size="xl"
            shape="round"
            className="min-w-[170px] border border-solid border-light_blue-A700 font-semibold"
          >
            Request an Invite
          </Button>
        </div>
      </div>
    </header>
  );
}
