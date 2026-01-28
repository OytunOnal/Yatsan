"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketplaceListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// MARKETPLACE LİSTİNGS TABLOSU (İkinci El Pazarı)
// ============================================
exports.marketplaceListings = (0, pg_core_1.pgTable)('marketplace_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    itemType: (0, pg_core_1.text)('item_type').notNull(),
    brand: (0, pg_core_1.text)('brand'),
    model: (0, pg_core_1.text)('model'),
    condition: (0, pg_core_1.text)('condition').notNull(),
    yearPurchased: (0, pg_core_1.integer)('year_purchased'),
    usageFrequency: (0, pg_core_1.text)('usage_frequency'),
    originalPrice: (0, pg_core_1.decimal)('original_price', { precision: 10, scale: 2 }),
    reasonForSelling: (0, pg_core_1.text)('reason_for_selling'),
    dimensions: (0, pg_core_1.text)('dimensions'),
    weight: (0, pg_core_1.decimal)('weight', { precision: 10, scale: 2 }),
    color: (0, pg_core_1.text)('color'),
    material: (0, pg_core_1.text)('material'),
    includesOriginalBox: (0, pg_core_1.boolean)('includes_original_box').default(false),
    includesManual: (0, pg_core_1.boolean)('includes_manual').default(true),
    includesAccessories: (0, pg_core_1.boolean)('includes_accessories').default(false),
    accessoriesDescription: (0, pg_core_1.text)('accessories_description'),
    negotiable: (0, pg_core_1.boolean)('negotiable').default(true),
    acceptTrade: (0, pg_core_1.boolean)('accept_trade').default(false),
    tradeInterests: (0, pg_core_1.text)('trade_interests'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('marketplace_listings_listing_id_idx').on(table.listing_id),
    itemTypeIdx: (0, pg_core_1.index)('marketplace_listings_item_type_idx').on(table.itemType),
}));
