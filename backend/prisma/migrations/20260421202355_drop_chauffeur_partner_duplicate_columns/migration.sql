-- Preserve values from duplicate partner* columns into canonical fields before drop.
UPDATE "ChauffeurOrganizationDetails"
SET
  "minimumFare" = COALESCE("minimumFare", "partnerMinimumFare"),
  "holidaySurchargePercent" = COALESCE("holidaySurchargePercent", "partnerHolidaySurchargePercent"),
  "nightSurchargePercent" = COALESCE("nightSurchargePercent", "partnerNightSurchargePercent")
WHERE
  "partnerMinimumFare" IS NOT NULL
  OR "partnerHolidaySurchargePercent" IS NOT NULL
  OR "partnerNightSurchargePercent" IS NOT NULL;

-- AlterTable
ALTER TABLE "ChauffeurOrganizationDetails" DROP COLUMN "partnerHolidaySurchargePercent",
DROP COLUMN "partnerMinimumFare",
DROP COLUMN "partnerNightSurchargePercent";
