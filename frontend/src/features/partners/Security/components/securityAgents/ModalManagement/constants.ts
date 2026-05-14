import type { SecurityAgentFormValues } from "./securityAgentForm.types";
import { securityAgentContent } from "../../../../../../content/securityAgent";

const sa = securityAgentContent;
const emp = sa.employmentStatus;
const phys = sa.physicalLevel;
const doc = sa.documentProvided;
const opFlags = sa.modal.operations.operationsFlags;

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "", label: emp.empty },
  { value: "EMPLOYEE", label: emp.EMPLOYEE },
  { value: "FREELANCE", label: emp.FREELANCE },
  { value: "SUBCONTRACTOR", label: emp.SUBCONTRACTOR },
] as const;

export const PHYSICAL_LEVEL_OPTIONS = [
  { value: "", label: phys.empty },
  { value: "LOW", label: phys.LOW },
  { value: "MEDIUM", label: phys.MEDIUM },
  { value: "HIGH", label: phys.HIGH },
] as const;

export const DOCUMENT_PROVIDED_OPTIONS: {
  key: keyof SecurityAgentFormValues;
  label: string;
}[] = [
  { key: "passportProvided", label: doc.passportProvided },
  { key: "professionalCardProvided", label: doc.professionalCardProvided },
  { key: "cnapsProvided", label: doc.cnapsProvided },
  { key: "cvProvided", label: doc.cvProvided },
  { key: "certificatesProvided", label: doc.certificatesProvided },
  { key: "firstAidCertificateProvided", label: doc.firstAidCertificateProvided },
  { key: "driverLicenseProvided", label: doc.driverLicenseProvided },
  { key: "backgroundCheckProvided", label: doc.backgroundCheckProvided },
  { key: "profilePhotoProvided", label: doc.profilePhotoProvided },
  { key: "signedContractProvided", label: doc.signedContractProvided },
];

export const OPERATIONS_OPTIONS = [
  ["canWorkInTeam", opFlags.canWorkInTeam],
  ["canTravelWithClient", opFlags.canTravelWithClient],
  ["canDoDriverSecurity", opFlags.canDoDriverSecurity],
] as const;
