import axios from "axios";
import { api } from "./api";
import type { DriverOrganization } from "../features/partners/Drivers/data/types";
import type { ChauffeurOrganizationDetails } from "../features/partners/Drivers/data/types";
import type { Partner } from "../features/partners/Security/data/types";
import type { DriverOrganizationFormValues } from "../features/partners/Drivers/components/drivers/ModalManagement/DriverOrganizationManagementModal";
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
  chauffeurDetails?: ChauffeurOrganizationDetails | null;
};

export type CreateOrganizationBody = {
  title: string;
  email: string;
  phone: string;
  contactPerson: string;
  serviceArea: string;
  status: "active" | "inactive";
  type: OrganizationType;
  chauffeurDetails?: ChauffeurOrganizationDetailsDto;
};

export type UpdateOrganizationBody = Omit<CreateOrganizationBody, "type">;

export type ChauffeurOrganizationDetailsDto = {
  companyName?: string;
  legalForm?: string;
  sirenOrSiret?: string;
  vatNumber?: string;
  registrationDate?: string;
  registrationCountry?: string;
  registeredAddress?: string;
  mailingAddress?: string;
  sameAsRegisteredAddress?: boolean;
  websiteUrl?: string;
  generalEmail?: string;
  companyPhoneNumber?: string;
  directorFullName?: string;
  directorPosition?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;

  kbisUploaded?: boolean;
  rcProInsuranceUploaded?: boolean;
  transportInsuranceUploaded?: boolean;
  operatingLicenseProvided?: boolean;
  bankDetailsProvided?: boolean;
  directorIdCopyProvided?: boolean;
  signedPartnershipAgreement?: boolean;
  additionalCertifications?: string;
  documentNotes?: string;

  serviceAreas?: string;
  serviceTypes?: string[];
  workingHours?: string;
  support24_7?: boolean;
  languagesSpoken?: string[];
  maxConcurrentBookings?: number;
  minAdvanceBookingHours?: number;
  acceptsUrgentBookings?: boolean;
  cancellationPolicy?: string;
  specialConditionsNotes?: string;

  cooperationType?: "COMMISSION" | "FIXED_RATE" | "CUSTOM";
  bankAccountIban?: string;
  paymentTerms?: string;
  commissionPercent?: number;
  currency?: string;
  minimumFare?: number;
  hourlyRate?: number;
  transferBaseRate?: number;
  nightSurchargePercent?: number;
  holidaySurchargePercent?: number;
  waitingTimeFee?: number;
};

