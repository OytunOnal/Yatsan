import { z } from 'zod';
import { eq, sql, like, and } from 'drizzle-orm';
import { partListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * PartListingHandler
 * 
 * Handles marine parts and accessories listing operations.
 */
export class PartListingHandler implements IListingHandler {
  readonly type = 'part';

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

  // Part-specific validation schema
  private validationSchema = z.object({
    ...this.baseFields,
    condition: z.enum(['new', 'used', 'refurbished'], {
      errorMap: () => ({ message: 'Geçersiz durum değeri' })
    }),
    brand: z.string().min(1, 'Marka zorunludur'),
    oemCode: z.string().optional(),
    compatibility: z.string().optional(),
  });

  // Schema definition for frontend form generation
  private schema: ListingTypeSchema = {
    type: this.type,
    label: 'Marine Part',
    labelPlural: 'Marine Parts',
    icon: 'wrench',
    description: 'Spare parts, accessories, and equipment for boats',
    fields: [
      {
        name: 'condition',
        type: 'select',
        label: 'Condition',
        required: true,
        options: ['new', 'used', 'refurbished'],
      },
      {
        name: 'brand',
        type: 'text',
        label: 'Brand',
        required: true,
        placeholder: 'e.g. Volvo Penta, Yanmar',
      },
      {
        name: 'oemCode',
        type: 'text',
        label: 'OEM Code',
        required: false,
        placeholder: 'Original Equipment Manufacturer code',
      },
      {
        name: 'compatibility',
        type: 'json',
        label: 'Compatibility',
        required: false,
        placeholder: 'JSON array of compatible models',
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
    return partListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    // Extract base fields (handled by listings table)
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(partListings).values({
      listing_id: listingId,
      condition: typeSpecific.condition,
      brand: typeSpecific.brand,
      oemCode: typeSpecific.oemCode || null,
      compatibility: typeSpecific.compatibility || null,
      description: typeSpecific.description || null,
    });
  }

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(partListings)
      .where(eq(partListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    // Extract base fields (handled by listings table)
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    // Build update object with only provided type-specific fields
    const updateData: any = {};
    const allowedFields = ['condition', 'brand', 'oemCode', 'compatibility', 'description'];

    for (const field of allowedFields) {
      if (field in typeSpecific && typeSpecific[field] !== undefined) {
        updateData[field] = typeSpecific[field];
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(partListings)
        .set(updateData)
        .where(eq(partListings.listing_id, listingId));
    }
  }

  async deleteTypeSpecific(db: any, listingId: string): Promise<void> {
    // Cascade delete is handled by the database foreign key constraint
  }

  getSchema(): ListingTypeSchema {
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
  getTypeSpecificFilters(filters: any): any[] {
    const conditions: any[] = [];

    // Build subquery conditions
    const subqueryConditions: any[] = [];

    // Condition filter
    if (filters.condition) {
      subqueryConditions.push(eq(partListings.condition, filters.condition));
    }

    // Brand filter (case-insensitive partial match)
    if (filters.brand) {
      subqueryConditions.push(sql`LOWER(${partListings.brand}) LIKE ${`%${filters.brand.toLowerCase()}%`}`);
    }

    // OEM Code filter (exact match)
    if (filters.oemCode) {
      subqueryConditions.push(eq(partListings.oemCode, filters.oemCode));
    }

    // Compatibility JSON filter (simple contains check)
    if (filters.compatibility) {
      subqueryConditions.push(sql`${partListings.compatibility}::text ILIKE ${`%${filters.compatibility}%`}`);
    }

    // If there are any type-specific filters, wrap them in an EXISTS subquery
    if (subqueryConditions.length > 0) {
      const whereClause = subqueryConditions.length > 0 ? and(...subqueryConditions) : undefined;
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${partListings}
          WHERE ${partListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  /**
   * Get filter schema for frontend filter UI generation
   */
  getFilterSchema(): FilterSchema[] {
    return [
      {
        name: 'condition',
        type: 'select',
        label: 'Condition',
        options: ['new', 'used', 'refurbished'],
      },
      {
        name: 'brand',
        type: 'text',
        label: 'Brand',
        placeholder: 'e.g. Volvo Penta, Yanmar',
      },
      {
        name: 'oemCode',
        type: 'text',
        label: 'OEM Code',
        placeholder: 'Enter OEM code...',
      },
      {
        name: 'compatibility',
        type: 'text',
        label: 'Compatible Models',
        placeholder: 'Search compatible models...',
      },
    ];
  }
}

export default PartListingHandler;
