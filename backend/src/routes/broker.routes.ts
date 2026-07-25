import { Router } from 'express';
import {
  registerBroker,
  getBrokerBySlug,
  getBrokerListings,
  getBrokerProfile,
  updateBrokerProfile,
  getLeads,
  createLead,
  updateLead,
  getLeadActivities,
  createActivity,
  getBrokerAnalytics,
  getPendingBrokers,
  updateBrokerStatus,
  createBrokerReview,
  updateReviewStatus,
  respondToReview,
} from '../controllers/broker.controller';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================
// Broker mağaza sayfası
router.get('/brokers/:slug', getBrokerBySlug);
router.get('/brokers/:slug/listings', getBrokerListings);

// ============================================
// PROTECTED ROUTES (Broker)
// ============================================
router.use(authMiddleware);

// Broker profil işlemleri
router.get('/broker/profile', getBrokerProfile);
router.put('/broker/profile', updateBrokerProfile);

// Broker kayıt
router.post('/broker/register', registerBroker);

// CRM Lead işlemleri
router.get('/broker/leads', getLeads);
router.post('/broker/leads', createLead);
router.put('/broker/leads/:id', updateLead);

// CRM Aktivite işlemleri
router.get('/broker/leads/:leadId/activities', getLeadActivities);
router.post('/broker/leads/:leadId/activities', createActivity);

// Broker analitik
router.get('/broker/analytics', getBrokerAnalytics);

// Broker değerlendirme
router.post('/brokers/:brokerId/reviews', createBrokerReview);
router.post('/broker/reviews/:id/respond', respondToReview);

// ============================================
// ADMIN ROUTES
// ============================================
router.get('/admin/brokers/pending', adminMiddleware, getPendingBrokers);
router.patch('/admin/brokers/:id/status', adminMiddleware, updateBrokerStatus);
router.patch('/admin/broker-reviews/:id/status', adminMiddleware, updateReviewStatus);

export default router;
