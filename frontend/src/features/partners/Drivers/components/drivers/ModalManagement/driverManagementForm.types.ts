import type { Driver } from "../../../data/dummyDrivers";

export type DriverFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  nationality: string;
  birthDate: string;
  languages: string;
  emergencyContact: string;
  employmentStatus: "" | "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR";
  vtcCardNumber: string;
  vtcCardIssuedAt: string;
  vtcCardExpiresAt: string;
  driverLicenseNumber: string;
  licenseCategory: string;
  licenseIssuedAt: string;
  licenseExpiresAt: string;
  drivingExperienceYears: string;
  hasVipExperience: boolean;
  hasEventExperience: boolean;
  languageLevel: string;
  dressCodeReady: boolean;
  passportProvided: boolean;
  driverLicenseProvided: boolean;
  vtcCardProvided: boolean;
  criminalRecordProvided: boolean;
  medicalCertificateProvided: boolean;
  insuranceProofProvided: boolean;
  profilePhotoProvided: boolean;
  signedContractProvided: boolean;
  baseCity: string;
  workingRadiusKm: string;
  acceptsLongDistance: boolean;
  acceptsNightTrips: boolean;
  acceptsAirportTransfers: boolean;
  acceptsVipClients: boolean;
  availabilityDays: string;
  availabilityHours: string;
  hasOwnVehicle: boolean;
  vehicleId: string;
  vehicleType: string;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: "AVAILABLE" | "ON RIDE" | "OFFLINE";
  rides: string;
  todayShift: string;
};

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

export const defaultFormValues: DriverFormValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  nationality: "",
  birthDate: "",
  languages: "",
  emergencyContact: "",
  employmentStatus: "",
  vtcCardNumber: "",
  vtcCardIssuedAt: "",
  vtcCardExpiresAt: "",
  driverLicenseNumber: "",
  licenseCategory: "",
  licenseIssuedAt: "",
  licenseExpiresAt: "",
  drivingExperienceYears: "",
  hasVipExperience: false,
  hasEventExperience: false,
  languageLevel: "",
  dressCodeReady: false,
  passportProvided: false,
  driverLicenseProvided: false,
  vtcCardProvided: false,
  criminalRecordProvided: false,
  medicalCertificateProvided: false,
  insuranceProofProvided: false,
  profilePhotoProvided: false,
  signedContractProvided: false,
  baseCity: "",
  workingRadiusKm: "",
  acceptsLongDistance: false,
  acceptsNightTrips: false,
  acceptsAirportTransfers: false,
  acceptsVipClients: false,
  availabilityDays: "",
  availabilityHours: "",
  hasOwnVehicle: false,
  vehicleId: "",
  vehicleType: "",
  vehicle: "",
  vehiclePlate: "",
  vehicleColor: "",
  status: "AVAILABLE",
  rides: "0",
  todayShift: "",
};

export type DriverModalFormOnChange = <K extends keyof DriverFormValues>(
  field: K,
) => (e: React.ChangeEvent<HTMLInputElement>) => void;

export type DriverManagementModalProps = {
  open: boolean;
  onClose: () => void;
  driver: Driver | null;
  readOnly?: boolean;
  managedVehicles?: Array<{ id: string; label: string; vehicleClass: string }>;
  onSave?: (
    driverId: string | null,
    values: DriverFormValues,
  ) => void | Promise<void>;
};
