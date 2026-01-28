"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
// Tüm kategorileri getir (public endpoint)
// ?withCounts=true parametresi ile ilan sayıları da dahil edilir
router.get('/', category_controller_1.getCategories);
// Kategori detayını ID ile getir
router.get('/id/:id', category_controller_1.getCategoryById);
// Kategori detayını slug ile getir
router.get('/slug/:slug', category_controller_1.getCategoryBySlug);
exports.default = router;
