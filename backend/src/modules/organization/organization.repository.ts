import type { OrganizationType } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export type CreateOrganizationData = {
  title: string;
  email: string;
  phone: string;
  contactPerson: string;
  serviceArea: string;
  status: boolean;
  type: OrganizationType;
};

export async function createOrganization(data: CreateOrganizationData) {
  return prisma.organizations.create({ data });
}

export async function findOrganizationsByType(type: OrganizationType) {
  return prisma.organizations.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrganizationById(id: string) {
  return prisma.organizations.findUnique({ where: { id } });
}

export type UpdateOrganizationData = Omit<CreateOrganizationData, "type">;

export async function updateOrganization(
  id: string,
  data: UpdateOrganizationData,
) {
  return prisma.organizations.update({
    where: { id },
    data: {
      title: data.title,
      email: data.email,
      phone: data.phone,
      contactPerson: data.contactPerson,
      serviceArea: data.serviceArea,
      status: data.status,
    },
  });
}

export async function deleteOrganizationById(id: string) {
  return prisma.organizations.delete({ where: { id } });
}
