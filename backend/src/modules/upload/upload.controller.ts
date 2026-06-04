import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import { getPublicFileUrl } from "../../lib/uploads.js";

function getUploadedFile(req: AuthedRequest): Express.Multer.File | undefined {
  return (req as Request & { file?: Express.Multer.File | undefined }).file;
}

export async function uploadVehiclePhotoController(
  req: AuthedRequest,
  res: Response,
) {
  const file = getUploadedFile(req);
  if (!file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  const relativePath = `/uploads/vehicles/${file.filename}`;
  const url = getPublicFileUrl(relativePath);

  return res.status(201).json({ url, path: relativePath });
}
