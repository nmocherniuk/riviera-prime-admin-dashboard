-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('NONE', 'PENDING', 'PAID');

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "driverAmount" DECIMAL(10,2),
ADD COLUMN     "isTransferred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payoutStatus" "PayoutStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "platformFee" DECIMAL(10,2),
ADD COLUMN     "stripeTransferId" TEXT,
ADD COLUMN     "totalAmount" DECIMAL(10,2),
ADD COLUMN     "transferredAt" TIMESTAMP(3);
