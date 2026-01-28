"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertiseListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// EXPERTISE LİSTİNGS TABLOSU (Ekspertiz)
// ============================================
exports.expertiseListings = (0, pg_core_1.pgTable)('expertise_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    companyName: (0, pg_core_1.text)('company_name'),
    expertName: (0, pg_core_1.text)('expert_name'),
    licenseNumber: (0, pg_core_1.text)('license_number'),
    yearsExperience: (0, pg_core_1.integer)('years_experience'),
    expertiseType: (0, pg_core_1.text)('expertise_type').notNull(),
    boatTypes: (0, pg_core_1.text)('boat_types'),
    minBoatLength: (0, pg_core_1.decimal)('min_boat_length', { precision: 6, scale: 2 }),
    maxBoatLength: (0, pg_core_1.decimal)('max_boat_length', { precision: 6, scale: 2 }),
    serviceArea: (0, pg_core_1.text)('service_area'),
    mobileService: (0, pg_core_1.boolean)('mobile_service').default(false),
    reportTypes: (0, pg_core_1.text)('report_types'),
    reportLanguages: (0, pg_core_1.text)('report_languages'),
    turnaroundTime: (0, pg_core_1.text)('turnaround_time'),
    basePrice: (0, pg_core_1.decimal)('base_price', { precision: 10, scale: 2 }),
    pricePerMeter: (0, pg_core_1.decimal)('price_per_meter', { precision: 10, scale: 2 }),
    travelFee: (0, pg_core_1.decimal)('travel_fee', { precision: 10, scale: 2 }),
    certifications: (0, pg_core_1.text)('certifications'),
    memberships: (0, pg_core_1.text)('memberships'),
    phone: (0, pg_core_1.text)('phone'),
    email: (0, pg_core_1.text)('email'),
    website: (0, pg_core_1.text)('website'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('expertise_listings_listing_id_idx').on(table.listing_id),
    expertiseTypeIdx: (0, pg_core_1.index)('expertise_listings_expertise_type_idx').on(table.expertiseType),
}));
