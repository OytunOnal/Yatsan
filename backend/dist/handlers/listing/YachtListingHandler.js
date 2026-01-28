"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YachtListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * YachtListingHandler
 *
 * Handles yacht-specific listing operations including validation,
 * CRUD operations for yacht-specific data, and schema definition.
 */
class YachtListingHandler {
    constructor() {
        this.type = 'yacht';
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
        // Yacht-specific validation schema
        this.validationSchema = zod_1.z.object({
            ...this.baseFields,
            yachtType: zod_1.z.enum(['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet'], {
                errorMap: () => ({ message: 'Geçersiz yat türü' })
            }),
            year: zod_1.z.number().int().min(1970).max(new Date().getFullYear(), 'Geçersiz yıl'),
            length: zod_1.z.number().positive('Uzunluk pozitif olmalı'),
            beam: zod_1.z.number().positive('Genişlik pozitif olmalı'),
            draft: zod_1.z.number().positive('Sükunet pozitif olmalı'),
            engineBrand: zod_1.z.string().optional(),
            engineHours: zod_1.z.number().int().nonnegative().optional(),
            engineHP: zod_1.z.number().int().positive().optional(),
            fuelType: zod_1.z.enum(['diesel', 'petrol', 'electric', 'hybrid']).optional(),
            cruisingSpeed: zod_1.z.number().int().positive().optional(),
            maxSpeed: zod_1.z.number().int().positive().optional(),
            cabinCount: zod_1.z.number().int().nonnegative().optional(),
            bedCount: zod_1.z.number().int().nonnegative().optional(),
            bathroomCount: zod_1.z.number().int().nonnegative().optional(),
            equipment: zod_1.z.string().optional(),
            condition: zod_1.z.enum(['new', 'excellent', 'good', 'fair'], {
                errorMap: () => ({ message: 'Geçersiz durum değeri' })
            }),
        });
        // Schema definition for frontend form generation
        this.schema = {
            type: this.type,
            label: 'Yacht',
            labelPlural: 'Yachts',
            icon: 'ship',
            description: 'Motor yachts, sailing yachts, catamarans, and gulets',
            fields: [
                {
                    name: 'yachtType',
                    type: 'select',
                    label: 'Yacht Type',
                    required: true,
                    options: ['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet'],
                    placeholder: 'Select yacht type',
                },
                {
                    name: 'year',
                    type: 'number',
                    label: 'Year',
                    required: true,
                    min: 1970,
                    max: new Date().getFullYear() + 1,
                    placeholder: 'e.g. 2020',
                },
                {
                    name: 'length',
                    type: 'number',
                    label: 'Length (m)',
                    required: true,
                    min: 0,
                    step: 0.01,
                    placeholder: 'e.g. 15.5',
                },
                {
                    name: 'beam',
                    type: 'number',
                    label: 'Beam (m)',
                    required: true,
                    min: 0,
                    step: 0.01,
                    placeholder: 'e.g. 5.2',
                },
                {
                    name: 'draft',
                    type: 'number',
                    label: 'Draft (m)',
                    required: true,
                    min: 0,
                    step: 0.01,
                    placeholder: 'e.g. 2.1',
                },
                {
                    name: 'engineBrand',
                    type: 'text',
                    label: 'Engine Brand',
                    required: false,
                    placeholder: 'e.g. Volvo Penta',
                },
                {
                    name: 'engineHours',
                    type: 'number',
                    label: 'Engine Hours',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 1500',
                },
                {
                    name: 'engineHP',
                    type: 'number',
                    label: 'Engine HP',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 500',
                },
                {
                    name: 'fuelType',
                    type: 'select',
                    label: 'Fuel Type',
                    required: false,
                    options: ['diesel', 'petrol', 'electric', 'hybrid'],
                },
                {
                    name: 'cruisingSpeed',
                    type: 'number',
                    label: 'Cruising Speed (knots)',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 18',
                },
                {
                    name: 'maxSpeed',
                    type: 'number',
                    label: 'Max Speed (knots)',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 25',
                },
                {
                    name: 'cabinCount',
                    type: 'number',
                    label: 'Cabin Count',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 4',
                },
                {
                    name: 'bedCount',
                    type: 'number',
                    label: 'Bed Count',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 8',
                },
                {
                    name: 'bathroomCount',
                    type: 'number',
                    label: 'Bathroom Count',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 3',
                },
                {
                    name: 'equipment',
                    type: 'json',
                    label: 'Equipment',
                    required: false,
                    placeholder: 'JSON array of equipment',
                },
                {
                    name: 'condition',
                    type: 'select',
                    label: 'Condition',
                    required: true,
                    options: ['new', 'excellent', 'good', 'fair'],
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
        return schema_1.yachtListings;
    }
    async createTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.yachtListings).values({
            listing_id: listingId,
            yachtType: typeSpecific.yachtType,
            year: typeSpecific.year,
            length: typeSpecific.length.toString(),
            beam: typeSpecific.beam.toString(),
            draft: typeSpecific.draft.toString(),
            engineBrand: typeSpecific.engineBrand || null,
            engineHours: typeSpecific.engineHours || null,
            engineHP: typeSpecific.engineHP || null,
            fuelType: typeSpecific.fuelType || null,
            cruisingSpeed: typeSpecific.cruisingSpeed || null,
            maxSpeed: typeSpecific.maxSpeed || null,
            cabinCount: typeSpecific.cabinCount || null,
            bedCount: typeSpecific.bedCount || null,
            bathroomCount: typeSpecific.bathroomCount || null,
            equipment: typeSpecific.equipment || null,
            condition: typeSpecific.condition,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.yachtListings)
            .where((0, drizzle_orm_1.eq)(schema_1.yachtListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        // Build update object with only provided type-specific fields
        const updateData = {};
        const allowedFields = [
            'yachtType', 'year', 'length', 'beam', 'draft',
            'engineBrand', 'engineHours', 'engineHP', 'fuelType',
            'cruisingSpeed', 'maxSpeed', 'cabinCount', 'bedCount',
            'bathroomCount', 'equipment', 'condition'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                // Convert numeric fields to string for decimal columns
                if (['length', 'beam', 'draft'].includes(field)) {
                    updateData[field] = typeSpecific[field].toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.yachtListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.yachtListings.listing_id, listingId));
        }
    }
    async deleteTypeSpecific(db, listingId) {
        // Cascade delete is handled by the database foreign key constraint
        // This method is kept for potential custom cleanup logic
    }
    getSchema() {
        return this.schema;
    }
    // ============================================
    // TYPE-SPECIFIC FILTERS
    // ============================================
    /**
     * Get type-specific filter conditions for database queries
     *
     * Uses EXISTS subqueries to avoid JOIN issues in the main query.
     * The main query only joins listings and users tables.
     */
    getTypeSpecificFilters(filters) {
        const conditions = [];
        // Build subquery conditions
        const subqueryConditions = [];
        // Yacht type filter
        if (filters.yachtType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.yachtListings.yachtType, filters.yachtType));
        }
        // Year range filters
        if (filters.minYear) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.yachtListings.year} >= ${parseInt(filters.minYear)}`);
        }
        if (filters.maxYear) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.yachtListings.year} <= ${parseInt(filters.maxYear)}`);
        }
        // Length range filters (stored as decimal string)
        if (filters.minLength) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.yachtListings.length} AS NUMERIC) >= ${parseFloat(filters.minLength)}`);
        }
        if (filters.maxLength) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.yachtListings.length} AS NUMERIC) <= ${parseFloat(filters.maxLength)}`);
        }
        // Condition filter
        if (filters.condition) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.yachtListings.condition, filters.condition));
        }
        // Fuel type filter
        if (filters.fuelType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.yachtListings.fuelType, filters.fuelType));
        }
        // Cabin count range filters
        if (filters.minCabinCount) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.yachtListings.cabinCount} >= ${parseInt(filters.minCabinCount)}`);
        }
        if (filters.maxCabinCount) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.yachtListings.cabinCount} <= ${parseInt(filters.maxCabinCount)}`);
        }
        // Equipment JSON filter (simple contains check)
        if (filters.equipment) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.yachtListings.equipment}::text ILIKE ${`%${filters.equipment}%`}`);
        }
        // If there are any type-specific filters, wrap them in an EXISTS subquery
        if (subqueryConditions.length > 0) {
            const whereClause = subqueryConditions.length > 0 ? (0, drizzle_orm_1.and)(...subqueryConditions) : undefined;
            conditions.push((0, drizzle_orm_1.sql) `EXISTS (
          SELECT 1 FROM ${schema_1.yachtListings}
          WHERE ${schema_1.yachtListings.listing_id} = ${schema_1.listings.id}
          ${whereClause ? (0, drizzle_orm_1.sql) `AND ${whereClause}` : (0, drizzle_orm_1.sql) ``}
        )`);
        }
        return conditions;
    }
    /**
     * Get filter schema for frontend filter UI generation
     */
    getFilterSchema() {
        return [
            {
                name: 'yachtType',
                type: 'select',
                label: 'Yacht Type',
                options: ['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet'],
            },
            {
                name: 'minYear',
                type: 'number',
                label: 'Min Year',
                min: 1970,
                max: new Date().getFullYear() + 1,
                placeholder: 'e.g. 2010',
            },
            {
                name: 'maxYear',
                type: 'number',
                label: 'Max Year',
                min: 1970,
                max: new Date().getFullYear() + 1,
                placeholder: 'e.g. 2024',
            },
            {
                name: 'minLength',
                type: 'number',
                label: 'Min Length (m)',
                min: 0,
                step: 0.01,
                placeholder: 'e.g. 10.0',
            },
            {
                name: 'maxLength',
                type: 'number',
                label: 'Max Length (m)',
                min: 0,
                step: 0.01,
                placeholder: 'e.g. 25.0',
            },
            {
                name: 'condition',
                type: 'select',
                label: 'Condition',
                options: ['new', 'excellent', 'good', 'fair'],
            },
            {
                name: 'fuelType',
                type: 'select',
                label: 'Fuel Type',
                options: ['diesel', 'petrol', 'electric', 'hybrid'],
            },
            {
                name: 'minCabinCount',
                type: 'number',
                label: 'Min Cabins',
                min: 0,
                placeholder: 'e.g. 2',
            },
            {
                name: 'maxCabinCount',
                type: 'number',
                label: 'Max Cabins',
                min: 0,
                placeholder: 'e.g. 6',
            },
            {
                name: 'equipment',
                type: 'text',
                label: 'Equipment',
                placeholder: 'Search in equipment...',
            },
        ];
    }
}
exports.YachtListingHandler = YachtListingHandler;
exports.default = YachtListingHandler;
