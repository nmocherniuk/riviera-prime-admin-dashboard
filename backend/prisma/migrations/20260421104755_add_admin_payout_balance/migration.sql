-- CreateEnum
CREATE TYPE "PlatformPayoutStatus" AS ENUM ('NONE', 'AVAILABLE', 'PAID');

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "platformPayoutStatus" "PlatformPayoutStatus" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "AdminPayouts" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminPayouts_pkey" PRIMARY KEY ("id")
);
