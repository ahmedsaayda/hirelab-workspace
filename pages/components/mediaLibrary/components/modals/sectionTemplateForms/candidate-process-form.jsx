import React, { useState } from "react";
import { Input, Button, Collapse, Popconfirm } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import IconsSelector, {
    IconRenderer,
  } from "../../../../../pages/LandingpageEdit/IconsSelector"; // Assume you have an icon picker component
import { message } from 'antd';

const { Panel } = Collapse;



const CandidateProcessForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const defaultProcessStep = {
    candidateProcessText: "",
    candidateProcessIcon: "/images3/img_lock.svg",
    _id: Math.random().toString(36).substring(2, 9)
  };

  const [formData, setFormData] = useState({
    candidateProcessTitle: initialData?.candidateProcessTitle || "Our Application Process",
    candidateProcessDescription: initialData?.candidateProcessDescription || "",
    candidateProcess: initialData?.candidateProcess || [defaultProcessStep],
    type: 'candidateProcess'
  });

  const [showIconsSelector, setShowIconsSelector] = useState(false);
  const [selectedFactIndex, setSelectedFactIndex] = useState(
    null
  );
  const [activeKeys, setActiveKeys] = useState([]);

  const handleFactProcessChange = (index, field, value) => {
    const updatedFacts = [...formData.candidateProcess];
    updatedFacts[index][field] = value;
    handleChange("candidateProcess", updatedFacts);
  };


  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProcessChange = (index, field, value) => {
    const updatedSteps = formData.candidateProcess.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    );
    handleChange('candidateProcess', updatedSteps);
  };

  const addProcessStep = () => {
    handleChange('candidateProcess', [
      ...formData.candidateProcess,
      {
        ...defaultProcessStep,
        _id: Math.random().toString(36).substring(2, 9)
      }
    ]);
  };

  const removeProcessStep = (index) => {
    handleChange('candidateProcess', 
      formData.candidateProcess.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Candidate process saved successfully");
    } catch (error) {
      message.error("Failed to save candidate process");
      console.error("Error saving candidate process:", error);
    }
  };
  
  const togglePanel = (index) => {
    setActiveKeys((prevKeys) =>
      prevKeys.includes(index.toString())
        ? prevKeys.filter((key) => key !== index.toString())
        : [...prevKeys, index.toString()]
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.candidateProcessTitle.length}/40</p>
      </div>
      <Input
        value={formData.candidateProcessTitle}
        onChange={(e) => handleChange('candidateProcessTitle', e.target.value)}
        maxLength={40}
        className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
      />

      {/* Section Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.candidateProcessDescription.length}/120</p>
      </div>
      <Input.TextArea
        value={formData.candidateProcessDescription}
        onChange={(e) => handleChange('candidateProcessDescription', e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Process Steps */}
      <div className="mt-4">
        <Collapse 
            size="small"
            ghost
            bordered={false}
            className=" !pb-0 w-full "
            activeKey={activeKeys}
            onChange={(keys) => setActiveKeys(keys)}
        >
          {formData.candidateProcess.map((step, index) => (
            <Panel
              key={step._id}
              showArrow={false}
              className="border-none"
              header={
                <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => togglePanel(index)}
                >
                  {/* <span>{step.candidateProcessText || `Step ${index + 1}`}</span> */}
                  <span className="flex gap-1 items-center">
                  {step.candidateProcessText || `Step ${index + 1}`}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-3 transition-transform duration-200 ${
                      activeKeys.includes(index.toString()) ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
                  <Popconfirm
                    title="Delete this step?"
                    onConfirm={() => removeProcessStep(index)}
                    okText="Yes"
                    cancelText="No"
                  >
                  <button
                    className="p-2 text-red-500"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  </Popconfirm>
                </div>
              }
            >
              <div className="flex flex-col gap-4 p-4 border rounded-lg">
                {/* Step Text */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p>Step Description</p>
                    <p>{step.candidateProcessText.length}/60</p>
                  </div>
                  <Input
                    value={step.candidateProcessText}
                    onChange={(e) => 
                      handleProcessChange(index, 'candidateProcessText', e.target.value)
                    }
                    maxLength={60}
                    className="w-full border border-solid border-blue_gray-100 sm:w-full sm:pr-5 rounded-md"
                  />
                </div>

                {/* Icon Selection */}
                <div className="flex items-center gap-4 justify-between">
                    <span>Icon</span>
                    <div
                    className="flex gap-1 items-center text-gray-400"
                    onClick={() => {
                        setSelectedFactIndex(index);
                        setShowIconsSelector(true);
                    }}
                    >
                    <div>Select Icon </div>
                    <div className="p-1 border-2 rounded-sm text-[#0E87FE] border-[#0E87FE]">
                        <IconRenderer icon={step.icon} className={""} />
                    </div>
                    </div>
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>
        {showIconsSelector && selectedFactIndex !== null && (
        <IconsSelector
          visible={showIconsSelector}
          onCancel={() => setShowIconsSelector(false)}
          onSelect={(icon) => {
            handleProcessChange(selectedFactIndex, "icon", icon);
            setShowIconsSelector(false);
          }}
        />
      )}

        <Button
          onClick={addProcessStep}
          className="mt-4 flex items-center gap-2"
          icon={<PlusOutlined />}
        >
          Add Process Step
        </Button>
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update Process" : "Create Process"}
      </Button>
    </div>
  );
};

export default CandidateProcessForm;