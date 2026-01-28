"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * InsuranceListingHandler
 *
 * Handles insurance-specific listing operations including validation,
 * CRUD operations for insurance-specific data, and schema definition.
 * (Sigorta)
 */
class InsuranceListingHandler {
    constructor() {
        this.type = 'insurance';
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
            companyName: zod_1.z.string().min(1, 'Şirket adı gereklidir'),
            agencyName: zod_1.z.string().optional(),
            licenseNumber: zod_1.z.string().optional(),
            insuranceType: zod_1.z.enum(['hull', 'liability', 'comprehensive', 'personal_accident', 'cargo'], {
                errorMap: () => ({ message: 'Geçersiz sigorta türü' })
            }),
            coverageTypes: zod_1.z.string().optional(), // JSON string
            minBoatLength: zod_1.z.number().positive().optional(),
            maxBoatLength: zod_1.z.number().positive().optional(),
            minBoatValue: zod_1.z.number().positive().optional(),
            maxBoatValue: zod_1.z.number().positive().optional(),
            boatAgeLimit: zod_1.z.number().int().min(0).optional(),
            coverageArea: zod_1.z.string().optional(),
            premiumCalculation: zod_1.z.string().optional(),
            minPremium: zod_1.z.number().positive().optional(),
            premiumPercentage: zod_1.z.number().positive().optional(),
            hullCoverage: zod_1.z.boolean().default(false),
            liabilityCoverage: zod_1.z.boolean().default(false),
            salvageCoverage: zod_1.z.boolean().default(false),
            personalAccident: zod_1.z.boolean().default(false),
            legalProtection: zod_1.z.boolean().default(false),
            contactPerson: zod_1.z.string().optional(),
            contactPhone: zod_1.z.string().optional(),
            contactEmail: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
            website: zod_1.z.string().optional(),
        });
        this.schema = {
            type: this.type,
            label: 'Sigorta',
            labelPlural: 'Sigorta',
            icon: 'shield',
            description: 'Tekne sigortası hizmetleri',
            fields: [
                {
                    name: 'companyName',
                    type: 'text',
                    label: 'Şirket Adı',
                    required: true,
                },
                {
                    name: 'agencyName',
                    type: 'text',
                    label: 'Acente Adı',
                    required: false,
                },
                {
                    name: 'licenseNumber',
                    type: 'text',
                    label: 'Lisans Numarası',
                    required: false,
                },
                {
                    name: 'insuranceType',
                    type: 'select',
                    label: 'Sigorta Türü',
                    required: true,
                    options: ['hull', 'liability', 'comprehensive', 'personal_accident', 'cargo'],
                },
                {
                    name: 'coverageTypes',
                    type: 'json',
                    label: 'Kapsam Türleri',
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
                    name: 'minBoatValue',
                    type: 'number',
                    label: 'Min Tekne Değeri',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'maxBoatValue',
                    type: 'number',
                    label: 'Max Tekne Değeri',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'boatAgeLimit',
                    type: 'number',
                    label: 'Tekne Yaş Sınırı (yıl)',
                    required: false,
                    min: 0,
                },
                {
                    name: 'coverageArea',
                    type: 'text',
                    label: 'Kapsam Alanı',
                    required: false,
                },
                {
                    name: 'premiumCalculation',
                    type: 'text',
                    label: 'Prim Hesaplama',
                    required: false,
                },
                {
                    name: 'minPremium',
                    type: 'number',
                    label: 'Min Prim',
                    required: false,
                    min: 0,
                    step: 0.01,
                },
                {
                    name: 'premiumPercentage',
                    type: 'number',
                    label: 'Prim Yüzdesi (%)',
                    required: false,
                    min: 0,
                    max: 100,
                    step: 0.01,
                },
                {
                    name: 'hullCoverage',
                    type: 'select',
                    label: 'Gemi Gövdesi Teminatı',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'liabilityCoverage',
                    type: 'select',
                    label: 'Sorumluluk Teminatı',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'salvageCoverage',
                    type: 'select',
                    label: 'Kurtarma Teminatı',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'personalAccident',
                    type: 'select',
                    label: 'Kişisel Kaza Teminatı',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'legalProtection',
                    type: 'select',
                    label: 'Yasal Koruma',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'contactPerson',
                    type: 'text',
                    label: 'İletişim Kişisi',
                    required: false,
                },
                {
                    name: 'contactPhone',
                    type: 'text',
                    label: 'İletişim Telefonu',
                    required: false,
                },
                {
                    name: 'contactEmail',
                    type: 'text',
                    label: 'İletişim E-posta',
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
        return schema_1.insuranceListings;
    }
    async createTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.insuranceListings).values({
            listing_id: listingId,
            companyName: typeSpecific.companyName,
            agencyName: typeSpecific.agencyName || null,
            licenseNumber: typeSpecific.licenseNumber || null,
            insuranceType: typeSpecific.insuranceType,
            coverageTypes: typeSpecific.coverageTypes || null,
            minBoatLength: typeSpecific.minBoatLength?.toString() || null,
            maxBoatLength: typeSpecific.maxBoatLength?.toString() || null,
            minBoatValue: typeSpecific.minBoatValue?.toString() || null,
            maxBoatValue: typeSpecific.maxBoatValue?.toString() || null,
            boatAgeLimit: typeSpecific.boatAgeLimit || null,
            coverageArea: typeSpecific.coverageArea || null,
            premiumCalculation: typeSpecific.premiumCalculation || null,
            minPremium: typeSpecific.minPremium?.toString() || null,
            premiumPercentage: typeSpecific.premiumPercentage?.toString() || null,
            hullCoverage: typeSpecific.hullCoverage ?? false,
            liabilityCoverage: typeSpecific.liabilityCoverage ?? false,
            salvageCoverage: typeSpecific.salvageCoverage ?? false,
            personalAccident: typeSpecific.personalAccident ?? false,
            legalProtection: typeSpecific.legalProtection ?? false,
            contactPerson: typeSpecific.contactPerson || null,
            contactPhone: typeSpecific.contactPhone || null,
            contactEmail: typeSpecific.contactEmail || null,
            website: typeSpecific.website || null,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.insuranceListings)
            .where((0, drizzle_orm_1.eq)(schema_1.insuranceListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        const updateData = {};
        const allowedFields = [
            'companyName', 'agencyName', 'licenseNumber', 'insuranceType', 'coverageTypes',
            'minBoatLength', 'maxBoatLength', 'minBoatValue', 'maxBoatValue', 'boatAgeLimit',
            'coverageArea', 'premiumCalculation', 'minPremium', 'premiumPercentage',
            'hullCoverage', 'liabilityCoverage', 'salvageCoverage', 'personalAccident',
            'legalProtection', 'contactPerson', 'contactPhone', 'contactEmail', 'website'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                if (['minBoatLength', 'maxBoatLength', 'minBoatValue', 'maxBoatValue', 'minPremium', 'premiumPercentage'].includes(field)) {
                    updateData[field] = typeSpecific[field]?.toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.insuranceListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.insuranceListings.listing_id, listingId));
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
        if (filters.insuranceType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.insuranceListings.insuranceType, filters.insuranceType));
        }
        if (filters.companyName) {
            subqueryConditions.push((0, drizzle_orm_1.sql) `${schema_1.insuranceListings.companyName} ILIKE ${`%${filters.companyName}%`}`);
        }
        if (filters.hullCoverage === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.insuranceListings.hullCoverage, true));
        }
        if (filters.liabilityCoverage === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.insuranceListings.liabilityCoverage, true));
        }
        if (subqueryConditions.length > 0) {
            const whereClause = (0, drizzle_orm_1.and)(...subqueryConditions);
            conditions.push((0, drizzle_orm_1.sql) `EXISTS (
          SELECT 1 FROM ${schema_1.insuranceListings}
          WHERE ${schema_1.insuranceListings.listing_id} = ${schema_1.listings.id}
          ${whereClause ? (0, drizzle_orm_1.sql) `AND ${whereClause}` : (0, drizzle_orm_1.sql) ``}
        )`);
        }
        return conditions;
    }
    getFilterSchema() {
        return [
            {
                name: 'insuranceType',
                type: 'select',
                label: 'Sigorta Türü',
                options: ['hull', 'liability', 'comprehensive', 'personal_accident', 'cargo'],
            },
            {
                name: 'companyName',
                type: 'text',
                label: 'Şirket Adı',
                placeholder: 'Şirket ara...',
            },
            {
                name: 'hullCoverage',
                type: 'select',
                label: 'Gemi Gövdesi Teminatı',
                options: ['true', 'false'],
            },
            {
                name: 'liabilityCoverage',
                type: 'select',
                label: 'Sorumluluk Teminatı',
                options: ['true', 'false'],
            },
        ];
    }
}
exports.InsuranceListingHandler = InsuranceListingHandler;
exports.default = InsuranceListingHandler;
