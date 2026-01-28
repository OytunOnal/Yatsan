"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * MarketplaceListingHandler
 *
 * Handles marketplace-specific listing operations including validation,
 * CRUD operations for marketplace-specific data, and schema definition.
 * (İkinci El Pazarı)
 */
class MarketplaceListingHandler {
    constructor() {
        this.type = 'marketplace';
        this.baseFields = {
            title: zod_1.z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
            description: zod_1.z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
            price: zod_1.z.number().positive('Fiyat pozitif bir sayı olmalı'),
            currency: zod_1.z.enum(['TRY', 'USD', 'EUR'], {
                errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
            }).default('TRY'),
            location: zod_1.z.string().optional(),
        };
        this.validationSchema = zod_1.z.object({
            ...this.baseFields,
            itemType: zod_1.z.string().min(1, 'Ürün türü seçilmeli'),
            brand: zod_1.z.string().optional(),
            model: zod_1.z.string().optional(),
            condition: zod_1.z.enum(['new', 'excellent', 'good', 'fair', 'poor'], {
                errorMap: () => ({ message: 'Geçersiz durum değeri' })
            }),
            yearPurchased: zod_1.z.number().int().min(1970).max(new Date().getFullYear() + 1).optional(),
            usageFrequency: zod_1.z.string().optional(),
            originalPrice: zod_1.z.number().positive().optional(),
            reasonForSelling: zod_1.z.string().optional(),
            dimensions: zod_1.z.string().optional(),
            weight: zod_1.z.number().positive().optional(),
            color: zod_1.z.string().optional(),
            material: zod_1.z.string().optional(),
            includesOriginalBox: zod_1.z.boolean().default(false),
            includesManual: zod_1.z.boolean().default(true),
            includesAccessories: zod_1.z.boolean().default(false),
            accessoriesDescription: zod_1.z.string().optional(),
            negotiable: zod_1.z.boolean().default(true),
            acceptTrade: zod_1.z.boolean().default(false),
            tradeInterests: zod_1.z.string().optional(),
        });
        this.schema = {
            type: this.type,
            label: 'İkinci El Pazarı',
            labelPlural: 'İkinci El Pazarı',
            icon: 'shopping-bag',
            description: 'İkinci el denizcilik ürünleri ve ekipmanları',
            fields: [
                {
                    name: 'itemType',
                    type: 'select',
                    label: 'Ürün Türü',
                    required: true,
                    options: [
                        'clothing', 'safety_gear', 'fishing_equipment', 'water_sports',
                        'electronics', 'tools', 'furniture', 'appliances',
                        'parts', 'accessories', 'books', 'other'
                    ],
                },
                {
                    name: 'brand',
                    type: 'text',
                    label: 'Marka',
                    required: false,
                },
                {
                    name: 'model',
                    type: 'text',
                    label: 'Model',
                    required: false,
                },
                {
                    name: 'condition',
                    type: 'select',
                    label: 'Durum',
                    required: true,
                    options: ['new', 'excellent', 'good', 'fair', 'poor'],
                },
                {
                    name: 'yearPurchased',
                    type: 'number',
                    label: 'Satın Alma Yılı',
                    required: false,
                    min: 1970,
                    max: new Date().getFullYear() + 1,
                },
                {
                    name: 'usageFrequency',
                    type: 'select',
                    label: 'Kullanım Sıklığı',
                    required: false,
                    options: ['never', 'rarely', 'occasionally', 'regularly', 'frequently'],
                },
                {
                    name: 'originalPrice',
                    type: 'number',
                    label: 'Orijinal Fiyat',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'reasonForSelling',
                    type: 'textarea',
                    label: 'Satış Nedeni',
                    required: false,
                },
                {
                    name: 'dimensions',
                    type: 'text',
                    label: 'Boyutlar',
                    required: false,
                },
                {
                    name: 'weight',
                    type: 'number',
                    label: 'Ağırlık (kg)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'color',
                    type: 'text',
                    label: 'Renk',
                    required: false,
                },
                {
                    name: 'material',
                    type: 'text',
                    label: 'Malzeme',
                    required: false,
                },
                {
                    name: 'includesOriginalBox',
                    type: 'select',
                    label: 'Orijinal Kutu Dahil',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'includesManual',
                    type: 'select',
                    label: 'Kullanım Kılavuzu Dahil',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'includesAccessories',
                    type: 'select',
                    label: 'Aksesuarlar Dahil',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'accessoriesDescription',
                    type: 'textarea',
                    label: 'Aksesuar Açıklaması',
                    required: false,
                },
                {
                    name: 'negotiable',
                    type: 'select',
                    label: 'Pazarlık İmkânı',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'acceptTrade',
                    type: 'select',
                    label: 'Takas Kabul',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'tradeInterests',
                    type: 'text',
                    label: 'Takas İlgileri',
                    required: false,
                },
            ],
            validationSchema: this.validationSchema,
        };
    }
    validate(data) {
        try {
            const validated = this.validationSchema.parse(data);
            return { success: true, data: validated };
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return { success: false, errors: error.errors };
            }
            throw error;
        }
    }
    getValidationSchema() {
        return this.validationSchema;
    }
    getTypeSpecificTable() {
        return schema_1.marketplaceListings;
    }
    async createTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.marketplaceListings).values({
            listing_id: listingId,
            itemType: typeSpecific.itemType,
            brand: typeSpecific.brand || null,
            model: typeSpecific.model || null,
            condition: typeSpecific.condition,
            yearPurchased: typeSpecific.yearPurchased || null,
            usageFrequency: typeSpecific.usageFrequency || null,
            originalPrice: typeSpecific.originalPrice?.toString() || null,
            reasonForSelling: typeSpecific.reasonForSelling || null,
            dimensions: typeSpecific.dimensions || null,
            weight: typeSpecific.weight?.toString() || null,
            color: typeSpecific.color || null,
            material: typeSpecific.material || null,
            includesOriginalBox: typeSpecific.includesOriginalBox ?? false,
            includesManual: typeSpecific.includesManual ?? true,
            includesAccessories: typeSpecific.includesAccessories ?? false,
            accessoriesDescription: typeSpecific.accessoriesDescription || null,
            negotiable: typeSpecific.negotiable ?? true,
            acceptTrade: typeSpecific.acceptTrade ?? false,
            tradeInterests: typeSpecific.tradeInterests || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.marketplaceListings)
            .where((0, drizzle_orm_1.eq)(schema_1.marketplaceListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        const updateData = {};
        const allowedFields = [
            'itemType', 'brand', 'model', 'condition', 'yearPurchased', 'usageFrequency',
            'originalPrice', 'reasonForSelling', 'dimensions', 'weight', 'color', 'material',
            'includesOriginalBox', 'includesManual', 'includesAccessories', 'accessoriesDescription',
            'negotiable', 'acceptTrade', 'tradeInterests'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                if (['originalPrice', 'weight'].includes(field)) {
                    updateData[field] = typeSpecific[field]?.toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.marketplaceListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.marketplaceListings.listing_id, listingId));
        }
    }
    async deleteTypeSpecific(db, listingId) {
        // Cascade delete is handled by the database foreign key constraint
    }
    getSchema() {
        return this.schema;
    }
    getTypeSpecificFilters(filters) {
        const conditions = [];
        const subqueryConditions = [];
        if (filters.itemType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.marketplaceListings.itemType, filters.itemType));
        }
        if (filters.brand) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.marketplaceListings.brand} ILIKE ${`%${filters.brand}%`}`);
        }
        if (filters.condition) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.marketplaceListings.condition, filters.condition));
        }
        if (filters.negotiable === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.marketplaceListings.negotiable, true));
        }
        if (filters.acceptTrade === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.marketplaceListings.acceptTrade, true));
        }
        if (subqueryConditions.length > 0) {
            const whereClause = (0, drizzle_orm_1.and)(...subqueryConditions);
            conditions.push((0, drizzle_orm_1.sql) `EXISTS (
          SELECT 1 FROM ${schema_1.marketplaceListings}
          WHERE ${schema_1.marketplaceListings.listing_id} = ${schema_1.listings.id}
          ${whereClause ? (0, drizzle_orm_1.sql) `AND ${whereClause}` : (0, drizzle_orm_1.sql) ``}
        )`);
        }
        return conditions;
    }
    getFilterSchema() {
        return [
            {
                name: 'itemType',
                type: 'select',
                label: 'Ürün Türü',
                options: [
                    'clothing', 'safety_gear', 'fishing_equipment', 'water_sports',
                    'electronics', 'tools', 'furniture', 'appliances',
                    'parts', 'accessories', 'books', 'other'
                ],
            },
            {
                name: 'brand',
                type: 'text',
                label: 'Marka',
                placeholder: 'Marka ara...',
            },
            {
                name: 'condition',
                type: 'select',
                label: 'Durum',
                options: ['new', 'excellent', 'good', 'fair', 'poor'],
            },
            {
                name: 'negotiable',
                type: 'select',
                label: 'Pazarlık İmkânı',
                options: ['true', 'false'],
            },
            {
                name: 'acceptTrade',
                type: 'select',
                label: 'Takas Kabul',
                options: ['true', 'false'],
            },
        ];
    }
}
exports.MarketplaceListingHandler = MarketplaceListingHandler;
exports.default = MarketplaceListingHandler;
