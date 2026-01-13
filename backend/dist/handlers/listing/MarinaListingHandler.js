"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarinaListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * MarinaListingHandler
 *
 * Handles marina berth and slip rental listing operations.
 */
class MarinaListingHandler {
    constructor() {
        this.type = 'marina';
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
        // Marina-specific validation schema
        this.validationSchema = zod_1.z.object({
            ...this.baseFields,
            priceType: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
                errorMap: () => ({ message: 'Geçersiz fiyat türü' })
            }),
            maxLength: zod_1.z.number().positive('Maksimum uzunluk pozitif olmalı'),
            maxBeam: zod_1.z.number().positive('Maksimum genişlik pozitif olmalı'),
            maxDraft: zod_1.z.number().positive().optional(),
            services: zod_1.z.string().min(1, 'Hizmetler bilgisi zorunludur'),
            availability: zod_1.z.string().optional(),
        });
        // Schema definition for frontend form generation
        this.schema = {
            type: this.type,
            label: 'Marina Berth',
            labelPlural: 'Marina Berths',
            icon: 'anchor',
            description: 'Berth and slip rentals at marinas',
            fields: [
                {
                    name: 'priceType',
                    type: 'select',
                    label: 'Price Type',
                    required: true,
                    options: ['daily', 'weekly', 'monthly', 'yearly'],
                },
                {
                    name: 'maxLength',
                    type: 'number',
                    label: 'Max Length (m)',
                    required: true,
                    min: 0,
                    step: 0.01,
                    placeholder: 'e.g. 20.0',
                },
                {
                    name: 'maxBeam',
                    type: 'number',
                    label: 'Max Beam (m)',
                    required: true,
                    min: 0,
                    step: 0.01,
                    placeholder: 'e.g. 6.0',
                },
                {
                    name: 'maxDraft',
                    type: 'number',
                    label: 'Max Draft (m)',
                    required: false,
                    min: 0,
                    step: 0.01,
                    placeholder: 'e.g. 3.0',
                },
                {
                    name: 'services',
                    type: 'json',
                    label: 'Services',
                    required: true,
                    placeholder: 'JSON array of available services (water, electricity, wifi, etc.)',
                },
                {
                    name: 'availability',
                    type: 'json',
                    label: 'Availability',
                    required: false,
                    placeholder: 'JSON object with availability calendar',
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
        return schema_1.marinaListings;
    }
    async createTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.marinaListings).values({
            listing_id: listingId,
            priceType: typeSpecific.priceType,
            maxLength: typeSpecific.maxLength.toString(),
            maxBeam: typeSpecific.maxBeam.toString(),
            maxDraft: typeSpecific.maxDraft?.toString() || null,
            services: typeSpecific.services,
            availability: typeSpecific.availability || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.marinaListings)
            .where((0, drizzle_orm_1.eq)(schema_1.marinaListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        // Build update object with only provided type-specific fields
        const updateData = {};
        const allowedFields = ['priceType', 'maxLength', 'maxBeam', 'maxDraft', 'services', 'availability'];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                // Convert numeric fields to string for decimal columns
                if (['maxLength', 'maxBeam', 'maxDraft'].includes(field)) {
                    updateData[field] = typeSpecific[field].toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.marinaListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.marinaListings.listing_id, listingId));
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
        // Price type filter
        if (filters.priceType) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.marinaListings.priceType, filters.priceType));
        }
        // Max length filter (stored as decimal string)
        if (filters.maxLength) {
            conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.marinaListings.maxLength} AS NUMERIC) >= ${parseFloat(filters.maxLength)}`);
        }
        // Max beam filter (stored as decimal string)
        if (filters.maxBeam) {
            conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.marinaListings.maxBeam} AS NUMERIC) >= ${parseFloat(filters.maxBeam)}`);
        }
        // Max draft filter (stored as decimal string)
        if (filters.maxDraft) {
            conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.marinaListings.maxDraft} AS NUMERIC) >= ${parseFloat(filters.maxDraft)}`);
        }
        // Services JSON filter (simple contains check)
        if (filters.services) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.marinaListings.services}::text ILIKE ${`%${filters.services}%`}`);
        }
        return conditions;
    }
    /**
     * Get filter schema for frontend filter UI generation
     */
    getFilterSchema() {
        return [
            {
                name: 'priceType',
                type: 'select',
                label: 'Price Type',
                options: ['daily', 'weekly', 'monthly', 'yearly'],
            },
            {
                name: 'maxLength',
                type: 'number',
                label: 'Min Max Length (m)',
                min: 0,
                step: 0.01,
                placeholder: 'e.g. 15.0',
            },
            {
                name: 'maxBeam',
                type: 'number',
                label: 'Min Max Beam (m)',
                min: 0,
                step: 0.01,
                placeholder: 'e.g. 5.0',
            },
            {
                name: 'maxDraft',
                type: 'number',
                label: 'Min Max Draft (m)',
                min: 0,
                step: 0.01,
                placeholder: 'e.g. 2.5',
            },
            {
                name: 'services',
                type: 'text',
                label: 'Services',
                placeholder: 'Search services (water, electricity, wifi)...',
            },
        ];
    }
}
exports.MarinaListingHandler = MarinaListingHandler;
exports.default = MarinaListingHandler;
