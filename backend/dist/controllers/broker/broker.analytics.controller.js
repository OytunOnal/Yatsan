"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrokerAnalytics = void 0;
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// ============================================
// BROKER ANALYTICS
// ============================================
const getBrokerAnalytics = async (req, res) => {
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
        // İlan istatistikleri
        const [listingStats] = await db_1.db
            .select({
            totalListings: (0, drizzle_orm_1.count)(),
            totalViews: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.brokerListings.views}), 0)`,
            totalInquiries: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.brokerListings.inquiries}), 0)`,
            totalLeads: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.brokerListings.leads}), 0)`,
        })
            .from(schema_1.brokerListings)
            .where((0, drizzle_orm_1.eq)(schema_1.brokerListings.brokerId, broker.id));
        // Lead istatistikleri (duruma göre)
        const leadStats = await db_1.db
            .select({
            status: schema_1.crmLeads.status,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.crmLeads)
            .where((0, drizzle_orm_1.eq)(schema_1.crmLeads.brokerId, broker.id))
            .groupBy(schema_1.crmLeads.status);
        // Lead istatistikleri (önceliğe göre)
        const priorityStats = await db_1.db
            .select({
            priority: schema_1.crmLeads.priority,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.crmLeads)
            .where((0, drizzle_orm_1.eq)(schema_1.crmLeads.brokerId, broker.id))
            .groupBy(schema_1.crmLeads.priority);
        // Son 30 günün aktiviteleri
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [activityStats] = await db_1.db
            .select({
            totalActivities: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.crmActivities)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.crmActivities.brokerId, broker.id), (0, drizzle_orm_1.sql) `${schema_1.crmActivities.createdAt} >= ${thirtyDaysAgo}`));
        // Değerlendirme istatistikleri
        const [reviewStats] = await db_1.db
            .select({
            averageRating: (0, drizzle_orm_1.avg)(schema_1.brokerReviews.rating),
            totalReviews: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.brokerReviews)
            .where((0, drizzle_orm_1.eq)(schema_1.brokerReviews.brokerId, broker.id));
        res.json({
            listings: listingStats,
            leads: {
                byStatus: leadStats.reduce((acc, item) => {
                    acc[item.status] = Number(item.count);
                    return acc;
                }, {}),
                byPriority: priorityStats.reduce((acc, item) => {
                    acc[item.priority] = Number(item.count);
                    return acc;
                }, {}),
            },
            activities: activityStats,
            reviews: {
                averageRating: reviewStats?.averageRating || 0,
                totalReviews: reviewStats?.totalReviews || 0,
            },
        });
    }
    catch (error) {
        console.error('Get broker analytics error:', error);
        res.status(500).json({ error: 'Analitik veriler alınamadı' });
    }
};
exports.getBrokerAnalytics = getBrokerAnalytics;
