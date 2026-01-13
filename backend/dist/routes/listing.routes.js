"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listing_controller_1 = require("../controllers/listing.controller");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// ============================================
// LİSTİNG TYPE METADATA ROUTE'LARI
// ============================================
// Tüm listing type'larını getir (frontend için)
router.get('/types', auth_1.authMiddleware, listing_controller_1.getListingTypes);
// Belirli bir listing type'ının şemasını getir
router.get('/types/:type', auth_1.authMiddleware, listing_controller_1.getListingTypeSchema);
// ============================================
// FILTER SCHEMA ROUTE'LARI
// ============================================
// Belirli bir listing type'ının filtre şemasını getir (public endpoint)
router.get('/filters/schema/:type', listing_controller_1.getFilterSchema);
// ============================================
// GENEL LİSTİNG ROUTE'LARI
// ============================================
// Tüm ilanları listele (filtreleme ile) - Public endpoint
router.get('/', listing_controller_1.getListings);
// İlan detayını getir (türden bağımsız) - Public endpoint
router.get('/:id', listing_controller_1.getListingById);
// İlan oluştur (tüm türleri destekler - listingType body'de)
router.post('/', auth_1.authMiddleware, upload_1.upload.array('images', 15), listing_controller_1.createListing);
// İlan güncelle (türden bağımsız)
router.put('/:id', auth_1.authMiddleware, listing_controller_1.updateListing);
// İlan sil
router.delete('/:id', auth_1.authMiddleware, listing_controller_1.deleteListing);
exports.default = router;
