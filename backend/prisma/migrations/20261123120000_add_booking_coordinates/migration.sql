-- Google Places / Routes migration: store the selected place and its verified
-- coordinates on each booking. All columns are nullable: existing rows keep
-- their stored distanceKm and are not re-priced.
ALTER TABLE "Bookings" ADD COLUMN "fromPlaceId" TEXT;
ALTER TABLE "Bookings" ADD COLUMN "fromLat" DOUBLE PRECISION;
ALTER TABLE "Bookings" ADD COLUMN "fromLng" DOUBLE PRECISION;
ALTER TABLE "Bookings" ADD COLUMN "toPlaceId" TEXT;
ALTER TABLE "Bookings" ADD COLUMN "toLat" DOUBLE PRECISION;
ALTER TABLE "Bookings" ADD COLUMN "toLng" DOUBLE PRECISION;
