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
}

export default new ImageUploadService();
