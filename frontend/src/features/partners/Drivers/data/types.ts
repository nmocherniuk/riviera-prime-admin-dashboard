export type DriverOrganizationStatus = "active" | "inactive";

export type DriverOrganizationFormValues = {
  // Basic Information
  id?: string;
  organizationName: string;
  email: string;
  phone: string;
  serviceAreas: string;
  contactPerson: string;
  status: boolean;

  // Company Information
  legalForm?: string | null;
  sirenOrSiret?: string | null;
  vatNumber?: string | null;
  registrationDate?: string | null;
  registrationCountry?: string | null;
  registeredAddress?: string | null;
  sameAsRegisteredAddress?: boolean;
  mailingAddress?: string | null;
  websiteUrl?: string | null;
  directorFullName?: string | null;
  directorPosition?: string | null;

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
  cooperationType?: "" | "COMMISSION" | "FIXED_RATE" | "CUSTOM" | null;
  paymentTerms?: string | null;
  commissionPercent?: number | string | null;
  currency?: string | null;
  minimumFare?: number | string | null;
  holidaySurchargePercent?: number | string | null;
  nightSurchargePercent?: number | string | null;
  hourlyRate?: number | string | null;
  transferBaseRate?: number | string | null;
  waitingTimeFee?: number | string | null;
};

export type DriverOrganization = {
  id?: string;
  organizationName: string;
  email: string;
  phone: string;
  contactPerson: string;
  serviceAreas: string;
  status: boolean;
  type: "CHAUFFEUR";

  chauffeurDetails: {
    legalForm?: string;
    sirenOrSiret?: string;
    vatNumber?: string;
    registrationDate?: string;
    registrationCountry?: string;
    registeredAddress?: string;
    sameAsRegisteredAddress?: boolean;
    websiteUrl?: string;
    directorFullName?: string;
    directorPosition?: string;

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
    paymentTerms?: string;
    commissionPercent?: number;
    currency?: string;
    minimumFare?: number;
    holidaySurchargePercent?: number;
    nightSurchargePercent?: number;
    hourlyRate?: number;
    transferBaseRate?: number;
    waitingTimeFee?: number;
  };
};