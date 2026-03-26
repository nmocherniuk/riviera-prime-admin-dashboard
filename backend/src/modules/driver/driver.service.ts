import type {
  Drivers,
  DriverStatus,
  EmploymentStatus,
} from "../../generated/prisma/client.js";
import {
  createDriver as createDriverRepo,
  deleteDriverById,
  findDriverById,
  findDriversByOrganizationId,
  updateDriver as updateDriverRepo,
  type CreateDriverData,
} from "./driver.repository.js";

export type PublicDriverStatus = "AVAILABLE" | "ON RIDE" | "OFFLINE";

export type PublicDriver = {
  id: string;
  organizationId: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  nationality: string | null;
  birthDate: string | null;
  languages: string[];
  emergencyContact: string | null;
  employmentStatus: EmploymentStatus | null;
  vtcCardNumber: string | null;
  vtcCardIssuedAt: string | null;
  vtcCardExpiresAt: string | null;
  driverLicenseNumber: string | null;
  licenseCategory: string | null;
  licenseIssuedAt: string | null;
  licenseExpiresAt: string | null;
  drivingExperienceYears: number | null;
  hasVipExperience: boolean;
  hasEventExperience: boolean;
  languageLevel: string | null;
  dressCodeReady: boolean;
  passportProvided: boolean;
  driverLicenseProvided: boolean;
  vtcCardProvided: boolean;
  criminalRecordProvided: boolean;
  medicalCertificateProvided: boolean;
  insuranceProofProvided: boolean;
  profilePhotoProvided: boolean;
  signedContractProvided: boolean;
  baseCity: string | null;
  workingRadiusKm: number | null;
  acceptsLongDistance: boolean;
  acceptsNightTrips: boolean;
  acceptsAirportTransfers: boolean;
  acceptsVipClients: boolean;
  availabilityDays: string[];
  availabilityHours: string | null;
  hasOwnVehicle: boolean;
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: PublicDriverStatus;
  rides: number;
  earning: string;
  todayShift: string;
  createdAt: string;
  updatedAt: string;
};

function toPublicStatus(status: DriverStatus): PublicDriverStatus {
  if (status === "ON_RIDE") return "ON RIDE";
  return status;
}

function toDbStatus(status: PublicDriverStatus): DriverStatus {
  if (status === "ON RIDE") return "ON_RIDE";
  return status;
}

function formatEarning(rides: number): string {
  return `$${(rides * 27.5).toFixed(2)}`;
}

function toIsoOrNull(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function toPublicDriver(row: Drivers): PublicDriver {
  return {
    id: row.id,
    organizationId: row.organizationId,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    nationality: row.nationality,
    birthDate: toIsoOrNull(row.birthDate),
    languages: row.languages,
    emergencyContact: row.emergencyContact,
    employmentStatus: row.employmentStatus,
    vtcCardNumber: row.vtcCardNumber,
    vtcCardIssuedAt: toIsoOrNull(row.vtcCardIssuedAt),
    vtcCardExpiresAt: toIsoOrNull(row.vtcCardExpiresAt),
    driverLicenseNumber: row.driverLicenseNumber,
    licenseCategory: row.licenseCategory,
    licenseIssuedAt: toIsoOrNull(row.licenseIssuedAt),
    licenseExpiresAt: toIsoOrNull(row.licenseExpiresAt),
    drivingExperienceYears: row.drivingExperienceYears,
    hasVipExperience: row.hasVipExperience,
    hasEventExperience: row.hasEventExperience,
    languageLevel: row.languageLevel,
    dressCodeReady: row.dressCodeReady,
    passportProvided: row.passportProvided,
    driverLicenseProvided: row.driverLicenseProvided,
    vtcCardProvided: row.vtcCardProvided,
    criminalRecordProvided: row.criminalRecordProvided,
    medicalCertificateProvided: row.medicalCertificateProvided,
    insuranceProofProvided: row.insuranceProofProvided,
    profilePhotoProvided: row.profilePhotoProvided,
    signedContractProvided: row.signedContractProvided,
    baseCity: row.baseCity,
    workingRadiusKm: row.workingRadiusKm,
    acceptsLongDistance: row.acceptsLongDistance,
    acceptsNightTrips: row.acceptsNightTrips,
    acceptsAirportTransfers: row.acceptsAirportTransfers,
    acceptsVipClients: row.acceptsVipClients,
    availabilityDays: row.availabilityDays,
    availabilityHours: row.availabilityHours,
    hasOwnVehicle: row.hasOwnVehicle,
    vehicle: row.vehicle,
    vehiclePlate: row.vehiclePlate,
    vehicleColor: row.vehicleColor,
    status: toPublicStatus(row.status),
    rides: row.rides,
    earning: formatEarning(row.rides),
    todayShift: row.todayShift,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listDrivers(organizationId?: string) {
  const rows = await findDriversByOrganizationId(organizationId);
  return rows.map(toPublicDriver);
}

export async function getDriverById(id: string, organizationId?: string) {
  const row = await findDriverById(id);
  if (!row) return null;
  if (organizationId && row.organizationId !== organizationId) return null;
  return toPublicDriver(row);
}

export async function createDriver(
  input: Omit<CreateDriverData, "status"> & { status: PublicDriverStatus },
) {
  const row = await createDriverRepo({
    ...input,
    status: toDbStatus(input.status),
  });
  return toPublicDriver(row);
}

export async function updateDriver(
  id: string,
  input: Omit<CreateDriverData, "organizationId" | "status"> & {
    status: PublicDriverStatus;
  },
  organizationId?: string,
) {
  const row = await findDriverById(id);
  if (!row) return null;
  if (organizationId && row.organizationId !== organizationId) return null;

  const updated = await updateDriverRepo(id, {
    ...input,
    status: toDbStatus(input.status),
  });

  return toPublicDriver(updated);
}

export async function deleteDriver(id: string, organizationId?: string) {
  const row = await findDriverById(id);
  if (!row) return null;
  if (organizationId && row.organizationId !== organizationId) return null;
  await deleteDriverById(id);
  return true;
}
