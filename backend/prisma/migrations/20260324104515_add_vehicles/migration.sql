-- CreateEnum
CREATE TYPE "VehicleClass" AS ENUM ('COMFORT', 'BUSINESS', 'VAN');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'ON_TRIP');

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "driverId" TEXT,
    "vehicleName" TEXT NOT NULL,
    "yearColor" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "class" "VehicleClass" NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "nextService" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_driverId_key" ON "Vehicles"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_licensePlate_key" ON "Vehicles"("licensePlate");

-- CreateIndex
CREATE INDEX "Vehicles_organizationId_idx" ON "Vehicles"("organizationId");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
