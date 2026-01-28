"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// INSURANCE LİSTİNGS TABLOSU (Sigorta)
// ============================================
exports.insuranceListings = (0, pg_core_1.pgTable)('insurance_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    companyName: (0, pg_core_1.text)('company_name').notNull(),
    agencyName: (0, pg_core_1.text)('agency_name'),
    licenseNumber: (0, pg_core_1.text)('license_number'),
    insuranceType: (0, pg_core_1.text)('insurance_type').notNull(),
    coverageTypes: (0, pg_core_1.text)('coverage_types'),
    minBoatLength: (0, pg_core_1.decimal)('min_boat_length', { precision: 6, scale: 2 }),
    maxBoatLength: (0, pg_core_1.decimal)('max_boat_length', { precision: 6, scale: 2 }),
    minBoatValue: (0, pg_core_1.decimal)('min_boat_value', { precision: 12, scale: 2 }),
    maxBoatValue: (0, pg_core_1.decimal)('max_boat_value', { precision: 12, scale: 2 }),
    boatAgeLimit: (0, pg_core_1.integer)('boat_age_limit'),
    coverageArea: (0, pg_core_1.text)('coverage_area'),
    premiumCalculation: (0, pg_core_1.text)('premium_calculation'),
    minPremium: (0, pg_core_1.decimal)('min_premium', { precision: 10, scale: 2 }),
    premiumPercentage: (0, pg_core_1.decimal)('premium_percentage', { precision: 5, scale: 2 }),
    hullCoverage: (0, pg_core_1.boolean)('hull_coverage').default(false),
    liabilityCoverage: (0, pg_core_1.boolean)('liability_coverage').default(false),
    salvageCoverage: (0, pg_core_1.boolean)('salvage_coverage').default(false),
    personalAccident: (0, pg_core_1.boolean)('personal_accident').default(false),
    legalProtection: (0, pg_core_1.boolean)('legal_protection').default(false),
    contactPerson: (0, pg_core_1.text)('contact_person'),
    contactPhone: (0, pg_core_1.text)('contact_phone'),
    contactEmail: (0, pg_core_1.text)('contact_email'),
    website: (0, pg_core_1.text)('website'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('insurance_listings_listing_id_idx').on(table.listing_id),
    insuranceTypeIdx: (0, pg_core_1.index)('insurance_listings_insurance_type_idx').on(table.insuranceType),
}));
