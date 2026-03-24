import { prisma } from "../../lib/prisma.js";
import {
  findAllVehiclesWithPricing,
  upsertVehiclePricing,
} from "./pricing.repository.js";

const DEFAULT_PER_HOUR = "120.00";
const DEFAULT_PER_KM = "2.50";

export type VehiclePricingRow = {
  vehicle: {
    id: string;
    vehicleName: string;
    licensePlate: string;
    class: "Comfort" | "Business" | "Van";
  };
  perHour: string;
  perKm: string;
};

function toPublicClass(value: "COMFORT" | "BUSINESS" | "VAN") {
  if (value === "COMFORT") return "Comfort" as const;
  if (value === "BUSINESS") return "Business" as const;
  return "Van" as const;
}

export async function listVehiclePricing() {
  const rows = await findAllVehiclesWithPricing();
  return rows.map((row) => ({
    vehicle: {
      id: row.id,
      vehicleName: row.vehicleName,
      licensePlate: row.licensePlate,
      class: toPublicClass(row.class),
    },
    perHour: row.pricing?.perHour.toString() ?? DEFAULT_PER_HOUR,
    perKm: row.pricing?.perKm.toString() ?? DEFAULT_PER_KM,
  }));
}

export async function saveVehiclePricing(
  vehicleId: string,
  perHour: number,
  perKm: number,
) {
  const vehicle = await prisma.vehicles.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return null;

  await upsertVehiclePricing(vehicleId, perHour, perKm);
  return true;
}
