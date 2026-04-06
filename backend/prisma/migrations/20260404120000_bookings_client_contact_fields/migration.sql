-- Align DB with Bookings model: contact + trip metadata (schema had these without a migration).

ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "clientEmail" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "clientPhone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "tripType" TEXT NOT NULL DEFAULT 'one-way';
ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "notesForDriver" TEXT NOT NULL DEFAULT '';
