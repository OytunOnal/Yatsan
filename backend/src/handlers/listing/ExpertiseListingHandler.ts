import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { expertiseListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * ExpertiseListingHandler
 * 
 * Handles expertise-specific listing operations including validation,
 * CRUD operations for expertise-specific data, and schema definition.
 * (Ekspertiz)
 */
export class ExpertiseListingHandler implements IListingHandler {
  readonly type = 'expertise';

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
    companyName: z.string().optional(),
    expertName: z.string().optional(),
    licenseNumber: z.string().optional(),
    yearsExperience: z.number().int().min(0).optional(),
    expertiseType: z.enum(['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'], {
      errorMap: () => ({ message: 'Geçersiz ekspertiz türü' })
    }),
    boatTypes: z.string().optional(), // JSON string
    minBoatLength: z.number().positive().optional(),
    maxBoatLength: z.number().positive().optional(),
    serviceArea: z.string().optional(),
    mobileService: z.boolean().default(false),
    reportTypes: z.string().optional(), // JSON string
    reportLanguages: z.string().optional(), // JSON string
    turnaroundTime: z.string().optional(),
    basePrice: z.number().positive().optional(),
    pricePerMeter: z.number().positive().optional(),
    travelFee: z.number().positive().optional(),
    certifications: z.string().optional(), // JSON string
    memberships: z.string().optional(), // JSON string
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().optional(),
  });

  private schema: ListingTypeSchema = {
    type: this.type,
    label: 'Ekspertiz',
    labelPlural: 'Ekspertiz',
    icon: 'clipboard-check',
    description: 'Tekne ekspertiz ve değerleme hizmetleri',
    fields: [
      {
        name: 'companyName',
        type: 'text',
        label: 'Şirket Adı',
        required: false,
      },
      {
        name: 'expertName',
        type: 'text',
        label: 'Eksper Adı',
        required: false,
      },
      {
        name: 'licenseNumber',
        type: 'text',
        label: 'Lisans Numarası',
        required: false,
      },
      {
        name: 'yearsExperience',
        type: 'number',
        label: 'Deneyim (yıl)',
        required: false,
        min: 0,
      },
      {
        name: 'expertiseType',
        type: 'select',
        label: 'Ekspertiz Türü',
        required: true,
        options: ['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'],
      },
      {
        name: 'boatTypes',
        type: 'json',
        label: 'Tekne Türleri',
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
        name: 'serviceArea',
        type: 'text',
        label: 'Hizmet Bölgesi',
        required: false,
      },
      {
        name: 'mobileService',
        type: 'select',
        label: 'Mobil Hizmet',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'reportTypes',
        type: 'json',
        label: 'Rapor Türleri',
        required: false,
      },
      {
        name: 'reportLanguages',
        type: 'json',
        label: 'Rapor Dilleri',
        required: false,
      },
      {
        name: 'turnaroundTime',
        type: 'text',
        label: 'Teslimat Süresi',
        required: false,
      },
      {
        name: 'basePrice',
        type: 'number',
        label: 'Baz Ücret',
        required: false,
        min: 0,
        step: 0.01,
      },
      {
        name: 'pricePerMeter',
        type: 'number',
        label: 'Metre Başına Ücret',
        required: false,
        min: 0,
        step: 0.01,
      },
      {
        name: 'travelFee',
        type: 'number',
        label: 'Ulaşım Ücreti',
        required: false,
        min: 0,
        step: 0.01,
      },
      {
        name: 'certifications',
        type: 'json',
        label: 'Sertifikalar',
        required: false,
      },
      {
        name: 'memberships',
        type: 'json',
        label: 'Üyelikler',
        required: false,
      },
      {
        name: 'phone',
        type: 'text',
        label: 'Telefon',
        required: false,
      },
      {
        name: 'email',
        type: 'text',
        label: 'E-posta',
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
    return expertiseListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(expertiseListings).values({
      listing_id: listingId,
      companyName: typeSpecific.companyName || null,
      expertName: typeSpecific.expertName || null,
      licenseNumber: typeSpecific.licenseNumber || null,
      yearsExperience: typeSpecific.yearsExperience || null,
      expertiseType: typeSpecific.expertiseType,
      boatTypes: typeSpecific.boatTypes || null,
      minBoatLength: typeSpecific.minBoatLength?.toString() || null,
      maxBoatLength: typeSpecific.maxBoatLength?.toString() || null,
      serviceArea: typeSpecific.serviceArea || null,
      mobileService: typeSpecific.mobileService ?? false,
      reportTypes: typeSpecific.reportTypes || null,
      reportLanguages: typeSpecific.reportLanguages || null,
      turnaroundTime: typeSpecific.turnaroundTime || null,
      basePrice: typeSpecific.basePrice?.toString() || null,
      pricePerMeter: typeSpecific.pricePerMeter?.toString() || null,
      travelFee: typeSpecific.travelFee?.toString() || null,
      certifications: typeSpecific.certifications || null,
      memberships: typeSpecific.memberships || null,
      phone: typeSpecific.phone || null,
      email: typeSpecific.email || null,
      website: typeSpecific.website || null,
    });
  }

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(expertiseListings)
      .where(eq(expertiseListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    const updateData: any = {};
    const allowedFields = [
      'companyName', 'expertName', 'licenseNumber', 'yearsExperience', 'expertiseType',
      'boatTypes', 'minBoatLength', 'maxBoatLength', 'serviceArea', 'mobileService',
      'reportTypes', 'reportLanguages', 'turnaroundTime', 'basePrice', 'pricePerMeter',
      'travelFee', 'certifications', 'memberships', 'phone', 'email', 'website'
    ];

    for (const field of allowedFields) {
      if (field in typeSpecific && typeSpecific[field] !== undefined) {
        if (['minBoatLength', 'maxBoatLength', 'basePrice', 'pricePerMeter', 'travelFee'].includes(field)) {
          updateData[field] = typeSpecific[field]?.toString();
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(expertiseListings)
        .set(updateData)
        .where(eq(expertiseListings.listing_id, listingId));
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

    if (filters.expertiseType) {
      subqueryConditions.push(eq(expertiseListings.expertiseType, filters.expertiseType));
    }

    if (filters.mobileService === 'true') {
      subqueryConditions.push(eq(expertiseListings.mobileService, true));
    }

    if (filters.serviceArea) {
      subqueryConditions.push(sql`${expertiseListings.serviceArea} ILIKE ${`%${filters.serviceArea}%`}`);
    }

    if (subqueryConditions.length > 0) {
      const whereClause = and(...subqueryConditions);
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${expertiseListings}
          WHERE ${expertiseListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  getFilterSchema(): FilterSchema[] {
    return [
      {
        name: 'expertiseType',
        type: 'select',
        label: 'Ekspertiz Türü',
        options: ['pre_purchase', 'insurance', 'damage', 'valuation', 'condition', 'comprehensive'],
      },
      {
        name: 'mobileService',
        type: 'select',
        label: 'Mobil Hizmet',
        options: ['true', 'false'],
      },
      {
        name: 'serviceArea',
        type: 'text',
        label: 'Hizmet Bölgesi',
        placeholder: 'Bölge ara...',
      },
    ];
  }
}

export default ExpertiseListingHandler;
