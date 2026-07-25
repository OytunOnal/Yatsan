import { Request, Response } from 'express';
import { db } from '../../lib/db';
import {
  brokers,
  brokerReviews,
  users,
  brokerProfiles,
  NewBrokerReview,
} from '../../db/schema';
import { eq, and, avg, count, desc } from 'drizzle-orm';
import { generateId } from '../../db/schema';

// ============================================
// GET BROKER BY SLUG (with reviews)
// ============================================
export const getBrokerBySlugWithReviews = async (req: Request, res: Response) => {
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
        logo: brokerProfiles.logo,
        coverImage: brokerProfiles.coverImage,
        description: brokerProfiles.description,
        specialties: brokerProfiles.specialties,
        languages: brokerProfiles.languages,
        serviceAreas: brokerProfiles.serviceAreas,
        website: brokerProfiles.website,
        whatsapp: brokerProfiles.whatsapp,
        workingHours: brokerProfiles.workingHours,
        socialMedia: brokerProfiles.socialMedia,
        establishedYear: brokerProfiles.establishedYear,
        teamSize: brokerProfiles.teamSize,
        certifications: brokerProfiles.certifications,
        awards: brokerProfiles.awards,
      })
      .from(brokers)
      .leftJoin(brokerProfiles, eq(brokers.id, brokerProfiles.brokerId))
      .where(eq(brokers.slug, slug))
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
    const reviews = await db
      .select({
        id: brokerReviews.id,
        rating: brokerReviews.rating,
        title: brokerReviews.title,
        comment: brokerReviews.comment,
        response: brokerReviews.response,
        responseAt: brokerReviews.responseAt,
        helpful: brokerReviews.helpful,
        createdAt: brokerReviews.createdAt,
        userFirstName: users.firstName,
        userLastName: users.lastName,
      })
      .from(brokerReviews)
      .innerJoin(users, eq(brokerReviews.userId, users.id))
      .where(
        and(
          eq(brokerReviews.brokerId, broker.id),
          eq(brokerReviews.status, 'APPROVED')
        )
      )
      .orderBy(desc(brokerReviews.createdAt))
      .limit(10);

    res.json({
      broker: parsedBroker,
      reviews,
    });
  } catch (error) {
    console.error('Get broker with reviews error:', error);
    res.status(500).json({ error: 'Broker bilgileri alınamadı' });
  }
};

// ============================================
// CREATE BROKER REVIEW
// ============================================
export const createBrokerReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { brokerId, listingId, rating, title, comment } = req.body;

    // Broker'ın onaylı olduğunu kontrol et
    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.id, brokerId))
      .limit(1);

    if (!broker || broker.status !== 'APPROVED') {
      return res.status(404).json({ error: 'Broker bulunamadı veya onaylanmamış' });
    }

    // Kullanıcının daha önce değerlendirme yapmadığını kontrol et
    const [existingReview] = await db
      .select()
      .from(brokerReviews)
      .where(
        and(
          eq(brokerReviews.brokerId, brokerId),
          eq(brokerReviews.userId, userId)
        )
      )
      .limit(1);

    if (existingReview) {
      return res.status(400).json({ error: 'Zaten bir değerlendirme yapmışsınız' });
    }

    const newReview: NewBrokerReview = {
      id: generateId(),
      brokerId,
      userId,
      listingId,
      rating,
      title,
      comment,
      status: 'PENDING',
      helpful: 0,
    };

    const [review] = await db.insert(brokerReviews).values(newReview).returning();

    res.status(201).json(review);
  } catch (error) {
    console.error('Create broker review error:', error);
    res.status(500).json({ error: 'Değerlendirme oluşturulamadı' });
  }
};

// ============================================
// ADMIN: APPROVE/REJECT REVIEW
// ============================================
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [review] = await db
      .select({
        id: brokerReviews.id,
        brokerId: brokerReviews.brokerId,
        rating: brokerReviews.rating,
      })
      .from(brokerReviews)
      .where(eq(brokerReviews.id, id))
      .limit(1);

    if (!review) {
      return res.status(404).json({ error: 'Değerlendirme bulunamadı' });
    }

    await db
      .update(brokerReviews)
      .set({ status })
      .where(eq(brokerReviews.id, id));

    // Broker'ın rating ve reviewCount alanlarını güncelle
    if (status === 'APPROVED') {
      const [stats] = await db
        .select({
          avgRating: avg(brokerReviews.rating),
          totalCount: count(),
        })
        .from(brokerReviews)
        .where(
          and(
            eq(brokerReviews.brokerId, review.brokerId),
            eq(brokerReviews.status, 'APPROVED')
          )
        );

      await db
        .update(brokers)
        .set({
          rating: stats?.avgRating?.toString() || '0',
          reviewCount: Number(stats?.totalCount) || 0,
        })
        .where(eq(brokers.id, review.brokerId));
    }

    res.json({ message: 'Değerlendirme durumu güncellendi' });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ error: 'Değerlendirme durumu güncellenemedi' });
  }
};

// ============================================
// BROKER: RESPOND TO REVIEW
// ============================================
export const respondToReview = async (req: Request, res: Response) => {
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

    const { id } = req.params;
    const { response } = req.body;

    // Review'in bu broker'a ait olduğunu kontrol et
    const [review] = await db
      .select()
      .from(brokerReviews)
      .where(and(eq(brokerReviews.id, id), eq(brokerReviews.brokerId, broker.id)))
      .limit(1);

    if (!review) {
      return res.status(404).json({ error: 'Değerlendirme bulunamadı' });
    }

    await db
      .update(brokerReviews)
      .set({
        response,
        responseAt: new Date(),
      })
      .where(eq(brokerReviews.id, id));

    res.json({ message: 'Yanıt eklendi' });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({ error: 'Yanıt eklenemedi' });
  }
};
