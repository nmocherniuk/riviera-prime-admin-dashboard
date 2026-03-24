import type { FleetVehicle } from "../../Fleet/data/dummyFleet";

export type VehiclePricing = {
  vehicle: FleetVehicle;
  perHour: string;
  perKm: string;
};
