"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingImages = exports.marketplaceListings = exports.expertiseListings = exports.insuranceListings = exports.storageListings = exports.serviceListings = exports.equipmentListings = void 0;
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
// ============================================
// MARKETPLACE LİSTİNGS TABLOSU (İkinci El Pazarı)
// ============================================
exports.marketplaceListings = (0, pg_core_1.pgTable)('marketplace_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    itemType: (0, pg_core_1.text)('item_type').notNull(),
    brand: (0, pg_core_1.text)('brand'),
    model: (0, pg_core_1.text)('model'),
    condition: (0, pg_core_1.text)('condition').notNull(),
    yearPurchased: (0, pg_core_1.integer)('year_purchased'),
    usageFrequency: (0, pg_core_1.text)('usage_frequency'),
    originalPrice: (0, pg_core_1.decimal)('original_price', { precision: 10, scale: 2 }),
    reasonForSelling: (0, pg_core_1.text)('reason_for_selling'),
    dimensions: (0, pg_core_1.text)('dimensions'),
    weight: (0, pg_core_1.decimal)('weight', { precision: 10, scale: 2 }),
    color: (0, pg_core_1.text)('color'),
    material: (0, pg_core_1.text)('material'),
    includesOriginalBox: (0, pg_core_1.boolean)('includes_original_box').default(false),
    includesManual: (0, pg_core_1.boolean)('includes_manual').default(true),
    includesAccessories: (0, pg_core_1.boolean)('includes_accessories').default(false),
    accessoriesDescription: (0, pg_core_1.text)('accessories_description'),
    negotiable: (0, pg_core_1.boolean)('negotiable').default(true),
    acceptTrade: (0, pg_core_1.boolean)('accept_trade').default(false),
    tradeInterests: (0, pg_core_1.text)('trade_interests'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('marketplace_listings_listing_id_idx').on(table.listing_id),
    itemTypeIdx: (0, pg_core_1.index)('marketplace_listings_item_type_idx').on(table.itemType),
}));
// ============================================
// LİSTİNG IMAGES TABLOSU
// ============================================
exports.listingImages = (0, pg_core_1.pgTable)('listing_images', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    url: (0, pg_core_1.text)('url').notNull(),
    orderIndex: (0, pg_core_1.integer)('order_index').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('listing_images_listing_id_idx').on(table.listing_id),
}));
