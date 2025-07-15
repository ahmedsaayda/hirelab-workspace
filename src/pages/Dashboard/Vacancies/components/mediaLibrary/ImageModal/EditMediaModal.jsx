import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SmartTags } from '../components/smart-tags.jsx';

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

  // Update state when modal opens or initialValues change
  useEffect(() => {
    if (visible && initialValues) {
      setTitle(initialValues?.fileName || '');
      setDescription(initialValues?.description || '');
      setTags(initialValues?.tags || []);
    }
  }, [visible, initialValues]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle('');
      setDescription('');
      setTags([]);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      message.error('Please enter a title');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        title: title,
        description: description,
        tags: tags.map(tag => typeof tag === 'string' ? { text: tag, type: "manual" } : tag),
      });
    } catch (error) {
      message.error('Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Edit ${mediaItem?.type === 'video' ? 'Video' : 'Image'}`}
      open={visible}
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
      width={600}
    >
      {mediaItem && (
        <>
          <div className="relative mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-video">
            {mediaItem.type === "video" ? (
              <video className="object-contain w-full h-full" controls>
                <source src={mediaItem.thumbnail} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={mediaItem.thumbnail} 
                alt={mediaItem.title} 
                className="object-contain w-full h-full" 
              />
            )}
          </div>

          <div className="pb-4">
            <label className="text-sm text-gray-600 pb-1">File Name</label>
            <Input 
              className="rounded-lg text-primary border border-gray-300" 
              value={title}
              maxLength={40}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="pb-4">
            <div className="flex items-center gap-1 mb-1">
              <label className="text-sm text-gray-600 pe-1">Meta Description</label>
              <Tooltip title="Add a short summary for SEO purposes (max 200 characters)">
                <QuestionCircleOutlined className="text-gray-400 cursor-pointer" />
              </Tooltip>
            </div>
            <Input.TextArea
              value={description}
              maxLength={200}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="">
            <div className="flex items-center gap-1 mb-1">
              <label className="text-sm text-gray-600">Add Smart Tags</label>
              <Tooltip title="Add Relevant Tags to Enhance Searchability">
                <QuestionCircleOutlined className="text-gray-400" />
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
        </>
      )}
    </Modal>
  );
};

export default EditMediaModal; 