import { z } from 'zod';
import { SQL } from 'drizzle-orm';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type FieldType = 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'textarea' | 'json';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: any;
  min?: number;
  max?: number;
  step?: number;
}

export interface ListingTypeSchema {
  type: string;
  label: string;
  labelPlural: string;
  icon: string;
  description?: string;
  fields: FieldDefinition[];
  validationSchema: z.ZodSchema;
}

export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: any[];
}

export interface ListingFilterOptions {
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================
// FILTER SCHEMA DEFINITIONS
// ============================================

export interface FilterSchema {
  name: string;
  type: FieldType;
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// ============================================
// BASE INTERFACE
// ============================================

export interface IListingHandler {
  /**
   * Unique identifier for this listing type
   */
  readonly type: string;

  /**
   * Validate incoming data against this handler's schema
   */
  validate(data: any): ValidationResult;

  /**
   * Get the Zod validation schema for this listing type
   */
  getValidationSchema(): z.ZodSchema;

  /**
   * Get the Drizzle table definition for type-specific data
   */
  getTypeSpecificTable(): any;

  /**
   * Create type-specific data in the database
   */
  createTypeSpecific(db: any, listingId: string, data: any): Promise<void>;

  /**
   * Retrieve type-specific data from the database
   */
  getTypeSpecific(db: any, listingId: string): Promise<any>;

  /**
   * Update type-specific data in the database
   */
  updateTypeSpecific(db: any, listingId: string, data: any): Promise<void>;

  /**
   * Delete type-specific data from the database
   */
  deleteTypeSpecific(db: any, listingId: string): Promise<void>;

  /**
   * Get the schema definition for frontend form generation
   */
  getSchema(): ListingTypeSchema;

  /**
   * Get type-specific filter conditions for database queries
   *
   * IMPORTANT: These conditions MUST use EXISTS subqueries to reference
   * type-specific tables, since the main query only joins listings and users.
   *
   * Example:
   *   sql`EXISTS (
   *     SELECT 1 FROM ${yachtListings}
   *     WHERE ${yachtListings.listing_id} = ${listings.id}
   *     AND ${yachtListings.yachtType} = ${filters.yachtType}
   *   )`
   *
   * @param filters - Filter options from query parameters
   * @returns Array of SQL conditions using EXISTS subqueries
   */
  getTypeSpecificFilters(filters: any): SQL[];

  /**
   * Get filter schema for frontend filter UI generation
   * @returns Array of filter definitions for this listing type
   */
  getFilterSchema(): FilterSchema[];
}
