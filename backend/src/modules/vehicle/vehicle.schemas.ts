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

const nullableUuid = z.union([z.string().uuid(), z.null()]);

function normalizeCreateBody(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  const org = o.organizationId;
  const drv = o.driverId;
  return {
    ...o,
    organizationId:
      org === "" || org === undefined ? null : org,
    driverId: drv === "" || drv === undefined ? null : drv,
  };
}

function normalizeUpdateBody(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  const org = o.organizationId;
  const drv = o.driverId;
  return {
    ...o,
    organizationId:
      org === "" || org === undefined ? null : org,
    driverId: drv === "" || drv === undefined ? null : drv,
  };
}

const createVehicleFields = {
  organizationId: nullableUuid,
  driverId: nullableUuid,
  vehicleName: z.string().min(1),
  year: z.string().min(1),
  color: z.string().min(1),
  licensePlate: z.string().min(1),
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
    driverId: nullableUuid,
    vehicleName: z.string().min(1),
    year: z.string().min(1),
    color: z.string().min(1),
    licensePlate: z.string().min(1),
    class: vehicleClassSchema,
    status: vehicleStatusSchema,
  }),
);

export const assignDriverSchema = z.object({
  driverId: z.string().uuid().nullable(),
});

export type CreateVehicleBody = z.infer<typeof createVehicleObjectSchema>;
