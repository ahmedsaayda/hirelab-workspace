import React, { useState, useRef, useCallback } from 'react';
import { Button, Upload, Progress, message, Modal } from 'antd';
import { PaperClipOutlined, CloseOutlined, FileImageOutlined, FileOutlined } from '@ant-design/icons';
import UploadService from '../services/UploadService';

const ChatFileUpload = ({ onFilesUploaded, disabled = false, multiple = true }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewFiles, setPreviewFiles] = useState([]);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (file) => {
    return file.type && file.type.startsWith('image/');
  };

  const handleFileSelect = useCallback((files) => {
    const fileList = Array.from(files);
    
    // Validate files
    const validFiles = fileList.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        message.error(`File ${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview objects
    const newPreviewFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null,
      uploaded: false,
      uploading: false,
      progress: 0,
      error: null
    }));

    // Generate previews for images
    newPreviewFiles.forEach(previewFile => {
      if (isImageFile(previewFile.file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewFiles(prev => 
            prev.map(p => 
              p.id === previewFile.id 
                ? { ...p, preview: e.target.result }
                : p
            )
          );
        };
        reader.readAsDataURL(previewFile.file);
      }
    });

    setPreviewFiles(prev => [...prev, ...newPreviewFiles]);
  }, []);

  const uploadFiles = useCallback(async () => {
    const filesToUpload = previewFiles.filter(f => !f.uploaded && !f.uploading);
    if (filesToUpload.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (previewFile) => {
        setPreviewFiles(prev => 
          prev.map(p => 
            p.id === previewFile.id 
              ? { ...p, uploading: true, progress: 0 }
              : p
          )
        );

        try {
          const response = await UploadService.uploadForChat(
            previewFile.file,
            10,
            (progress) => {
              setPreviewFiles(prev => 
                prev.map(p => 
                  p.id === previewFile.id 
                    ? { ...p, progress }
                    : p
                )
              );
            }
          );

          const uploadedFile = {
            fileUrl: response.data.secure_url,
            fileName: previewFile.name,
            fileSize: previewFile.size,
            fileType: previewFile.type,
            thumbnailUrl: isImageFile(previewFile.file) 
              ? UploadService.generateThumbnail(response.data.secure_url)
              : null
          };

          setPreviewFiles(prev => 
            prev.map(p => 
              p.id === previewFile.id 
                ? { ...p, uploaded: true, uploading: false, progress: 100, uploadedFile }
                : p
            )
          );

          return uploadedFile;
        } catch (error) {
          setPreviewFiles(prev => 
            prev.map(p => 
              p.id === previewFile.id 
                ? { ...p, uploading: false, error: error.message }
                : p
            )
          );
          throw error;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const successfulUploads = uploadedFiles.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        onFilesUploaded(successfulUploads);
        setPreviewFiles([]);
        message.success(`${successfulUploads.length} file(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Some files failed to upload');
    } finally {
      setUploading(false);
    }
  }, [previewFiles, onFilesUploaded]);

  const removeFile = (fileId) => {
    setPreviewFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleAttachClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="chat-file-upload">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        accept="*/*"
      />

      {/* Attach button */}
      <Button
        icon={<PaperClipOutlined />}
        onClick={handleAttachClick}
        disabled={disabled || uploading}
        type="text"
        title="Attach files"
        className="text-gray-500 hover:text-gray-700"
      />

      {/* File preview modal */}
      <Modal
        title="Attach Files"
        open={previewFiles.length > 0}
        onCancel={() => setPreviewFiles([])}
        footer={[
          <Button key="cancel" onClick={() => setPreviewFiles([])}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            disabled={previewFiles.every(f => f.uploaded || f.uploading)}
            onClick={uploadFiles}
          >
            Send {previewFiles.length} file(s)
          </Button>
        ]}
        width={600}
      >
        <div
          className="drop-zone border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-gray-500">Drop files here or click "Choose Files" to select</p>
          <Button onClick={handleAttachClick} className="mt-2">
            Choose Files
          </Button>
        </div>

        <div className="file-preview-list space-y-2 max-h-96 overflow-auto">
          {previewFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-3 p-3 border rounded">
              {/* File icon/preview */}
              <div className="flex-shrink-0">
                {file.preview ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : isImageFile(file.file) ? (
                  <FileImageOutlined className="text-2xl text-blue-500" />
                ) : (
                  <FileOutlined className="text-2xl text-gray-500" />
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                
                {/* Progress bar */}
                {file.uploading && (
                  <Progress 
                    percent={file.progress} 
                    size="small" 
                    status="active"
                    className="mt-1"
                  />
                )}

                {/* Error message */}
                {file.error && (
                  <p className="text-xs text-red-500 mt-1">{file.error}</p>
                )}

                {/* Success indicator */}
                {file.uploaded && (
                  <p className="text-xs text-green-500 mt-1">✓ Uploaded</p>
                )}
              </div>

              {/* Remove button */}
              <Button
                icon={<CloseOutlined />}
                size="small"
                type="text"
                onClick={() => removeFile(file.id)}
                disabled={file.uploading}
                className="text-gray-400 hover:text-red-500"
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ChatFileUpload; 