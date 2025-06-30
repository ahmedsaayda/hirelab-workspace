import React from "react";
import { Heading, Img, Text } from "./..";

export default function Footer({ ...props }) {
  return (
    <footer
      {...props}
      className={`${props.className} flex flex-col gap-16 sm:gap-8`}
    >
      <div className="flex flex-col items-start gap-8 self-stretch">
        <Img
          src="/images3/img_footer_logo.png"
          alt="Footer Logo"
          className="h-[30px] w-[116px] object-contain"
        />
        <ul className="flex flex-wrap items-center gap-8">
          <li>
            <a href="Position" target="_blank" rel="noreferrer">
              <Heading
                size="headings"
                as="h6"
                className="text-[16px] font-semibold text-[#ffffff]"
              >
                Position
              </Heading>
            </a>
          </li>
          <li>
            <a href="Company" target="_blank" rel="noreferrer">
              <Heading
                size="headings"
                as="h6"
                className="text-[16px] font-semibold text-[#ffffff]"
              >
                Company
              </Heading>
            </a>
          </li>
          <li>
            <a href="Mission" target="_blank" rel="noreferrer">
              <Heading
                size="headings"
                as="h6"
                className="text-[16px] font-semibold text-[#ffffff]"
              >
                Mission
              </Heading>
            </a>
          </li>
          <li>
            <a href="Testimonial" target="_blank" rel="noreferrer">
              <Heading
                size="headings"
                as="h6"
                className="text-[16px] font-semibold text-[#ffffff]"
              >
                Testimonial
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headings"
                as="h6"
                className="text-[16px] font-semibold text-[#ffffff]"
              >
                About Us
              </Heading>
            </a>
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-between gap-5 self-stretch sm:flex-col">
        <Text
          size="text_md_regular"
          as="p"
          className="text-[16px] font-normal text-[#ffffff]"
        >
          © 2024 Hirelab. All rights reserved.
        </Text>
        <div className="flex w-[14%] justify-between gap-5 sm:w-full">
          <Img
            src="/images3/img_social_icon_base_white.svg"
            alt="First Social Icon"
            className="h-[24px] w-[24px]"
          />
          <Img
            src="/images3/img_social_icon_base_white_24x24.svg"
            alt="Second Social Icon"
            className="h-[24px] w-[24px]"
          />
          <Img
            src="/images3/img_link_base_white.svg"
            alt="Third Social Icon"
            className="h-[24px] w-[24px]"
          />
          <Img
            src="/images3/img_social_icon_24x24.svg"
            alt="Fourth Social Icon"
            className="h-[24px] w-[24px]"
          />
        </div>
      </div>
    </footer>
  );
}
