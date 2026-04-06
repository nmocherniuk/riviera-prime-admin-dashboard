import { z } from "zod";

export const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const bookingListQuerySchema = z.object({
  driverId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
});

const publicVehicleClassEnum = z.enum(["comfort", "business", "van"]);

const baseBookingFields = {
  clientName: z.string().min(1),
  clientEmail: z.string().default(""),
  clientPhone: z.string().default(""),
  tripType: z.string().default("one-way"),
  notesForDriver: z.string().default(""),
  vehicleId: z.union([z.string().uuid(), z.null()]).optional(),
  vehicleClass: z.union([publicVehicleClassEnum, z.null()]).optional(),
  driverId: z.string().uuid().nullable().optional(),
  bookingAt: z.string().datetime(),
  from: z.string().default(""),
  to: z.string().default(""),
  durationMin: z.number().int().positive().default(60),
  status: z
    .enum(["pending", "assigned", "completed", "cancelled"])
    .default("pending"),
  paymentStatus: z.enum(["paid", "unpaid"]).default("unpaid"),
};

export const createBookingSchema = z
  .object(baseBookingFields)
  .refine(
    (d) => d.vehicleId != null || d.vehicleClass != null,
    { message: "Provide vehicleId or vehicleClass", path: ["vehicleId"] },
  );

export const updateBookingSchema = z
  .object(baseBookingFields)
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    { message: "At least one field is required" },
  );

/** Landing / public widget: no driver assignment; admin assigns later. */
export const publicCreateBookingSchema = z
  .object({
    clientName: z.string().min(1).max(200),
    clientEmail: z.string().default(""),
    clientPhone: z.string().default(""),
    tripType: z.string().default("one-way"),
    notesForDriver: z.string().default(""),
    vehicleId: z.union([z.string().uuid(), z.null()]).optional(),
    vehicleClass: z.union([publicVehicleClassEnum, z.null()]).optional(),
    bookingAt: z.string().datetime(),
    from: z.string().max(500).default(""),
    to: z.string().max(500).default(""),
    durationMin: z.number().int().positive().max(24 * 60).default(60),
    /** Test: set `paid` to simulate post-payment booking until Stripe webhook exists. */
    paymentStatus: z.enum(["paid", "unpaid"]).default("unpaid"),
  })
  .refine(
    (d) => d.vehicleId != null || d.vehicleClass != null,
    { message: "Provide vehicleId or vehicleClass", path: ["vehicleId"] },
  );
