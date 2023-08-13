DROP TABLE "items";--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "content" json DEFAULT '[]' NOT NULL;