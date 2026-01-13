"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRelations = exports.listingImagesRelations = exports.crewListingsRelations = exports.marinaListingsRelations = exports.partListingsRelations = exports.yachtListingsRelations = exports.listingsRelations = exports.usersRelations = exports.marinas = exports.messages = exports.listingImages = exports.crewListings = exports.marinaListings = exports.partListings = exports.yachtListings = exports.listings = exports.users = exports.generateId = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// CUID oluşturma fonksiyonu
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
exports.generateId = generateId;
// ============================================
// KULLANICI TABLOSU
// ============================================
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    phone: (0, pg_core_1.text)('phone').notNull().unique(),
    firstName: (0, pg_core_1.text)('first_name').notNull(),
    lastName: (0, pg_core_1.text)('last_name').notNull(),
    phoneVerified: (0, pg_core_1.boolean)('phone_verified').notNull().default(false),
    password: (0, pg_core_1.text)('password').notNull(),
    userType: (0, pg_core_1.text)('user_type').notNull(), // 'individual' | 'corporate'
    kvkkApproved: (0, pg_core_1.boolean)('kvkk_approved').notNull().default(false),
    status: (0, pg_core_1.text)('status').notNull().default('INACTIVE'), // 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    resetPasswordToken: (0, pg_core_1.text)('reset_password_token').unique(),
    resetPasswordExpires: (0, pg_core_1.timestamp)('reset_password_expires'),
    lastPasswordReset: (0, pg_core_1.timestamp)('last_password_reset'),
    emailVerificationExpires: (0, pg_core_1.timestamp)('email_verification_expires'),
}, (table) => ({
    emailIdx: (0, pg_core_1.index)('users_email_idx').on(table.email),
    phoneIdx: (0, pg_core_1.index)('users_phone_idx').on(table.phone),
}));
// ============================================
// LİSTİNG TABLOSU (Base Tablo)
// ============================================
exports.listings = (0, pg_core_1.pgTable)('listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.decimal)('price', { precision: 12, scale: 2 }).notNull(),
    currency: (0, pg_core_1.text)('currency').notNull().default('TRY'), // 'TRY' | 'USD' | 'EUR'
    listingType: (0, pg_core_1.text)('listing_type').notNull(), // 'yacht' | 'part' | 'marina' | 'crew'
    status: (0, pg_core_1.text)('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    location: (0, pg_core_1.text)('location'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('listings_user_id_idx').on(table.userId),
    listingTypeIdx: (0, pg_core_1.index)('listings_listing_type_idx').on(table.listingType),
    statusIdx: (0, pg_core_1.index)('listings_status_idx').on(table.status),
}));
// ============================================
// YACHT LİSTİNGS TABLOSU
// ============================================
exports.yachtListings = (0, pg_core_1.pgTable)('yacht_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => exports.listings.id, { onDelete: 'cascade' }),
    yachtType: (0, pg_core_1.text)('yacht_type').notNull(), // 'motor_yacht' | 'sailing_yacht' | 'catamaran' | 'gulet'
    year: (0, pg_core_1.integer)('year').notNull(),
    length: (0, pg_core_1.decimal)('length', { precision: 6, scale: 2 }).notNull(), // metre
    beam: (0, pg_core_1.decimal)('beam', { precision: 6, scale: 2 }).notNull(), // metre
    draft: (0, pg_core_1.decimal)('draft', { precision: 6, scale: 2 }).notNull(), // metre
    engineBrand: (0, pg_core_1.text)('engine_brand'),
    engineHours: (0, pg_core_1.integer)('engine_hours'),
    engineHP: (0, pg_core_1.integer)('engine_hp'),
    fuelType: (0, pg_core_1.text)('fuel_type'), // 'diesel' | 'petrol' | 'electric' | 'hybrid'
    cruisingSpeed: (0, pg_core_1.integer)('cruising_speed'), // knot
    maxSpeed: (0, pg_core_1.integer)('max_speed'), // knot
    cabinCount: (0, pg_core_1.integer)('cabin_count'),
    bedCount: (0, pg_core_1.integer)('bed_count'),
    bathroomCount: (0, pg_core_1.integer)('bathroom_count'),
    equipment: (0, pg_core_1.text)('equipment'), // JSONB string olarak saklanacak
    condition: (0, pg_core_1.text)('condition').notNull(), // 'new' | 'excellent' | 'good' | 'fair'
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('yacht_listings_listing_id_idx').on(table.listing_id),
}));
// ============================================
// PART LİSTİNGS TABLOSU
// ============================================
exports.partListings = (0, pg_core_1.pgTable)('part_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => exports.listings.id, { onDelete: 'cascade' }),
    condition: (0, pg_core_1.text)('condition').notNull(), // 'new' | 'used' | 'refurbished'
    brand: (0, pg_core_1.text)('brand').notNull(),
    oemCode: (0, pg_core_1.text)('oem_code'),
    compatibility: (0, pg_core_1.text)('compatibility'), // JSONB string - uyumlu modeller
    description: (0, pg_core_1.text)('description'),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('part_listings_listing_id_idx').on(table.listing_id),
}));
// ============================================
// MARINA LİSTİNGS TABLOSU
// ============================================
exports.marinaListings = (0, pg_core_1.pgTable)('marina_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => exports.listings.id, { onDelete: 'cascade' }),
    priceType: (0, pg_core_1.text)('price_type').notNull(), // 'daily' | 'weekly' | 'monthly' | 'yearly'
    maxLength: (0, pg_core_1.decimal)('max_length', { precision: 6, scale: 2 }).notNull(), // metre
    maxBeam: (0, pg_core_1.decimal)('max_beam', { precision: 6, scale: 2 }).notNull(), // metre
    maxDraft: (0, pg_core_1.decimal)('max_draft', { precision: 6, scale: 2 }), // metre
    services: (0, pg_core_1.text)('services').notNull(), // JSONB string - elektrik, su, wifi, vb.
    availability: (0, pg_core_1.text)('availability'), // JSONB string - müsaitlik takvimi
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('marina_listings_listing_id_idx').on(table.listing_id),
}));
// ============================================
// CREW LİSTİNGS TABLOSU
// ============================================
exports.crewListings = (0, pg_core_1.pgTable)('crew_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => exports.listings.id, { onDelete: 'cascade' }),
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
// ============================================
// LİSTİNG IMAGES TABLOSU
// ============================================
exports.listingImages = (0, pg_core_1.pgTable)('listing_images', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    listing_id: (0, pg_core_1.text)('listing_id').notNull().references(() => exports.listings.id, { onDelete: 'cascade' }),
    url: (0, pg_core_1.text)('url').notNull(),
    orderIndex: (0, pg_core_1.integer)('order_index').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    listingIdIdx: (0, pg_core_1.index)('listing_images_listing_id_idx').on(table.listing_id),
}));
// ============================================
// MESSAGES TABLOSU
// ============================================
exports.messages = (0, pg_core_1.pgTable)('messages', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    senderId: (0, pg_core_1.text)('sender_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    receiverId: (0, pg_core_1.text)('receiver_id').notNull().references(() => exports.users.id, { onDelete: 'cascade' }),
    listingId: (0, pg_core_1.text)('listing_id').references(() => exports.listings.id, { onDelete: 'set null' }),
    content: (0, pg_core_1.text)('content').notNull(),
    read: (0, pg_core_1.boolean)('read').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    senderIdIdx: (0, pg_core_1.index)('messages_sender_id_idx').on(table.senderId),
    receiverIdIdx: (0, pg_core_1.index)('messages_receiver_id_idx').on(table.receiverId),
    listingIdIdx: (0, pg_core_1.index)('messages_listing_id_idx').on(table.listingId),
    createdAtIdx: (0, pg_core_1.index)('messages_created_at_idx').on(table.createdAt),
}));
// ============================================
// MARINAS TABLOSU (Marina bilgileri için)
// ============================================
exports.marinas = (0, pg_core_1.pgTable)('marinas', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, exports.generateId)()),
    name: (0, pg_core_1.text)('name').notNull(),
    location: (0, pg_core_1.text)('location').notNull(),
    city: (0, pg_core_1.text)('city').notNull(),
    country: (0, pg_core_1.text)('country').notNull().default('Türkiye'),
    latitude: (0, pg_core_1.decimal)('latitude', { precision: 10, scale: 7 }),
    longitude: (0, pg_core_1.decimal)('longitude', { precision: 10, scale: 7 }),
    capacity: (0, pg_core_1.integer)('capacity'), // toplam yat kapasitesi
    maxLength: (0, pg_core_1.decimal)('max_length', { precision: 6, scale: 2 }), // maksimum yat boyu (metre)
    services: (0, pg_core_1.text)('services'), // JSONB string - sunulan hizmetler
    contactPhone: (0, pg_core_1.text)('contact_phone'),
    contactEmail: (0, pg_core_1.text)('contact_email'),
    website: (0, pg_core_1.text)('website'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    cityIdx: (0, pg_core_1.index)('marinas_city_idx').on(table.city),
}));
// ============================================
// RELATIONS
// ============================================
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    listings: many(exports.listings),
    sentMessages: many(exports.messages, { relationName: 'sender' }),
    receivedMessages: many(exports.messages, { relationName: 'receiver' }),
}));
exports.listingsRelations = (0, drizzle_orm_1.relations)(exports.listings, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.listings.userId],
        references: [exports.users.id],
    }),
    images: many(exports.listingImages),
    messages: many(exports.messages),
    yachtListing: one(exports.yachtListings, {
        fields: [exports.listings.id],
        references: [exports.yachtListings.listing_id],
    }),
    partListing: one(exports.partListings, {
        fields: [exports.listings.id],
        references: [exports.partListings.listing_id],
    }),
    marinaListing: one(exports.marinaListings, {
        fields: [exports.listings.id],
        references: [exports.marinaListings.listing_id],
    }),
    crewListing: one(exports.crewListings, {
        fields: [exports.listings.id],
        references: [exports.crewListings.listing_id],
    }),
}));
exports.yachtListingsRelations = (0, drizzle_orm_1.relations)(exports.yachtListings, ({ one }) => ({
    listing: one(exports.listings, {
        fields: [exports.yachtListings.listing_id],
        references: [exports.listings.id],
    }),
}));
exports.partListingsRelations = (0, drizzle_orm_1.relations)(exports.partListings, ({ one }) => ({
    listing: one(exports.listings, {
        fields: [exports.partListings.listing_id],
        references: [exports.listings.id],
    }),
}));
exports.marinaListingsRelations = (0, drizzle_orm_1.relations)(exports.marinaListings, ({ one }) => ({
    listing: one(exports.listings, {
        fields: [exports.marinaListings.listing_id],
        references: [exports.listings.id],
    }),
}));
exports.crewListingsRelations = (0, drizzle_orm_1.relations)(exports.crewListings, ({ one }) => ({
    listing: one(exports.listings, {
        fields: [exports.crewListings.listing_id],
        references: [exports.listings.id],
    }),
}));
exports.listingImagesRelations = (0, drizzle_orm_1.relations)(exports.listingImages, ({ one }) => ({
    listing: one(exports.listings, {
        fields: [exports.listingImages.listing_id],
        references: [exports.listings.id],
    }),
}));
exports.messagesRelations = (0, drizzle_orm_1.relations)(exports.messages, ({ one }) => ({
    sender: one(exports.users, {
        fields: [exports.messages.senderId],
        references: [exports.users.id],
        relationName: 'sender',
    }),
    receiver: one(exports.users, {
        fields: [exports.messages.receiverId],
        references: [exports.users.id],
        relationName: 'receiver',
    }),
    listing: one(exports.listings, {
        fields: [exports.messages.listingId],
        references: [exports.listings.id],
    }),
}));
