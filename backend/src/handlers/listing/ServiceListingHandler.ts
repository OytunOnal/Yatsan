import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { serviceListings, listings } from '../../db/schema';
import {
  IListingHandler,
  ListingTypeSchema,
  ValidationResult,
  FilterSchema,
} from './IListingHandler';

/**
 * ServiceListingHandler
 * 
 * Handles service-specific listing operations including validation,
 * CRUD operations for service-specific data, and schema definition.
 * (Teknik Servisler)
 */
export class ServiceListingHandler implements IListingHandler {
  readonly type = 'service';

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
    serviceType: z.string().min(1, 'Servis türü seçilmeli'),
    businessName: z.string().optional(),
    yearsInBusiness: z.number().int().min(0).optional(),
    certifications: z.string().optional(), // JSON string
    authorizedBrands: z.string().optional(), // JSON string
    serviceArea: z.string().optional(),
    mobileService: z.boolean().default(false),
    emergencyService: z.boolean().default(false),
    emergencyPhone: z.string().optional(),
    priceType: z.string().optional(),
    hourlyRate: z.number().positive().optional(),
    minServiceFee: z.number().positive().optional(),
    workingHours: z.string().optional(),
    website: z.string().optional(),
    whatsapp: z.string().optional(),
  });

  private schema: ListingTypeSchema = {
    type: this.type,
    label: 'Teknik Servis',
    labelPlural: 'Teknik Servisler',
    icon: 'wrench',
    description: 'Deniz aracı teknik servis hizmetleri - bakım, onarım, montaj vb.',
    fields: [
      {
        name: 'serviceType',
        type: 'select',
        label: 'Servis Türü',
        required: true,
        options: [
          'engine_repair', 'electrical', 'plumbing', 'fiberglass',
          'painting', 'upholstery', 'mechanical', 'installation',
          'maintenance', 'winterization', 'detailing', 'other'
        ],
        placeholder: 'Servis türü seçin',
      },
      {
        name: 'businessName',
        type: 'text',
        label: 'İşletme Adı',
        required: false,
        placeholder: 'Şirket adı',
      },
      {
        name: 'yearsInBusiness',
        type: 'number',
        label: 'Sektördeki Yıl Sayısı',
        required: false,
        min: 0,
      },
      {
        name: 'certifications',
        type: 'json',
        label: 'Sertifikalar',
        required: false,
        placeholder: 'JSON array',
      },
      {
        name: 'authorizedBrands',
        type: 'json',
        label: 'Yetkili Markalar',
        required: false,
        placeholder: 'JSON array',
      },
      {
        name: 'serviceArea',
        type: 'text',
        label: 'Hizmet Bölgesi',
        required: false,
        placeholder: 'ör. İstanbul, Marmara Bölgesi',
      },
      {
        name: 'mobileService',
        type: 'select',
        label: 'Mobil Hizmet',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'emergencyService',
        type: 'select',
        label: 'Acil Servis',
        required: false,
        options: ['true', 'false'],
      },
      {
        name: 'emergencyPhone',
        type: 'text',
        label: 'Acil Telefon',
        required: false,
        placeholder: '05XX XXX XX XX',
      },
      {
        name: 'priceType',
        type: 'select',
        label: 'Fiyatlandırma Türü',
        required: false,
        options: ['hourly', 'fixed', 'quote', 'negotiable'],
      },
      {
        name: 'hourlyRate',
        type: 'number',
        label: 'Saatlik Ücret',
        required: false,
        min: 0,
        step: 0.01,
      },
      {
        name: 'minServiceFee',
        type: 'number',
        label: 'Min. Servis Ücreti',
        required: false,
        min: 0,
        step: 0.01,
      },
      {
        name: 'workingHours',
        type: 'text',
        label: 'Çalışma Saatleri',
        required: false,
        placeholder: 'Pzt-Cuma 09:00-18:00',
      },
      {
        name: 'website',
        type: 'text',
        label: 'Web Sitesi',
        required: false,
        placeholder: 'https://',
      },
      {
        name: 'whatsapp',
        type: 'text',
        label: 'WhatsApp',
        required: false,
        placeholder: '05XX XXX XX XX',
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
    return serviceListings;
  }

  async createTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, ...typeSpecific } = data;

    await db.insert(serviceListings).values({
      listing_id: listingId,
      serviceType: typeSpecific.serviceType,
      businessName: typeSpecific.businessName || null,
      yearsInBusiness: typeSpecific.yearsInBusiness || null,
      certifications: typeSpecific.certifications || null,
      authorizedBrands: typeSpecific.authorizedBrands || null,
      serviceArea: typeSpecific.serviceArea || null,
      mobileService: typeSpecific.mobileService ?? false,
      emergencyService: typeSpecific.emergencyService ?? false,
      emergencyPhone: typeSpecific.emergencyPhone || null,
      priceType: typeSpecific.priceType || null,
      hourlyRate: typeSpecific.hourlyRate?.toString() || null,
      minServiceFee: typeSpecific.minServiceFee?.toString() || null,
      workingHours: typeSpecific.workingHours || null,
      website: typeSpecific.website || null,
      whatsapp: typeSpecific.whatsapp || null,
    });
  }

  async getTypeSpecific(db: any, listingId: string): Promise<any> {
    const result = await db
      .select()
      .from(serviceListings)
      .where(eq(serviceListings.listing_id, listingId))
      .limit(1);
    return result[0] || null;
  }

  async updateTypeSpecific(db: any, listingId: string, data: any): Promise<void> {
    const { title, description, price, currency, location, status, rejectionReason, ...typeSpecific } = data;

    const updateData: any = {};
    const allowedFields = [
      'serviceType', 'businessName', 'yearsInBusiness', 'certifications', 'authorizedBrands',
      'serviceArea', 'mobileService', 'emergencyService', 'emergencyPhone', 'priceType',
      'hourlyRate', 'minServiceFee', 'workingHours', 'website', 'whatsapp'
    ];

    for (const field of allowedFields) {
      if (field in typeSpecific && typeSpecific[field] !== undefined) {
        if (['hourlyRate', 'minServiceFee'].includes(field)) {
          updateData[field] = typeSpecific[field]?.toString();
        } else {
          updateData[field] = typeSpecific[field];
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db
        .update(serviceListings)
        .set(updateData)
        .where(eq(serviceListings.listing_id, listingId));
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

    if (filters.serviceType) {
      subqueryConditions.push(eq(serviceListings.serviceType, filters.serviceType));
    }

    if (filters.mobileService === 'true') {
      subqueryConditions.push(eq(serviceListings.mobileService, true));
    }

    if (filters.emergencyService === 'true') {
      subqueryConditions.push(eq(serviceListings.emergencyService, true));
    }

    if (filters.serviceArea) {
      subqueryConditions.push(sql`${serviceListings.serviceArea} ILIKE ${`%${filters.serviceArea}%`}`);
    }

    if (subqueryConditions.length > 0) {
      const whereClause = and(...subqueryConditions);
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${serviceListings}
          WHERE ${serviceListings.listing_id} = ${listings.id}
          ${whereClause ? sql`AND ${whereClause}` : sql``}
        )`
      );
    }

    return conditions;
  }

  getFilterSchema(): FilterSchema[] {
    return [
      {
        name: 'serviceType',
        type: 'select',
        label: 'Servis Türü',
        options: [
          'engine_repair', 'electrical', 'plumbing', 'fiberglass',
          'painting', 'upholstery', 'mechanical', 'installation',
          'maintenance', 'winterization', 'detailing', 'other'
        ],
      },
      {
        name: 'mobileService',
        type: 'select',
        label: 'Mobil Hizmet',
        options: ['true', 'false'],
      },
      {
        name: 'emergencyService',
        type: 'select',
        label: 'Acil Servis',
        options: ['true', 'false'],
      },
      {
        name: 'serviceArea',
        type: 'text',
        label: 'Hizmet Bölgesi',
        placeholder: 'Şehir veya bölge ara...',
      },
    ];
  }
}

export default ServiceListingHandler;
