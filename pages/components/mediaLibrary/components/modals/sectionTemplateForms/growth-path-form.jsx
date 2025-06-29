import React, { useState } from "react";
import { Input, Button, Collapse, Popconfirm, message } from "antd";
import IconsSelector, { IconRenderer } from "../../../../../pages/LandingpageEdit/IconsSelector";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const { Panel } = Collapse;



const GrowthPathForm = ({ initialData, onSave, isSaving }) => {
  const [showIconsSelector, setShowIconsSelector] = useState(false);
  const [selectedPathIndex, setSelectedPathIndex] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);

  const [formData, setFormData] = useState({
    growthPathTitle: initialData?.growthPathTitle || "Growth Path",
    growthPathDescription: initialData?.growthPathDescription || "",
    growthPath: initialData?.growthPath || [
      { title: "", description: "", icon: "/images3/img_partner_exchange.svg" }
    ],
    type: "growthPath"
  });

  const togglePanel = (index) => {
    setActiveKeys(prev => 
      prev.includes(index.toString()) 
        ? prev.filter(k => k !== index.toString()) 
        : [...prev, index.toString()]
    );
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePathChange = (index, field, value) => {
    const updatedPath = [...formData.growthPath];
    updatedPath[index][field] = value;
    handleChange("growthPath", updatedPath);
  };

  const addPath = () => {
    handleChange("growthPath", [
      ...formData.growthPath,
      { title: "", description: "", icon: "/images3/img_partner_exchange.svg" }
    ]);
  };

  const removePath = (index) => {
    handleChange("growthPath", formData.growthPath.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Growth path saved successfully");
    } catch (error) {
      message.error("Failed to save growth path");
      console.error("Error saving growth path:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p>Header</p>
        <p>{formData.growthPathTitle.length}/40</p>
      </div>
      <Input
        value={formData.growthPathTitle}
        onChange={(e) => handleChange("growthPathTitle", e.target.value)}
        maxLength={40}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Subheader */}
      <div className="flex justify-between items-center">
        <p>Subheader</p>
        <p>{formData.growthPathDescription.length}/120</p>
      </div>
      <Input.TextArea
        value={formData.growthPathDescription}
        onChange={(e) => handleChange("growthPathDescription", e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Growth Path Items */}
      <Collapse
        ghost
        bordered={false}
        activeKey={activeKeys}
        // onChange={setActiveKeys}
        onChange={(keys) => setActiveKeys(keys)}
        className="!border-none"
      >
        {formData.growthPath.map((path, index) => (
          <Panel
            key={index}
            showArrow={false}
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" onClick={() => togglePanel(index)}>
                  <span>{path.title || `Path ${index + 1}`}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform ${
                      activeKeys.includes(index.toString()) ? "rotate-180" : ""
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <Popconfirm
                  title="Delete this path?"
                  onConfirm={() => removePath(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <CloseOutlined className="text-red-500 hover:text-red-700 cursor-pointer" />
                </Popconfirm>
              </div>
            }
          >
            <div className="flex flex-col gap-4 p-4 border rounded-lg border-blue_gray-100">
              {/* Icon Selector */}
              <div className="flex items-center justify-between">
                <span>Icon</span>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setSelectedPathIndex(index);
                    setShowIconsSelector(true);
                  }}
                >
                  <span className="text-blue-600">Select Icon</span>
                  <div className="p-1 border-2 border-blue-600 rounded">
                    <IconRenderer icon={path.icon} className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p>Title</p>
                  <p>{path.title.length}/40</p>
                </div>
                <Input
                  value={path.title}
                  onChange={(e) => handlePathChange(index, "title", e.target.value)}
                  maxLength={40}
                  className="rounded-lg border border-solid border-blue_gray-100"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p>Description</p>
                  <p>{path.description.length}/400</p>
                </div>
                <Input.TextArea
                  value={path.description}
                  onChange={(e) => handlePathChange(index, "description", e.target.value)}
                  rows={3}
                  maxLength={400}
                  className="rounded-lg border border-solid border-blue_gray-100"
                />
              </div>
            </div>
          </Panel>
        ))}
      </Collapse>

      <Button
        onClick={addPath}
        icon={<PlusOutlined />}
        className="flex items-center gap-2 mt-4"
      >
        Add Path
      </Button>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD]"
      >
        {initialData ? "Update Growth Path" : "Create Growth Path"}
      </Button>

      {showIconsSelector && selectedPathIndex !== null && (
        <IconsSelector
          visible={showIconsSelector}
          onCancel={() => setShowIconsSelector(false)}
          onSelect={(icon) => {
            handlePathChange(selectedPathIndex, "icon", icon);
            setShowIconsSelector(false);
          }}
        />
      )}
    </div>
  );
};

export default GrowthPathForm;