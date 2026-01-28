import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { insuranceListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * InsuranceListingHandler
 * 
 * Handles insurance-specific listing operations including validation,
 * CRUD operations for insurance-specific data, and schema definition.
 * (Sigorta)
 */
export class InsuranceListingHandler implements IListingHandler {
  readonly type = 'insurance';

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
    companyName: z.string().min(1, 'Şirket adı gereklidir'),
    agencyName: z.string().optional(),
    licenseNumber: z.string().optional(),
    insuranceType: z.enum(['hull', 'liability', 'comprehensive', 'personal_accident', 'cargo'], {
      errorMap: () => ({ message: 'Geçersiz sigorta türü' })
    }),
    coverageTypes: z.string().optional(), // JSON string
    minBoatLength: z.number().positive().optional(),
    maxBoatLength: z.number().positive().optional(),
    minBoatValue: z.number().positive().optional(),
    maxBoatValue: z.number().positive().optional(),
    boatAgeLimit: z.number().int().min(0).optional(),
    coverageArea: z.string().optional(),
    premiumCalculation: z.string().optional(),
    minPremium: z.number().positive().optional(),
    premiumPercentage: z.number().positive().optional(),
    hullCoverage: z.boolean().default(false),
    liabilityCoverage: z.boolean().default(false),
    salvageCoverage: z.boolean().default(false),
    personalAccident: z.boolean().default(false),
    legalProtection: z.boolean().default(false),
    contactPerson: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional().or(z.literal('')),
    website: z.string().optional(),
  });

  private schema: ListingTypeSchema = {
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
    return insuranceListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(insuranceListings).values({
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

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(insuranceListings)
      .where(eq(insuranceListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    const updateData: any = {};
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
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(insuranceListings)
        .set(updateData)
        .where(eq(insuranceListings.listing_id, listingId));
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

    if (filters.insuranceType) {
      subqueryConditions.push(eq(insuranceListings.insuranceType, filters.insuranceType));
    }

    if (filters.companyName) {
      subqueryConditions.push(sql`${insuranceListings.companyName} ILIKE ${`%${filters.companyName}%`}`);
    }

    if (filters.hullCoverage === 'true') {
      subqueryConditions.push(eq(insuranceListings.hullCoverage, true));
    }

    if (filters.liabilityCoverage === 'true') {
      subqueryConditions.push(eq(insuranceListings.liabilityCoverage, true));
    }

    if (subqueryConditions.length > 0) {
      const whereClause = and(...subqueryConditions);
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${insuranceListings}
          WHERE ${insuranceListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  getFilterSchema(): FilterSchema[] {
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

export default InsuranceListingHandler;
