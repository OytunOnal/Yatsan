"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryId = getCategoryId;
exports.getSubcategoryId = getSubcategoryId;
exports.clearCache = clearCache;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Kategori ID'lerini cache'lemek için
const categoryCache = {};
const subcategoryCache = {};
async function getCategoryId(categoryName) {
    if (categoryCache[categoryName]) {
        return categoryCache[categoryName];
    }
    const cats = await db_1.db.select().from(schema_1.categories).where((0, drizzle_orm_1.eq)(schema_1.categories.name, categoryName)).limit(1);
    if (cats.length > 0) {
        categoryCache[categoryName] = cats[0].id;
        return cats[0].id;
    }
    return null;
}
async function getSubcategoryId(parentName, subName) {
    if (subcategoryCache[parentName]?.[subName]) {
        return subcategoryCache[parentName][subName];
    }
    const parentCat = await getCategoryId(parentName);
    if (!parentCat)
        return null;
    const subcats = await db_1.db.select().from(schema_1.categories).where((0, drizzle_orm_1.sql) `${schema_1.categories.parentId} = ${parentCat} AND ${schema_1.categories.name} = ${subName}`).limit(1);
    if (subcats.length > 0) {
        if (!subcategoryCache[parentName]) {
            subcategoryCache[parentName] = {};
        }
        subcategoryCache[parentName][subName] = subcats[0].id;
        return subcats[0].id;
    }
    return null;
}
function clearCache() {
    Object.keys(categoryCache).forEach(key => delete categoryCache[key]);
    Object.keys(subcategoryCache).forEach(key => delete subcategoryCache[key]);
}
