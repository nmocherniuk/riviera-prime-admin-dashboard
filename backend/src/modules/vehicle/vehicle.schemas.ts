import { z } from "zod";

export const vehicleClassSchema = z.enum(["Comfort", "Business", "Van"]);
export const vehicleStatusSchema = z.enum(["AVAILABLE", "ON TRIP"]);

export const vehicleIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const vehicleListQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
});

export const createVehicleSchema = z.object({
  organizationId: z.string().uuid(),
  driverId: z.string().uuid().nullable().optional(),
  vehicleName: z.string().min(1),
  yearColor: z.string().min(1),
  licensePlate: z.string().min(1),
  class: vehicleClassSchema,
  status: vehicleStatusSchema,
  nextService: z.string().default(""),
});

export const updateVehicleSchema = createVehicleSchema.omit({
  organizationId: true,
});

export const assignDriverSchema = z.object({
  driverId: z.string().uuid().nullable(),
});
