import { Request, Response } from 'express';
import { eq, or, desc, sql, and, inArray } from 'drizzle-orm';
import { listings, messages, listingImages } from '../db/schema';
import { assertAuthenticated } from '../types';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;

    // Get user's listings count by status
    const totalCountResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.userId, userId));
    const totalListings = Number(totalCountResult[0]?.count || 0);

    const pendingCountResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(and(eq(listings.userId, userId), eq(listings.status, 'PENDING')));
    const pendingListings = Number(pendingCountResult[0]?.count || 0);

    const approvedCountResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(and(eq(listings.userId, userId), eq(listings.status, 'APPROVED')));
    const approvedListings = Number(approvedCountResult[0]?.count || 0);

    const rejectedCountResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(and(eq(listings.userId, userId), eq(listings.status, 'REJECTED')));
    const rejectedListings = Number(rejectedCountResult[0]?.count || 0);

    // Get total messages (sent + received)
    const totalMessagesResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)));
    const totalMessages = Number(totalMessagesResult[0]?.count || 0);

    // Get unread messages count
    const unreadMessagesResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.read, false)));
    const unreadMessages = Number(unreadMessagesResult[0]?.count || 0);

    res.json({
      totalListings,
      pendingListings,
      approvedListings,
      rejectedListings,
      totalMessages,
      unreadMessages
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserListings = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const conditions = [eq(listings.userId, userId)];

    if (status && status !== 'all') {
      conditions.push(eq(listings.status, (status as string).toUpperCase()));
    }

    const whereClause = and(...conditions);

    const allListings = await req.db.select().from(listings)
      .where(whereClause)
      .orderBy(desc(listings.createdAt))
      .limit(parseInt(limit as string))
      .offset((parseInt(page as string) - 1) * parseInt(limit as string));

    // Get all listing IDs
    const listingIds = allListings.map(listing => listing.id);

    // Get all images for these listings in a single query
    let imagesMap: Record<string, any[]> = {};
    if (listingIds.length > 0) {
      const allImages = await req.db.select()
        .from(listingImages)
        .where(inArray(listingImages.listing_id, listingIds))
        .orderBy(listingImages.orderIndex);
      
      // Group images by listing_id
      imagesMap = allImages.reduce((acc: any, img: any) => {
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
    const countResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    res.json({
      listings: listingsWithImages,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
