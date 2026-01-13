import { z } from 'zod';
import { eq, sql, and } from 'drizzle-orm';
import { marinaListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * MarinaListingHandler
 * 
 * Handles marina berth and slip rental listing operations.
 */
export class MarinaListingHandler implements IListingHandler {
  readonly type = 'marina';

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

  // Marina-specific validation schema
  private validationSchema = z.object({
    ...this.baseFields,
    priceType: z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
      errorMap: () => ({ message: 'Geçersiz fiyat türü' })
    }),
    maxLength: z.number().positive('Maksimum uzunluk pozitif olmalı'),
    maxBeam: z.number().positive('Maksimum genişlik pozitif olmalı'),
    maxDraft: z.number().positive().optional(),
    services: z.string().min(1, 'Hizmetler bilgisi zorunludur'),
    availability: z.string().optional(),
  });

  // Schema definition for frontend form generation
  private schema: ListingTypeSchema = {
    type: this.type,
    label: 'Marina Berth',
    labelPlural: 'Marina Berths',
    icon: 'anchor',
    description: 'Berth and slip rentals at marinas',
    fields: [
      {
        name: 'priceType',
        type: 'select',
        label: 'Price Type',
        required: true,
        options: ['daily', 'weekly', 'monthly', 'yearly'],
      },
      {
        name: 'maxLength',
        type: 'number',
        label: 'Max Length (m)',
        required: true,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 20.0',
      },
      {
        name: 'maxBeam',
        type: 'number',
        label: 'Max Beam (m)',
        required: true,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 6.0',
      },
      {
        name: 'maxDraft',
        type: 'number',
        label: 'Max Draft (m)',
        required: false,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 3.0',
      },
      {
        name: 'services',
        type: 'json',
        label: 'Services',
        required: true,
        placeholder: 'JSON array of available services (water, electricity, wifi, etc.)',
      },
      {
        name: 'availability',
        type: 'json',
        label: 'Availability',
        required: false,
        placeholder: 'JSON object with availability calendar',
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
    return marinaListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    // Extract base fields (handled by listings table)
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(marinaListings).values({
      listing_id: listingId,
      priceType: typeSpecific.priceType,
      maxLength: typeSpecific.maxLength.toString(),
      maxBeam: typeSpecific.maxBeam.toString(),
      maxDraft: typeSpecific.maxDraft?.toString() || null,
      services: typeSpecific.services,
      availability: typeSpecific.availability || null,
    });
  }

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(marinaListings)
      .where(eq(marinaListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    // Extract base fields (handled by listings table)
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    // Build update object with only provided type-specific fields
    const updateData: any = {};
    const allowedFields = ['priceType', 'maxLength', 'maxBeam', 'maxDraft', 'services', 'availability'];

    for (const field of allowedFields) {
      if (field in typeSpecific && typeSpecific[field] !== undefined) {
        // Convert numeric fields to string for decimal columns
        if (['maxLength', 'maxBeam', 'maxDraft'].includes(field)) {
          updateData[field] = typeSpecific[field].toString();
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(marinaListings)
        .set(updateData)
        .where(eq(marinaListings.listing_id, listingId));
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

    // Price type filter
    if (filters.priceType) {
      subqueryConditions.push(eq(marinaListings.priceType, filters.priceType));
    }

    // Max length filter (stored as decimal string)
    if (filters.maxLength) {
      subqueryConditions.push(sql`CAST(${marinaListings.maxLength} AS NUMERIC) >= ${parseFloat(filters.maxLength)}`);
    }

    // Max beam filter (stored as decimal string)
    if (filters.maxBeam) {
      subqueryConditions.push(sql`CAST(${marinaListings.maxBeam} AS NUMERIC) >= ${parseFloat(filters.maxBeam)}`);
    }

    // Max draft filter (stored as decimal string)
    if (filters.maxDraft) {
      subqueryConditions.push(sql`CAST(${marinaListings.maxDraft} AS NUMERIC) >= ${parseFloat(filters.maxDraft)}`);
    }

    // Services JSON filter (simple contains check)
    if (filters.services) {
      subqueryConditions.push(sql`${marinaListings.services}::text ILIKE ${`%${filters.services}%`}`);
    }

    // If there are any type-specific filters, wrap them in an EXISTS subquery
    if (subqueryConditions.length > 0) {
      const whereClause = subqueryConditions.length > 0 ? and(...subqueryConditions) : undefined;
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${marinaListings}
          WHERE ${marinaListings.listing_id} = ${listings.id}
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
        name: 'priceType',
        type: 'select',
        label: 'Price Type',
        options: ['daily', 'weekly', 'monthly', 'yearly'],
      },
      {
        name: 'maxLength',
        type: 'number',
        label: 'Min Max Length (m)',
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 15.0',
      },
      {
        name: 'maxBeam',
        type: 'number',
        label: 'Min Max Beam (m)',
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 5.0',
      },
      {
        name: 'maxDraft',
        type: 'number',
        label: 'Min Max Draft (m)',
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 2.5',
      },
      {
        name: 'services',
        type: 'text',
        label: 'Services',
        placeholder: 'Search services (water, electricity, wifi)...',
      },
    ];
  }
}

export default MarinaListingHandler;
