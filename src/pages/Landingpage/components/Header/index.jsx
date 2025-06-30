import React from "react";
import { Heading, Img } from "./..";

export default function Header({ ...props }) {
  return (
    <header
      {...props}
      className={`${props.className} flex justify-center items-center py-6 sm:py-5`}
    >
      <div className="container-xs flex items-center justify-center gap-[31px] px-8 mdx:flex-col mdx:px-5">
        <Img
          src="/images3/img_header_logo.png"
          alt="Header Logo"
          className="h-[30px] w-[116px] object-contain"
        />
        <ul className="flex flex-wrap gap-[18px]">
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Summary
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Contacts
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Description
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Agenda
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                About Us
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Company Facts
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Leader Intro
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Testimonials
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Application Process
              </Heading>
            </a>
          </li>
          <li>
            <a href="#">
              <Heading
                size="headingxs"
                as="p"
                className="text-[14px] font-semibold text-[#475466]"
              >
                Growth Path
              </Heading>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
