import React from "react";
import { Heading, Img, Text } from "./..";

export default function FeaturesSectionMarketingToolsFeaturetab({
  marketingTools = "Marketing tools",
  description = "The platform delivers tools that creates natural urgency and scarcity toturn job seekers into applicants.The tools you need to grow you talent pool, make referral easy andbump applicant conversion by 50%.",
  signupforbetala = "Sign up for beta launch",
  ...props
}) {
  return (
    <div {...props}>
      <div className="ml-2 flex flex-col items-start gap-2 self-stretch mdx:ml-0">
        <Heading size="2xl" as="h1">
          {marketingTools}
        </Heading>
        <Text size="xl" as="p" className="leading-6">
          {description}
        </Text>
      </div>
      <div className="ml-2 flex gap-2 mdx:ml-0">
        <Heading as="h2" className="self-end !text-indigo-500">
          {signupforbetala}
        </Heading>
        <Img
          src="/dhwise-images/img_arrow_right_light_blue_a700.svg"
          alt="arrowright_one"
          className="h-[20px] w-[20px]"
        />
      </div>
    </div>
  );
}
