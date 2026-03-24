import { z } from "zod";

export const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const bookingListQuerySchema = z.object({
  driverId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
});

export const createBookingSchema = z.object({
  clientName: z.string().min(1),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid().nullable().optional(),
  bookingAt: z.string().datetime(),
  route: z.string().default(""),
  durationMin: z.number().int().positive().default(60),
  status: z.enum(["pending", "assigned", "completed", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["paid", "unpaid"]).default("unpaid"),
});

export const updateBookingSchema = createBookingSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field is required" },
);

