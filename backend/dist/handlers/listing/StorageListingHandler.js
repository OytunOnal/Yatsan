"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageListingHandler = void 0;
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
/**
 * StorageListingHandler
 *
 * Handles storage-specific listing operations including validation,
 * CRUD operations for storage-specific data, and schema definition.
 * (Kara Park ve Kışlama)
 */
class StorageListingHandler {
    constructor() {
        this.type = 'storage';
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
            storageType: zod_1.z.enum(['dry_storage', 'wet_slip', 'covered', 'uncovered', 'indoor', 'outdoor'], {
                errorMap: () => ({ message: 'Geçersiz depolama türü' })
            }),
            facilityName: zod_1.z.string().optional(),
            maxBoatLength: zod_1.z.number().positive().optional(),
            maxBoatBeam: zod_1.z.number().positive().optional(),
            maxBoatHeight: zod_1.z.number().positive().optional(),
            maxBoatWeight: zod_1.z.number().positive().optional(),
            securityFeatures: zod_1.z.string().optional(), // JSON string
            hasElectricity: zod_1.z.boolean().default(false),
            hasWater: zod_1.z.boolean().default(false),
            hasCamera: zod_1.z.boolean().default(false),
            hasGuard: zod_1.z.boolean().default(false),
            hasLift: zod_1.z.boolean().default(false),
            liftCapacity: zod_1.z.number().positive().optional(),
            accessHours: zod_1.z.string().optional(),
            gateAccess: zod_1.z.boolean().default(false),
            winterizationService: zod_1.z.boolean().default(false),
            maintenanceService: zod_1.z.boolean().default(false),
            launchService: zod_1.z.boolean().default(false),
        });
        this.schema = {
            type: this.type,
            label: 'Kara Park / Kışlama',
            labelPlural: 'Kara Park / Kışlama',
            icon: 'warehouse',
            description: 'Tekne depolama ve kışlama hizmetleri',
            fields: [
                {
                    name: 'storageType',
                    type: 'select',
                    label: 'Depolama Türü',
                    required: true,
                    options: ['dry_storage', 'wet_slip', 'covered', 'uncovered', 'indoor', 'outdoor'],
                },
                {
                    name: 'facilityName',
                    type: 'text',
                    label: 'Tesis Adı',
                    required: false,
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
                    name: 'maxBoatBeam',
                    type: 'number',
                    label: 'Max Tekne Genişliği (m)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'maxBoatHeight',
                    type: 'number',
                    label: 'Max Tekne Yüksekliği (m)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'maxBoatWeight',
                    type: 'number',
                    label: 'Max Tekne Ağırlığı (ton)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'securityFeatures',
                    type: 'json',
                    label: 'Güvenlik Özellikleri',
                    required: false,
                },
                {
                    name: 'hasElectricity',
                    type: 'select',
                    label: 'Elektrik',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'hasWater',
                    type: 'select',
                    label: 'Su',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'hasCamera',
                    type: 'select',
                    label: 'Kamera',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'hasGuard',
                    type: 'select',
                    label: 'Güvenlik',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'hasLift',
                    type: 'select',
                    label: 'Vinç',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'liftCapacity',
                    type: 'number',
                    label: 'Vinç Kapasitesi (ton)',
                    required: false,
                    min: 0,
                    step: 0.1,
                },
                {
                    name: 'accessHours',
                    type: 'text',
                    label: 'Erişim Saatleri',
                    required: false,
                },
                {
                    name: 'gateAccess',
                    type: 'select',
                    label: 'Kapı Erişimi',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'winterizationService',
                    type: 'select',
                    label: 'Kışlama Hizmeti',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'maintenanceService',
                    type: 'select',
                    label: 'Bakım Hizmeti',
                    required: false,
                    options: ['true', 'false'],
                },
                {
                    name: 'launchService',
                    type: 'select',
                    label: 'Denize İndirme Hizmeti',
                    required: false,
                    options: ['true', 'false'],
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
        return schema_1.storageListings;
    }
    async createTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, ...typeSpecific } = data;
        await db.insert(schema_1.storageListings).values({
            listing_id: listingId,
            storageType: typeSpecific.storageType,
            facilityName: typeSpecific.facilityName || null,
            maxBoatLength: typeSpecific.maxBoatLength?.toString() || null,
            maxBoatBeam: typeSpecific.maxBoatBeam?.toString() || null,
            maxBoatHeight: typeSpecific.maxBoatHeight?.toString() || null,
            maxBoatWeight: typeSpecific.maxBoatWeight?.toString() || null,
            securityFeatures: typeSpecific.securityFeatures || null,
            hasElectricity: typeSpecific.hasElectricity ?? false,
            hasWater: typeSpecific.hasWater ?? false,
            hasCamera: typeSpecific.hasCamera ?? false,
            hasGuard: typeSpecific.hasGuard ?? false,
            hasLift: typeSpecific.hasLift ?? false,
            liftCapacity: typeSpecific.liftCapacity?.toString() || null,
            accessHours: typeSpecific.accessHours || null,
            gateAccess: typeSpecific.gateAccess ?? false,
            winterizationService: typeSpecific.winterizationService ?? false,
            maintenanceService: typeSpecific.maintenanceService ?? false,
            launchService: typeSpecific.launchService ?? false,
        });
    }
    async getTypeSpecific(db, listingId) {
        const result = await db
            .select()
            .from(schema_1.storageListings)
            .where((0, drizzle_orm_1.eq)(schema_1.storageListings.listing_id, listingId))
            .limit(1);
        return result[0] || null;
    }
    async updateTypeSpecific(db, listingId, data) {
        const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;
        const updateData = {};
        const allowedFields = [
            'storageType', 'facilityName', 'maxBoatLength', 'maxBoatBeam', 'maxBoatHeight',
            'maxBoatWeight', 'securityFeatures', 'hasElectricity', 'hasWater', 'hasCamera',
            'hasGuard', 'hasLift', 'liftCapacity', 'accessHours', 'gateAccess',
            'winterizationService', 'maintenanceService', 'launchService'
        ];
        for (const field of allowedFields) {
            if (field in typeSpecific && typeSpecific[field] !== undefined) {
                if (['maxBoatLength', 'maxBoatBeam', 'maxBoatHeight', 'maxBoatWeight', 'liftCapacity'].includes(field)) {
                    updateData[field] = typeSpecific[field]?.toString();
                }
                else {
                    updateData[field] = typeSpecific[field];
                }
            }
        }
        if (Object.keys(updateData).length > 0) {
            await db
                .update(schema_1.storageListings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema_1.storageListings.listing_id, listingId));
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
        if (filters.storageType) {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.storageListings.storageType, filters.storageType));
        }
        if (filters.hasElectricity === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.storageListings.hasElectricity, true));
        }
        if (filters.hasCamera === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.storageListings.hasCamera, true));
        }
        if (filters.hasGuard === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.storageListings.hasGuard, true));
        }
        if (filters.winterizationService === 'true') {
            subqueryConditions.push((0, drizzle_orm_1.eq)(schema_1.storageListings.winterizationService, true));
        }
        if (subqueryConditions.length > 0) {
            const whereClause = (0, drizzle_orm_1.and)(...subqueryConditions);
            conditions.push((0, drizzle_orm_1.sql) `EXISTS (
          SELECT 1 FROM ${schema_1.storageListings}
          WHERE ${schema_1.storageListings.listing_id} = ${schema_1.listings.id}
          ${whereClause ? (0, drizzle_orm_1.sql) `AND ${whereClause}` : (0, drizzle_orm_1.sql) ``}
        )`);
        }
        return conditions;
    }
    getFilterSchema() {
        return [
            {
                name: 'storageType',
                type: 'select',
                label: 'Depolama Türü',
                options: ['dry_storage', 'wet_slip', 'covered', 'uncovered', 'indoor', 'outdoor'],
            },
            {
                name: 'hasElectricity',
                type: 'select',
                label: 'Elektrik',
                options: ['true', 'false'],
            },
            {
                name: 'hasCamera',
                type: 'select',
                label: 'Kamera',
                options: ['true', 'false'],
            },
            {
                name: 'hasGuard',
                type: 'select',
                label: 'Güvenlik',
                options: ['true', 'false'],
            },
            {
                name: 'winterizationService',
                type: 'select',
                label: 'Kışlama Hizmeti',
                options: ['true', 'false'],
            },
        ];
    }
}
exports.StorageListingHandler = StorageListingHandler;
exports.default = StorageListingHandler;
