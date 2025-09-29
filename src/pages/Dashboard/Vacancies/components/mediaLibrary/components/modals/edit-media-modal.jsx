import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Tooltip, Upload } from 'antd';
import { QuestionCircleOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { SmartTags } from '../smart-tags.jsx';
import axios from 'axios';

const EditMediaModal = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  mediaItem
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);

  // Update state when modal opens or initialValues change
  useEffect(() => {
    if (visible && initialValues) {
      setTitle(initialValues?.fileName || '');
      setDescription(initialValues?.description || '');
      setTags(initialValues?.tags || []);
    }
    if (visible && mediaItem) {
      setCurrentMedia({
        thumbnail: mediaItem.thumbnail,
        type: mediaItem.type,
        title: mediaItem.title,
        size: mediaItem.size,
        resolution: mediaItem.resolution,
        duration: mediaItem.duration
      });
    }
  }, [visible, initialValues, mediaItem]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle('');
      setDescription('');
      setTags([]);
      setCurrentMedia(null);
      setUploading(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      message.error('Please enter a title');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        title: title,
        description: description,
        tags: tags.map(tag => typeof tag === 'string' ? { text: tag, type: "manual" } : tag),
      };

      // Include media data if it was changed
      if (currentMedia && currentMedia.thumbnail !== mediaItem?.thumbnail) {
        updateData.thumbnail = currentMedia.thumbnail;
        updateData.type = currentMedia.type;
        updateData.size = currentMedia.size;
        updateData.resolution = currentMedia.resolution;
        updateData.duration = currentMedia.duration;
      }

      await onSave(updateData);
    } catch (error) {
      message.error('Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    
    if (!cloudinaryCloudName || !cloudinaryPreset) {
      message.error("Uploads are disabled");
      return onError("Cloudinary configuration missing");
    }

    try {
      setUploading(true);
      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryPreset);
      
      const response = await axios.post(cloudinaryUploadUrl, formData);
      
      // Update current media with new upload
      setCurrentMedia({
        thumbnail: response.data.secure_url,
        type: response.data.resource_type,
        size: response.data.bytes < 1024
          ? `${response.data.bytes} B`
          : response.data.bytes < 1024 * 1024
          ? `${(response.data.bytes / 1024).toFixed(2)} KB`
          : `${(response.data.bytes / (1024 * 1024)).toFixed(2)} MB`,
        resolution: `${response.data.width} X ${response.data.height}`,
        duration: response.data.duration ? `${Math.round(response.data.duration)}s` : "",
        title: title
      });
      
      onSuccess(response, file);
      message.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file to Cloudinary", error);
      message.error("Upload failed");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = () => {
    // Reset to original media
    setCurrentMedia({
      thumbnail: mediaItem.thumbnail,
      type: mediaItem.type,
      title: mediaItem.title,
      size: mediaItem.size,
      resolution: mediaItem.resolution,
      duration: mediaItem.duration
    });
  };

  return (
    <Modal
      title={<div className="text-center w-full">{`Edit ${mediaItem?.type === 'video' ? 'Video' : 'Image'}`}</div>}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <div className="flex flex-col gap-2 sm:flex-row" key="footer">
          <Button className="w-full border border-[#D0D5DD] text-[#344054]" onClick={onCancel} type="text">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="w-full custom-button"
          >
            Save Changes
          </Button>
        </div>
      ]}
      width={900}
      centered
    >
      {currentMedia && (
        <div className="flex gap-6">
          {/* Left side - Media */}
          <div className="flex-1">
            <div className="relative mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-video group">
              {currentMedia.type === "video" ? (
                <video className="object-contain w-full h-full" controls>
                  <source src={currentMedia.thumbnail} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={currentMedia.thumbnail} 
                  alt={currentMedia.title} 
                  className="object-contain w-full h-full" 
                />
              )}
              
              {/* Overlay buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Upload
                    customRequest={customRequest}
                    showUploadList={false}
                    accept="image/*,video/*"
                  >
                    <Button 
                      type="primary" 
                      icon={<UploadOutlined />}
                      loading={uploading}
                      className="bg-white text-black border-white hover:bg-gray-100"
                    >
                      Replace
                    </Button>
                  </Upload>
                  <Button 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveMedia}
                    className="bg-red-500 text-white border-red-500 hover:bg-red-600"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                File Name
                <span className="text-gray-400 ml-1">{title.length}/40</span>
              </label>
              <Input 
                placeholder="Enter file name"
                className="rounded-lg text-primary border border-gray-300" 
                value={title}
                maxLength={40}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center gap-1 mb-2">
                <label className="text-sm font-medium text-gray-600">
                  Meta Description
                </label>
                <Tooltip title="Add a short summary for SEO purposes (max 200 characters)">
                  <QuestionCircleOutlined className="text-gray-400 cursor-pointer" />
                </Tooltip>
                <span className="text-gray-400 ml-auto">{description.length}/200</span>
              </div>
              <Input.TextArea
                placeholder="Enter description"
                value={description}
                maxLength={200}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-center gap-1 mb-2">
                <label className="text-sm font-medium text-gray-600">Add Smart Tags</label>
                <Tooltip title="Add Relevant Tags to Enhance Searchability">
                  <QuestionCircleOutlined className="text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <SmartTags
                suggestions={["New York", "Finance", "Controller"]}
                value={tags}
                onChange={(newTags) => {
                  const formattedTags = newTags.map(tag =>
                    typeof tag === 'string' ? { text: tag, type: "manual" } : tag
                  );
                  setTags(formattedTags);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export { EditMediaModal };
export default EditMediaModal;
