import React from 'react';
import { Button, Modal } from 'antd';
import { DownloadOutlined, FileImageOutlined, FileOutlined, EyeOutlined } from '@ant-design/icons';
import SafeImage from './SafeImage';

const ChatAttachments = ({ attachments, messageType, className = "" }) => {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const handleDownload = (fileUrl, fileName) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className={`chat-attachments ${className}`} style={{ 
      maxWidth: '100%', 
      overflow: 'hidden',
      wordBreak: 'break-word',
      whiteSpace: 'normal'
    }}>
      {messageType === 'image' ? (
        // Image gallery layout
        <div className="image-attachments">
          {attachments.length === 1 ? (
            // Single image - larger display
            <div className="single-image">
              <div className="relative group cursor-pointer">
                <SafeImage
                  src={attachments[0].fileUrl}
                  thumbnailUrl={attachments[0].thumbnailUrl}
                  alt={attachments[0].fileName}
                  className="max-w-xs max-h-48 rounded-lg shadow-sm"
                  onClick={() => handleImagePreview(attachments[0].fileUrl)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <Button
                      icon={<EyeOutlined />}
                      type="primary"
                      size="small"
                      onClick={() => handleImagePreview(attachments[0].fileUrl)}
                    />
                    <Button
                      icon={<DownloadOutlined />}
                      size="small"
                      onClick={() => handleDownload(attachments[0].fileUrl, attachments[0].fileName)}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                {attachments[0].fileName}
              </p>
            </div>
          ) : (
            // Multiple images - grid layout
            <div className="image-grid">
              <div className={`grid gap-2 ${
                attachments.length === 2 ? 'grid-cols-2' : 
                attachments.length === 3 ? 'grid-cols-3' : 
                'grid-cols-2'
              }`}>
                {attachments.slice(0, 4).map((attachment, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <SafeImage
                      src={attachment.fileUrl}
                      thumbnailUrl={attachment.thumbnailUrl}
                      alt={attachment.fileName}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      onClick={() => handleImagePreview(attachment.fileUrl)}
                    />
                    {attachments.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{attachments.length - 4}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                        <Button
                          icon={<EyeOutlined />}
                          type="primary"
                          size="small"
                          onClick={() => handleImagePreview(attachment.fileUrl)}
                        />
                        <Button
                          icon={<DownloadOutlined />}
                          size="small"
                          onClick={() => handleDownload(attachment.fileUrl, attachment.fileName)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {attachments.length > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  {attachments.length} images
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        // File attachments layout
        <div className="file-attachments space-y-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="file-attachment flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded border max-w-xs"
            >
              <div className="flex-shrink-0">
                {isImageFile(attachment.fileType) ? (
                  <FileImageOutlined className="text-blue-500 text-lg" />
                ) : (
                  <FileOutlined className="text-gray-500 text-lg" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-gray-200">
                  {attachment.fileName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
              
              <div className="flex-shrink-0 flex space-x-1">
                {isImageFile(attachment.fileType) && (
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    type="text"
                    onClick={() => handleImagePreview(attachment.fileUrl)}
                    title="Preview"
                  />
                )}
                <Button
                  icon={<DownloadOutlined />}
                  size="small"
                  type="text"
                  onClick={() => handleDownload(attachment.fileUrl, attachment.fileName)}
                  title="Download"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image preview modal */}
      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ maxWidth: '800px' }}
        centered
      >
        <div className="text-center">
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
            className="rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChatAttachments; 