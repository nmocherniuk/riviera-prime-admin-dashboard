-- AlterTable
ALTER TABLE "Vehicles"
ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "passengers" INTEGER,
ADD COLUMN "baggageCount" INTEGER,
ADD COLUMN "vehicleType" TEXT,
ADD COLUMN "transmission" TEXT,
ADD COLUMN "interior" TEXT,
ADD COLUMN "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
