"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondToReview = exports.updateReviewStatus = exports.createBrokerReview = exports.getBrokerBySlugWithReviews = void 0;
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const schema_2 = require("../../db/schema");
// ============================================
// GET BROKER BY SLUG (with reviews)
// ============================================
const getBrokerBySlugWithReviews = async (req, res) => {
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
            logo: schema_1.brokerProfiles.logo,
            coverImage: schema_1.brokerProfiles.coverImage,
            description: schema_1.brokerProfiles.description,
            specialties: schema_1.brokerProfiles.specialties,
            languages: schema_1.brokerProfiles.languages,
            serviceAreas: schema_1.brokerProfiles.serviceAreas,
            website: schema_1.brokerProfiles.website,
            whatsapp: schema_1.brokerProfiles.whatsapp,
            workingHours: schema_1.brokerProfiles.workingHours,
            socialMedia: schema_1.brokerProfiles.socialMedia,
            establishedYear: schema_1.brokerProfiles.establishedYear,
            teamSize: schema_1.brokerProfiles.teamSize,
            certifications: schema_1.brokerProfiles.certifications,
            awards: schema_1.brokerProfiles.awards,
        })
            .from(schema_1.brokers)
            .leftJoin(schema_1.brokerProfiles, (0, drizzle_orm_1.eq)(schema_1.brokers.id, schema_1.brokerProfiles.brokerId))
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.slug, slug))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker bulunamadı' });
        }
        if (broker.status !== 'APPROVED') {
            return res.status(403).json({ error: 'Broker henüz onaylanmamış' });
        }
        // JSON alanları parse et
        const parsedBroker = {
            ...broker,
            specialties: broker.specialties ? JSON.parse(broker.specialties) : null,
            languages: broker.languages ? JSON.parse(broker.languages) : null,
            serviceAreas: broker.serviceAreas ? JSON.parse(broker.serviceAreas) : null,
            workingHours: broker.workingHours ? JSON.parse(broker.workingHours) : null,
            socialMedia: broker.socialMedia ? JSON.parse(broker.socialMedia) : null,
            certifications: broker.certifications ? JSON.parse(broker.certifications) : null,
            awards: broker.awards ? JSON.parse(broker.awards) : null,
        };
        // Değerlendirmeler
        const reviews = await db_1.db
            .select({
            id: schema_1.brokerReviews.id,
            rating: schema_1.brokerReviews.rating,
            title: schema_1.brokerReviews.title,
            comment: schema_1.brokerReviews.comment,
            response: schema_1.brokerReviews.response,
            responseAt: schema_1.brokerReviews.responseAt,
            helpful: schema_1.brokerReviews.helpful,
            createdAt: schema_1.brokerReviews.createdAt,
            userFirstName: schema_1.users.firstName,
            userLastName: schema_1.users.lastName,
        })
            .from(schema_1.brokerReviews)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.brokerReviews.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.brokerReviews.brokerId, broker.id), (0, drizzle_orm_1.eq)(schema_1.brokerReviews.status, 'APPROVED')))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.brokerReviews.createdAt))
            .limit(10);
        res.json({
            broker: parsedBroker,
            reviews,
        });
    }
    catch (error) {
        console.error('Get broker with reviews error:', error);
        res.status(500).json({ error: 'Broker bilgileri alınamadı' });
    }
};
exports.getBrokerBySlugWithReviews = getBrokerBySlugWithReviews;
// ============================================
// CREATE BROKER REVIEW
// ============================================
const createBrokerReview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { brokerId, listingId, rating, title, comment } = req.body;
        // Broker'ın onaylı olduğunu kontrol et
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.id, brokerId))
            .limit(1);
        if (!broker || broker.status !== 'APPROVED') {
            return res.status(404).json({ error: 'Broker bulunamadı veya onaylanmamış' });
        }
        // Kullanıcının daha önce değerlendirme yapmadığını kontrol et
        const [existingReview] = await db_1.db
            .select()
            .from(schema_1.brokerReviews)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.brokerReviews.brokerId, brokerId), (0, drizzle_orm_1.eq)(schema_1.brokerReviews.userId, userId)))
            .limit(1);
        if (existingReview) {
            return res.status(400).json({ error: 'Zaten bir değerlendirme yapmışsınız' });
        }
        const newReview = {
            id: (0, schema_2.generateId)(),
            brokerId,
            userId,
            listingId,
            rating,
            title,
            comment,
            status: 'PENDING',
            helpful: 0,
        };
        const [review] = await db_1.db.insert(schema_1.brokerReviews).values(newReview).returning();
        res.status(201).json(review);
    }
    catch (error) {
        console.error('Create broker review error:', error);
        res.status(500).json({ error: 'Değerlendirme oluşturulamadı' });
    }
};
exports.createBrokerReview = createBrokerReview;
// ============================================
// ADMIN: APPROVE/REJECT REVIEW
// ============================================
const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [review] = await db_1.db
            .select({
            id: schema_1.brokerReviews.id,
            brokerId: schema_1.brokerReviews.brokerId,
            rating: schema_1.brokerReviews.rating,
        })
            .from(schema_1.brokerReviews)
            .where((0, drizzle_orm_1.eq)(schema_1.brokerReviews.id, id))
            .limit(1);
        if (!review) {
            return res.status(404).json({ error: 'Değerlendirme bulunamadı' });
        }
        await db_1.db
            .update(schema_1.brokerReviews)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.brokerReviews.id, id));
        // Broker'ın rating ve reviewCount alanlarını güncelle
        if (status === 'APPROVED') {
            const [stats] = await db_1.db
                .select({
                avgRating: (0, drizzle_orm_1.avg)(schema_1.brokerReviews.rating),
                totalCount: (0, drizzle_orm_1.count)(),
            })
                .from(schema_1.brokerReviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.brokerReviews.brokerId, review.brokerId), (0, drizzle_orm_1.eq)(schema_1.brokerReviews.status, 'APPROVED')));
            await db_1.db
                .update(schema_1.brokers)
                .set({
                rating: stats?.avgRating?.toString() || '0',
                reviewCount: Number(stats?.totalCount) || 0,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.brokers.id, review.brokerId));
        }
        res.json({ message: 'Değerlendirme durumu güncellendi' });
    }
    catch (error) {
        console.error('Update review status error:', error);
        res.status(500).json({ error: 'Değerlendirme durumu güncellenemedi' });
    }
};
exports.updateReviewStatus = updateReviewStatus;
// ============================================
// BROKER: RESPOND TO REVIEW
// ============================================
const respondToReview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.userId, userId))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
        }
        const { id } = req.params;
        const { response } = req.body;
        // Review'in bu broker'a ait olduğunu kontrol et
        const [review] = await db_1.db
            .select()
            .from(schema_1.brokerReviews)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.brokerReviews.id, id), (0, drizzle_orm_1.eq)(schema_1.brokerReviews.brokerId, broker.id)))
            .limit(1);
        if (!review) {
            return res.status(404).json({ error: 'Değerlendirme bulunamadı' });
        }
        await db_1.db
            .update(schema_1.brokerReviews)
            .set({
            response,
            responseAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.brokerReviews.id, id));
        res.json({ message: 'Yanıt eklendi' });
    }
    catch (error) {
        console.error('Respond to review error:', error);
        res.status(500).json({ error: 'Yanıt eklenemedi' });
    }
};
exports.respondToReview = respondToReview;
