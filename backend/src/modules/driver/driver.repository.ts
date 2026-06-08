import { prisma } from "../../lib/prisma.js";
import type { DriverData } from "./driver.types.js";

export const driverVehicleSelect = {
  id: true,
  vehicleName: true,
  licensePlate: true,
  color: true,
} as const;

const driverWithVehiclesInclude = {
  vehicles: {
    select: driverVehicleSelect,
    orderBy: { vehicleName: "asc" as const },
  },
} as const;

export async function createDriverRepo(data: DriverData) {
  return prisma.drivers.create({ data });
}

export async function findDriversByOrganizationId(organizationId?: string) {
  if (organizationId) {
    return prisma.drivers.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: driverWithVehiclesInclude,
    });
  }
  return prisma.drivers.findMany({
    orderBy: { createdAt: "desc" },
    include: driverWithVehiclesInclude,
  });
}

export async function findDriverById(id: string) {
  return prisma.drivers.findUnique({
    where: { id },
    include: driverWithVehiclesInclude,
  });
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

export async function updateDriverStatus(id: string, status: boolean) {
  return prisma.drivers.update({
    where: { id },
    data: { status },
  });
}

export async function updateDriverStripeOnboardingCompleted(
  id: string,
  stripeOnboardingCompleted: boolean,
) {
  return prisma.drivers.update({
    where: { id },
    data: { stripeOnboardingCompleted },
  });
}

export async function findDriverByPhone(phone: string) {
  return prisma.drivers.findFirst({ where: { phone } });
}

export async function findDriversByVehicleIdRepo(vehicleId: string) {
  return prisma.drivers.findMany({
    where: { vehicles: { some: { id: vehicleId } } },
  });
}
