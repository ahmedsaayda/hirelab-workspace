import React from "react";
import { Radio, Checkbox, Popover } from "antd";
import { useState, useRef, useLayoutEffect } from "react";

const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const MultipleChoice = ({ field, value, onChange }) => (
  <Radio.Group
    value={value}
    onChange={onChange}
    className="w-full flex flex-col gap-4"
  >
    {field.options?.map((option, i) => (
      <div
        key={i}
        className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition
          ${value === i ? "border-gray-400 " : "border-gray-300 bg-white"}
        `}
        onClick={() => onChange({ target: { value: i } })}
        style={{ minHeight: 40, height: 43 }}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 font-bold text-lg
            ${value === i ? "bg-blue-500 text-white" : "border border-gray-300 text-[#636568]"}
          `}
        >
          {letters[i]}
        </div>
        <Radio
          value={i}
          checked={value === i}
          style={{ display: "none" }} // Hide default radio
        />
        <span className={`text-base ${value === i ? "text-blue-600 font-semibold" : "text-gray-800"}`}>
          {option.text && option.text.trim() !== "" ? option.text : `Option ${letters[i]}`}
        </span>
      </div>
    ))}
  </Radio.Group>
);

export const MultiSelectChoice = ({ field, value = [], onChange }) => (
  <Checkbox.Group
    value={value}
    onChange={onChange}
    className="w-full flex flex-col gap-4"
  >
    {field.options?.map((option, i) => (
      <div
        key={i}
        className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition
          ${value.includes(i) ? "border-gray-400 " : "border-gray-300 bg-white"}
        `}
        onClick={() => {
          // Toggle selection
          const newValue = value.includes(i)
            ? value.filter(idx => idx !== i)
            : [...value, i];
          onChange(newValue);
        }}
        style={{ minHeight: 40, height: 43 }}
      >
        <div
          className={`w-7 h-7 flex items-center justify-center rounded-lg mr-4 font-bold text-lg
            ${value.includes(i) ? "bg-blue-500 text-white" : "border border-gray-300 text-[#636568]"}
          `}
        >
          {letters[i]}
        </div>
        <Checkbox
          value={i}
          checked={value.includes(i)}
          style={{ display: "none" }} // Hide default checkbox
        />
        <span className={`text-base ${value.includes(i) ? "text-blue-600 font-semibold" : "text-gray-800"}`}>
          {option.text && option.text.trim() !== "" ? option.text : `Option ${letters[i]}`}
        </span>
      </div>
    ))}
  </Checkbox.Group>
);



export const CustomDropdown = ({ field, value, onChange, placeholder = "Select an option" }) => {
  const [open, setOpen] = useState(false);
  const selectedOption = field.options?.[value];
  const dropdownRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(undefined);

  useLayoutEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [open]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
      arrow={false}
      overlayInnerStyle={{ padding: 0, margin: 0 }}
      content={
        <div className="flex flex-col gap-2" style={{ width: dropdownWidth }}>
          {field.options?.map((option, i) => (
            <div
              key={i}
              className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition
                ${value === i ? "border-gray-400 " : "border-gray-300 bg-white"}
              `}
              onClick={() => {
                onChange(i);
                setOpen(false);
              }}
              style={{ minHeight: 40, height: 43 }}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 font-bold text-lg
                  ${value === i ? "bg-blue-500 text-white" : "border border-gray-300 text-[#636568]"}
                `}
              >
                {letters[i]}
              </div>
              <span className={`text-base ${value === i ? "text-blue-600 font-semibold" : "text-gray-800"}`}>
                {option.text && option.text.trim() !== "" ? option.text : `Option ${letters[i]}`}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <div
        ref={dropdownRef}
        className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition w-full ${open ? "border-blue-400" : "border-gray-300 bg-white"}`}
        onClick={() => setOpen(!open)}
        style={{ minHeight: 40, height: 43 }}
      >
        <div className="flex-1 text-base text-gray-800">
          {selectedOption?.text && selectedOption.text.trim() !== ""
            ? selectedOption.text
            : value !== undefined && value !== null
            ? `Option ${letters[value]}`
            : <span className="text-gray-400">{placeholder}</span>}
        </div>
        <span className="ml-2 text-gray-400">▼</span>
      </div>
    </Popover>
  );
};

export const YesNoQuestion = ({ field, value, onChange }) => {
  const yesText = field?.yesLabel || 'Yes';
  const noText = field?.noLabel || 'No';
  return (
    <div className="w-full">
      <p className="mb-3 text-base text-gray-800">{field.label}</p>
      <div className="flex gap-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
            value === true ? "bg-black text-white border-black" : "border-gray-300 text-gray-700"
          }`}
          onClick={() => onChange(true)}
        >
          <span className="bg-white text-black font-bold px-2 py-1 rounded">Y</span> {yesText}
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
            value === false ? "bg-black text-white border-black" : "border-gray-300 text-gray-700"
          }`}
          onClick={() => onChange(false)}
        >
          <span className="bg-white text-black font-bold px-2 py-1 rounded">N</span> {noText}
        </button>
      </div>
    </div>
  );
};


export default MultipleChoice;
