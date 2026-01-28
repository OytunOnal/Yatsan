import { pgTable, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// SERVICE LİSTİNGS TABLOSU (Teknik Servisler)
// ============================================
export const serviceListings = pgTable('service_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  serviceType: text('service_type').notNull(),
  businessName: text('business_name'),
  yearsInBusiness: integer('years_in_business'),
  certifications: text('certifications'),
  authorizedBrands: text('authorized_brands'),
  serviceArea: text('service_area'),
  mobileService: boolean('mobile_service').default(false),
  emergencyService: boolean('emergency_service').default(false),
  emergencyPhone: text('emergency_phone'),
  priceType: text('price_type'),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  minServiceFee: decimal('min_service_fee', { precision: 10, scale: 2 }),
  workingHours: text('working_hours'),
  website: text('website'),
  whatsapp: text('whatsapp'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('service_listings_listing_id_idx').on(table.listing_id),
  serviceTypeIdx: index('service_listings_service_type_idx').on(table.serviceType),
}));

export type ServiceListing = typeof serviceListings.$inferSelect;
export type NewServiceListing = typeof serviceListings.$inferInsert;
