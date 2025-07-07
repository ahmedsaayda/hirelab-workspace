import React from "react";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { Button, Heading, Img, Text } from "../components";
// import Header from "../../../src/components/Header";
// import OnboardingAddMoreUsercard from "../../../src/components/OnboardingAddMoreUsercard";
const Header = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    <h1>Header Component</h1>
    {children}
  </div>
);
const OnboardingAddMoreUsercard = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    <div>OnboardingAddMoreUsercard Component</div>
    {children}
  </div>
);

const data = [
  {
    hrmanagernametext: "HR Manager Name",
    emailtext: "namename@mail.com",
    hrmanageridtext: "HR Manager ID",
  },
  {
    hrmanagernametext: "Manager Name",
    emailtext: "namename@mail.com",
    hrmanageridtext: "Manager ID",
  },
  {
    hrmanagernametext: "Recruiter Name",
    emailtext: "namename@mail.com",
    hrmanageridtext: "Recruiter ID",
  },
];

export default function OnboardingaddmorePage() {
  const router = useRouter();;
  return (
    <>
      <Helmet>
        <title>Expand Your Hiring Team - Onboarding Additional Members</title>
        <meta
          name="description"
          content="Invite more colleagues to your hiring team. Streamline your recruitment process by adding HR managers and recruiters."
        />
      </Helmet>

      {/* main content section */}
      <div className="w-full bg-white-A700">
        {/* header section */}
        <div>
          {/* navigation bar section */}
          <Header />

          {/* progress section */}
          <div className="flex items-start border border-solid border-blue_gray-50 mdx:flex-col">
            {/* team section */}
            <div className="flex items-start justify-center flex-1 gap-8 pb-8 pl-16 mdx:flex-col mdx:self-stretch mdx:p-5 mdx:pl-5">
              {/* team info section */}
              <div className="flex flex-1 flex-col gap-[237px] pt-6 mdx:gap-[177px] mdx:self-stretch smx:gap-[118px] smx:pt-5">
                {/* team list section */}
                <div className="flex flex-col items-center gap-12 pt-6 smx:pt-5">
                  {/* team heading section */}
                  <div className="flex w-[76%] flex-col items-center gap-3 mdx:w-full">
                    {/* team title section */}
                    <div className="flex">
                      <Heading size="lg" as="h1">
                        Hiring Team
                      </Heading>
                    </div>
                    <Text size="md" as="p" className="!font-normal">
                      Add members to your team.
                    </Text>
                  </div>

                  {/* team members section */}
                  <div className="flex flex-col self-stretch gap-6">
                    {/* member cards section */}
                    <div className="flex gap-8 mdx:flex-row smx:flex-col">
                      {data.map((d, index) => (
                        <OnboardingAddMoreUsercard
                          {...d}
                          key={"userCardsList" + index}
                        />
                      ))}
                    </div>
                    <Button
                      shape="round"
                      leftIcon={
                        <Img
                          src="/images/img_plus.svg"
                          alt="plus"
                          className="h-[20px] w-[20px]"
                        />
                      }
                      className="w-full gap-1.5 font-semibold smx:px-5 !bg-[#EFF8FF] !text-[#5207CD]"
                      onClick={() => router.push("/onboarding/2")}
                    >
                      Add more
                    </Button>
                  </div>
                </div>

                {/* footer section */}
                <div className="flex flex-col gap-5">
                  {/* footer divider section */}
                  <div className="h-px bg-blue_gray-50" />

                  {/* footer buttons section */}
                  <div className="flex gap-5">
                    <Button
                      color="white_A700"
                      shape="round"
                      className="w-full font-semibold border border-solid border-blue_gray-100 smx:px-5"
                      onClick={() => router.push("/onboarding")}
                    >
                      Back
                    </Button>
                    <Button
                      shape="round"
                      className="w-full font-semibold border border-solid border-light_blue-A700 smx:px-5"
                      onClick={() => router.push("/onboarding/4")}
                    >
                      Save & Next
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-px h-full bg-blue_gray-50 mdx:h-px mdx:w-full" />
            </div>

            {/* progress steps section */}
            <div className="w-[23%] px-8 mdx:w-full mdx:p-5 smx:px-5">
              {/* step details section */}
              <div className="flex flex-col gap-[449px] px-4 pt-6 mdx:gap-[336px] smx:gap-56 smx:pt-5">
                {/* step one section */}
                <div className="flex flex-col items-start gap-1 mdx:hidden">
                  <div className="flex items-start self-start gap-4 cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Button
                        size="xs"
                        shape="circle"
                        className="w-[30px] !rounded-[15px] border border-solid border-light_blue-A700"
                      >
                        <Img src="/images/img_check_white_a700.svg" />
                      </Button>
                      <Img
                        src="/images/img_light_bulb.svg"
                        alt="idea bulb"
                        className="h-[36px]"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <Text size="md" as="p" className="!text-blue_gray-800">
                        Brand Style
                      </Text>
                      <Text size="xs" as="p">
                        Choose the brand style.
                      </Text>
                    </div>
                  </div>

                  {/* step two section */}
                  <div className="flex items-start gap-4 cursor-pointer">
                    <div className="ml-[5px] flex w-[14%] flex-col items-center">
                      <Text
                        size="md"
                        as="p"
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[0.5px] border-solid border-light_blue-A700 text-center !text-light_blue-A700"
                      >
                        2
                      </Text>
                      <Img
                        src="/images/img_light_bulb.svg"
                        alt="idea bulb two"
                        className="h-[36px]"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                      <Text size="md" as="p" className="!text-blue_gray-800">
                        Hiring Team
                      </Text>
                      <Text size="xs" as="p">
                        Set your hiring team.
                      </Text>
                    </div>
                  </div>

                  {/* step three section */}
                  <div className="flex items-start gap-4 cursor-pointer">
                    <Text
                      size="md"
                      as="p"
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[0.5px] border-solid border-blue_gray-50 text-center"
                    >
                      3
                    </Text>
                    <div className="flex flex-col items-start gap-1">
                      <Text size="md" as="p" className="!text-blue_gray-800">
                        Location
                      </Text>
                      <Text size="xs" as="p">
                        Set your location.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
