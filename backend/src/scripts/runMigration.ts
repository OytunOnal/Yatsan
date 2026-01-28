import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:co4se+9e@localhost:5432/yatsan';

async function runMigration() {
  const sql = postgres(DATABASE_URL, { max: 1 });
  
  try {
    console.log('📦 Migration başlatılıyor...');
    
    // Sadece yeni tabloları ve güncellemeleri çalıştır
    // İlk olarak yacht_listings tablosuna yeni sütunu ekle
    console.log('1️⃣ yacht_listings tablosuna yacht_listing_type sütunu ekleniyor...');
    await sql`ALTER TABLE "yacht_listings" ADD COLUMN IF NOT EXISTS "yacht_listing_type" text`;
    
    console.log('2️⃣ Mevcut kayıtlara varsayılan değer atanıyor...');
    await sql`UPDATE "yacht_listings" SET "yacht_listing_type" = 'sale' WHERE "yacht_listing_type" IS NULL`;
    
    console.log('3️⃣ NOT NULL constraint ekleniyor...');
    await sql`ALTER TABLE "yacht_listings" ALTER COLUMN "yacht_listing_type" SET NOT NULL`;
    
    console.log('4️⃣ Diğer yacht_listings sütunları ekleniyor...');
    await sql`ALTER TABLE "yacht_listings" ADD COLUMN IF NOT EXISTS "price_type" text`;
    await sql`ALTER TABLE "yacht_listings" ADD COLUMN IF NOT EXISTS "capacity" integer`;
    await sql`ALTER TABLE "yacht_listings" ADD COLUMN IF NOT EXISTS "crew_included" boolean DEFAULT false`;
    await sql`ALTER TABLE "yacht_listings" ADD COLUMN IF NOT EXISTS "availability" text`;
    
    console.log('5️⃣ yacht_listings index ekleniyor...');
    await sql`CREATE INDEX IF NOT EXISTS "yacht_listings_yacht_listing_type_idx" ON "yacht_listings" USING btree ("yacht_listing_type")`;
    
    // Yeni tablolar
    console.log('6️⃣ equipment_listings tablosu oluşturuluyor...');
    await sql`
      CREATE TABLE IF NOT EXISTS "equipment_listings" (
        "id" text PRIMARY KEY NOT NULL,
        "listing_id" text NOT NULL,
        "equipment_type" text NOT NULL,
        "brand" text,
        "model" text,
        "condition" text NOT NULL,
        "year_of_manufacture" integer,
        "warranty_months" integer,
        "power_consumption" numeric(10, 2),
        "voltage" text,
        "dimensions" text,
        "weight" numeric(10, 2),
        "compatible_boat_types" text,
        "compatible_boat_lengths" text,
        "installation_required" boolean DEFAULT false,
        "manual_included" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    console.log('7️⃣ service_listings tablosu oluşturuluyor...');
    await sql`
      CREATE TABLE IF NOT EXISTS "service_listings" (
        "id" text PRIMARY KEY NOT NULL,
        "listing_id" text NOT NULL,
        "service_type" text NOT NULL,
        "business_name" text,
        "years_in_business" integer,
        "certifications" text,
        "authorized_brands" text,
        "service_area" text,
        "mobile_service" boolean DEFAULT false,
        "emergency_service" boolean DEFAULT false,
        "emergency_phone" text,
        "price_type" text,
        "hourly_rate" numeric(10, 2),
        "min_service_fee" numeric(10, 2),
        "working_hours" text,
        "website" text,
        "whatsapp" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    console.log('8️⃣ storage_listings tablosu oluşturuluyor...');
    await sql`
      CREATE TABLE IF NOT EXISTS "storage_listings" (
        "id" text PRIMARY KEY NOT NULL,
        "listing_id" text NOT NULL,
        "storage_type" text NOT NULL,
        "facility_name" text,
        "max_boat_length" numeric(6, 2),
        "max_boat_beam" numeric(6, 2),
        "max_boat_height" numeric(6, 2),
        "max_boat_weight" numeric(10, 2),
        "security_features" text,
        "has_electricity" boolean DEFAULT false,
        "has_water" boolean DEFAULT false,
        "has_camera" boolean DEFAULT false,
        "has_guard" boolean DEFAULT false,
        "has_lift" boolean DEFAULT false,
        "lift_capacity" numeric(10, 2),
        "access_hours" text,
        "gate_access" boolean DEFAULT false,
        "winterization_service" boolean DEFAULT false,
        "maintenance_service" boolean DEFAULT false,
        "launch_service" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    console.log('9️⃣ insurance_listings tablosu oluşturuluyor...');
    await sql`
      CREATE TABLE IF NOT EXISTS "insurance_listings" (
        "id" text PRIMARY KEY NOT NULL,
        "listing_id" text NOT NULL,
        "company_name" text NOT NULL,
        "agency_name" text,
        "license_number" text,
        "insurance_type" text NOT NULL,
        "coverage_types" text,
        "min_boat_length" numeric(6, 2),
        "max_boat_length" numeric(6, 2),
        "min_boat_value" numeric(12, 2),
        "max_boat_value" numeric(12, 2),
        "boat_age_limit" integer,
        "coverage_area" text,
        "premium_calculation" text,
        "min_premium" numeric(10, 2),
        "premium_percentage" numeric(5, 2),
        "hull_coverage" boolean DEFAULT false,
        "liability_coverage" boolean DEFAULT false,
        "salvage_coverage" boolean DEFAULT false,
        "personal_accident" boolean DEFAULT false,
        "legal_protection" boolean DEFAULT false,
        "contact_person" text,
        "contact_phone" text,
        "contact_email" text,
        "website" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    console.log('🔟 expertise_listings tablosu oluşturuluyor...');
    await sql`
      CREATE TABLE IF NOT EXISTS "expertise_listings" (
        "id" text PRIMARY KEY NOT NULL,
        "listing_id" text NOT NULL,
        "company_name" text,
        "expert_name" text,
        "license_number" text,
        "years_experience" integer,
        "expertise_type" text NOT NULL,
        "boat_types" text,
        "min_boat_length" numeric(6, 2),
        "max_boat_length" numeric(6, 2),
        "service_area" text,
        "mobile_service" boolean DEFAULT false,
        "report_types" text,
        "report_languages" text,
        "turnaround_time" text,
        "base_price" numeric(10, 2),
        "price_per_meter" numeric(10, 2),
        "travel_fee" numeric(10, 2),
        "certifications" text,
        "memberships" text,
        "phone" text,
        "email" text,
        "website" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    console.log('1️⃣1️⃣ marketplace_listings tablosu oluşturuluyor...');
    await sql`
      CREATE TABLE IF NOT EXISTS "marketplace_listings" (
        "id" text PRIMARY KEY NOT NULL,
        "listing_id" text NOT NULL,
        "item_type" text NOT NULL,
        "brand" text,
        "model" text,
        "condition" text NOT NULL,
        "year_purchased" integer,
        "usage_frequency" text,
        "original_price" numeric(10, 2),
        "reason_for_selling" text,
        "dimensions" text,
        "weight" numeric(10, 2),
        "color" text,
        "material" text,
        "includes_original_box" boolean DEFAULT false,
        "includes_manual" boolean DEFAULT true,
        "includes_accessories" boolean DEFAULT false,
        "accessories_description" text,
        "negotiable" boolean DEFAULT true,
        "accept_trade" boolean DEFAULT false,
        "trade_interests" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    // Foreign Key'ler
    console.log('1️⃣2️⃣ Foreign Key constraint\'lar ekleniyor...');
    await sql`ALTER TABLE "equipment_listings" ADD CONSTRAINT "equipment_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action`.catch(() => console.log('  - equipment_listings FK zaten var'));
    await sql`ALTER TABLE "service_listings" ADD CONSTRAINT "service_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action`.catch(() => console.log('  - service_listings FK zaten var'));
    await sql`ALTER TABLE "storage_listings" ADD CONSTRAINT "storage_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action`.catch(() => console.log('  - storage_listings FK zaten var'));
    await sql`ALTER TABLE "insurance_listings" ADD CONSTRAINT "insurance_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action`.catch(() => console.log('  - insurance_listings FK zaten var'));
    await sql`ALTER TABLE "expertise_listings" ADD CONSTRAINT "expertise_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action`.catch(() => console.log('  - expertise_listings FK zaten var'));
    await sql`ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action`.catch(() => console.log('  - marketplace_listings FK zaten var'));
    
    // Index'ler
    console.log('1️⃣3️⃣ Index\'ler ekleniyor...');
    await sql`CREATE INDEX IF NOT EXISTS "equipment_listings_listing_id_idx" ON "equipment_listings" USING btree ("listing_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "equipment_listings_equipment_type_idx" ON "equipment_listings" USING btree ("equipment_type")`;
    await sql`CREATE INDEX IF NOT EXISTS "service_listings_listing_id_idx" ON "service_listings" USING btree ("listing_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "service_listings_service_type_idx" ON "service_listings" USING btree ("service_type")`;
    await sql`CREATE INDEX IF NOT EXISTS "storage_listings_listing_id_idx" ON "storage_listings" USING btree ("listing_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "storage_listings_storage_type_idx" ON "storage_listings" USING btree ("storage_type")`;
    await sql`CREATE INDEX IF NOT EXISTS "insurance_listings_listing_id_idx" ON "insurance_listings" USING btree ("listing_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "insurance_listings_insurance_type_idx" ON "insurance_listings" USING btree ("insurance_type")`;
    await sql`CREATE INDEX IF NOT EXISTS "expertise_listings_listing_id_idx" ON "expertise_listings" USING btree ("listing_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "expertise_listings_expertise_type_idx" ON "expertise_listings" USING btree ("expertise_type")`;
    await sql`CREATE INDEX IF NOT EXISTS "marketplace_listings_listing_id_idx" ON "marketplace_listings" USING btree ("listing_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "marketplace_listings_item_type_idx" ON "marketplace_listings" USING btree ("item_type")`;
    
    console.log('✅ Migration başarıyla tamamlandı!');
    
  } catch (error) {
    console.error('❌ Migration hatası:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
