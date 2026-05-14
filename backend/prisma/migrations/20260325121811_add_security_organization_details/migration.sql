-- CreateTable
CREATE TABLE "SecurityOrganizationDetails" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyName" TEXT,
    "legalForm" TEXT,
    "sirenOrSiret" TEXT,
    "licenseNumber" TEXT,
    "cnapsNumber" TEXT,
    "registrationDate" TIMESTAMP(3),
    "registeredAddress" TEXT,
    "officeAddress" TEXT,
    "websiteUrl" TEXT,
    "generalEmail" TEXT,
    "companyPhoneNumber" TEXT,
    "directorFullName" TEXT,
    "primaryContactName" TEXT,
    "primaryContactEmail" TEXT,
    "primaryContactPhone" TEXT,
    "kbisUploaded" BOOLEAN NOT NULL DEFAULT false,
    "licenseUploaded" BOOLEAN NOT NULL DEFAULT false,
    "rcProInsuranceUploaded" BOOLEAN NOT NULL DEFAULT false,
    "cnapsAuthorizationUploaded" BOOLEAN NOT NULL DEFAULT false,
    "bankDetailsProvided" BOOLEAN NOT NULL DEFAULT false,
    "directorIdCopyProvided" BOOLEAN NOT NULL DEFAULT false,
    "signedPartnershipAgreement" BOOLEAN NOT NULL DEFAULT false,
    "additionalCertifications" TEXT,
    "serviceAreas" TEXT,
    "serviceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "support24_7" BOOLEAN NOT NULL DEFAULT false,
    "minBookingHours" INTEGER,
    "mobilizationTimeMinutes" INTEGER,
    "agentsCount" INTEGER,
    "languagesSpoken" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hasTeamLeader" BOOLEAN NOT NULL DEFAULT false,
    "armedPersonnelAllowed" BOOLEAN NOT NULL DEFAULT false,
    "unarmedPersonnelAllowed" BOOLEAN NOT NULL DEFAULT true,
    "internationalMissions" BOOLEAN NOT NULL DEFAULT false,
    "specialRequirements" TEXT,
    "hourlyRate" DECIMAL(10,2),
    "dailyRate" DECIMAL(10,2),
    "nightRate" DECIMAL(10,2),
    "eventRate" DECIMAL(10,2),
    "executiveProtectionRate" DECIMAL(10,2),
    "minimumBookingAmount" DECIMAL(10,2),
    "commissionPercent" DECIMAL(5,2),
    "paymentTerms" TEXT,
    "bankAccountIban" TEXT,
    "currency" TEXT DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityOrganizationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecurityOrganizationDetails_organizationId_key" ON "SecurityOrganizationDetails"("organizationId");

-- CreateIndex
CREATE INDEX "SecurityOrganizationDetails_organizationId_idx" ON "SecurityOrganizationDetails"("organizationId");

-- AddForeignKey
ALTER TABLE "SecurityOrganizationDetails" ADD CONSTRAINT "SecurityOrganizationDetails_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
