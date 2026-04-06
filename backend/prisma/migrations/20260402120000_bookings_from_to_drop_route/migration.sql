ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "from" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Bookings" ADD COLUMN IF NOT EXISTS "to" TEXT NOT NULL DEFAULT '';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Bookings' AND column_name = 'route'
  ) THEN
    UPDATE "Bookings"
    SET "from" = trim(split_part("route", '→', 1)), "to" = trim(split_part("route", '→', 2))
    WHERE COALESCE(trim("route"), '') <> '' AND position('→' in "route") > 0;

    UPDATE "Bookings"
    SET "from" = trim(split_part("route", ' to ', 1)), "to" = trim(split_part("route", ' to ', 2))
    WHERE COALESCE(trim("route"), '') <> '' AND position(' to ' in lower("route")) > 0;

    UPDATE "Bookings"
    SET "from" = trim("route")
    WHERE COALESCE(trim("route"), '') <> '' AND trim(COALESCE("from", '')) = '' AND trim(COALESCE("to", '')) = '';

    ALTER TABLE "Bookings" DROP COLUMN "route";
  END IF;
END $$;
