import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
} from '../controllers/category.controller';

const router = Router();

// Tüm kategorileri getir (public endpoint)
// ?withCounts=true parametresi ile ilan sayıları da dahil edilir
router.get('/', getCategories);

// Kategori detayını ID ile getir
router.get('/id/:id', getCategoryById);

// Kategori detayını slug ile getir
router.get('/slug/:slug', getCategoryBySlug);

export default router;
