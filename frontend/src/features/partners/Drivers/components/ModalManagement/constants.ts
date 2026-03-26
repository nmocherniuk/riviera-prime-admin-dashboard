import type { DriverOrganization } from "../../data/types";

export const SERVICE_TYPES = [
  "Airport Transfer",
  "Hourly Service",
  "Event Transport",
  "VIP Transport",
  "Long Distance",
  "Last-Minute Booking",
];

export const LANGUAGE_OPTIONS = ["FR", "EN", "ES", "DE", "IT", "NL"];

export const COOPERATION_OPTIONS: Array<{
  value: "" | "COMMISSION" | "FIXED_RATE" | "CUSTOM";
  label: string;
}> = [
  { value: "", label: "—" },
  { value: "COMMISSION", label: "Commission" },
  { value: "FIXED_RATE", label: "Fixed rate" },
  { value: "CUSTOM", label: "Custom" },
];

export const CURRENCY_OPTIONS: Array<"EUR" | "USD" | "GBP"> = [
  "EUR",
  "USD",
  "GBP",
];

export const DOCUMENTS_OPTIONS: Array<{
  key: keyof DriverOrganization;
  label: string;
}> = [
  { key: "kbisUploaded", label: "KBIS uploaded" },
  { key: "rcProInsuranceUploaded", label: "RC Pro insurance uploaded" },
  {
    key: "transportInsuranceUploaded",
    label: "Transport insurance uploaded",
  },
  {
    key: "operatingLicenseProvided",
    label: "Operating license provided",
  },
  { key: "bankDetailsProvided", label: "Bank details provided" },
  { key: "directorIdCopyProvided", label: "Director ID copy provided" },
  {
    key: "signedPartnershipAgreement",
    label: "Signed partnership agreement",
  },
] as const;
