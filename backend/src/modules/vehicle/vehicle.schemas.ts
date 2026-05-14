import { z } from "zod";

export const vehicleClassSchema = z.enum(["Comfort", "Business", "Van"]);
export const vehicleStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const vehicleIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const vehicleListQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
});

export const publicVehicleListQuerySchema = z.object({
  class: z.enum(["comfort", "business", "van"]).optional(),
});

const nullableUuid = z.union([z.string().uuid(), z.null()]);

const driverIdsField = z.array(z.string().uuid()).default([]);

function normalizeCreateBody(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  const org = o.organizationId;
  return {
    ...o,
    organizationId:
      org === "" || org === undefined ? null : org,
    driverIds:
      Array.isArray(o.driverIds) ? o.driverIds : [],
  };
}

function normalizeUpdateBody(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  const org = o.organizationId;
  return {
    ...o,
    organizationId:
      org === "" || org === undefined ? null : org,
    driverIds:
      Array.isArray(o.driverIds) ? o.driverIds : [],
  };
}

const createVehicleFields = {
  organizationId: nullableUuid,
  driverIds: driverIdsField,
  vehicleName: z.string().min(1),
  year: z.string().min(1),
  color: z.string().min(1),
  licensePlate: z.string().min(1),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().optional().default(""),
  passengers: z.number().int().positive().optional().nullable(),
  baggageCount: z.number().int().nonnegative().optional().nullable(),
  vehicleType: z.string().optional().default(""),
  transmission: z.string().optional().default(""),
  interior: z.string().optional().default(""),
  amenities: z.array(z.string()).optional().default([]),
  class: vehicleClassSchema,
  status: vehicleStatusSchema,
} as const;

const createVehicleObjectSchema = z.object(createVehicleFields);

export const createVehicleSchema = z.preprocess(
  normalizeCreateBody,
  createVehicleObjectSchema,
);

export const updateVehicleSchema = z.preprocess(
  normalizeUpdateBody,
  z.object({
    organizationId: nullableUuid,
    driverIds: driverIdsField,
    vehicleName: z.string().min(1),
    year: z.string().min(1),
    color: z.string().min(1),
    licensePlate: z.string().min(1),
    imageUrl: z.string().trim().url().optional().or(z.literal("")),
    description: z.string().optional().default(""),
    passengers: z.number().int().positive().optional().nullable(),
    baggageCount: z.number().int().nonnegative().optional().nullable(),
    vehicleType: z.string().optional().default(""),
    transmission: z.string().optional().default(""),
    interior: z.string().optional().default(""),
    amenities: z.array(z.string()).optional().default([]),
    class: vehicleClassSchema,
    status: vehicleStatusSchema,
  }),
);

export const assignDriverSchema = z.object({
  driverIds: z.array(z.string().uuid()),
});

export type CreateVehicleBody = z.infer<typeof createVehicleObjectSchema>;
