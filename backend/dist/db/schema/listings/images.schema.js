"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingImages = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// LİSTİNG IMAGES TABLOSU
// ============================================
exports.listingImages = (0, pg_core_1.pgTable)('listing_images', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    url: (0, pg_core_1.text)('url').notNull(),
    orderIndex: (0, pg_core_1.integer)('order_index').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('listing_images_listing_id_idx').on(table.listing_id),
}));
