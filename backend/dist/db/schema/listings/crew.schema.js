"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crewListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// CREW LİSTİNGS TABLOSU
// ============================================
exports.crewListings = (0, pg_core_1.pgTable)('crew_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    position: (0, pg_core_1.text)('position').notNull(), // 'captain' | 'chef' | 'deckhand' | 'engineer' | 'stewardess'
    experience: (0, pg_core_1.integer)('experience').notNull(), // yıl
    certifications: (0, pg_core_1.text)('certifications'), // JSONB string - sertifikalar listesi
    availability: (0, pg_core_1.text)('availability').notNull(), // 'immediate' | 'flexible' | 'specific_dates'
    availableFrom: (0, pg_core_1.timestamp)('available_from'),
    availableTo: (0, pg_core_1.timestamp)('available_to'),
    salary: (0, pg_core_1.decimal)('salary', { precision: 10, scale: 2 }),
    salaryCurrency: (0, pg_core_1.text)('salary_currency').default('USD'),
    salaryPeriod: (0, pg_core_1.text)('salary_period'), // 'monthly' | 'weekly' | 'daily' | 'per_trip'
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('crew_listings_listing_id_idx').on(table.listing_id),
}));
