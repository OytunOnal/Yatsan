import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, desc, sql, inArray } from 'drizzle-orm';
import { listings, listingImages, users } from '../db/schema';

const approveListingSchema = z.object({
  id: z.string(),
});

const rejectListingSchema = z.object({
  id: z.string(),
  reason: z.string(),
});

export const getPendingListings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get listings with user info in a single query
    const allListings = await req.db.select({
      listing: listings,
      user: {
        id: users.id,
        email: users.email,
        userType: users.userType,
      },
    }).from(listings)
      .leftJoin(users, eq(listings.userId, users.id))
      .where(eq(listings.status, 'PENDING'))
      .orderBy(desc(listings.createdAt))
      .limit(parseInt(limit as string))
      .offset((parseInt(page as string) - 1) * parseInt(limit as string));

    // Get all listing IDs
    const listingIds = allListings.map(item => item.listing.id);

    // Get all images for these listings in a single query
    let imagesMap: Record<string, any[]> = {};
    if (listingIds.length > 0) {
      const allImages = await req.db.select()
        .from(listingImages)
        .where(inArray(listingImages.listing_id, listingIds));
      
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
    const listingsWithImages = allListings.map(item => ({
      ...item.listing,
      images: imagesMap[item.listing.id] || [],
      user: item.user,
    }));

    // Get total count
    const countResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.status, 'PENDING'));

    const total = Number(countResult[0]?.count || 0);

    res.json({ listings: listingsWithImages, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveListing = async (req: Request, res: Response) => {
  try {
    const { id } = approveListingSchema.parse(req.body);

    const listingResult = await req.db.select().from(listings).where(eq(listings.id, id)).limit(1);

    const listing = listingResult[0];

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'PENDING') {
      return res.status(400).json({ message: 'Listing is not pending' });
    }

    await req.db.update(listings)
      .set({ status: 'APPROVED' })
      .where(eq(listings.id, id));

    // Mock notification
    console.log(`Notification: Listing ${id} has been approved`);

    res.json({ message: 'Listing approved' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectListing = async (req: Request, res: Response) => {
  try {
    const { id, reason } = rejectListingSchema.parse(req.body);

    const listingResult = await req.db.select().from(listings).where(eq(listings.id, id)).limit(1);

    const listing = listingResult[0];

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'PENDING') {
      return res.status(400).json({ message: 'Listing is not pending' });
    }

    await req.db.update(listings)
      .set({ status: 'REJECTED', rejectionReason: reason })
      .where(eq(listings.id, id));

    // Mock notification
    console.log(`Notification: Listing ${id} has been rejected. Reason: ${reason}`);

    res.json({ message: 'Listing rejected' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
