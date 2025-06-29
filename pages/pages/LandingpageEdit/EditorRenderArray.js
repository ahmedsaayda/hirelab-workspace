import React from "react";
import { useFocusContext } from "../../contexts/FocusContext";
import { useHover } from "../../contexts/HoverContext";
import {
  DateTimeSlot,
  Heading,
  Img,
  Input,
  RatingBar,
  Text,
} from "../Dashboard/Vacancies/components";
import ImageUploader from "./ImageUploader";
import IconsSelector, { IconRenderer } from "./IconsSelector";
import { Switch } from "antd";
import moment from "moment";

const stripFormattingFromText = (text) => {
  // Remove line breaks and extra spaces
  return text
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const EditorRenderArray = React.memo(({
  landingPageData,
  setLandingPageData,
  items,
  setChanged,
  itemKey,
  arrayContext,
}) => {
  const { setFocusRef } = useFocusContext();
  const { setHoveredField, hoveredField, setLastScrollToSection } = useHover();

  const [showIconsSelector, setShowIconsSelector] = React.useState(false);
  const [selectedItemForIcon, setSelectedItemForIcon] = React.useState(null);

  

  const handleBulletChange = (value, index, bulletKey, parentKey) => {
    const updatedData = { ...landingPageData };
    if (!Array.isArray(updatedData[parentKey])) {
      updatedData[parentKey] = [];
    }
    updatedData[parentKey][index] = {
      ...updatedData[parentKey][index],
      [bulletKey]: value,
    };
    setLandingPageData(updatedData, itemKey);
    setChanged(true);
  };

  const addBulletPoint = (parentKey) => {
    const updatedData = { ...landingPageData };
    if (!Array.isArray(updatedData[parentKey])) {
      updatedData[parentKey] = [];
    }
    updatedData[parentKey].push({ bullet: "" });
    setLandingPageData(updatedData, itemKey);
    setChanged(true);
  };

  const removeBulletPoint = (index, parentKey) => {
    const updatedData = { ...landingPageData };
    if (!Array.isArray(updatedData[parentKey])) return;
    updatedData[parentKey].splice(index, 1);
    setLandingPageData(updatedData, itemKey);
    setChanged(true);
  };

  const handleDateChange = (timeSlot, key) => {
    if (timeSlot) {
      setLandingPageData(timeSlot, key);
      setChanged(true);
    }
  };

  const getFieldKey = (key, bulletIndex = null) => {
    if (arrayContext) {
      if (bulletIndex !== null && key === "bulletPoints") {
        return `${arrayContext.parentKey}[${arrayContext.index}].${key}[${bulletIndex}]`;
      }
      return `${arrayContext.parentKey}[${arrayContext.index}].${key}`;
    }
    return key;
  };

  const handlePaste = (e, key, max) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const cleanText = stripFormattingFromText(pastedText);
    const element = e.target;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const currentText =
      key === "itself"
        ? landingPageData || ""
        : landingPageData?.[key] || "";
    const newText =
      currentText.substring(0, start) +
      cleanText +
      currentText.substring(end);
    const finalText = max ? newText.slice(0, max) : newText;
    setLandingPageData(finalText, key);
    setChanged(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-0">
        {items.map((a, i) => {
          const hide = a.toggle && !landingPageData?.[a.toggleKey];
          return (
            <div
              key={i}
              className={`flex flex-col gap-2
        col-span-2
        ${a.halfWidth ? "xl:col-span-1" : "xl:col-span-2"}
        `}
            >
              <div className="flex gap-5 justify-between">
                <div className="flex gap-2 items-center w-full">
                  <Text
                    as="p"
                    className="!text-blue_gray-700 font-medium text-sm"
                  >
                    {a.label}{" "}
                  </Text>
                  {a.toggle && (
                    <Switch
                      className="ml-auto"
                      checked={landingPageData?.[a.toggleKey]}
                      onChange={(checked) => {
                        setLandingPageData(checked, a.toggleKey);
                        setChanged(true);
                      }}
                    />
                  )}
                  {a.type === "icon" && (
                    <button
                      onClick={() => {
                        setSelectedItemForIcon(a.key);
                        setShowIconsSelector(true);
                      }}
                      className="ml-auto"
                      onMouseEnter={() => {
                        const hoverKey = getFieldKey(a.key);
                        setHoveredField(hoverKey);
                      }}
                      onMouseLeave={() => setHoveredField(null)}
                    >
                      {landingPageData?.[a.key] ? (
                        <div className="flex gap-1 items-center text-gray-400">
                          <div>Select Icon </div>
                          <div className="p-1 border-2 rounded-sm text-[#0E87FE] border-[#0E87FE]">
                            <IconRenderer icon={landingPageData?.[a.key]} />
                          </div>
                        </div>
                      ) : (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="39"
                            height="39"
                            rx="7.5"
                            fill="white"
                          />
                          <rect
                            x="0.5"
                            y="0.5"
                            width="39"
                            height="39"
                            rx="7.5"
                            stroke="#D0D5DD"
                          />
                          <path
                            d="M20.0003 12.5001H23.5003C24.9005 12.5001 25.6005 12.5001 26.1353 12.7726C26.6057 13.0122 26.9882 13.3947 27.2278 13.8651C27.5003 14.3999 27.5003 15.1 27.5003 16.5001V23.5001C27.5003 24.9002 27.5003 25.6003 27.2278 26.1351C26.9882 26.6055 26.6057 26.9879 26.1353 27.2276C25.6005 27.5001 24.9005 27.5001 23.5003 27.5001H16.5003C15.1002 27.5001 14.4001 27.5001 13.8653 27.2276C13.3949 26.9879 13.0125 26.6055 12.7728 26.1351C12.5003 25.6003 12.5003 24.9002 12.5003 23.5001V20.0001M16.667 20.8334V24.1667M23.3337 19.1667V24.1667M20.0003 15.8334V24.1667M11.667 14.1667L14.167 11.6667M14.167 11.6667L16.667 14.1667M14.167 11.6667L14.167 16.6667"
                            stroke="#0E87FE"
                            stroke-width="1.66667"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                {a.max && (
                  <div className="flex py-px">
                    <Text
                      as="p"
                      className="!font-normal !text-blue_gray-700_01"
                    >
                      {
                        (a.key === "itself"
                          ? landingPageData
                          : landingPageData?.[a.key] || ""
                        )?.length
                      }
                      /{a.max}
                    </Text>
                  </div>
                )}
              </div>
              {a.type === "rating" ? (
                <RatingBar
                  value={
                    a.key === "itself"
                      ? landingPageData
                      : landingPageData?.[a.key]
                  }
                  isEditable={true}
                  onChange={(e) => {
                    setLandingPageData(e, a.key);
                    setChanged(true);
                  }}
                  size={20}
                  className="flex justify-between"
                />
              ) : a.type === "image" ? (
                <>
                  {!hide && (
                    <ImageUploader
                      maxFiles={a.maxFiles || 1}
                      multiple={a.multiple}
                      defaultImage={
                        a.key === "itself"
                          ? landingPageData
                          : landingPageData?.[a.key]
                      }
                      onImageUpload={(url) => {
                        setLandingPageData(url, a.key);
                        setChanged(true);
                      }}
                    />
                  )}
                </>
              ) : a.type === "bulletPoints" ? (
                <>
                  {landingPageData?.[a.key]?.map((bullet, index) => (
                    <div className="flex items-center" key={index}>
                      <Input
                        className="border outline-none focus-within:border-light_blue-A700"
                        shape="round"
                        type="text"
                        name={`bullet_${index}`}
                        value={bullet.bullet}
                        onChange={(e) => {
                           setChanged(true);
                           const value = e.target.value;
                           handleBulletChange(value, index, 'bullet', a.key)
                        }}
                      />
                      <button onClick={() => removeBulletPoint(index, a.key)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addBulletPoint(a.key)}>
                    Add Bullet
                  </button>
                </>
              ) : a.type === "datetime" ? (
                <DateTimeSlot
                  onChange={(timeSlot) => handleDateChange(timeSlot, a.key)}
                  value={
                    landingPageData?.[a.key]
                      ? moment(landingPageData?.[a.key])
                      : undefined
                  }
                />
              ) : (
                <>
                  {!hide && (
                    <Input
                      onMouseEnter={() => {
                        const hoverKey = getFieldKey(a.key);
                        setHoveredField(hoverKey);
                      }}
                      onMouseLeave={() => setHoveredField(null)}
                      className="!text-gray-500_01 leading-[150%] font-inter"
                      shape="round"
                      type={a.inputType}
                      name="input_one"
                      textarea={a.textarea}
                      value={
                        a.key === "itself"
                          ? landingPageData || ""
                          : landingPageData?.[a.key] || ""
                      }
                      onChange={(e) => {
                        const value =
                          e.target && e.target.value !== undefined
                            ? e.target.value
                            : e;
                        setLandingPageData(value, a.key);
                        setChanged(true);
                      }}
                      onPaste={(e) => handlePaste(e, a.key, a.max)}
                      ref={setFocusRef(getFieldKey(a.key))}
                      maxLength={a.max}
                       onFocus={() => {
                        setLastScrollToSection(null)
                      }}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <IconsSelector
        visible={showIconsSelector}
        onClose={() => setShowIconsSelector(false)}
        onSelect={(icon) => {
          setLandingPageData(icon, selectedItemForIcon);
          setChanged(true);
          setShowIconsSelector(false);
        }}
      />
    </>
  );
});

export default EditorRenderArray;
