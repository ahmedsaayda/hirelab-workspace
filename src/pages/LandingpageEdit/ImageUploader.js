import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import UploadService from "../../services/UploadService.js";
import { Spin, Progress, Modal, Slider } from "antd";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { FaGripVertical } from "react-icons/fa";
import { SlidersHorizontal, Move } from "lucide-react";
import {
  Heading,
  Img,
  Input,
  SelectBox,
  Text,
} from "../Dashboard/Vacancies/components/components/index.jsx";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import ImageSelectionModal from "../Dashboard/Vacancies/components/mediaLibrary/ImageModal/ImageSelectionModal.jsx";
import { message } from "antd";

const ImageUploader = ({
  onImageUpload,
  accept = "image/*",
  defaultImage,
  multiple = false,
  maxFiles = Infinity,
  imageAdjustments = {},
  onImageAdjustmentChange,
  fieldKey,
  isSettingDisabled = false,
  autosave = false,
  type = "all",
  isLogo = false,
  currentSectionLimits = {},
  allowedTabs = ["all", "image", "video", "section-template"]
}) => {
  console.log("multiple", multiple);
  const isVideo = accept.includes("video");
  console.log("defaultImage", defaultImage);
  console.log("type", type);
  // Existing state for single file
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileType, setFileType] = useState("");

  // New state for multiple files
  const [multipleFiles, setMultipleFiles] = useState([]);
  console.log(multipleFiles);
  const [multipleFileTypes, setMultipleFileTypes] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileDetails, setFileDetails] = useState({});
  const [error, setError] = useState(""); // Add error state
  const [fileMetadata, setFileMetadata] = useState({}); // Add this new state
  const [isDragging, setIsDragging] = useState(false); // Add this new state
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [isImageOpen, setIsImageOpen] = useState(false);
  const uploadRef = useRef();

  // Force type based on accept prop
  const mediaType = accept.includes("video") ? "video" : "image";

  // Calculate uploads left
  const uploadsLeft = multiple
    ? maxFiles - multipleFiles.length
    : previewUrl
      ? 0
      : 1;
  const limitReached = uploadsLeft === 0;

  const openModal = () => {
    console.log("Opening ImageUploader modal:");
    console.log("  multiple:", multiple);
    console.log("  multipleFiles:", multipleFiles);
    console.log("  previewUrl:", previewUrl);
    console.log("  existingFiles will be:", multiple ? multipleFiles : previewUrl ? [previewUrl] : []);
    setIsImageOpen(true);
  };
  const closeModal = () => setIsImageOpen(false);

  const handleImageSelected = async (uploadedUrls) => {
    try {
      console.log("Selected URLs:", uploadedUrls);
      if (multiple) {
        if (!maxFiles || maxFiles === 1) {
          // If maxFiles is 1, replace existing files
          setMultipleFiles(uploadedUrls.slice(-1));
          onImageUpload(uploadedUrls.slice(-1));
        } else {
          // Combine and remove duplicates
          const combined = [...multipleFiles, ...uploadedUrls];
          console.log("Combined URLs:", combined);
          const unique = Array.from(new Set(combined));
          if (unique.length > maxFiles) {
            message.error(`You can only upload up to ${maxFiles} files`);
            return;
          }
          setMultipleFiles(unique);
          onImageUpload(unique);
        }
      } else {
        if (uploadedUrls.length > 0) {
          // For single file mode, always replace the existing file
          console.log("Setting single URL:", uploadedUrls[0]);
          setPreviewUrl(uploadedUrls[0]);
          onImageUpload(uploadedUrls[0]);
        }
      }
    } catch (error) {
      console.error("Error handling image selection:", error);
      message.error("Failed to process selected image");
    }
  };

  const handleSingleUpload = async (file) => {
    try {
      setIsUploading(true);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFileType(file.type);

      const result = await UploadService.upload(file, 10); // 10MB limit
      if (result?.data?.secure_url) {
        setPreviewUrl(result.data.secure_url);
        onImageUpload(result.data.secure_url);
        message.success("Logo uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Failed to upload logo. Please try again.");
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUpload = async (files) => {
    try {
      setIsUploading(true);
      const newFiles = Array.from(files);

      if (newFiles.length + multipleFiles.length > maxFiles) {
        message.error(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const previews = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        size: file.size,
      }));

      setMultipleFiles((prev) => [...prev, ...previews]);

      const uploadResults = await Promise.all(
        newFiles.map((file) => UploadService.upload(file, 10))
      );

      const secureUrls = uploadResults
        .filter(result => result?.data?.secure_url)
        .map(res => res.data.secure_url);

      if (secureUrls.length > 0) {
        onImageUpload(secureUrls);
        message.success("Files uploaded successfully");
      } else {
        throw new Error("No files were uploaded successfully");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Failed to upload files. Please try again.");
      setMultipleFiles((prev) =>
        prev.filter((f) => !previews.some((p) => p.url === f.url))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAreaClick = () => {
    if (!isUploading) {
      openModal();
    }
  };

  useEffect(() => {
    console.log("Modal open state:", isImageOpen);
  }, [isImageOpen]);

  const fetchFileSize = async (url = "") => {
    try {
      console.log("fetchFileSize", url);
      const response = await fetch(url, { method: "HEAD" });
      const size = response.headers.get("content-length");
      const fileName = url?.split("/").pop();

      setFileMetadata((prev) => ({
        ...prev,
        [url]: {
          // name: fileName,
          size: formatFileSize(parseInt(size)),
          type: url.includes("video") ? "video/mp4" : "image/jpeg",
        },
      }));
    } catch (error) {
      console.error("Error fetching file size:", error);
    }
  };

  useEffect(() => {
    if (!multiple && defaultImage && defaultImage.trim() !== '') {
      setPreviewUrl(defaultImage);
      fetchFileSize(defaultImage);
    } else if (multiple && Array.isArray(defaultImage)) {
      const validImages = defaultImage.filter(url => url && url.trim() !== '');
      setMultipleFiles(validImages);
      validImages.forEach((url) => fetchFileSize(url));
      setMultipleFileTypes(
        validImages.map((url) => {
          const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
          return isVideo ? "video/mp4" : "image/jpeg";
        })
      );
    }
  }, [defaultImage, multiple]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  console.log("uploadingFiles", uploadingFiles);
  const handleUpload = useCallback(
    async (event) => {
      console.log("handleUpload called");
      if (multiple) {
        handleMultipleUpload(event.target.files);
        return;
      }
      let selectedFile;
      if (event.target.files && event.target.files[0]) {
        selectedFile = event.target.files[0];
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        setFileType(selectedFile.type);

        // Store single file metadata
        setFileMetadata({
          [url]: {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            type: selectedFile.type,
          },
        });
      }

      if (!selectedFile || isUploading) return;

      setIsUploading(true);
      try {
        console.log("upload start");
        const result = await UploadService.upload(selectedFile, 100);
        console.log("upload end", result);
        // Store metadata for the uploaded file
        setFileMetadata({
          [result.data.secure_url]: {
            name: selectedFile.name,
            size: formatFileSize(selectedFile.size),
            type: selectedFile.type,
          },
        });
        setPreviewUrl(result.data.secure_url);
        setFileType(selectedFile.type);
        onImageUpload(result.data.secure_url);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
        uploadRef.current.value = "";
      }
    },
    [isUploading, onImageUpload, multiple]
  );

  const handleDelete = (fileUrl, indexToRemove) => {
    console.log("TM_SELECTED_TEXT", fileUrl, indexToRemove);

    if (multiple) {
      setMultipleFiles((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );

      onImageUpload(
        multipleFiles.filter((_, index) => index !== indexToRemove)
      );
    } else {
      setPreviewUrl("");
      onImageUpload("");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(multipleFiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Reorder file types and metadata to match
    const newFileTypes = Array.from(multipleFileTypes);
    const [reorderedType] = newFileTypes.splice(result.source.index, 1);
    newFileTypes.splice(result.destination.index, 0, reorderedType);

    setMultipleFiles(items);
    setMultipleFileTypes(newFileTypes);
    onImageUpload(items); // Update parent with new order
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    // Validate file types
    const validFiles = files.filter(
      (file) => accept.includes("*") || accept.includes(file.type)
    );

    if (validFiles.length === 0) {
      setError("Invalid file type");
      return;
    }

    if (multiple) {
      handleMultipleUpload(validFiles);
    } else {
      // Create synthetic event for single file upload
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(validFiles[0]);
      const event = {
        target: {
          files: dataTransfer.files,
        },
      };
      handleUpload(event);
    }
  };

  console.log("multipleFileTypes", multipleFileTypes);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSettings, setImageSettings] = useState({
    objectPosition: { x: 50, y: 50 },
    objectFit: "cover",
  });

  const handleSettingsClick = (url) => {
    if (selectedImage === url) {
      setIsSettingsOpen(false);
      setSelectedImage(null);
    } else {
      setSelectedImage(url);
      // Get adjustments for this specific image URL
      const fieldAdjustments = imageAdjustments[fieldKey] || {};
      const currentAdjustments = fieldAdjustments[url] || {
        objectPosition: { x: 50, y: 50 },
        objectFit: "cover",
      };
      setImageSettings(currentAdjustments);
      setIsSettingsOpen(true);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setImageSettings(newSettings);
    if (selectedImage && onImageAdjustmentChange) {
      onImageAdjustmentChange(fieldKey, newSettings, selectedImage);
    }
  };

  // Ref-based drag state for smoother pointer capture (like AdVariantCard)
  const imageDragRef = useRef({ dragging: false, pointerId: null, latestSettings: null });

  const handleImagePointerDown = (e) => {
    e.preventDefault();
    imageDragRef.current.dragging = true;
    imageDragRef.current.pointerId = e.pointerId;
    imageDragRef.current.latestSettings = imageSettings; // Store initial settings
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleImagePointerMove = (e) => {
    if (!imageDragRef.current.dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const cy = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    const x = Math.round((cx / rect.width) * 100);
    const y = Math.round((cy / rect.height) * 100);

    // Only update local state during drag for visual feedback (no save)
    const newSettings = {
      ...(imageDragRef.current.latestSettings || imageSettings),
      objectPosition: { x, y },
    };
    imageDragRef.current.latestSettings = newSettings; // Track latest for pointer up
    setImageSettings(newSettings);
  };

  const handleImagePointerUp = () => {
    // Save changes only when drag ends
    if (imageDragRef.current.dragging && selectedImage && onImageAdjustmentChange && imageDragRef.current.latestSettings) {
      onImageAdjustmentChange(fieldKey, imageDragRef.current.latestSettings, selectedImage);
    }
    imageDragRef.current.dragging = false;
    imageDragRef.current.pointerId = null;
    imageDragRef.current.latestSettings = null;
  };

  const renderPreview = (url, index, details, isLogo = false) => {
    console.log("isLogo", isLogo);
    const isUploadingFile = uploadingFiles[fileMetadata[url]?.name];
    // Get adjustments for this specific image URL
    const fieldAdjustments = imageAdjustments[fieldKey] || {};
    const adjustments = fieldAdjustments[url] || {};
    const isSelected = selectedImage === url;
    const isMaxFilesReached = multiple && multipleFiles.length >= maxFiles;

    const positionString = adjustments.objectPosition
      ? `${adjustments.objectPosition.x}% ${adjustments.objectPosition.y}%`
      : "50% 50%";

    return (
      <div key={url}>
        <div
          className="flex gap-4 items-center p-4 mb-2 w-full rounded-lg border cursor-pointer"
          onClick={(e) => {
            // Prevent click if clicking on settings or delete buttons
            if (e.target.closest('.settings-button') || e.target.closest('.delete-button')) {
              return;
            }
            handleUploadAreaClick();
          }}
        >
          {multiple && (
            <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
              <FaGripVertical size={16} />
            </div>
          )}

          <div
            className={`flex-shrink-0 overflow-hidden rounded aspect-square flex items-center justify-center
            ${url?.includes("video") ? "w-32" : "w-24"}`}
          >
            {url?.includes("video") ? (
              <video
                src={url}
                controls
                className="object-cover w-full h-full rounded"
              />
            ) : (
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className=" w-full my-auto  rounded border-2  object-center"
                style={{
                  objectPosition: positionString,
                  objectFit: isLogo ? "fill" : adjustments.objectFit || "cover",
                  height: isLogo ? "auto" : "100%",

                }}
              />
            )}
          </div>

          <div className="flex flex-col flex-grow gap-2">
            <Text className="font-medium truncate">
              {fileMetadata[url]?.name || `File ${index + 1}`}
            </Text>
            <Text className="text-sm text-gray-500">
              {fileMetadata[url]?.size || "Unknown size"}
            </Text>

            {isUploadingFile && (
              <div className="mx-auto w-full">
                <div className="overflow-hidden relative h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute inset-0 w-1/3 h-full bg-blue-500 rounded-full animate-loading-slide"
                    style={{
                      animationDuration: "1.5s",
                      animationIterationCount: "infinite",
                      animationTimingFunction: "ease-in-out",
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-loading-pulse"
                    style={{
                      animationDuration: "2s",
                      animationIterationCount: "infinite",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {!isSettingDisabled && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSettingsClick(url);
                }}
                className={`p-2 rounded-full hover:bg-gray-100 flex items-center justify-center settings-button ${isSelected ? "bg-gray-100" : ""
                  }`}
                title="Adjust Image"
              >
                <SlidersHorizontal className="text-blue_gray-500 text-lg" />
              </button>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(url, index);
            }}
            className={`p-2 rounded-full hover:bg-gray-100 delete-button ${isMaxFilesReached ? "animate-pulse bg-red-50 hover:bg-red-100" : ""
              }`}
            title={isMaxFilesReached ? "Delete to upload more" : "Delete"}
          >
            <Img
              src="/images2/img_trash_01.svg"
              alt="trash-01"
              className={`h-[20px] w-[20px] cursor-pointer ml-auto ${isMaxFilesReached ? "text-red-500" : ""
                }`}
            />
          </button>

        </div>

        {isSelected && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-[#e4e7ec]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-[#344054]">Adjust focal point</label>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setSelectedImage(null);
                }}
                className="p-1 rounded transition-colors hover:bg-gray-100"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div
              role="button"
              tabIndex={0}
              onPointerDown={handleImagePointerDown}
              onPointerMove={handleImagePointerMove}
              onPointerUp={handleImagePointerUp}
              onPointerCancel={handleImagePointerUp}
              className={`relative w-full h-32 rounded-lg overflow-hidden border select-none border-[#e4e7ec] hover:border-[#98a2b3] ${imageDragRef.current?.dragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ touchAction: "none" }}
              title="Drag to adjust focal point"
            >
              <img
                src={url}
                alt="Preview"
                className="w-full h-full pointer-events-none"
                draggable={false}
                style={{
                  objectPosition: `${imageSettings.objectPosition?.x ?? 50}% ${imageSettings.objectPosition?.y ?? 50}%`,
                  objectFit: imageSettings.objectFit || "cover",
                }}
              />
              {/* Focal point indicator */}
              <div
                style={{
                  position: "absolute",
                  left: `${imageSettings.objectPosition?.x ?? 50}%`,
                  top: `${imageSettings.objectPosition?.y ?? 50}%`,
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: 9999,
                  border: "2px solid white",
                  boxShadow: "0 0 0 2px rgba(82, 7, 205, 0.7)",
                  background: "rgba(82, 7, 205, 0.35)",
                }}
              />
            </div>
            <div className="mt-2 text-[10px] text-[#667085] text-center">
              Drag to position • {Math.round(imageSettings.objectPosition?.x ?? 50)}%, {Math.round(imageSettings.objectPosition?.y ?? 50)}%
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMultipleFilesPreview = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="files" isDropDisabled={isSettingsOpen}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-4"
          >
            {multipleFiles.map((url, index) => (
              <Draggable
                key={url}
                draggableId={url}
                index={index}
                isDragDisabled={isSettingsOpen}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderPreview(url, index, fileDetails[url], isLogo)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return (
    <div className="flex flex-col h-full">
      <ImageSelectionModal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        onImageSelected={handleImageSelected}
        existingFiles={multiple ? multipleFiles : previewUrl ? [previewUrl] : []}
        multiple={multiple}
        maxFiles={maxFiles}
        accept={accept}
        type={mediaType} // Pass the enforced type
        autosave={autosave}
        isLogo={isLogo}
        currentSectionLimits={currentSectionLimits}
        allowedTabs={allowedTabs}
      />
      {!limitReached ? (
        <div
          onClick={handleUploadAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnter={() => {
            if (!isImageOpen) openModal();
          }}
          className="w-full"
        >
          <div className={`flex justify-end rounded-lg border border-dashed 
            ${isDragging ? "bg-blue-50 border-light_blue-A700" : "border-blue_gray-100 bg-white-A700"} 
            pb-[5px] pt-[26px] sm:pt-5 cursor-pointer transition-colors duration-200`}
          >
            <div className="flex w-full md:w-[79%] items-start justify-between gap-5 p-4">
              <div className="flex flex-col gap-1.5 items-center flex-grow">
                <div className="flex flex-wrap gap-1 self-start">
                  {isUploading ? (
                    <Spin>
                      <Heading size="3xl" as="h2" className="!text-light_blue-A700">
                        Click to upload
                      </Heading>
                    </Spin>
                  ) : (
                    <Heading size="3xl" as="h2" className="!text-light_blue-A700">
                      Click to upload
                    </Heading>
                  )}
                  <Text as="p" className="!font-normal !text-blue_gray-700">
                    or drag and drop
                  </Text>
                </div>
                <Text size="lg" as="p" className="!text-blue_gray-700 text-center">
                  {isVideo
                    ? "OGM, WMV, MPG, WEBM, OGV, MOV, ASX, MPEG, MP4, M4V, AVI (max. 1GB)"
                    : "SVG, PNG, JPG or GIF (max. 800x400px)"}
                </Text>
              </div>
              <div className="relative mt-[9px] h-[48px] w-[48px] md:w-[15%] flex-shrink-0">
                <div className="absolute left-[0.00px] top-[0.00px] m-auto flex items-center px-px">
                  <Heading
                    size="lg"
                    as="h3"
                    className="relative z-[1] mb-[5px] flex items-center justify-center self-end rounded-sm bg-red-700 p-0.5 !font-plusjakartasans !text-white-A700"
                  >
                    {isVideo ? "MP4" : "PNG"}
                  </Heading>
                  <Img src="/images/img_file.svg" alt="file" className="relative ml-[-22px] h-[40px]" />
                </div>
                <Img
                  src="/images/img_cursor.svg"
                  alt="cursor"
                  className="absolute bottom-[0.00px] right-[0.00px] z-[2] m-auto h-[20px] w-[20px]"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <p className="text-sm text-gray-500">
            All slots filled. Replace an {isVideo ? "video" : "image"} if needed.
          </p>
        </div>
      )}

      {error && (
        <Text as="p" className="!text-red-500 mt-2">
          {error}
        </Text>
      )}

      {!multiple && previewUrl && (
        <div className="mt-4 overflow-y-auto">
          {renderPreview(previewUrl, 0, fileDetails[previewUrl], isLogo)}
        </div>
      )}

      {multiple && multipleFiles.length > 0 && (
        <div className="mt-4 flex-1 min-h-0 flex flex-col">
          <Text as="p" className="!text-blue_gray-700 mb-4">
            Uploaded Files: (drag to reorder)
          </Text>
          <div className="flex-1 overflow-y-auto min-h-0">
            {renderMultipleFilesPreview()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
