import React from "react";
import { Button, ChipView, Heading, Img, Text } from "..";

export default function UserProfile4({
  userImage = "/images3/img_image_152x344.png",
  createdWithText = "Created with HireLab",
  jobTitle = "Product Designer",
  jobDescription = "The Product Designer will assist in the planning, execution, and optimization of marketing initiatives to promote our products and services. This role will collaborate with various teams to develop and implement marketing campaigns across multiple channels",
  applyButtonText = "Apply now",
  applyButtonLink = "#apply",
  ...props
}) {
  const [chipOptions, setChipOptions] = React.useState(() => [
    { value: 1, label: `2500\\$ / month` },
    { value: 2, label: `Offenbach` },
    { value: 3, label: `7h / daily` },
  ]);
  const [selectedChipOptions, setSelectedChipOptions] = React.useState([]);

  return (
    <div
      {...props}
      className={`${props.className} flex flex-col items-center w-[32%] mdx:w-full gap-5 p-5 bg-[#f5f5f2] shadow-[0_4px_6px_-2px_#10182807] rounded`}
    >
      <Img
        src={userImage}
        alt="Main Image"
        className="h-[152px] w-full object-cover"
      />
      <div className="flex flex-col gap-6 self-stretch">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <Img
              src="/images3/img_user_red_a200.png"
              alt="User Image"
              className="h-[16px] self-start object-cover"
            />
            <Heading
              size="headingxs"
              as="p"
              className="text-[14px] font-semibold text-[#344054]"
            >
              {createdWithText}
            </Heading>
          </div>
          <div className="flex justify-between gap-5">
            <Heading
              size="text_lg_semibold"
              as="h6"
              className="self-end text-[18px] font-semibold text-[#0f1728]"
            >
              {jobTitle}
            </Heading>
            <Img
              src="/images3/img_arrow_up_right_gray_900_0.svg"
              alt="Arrow Icon"
              className="h-[24px] w-[24px] self-end"
            />
          </div>
          <Text
            size="text_md_regular"
            as="p"
            className="text-[16px] font-normal leading-6 text-[#667084]"
          >
            {jobDescription}
          </Text>
        </div>
        <ChipView
          options={chipOptions}
          setOptions={setChipOptions}
          values={selectedChipOptions}
          setValues={setSelectedChipOptions}
          className="flex flex-wrap gap-2"
        >
          {(option) => (
            <React.Fragment key={option.index}>
              {option.isSelected ? (
                <div
                  onClick={option.toggle}
                  className="flex h-[24px] min-w-[120px] cursor-pointer flex-row items-center justify-center whitespace-pre-wrap rounded bg-[#eef3ff] px-2.5 text-center text-[14px] font-medium text-[#0E87FE]"
                >
                  <span>{option.label}</span>
                </div>
              ) : (
                <div
                  onClick={option.toggle}
                  className="flex h-[24px] min-w-[120px] cursor-pointer flex-row items-center justify-center rounded bg-[#eef4ff] px-2.5 text-center text-[14px] font-medium text-[#0E87FE]"
                >
                  <span>{option.label}</span>
                </div>
              )}
            </React.Fragment>
          )}
        </ChipView>
      </div>
      <Button
        color="light_blue_A700"
        href={applyButtonLink}
        size="lg"
        className="self-stretch rounded border border-solid border-[#0E87FE] px-[33px] font-semibold sm:px-5"
      >
        {applyButtonText}
      </Button>
    </div>
  );
}
