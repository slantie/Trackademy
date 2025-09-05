/**
 * @file src/middlewares/upload.middleware.ts
 * @description Multer middleware for handling file uploads
 */

import multer from "multer";
import { Request } from "express";
import AppError from "../utils/appError";

// Memory storage for processing files before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed file types
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  // Check MIME type
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  // Check file extension as fallback
  const fileExtension = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf("."));
  if (allowedExtensions.includes(fileExtension)) {
    return cb(null, true);
  }

  // Reject file
  cb(
    new AppError(
      "Invalid file type. Only PDF, DOC, DOCX, TXT, JPG, JPEG, and PNG files are allowed.",
      400
    )
  );
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Export middleware functions
export const uploadSingle = (fieldName: string = "file") =>
  upload.single(fieldName);
export const uploadMultiple = (
  fieldName: string = "files",
  maxCount: number = 5
) => upload.array(fieldName, maxCount);

export default upload;
