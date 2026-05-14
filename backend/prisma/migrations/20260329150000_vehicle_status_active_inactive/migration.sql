CREATE TYPE "VehicleStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');

ALTER TABLE "Vehicles" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Vehicles" ALTER COLUMN "status" TYPE "VehicleStatus_new" USING ('ACTIVE'::"VehicleStatus_new");

ALTER TABLE "Vehicles" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"VehicleStatus_new";

DROP TYPE "VehicleStatus";

ALTER TYPE "VehicleStatus_new" RENAME TO "VehicleStatus";
