import { pgTable, text, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { users } from '../core/users.schema';
import { categories } from '../core/categories.schema';

// ============================================
// LİSTİNG TABLOSU (Base Tablo)
// ============================================
export const listings = pgTable('listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('TRY'), // 'TRY' | 'USD' | 'EUR'
  listingType: text('listing_type').notNull(), // 'yacht' | 'part' | 'marina' | 'crew' | 'service' | 'storage' | 'marketplace'
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason: text('rejection_reason'),
  location: text('location'),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }), // Ana kategori
  subcategoryId: text('subcategory_id').notNull().references(() => categories.id, { onDelete: 'restrict' }), // Alt kategori
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('listings_user_id_idx').on(table.userId),
  listingTypeIdx: index('listings_listing_type_idx').on(table.listingType),
  statusIdx: index('listings_status_idx').on(table.status),
  categoryIdIdx: index('listings_category_id_idx').on(table.categoryId),
  subcategoryIdIdx: index('listings_subcategory_id_idx').on(table.subcategoryId),
}));

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
