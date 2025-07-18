import { Space, } from "antd";
import React from "react";
import { default as ModalProvider } from "react-modal";
import { Button, CheckBox, Heading, Img, Input, Radio } from "../../components/components";
import { SearchOutlined } from '@ant-design/icons';

export const formItems = [
  {
    icon: "user-square.svg",
    text: "Contact Info",
    type: "contact",
  },
  {
    icon: "list.svg",
    text: "Multiple Choice",
    type: "multichoice",
  },
  { icon: "hash-02.svg", text: "Number", type: "number" },
  { icon: "mail-01.svg", text: "Email", type: "email" },
  {
    icon: "chevron-down.svg",
    text: "Dropdown",
    type: "dropdown",
  },
  { icon: "calendar.svg", text: "Date", type: "date" },
  { icon: "phone.svg", text: "Phone Number", type: "phone" },
  {
    icon: "double-check_svgrepo.com.svg",
    text: "Multiselect",
    type: "multiselect",
  },
  { icon: "clock.svg", text: "Time", type: "time" },
  { icon: "marker-pin-06.svg", text: "Address", type: "address" },
  { icon: "type-square.svg", text: "Text Short", type: "text" },
  {
    icon: "upload-cloud-01.svg",
    text: "File Upload",
    type: "file",
  },
  { icon: "link-04.svg", text: "Website", type: "website" },
  {
    icon: "letter-spacing-02.svg",
    text: "Text Long",
    type: "motivation",
  },
  {
    icon: "circle-off.svg",
    text: "Yes/No",
    type: "boolean",
  }
];

export default function ApplicationformAddQuestions({
  isOpen,
  onClickAdd,
  onClose,
  disabledTypes = [],
  ...props
}) {
  const [searchBarValue, setSearchBarValue] = React.useState("");
  const [selected, setSelected] = React.useState("");

  // Filter formItems based on search input and exclude lead capture fields
  const leadCaptureTypes = ["contact", "email", "phone"];
  const filteredItems = formItems.filter((item) =>
    item.text.toLowerCase().includes(searchBarValue.toLowerCase()) &&
    !leadCaptureTypes.includes(item.type)
  );

  return (
    <>
      <div className="container-sm pl-[272px] pr-[271px] md:p-5 md:px-5">
        <div className="flex flex-col gap-8 rounded-[12px] bg-white-A700 p-8 sm:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex flex-col gap-[30px]">
              <div className="flex items-center justify-between gap-5">
                <Heading size="7xl" as="h1" className="!text-black-900_01">
                  Add questions
                </Heading>
                <Img
                  src="/images/img_arrow_right_blue_gray_400.svg"
                  alt="arrowright"
                  className="h-[24px] w-[24px] self-start cursor-pointer"
                  onClick={onClose}
                />
              </div>
              {/* SEARCH BAR */}
              <Input
                prefix={<SearchOutlined style={{ fontSize: 18 }} />}
                placeholder="Search"
                value={searchBarValue}
                onChange={(value) => setSearchBarValue(value)}
                className="rounded-lg border border-gray-300 pl-2 pr-1 py-2"
                autoFocus
              />
              <div className="h-px bg-blue_gray-50" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, i) => {
                  const isDisabled = disabledTypes.includes(item.type);
                  return (
                    <div
                      key={i}
                      className={`flex justify-left items-center px-[14px] py-[12px] gap-[12px] border border-[#D0D5DD] rounded-[8px] 
                        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
                        ${selected === item.type ? "border-1 border-light_blue-A700" : ""}`}
                      onClick={() => {
                        if (!isDisabled) setSelected(item.type);
                      }}
                    >
                      <Img
                        src={`/icons/${item.icon}`}
                        alt="type-01"
                        className="h-[18px] w-[18px]"
                      />
                      <div className="text-[#475467] text-md font-semibold">
                        {item.text}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No questions found.
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-px bg-blue_gray-50_01" />
            <Button
              shape="round"
              disabled={!selected}
              onClick={() => {
                if (selected) onClickAdd(selected);
              }}
              className="w-full border border-solid text-[#ffffff] border-light_blue-A700 bg-light_blue-A700  font-semibold sm:px-5"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
