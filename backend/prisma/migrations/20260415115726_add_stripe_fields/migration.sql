/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `Bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_stripePaymentIntentId_key" ON "Bookings"("stripePaymentIntentId");
