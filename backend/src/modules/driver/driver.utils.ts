import type { Prisma } from "../../generated/prisma/client.js";
import { driverVehicleSelect } from "./driver.repository.js";

export type DriverWithLinkedVehicles = Prisma.DriversGetPayload<{
  include: {
    vehicles: { select: typeof driverVehicleSelect };
  };
}>;

export type DriverApiRow = Omit<DriverWithLinkedVehicles, "vehicles"> & {
  vehicleId?: string;
};

export function isPrismaKnownError(
  error: unknown,
): error is { code: string; meta?: { target?: unknown } } {
  return typeof error === "object" && error !== null && "code" in error;
}

/** Prefer fleet-linked vehicle over legacy text fields on the driver row. */
export function mapDriverForApi(row: DriverWithLinkedVehicles): DriverApiRow {
  const { vehicles, ...driver } = row;
  const primary = vehicles[0];
  if (!primary) return driver;

  const vehicleLabel =
    vehicles.length > 1
      ? `${primary.vehicleName} (+${vehicles.length - 1})`
      : primary.vehicleName;

  return {
    ...driver,
    vehicleId: primary.id,
    vehicle: vehicleLabel,
    vehiclePlate: primary.licensePlate,
    vehicleColor: primary.color,
  };
}
