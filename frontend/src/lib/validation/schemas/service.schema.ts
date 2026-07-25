import { z } from 'zod';
import {
  titleSchema,
  descriptionSchema,
  priceSchema,
  locationSchema,
  optionalWebsiteSchema,
  optionalPhoneSchema,
} from './common.schema';

/**
 * Service listing validation schema
 * Validates technical service listings with business information and pricing
 */
export const serviceListingSchema = z.object({
  // Basic Information
  title: titleSchema(),
  description: descriptionSchema(),
  price: priceSchema,
  location: locationSchema(),

  // Service Information
  serviceType: z.string()
    .min(1, 'Servis türü seçilmelidir'),

  businessName: z.string()
    .min(2, 'İşletme adı en az 2 karakter olmalıdır')
    .max(100, 'İşletme adı en fazla 100 karakter olabilir')
    .optional(),

  yearsInBusiness: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    }, 'Sektördeki yıl sayısı 0 veya daha büyük olmalıdır')
    .optional(),

  certifications: z.string()
    .max(500, 'Sertifikalar en fazla 500 karakter olabilir')
    .optional(),

  authorizedBrands: z.string()
    .max(500, 'Yetkili markalar en fazla 500 karakter olabilir')
    .optional(),

  serviceArea: z.string()
    .max(200, 'Hizmet bölgesi en fazla 200 karakter olabilir')
    .optional(),

  // Service Features
  mobileService: z.boolean().optional(),
  emergencyService: z.boolean().optional(),

  emergencyPhone: z.string()
    .max(20, 'Acil telefon en fazla 20 karakter olabilir')
    .optional(),

  // Pricing Details
  priceType: z.string()
    .max(20, 'Fiyatlandırma türü en fazla 20 karakter olabilir')
    .optional(),

  hourlyRate: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Geçerli bir saatlik ücret giriniz')
    .optional(),

  minServiceFee: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Geçerli bir minimum servis ücreti giriniz')
    .optional(),

  // Additional Details
  workingHours: z.string()
    .max(100, 'Çalışma saatleri en fazla 100 karakter olabilir')
    .optional(),

  website: optionalWebsiteSchema,
  whatsapp: optionalPhoneSchema,

  // Images
  images: z.array(z.any()).optional(),
});

export type ServiceListingFormData = z.infer<typeof serviceListingSchema>;
