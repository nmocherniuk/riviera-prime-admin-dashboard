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
    include: { chauffeurDetails: true } as any,
  });
}

export async function findOrganizationById(id: string) {
  return prisma.organizations.findUnique({
    where: { id },
    include: { chauffeurDetails: true } as any,
  });
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

export type ChauffeurOrganizationDetailsUpsertData = {
  companyName?: string | null;
  legalForm?: string | null;
  sirenOrSiret?: string | null;
  vatNumber?: string | null;
  registrationDate?: Date | null;
  registrationCountry?: string | null;
  registeredAddress?: string | null;
  mailingAddress?: string | null;
  sameAsRegisteredAddress?: boolean;
  websiteUrl?: string | null;
  generalEmail?: string | null;
  companyPhoneNumber?: string | null;
  directorFullName?: string | null;
  directorPosition?: string | null;
  primaryContactName?: string | null;
  primaryContactEmail?: string | null;
  primaryContactPhone?: string | null;

  kbisUploaded?: boolean;
  rcProInsuranceUploaded?: boolean;
  transportInsuranceUploaded?: boolean;
  operatingLicenseProvided?: boolean;
  bankDetailsProvided?: boolean;
  directorIdCopyProvided?: boolean;
  signedPartnershipAgreement?: boolean;
  additionalCertifications?: string | null;
  documentNotes?: string | null;

  serviceAreas?: string | null;
  serviceTypes?: string[];
  workingHours?: string | null;
  support24_7?: boolean;
  languagesSpoken?: string[];
  maxConcurrentBookings?: number | null;
  minAdvanceBookingHours?: number | null;
  acceptsUrgentBookings?: boolean;
  cancellationPolicy?: string | null;
  specialConditionsNotes?: string | null;

  cooperationType?: string | null;
  bankAccountIban?: string | null;
  paymentTerms?: string | null;
  commissionPercent?: number | null;
  currency?: string | null;
  minimumFare?: number | null;
  hourlyRate?: number | null;
  transferBaseRate?: number | null;
  nightSurchargePercent?: number | null;
  holidaySurchargePercent?: number | null;
  waitingTimeFee?: number | null;
};

export async function upsertChauffeurOrganizationDetails(
  organizationId: string,
  data: ChauffeurOrganizationDetailsUpsertData,
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
