import {
  createDriverRepo,
  deleteDriverById,
  findDriverById,
  findDriverByPhone,
  findDriversByOrganizationId,
  findDriversByVehicleIdRepo,
  updateDriverRepo,
  updateDriverStatus,
} from "./driver.repository.js";
import type { DriverData } from "./driver.types.js";
import { syncDriverStripeOnboardingStatus } from "../stripe/stripeConnect.service.js";
import {
  getDriverEarningsSummary,
  syncCompletedTransfersForDriver,
} from "../stripe/stripeEarnings.service.js";

export async function listDrivers(organizationId?: string) {
  const data = await findDriversByOrganizationId(organizationId);

  const synced = await Promise.all(
    data.map(async (driver) => {
      const completed = await syncDriverStripeOnboardingStatus({
        id: driver.id,
        stripeAccountId: driver.stripeAccountId,
        stripeOnboardingCompleted: driver.stripeOnboardingCompleted,
      });
      if (completed == null) return driver;
      return {
        ...driver,
        stripeOnboardingCompleted: completed,
      };
    }),
  );

  return synced;
}

export async function getDriverById(id: string) {
  const data = await findDriverById(id);

  if (!data) return null;

  const completed = await syncDriverStripeOnboardingStatus({
    id: data.id,
    stripeAccountId: data.stripeAccountId,
    stripeOnboardingCompleted: data.stripeOnboardingCompleted,
  });

  if (completed == null) return data;
  return { ...data, stripeOnboardingCompleted: completed };
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

export async function setDriverOnlineStatus(id: string, online: boolean) {
  return updateDriverStatus(id, online);
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

export async function getDriverEarnings(driverId: string) {
  await syncCompletedTransfersForDriver(driverId);
  return getDriverEarningsSummary(driverId);
}
