"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brokerReviews = exports.brokerListings = exports.crmActivities = exports.crmLeads = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
const broker_schema_1 = require("./broker.schema");
const listing_schema_1 = require("../listings/listing.schema");
const users_schema_1 = require("../core/users.schema");
// ============================================
// CRM LEADS TABLOSU (Lead Takip Sistemi)
// ============================================
exports.crmLeads = (0, pg_core_1.pgTable)('crm_leads', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    brokerId: (0, pg_core_1.text)('broker_id').notNull().references(() => broker_schema_1.brokers.id, { onDelete: 'cascade' }),
    listingId: (0, pg_core_1.text)('listing_id').references(() => listing_schema_1.listings.id, { onDelete: 'set null' }),
    userId: (0, pg_core_1.text)('user_id').references(() => users_schema_1.users.id, { onDelete: 'set null' }), // Lead olan kullanıcı
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull(),
    phone: (0, pg_core_1.text)('phone').notNull(),
    source: (0, pg_core_1.text)('source').notNull(), // 'message' | 'call' | 'email' | 'website' | 'referral'
    status: (0, pg_core_1.text)('status').notNull().default('NEW'), // 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'
    priority: (0, pg_core_1.text)('priority').notNull().default('MEDIUM'), // 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    budget: (0, pg_core_1.text)('budget'), // JSONB string - min/max bütçe
    interestedCategories: (0, pg_core_1.text)('interested_categories'), // JSONB string - ilgilendiği kategoriler
    notes: (0, pg_core_1.text)('notes'),
    estimatedValue: (0, pg_core_1.decimal)('estimated_value', { precision: 12, scale: 2 }), // Tahmini değer
    probability: (0, pg_core_1.integer)('probability'), // Satış olasılığı %0-100
    expectedCloseDate: (0, pg_core_1.timestamp)('expected_close_date'),
    lastContactDate: (0, pg_core_1.timestamp)('last_contact_date'),
    nextFollowUp: (0, pg_core_1.timestamp)('next_follow_up'),
    lostReason: (0, pg_core_1.text)('lost_reason'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    brokerIdIdx: (0, pg_core_1.index)('crm_leads_broker_id_idx').on(table.brokerId),
    listingIdIdx: (0, pg_core_1.index)('crm_leads_listing_id_idx').on(table.listingId),
    userIdIdx: (0, pg_core_1.index)('crm_leads_user_id_idx').on(table.userId),
    statusIdx: (0, pg_core_1.index)('crm_leads_status_idx').on(table.status),
    priorityIdx: (0, pg_core_1.index)('crm_leads_priority_idx').on(table.priority),
    nextFollowUpIdx: (0, pg_core_1.index)('crm_leads_next_follow_up_idx').on(table.nextFollowUp),
}));
// ============================================
// CRM ACTIVITIES TABLOSU (Lead Aktiviteleri)
// ============================================
exports.crmActivities = (0, pg_core_1.pgTable)('crm_activities', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    leadId: (0, pg_core_1.text)('lead_id').notNull().references(() => exports.crmLeads.id, { onDelete: 'cascade' }),
    brokerId: (0, pg_core_1.text)('broker_id').notNull().references(() => broker_schema_1.brokers.id, { onDelete: 'cascade' }),
    type: (0, pg_core_1.text)('type').notNull(), // 'call' | 'email' | 'meeting' | 'note' | 'message' | 'whatsapp'
    subject: (0, pg_core_1.text)('subject').notNull(),
    description: (0, pg_core_1.text)('description'),
    duration: (0, pg_core_1.integer)('duration'), // Dakika cinsinden (call, meeting için)
    outcome: (0, pg_core_1.text)('outcome'), // 'positive' | 'neutral' | 'negative'
    nextFollowUp: (0, pg_core_1.timestamp)('next_follow_up'),
    attachments: (0, pg_core_1.text)('attachments'), // JSONB string - dosya linkleri
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
}, (table) => ({
    leadIdIdx: (0, pg_core_1.index)('crm_activities_lead_id_idx').on(table.leadId),
    brokerIdIdx: (0, pg_core_1.index)('crm_activities_broker_id_idx').on(table.brokerId),
    typeIdx: (0, pg_core_1.index)('crm_activities_type_idx').on(table.type),
    createdAtIdx: (0, pg_core_1.index)('crm_activities_created_at_idx').on(table.createdAt),
}));
// ============================================
// BROKER LISTINGS TABLOSU (Broker İlan İstatistikleri)
// ============================================
exports.brokerListings = (0, pg_core_1.pgTable)('broker_listings', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    brokerId: (0, pg_core_1.text)('broker_id').notNull().references(() => broker_schema_1.brokers.id, { onDelete: 'cascade' }),
    listingId: (0, pg_core_1.text)('listing_id').notNull().unique().references(() => listing_schema_1.listings.id, { onDelete: 'cascade' }),
    views: (0, pg_core_1.integer)('views').notNull().default(0),
    inquiries: (0, pg_core_1.integer)('inquiries').notNull().default(0), // Mesaj sayısı
    leads: (0, pg_core_1.integer)('leads').notNull().default(0), // CRM lead sayısı
    featured: (0, pg_core_1.boolean)('featured').notNull().default(false), // Öne çıkarılmış
    featuredUntil: (0, pg_core_1.timestamp)('featured_until'),
    promoted: (0, pg_core_1.boolean)('promoted').notNull().default(false), // Promosyonlu
    promotedUntil: (0, pg_core_1.timestamp)('promoted_until'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    brokerIdIdx: (0, pg_core_1.index)('broker_listings_broker_id_idx').on(table.brokerId),
    listingIdIdx: (0, pg_core_1.index)('broker_listings_listing_id_idx').on(table.listingId),
    featuredIdx: (0, pg_core_1.index)('broker_listings_featured_idx').on(table.featured),
}));
// ============================================
// BROKER REVIEWS TABLOSU (Broker Değerlendirmeleri)
// ============================================
exports.brokerReviews = (0, pg_core_1.pgTable)('broker_reviews', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    brokerId: (0, pg_core_1.text)('broker_id').notNull().references(() => broker_schema_1.brokers.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => users_schema_1.users.id, { onDelete: 'cascade' }),
    listingId: (0, pg_core_1.text)('listing_id').references(() => listing_schema_1.listings.id, { onDelete: 'set null' }),
    rating: (0, pg_core_1.integer)('rating').notNull(), // 1-5 arası
    title: (0, pg_core_1.text)('title'),
    comment: (0, pg_core_1.text)('comment').notNull(),
    response: (0, pg_core_1.text)('response'), // Broker yanıt
    responseAt: (0, pg_core_1.timestamp)('response_at'),
    status: (0, pg_core_1.text)('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
    helpful: (0, pg_core_1.integer)('helpful').notNull().default(0), // Faydalı oyları
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
}, (table) => ({
    brokerIdIdx: (0, pg_core_1.index)('broker_reviews_broker_id_idx').on(table.brokerId),
    userIdIdx: (0, pg_core_1.index)('broker_reviews_user_id_idx').on(table.userId),
    listingIdIdx: (0, pg_core_1.index)('broker_reviews_listing_id_idx').on(table.listingId),
    statusIdx: (0, pg_core_1.index)('broker_reviews_status_idx').on(table.status),
}));
