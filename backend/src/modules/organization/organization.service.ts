import type { OrganizationType } from "../../generated/prisma/client.js";
import {
  createGeneralOrganization,
  deleteOrganizationById,
  findOrganizationById,
  findOrganizationsByType,
  updateOrganizationRow,
  upsertDriverOrganizationDetails,
  upsertSecurityOrganizationDetails,
} from "./organization.repository.js";
import type {
  DriverOrganizationDetails,
  GeneralOrganizationPayload,
  NewOrganization,
  Organization,
} from "./organization.types.js";

import { stripUndefined } from "./organization.utils.js";





// export function toPublicOrganization(row: Organizations & {
//   chauffeurDetails?: ChauffeurOrganizationDetailsUpsertData | null;
//   securityDetails?: SecurityOrganizationDetailsUpsertData | null;
// }): PublicOrganization {
//   return {
//     id: row.id,
//     title: row.title,
//     email: row.email,
//     phone: row.phone,
//     contactPerson: row.contactPerson,
//     serviceAreas: row.serviceAreas,
//     status: statusFromBool(row.status),
//     type: row.type,
//     createdAt: row.createdAt.toISOString(),
//     chauffeurDetails: row.chauffeurDetails ?? null,
//     securityDetails: row.securityDetails ?? null,
//   };
// }




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

  // CHAUFFEUR extension table
  if (data.type === "CHAUFFEUR" && data.chauffeurDetails) {
    await upsertDriverOrganizationDetails(
      generalOrganization.id,
      stripUndefined(data.chauffeurDetails),
    );
  }

  // SECURITY extension table
  // if (input.type === "SECURITY" && input.securityDetails) {
  //   await upsertSecurityOrganizationDetails(
  //     row.id,
  //     stripUndefined(input.securityDetails),
  //   );
  //   const fresh = await findOrganizationById(row.id);
  //   return fresh ? toPublicOrganization(fresh) : toPublicOrganization(row);
  // }

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
    await upsertDriverOrganizationDetails(
      id,
      stripUndefined(data.chauffeurDetails) as DriverOrganizationDetails,
    );
  }

  if (row.type === "SECURITY" && data.securityDetails) {
    await upsertSecurityOrganizationDetails(
      id,
      stripUndefined(data.securityDetails),
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
