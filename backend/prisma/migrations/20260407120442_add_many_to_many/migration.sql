/*
  Warnings:

  - You are about to drop the column `driverId` on the `Vehicles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_driverId_fkey";

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "driverId";

-- CreateTable
CREATE TABLE "_DriversToVehicles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DriversToVehicles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DriversToVehicles_B_index" ON "_DriversToVehicles"("B");

-- AddForeignKey
ALTER TABLE "_DriversToVehicles" ADD CONSTRAINT "_DriversToVehicles_A_fkey" FOREIGN KEY ("A") REFERENCES "Drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriversToVehicles" ADD CONSTRAINT "_DriversToVehicles_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
