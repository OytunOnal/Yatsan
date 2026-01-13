"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingTypeSchema = exports.getListingTypes = exports.getFilterSchema = exports.deleteListing = exports.updateListing = exports.getListingById = exports.getListings = exports.createListing = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const listing_1 = require("../handlers/listing");
const types_1 = require("../types");
// Get the singleton registry instance
const registry = listing_1.ListingHandlerRegistry.getInstance();
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
const createListing = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const { listingType, ...data } = req.body;
        // Get handler for this type
        const handler = registry.getHandler(listingType);
        // Validate using handler
        const validation = handler.validate(data);
        if (!validation.success) {
            return res.status(400).json({ message: 'Validasyon hatası', errors: validation.errors });
        }
        const validatedData = validation.data;
        // Create base listing
        const newListings = await req.db.insert(schema_1.listings).values({
            userId: req.user.id,
            title: validatedData.title,
            description: validatedData.description,
            price: validatedData.price?.toString() || '0',
            currency: validatedData.currency,
            listingType,
            status: 'PENDING',
            location: validatedData.location,
        }).returning();
        const listing = newListings[0];
        // Create type-specific data using handler
        await handler.createTypeSpecific(req.db, listing.id, validatedData);
        // Handle images
        if (req.files && Array.isArray(req.files)) {
            const images = req.files.map((file, index) => ({
                listing_id: listing.id,
                url: `/uploads/${file.filename}`,
                orderIndex: index,
            }));
            await req.db.insert(schema_1.listingImages).values(images);
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
 * İlanları listele
 *
 * Supports both base filters (minPrice, maxPrice, location, search)
 * and type-specific filters (yachtType, condition, brand, etc.)
 */
const getListings = async (req, res) => {
    try {
        const { listingType, minPrice, maxPrice, location, status, search, page = 1, limit = 20 } = req.query;
        // WHERE koşullarını oluştur
        const conditions = [];
        if (listingType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.listingType, listingType));
        }
        if (minPrice) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.listings.price} >= ${parseFloat(minPrice)}`);
        }
        if (maxPrice) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.listings.price} <= ${parseFloat(maxPrice)}`);
        }
        if (location) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.listings.location, `%${location}%`));
        }
        if (search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.listings.title, `%${search}%`), (0, drizzle_orm_1.like)(schema_1.listings.description, `%${search}%`)));
        }
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.status, status));
        }
        else {
            // Public endpoint: sadece APPROVED ilanları göster
            conditions.push((0, drizzle_orm_1.eq)(schema_1.listings.status, 'APPROVED'));
        }
        // Type-specific filtreleri ekle
        let typeSpecificConditions = [];
        if (listingType) {
            try {
                const handler = registry.getHandler(listingType);
                // Type-specific filtreleri query parametrelerinden al
                const typeSpecificFilters = { ...req.query };
                typeSpecificConditions = handler.getTypeSpecificFilters(typeSpecificFilters);
            }
            catch (e) {
                // Handler bulunamazsa type-specific filtreler eklenmez
            }
        }
        // Tüm koşulları birleştir
        const allConditions = [...conditions, ...typeSpecificConditions];
        const whereClause = allConditions.length > 0 ? (0, drizzle_orm_1.and)(...allConditions) : undefined;
        // İlanları getir
        const allListings = await req.db.select({
            listing: schema_1.listings,
            user: {
                id: schema_1.users.id,
                email: schema_1.users.email,
                userType: schema_1.users.userType,
            },
        }).from(schema_1.listings)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.listings.userId, schema_1.users.id))
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.listings.createdAt))
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit));
        // Her ilan için resimleri getir
        const listingsWithImages = await Promise.all(allListings.map(async ({ listing, user }) => {
            const images = await req.db.select()
                .from(schema_1.listingImages)
                .where((0, drizzle_orm_1.eq)(schema_1.listingImages.listing_id, listing.id))
                .orderBy(schema_1.listingImages.orderIndex);
            return { listing, user, images };
        }));
        // Toplam sayıyı al
        const countResult = await req.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.listings)
            .where(whereClause);
        const total = Number(countResult[0]?.count || 0);
        // Format: listing ve user'ı birleştir, type-specific verileri ekle
        const formattedListings = await Promise.all(listingsWithImages.map(async ({ listing, user, images }) => {
            // Get type-specific data using handler
            let typeSpecificData = null;
            try {
                const handler = registry.getHandler(listing.listingType);
                typeSpecificData = await handler.getTypeSpecific(req.db, listing.id);
            }
            catch (e) {
                // Handler bulunamazsa veya hata olursa typeSpecificData null kalır
            }
            // Type-specific veriyi doğru formatta ekle (yachtListing, partListing, vb.)
            const result = {
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
        }));
        res.json({
            listings: formattedListings,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    }
    catch (error) {
        console.error('İlan listeleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListings = getListings;
/**
 * İlan detayını getir
 */
const getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const listingResult = await req.db.select({
            listing: schema_1.listings,
            user: {
                id: schema_1.users.id,
                email: schema_1.users.email,
                userType: schema_1.users.userType,
            },
        }).from(schema_1.listings)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.listings.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id))
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
            .from(schema_1.listingImages)
            .where((0, drizzle_orm_1.eq)(schema_1.listingImages.listing_id, id))
            .orderBy(schema_1.listingImages.orderIndex);
        res.json({
            listing: {
                ...listing,
                typeSpecificData,
                images,
                user,
            },
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
/**
 * Belirli bir listing type'ının filtre şemasını getir
 *
 * Bu endpoint frontend'in dinamik filtre UI oluşturması için
 * type-specific filtre şemasını döndürür.
 */
const getFilterSchema = async (req, res) => {
    try {
        const { type } = req.params;
        if (!registry.hasType(type)) {
            return res.status(404).json({ message: 'Listing type bulunamadı' });
        }
        const handler = registry.getHandler(type);
        const filters = handler.getFilterSchema();
        res.json({ filters });
    }
    catch (error) {
        console.error('Filtre şeması getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getFilterSchema = getFilterSchema;
/**
 * Tüm listing type'larını getir (frontend için)
 *
 * Bu endpoint frontend'in dinamik form oluşturması için
 * tüm listing type'larının şemalarını döndürür.
 */
const getListingTypes = async (req, res) => {
    try {
        const schemas = registry.getAllSchemas();
        res.json({ types: schemas });
    }
    catch (error) {
        console.error('Listing type\'ları getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListingTypes = getListingTypes;
/**
 * Belirli bir listing type'ının şemasını getir
 */
const getListingTypeSchema = async (req, res) => {
    try {
        const { type } = req.params;
        if (!registry.hasType(type)) {
            return res.status(404).json({ message: 'Listing type bulunamadı' });
        }
        const handler = registry.getHandler(type);
        const schema = handler.getSchema();
        res.json({ schema });
    }
    catch (error) {
        console.error('Listing type şeması getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListingTypeSchema = getListingTypeSchema;
