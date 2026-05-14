-- Add boolean status (active / inactive), migrate from AgentAvailabilityStatus, drop enum.

ALTER TABLE "SecurityAgents" ADD COLUMN "status" BOOLEAN NOT NULL DEFAULT true;

UPDATE "SecurityAgents"
SET "status" = CASE
  WHEN "availabilityStatus"::text = 'OFF_DUTY' THEN false
  ELSE true
END;

ALTER TABLE "SecurityAgents" DROP COLUMN "availabilityStatus";

DROP TYPE "AgentAvailabilityStatus";
