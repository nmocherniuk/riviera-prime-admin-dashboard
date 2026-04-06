import type { VehicleClass } from "../../generated/prisma/enums.js";

export type PublicVehicleClass = "comfort" | "business" | "van";

export function toDbVehicleClass(v: PublicVehicleClass): VehicleClass {
  const m: Record<PublicVehicleClass, VehicleClass> = {
    comfort: "COMFORT",
    business: "BUSINESS",
    van: "VAN",
  };
  return m[v];
}

export function toPublicVehicleClass(v: VehicleClass | null): PublicVehicleClass | null {
  if (v === null) return null;
  const m: Record<VehicleClass, PublicVehicleClass> = {
    COMFORT: "comfort",
    BUSINESS: "business",
    VAN: "van",
  };
  return m[v];
}
