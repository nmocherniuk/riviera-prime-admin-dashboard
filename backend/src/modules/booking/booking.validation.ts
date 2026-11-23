import { z } from "zod";
import { emailLocaleSchema } from "../../emails/locale.js";
import { placeRefSchema } from "../places/places.schemas.js";

function isOneWayTrip(tripType: string): boolean {
  const t = tripType.trim().toLowerCase();
  return t !== "hourly" && t !== "hour";
}

export const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

/** GET /api/public/bookings/:bookingId */
export const publicBookingIdParamsSchema = z.object({
  bookingId: z.string().uuid(),
});

export const bookingListQuerySchema = z.object({
  driverId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
});

export const driverBookingsGroupedQuerySchema = z.object({
  driverId: z.string().uuid(),
});

const publicVehicleClassEnum = z.enum(["comfort", "business", "van"]);

export const publicVehicleListQuerySchema = z.object({
  class: publicVehicleClassEnum.optional(),
});

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
  /**
   * Address picked from Google autocomplete. When sent, coordinates are verified
   * server-side and the one-way distance is (re)computed via Google Routes.
   * Text-only change of `from`/`to` (no place) never triggers a distance recompute.
   */
  fromPlace: placeRefSchema.nullable().optional(),
  toPlace: placeRefSchema.nullable().optional(),
  durationMin: z.number().int().positive().default(60),
  /** Admin override — explicit one-way distance; wins over the computed route. */
  distanceKm: z.number().positive().optional(),
  status: z
    .enum(["pending", "assigned", "completed", "cancelled"])
    .default("pending"),
  paymentStatus: z.enum(["paid", "unpaid"]).default("unpaid"),
  locale: emailLocaleSchema.optional(),
};

/** Admin / JWT: full booking create body. */
export const createBookingSchema = z
  .object(baseBookingFields)
  .refine((d) => d.vehicleId != null || d.vehicleClass != null, {
    message: "Provide vehicleId or vehicleClass",
    path: ["vehicleId"],
  });

export const updateBookingSchema = z
  .object(baseBookingFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

/** Landing / public widget: limited fields; no driver assignment. */
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
    /** Required: the landing only books addresses picked from suggestions. */
    fromPlace: placeRefSchema,
    toPlace: placeRefSchema.optional(),
    durationMin: z
      .number()
      .int()
      .positive()
      .max(24 * 60)
      .default(60),
    // No `distanceKm` here: public distance always comes from Google Routes.
    locale: emailLocaleSchema,
  })
  .refine((d) => d.vehicleId != null || d.vehicleClass != null, {
    message: "Provide vehicleId or vehicleClass",
    path: ["vehicleId"],
  })
  .refine((d) => !isOneWayTrip(d.tripType) || d.toPlace != null, {
    message: "Destination must be selected from suggestions for one-way trip",
    path: ["toPlace"],
  });
