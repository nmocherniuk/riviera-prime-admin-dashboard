import type { OrganizationType } from "../../generated/prisma/client.js";
import {
  createGeneralOrganization,
  deleteOrganizationById,
  findOrganizationById,
  findOrganizationsByType,
  updateOrganizationRow,
  upsertOrganizationDetails,
} from "./organization.repository.js";
import type {
  DriverOrganizationDetails,
  GeneralOrganizationPayload,
  NewOrganization,
  Organization,
  SecurityOrganizationDetails,
} from "./organization.types.js";

import { stripUndefined } from "./organization.utils.js";


export async function createOrganization(
  data: NewOrganization,
): Promise<Organization> {
  const generalOrganizationPayload: GeneralOrganizationPayload = {
    organizationName: data.organizationName,
    email: data.email,
    phone: data.phone,
    contactPerson: data.contactPerson,
    serviceAreas: data.serviceAreas,
    status: data.status,
    type: data.type,
  };

  const generalOrganization = await createGeneralOrganization(generalOrganizationPayload);

  if (data.type === "CHAUFFEUR" && data.chauffeurDetails) {
    await upsertOrganizationDetails(
      generalOrganization.id,
      "CHAUFFEUR",
      stripUndefined(data.chauffeurDetails) as DriverOrganizationDetails,
    );
  }

  if (data.type === "SECURITY" && data.securityDetails) {
    await upsertOrganizationDetails(
      generalOrganization.id,
      "SECURITY",
      stripUndefined(data.securityDetails) as SecurityOrganizationDetails,
    );
  }

  return { ...data, id: generalOrganization.id };
}

export async function listOrganizations(type: OrganizationType) {
  const organizations = await findOrganizationsByType(type);
  return organizations;
}

export async function updateOrganization(
  id: string,
  data: Organization,
): Promise<Organization | null> {
  const row = await findOrganizationById(id);

  if (!row) {
    return null;
  }

  if (data.type !== undefined && row.type !== data.type) {
    return null;
  }

  await updateOrganizationRow(id, {
    organizationName: data.organizationName,
    email: data.email,
    phone: data.phone,
    contactPerson: data.contactPerson,
    serviceAreas: data.serviceAreas,
    status: data.status,
  });

  if (row.type === "CHAUFFEUR" && data.chauffeurDetails) {
    await upsertOrganizationDetails(
      id,
      "CHAUFFEUR",
      stripUndefined(data.chauffeurDetails) as DriverOrganizationDetails,
    );
  }

  if (row.type === "SECURITY" && data.securityDetails) {
    await upsertOrganizationDetails(
      id,
      "SECURITY",
      stripUndefined(data.securityDetails) as SecurityOrganizationDetails,
    );
  }

  return {
    ...data,
    id,
    type: row.type,
  };
}

export async function getOrganizationById(
  id: string,
) {
  const row = await findOrganizationById(id);

  if (!row) {
    return null;
  }

  return row;
}



export async function deleteOrganization(
  id: string,
) {
  const row = await findOrganizationById(id);

  if (!row) {
    return null;
  }

  await deleteOrganizationById(id);
  return true;
}
