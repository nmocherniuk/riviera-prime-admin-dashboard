import { z } from "zod";

export const publicDriverStatusSchema = z.enum([
  "AVAILABLE",
  "ON RIDE",
  "OFFLINE",
]);

export const driverIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const driverListQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

export const driverByIdQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

export const createDriverSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  vehicle: z.string().min(1),
  vehiclePlate: z.string().min(1),
  vehicleColor: z.string().min(1),
  status: publicDriverStatusSchema,
  rides: z.number().int().nonnegative().default(0),
  todayShift: z.string().default(""),
});

export const updateDriverSchema = createDriverSchema.omit({
  organizationId: true,
});
