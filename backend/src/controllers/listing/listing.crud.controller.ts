import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { listings, listingImages } from '../../db/schema';
import { ListingHandlerRegistry } from '../../handlers/listing';
import { assertAuthenticated } from '../../types';
import { processImage } from '../../middleware/upload';
import path from 'path';
import {
  validateCommonStrings,
  validateYachtStrings,
  validatePartStrings,
  validateMarinaStrings,
  validateCrewStrings,
  validatePrice,
  validateYachtNumbers,
  validateMarinaNumbers,
  validateCrewNumbers,
} from './utils/validation';

// Get the singleton registry instance
const registry = ListingHandlerRegistry.getInstance();

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

    // Validate common strings
    const commonValidation = validateCommonStrings(title, description, location);
    if (!commonValidation.valid) {
      return res.status(400).json({ message: commonValidation.error });
    }

    // Type-specific string validations
    if (listingType === 'yacht') {
      const validation = validateYachtStrings(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
    } else if (listingType === 'part') {
      const validation = validatePartStrings(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
    } else if (listingType === 'marina') {
      const validation = validateMarinaStrings(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
    } else if (listingType === 'crew') {
      const validation = validateCrewStrings(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
    }

    // Validate and convert price
    const priceValidation = validatePrice(price);
    if (!priceValidation.valid) {
      return res.status(400).json({ message: priceValidation.error });
    }

    // Convert string values to numbers (FormData sends everything as strings)
    const processedData: any = {
      title,
      description,
      location,
      price: priceValidation.value,
      ...data,
    };

    // Convert numeric fields based on listing type
    if (listingType === 'yacht') {
      const validation = validateYachtNumbers(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
      Object.assign(processedData, validation.processed);
    } else if (listingType === 'marina') {
      const validation = validateMarinaNumbers(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
      Object.assign(processedData, validation.processed);
    } else if (listingType === 'crew') {
      const validation = validateCrewNumbers(data);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }
      Object.assign(processedData, validation.processed);
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

    // Category validation
    if (!validatedData.categoryId) {
      return res.status(400).json({ message: 'categoryId gereklidir' });
    }
    if (!validatedData.subcategoryId) {
      return res.status(400).json({ message: 'subcategoryId gereklidir' });
    }

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
      categoryId: validatedData.categoryId,
      subcategoryId: validatedData.subcategoryId,
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
 * İlan detayını getir
 */
export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listingResult = await req.db.select({
      listing: listings,
    }).from(listings)
      .where(eq(listings.id, id))
      .limit(1);

    if (listingResult.length === 0) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    const listing = listingResult[0].listing;

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
