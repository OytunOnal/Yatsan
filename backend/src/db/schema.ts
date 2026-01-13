import { pgTable, text, integer, timestamp, boolean, decimal, index, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// CUID oluşturma fonksiyonu
export const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// ============================================
// KULLANICI TABLOSU
// ============================================
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneVerified: boolean('phone_verified').notNull().default(false),
  password: text('password').notNull(),
  userType: text('user_type').notNull(), // 'individual' | 'corporate'
  kvkkApproved: boolean('kvkk_approved').notNull().default(false),
  status: text('status').notNull().default('INACTIVE'), // 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  resetPasswordToken: text('reset_password_token').unique(),
  resetPasswordExpires: timestamp('reset_password_expires'),
  lastPasswordReset: timestamp('last_password_reset'),
  emailVerificationExpires: timestamp('email_verification_expires'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  phoneIdx: index('users_phone_idx').on(table.phone),
}));

// ============================================
// LİSTİNG TABLOSU (Base Tablo)
// ============================================
export const listings = pgTable('listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('TRY'), // 'TRY' | 'USD' | 'EUR'
  listingType: text('listing_type').notNull(), // 'yacht' | 'part' | 'marina' | 'crew'
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason: text('rejection_reason'),
  location: text('location'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('listings_user_id_idx').on(table.userId),
  listingTypeIdx: index('listings_listing_type_idx').on(table.listingType),
  statusIdx: index('listings_status_idx').on(table.status),
}));

// ============================================
// YACHT LİSTİNGS TABLOSU
// ============================================
export const yachtListings = pgTable('yacht_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  yachtType: text('yacht_type').notNull(), // 'motor_yacht' | 'sailing_yacht' | 'catamaran' | 'gulet'
  year: integer('year').notNull(),
  length: decimal('length', { precision: 6, scale: 2 }).notNull(), // metre
  beam: decimal('beam', { precision: 6, scale: 2 }).notNull(), // metre
  draft: decimal('draft', { precision: 6, scale: 2 }).notNull(), // metre
  engineBrand: text('engine_brand'),
  engineHours: integer('engine_hours'),
  engineHP: integer('engine_hp'),
  fuelType: text('fuel_type'), // 'diesel' | 'petrol' | 'electric' | 'hybrid'
  cruisingSpeed: integer('cruising_speed'), // knot
  maxSpeed: integer('max_speed'), // knot
  cabinCount: integer('cabin_count'),
  bedCount: integer('bed_count'),
  bathroomCount: integer('bathroom_count'),
  equipment: text('equipment'), // JSONB string olarak saklanacak
  condition: text('condition').notNull(), // 'new' | 'excellent' | 'good' | 'fair'
}, (table) => ({
  listingIdIdx: index('yacht_listings_listing_id_idx').on(table.listing_id),
}));

// ============================================
// PART LİSTİNGS TABLOSU
// ============================================
export const partListings = pgTable('part_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  condition: text('condition').notNull(), // 'new' | 'used' | 'refurbished'
  brand: text('brand').notNull(),
  oemCode: text('oem_code'),
  compatibility: text('compatibility'), // JSONB string - uyumlu modeller
  description: text('description'),
}, (table) => ({
  listingIdIdx: index('part_listings_listing_id_idx').on(table.listing_id),
}));

// ============================================
// MARINA LİSTİNGS TABLOSU
// ============================================
export const marinaListings = pgTable('marina_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  priceType: text('price_type').notNull(), // 'daily' | 'weekly' | 'monthly' | 'yearly'
  maxLength: decimal('max_length', { precision: 6, scale: 2 }).notNull(), // metre
  maxBeam: decimal('max_beam', { precision: 6, scale: 2 }).notNull(), // metre
  maxDraft: decimal('max_draft', { precision: 6, scale: 2 }), // metre
  services: text('services').notNull(), // JSONB string - elektrik, su, wifi, vb.
  availability: text('availability'), // JSONB string - müsaitlik takvimi
}, (table) => ({
  listingIdIdx: index('marina_listings_listing_id_idx').on(table.listing_id),
}));

// ============================================
// CREW LİSTİNGS TABLOSU
// ============================================
export const crewListings = pgTable('crew_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  position: text('position').notNull(), // 'captain' | 'chef' | 'deckhand' | 'engineer' | 'stewardess'
  experience: integer('experience').notNull(), // yıl
  certifications: text('certifications'), // JSONB string - sertifikalar listesi
  availability: text('availability').notNull(), // 'immediate' | 'flexible' | 'specific_dates'
  availableFrom: timestamp('available_from'),
  availableTo: timestamp('available_to'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  salaryCurrency: text('salary_currency').default('USD'),
  salaryPeriod: text('salary_period'), // 'monthly' | 'weekly' | 'daily' | 'per_trip'
}, (table) => ({
  listingIdIdx: index('crew_listings_listing_id_idx').on(table.listing_id),
}));

// ============================================
// LİSTİNG IMAGES TABLOSU
// ============================================
export const listingImages = pgTable('listing_images', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listing_id: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  listingIdIdx: index('listing_images_listing_id_idx').on(table.listing_id),
}));

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

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  images: many(listingImages),
  messages: many(messages),
  yachtListing: one(yachtListings, {
    fields: [listings.id],
    references: [yachtListings.listing_id],
  }),
  partListing: one(partListings, {
    fields: [listings.id],
    references: [partListings.listing_id],
  }),
  marinaListing: one(marinaListings, {
    fields: [listings.id],
    references: [marinaListings.listing_id],
  }),
  crewListing: one(crewListings, {
    fields: [listings.id],
    references: [crewListings.listing_id],
  }),
}));

export const yachtListingsRelations = relations(yachtListings, ({ one }) => ({
  listing: one(listings, {
    fields: [yachtListings.listing_id],
    references: [listings.id],
  }),
}));

export const partListingsRelations = relations(partListings, ({ one }) => ({
  listing: one(listings, {
    fields: [partListings.listing_id],
    references: [listings.id],
  }),
}));

export const marinaListingsRelations = relations(marinaListings, ({ one }) => ({
  listing: one(listings, {
    fields: [marinaListings.listing_id],
    references: [listings.id],
  }),
}));

export const crewListingsRelations = relations(crewListings, ({ one }) => ({
  listing: one(listings, {
    fields: [crewListings.listing_id],
    references: [listings.id],
  }),
}));

export const listingImagesRelations = relations(listingImages, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImages.listing_id],
    references: [listings.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
  listing: one(listings, {
    fields: [messages.listingId],
    references: [listings.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;

export type YachtListing = typeof yachtListings.$inferSelect;
export type NewYachtListing = typeof yachtListings.$inferInsert;

export type PartListing = typeof partListings.$inferSelect;
export type NewPartListing = typeof partListings.$inferInsert;

export type MarinaListing = typeof marinaListings.$inferSelect;
export type NewMarinaListing = typeof marinaListings.$inferInsert;

export type CrewListing = typeof crewListings.$inferSelect;
export type NewCrewListing = typeof crewListings.$inferInsert;

export type ListingImage = typeof listingImages.$inferSelect;
export type NewListingImage = typeof listingImages.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Marina = typeof marinas.$inferSelect;
export type NewMarina = typeof marinas.$inferInsert;
