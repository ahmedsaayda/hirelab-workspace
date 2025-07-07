import React, { useState } from "react";
import { Input, Button, Collapse, Switch, Popconfirm } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { message } from 'antd';

const { Panel } = Collapse;
const { TextArea } = Input;



const JobSpecificationsForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const defaultSpecification = {
    title: "",
    description: "",
    bulletPoints: [{ bullet: "" }],
    enabled: true
  };

  const [formData, setFormData] = useState({
    jobSpecificationTitle: initialData?.jobSpecificationTitle || "Job Specifications",
    jobSpecificationDescription: initialData?.jobSpecificationDescription || "",
    specifications: initialData?.specifications || [defaultSpecification],
    type: 'jobSpecification'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = formData.specifications.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    );
    handleChange('specifications', updatedSpecs);
  };

  const handleBulletChange = (specIndex, bulletIndex, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[specIndex].bulletPoints[bulletIndex].bullet = value;
    handleChange('specifications', updatedSpecs);
  };

  const addSpecification = () => {
    handleChange('specifications', [...formData.specifications, defaultSpecification]);
  };

  const removeSpecification = (index) => {
    handleChange('specifications', formData.specifications.filter((_, i) => i !== index));
  };

  const addBulletPoint = (specIndex) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[specIndex].bulletPoints.push({ bullet: "" });
    handleChange('specifications', updatedSpecs);
  };

  const removeBulletPoint = (specIndex, bulletIndex) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[specIndex].bulletPoints.splice(bulletIndex, 1);
    handleChange('specifications', updatedSpecs);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Job specifications saved successfully");
    } catch (error) {
      message.error("Failed to save job specifications");
      console.error("Error saving job specifications:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.jobSpecificationTitle.length}/40</p>
      </div>
      <Input
        value={formData.jobSpecificationTitle}
        onChange={(e) => handleChange('jobSpecificationTitle', e.target.value)}
        maxLength={40}
        className="w-full border border-solid border-blue_gray-100 rounded-md"
      />

      {/* Section Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.jobSpecificationDescription.length}/120</p>
      </div>
      <TextArea
        value={formData.jobSpecificationDescription}
        onChange={(e) => handleChange('jobSpecificationDescription', e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Specifications */}
      <div className="mt-4">
        <Collapse
          ghost
          className="!border-none"
          expandIconPosition="end"
        >
          {formData.specifications.map((spec, index) => (
            <Panel
              key={index}
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={spec.enabled}
                      onChange={(checked) => handleSpecChange(index, 'enabled', checked)}
                    />
                    <span>{spec.title || `Specification ${index + 1}`}</span>
                  </div>
                  <Popconfirm
                    title="Delete this specification?"
                    onConfirm={() => removeSpecification(index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <CloseOutlined className="text-red-500 hover:text-red-700" />
                  </Popconfirm>
                </div>
              }
            >
              <div className="flex flex-col gap-4 p-4 border rounded-lg">
                <Input
                  placeholder="Specification Title"
                  value={spec.title}
                  onChange={(e) => handleSpecChange(index, 'title', e.target.value)}
                  maxLength={60}
                />

                <TextArea
                  placeholder="Specification Description"
                  value={spec.description}
                  onChange={(e) => handleSpecChange(index, 'description', e.target.value)}
                  rows={2}
                  maxLength={200}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p>Bullet Points</p>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => addBulletPoint(index)}
                    >
                      Add Bullet
                    </Button>
                  </div>
                  
                  {spec.bulletPoints.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2 items-center">
                      <Input
                        value={bullet.bullet}
                        onChange={(e) => handleBulletChange(index, bulletIndex, e.target.value)}
                        maxLength={100}
                        className="flex-1"
                      />
                      <Button
                        danger
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => removeBulletPoint(index, bulletIndex)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>

        <Button
          onClick={addSpecification}
          className="mt-4 flex items-center gap-2"
          icon={<PlusOutlined />}
        >
          Add Specification
        </Button>
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#5207CD] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update Specifications" : "Create Specifications"}
      </Button>
    </div>
  );
};

export default JobSpecificationsForm;
