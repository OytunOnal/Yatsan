import { Request, Response } from 'express';
import { db } from '../../lib/db';
import { brokers, brokerListings, crmLeads, crmActivities, brokerReviews } from '../../db/schema';
import { eq, and, count, avg, sql } from 'drizzle-orm';

// ============================================
// BROKER ANALYTICS
// ============================================
export const getBrokerAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
    }

    // İlan istatistikleri
    const [listingStats] = await db
      .select({
        totalListings: count(),
        totalViews: sql<number>`COALESCE(SUM(${brokerListings.views}), 0)`,
        totalInquiries: sql<number>`COALESCE(SUM(${brokerListings.inquiries}), 0)`,
        totalLeads: sql<number>`COALESCE(SUM(${brokerListings.leads}), 0)`,
      })
      .from(brokerListings)
      .where(eq(brokerListings.brokerId, broker.id));

    // Lead istatistikleri (duruma göre)
    const leadStats = await db
      .select({
        status: crmLeads.status,
        count: count(),
      })
      .from(crmLeads)
      .where(eq(crmLeads.brokerId, broker.id))
      .groupBy(crmLeads.status);

    // Lead istatistikleri (önceliğe göre)
    const priorityStats = await db
      .select({
        priority: crmLeads.priority,
        count: count(),
      })
      .from(crmLeads)
      .where(eq(crmLeads.brokerId, broker.id))
      .groupBy(crmLeads.priority);

    // Son 30 günün aktiviteleri
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activityStats] = await db
      .select({
        totalActivities: count(),
      })
      .from(crmActivities)
      .where(
        and(
          eq(crmActivities.brokerId, broker.id),
          sql`${crmActivities.createdAt} >= ${thirtyDaysAgo}`
        )
      );

    // Değerlendirme istatistikleri
    const [reviewStats] = await db
      .select({
        averageRating: avg(brokerReviews.rating),
        totalReviews: count(),
      })
      .from(brokerReviews)
      .where(eq(brokerReviews.brokerId, broker.id));

    res.json({
      listings: listingStats,
      leads: {
        byStatus: leadStats.reduce((acc, item) => {
          acc[item.status] = Number(item.count);
          return acc;
        }, {} as Record<string, number>),
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item.priority] = Number(item.count);
          return acc;
        }, {} as Record<string, number>),
      },
      activities: activityStats,
      reviews: {
        averageRating: reviewStats?.averageRating || 0,
        totalReviews: reviewStats?.totalReviews || 0,
      },
    });
  } catch (error) {
    console.error('Get broker analytics error:', error);
    res.status(500).json({ error: 'Analitik veriler alınamadı' });
  }
};
