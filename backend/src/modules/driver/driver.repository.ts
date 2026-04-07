import { prisma } from "../../lib/prisma.js";
import type { DriverData } from "./driver.types.js";

export async function createDriverRepo(data: DriverData) {
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

export async function updateDriverRepo(id: string, data: DriverData) {
  return prisma.drivers.update({
    where: { id },
    data,
  });
}

export async function deleteDriverById(id: string) {
  return prisma.drivers.delete({ where: { id } });
}

export async function findDriverByPhone(phone: string) {
  return prisma.drivers.findFirst({ where: { phone } });
}

export async function findDriversByVehicleIdRepo(vehicleId: string) {
  return prisma.drivers.findMany({
    where: { vehicles: { some: { id: vehicleId } } },
  });
}
