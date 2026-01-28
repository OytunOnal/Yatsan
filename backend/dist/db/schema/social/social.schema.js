"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marinas = exports.favorites = exports.messages = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const users_schema_1 = require("../core/users.schema");
const listing_schema_1 = require("../listings/listing.schema");
// ============================================
// MESSAGES TABLOSU
// ============================================
exports.messages = (0, pg_core_1.pgTable)('messages', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    senderId: (0, pg_core_1.text)('sender_id').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    receiverId: (0, pg_core_1.text)('receiver_id').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    listingId: (0, pg_core_1.text)('listing_id').references(() => listing_schema_1.listings.id, { onDelete: 'set null' }),
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
// FAVORITES TABLOSU
// ============================================
exports.favorites = (0, pg_core_1.pgTable)('favorites', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    listingId: (0, pg_core_1.text)('listing_id').notNull().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('favorites_user_id_idx').on(table.userId),
    listingIdIdx: (0, pg_core_1.index)('favorites_listing_id_idx').on(table.listingId),
    userIdListingIdIdx: (0, pg_core_1.index)('favorites_user_id_listing_id_idx').on(table.userId, table.listingId),
}));
// ============================================
// MARINAS TABLOSU (Marina bilgileri için)
// ============================================
exports.marinas = (0, pg_core_1.pgTable)('marinas', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
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
