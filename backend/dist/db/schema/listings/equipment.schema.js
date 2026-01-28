"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentListings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const listing_schema_1 = require("./listing.schema");
// ============================================
// EQUIPMENT LİSTİNGS TABLOSU (Deniz Aracı Ekipmanları)
// ============================================
exports.equipmentListings = (0, pg_core_1.pgTable)('equipment_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    equipmentType: (0, pg_core_1.text)('equipment_type').notNull(),
    brand: (0, pg_core_1.text)('brand'),
    model: (0, pg_core_1.text)('model'),
    condition: (0, pg_core_1.text)('condition').notNull(),
    yearOfManufacture: (0, pg_core_1.integer)('year_of_manufacture'),
    warrantyMonths: (0, pg_core_1.integer)('warranty_months'),
    powerConsumption: (0, pg_core_1.decimal)('power_consumption', { precision: 10, scale: 2 }),
    voltage: (0, pg_core_1.text)('voltage'),
    dimensions: (0, pg_core_1.text)('dimensions'),
    weight: (0, pg_core_1.decimal)('weight', { precision: 10, scale: 2 }),
    compatibleBoatTypes: (0, pg_core_1.text)('compatible_boat_types'),
    compatibleBoatLengths: (0, pg_core_1.text)('compatible_boat_lengths'),
    installationRequired: (0, pg_core_1.boolean)('installation_required').default(false),
    manualIncluded: (0, pg_core_1.boolean)('manual_included').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('equipment_listings_listing_id_idx').on(table.listing_id),
    equipmentTypeIdx: (0, pg_core_1.index)('equipment_listings_equipment_type_idx').on(table.equipmentType),
}));
