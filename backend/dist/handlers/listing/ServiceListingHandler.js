"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * ServiceListingHandler
 *
 * Handles service-specific listing operations including validation,
 * CRUD operations for service-specific data, and schema definition.
 * (Teknik Servisler)
 */
class ServiceListingHandler {
    constructor() {
        this.type = 'service';
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
            serviceType: zod_1.z.string().min(1, 'Servis türü seçilmeli'),
            businessName: zod_1.z.string().optional(),
            yearsInBusiness: zod_1.z.number().int().min(0).optional(),
            certifications: zod_1.z.string().optional(), // JSON string
            authorizedBrands: zod_1.z.string().optional(), // JSON string
            serviceArea: zod_1.z.string().optional(),
            mobileService: zod_1.z.boolean().default(false),
            emergencyService: zod_1.z.boolean().default(false),
            emergencyPhone: zod_1.z.string().optional(),
            priceType: zod_1.z.string().optional(),
            hourlyRate: zod_1.z.number().positive().optional(),
            minServiceFee: zod_1.z.number().positive().optional(),
            workingHours: zod_1.z.string().optional(),
            website: zod_1.z.string().optional(),
            whatsapp: zod_1.z.string().optional(),
        });
        this.schema = {
            type: this.type,
            label: 'Teknik Servis',
            labelPlural: 'Teknik Servisler',
            icon: 'wrench',
            description: 'Deniz aracı teknik servis hizmetleri - bakım, onarım, montaj vb.',
            fields: [
                {
                    name: 'serviceType',
                    type: 'select',
                    label: 'Servis Türü',
                    required: true,
                    options: [
                        'engine_repair', 'electrical', 'plumbing', 'fiberglass',
                        'painting', 'upholstery', 'mechanical', 'installation',
                        'maintenance', 'winterization', 'detailing', 'other'
                    ],
                    placeholder: 'Servis türü seçin',
                },
                {
                    name: 'businessName',
                    type: 'text',
                    label: 'İşletme Adı',
                    required: false,
                    placeholder: 'Şirket adı',
                },
                {
                    name: 'yearsInBusiness',
                    type: 'number',
                    label: 'Sektördeki Yıl Sayısı',
                    required: false,
                    min: 0,
                },
                {
                    name: 'certifications',
                    type: 'json',
                    label: 'Sertifikalar',
                    required: false,
                    placeholder: 'JSON array',
                },
                {
                    name: 'authorizedBrands',
                    type: 'json',
                    label: 'Yetkili Markalar',
                    required: false,
                    placeholder: 'JSON array',
                },
                {
                    name: 'serviceArea',
                    type: 'text',
                    label: 'Hizmet Bölgesi',
                    required: false,
                    placeholder: 'ör. İstanbul, Marmara Bölgesi',
                },
                {
                    name: 'mobileService',
                    type: 'select',
                    label: 'Mobil Hizmet',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'emergencyService',
                    type: 'select',
                    label: 'Acil Servis',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'emergencyPhone',
                    type: 'text',
                    label: 'Acil Telefon',
                    required: false,
                    placeholder: '05XX XXX XX XX',
                },
                {
                    name: 'priceType',
                    type: 'select',
                    label: 'Fiyatlandırma Türü',
                    required: false,
                    options: ['hourly', 'fixed', 'quote', 'negotiable'],
                },
                {
                    name: 'hourlyRate',
                    type: 'number',
                    label: 'Saatlik Ücret',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'minServiceFee',
                    type: 'number',
                    label: 'Min. Servis Ücreti',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'workingHours',
                    type: 'text',
                    label: 'Çalışma Saatleri',
                    required: false,
                    placeholder: 'Pzt-Cuma 09:00-18:00',
                },
                {
                    name: 'website',
                    type: 'text',
                    label: 'Web Sitesi',
                    required: false,
                    placeholder: 'https://',
                },
                {
                    name: 'whatsapp',
                    type: 'text',
                    label: 'WhatsApp',
                    required: false,
                    placeholder: '05XX XXX XX XX',
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
        return schema_1.serviceListings;
    }
    async createTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.serviceListings).values({
            listing_id: listingId,
            serviceType: typeSpecific.serviceType,
            businessName: typeSpecific.businessName || null,
            yearsInBusiness: typeSpecific.yearsInBusiness || null,
            certifications: typeSpecific.certifications || null,
            authorizedBrands: typeSpecific.authorizedBrands || null,
            serviceArea: typeSpecific.serviceArea || null,
            mobileService: typeSpecific.mobileService ?? false,
            emergencyService: typeSpecific.emergencyService ?? false,
            emergencyPhone: typeSpecific.emergencyPhone || null,
            priceType: typeSpecific.priceType || null,
            hourlyRate: typeSpecific.hourlyRate?.toString() || null,
            minServiceFee: typeSpecific.minServiceFee?.toString() || null,
            workingHours: typeSpecific.workingHours || null,
            website: typeSpecific.website || null,
            whatsapp: typeSpecific.whatsapp || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.serviceListings)
            .where((0, drizzle_orm_1.eq)(schema_1.serviceListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        const updateData = {};
        const allowedFields = [
            'serviceType', 'businessName', 'yearsInBusiness', 'certifications', 'authorizedBrands',
            'serviceArea', 'mobileService', 'emergencyService', 'emergencyPhone', 'priceType',
            'hourlyRate', 'minServiceFee', 'workingHours', 'website', 'whatsapp'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                if (['hourlyRate', 'minServiceFee'].includes(field)) {
                    updateData[field] = typeSpecific[field]?.toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.serviceListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.serviceListings.listing_id, listingId));
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
        if (filters.serviceType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.serviceListings.serviceType, filters.serviceType));
        }
        if (filters.mobileService === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.serviceListings.mobileService, true));
        }
        if (filters.emergencyService === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.serviceListings.emergencyService, true));
        }
        if (filters.serviceArea) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.serviceListings.serviceArea} ILIKE ${`%${filters.serviceArea}%`}`);
        }
        if (subqueryConditions.length > 0) {
            const whereClause = (0, drizzle_orm_1.and)(...subqueryConditions);
            conditions.push((0, drizzle_orm_1.sql) `EXISTS (
          SELECT 1 FROM ${schema_1.serviceListings}
          WHERE ${schema_1.serviceListings.listing_id} = ${schema_1.listings.id}
          ${whereClause ? (0, drizzle_orm_1.sql) `AND ${whereClause}` : (0, drizzle_orm_1.sql) ``}
        )`);
        }
        return conditions;
    }
    getFilterSchema() {
        return [
            {
                name: 'serviceType',
                type: 'select',
                label: 'Servis Türü',
                options: [
                    'engine_repair', 'electrical', 'plumbing', 'fiberglass',
                    'painting', 'upholstery', 'mechanical', 'installation',
                    'maintenance', 'winterization', 'detailing', 'other'
                ],
            },
            {
                name: 'mobileService',
                type: 'select',
                label: 'Mobil Hizmet',
                options: ['true', 'false'],
            },
            {
                name: 'emergencyService',
                type: 'select',
                label: 'Acil Servis',
                options: ['true', 'false'],
            },
            {
                name: 'serviceArea',
                type: 'text',
                label: 'Hizmet Bölgesi',
                placeholder: 'Şehir veya bölge ara...',
            },
        ];
    }
}
exports.ServiceListingHandler = ServiceListingHandler;
exports.default = ServiceListingHandler;
