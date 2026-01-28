import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { storageListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * StorageListingHandler
 * 
 * Handles storage-specific listing operations including validation,
 * CRUD operations for storage-specific data, and schema definition.
 * (Kara Park ve Kışlama)
 */
export class StorageListingHandler implements IListingHandler {
  readonly type = 'storage';

  private baseFields = {
    title: z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
    description: z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
    price: z.number().positive('Fiyat pozitif bir sayı olmalı'),
    currency: z.enum(['TRY', 'USD', 'EUR'], {
      errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
    }).default('TRY'),
    location: z.string().optional(),
  };

  private validationSchema = z.object({
    ...this.baseFields,
    storageType: z.enum(['dry_storage', 'wet_slip', 'covered', 'uncovered', 'indoor', 'outdoor'], {
      errorMap: () => ({ message: 'Geçersiz depolama türü' })
    }),
    facilityName: z.string().optional(),
    maxBoatLength: z.number().positive().optional(),
    maxBoatBeam: z.number().positive().optional(),
    maxBoatHeight: z.number().positive().optional(),
    maxBoatWeight: z.number().positive().optional(),
    securityFeatures: z.string().optional(), // JSON string
    hasElectricity: z.boolean().default(false),
    hasWater: z.boolean().default(false),
    hasCamera: z.boolean().default(false),
    hasGuard: z.boolean().default(false),
    hasLift: z.boolean().default(false),
    liftCapacity: z.number().positive().optional(),
    accessHours: z.string().optional(),
    gateAccess: z.boolean().default(false),
    winterizationService: z.boolean().default(false),
    maintenanceService: z.boolean().default(false),
    launchService: z.boolean().default(false),
  });

  private schema: ListingTypeSchema = {
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

  validate(data: any): ValidationResult {
    try {
      const validated = this.validationSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.errors };
      }
      throw error;
    }
  }

  getValidationSchema(): z.ZodSchema {
    return this.validationSchema;
  }

  getTypeSpecificTable(): any {
    return storageListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(storageListings).values({
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

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(storageListings)
      .where(eq(storageListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    const updateData: any = {};
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
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(storageListings)
        .set(updateData)
        .where(eq(storageListings.listing_id, listingId));
    }
  }

  async deleteTypeSpecific(db: any, listingId: string): Promise<void> {
    // Cascade delete is handled by the database foreign key constraint
  }

  getSchema(): ListingTypeSchema {
    return this.schema;
  }

  getTypeSpecificFilters(filters: any): any[] {
    const conditions: any[] = [];
    const subqueryConditions: any[] = [];

    if (filters.storageType) {
      subqueryConditions.push(eq(storageListings.storageType, filters.storageType));
    }

    if (filters.hasElectricity === 'true') {
      subqueryConditions.push(eq(storageListings.hasElectricity, true));
    }

    if (filters.hasCamera === 'true') {
      subqueryConditions.push(eq(storageListings.hasCamera, true));
    }

    if (filters.hasGuard === 'true') {
      subqueryConditions.push(eq(storageListings.hasGuard, true));
    }

    if (filters.winterizationService === 'true') {
      subqueryConditions.push(eq(storageListings.winterizationService, true));
    }

    if (subqueryConditions.length > 0) {
      const whereClause = and(...subqueryConditions);
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${storageListings}
          WHERE ${storageListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  getFilterSchema(): FilterSchema[] {
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

export default StorageListingHandler;
