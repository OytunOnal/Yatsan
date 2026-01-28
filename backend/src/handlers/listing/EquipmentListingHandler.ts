import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { equipmentListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * EquipmentListingHandler
 * 
 * Handles equipment-specific listing operations including validation,
 * CRUD operations for equipment-specific data, and schema definition.
 * (Deniz Aracı Ekipmanları)
 */
export class EquipmentListingHandler implements IListingHandler {
  readonly type = 'equipment';

  // Base fields shared by all listing types
  private baseFields = {
    title: z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
    description: z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
    price: z.number().positive('Fiyat pozitif bir sayı olmalı'),
    currency: z.enum(['TRY', 'USD', 'EUR'], {
      errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
    }).default('TRY'),
    location: z.string().optional(),
  };

  // Equipment-specific validation schema
  private validationSchema = z.object({
    ...this.baseFields,
    equipmentType: z.string().min(1, 'Ekipman türü seçilmeli'),
    brand: z.string().optional(),
    model: z.string().optional(),
    condition: z.enum(['new', 'excellent', 'good', 'fair', 'poor'], {
      errorMap: () => ({ message: 'Geçersiz durum değeri' })
    }),
    yearOfManufacture: z.number().int().min(1970).max(new Date().getFullYear() + 1).optional(),
    warrantyMonths: z.number().int().min(0).optional(),
    powerConsumption: z.number().positive().optional(),
    voltage: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.number().positive().optional(),
    compatibleBoatTypes: z.string().optional(), // JSON string
    compatibleBoatLengths: z.string().optional(), // JSON string
    installationRequired: z.boolean().default(false),
    manualIncluded: z.boolean().default(true),
  });

  // Schema definition for frontend form generation
  private schema: ListingTypeSchema = {
    type: this.type,
    label: 'Ekipman',
    labelPlural: 'Ekipmanlar',
    icon: 'tool',
    description: 'Deniz aracı ekipmanları - elektronik, navigasyon, güvenlik vb.',
    fields: [
      {
        name: 'equipmentType',
        type: 'select',
        label: 'Ekipman Türü',
        required: true,
        options: [
          'navigation', 'communication', 'safety', 'anchoring', 
          'electrical', 'plumbing', 'deck_hardware', 'lighting',
          'ventilation', 'refrigeration', 'entertainment', 'fishing',
          'water_sports', 'cleaning', 'other'
        ],
        placeholder: 'Ekipman türü seçin',
      },
      {
        name: 'brand',
        type: 'text',
        label: 'Marka',
        required: false,
        placeholder: 'ör. Garmin, Raymarine',
      },
      {
        name: 'model',
        type: 'text',
        label: 'Model',
        required: false,
        placeholder: 'ör. GPSMap 1242xsv',
      },
      {
        name: 'condition',
        type: 'select',
        label: 'Durum',
        required: true,
        options: ['new', 'excellent', 'good', 'fair', 'poor'],
      },
      {
        name: 'yearOfManufacture',
        type: 'number',
        label: 'Üretim Yılı',
        required: false,
        min: 1970,
        max: new Date().getFullYear() + 1,
      },
      {
        name: 'warrantyMonths',
        type: 'number',
        label: 'Garanti (ay)',
        required: false,
        min: 0,
      },
      {
        name: 'powerConsumption',
        type: 'number',
        label: 'Güç Tüketimi (W)',
        required: false,
        min: 0,
        step: 0.1,
      },
      {
        name: 'voltage',
        type: 'select',
        label: 'Voltaj',
        required: false,
        options: ['12V', '24V', '110V', '220V', '12V/24V'],
      },
      {
        name: 'dimensions',
        type: 'text',
        label: 'Boyutlar',
        required: false,
        placeholder: 'ör. 30x20x10 cm',
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
        name: 'compatibleBoatTypes',
        type: 'json',
        label: 'Uyumlu Tekne Türleri',
        required: false,
        placeholder: 'JSON array',
      },
      {
        name: 'compatibleBoatLengths',
        type: 'text',
        label: 'Uyumlu Tekne Boyutları',
        required: false,
        placeholder: 'ör. 8-15 metre',
      },
      {
        name: 'installationRequired',
        type: 'select',
        label: 'Kurulum Gerekli',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'manualIncluded',
        type: 'select',
        label: 'Kullanım Kılavuzu Dahil',
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
    return equipmentListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(equipmentListings).values({
      listing_id: listingId,
      equipmentType: typeSpecific.equipmentType,
      brand: typeSpecific.brand || null,
      model: typeSpecific.model || null,
      condition: typeSpecific.condition,
      yearOfManufacture: typeSpecific.yearOfManufacture || null,
      warrantyMonths: typeSpecific.warrantyMonths || null,
      powerConsumption: typeSpecific.powerConsumption?.toString() || null,
      voltage: typeSpecific.voltage || null,
      dimensions: typeSpecific.dimensions || null,
      weight: typeSpecific.weight?.toString() || null,
      compatibleBoatTypes: typeSpecific.compatibleBoatTypes || null,
      compatibleBoatLengths: typeSpecific.compatibleBoatLengths || null,
      installationRequired: typeSpecific.installationRequired ?? false,
      manualIncluded: typeSpecific.manualIncluded ?? true,
    });
  }

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(equipmentListings)
      .where(eq(equipmentListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    const updateData: any = {};
    const allowedFields = [
      'equipmentType', 'brand', 'model', 'condition', 'yearOfManufacture',
      'warrantyMonths', 'powerConsumption', 'voltage', 'dimensions', 'weight',
      'compatibleBoatTypes', 'compatibleBoatLengths', 'installationRequired', 'manualIncluded'
    ];

    for (const field of allowedFields) {
      if (field in typeSpecific && typeSpecific[field] !== undefined) {
        if (['powerConsumption', 'weight'].includes(field)) {
          updateData[field] = typeSpecific[field]?.toString();
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(equipmentListings)
        .set(updateData)
        .where(eq(equipmentListings.listing_id, listingId));
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

    if (filters.equipmentType) {
      subqueryConditions.push(eq(equipmentListings.equipmentType, filters.equipmentType));
    }

    if (filters.brand) {
      subqueryConditions.push(sql`${equipmentListings.brand} ILIKE ${`%${filters.brand}%`}`);
    }

    if (filters.condition) {
      subqueryConditions.push(eq(equipmentListings.condition, filters.condition));
    }

    if (filters.voltage) {
      subqueryConditions.push(eq(equipmentListings.voltage, filters.voltage));
    }

    if (filters.hasWarranty === 'true') {
      subqueryConditions.push(sql`${equipmentListings.warrantyMonths} > 0`);
    }

    if (subqueryConditions.length > 0) {
      const whereClause = and(...subqueryConditions);
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${equipmentListings}
          WHERE ${equipmentListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  getFilterSchema(): FilterSchema[] {
    return [
      {
        name: 'equipmentType',
        type: 'select',
        label: 'Ekipman Türü',
        options: [
          'navigation', 'communication', 'safety', 'anchoring', 
          'electrical', 'plumbing', 'deck_hardware', 'lighting',
          'ventilation', 'refrigeration', 'entertainment', 'fishing',
          'water_sports', 'cleaning', 'other'
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
        name: 'voltage',
        type: 'select',
        label: 'Voltaj',
        options: ['12V', '24V', '110V', '220V', '12V/24V'],
      },
      {
        name: 'hasWarranty',
        type: 'select',
        label: 'Garanti',
        options: ['true', 'false'],
      },
    ];
  }
}

export default EquipmentListingHandler;
