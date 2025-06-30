import { DeleteOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Switch,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CrudService from "../../services/CrudService";
//3
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const FormEditor = ({ landingPageData, setLandingPageData }) => {
  const router = useRouter();
  const { lpId } = router.query;
  const [showPreview, setShowPreview] = useState(false);
  const [fields, setFields] = useState(landingPageData?.form?.fields || []);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    function listener(e) {
      if (changed) {
        e.preventDefault();
        const msg = "You have unsaved changes";
        e.returnValue = msg;
        return msg;
      }
    }

    window.addEventListener("beforeunload", listener);
    window.addEventListener("onbeforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
      window.removeEventListener("onbeforeunload", listener);
    };
  }, [changed]);

  const handleChanged = () => setChanged(true);
  useEffect(() => {
    document.addEventListener("HANDLE.CHANGED", handleChanged);
    return () => document.removeEventListener("HANDLE.CHANGED", handleChanged);
  }, []);

  const addField = (type) => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: "",
      required: false,
      ...(type === "multipleChoice"
        ? { options: [{ text: "", isNegative: false }] }
        : {}),
    };
    const newFields = [...fields, newField];
    setFields(newFields);
    updateForm(newFields);
  };

  const updateField = (id, updates) => {
    const newFields = fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );
    setFields(newFields);
    updateForm(newFields);
  };

  const removeField = (id) => {
    const newFields = fields.filter((field) => field.id !== id);
    setFields(newFields);
    updateForm(newFields);
  };

  const updateForm = (newFields) => {
    setLandingPageData({
      ...landingPageData,
      form: {
        ...landingPageData?.form,
        fields: newFields,
      },
    });
    document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
    updateForm(items);
  };

  return (
    <div
      className="max-h-[75vh] overflow-auto flex flex-col gap-2 justify-between pr-4"
      onBlur={async () => {
        if (changed) {
          await CrudService.update("LandingPageData", lpId, {
            ...landingPageData,
            _id: undefined,
          });
          setChanged(false);
        }
      }}
    >
      <div className="container p-4 mx-auto">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space size="large" style={{ width: "100%" }}>
            <Form.Item label="Form Title" style={{ flex: 1 }}>
              <Input
                value={landingPageData?.form?.title || ""}
                onChange={(e) => {
                  setLandingPageData({
                    ...landingPageData,
                    form: { ...landingPageData?.form, title: e.target.value },
                  });
                  document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
                }}
                placeholder="Enter form title"
              />
            </Form.Item>
            <Form.Item label="Description" style={{ flex: 1 }}>
              <Input
                value={landingPageData?.form?.description || ""}
                onChange={(e) => {
                  setLandingPageData({
                    ...landingPageData,
                    form: {
                      ...landingPageData?.form,
                      description: e.target.value,
                    },
                  });
                  document.dispatchEvent(new CustomEvent("HANDLE.CHANGED"));
                }}
                placeholder="Enter form description"
              />
            </Form.Item>
          </Space>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {fields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              padding: 16,
                              background: "#f0f2f5",
                              borderRadius: 8,
                            }}
                          >
                            <Space
                              direction="vertical"
                              size="small"
                              style={{ width: "100%" }}
                            >
                              <Input
                                value={field.label}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    label: e.target.value,
                                  })
                                }
                                placeholder="Field label"
                                prefix={
                                  <MenuOutlined
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                  />
                                }
                              />
                              {field.type === "multipleChoice" && (
                                <Space
                                  direction="vertical"
                                  size="small"
                                  style={{ width: "100%" }}
                                >
                                  {field.options?.map((option, i) => (
                                    <Space key={i}>
                                      <Input
                                        value={option.text}
                                        onChange={(e) => {
                                          const newOptions = [
                                            ...(field.options || []),
                                          ];
                                          newOptions[i] = {
                                            ...option,
                                            text: e.target.value,
                                          };
                                          updateField(field.id, {
                                            options: newOptions,
                                          });
                                        }}
                                        placeholder="Option text"
                                      />
                                      <Switch
                                        checked={option.isNegative}
                                        onChange={(checked) => {
                                          const newOptions = [
                                            ...(field.options || []),
                                          ];
                                          newOptions[i] = {
                                            ...option,
                                            isNegative: checked,
                                          };
                                          updateField(field.id, {
                                            options: newOptions,
                                          });
                                        }}
                                        checkedChildren="Negative"
                                        unCheckedChildren="Positive"
                                      />
                                      <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                          const newOptions =
                                            field.options?.filter(
                                              (_, idx) => idx !== i
                                            );
                                          updateField(field.id, {
                                            options: newOptions,
                                          });
                                        }}
                                      />
                                    </Space>
                                  ))}
                                  <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                      const newOptions = [
                                        ...(field.options || []),
                                        { text: "", isNegative: false },
                                      ];
                                      updateField(field.id, {
                                        options: newOptions,
                                      });
                                    }}
                                  >
                                    Add Option
                                  </Button>
                                </Space>
                              )}
                              <Space>
                                <Switch
                                  checked={field.required}
                                  onChange={(checked) =>
                                    updateField(field.id, { required: checked })
                                  }
                                  checkedChildren="Required"
                                  unCheckedChildren="Optional"
                                />
                                <Button
                                  danger
                                  onClick={() => removeField(field.id)}
                                >
                                  Remove Field
                                </Button>
                              </Space>
                            </Space>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Space>
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Space wrap>
            <Button onClick={() => addField("name")}>Add Name Field</Button>
            <Button onClick={() => addField("email")}>Add Email Field</Button>
            <Button onClick={() => addField("phone")}>Add Phone Field</Button>
            <Button onClick={() => addField("text")}>Add Text Field</Button>
            <Button onClick={() => addField("multipleChoice")}>
              Add Multiple Choice
            </Button>
            <Button onClick={() => addField("motivation")}>
              Add Motivation Letter
            </Button>
          </Space>
        </Space>

        <div className="h-px mt-4 bg-blue_gray-50_01" />
        <div className="flex gap-5 mt-2">
          <Button
            disabled={!changed}
            onClick={async () => {
              await CrudService.update("LandingPageData", lpId, {
                ...landingPageData,
                _id: undefined,
              });
              setChanged(false);
            }}
            shape="round"
            className={`w-full border border-solid  bg-[#0E87FE] text-white-A700 font-semibold smx:px-5 ${
              changed ? "" : "opacity-50 !cursor-default"
            }`}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormEditor;
