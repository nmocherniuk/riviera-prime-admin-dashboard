import type { OrganizationType } from "../../generated/prisma/client.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { DriverOrganizationDetails, GeneralOrganizationPayload, SecurityOrganizationDetails, UpdateOrganizationData } from "./organization.types.js";



export async function createGeneralOrganization(data: GeneralOrganizationPayload) {
  return prisma.organizations.create({ data });
}

export async function findOrganizationsByType(type: OrganizationType) {
  return prisma.organizations.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
    include: { chauffeurDetails: true, securityDetails: true } as any,
  });
}

export async function findOrganizationById(id: string) {
  return prisma.organizations.findUnique({
    where: { id },
    include: { chauffeurDetails: true, securityDetails: true } as any,
  });
}


export async function updateOrganizationRow(
  id: string,
  data: UpdateOrganizationData,
) {
  return prisma.organizations.update({
    where: { id },
    data: {
      organizationName: data.organizationName,
      email: data.email,
      phone: data.phone,
      contactPerson: data.contactPerson,
      serviceAreas: data.serviceAreas,
      status: data.status,
    },
  });
}

export async function deleteOrganizationById(id: string) {
  return prisma.organizations.delete({ where: { id } });
}


export async function upsertOrganizationDetails(
  organizationId: string,
  type: OrganizationType,
  data: DriverOrganizationDetails | SecurityOrganizationDetails,
) {
  if (type === "CHAUFFEUR") {
    const payload = data as DriverOrganizationDetails;
    const create: Prisma.ChauffeurOrganizationDetailsUncheckedCreateInput = {
      organizationId,
      ...payload,
    };
    const update: Prisma.ChauffeurOrganizationDetailsUncheckedUpdateInput = {
      ...payload,
    };
    return prisma.chauffeurOrganizationDetails.upsert({
      where: { organizationId },
      create,
      update,
    });
  }

  const payload = data as SecurityOrganizationDetails;
  const create: Prisma.SecurityOrganizationDetailsUncheckedCreateInput = {
    organizationId,
    ...payload,
  };
  const update: Prisma.SecurityOrganizationDetailsUncheckedUpdateInput = {
    ...payload,
  };
  return prisma.securityOrganizationDetails.upsert({
    where: { organizationId },
    create,
    update,
  });
}