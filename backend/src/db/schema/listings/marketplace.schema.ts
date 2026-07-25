import { pgTable, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// MARKETPLACE LİSTİNGS TABLOSU (İkinci El Pazarı)
// ============================================
export const marketplaceListings = pgTable('marketplace_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  itemType: text('item_type').notNull(),
  brand: text('brand'),
  model: text('model'),
  condition: text('condition').notNull(),
  yearPurchased: integer('year_purchased'),
  usageFrequency: text('usage_frequency'),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  reasonForSelling: text('reason_for_selling'),
  dimensions: text('dimensions'),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  color: text('color'),
  material: text('material'),
  includesOriginalBox: boolean('includes_original_box').default(false),
  includesManual: boolean('includes_manual').default(true),
  includesAccessories: boolean('includes_accessories').default(false),
  accessoriesDescription: text('accessories_description'),
  negotiable: boolean('negotiable').default(true),
  acceptTrade: boolean('accept_trade').default(false),
  tradeInterests: text('trade_interests'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('marketplace_listings_listing_id_idx').on(table.listing_id),
  itemTypeIdx: index('marketplace_listings_item_type_idx').on(table.itemType),
}));

export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type NewMarketplaceListing = typeof marketplaceListings.$inferInsert;
