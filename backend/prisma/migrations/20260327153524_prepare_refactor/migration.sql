/*
  Warnings:

  - You are about to drop the column `companyName` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `companyPhoneNumber` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `generalEmail` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactEmail` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactName` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactPhone` on the `ChauffeurOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `serviceArea` on the `Organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChauffeurOrganizationDetails" DROP COLUMN "companyName",
DROP COLUMN "companyPhoneNumber",
DROP COLUMN "generalEmail",
DROP COLUMN "primaryContactEmail",
DROP COLUMN "primaryContactName",
DROP COLUMN "primaryContactPhone";

-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "serviceArea";
