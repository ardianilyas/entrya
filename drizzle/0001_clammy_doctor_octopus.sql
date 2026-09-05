CREATE TYPE "public"."organizer_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'organizer';--> statement-breakpoint
CREATE TABLE "organizers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_verified" boolean DEFAULT false,
	"status" "organizer_status" DEFAULT 'PENDING' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "organizers" ADD CONSTRAINT "organizers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;