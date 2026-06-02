import path from "path";
import { randomUUID } from "crypto";
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
  destination: (_req, _file, cb) => {
    cb(null, VEHICLE_UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
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
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
}).single("image");
