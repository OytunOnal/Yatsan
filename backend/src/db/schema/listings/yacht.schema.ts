import { pgTable, text, integer, decimal, boolean, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// YACHT LİSTİNGS TABLOSU
// ============================================
export const yachtListings = pgTable('yacht_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  
  // İlan Türü (Satılık veya Kiralık)
  yachtListingType: text('yacht_listing_type').notNull(), // 'sale' | 'rent'
  
  // Tekne Bilgileri
  yachtType: text('yacht_type').notNull(), // 'motor_yacht' | 'sailing_yacht' | 'catamaran' | 'gulet'
  year: integer('year').notNull(),
  length: decimal('length', { precision: 6, scale: 2 }).notNull(), // metre
  beam: decimal('beam', { precision: 6, scale: 2 }).notNull(), // metre
  draft: decimal('draft', { precision: 6, scale: 2 }).notNull(), // metre
  engineBrand: text('engine_brand'),
  engineHours: integer('engine_hours'),
  engineHP: integer('engine_hp'),
  fuelType: text('fuel_type'), // 'diesel' | 'petrol' | 'electric' | 'hybrid'
  cruisingSpeed: integer('cruising_speed'), // knot
  maxSpeed: integer('max_speed'), // knot
  cabinCount: integer('cabin_count'),
  bedCount: integer('bed_count'),
  bathroomCount: integer('bathroom_count'),
  equipment: text('equipment'), // JSONB string olarak saklanacak
  condition: text('condition').notNull(), // 'new' | 'excellent' | 'good' | 'fair'
  
  // Kiralık İlanları İçin Ek Alanlar
  priceType: text('price_type'), // 'daily' | 'weekly' | 'monthly' | 'yearly' | 'per_trip' (sadece kiralık için)
  capacity: integer('capacity'), // Kişi kapasitesi (sadece kiralık için)
  crewIncluded: boolean('crew_included').default(false), // Mürettebat dahil mi (sadece kiralık için)
  availability: text('availability'), // JSONB string - müsaitlik takvimi (sadece kiralık için)
}, (table) => ({
  listingIdIdx: index('yacht_listings_listing_id_idx').on(table.listing_id),
  yachtListingTypeIdx: index('yacht_listings_yacht_listing_type_idx').on(table.yachtListingType),
}));

export type YachtListing = typeof yachtListings.$inferSelect;
export type NewYachtListing = typeof yachtListings.$inferInsert;
