"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marinaListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// MARINA LİSTİNGS TABLOSU
// ============================================
exports.marinaListings = (0, pg_core_1.pgTable)('marina_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    priceType: (0, pg_core_1.text)('price_type').notNull(), // 'daily' | 'weekly' | 'monthly' | 'yearly'
    maxLength: (0, pg_core_1.decimal)('max_length', { precision: 6, scale: 2 }).notNull(), // metre
    maxBeam: (0, pg_core_1.decimal)('max_beam', { precision: 6, scale: 2 }).notNull(), // metre
    maxDraft: (0, pg_core_1.decimal)('max_draft', { precision: 6, scale: 2 }), // metre
    services: (0, pg_core_1.text)('services').notNull(), // JSONB string - elektrik, su, wifi, vb.
    availability: (0, pg_core_1.text)('availability'), // JSONB string - müsaitlik takvimi
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('marina_listings_listing_id_idx').on(table.listing_id),
}));
