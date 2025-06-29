import React, { useState } from "react";
import { Input, Button, message, Popconfirm } from "antd";
import ImageUploader from "../../../../../pages/LandingpageEdit/ImageUploader";  // Assuming this path is correct


const TextBoxForm = ({ initialData, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    textBoxTitle: initialData?.textBoxTitle || "Discover our company",
    textBoxText: initialData?.textBoxText || "We are proud and loud we put our employee first.",
    textBoxDescription: initialData?.textBoxDescription || "With the Core App development team we are on our way to become the world's user-friendliest consumer app for job connections with employers. We are just missing one person. You!",
    textBoxImage: initialData?.textBoxImage || "/dhwise-images/placeholder.png",
  });

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  // Handle save
  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Text Box saved successfully");
    } catch (error) {
      message.error("Failed to save Text Box");
      console.error("Error saving Text Box:", error);
    }
  };

  console.log('formData_textBoxImage', formData);

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Title */}
      <div className="flex justify-between items-center">
        <p>Title</p>
        <p>{formData.textBoxTitle.length}/40</p>
      </div>
      <Input
        value={formData.textBoxTitle}
        onChange={(e) => handleChange("textBoxTitle", e.target.value)}
        maxLength={40}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Text */}
      <div className="flex justify-between items-center">
        <p>Text</p>
        <p>{formData.textBoxText.length}/120</p>
      </div>
      <Input
        value={formData.textBoxText}
        onChange={(e) => handleChange("textBoxText", e.target.value)}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.textBoxDescription.length}/400</p>
      </div>
      <Input.TextArea
        value={formData.textBoxDescription}
        onChange={(e) => handleChange("textBoxDescription", e.target.value)}
        rows={3}
        maxLength={400}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Image Upload */}
      <div className="mt-4">
        <ImageUploader
          defaultImage={formData.textBoxImage}
          onImageUpload={(url)=>handleChange("textBoxImage", url)}
        />
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: SVG, PNG, JPG or GIF (max. 800x400px)
        </p>

        {/* Display uploaded image preview */}
        {/* {formData.textBoxImage && formData.textBoxImage !== "/dhwise-images/placeholder.png" && (
          <div className="mt-2">
            <img
              src={formData.textBoxImage}
              alt="Uploaded Preview"
              className="w-32 h-32 object-cover rounded"
            />
            <Popconfirm
              title="Delete this image?"
              onConfirm={() => handleChange("textBoxImage", "/dhwise-images/placeholder.png")}
              okText="Yes"
              cancelText="No"
            >
              <Popconfirm
                title="Delete this image?"
                onConfirm={() => handleChange("textBoxImage", "/dhwise-images/placeholder.png")}
                okText="Yes"
                cancelText="No"
              >
                <CloseOutlined className="text-red-500 hover:text-red-700 cursor-pointer mt-2" />
              </Popconfirm>
            </Popconfirm>
          </div>
        )} */}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD]"
      >
        {initialData ? "Update Text Box" : "Create Text Box"}
      </Button>
    </div>
  );
};

export default TextBoxForm;
