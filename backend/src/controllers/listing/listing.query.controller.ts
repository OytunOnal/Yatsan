import { Request, Response } from 'express';
import { eq, and, or, desc, sql, like } from 'drizzle-orm';
import { listings, listingImages, users } from '../../db/schema';
import { ListingHandlerRegistry } from '../../handlers/listing';

// Get the singleton registry instance
const registry = ListingHandlerRegistry.getInstance();

/**
 * İlanları listele
 *
 * Supports both base filters (minPrice, maxPrice, location, search)
 * and type-specific filters (yachtType, condition, brand, etc.)
 */
export const getListings = async (req: Request, res: Response) => {
  try {
    const {
      listingType,
      minPrice,
      maxPrice,
      location,
      status,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // WHERE koşullarını oluştur
    const conditions: any[] = [];

    if (listingType) {
      conditions.push(eq(listings.listingType, listingType as string));
    }

    if (minPrice) {
      conditions.push(sql`${listings.price} >= ${parseFloat(minPrice as string)}`);
    }

    if (maxPrice) {
      conditions.push(sql`${listings.price} <= ${parseFloat(maxPrice as string)}`);
    }

    if (location) {
      conditions.push(like(listings.location, `%${location}%`));
    }

    if (search) {
      conditions.push(
        or(
          like(listings.title, `%${search}%`),
          like(listings.description!, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(listings.status, status as string));
    } else {
      // Public endpoint: sadece APPROVED ilanları göster
      conditions.push(eq(listings.status, 'APPROVED'));
    }

    // Type-specific filtreleri ekle
    let typeSpecificConditions: any[] = [];
    if (listingType) {
      try {
        const handler = registry.getHandler(listingType as string);
        // Type-specific filtreleri query parametrelerinden al
        const typeSpecificFilters = { ...req.query };
        typeSpecificConditions = handler.getTypeSpecificFilters(typeSpecificFilters);
      } catch (e) {
        // Handler bulunamazsa type-specific filtreler eklenmez
      }
    }

    // Tüm koşulları birleştir
    const allConditions = [...conditions, ...typeSpecificConditions];
    const whereClause = allConditions.length > 0 ? and(...allConditions) : undefined;

    // İlanları getir
    const allListings = await req.db.select({
      listing: listings,
      user: {
        id: users.id,
        email: users.email,
        userType: users.userType,
      },
    }).from(listings)
      .leftJoin(users, eq(listings.userId, users.id))
      .where(whereClause)
      .orderBy(desc(listings.createdAt))
      .limit(parseInt(limit as string))
      .offset((parseInt(page as string) - 1) * parseInt(limit as string));

    // Her ilan için resimleri getir
    const listingsWithImages = await Promise.all(
      allListings.map(async ({ listing, user }) => {
        const images = await req.db.select()
          .from(listingImages)
          .where(eq(listingImages.listing_id, listing.id))
          .orderBy(listingImages.orderIndex);

        return { listing, user, images };
      })
    );

    // Toplam sayıyı al
    const countResult = await req.db.select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    // Format: listing ve user'ı birleştir, type-specific verileri ekle
    const formattedListings = await Promise.all(
      listingsWithImages.map(async ({ listing, user, images }) => {
        // Get type-specific data using handler
        let typeSpecificData = null;
        try {
          const handler = registry.getHandler(listing.listingType);
          typeSpecificData = await handler.getTypeSpecific(req.db, listing.id);
        } catch (e) {
          // Handler bulunamazsa veya hata olursa typeSpecificData null kalır
        }

        // Type-specific veriyi doğru formatta ekle (yachtListing, partListing, vb.)
        const result: any = {
          ...listing,
          user,
          images,
        };

        if (typeSpecificData) {
          // listing_id alanını çıkar, sadece type-specific alanları ekle
          const { listing_id, ...data } = typeSpecificData;
          const typeKey = `${listing.listingType}Listing`;
          result[typeKey] = data;
        }

        return result;
      })
    );

    res.json({
      listings: formattedListings,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    console.error('İlan listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
