"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListing = exports.updateListing = exports.getListingById = exports.createListing = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
const listing_1 = require("../../handlers/listing");
const types_1 = require("../../types");
const upload_1 = require("../../middleware/upload");
const path_1 = __importDefault(require("path"));
const validation_1 = require("./utils/validation");
// Get the singleton registry instance
const registry = listing_1.ListingHandlerRegistry.getInstance();
/**
 * İlan oluşturma (tüm türleri destekler)
 *
 * Bu fonksiyon artık yeni listing type'lar eklendiğinde
 * değiştirilmesi gerekmez. Yeni bir type eklemek için:
 * 1. Yeni handler class'ı oluştur
 * 2. Registry'ye kaydet
 * 3. İşte bu kadar!
 */
const createListing = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { listingType, price, title, description, location, ...data } = req.body;
        if (!listingType) {
            return res.status(400).json({ message: 'listingType gereklidir' });
        }
        // Validate common strings
        const commonValidation = (0, validation_1.validateCommonStrings)(title, description, location);
        if (!commonValidation.valid) {
            return res.status(400).json({ message: commonValidation.error });
        }
        // Type-specific string validations
        if (listingType === 'yacht') {
            const validation = (0, validation_1.validateYachtStrings)(data);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.error });
            }
        }
        else if (listingType === 'part') {
            const validation = (0, validation_1.validatePartStrings)(data);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.error });
            }
        }
        else if (listingType === 'marina') {
            const validation = (0, validation_1.validateMarinaStrings)(data);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.error });
            }
        }
        else if (listingType === 'crew') {
            const validation = (0, validation_1.validateCrewStrings)(data);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.error });
            }
        }
        // Validate and convert price
        const priceValidation = (0, validation_1.validatePrice)(price);
        if (!priceValidation.valid) {
            return res.status(400).json({ message: priceValidation.error });
        }
        // Convert string values to numbers (FormData sends everything as strings)
        const processedData = {
            title,
            description,
            location,
            price: priceValidation.value,
            ...data,
        };
        // Convert numeric fields based on listing type
        if (listingType === 'yacht') {
            const validation = (0, validation_1.validateYachtNumbers)(data);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.error });
            }
            Object.assign(processedData, validation.processed);
        }
        else if (listingType === 'marina') {
            const validation = (0, validation_1.validateMarinaNumbers)(data);
            if (!validation.valid) {
                return res.status(400).json({ message: validation.error });
            }
            Object.assign(processedData, validation.processed);
        }
        else if (listingType === 'crew') {
            const validation = (0, validation_1.validateCrewNumbers)(data);
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
        // Create base listing
        const newListings = await req.db.insert(schema_1.listings).values({
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
            const processedImages = await Promise.all(req.files.map(async (file) => {
                const filePath = path_1.default.join(process.cwd(), 'uploads', file.filename);
                try {
                    await (0, upload_1.processImage)(filePath);
                }
                catch (error) {
                    console.error('Error processing image:', error);
                }
                return {
                    listing_id: listing.id,
                    url: `/uploads/${file.filename}`,
                    orderIndex: 0,
                };
            }));
            // Update orderIndex
            processedImages.forEach((img, index) => img.orderIndex = index);
            // Only insert if there are images
            if (processedImages.length > 0) {
                await req.db.insert(schema_1.listingImages).values(processedImages);
            }
        }
        res.status(201).json({ listing });
    }
    catch (error) {
        console.error('İlan oluşturma hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.createListing = createListing;
/**
 * İlan detayını getir
 */
const getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const listingResult = await req.db.select({
            listing: schema_1.listings,
        }).from(schema_1.listings)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id))
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
            .from(schema_1.listingImages)
            .where((0, drizzle_orm_1.eq)(schema_1.listingImages.listing_id, id))
            .orderBy(schema_1.listingImages.orderIndex);
        // Format response to match frontend expectations (yachtListing, partListing, etc.)
        const result = {
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
    }
    catch (error) {
        console.error('İlan detay getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListingById = getListingById;
/**
 * İlan güncelle
 */
const updateListing = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { id } = req.params;
        const data = req.body;
        const listingResult = await req.db.select().from(schema_1.listings).where((0, drizzle_orm_1.eq)(schema_1.listings.id, id)).limit(1);
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
        const updateData = {};
        if (data.title)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price)
            updateData.price = data.price.toString();
        if (data.currency)
            updateData.currency = data.currency;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.status)
            updateData.status = data.status;
        if (data.rejectionReason !== undefined)
            updateData.rejectionReason = data.rejectionReason;
        const updatedListings = await req.db.update(schema_1.listings)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id))
            .returning();
        // Update type-specific data using handler
        await handler.updateTypeSpecific(req.db, id, data);
        res.json({ listing: updatedListings[0] });
    }
    catch (error) {
        console.error('İlan güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.updateListing = updateListing;
/**
 * İlan sil
 */
const deleteListing = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { id } = req.params;
        const listingResult = await req.db.select().from(schema_1.listings).where((0, drizzle_orm_1.eq)(schema_1.listings.id, id)).limit(1);
        if (listingResult.length === 0) {
            return res.status(404).json({ message: 'İlan bulunamadı' });
        }
        const listing = listingResult[0];
        // Sadece sahibi veya admin
        if (listing.userId !== req.user.id && req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Yetkisiz erişim' });
        }
        await req.db.update(schema_1.listings)
            .set({ status: 'DELETED' })
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id));
        res.json({ message: 'İlan silindi' });
    }
    catch (error) {
        console.error('İlan silme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.deleteListing = deleteListing;
