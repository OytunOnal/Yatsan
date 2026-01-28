"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySuggestions = exports.categories = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const users_schema_1 = require("./users.schema");
// ============================================
// CATEGORIES TABLOSU (Ana ve Alt Kategoriler)
// ============================================
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    icon: (0, pg_core_1.text)('icon'), // İkon adı veya URL
    image: (0, pg_core_1.text)('image'), // Kategori resmi URL
    parentId: (0, pg_core_1.text)('parent_id'),
    order: (0, pg_core_1.integer)('order').notNull().default(0),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    listingCount: (0, pg_core_1.integer)('listing_count').notNull().default(0), // İlan sayısı cache
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    parentIdIdx: (0, pg_core_1.index)('categories_parent_id_idx').on(table.parentId),
    slugIdx: (0, pg_core_1.index)('categories_slug_idx').on(table.slug),
    isActiveIdx: (0, pg_core_1.index)('categories_is_active_idx').on(table.isActive),
}));
// ============================================
// CATEGORY SUGGESTIONS TABLOSU (Kullanıcı Önerileri)
// ============================================
exports.categorySuggestions = (0, pg_core_1.pgTable)('category_suggestions', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    parentCategoryId: (0, pg_core_1.text)('parent_category_id').notNull().references(() => exports.categories.id),
    suggestedBy: (0, pg_core_1.text)('suggested_by').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    status: (0, pg_core_1.text)('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'MERGED'
    listingCount: (0, pg_core_1.integer)('listing_count').notNull().default(0), // Bu kategorideki ilan sayısı
    reviewedBy: (0, pg_core_1.text)('reviewed_by').references(() => users_schema_1.users.id, { onDelete: 'set null' }),
    reviewedAt: (0, pg_core_1.timestamp)('reviewed_at'),
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    mergedWith: (0, pg_core_1.text)('merged_with').references(() => exports.categories.id, { onDelete: 'set null' }), // Birleştirildiği kategori
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    suggestedByIdx: (0, pg_core_1.index)('category_suggestions_suggested_by_idx').on(table.suggestedBy),
    parentCategoryIdIdx: (0, pg_core_1.index)('category_suggestions_parent_category_id_idx').on(table.parentCategoryId),
    statusIdx: (0, pg_core_1.index)('category_suggestions_status_idx').on(table.status),
    createdAtIdx: (0, pg_core_1.index)('category_suggestions_created_at_idx').on(table.createdAt),
}));
