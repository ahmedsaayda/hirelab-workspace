import React, { useEffect, useState } from "react";
import { Modal, Input, Upload, Button, message , Tooltip} from "antd";
import { PlusOutlined, QuestionCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { SmartTags } from "../smart-tags.jsx";
import CrudService from "../../../../services/CrudService.js";
import CloudinaryUpload from "../../../CloudinaryUpload.js";
import { selectUser } from "../../../../redux/auth/selectors.js";
import { useSelector } from "react-redux";
import { Divide } from "lucide-react";


export function AddMediaModal({
  open,
  onCancel,
  onAdd,
  multiple = false,
  setCloseMediaModalOpenSectionTemplate,
}) {
  const user = useSelector(selectUser);
  const [fileList, setFileList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaData, setMediaData] = useState([]);

    // Reset state when modal is closed
    useEffect(() => {
      if (!open) {
        resetState();
      }
    }, [open]);
  
    // Format file size (bytes to KB/MB)
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

  const updateMediaMetadata = (index, key, value) => {
    setMediaData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [key]: value };
      return newData;
    });
  };

  const handleAdd = async () => {
    if (fileList.length === 0) {
      message.error("Please upload at least one file");
      return;
    }
  
    try {
      // Wait for all media files to be saved
      await Promise.all(
        mediaData.map(async (data) => {
          console.log("Saving media data:", data);
          const response = await CrudService.create("MediaLibrary", data);
          console.log("Saved media data:", response.data);
        })
      );
  
      // Call onAdd only after all media files are saved
      onAdd(fileList);
      resetState();
    } catch (error) {
      console.error("Failed to save media", error);
      message.error("Error saving media files.");
    }
  };
  

  const resetState = () => {
    setFileList([]);
    setCurrentIndex(0);
    setMediaData([]);
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  const currentFile = fileList[currentIndex];
  const currentMedia = mediaData[currentIndex] || {
    title: "",
    description: "",
    tags: [],
    thumbnail: "",
    type: "image",
    duration: "",
    resolution: "",
    size: ""
  };

  console.log('mediaData', mediaData);
  return (
    <Modal
      title={multiple ? "Add video/image" : "Add singular video/image"}
      open={open}
      onCancel={handleCancel}
      footer={[
        <div className="flex flex-col gap-2 sm:flex-row" key="footer">
          <Button className="w-full border border-[#D0D5DD] text-[#344054]" onClick={handleCancel} type="text">Cancel</Button>
          <Button className="w-full custom-button" type="primary" onClick={handleAdd}>Add</Button>
        </div>,
      ]}
      width={600}
      // style={{ height: '80vh',width:"100vw", maxHeight: '90vh' }} // Control outer modal
      // bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(80vh - 108px)' }} // Scroll inside body only
    >
      {fileList.length > 0 && (
      // {true &&(
        <>
          <div className="flex items-center justify-between rounded-lg  gap-2 mb-4">
            <Button icon={<LeftOutlined />} type="text" onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))} disabled={currentIndex === 0} />
            <div className="w-full px-4 py-1 text-center text-white rounded-full bg-[#EFF8FF]">
              <span className="text-sm text-blue-700_01">{currentIndex + 1}/{fileList.length}</span>
            </div>
            <Button icon={<RightOutlined />} type="text" onClick={() => setCurrentIndex(prev => Math.min(prev + 1, fileList.length - 1))} disabled={currentIndex === fileList.length - 1} />
          </div>
          <div className="relative mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-video">
            {currentFile?.type?.startsWith("image/") && <img src={currentFile.thumbUrl || currentFile.url} alt={currentFile.name} className="object-contain w-full h-full" />}
            {currentFile?.type?.startsWith("video/") && <video className="object-contain w-full h-full" controls><source src={currentFile.url} type={currentFile.type} />Your browser does not support the video tag.</video>}
          </div>
          <div className="pb-4">
            <label className="text-sm text-gray-600 pb-1">File Name</label>
            <Input className="rounded-lg text-primary border border-gray-300" value={currentMedia.title} maxLength={40} onChange={(e) => updateMediaMetadata(currentIndex, "title", e.target.value)} />
          </div>  
          <div className="pb-4">
            <div className="flex items-center gap-1 mb-1">
              <label className="text-sm text-gray-600 pe-1">Meta Description </label>
              <Tooltip title="Add a short summary for SEO purposes (max 200 characters)">
                <QuestionCircleOutlined className="text-gray-400 cursor-pointer" />
              </Tooltip>
            </div>
            <Input.TextArea value={currentMedia.description} maxLength={200} rows={4} onChange={(e) => updateMediaMetadata(currentIndex, "description", e.target.value)} />
          </div>
          <div className="">
            <div className="flex items-center gap-1 mb-1">
              <label className="text-sm text-gray-600">Add Smart Tags</label>
              <Tooltip title="Add Relevant Tags to Enhance Searchability">
                <QuestionCircleOutlined className="text-gray-400" />
              </Tooltip>
            </div>
            
            {/* <SmartTags
              suggestions={["New York", "Finance", "Controller"]}
              onChange={(tags) => updateMediaMetadata(currentIndex, "tags", tags)}
            /> */}

          <SmartTags
            suggestions={["New York", "Finance", "Controller"]}
            onChange={(tags) => {
              const formattedTags = tags.map(tag =>
                typeof tag === 'string' ? { text: tag, type: "manual" } : tag
              );
              updateMediaMetadata(currentIndex, "tags", formattedTags);
            }}
          />
          </div>
        </>
      )}

    <div>
      <CloudinaryUpload
         multiple={multiple}
         listenToParentHeight={true}
         MediaExistReduceContainer={fileList.length === 0 ? true : false}
        onChange={(data) => {
          console.log("dataCloudinaryUpload", data)
          const newFile = {
            uid: Date.now().toString(),
            name: data.original_filename,
            url: data.secure_url,
            thumbUrl: data.secure_url,
            type: data.resource_type === "video" ? "video/mp4" : `image/${data.format}`,
          };

          const resolution = `${data.width} X ${data.height}`;
          const size = data.bytes < 1024
            ? `${data.bytes} B`
            : data.bytes < 1024 * 1024
            ? `${(data.bytes / 1024).toFixed(2)} KB`
            : `${(data.bytes / (1024 * 1024)).toFixed(2)} MB`;

            setFileList(prev => [...prev, newFile]);
            setMediaData(prev => [
              ...prev,
              {
                user_id: user?._id,
                title: data.original_filename.slice(0, 40),
                description: data.original_filename,
                tags: (data.tags || []).map((tag) => ({ text: tag, type: "auto" })),
                thumbnail: data.secure_url,
                type: data.resource_type,
                duration: data.duration ? `${Math.round(data.duration)}s` : "",
                resolution,
                size,
              },
            ]);


        }}

      />
    </div>

      <Button type="link" onClick={() =>{ setCloseMediaModalOpenSectionTemplate(true)}} icon={<PlusOutlined />} className="px-0 text-blue-500 hover:text-blue-600">Click here to create new template sections</Button>
    </Modal>
  );
}

