// hirelab-frontend\src\components\mediaLibrary\ImageModal\ImageSelectionModal.jsx
import React, { useEffect, useState } from "react";
import { message, Progress, Tabs } from "antd";
import Modal from "../Modal/Modal.jsx";
import SidebarOption from "./SidebarOption.jsx";
import DropZone from "./DropZone.jsx";
import { Film, Upload as UploadIcon, Link, Image, Palette } from "lucide-react";
import UploadService from "../../../../../../services/UploadService.js";
import StockImageBrowser from "./StockImageBrowse.jsx";
import CrudService from "../../../../../../services/CrudService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../redux/auth/selectors.js";
import { Img } from "../../../../../../dhwise-components/index.jsx";
import { MediaCard } from "../components/media-card.jsx";
import { Skeleton ,Box } from '@mui/material';
import HeroForm from "../components/modals/sectionTemplateForms/hero-form.jsx";
import TestimonialsForm from "../components/modals/sectionTemplateForms/testimonials-form.jsx";



const { TabPane } = Tabs;

const ImageSelectionModal = ({
  isOpen,
  onClose,
  onImageSelected,
  existingFiles = [],
  multiple,
  maxFiles,
  accept = "image/*",
}) => {
  const user = useSelector(selectUser);
  const [activeOption, setActiveOption] = useState("upload");
  const [files, setFiles] = useState(() => (existingFiles || []).map((url) => ({ url })));
  const [isUploading, setIsUploading] = useState(false);
  const [addingFromStockImage , setAddingFromStockImage] = useState(false); 
  const [recentMedia, setRecentMedia] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [isEditModalOpenForSection, setIsEditModalOpenForSection] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const handleFilesSelected = async (newFiles) => {
    if (maxFiles && files.length + newFiles.length > maxFiles) {
      message.error(`You can only upload up to ${maxFiles} files`);
      return;
    }
  
    const newEntries = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      progress: 0,
    }));
  
    setFiles((prev) => {
      const newFilesArr = multiple ? [...prev, ...newEntries] : [newEntries[0]];
      // Remove duplicates by url
      const unique = Array.from(new Map(newFilesArr.map(f => [f.url, f])).values());
      return unique;
    });
    setIsUploading(true);
  
    try {
      const uploadPromises = newEntries.map(async (entry) => {
        if (!entry.file) return null;
  
        const result = await UploadService.upload(entry.file, (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.url === entry.url ? { ...f, progress } : f
            )
          );
        });
        // @ts-ignore
        const cloudinaryData = result.data;
        if (!cloudinaryData?.secure_url) throw new Error("Invalid response");
  
        const mediaData = {
          user_id: user?._id,
          title: cloudinaryData.original_filename?.slice(0, 40) || "Untitled",
          description: cloudinaryData.original_filename || "",
          type: cloudinaryData.resource_type === "image" ? "image" : "video",
          thumbnail: cloudinaryData.secure_url,
          resolution: `${cloudinaryData.width || 0}x${cloudinaryData.height || 0}`,
          size: formatFileSize(cloudinaryData.bytes || 0),
          duration: cloudinaryData.duration
            ? `${Math.round(cloudinaryData.duration)}s`
            : "",
          tags: [],
        };
  
        await CrudService.create("MediaLibrary", mediaData);
  
        return {
          originalUrl: entry.url,
          uploadedUrl: cloudinaryData.secure_url,
        };
      });
  
      const results = (await Promise.all(uploadPromises)).filter(Boolean);
  
      setFiles((prev) =>
        prev.map((f) => {
          const match = results.find((r) => r.originalUrl === f.url);
          return match ? { ...f, url: match.uploadedUrl, progress: 100 } : f;
        })
      );
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.filter((f) => !newEntries.some((ne) => ne.url === f.url))
      );
      message.error("Upload failed");
    } finally {
      setIsUploading(false);
      // Refresh recent media after upload
      fetchRecent();
    }
  };
  
  




  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDone = () => {
    const urls = files.map((f) => f.url).filter((u) => u.startsWith("http"));
    onImageSelected(urls);
    onClose();
  };

  useEffect(() => {
    if(addingFromStockImage){
      const urls = files.map((f) => f.url).filter((u) => u.startsWith("http"));
      onImageSelected(urls);
      onClose();
      setAddingFromStockImage(false);
    }
  }, [files])

  // Extract fetchRecent to a function so it can be called after upload
  const fetchRecent = async () => {
    setRecentLoading(true);
    try {
      const filters = { user_id: user._id };
      // Only show videos if accept is video only
      if (accept?.includes('video') && !accept?.includes('image')) {
        filters.type = 'video';
      } else if (accept?.includes('image') && !accept?.includes('video')) {
        filters.type = 'image';
      }
      // Limit to 9 for videos
      const limit = (filters.type === 'video') ? 9 : 18;
      const result = await CrudService.search("MediaLibrary", limit, 1, {
        text: "",
        filters,
        sort: { createdAt: -1 },
        populate: undefined,
        populate2: undefined,
      });
      setRecentMedia(result?.data?.items || []);
    } catch (err) {
      setRecentMedia([]);
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !user?._id) return;
    fetchRecent();
  }, [isOpen, user?._id, accept]);

  // Filtered media for tabs
  const filteredMedia = selectedTab === "all"
    ? recentMedia
    : selectedTab === "images"
      ? recentMedia.filter((m) => m.type === "image")
      : recentMedia.filter((m) => m.type === "video");

  // Add recent upload to files
  const handleSelectRecent = (media) => {
    if (files.some(f => f.url === media.thumbnail)) return;
    if (maxFiles && files.length >= maxFiles) {
      message.error(`You can only upload up to ${maxFiles} files`);
      return;
    }
    setFiles(prev => {
      const newFilesArr = multiple ? [...prev, { url: media.thumbnail }] : [{ url: media.thumbnail }];
      // Remove duplicates by url
      const unique = Array.from(new Map(newFilesArr.map(f => [f.url, f])).values());
      return unique;
    });
  };

  console.log("filesfilesfilesfiles", files);
  console.log("existingFiles", existingFiles);


  const handleRemoveFile = (url) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.url !== url));
  };
  

  const renderPreview = (file) => (
    <div key={file.url} className="flex items-center p-2 border rounded mb-2 bg-white">
      <img
        src={file.url}
        alt="Preview"
        className="w-10 h-10 sm:w-12 sm:h-12 object-cover mr-2 sm:mr-3 rounded"
        onError={(e) => {
          (e.target).style.display = "none";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm truncate">
          {file.url.split("/").pop()?.split("?")[0]}
        </p>
        {typeof file.progress === "number" && (
          <Progress
            percent={file.progress}
            status={file.progress === 100 ? "success" : "active"}
            size="small"
          />
        )}
      </div>
      <button
        type="button"
        title="Remove file"
        onClick={() => handleRemoveFile(file.url)}
        className="p-1 sm:p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
      >
        <Img
          src="/images2/img_trash_01.svg"
          alt="trash-01"
          className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px] cursor-pointer"
        />
      </button>
    </div>
  );

  // Handler for Edit
  const handleEdit = (id) => {
    const media = recentMedia.find((m) => m._id === id);
    if (media) {
      setEditingMedia(media);
      setIsEditModalOpenForSection(true);
    }
  };

  // Handler for Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media item? This action cannot be undone.")) return;
    try {
      await CrudService.delete("MediaLibrary", id);
      setRecentMedia((prev) => prev.filter((m) => m._id !== id));
      message.success("Media item deleted successfully!");
    } catch (error) {
      message.error("Failed to delete media item. Please try again.");
    }
  };

  // Handler for Rename
  const handleRename = (id) => {
    const media = recentMedia.find((m) => m._id === id);
    if (media) {
      setEditingMedia(media);
      setRenameValue(media.title || "");
      setIsRenaming(true);
    }
  };

  const handleRenameSave = async () => {
    if (!renameValue.trim() || !editingMedia) return;
    try {
      await CrudService.update("MediaLibrary", editingMedia._id, { title: renameValue });
      setRecentMedia((prev) => prev.map((m) => m._id === editingMedia._id ? { ...m, title: renameValue } : m));
      setIsRenaming(false);
      setEditingMedia(null);
      message.success("Media renamed successfully");
    } catch (error) {
      message.error("Failed to rename media. Please try again.");
    }
  };

  // Handler for Edit Save (for section-template types)
  const handleEditSave = async (updatedData) => {
    if (!editingMedia) return;
    try {
      await CrudService.update("MediaLibrary", editingMedia._id, updatedData);
      setRecentMedia((prev) => prev.map((m) => m._id === editingMedia._id ? { ...m, ...updatedData } : m));
      setIsEditModalOpenForSection(false);
      setEditingMedia(null);
      message.success("Media updated successfully");
    } catch (error) {
      message.error("Failed to update media. Please try again.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Media Library2">
        {/* Responsive layout */}
        <div className="flex flex-col lg:flex-row h-full w-full">
          {/* Sidebar - horizontal on mobile, vertical on desktop */}
          <div className="p-2 lg:p-4 w-full lg:w-48 border-b lg:border-b-0 lg:border-r border-gray-100">
            <div className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
            {/* <SidebarOption
              icon={<Film size={20} className="text-red-500" />}
              label="Generate"
              active={activeOption === "generate"}
              onClick={() => setActiveOption("generate")}
            /> */}
              <SidebarOption
                icon={<UploadIcon size={20} className="text-blue-500" />}
                label="Upload"
                active={activeOption === "upload"}
                onClick={() => setActiveOption("upload")}
              />
              <SidebarOption
                icon={<Link size={20} className="text-yellow-500" />}
                label="Link"
                active={activeOption === "link"}
                onClick={() => setActiveOption("link")}
              />
              <SidebarOption
                icon={<Image size={20} className="text-purple-500" />}
                label="Library"
                active={activeOption === "stock"}
                onClick={() => setActiveOption("stock")}
              />
              {/* <SidebarOption
                icon={<Palette size={20} className="text-pink-500" />}
                label="Brand Kits"
                active={activeOption === "brand"}
                onClick={() => setActiveOption("brand")}
              /> */}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-2 lg:p-4">
            {activeOption === "upload" && (
              <div className="flex flex-col lg:flex-row w-full h-full min-h-[400px] lg:min-h-[500px] gap-4">
                {/* Left: DropZone and controls */}
                <div className="w-full lg:w-[35%] flex flex-col border-2 border-dashed border-gray-300 bg-gray-50 min-h-[300px] lg:h-auto p-2 lg:p-4 rounded-lg">
                  <DropZone
                    onFilesSelected={handleFilesSelected}
                    multiple={multiple}
                    accept={accept}
                  />
                  <div className="flex-1 w-full mt-4 flex flex-col">
                    <h4 className="text-sm font-medium mb-2">Selected Files</h4>
                    <div className="flex-1 overflow-y-auto max-h-[250px]">
                      {files.map(renderPreview)}
                    </div>
                  </div>
                  <button
                    onClick={handleDone}
                    disabled={isUploading}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 w-full lg:w-auto flex-shrink-0"
                  >
                    {isUploading ? "Uploading..." : "Done"}
                  </button>
                </div>
                {/* Right: Recent uploads */}
                <div className="w-full lg:w-[65%] min-h-[300px] lg:h-auto flex flex-col items-center justify-start overflow-y-auto">
                  <h4 className="text-sm font-semibold mb-2">Recent Uploads</h4>
                  <Tabs activeKey={selectedTab} onChange={setSelectedTab} type="line" className="w-full mb-2">
                    <TabPane tab="All" key="all" />
                    <TabPane tab="Images" key="images" />
                    <TabPane tab="Videos" key="videos" />
                  </Tabs>
                  {recentLoading ? (
                    <div className="text-gray-500 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((index) => (
                          <div key={index} className="w-full">
                            <Skeleton variant="rectangular" width="100%" height={180} />
                            <Box sx={{ pt: 1 }}>
                              <Skeleton />
                              <Skeleton width="60%" />
                            </Box>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="text-gray-400 py-8">No recent uploads</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
                      {filteredMedia.map((media) => (
                        <div key={media._id} className="cursor-pointer" onClick={() => handleSelectRecent(media)}>
                          <MediaCard
                            _id={media._id}
                            title={media.title}
                            description={media.description}
                            tags={media.tags || []}
                            thumbnail={media.thumbnail}
                            type={media.type}
                            duration={media.duration}
                            resolution={media.resolution}
                            size={media.size}
                            selected={files.some(f => f.url === media.thumbnail)}
                            onSelect={() => handleSelectRecent(media)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRename={handleRename}
                            templateData={media.templateData}
                            hideDescription={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeOption === "generate" && (
              <div className="py-16 text-center text-gray-500">
                AI Generation coming soon
              </div>
            )}
            {activeOption === "link" && (
              <div className="flex flex-col space-y-4 max-w-md mx-auto p-4">
                <h4 className="text-lg font-medium mb-4">Add Image from URL</h4>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto">
                  Add Image
                </button>
              </div>
            )}
            {/* {activeOption === "stock" && (
              ImageBrowser
              onSelect={(urls) =>{
                console.log(urls,"urlsssssssssssssssssss");
                setFiles((prev) => [...prev, ...urls.map((u) => ({ url: u }))])}
                }
                maxFiles={maxFiles}
                currentCount={files.length}
                // getSelectedMedia={getSelectedMedia}
                // activeSection={activeSection}
                // mediaLimits={mediaLimits}
                // landingPageData={landingPageData}
              />
            )} */}
              {activeOption === "stock" && (
                <div className="w-full h-full">
                  <StockImageBrowser
                    onSelect={(urls) => {
                      setAddingFromStockImage(false);
                      setFiles((prev) => {
                        const newFiles = urls.map(url => ({ url }));
                        return multiple ? [...prev, ...newFiles] : newFiles;
                      });
                      setAddingFromStockImage(true);
                    }}
                    maxFiles={maxFiles}
                    currentCount={files.length}
                  />
                </div>
              )}
            {activeOption === "brand" && (
              <div className="py-16 text-center text-gray-500">
                Brand Kits coming soon
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit Modal for section-template types */}
      {editingMedia && isEditModalOpenForSection && editingMedia.templateData && (
        <Modal
          isOpen={isEditModalOpenForSection}
          onClose={() => { setIsEditModalOpenForSection(false); setEditingMedia(null); }}
          title={`Edit ${editingMedia.title}`}
        >
          {editingMedia.templateData.type === "hero" && (
            <HeroForm initialData={editingMedia.templateData} onSave={handleEditSave} isSaving={false} />
          )}
          {editingMedia.templateData.type === "testimonial" && (
            <TestimonialsForm initialData={editingMedia.templateData} onSave={handleEditSave} isSaving={false} />
          )}
        </Modal>
      )}

      {/* Rename Modal */}
      {isRenaming && (
        <Modal isOpen={isRenaming} onClose={() => { setIsRenaming(false); setEditingMedia(null); }} title="Rename Media">
          <input
            type="text"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter new title"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsRenaming(false); setEditingMedia(null); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={handleRenameSave} className="px-4 py-2 bg-blue-500 text-white rounded">Rename</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ImageSelectionModal;
