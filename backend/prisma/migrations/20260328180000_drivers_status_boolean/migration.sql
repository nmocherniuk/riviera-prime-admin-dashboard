-- Drivers.status: PostgreSQL enum "DriverStatus" -> BOOLEAN (Prisma Boolean).
-- OFFLINE -> false; AVAILABLE and ON_RIDE -> true (active / on duty).

ALTER TABLE "Drivers" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Drivers" ALTER COLUMN "status" TYPE BOOLEAN USING (
  CASE "status"::text
    WHEN 'OFFLINE' THEN false
    ELSE true
  END
);

ALTER TABLE "Drivers" ALTER COLUMN "status" SET DEFAULT true;

DROP TYPE "DriverStatus";
