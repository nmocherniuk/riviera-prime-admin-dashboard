import path from "path";
import { randomUUID } from "crypto";
import type { Request } from "express";
import multer from "multer";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  VEHICLE_UPLOADS_DIR,
  ensureUploadDirs,
} from "../lib/uploads.js";

ensureUploadDirs();

function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/jpeg":
    default:
      return ".jpg";
  }
}

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, VEHICLE_UPLOADS_DIR);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext =
      extensionForMime(file.mimetype) ||
      path.extname(file.originalname).toLowerCase() ||
      ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadVehiclePhotoMiddleware = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
}).single("image");
