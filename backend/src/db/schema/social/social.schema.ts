import { pgTable, text, integer, decimal, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { users } from '../core/users.schema';
import { listings } from '../listings/listing.schema';

// ============================================
// MESSAGES TABLOSU
// ============================================
export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
  receiverIdIdx: index('messages_receiver_id_idx').on(table.receiverId),
  listingIdIdx: index('messages_listing_id_idx').on(table.listingId),
  createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
}));

// ============================================
// FAVORITES TABLOSU
// ============================================
export const favorites = pgTable('favorites', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('favorites_user_id_idx').on(table.userId),
  listingIdIdx: index('favorites_listing_id_idx').on(table.listingId),
  userIdListingIdIdx: index('favorites_user_id_listing_id_idx').on(table.userId, table.listingId),
}));

// ============================================
// MARINAS TABLOSU (Marina bilgileri için)
// ============================================
export const marinas = pgTable('marinas', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  location: text('location').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull().default('Türkiye'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  capacity: integer('capacity'), // toplam yat kapasitesi
  maxLength: decimal('max_length', { precision: 6, scale: 2 }), // maksimum yat boyu (metre)
  services: text('services'), // JSONB string - sunulan hizmetler
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  website: text('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  cityIdx: index('marinas_city_idx').on(table.city),
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;

export type Marina = typeof marinas.$inferSelect;
export type NewMarina = typeof marinas.$inferInsert;
