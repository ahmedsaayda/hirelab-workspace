import React from "react";
import { Button, Heading, Img, Text } from "..";

export default function UserProfileCard({
  createdWithText = "Created with HireLab",
  monthlyEarningsText = "2500$ / month",
  workTypeText = "Hybrid",
  workHoursText = "8h/day",
  jobTitle = "Product Designer",
  jobDescription = "The Product Designer will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
  seeMoreInfoText = "Apply now",
  seeMoreInfoLink = "#apply",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[32%] mdx:w-full gap-8`}
    >
      <div className="flex h-[240px] items-end self-stretch bg-[url(/public/images3/img_tooltip_240x384.png)] bg-cover bg-no-repeat p-2.5">
        <Button
          color="black_900_99"
          size="sm"
          shape="round"
          leftIcon={
            <Img
              src="/images3/img_user_red_a200.png"
              alt="User"
              className="h-[16px] w-[10px] object-cover"
            />
          }
          className="mt-48 min-w-[178px] gap-1.5 rounded-lg border border-solid border-[#cfd4dc] px-[9px] font-medium"
        >
          {createdWithText}
        </Button>
      </div>
      <div className="flex flex-col gap-6 self-stretch">
        <div className="flex flex-col gap-3">
          <div className="flex">
            <Button
              size="sm"
              shape="round"
              leftIcon={
                <Img
                  src="/images3/img_coins_stacked_03.svg"
                  alt="Coins-stacked-03"
                  className="my-0.5 h-[12px] w-[12px]"
                />
              }
              className="min-w-[138px] gap-1.5 rounded-lg border border-solid border-[#cfd4dc] px-[9px] font-medium text-[#344053]"
            >
              {monthlyEarningsText}
            </Button>
            <Button
              size="sm"
              shape="round"
              leftIcon={
                <Img
                  src="/images3/img_vertical_container.svg"
                  alt="Container"
                  className="mb-1 mt-0.5 h-[12px] w-[12px]"
                />
              }
              className="ml-3 min-w-[82px] gap-1.5 rounded-lg border border-solid border-[#cfd4dc] px-[9px] font-medium text-[#344053]"
            >
              {workTypeText}
            </Button>
            <Button
              size="sm"
              shape="round"
              leftIcon={
                <Img
                  src="/images3/img_clock.svg"
                  alt="Clock"
                  className="mb-1 mt-0.5 h-[12px] w-[12px]"
                />
              }
              className="ml-3 min-w-[84px] gap-1.5 rounded-lg border border-solid border-[#cfd4dc] px-[9px] font-medium text-[#344053]"
            >
              {workHoursText}
            </Button>
          </div>
          <div className="flex flex-col items-start justify-center gap-1.5">
            <Heading
              size="text_lg_semibold"
              as="h6"
              className="text-[18px] font-semibold text-[#0f1728]"
            >
              {jobTitle}
            </Heading>
            <Text
              size="text_md_regular"
              as="p"
              className="w-full text-[16px] font-normal leading-6 text-[#667084]"
            >
              {jobDescription}
            </Text>
          </div>
        </div>
        <a
          href={seeMoreInfoLink}
          onClick={(e) => {
            if (seeMoreInfoLink === "#apply") {
              document.dispatchEvent(new CustomEvent("APPLY"));
            }
          }}
          className="flex items-center gap-[9px]"
        >
          <Heading
            size="headings"
            as="h6"
            className="text-[16px] font-semibold text-[#0E87FE]"
          >
            {seeMoreInfoText}
          </Heading>
          <Img
            src="/images3/img_arrow_up_right.svg"
            alt="Arrow Image"
            className="h-[20px] w-[20px]"
          />
        </a>
      </div>
    </div>
  );
}
