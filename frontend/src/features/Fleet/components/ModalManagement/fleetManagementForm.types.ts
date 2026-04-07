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
  class: FleetClass;
  status: FleetStatus;
};

export type FleetFormValues = {
  driverBindings: DriverBindingRow[];
  vehicleName: string;
  year: string;
  color: string;
  licensePlate: string;
  class: FleetClass;
  status: FleetStatus;
};

export const FLEET_CLASSES: FleetClass[] = ["Comfort", "Business", "Van"];
export const FLEET_STATUSES: FleetStatus[] = ["ACTIVE", "INACTIVE"];
