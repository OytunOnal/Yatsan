import { pgTable, text, decimal, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// MARINA LİSTİNGS TABLOSU
// ============================================
export const marinaListings = pgTable('marina_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  priceType: text('price_type').notNull(), // 'daily' | 'weekly' | 'monthly' | 'yearly'
  maxLength: decimal('max_length', { precision: 6, scale: 2 }).notNull(), // metre
  maxBeam: decimal('max_beam', { precision: 6, scale: 2 }).notNull(), // metre
  maxDraft: decimal('max_draft', { precision: 6, scale: 2 }), // metre
  services: text('services').notNull(), // JSONB string - elektrik, su, wifi, vb.
  availability: text('availability'), // JSONB string - müsaitlik takvimi
}, (table) => ({
  listingIdIdx: index('marina_listings_listing_id_idx').on(table.listing_id),
}));

export type MarinaListing = typeof marinaListings.$inferSelect;
export type NewMarinaListing = typeof marinaListings.$inferInsert;
