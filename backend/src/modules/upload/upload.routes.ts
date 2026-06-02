import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadVehiclePhotoMiddleware } from "../../middleware/uploadVehiclePhoto.js";
import { uploadVehiclePhotoController } from "./upload.controller.js";

const router = Router();

function handleVehiclePhotoUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadVehiclePhotoMiddleware(req, res, (err: unknown) => {
    if (err) {
      const message =
        err instanceof Error ? err.message : "Image upload failed";
      return res.status(400).json({ message });
    }
    return next();
  });
}

router.post(
  "/vehicle-photo",
  requireAuth,
  handleVehiclePhotoUpload,
  uploadVehiclePhotoController,
);

export default router;
