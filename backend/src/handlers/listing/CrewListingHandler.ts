import { z } from 'zod';
import { eq, sql, gte, lte, and } from 'drizzle-orm';
import { crewListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * CrewListingHandler
 * 
 * Handles crew and job position listing operations.
 */
export class CrewListingHandler implements IListingHandler {
  readonly type = 'crew';

  // Base fields shared by all listing types (price is optional for crew)
  private baseFields = {
    title: z.string().min(3, 'Başlık en az 3 karakter olmalı').max(200, 'Başlık en fazla 200 karakter olabilir'),
    description: z.string().max(5000, 'Açıklama en fazla 5000 karakter olabilir').optional(),
    price: z.number().positive().optional(),
    currency: z.enum(['TRY', 'USD', 'EUR'], {
      errorMap: () => ({ message: 'Para birimi TRY, USD veya EUR olmalı' })
    }).default('USD'),
    location: z.string().optional(),
  };

  // Crew-specific validation schema
  private validationSchema = z.object({
    ...this.baseFields,
    position: z.enum(['captain', 'chef', 'deckhand', 'engineer', 'stewardess'], {
      errorMap: () => ({ message: 'Geçersiz pozisyon' })
    }),
    experience: z.number().int().min(0).max(50, 'Deneyim 0-50 yıl arasında olmalı'),
    certifications: z.string().optional(),
    availability: z.enum(['immediate', 'flexible', 'specific_dates'], {
      errorMap: () => ({ message: 'Geçersiz müsaitlik türü' })
    }),
    availableFrom: z.string().datetime().optional(),
    availableTo: z.string().datetime().optional(),
    salary: z.number().positive().optional(),
    salaryCurrency: z.string().default('USD'),
    salaryPeriod: z.enum(['monthly', 'weekly', 'daily', 'per_trip']).optional(),
  });

  // Schema definition for frontend form generation
  private schema: ListingTypeSchema = {
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
    return crewListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    // Extract base fields (handled by listings table)
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(crewListings).values({
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

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(crewListings)
      .where(eq(crewListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    // Extract base fields (handled by listings table)
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    // Build update object with only provided type-specific fields
    const updateData: any = {};
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
        .update(crewListings)
        .set(updateData)
        .where(eq(crewListings.listing_id, listingId));
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

    // Position filter
    if (filters.position) {
      subqueryConditions.push(eq(crewListings.position, filters.position));
    }

    // Experience range filters
    if (filters.minExperience) {
      subqueryConditions.push(sql`${crewListings.experience} >= ${parseInt(filters.minExperience)}`);
    }
    if (filters.maxExperience) {
      subqueryConditions.push(sql`${crewListings.experience} <= ${parseInt(filters.maxExperience)}`);
    }

    // Availability filter
    if (filters.availability) {
      subqueryConditions.push(eq(crewListings.availability, filters.availability));
    }

    // Certifications JSON filter (simple contains check)
    if (filters.certifications) {
      subqueryConditions.push(sql`${crewListings.certifications}::text ILIKE ${`%${filters.certifications}%`}`);
    }

    // Salary range filters (stored as decimal string)
    if (filters.minSalary) {
      subqueryConditions.push(sql`CAST(${crewListings.salary} AS NUMERIC) >= ${parseFloat(filters.minSalary)}`);
    }
    if (filters.maxSalary) {
      subqueryConditions.push(sql`CAST(${crewListings.salary} AS NUMERIC) <= ${parseFloat(filters.maxSalary)}`);
    }

    // If there are any type-specific filters, wrap them in an EXISTS subquery
    if (subqueryConditions.length > 0) {
      const whereClause = subqueryConditions.length > 0 ? and(...subqueryConditions) : undefined;
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${crewListings}
          WHERE ${crewListings.listing_id} = ${listings.id}
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

export default CrewListingHandler;
