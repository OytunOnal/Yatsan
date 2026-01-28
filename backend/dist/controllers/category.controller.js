"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryBySlug = exports.getCategoryById = exports.getCategories = void 0;
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Tüm kategorileri getir (public endpoint)
const getCategories = async (req, res) => {
    try {
        const { withCounts } = req.query;
        // Ana kategorileri getir
        const mainCategories = await req.db.select().from(schema_1.categories)
            .where((0, drizzle_orm_1.isNull)(schema_1.categories.parentId))
            .orderBy(schema_1.categories.order);
        if (withCounts === 'true') {
            // Alt kategori ID'lerini recursive olarak topla
            const getAllSubcategoryIds = (subcategories) => {
                const ids = [];
                subcategories.forEach(sub => {
                    ids.push(sub.id);
                    if (sub.subcategories && sub.subcategories.length > 0) {
                        ids.push(...getAllSubcategoryIds(sub.subcategories));
                    }
                });
                return ids;
            };
            // Hiyerarşik kategori yapısı oluştur (recursive)
            const buildCategoryTree = async (parentId = null) => {
                const cats = await req.db.select().from(schema_1.categories)
                    .where(parentId ? (0, drizzle_orm_1.eq)(schema_1.categories.parentId, parentId) : (0, drizzle_orm_1.isNull)(schema_1.categories.parentId))
                    .orderBy(schema_1.categories.order);
                return await Promise.all(cats.map(async (cat) => {
                    // Alt kategorileri recursive olarak getir
                    const subcategories = await buildCategoryTree(cat.id);
                    // İlan sayısını hesapla - bu kategori ve tüm alt kategorilerindeki ilanları topla
                    const allSubcategoryIds = getAllSubcategoryIds(subcategories);
                    // Ana kategori için: categoryId = cat.id VEYA subcategoryId herhangi bir alt kategori
                    // Alt kategori için: sadece subcategoryId = cat.id
                    let countResult;
                    if (!parentId) {
                        // Ana kategori - tüm alt kategorilerdeki ilanları topla
                        const allIds = [cat.id, ...allSubcategoryIds];
                        countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                            .from(schema_1.listings)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.listings.categoryId, cat.id), allIds.length > 0 ? (0, drizzle_orm_1.inArray)(schema_1.listings.subcategoryId, allIds) : (0, drizzle_orm_1.sql) `1=0`), (0, drizzle_orm_1.eq)(schema_1.listings.status, 'APPROVED')));
                    }
                    else {
                        // Alt kategori - sadece bu kategorideki ilanları say
                        countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                            .from(schema_1.listings)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.listings.subcategoryId, cat.id), (0, drizzle_orm_1.eq)(schema_1.listings.status, 'APPROVED')));
                    }
                    const listingCount = Number(countResult[0]?.count || 0);
                    return {
                        ...cat,
                        listingCount,
                        subcategories,
                    };
                }));
            };
            const categoriesWithCounts = await buildCategoryTree();
            return res.json({
                success: true,
                data: categoriesWithCounts,
            });
        }
        // Alt kategorileri de dahil et
        const allCategories = await req.db.select().from(schema_1.categories)
            .orderBy(schema_1.categories.order);
        // Hiyerarşik yapı oluştur
        const categoryMap = new Map();
        const rootCategories = [];
        // Önce tüm kategorileri map'e ekle
        allCategories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, subcategories: [] });
        });
        // Ardından hiyerarşiyi oluştur
        allCategories.forEach(cat => {
            const categoryWithSubs = categoryMap.get(cat.id);
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.subcategories.push(categoryWithSubs);
                }
            }
            else {
                rootCategories.push(categoryWithSubs);
            }
        });
        res.json({
            success: true,
            data: rootCategories,
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCategories = getCategories;
// Tek bir kategoriyi getir
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryResult = await req.db.select().from(schema_1.categories)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.id, id))
            .limit(1);
        if (categoryResult.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const category = categoryResult[0];
        // Alt kategorileri getir
        const subcategories = await req.db.select().from(schema_1.categories)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.parentId, category.id))
            .orderBy(schema_1.categories.order);
        res.json({
            success: true,
            data: {
                ...category,
                subcategories,
            },
        });
    }
    catch (error) {
        console.error('Get category by id error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCategoryById = getCategoryById;
// Slug ile kategori getir
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const categoryResult = await req.db.select().from(schema_1.categories)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.slug, slug))
            .limit(1);
        if (categoryResult.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const category = categoryResult[0];
        // Alt kategorileri getir
        const subcategories = await req.db.select().from(schema_1.categories)
            .where((0, drizzle_orm_1.eq)(schema_1.categories.parentId, category.id))
            .orderBy(schema_1.categories.order);
        res.json({
            success: true,
            data: {
                ...category,
                subcategories,
            },
        });
    }
    catch (error) {
        console.error('Get category by slug error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
