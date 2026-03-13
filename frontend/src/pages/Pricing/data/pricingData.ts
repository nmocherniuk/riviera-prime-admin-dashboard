import type { FleetVehicle } from "../../Fleet/data/dummyFleet";
import { DUMMY_FLEET } from "../../Fleet/data/dummyFleet";

export type VehiclePricing = {
  vehicle: FleetVehicle;
  perHour: string;
  perKm: string;
};

const DEFAULT_PER_HOUR = "120";
const DEFAULT_PER_KM = "2.50";

export function buildPricingList(): VehiclePricing[] {
  return DUMMY_FLEET.map((v) => ({
    vehicle: v,
    perHour: DEFAULT_PER_HOUR,
    perKm: DEFAULT_PER_KM,
  }));
}
