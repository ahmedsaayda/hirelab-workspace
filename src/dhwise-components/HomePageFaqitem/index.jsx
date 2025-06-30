import React from "react";
import { Img, Text } from "./..";

export default function HomePageFaqitem({
  whataretheearly = "What are the early bird advantages and what’s the catch?",
  description = "No catch, if you sign up for our Early Bird Beta Launch. You can use our platform for free as long as the Beta-Version is live.Once we set up the official Version 1.0, you can be made sure you will get a massive discount to use our platform only available to you!In return for free use of our platform we like to use your feedback to improve the platform. While we do this, you can join our Recruitment Marketing Group on Facebook.",
  ...props
}) {
  return (
    <div {...props}>
      <div className="flex flex-1 flex-col items-start gap-2 pt-[5px] mdx:self-stretch">
        <Text size="2xl" as="p" className="!font-medium !text-gray-900_01">
          {whataretheearly}
        </Text>
        <Text size="xl" as="p" className="leading-6 !text-blue_gray-500">
          {description}
        </Text>
      </div>
      <Img
        src="/dhwise-images/img_minus_circle.svg"
        alt="image_one"
        className="h-[24px] w-[24px] mdx:w-full"
      />
    </div>
  );
}