export function dtoToDriverOrganization(
  o: OrganizationDto,
): DriverOrganization {
  return {
    id: o.id,
    organizationName: o.title,
    contactPerson: o.contactPerson,
    email: o.email,
    phone: o.phone,
    serviceArea: o.serviceArea,
    status: o.status,
    chauffeurDetails: o.chauffeurDetails ?? null,
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
  const trimOrUndefined = (s: string) => (s.trim() ? s.trim() : undefined);
  const intOrUndefined = (s: string) => {
    const t = s.trim();
    if (!t) return undefined;
    const n = Number.parseInt(t, 10);
    return Number.isFinite(n) ? n : undefined;
  };
  const floatOrUndefined = (s: string) => {
    const t = s.trim();
    if (!t) return undefined;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    title: values.organizationName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    contactPerson: values.contactPerson.trim(),
    serviceArea: values.serviceArea.trim(),
    status: values.status,
    type: "CHAUFFEUR",
    chauffeurDetails: {
      companyName: values.organizationName.trim() || undefined,
      legalForm: trimOrUndefined(values.legalForm),
      sirenOrSiret: trimOrUndefined(values.sirenOrSiret),
      vatNumber: trimOrUndefined(values.vatNumber),
      registrationDate: trimOrUndefined(values.registrationDate),
      registrationCountry: trimOrUndefined(values.registrationCountry),
      registeredAddress: trimOrUndefined(values.registeredAddress),
      mailingAddress: trimOrUndefined(values.mailingAddress),
      sameAsRegisteredAddress: values.sameAsRegisteredAddress,
      websiteUrl: trimOrUndefined(values.websiteUrl),
      generalEmail: trimOrUndefined(values.generalEmail),
      companyPhoneNumber: trimOrUndefined(values.companyPhoneNumber),
      directorFullName: trimOrUndefined(values.directorFullName),
      directorPosition: trimOrUndefined(values.directorPosition),
      primaryContactName: trimOrUndefined(values.primaryContactName),
      primaryContactEmail: trimOrUndefined(values.primaryContactEmail),
      primaryContactPhone: trimOrUndefined(values.primaryContactPhone),

      kbisUploaded: values.kbisUploaded,
      rcProInsuranceUploaded: values.rcProInsuranceUploaded,
      transportInsuranceUploaded: values.transportInsuranceUploaded,
      operatingLicenseProvided: values.operatingLicenseProvided,
      bankDetailsProvided: values.bankDetailsProvided,
      directorIdCopyProvided: values.directorIdCopyProvided,
      signedPartnershipAgreement: values.signedPartnershipAgreement,
      additionalCertifications: trimOrUndefined(
        values.additionalCertifications,
      ),
      documentNotes: trimOrUndefined(values.documentNotes),

      serviceAreas: trimOrUndefined(values.serviceAreas),
      serviceTypes: values.serviceTypes,
      workingHours: trimOrUndefined(values.workingHours),
      support24_7: values.support24_7,
      languagesSpoken: values.languagesSpoken,
      maxConcurrentBookings: intOrUndefined(values.maxConcurrentBookings),
      minAdvanceBookingHours: intOrUndefined(values.minAdvanceBookingHours),
      acceptsUrgentBookings: values.acceptsUrgentBookings,
      cancellationPolicy: trimOrUndefined(values.cancellationPolicy),
      specialConditionsNotes: trimOrUndefined(values.specialConditionsNotes),

      cooperationType: values.cooperationType || undefined,
      bankAccountIban: trimOrUndefined(values.bankAccountIban),
      paymentTerms: trimOrUndefined(values.paymentTerms),
      commissionPercent:
        values.cooperationType === "COMMISSION"
          ? floatOrUndefined(values.commissionPercent)
          : undefined,
      currency: values.currency,
      minimumFare: floatOrUndefined(values.minimumFare),
      hourlyRate: floatOrUndefined(values.hourlyRate),
      transferBaseRate: floatOrUndefined(values.transferBaseRate),
      nightSurchargePercent: floatOrUndefined(values.nightSurchargePercent),
      holidaySurchargePercent: floatOrUndefined(values.holidaySurchargePercent),
      waitingTimeFee: floatOrUndefined(values.waitingTimeFee),
    },
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
  const trimOrUndefined = (s: string) => (s.trim() ? s.trim() : undefined);
  const intOrUndefined = (s: string) => {
    const t = s.trim();
    if (!t) return undefined;
    const n = Number.parseInt(t, 10);
    return Number.isFinite(n) ? n : undefined;
  };
  const floatOrUndefined = (s: string) => {
    const t = s.trim();
    if (!t) return undefined;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    title: values.organizationName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    contactPerson: values.contactPerson.trim(),
    serviceArea: values.serviceArea.trim(),
    status: values.status,
    chauffeurDetails: {
      companyName: values.organizationName.trim() || undefined,
      legalForm: trimOrUndefined(values.legalForm),
      sirenOrSiret: trimOrUndefined(values.sirenOrSiret),
      vatNumber: trimOrUndefined(values.vatNumber),
      registrationDate: trimOrUndefined(values.registrationDate),
      registrationCountry: trimOrUndefined(values.registrationCountry),
      registeredAddress: trimOrUndefined(values.registeredAddress),
      mailingAddress: trimOrUndefined(values.mailingAddress),
      sameAsRegisteredAddress: values.sameAsRegisteredAddress,
      websiteUrl: trimOrUndefined(values.websiteUrl),
      generalEmail: trimOrUndefined(values.generalEmail),
      companyPhoneNumber: trimOrUndefined(values.companyPhoneNumber),
      directorFullName: trimOrUndefined(values.directorFullName),
      directorPosition: trimOrUndefined(values.directorPosition),
      primaryContactName: trimOrUndefined(values.primaryContactName),
      primaryContactEmail: trimOrUndefined(values.primaryContactEmail),
      primaryContactPhone: trimOrUndefined(values.primaryContactPhone),

      kbisUploaded: values.kbisUploaded,
      rcProInsuranceUploaded: values.rcProInsuranceUploaded,
      transportInsuranceUploaded: values.transportInsuranceUploaded,
      operatingLicenseProvided: values.operatingLicenseProvided,
      bankDetailsProvided: values.bankDetailsProvided,
      directorIdCopyProvided: values.directorIdCopyProvided,
      signedPartnershipAgreement: values.signedPartnershipAgreement,
      additionalCertifications: trimOrUndefined(
        values.additionalCertifications,
      ),
      documentNotes: trimOrUndefined(values.documentNotes),

      serviceAreas: trimOrUndefined(values.serviceAreas),
      serviceTypes: values.serviceTypes,
      workingHours: trimOrUndefined(values.workingHours),
      support24_7: values.support24_7,
      languagesSpoken: values.languagesSpoken,
      maxConcurrentBookings: intOrUndefined(values.maxConcurrentBookings),
      minAdvanceBookingHours: intOrUndefined(values.minAdvanceBookingHours),
      acceptsUrgentBookings: values.acceptsUrgentBookings,
      cancellationPolicy: trimOrUndefined(values.cancellationPolicy),
      specialConditionsNotes: trimOrUndefined(values.specialConditionsNotes),

      cooperationType: values.cooperationType || undefined,
      bankAccountIban: trimOrUndefined(values.bankAccountIban),
      paymentTerms: trimOrUndefined(values.paymentTerms),
      commissionPercent:
        values.cooperationType === "COMMISSION"
          ? floatOrUndefined(values.commissionPercent)
          : undefined,
      currency: values.currency,
      minimumFare: floatOrUndefined(values.minimumFare),
      hourlyRate: floatOrUndefined(values.hourlyRate),
      transferBaseRate: floatOrUndefined(values.transferBaseRate),
      nightSurchargePercent: floatOrUndefined(values.nightSurchargePercent),
      holidaySurchargePercent: floatOrUndefined(values.holidaySurchargePercent),
      waitingTimeFee: floatOrUndefined(values.waitingTimeFee),
    },
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
    params: type ? { type } : {},
  });
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
