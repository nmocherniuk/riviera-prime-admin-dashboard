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
import { sendInteractiveReplyWithMenu } from "../whatsapp/whatsapp.service.js";
import { mapDriverForApi } from "./driver.utils.js";

export async function listDrivers(organizationId?: string) {
  const data = await findDriversByOrganizationId(organizationId);

  const synced = await Promise.all(
    data.map(async (driver) => {
      const completed = await syncDriverStripeOnboardingStatus({
        id: driver.id,
        stripeAccountId: driver.stripeAccountId,
        stripeOnboardingCompleted: driver.stripeOnboardingCompleted,
      });
      const mapped = mapDriverForApi(driver);
      if (completed == null) return mapped;
      return {
        ...mapped,
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

  const mapped = mapDriverForApi(data);
  if (completed == null) return mapped;
  return { ...mapped, stripeOnboardingCompleted: completed };
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

export async function sendDriverTestWhatsAppMessage(driverId: string) {
  const driver = await findDriverById(driverId);
  if (!driver) {
    return { status: "not_found" as const };
  }
  const phone = driver.phone?.trim();
  if (!phone) {
    return { status: "missing_phone" as const };
  }

  const body = [
    "👋 Bonjour !",
    "",
    "Riviera Prime vous souhaite la bienvenue.",
    "Ceci est un message de test depuis le panneau admin.",
    "",
    "Utilisez le menu ci-dessous pour accéder rapidement aux actions chauffeur.",
  ].join("\n");

  await sendInteractiveReplyWithMenu(phone, body);
  return { status: "sent" as const, phone };
}
