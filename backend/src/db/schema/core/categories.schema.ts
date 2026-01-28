import { pgTable, text, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { users } from './users.schema';

// ============================================
// CATEGORIES TABLOSU (Ana ve Alt Kategoriler)
// ============================================
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'), // İkon adı veya URL
  image: text('image'), // Kategori resmi URL
  parentId: text('parent_id'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  listingCount: integer('listing_count').notNull().default(0), // İlan sayısı cache
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
  slugIdx: index('categories_slug_idx').on(table.slug),
  isActiveIdx: index('categories_is_active_idx').on(table.isActive),
}));

// ============================================
// CATEGORY SUGGESTIONS TABLOSU (Kullanıcı Önerileri)
// ============================================
export const categorySuggestions = pgTable('category_suggestions', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  description: text('description'),
  parentCategoryId: text('parent_category_id').notNull().references(() => categories.id),
  suggestedBy: text('suggested_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'MERGED'
  listingCount: integer('listing_count').notNull().default(0), // Bu kategorideki ilan sayısı
  reviewedBy: text('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at'),
  rejectionReason: text('rejection_reason'),
  mergedWith: text('merged_with').references(() => categories.id, { onDelete: 'set null' }), // Birleştirildiği kategori
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  suggestedByIdx: index('category_suggestions_suggested_by_idx').on(table.suggestedBy),
  parentCategoryIdIdx: index('category_suggestions_parent_category_id_idx').on(table.parentCategoryId),
  statusIdx: index('category_suggestions_status_idx').on(table.status),
  createdAtIdx: index('category_suggestions_created_at_idx').on(table.createdAt),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type CategorySuggestion = typeof categorySuggestions.$inferSelect;
export type NewCategorySuggestion = typeof categorySuggestions.$inferInsert;

export type CategoryStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MERGED';
