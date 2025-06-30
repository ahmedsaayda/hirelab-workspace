import React, { useState } from "react";
import { Input, Button } from "antd";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;
import { message } from 'antd';


const EVPMissionForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const [formData, setFormData] = useState({
    evpMissionTitle: initialData?.evpMissionTitle || "EVP / Mission",
    evpMissionDescription: initialData?.evpMissionDescription || "",
    evpMissionFullname: initialData?.evpMissionFullname || "",
    evpMissionCompanyName: initialData?.evpMissionCompanyName || "",
    evpMissionAvatar: initialData?.evpMissionAvatar || "",
    type: 'evpMission'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("EVP/Mission saved successfully");
    } catch (error) {
      message.error("Failed to save EVP/Mission");
      console.error("Error saving EVP/Mission:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border border-solid border-blue_gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p>Header</p>
          <p>{formData.evpMissionTitle.length}/40</p>
        </div>
        <Input
          value={formData.evpMissionTitle}
          onChange={(e) => handleChange('evpMissionTitle', e.target.value)}
          maxLength={40}
          className="rounded-lg border border-solid border-blue_gray-100"
        />
      </div>

      {/* Body Text Section */}
      <div className="flex flex-col gap-4 border border-solid border-blue_gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p>Body Text</p>
          <p>{formData.evpMissionDescription.length}/300</p>
        </div>
        <Input.TextArea
          value={formData.evpMissionDescription}
          onChange={(e) => handleChange('evpMissionDescription', e.target.value)}
          rows={4}
          maxLength={300}
          className="rounded-lg border border-solid border-blue_gray-100"
        />
      </div>

      {/* Profile Section */}
      <div className="flex flex-col gap-4 border border-solid border-blue_gray-100 rounded-lg p-4">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>Full Name</p>
            <p>{formData.evpMissionFullname.length}/40</p>
          </div>
          <Input
            value={formData.evpMissionFullname}
            onChange={(e) => handleChange('evpMissionFullname', e.target.value)}
            maxLength={40}
            className="rounded-lg border border-solid border-blue_gray-100"
          />
        </div>

        {/* Job Title */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p>Job Title</p>
            <p>{formData.evpMissionCompanyName.length}/40</p>
          </div>
          <Input
            value={formData.evpMissionCompanyName}
            onChange={(e) => handleChange('evpMissionCompanyName', e.target.value)}
            maxLength={40}
            className="rounded-lg border border-solid border-blue_gray-100"
          />
        </div>

        {/* Image Upload */}
        <div className="mt-4">
          <ImageUploader
            defaultImage={formData.evpMissionAvatar}
            onImageUpload={(url) => handleChange('evpMissionAvatar', url)}
            // title="Upload Profile Image"
            // aspectRatio={800/400}
            // maxDimensions={{ width: 800, height: 400 }}
          />
          <p className="text-xs text-gray-500 mt-2">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update EVP/Mission" : "Create EVP/Mission"}
      </Button>
    </div>
  );
};

export default EVPMissionForm;
