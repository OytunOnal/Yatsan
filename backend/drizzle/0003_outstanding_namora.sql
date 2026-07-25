ALTER TABLE "listings" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "subcategory_id" text;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_subcategory_id_categories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "listings_category_id_idx" ON "listings" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "listings_subcategory_id_idx" ON "listings" USING btree ("subcategory_id");