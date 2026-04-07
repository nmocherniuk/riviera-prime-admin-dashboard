import type {
  VehicleClass,
  VehicleStatus,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import {
  createVehicle as createVehicleRepo,
  deleteVehicleById,
  findVehicleById,
  findVehicles,
  setVehicleDrivers,
  updateVehicle as updateVehicleRepo,
  type VehicleWithDriverIds,
} from "./vehicle.repository.js";
import type { CreateVehicleBody } from "./vehicle.schemas.js";
import type { VehicleJson } from "./vehicle.types.js";
import { toDbClass, toPublicClass } from "./vehicle.utils.js";

function toPublicVehicle(row: VehicleWithDriverIds): VehicleJson {
  return {
    id: row.id,
    organizationId: row.organizationId,
    driverIds: row.drivers.map((d) => d.id),
    vehicleName: row.vehicleName,
    year: row.year,
    color: row.color,
    licensePlate: row.licensePlate,
    class: toPublicClass(row.class),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function validateOrgAndDriversLink(
  organizationId: string | null | undefined,
  driverIds: string[],
) {
  const orgId = organizationId ?? null;

  if (orgId) {
    const org = await prisma.organizations.findUnique({ where: { id: orgId } });
    if (!org) {
      throw new Error("Organization not found");
    }
  }

  for (const drvId of driverIds) {
    const driver = await prisma.drivers.findUnique({ where: { id: drvId } });
    if (!driver) {
      throw new Error("Driver not found");
    }
    if (orgId && driver.organizationId !== orgId) {
      throw new Error("Driver does not belong to organization");
    }
  }
}

export async function listVehiclesService(filters?: {
  organizationId?: string;
  driverId?: string;
}) {
  const data = await findVehicles(filters);
  return data.map(toPublicVehicle);
}

export async function getVehicleByIdService(id: string) {
  const data = await findVehicleById(id);
  if (!data) return null;
  return toPublicVehicle(data);
}

export async function createVehicleService(body: CreateVehicleBody) {
  const organizationId = body.organizationId ?? null;
  const driverIds = body.driverIds ?? [];

  await validateOrgAndDriversLink(organizationId, driverIds);

  const row = await createVehicleRepo({
    organizationId,
    driverIds,
    vehicleName: body.vehicleName,
    year: body.year,
    color: body.color,
    licensePlate: body.licensePlate,
    class: toDbClass(body.class),
    status: body.status,
  });

  return toPublicVehicle(row);
}

export async function updateVehicleService(
  id: string,
  body: {
    organizationId: string | null;
    driverIds: string[];
    vehicleName: string;
    year: string;
    color: string;
    licensePlate: string;
    class: VehicleJson["class"];
    status: VehicleStatus;
  },
) {
  const existing = await findVehicleById(id);
  if (!existing) return null;

  const organizationId = body.organizationId ?? null;
  const driverIds = body.driverIds ?? [];

  await validateOrgAndDriversLink(organizationId, driverIds);

  const updated = await updateVehicleRepo(id, {
    organizationId,
    driverIds,
    vehicleName: body.vehicleName,
    year: body.year,
    color: body.color,
    licensePlate: body.licensePlate,
    class: toDbClass(body.class),
    status: body.status,
  });

  return toPublicVehicle(updated);
}

export async function assignDriversToVehicleService(
  vehicleId: string,
  driverIds: string[],
) {
  const vehicle = await findVehicleById(vehicleId);
  if (!vehicle) return null;

  await validateOrgAndDriversLink(vehicle.organizationId, driverIds);

  const updated = await setVehicleDrivers(vehicleId, driverIds);
  return toPublicVehicle(updated);
}

export async function deleteVehicleService(id: string) {
  const data = await findVehicleById(id);

  if (!data) return null;

  await deleteVehicleById(id);
  return true;
}
