import type { Driver } from "./types";
import { commonContent } from "../../../../../content/common";
import { driverAgentsContent } from "../../../../../content/driverAgents";

const PLACEHOLDER_VEHICLE = driverAgentsContent.vehicle.unknown;
const PLACEHOLDER_FIELD = commonContent.notApplicable;

function isPlaceholder(value: string | null | undefined): boolean {
  const v = value?.trim();
  return !v || v === PLACEHOLDER_FIELD;
}

/** Fleet link or manually entered vehicle (not create-form placeholders). */
export function hasAssignedVehicle(driver: Driver): boolean {
  if (driver.vehicleId) return true;

  const name = driver.vehicle?.trim();
  if (!name || name === PLACEHOLDER_VEHICLE) return false;

  if (!isPlaceholder(driver.vehiclePlate)) return true;
  if (!isPlaceholder(driver.vehicleColor)) return true;

  return true;
}

export function driverVehicleName(driver: Driver): string {
  return hasAssignedVehicle(driver) ? (driver.vehicle?.trim() ?? "—") : "—";
}

export function driverVehicleSubtitle(driver: Driver): string | null {
  if (!hasAssignedVehicle(driver)) return null;

  const color = driver.vehicleColor?.trim();
  const plate = driver.vehiclePlate?.trim();
  const parts = [
    !isPlaceholder(color) ? color : null,
    !isPlaceholder(plate) ? plate : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}
