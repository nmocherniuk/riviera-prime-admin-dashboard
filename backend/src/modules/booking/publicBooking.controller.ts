import type { Request, Response } from "express";
import { createPublicBookingService } from "./booking.service.js";

export async function createPublicBookingController(
  req: Request,
  res: Response,
) {
  try {
    console.log("req.body", req.body);
    const booking = await createPublicBookingService(req.body);
    return res.status(201).json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Create failed";
    const code =
      message === "Vehicle not found" ||
      message === "Driver not found" ||
      message === "Driver does not belong to vehicle organization" ||
      message === "Provide vehicleId or vehicleClass"
        ? 400
        : 500;
    return res.status(code).json({ message });
  }
}
