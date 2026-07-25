/**
 * Broker Controller - Backward Compatibility Wrapper
 * 
 * This file re-exports all broker controllers from the modular structure
 * for backward compatibility with existing imports.
 * 
 * @deprecated Import from './broker/index' instead
 */

export {
  // Broker Profile & Registration
  registerBroker,
  getBrokerProfile,
  updateBrokerProfile,
  
  // Broker Listings (public)
  getBrokerBySlug,
  getBrokerListings,
  
  // CRM - Leads & Activities
  getLeads,
  createLead,
  updateLead,
  getLeadActivities,
  createActivity,
  
  // Analytics
  getBrokerAnalytics,
  
  // Admin Operations
  getPendingBrokers,
  updateBrokerStatus,
  
  // Reviews
  getBrokerBySlugWithReviews,
  createBrokerReview,
  updateReviewStatus,
  respondToReview,
} from './broker/index';
