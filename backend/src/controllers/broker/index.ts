// Broker Profile & Registration
export {
  registerBroker,
  getBrokerProfile,
  updateBrokerProfile,
} from './broker.controller';

// Broker Listings (public)
export {
  getBrokerBySlug,
  getBrokerListings,
} from './broker.listings.controller';

// CRM - Leads & Activities
export {
  getLeads,
  createLead,
  updateLead,
  getLeadActivities,
  createActivity,
} from './broker.crm.controller';

// Analytics
export { getBrokerAnalytics } from './broker.analytics.controller';

// Admin Operations
export {
  getPendingBrokers,
  updateBrokerStatus,
} from './broker.admin.controller';

// Reviews
export {
  getBrokerBySlugWithReviews,
  createBrokerReview,
  updateReviewStatus,
  respondToReview,
} from './broker.reviews.controller';
