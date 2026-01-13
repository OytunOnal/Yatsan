"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserListings = exports.getDashboardStats = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const types_1 = require("../types");
const getDashboardStats = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        // Get user's listings count by status
        const totalCountResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.userId, userId));
        const totalListings = Number(totalCountResult[0]?.count || 0);
        const pendingCountResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.listings.userId, userId), (0, drizzle_orm_1.eq)(schema_1.listings.status, 'PENDING')));
        const pendingListings = Number(pendingCountResult[0]?.count || 0);
        const approvedCountResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.listings.userId, userId), (0, drizzle_orm_1.eq)(schema_1.listings.status, 'APPROVED')));
        const approvedListings = Number(approvedCountResult[0]?.count || 0);
        const rejectedCountResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.listings.userId, userId), (0, drizzle_orm_1.eq)(schema_1.listings.status, 'REJECTED')));
        const rejectedListings = Number(rejectedCountResult[0]?.count || 0);
        // Get total messages (sent + received)
        const totalMessagesResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.messages.senderId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId)));
        const totalMessages = Number(totalMessagesResult[0]?.count || 0);
        // Get unread messages count
        const unreadMessagesResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messages.receiverId, userId), (0, drizzle_orm_1.eq)(schema_1.messages.read, false)));
        const unreadMessages = Number(unreadMessagesResult[0]?.count || 0);
        res.json({
            totalListings,
            pendingListings,
            approvedListings,
            rejectedListings,
            totalMessages,
            unreadMessages
        });
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getUserListings = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const { status, page = 1, limit = 20 } = req.query;
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.listings.userId, userId)];
        if (status && status !== 'all') {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.status, status.toUpperCase()));
        }
        const whereClause = (0, drizzle_orm_1.and)(...conditions);
        const allListings = await req.db.select().from(schema_1.listings)
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.listings.createdAt))
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit));
        // Get all listing IDs
        const listingIds = allListings.map(listing => listing.id);
        // Get all images for these listings in a single query
        let imagesMap = {};
        if (listingIds.length > 0) {
            const allImages = await req.db.select()
                .from(schema_1.listingImages)
                .where((0, drizzle_orm_1.inArray)(schema_1.listingImages.listing_id, listingIds))
                .orderBy(schema_1.listingImages.orderIndex);
            // Group images by listing_id
            imagesMap = allImages.reduce((acc, img) => {
                if (!acc[img.listing_id]) {
                    acc[img.listing_id] = [];
                }
                acc[img.listing_id].push(img);
                return acc;
            }, {});
        }
        // Combine listings with their images
        const listingsWithImages = allListings.map(listing => ({
            ...listing,
            images: imagesMap[listing.id] || [],
        }));
        // Get total count
        const countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where(whereClause);
        const total = Number(countResult[0]?.count || 0);
        res.json({
            listings: listingsWithImages,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    }
    catch (error) {
        console.error('Get user listings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserListings = getUserListings;
