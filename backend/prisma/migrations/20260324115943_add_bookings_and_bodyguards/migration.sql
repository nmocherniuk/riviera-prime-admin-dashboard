-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "BodyguardAvailabilityStatus" AS ENUM ('AVAILABLE', 'ON_ASSIGNMENT', 'OFF_DUTY');

-- CreateTable
CREATE TABLE "Bookings" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT,
    "bookingAt" TIMESTAMP(3) NOT NULL,
    "route" TEXT NOT NULL DEFAULT '',
    "durationMin" INTEGER NOT NULL DEFAULT 60,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bodyguards" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availabilityStatus" "BodyguardAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bodyguards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bookings_bookingAt_idx" ON "Bookings"("bookingAt");

-- CreateIndex
CREATE INDEX "Bookings_driverId_idx" ON "Bookings"("driverId");

-- CreateIndex
CREATE INDEX "Bookings_vehicleId_idx" ON "Bookings"("vehicleId");

-- CreateIndex
CREATE INDEX "Bodyguards_organizationId_idx" ON "Bodyguards"("organizationId");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bodyguards" ADD CONSTRAINT "Bodyguards_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
