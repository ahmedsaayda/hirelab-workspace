import { Button, Modal, Radio, Space, Upload } from "antd";
import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../../../src/redux/auth/selectors";

import { SketchPicker } from "react-color";
import { useRouter } from "next/router";
import FileUpload from "./FileUpload";

const buttonStyle = {
  borderRadius: "8px",
  border: "1px solid #5207CD",
  background: "#5207CD",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  display: "flex",
  padding: "10px 16px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  flex: "1 0 0",
};

const buttonStyleSecondary = {
  borderRadius: "8px",
  border: "1px solid var(--Gray-tertiary, #D0D5DD)",
  background: "var(--Pure-white, #FFF)",
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  display: "flex",
  padding: "10px 16px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  flex: "1 0 0",
};

const Onboarding = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyURL, setCompanyURL] = useState("");
  const [companyInformation, setCompanyInformation] = useState("");
  const [displayColor, setDisplayColor] = useState(null);
  const [color, setColor] = useState("#DBC1FF");
  const [selectableColors, setSelectableColors] = useState([
    "#DBC1FF",
    "#CAB9FF",
    "#DDB8FE",
    "#8BBEFF",
    "#C0DAFF",
    "#EFF8FF",
  ]);
  const [addNewColor, setAddNewColor] = useState(false);
  const [colorAddType, setColorAddType] = useState("Main Color");
  const [brandColors, setBrandColors] = useState([
    { title: "Main Color", color: "#5207CD" },
    { title: "Sub Heading", color: "#7F56D9" },
    { title: "Description", color: "#CAB9FF" },
  ]);

  const darkMode = useSelector(selectDarkMode);
  const router = useRouter();;

  return (
    <>
      <div className="p-8 bg-white">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Left Section: Form */}

          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-[32px]">Brand Style</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#475467] font-medium">
                <label htmlFor="company-name" className="block mb-2">
                  Company Name
                </label>
                <div>{companyName?.length ?? 0}/40</div>
              </div>
              <input
                type="text"
                id="company-name"
                placeholder="Enter the name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value?.slice?.(0, 40))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-[#475467] leading-tight focus:outline-none focus:shadow-outline border border-[#D0D5DD]"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#475467] font-medium">
                <label htmlFor="company-url" className="block mb-2">
                  Company URL
                </label>
                <div>{companyURL?.length ?? 0}/80</div>
              </div>
              <input
                type="text"
                id="company-url"
                placeholder="Enter the URL"
                value={companyURL}
                onChange={(e) => setCompanyURL(e.target.value?.slice?.(0, 80))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-[#475467] leading-tight focus:outline-none focus:shadow-outline border border-[#D0D5DD]"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#475467] font-medium">
                <label htmlFor="company-info" className="block mb-2">
                  Company Information
                </label>
                <div>{companyInformation?.length ?? 0}/180</div>
              </div>
              <textarea
                id="company-info"
                placeholder="Information about your company"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-[#475467] leading-tight focus:outline-none focus:shadow-outline border border-[#D0D5DD]"
                value={companyInformation}
                onChange={(e) =>
                  setCompanyInformation(e.target.value?.slice?.(0, 180))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-[#475467] font-medium">
                Company Logo
              </label>
              <FileUpload />
            </div>

            {/* Text Style Section */}
            <div className="mb-6">
              <p className="text-sm text-[#475467] font-medium mb-1">
                Text Style
              </p>
              <div className="flex items-center space-x-2">
                <Radio.Group defaultValue={1}>
                  <Radio value={1}>
                    <div className="text-sm text-[#344054] font-medium">
                      H1 Style
                    </div>
                    <div className="text-sm text-[#475467] font-normal">
                      Inter Regular
                    </div>
                  </Radio>
                  <Radio value={2}>
                    <div className="text-sm text-[#344054] font-medium">
                      H2 Style
                    </div>
                    <div className="text-sm text-[#475467] font-normal">
                      Inter Regular
                    </div>
                  </Radio>
                  <Radio value={3}>
                    <div className="text-sm text-[#344054] font-medium">
                      H3 Style
                    </div>
                    <div className="text-sm text-[#475467] font-normal">
                      Inter Regular
                    </div>
                  </Radio>
                </Radio.Group>

                <Upload>
                  <button className="flex items-center space-x-2 border border-transparent text-sm font-medium text-[#344054]">
                    <Space>
                      <div className="border border-gray-300 border-dashed rounded-full">
                        <svg
                          width={21}
                          height={20}
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="plus">
                            <path
                              id="Icon"
                              d="M10.4993 4.1665V15.8332M4.66602 9.99984H16.3327"
                              stroke="#D0D5DD"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                      </div>
                      <div>Upload font</div>
                    </Space>
                  </button>
                </Upload>
              </div>
            </div>

            {/* Brand Colors Section */}
            <div className="mb-6">
              <p className="text-sm text-[#475467] font-medium mb-1">
                Brand Colors
              </p>
              <div className="flex items-center space-x-4">
                {brandColors.map((brandColor, i) => (
                  <Space key={i}>
                    <div
                      className={`w-6 h-6 rounded-full`}
                      style={{
                        backgroundColor: brandColor.color,
                      }}
                    ></div>
                    <div>
                      <div className="text-sm text-[#344054] font-medium">
                        {brandColor.title}
                      </div>
                      <div className="text-sm text-[#475467] font-normal">
                        {brandColor.color}
                      </div>
                    </div>
                  </Space>
                ))}

                <button
                  onClick={() => setDisplayColor(true)}
                  className="flex items-center space-x-2 border border-transparent text-sm font-medium text-[#344054]"
                >
                  <Space>
                    <div className="border border-gray-300 border-dashed rounded-full">
                      <svg
                        width={21}
                        height={20}
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="plus">
                          <path
                            id="Icon"
                            d="M10.4993 4.1665V15.8332M4.66602 9.99984H16.3327"
                            stroke="#D0D5DD"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </div>
                    <div>Add color</div>
                  </Space>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 mt-6">
              <Button
                className="font-semibold text-blue-700 bg-transparent border border-blue-500 rounded"
                style={buttonStyleSecondary}
                disabled
              >
                Back
              </Button>
              <Button
                type="primary"
                className="px-16 rounded-md"
                style={buttonStyle}
                onClick={() => {
                  router.push("/onboarding/2");
                }}
              >
                Save & Next
              </Button>
            </div>

            {/* Add more form elements here */}
          </div>
          {/* Right Section: Preview */}
          <div className="w-full md:w-1/2">
            <div className="ml-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="flex items-center gap-1 mb-12 text-xl font-semibold">
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Vertical container">
                      <g id="Icon">
                        <path
                          d="M2.01677 10.5942C1.90328 10.4145 1.84654 10.3246 1.81477 10.186C1.79091 10.0819 1.79091 9.91775 1.81477 9.81366C1.84654 9.67507 1.90328 9.58522 2.01677 9.40552C2.95461 7.92054 5.74617 4.1665 10.0003 4.1665C14.2545 4.1665 17.0461 7.92054 17.9839 9.40552C18.0974 9.58522 18.1541 9.67507 18.1859 9.81366C18.2098 9.91775 18.2098 10.0819 18.1859 10.186C18.1541 10.3246 18.0974 10.4145 17.9839 10.5942C17.0461 12.0791 14.2545 15.8332 10.0003 15.8332C5.74617 15.8332 2.95461 12.0791 2.01677 10.5942Z"
                          stroke="#344054"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.0003 12.4998C11.381 12.4998 12.5003 11.3805 12.5003 9.99984C12.5003 8.61913 11.381 7.49984 10.0003 7.49984C8.61962 7.49984 7.50034 8.61913 7.50034 9.99984C7.50034 11.3805 8.61962 12.4998 10.0003 12.4998Z"
                          stroke="#344054"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </g>
                  </svg>
                  Preview
                </h2>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded h-64 flex items-center justify-center bg-[#EFF8FF]">
                {/* Dynamically loaded preview content goes here */}
                <span className="text-[#5207CD] font-semibold">
                  Preview area
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        title="Upload color"
        open={displayColor}
        onCancel={() => setDisplayColor(false)}
        footer={[
          <div className="flex items-center justify-center gap-2">
            <Button
              className="w-1/3 px-16 rounded-md"
              style={buttonStyleSecondary}
              onClick={() => setDisplayColor(false)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="w-1/3 px-16 rounded-md"
              style={buttonStyle}
              onClick={() => {
                setBrandColors((c) => {
                  const cur = [...c];
                  const colorToChange = cur.find(
                    (v) => v.title === colorAddType
                  );
                  if (colorToChange) colorToChange.color = color;

                  return cur;
                });
                setDisplayColor(false);
              }}
            >
              Continue
            </Button>
          </div>,
        ]}
      >
        <div className="mt-2">
          {/* Color picker component */}
          {addNewColor && (
            <div className="absolute">
              <SketchPicker
                color={addNewColor}
                onChange={(color) => setAddNewColor(color.hex)}
                onChangeComplete={() => {
                  setSelectableColors((c) => [...c, addNewColor]);
                  setAddNewColor(false);
                }}
              />
            </div>
          )}
          {/* Gradient preview would go here */}
          <div
            className={`h-24 w-full bg-gradient-to-r from-[${brandColors[0].color}] via-[${brandColors[1].color}] to-[${brandColors[2].color}] rounded-lg mt-4`}
            style={{
              backgroundImage: `linear-gradient(to right, ${brandColors[0].color},${brandColors[1].color},${brandColors[2].color})`,
            }}
          ></div>

          <div className="flex items-center gap-2 mt-4">
            <div
              className={`w-6 h-6 rounded-full cursor-pointer absolute start-8`}
              style={{ backgroundColor: color }}
            ></div>
            <input
              type="text"
              value={color}
              style={{
                textIndent: 25,
                borderRadius: 8,
                border: "1px solid var(--Gray-tertiary, #D0D5DD)",
                background: "var(--Pure-white, #FFF)",
              }}
              className="w-full px-4 py-2 border rounded"
              readOnly
            />
          </div>

          <select
            value={colorAddType}
            style={{
              borderRadius: 8,
              border: "1px solid var(--Gray-tertiary, #D0D5DD)",
              background: "var(--Pure-white, #FFF)",
            }}
            className="w-full px-4 py-2 mt-2 border rounded"
            onChange={(e) => setColorAddType(e.target.value)}
            readOnly
          >
            <option value="Main Color">Main Color</option>
            <option value="Sub Heading">Sub Heading</option>
            <option value="Description">Description</option>
          </select>

          {/* Color circles */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {/* Map over colors, this is just a placeholder */}
            {selectableColors.map((circleColor) => (
              <div
                key={circleColor}
                className={`w-6 h-6 rounded-full cursor-pointer ${
                  color === circleColor ? "border border-black" : ""
                }`}
                onClick={() => setColor(circleColor)}
                style={{ backgroundColor: circleColor }}
              ></div>
            ))}
            <CiCirclePlus
              className="cursor-pointer"
              size={25}
              onClick={() => setAddNewColor("#DBC1FF")}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Onboarding;
