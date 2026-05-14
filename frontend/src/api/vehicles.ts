import { api } from "./api";
import type {
  FleetFormValues,
  FleetVehicle,
} from "../features/Fleet/components/ModalManagement/fleetManagementForm.types";
import type { DriverFormValues } from "../features/partners/Drivers/components/drivers/types";
import { FormValuesToCreateBody } from "../features/Fleet/components/ModalManagement/fleetManagementForm.mapper";

export async function listVehicles(filters?: {
  organizationId?: string;
  driverId?: string;
}) {
  const { data } = await api.get<{ vehicles: FleetVehicle[] }>("/vehicles", {
    params: filters ?? {},
  });
  return data.vehicles;
}

export async function createVehicle(body: FleetVehicle) {
  const { data } = await api.post<{ vehicle: FleetVehicle }>("/vehicles", body);
  return data.vehicle;
}

export async function updateVehicle(
  id: string,
  body: Omit<FleetVehicle, "id">,
) {
  const { data } = await api.patch<{ vehicle: FleetVehicle }>(
    `/vehicles/${id}`,
    body,
  );
  return data.vehicle;
}

export async function assignDriverToVehicle(
  vehicleId: string,
  driverIds: string[],
) {
  const { data } = await api.patch<{ vehicle: FleetVehicle }>(
    `/vehicles/${vehicleId}/assign-driver`,
    { driverIds },
  );
  return data.vehicle;
}

export async function deleteVehicle(id: string) {
  await api.delete(`/vehicles/${id}`);
}

export function dtoToFleetVehicle(v: FleetVehicle): FleetVehicle {
  return v;
}

export function fleetFormToCreateBody(values: FleetFormValues): FleetVehicle {
  return FormValuesToCreateBody(values);
}

export function fleetFormToUpdateBody(
  values: FleetFormValues,
): Omit<FleetVehicle, "id"> {
  const b = FormValuesToCreateBody(values);
  return {
    organizationId: b.organizationId,
    driverIds: b.driverIds,
    vehicleName: b.vehicleName,
    year: b.year,
    color: b.color,
    licensePlate: b.licensePlate,
    imageUrl: b.imageUrl,
    description: b.description,
    passengers: b.passengers,
    baggageCount: b.baggageCount,
    vehicleType: b.vehicleType,
    transmission: b.transmission,
    interior: b.interior,
    amenities: b.amenities,
    class: b.class,
    status: b.status,
  };
}

export function getVehicleIdFromDriverForm(values: DriverFormValues): string {
  return (values.vehicleId ?? "").trim();
}
