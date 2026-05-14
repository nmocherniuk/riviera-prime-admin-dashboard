-- AlterTable
ALTER TABLE "Drivers" ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeOnboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Drivers_stripeAccountId_idx" ON "Drivers"("stripeAccountId");
