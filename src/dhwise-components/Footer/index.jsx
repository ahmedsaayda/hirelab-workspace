import React from "react";
import { Button, Heading, Img, Text } from "./..";

export default function Footer({ ...props }) {
  return (
    <footer {...props}>
      <div className="mt-[15px] flex w-[95%] flex-col justify-center gap-16 mdx:w-full smx:gap-8">
        <div className="flex flex-col items-center gap-10 px-8 smx:px-5">
          <div className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-8">
            <div className="flex gap-2">
              <Text size="4xl" as="p" className="uppercase !text-white-A700">
                <span className="font-semibold text-white-A700">H</span>
                <span className="font-semibold text-white-A700">ireLab</span>
              </Text>
              <Img
                src="/dhwise-images/img_mask_group.png"
                alt="image_two"
                className="h-[30px] object-cover"
              />
            </div>
            <ul className="flex gap-8 px-[379px] mdx:px-5 smx:flex-col">
              <li>
                <a href="#">
                  <div className="flex py-px">
                    <Heading as="h6" className="!text-white-A700_cc">
                      Home
                    </Heading>
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div className="flex">
                    <Heading as="h6" className="!text-white-A700_cc">
                      How it works
                    </Heading>
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div className="flex">
                    <Heading as="h6" className="!text-white-A700_cc">
                      Services
                    </Heading>
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div className="flex">
                    <Heading as="h6" className="!text-white-A700_cc">
                      Calculate
                    </Heading>
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div className="flex py-px">
                    <Heading as="h6" className="self-end !text-white-A700_cc">
                      FAQs
                    </Heading>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <Button
            size="3xl"
            shape="round"
            leftIcon={
              <Img
                src="/dhwise-images/img_arrowright_blue_gray_800.svg"
                alt="arrow_right"
                className="h-[20px] w-[20px]"
              />
            }
            className="min-w-[202px] gap-2 font-semibold"
          >
            Request an Invite
          </Button>
        </div>
        <div className="flex flex-col gap-8 px-8 smx:px-5">
          <div className="mx-auto h-px w-full max-w-[1216px] bg-white-A700_33 mdx:p-5" />
          <div className="mx-auto flex w-full max-w-[1216px] items-center justify-between gap-5 smx:flex-col">
            <Text size="xl" as="p" className="self-end !text-white-A700_cc">
              © 2024 Hirelab. All rights reserved.
            </Text>
            <div className="flex w-[18%] justify-between gap-5 smx:w-full">
              <Img
                src="/dhwise-images/img_social_icon.svg"
                alt="socialicon_one"
                className="h-[24px] w-[24px]"
              />
              <Img
                src="/dhwise-images/img_link.svg"
                alt="link_one"
                className="h-[24px] w-[24px]"
              />
              <Img
                src="/dhwise-images/img_social_icon_white_a700.svg"
                alt="socialicon"
                className="h-[24px] w-[24px]"
              />
              <Img
                src="/dhwise-images/img_social_icon_white_a700_24x24.svg"
                alt="socialicon_five"
                className="h-[24px] w-[24px]"
              />
              <Img
                src="/dhwise-images/img_social_icon_24x24.svg"
                alt="socialicon"
                className="h-[24px] w-[24px]"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
