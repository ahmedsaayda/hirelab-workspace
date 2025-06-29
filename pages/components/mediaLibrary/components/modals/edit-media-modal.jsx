import React, { useEffect, useState } from "react";
import { Modal, Input, Upload, Button } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { SmartTags } from "../smart-tags.jsx";



export function EditMediaModal({
  visible,
  onCancel,
  onSave,
  initialValues,
  mediaItem
}) {
  console.log("555555", mediaItem)

  const [fileName, setFileName] = useState(initialValues?.fileName || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [tags, setTags] = useState(
    initialValues?.tags && Array.isArray(initialValues.tags)
      ? initialValues.tags.map(tag => tag.text || "")
      : []
  );
  const [image, setImage] = useState(initialValues?.image);

  useEffect(() => {
    if (initialValues) {
      setFileName(initialValues.fileName || "");
      setDescription(initialValues.description || "");
      setTags(Array.isArray(initialValues.tags) ? initialValues.tags.map(tag => tag.text || "") : []);
      setImage(initialValues.image);
    }
  }, [initialValues]);

  const handleSave = () => {
    const updatedItem = {
      title: fileName,
      description,
      tags: tags.map(tag => ({ text: tag })),
      image,
    };
    onSave(updatedItem); // Pass the updated item to the parent
  };

  return (
    <Modal
      title="Edit info"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600} 
    >
      <div className="justify-center gap-4">
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <label className="text-sm text-gray-600">File Name</label>
            <span className="text-sm text-gray-400">
              {fileName.length || 0}/40
            </span>
          </div>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}

            maxLength={40}
            className="border border-[#D0D5DD]  rounded-lg"
          />
        </div>

        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-1">
              <label className="text-sm text-gray-600">Meta Description</label>
              <QuestionCircleOutlined className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-400">
              {description.length || 0}/200
            </span>
          </div>
          <Input.TextArea
            value={description}
            maxLength={200}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <label className="text-sm text-gray-600 block">
            Edit Smart Tags
          </label>
          <SmartTags
            defaultValue={tags}
            onChange={setTags}
            suggestions={["New York", "Finance", "Controller"]}
          />
        </div>

        <div className="mt-2">
          <label className="text-sm text-gray-600 mb-1 block">Image</label>
          <Upload.Dragger
            accept="SVG, PNG, JPG, MP4, AVI or GIF"
            showUploadList={false}
            className="bg-gray-50 border-dashed"
          >
            <p className="text-sm text-blue-500">Click to upload</p>
            <p className="text-xs text-gray-500">or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">
              SVG, PNG, JPG, MP4, AVI or GIF
            </p>
          </Upload.Dragger>
        </div>

        <Button
          type="link"
          icon={<PlusOutlined />}
          className="px-0 text-blue-500 hover:text-blue-600 mt-2"
        >
          Click here to create new template sections
        </Button>
      </div>
      <div className="flex gap-3 mt-3">
        <Button
          onClick={onCancel}
          type="text"
          style={{
            border: "1px solid #D0D5DD",
            borderRadius: "6px",
            padding: "0 20px",
            height: "40px",
            // color: "#595959",
            background: "#fff",
            fontWeight: 500, width: "50%",
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          style={{
            borderRadius: "6px",
            padding: "0 20px",
            height: "40px",
            fontWeight: 500,
            background: "#1890ff",
            border: "none", width: "50%",
          }}
        >
          Save changes
        </Button>
      </div>

    </Modal>
  );
}
