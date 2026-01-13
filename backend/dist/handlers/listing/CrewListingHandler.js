"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * CrewListingHandler
 *
 * Handles crew and job position listing operations.
 */
class CrewListingHandler {
    constructor() {
        this.type = 'crew';
        // Base fields shared by all listing types (price is optional for crew)
        this.baseFields = {
            title: zod_1.z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
            description: zod_1.z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
            price: zod_1.z.number().positive().optional(),
            currency: zod_1.z.enum(['TRY', 'USD', 'EUR'], {
                errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
            }).default('USD'),
            location: zod_1.z.string().optional(),
        };
        // Crew-specific validation schema
        this.validationSchema = zod_1.z.object({
            ...this.baseFields,
            position: zod_1.z.enum(['captain', 'chef', 'deckhand', 'engineer', 'stewardess'], {
                errorMap: () => ({ message: 'Geçersiz pozisyon' })
            }),
            experience: zod_1.z.number().int().min(0).max(50, 'Deneyim 0-50 yıl arasında olmalı'),
            certifications: zod_1.z.string().optional(),
            availability: zod_1.z.enum(['immediate', 'flexible', 'specific_dates'], {
                errorMap: () => ({ message: 'Geçersiz müsaitlik türü' })
            }),
            availableFrom: zod_1.z.string().datetime().optional(),
            availableTo: zod_1.z.string().datetime().optional(),
            salary: zod_1.z.number().positive().optional(),
            salaryCurrency: zod_1.z.string().default('USD'),
            salaryPeriod: zod_1.z.enum(['monthly', 'weekly', 'daily', 'per_trip']).optional(),
        });
        // Schema definition for frontend form generation
        this.schema = {
            type: this.type,
            label: 'Crew Position',
            labelPlural: 'Crew Positions',
            icon: 'users',
            description: 'Job positions for yacht crew',
            fields: [
                {
                    name: 'position',
                    type: 'select',
                    label: 'Position',
                    required: true,
                    options: ['captain', 'chef', 'deckhand', 'engineer', 'stewardess'],
                },
                {
                    name: 'experience',
                    type: 'number',
                    label: 'Experience (years)',
                    required: true,
                    min: 0,
                    max: 50,
                    placeholder: 'e.g. 5',
                },
                {
                    name: 'certifications',
                    type: 'json',
                    label: 'Certifications',
                    required: false,
                    placeholder: 'JSON array of certifications',
                },
                {
                    name: 'availability',
                    type: 'select',
                    label: 'Availability',
                    required: true,
                    options: ['immediate', 'flexible', 'specific_dates'],
                },
                {
                    name: 'availableFrom',
                    type: 'date',
                    label: 'Available From',
                    required: false,
                    placeholder: 'ISO date string',
                },
                {
                    name: 'availableTo',
                    type: 'date',
                    label: 'Available To',
                    required: false,
                    placeholder: 'ISO date string',
                },
                {
                    name: 'salary',
                    type: 'number',
                    label: 'Salary',
                    required: false,
                    min: 0,
                    placeholder: 'e.g. 5000',
                },
                {
                    name: 'salaryCurrency',
                    type: 'select',
                    label: 'Salary Currency',
                    required: false,
                    options: ['TRY', 'USD', 'EUR'],
                },
                {
                    name: 'salaryPeriod',
                    type: 'select',
                    label: 'Salary Period',
                    required: false,
                    options: ['monthly', 'weekly', 'daily', 'per_trip'],
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
        return schema_1.crewListings;
    }
    async createTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.crewListings).values({
            listing_id: listingId,
            position: typeSpecific.position,
            experience: typeSpecific.experience,
            certifications: typeSpecific.certifications || null,
            availability: typeSpecific.availability,
            availableFrom: typeSpecific.availableFrom ? new Date(typeSpecific.availableFrom) : null,
            availableTo: typeSpecific.availableTo ? new Date(typeSpecific.availableTo) : null,
            salary: typeSpecific.salary?.toString() || null,
            salaryCurrency: typeSpecific.salaryCurrency || 'USD',
            salaryPeriod: typeSpecific.salaryPeriod || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.crewListings)
            .where((0, drizzle_orm_1.eq)(schema_1.crewListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        // Extract base fields (handled by listings table)
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        // Build update object with only provided type-specific fields
        const updateData = {};
        const allowedFields = [
            'position', 'experience', 'certifications', 'availability',
            'availableFrom', 'availableTo', 'salary', 'salaryCurrency', 'salaryPeriod'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                // Convert date strings to Date objects
                if (field === 'availableFrom' || field === 'availableTo') {
                    updateData[field] = typeSpecific[field] ? new Date(typeSpecific[field]) : null;
                }
                // Convert salary to string
                else if (field === 'salary') {
                    updateData[field] = typeSpecific[field]?.toString() || null;
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.crewListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.crewListings.listing_id, listingId));
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
        // Position filter
        if (filters.position) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.crewListings.position, filters.position));
        }
        // Experience range filters
        if (filters.minExperience) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.crewListings.experience} >= ${parseInt(filters.minExperience)}`);
        }
        if (filters.maxExperience) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.crewListings.experience} <= ${parseInt(filters.maxExperience)}`);
        }
        // Availability filter
        if (filters.availability) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.crewListings.availability, filters.availability));
        }
        // Certifications JSON filter (simple contains check)
        if (filters.certifications) {
            conditions.push((0, drizzle_orm_1.sql) `${schema_1.crewListings.certifications}::text ILIKE ${`%${filters.certifications}%`}`);
        }
        // Salary range filters (stored as decimal string)
        if (filters.minSalary) {
            conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.crewListings.salary} AS NUMERIC) >= ${parseFloat(filters.minSalary)}`);
        }
        if (filters.maxSalary) {
            conditions.push((0, drizzle_orm_1.sql) `CAST(${schema_1.crewListings.salary} AS NUMERIC) <= ${parseFloat(filters.maxSalary)}`);
        }
        return conditions;
    }
    /**
     * Get filter schema for frontend filter UI generation
     */
    getFilterSchema() {
        return [
            {
                name: 'position',
                type: 'select',
                label: 'Position',
                options: ['captain', 'chef', 'deckhand', 'engineer', 'stewardess'],
            },
            {
                name: 'minExperience',
                type: 'number',
                label: 'Min Experience (years)',
                min: 0,
                max: 50,
                placeholder: 'e.g. 2',
            },
            {
                name: 'maxExperience',
                type: 'number',
                label: 'Max Experience (years)',
                min: 0,
                max: 50,
                placeholder: 'e.g. 10',
            },
            {
                name: 'availability',
                type: 'select',
                label: 'Availability',
                options: ['immediate', 'flexible', 'specific_dates'],
            },
            {
                name: 'certifications',
                type: 'text',
                label: 'Certifications',
                placeholder: 'Search certifications...',
            },
            {
                name: 'minSalary',
                type: 'number',
                label: 'Min Salary',
                min: 0,
                placeholder: 'e.g. 3000',
            },
            {
                name: 'maxSalary',
                type: 'number',
                label: 'Max Salary',
                min: 0,
                placeholder: 'e.g. 10000',
            },
        ];
    }
}
exports.CrewListingHandler = CrewListingHandler;
exports.default = CrewListingHandler;
