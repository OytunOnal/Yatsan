"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListings = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
const listing_1 = require("../../handlers/listing");
// Get the singleton registry instance
const registry = listing_1.ListingHandlerRegistry.getInstance();
/**
 * İlanları listele
 *
 * Supports both base filters (minPrice, maxPrice, location, search)
 * and type-specific filters (yachtType, condition, brand, etc.)
 */
const getListings = async (req, res) => {
    try {
        const { listingType, minPrice, maxPrice, location, status, search, page = 1, limit = 20 } = req.query;
        // WHERE koşullarını oluştur
        const conditions = [];
        if (listingType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.listingType, listingType));
        }
        if (minPrice) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.listings.price} >= ${parseFloat(minPrice)}`);
        }
        if (maxPrice) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.listings.price} <= ${parseFloat(maxPrice)}`);
        }
        if (location) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.listings.location, `%${location}%`));
        }
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.listings.title, `%${search}%`), (0, drizzle_orm_1.like)(schema_1.listings.description, `%${search}%`)));
        }
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.status, status));
        }
        else {
            // Public endpoint: sadece APPROVED ilanları göster
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.status, 'APPROVED'));
        }
        // Type-specific filtreleri ekle
        let typeSpecificConditions = [];
        if (listingType) {
            try {
                const handler = registry.getHandler(listingType);
                // Type-specific filtreleri query parametrelerinden al
                const typeSpecificFilters = { ...req.query };
                typeSpecificConditions = handler.getTypeSpecificFilters(typeSpecificFilters);
            }
            catch (e) {
                // Handler bulunamazsa type-specific filtreler eklenmez
            }
        }
        // Tüm koşulları birleştir
        const allConditions = [...conditions, ...typeSpecificConditions];
        const whereClause = allConditions.length > 0 ? (0, drizzle_orm_1.and)(...allConditions) : undefined;
        // İlanları getir
        const allListings = await req.db.select({
            listing: schema_1.listings,
            user: {
                id: schema_1.users.id,
                email: schema_1.users.email,
                userType: schema_1.users.userType,
            },
        }).from(schema_1.listings)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.listings.userId, schema_1.users.id))
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.listings.createdAt))
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit));
        // Her ilan için resimleri getir
        const listingsWithImages = await Promise.all(allListings.map(async ({ listing, user }) => {
            const images = await req.db.select()
                .from(schema_1.listingImages)
                .where((0, drizzle_orm_1.eq)(schema_1.listingImages.listing_id, listing.id))
                .orderBy(schema_1.listingImages.orderIndex);
            return { listing, user, images };
        }));
        // Toplam sayıyı al
        const countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where(whereClause);
        const total = Number(countResult[0]?.count || 0);
        // Format: listing ve user'ı birleştir, type-specific verileri ekle
        const formattedListings = await Promise.all(listingsWithImages.map(async ({ listing, user, images }) => {
            // Get type-specific data using handler
            let typeSpecificData = null;
            try {
                const handler = registry.getHandler(listing.listingType);
                typeSpecificData = await handler.getTypeSpecific(req.db, listing.id);
            }
            catch (e) {
                // Handler bulunamazsa veya hata olursa typeSpecificData null kalır
            }
            // Type-specific veriyi doğru formatta ekle (yachtListing, partListing, vb.)
            const result = {
                ...listing,
                user,
                images,
            };
            if (typeSpecificData) {
                // listing_id alanını çıkar, sadece type-specific alanları ekle
                const { listing_id, ...data } = typeSpecificData;
                const typeKey = `${listing.listingType}Listing`;
                result[typeKey] = data;
            }
            return result;
        }));
        res.json({
            listings: formattedListings,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    }
    catch (error) {
        console.error('İlan listeleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListings = getListings;
