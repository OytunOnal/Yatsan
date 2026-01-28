"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrokerListings = exports.getBrokerBySlug = void 0;
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// ============================================
// GET BROKER BY SLUG
// ============================================
const getBrokerBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [broker] = await db_1.db
            .select({
            id: schema_1.brokers.id,
            businessName: schema_1.brokers.businessName,
            slug: schema_1.brokers.slug,
            status: schema_1.brokers.status,
            rating: schema_1.brokers.rating,
            reviewCount: schema_1.brokers.reviewCount,
            responseRate: schema_1.brokers.responseRate,
            responseTime: schema_1.brokers.responseTime,
            verifiedAt: schema_1.brokers.verifiedAt,
            createdAt: schema_1.brokers.createdAt,
        })
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.slug, slug))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker bulunamadı' });
        }
        if (broker.status !== 'APPROVED') {
            return res.status(403).json({ error: 'Broker henüz onaylanmamış' });
        }
        res.json({ broker });
    }
    catch (error) {
        console.error('Get broker error:', error);
        res.status(500).json({ error: 'Broker bilgileri alınamadı' });
    }
};
exports.getBrokerBySlug = getBrokerBySlug;
// ============================================
// GET BROKER LISTINGS
// ============================================
const getBrokerListings = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        // Broker'ı bul
        const [broker] = await db_1.db
            .select({ id: schema_1.brokers.id })
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.slug, slug))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker bulunamadı' });
        }
        // İlanları getir
        const brokerListingsData = await db_1.db
            .select({
            id: schema_1.listings.id,
            title: schema_1.listings.title,
            price: schema_1.listings.price,
            currency: schema_1.listings.currency,
            listingType: schema_1.listings.listingType,
            status: schema_1.listings.status,
            location: schema_1.listings.location,
            createdAt: schema_1.listings.createdAt,
            views: schema_1.brokerListings.views,
            inquiries: schema_1.brokerListings.inquiries,
            featured: schema_1.brokerListings.featured,
            featuredUntil: schema_1.brokerListings.featuredUntil,
        })
            .from(schema_1.brokerListings)
            .innerJoin(schema_1.listings, (0, drizzle_orm_1.eq)(schema_1.brokerListings.listingId, schema_1.listings.id))
            .where((0, drizzle_orm_1.eq)(schema_1.brokerListings.brokerId, broker.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.brokerListings.featured), (0, drizzle_orm_1.desc)(schema_1.listings.createdAt))
            .limit(limit)
            .offset(offset);
        // Toplam sayı
        const [totalCount] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.brokerListings)
            .where((0, drizzle_orm_1.eq)(schema_1.brokerListings.brokerId, broker.id));
        res.json({
            listings: brokerListingsData,
            pagination: {
                page,
                limit,
                total: totalCount?.count || 0,
                totalPages: Math.ceil((totalCount?.count || 0) / limit),
            },
        });
    }
    catch (error) {
        console.error('Get broker listings error:', error);
        res.status(500).json({ error: 'İlanlar alınamadı' });
    }
};
exports.getBrokerListings = getBrokerListings;
