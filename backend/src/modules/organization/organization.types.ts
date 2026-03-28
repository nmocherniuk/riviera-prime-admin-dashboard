import type { OrganizationType } from "../../generated/prisma/enums.js";
import type { SecurityOrganizationDetailsUpsertData } from "./organization.repository.js";

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
    securityDetails?: SecurityOrganizationDetailsUpsertData;
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
    primaryContactName?: string | null;

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

    cooperationType?: string | null;
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
