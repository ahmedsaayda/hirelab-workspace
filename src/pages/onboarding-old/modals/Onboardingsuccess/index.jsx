import React from "react";
import { default as ModalProvider } from "react-modal";
import { useRouter } from "next/router";
import { Button, Heading, Img, Text } from "../../../Dashboard/Vacancies/components/components";
import backgroundImg from "./overlay.png";

export default function Onboardingsuccess({ isOpen, ...props }) {
  const router = useRouter();;
  return (
    <div
      className="w-screen h-screen  flex items-center justify-center container-xs"
      style={{
        background: `url(${backgroundImg})`,
        backgroundSize: "cover",
      }}
    >
      {/* success message section */}
      <div className="w-2/3 min-w-[250px]">
        {/* success modal section */}
        <div className="flex flex-col items-center gap-6 rounded-[12px] bg-white-A700 pb-8 pl-6  pt-[31px] p-5">
          {/* success information section */}
          <div className="flex flex-col items-center gap-3.5 self-stretch">
            {/* success title row section */}
            <div className="flex items-center justify-between gap-5 self-stretch  mdx:pl-5">
              {/* success title section */}
              <Heading
                size="md"
                as="h1"
                className="!text-[#000000] ml-[45%] smx:ml-0"
              >
                Success!
              </Heading>

              {/* success title icon section */}
              <Img
                src="/images/x-close.png"
                alt="arrow image"
                className="h-[24px] w-[24px] cursor-pointer"
              />
            </div>

            {/* success subtitle section */}
            <Text as="p" className="!font-normal">
              You have successfully finished onboarding!
            </Text>
          </div>

          {/* success illustration section */}
          <Img
            src="/images/img_illustration_seo.png"
            alt="seo illustration"
            className="h-[150px] object-cover"
          />

          {/* success footer section */}
          <div className="flex flex-col gap-5 self-stretch">
            {/* footer divider section */}
            <div className="h-px bg-blue_gray-50" />

            {/* footer buttons row section */}
            <div className="flex gap-5">
              {/* back button section */}
              <Button
                color="white_A700"
                shape="round"
                className="w-full border border-solid border-blue_gray-100 font-semibold smx:px-5"
                onClick={() => router.push("/onboarding/4")}
              >
                Back
              </Button>

              {/* dashboard button section */}
              <Button
                shape="round"
                className="w-full border border-solid border-light_blue-A700 font-semibold smx:px-5"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
