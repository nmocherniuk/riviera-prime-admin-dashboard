-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN "year" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Vehicles" ADD COLUMN "color" TEXT NOT NULL DEFAULT '';

UPDATE "Vehicles" SET
  "year" = CASE
    WHEN position(' ' in "yearColor") > 0 THEN split_part("yearColor", ' ', 1)
    ELSE "yearColor"
  END,
  "color" = CASE
    WHEN position(' ' in "yearColor") > 0 THEN trim(substring("yearColor" from position(' ' in "yearColor") + 1))
    ELSE ''
  END;

ALTER TABLE "Vehicles" DROP COLUMN "yearColor";
ALTER TABLE "Vehicles" DROP COLUMN "nextService";

ALTER TABLE "Vehicles" ALTER COLUMN "year" DROP DEFAULT;
ALTER TABLE "Vehicles" ALTER COLUMN "color" DROP DEFAULT;
