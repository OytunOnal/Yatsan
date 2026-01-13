CREATE TABLE "crew_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"position" text NOT NULL,
	"experience" integer NOT NULL,
	"certifications" text,
	"availability" text NOT NULL,
	"available_from" timestamp,
	"available_to" timestamp,
	"salary" numeric(10, 2),
	"salary_currency" text DEFAULT 'USD',
	"salary_period" text
);
--> statement-breakpoint
CREATE TABLE "listing_images" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"url" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"listing_type" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"rejection_reason" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marina_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"price_type" text NOT NULL,
	"max_length" numeric(6, 2) NOT NULL,
	"max_beam" numeric(6, 2) NOT NULL,
	"max_draft" numeric(6, 2),
	"services" text NOT NULL,
	"availability" text
);
--> statement-breakpoint
CREATE TABLE "marinas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"city" text NOT NULL,
	"country" text DEFAULT 'Türkiye' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"capacity" integer,
	"max_length" numeric(6, 2),
	"services" text,
	"contact_phone" text,
	"contact_email" text,
	"website" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"listing_id" text,
	"content" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "part_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"condition" text NOT NULL,
	"brand" text NOT NULL,
	"oem_code" text,
	"compatibility" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"password" text NOT NULL,
	"user_type" text NOT NULL,
	"kvkk_approved" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'INACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"reset_password_token" text,
	"reset_password_expires" timestamp,
	"last_password_reset" timestamp,
	"email_verification_expires" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_reset_password_token_unique" UNIQUE("reset_password_token")
);
--> statement-breakpoint
CREATE TABLE "yacht_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"yacht_type" text NOT NULL,
	"year" integer NOT NULL,
	"length" numeric(6, 2) NOT NULL,
	"beam" numeric(6, 2) NOT NULL,
	"draft" numeric(6, 2) NOT NULL,
	"engine_brand" text,
	"engine_hours" integer,
	"engine_hp" integer,
	"fuel_type" text,
	"cruising_speed" integer,
	"max_speed" integer,
	"cabin_count" integer,
	"bed_count" integer,
	"bathroom_count" integer,
	"equipment" text,
	"condition" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crew_listings" ADD CONSTRAINT "crew_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marina_listings" ADD CONSTRAINT "marina_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "part_listings" ADD CONSTRAINT "part_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yacht_listings" ADD CONSTRAINT "yacht_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "crew_listings_listing_id_idx" ON "crew_listings" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "listing_images_listing_id_idx" ON "listing_images" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "listings_user_id_idx" ON "listings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "listings_listing_type_idx" ON "listings" USING btree ("listing_type");--> statement-breakpoint
CREATE INDEX "listings_status_idx" ON "listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "marina_listings_listing_id_idx" ON "marina_listings" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "marinas_city_idx" ON "marinas" USING btree ("city");--> statement-breakpoint
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "messages_receiver_id_idx" ON "messages" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "messages_listing_id_idx" ON "messages" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "part_listings_listing_id_idx" ON "part_listings" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "yacht_listings_listing_id_idx" ON "yacht_listings" USING btree ("listing_id");