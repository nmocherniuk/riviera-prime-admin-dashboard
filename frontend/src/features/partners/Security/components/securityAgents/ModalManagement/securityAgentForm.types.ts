export type SecurityAgentFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  nationality?: string;
  profilePhotoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  /** Same shape as `languagesSpoken` in security organization forms — for MUI `Select multiple`. */
  languages?: string[];
  emergencyContact?: string;
  employmentStatus?: "" | "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR";
  professionalCardNumber?: string;
  cnapsNumber?: string;
  cardIssuedAt?: string;
  cardExpiresAt?: string;
  specializations?: string;
  experienceYears?: number | string | null;
  hasVipExperience?: boolean;
  hasEventExperience?: boolean;
  hasDriverLicenseB?: boolean;
  additionalLicenses?: string;
  physicalLevel?: "" | "LOW" | "MEDIUM" | "HIGH";
  hasFirstAidTraining?: boolean;
  weaponExperience?: boolean;
  readyForTravel?: boolean;
  readyForNightShifts?: boolean;
  passportProvided?: boolean;
  professionalCardProvided?: boolean;
  cnapsProvided?: boolean;
  cvProvided?: boolean;
  certificatesProvided?: boolean;
  firstAidCertificateProvided?: boolean;
  driverLicenseProvided?: boolean;
  backgroundCheckProvided?: boolean;
  profilePhotoProvided?: boolean;
  signedContractProvided?: boolean;
  baseCity?: string;
  workingRadiusKm?: number | string | null;
  availability?: string;
  hourlyRate?: number | string | null;
  dailyRate?: number | string | null;
  nightRate?: number | string | null;
  canWorkInTeam?: boolean;
  canTravelWithClient?: boolean;
  canDoDriverSecurity?: boolean;
  status?: boolean;
  notes?: string;
};

export type SecurityAgent = SecurityAgentFormValues & {
  organizationId: string;
};

export const defaultSecurityAgentFormValues: SecurityAgentFormValues = {
  firstName: "",
  lastName: "",
  birthDate: "",
  nationality: "",
  profilePhotoUrl: "",
  phone: "",
  email: "",
  address: "",
  languages: [],
  emergencyContact: "",
  employmentStatus: "",
  professionalCardNumber: "",
  cnapsNumber: "",
  cardIssuedAt: "",
  cardExpiresAt: "",
  specializations: "",
  experienceYears: "",
  hasVipExperience: false,
  hasEventExperience: false,
  hasDriverLicenseB: false,
  additionalLicenses: "",
  physicalLevel: "",
  hasFirstAidTraining: false,
  weaponExperience: false,
  readyForTravel: false,
  readyForNightShifts: false,
  passportProvided: false,
  professionalCardProvided: false,
  cnapsProvided: false,
  cvProvided: false,
  certificatesProvided: false,
  firstAidCertificateProvided: false,
  driverLicenseProvided: false,
  backgroundCheckProvided: false,
  profilePhotoProvided: false,
  signedContractProvided: false,
  baseCity: "",
  workingRadiusKm: "",
  availability: "",
  hourlyRate: "",
  dailyRate: "",
  nightRate: "",
  canWorkInTeam: true,
  canTravelWithClient: true,
  canDoDriverSecurity: false,
  status: true,
  notes: "",
};
