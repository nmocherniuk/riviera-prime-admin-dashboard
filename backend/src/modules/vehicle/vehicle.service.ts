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
} from "./vehicle.repository.js";
import type { CreateVehicleBody } from "./vehicle.schemas.js";
import type { VehicleJson } from "./vehicle.types.js";
import { toDbClass, toPublicClass } from "./vehicle.utils.js";


function toPublicVehicle(row: Vehicles): VehicleJson {
  return {
    id: row.id,
    organizationId: row.organizationId,
    driverId: row.driverId,
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

async function validateOrgAndDriverLink(
  organizationId: string | null | undefined,
  driverId?: string | null,
) {
  const orgId = organizationId ?? null;
  const drvId = driverId ?? null;

  if (orgId) {
    const org = await prisma.organizations.findUnique({ where: { id: orgId } });
    if (!org) {
      throw new Error("Organization not found");
    }
  }

  if (!drvId) return;

  const driver = await prisma.drivers.findUnique({ where: { id: drvId } });
  if (!driver) {
    throw new Error("Driver not found");
  }
  if (orgId && driver.organizationId !== orgId) {
    throw new Error("Driver does not belong to organization");
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
  const driverId = body.driverId ?? null;

  await validateOrgAndDriverLink(organizationId, driverId);

  const row = await createVehicleRepo({
    organizationId,
    driverId,
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
    driverId: string | null;
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
  const driverId = body.driverId ?? null;

  await validateOrgAndDriverLink(organizationId, driverId);

  const updated = await updateVehicleRepo(id, {
    organizationId,
    driverId,
    vehicleName: body.vehicleName,
    year: body.year,
    color: body.color,
    licensePlate: body.licensePlate,
    class: toDbClass(body.class),
    status: body.status,
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
  const data = await findVehicleById(id);

  if (!data) return null;

  await deleteVehicleById(id);
  return true;
}
