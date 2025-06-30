import React from "react";
import { default as ModalProvider } from "react-modal";
// import { CloseSVG } from "../../assets/images";
const CloseSVG = ({ onClick, fillColor }) => (
  <svg onClick={onClick} style={{ fill: fillColor, cursor: 'pointer' }} width="16" height="16" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);
import { Button, Heading, Img, Input, Text, TextArea } from "../../components/components";
import AIContentAssistantGeneratedInputfield from "../../components/components/AIContentAssistantGeneratedInputfield";

const data = [
  { tone: "Tone" },
  { tone: "Content Length" },
  { tone: "Language" },
];

export default function AIcontentassistantgenerated({ isOpen, ...props }) {
  const [searchBarValue114, setSearchBarValue114] = React.useState("");

  return (
    <>
      <div className="container-sm pl-[272px] pr-[271px] md:p-5 md:px-5">
        <div className="rounded-[12px] bg-white-A700">
          <div className="flex flex-col gap-8 rounded-[12px] px-[30px] pb-8 pt-[30px] sm:p-5">
            <div className="flex flex-col gap-[31px]">
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between gap-5">
                  <Heading size="7xl" as="h1" className="!text-black-900_01">
                    AI Content assistant
                  </Heading>
                  <Img
                    src="/images/img_arrow_right_blue_gray_400.svg"
                    alt="arrowright"
                    className="h-[24px] w-[24px]"
                  />
                </div>
                <div className="h-px bg-blue_gray-50" />
              </div>
              <div className="flex flex-col items-start gap-6 pt-1">
                <Heading size="4xl" as="h2" className="!text-blue_gray-700">
                  Brief our AI Agent.
                </Heading>
                <Input
                  shape="round"
                  name="search"
                  placeholder={`Search for key words`}
                  value={searchBarValue114}
                  onChange={(e) => setSearchBarValue114(e)}
                  prefix={
                    <Img
                      src="/images/img_search_blue_gray_500.svg"
                      alt="search"
                      className="h-[20px] w-[20px] cursor-pointer"
                    />
                  }
                  suffix={
                    searchBarValue114?.length > 0 ? (
                      <CloseSVG
                        onClick={() => setSearchBarValue114("")}
                        fillColor="#667084ff"
                      />
                    ) : null
                  }
                  className="gap-2 self-stretch border border-solid border-blue_gray-100 !text-blue_gray-500 sm:pr-5"
                />
                <div className="flex gap-2">
                  <div className="flex w-full">
                    <Button
                      size="xs"
                      rightIcon={
                        <Img
                          src="/images/img_arrowright_light_blue_a700.svg"
                          alt="arrow_right"
                          className="h-[12px] w-[12px]"
                        />
                      }
                      className="min-w-[95px] gap-1 rounded-[12px] font-medium"
                    >
                      key word
                    </Button>
                  </div>
                  <div className="flex w-full">
                    <Button
                      size="xs"
                      rightIcon={
                        <Img
                          src="/images/img_arrowright_deep_purple_400.svg"
                          alt="arrow_right"
                          className="h-[12px] w-[12px]"
                        />
                      }
                      className="min-w-[95px] gap-1 rounded-[12px] font-medium"
                    >
                      key word
                    </Button>
                  </div>
                  <div className="flex w-full">
                    <Button
                      size="xs"
                      rightIcon={
                        <Img
                          src="/images/img_arrowright_red_a200.svg"
                          alt="arrow_right"
                          className="h-[12px] w-[12px]"
                        />
                      }
                      className="min-w-[95px] gap-1 rounded-[12px] font-medium"
                    >
                      key word
                    </Button>
                  </div>
                </div>
                <div className="flex gap-6 self-stretch md:flex-col">
                  {data.map((d, index) => (
                    <AIContentAssistantGeneratedInputfield
                      {...d}
                      key={"inputs" + index}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-2 self-stretch">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Guides for creating content
                    </Text>
                  </div>
                  <TextArea
                    shape="round"
                    name="settings_one"
                    placeholder={`Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.`}
                    className="!border-blue_gray-100 leading-6 text-blue_gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="h-px bg-blue_gray-50_01" />
              <div className="flex gap-5">
                <Button
                  shape="round"
                  leftIcon={
                    <Img
                      src="/images/img_refreshcw01.svg"
                      alt="refresh-cw-01"
                      className="h-[20px] w-[20px]"
                    />
                  }
                  className="w-full gap-2 border border-solid border-blue_gray-100 font-semibold sm:px-5"
                >
                  Regenerate
                </Button>
                <Button
                  shape="round"
                  className="w-full border border-solid border-light_blue-A700 font-semibold sm:px-5"
                >
                  Okay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
