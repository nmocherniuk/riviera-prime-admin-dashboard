import type { DriverOrganizationFormValues } from "../../data/types";
import { driversContent } from "../../../../../content/drivers";

export type DriverOrganizationDocumentKey = keyof Pick<
  DriverOrganizationFormValues,
  | "kbisUploaded"
  | "rcProInsuranceUploaded"
  | "transportInsuranceUploaded"
  | "operatingLicenseProvided"
  | "bankDetailsProvided"
  | "directorIdCopyProvided"
  | "signedPartnershipAgreement"
>;

export const SERVICE_TYPES = [
  "Airport Transfer",
  "Hourly Service",
  "Event Transport",
  "VIP Transport",
  "Long Distance",
  "Last-Minute Booking",
];

export const LANGUAGE_OPTIONS = ["FR", "EN", "ES", "DE", "IT", "NL"];

const fin = driversContent.organizationModal.financial;
const doc = driversContent.organizationModal.documents;

export const COOPERATION_OPTIONS: Array<{
  value: "" | "COMMISSION" | "FIXED_RATE" | "CUSTOM";
  label: string;
}> = [
    { value: "", label: "—" },
    { value: "COMMISSION", label: fin.cooperationOptions.commission },
    { value: "FIXED_RATE", label: fin.cooperationOptions.fixedRate },
    { value: "CUSTOM", label: fin.cooperationOptions.custom },
  ];

export const CURRENCY_OPTIONS: Array<"EUR" | "USD" | "GBP"> = [
  "EUR",
  "USD",
  "GBP",
];

export const DOCUMENTS_OPTIONS: Array<{
  key: DriverOrganizationDocumentKey;
  label: string;
}> = [
    { key: "kbisUploaded", label: doc.kbisUploaded },
    { key: "rcProInsuranceUploaded", label: doc.rcProInsuranceUploaded },
    {
      key: "transportInsuranceUploaded",
      label: doc.transportInsuranceUploaded,
    },
    {
      key: "operatingLicenseProvided",
      label: doc.operatingLicenseProvided,
    },
    { key: "bankDetailsProvided", label: doc.bankDetailsProvided },
    { key: "directorIdCopyProvided", label: doc.directorIdCopyProvided },
    {
      key: "signedPartnershipAgreement",
      label: doc.signedPartnershipAgreement,
    },
  ];
