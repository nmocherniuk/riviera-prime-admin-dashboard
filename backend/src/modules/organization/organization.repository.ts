import type { OrganizationType } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { DriverOrganizationDetails, GeneralOrganizationPayload } from "./organization.types.js";



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


export type UpdateOrganizationRowData = Omit<GeneralOrganizationPayload, "type">;

export async function updateOrganizationRow(
  id: string,
  data: UpdateOrganizationRowData,
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


export async function upsertDriverOrganizationDetails(
  organizationId: string,
  data: DriverOrganizationDetails,
) {
  const p = prisma as any;
  return p.chauffeurOrganizationDetails.upsert({
    where: { organizationId },
    create: {
      organizationId,
      ...data,
    },
    update: {
      ...data,
    },
  });
}

export type SecurityOrganizationDetailsUpsertData = {
  companyName?: string | null;
  legalForm?: string | null;
  sirenOrSiret?: string | null;
  licenseNumber?: string | null;
  cnapsNumber?: string | null;
  registrationDate?: Date | null;
  registeredAddress?: string | null;
  officeAddress?: string | null;
  websiteUrl?: string | null;
  generalEmail?: string | null;
  companyPhoneNumber?: string | null;
  directorFullName?: string | null;
  primaryContactName?: string | null;
  primaryContactEmail?: string | null;
  primaryContactPhone?: string | null;

  kbisUploaded?: boolean;
  licenseUploaded?: boolean;
  rcProInsuranceUploaded?: boolean;
  cnapsAuthorizationUploaded?: boolean;
  bankDetailsProvided?: boolean;
  directorIdCopyProvided?: boolean;
  signedPartnershipAgreement?: boolean;
  additionalCertifications?: string | null;

  serviceAreas?: string | null;
  serviceTypes?: string[];
  support24_7?: boolean;
  minBookingHours?: number | null;
  mobilizationTimeMinutes?: number | null;
  agentsCount?: number | null;
  languagesSpoken?: string[];
  hasTeamLeader?: boolean;
  armedPersonnelAllowed?: boolean;
  unarmedPersonnelAllowed?: boolean;
  internationalMissions?: boolean;
  specialRequirements?: string | null;

  hourlyRate?: number | null;
  dailyRate?: number | null;
  nightRate?: number | null;
  eventRate?: number | null;
  executiveProtectionRate?: number | null;
  minimumBookingAmount?: number | null;
  commissionPercent?: number | null;
  paymentTerms?: string | null;
  bankAccountIban?: string | null;
  currency?: string | null;
};

export async function upsertSecurityOrganizationDetails(
  organizationId: string,
  data: SecurityOrganizationDetailsUpsertData,
) {
  const p = prisma as any;
  return p.securityOrganizationDetails.upsert({
    where: { organizationId },
    create: { organizationId, ...data },
    update: { ...data },
  });
}
