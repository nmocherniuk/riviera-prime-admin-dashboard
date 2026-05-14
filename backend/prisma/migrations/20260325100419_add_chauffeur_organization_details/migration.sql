/*
  Warnings:

  - You are about to drop the `Bodyguards` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CooperationType" AS ENUM ('COMMISSION', 'FIXED_RATE', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "Bodyguards" DROP CONSTRAINT "Bodyguards_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_vehicleId_fkey";

-- DropTable
DROP TABLE "Bodyguards";

-- DropEnum
DROP TYPE "BodyguardAvailabilityStatus";

-- CreateTable
CREATE TABLE "ChauffeurOrganizationDetails" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyName" TEXT,
    "legalForm" TEXT,
    "sirenOrSiret" TEXT,
    "vatNumber" TEXT,
    "registrationDate" TIMESTAMP(3),
    "registrationCountry" TEXT DEFAULT 'France',
    "registeredAddress" TEXT,
    "mailingAddress" TEXT,
    "sameAsRegisteredAddress" BOOLEAN NOT NULL DEFAULT false,
    "websiteUrl" TEXT,
    "generalEmail" TEXT,
    "companyPhoneNumber" TEXT,
    "directorFullName" TEXT,
    "directorPosition" TEXT,
    "primaryContactName" TEXT,
    "primaryContactEmail" TEXT,
    "primaryContactPhone" TEXT,
    "kbisUploaded" BOOLEAN NOT NULL DEFAULT false,
    "rcProInsuranceUploaded" BOOLEAN NOT NULL DEFAULT false,
    "transportInsuranceUploaded" BOOLEAN NOT NULL DEFAULT false,
    "operatingLicenseProvided" BOOLEAN NOT NULL DEFAULT false,
    "bankDetailsProvided" BOOLEAN NOT NULL DEFAULT false,
    "directorIdCopyProvided" BOOLEAN NOT NULL DEFAULT false,
    "signedPartnershipAgreement" BOOLEAN NOT NULL DEFAULT false,
    "additionalCertifications" TEXT,
    "documentNotes" TEXT,
    "serviceAreas" TEXT,
    "serviceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "workingHours" TEXT,
    "support24_7" BOOLEAN NOT NULL DEFAULT false,
    "languagesSpoken" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxConcurrentBookings" INTEGER,
    "minAdvanceBookingHours" INTEGER,
    "acceptsUrgentBookings" BOOLEAN NOT NULL DEFAULT false,
    "cancellationPolicy" TEXT,
    "specialConditionsNotes" TEXT,
    "cooperationType" "CooperationType",
    "bankAccountIban" TEXT,
    "paymentTerms" TEXT,
    "commissionPercent" DECIMAL(5,2),
    "currency" TEXT DEFAULT 'EUR',
    "minimumFare" DECIMAL(10,2),
    "hourlyRate" DECIMAL(10,2),
    "transferBaseRate" DECIMAL(10,2),
    "nightSurchargePercent" DECIMAL(5,2),
    "holidaySurchargePercent" DECIMAL(5,2),
    "waitingTimeFee" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChauffeurOrganizationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChauffeurOrganizationDetails_organizationId_key" ON "ChauffeurOrganizationDetails"("organizationId");

-- CreateIndex
CREATE INDEX "ChauffeurOrganizationDetails_organizationId_idx" ON "ChauffeurOrganizationDetails"("organizationId");

-- CreateIndex
CREATE INDEX "Organizations_type_idx" ON "Organizations"("type");

-- AddForeignKey
ALTER TABLE "ChauffeurOrganizationDetails" ADD CONSTRAINT "ChauffeurOrganizationDetails_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
