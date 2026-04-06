ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "vehicleClass" "VehicleClass";

ALTER TABLE "Bookings" DROP CONSTRAINT IF EXISTS "Bookings_vehicleId_fkey";
ALTER TABLE "Bookings" ALTER COLUMN "vehicleId" DROP NOT NULL;
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
