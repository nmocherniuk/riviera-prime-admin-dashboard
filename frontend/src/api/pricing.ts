import { api } from "./api";
import type { VehiclePricing } from "../features/Pricing/data/pricingData";

export type PricingRowDto = {
  vehicle: {
    id: string;
    vehicleName: string;
    licensePlate: string;
    class: "Comfort" | "Business" | "Van";
  };
  perHour: string;
  perKm: string;
  minimumFare: string;
  holidaySurchargePercent: string;
  nightSurchargePercent: string;
};

export async function listPricingRows() {
  const { data } = await api.get<{ rows: PricingRowDto[] }>("/pricing");
  return data.rows;
}

export async function savePricingRow(
  vehicleId: string,
  payload: {
    perHour: number;
    perKm: number;
    minimumFare: number;
    holidaySurchargePercent: number;
    nightSurchargePercent: number;
  },
) {
  const { data } = await api.patch<{ ok: true }>(`/pricing/${vehicleId}`, payload);
  return data;
}

export function dtoToVehiclePricing(row: PricingRowDto): VehiclePricing {
  return {
    vehicle: {
      id: row.vehicle.id,
      organizationId: null,
      driverIds: [],
      vehicleName: row.vehicle.vehicleName,
      year: "",
      color: "",
      licensePlate: row.vehicle.licensePlate,
      class: row.vehicle.class,
      status: "ACTIVE",
    },
    perHour: row.perHour,
    perKm: row.perKm,
    minimumFare: row.minimumFare,
    holidaySurchargePercent: row.holidaySurchargePercent,
    nightSurchargePercent: row.nightSurchargePercent,
  };
}
