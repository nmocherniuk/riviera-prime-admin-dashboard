import axios from "axios";
import { api } from "./api";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import type { Partner } from "../features/partners/Security/data/types";
import type { DriverOrganizationFormValues } from "../features/partners/Drivers/components/drivers/DriverOrganizationManagementModal";
import type { PartnerFormValues } from "../features/partners/Security/components/PartnerManagementModal";

export type OrganizationType = "CHAUFFEUR" | "SECURITY";

export type OrganizationDto = {
  id: string;
  title: string;
  email: string;
  phone: string;
  contactPerson: string;
  serviceArea: string;
  status: "active" | "inactive";
  type: OrganizationType;
  createdAt: string;
};

export type CreateOrganizationBody = {
  title: string;
  email: string;
  phone: string;
  contactPerson: string;
  serviceArea: string;
  status: "active" | "inactive";
  type: OrganizationType;
};

export type UpdateOrganizationBody = Omit<CreateOrganizationBody, "type">;

export function dtoToDriverOrganization(o: OrganizationDto): DriverOrganization {
  return {
    id: o.id,
    organizationName: o.title,
    contactPerson: o.contactPerson,
    email: o.email,
    phone: o.phone,
    serviceArea: o.serviceArea,
    status: o.status,
  };
}

export function dtoToPartner(o: OrganizationDto): Partner {
  return {
    id: o.id,
    companyName: o.title,
    contactPerson: o.contactPerson,
    email: o.email,
    phone: o.phone,
    locationServiceArea: o.serviceArea,
    status: o.status,
  };
}

export function driverFormToCreateBody(
  values: DriverOrganizationFormValues,
): CreateOrganizationBody {
  return {
    title: values.organizationName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    contactPerson: values.contactPerson.trim(),
    serviceArea: values.serviceArea.trim(),
    status: values.status,
    type: "CHAUFFEUR",
  };
}

export function partnerFormToCreateBody(
  values: PartnerFormValues,
): CreateOrganizationBody {
  return {
    title: values.companyName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    contactPerson: values.contactPerson.trim(),
    serviceArea: values.locationServiceArea.trim(),
    status: values.status,
    type: "SECURITY",
  };
}

export function driverFormToUpdateBody(
  values: DriverOrganizationFormValues,
): UpdateOrganizationBody {
  return {
    title: values.organizationName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    contactPerson: values.contactPerson.trim(),
    serviceArea: values.serviceArea.trim(),
    status: values.status,
  };
}

export function partnerFormToUpdateBody(
  values: PartnerFormValues,
): UpdateOrganizationBody {
  return {
    title: values.companyName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    contactPerson: values.contactPerson.trim(),
    serviceArea: values.locationServiceArea.trim(),
    status: values.status,
  };
}

export async function listOrganizations(type: OrganizationType) {
  const { data } = await api.get<{ organizations: OrganizationDto[] }>(
    "/organizations",
    { params: { type } },
  );
  return data.organizations;
}

export async function getOrganization(id: string, type?: OrganizationType) {
  const { data } = await api.get<{ organization: OrganizationDto }>(
    `/organizations/${id}`,
    { params: type ? { type } : {} },
  );
  return data.organization;
}

export async function createOrganization(body: CreateOrganizationBody) {
  const { data } = await api.post<{ organization: OrganizationDto }>(
    "/organizations",
    body,
  );
  return data.organization;
}

export async function updateOrganization(
  id: string,
  body: UpdateOrganizationBody,
  type?: OrganizationType,
) {
  const { data } = await api.patch<{ organization: OrganizationDto }>(
    `/organizations/${id}`,
    body,
    { params: type ? { type } : {} },
  );
  return data.organization;
}

export async function deleteOrganization(id: string, type?: OrganizationType) {
  await api.delete(`/organizations/${id}`, {
    params: type ? { type } : {} },
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed",
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
