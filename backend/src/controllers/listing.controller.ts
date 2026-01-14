import { Request, Response } from 'express';
import { eq, and, or, desc, sql, like } from 'drizzle-orm';
import { listings, listingImages, users } from '../db/schema';
import { ListingHandlerRegistry } from '../handlers/listing';
import { assertAuthenticated } from '../types';
import { processImage } from '../middleware/upload';
import path from 'path';

// Get the singleton registry instance
const registry = ListingHandlerRegistry.getInstance();

// ============================================
// GENEL LİSTİNG FONKSİYONLARI
// ============================================

/**
 * İlan oluşturma (tüm türleri destekler)
 * 
 * Bu fonksiyon artık yeni listing type'lar eklendiğinde
 * değiştirilmesi gerekmez. Yeni bir type eklemek için:
 * 1. Yeni handler class'ı oluştur
 * 2. Registry'ye kaydet
 * 3. İşte bu kadar!
 */
export const createListing = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    
    const { listingType, price, title, description, location, ...data } = req.body;

    if (!listingType) {
      return res.status(400).json({ message: 'listingType gereklidir' });
    }

    // Validate string lengths
    if (title && title.length > 200) {
      return res.status(400).json({ message: 'Başlık en fazla 200 karakter olabilir' });
    }
    if (description && description.length > 5000) {
      return res.status(400).json({ message: 'Açıklama en fazla 5000 karakter olabilir' });
    }
    if (location && location.length > 200) {
      return res.status(400).json({ message: 'Konum en fazla 200 karakter olabilir' });
    }

    // Type-specific string validations
    if (listingType === 'yacht') {
      if (data.engineBrand && data.engineBrand.length > 100) {
        return res.status(400).json({ message: 'Motor markası en fazla 100 karakter olabilir' });
      }
      if (data.equipment && data.equipment.length > 2000) {
        return res.status(400).json({ message: 'Ekipman listesi en fazla 2000 karakter olabilir' });
      }
    } else if (listingType === 'part') {
      if (data.brand && data.brand.length > 100) {
        return res.status(400).json({ message: 'Marka en fazla 100 karakter olabilir' });
      }
      if (data.oemCode && data.oemCode.length > 50) {
        return res.status(400).json({ message: 'OEM kodu en fazla 50 karakter olabilir' });
      }
      if (data.compatibility && data.compatibility.length > 2000) {
        return res.status(400).json({ message: 'Uyumlu modeller en fazla 2000 karakter olabilir' });
      }
    } else if (listingType === 'marina') {
      if (data.services && data.services.length > 2000) {
        return res.status(400).json({ message: 'Hizmetler en fazla 2000 karakter olabilir' });
      }
      if (data.availability && data.availability.length > 1000) {
        return res.status(400).json({ message: 'Müsaitlik en fazla 1000 karakter olabilir' });
      }
    } else if (listingType === 'crew') {
      if (data.certifications && data.certifications.length > 2000) {
        return res.status(400).json({ message: 'Sertifikalar en fazla 2000 karakter olabilir' });
      }
    }

    // Validate and convert price
    let parsedPrice = 0;
    if (price) {
      parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: 'Geçerli bir fiyat giriniz' });
      }
      // Database price field: decimal(12, 2) - max value is 10^10 = 10,000,000,000
      if (parsedPrice > 9999999999) {
        return res.status(400).json({ message: 'Fiyat 9.999.999.999\'dan küçük olmalıdır' });
      }
    }

    // Convert string values to numbers (FormData sends everything as strings)
    const processedData: any = {
      title,
      description,
      location,
      price: parsedPrice,
      ...data,
    };

    // Convert numeric fields based on listing type
    if (listingType === 'yacht') {
      if (data.year) {
        const year = parseInt(data.year);
        if (year < 1970 || year > new Date().getFullYear()) {
          return res.status(400).json({ message: 'Yıl 1970 ile ' + new Date().getFullYear() + ' arasında olmalıdır' });
        }
        processedData.year = year;
      }
      if (data.length) {
        const len = parseFloat(data.length);
        if (len <= 0 || len > 9999.99) {
          return res.status(400).json({ message: 'Uzunluk 0 ile 9999.99 metre arasında olmalıdır' });
        }
        processedData.length = len;
      }
      if (data.beam) {
        const bm = parseFloat(data.beam);
        if (bm <= 0 || bm > 9999.99) {
          return res.status(400).json({ message: 'Genişlik 0 ile 9999.99 metre arasında olmalıdır' });
        }
        processedData.beam = bm;
      }
      if (data.draft) {
        const dr = parseFloat(data.draft);
        if (dr <= 0 || dr > 9999.99) {
          return res.status(400).json({ message: 'Sükunet derinliği 0 ile 9999.99 metre arasında olmalıdır' });
        }
        processedData.draft = dr;
      }
      if (data.engineHours) {
        const hours = parseInt(data.engineHours);
        if (hours < 0 || hours > 999999) {
          return res.status(400).json({ message: 'Motor saati 0 ile 999999 arasında olmalıdır' });
        }
        processedData.engineHours = hours;
      }
      if (data.engineHP) {
        const hp = parseInt(data.engineHP);
        if (hp < 0 || hp > 99999) {
          return res.status(400).json({ message: 'Motor gücü 0 ile 99999 HP arasında olmalıdır' });
        }
        processedData.engineHP = hp;
      }
      if (data.cruisingSpeed) {
        const speed = parseInt(data.cruisingSpeed);
        if (speed < 0 || speed > 999) {
          return res.status(400).json({ message: 'Seyir hızı 0 ile 999 knot arasında olmalıdır' });
        }
        processedData.cruisingSpeed = speed;
      }
      if (data.maxSpeed) {
        const speed = parseInt(data.maxSpeed);
        if (speed < 0 || speed > 999) {
          return res.status(400).json({ message: 'Maksimum hız 0 ile 999 knot arasında olmalıdır' });
        }
        processedData.maxSpeed = speed;
      }
      if (data.cabinCount) {
        const count = parseInt(data.cabinCount);
        if (count < 0 || count > 99) {
          return res.status(400).json({ message: 'Kabin sayısı 0 ile 99 arasında olmalıdır' });
        }
        processedData.cabinCount = count;
      }
      if (data.bedCount) {
        const count = parseInt(data.bedCount);
        if (count < 0 || count > 99) {
          return res.status(400).json({ message: 'Yatak sayısı 0 ile 99 arasında olmalıdır' });
        }
        processedData.bedCount = count;
      }
      if (data.bathroomCount) {
        const count = parseInt(data.bathroomCount);
        if (count < 0 || count > 99) {
          return res.status(400).json({ message: 'Banyo sayısı 0 ile 99 arasında olmalıdır' });
        }
        processedData.bathroomCount = count;
      }
    } else if (listingType === 'marina') {
      if (data.maxLength) {
        const len = parseFloat(data.maxLength);
        if (len <= 0 || len > 9999.99) {
          return res.status(400).json({ message: 'Maksimum uzunluk 0 ile 9999.99 metre arasında olmalıdır' });
        }
        processedData.maxLength = len;
      }
      if (data.maxBeam) {
        const bm = parseFloat(data.maxBeam);
        if (bm <= 0 || bm > 9999.99) {
          return res.status(400).json({ message: 'Maksimum genişlik 0 ile 9999.99 metre arasında olmalıdır' });
        }
        processedData.maxBeam = bm;
      }
      if (data.maxDraft) {
        const dr = parseFloat(data.maxDraft);
        if (dr < 0 || dr > 9999.99) {
          return res.status(400).json({ message: 'Maksimum sükunet derinliği 0 ile 9999.99 metre arasında olmalıdır' });
        }
        processedData.maxDraft = dr;
      }
    } else if (listingType === 'crew') {
      if (data.experience) {
        const exp = parseInt(data.experience);
        if (exp < 0 || exp > 99) {
          return res.status(400).json({ message: 'Deneyim 0 ile 99 yıl arasında olmalıdır' });
        }
        processedData.experience = exp;
      }
    }

    // Get handler for this type
    const handler = registry.getHandler(listingType);

    // Validate using handler
    const validation = handler.validate(processedData);
    if (!validation.success) {
      console.log('Validasyon hatası - processedData:', JSON.stringify(processedData, null, 2));
      console.log('Validasyon hatası - errors:', JSON.stringify(validation.errors, null, 2));
      return res.status(400).json({ message: 'Validasyon hatası', errors: validation.errors });
    }

    const validatedData = validation.data;

    // Create base listing
    const newListings = await req.db.insert(listings).values({
      userId: req.user.id,
      title: validatedData.title,
      description: validatedData.description,
      price: validatedData.price?.toString() || '0',
      currency: validatedData.currency || 'TRY',
      listingType,
      status: 'PENDING',
      location: validatedData.location,
    }).returning();

    const listing = newListings[0];

    // Create type-specific data using handler
    await handler.createTypeSpecific(req.db, listing.id, validatedData);

    // Handle images with processing
    if (req.files && Array.isArray(req.files)) {
      // Process images (resize and optimize)
      const processedImages = await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          const filePath = path.join(process.cwd(), 'uploads', file.filename);
          try {
            await processImage(filePath);
          } catch (error) {
            console.error('Error processing image:', error);
          }
          return {
            listing_id: listing.id,
            url: `/uploads/${file.filename}`,
            orderIndex: 0,
          };
        })
      );

      // Update orderIndex
      processedImages.forEach((img, index) => img.orderIndex = index);

      // Only insert if there are images
      if (processedImages.length > 0) {
        await req.db.insert(listingImages).values(processedImages);
      }
    }

    res.status(201).json({ listing });
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

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

