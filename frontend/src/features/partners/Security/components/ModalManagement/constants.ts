import type { SecurityOrganizationFormValues } from "../../data/types";

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
  { key: "kbisUploaded", label: "KBIS uploaded" },
  { key: "licenseUploaded", label: "License uploaded" },
  { key: "rcProInsuranceUploaded", label: "RC Pro insurance uploaded" },
  {
    key: "cnapsAuthorizationUploaded",
    label: "CNAPS authorization uploaded",
  },
  { key: "bankDetailsProvided", label: "Bank details provided" },
  { key: "directorIdCopyProvided", label: "Director ID copy provided" },
  {
    key: "signedPartnershipAgreement",
    label: "Signed partnership agreement",
  },
];

export const OPERATIONS_OPTIONS: Array<{
  key: keyof SecurityOrganizationFormValues;
  label: string;
}> = [
  { key: "hourlyRate", label: "Hourly rate" },
  { key: "dailyRate", label: "Daily rate" },
  { key: "nightRate", label: "Night rate" },
  { key: "eventRate", label: "Event rate" },
  { key: "executiveProtectionRate", label: "Executive protection rate" },
  { key: "minimumBookingAmount", label: "Minimum booking amount" },
  { key: "commissionPercent", label: "Commission (%)" },
];

export const SPECIAL_REQUIREMENTS_OPTIONS: Array<{
  key: keyof SecurityOrganizationFormValues;
  label: string;
}> = [
  { key: "hasTeamLeader", label: "Has team leader" },
  { key: "armedPersonnelAllowed", label: "Armed personnel allowed" },
  { key: "unarmedPersonnelAllowed", label: "Unarmed personnel allowed" },
  { key: "internationalMissions", label: "International missions" },
];
