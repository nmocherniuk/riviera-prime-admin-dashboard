-- CreateTable
CREATE TABLE "VehiclePricings" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "perHour" DECIMAL(10,2) NOT NULL,
    "perKm" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehiclePricings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehiclePricings_vehicleId_key" ON "VehiclePricings"("vehicleId");

-- AddForeignKey
ALTER TABLE "VehiclePricings" ADD CONSTRAINT "VehiclePricings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
