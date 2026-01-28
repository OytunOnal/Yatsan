"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// PART LİSTİNGS TABLOSU
// ============================================
exports.partListings = (0, pg_core_1.pgTable)('part_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    condition: (0, pg_core_1.text)('condition').notNull(), // 'new' | 'used' | 'refurbished'
    brand: (0, pg_core_1.text)('brand').notNull(),
    oemCode: (0, pg_core_1.text)('oem_code'),
    compatibility: (0, pg_core_1.text)('compatibility'), // JSONB string - uyumlu modeller
    description: (0, pg_core_1.text)('description'),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('part_listings_listing_id_idx').on(table.listing_id),
}));
