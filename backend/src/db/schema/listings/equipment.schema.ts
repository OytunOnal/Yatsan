import { pgTable, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// EQUIPMENT LİSTİNGS TABLOSU (Deniz Aracı Ekipmanları)
// ============================================
export const equipmentListings = pgTable('equipment_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  equipmentType: text('equipment_type').notNull(),
  brand: text('brand'),
  model: text('model'),
  condition: text('condition').notNull(),
  yearOfManufacture: integer('year_of_manufacture'),
  warrantyMonths: integer('warranty_months'),
  powerConsumption: decimal('power_consumption', { precision: 10, scale: 2 }),
  voltage: text('voltage'),
  dimensions: text('dimensions'),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  compatibleBoatTypes: text('compatible_boat_types'),
  compatibleBoatLengths: text('compatible_boat_lengths'),
  installationRequired: boolean('installation_required').default(false),
  manualIncluded: boolean('manual_included').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('equipment_listings_listing_id_idx').on(table.listing_id),
  equipmentTypeIdx: index('equipment_listings_equipment_type_idx').on(table.equipmentType),
}));

export type EquipmentListing = typeof equipmentListings.$inferSelect;
export type NewEquipmentListing = typeof equipmentListings.$inferInsert;
