"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertiseListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * ExpertiseListingHandler
 *
 * Handles expertise-specific listing operations including validation,
 * CRUD operations for expertise-specific data, and schema definition.
 * (Ekspertiz)
 */
class ExpertiseListingHandler {
    constructor() {
        this.type = 'expertise';
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
            companyName: zod_1.z.string().optional(),
            expertName: zod_1.z.string().optional(),
            licenseNumber: zod_1.z.string().optional(),
            yearsExperience: zod_1.z.number().int().min(0).optional(),
            expertiseType: zod_1.z.enum(['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'], {
                errorMap: () => ({ message: 'Geçersiz ekspertiz türü' })
            }),
            boatTypes: zod_1.z.string().optional(), // JSON string
            minBoatLength: zod_1.z.number().positive().optional(),
            maxBoatLength: zod_1.z.number().positive().optional(),
            serviceArea: zod_1.z.string().optional(),
            mobileService: zod_1.z.boolean().default(false),
            reportTypes: zod_1.z.string().optional(), // JSON string
            reportLanguages: zod_1.z.string().optional(), // JSON string
            turnaroundTime: zod_1.z.string().optional(),
            basePrice: zod_1.z.number().positive().optional(),
            pricePerMeter: zod_1.z.number().positive().optional(),
            travelFee: zod_1.z.number().positive().optional(),
            certifications: zod_1.z.string().optional(), // JSON string
            memberships: zod_1.z.string().optional(), // JSON string
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
            website: zod_1.z.string().optional(),
        });
        this.schema = {
            type: this.type,
            label: 'Ekspertiz',
            labelPlural: 'Ekspertiz',
            icon: 'clipboard-check',
            description: 'Tekne ekspertiz ve değerleme hizmetleri',
            fields: [
                {
                    name: 'companyName',
                    type: 'text',
                    label: 'Şirket Adı',
                    required: false,
                },
                {
                    name: 'expertName',
                    type: 'text',
                    label: 'Eksper Adı',
                    required: false,
                },
                {
                    name: 'licenseNumber',
                    type: 'text',
                    label: 'Lisans Numarası',
                    required: false,
                },
                {
                    name: 'yearsExperience',
                    type: 'number',
                    label: 'Deneyim (yıl)',
                    required: false,
                    min: 0,
                },
                {
                    name: 'expertiseType',
                    type: 'select',
                    label: 'Ekspertiz Türü',
                    required: true,
                    options: ['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'],
                },
                {
                    name: 'boatTypes',
                    type: 'json',
                    label: 'Tekne Türleri',
                    required: false,
                },
                {
                    name: 'minBoatLength',
                    type: 'number',
                    label: 'Min Tekne Boyu (m)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'maxBoatLength',
                    type: 'number',
                    label: 'Max Tekne Boyu (m)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'serviceArea',
                    type: 'text',
                    label: 'Hizmet Bölgesi',
                    required: false,
                },
                {
                    name: 'mobileService',
                    type: 'select',
                    label: 'Mobil Hizmet',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'reportTypes',
                    type: 'json',
                    label: 'Rapor Türleri',
                    required: false,
                },
                {
                    name: 'reportLanguages',
                    type: 'json',
                    label: 'Rapor Dilleri',
                    required: false,
                },
                {
                    name: 'turnaroundTime',
                    type: 'text',
                    label: 'Teslimat Süresi',
                    required: false,
                },
                {
                    name: 'basePrice',
                    type: 'number',
                    label: 'Baz Ücret',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'pricePerMeter',
                    type: 'number',
                    label: 'Metre Başına Ücret',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'travelFee',
                    type: 'number',
                    label: 'Ulaşım Ücreti',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'certifications',
                    type: 'json',
                    label: 'Sertifikalar',
                    required: false,
                },
                {
                    name: 'memberships',
                    type: 'json',
                    label: 'Üyelikler',
                    required: false,
                },
                {
                    name: 'phone',
                    type: 'text',
                    label: 'Telefon',
                    required: false,
                },
                {
                    name: 'email',
                    type: 'text',
                    label: 'E-posta',
                    required: false,
                },
                {
                    name: 'website',
                    type: 'text',
                    label: 'Web Sitesi',
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
        return schema_1.expertiseListings;
    }
    async createTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.expertiseListings).values({
            listing_id: listingId,
            companyName: typeSpecific.companyName || null,
            expertName: typeSpecific.expertName || null,
            licenseNumber: typeSpecific.licenseNumber || null,
            yearsExperience: typeSpecific.yearsExperience || null,
            expertiseType: typeSpecific.expertiseType,
            boatTypes: typeSpecific.boatTypes || null,
            minBoatLength: typeSpecific.minBoatLength?.toString() || null,
            maxBoatLength: typeSpecific.maxBoatLength?.toString() || null,
            serviceArea: typeSpecific.serviceArea || null,
            mobileService: typeSpecific.mobileService ?? false,
            reportTypes: typeSpecific.reportTypes || null,
            reportLanguages: typeSpecific.reportLanguages || null,
            turnaroundTime: typeSpecific.turnaroundTime || null,
            basePrice: typeSpecific.basePrice?.toString() || null,
            pricePerMeter: typeSpecific.pricePerMeter?.toString() || null,
            travelFee: typeSpecific.travelFee?.toString() || null,
            certifications: typeSpecific.certifications || null,
            memberships: typeSpecific.memberships || null,
            phone: typeSpecific.phone || null,
            email: typeSpecific.email || null,
            website: typeSpecific.website || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.expertiseListings)
            .where((0, drizzle_orm_1.eq)(schema_1.expertiseListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        const updateData = {};
        const allowedFields = [
            'companyName', 'expertName', 'licenseNumber', 'yearsExperience', 'expertiseType',
            'boatTypes', 'minBoatLength', 'maxBoatLength', 'serviceArea', 'mobileService',
            'reportTypes', 'reportLanguages', 'turnaroundTime', 'basePrice', 'pricePerMeter',
            'travelFee', 'certifications', 'memberships', 'phone', 'email', 'website'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                if (['minBoatLength', 'maxBoatLength', 'basePrice', 'pricePerMeter', 'travelFee'].includes(field)) {
                    updateData[field] = typeSpecific[field]?.toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.expertiseListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.expertiseListings.listing_id, listingId));
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
        if (filters.expertiseType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.expertiseListings.expertiseType, filters.expertiseType));
        }
        if (filters.mobileService === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.expertiseListings.mobileService, true));
        }
        if (filters.serviceArea) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.expertiseListings.serviceArea} ILIKE ${`%${filters.serviceArea}%`}`);
        }
        if (subqueryConditions.length > 0) {
            const whereClause = (0, drizzle_orm_1.and)(...subqueryConditions);
            conditions.push((0, drizzle_orm_1.sql) `EXISTS (
          SELECT 1 FROM ${schema_1.expertiseListings}
          WHERE ${schema_1.expertiseListings.listing_id} = ${schema_1.listings.id}
          ${whereClause ? (0, drizzle_orm_1.sql) `AND ${whereClause}` : (0, drizzle_orm_1.sql) ``}
        )`);
        }
        return conditions;
    }
    getFilterSchema() {
        return [
            {
                name: 'expertiseType',
                type: 'select',
                label: 'Ekspertiz Türü',
                options: ['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'],
            },
            {
                name: 'mobileService',
                type: 'select',
                label: 'Mobil Hizmet',
                options: ['true', 'false'],
            },
            {
                name: 'serviceArea',
                type: 'text',
                label: 'Hizmet Bölgesi',
                placeholder: 'Bölge ara...',
            },
        ];
    }
}
exports.ExpertiseListingHandler = ExpertiseListingHandler;
exports.default = ExpertiseListingHandler;
