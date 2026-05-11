import type { FleetClass, FleetStatus } from "../../data/dummyFleet";

export type DriverBindingRow = {
  organizationId: string;
  driverId: string;
};

export const defaultFormValues: FleetFormValues = {
  driverBindings: [{ organizationId: "", driverId: "" }],
  vehicleName: "",
  year: "",
  color: "",
  licensePlate: "",
  imageUrl: "",
  description: "",
  passengers: "",
  baggageCount: "",
  vehicleType: "",
  transmission: "",
  interior: "",
  amenitiesText: "",
  class: "Business",
  status: "ACTIVE",
};

export type FleetVehicle = {
  id?: string;
  organizationId?: string | null;
  driverIds?: string[];
  vehicleName: string;
  year: string;
  color: string;
  licensePlate: string;
  imageUrl?: string | null;
  description?: string;
  passengers?: number | null;
  baggageCount?: number | null;
  vehicleType?: string;
  transmission?: string;
  interior?: string;
  amenities?: string[];
  class: FleetClass;
  status: FleetStatus;
};

export type FleetFormValues = {
  driverBindings: DriverBindingRow[];
  vehicleName: string;
  year: string;
  color: string;
  licensePlate: string;
  imageUrl: string;
  description: string;
  passengers: string;
  baggageCount: string;
  vehicleType: string;
  transmission: string;
  interior: string;
  amenitiesText: string;
  class: FleetClass;
  status: FleetStatus;
};

export const FLEET_CLASSES: FleetClass[] = ["Comfort", "Business", "Van"];
export const FLEET_STATUSES: FleetStatus[] = ["ACTIVE", "INACTIVE"];
