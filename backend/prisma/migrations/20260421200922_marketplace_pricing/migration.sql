-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "appliedHolidaySurcharge" DECIMAL(10,2),
ADD COLUMN     "appliedNightSurcharge" DECIMAL(10,2),
ADD COLUMN     "baseCustomerPrice" DECIMAL(10,2),
ADD COLUMN     "finalCustomerPrice" DECIMAL(10,2),
ADD COLUMN     "finalPartnerPayout" DECIMAL(10,2),
ADD COLUMN     "partnerBasePayout" DECIMAL(10,2),
ADD COLUMN     "platformMargin" DECIMAL(10,2),
ADD COLUMN     "pricingSnapshotSource" TEXT;

-- AlterTable
ALTER TABLE "ChauffeurOrganizationDetails" ADD COLUMN     "partnerHolidaySurchargePercent" DECIMAL(5,2),
ADD COLUMN     "partnerMinimumFare" DECIMAL(10,2),
ADD COLUMN     "partnerNightSurchargePercent" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "VehiclePricings" ADD COLUMN     "holidaySurchargePercent" DECIMAL(5,2),
ADD COLUMN     "minimumFare" DECIMAL(10,2),
ADD COLUMN     "nightSurchargePercent" DECIMAL(5,2);
