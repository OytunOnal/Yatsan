ALTER TABLE "listings" DROP CONSTRAINT "listings_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" DROP CONSTRAINT "listings_subcategory_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "subcategory_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_subcategory_id_categories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;