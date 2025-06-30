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
import { FaExternalLinkAlt, FaRedo, FaUndo } from "react-icons/fa";
import { GrInfo } from "react-icons/gr";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { TbRobotFace } from "react-icons/tb";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
import { MINIMUM_AI_CHARS } from "../../../../data/constants";
import { getPartner, selectDarkMode } from "../../../../redux/auth/selectors";
import CloudinaryUpload from "./CloudinaryUpload";
import { partner } from "../../../../constants";

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
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded"
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
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded mt-5"
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
            className="dark:bg-gray-900"
            placeholder={item.placeholder}
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            disabled={thinking.includes(item.fieldName)}
            readOnly={readOnly}
          />
        );
      case "email":
        return (
          <Input
            type="email"
            className="dark:bg-gray-900"
            placeholder={item.placeholder}
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            disabled={thinking.includes(item.fieldName)}
            readOnly={readOnly}
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
          />
        );
      case "password":
        return (
          <Input
            type="password"
            className="dark:bg-gray-900"
            placeholder={item.placeholder}
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            readOnly={readOnly}
          />
        );
      case "textarea":
        return (
          <Input.TextArea
            placeholder={item.placeholder}
            className="dark:bg-gray-900"
            onChange={(e) => onChange(item.fieldName, e.target.value)}
            value={formData?.[item.fieldName]}
            rows={item.rows ?? 3}
            disabled={thinking.includes(item.fieldName)}
            readOnly={readOnly}
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
            className="border-[1px] border-[#d8d8d8] font-semibold !shadow-none !outline-none rounded-[5px]  xl:w-auto !w-full dark:!bg-gray-900"
            options={item.options}
            classNamePrefix={"dark:bg-gray-900 profile-select"}
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
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </ReactSelect>
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
          <Checkbox
            checked={formData?.[item.fieldName]}
            onChange={(e) => {
              onChange(item.fieldName, e.target.checked);
            }}
          >
            {item.label}
          </Checkbox>
        );
      case "button":
        return (
          <Button
            className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
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
      case "custom":
        return (
          <item.CustomInputComponent
            onChange={(value) => onChange(item.fieldName, value)}
            value={formData?.[item.fieldName]}
          />
        );
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
          <div key={row.fieldName} className="form-item my-8">
            <div className="flex justify-between">
              <div className="flex justify-between items-center w-full">
                <label className="text-lg font-semibold">{row.label}</label>
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
                <TbRobotFace
                  size={18}
                  className="cursor-pointer"
                  onClick={() => {
                    if (!formData?.[row.fieldName])
                      return message.info("Please write some text first");
                    if (formData?.[row.fieldName]?.length < MINIMUM_AI_CHARS)
                      return message.info(
                        `AI needs a little more context. Please write at least ${MINIMUM_AI_CHARS} characters.`
                      );

                    socket.current = new WebSocket(
                      `wss://booklified-chat-socket.herokuapp.com`
                    );

                    socket.current.addEventListener("open", async () => {
                      socketPing.current = setInterval(
                        () =>
                          socket.current.send(JSON.stringify({ id: "PING" })),
                        30000
                      );
                      const content = `Hello, I need your expertise in transforming the following text into a highly professional version. Please apply your literary skills to rewrite this text. Here's the text: ${
                        formData?.[row.fieldName]
                      }`;

                      setThinking((e) => [...e, row.fieldName]);
                      socket.current.send(
                        JSON.stringify({
                          id: "OPEN_AI_PROMPT",
                          payload: {
                            content,
                            model: "gpt-4o",
                            app_id: "hirelab",
                            partner: partner?._id,
                          },
                        })
                      );
                    });

                    socket.current.addEventListener(
                      "message",
                      async (event) => {
                        const message = JSON.parse(event.data);
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

const MultiStepComponent = ({
  steps,
  defaultFormData = {},
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
  wrapperClassName = "p-5 flex-grow",
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
        phone: formData?.phone ? getPhone(formData.phone) : undefined,
      });
    } else
      onFinish({
        ...formData,
        phone: formData?.phone ? getPhone(formData.phone) : undefined,
      });
  }, [activeStep, steps, formData]);

  useEffect(() => {
    if (passFormData) passFormData(formData);
  }, [formData]);

  if (steps.length === 0) return <></>;
  return (
    <div
      className="flex flex-col overflow-auto px-10 pt-5"
      style={{ minHeight: "50vh" }}
      id="multiFormContainer"
    >
      {displaySteps && (
        <div className="hidden md:block ">
          <Steps
            progressDot
            current={activeStep}
            items={steps.map((step) => ({
              title: step.name,
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
        <br />
      </div>
      {requiredFields.length > 0 && (
        <Alert
          type="error"
          message={`${requiredFields.map((f) => f.label).join(", ")} ${
            requiredFields.length === 1 ? "is" : "are"
          } required`}
        />
      )}
      {/* Sticky Footer */}
      <div className="bg-white dark:bg-gray-900 p-4 shadow-md dark:shadow-gray-400/50 hover:shadow-gray-600/50  sticky bottom-0">
        <div className={buttomLineWrapperClass}>
          <div className={buttomLineInnerClass}>
            {bottomLinePre}
            <Space className="w-full justify-end">
              {activeStep > 0 && (
                <button
                  className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
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
                  Previous
                </button>
              )}
              {displayUndoRedo && (
                <>
                  <button
                    disabled={undoStack.length === 0}
                    className="px-2 py-1 text-sm bg-white-500 text-indigo-500 border border-indigo-500 rounded"
                    onClick={() => {
                      setUndoStack((currentStack) => {
                        const [lastValue, ...newStack] = currentStack;
                        if (lastValue !== undefined) {
                          setRedoStack((redoCurrent) => [
                            formData,
                            ...redoCurrent,
                          ]);
                          setFormData(lastValue);
                        }
                        return newStack;
                      });
                    }}
                    type="secondary"
                  >
                    <FaUndo />
                  </button>
                  <button
                    disabled={redoStack.length === 0}
                    className="px-2 py-1 text-sm bg-white-500 text-indigo-500 border border-indigo-500 rounded"
                    onClick={() => {
                      setRedoStack((currentStack) => {
                        const [nextValue, ...newStack] = currentStack;
                        if (nextValue !== undefined) {
                          setUndoStack((undoCurrent) => [
                            formData,
                            ...undoCurrent,
                          ]);
                          setFormData(nextValue);
                        }
                        return newStack;
                      });
                    }}
                    type="secondary"
                  >
                    <FaRedo />
                  </button>
                </>
              )}
              {activeStep < steps.length - 1 && (
                <button
                  className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                  onClick={handleNext}
                  type="primary"
                  loading={thinking.length > 0}
                >
                  Next
                </button>
              )}
              {activeStep === steps.length - 1 && (
                <button
                  className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                  disabled={loading || thinking.length > 0}
                  onClick={handleNext}
                  type="primary"
                >
                  {loading ? <Spin>{finishText}</Spin> : <>{finishText}</>}
                </button>
              )}
              {bottomLine}
            </Space>
            {bottomLineAfter}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepComponent;
