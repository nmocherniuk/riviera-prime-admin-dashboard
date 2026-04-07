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
  class: VehicleApiClass;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
};
