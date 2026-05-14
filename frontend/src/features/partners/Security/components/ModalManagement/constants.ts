import type { SecurityOrganizationFormValues } from "../../data/types";
import { securityPartnersContent } from "../../../../../content/securityPartners";

const sp = securityPartnersContent.organizationModal;

export const SECURITY_SERVICE_TYPES = [
  "Static guarding",
  "Event security",
  "VIP escort",
  "Executive protection",
  "Close protection",
  "Patrol",
];

export const LANGUAGE_OPTIONS = ["FR", "EN", "ES", "DE", "IT", "NL"];

export const CURRENCY_OPTIONS: Array<"EUR" | "USD" | "GBP"> = [
  "EUR",
  "USD",
  "GBP",
];

export const DOCUMENTS_OPTIONS: Array<{
  key: keyof SecurityOrganizationFormValues;
  label: string;
}> = [
  { key: "kbisUploaded", label: sp.documents.kbisUploaded },
  { key: "licenseUploaded", label: sp.documents.licenseUploaded },
  { key: "rcProInsuranceUploaded", label: sp.documents.rcProInsuranceUploaded },
  {
    key: "cnapsAuthorizationUploaded",
    label: sp.documents.cnapsAuthorizationUploaded,
  },
  { key: "bankDetailsProvided", label: sp.documents.bankDetailsProvided },
  { key: "directorIdCopyProvided", label: sp.documents.directorIdCopyProvided },
  {
    key: "signedPartnershipAgreement",
    label: sp.documents.signedPartnershipAgreement,
  },
];

export const OPERATIONS_OPTIONS: Array<{
  key: keyof SecurityOrganizationFormValues;
  label: string;
}> = [
  { key: "hourlyRate", label: sp.financial.hourlyRate.label },
  { key: "dailyRate", label: sp.financial.dailyRate.label },
  { key: "nightRate", label: sp.financial.nightRate.label },
  { key: "eventRate", label: sp.financial.eventRate.label },
  { key: "executiveProtectionRate", label: sp.financial.executiveProtectionRate.label },
  { key: "minimumBookingAmount", label: sp.financial.minimumBookingAmount.label },
  { key: "commissionPercent", label: sp.financial.commissionPercent.label },
];

export const SPECIAL_REQUIREMENTS_OPTIONS: Array<{
  key: keyof SecurityOrganizationFormValues;
  label: string;
}> = [
  { key: "hasTeamLeader", label: sp.specialRequirements.hasTeamLeader },
  { key: "armedPersonnelAllowed", label: sp.specialRequirements.armedPersonnelAllowed },
  { key: "unarmedPersonnelAllowed", label: sp.specialRequirements.unarmedPersonnelAllowed },
  { key: "internationalMissions", label: sp.specialRequirements.internationalMissions },
];
