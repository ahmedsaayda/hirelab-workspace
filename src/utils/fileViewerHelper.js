import React from 'react';

/**
 * Helper utilities for the FileViewer component
 * This file provides reusable functions for file handling across the application
 */

/**
 * Extract filename from a file URL, handling different formats
 * @param {string|object} fileData - File data (URL string or object with filename)
 * @param {string} fallback - Fallback filename if extraction fails
 * @returns {string} Extracted filename
 */
export const extractFileName = (fileData, fallback = 'download') => {
  if (!fileData) return fallback;
  
  // Handle new object format
  if (typeof fileData === 'object') {
    if (fileData.filename) {
      return fileData.filename;
    }
    // If object has URL but no filename, extract from URL
    if (fileData.url) {
      const urlParts = fileData.url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      const decodedPart = decodeURIComponent(lastPart);
      // Remove Cloudinary transformations and get clean filename
      const cleanName = decodedPart.split('_').pop() || decodedPart;
      return cleanName || fallback;
    }
  }
  
  // Handle URL string
  if (typeof fileData === 'string' && fileData.startsWith('http')) {
    const urlParts = fileData.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const decodedPart = decodeURIComponent(lastPart);
    // Remove Cloudinary transformations and get clean filename
    const cleanName = decodedPart.split('_').pop() || decodedPart;
    return cleanName || fallback;
  }
  
  return fileData || fallback;
};

/**
 * Extract file URL from different file data formats
 * @param {string|object} fileData - File data (URL string or object with url)
 * @returns {string|null} File URL
 */
export const extractFileUrl = (fileData) => {
  if (!fileData) return null;
  
  // Handle new object format
  if (typeof fileData === 'object' && fileData.url) {
    return fileData.url;
  }
  
  // Handle URL string
  if (typeof fileData === 'string' && fileData.startsWith('http')) {
    return fileData;
  }
  
  return null;
};

/**
 * Detect file type from filename or URL
 * @param {string} fileName - Filename or URL
 * @returns {string} File type ('pdf', 'image', 'video', 'audio', 'document', 'text', 'unknown')
 */
export const detectFileType = (fileName) => {
  if (!fileName) return 'unknown';
  
  const fileNameLower = fileName.toLowerCase();
  
  if (fileNameLower.includes('.pdf')) {
    return 'pdf';
  } else if (fileNameLower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/)) {
    return 'image';
  } else if (fileNameLower.match(/\.(mp4|webm|ogg|avi|mov|wmv|flv)$/)) {
    return 'video';
  } else if (fileNameLower.match(/\.(mp3|wav|ogg|aac|flac|wma)$/)) {
    return 'audio';
  } else if (fileNameLower.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/)) {
    return 'document';
  } else if (fileNameLower.match(/\.(txt|rtf|csv)$/)) {
    return 'text';
  } else {
    return 'unknown';
  }
};

/**
 * Get file type icon based on file type
 * @param {string} fileType - File type from detectFileType()
 * @returns {string} Icon name for Ant Design icons
 */
export const getFileTypeIcon = (fileType) => {
  const iconMap = {
    pdf: 'FilePdfOutlined',
    image: 'PictureOutlined',
    video: 'PlayCircleOutlined',
    audio: 'AudioOutlined',
    document: 'FileTextOutlined',
    text: 'FileTextOutlined',
    unknown: 'FileOutlined'
  };
  
  return iconMap[fileType] || 'FileOutlined';
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Check if file can be previewed in the FileViewer
 * @param {string} fileName - Filename or URL
 * @returns {boolean} True if file can be previewed
 */
export const canPreviewFile = (fileName) => {
  const fileType = detectFileType(fileName);
  return ['pdf', 'image', 'video', 'audio', 'text'].includes(fileType);
};

/**
 * Create a download link for a file with proper handling to avoid Cloudinary redirects
 * @param {string} fileUrl - File URL
 * @param {string} fileName - Filename for download
 */
export const downloadFile = async (fileUrl, fileName = 'download') => {
  try {
    // For Cloudinary URLs, try to modify URL to force download
    if (fileUrl.includes('cloudinary.com')) {
      // Cloudinary URLs can be modified to force download by adding fl_attachment
      let downloadUrl = fileUrl;
      
      // Check if the URL already has transformations
      if (fileUrl.includes('/upload/')) {
        // Insert the download flag into the transformation chain
        downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
      } else {
        // If no transformations, add the download flag
        const baseUrl = fileUrl.split('/upload')[0];
        const path = fileUrl.split('/upload')[1];
        downloadUrl = `${baseUrl}/upload/fl_attachment${path}`;
      }
      
      // Create download link with the modified URL
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // For other external URLs, try fetch approach with proper error handling
    if (fileUrl.startsWith('http')) {
      try {
        const response = await fetch(fileUrl, {
          method: 'GET',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch file');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        return;
      } catch (fetchError) {
        console.warn('Fetch download failed, trying direct approach:', fetchError);
        // Fall through to direct download approach
      }
    }
    
    // Direct download approach (for local files or as fallback)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.style.display = 'none';
    // Remove target="_blank" to prevent opening in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to download file');
  }
};

/**
 * Hook for managing FileViewer state
 * @returns {object} Object with viewer state and handlers
 */
export const useFileViewer = () => {
  const [visible, setVisible] = React.useState(false);
  const [fileData, setFileData] = React.useState({
    url: '',
    fileName: '',
    title: ''
  });
  
  const openViewer = (fileUrl, fileName = '', title = 'File') => {
    setFileData({ url: fileUrl, fileName, title });
    setVisible(true);
  };
  
  const closeViewer = () => {
    setVisible(false);
    // Clear data after animation completes
    setTimeout(() => {
      setFileData({ url: '', fileName: '', title: '' });
    }, 300);
  };
  
  return {
    visible,
    fileData,
    openViewer,
    closeViewer
  };
};
