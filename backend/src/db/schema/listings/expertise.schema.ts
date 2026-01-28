import { pgTable, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// EXPERTISE LİSTİNGS TABLOSU (Ekspertiz)
// ============================================
export const expertiseListings = pgTable('expertise_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  companyName: text('company_name'),
  expertName: text('expert_name'),
  licenseNumber: text('license_number'),
  yearsExperience: integer('years_experience'),
  expertiseType: text('expertise_type').notNull(),
  boatTypes: text('boat_types'),
  minBoatLength: decimal('min_boat_length', { precision: 6, scale: 2 }),
  maxBoatLength: decimal('max_boat_length', { precision: 6, scale: 2 }),
  serviceArea: text('service_area'),
  mobileService: boolean('mobile_service').default(false),
  reportTypes: text('report_types'),
  reportLanguages: text('report_languages'),
  turnaroundTime: text('turnaround_time'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  pricePerMeter: decimal('price_per_meter', { precision: 10, scale: 2 }),
  travelFee: decimal('travel_fee', { precision: 10, scale: 2 }),
  certifications: text('certifications'),
  memberships: text('memberships'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('expertise_listings_listing_id_idx').on(table.listing_id),
  expertiseTypeIdx: index('expertise_listings_expertise_type_idx').on(table.expertiseType),
}));

export type ExpertiseListing = typeof expertiseListings.$inferSelect;
export type NewExpertiseListing = typeof expertiseListings.$inferInsert;
