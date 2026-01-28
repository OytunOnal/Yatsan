import { pgTable, text, integer, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { users } from '../core/users.schema';

// ============================================
// BROKERS TABLOSU (Broker Kayıtları)
// ============================================
export const brokers = pgTable('brokers', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  businessName: text('business_name').notNull(),
  slug: text('slug').notNull().unique(),
  taxNumber: text('tax_number').notNull(),
  taxOffice: text('tax_office').notNull(),
  licenseNumber: text('license_number').notNull(),
  licenseExpiry: timestamp('license_expiry').notNull(),
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  rejectionReason: text('rejection_reason'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'), // 0-5 arası
  reviewCount: integer('review_count').notNull().default(0),
  responseRate: decimal('response_rate', { precision: 5, scale: 2 }).default('0'), // yüzde
  responseTime: integer('response_time'), // ortalama yanıt süresi (dakika)
  verifiedAt: timestamp('verified_at'),
  verifiedBy: text('verified_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('brokers_user_id_idx').on(table.userId),
  slugIdx: index('brokers_slug_idx').on(table.slug),
  statusIdx: index('brokers_status_idx').on(table.status),
  ratingIdx: index('brokers_rating_idx').on(table.rating),
}));

// ============================================
// BROKER PROFILES TABLOSU (Broker Detay Bilgileri)
// ============================================
export const brokerProfiles = pgTable('broker_profiles', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  brokerId: text('broker_id').notNull().unique().references(() => brokers.id, { onDelete: 'cascade' }),
  logo: text('logo'), // Logo URL
  coverImage: text('cover_image'), // Kapak görseli URL
  description: text('description'), // Broker hakkında açıklama
  specialties: text('specialties'), // JSONB string - uzmanlık alanları
  languages: text('languages'), // JSONB string - konuşulan diller
  serviceAreas: text('service_areas'), // JSONB string - hizmet bölgeleri
  website: text('website'),
  whatsapp: text('whatsapp'),
  workingHours: text('working_hours'), // JSONB string - çalışma saatleri
  socialMedia: text('social_media'), // JSONB string - sosyal medya linkleri
  establishedYear: integer('established_year'), // Kuruluş yılı
  teamSize: integer('team_size'), // Ekip büyüklüğü
  certifications: text('certifications'), // JSONB string - sertifikalar
  awards: text('awards'), // JSONB string - ödüller
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  brokerIdIdx: index('broker_profiles_broker_id_idx').on(table.brokerId),
}));

export type Broker = typeof brokers.$inferSelect;
export type NewBroker = typeof brokers.$inferInsert;

export type BrokerProfile = typeof brokerProfiles.$inferSelect;
export type NewBrokerProfile = typeof brokerProfiles.$inferInsert;

export type BrokerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
