import { api } from "./api";
import type { Driver, DriverStatus } from "../features/partners/Drivers/data/dummyDrivers";

export type DriverDto = {
  id: string;
  organizationId: string;
  name: string;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  earning: string;
  todayShift: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDriverBody = {
  organizationId: string;
  name: string;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  todayShift: string;
};

export type UpdateDriverBody = Omit<CreateDriverBody, "organizationId">;

export function dtoToDriver(dto: DriverDto, organizationName: string): Driver {
  return {
    id: dto.id,
    organizationId: dto.organizationId,
    organizationName,
    name: dto.name,
    vehicle: dto.vehicle,
    vehiclePlate: dto.vehiclePlate,
    vehicleColor: dto.vehicleColor,
    status: dto.status,
    rides: dto.rides,
    earning: dto.earning,
    todayShift: dto.todayShift,
  };
}

export function driverFormToCreateBody(
  values: {
    name: string;
    surname: string;
    vehicle: string;
  },
  organizationId: string,
): CreateDriverBody {
  const fullName = `${values.name} ${values.surname}`.trim();
  return {
    organizationId,
    name: fullName || "Unnamed driver",
    vehicle: values.vehicle.trim() || "Unknown vehicle",
    vehiclePlate: "N/A",
    vehicleColor: "N/A",
    status: "AVAILABLE",
    rides: 0,
    todayShift: "",
  };
}

export function driverFormToUpdateBody(
  values: {
    name: string;
    surname: string;
    vehicle: string;
  },
  current: Driver,
): UpdateDriverBody {
  const fullName = `${values.name} ${values.surname}`.trim();
  return {
    name: fullName || current.name,
    vehicle: values.vehicle.trim() || current.vehicle,
    vehiclePlate: current.vehiclePlate,
    vehicleColor: current.vehicleColor,
    status: current.status,
    rides: current.rides,
    todayShift: current.todayShift,
  };
}

export async function listDrivers(organizationId?: string) {
  const { data } = await api.get<{ drivers: DriverDto[] }>("/drivers", {
    params: organizationId ? { organizationId } : {},
  });
  return data.drivers;
}

export async function createDriver(body: CreateDriverBody) {
  const { data } = await api.post<{ driver: DriverDto }>("/drivers", body);
  return data.driver;
}

export async function updateDriver(
  id: string,
  body: UpdateDriverBody,
  organizationId?: string,
) {
  const { data } = await api.patch<{ driver: DriverDto }>(`/drivers/${id}`, body, {
    params: organizationId ? { organizationId } : {},
  });
  return data.driver;
}

export async function deleteDriver(id: string, organizationId?: string) {
  await api.delete(`/drivers/${id}`, {
    params: organizationId ? { organizationId } : {},
  });
}
