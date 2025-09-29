import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { SmartTags } from "../smart-tags.jsx";
import CrudService from "../../../../../../../services/CrudService.js";

export function BulkEditModal({ 
  open, 
  onCancel, 
  selectedItems = [], 
  mediaData = [], 
  onSave 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize edited data when modal opens
  useEffect(() => {
    if (open && selectedItems.length > 0) {
      const selectedMediaItems = selectedItems.map(id => {
        const item = mediaData.find(media => media._id === id);
        return item ? {
          _id: item._id,
          title: item.title || '',
          description: item.description || '',
          tags: item.tags || [],
          thumbnail: item.thumbnail,
          type: item.type,
          size: item.size,
          resolution: item.resolution,
          duration: item.duration
        } : null;
      }).filter(Boolean);
      
      setEditedData(selectedMediaItems);
      setCurrentIndex(0);
    }
  }, [open, selectedItems, mediaData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setEditedData([]);
      setCurrentIndex(0);
      setLoading(false);
    }
  }, [open]);

  const currentItem = editedData[currentIndex];

  const updateCurrentItem = (field, value) => {
    setEditedData(prev => prev.map((item, index) => 
      index === currentIndex 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update all items
      const updatePromises = editedData.map(item => {
        const { _id, thumbnail, type, size, resolution, duration, ...updateData } = item;
        return CrudService.update("MediaLibrary", _id, updateData);
      });
      
      await Promise.all(updatePromises);
      
      message.success(`${editedData.length} items updated successfully!`);
      onSave();
      onCancel();
    } catch (error) {
      console.error("Error updating items:", error);
      message.error("Failed to update some items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData([]);
    setCurrentIndex(0);
    onCancel();
  };

  if (!currentItem) return null;

  return (
    <Modal
      title={<div className="text-center w-full">Bulk Edit Media</div>}
      open={open}
      onCancel={handleCancel}
      footer={[
        <div className="flex flex-col gap-2 sm:flex-row" key="footer">
          <Button className="w-full border border-[#D0D5DD] text-[#344054]" onClick={handleCancel} type="text">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="w-full custom-button"
          >
            Save All Changes
          </Button>
        </div>
      ]}
      width={900}
      centered
    >
      <div className="flex gap-6">
        {/* Left side - Media with navigation */}
        <div className="flex-1">
          {/* Navigation - Full width */}
          {editedData.length > 1 && (
            <div className="flex items-center justify-between rounded-lg gap-2 mb-4 w-full">
              <Button 
                icon={<LeftOutlined />} 
                type="text" 
                onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))} 
                disabled={currentIndex === 0} 
              />
              <div className="flex-1 px-4 py-1 text-center text-white rounded-full bg-[#EFF8FF]">
                <span className="text-sm text-blue-700_01">
                  {currentIndex + 1}/{editedData.length}
                </span>
              </div>
              <Button 
                icon={<RightOutlined />} 
                type="text" 
                onClick={() => setCurrentIndex(prev => Math.min(prev + 1, editedData.length - 1))} 
                disabled={currentIndex === editedData.length - 1} 
              />
            </div>
          )}
          
          <div className="relative mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-video">
            {currentItem.type === "video" ? (
              <video className="object-contain w-full h-full" controls>
                <source src={currentItem.thumbnail} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={currentItem.thumbnail} 
                alt={currentItem.title} 
                className="object-contain w-full h-full" 
              />
            )}
          </div>
          
          {/* Media info */}
          <div className="text-xs text-gray-500 space-y-1">
            {currentItem.size && <p>Size: {currentItem.size}</p>}
            {currentItem.resolution && <p>Resolution: {currentItem.resolution}</p>}
            {currentItem.duration && <p>Duration: {currentItem.duration}</p>}
          </div>
        </div>

        {/* Right side - Form fields */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              File Name
              <span className="text-gray-400 ml-1">{currentItem.title.length}/40</span>
            </label>
            <Input 
              placeholder="Enter file name"
              className="rounded-lg text-primary border border-gray-300" 
              value={currentItem.title}
              maxLength={40}
              onChange={(e) => updateCurrentItem('title', e.target.value)}
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
              <span className="text-gray-400 ml-auto">{currentItem.description.length}/200</span>
            </div>
            <Input.TextArea
              placeholder="Enter description"
              value={currentItem.description}
              maxLength={200}
              rows={4}
              onChange={(e) => updateCurrentItem('description', e.target.value)}
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
              value={currentItem.tags}
              onChange={(newTags) => {
                const formattedTags = newTags.map(tag =>
                  typeof tag === 'string' ? { text: tag, type: "manual" } : tag
                );
                updateCurrentItem('tags', formattedTags);
              }}
            />
          </div>

          {/* Navigation shortcuts */}
          {editedData.length > 1 && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Quick Navigation:</p>
              <div className="flex gap-2 flex-wrap">
                {editedData.map((item, index) => (
                  <Button
                    key={item._id}
                    size="small"
                    type={index === currentIndex ? "primary" : "default"}
                    onClick={() => setCurrentIndex(index)}
                    className="min-w-[40px]"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default BulkEditModal;
