import axios from "axios";
import { api } from "./api";
import type {
  DriverOrganization,
} from "../features/partners/Drivers/data/types";

export type OrganizationType = "CHAUFFEUR" | "SECURITY";

export type Organization = DriverOrganization


export type SecurityOrganizationDetailsDto = {
  companyName?: string;
  legalForm?: string;
  sirenOrSiret?: string;
  licenseNumber?: string;
  cnapsNumber?: string;
  registrationDate?: string;
  registeredAddress?: string;
  officeAddress?: string;
  websiteUrl?: string;
  generalEmail?: string;
  companyPhoneNumber?: string;
  directorFullName?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;

  kbisUploaded?: boolean;
  licenseUploaded?: boolean;
  rcProInsuranceUploaded?: boolean;
  cnapsAuthorizationUploaded?: boolean;
  bankDetailsProvided?: boolean;
  directorIdCopyProvided?: boolean;
  signedPartnershipAgreement?: boolean;
  additionalCertifications?: string;

  serviceAreas?: string;
  serviceTypes?: string[];
  support24_7?: boolean;
  minBookingHours?: number;
  mobilizationTimeMinutes?: number;
  agentsCount?: number;
  languagesSpoken?: string[];
  hasTeamLeader?: boolean;
  armedPersonnelAllowed?: boolean;
  unarmedPersonnelAllowed?: boolean;
  internationalMissions?: boolean;
  specialRequirements?: string;

  hourlyRate?: number;
  dailyRate?: number;
  nightRate?: number;
  eventRate?: number;
  executiveProtectionRate?: number;
  minimumBookingAmount?: number;
  commissionPercent?: number;
  paymentTerms?: string;
  bankAccountIban?: string;
  currency?: string;
};



// export function dtoToPartner(o: OrganizationDto): Partner {
//   return {
//     id: o.id,
//     companyName: o.title,
//     status: o.status,
//     securityDetails: o.securityDetails ?? null,
//   };
// }



// function securityOrgDisplayName(values: SecurityOrganization): string {
//   return (
//     values.directorFullName?.trim() ||
//     values.legalForm?.trim() ||
//     values.primaryContactName?.trim() ||
//     "Security organization"
//   );
// }

// export function partnerFormToCreateBody(
//   values: SecurityOrganization,
// ): CreateOrganizationBody {
//   const intOrUndefined = (s: string) => {
//     const t = s.trim();
//     if (!t) return undefined;
//     const n = Number.parseInt(t, 10);
//     return Number.isFinite(n) ? n : undefined;
//   };
//   const floatOrUndefined = (s: string) => {
//     const t = s.trim();
//     if (!t) return undefined;
//     const n = Number.parseFloat(t);
//     return Number.isFinite(n) ? n : undefined;
//   };

//   const displayName = securityOrgDisplayName(values);

//   return {
//     organizationName: displayName,
//     email:
//       values.primaryContactEmail?.trim() ||
//       values.generalEmail?.trim() ||
//       "",
//     phone:
//       values.primaryContactPhone?.trim() ||
//       values.companyPhoneNumber?.trim() ||
//       "",
//     contactPerson:
//       values.primaryContactName?.trim() ||
//       values.directorFullName?.trim() ||
//       "",
//     serviceAreas: (values.serviceAreas ?? "").toString().trim(),
//     status: "active",
//     type: "SECURITY",
//     securityDetails: {
//       companyName: displayName || undefined,
//       legalForm: trimOrUndefined(values.legalForm),
//       sirenOrSiret: trimOrUndefined(values.sirenOrSiret),
//       licenseNumber: trimOrUndefined(values.licenseNumber),
//       cnapsNumber: trimOrUndefined(values.cnapsNumber),
//       registrationDate: trimOrUndefined(values.registrationDate),
//       registeredAddress: trimOrUndefined(values.registeredAddress),
//       officeAddress: trimOrUndefined(values.officeAddress),
//       websiteUrl: trimOrUndefined(values.websiteUrl),
//       generalEmail: trimOrUndefined(values.generalEmail),
//       companyPhoneNumber: trimOrUndefined(values.companyPhoneNumber),
//       directorFullName: trimOrUndefined(values.directorFullName),
//       primaryContactName: trimOrUndefined(values.primaryContactName),
//       primaryContactEmail: trimOrUndefined(values.primaryContactEmail),
//       primaryContactPhone: trimOrUndefined(values.primaryContactPhone),

//       kbisUploaded: values.kbisUploaded,
//       licenseUploaded: values.licenseUploaded,
//       rcProInsuranceUploaded: values.rcProInsuranceUploaded,
//       cnapsAuthorizationUploaded: values.cnapsAuthorizationUploaded,
//       bankDetailsProvided: values.bankDetailsProvided,
//       directorIdCopyProvided: values.directorIdCopyProvided,
//       signedPartnershipAgreement: values.signedPartnershipAgreement,
//       additionalCertifications: trimOrUndefined(
//         values.additionalCertifications,
//       ),

//       serviceAreas: trimOrUndefined(values.serviceAreas),
//       serviceTypes: values.serviceTypes,
//       support24_7: values.support24_7,
//       minBookingHours: intOrUndefined(String(values.minBookingHours ?? "")),
//       mobilizationTimeMinutes: intOrUndefined(
//         String(values.mobilizationTimeMinutes ?? ""),
//       ),
//       agentsCount: intOrUndefined(String(values.agentsCount ?? "")),
//       languagesSpoken: values.languagesSpoken,
//       hasTeamLeader: values.hasTeamLeader,
//       armedPersonnelAllowed: values.armedPersonnelAllowed,
//       unarmedPersonnelAllowed: values.unarmedPersonnelAllowed,
//       internationalMissions: values.internationalMissions,
//       specialRequirements: trimOrUndefined(values.specialRequirements),

//       hourlyRate: floatOrUndefined(String(values.hourlyRate ?? "")),
//       dailyRate: floatOrUndefined(String(values.dailyRate ?? "")),
//       nightRate: floatOrUndefined(String(values.nightRate ?? "")),
//       eventRate: floatOrUndefined(String(values.eventRate ?? "")),
//       executiveProtectionRate: floatOrUndefined(
//         String(values.executiveProtectionRate ?? ""),
//       ),
//       minimumBookingAmount: floatOrUndefined(
//         String(values.minimumBookingAmount ?? ""),
//       ),
//       commissionPercent: floatOrUndefined(String(values.commissionPercent ?? "")),
//       paymentTerms: trimOrUndefined(values.paymentTerms),
//       bankAccountIban: trimOrUndefined(values.bankAccountIban),
//       currency: values.currency,
//     },
//   };
// }

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
