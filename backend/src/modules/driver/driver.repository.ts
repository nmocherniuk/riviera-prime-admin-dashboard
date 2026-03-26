import type { DriverStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export type CreateDriverData = {
  organizationId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  nationality?: string | null;
  birthDate?: Date | null;
  languages?: string[];
  emergencyContact?: string | null;
  employmentStatus?: "EMPLOYEE" | "FREELANCE" | "SUBCONTRACTOR" | null;
  vtcCardNumber?: string | null;
  vtcCardIssuedAt?: Date | null;
  vtcCardExpiresAt?: Date | null;
  driverLicenseNumber?: string | null;
  licenseCategory?: string | null;
  licenseIssuedAt?: Date | null;
  licenseExpiresAt?: Date | null;
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
  vehicle: string;
  vehiclePlate: string;
  vehicleColor: string;
  status: DriverStatus;
  rides: number;
  todayShift: string;
};

export type UpdateDriverData = Omit<CreateDriverData, "organizationId">;

export async function createDriver(data: CreateDriverData) {
  return prisma.drivers.create({ data });
}

export async function findDriversByOrganizationId(organizationId?: string) {
  if (organizationId) {
    return prisma.drivers.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.drivers.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findDriverById(id: string) {
  return prisma.drivers.findUnique({ where: { id } });
}

export async function updateDriver(id: string, data: UpdateDriverData) {
  return prisma.drivers.update({
    where: { id },
    data,
  });
}

export async function deleteDriverById(id: string) {
  return prisma.drivers.delete({ where: { id } });
}
