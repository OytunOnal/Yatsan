import { pgTable, text, integer, decimal, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { generateId } from '../utils/generateId';
import { brokers } from './broker.schema';
import { listings } from '../listings/listing.schema';
import { users } from '../core/users.schema';

// ============================================
// CRM LEADS TABLOSU (Lead Takip Sistemi)
// ============================================
export const crmLeads = pgTable('crm_leads', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  brokerId: text('broker_id').notNull().references(() => brokers.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }), // Lead olan kullanıcı
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  source: text('source').notNull(), // 'message' | 'call' | 'email' | 'website' | 'referral'
  status: text('status').notNull().default('NEW'), // 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'
  priority: text('priority').notNull().default('MEDIUM'), // 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  budget: text('budget'), // JSONB string - min/max bütçe
  interestedCategories: text('interested_categories'), // JSONB string - ilgilendiği kategoriler
  notes: text('notes'),
  estimatedValue: decimal('estimated_value', { precision: 12, scale: 2 }), // Tahmini değer
  probability: integer('probability'), // Satış olasılığı %0-100
  expectedCloseDate: timestamp('expected_close_date'),
  lastContactDate: timestamp('last_contact_date'),
  nextFollowUp: timestamp('next_follow_up'),
  lostReason: text('lost_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  brokerIdIdx: index('crm_leads_broker_id_idx').on(table.brokerId),
  listingIdIdx: index('crm_leads_listing_id_idx').on(table.listingId),
  userIdIdx: index('crm_leads_user_id_idx').on(table.userId),
  statusIdx: index('crm_leads_status_idx').on(table.status),
  priorityIdx: index('crm_leads_priority_idx').on(table.priority),
  nextFollowUpIdx: index('crm_leads_next_follow_up_idx').on(table.nextFollowUp),
}));

// ============================================
// CRM ACTIVITIES TABLOSU (Lead Aktiviteleri)
// ============================================
export const crmActivities = pgTable('crm_activities', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  leadId: text('lead_id').notNull().references(() => crmLeads.id, { onDelete: 'cascade' }),
  brokerId: text('broker_id').notNull().references(() => brokers.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'call' | 'email' | 'meeting' | 'note' | 'message' | 'whatsapp'
  subject: text('subject').notNull(),
  description: text('description'),
  duration: integer('duration'), // Dakika cinsinden (call, meeting için)
  outcome: text('outcome'), // 'positive' | 'neutral' | 'negative'
  nextFollowUp: timestamp('next_follow_up'),
  attachments: text('attachments'), // JSONB string - dosya linkleri
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  leadIdIdx: index('crm_activities_lead_id_idx').on(table.leadId),
  brokerIdIdx: index('crm_activities_broker_id_idx').on(table.brokerId),
  typeIdx: index('crm_activities_type_idx').on(table.type),
  createdAtIdx: index('crm_activities_created_at_idx').on(table.createdAt),
}));

// ============================================
// BROKER LISTINGS TABLOSU (Broker İlan İstatistikleri)
// ============================================
export const brokerListings = pgTable('broker_listings', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  brokerId: text('broker_id').notNull().references(() => brokers.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').notNull().unique().references(() => listings.id, { onDelete: 'cascade' }),
  views: integer('views').notNull().default(0),
  inquiries: integer('inquiries').notNull().default(0), // Mesaj sayısı
  leads: integer('leads').notNull().default(0), // CRM lead sayısı
  featured: boolean('featured').notNull().default(false), // Öne çıkarılmış
  featuredUntil: timestamp('featured_until'),
  promoted: boolean('promoted').notNull().default(false), // Promosyonlu
  promotedUntil: timestamp('promoted_until'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  brokerIdIdx: index('broker_listings_broker_id_idx').on(table.brokerId),
  listingIdIdx: index('broker_listings_listing_id_idx').on(table.listingId),
  featuredIdx: index('broker_listings_featured_idx').on(table.featured),
}));

// ============================================
// BROKER REVIEWS TABLOSU (Broker Değerlendirmeleri)
// ============================================
export const brokerReviews = pgTable('broker_reviews', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  brokerId: text('broker_id').notNull().references(() => brokers.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull(), // 1-5 arası
  title: text('title'),
  comment: text('comment').notNull(),
  response: text('response'), // Broker yanıt
  responseAt: timestamp('response_at'),
  status: text('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED'
  helpful: integer('helpful').notNull().default(0), // Faydalı oyları
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  brokerIdIdx: index('broker_reviews_broker_id_idx').on(table.brokerId),
  userIdIdx: index('broker_reviews_user_id_idx').on(table.userId),
  listingIdIdx: index('broker_reviews_listing_id_idx').on(table.listingId),
  statusIdx: index('broker_reviews_status_idx').on(table.status),
}));

export type CrmLead = typeof crmLeads.$inferSelect;
export type NewCrmLead = typeof crmLeads.$inferInsert;

export type CrmActivity = typeof crmActivities.$inferSelect;
export type NewCrmActivity = typeof crmActivities.$inferInsert;

export type BrokerListing = typeof brokerListings.$inferSelect;
export type NewBrokerListing = typeof brokerListings.$inferInsert;

export type BrokerReview = typeof brokerReviews.$inferSelect;
export type NewBrokerReview = typeof brokerReviews.$inferInsert;

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'message' | 'whatsapp';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
