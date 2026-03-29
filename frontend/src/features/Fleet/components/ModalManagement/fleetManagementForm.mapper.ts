import { defaultFormValues, type FleetFormValues, type FleetVehicle } from "./fleetManagementForm.types";

export function fleetToFormValues(vehicle: FleetVehicle | null): FleetFormValues {
    if (!vehicle) return defaultFormValues;
    return {
        organizationId: vehicle.organizationId || "",
        driverId: vehicle.driverId || "",
        vehicleName: vehicle.vehicleName || "",
        year: vehicle.year || "",
        color: vehicle.color || "",
        licensePlate: vehicle.licensePlate || "",
        class: vehicle.class,
        status: vehicle.status,
    };
}

export function FormValuesToCreateBody(
    values: FleetFormValues,
): FleetVehicle {
    return {
        organizationId: values.organizationId.trim() || null,
        driverId: values.driverId.trim() || null,
        vehicleName: values.vehicleName.trim(),
        year: values.year.trim(),
        color: values.color.trim(),
        licensePlate: values.licensePlate.trim(),
        class: values.class,
        status: values.status,
    };
}
