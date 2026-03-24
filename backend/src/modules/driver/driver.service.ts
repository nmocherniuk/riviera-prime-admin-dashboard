import type { Drivers, DriverStatus } from "../../generated/prisma/client.js";
import {
  createDriver as createDriverRepo,
  deleteDriverById,
  findDriverById,
  findDriversByOrganizationId,
  updateDriver as updateDriverRepo,
  type CreateDriverData,
} from "./driver.repository.js";

export type PublicDriverStatus = "AVAILABLE" | "ON RIDE" | "OFFLINE";

export type PublicDriver = {
  id: string;
  organizationId: string;
  name: string;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: PublicDriverStatus;
  rides: number;
  earning: string;
  todayShift: string;
  createdAt: string;
  updatedAt: string;
};

function toPublicStatus(status: DriverStatus): PublicDriverStatus {
  if (status === "ON_RIDE") return "ON RIDE";
  return status;
}

function toDbStatus(status: PublicDriverStatus): DriverStatus {
  if (status === "ON RIDE") return "ON_RIDE";
  return status;
}

function formatEarning(rides: number): string {
  return `$${(rides * 27.5).toFixed(2)}`;
}

export function toPublicDriver(row: Drivers): PublicDriver {
  return {
    id: row.id,
    organizationId: row.organizationId,
    name: row.name,
    vehicle: row.vehicle,
    vehiclePlate: row.vehiclePlate,
    vehicleColor: row.vehicleColor,
    status: toPublicStatus(row.status),
    rides: row.rides,
    earning: formatEarning(row.rides),
    todayShift: row.todayShift,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listDrivers(organizationId?: string) {
  const rows = await findDriversByOrganizationId(organizationId);
  return rows.map(toPublicDriver);
}

export async function getDriverById(id: string, organizationId?: string) {
  const row = await findDriverById(id);
  if (!row) return null;
  if (organizationId && row.organizationId !== organizationId) return null;
  return toPublicDriver(row);
}

export async function createDriver(
  input: Omit<CreateDriverData, "status"> & { status: PublicDriverStatus },
) {
  const row = await createDriverRepo({
    ...input,
    status: toDbStatus(input.status),
  });
  return toPublicDriver(row);
}

export async function updateDriver(
  id: string,
  input: Omit<CreateDriverData, "organizationId" | "status"> & {
    status: PublicDriverStatus;
  },
  organizationId?: string,
) {
  const row = await findDriverById(id);
  if (!row) return null;
  if (organizationId && row.organizationId !== organizationId) return null;

  const updated = await updateDriverRepo(id, {
    name: input.name,
    vehicle: input.vehicle,
    vehiclePlate: input.vehiclePlate,
    vehicleColor: input.vehicleColor,
    status: toDbStatus(input.status),
    rides: input.rides,
    todayShift: input.todayShift,
  });

  return toPublicDriver(updated);
}

export async function deleteDriver(id: string, organizationId?: string) {
  const row = await findDriverById(id);
  if (!row) return null;
  if (organizationId && row.organizationId !== organizationId) return null;
  await deleteDriverById(id);
  return true;
}
