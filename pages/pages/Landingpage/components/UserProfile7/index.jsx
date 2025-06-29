import React from "react";
import { Button, Heading, Img, Text } from "./..";

export default function UserProfile7({
  createdWith = "Created with HireLab",
  headingText = "product designer",
  descriptionText,
  applyButtonText = "Apply now",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[32%] mdx:w-full gap-5 p-[18px] bg-[#213326]`}
    >
      <div className="flex h-[160px] items-end justify-end self-stretch bg-[url(/public/images3/img_image_160x340.png)] bg-cover bg-no-repeat">
        <Button
          color="gray_50_01"
          size="sm"
          shape="square"
          leftIcon={
            <Img
              src="/images3/img_user_red_a200.png"
              alt="User"
              className="mb-1 h-[16px] w-[10px] object-cover"
            />
          }
          className="mt-[122px] min-w-[134px] gap-3 px-1.5 font-['GT_America_Trial'] font-medium"
        >
          {createdWith}
        </Button>
      </div>
      <div className="flex flex-col gap-6 self-stretch">
        <div className="flex flex-col items-start gap-2">
          <Heading
            size="heading5xl"
            as="h1"
            className="font-['GT_America_Trial'] text-[36px] font-bold uppercase tracking-[-0.72px] text-[#f9f9f9]"
          >
            {headingText}
          </Heading>
          <Text
            size="text4xl"
            as="p"
            className="w-full font-['GT_America_Trial'] text-[26px] font-normal leading-6 text-[#f9f9f9]"
          >
            <span>The&nbsp;</span>
            <span className="capitalize">
              product designer will assist in the planning, execution, and
              optimization of marketing initiatives to promote our products and
              services. This role will collaborate with various teams to develop
              and implement marketing campaigns across multiple channels
            </span>
          </Text>
        </div>
        <Button
          size="2xl"
          shape="square"
          className="self-stretch border border-solid border-[#ffffff] px-[33px] font-['GT_America_Trial'] font-medium text-[#213326] shadow-[0_1px_2px_0_#1018280c] sm:px-5"
        >
          {applyButtonText}
        </Button>
      </div>
    </div>
  );
}
