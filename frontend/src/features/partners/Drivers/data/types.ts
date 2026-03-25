export type DriverOrganizationStatus = "active" | "inactive";

export type DriverOrganization = {
  id: string;

  // Company Information
  legalForm?: string | null;
  sirenOrSiret?: string | null;
  vatNumber?: string | null;
  registrationDate?: string | null;
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

  // Documents metadata
  kbisUploaded?: boolean;
  rcProInsuranceUploaded?: boolean;
  transportInsuranceUploaded?: boolean;
  operatingLicenseProvided?: boolean;
  bankDetailsProvided?: boolean;
  directorIdCopyProvided?: boolean;
  signedPartnershipAgreement?: boolean;
  additionalCertifications?: string | null;
  documentNotes?: string | null;

  // Operations
  serviceAreas?: string | null;
  serviceTypes?: string[];
  workingHours?: string | null;
  support24_7?: boolean;
  languagesSpoken?: string[];
  maxConcurrentBookings?: number | string | null;
  minAdvanceBookingHours?: number | string | null;
  acceptsUrgentBookings?: boolean;
  cancellationPolicy?: string | null;
  specialConditionsNotes?: string | null;

  // Commercial & Financial
  cooperationType?: "COMMISSION" | "FIXED_RATE" | "CUSTOM" | null;
  bankAccountIban?: string | null;
  paymentTerms?: string | null;
  commissionPercent?: number | string | null;
  currency?: string | null;
  minimumFare?: number | string | null;
  hourlyRate?: number | string | null;
  transferBaseRate?: number | string | null;
  nightSurchargePercent?: number | string | null;
  holidaySurchargePercent?: number | string | null;
  waitingTimeFee?: number | string | null;
};
