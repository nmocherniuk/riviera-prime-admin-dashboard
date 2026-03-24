import type {
  Organizations,
  OrganizationType,
} from "../../generated/prisma/client.js";
import {
  createOrganization as createOrganizationRepo,
  deleteOrganizationById,
  findOrganizationById,
  findOrganizationsByType,
  updateOrganization as updateOrganizationRepo,
  type CreateOrganizationData,
} from "./organization.repository.js";

export type PublicOrganization = {
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

function statusFromBool(status: boolean): "active" | "inactive" {
  return status ? "active" : "inactive";
}

export function toPublicOrganization(row: Organizations): PublicOrganization {
  return {
    id: row.id,
    title: row.title,
    email: row.email,
    phone: row.phone,
    contactPerson: row.contactPerson,
    serviceArea: row.serviceArea,
    status: statusFromBool(row.status),
    type: row.type,
    createdAt: row.createdAt.toISOString(),
  };
}

export function statusInputToBool(status: "active" | "inactive"): boolean {
  return status === "active";
}

export async function createOrganization(
  input: Omit<CreateOrganizationData, "status"> & {
    status: "active" | "inactive";
  },
) {
  const data: CreateOrganizationData = {
    ...input,
    status: statusInputToBool(input.status),
  };
  const row = await createOrganizationRepo(data);
  return toPublicOrganization(row);
}

export async function listOrganizations(type: OrganizationType) {
  const rows = await findOrganizationsByType(type);
  return rows.map(toPublicOrganization);
}

export async function getOrganizationById(
  id: string,
  typeFilter?: OrganizationType,
) {
  const row = await findOrganizationById(id);
  if (!row) {
    return null;
  }
  if (typeFilter !== undefined && row.type !== typeFilter) {
    return null;
  }
  return toPublicOrganization(row);
}

export async function updateOrganization(
  id: string,
  input: Omit<CreateOrganizationData, "type" | "status"> & {
    status: "active" | "inactive";
  },
  typeFilter?: OrganizationType,
) {
  const row = await findOrganizationById(id);
  if (!row) {
    return null;
  }
  if (typeFilter !== undefined && row.type !== typeFilter) {
    return null;
  }
  const updated = await updateOrganizationRepo(id, {
    title: input.title,
    email: input.email,
    phone: input.phone,
    contactPerson: input.contactPerson,
    serviceArea: input.serviceArea,
    status: statusInputToBool(input.status),
  });
  return toPublicOrganization(updated);
}

export async function deleteOrganization(
  id: string,
  typeFilter?: OrganizationType,
) {
  const row = await findOrganizationById(id);
  if (!row) {
    return null;
  }
  if (typeFilter !== undefined && row.type !== typeFilter) {
    return null;
  }
  await deleteOrganizationById(id);
  return true;
}
