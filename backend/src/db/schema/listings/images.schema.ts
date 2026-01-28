import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// LİSTİNG IMAGES TABLOSU
// ============================================
export const listingImages = pgTable('listing_images', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('listing_images_listing_id_idx').on(table.listing_id),
}));

export type ListingImage = typeof listingImages.$inferSelect;
export type NewListingImage = typeof listingImages.$inferInsert;
