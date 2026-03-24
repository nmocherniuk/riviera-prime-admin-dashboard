/*
  Warnings:

  - You are about to drop the `Driver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_organizationId_fkey";

-- DropTable
DROP TABLE "Driver";

-- DropTable
DROP TABLE "Organization";

-- CreateTable
CREATE TABLE "Organizations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "serviceArea" TEXT NOT NULL DEFAULT '',
    "status" BOOLEAN NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drivers" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleColor" TEXT NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "rides" INTEGER NOT NULL DEFAULT 0,
    "todayShift" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_email_key" ON "Organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_phone_key" ON "Organizations"("phone");

-- CreateIndex
CREATE INDEX "Drivers_organizationId_idx" ON "Drivers"("organizationId");

-- AddForeignKey
ALTER TABLE "Drivers" ADD CONSTRAINT "Drivers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
