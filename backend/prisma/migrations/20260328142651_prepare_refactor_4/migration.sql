/*
  Warnings:

  - You are about to drop the column `companyName` on the `SecurityOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `generalEmail` on the `SecurityOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactEmail` on the `SecurityOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactName` on the `SecurityOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactPhone` on the `SecurityOrganizationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `serviceAreas` on the `SecurityOrganizationDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SecurityOrganizationDetails" DROP COLUMN "companyName",
DROP COLUMN "generalEmail",
DROP COLUMN "primaryContactEmail",
DROP COLUMN "primaryContactName",
DROP COLUMN "primaryContactPhone",
DROP COLUMN "serviceAreas";
