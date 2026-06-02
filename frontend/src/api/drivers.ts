import type { Driver } from "../features/partners/Drivers/components/drivers/types";
import { api } from "./api";


export async function listDrivers(organizationId?: string) {
  const { data } = await api.get<{ drivers: Driver[] }>("/drivers", {
    params: organizationId ? { organizationId } : {},
  });
  return data.drivers;
}

export async function createDriver(body: Driver) {
  const { data } = await api.post<{ driver: Driver }>("/drivers", body);
  return data.driver;
}

export async function updateDriver(
  id: string,
  body: Driver,
) {
  const { data } = await api.patch<{ driver: Driver }>(`/drivers/${id}`, body);
  return data.driver;
}

export async function deleteDriver(id: string) {
  await api.delete(`/drivers/${id}`);
}

export type DriverEarningsSummary = {
  totalEarned: number;
  availableBalance: number;
  pending: number;
  currency: "EUR";
};

export async function getDriverEarnings(id: string) {
  const { data } = await api.get<DriverEarningsSummary>(`/drivers/${id}/earnings`);
  return data;
}

export async function sendDriverTestWhatsApp(id: string) {
  const { data } = await api.post<{ ok: boolean; message: string }>(
    `/drivers/${id}/send-test-whatsapp`,
  );
  return data;
}
