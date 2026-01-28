"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFavorite = exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const types_1 = require("../types");
// Get user's favorites
const getFavorites = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userFavorites = await req.db
            .select({
            id: schema_1.favorites.id,
            createdAt: schema_1.favorites.createdAt,
            listing: {
                id: schema_1.listings.id,
                title: schema_1.listings.title,
                price: schema_1.listings.price,
                currency: schema_1.listings.currency,
                listingType: schema_1.listings.listingType,
                location: schema_1.listings.location,
                status: schema_1.listings.status,
                createdAt: schema_1.listings.createdAt,
            },
        })
            .from(schema_1.favorites)
            .innerJoin(schema_1.listings, (0, drizzle_orm_1.eq)(schema_1.favorites.listingId, schema_1.listings.id))
            .where((0, drizzle_orm_1.eq)(schema_1.favorites.userId, req.user.id))
            .orderBy(schema_1.favorites.createdAt);
        res.json({
            success: true,
            data: {
                listings: userFavorites,
            },
        });
    }
    catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Favoriler getirilirken hata oluştu',
            },
        });
    }
};
exports.getFavorites = getFavorites;
// Add listing to favorites
const addFavorite = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { listingId } = req.params;
        // Check if listing exists
        const listing = await req.db
            .select()
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, listingId))
            .limit(1);
        if (listing.length === 0) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'LISTING_NOT_FOUND',
                    message: 'İlan bulunamadı',
                },
            });
        }
        // Check if already favorited
        const existing = await req.db
            .select()
            .from(schema_1.favorites)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.favorites.userId, req.user.id), (0, drizzle_orm_1.eq)(schema_1.favorites.listingId, listingId)))
            .limit(1);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'ALREADY_FAVORITED',
                    message: 'İlan zaten favorilerinizde',
                },
            });
        }
        // Add to favorites
        await req.db.insert(schema_1.favorites).values({
            userId: req.user.id,
            listingId,
        });
        res.status(201).json({
            success: true,
            data: {
                message: 'İlan favorilere eklendi',
            },
        });
    }
    catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Favori eklenirken hata oluştu',
            },
        });
    }
};
exports.addFavorite = addFavorite;
// Remove listing from favorites
const removeFavorite = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { listingId } = req.params;
        const result = await req.db
            .delete(schema_1.favorites)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.favorites.userId, req.user.id), (0, drizzle_orm_1.eq)(schema_1.favorites.listingId, listingId)));
        res.status(204).send();
    }
    catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Favori silinirken hata oluştu',
            },
        });
    }
};
exports.removeFavorite = removeFavorite;
// Check if listing is favorited
const checkFavorite = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { listingId } = req.params;
        const favorite = await req.db
            .select()
            .from(schema_1.favorites)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.favorites.userId, req.user.id), (0, drizzle_orm_1.eq)(schema_1.favorites.listingId, listingId)))
            .limit(1);
        res.json({
            success: true,
            data: {
                isFavorited: favorite.length > 0,
            },
        });
    }
    catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Favori kontrolü yapılırken hata oluştu',
            },
        });
    }
};
exports.checkFavorite = checkFavorite;
