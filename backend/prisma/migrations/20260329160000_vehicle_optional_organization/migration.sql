ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_organizationId_fkey";

ALTER TABLE "Vehicles" ALTER COLUMN "organizationId" DROP NOT NULL;

ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
