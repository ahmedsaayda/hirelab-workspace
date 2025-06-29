import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";

import {
  Alert,
  Button,
  Checkbox,
  ColorPicker,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Modal,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Spin,
  Steps,
  Switch,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import { FaExternalLinkAlt, FaMagic, FaRedo, FaUndo } from "react-icons/fa";
import { GrInfo } from "react-icons/gr";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
//import { MINIMUM_AI_CHARS } from "../data/constants";
//import { getPartner, selectDarkMode } from "../redux/auth/selectors";
//import CloudinaryUpload from "./CloudinaryUpload";
import Item from "antd/es/list/Item";
import CloudinaryUpload from "../../../components/CloudinaryUpload";
import { MINIMUM_AI_CHARS } from "../../../data/constants";
import { getPartner, selectDarkMode } from "../../../redux/auth/selectors";
import ShowPassword from "../PartnerSettings/ShowPassword";
import ChooseAvatar from "./ChooseAvatar";
import { partner } from "../../../constants";

const getPhone = (phone) => {
  if (phone?.[0] === "+") return phone;
  else return `+${phone}`;
};
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const DynamicForm = ({
  form,
  onChange,
  formData,
  AIEnhancements,
  thinking = [],
  setThinking,
  handleNext,
  readOnly,
}) => {
  const socket = useRef();
  const socketPing = useRef();
  const [loom, setLoom] = useState(null);
  const darkMode = useSelector(selectDarkMode);

  const fieldsToAutocomplete = [
    "keyBenefits",
    "requiredSkills",
    "introductionLine",
  ];

  const autocompleteVacancyForm = (formData) => {
    if (!formData.name || !formData.description) return;
    if (
      !formData.requiredSkills &&
      !formData.keyBenefits &&
      !formData.introductionLine
    ) {
      socket.current = new WebSocket(
        "wss://booklified-chat-socket.herokuapp.com"
      );

      socket.current.addEventListener("open", async () => {
        socketPing.current = setInterval(
          () => socket.current?.send(JSON.stringify({ id: "PING" })),
          30000
        );

        const content = `Hello, I need your expertise in generating professional content based on the following information:

Name: ${formData.name}
Description: ${formData.description}

Please generate suitable content for the following fields:
1. keyBenefits: List company benefits. For example: "Competitive salary, flexible work hours, opportunity for career growth".
2. requiredSkills: List all important skills and traits here. For example: "Strong communication skills, attention to detail, ability to work in a team".
3. introductionLine: Generate a professional introduction line. For example: "Hi, my name is [Name Al] from SDL, thanks for taking this call. This call is about your application for the position of [Job Title]. Can you confirm your application for this role?".

Return the results in a JSON format where the keys are the field names and the values are the generated content.`;

        setThinking(fieldsToAutocomplete);
        socket.current.send(
          JSON.stringify({
            id: "OPEN_AI_PROMPT",
            payload: {
              content,
              model: "gpt-4.1-mini-2025-04-14",
              partner: partner?._id,
            },
          })
        );
      });

      socket.current.addEventListener("message", async (event) => {
        const message = JSON.parse(event.data);
        console.log("msg", message);
        const response = message.payload?.response;

        try {
          const suggestions = JSON.parse(response);
          console.log("sug", suggestions);
          fieldsToAutocomplete.map((field, index) =>
            onChange(field, suggestions?.[field])
          );
        } catch (error) {
          console.error("Error parsing AI response:", error);
          message.error("Failed to process AI suggestions");
        }

        if (socketPing.current) clearInterval(socketPing.current);
        setThinking([]);
      });
    }
  };

  const renderFormItem = (item) => {
    switch (item.type) {
      case "list":
        return (
          <>
            {formData?.[item.fieldName]?.map?.((listItem, i) => (
              <div key={i}>
                <DynamicForm
                  AIEnhancements={AIEnhancements}
                  formData={listItem}
                  thinking={thinking}
                  setThinking={setThinking}
                  form={item.defaultForm}
                  readOnly={readOnly}
                  onChange={(fieldname, value) => {
                    // Create a new list with the updated item.
                    const updatedList = formData[item.fieldName].map(
                      (item, index) => {
                        if (index === i) {
                          // For the item that changed, update the specific field.
                          return { ...item, [fieldname]: value };
                        }
                        return item;
                      }
                    );

                    // Call the main onChange with the updated list.
                    onChange(item.fieldName, updatedList);
                  }}
                />

                <Button
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded-xl"
                  onClick={() => {
                    onChange(
                      item.fieldName,
                      formData[item.fieldName].filter((_, index) => index !== i)
                    );
                  }}
                >
                  Delete
                </Button>

                <Divider />
              </div>
            ))}

            <button
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded-xl mt-5"
              onClick={() => {
                onChange(item.fieldName, [
                  ...(formData?.[item.fieldName] ?? []),
                  item.defaultObject,
                ]);
              }}
            >
              Add
            </button>
          </>
        );
      case "input":
        return (
          <Input
            className="dark:bg-gray-900 rounded-lg text-md font-normal text-[#344054]"
            placeholder={item.placeholder}
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            readOnly={readOnly}
            onPressEnter={handleNext}
          />
        );
      case "email":
        return (
          <Input
            type="email"
            className="dark:bg-gray-900 text-md font-normal text-[#344054]"
            placeholder={item.placeholder}
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            readOnly={readOnly}
            onPressEnter={handleNext}
          />
        );
      case "phone":
        return (
          <PhoneInput
            placeholder={item.placeholder}
            inputClass="dark:!bg-gray-900"
            dropdownClass="dark:!text-black"
            buttonClass="dark:!bg-gray-900"
            defaultCountry="US"
            value={`${formData?.[item.fieldName] ?? ""}`}
            onChange={(e) => {
              if (readOnly) return;
              onChange(item.fieldName, e);
            }}
            onPressEnter={handleNext}
          />
        );
      case "password":
        return (
          <ShowPassword
            className="dark:bg-gray-900 text-md font-normal text-[#344054]"
            placeholder={item.placeholder}
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            readOnly={readOnly}
            onPressEnter={handleNext}
          />
        );
      case "textarea":
        return (
          <Input.TextArea
            placeholder={item.placeholder}
            className="dark:bg-gray-900 text-md font-normal text-[#344054]"
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            rows={item.rows ?? 3}
            readOnly={readOnly}
            onBlur={() =>
              item.autocomplete ? autocompleteVacancyForm(formData) : null
            }
          />
        );
      case "inputNumber":
        return (
          <InputNumber
            min={item.min}
            max={item.max}
            step={item.step}
            onChange={(value) => onChange(item.fieldName, value)}
            value={formData?.[item.fieldName]}
            readOnly={readOnly}
            className="dark:bg-gray-900"
            onPressEnter={handleNext}
          />
        );
      case "radio":
        return (
          <Radio.Group
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
          >
            {item.options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "rate":
        return (
          <Rate
            onChange={(value) => onChange(item.fieldName, value)}
            value={formData?.[item.fieldName]}
          />
        );
      case "select":
        return (
          <ReactSelect
            className="border-[1px] border-[#d8d8d8] font-semibold !shadow-none !outline-none rounded-lg  xl:w-auto !w-full text-xs text-gray-400"
            options={item.options}
            classNamePrefix={" profile-select"}
            value={{
              value: formData?.[item.fieldName],
              label: item.options?.find?.(
                (e) => e.value === formData?.[item.fieldName]
              )?.label,
            }}
            onChange={(e) => onChange(item.fieldName, e.value)}
            components={{ IndicatorSeparator: "" }}
          >
            {item.options.map((option) => (
              <Select.Option
                key={option.value}
                value={option.value}
                className="rounded-lg text-xs"
              >
                {option.label}
              </Select.Option>
            ))}
          </ReactSelect>
        );
      case "select-cost":
        return (
          <div>
            <ReactSelect
              className="border-[1px] border-[#d8d8d8] font-semibold !shadow-none !outline-none rounded-lg  xl:w-auto !w-full text-xs text-gray-400"
              options={item.options}
              classNamePrefix={" profile-select"}
              value={{
                value: formData?.[item.fieldName],
                label: item.options?.find?.(
                  (e) => e.value === formData?.[item.fieldName]
                )?.label,
              }}
              onChange={(e) => onChange(item.fieldName, e.value)}
              components={{ IndicatorSeparator: "" }}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  maxHeight: "none",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "none",
                }),
              }}
            >
              {item.options.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  className="rounded-lg text-xs"
                >
                  {option.label}
                </Select.Option>
              ))}
            </ReactSelect>

            <p className="text-xs font-base">
              Estimated Cost:{" "}
              {formData?.[item.fieldName]
                ? (formData[item.fieldName] / 2) * 0.2
                : "0"}{" "}
              € per interview
            </p>
          </div>
        );
      case "slider":
        return (
          <Slider
            min={item.min}
            max={item.max}
            step={item.step}
            onChange={(value) => onChange(item.fieldName, value)}
            value={formData?.[item.fieldName]}
          />
        );
      case "switch":
        return (
          <Switch
            checked={formData?.[item.fieldName]}
            onChange={(value) => onChange(item.fieldName, value)}
          />
        );
      case "timepicker":
        return (
          <TimePicker
            onChange={(time, timeString) =>
              onChange(item.fieldName, timeString)
            }
            value={
              formData?.[item.fieldName]
                ? dayjs(formData?.[item.fieldName], "HH:mm:ss")
                : null
            }
          />
        );
      case "datepicker":
        return (
          <DatePicker
            onChange={(date, dateString) =>
              onChange(item.fieldName, dateString)
            }
            value={
              formData?.[item.fieldName]
                ? dayjs(formData?.[item.fieldName])
                : null
            }
            className="dark:bg-gray-900"
          />
        );
      case "upload":
        return (
          <CloudinaryUpload
            onChange={(info) => {
              onChange(item.fieldName, info?.secure_url);
            }}
          />
        );
      case "checkbox":
        return (
          <div className="relative overflow-hidden rounded-lg">
            <ul className="flex w-full justify-between">
              {item.options.map((item) => (
                <li key={item.id} className="flex">
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      onChange(item.fieldName, item.value);
                    }}
                  >
                    <label for={item.id}>
                      <img
                        alt="avatar"
                        src={item.value}
                        className="rounded-lg max-h-[25vh] w-auto object-contain"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    </label>
                    <input
                      type="checkbox"
                      id={item.id}
                      name="avatar"
                      value={item.value}
                      checked={formData?.[item.fieldName] === item.value}
                      className="absolute top-2 right-2 rounded-full bg-white border-gray-300"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "button":
        return (
          <Button
            className="px-2 py-1 text-sm bg-indigo-500 text-white rounded-xl"
            checked={formData?.[item.fieldName]}
            onClick={(e) => {
              onChange(item.fieldName, "1");
              item.onClick(e);
            }}
          >
            {item.text}
          </Button>
        );
      case "colorpicker":
        return (
          <ColorPicker
            onChange={(color) => onChange(item.fieldName, color)}
            value={formData?.[item.fieldName]}
          />
        );
      case "customCheckbox":
        return (
          <div className="grid grid-cols-2 gap-4">
            {item.options.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  onChange(item.fieldName, item.value);
                  console.log(item, i);
                }}
                className="cursor-pointer h-min rounded-lg items-center justify-between p-2 bg-white flex border border-1 border-[#D0D5DD]"
              >
                <label
                  for={`interview_${item.title}_${i}`}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="p-1 m-1 items-center rounded-lg border border-1 border-[#D0D5DD] ">
                    {item.icon}
                  </div>
                  <div>
                    <h6>{item.title}</h6>
                    <p>{item.description}</p>
                  </div>
                </label>
                <input
                  id={`interview_${item.title}_${i}`}
                  type="checkbox"
                  className="rounded-full"
                  value={item.value}
                  checked={formData?.[item.fieldName] === item.value}
                />
              </div>
            ))}
          </div>
        );
      case "cards":
        return (
          <div>
            <div className="grid md:grid-cols-3 gap-10 grid-col-1">
              {item.options.map((item) => (
                <div
                  className="cursor-pointer rounded-lg p-2 bg-white border border-1 border-[#D0D5DD]"
                  onClick={() => item.action()}
                >
                  <div className="p-1 rounded-lg border border-1 border-[#D0D5DD] inline-block">
                    {item.icon}
                  </div>
                  <div>
                    <h6 className="text-md font-semibold py-2">{item.title}</h6>
                    <p className="pb-2">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "custom2":
        return <>{item.CustomInputComponent}</>;
      default:
        return null;
    }
  };

  return (
    <div
    // onKeyDown={(e) => {
    //   if (e.key === "Enter" && handleNext) handleNext();
    // }}
    >
      {form
        .filter((row) => !row.condition || row.condition(formData))
        .map((row) => (
          <div key={row.fieldName} className="form-item my-3">
            <div className="flex justify-between">
              <div className="flex justify-between items-center w-full">
                <label className="text-sm font-medium">{row.label}</label>
                <Space>
                  {row?.tooltip && (
                    <Tooltip title={row.tooltip}>
                      <GrInfo />
                    </Tooltip>
                  )}
                  {row?.loom && (
                    <div
                      className="cursor-pointer"
                      onClick={() => setLoom(row.loom)}
                    >
                      <MdOutlineSlowMotionVideo size={22} />
                    </div>
                  )}
                  {row?.helpLink && (
                    <a
                      className="cursor-pointer"
                      href={row?.helpLink}
                      target="_blank"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </Space>
              </div>

              {AIEnhancements && ["textarea"].includes(row.type) && (
                <FaMagic
                  size={15}
                  className="cursor-pointer"
                  onClick={() => {
                    // if (!formData?.[row.fieldName])
                    //   return message.info("Please write some text first");
                    // if (formData?.[row.fieldName]?.length < MINIMUM_AI_CHARS)
                    //   return message.info(
                    //     `AI needs a little more context. Please write at least ${MINIMUM_AI_CHARS} characters.`
                    //   );

                    socket.current = new WebSocket(
                      `wss://booklified-chat-socket.herokuapp.com`
                    );

                    socket.current.addEventListener("open", async () => {
                      socketPing.current = setInterval(
                        () =>
                          socket.current.send(JSON.stringify({ id: "PING" })),
                        30000
                      );
                      console.log(formData);
                      // const content = `Hello, I need your expertise in transforming the following text into a highly professional version. Please apply your literary skills to rewrite this text and return only the improved version, without any explanations or additional comments. Here's the text: ${
                      //   formData?.[row.fieldName]
                      // }`;
                      const content = `Hello, I need your expertise in transforming the following text into a highly professional version. 

If the text provided is empty, please use your creativity to generate a professional and suitable version based on the field name "${
                        row.fieldName
                      }" and the context from the data provided.

Here's the data for context:
${JSON.stringify(formData, null, 2)}
Here´s is an generic example of what is expected to be in the field ${
                        row.placeholder
                      } 

${
  formData?.[row.fieldName]
    ? `And here's the text to rewrite: ${formData?.[row.fieldName]}`
    : `There is no text provided for the field "${row.fieldName}". Please generate an appropriate version creatively.`
}

Please return only the improved or generated version, without any explanations or additional comments.`;

                      setThinking((e) => [...e, row.fieldName]);
                      socket.current.send(
                        JSON.stringify({
                          id: "OPEN_AI_PROMPT",
                          payload: {
                            content,
                            model: "gpt-4.1-mini-2025-04-14",
                            partner: partner?._id,
                          },
                        })
                      );
                    });

                    socket.current.addEventListener(
                      "message",
                      async (event) => {
                        const message = JSON.parse(event.data);
                        console.log(message);
                        const response = message.payload?.response;

                        onChange(row.fieldName, response);
                        if (socketPing.current)
                          clearInterval(socketPing.current);
                        setThinking((e) =>
                          e.filter((x) => x !== row.fieldName)
                        );
                      }
                    );
                  }}
                />
              )}
            </div>

            <div>{row?.description && <label>{row.description}</label>}</div>

            {renderFormItem(row)}
            {row.validationRegex &&
              formData?.[row.fieldName]?.length >
                (row.validationRegexTriggerMin ?? 1) &&
              !formData?.[row.fieldName]?.match?.(row.validationRegex) && (
                <div className="text-red-500 ">{row.validationWarningText}</div>
              )}
          </div>
        ))}

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!loom}
        onCancel={() => setLoom(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title="Tip"
      >
        <div
          style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src={`https://www.loom.com/embed/${loom}`}
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

const FormMultiStep = ({
  steps,
  defaultFormData = {},
  formDataParent,
  onFinish = () => {},
  onNext = () => {},
  AIEnhancements = false,
  displaySteps = true,
  bottomLine = <></>,
  bottomLinePre = <></>,
  bottomLineAfter = <></>,
  buttomLineWrapperClass = "",
  buttomLineInnerClass = "",
  displayUndoRedo = false,
  readOnly,
  loading = false,
  finishText = "Finish",
  wrapperClassName = "p-2 flex-grow",
  passFormData,
}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [requiredFields, setRequiredFields] = useState({});
  const [activeStep, setActiveStep] = useState(0); // Initialize current step to 0
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [thinking, setThinking] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    var myDiv = document.getElementById("multiFormContainer");
    if (myDiv) myDiv.scrollTop = 0;
    document.body.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [activeStep]);

  const handleFormChange = (fieldName, value) => {
    if (readOnly) return;
    setUndoStack((currentStack) => [formData, ...currentStack]);
    setRedoStack([]); // Clear redo stack on new change
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handleUndo = (event) => {
    if (event.ctrlKey && event.key === "z") {
      event.preventDefault(); // Prevent the default undo behavior
      setUndoStack((currentStack) => {
        const [lastValue, ...newStack] = currentStack;
        if (lastValue !== undefined) {
          setRedoStack((redoCurrent) => [formData, ...redoCurrent]);
          setFormData(lastValue);
        }
        return newStack;
      });
    }
  };

  const handleRedo = (event) => {
    if (event.ctrlKey && event.key === "y") {
      event.preventDefault(); // Prevent the default redo behavior
      setRedoStack((currentStack) => {
        const [nextValue, ...newStack] = currentStack;
        if (nextValue !== undefined) {
          setUndoStack((undoCurrent) => [formData, ...undoCurrent]);
          setFormData(nextValue);
        }
        return newStack;
      });
    }
  };

  // Attach and clean up the event listener
  useEffect(() => {
    if (!displayUndoRedo) return;
    const handleKeyDown = (event) => {
      handleUndo(event);
      handleRedo(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [formData, displayUndoRedo]); // formData dependency added

  const handleNext = useCallback(() => {
    const requiredFields = steps[activeStep].form.filter(
      (item) => item.required && !formData?.[item.fieldName]
    );
    if (steps[activeStep]?.requiredFields) {
      requiredFields.push(
        ...steps[activeStep]?.requiredFields.filter(
          (item) =>
            !formDataParent?.[item.value] ||
            formDataParent?.[item.value]?.length === 0
        )
      );
    }

    if (requiredFields.length > 0) {
      message.error(
        `${requiredFields.map((f) => f.label).join(", ")} ${
          requiredFields.length === 1 ? "is" : "are"
        } required`
      );

      return setRequiredFields(requiredFields);
    }
    if (formData?.email && !validateEmail(formData?.email))
      return message.error("Invalid email");

    setRequiredFields([]);
    setUndoStack([]);
    setRedoStack([]);

    if (steps[activeStep + 1]?.form) {
      let nextStep = activeStep + 1;

      // Skip logic
      if (steps[activeStep]?.form)
        for (const formInput of steps[activeStep].form) {
          if (
            ![
              "inputNumber",
              "radio",
              "rate",
              "select",
              "switch",
              "checkbox",
            ].includes(formInput.type)
          )
            continue;
          if (!formInput.conditions || formInput.conditions.length === 0)
            continue;

          if (
            formInput.conditions.every((c) => {
              return (
                (c.comparison === "is more than" &&
                  formData?.[formInput?.fieldName] > c.value) ||
                (c.comparison === "is less than" &&
                  formData?.[formInput?.fieldName] < c.value) ||
                (c.comparison === "is more than or equal" &&
                  formData?.[formInput?.fieldName] >= c.value) ||
                (c.comparison === "is less than or equal" &&
                  formData?.[formInput?.fieldName] <= c.value) ||
                (c.comparison === "equals" &&
                  ["inputNumber", "rate"].includes(formInput.type) &&
                  formData?.[formInput?.fieldName] == c.value) ||
                (c.comparison === "equals" &&
                  ["radio", "select"].includes(formInput.type) &&
                  formInput?.options?.find?.((o) => o.label == c.value)
                    ?.value == formData?.[formInput?.fieldName]) ||
                (c.comparison === "not equals" &&
                  ["inputNumber", "rate"].includes(formInput.type) &&
                  formData?.[formInput?.fieldName] != c.value) ||
                (c.comparison === "not equals" &&
                  ["radio", "select"].includes(formInput.type) &&
                  formInput?.options?.find?.((o) => o.label == c.value)
                    ?.value != formData?.[formInput?.fieldName]) ||
                (c.comparison === "is true" &&
                  formData?.[formInput?.fieldName] === true) ||
                (c.comparison === "is false" &&
                  formData?.[formInput?.fieldName] === false)
              );
            })
          ) {
            const skipStepIdx = steps.findIndex(
              (c) => c.id === formInput.skipStep
            );
            if (typeof skipStepIdx === "number" && skipStepIdx !== -1)
              nextStep = skipStepIdx;
          }
        }

      if (nextStep > activeStep + 1) {
        // If next step is ahead, remember skipped steps
        const skipped = Array.from(
          { length: nextStep - activeStep - 1 },
          (_, i) => activeStep + i + 1
        );
        setSkippedSteps((prevSkippedSteps) => [
          ...prevSkippedSteps.filter((step) => step <= activeStep),
          ...skipped,
        ]);
      } else {
        setSkippedSteps((prevSkippedSteps) => [
          ...prevSkippedSteps.filter((step) => step <= activeStep),
          activeStep + 1,
        ]);
      }
      setActiveStep(nextStep);
      onNext({
        ...formData,
        ...(formDataParent ? formDataParent : {}),
        phone: formData?.phone ? getPhone(formData.phone) : undefined,
      });
    } else
      onFinish({
        ...formData,
        ...(formDataParent ? formDataParent : {}),
        phone: formData?.phone ? getPhone(formData.phone) : undefined,
      });
  }, [activeStep, steps, formData, formDataParent]);

  useEffect(() => {
    if (passFormData) passFormData(formData);
  }, [formData]);

  if (steps.length === 0) return <></>;
  return (
    <div className="flex flex-grow justify-beetween flex-col">
      <div className="flex flex-col pt-5 min-h-full" id="multiFormContainer">
        {displaySteps && (
          <div className="hidden md:block">
            <Steps
              labelPlacement="vertical"
              size="small"
              current={activeStep}
              items={steps.map((step) => ({
                title: step.name,
                style: { fontSize: "6px", color: "#eee" },
              }))}
            />
          </div>
        )}
        <div className={wrapperClassName}>
          <DynamicForm
            thinking={thinking}
            setThinking={setThinking}
            AIEnhancements={AIEnhancements}
            formData={formData}
            form={steps[activeStep]?.form ?? []}
            onChange={(fieldName, value) => handleFormChange(fieldName, value)}
            handleNext={handleNext}
            readOnly={readOnly}
          />
        </div>
        {requiredFields.length > 0 && (
          <Alert
            type="error"
            message={`${requiredFields.map((f) => f.label).join(", ")} ${
              requiredFields.length === 1 ? "is" : "are"
            } required`}
          />
        )}
      </div>
      <div className="w-full flex justify-end gap-6">
        {activeStep > 0 && (
          <button
            className="py-2 mx-2 text-sm bg-white border border-1 border-[#D0D5DD] text-[#344054]  rounded-lg w-full"
            onClick={() => {
              if (activeStep > 0) {
                // Find the last remembered skipped step before the current step
                const lastSkippedSteps = skippedSteps.filter(
                  (step) => step <= activeStep
                );

                let previousStep = activeStep - 1;

                if (lastSkippedSteps.length > 0) {
                  // If there are skipped steps before the current step,
                  // navigate to the last non-skipped step before the current step
                  previousStep = Math.max(...lastSkippedSteps, -1);
                }
                const lastSkippedStep =
                  lastSkippedSteps?.[lastSkippedSteps.length - 1];

                // If found, navigate to that step
                if (
                  typeof lastSkippedStep === "number" &&
                  lastSkippedStep > 0 &&
                  lastSkippedStep < steps.length
                ) {
                  setActiveStep(lastSkippedStep - 1);
                  // Remove the last remembered skipped step from the list
                } else {
                  // Otherwise, navigate to the previous step
                  setActiveStep(activeStep - 1);
                }
              }
            }}
          >
            Back
          </button>
        )}

        {activeStep < steps.length - 1 && (
          <button
            className="py-2 mx-2 text-sm bg-gradient text-white rounded-lg w-full"
            onClick={handleNext}
            type="primary"
          >
            Continue
          </button>
        )}
        {activeStep === steps.length - 1 && (
          <button
            className="py-2 mx-2 text-sm bg-gradient text-white rounded-lg w-full"
            disabled={loading}
            onClick={handleNext}
            type="primary"
          >
            {loading ? <Spin>{finishText}</Spin> : <>{finishText}</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormMultiStep;
