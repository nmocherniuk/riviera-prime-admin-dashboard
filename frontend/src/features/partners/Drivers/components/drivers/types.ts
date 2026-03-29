export type Driver = {
    id?: string;
    organizationId: string;
    organizationName: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    nationality?: string | null;
    birthDate?: string | null;
    languages?: string[];
    emergencyContact?: string | null;
    employmentStatus?: "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR" | null;
    vtcCardNumber?: string | null;
    vtcCardIssuedAt?: string | null;
    vtcCardExpiresAt?: string | null;
    driverLicenseNumber?: string | null;
    licenseCategory?: string | null;
    licenseIssuedAt?: string | null;
    licenseExpiresAt?: string | null;
    drivingExperienceYears?: number | null;
    hasVipExperience?: boolean;
    hasEventExperience?: boolean;
    languageLevel?: string | null;
    dressCodeReady?: boolean;
    passportProvided?: boolean;
    driverLicenseProvided?: boolean;
    vtcCardProvided?: boolean;
    criminalRecordProvided?: boolean;
    medicalCertificateProvided?: boolean;
    insuranceProofProvided?: boolean;
    profilePhotoProvided?: boolean;
    signedContractProvided?: boolean;
    baseCity?: string | null;
    workingRadiusKm?: number | null;
    acceptsLongDistance?: boolean;
    acceptsNightTrips?: boolean;
    acceptsAirportTransfers?: boolean;
    acceptsVipClients?: boolean;
    availabilityDays?: string[];
    availabilityHours?: string | null;
    hasOwnVehicle?: boolean;
    vehicleId?: string;
    vehicle?: string;
    vehiclePlate?: string;
    vehicleColor?: string;
    status?: boolean;
    rides?: number;
    earning?: string;
    todayShift?: string;
};

export type DriverFormValues = Omit<Driver, "organizationId" | "organizationName">;

export type DriverModalBooleanField =
    | "hasVipExperience"
    | "hasEventExperience"
    | "dressCodeReady"
    | "passportProvided"
    | "driverLicenseProvided"
    | "vtcCardProvided"
    | "criminalRecordProvided"
    | "medicalCertificateProvided"
    | "insuranceProofProvided"
    | "profilePhotoProvided"
    | "signedContractProvided"
    | "acceptsLongDistance"
    | "acceptsNightTrips"
    | "acceptsAirportTransfers"
    | "acceptsVipClients"
    | "hasOwnVehicle";

