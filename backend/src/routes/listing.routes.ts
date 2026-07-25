import { Router } from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getListingTypes,
  getListingTypeSchema,
  getFilterSchema,
} from '../controllers/listing.controller';
import { upload } from '../middleware/upload';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ============================================
// LİSTİNG TYPE METADATA ROUTE'LARI
// ============================================

// Tüm listing type'larını getir (frontend için)
router.get('/types', authMiddleware, getListingTypes);

// Belirli bir listing type'ının şemasını getir
router.get('/types/:type', authMiddleware, getListingTypeSchema);

// ============================================
// FILTER SCHEMA ROUTE'LARI
// ============================================

// Belirli bir listing type'ının filtre şemasını getir (public endpoint)
router.get('/filters/schema/:type', getFilterSchema);

// ============================================
// GENEL LİSTİNG ROUTE'LARI
// ============================================

// Tüm ilanları listele (filtreleme ile) - Public endpoint
router.get('/', getListings);

// İlan detayını getir (türden bağımsız) - Public endpoint
router.get('/:id', getListingById);

// İlan oluştur (tüm türleri destekler - listingType body'de)
router.post('/', authMiddleware, upload.array('images', 15), createListing);

// İlan güncelle (türden bağımsız)
router.put('/:id', authMiddleware, updateListing);

// İlan sil
router.delete('/:id', authMiddleware, deleteListing);

export default router;
