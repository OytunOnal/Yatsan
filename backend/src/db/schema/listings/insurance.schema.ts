import { pgTable, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// INSURANCE LİSTİNGS TABLOSU (Sigorta)
// ============================================
export const insuranceListings = pgTable('insurance_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  agencyName: text('agency_name'),
  licenseNumber: text('license_number'),
  insuranceType: text('insurance_type').notNull(),
  coverageTypes: text('coverage_types'),
  minBoatLength: decimal('min_boat_length', { precision: 6, scale: 2 }),
  maxBoatLength: decimal('max_boat_length', { precision: 6, scale: 2 }),
  minBoatValue: decimal('min_boat_value', { precision: 12, scale: 2 }),
  maxBoatValue: decimal('max_boat_value', { precision: 12, scale: 2 }),
  boatAgeLimit: integer('boat_age_limit'),
  coverageArea: text('coverage_area'),
  premiumCalculation: text('premium_calculation'),
  minPremium: decimal('min_premium', { precision: 10, scale: 2 }),
  premiumPercentage: decimal('premium_percentage', { precision: 5, scale: 2 }),
  hullCoverage: boolean('hull_coverage').default(false),
  liabilityCoverage: boolean('liability_coverage').default(false),
  salvageCoverage: boolean('salvage_coverage').default(false),
  personalAccident: boolean('personal_accident').default(false),
  legalProtection: boolean('legal_protection').default(false),
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  website: text('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('insurance_listings_listing_id_idx').on(table.listing_id),
  insuranceTypeIdx: index('insurance_listings_insurance_type_idx').on(table.insuranceType),
}));

export type InsuranceListing = typeof insuranceListings.$inferSelect;
export type NewInsuranceListing = typeof insuranceListings.$inferInsert;
