"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const dotenv = __importStar(require("dotenv"));
const schema_1 = require("../db/schema");
const categories_1 = require("./categories");
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/yatsan';
// Recursive kategori ekleme fonksiyonu
async function addCategoriesRecursively(db, categoryData, parentId = null, parentPath = []) {
    const slug = (0, categories_1.createSlug)(categoryData.name, parentPath);
    const categoryId = (0, schema_1.generateId)();
    const category = {
        id: categoryId,
        name: categoryData.name,
        slug,
        description: categoryData.description,
        icon: categoryData.icon || null,
        parentId,
        listingCount: 0,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await db.insert(schema_1.categories).values(category);
    console.log(`✓ Kategori eklendi: ${categoryData.name} (${slug})`);
    if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        for (const subcategory of categoryData.subcategories) {
            await addCategoriesRecursively(db, subcategory, categoryId, [...parentPath, categoryData.name]);
        }
    }
}
// Ana seed fonksiyonu
async function seedCategories() {
    console.log('🌱 Kategoriler seed ediliyor...\n');
    const client = (0, postgres_1.default)(DATABASE_URL);
    const db = (0, postgres_js_1.drizzle)(client);
    // Önce mevcut kategorileri temizle
    console.log('🗑️ Mevcut kategoriler temizleniyor...');
    await db.delete(schema_1.categories);
    console.log('✓ Kategoriler temizlendi\n');
    // Kategorileri ekle
    for (const category of categories_1.ALL_CATEGORIES) {
        await addCategoriesRecursively(db, category);
    }
    console.log('\n✅ Kategori seed işlemi tamamlandı!');
    await client.end();
}
// Script'i çalıştır
seedCategories().catch(console.error);
