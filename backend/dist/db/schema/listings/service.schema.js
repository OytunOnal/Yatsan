"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// SERVICE LİSTİNGS TABLOSU (Teknik Servisler)
// ============================================
exports.serviceListings = (0, pg_core_1.pgTable)('service_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    serviceType: (0, pg_core_1.text)('service_type').notNull(),
    businessName: (0, pg_core_1.text)('business_name'),
    yearsInBusiness: (0, pg_core_1.integer)('years_in_business'),
    certifications: (0, pg_core_1.text)('certifications'),
    authorizedBrands: (0, pg_core_1.text)('authorized_brands'),
    serviceArea: (0, pg_core_1.text)('service_area'),
    mobileService: (0, pg_core_1.boolean)('mobile_service').default(false),
    emergencyService: (0, pg_core_1.boolean)('emergency_service').default(false),
    emergencyPhone: (0, pg_core_1.text)('emergency_phone'),
    priceType: (0, pg_core_1.text)('price_type'),
    hourlyRate: (0, pg_core_1.decimal)('hourly_rate', { precision: 10, scale: 2 }),
    minServiceFee: (0, pg_core_1.decimal)('min_service_fee', { precision: 10, scale: 2 }),
    workingHours: (0, pg_core_1.text)('working_hours'),
    website: (0, pg_core_1.text)('website'),
    whatsapp: (0, pg_core_1.text)('whatsapp'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('service_listings_listing_id_idx').on(table.listing_id),
    serviceTypeIdx: (0, pg_core_1.index)('service_listings_service_type_idx').on(table.serviceType),
}));
