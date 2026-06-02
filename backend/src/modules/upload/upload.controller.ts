import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import { getPublicFileUrl } from "../../lib/uploads.js";

export async function uploadVehiclePhotoController(
  req: AuthedRequest,
  res: Response,
) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  const relativePath = `/uploads/vehicles/${file.filename}`;
  const url = getPublicFileUrl(relativePath);

  return res.status(201).json({ url, path: relativePath });
}
