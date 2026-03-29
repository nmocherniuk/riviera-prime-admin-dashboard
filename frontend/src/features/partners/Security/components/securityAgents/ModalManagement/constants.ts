import type { SecurityAgentFormValues } from "./securityAgentForm.types";

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "", label: "—" },
  { value: "EMPLOYEE", label: "Employee" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "SUBCONTRACTOR", label: "Subcontractor" },
] as const;

export const PHYSICAL_LEVEL_OPTIONS = [
  { value: "", label: "—" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
] as const;

export const DOCUMENT_PROVIDED_OPTIONS: {
  key: keyof SecurityAgentFormValues;
  label: string;
}[] = [
    { key: "passportProvided", label: "Passport" },
    { key: "professionalCardProvided", label: "Professional card" },
    { key: "cnapsProvided", label: "CNAPS" },
    { key: "cvProvided", label: "CV" },
    { key: "certificatesProvided", label: "Certificates" },
    { key: "firstAidCertificateProvided", label: "First aid certificate" },
    { key: "driverLicenseProvided", label: "Driver license" },
    { key: "backgroundCheckProvided", label: "Background check" },
    { key: "profilePhotoProvided", label: "Profile photo" },
    { key: "signedContractProvided", label: "Signed contract" },
  ];

export const OPERATIONS_OPTIONS = [
  ["canWorkInTeam", "Can work in team"],
  ["canTravelWithClient", "Can travel with client"],
  ["canDoDriverSecurity", "Driver security"],
] as const