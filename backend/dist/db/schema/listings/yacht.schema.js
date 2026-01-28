"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yachtListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// YACHT LİSTİNGS TABLOSU
// ============================================
exports.yachtListings = (0, pg_core_1.pgTable)('yacht_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    // İlan Türü (Satılık veya Kiralık)
    yachtListingType: (0, pg_core_1.text)('yacht_listing_type').notNull(), // 'sale' | 'rent'
    // Tekne Bilgileri
    yachtType: (0, pg_core_1.text)('yacht_type').notNull(), // 'motor_yacht' | 'sailing_yacht' | 'catamaran' | 'gulet'
    year: (0, pg_core_1.integer)('year').notNull(),
    length: (0, pg_core_1.decimal)('length', { precision: 6, scale: 2 }).notNull(), // metre
    beam: (0, pg_core_1.decimal)('beam', { precision: 6, scale: 2 }).notNull(), // metre
    draft: (0, pg_core_1.decimal)('draft', { precision: 6, scale: 2 }).notNull(), // metre
    engineBrand: (0, pg_core_1.text)('engine_brand'),
    engineHours: (0, pg_core_1.integer)('engine_hours'),
    engineHP: (0, pg_core_1.integer)('engine_hp'),
    fuelType: (0, pg_core_1.text)('fuel_type'), // 'diesel' | 'petrol' | 'electric' | 'hybrid'
    cruisingSpeed: (0, pg_core_1.integer)('cruising_speed'), // knot
    maxSpeed: (0, pg_core_1.integer)('max_speed'), // knot
    cabinCount: (0, pg_core_1.integer)('cabin_count'),
    bedCount: (0, pg_core_1.integer)('bed_count'),
    bathroomCount: (0, pg_core_1.integer)('bathroom_count'),
    equipment: (0, pg_core_1.text)('equipment'), // JSONB string olarak saklanacak
    condition: (0, pg_core_1.text)('condition').notNull(), // 'new' | 'excellent' | 'good' | 'fair'
    // Kiralık İlanları İçin Ek Alanlar
    priceType: (0, pg_core_1.text)('price_type'), // 'daily' | 'weekly' | 'monthly' | 'yearly' | 'per_trip' (sadece kiralık için)
    capacity: (0, pg_core_1.integer)('capacity'), // Kişi kapasitesi (sadece kiralık için)
    crewIncluded: (0, pg_core_1.boolean)('crew_included').default(false), // Mürettebat dahil mi (sadece kiralık için)
    availability: (0, pg_core_1.text)('availability'), // JSONB string - müsaitlik takvimi (sadece kiralık için)
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('yacht_listings_listing_id_idx').on(table.listing_id),
    yachtListingTypeIdx: (0, pg_core_1.index)('yacht_listings_yacht_listing_type_idx').on(table.yachtListingType),
}));
