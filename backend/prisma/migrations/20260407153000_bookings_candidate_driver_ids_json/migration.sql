-- Replace legacy candidateVehicleIds (text[]) with candidateDriverIds (jsonb) for driver offers.

ALTER TABLE "Bookings" DROP COLUMN IF EXISTS "candidateVehicleIds";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Bookings'
      AND column_name = 'candidateDriverIds'
  ) THEN
    ALTER TABLE "Bookings" ADD COLUMN "candidateDriverIds" JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;
