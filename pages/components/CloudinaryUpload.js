import { Button, Upload, message } from "antd";
import axios from "axios";
import React, { useState } from "react";

const CloudinaryUpload = ({ onChange, listenToParentHeight, multiple = false, MediaExistReduceContainer }) => {

  const [isDragging, setIsDragging] = useState(false);
  const customRequest = async ({ file, onSuccess, onError }) => {
    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    
    if (!cloudinaryCloudName || !cloudinaryPreset) {
      message.error("Uploads are disabled");
      return onError("Cloudinary configuration missing");
    }

    try {
      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryPreset);
      
      const response = await axios.post(cloudinaryUploadUrl, formData);
      onChange(response.data);
      onSuccess(response, file);
    } catch (error) {
      console.error("Error uploading file to Cloudinary", error);
      message.error("Upload failed");
      onError(error);
    }
  };


  return (
    <div 
      className="flex justify-center items-center w-full m-1"
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        setIsDragging(false);
      }}
    
    >
      <Upload.Dragger 
        customRequest={customRequest}
        multiple={multiple}
        showUploadList={false}
        className="inline-block w-full"
        accept="image/*,video/*"
      >
        <div className={
          `relative py-2 w-full text-center rounded-lg   transition-colors duration-200
            ${(listenToParentHeight && MediaExistReduceContainer)  ? "h-[300px] flex flex-col items-center justify-center" : ""}
            ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-500"}
          `
        }>
        {
          listenToParentHeight &&  (
            <div className="flex items-center justify-center mb-1">
              <div className="flex gap-2">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-300 w-8 h-8 rounded transform rotate-12"></div>
                <div className="bg-gradient-to-br from-purple-500 to-blue-400 w-8 h-8 rounded-full"></div>
                <div className="bg-gradient-to-br from-pink-400 to-orange-300 w-8 h-8 rounded transform -rotate-12"></div>
              </div>
            </div>            
          )
        }

          <p className={` ${listenToParentHeight ? "text-lg": "text-sm"} text-blue-500`}>
            {multiple ? "Click or drag to upload multiple files" : "Click or drag to upload"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            SVG, PNG, JPG, MP4, AVI, or GIF
          </p>
          {/* You may want to ensure this clickable area covers the whole div */}
        </div>
      </Upload.Dragger>
    </div>
  );
};

export default CloudinaryUpload;