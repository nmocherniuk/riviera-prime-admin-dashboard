/*
  Replaces title with organizationName. Safe when Organizations already has rows:
  add nullable column → backfill from title → NOT NULL → drop title.
*/
ALTER TABLE "Organizations" ADD COLUMN IF NOT EXISTS "organizationName" TEXT;

UPDATE "Organizations"
SET "organizationName" = COALESCE("title", 'Organization')
WHERE "organizationName" IS NULL;

ALTER TABLE "Organizations" ALTER COLUMN "organizationName" SET NOT NULL;

ALTER TABLE "Organizations" DROP COLUMN IF EXISTS "title";
