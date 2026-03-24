import { prisma } from "../../lib/prisma.js";

export async function findAllVehiclesWithPricing() {
  return prisma.vehicles.findMany({
    include: { pricing: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertVehiclePricing(
  vehicleId: string,
  perHour: number,
  perKm: number,
) {
  return prisma.vehiclePricings.upsert({
    where: { vehicleId },
    create: { vehicleId, perHour, perKm },
    update: { perHour, perKm },
  });
}
