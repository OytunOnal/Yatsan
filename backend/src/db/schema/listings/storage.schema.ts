import { pgTable, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// STORAGE LİSTİNGS TABLOSU (Kara Park ve Kışlama)
// ============================================
export const storageListings = pgTable('storage_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  storageType: text('storage_type').notNull(),
  facilityName: text('facility_name'),
  maxBoatLength: decimal('max_boat_length', { precision: 6, scale: 2 }),
  maxBoatBeam: decimal('max_boat_beam', { precision: 6, scale: 2 }),
  maxBoatHeight: decimal('max_boat_height', { precision: 6, scale: 2 }),
  maxBoatWeight: decimal('max_boat_weight', { precision: 10, scale: 2 }),
  securityFeatures: text('security_features'),
  hasElectricity: boolean('has_electricity').default(false),
  hasWater: boolean('has_water').default(false),
  hasCamera: boolean('has_camera').default(false),
  hasGuard: boolean('has_guard').default(false),
  hasLift: boolean('has_lift').default(false),
  liftCapacity: decimal('lift_capacity', { precision: 10, scale: 2 }),
  accessHours: text('access_hours'),
  gateAccess: boolean('gate_access').default(false),
  winterizationService: boolean('winterization_service').default(false),
  maintenanceService: boolean('maintenance_service').default(false),
  launchService: boolean('launch_service').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('storage_listings_listing_id_idx').on(table.listing_id),
  storageTypeIdx: index('storage_listings_storage_type_idx').on(table.storageType),
}));

export type StorageListing = typeof storageListings.$inferSelect;
export type NewStorageListing = typeof storageListings.$inferInsert;
