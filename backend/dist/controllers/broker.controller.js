"use strict";
/**
 * Broker Controller - Backward Compatibility Wrapper
 *
 * This file re-exports all broker controllers from the modular structure
 * for backward compatibility with existing imports.
 *
 * @deprecated Import from './broker/index' instead
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondToReview = exports.updateReviewStatus = exports.createBrokerReview = exports.getBrokerBySlugWithReviews = exports.updateBrokerStatus = exports.getPendingBrokers = exports.getBrokerAnalytics = exports.createActivity = exports.getLeadActivities = exports.updateLead = exports.createLead = exports.getLeads = exports.getBrokerListings = exports.getBrokerBySlug = exports.updateBrokerProfile = exports.getBrokerProfile = exports.registerBroker = void 0;
var index_1 = require("./broker/index");
// Broker Profile & Registration
Object.defineProperty(exports, "registerBroker", { enumerable: true, get: function () { return index_1.registerBroker; } });
Object.defineProperty(exports, "getBrokerProfile", { enumerable: true, get: function () { return index_1.getBrokerProfile; } });
Object.defineProperty(exports, "updateBrokerProfile", { enumerable: true, get: function () { return index_1.updateBrokerProfile; } });
// Broker Listings (public)
Object.defineProperty(exports, "getBrokerBySlug", { enumerable: true, get: function () { return index_1.getBrokerBySlug; } });
Object.defineProperty(exports, "getBrokerListings", { enumerable: true, get: function () { return index_1.getBrokerListings; } });
// CRM - Leads & Activities
Object.defineProperty(exports, "getLeads", { enumerable: true, get: function () { return index_1.getLeads; } });
Object.defineProperty(exports, "createLead", { enumerable: true, get: function () { return index_1.createLead; } });
Object.defineProperty(exports, "updateLead", { enumerable: true, get: function () { return index_1.updateLead; } });
Object.defineProperty(exports, "getLeadActivities", { enumerable: true, get: function () { return index_1.getLeadActivities; } });
Object.defineProperty(exports, "createActivity", { enumerable: true, get: function () { return index_1.createActivity; } });
// Analytics
Object.defineProperty(exports, "getBrokerAnalytics", { enumerable: true, get: function () { return index_1.getBrokerAnalytics; } });
// Admin Operations
Object.defineProperty(exports, "getPendingBrokers", { enumerable: true, get: function () { return index_1.getPendingBrokers; } });
Object.defineProperty(exports, "updateBrokerStatus", { enumerable: true, get: function () { return index_1.updateBrokerStatus; } });
// Reviews
Object.defineProperty(exports, "getBrokerBySlugWithReviews", { enumerable: true, get: function () { return index_1.getBrokerBySlugWithReviews; } });
Object.defineProperty(exports, "createBrokerReview", { enumerable: true, get: function () { return index_1.createBrokerReview; } });
Object.defineProperty(exports, "updateReviewStatus", { enumerable: true, get: function () { return index_1.updateReviewStatus; } });
Object.defineProperty(exports, "respondToReview", { enumerable: true, get: function () { return index_1.respondToReview; } });
