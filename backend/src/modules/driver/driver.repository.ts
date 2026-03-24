import type { DriverStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export type CreateDriverData = {
  organizationId: string;
  name: string;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  todayShift: string;
};

export type UpdateDriverData = Omit<CreateDriverData, "organizationId">;

export async function createDriver(data: CreateDriverData) {
  return prisma.drivers.create({ data });
}

export async function findDriversByOrganizationId(organizationId?: string) {
  if (organizationId) {
    return prisma.drivers.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.drivers.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findDriverById(id: string) {
  return prisma.drivers.findUnique({ where: { id } });
}

export async function updateDriver(id: string, data: UpdateDriverData) {
  return prisma.drivers.update({
    where: { id },
    data,
  });
}

export async function deleteDriverById(id: string) {
  return prisma.drivers.delete({ where: { id } });
}
