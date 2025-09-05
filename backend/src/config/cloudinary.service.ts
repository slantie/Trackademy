/**
 * @file src/config/cloudinary.service.ts
 * @description Cloudinary configuration and upload utilities
 */

import { v2 as cloudinary } from "cloudinary";
import config from "./index";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

/**
 * Upload file to Cloudinary
 * @param file - File buffer or file path
 * @param options - Cloudinary upload options
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: string | Buffer,
  options: {
    folder?: string;
    public_id?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    allowed_formats?: string[];
    max_file_size?: number;
  } = {}
) => {
  try {
    const defaultOptions = {
      folder: "trackademy/submissions",
      resource_type: "raw" as const, // Changed default to 'raw' for better file support
      max_file_size: 10000000, // 10MB
    };

    const uploadOptions = { ...defaultOptions, ...options };

    // Remove allowed_formats if resource_type is 'raw' as Cloudinary handles it differently
    if (uploadOptions.resource_type === "raw") {
      delete uploadOptions.allowed_formats;
    }

    const result = await cloudinary.uploader.upload(
      file as string,
      uploadOptions
    );

    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: result.original_filename,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
      },
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Delete file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @param resourceType - The resource type (image, video, raw)
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "raw"
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return {
      success: result.result === "ok",
      data: result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
};

/**
 * Generate a signed URL for secure upload
 * @param folder - Folder to upload to
 * @param timestamp - Timestamp for the signature
 * @returns Signature for upload
 */
export const generateUploadSignature = (
  folder: string = "trackademy/submissions",
  timestamp: number = Math.round(new Date().getTime() / 1000)
) => {
  const params = {
    timestamp,
    folder,
    upload_preset: "trackademy_preset", // You'll need to create this in your Cloudinary dashboard
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    config.cloudinaryApiSecret!
  );

  return {
    timestamp,
    signature,
    api_key: config.cloudinaryApiKey,
    cloud_name: config.cloudinaryCloudName,
    folder,
  };
};

export { cloudinary };
export default cloudinary;
