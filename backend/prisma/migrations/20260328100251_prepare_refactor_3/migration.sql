/*
  Warnings:

  - You are about to drop the column `title` on the `Organizations` table. All the data in the column will be lost.
  - Added the required column `organizationName` to the `Organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "title",
ADD COLUMN     "organizationName" TEXT NOT NULL;
