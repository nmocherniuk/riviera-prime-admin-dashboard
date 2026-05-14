-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('EMPLOYEE', 'FREELANCE', 'SUBCONTRACTOR');

-- CreateEnum
CREATE TYPE "PhysicalLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AgentAvailabilityStatus" AS ENUM ('AVAILABLE', 'ON_ASSIGNMENT', 'OFF_DUTY');

-- AlterTable
ALTER TABLE "Drivers" ADD COLUMN     "acceptsAirportTransfers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsLongDistance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsNightTrips" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsVipClients" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "availabilityDays" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "availabilityHours" TEXT,
ADD COLUMN     "baseCity" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "criminalRecordProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dressCodeReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "driverLicenseNumber" TEXT,
ADD COLUMN     "driverLicenseProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "drivingExperienceYears" INTEGER,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "employmentStatus" "EmploymentStatus",
ADD COLUMN     "hasEventExperience" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOwnVehicle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasVipExperience" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "insuranceProofProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languageLevel" TEXT,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "licenseCategory" TEXT,
ADD COLUMN     "licenseExpiresAt" TIMESTAMP(3),
ADD COLUMN     "licenseIssuedAt" TIMESTAMP(3),
ADD COLUMN     "medicalCertificateProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "passportProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profilePhotoProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signedContractProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vtcCardExpiresAt" TIMESTAMP(3),
ADD COLUMN     "vtcCardIssuedAt" TIMESTAMP(3),
ADD COLUMN     "vtcCardNumber" TEXT,
ADD COLUMN     "vtcCardProvided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workingRadiusKm" INTEGER;

-- CreateTable
CREATE TABLE "SecurityAgents" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "nationality" TEXT,
    "profilePhotoUrl" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emergencyContact" TEXT,
    "employmentStatus" "EmploymentStatus",
    "professionalCardNumber" TEXT,
    "cnapsNumber" TEXT,
    "cardIssuedAt" TIMESTAMP(3),
    "cardExpiresAt" TIMESTAMP(3),
    "specializations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experienceYears" INTEGER,
    "hasVipExperience" BOOLEAN NOT NULL DEFAULT false,
    "hasEventExperience" BOOLEAN NOT NULL DEFAULT false,
    "hasDriverLicenseB" BOOLEAN NOT NULL DEFAULT false,
    "additionalLicenses" TEXT,
    "physicalLevel" "PhysicalLevel",
    "hasFirstAidTraining" BOOLEAN NOT NULL DEFAULT false,
    "weaponExperience" BOOLEAN NOT NULL DEFAULT false,
    "readyForTravel" BOOLEAN NOT NULL DEFAULT false,
    "readyForNightShifts" BOOLEAN NOT NULL DEFAULT false,
    "passportProvided" BOOLEAN NOT NULL DEFAULT false,
    "professionalCardProvided" BOOLEAN NOT NULL DEFAULT false,
    "cnapsProvided" BOOLEAN NOT NULL DEFAULT false,
    "cvProvided" BOOLEAN NOT NULL DEFAULT false,
    "certificatesProvided" BOOLEAN NOT NULL DEFAULT false,
    "firstAidCertificateProvided" BOOLEAN NOT NULL DEFAULT false,
    "driverLicenseProvided" BOOLEAN NOT NULL DEFAULT false,
    "backgroundCheckProvided" BOOLEAN NOT NULL DEFAULT false,
    "profilePhotoProvided" BOOLEAN NOT NULL DEFAULT false,
    "signedContractProvided" BOOLEAN NOT NULL DEFAULT false,
    "baseCity" TEXT,
    "workingRadiusKm" INTEGER,
    "availability" TEXT,
    "hourlyRate" DECIMAL(10,2),
    "dailyRate" DECIMAL(10,2),
    "nightRate" DECIMAL(10,2),
    "canWorkInTeam" BOOLEAN NOT NULL DEFAULT true,
    "canTravelWithClient" BOOLEAN NOT NULL DEFAULT true,
    "canDoDriverSecurity" BOOLEAN NOT NULL DEFAULT false,
    "availabilityStatus" "AgentAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityAgents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SecurityAgents_organizationId_idx" ON "SecurityAgents"("organizationId");

-- AddForeignKey
ALTER TABLE "SecurityAgents" ADD CONSTRAINT "SecurityAgents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
