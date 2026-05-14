/*
  Warnings:

  - You are about to drop the column `serviceAreas` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChauffeurOrganizationDetails" DROP COLUMN "serviceAreas";

-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "serviceArea" TEXT NOT NULL DEFAULT '';
