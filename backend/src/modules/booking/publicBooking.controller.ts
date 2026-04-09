import type { Request, Response } from "express";
import {
  createPublicBookingService,
  getPublicBookingForPaymentService,
} from "./booking.service.js";

export async function getPublicBookingByIdController(
  req: Request,
  res: Response,
) {
  try {
    const { bookingId } = req.params as { bookingId: string };
    const booking = await getPublicBookingForPaymentService(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(409).json({ message: "Booking already paid" });
    }
    return res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return res.status(500).json({ message });
  }
}

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
