import { Request, Response } from 'express';
import { db } from '../../lib/db';
import { brokers, brokerListings, listings } from '../../db/schema';
import { eq, desc, count } from 'drizzle-orm';

// ============================================
// GET BROKER BY SLUG
// ============================================
export const getBrokerBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [broker] = await db
      .select({
        id: brokers.id,
        businessName: brokers.businessName,
        slug: brokers.slug,
        status: brokers.status,
        rating: brokers.rating,
        reviewCount: brokers.reviewCount,
        responseRate: brokers.responseRate,
        responseTime: brokers.responseTime,
        verifiedAt: brokers.verifiedAt,
        createdAt: brokers.createdAt,
      })
      .from(brokers)
      .where(eq(brokers.slug, slug))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker bulunamadı' });
    }

    if (broker.status !== 'APPROVED') {
      return res.status(403).json({ error: 'Broker henüz onaylanmamış' });
    }

    res.json({ broker });
  } catch (error) {
    console.error('Get broker error:', error);
    res.status(500).json({ error: 'Broker bilgileri alınamadı' });
  }
};

// ============================================
// GET BROKER LISTINGS
// ============================================
export const getBrokerListings = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Broker'ı bul
    const [broker] = await db
      .select({ id: brokers.id })
      .from(brokers)
      .where(eq(brokers.slug, slug))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker bulunamadı' });
    }

    // İlanları getir
    const brokerListingsData = await db
      .select({
        id: listings.id,
        title: listings.title,
        price: listings.price,
        currency: listings.currency,
        listingType: listings.listingType,
        status: listings.status,
        location: listings.location,
        createdAt: listings.createdAt,
        views: brokerListings.views,
        inquiries: brokerListings.inquiries,
        featured: brokerListings.featured,
        featuredUntil: brokerListings.featuredUntil,
      })
      .from(brokerListings)
      .innerJoin(listings, eq(brokerListings.listingId, listings.id))
      .where(eq(brokerListings.brokerId, broker.id))
      .orderBy(desc(brokerListings.featured), desc(listings.createdAt))
      .limit(limit)
      .offset(offset);

    // Toplam sayı
    const [totalCount] = await db
      .select({ count: count() })
      .from(brokerListings)
      .where(eq(brokerListings.brokerId, broker.id));

    res.json({
      listings: brokerListingsData,
      pagination: {
        page,
        limit,
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get broker listings error:', error);
    res.status(500).json({ error: 'İlanlar alınamadı' });
  }
};
