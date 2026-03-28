/*
  Warnings:

  - You are about to drop the column `serviceArea` on the `Organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "serviceArea",
ADD COLUMN     "serviceAreas" TEXT NOT NULL DEFAULT '';
