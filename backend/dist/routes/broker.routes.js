"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const broker_controller_1 = require("../controllers/broker.controller");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const router = (0, express_1.Router)();
// ============================================
// PUBLIC ROUTES
// ============================================
// Broker mağaza sayfası
router.get('/brokers/:slug', broker_controller_1.getBrokerBySlug);
router.get('/brokers/:slug/listings', broker_controller_1.getBrokerListings);
// ============================================
// PROTECTED ROUTES (Broker)
// ============================================
router.use(auth_1.authMiddleware);
// Broker profil işlemleri
router.get('/broker/profile', broker_controller_1.getBrokerProfile);
router.put('/broker/profile', broker_controller_1.updateBrokerProfile);
// Broker kayıt
router.post('/broker/register', broker_controller_1.registerBroker);
// CRM Lead işlemleri
router.get('/broker/leads', broker_controller_1.getLeads);
router.post('/broker/leads', broker_controller_1.createLead);
router.put('/broker/leads/:id', broker_controller_1.updateLead);
// CRM Aktivite işlemleri
router.get('/broker/leads/:leadId/activities', broker_controller_1.getLeadActivities);
router.post('/broker/leads/:leadId/activities', broker_controller_1.createActivity);
// Broker analitik
router.get('/broker/analytics', broker_controller_1.getBrokerAnalytics);
// Broker değerlendirme
router.post('/brokers/:brokerId/reviews', broker_controller_1.createBrokerReview);
router.post('/broker/reviews/:id/respond', broker_controller_1.respondToReview);
// ============================================
// ADMIN ROUTES
// ============================================
router.get('/admin/brokers/pending', admin_1.adminMiddleware, broker_controller_1.getPendingBrokers);
router.patch('/admin/brokers/:id/status', admin_1.adminMiddleware, broker_controller_1.updateBrokerStatus);
router.patch('/admin/broker-reviews/:id/status', admin_1.adminMiddleware, broker_controller_1.updateReviewStatus);
exports.default = router;
