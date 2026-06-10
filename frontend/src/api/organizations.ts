import axios from "axios";
import { api } from "./api";
import { commonContent } from "../content/common";
import type {
  DriverOrganization,
} from "../features/partners/Drivers/data/types";
import type { SecurityOrganization } from "../features/partners/Security/data/types";

export type OrganizationType = "CHAUFFEUR" | "SECURITY";

export type Organization = DriverOrganization | SecurityOrganization;

export async function listOrganizations(type: OrganizationType) {
  const { data } = await api.get<{ organizations: Organization[] }>(
    "/organizations",
    { params: { type } },
  );
  return data.organizations;
}

export async function getOrganization(id: string) {
  const { data } = await api.get<{ organization: Organization }>(
    `/organizations/${id}`,
  );
  return data.organization;
}

export async function createOrganization(body: Organization) {
  const { data } = await api.post<{ organization: Organization }>(
    "/organizations",
    body
  );
  return data.organization;
}

export async function updateOrganization(
  id: string,
  body: Organization,
) {
  const { data } = await api.patch<{ organization: Organization }>(
    `/organizations/${id}`,
    body,
  );
  return data.organization;
}

export async function deleteOrganization(id: string) {
  await api.delete(`/organizations/${id}`, {
  });
}

export function getApiErrorMessage(
  error: unknown,
  fallback = commonContent.errors.requestFailed,
): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (typeof msg === "string") return msg;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
