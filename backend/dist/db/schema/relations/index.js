"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesRelations = exports.messagesRelations = exports.brokerReviewsRelations = exports.brokerListingsRelations = exports.crmActivitiesRelations = exports.crmLeadsRelations = exports.brokerProfilesRelations = exports.brokersRelations = exports.listingImagesRelations = exports.marketplaceListingsRelations = exports.expertiseListingsRelations = exports.insuranceListingsRelations = exports.storageListingsRelations = exports.serviceListingsRelations = exports.equipmentListingsRelations = exports.crewListingsRelations = exports.marinaListingsRelations = exports.partListingsRelations = exports.yachtListingsRelations = exports.listingsRelations = exports.notificationsRelations = exports.categorySuggestionsRelations = exports.categoriesRelations = exports.usersRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const users_schema_1 = require("../core/users.schema");
const categories_schema_1 = require("../core/categories.schema");
const notifications_schema_1 = require("../core/notifications.schema");
const listing_schema_1 = require("../listings/listing.schema");
const yacht_schema_1 = require("../listings/yacht.schema");
const part_schema_1 = require("../listings/part.schema");
const marina_schema_1 = require("../listings/marina.schema");
const crew_schema_1 = require("../listings/crew.schema");
const equipment_schema_1 = require("../listings/equipment.schema");
const service_schema_1 = require("../listings/service.schema");
const storage_schema_1 = require("../listings/storage.schema");
const insurance_schema_1 = require("../listings/insurance.schema");
const expertise_schema_1 = require("../listings/expertise.schema");
const marketplace_schema_1 = require("../listings/marketplace.schema");
const images_schema_1 = require("../listings/images.schema");
const broker_schema_1 = require("../broker/broker.schema");
const crm_schema_1 = require("../broker/crm.schema");
const social_schema_1 = require("../social/social.schema");
// ============================================
// USER RELATIONS
// ============================================
exports.usersRelations = (0, drizzle_orm_1.relations)(users_schema_1.users, ({ many }) => ({
    listings: many(listing_schema_1.listings),
    sentMessages: many(social_schema_1.messages, { relationName: 'sender' }),
    receivedMessages: many(social_schema_1.messages, { relationName: 'receiver' }),
    favorites: many(social_schema_1.favorites),
    notifications: many(notifications_schema_1.notifications),
    categorySuggestions: many(categories_schema_1.categorySuggestions, { relationName: 'suggestedBy' }),
    reviewedSuggestions: many(categories_schema_1.categorySuggestions, { relationName: 'reviewedBy' }),
    broker: many(broker_schema_1.brokers),
    verifiedBrokers: many(broker_schema_1.brokers, { relationName: 'verifiedBy' }),
    brokerReviews: many(crm_schema_1.brokerReviews),
    crmLeads: many(crm_schema_1.crmLeads),
}));
// ============================================
// CATEGORY RELATIONS
// ============================================
exports.categoriesRelations = (0, drizzle_orm_1.relations)(categories_schema_1.categories, ({ one, many }) => ({
    parent: one(categories_schema_1.categories, {
        fields: [categories_schema_1.categories.parentId],
        references: [categories_schema_1.categories.id],
        relationName: 'parentCategory',
    }),
    children: many(categories_schema_1.categories, { relationName: 'parentCategory' }),
    listings: many(listing_schema_1.listings, { relationName: 'listingCategory' }),
    subcategoryListings: many(listing_schema_1.listings, { relationName: 'listingSubcategory' }),
    suggestions: many(categories_schema_1.categorySuggestions),
    mergedSuggestions: many(categories_schema_1.categorySuggestions, { relationName: 'mergedWith' }),
}));
exports.categorySuggestionsRelations = (0, drizzle_orm_1.relations)(categories_schema_1.categorySuggestions, ({ one }) => ({
    suggestedBy: one(users_schema_1.users, {
        fields: [categories_schema_1.categorySuggestions.suggestedBy],
        references: [users_schema_1.users.id],
        relationName: 'suggestedBy',
    }),
    reviewedBy: one(users_schema_1.users, {
        fields: [categories_schema_1.categorySuggestions.reviewedBy],
        references: [users_schema_1.users.id],
        relationName: 'reviewedBy',
    }),
    parentCategory: one(categories_schema_1.categories, {
        fields: [categories_schema_1.categorySuggestions.parentCategoryId],
        references: [categories_schema_1.categories.id],
    }),
    mergedWith: one(categories_schema_1.categories, {
        fields: [categories_schema_1.categorySuggestions.mergedWith],
        references: [categories_schema_1.categories.id],
        relationName: 'mergedWith',
    }),
}));
// ============================================
// NOTIFICATION RELATIONS
// ============================================
exports.notificationsRelations = (0, drizzle_orm_1.relations)(notifications_schema_1.notifications, ({ one }) => ({
    user: one(users_schema_1.users, {
        fields: [notifications_schema_1.notifications.userId],
        references: [users_schema_1.users.id],
    }),
}));
// ============================================
// LISTING RELATIONS
// ============================================
exports.listingsRelations = (0, drizzle_orm_1.relations)(listing_schema_1.listings, ({ one, many }) => ({
    user: one(users_schema_1.users, {
        fields: [listing_schema_1.listings.userId],
        references: [users_schema_1.users.id],
    }),
    category: one(categories_schema_1.categories, {
        fields: [listing_schema_1.listings.categoryId],
        references: [categories_schema_1.categories.id],
        relationName: 'listingCategory',
    }),
    subcategory: one(categories_schema_1.categories, {
        fields: [listing_schema_1.listings.subcategoryId],
        references: [categories_schema_1.categories.id],
        relationName: 'listingSubcategory',
    }),
    images: many(images_schema_1.listingImages),
    messages: many(social_schema_1.messages),
    yachtListing: one(yacht_schema_1.yachtListings, {
        fields: [listing_schema_1.listings.id],
        references: [yacht_schema_1.yachtListings.listing_id],
    }),
    partListing: one(part_schema_1.partListings, {
        fields: [listing_schema_1.listings.id],
        references: [part_schema_1.partListings.listing_id],
    }),
    marinaListing: one(marina_schema_1.marinaListings, {
        fields: [listing_schema_1.listings.id],
        references: [marina_schema_1.marinaListings.listing_id],
    }),
    crewListing: one(crew_schema_1.crewListings, {
        fields: [listing_schema_1.listings.id],
        references: [crew_schema_1.crewListings.listing_id],
    }),
    equipmentListing: one(equipment_schema_1.equipmentListings, {
        fields: [listing_schema_1.listings.id],
        references: [equipment_schema_1.equipmentListings.listing_id],
    }),
    serviceListing: one(service_schema_1.serviceListings, {
        fields: [listing_schema_1.listings.id],
        references: [service_schema_1.serviceListings.listing_id],
    }),
    storageListing: one(storage_schema_1.storageListings, {
        fields: [listing_schema_1.listings.id],
        references: [storage_schema_1.storageListings.listing_id],
    }),
    insuranceListing: one(insurance_schema_1.insuranceListings, {
        fields: [listing_schema_1.listings.id],
        references: [insurance_schema_1.insuranceListings.listing_id],
    }),
    expertiseListing: one(expertise_schema_1.expertiseListings, {
        fields: [listing_schema_1.listings.id],
        references: [expertise_schema_1.expertiseListings.listing_id],
    }),
    marketplaceListing: one(marketplace_schema_1.marketplaceListings, {
        fields: [listing_schema_1.listings.id],
        references: [marketplace_schema_1.marketplaceListings.listing_id],
    }),
    brokerListing: one(crm_schema_1.brokerListings, {
        fields: [listing_schema_1.listings.id],
        references: [crm_schema_1.brokerListings.listingId],
    }),
    crmLeads: many(crm_schema_1.crmLeads),
    brokerReviews: many(crm_schema_1.brokerReviews),
}));
exports.yachtListingsRelations = (0, drizzle_orm_1.relations)(yacht_schema_1.yachtListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [yacht_schema_1.yachtListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.partListingsRelations = (0, drizzle_orm_1.relations)(part_schema_1.partListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [part_schema_1.partListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.marinaListingsRelations = (0, drizzle_orm_1.relations)(marina_schema_1.marinaListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [marina_schema_1.marinaListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.crewListingsRelations = (0, drizzle_orm_1.relations)(crew_schema_1.crewListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [crew_schema_1.crewListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.equipmentListingsRelations = (0, drizzle_orm_1.relations)(equipment_schema_1.equipmentListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [equipment_schema_1.equipmentListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.serviceListingsRelations = (0, drizzle_orm_1.relations)(service_schema_1.serviceListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [service_schema_1.serviceListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.storageListingsRelations = (0, drizzle_orm_1.relations)(storage_schema_1.storageListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [storage_schema_1.storageListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.insuranceListingsRelations = (0, drizzle_orm_1.relations)(insurance_schema_1.insuranceListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [insurance_schema_1.insuranceListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.expertiseListingsRelations = (0, drizzle_orm_1.relations)(expertise_schema_1.expertiseListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [expertise_schema_1.expertiseListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.marketplaceListingsRelations = (0, drizzle_orm_1.relations)(marketplace_schema_1.marketplaceListings, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [marketplace_schema_1.marketplaceListings.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.listingImagesRelations = (0, drizzle_orm_1.relations)(images_schema_1.listingImages, ({ one }) => ({
    listing: one(listing_schema_1.listings, {
        fields: [images_schema_1.listingImages.listing_id],
        references: [listing_schema_1.listings.id],
    }),
}));
// ============================================
// BROKER RELATIONS
// ============================================
exports.brokersRelations = (0, drizzle_orm_1.relations)(broker_schema_1.brokers, ({ one, many }) => ({
    user: one(users_schema_1.users, {
        fields: [broker_schema_1.brokers.userId],
        references: [users_schema_1.users.id],
    }),
    profile: one(broker_schema_1.brokerProfiles, {
        fields: [broker_schema_1.brokers.id],
        references: [broker_schema_1.brokerProfiles.brokerId],
    }),
    leads: many(crm_schema_1.crmLeads),
    activities: many(crm_schema_1.crmActivities),
    listings: many(crm_schema_1.brokerListings),
    reviews: many(crm_schema_1.brokerReviews),
    verifiedByUser: one(users_schema_1.users, {
        fields: [broker_schema_1.brokers.verifiedBy],
        references: [users_schema_1.users.id],
    }),
}));
exports.brokerProfilesRelations = (0, drizzle_orm_1.relations)(broker_schema_1.brokerProfiles, ({ one }) => ({
    broker: one(broker_schema_1.brokers, {
        fields: [broker_schema_1.brokerProfiles.brokerId],
        references: [broker_schema_1.brokers.id],
    }),
}));
exports.crmLeadsRelations = (0, drizzle_orm_1.relations)(crm_schema_1.crmLeads, ({ one, many }) => ({
    broker: one(broker_schema_1.brokers, {
        fields: [crm_schema_1.crmLeads.brokerId],
        references: [broker_schema_1.brokers.id],
    }),
    listing: one(listing_schema_1.listings, {
        fields: [crm_schema_1.crmLeads.listingId],
        references: [listing_schema_1.listings.id],
    }),
    user: one(users_schema_1.users, {
        fields: [crm_schema_1.crmLeads.userId],
        references: [users_schema_1.users.id],
    }),
    activities: many(crm_schema_1.crmActivities),
}));
exports.crmActivitiesRelations = (0, drizzle_orm_1.relations)(crm_schema_1.crmActivities, ({ one }) => ({
    lead: one(crm_schema_1.crmLeads, {
        fields: [crm_schema_1.crmActivities.leadId],
        references: [crm_schema_1.crmLeads.id],
    }),
    broker: one(broker_schema_1.brokers, {
        fields: [crm_schema_1.crmActivities.brokerId],
        references: [broker_schema_1.brokers.id],
    }),
}));
exports.brokerListingsRelations = (0, drizzle_orm_1.relations)(crm_schema_1.brokerListings, ({ one }) => ({
    broker: one(broker_schema_1.brokers, {
        fields: [crm_schema_1.brokerListings.brokerId],
        references: [broker_schema_1.brokers.id],
    }),
    listing: one(listing_schema_1.listings, {
        fields: [crm_schema_1.brokerListings.listingId],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.brokerReviewsRelations = (0, drizzle_orm_1.relations)(crm_schema_1.brokerReviews, ({ one }) => ({
    broker: one(broker_schema_1.brokers, {
        fields: [crm_schema_1.brokerReviews.brokerId],
        references: [broker_schema_1.brokers.id],
    }),
    user: one(users_schema_1.users, {
        fields: [crm_schema_1.brokerReviews.userId],
        references: [users_schema_1.users.id],
    }),
    listing: one(listing_schema_1.listings, {
        fields: [crm_schema_1.brokerReviews.listingId],
        references: [listing_schema_1.listings.id],
    }),
}));
// ============================================
// SOCIAL RELATIONS
// ============================================
exports.messagesRelations = (0, drizzle_orm_1.relations)(social_schema_1.messages, ({ one }) => ({
    sender: one(users_schema_1.users, {
        fields: [social_schema_1.messages.senderId],
        references: [users_schema_1.users.id],
        relationName: 'sender',
    }),
    receiver: one(users_schema_1.users, {
        fields: [social_schema_1.messages.receiverId],
        references: [users_schema_1.users.id],
        relationName: 'receiver',
    }),
    listing: one(listing_schema_1.listings, {
        fields: [social_schema_1.messages.listingId],
        references: [listing_schema_1.listings.id],
    }),
}));
exports.favoritesRelations = (0, drizzle_orm_1.relations)(social_schema_1.favorites, ({ one }) => ({
    user: one(users_schema_1.users, {
        fields: [social_schema_1.favorites.userId],
        references: [users_schema_1.users.id],
    }),
    listing: one(listing_schema_1.listings, {
        fields: [social_schema_1.favorites.listingId],
        references: [listing_schema_1.listings.id],
    }),
}));
