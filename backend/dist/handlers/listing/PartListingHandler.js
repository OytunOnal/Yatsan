"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * PartListingHandler
 *
 * Handles marine parts and accessories listing operations.
 */
class PartListingHandler {
    constructor() {
        this.type = 'part';
        // Base fields shared by all listing types
        this.baseFields = {
            title: zod_1.z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
            description: zod_1.z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
            price: zod_1.z.number().positive('Fiyat pozitif bir sayı olmalı'),
            currency: zod_1.z.enum(['TRY', 'USD', 'EUR'], {
                errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
            }).default('TRY'),
            location: zod_1.z.string().optional(),
        };
        // Part-specific validation schema
        this.validationSchema = zod_1.z.object({
            ...this.baseFields,
            condition: zod_1.z.enum(['new', 'used', 'refurbished'], {
                errorMap: () => ({ message: 'Geçersiz durum değeri' })
            }),
            brand: zod_1.z.string().min(1, 'Marka zorunludur'),
            oemCode: zod_1.z.string().optional(),
            compatibility: zod_1.z.string().optional(),
        });
        // Schema definition for frontend form generation
        this.schema = {
            type: this.type,
            label: 'Marine Part',
            labelPlural: 'Marine Parts',
            icon: 'wrench',
            description: 'Spare parts, accessories, and equipment for boats',
            fields: [
                {
                    name: 'condition',
                    type: 'select',
                    label: 'Condition',
                    required: true,
                    options: ['new', 'used', 'refurbished'],
                },
                {
                    name: 'brand',
                    type: 'text',
                    label: 'Brand',
                    required: true,
                    placeholder: 'e.g. Volvo Penta, Yanmar',
                },
                {
                    name: 'oemCode',
                    type: 'text',
                    label: 'OEM Code',
                    required: false,
                    placeholder: 'Original Equipment Manufacturer code',
                },
                {
                    name: 'compatibility',
                    type: 'json',
                    label: 'Compatibility',
                    required: false,
                    placeholder: 'JSON array of compatible models',
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
        return schema_1.partListings;
    }
    async createTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.partListings).values({
            listing_id: listingId,
            condition: typeSpecific.condition,
            brand: typeSpecific.brand,
            oemCode: typeSpecific.oemCode || null,
            compatibility: typeSpecific.compatibility || null,
            description: typeSpecific.description || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.partListings)
            .where((0, drizzle_orm_1.eq)(schema_1.partListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        // Build update object with only provided type-specific fields
        const updateData = {};
        const allowedFields = ['condition', 'brand', 'oemCode', 'compatibility', 'description'];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                updateData[field] = typeSpecific[field];
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.partListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.partListings.listing_id, listingId));
        }
    }
    async deleteTypeSpecific(db, listingId) {
        // Cascade delete is handled by the database foreign key constraint
    }
    getSchema() {
        return this.schema;
    }
    // ============================================
    // TYPE-SPECIFIC FILTERS
    // ============================================
    /**
     * Get type-specific filter conditions for database queries
     */
    getTypeSpecificFilters(filters) {
        const conditions = [];
        // Condition filter
        if (filters.condition) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.partListings.condition, filters.condition));
        }
        // Brand filter (case-insensitive partial match)
        if (filters.brand) {
            conditions.push((0, drizzle_orm_1.sql) `LOWER(${schema_1.partListings.brand}) LIKE ${`%${filters.brand.toLowerCase()}%`}`);
        }
        // OEM Code filter (exact match)
        if (filters.oemCode) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.partListings.oemCode, filters.oemCode));
        }
        // Compatibility JSON filter (simple contains check)
        if (filters.compatibility) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.partListings.compatibility}::text ILIKE ${`%${filters.compatibility}%`}`);
        }
        return conditions;
    }
    /**
     * Get filter schema for frontend filter UI generation
     */
    getFilterSchema() {
        return [
            {
                name: 'condition',
                type: 'select',
                label: 'Condition',
                options: ['new', 'used', 'refurbished'],
            },
            {
                name: 'brand',
                type: 'text',
                label: 'Brand',
                placeholder: 'e.g. Volvo Penta, Yanmar',
            },
            {
                name: 'oemCode',
                type: 'text',
                label: 'OEM Code',
                placeholder: 'Enter OEM code...',
            },
            {
                name: 'compatibility',
                type: 'text',
                label: 'Compatible Models',
                placeholder: 'Search compatible models...',
            },
        ];
    }
}
exports.PartListingHandler = PartListingHandler;
exports.default = PartListingHandler;
