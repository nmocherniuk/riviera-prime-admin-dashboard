import { prisma } from "../../lib/prisma.js";

export async function findAllVehiclesWithPricing() {
  return prisma.vehicles.findMany({
    include: { pricing: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertVehiclePricing(
  vehicleId: string,
  data: {
    perHour: number;
    perKm: number;
    minimumFare: number;
    holidaySurchargePercent: number;
    nightSurchargePercent: number;
  },
) {
  return prisma.vehiclePricings.upsert({
    where: { vehicleId },
    create: { vehicleId, ...data },
    update: data,
  });
}
