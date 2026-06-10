import type { DriverModalBooleanField } from "../types";
import { driverAgentsContent } from "../../../../../../content/driverAgents";

const prof = driverAgentsContent.modal.professional.flags;
const docs = driverAgentsContent.modal.documents.flags;
const ops = driverAgentsContent.modal.operations.flags;

export const PROFESSIONAL_BOOLEAN_FIELDS: Array<{
    key: DriverModalBooleanField;
    label: string;
}> = [
        { key: "hasVipExperience", label: prof.hasVipExperience },
        { key: "hasEventExperience", label: prof.hasEventExperience },
        { key: "dressCodeReady", label: prof.dressCodeReady },
    ];

export const DOCUMENT_FIELDS: Array<{
    key: DriverModalBooleanField;
    label: string;
}> = [
        { key: "passportProvided", label: docs.passportProvided },
        { key: "driverLicenseProvided", label: docs.driverLicenseProvided },
        { key: "vtcCardProvided", label: docs.vtcCardProvided },
        { key: "criminalRecordProvided", label: docs.criminalRecordProvided },
        { key: "medicalCertificateProvided", label: docs.medicalCertificateProvided },
        { key: "insuranceProofProvided", label: docs.insuranceProofProvided },
        { key: "profilePhotoProvided", label: docs.profilePhotoProvided },
        { key: "signedContractProvided", label: docs.signedContractProvided },
    ];

export const OPERATION_BOOLEAN_FIELDS: Array<{
    key: DriverModalBooleanField;
    label: string;
}> = [
        { key: "acceptsLongDistance", label: ops.acceptsLongDistance },
        { key: "acceptsNightTrips", label: ops.acceptsNightTrips },
        { key: "acceptsAirportTransfers", label: ops.acceptsAirportTransfers },
        { key: "acceptsVipClients", label: ops.acceptsVipClients },
        { key: "hasOwnVehicle", label: ops.hasOwnVehicle },
    ];
