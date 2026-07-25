CREATE TABLE "broker_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"broker_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"inquiries" integer DEFAULT 0 NOT NULL,
	"leads" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"featured_until" timestamp,
	"promoted" boolean DEFAULT false NOT NULL,
	"promoted_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "broker_listings_listing_id_unique" UNIQUE("listing_id")
);
--> statement-breakpoint
CREATE TABLE "broker_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"broker_id" text NOT NULL,
	"logo" text,
	"cover_image" text,
	"description" text,
	"specialties" text,
	"languages" text,
	"service_areas" text,
	"website" text,
	"whatsapp" text,
	"working_hours" text,
	"social_media" text,
	"established_year" integer,
	"team_size" integer,
	"certifications" text,
	"awards" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "broker_profiles_broker_id_unique" UNIQUE("broker_id")
);
--> statement-breakpoint
CREATE TABLE "broker_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"broker_id" text NOT NULL,
	"user_id" text NOT NULL,
	"listing_id" text,
	"rating" integer NOT NULL,
	"title" text,
	"comment" text NOT NULL,
	"response" text,
	"response_at" timestamp,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"helpful" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brokers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"business_name" text NOT NULL,
	"slug" text NOT NULL,
	"tax_number" text NOT NULL,
	"tax_office" text NOT NULL,
	"license_number" text NOT NULL,
	"license_expiry" timestamp NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"rejection_reason" text,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0 NOT NULL,
	"response_rate" numeric(5, 2) DEFAULT '0',
	"response_time" integer,
	"verified_at" timestamp,
	"verified_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brokers_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "brokers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "crm_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"broker_id" text NOT NULL,
	"type" text NOT NULL,
	"subject" text NOT NULL,
	"description" text,
	"duration" integer,
	"outcome" text,
	"next_follow_up" timestamp,
	"attachments" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"broker_id" text NOT NULL,
	"listing_id" text,
	"user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"source" text NOT NULL,
	"status" text DEFAULT 'NEW' NOT NULL,
	"priority" text DEFAULT 'MEDIUM' NOT NULL,
	"budget" text,
	"interested_categories" text,
	"notes" text,
	"estimated_value" numeric(12, 2),
	"probability" integer,
	"expected_close_date" timestamp,
	"last_contact_date" timestamp,
	"next_follow_up" timestamp,
	"lost_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "broker_listings" ADD CONSTRAINT "broker_listings_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_listings" ADD CONSTRAINT "broker_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_profiles" ADD CONSTRAINT "broker_profiles_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_reviews" ADD CONSTRAINT "broker_reviews_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_reviews" ADD CONSTRAINT "broker_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_reviews" ADD CONSTRAINT "broker_reviews_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokers" ADD CONSTRAINT "brokers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokers" ADD CONSTRAINT "brokers_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_lead_id_crm_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."crm_leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "broker_listings_broker_id_idx" ON "broker_listings" USING btree ("broker_id");--> statement-breakpoint
CREATE INDEX "broker_listings_listing_id_idx" ON "broker_listings" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "broker_listings_featured_idx" ON "broker_listings" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "broker_profiles_broker_id_idx" ON "broker_profiles" USING btree ("broker_id");--> statement-breakpoint
CREATE INDEX "broker_reviews_broker_id_idx" ON "broker_reviews" USING btree ("broker_id");--> statement-breakpoint
CREATE INDEX "broker_reviews_user_id_idx" ON "broker_reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "broker_reviews_listing_id_idx" ON "broker_reviews" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "broker_reviews_status_idx" ON "broker_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "brokers_user_id_idx" ON "brokers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "brokers_slug_idx" ON "brokers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "brokers_status_idx" ON "brokers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "brokers_rating_idx" ON "brokers" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "crm_activities_lead_id_idx" ON "crm_activities" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "crm_activities_broker_id_idx" ON "crm_activities" USING btree ("broker_id");--> statement-breakpoint
CREATE INDEX "crm_activities_type_idx" ON "crm_activities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "crm_activities_created_at_idx" ON "crm_activities" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "crm_leads_broker_id_idx" ON "crm_leads" USING btree ("broker_id");--> statement-breakpoint
CREATE INDEX "crm_leads_listing_id_idx" ON "crm_leads" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "crm_leads_user_id_idx" ON "crm_leads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "crm_leads_status_idx" ON "crm_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "crm_leads_priority_idx" ON "crm_leads" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "crm_leads_next_follow_up_idx" ON "crm_leads" USING btree ("next_follow_up");