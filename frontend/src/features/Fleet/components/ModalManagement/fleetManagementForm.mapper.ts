import {
  defaultFormValues,
  type FleetFormValues,
  type FleetVehicle,
} from "./fleetManagementForm.types";

function uniqueDriverIds(bindings: FleetFormValues["driverBindings"]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const b of bindings) {
    const id = b.driverId.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/** Vehicle has a single organizationId — take first non-empty binding. */
function resolveVehicleOrganizationId(
  bindings: FleetFormValues["driverBindings"],
): string | null {
  const found = bindings.find((b) => b.organizationId.trim().length > 0);
  return found ? found.organizationId.trim() : null;
}

export function fleetToFormValues(
  vehicle: FleetVehicle | null,
): FleetFormValues {
  if (!vehicle) return defaultFormValues;
  const ids = vehicle.driverIds ?? [];
  const org = vehicle.organizationId || "";
  const driverBindings =
    ids.length > 0
      ? ids.map((driverId) => ({
          organizationId: org,
          driverId,
        }))
      : [{ organizationId: org, driverId: "" }];

  return {
    driverBindings,
    vehicleName: vehicle.vehicleName || "",
    year: vehicle.year || "",
    color: vehicle.color || "",
    licensePlate: vehicle.licensePlate || "",
    class: vehicle.class,
    status: vehicle.status,
  };
}

export function FormValuesToCreateBody(values: FleetFormValues): FleetVehicle {
  return {
    organizationId: resolveVehicleOrganizationId(values.driverBindings),
    driverIds: uniqueDriverIds(values.driverBindings),
    vehicleName: values.vehicleName.trim(),
    year: values.year.trim(),
    color: values.color.trim(),
    licensePlate: values.licensePlate.trim(),
    class: values.class,
    status: values.status,
  };
}
