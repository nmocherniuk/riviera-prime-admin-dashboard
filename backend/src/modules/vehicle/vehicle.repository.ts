import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export async function createVehicle(data: Prisma.VehiclesUncheckedCreateInput) {
  return prisma.vehicles.create({ data });
}

export async function findVehicles(filters?: {
  organizationId?: string;
  driverId?: string;
}) {
  const where: { organizationId?: string; driverId?: string } = {};
  if (filters?.organizationId !== undefined) {
    where.organizationId = filters.organizationId;
  }
  if (filters?.driverId !== undefined) {
    where.driverId = filters.driverId;
  }

  return prisma.vehicles.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function findVehicleById(id: string) {
  return prisma.vehicles.findUnique({ where: { id } });
}

export async function updateVehicle(
  id: string,
  data: Prisma.VehiclesUncheckedUpdateInput,
) {
  return prisma.vehicles.update({
    where: { id },
    data,
  });
}

export async function assignDriverToVehicle(id: string, driverId: string | null) {
  return prisma.vehicles.update({
    where: { id },
    data: { driverId },
  });
}

export async function deleteVehicleById(id: string) {
  return prisma.vehicles.delete({ where: { id } });
}
