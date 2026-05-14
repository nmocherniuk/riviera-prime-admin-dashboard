import type {
    CooperationType,
    OrganizationType,
} from "../../generated/prisma/enums.js";

export type GeneralOrganizationPayload = {
    organizationName: string;
    email: string;
    phone: string;
    contactPerson: string;
    serviceAreas: string;
    status: boolean;
    type: OrganizationType;
};

export type NewOrganization = {
    organizationName: string;
    email: string;
    phone: string;
    contactPerson: string;
    serviceAreas: string;
    status: boolean;
    type: OrganizationType;
    chauffeurDetails?: DriverOrganizationDetails;
    securityDetails?: SecurityOrganizationDetails;
};

export type Organization = NewOrganization & { id: string };

export type DriverOrganizationDetails = {
    legalForm?: string | null;
    sirenOrSiret?: string | null;
    vatNumber?: string | null;
    registrationDate?: Date | null;
    registrationCountry?: string | null;
    registeredAddress?: string | null;
    mailingAddress?: string | null;
    sameAsRegisteredAddress?: boolean;
    websiteUrl?: string | null;
    directorFullName?: string | null;
    directorPosition?: string | null;

    kbisUploaded?: boolean;
    rcProInsuranceUploaded?: boolean;
    transportInsuranceUploaded?: boolean;
    operatingLicenseProvided?: boolean;
    bankDetailsProvided?: boolean;
    directorIdCopyProvided?: boolean;
    signedPartnershipAgreement?: boolean;
    additionalCertifications?: string | null;
    documentNotes?: string | null;

    serviceTypes?: string[];
    workingHours?: string | null;
    support24_7?: boolean;
    languagesSpoken?: string[];
    maxConcurrentBookings?: number | null;
    minAdvanceBookingHours?: number | null;
    acceptsUrgentBookings?: boolean;
    cancellationPolicy?: string | null;
    specialConditionsNotes?: string | null;

    cooperationType?: CooperationType | null;
    bankAccountIban?: string | null;
    paymentTerms?: string | null;
    commissionPercent?: number | null;
    currency?: string | null;
    minimumFare?: number | null;
    hourlyRate?: number | null;
    transferBaseRate?: number | null;
    nightSurchargePercent?: number | null;
    holidaySurchargePercent?: number | null;
    waitingTimeFee?: number | null;
};

export type SecurityOrganizationDetails = {
    legalForm?: string | null;
    sirenOrSiret?: string | null;
    licenseNumber?: string | null;
    cnapsNumber?: string | null;
    registrationDate?: Date | null;
    registeredAddress?: string | null;
    officeAddress?: string | null;
    websiteUrl?: string | null;
    directorFullName?: string | null;

    kbisUploaded?: boolean;
    licenseUploaded?: boolean;
    rcProInsuranceUploaded?: boolean;
    cnapsAuthorizationUploaded?: boolean;
    bankDetailsProvided?: boolean;
    directorIdCopyProvided?: boolean;
    signedPartnershipAgreement?: boolean;
    additionalCertifications?: string | null;

    serviceTypes?: string[];
    support24_7?: boolean;
    minBookingHours?: number | null;
    mobilizationTimeMinutes?: number | null;
    agentsCount?: number | null;
    languagesSpoken?: string[];
    hasTeamLeader?: boolean;
    armedPersonnelAllowed?: boolean;
    unarmedPersonnelAllowed?: boolean;
    internationalMissions?: boolean;
    specialRequirements?: string | null;

    hourlyRate?: number | null;
    dailyRate?: number | null;
    nightRate?: number | null;
    eventRate?: number | null;
    executiveProtectionRate?: number | null;
    minimumBookingAmount?: number | null;
    commissionPercent?: number | null;
    paymentTerms?: string | null;
    bankAccountIban?: string | null;
    currency?: string | null;
};

export type UpdateOrganizationData = Omit<GeneralOrganizationPayload, "type">;
