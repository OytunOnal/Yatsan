"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectListing = exports.approveListing = exports.getPendingListings = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const approveListingSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
const rejectListingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    reason: zod_1.z.string(),
});
const getPendingListings = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        // Get listings with user info in a single query
        const allListings = await req.db.select({
            listing: schema_1.listings,
            user: {
                id: schema_1.users.id,
                email: schema_1.users.email,
                userType: schema_1.users.userType,
            },
        }).from(schema_1.listings)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.listings.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.listings.status, 'PENDING'))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.listings.createdAt))
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit));
        // Get all listing IDs
        const listingIds = allListings.map(item => item.listing.id);
        // Get all images for these listings in a single query
        let imagesMap = {};
        if (listingIds.length > 0) {
            const allImages = await req.db.select()
                .from(schema_1.listingImages)
                .where((0, drizzle_orm_1.inArray)(schema_1.listingImages.listing_id, listingIds));
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
        const listingsWithImages = allListings.map(item => ({
            ...item.listing,
            images: imagesMap[item.listing.id] || [],
            user: item.user,
        }));
        // Get total count
        const countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.status, 'PENDING'));
        const total = Number(countResult[0]?.count || 0);
        res.json({ listings: listingsWithImages, total, page: parseInt(page), limit: parseInt(limit) });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPendingListings = getPendingListings;
const approveListing = async (req, res) => {
    try {
        const { id } = approveListingSchema.parse(req.body);
        const listingResult = await req.db.select().from(schema_1.listings).where((0, drizzle_orm_1.eq)(schema_1.listings.id, id)).limit(1);
        const listing = listingResult[0];
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        if (listing.status !== 'PENDING') {
            return res.status(400).json({ message: 'Listing is not pending' });
        }
        await req.db.update(schema_1.listings)
            .set({ status: 'APPROVED' })
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id));
        // Mock notification
        console.log(`Notification: Listing ${id} has been approved`);
        res.json({ message: 'Listing approved' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.approveListing = approveListing;
const rejectListing = async (req, res) => {
    try {
        const { id, reason } = rejectListingSchema.parse(req.body);
        const listingResult = await req.db.select().from(schema_1.listings).where((0, drizzle_orm_1.eq)(schema_1.listings.id, id)).limit(1);
        const listing = listingResult[0];
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        if (listing.status !== 'PENDING') {
            return res.status(400).json({ message: 'Listing is not pending' });
        }
        await req.db.update(schema_1.listings)
            .set({ status: 'REJECTED', rejectionReason: reason })
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id));
        // Mock notification
        console.log(`Notification: Listing ${id} has been rejected. Reason: ${reason}`);
        res.json({ message: 'Listing rejected' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.rejectListing = rejectListing;
