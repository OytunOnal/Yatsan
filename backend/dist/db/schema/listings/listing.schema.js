"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const users_schema_1 = require("../core/users.schema");
const categories_schema_1 = require("../core/categories.schema");
// ============================================
// LİSTİNG TABLOSU (Base Tablo)
// ============================================
exports.listings = (0, pg_core_1.pgTable)('listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.decimal)('price', { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.text)('currency').notNull().default('TRY'), // 'TRY' | 'USD' | 'EUR'
    listingType: (0, pg_core_1.text)('listing_type').notNull(), // 'yacht' | 'part' | 'marina' | 'crew' | 'service' | 'storage' | 'marketplace'
    status: (0, pg_core_1.text)('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    location: (0, pg_core_1.text)('location'),
    categoryId: (0, pg_core_1.text)('category_id').references(() => categories_schema_1.categories.id, { onDelete: 'set null' }), // Ana kategori
    subcategoryId: (0, pg_core_1.text)('subcategory_id').references(() => categories_schema_1.categories.id, { onDelete: 'set null' }), // Alt kategori
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('listings_user_id_idx').on(table.userId),
    listingTypeIdx: (0, pg_core_1.index)('listings_listing_type_idx').on(table.listingType),
    statusIdx: (0, pg_core_1.index)('listings_status_idx').on(table.status),
    categoryIdIdx: (0, pg_core_1.index)('listings_category_id_idx').on(table.categoryId),
    subcategoryIdIdx: (0, pg_core_1.index)('listings_subcategory_id_idx').on(table.subcategoryId),
}));
