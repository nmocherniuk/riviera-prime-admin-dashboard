import { api } from "./api";
import type { DriverFormValues } from "../features/partners/Drivers/components/drivers/DriverManagementModal";
import type {
  FleetClass,
  FleetStatus,
  FleetVehicle,
} from "../features/Fleet/data/dummyFleet";
import type { FleetFormValues } from "../features/Fleet/components/FleetManagementModal";

export type VehicleDto = {
  id: string;
  organizationId: string;
  driverId: string | null;
  vehicleName: string;
  yearColor: string;
  licensePlate: string;
  class: FleetClass;
  status: FleetStatus;
  nextService: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateVehicleBody = {
  organizationId: string;
  driverId?: string | null;
  vehicleName: string;
  yearColor: string;
  licensePlate: string;
  class: FleetClass;
  status: FleetStatus;
  nextService: string;
};

export type UpdateVehicleBody = Omit<CreateVehicleBody, "organizationId">;

export function dtoToFleetVehicle(dto: VehicleDto): FleetVehicle {
  return {
    id: dto.id,
    organizationId: dto.organizationId,
    driverId: dto.driverId,
    vehicleName: dto.vehicleName,
    yearColor: dto.yearColor,
    licensePlate: dto.licensePlate,
    class: dto.class,
    status: dto.status,
    nextService: dto.nextService,
  };
}

export function fleetFormToCreateBody(values: FleetFormValues): CreateVehicleBody {
  return {
    organizationId: values.organizationId.trim(),
    driverId: values.driverId.trim() || null,
    vehicleName: values.vehicleName.trim(),
    yearColor: values.yearColor.trim(),
    licensePlate: values.licensePlate.trim(),
    class: values.class,
    status: values.status,
    nextService: values.nextService.trim(),
  };
}

export function fleetFormToUpdateBody(values: FleetFormValues): UpdateVehicleBody {
  return {
    driverId: values.driverId.trim() || null,
    vehicleName: values.vehicleName.trim(),
    yearColor: values.yearColor.trim(),
    licensePlate: values.licensePlate.trim(),
    class: values.class,
    status: values.status,
    nextService: values.nextService.trim(),
  };
}

export async function listVehicles(filters?: { organizationId?: string; driverId?: string }) {
  const { data } = await api.get<{ vehicles: VehicleDto[] }>("/vehicles", {
    params: filters ?? {},
  });
  return data.vehicles;
}

export async function createVehicle(body: CreateVehicleBody) {
  const { data } = await api.post<{ vehicle: VehicleDto }>("/vehicles", body);
  return data.vehicle;
}

export async function updateVehicle(id: string, body: UpdateVehicleBody) {
  const { data } = await api.patch<{ vehicle: VehicleDto }>(`/vehicles/${id}`, body);
  return data.vehicle;
}

export async function assignDriverToVehicle(vehicleId: string, driverId: string | null) {
  const { data } = await api.patch<{ vehicle: VehicleDto }>(
    `/vehicles/${vehicleId}/assign-driver`,
    { driverId },
  );
  return data.vehicle;
}

export async function deleteVehicle(id: string) {
  await api.delete(`/vehicles/${id}`);
}

export function getVehicleIdFromDriverForm(values: DriverFormValues): string {
  return values.vehicleId.trim();
}
