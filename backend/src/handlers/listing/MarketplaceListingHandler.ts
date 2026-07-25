import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { marketplaceListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * MarketplaceListingHandler
 * 
 * Handles marketplace-specific listing operations including validation,
 * CRUD operations for marketplace-specific data, and schema definition.
 * (İkinci El Pazarı)
 */
export class MarketplaceListingHandler implements IListingHandler {
  readonly type = 'marketplace';

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
    itemType: z.string().min(1, 'Ürün türü seçilmeli'),
    brand: z.string().optional(),
    model: z.string().optional(),
    condition: z.enum(['new', 'excellent', 'good', 'fair', 'poor'], {
      errorMap: () => ({ message: 'Geçersiz durum değeri' })
    }),
    yearPurchased: z.number().int().min(1970).max(new Date().getFullYear() + 1).optional(),
    usageFrequency: z.string().optional(),
    originalPrice: z.number().positive().optional(),
    reasonForSelling: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.number().positive().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    includesOriginalBox: z.boolean().default(false),
    includesManual: z.boolean().default(true),
    includesAccessories: z.boolean().default(false),
    accessoriesDescription: z.string().optional(),
    negotiable: z.boolean().default(true),
    acceptTrade: z.boolean().default(false),
    tradeInterests: z.string().optional(),
  });

  private schema: ListingTypeSchema = {
    type: this.type,
    label: 'İkinci El Pazarı',
    labelPlural: 'İkinci El Pazarı',
    icon: 'shopping-bag',
    description: 'İkinci el denizcilik ürünleri ve ekipmanları',
    fields: [
      {
        name: 'itemType',
        type: 'select',
        label: 'Ürün Türü',
        required: true,
        options: [
          'clothing', 'safety_gear', 'fishing_equipment', 'water_sports',
          'electronics', 'tools', 'furniture', 'appliances',
          'parts', 'accessories', 'books', 'other'
        ],
      },
      {
        name: 'brand',
        type: 'text',
        label: 'Marka',
        required: false,
      },
      {
        name: 'model',
        type: 'text',
        label: 'Model',
        required: false,
      },
      {
        name: 'condition',
        type: 'select',
        label: 'Durum',
        required: true,
        options: ['new', 'excellent', 'good', 'fair', 'poor'],
      },
      {
        name: 'yearPurchased',
        type: 'number',
        label: 'Satın Alma Yılı',
        required: false,
        min: 1970,
        max: new Date().getFullYear() + 1,
      },
      {
        name: 'usageFrequency',
        type: 'select',
        label: 'Kullanım Sıklığı',
        required: false,
        options: ['never', 'rarely', 'occasionally', 'regularly', 'frequently'],
      },
      {
        name: 'originalPrice',
        type: 'number',
        label: 'Orijinal Fiyat',
        required: false,
        min: 0,
        step: 0.01,
      },
      {
        name: 'reasonForSelling',
        type: 'textarea',
        label: 'Satış Nedeni',
        required: false,
      },
      {
        name: 'dimensions',
        type: 'text',
        label: 'Boyutlar',
        required: false,
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
        name: 'color',
        type: 'text',
        label: 'Renk',
        required: false,
      },
      {
        name: 'material',
        type: 'text',
        label: 'Malzeme',
        required: false,
      },
      {
        name: 'includesOriginalBox',
        type: 'select',
        label: 'Orijinal Kutu Dahil',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'includesManual',
        type: 'select',
        label: 'Kullanım Kılavuzu Dahil',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'includesAccessories',
        type: 'select',
        label: 'Aksesuarlar Dahil',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'accessoriesDescription',
        type: 'textarea',
        label: 'Aksesuar Açıklaması',
        required: false,
      },
      {
        name: 'negotiable',
        type: 'select',
        label: 'Pazarlık İmkânı',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'acceptTrade',
        type: 'select',
        label: 'Takas Kabul',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'tradeInterests',
        type: 'text',
        label: 'Takas İlgileri',
        required: false,
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
    return marketplaceListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(marketplaceListings).values({
      listing_id: listingId,
      itemType: typeSpecific.itemType,
      brand: typeSpecific.brand || null,
      model: typeSpecific.model || null,
      condition: typeSpecific.condition,
      yearPurchased: typeSpecific.yearPurchased || null,
      usageFrequency: typeSpecific.usageFrequency || null,
      originalPrice: typeSpecific.originalPrice?.toString() || null,
      reasonForSelling: typeSpecific.reasonForSelling || null,
      dimensions: typeSpecific.dimensions || null,
      weight: typeSpecific.weight?.toString() || null,
      color: typeSpecific.color || null,
      material: typeSpecific.material || null,
      includesOriginalBox: typeSpecific.includesOriginalBox ?? false,
      includesManual: typeSpecific.includesManual ?? true,
      includesAccessories: typeSpecific.includesAccessories ?? false,
      accessoriesDescription: typeSpecific.accessoriesDescription || null,
      negotiable: typeSpecific.negotiable ?? true,
      acceptTrade: typeSpecific.acceptTrade ?? false,
      tradeInterests: typeSpecific.tradeInterests || null,
    });
  }

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(marketplaceListings)
      .where(eq(marketplaceListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    const updateData: any = {};
    const allowedFields = [
      'itemType', 'brand', 'model', 'condition', 'yearPurchased', 'usageFrequency',
      'originalPrice', 'reasonForSelling', 'dimensions', 'weight', 'color', 'material',
      'includesOriginalBox', 'includesManual', 'includesAccessories', 'accessoriesDescription',
      'negotiable', 'acceptTrade', 'tradeInterests'
    ];

    for (const field of allowedFields) {
      if (field in typeSpecific && typeSpecific[field] !== undefined) {
        if (['originalPrice', 'weight'].includes(field)) {
          updateData[field] = typeSpecific[field]?.toString();
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(marketplaceListings)
        .set(updateData)
        .where(eq(marketplaceListings.listing_id, listingId));
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

    if (filters.itemType) {
      subqueryConditions.push(eq(marketplaceListings.itemType, filters.itemType));
    }

    if (filters.brand) {
      subqueryConditions.push(sql`${marketplaceListings.brand} ILIKE ${`%${filters.brand}%`}`);
    }

    if (filters.condition) {
      subqueryConditions.push(eq(marketplaceListings.condition, filters.condition));
    }

    if (filters.negotiable === 'true') {
      subqueryConditions.push(eq(marketplaceListings.negotiable, true));
    }

    if (filters.acceptTrade === 'true') {
      subqueryConditions.push(eq(marketplaceListings.acceptTrade, true));
    }

    if (subqueryConditions.length > 0) {
      const whereClause = and(...subqueryConditions);
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${marketplaceListings}
          WHERE ${marketplaceListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  getFilterSchema(): FilterSchema[] {
    return [
      {
        name: 'itemType',
        type: 'select',
        label: 'Ürün Türü',
        options: [
          'clothing', 'safety_gear', 'fishing_equipment', 'water_sports',
          'electronics', 'tools', 'furniture', 'appliances',
          'parts', 'accessories', 'books', 'other'
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
        name: 'negotiable',
        type: 'select',
        label: 'Pazarlık İmkânı',
        options: ['true', 'false'],
      },
      {
        name: 'acceptTrade',
        type: 'select',
        label: 'Takas Kabul',
        options: ['true', 'false'],
      },
    ];
  }
}

export default MarketplaceListingHandler;
