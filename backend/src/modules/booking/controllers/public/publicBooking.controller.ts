import type { Request, Response } from "express";
import {
  createPublicBookingService,
  httpStatusForKnownBookingMutationError,
  lookupPublicBookingForPayment,
} from "../../booking.service.js";

export async function getPublicBookingByIdController(
  req: Request,
  res: Response,
) {
  try {
    const { bookingId } = req.params as { bookingId: string };
    const outcome = await lookupPublicBookingForPayment(bookingId);
    if (outcome.status === "not_found") {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (outcome.status === "already_paid") {
      return res.status(409).json({ message: "Booking already paid" });
    }
    return res.json({ booking: outcome.booking });
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
    return res
      .status(httpStatusForKnownBookingMutationError(message))
      .json({ message });
  }
}
