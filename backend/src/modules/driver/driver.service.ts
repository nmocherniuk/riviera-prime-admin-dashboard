import {
  createDriverRepo,
  deleteDriverById,
  findDriverById,
  findDriverByPhone,
  findDriversByOrganizationId,
  findDriversByVehicleIdRepo,
  updateDriverRepo,
} from "./driver.repository.js";
import type { DriverData } from "./driver.types.js";

export async function listDrivers(organizationId?: string) {
  const data = await findDriversByOrganizationId(organizationId);

  return data;
}

export async function getDriverById(id: string) {
  const data = await findDriverById(id);

  if (!data) return null;

  return data;
}

export async function createDriver(data: DriverData) {
  const driver = await createDriverRepo({
    ...data,
  });

  return { ...data, id: driver.id };
}

export async function updateDriver(id: string, data: DriverData) {
  const driver = await updateDriverRepo(id, data);

  return { ...data, id: driver.id };
}

export async function deleteDriver(id: string) {
  const row = await findDriverById(id);

  if (!row) return null;

  await deleteDriverById(id);

  return row.id;
}

export async function getDriverByPhone(phone: string) {
  const data = await findDriverByPhone(phone);

  if (!data) return null;

  return data;
}

export async function getDriversByVehicleId(vehicleId: string) {
  const data = await findDriversByVehicleIdRepo(vehicleId);

  if (!data) return [];

  return data;
}
