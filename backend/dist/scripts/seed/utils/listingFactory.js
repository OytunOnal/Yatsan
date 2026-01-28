"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseListing = createBaseListing;
const db_1 = require("../../../lib/db");
const schema_1 = require("../../../db/schema");
const categoryCache_1 = require("./categoryCache");
async function createBaseListing(userId, listingType, data) {
    const categoryId = await (0, categoryCache_1.getCategoryId)(data.categoryName);
    const subcategoryId = await (0, categoryCache_1.getSubcategoryId)(data.categoryName, data.subcategoryName);
    const listingId = (0, schema_1.generateId)();
    await db_1.db.insert(schema_1.listings).values({
        id: listingId,
        userId,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        listingType,
        status: 'APPROVED',
        location: data.location,
        categoryId,
        subcategoryId,
    });
    await db_1.db.insert(schema_1.listingImages).values({
        id: (0, schema_1.generateId)(),
        listing_id: listingId,
        url: data.image,
        orderIndex: 0,
    });
    return listingId;
}
