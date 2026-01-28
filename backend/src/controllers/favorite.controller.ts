import { eq, and } from 'drizzle-orm';
import { favorites, listings, users } from '../db/schema';
import { assertAuthenticated } from '../types';

// Get user's favorites
export const getFavorites = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);

    const userFavorites = await req.db
      .select({
        id: favorites.id,
        createdAt: favorites.createdAt,
        listing: {
          id: listings.id,
          title: listings.title,
          price: listings.price,
          currency: listings.currency,
          listingType: listings.listingType,
          location: listings.location,
          status: listings.status,
          createdAt: listings.createdAt,
        },
      })
      .from(favorites)
      .innerJoin(listings, eq(favorites.listingId, listings.id))
      .where(eq(favorites.userId, req.user.id))
      .orderBy(favorites.createdAt);

    res.json({
      success: true,
      data: {
        listings: userFavorites,
      },
    });
  } catch (error: any) {
    console.error('Error getting favorites:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Favoriler getirilirken hata oluştu',
      },
    });
  }
};

// Add listing to favorites
export const addFavorite = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);
    const { listingId } = req.params;

    // Check if listing exists
    const listing = await req.db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId))
      .limit(1);

    if (listing.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LISTING_NOT_FOUND',
          message: 'İlan bulunamadı',
        },
      });
    }

    // Check if already favorited
    const existing = await req.db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, req.user.id),
          eq(favorites.listingId, listingId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_FAVORITED',
          message: 'İlan zaten favorilerinizde',
        },
      });
    }

    // Add to favorites
    await req.db.insert(favorites).values({
      userId: req.user.id,
      listingId,
    });

    res.status(201).json({
      success: true,
      data: {
        message: 'İlan favorilere eklendi',
      },
    });
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Favori eklenirken hata oluştu',
      },
    });
  }
};

// Remove listing from favorites
export const removeFavorite = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);
    const { listingId } = req.params;

    const result = await req.db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, req.user.id),
          eq(favorites.listingId, listingId)
        )
      );

    res.status(204).send();
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Favori silinirken hata oluştu',
      },
    });
  }
};

// Check if listing is favorited
export const checkFavorite = async (req: any, res: any) => {
  try {
    assertAuthenticated(req);
    const { listingId } = req.params;

    const favorite = await req.db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, req.user.id),
          eq(favorites.listingId, listingId)
        )
      )
      .limit(1);

    res.json({
      success: true,
      data: {
        isFavorited: favorite.length > 0,
      },
    });
  } catch (error: any) {
    console.error('Error checking favorite:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Favori kontrolü yapılırken hata oluştu',
      },
    });
  }
};
