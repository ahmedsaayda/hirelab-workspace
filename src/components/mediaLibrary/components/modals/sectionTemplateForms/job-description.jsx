import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../redux/auth/selectors.js";
import { message } from 'antd';



const JobDescriptionForm = ({ initialData, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    jobDescriptionTitle: initialData?.jobDescriptionTitle || "Job Description",
    jobDescriptionSubheader: initialData?.jobDescriptionSubheader || "",
    jobDescription: initialData?.jobDescription || "",
    type: 'jobDescription'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Job description saved successfully");
    } catch (error) {
      message.error("Failed to save job description");
      console.error("Error saving job description:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.jobDescriptionTitle.length}/60</p>
      </div>
      <Input
        placeholder="Job Description"
        value={formData.jobDescriptionTitle}
        onChange={(e) => handleChange("jobDescriptionTitle", e.target.value)}
        maxLength={60}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Subheader */}
      <div className="flex justify-between items-center">
        <p>Subheader</p>
        <p>{formData.jobDescriptionSubheader.length}/120</p>
      </div>
      <Input
        placeholder="About the position"
        value={formData.jobDescriptionSubheader}
        onChange={(e) => handleChange("jobDescriptionSubheader", e.target.value)}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Description */}
      <div className="flex justify-between items-center">
        <p>Job Description</p>
        <p>{formData.jobDescription.length}/2000</p>
      </div>
      <Input.TextArea
        placeholder="Write detailed job description here..."
        value={formData.jobDescription}
        onChange={(e) => handleChange("jobDescription", e.target.value)}
        rows={8}
        maxLength={2000}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:border hover:shadow-sm border-none"
      >
        {initialData ? "Update Description" : "Create Description"}
      </Button>
    </div>
  );
};

export default JobDescriptionForm;