/**
 * İlan detayını getir
 */
export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listingResult = await req.db.select({
      listing: listings,
      user: {
        id: users.id,
        email: users.email,
        userType: users.userType,
      },
    }).from(listings)
      .leftJoin(users, eq(listings.userId, users.id))
      .where(eq(listings.id, id))
      .limit(1);

    if (listingResult.length === 0) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    const { listing, user } = listingResult[0];

    // Get type-specific data using handler
    const handler = registry.getHandler(listing.listingType);
    const typeSpecificData = await handler.getTypeSpecific(req.db, id);

    // Get images
    const images = await req.db.select()
      .from(listingImages)
      .where(eq(listingImages.listing_id, id))
      .orderBy(listingImages.orderIndex);

    // Format response to match frontend expectations (yachtListing, partListing, etc.)
    const result: any = {
      ...listing,
      user,
      images,
    };

    if (typeSpecificData) {
      // Remove listing_id field, only add type-specific fields
      const { listing_id, ...data } = typeSpecificData;
      const typeKey = `${listing.listingType}Listing`;
      result[typeKey] = data;
    }

    res.json({
      listing: result,
    });
  } catch (error) {
    console.error('İlan detay getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * İlan güncelle
 */
export const updateListing = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const { id } = req.params;
    const data = req.body;

    const listingResult = await req.db.select().from(listings).where(eq(listings.id, id)).limit(1);

    if (listingResult.length === 0) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    const listing = listingResult[0];

    // Sadece sahibi veya admin
    if (listing.userId !== req.user.id && req.user.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Yetkisiz erişim' });
    }

    // Get handler for this listing type
    const handler = registry.getHandler(listing.listingType);

    // Validate if type-specific data is provided
    if (Object.keys(data).length > 0) {
      const validation = handler.validate({ ...listing, ...data });
      if (!validation.success) {
        return res.status(400).json({ message: 'Validasyon hatası', errors: validation.errors });
      }
    }

    // Update base listing
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price) updateData.price = data.price.toString();
    if (data.currency) updateData.currency = data.currency;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.status) updateData.status = data.status;
    if (data.rejectionReason !== undefined) updateData.rejectionReason = data.rejectionReason;

    const updatedListings = await req.db.update(listings)
      .set(updateData)
      .where(eq(listings.id, id))
      .returning();

    // Update type-specific data using handler
    await handler.updateTypeSpecific(req.db, id, data);

    res.json({ listing: updatedListings[0] });
  } catch (error) {
    console.error('İlan güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * İlan sil
 */
export const deleteListing = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const { id } = req.params;

    const listingResult = await req.db.select().from(listings).where(eq(listings.id, id)).limit(1);

    if (listingResult.length === 0) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    const listing = listingResult[0];

    // Sadece sahibi veya admin
    if (listing.userId !== req.user.id && req.user.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Yetkisiz erişim' });
    }

    await req.db.update(listings)
      .set({ status: 'DELETED' })
      .where(eq(listings.id, id));

    res.json({ message: 'İlan silindi' });
  } catch (error) {
    console.error('İlan silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Belirli bir listing type'ının filtre şemasını getir
 *
 * Bu endpoint frontend'in dinamik filtre UI oluşturması için
 * type-specific filtre şemasını döndürür.
 */
export const getFilterSchema = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    if (!registry.hasType(type)) {
      return res.status(404).json({ message: 'Listing type bulunamadı' });
    }

    const handler = registry.getHandler(type);
    const filters = handler.getFilterSchema();

    res.json({ filters });
  } catch (error) {
    console.error('Filtre şeması getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Tüm listing type'larını getir (frontend için)
 * 
 * Bu endpoint frontend'in dinamik form oluşturması için
 * tüm listing type'larının şemalarını döndürür.
 */
export const getListingTypes = async (req: Request, res: Response) => {
  try {
    const schemas = registry.getAllSchemas();
    res.json({ types: schemas });
  } catch (error) {
    console.error('Listing type\'ları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Belirli bir listing type'ının şemasını getir
 */
export const getListingTypeSchema = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    if (!registry.hasType(type)) {
      return res.status(404).json({ message: 'Listing type bulunamadı' });
    }

    const handler = registry.getHandler(type);
    const schema = handler.getSchema();

    res.json({ schema });
  } catch (error) {
    console.error('Listing type şeması getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
