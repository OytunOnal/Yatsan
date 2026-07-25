import { pgTable, text, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// PART LİSTİNGS TABLOSU
// ============================================
export const partListings = pgTable('part_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  condition: text('condition').notNull(), // 'new' | 'used' | 'refurbished'
  brand: text('brand').notNull(),
  oemCode: text('oem_code'),
  compatibility: text('compatibility'), // JSONB string - uyumlu modeller
  description: text('description'),
}, (table) => ({
  listingIdIdx: index('part_listings_listing_id_idx').on(table.listing_id),
}));

export type PartListing = typeof partListings.$inferSelect;
export type NewPartListing = typeof partListings.$inferInsert;
