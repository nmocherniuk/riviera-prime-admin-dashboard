import type {
  VehicleClass,
  VehicleStatus,
  Vehicles,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import {
  assignDriverToVehicle as assignDriverToVehicleRepo,
  createVehicle as createVehicleRepo,
  deleteVehicleById,
  findVehicleById,
  findVehicles,
  updateVehicle as updateVehicleRepo,
  type CreateVehicleData,
} from "./vehicle.repository.js";

export type PublicVehicleClass = "Comfort" | "Business" | "Van";
export type PublicVehicleStatus = "AVAILABLE" | "ON TRIP";

export type PublicVehicle = {
  id: string;
  organizationId: string;
  driverId: string | null;
  vehicleName: string;
  yearColor: string;
  licensePlate: string;
  class: PublicVehicleClass;
  status: PublicVehicleStatus;
  nextService: string;
  createdAt: string;
  updatedAt: string;
};

function toPublicClass(value: VehicleClass): PublicVehicleClass {
  if (value === "COMFORT") return "Comfort";
  if (value === "BUSINESS") return "Business";
  return "Van";
}

function toDbClass(value: PublicVehicleClass): VehicleClass {
  if (value === "Comfort") return "COMFORT";
  if (value === "Business") return "BUSINESS";
  return "VAN";
}

function toPublicStatus(value: VehicleStatus): PublicVehicleStatus {
  return value === "ON_TRIP" ? "ON TRIP" : "AVAILABLE";
}

function toDbStatus(value: PublicVehicleStatus): VehicleStatus {
  return value === "ON TRIP" ? "ON_TRIP" : "AVAILABLE";
}

export function toPublicVehicle(row: Vehicles): PublicVehicle {
  return {
    id: row.id,
    organizationId: row.organizationId,
    driverId: row.driverId ?? null,
    vehicleName: row.vehicleName,
    yearColor: row.yearColor,
    licensePlate: row.licensePlate,
    class: toPublicClass(row.class),
    status: toPublicStatus(row.status),
    nextService: row.nextService,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function validateOrgAndDriverLink(
  organizationId: string,
  driverId?: string | null,
) {
  const org = await prisma.organizations.findUnique({ where: { id: organizationId } });
  if (!org) {
    throw new Error("Organization not found");
  }

  if (!driverId) return;

  const driver = await prisma.drivers.findUnique({ where: { id: driverId } });
  if (!driver) {
    throw new Error("Driver not found");
  }
  if (driver.organizationId !== organizationId) {
    throw new Error("Driver does not belong to organization");
  }
}

export async function listVehiclesService(filters?: {
  organizationId?: string;
  driverId?: string;
}) {
  const rows = await findVehicles(filters);
  return rows.map(toPublicVehicle);
}

export async function getVehicleByIdService(id: string) {
  const row = await findVehicleById(id);
  if (!row) return null;
  return toPublicVehicle(row);
}

export async function createVehicleService(
  input: Omit<CreateVehicleData, "class" | "status"> & {
    class: PublicVehicleClass;
    status: PublicVehicleStatus;
  },
) {
  await validateOrgAndDriverLink(input.organizationId, input.driverId);
  const row = await createVehicleRepo({
    ...input,
    class: toDbClass(input.class),
    status: toDbStatus(input.status),
  });
  return toPublicVehicle(row);
}

export async function updateVehicleService(
  id: string,
  input: Omit<CreateVehicleData, "organizationId" | "class" | "status"> & {
    class: PublicVehicleClass;
    status: PublicVehicleStatus;
    driverId?: string | null;
  },
) {
  const existing = await findVehicleById(id);
  if (!existing) return null;

  await validateOrgAndDriverLink(existing.organizationId, input.driverId);

  const updated = await updateVehicleRepo(id, {
    driverId: input.driverId ?? null,
    vehicleName: input.vehicleName,
    yearColor: input.yearColor,
    licensePlate: input.licensePlate,
    class: toDbClass(input.class),
    status: toDbStatus(input.status),
    nextService: input.nextService,
  });

  return toPublicVehicle(updated);
}

export async function assignDriverToVehicleService(
  vehicleId: string,
  driverId: string | null,
) {
  const vehicle = await findVehicleById(vehicleId);
  if (!vehicle) return null;

  await validateOrgAndDriverLink(vehicle.organizationId, driverId);

  const updated = await assignDriverToVehicleRepo(vehicleId, driverId);
  return toPublicVehicle(updated);
}

export async function deleteVehicleService(id: string) {
  const row = await findVehicleById(id);
  if (!row) return null;
  await deleteVehicleById(id);
  return true;
}
