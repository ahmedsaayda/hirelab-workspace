import React from "react";
import { Heading, Img, Text } from "./components";

const Template1 = ({ landingPageData, fetchData }) => {
  return (
    <>
      <div>
        <div className="flex justify-center bg-[#ffffff] py-[38px] smx:py-5">
          <div className="container flex justify-center px-6 mb-14 mdx:px-5">
            <div className="flex items-start justify-center w-full px-14 mdx:flex-col mdx:px-5">
              <div className="relative mb-[46px] min-h-[354px] w-[58%] mdx:w-full">
                <div className="absolute bottom-[-0.13px] left-0 right-0 m-auto flex w-[76%] flex-col items-start gap-6">
                  <Heading
                    as="h2"
                    className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                  >
                    {landingPageData?.evpMissionTitle}
                  </Heading>
                  <Text
                    size="text_xl_regular"
                    as="p"
                    className="w-[86%] text-[20px] font-normal leading-[30px] text-[#475466] mdx:w-full"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          landingPageData?.evpMissionDescription?.replace?.(
                            /\n/g,
                            "<br></br>"
                          ),
                      }}
                    />
                  </Text>
                  <div className="flex flex-col items-start self-stretch justify-center gap-1">
                    <Heading
                      size="text_lg_semibold"
                      as="h3"
                      className="text-[18px] font-semibold text-[#5207CD]"
                    >
                      — {landingPageData?.evpMissionFullname}
                    </Heading>
                    <Text
                      size="text_md_regular"
                      as="p"
                      className="text-[16px] font-normal text-[#475466]"
                    >
                      CEO of {landingPageData?.evpMissionCompanyName}
                    </Text>
                  </div>
                </div>
                <div className="absolute left-0 top-0 m-auto h-[156px] w-[156px] rounded-[78px] bg-gradient-to-b from-[#83c0fd19] to-[#5207CD19]" />
              </div>
              {landingPageData?.evpMissionAvatar && (
                <Img
                  src={landingPageData?.evpMissionAvatar}
                  alt="Ceo Image"
                  className="h-[344px] w-[28%] self-end rounded object-contain mdx:w-full mdx:self-auto"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const Template3 = ({ landingPageData, fetchData }) => {
  return (
    <>
      <div>
        <div className="flex justify-center bg-[#ffffff] py-[38px] smx:py-5">
          <div className="container flex justify-center px-6 mb-14 mdx:px-5">
            <div className="flex items-start justify-center w-full px-14 mdx:flex-col mdx:px-5">
              <div className="relative mb-[46px] h-[354px] w-[58%] mdx:w-full">
                <div className="absolute bottom-[-0.13px] left-0 right-0 m-auto flex w-[76%] flex-col items-start gap-6">
                  <Heading
                    as="h2"
                    className="text-[36px] font-semibold tracking-[-0.72px] text-[#0f1728] mdx:text-[34px] smx:text-[32px]"
                  >
                    {landingPageData?.evpMissionTitle}
                  </Heading>
                  <Text
                    size="text_xl_regular"
                    as="p"
                    className="w-[86%] text-[20px] font-normal leading-[30px] text-[#475466] mdx:w-full"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          landingPageData?.evpMissionDescription?.replace?.(
                            /\n/g,
                            "<br></br>"
                          ),
                      }}
                    />
                  </Text>
                  <div className="flex flex-col items-start self-stretch justify-center gap-1">
                    <Heading
                      size="text_lg_semibold"
                      as="h3"
                      className="text-[18px] font-semibold text-[#5207CD]"
                    >
                      — {landingPageData?.evpMissionFullname}
                    </Heading>
                    <Text
                      size="text_md_regular"
                      as="p"
                      className="text-[16px] font-normal text-[#475466]"
                    >
                      CEO of {landingPageData?.evpMissionCompanyName}
                    </Text>
                  </div>
                </div>
                <div className="absolute left-0 top-0 m-auto h-[156px] w-[156px] rounded-[78px] bg-gradient-to-b from-[#83c0fd19] to-[#5207CD19]" />
              </div>
              {landingPageData?.evpMissionAvatar && (
                <Img
                  src={landingPageData?.evpMissionAvatar}
                  alt="Ceo Image"
                  className="h-[344px] w-[28%] self-end rounded object-contain mdx:w-full mdx:self-auto"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EVPMission = (props) => {
  if (props?.landingPageData?.templateId === "2")
    return <Template3 {...props} />;
  if (props?.landingPageData?.templateId === "1")
    return <Template1 {...props} />;

  return <Template3 {...props} />;
};

export default EVPMission;
