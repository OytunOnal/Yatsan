"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brokerProfiles = exports.brokers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const users_schema_1 = require("../core/users.schema");
// ============================================
// BROKERS TABLOSU (Broker Kayıtları)
// ============================================
exports.brokers = (0, pg_core_1.pgTable)('brokers', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    userId: (0, pg_core_1.text)('user_id').notNull().unique().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    businessName: (0, pg_core_1.text)('business_name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    taxNumber: (0, pg_core_1.text)('tax_number').notNull(),
    taxOffice: (0, pg_core_1.text)('tax_office').notNull(),
    licenseNumber: (0, pg_core_1.text)('license_number').notNull(),
    licenseExpiry: (0, pg_core_1.timestamp)('license_expiry').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
    rejectionReason: (0, pg_core_1.text)('rejection_reason'),
    rating: (0, pg_core_1.decimal)('rating', { precision: 3, scale: 2 }).default('0'), // 0-5 arası
    reviewCount: (0, pg_core_1.integer)('review_count').notNull().default(0),
    responseRate: (0, pg_core_1.decimal)('response_rate', { precision: 5, scale: 2 }).default('0'), // yüzde
    responseTime: (0, pg_core_1.integer)('response_time'), // ortalama yanıt süresi (dakika)
    verifiedAt: (0, pg_core_1.timestamp)('verified_at'),
    verifiedBy: (0, pg_core_1.text)('verified_by').references(() => users_schema_1.users.id, { onDelete: 'set null' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('brokers_user_id_idx').on(table.userId),
    slugIdx: (0, pg_core_1.index)('brokers_slug_idx').on(table.slug),
    statusIdx: (0, pg_core_1.index)('brokers_status_idx').on(table.status),
    ratingIdx: (0, pg_core_1.index)('brokers_rating_idx').on(table.rating),
}));
// ============================================
// BROKER PROFILES TABLOSU (Broker Detay Bilgileri)
// ============================================
exports.brokerProfiles = (0, pg_core_1.pgTable)('broker_profiles', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    brokerId: (0, pg_core_1.text)('broker_id').notNull().unique().references(() => exports.brokers.id, { onDelete: 'cascade' }),
    logo: (0, pg_core_1.text)('logo'), // Logo URL
    coverImage: (0, pg_core_1.text)('cover_image'), // Kapak görseli URL
    description: (0, pg_core_1.text)('description'), // Broker hakkında açıklama
    specialties: (0, pg_core_1.text)('specialties'), // JSONB string - uzmanlık alanları
    languages: (0, pg_core_1.text)('languages'), // JSONB string - konuşulan diller
    serviceAreas: (0, pg_core_1.text)('service_areas'), // JSONB string - hizmet bölgeleri
    website: (0, pg_core_1.text)('website'),
    whatsapp: (0, pg_core_1.text)('whatsapp'),
    workingHours: (0, pg_core_1.text)('working_hours'), // JSONB string - çalışma saatleri
    socialMedia: (0, pg_core_1.text)('social_media'), // JSONB string - sosyal medya linkleri
    establishedYear: (0, pg_core_1.integer)('established_year'), // Kuruluş yılı
    teamSize: (0, pg_core_1.integer)('team_size'), // Ekip büyüklüğü
    certifications: (0, pg_core_1.text)('certifications'), // JSONB string - sertifikalar
    awards: (0, pg_core_1.text)('awards'), // JSONB string - ödüller
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    brokerIdIdx: (0, pg_core_1.index)('broker_profiles_broker_id_idx').on(table.brokerId),
}));
