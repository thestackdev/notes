ALTER TABLE "items" ALTER COLUMN "content" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "is_done";