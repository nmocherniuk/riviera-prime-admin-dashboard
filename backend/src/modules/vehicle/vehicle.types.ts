import type { VehicleStatus } from "../../generated/prisma/enums.js";

export type VehicleApiClass = "Comfort" | "Business" | "Van";

export type VehicleJson = {
  id: string;
  organizationId: string | null;
  driverIds: string[];
  vehicleName: string;
  year: string;
  color: string;
  licensePlate: string;
  imageUrl: string | null;
  description: string;
  passengers: number | null;
  baggageCount: number | null;
  vehicleType: string;
  transmission: string;
  interior: string;
  amenities: string[];
  class: VehicleApiClass;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
};

export type PublicVehicleJson = {
  id: string;
  vehicleName: string;
  class: Lowercase<VehicleApiClass>;
  year: string;
  imageUrl: string | null;
  description: string;
  passengers: number | null;
  baggageCount: number | null;
  vehicleType: string;
  transmission: string;
  interior: string;
  amenities: string[];
  createdAt?: string;
};
