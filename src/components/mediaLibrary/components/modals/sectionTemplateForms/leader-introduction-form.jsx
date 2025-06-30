import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
// import ImageUploader from "..."; const ImageUploader = () => <div>Image Uploader Placeholder</div>;
import { message } from 'antd';



const leaderIntroductionForm = ({ initialData, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    leaderIntroductionTitle: initialData?.leaderIntroductionTitle || "",
    leaderIntroductionDescription: initialData?.leaderIntroductionDescription || "",
    leaderIntroductionFullname: initialData?.leaderIntroductionFullname || "",
    leaderIntroductionJobTitle: initialData?.leaderIntroductionJobTitle || "",
    leaderIntroductionAvatar: initialData?.leaderIntroductionAvatar || "",
    type: 'leaderIntro'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Leader introduction saved successfully");
    } catch (error) {
      message.error("Failed to save leader introduction");
      console.error("Error saving leader intro:", error);
    }
  };

  console.log("leaderIntroductionForm", formData)

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Full Name */}
      <div className="flex justify-between items-center">
        <p>Full Name</p>
        <p>{formData.leaderIntroductionFullname.length}/40</p>
      </div>
      <Input
        placeholder="John Doe"
        value={formData.leaderIntroductionFullname}
        onChange={(e) => handleChange("leaderIntroductionFullname", e.target.value)}
        maxLength={40}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Job Title */}
      <div className="flex justify-between items-center">
        <p>Job Title</p>
        <p>{formData.leaderIntroductionJobTitle.length}/40</p>
      </div>
      <Input
        placeholder="CEO & Founder"
        value={formData.leaderIntroductionJobTitle}
        onChange={(e) => handleChange("leaderIntroductionJobTitle", e.target.value)}
        maxLength={40}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.leaderIntroductionTitle.length}/60</p>
      </div>
      <Input
        placeholder="Meet Our Leadership"
        value={formData.leaderIntroductionTitle}
        onChange={(e) => handleChange("leaderIntroductionTitle", e.target.value)}
        maxLength={60}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.leaderIntroductionDescription.length}/300</p>
      </div>
      <Input.TextArea
        placeholder="Write leadership introduction here..."
        value={formData.leaderIntroductionDescription}
        onChange={(e) => handleChange("leaderIntroductionDescription", e.target.value)}
        rows={4}
        maxLength={300}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Avatar Upload */}
      <div className="mt-4">
        <ImageUploader
          defaultImage={formData.leaderIntroductionAvatar}
          onImageUpload={(url) => handleChange("leaderIntroductionAvatar", url)}
        //   title="Upload Leader Photo"
        
        />
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:border hover:shadow-sm border-none"
      >
        {initialData ? "Update Introduction" : "Create Introduction"}
      </Button>
    </div>
  );
};

export default leaderIntroductionForm;
