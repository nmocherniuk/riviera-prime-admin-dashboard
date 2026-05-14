import type { DriverModalBooleanField } from "../types";

export const PROFESSIONAL_BOOLEAN_FIELDS: Array<{
    key: DriverModalBooleanField;
    label: string;
}> = [
        { key: "hasVipExperience", label: "VIP experience" },
        { key: "hasEventExperience", label: "Event experience" },
        { key: "dressCodeReady", label: "Dress code ready" },
    ];

export const DOCUMENT_FIELDS: Array<{
    key: DriverModalBooleanField;
    label: string;
}> = [
        { key: "passportProvided", label: "Passport" },
        { key: "driverLicenseProvided", label: "Driver license" },
        { key: "vtcCardProvided", label: "VTC card" },
        { key: "criminalRecordProvided", label: "Criminal record" },
        { key: "medicalCertificateProvided", label: "Medical certificate" },
        { key: "insuranceProofProvided", label: "Insurance proof" },
        { key: "profilePhotoProvided", label: "Profile photo" },
        { key: "signedContractProvided", label: "Signed contract" },
    ];

export const OPERATION_BOOLEAN_FIELDS: Array<{
    key: DriverModalBooleanField;
    label: string;
}> = [
        { key: "acceptsLongDistance", label: "Accepts long distance" },
        { key: "acceptsNightTrips", label: "Accepts night trips" },
        { key: "acceptsAirportTransfers", label: "Accepts airport transfers" },
        { key: "acceptsVipClients", label: "Accepts VIP clients" },
        { key: "hasOwnVehicle", label: "Has own vehicle" },
    ];
