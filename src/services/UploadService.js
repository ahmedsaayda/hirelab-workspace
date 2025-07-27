import { message } from "antd";
import axios from "axios";

function bytesToMB(bytes) {
  return bytes / (1024 * 1024);
}

class ImageUploadService {
  constructor() {
    this.baseURL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
    this.api = axios.create({
      baseURL: this.baseURL,
    });
  }

  upload(file, maxMB) {
    console.log({
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
      NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    })
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
      return message.error("Uploads are disabled!");
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_PRESET)
      return message.error("Uploads are disabled!!");
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
      return message.error("Uploads are disabled!!!");

    if (bytesToMB(file.size) > maxMB)
      return message.info(`Maximum size: ${maxMB}MB`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

    return this.api.post("", formData);
  }

  /**
   * Upload file for chat with progress tracking
   * @param {File} file - The file to upload
   * @param {number} maxMB - Maximum file size in MB
   * @param {function} onProgress - Progress callback function
   * @returns {Promise} - Upload promise
   */
  uploadForChat(file, maxMB = 10, onProgress) {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      throw new Error("Uploads are disabled - Cloudinary not configured");
    }
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_PRESET) {
      throw new Error("Uploads are disabled - Cloudinary preset not configured");
    }

    if (bytesToMB(file.size) > maxMB) {
      throw new Error(`File size too large. Maximum size: ${maxMB}MB`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    formData.append("folder", "chat_uploads");

    return axios.post(this.baseURL, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }

  /**
   * Check if file is an image
   * @param {File} file - The file to check
   * @returns {boolean} - True if file is an image
   */
  isImage(file) {
    return file.type.startsWith('image/');
  }

  /**
   * Generate thumbnail URL for images
   * @param {string} cloudinaryUrl - Original cloudinary URL
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {string} - Thumbnail URL
   */
  generateThumbnail(cloudinaryUrl, width = 150, height = 150) {
    if (!cloudinaryUrl) {
      return null;
    }
    
          try {
        // Insert transformation parameters into cloudinary URL
        const parts = cloudinaryUrl.split('/upload/');
        if (parts.length === 2) {
          const thumbnailUrl = `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`;
          return thumbnailUrl;
        }
        
        return cloudinaryUrl;
      } catch (error) {
        console.error('generateThumbnail error:', error);
        return cloudinaryUrl;
      }
  }
}

export default new ImageUploadService();
