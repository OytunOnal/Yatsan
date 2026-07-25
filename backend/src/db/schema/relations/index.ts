import { relations } from 'drizzle-orm';
import { users } from '../core/users.schema';
import { categories, categorySuggestions } from '../core/categories.schema';
import { notifications } from '../core/notifications.schema';
import { listings } from '../listings/listing.schema';
import { yachtListings } from '../listings/yacht.schema';
import { partListings } from '../listings/part.schema';
import { marinaListings } from '../listings/marina.schema';
import { crewListings } from '../listings/crew.schema';
import { equipmentListings } from '../listings/equipment.schema';
import { serviceListings } from '../listings/service.schema';
import { storageListings } from '../listings/storage.schema';
import { insuranceListings } from '../listings/insurance.schema';
import { expertiseListings } from '../listings/expertise.schema';
import { marketplaceListings } from '../listings/marketplace.schema';
import { listingImages } from '../listings/images.schema';
import { brokers, brokerProfiles } from '../broker/broker.schema';
import { crmLeads, crmActivities, brokerListings, brokerReviews } from '../broker/crm.schema';
import { messages, favorites } from '../social/social.schema';

// ============================================
// USER RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  favorites: many(favorites),
  notifications: many(notifications),
  categorySuggestions: many(categorySuggestions, { relationName: 'suggestedBy' }),
  reviewedSuggestions: many(categorySuggestions, { relationName: 'reviewedBy' }),
  broker: many(brokers),
  verifiedBrokers: many(brokers, { relationName: 'verifiedBy' }),
  brokerReviews: many(brokerReviews),
  crmLeads: many(crmLeads),
}));

// ============================================
// CATEGORY RELATIONS
// ============================================
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'parentCategory',
  }),
  children: many(categories, { relationName: 'parentCategory' }),
  listings: many(listings, { relationName: 'listingCategory' }),
  subcategoryListings: many(listings, { relationName: 'listingSubcategory' }),
  suggestions: many(categorySuggestions),
  mergedSuggestions: many(categorySuggestions, { relationName: 'mergedWith' }),
}));

export const categorySuggestionsRelations = relations(categorySuggestions, ({ one }) => ({
  suggestedBy: one(users, {
    fields: [categorySuggestions.suggestedBy],
    references: [users.id],
    relationName: 'suggestedBy',
  }),
  reviewedBy: one(users, {
    fields: [categorySuggestions.reviewedBy],
    references: [users.id],
    relationName: 'reviewedBy',
  }),
  parentCategory: one(categories, {
    fields: [categorySuggestions.parentCategoryId],
    references: [categories.id],
  }),
  mergedWith: one(categories, {
    fields: [categorySuggestions.mergedWith],
    references: [categories.id],
    relationName: 'mergedWith',
  }),
}));

// ============================================
// NOTIFICATION RELATIONS
// ============================================
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ============================================
// LISTING RELATIONS
// ============================================
export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
    relationName: 'listingCategory',
  }),
  subcategory: one(categories, {
    fields: [listings.subcategoryId],
    references: [categories.id],
    relationName: 'listingSubcategory',
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
  equipmentListing: one(equipmentListings, {
    fields: [listings.id],
    references: [equipmentListings.listing_id],
  }),
  serviceListing: one(serviceListings, {
    fields: [listings.id],
    references: [serviceListings.listing_id],
  }),
  storageListing: one(storageListings, {
    fields: [listings.id],
    references: [storageListings.listing_id],
  }),
  insuranceListing: one(insuranceListings, {
    fields: [listings.id],
    references: [insuranceListings.listing_id],
  }),
  expertiseListing: one(expertiseListings, {
    fields: [listings.id],
    references: [expertiseListings.listing_id],
  }),
  marketplaceListing: one(marketplaceListings, {
    fields: [listings.id],
    references: [marketplaceListings.listing_id],
  }),
  brokerListing: one(brokerListings, {
    fields: [listings.id],
    references: [brokerListings.listingId],
  }),
  crmLeads: many(crmLeads),
  brokerReviews: many(brokerReviews),
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

export const equipmentListingsRelations = relations(equipmentListings, ({ one }) => ({
  listing: one(listings, {
    fields: [equipmentListings.listing_id],
    references: [listings.id],
  }),
}));

export const serviceListingsRelations = relations(serviceListings, ({ one }) => ({
  listing: one(listings, {
    fields: [serviceListings.listing_id],
    references: [listings.id],
  }),
}));

export const storageListingsRelations = relations(storageListings, ({ one }) => ({
  listing: one(listings, {
    fields: [storageListings.listing_id],
    references: [listings.id],
  }),
}));

export const insuranceListingsRelations = relations(insuranceListings, ({ one }) => ({
  listing: one(listings, {
    fields: [insuranceListings.listing_id],
    references: [listings.id],
  }),
}));

export const expertiseListingsRelations = relations(expertiseListings, ({ one }) => ({
  listing: one(listings, {
    fields: [expertiseListings.listing_id],
    references: [listings.id],
  }),
}));

export const marketplaceListingsRelations = relations(marketplaceListings, ({ one }) => ({
  listing: one(listings, {
    fields: [marketplaceListings.listing_id],
    references: [listings.id],
  }),
}));

export const listingImagesRelations = relations(listingImages, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImages.listing_id],
    references: [listings.id],
  }),
}));

// ============================================
// BROKER RELATIONS
// ============================================
export const brokersRelations = relations(brokers, ({ one, many }) => ({
  user: one(users, {
    fields: [brokers.userId],
    references: [users.id],
  }),
  profile: one(brokerProfiles, {
    fields: [brokers.id],
    references: [brokerProfiles.brokerId],
  }),
  leads: many(crmLeads),
  activities: many(crmActivities),
  listings: many(brokerListings),
  reviews: many(brokerReviews),
  verifiedByUser: one(users, {
    fields: [brokers.verifiedBy],
    references: [users.id],
  }),
}));

export const brokerProfilesRelations = relations(brokerProfiles, ({ one }) => ({
  broker: one(brokers, {
    fields: [brokerProfiles.brokerId],
    references: [brokers.id],
  }),
}));

export const crmLeadsRelations = relations(crmLeads, ({ one, many }) => ({
  broker: one(brokers, {
    fields: [crmLeads.brokerId],
    references: [brokers.id],
  }),
  listing: one(listings, {
    fields: [crmLeads.listingId],
    references: [listings.id],
  }),
  user: one(users, {
    fields: [crmLeads.userId],
    references: [users.id],
  }),
  activities: many(crmActivities),
}));

export const crmActivitiesRelations = relations(crmActivities, ({ one }) => ({
  lead: one(crmLeads, {
    fields: [crmActivities.leadId],
    references: [crmLeads.id],
  }),
  broker: one(brokers, {
    fields: [crmActivities.brokerId],
    references: [brokers.id],
  }),
}));

export const brokerListingsRelations = relations(brokerListings, ({ one }) => ({
  broker: one(brokers, {
    fields: [brokerListings.brokerId],
    references: [brokers.id],
  }),
  listing: one(listings, {
    fields: [brokerListings.listingId],
    references: [listings.id],
  }),
}));

export const brokerReviewsRelations = relations(brokerReviews, ({ one }) => ({
  broker: one(brokers, {
    fields: [brokerReviews.brokerId],
    references: [brokers.id],
  }),
  user: one(users, {
    fields: [brokerReviews.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [brokerReviews.listingId],
    references: [listings.id],
  }),
}));

// ============================================
// SOCIAL RELATIONS
// ============================================
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

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [favorites.listingId],
    references: [listings.id],
  }),
}));
