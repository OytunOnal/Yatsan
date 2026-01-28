"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// STORAGE LİSTİNGS TABLOSU (Kara Park ve Kışlama)
// ============================================
exports.storageListings = (0, pg_core_1.pgTable)('storage_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    storageType: (0, pg_core_1.text)('storage_type').notNull(),
    facilityName: (0, pg_core_1.text)('facility_name'),
    maxBoatLength: (0, pg_core_1.decimal)('max_boat_length', { precision: 6, scale: 2 }),
    maxBoatBeam: (0, pg_core_1.decimal)('max_boat_beam', { precision: 6, scale: 2 }),
    maxBoatHeight: (0, pg_core_1.decimal)('max_boat_height', { precision: 6, scale: 2 }),
    maxBoatWeight: (0, pg_core_1.decimal)('max_boat_weight', { precision: 10, scale: 2 }),
    securityFeatures: (0, pg_core_1.text)('security_features'),
    hasElectricity: (0, pg_core_1.boolean)('has_electricity').default(false),
    hasWater: (0, pg_core_1.boolean)('has_water').default(false),
    hasCamera: (0, pg_core_1.boolean)('has_camera').default(false),
    hasGuard: (0, pg_core_1.boolean)('has_guard').default(false),
    hasLift: (0, pg_core_1.boolean)('has_lift').default(false),
    liftCapacity: (0, pg_core_1.decimal)('lift_capacity', { precision: 10, scale: 2 }),
    accessHours: (0, pg_core_1.text)('access_hours'),
    gateAccess: (0, pg_core_1.boolean)('gate_access').default(false),
    winterizationService: (0, pg_core_1.boolean)('winterization_service').default(false),
    maintenanceService: (0, pg_core_1.boolean)('maintenance_service').default(false),
    launchService: (0, pg_core_1.boolean)('launch_service').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('storage_listings_listing_id_idx').on(table.listing_id),
    storageTypeIdx: (0, pg_core_1.index)('storage_listings_storage_type_idx').on(table.storageType),
}));
