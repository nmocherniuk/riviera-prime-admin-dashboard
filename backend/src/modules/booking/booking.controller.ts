import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  createBookingService,
  deleteBookingService,
  getBookingByIdService,
  listBookingsService,
  updateBookingService,
} from "./booking.service.js";

export async function listBookingsController(req: AuthedRequest, res: Response) {
  try {
    const { driverId, vehicleId } = req.query as {
      driverId?: string;
      vehicleId?: string;
    };
    const filters: { driverId?: string; vehicleId?: string } = {};
    if (driverId !== undefined) filters.driverId = driverId;
    if (vehicleId !== undefined) filters.vehicleId = vehicleId;
    const bookings = await listBookingsService(filters);
    return res.json({ bookings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    return res.status(500).json({ message });
  }
}

export async function getBookingByIdController(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const booking = await getBookingByIdService(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get failed";
    return res.status(500).json({ message });
  }
}

export async function createBookingController(req: AuthedRequest, res: Response) {
  try {
    const booking = await createBookingService(req.body);
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

export async function updateBookingController(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const booking = await updateBookingService(id, req.body);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
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

export async function deleteBookingController(req: AuthedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const deleted = await deleteBookingService(id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return res.status(500).json({ message });
  }
}

