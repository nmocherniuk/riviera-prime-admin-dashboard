import type {
  VehicleClass,
  VehicleStatus,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export const vehicleWithDriversInclude = {
  drivers: { select: { id: true } },
} as const;

export type VehicleWithDriverIds = NonNullable<
  Awaited<ReturnType<typeof findVehicleById>>
>;

export async function createVehicle(data: {
  organizationId: string | null;
  vehicleName: string;
  year: string;
  color: string;
  licensePlate: string;
  class: VehicleClass;
  status: VehicleStatus;
  driverIds?: string[];
}) {
  const driverIds = data.driverIds;
  return prisma.vehicles.create({
    data: {
      organizationId: data.organizationId,
      vehicleName: data.vehicleName,
      year: data.year,
      color: data.color,
      licensePlate: data.licensePlate,
      class: data.class,
      status: data.status,
      ...(driverIds && driverIds.length > 0
        ? { drivers: { connect: driverIds.map((id) => ({ id })) } }
        : {}),
    },
    include: vehicleWithDriversInclude,
  });
}

export async function findVehicles(filters?: {
  organizationId?: string;
  driverId?: string;
}) {
  const where: {
    organizationId?: string;
    drivers?: { some: { id: string } };
  } = {};
  if (filters?.organizationId !== undefined) {
    where.organizationId = filters.organizationId;
  }
  if (filters?.driverId !== undefined) {
    where.drivers = { some: { id: filters.driverId } };
  }

  return prisma.vehicles.findMany({
    where,
    include: vehicleWithDriversInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function findVehicleById(id: string) {
  return prisma.vehicles.findUnique({
    where: { id },
    include: vehicleWithDriversInclude,
  });
}

export async function updateVehicle(
  id: string,
  data: {
    organizationId: string | null;
    vehicleName: string;
    year: string;
    color: string;
    licensePlate: string;
    class: VehicleClass;
    status: VehicleStatus;
    driverIds: string[];
  },
) {
  const { driverIds, ...scalar } = data;
  return prisma.vehicles.update({
    where: { id },
    data: {
      organizationId: scalar.organizationId,
      vehicleName: scalar.vehicleName,
      year: scalar.year,
      color: scalar.color,
      licensePlate: scalar.licensePlate,
      class: scalar.class,
      status: scalar.status,
      drivers: { set: driverIds.map((did) => ({ id: did })) },
    },
    include: vehicleWithDriversInclude,
  });
}

export async function setVehicleDrivers(id: string, driverIds: string[]) {
  return prisma.vehicles.update({
    where: { id },
    data: {
      drivers: { set: driverIds.map((did) => ({ id: did })) },
    },
    include: vehicleWithDriversInclude,
  });
}

export async function deleteVehicleById(id: string) {
  return prisma.vehicles.delete({ where: { id } });
}
