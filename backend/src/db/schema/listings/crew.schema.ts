import { pgTable, text, integer, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { listings } from './listing.schema';

// ============================================
// CREW LİSTİNGS TABLOSU
// ============================================
export const crewListings = pgTable('crew_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  position: text('position').notNull(), // 'captain' | 'chef' | 'deckhand' | 'engineer' | 'stewardess'
  experience: integer('experience').notNull(), // yıl
  certifications: text('certifications'), // JSONB string - sertifikalar listesi
  availability: text('availability').notNull(), // 'immediate' | 'flexible' | 'specific_dates'
  availableFrom: timestamp('available_from'),
  availableTo: timestamp('available_to'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  salaryCurrency: text('salary_currency').default('USD'),
  salaryPeriod: text('salary_period'), // 'monthly' | 'weekly' | 'daily' | 'per_trip'
}, (table) => ({
  listingIdIdx: index('crew_listings_listing_id_idx').on(table.listing_id),
}));

export type CrewListing = typeof crewListings.$inferSelect;
export type NewCrewListing = typeof crewListings.$inferInsert;
