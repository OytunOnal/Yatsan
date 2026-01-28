/**
 * Yacht Listing Validation Schema
 * 
 * Zod validation schema for yacht listing forms.
 * Includes common validations and yacht-specific fields.
 */

import { z } from 'zod';

/**
 * Creates yacht listing validation schema with dynamic year validation
 */
export const getYachtListingSchema = (currentYear: number) => z.object({
  // Temel Bilgiler
  title: z.string()
    .min(1, 'Başlık gereklidir')
    .min(5, 'Başlık en az 5 karakter olmalıdır')
    .max(200, 'Başlık en fazla 200 karakter olabilir'),
  
  description: z.string()
    .min(1, 'Açıklama gereklidir')
    .min(20, 'Açıklama en az 20 karakter olmalıdır')
    .max(5000, 'Açıklama en fazla 5000 karakter olabilir'),
  
  location: z.string()
    .min(1, 'Konum gereklidir')
    .min(2, 'Konum en az 2 karakter olmalıdır')
    .max(200, 'Konum en fazla 200 karakter olabilir'),

  // Fiyat Bilgileri
  price: z.string()
    .min(1, 'Fiyat gereklidir')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Geçerli bir fiyat giriniz')
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 9999999999;
    }, 'Fiyat 9.999.999.999\'dan küçük olmalıdır'),
  
  currency: z.enum(['TRY', 'USD', 'EUR'], {
    errorMap: () => ({ message: 'Geçerli bir para birimi seçiniz' })
  }),

  // Yat Bilgileri
  yachtType: z.enum(['motor_yacht', 'sailing_yacht', 'catamaran', 'gulet'], {
    errorMap: () => ({ message: 'Geçerli bir yat tipi seçiniz' })
  }),
  
  year: z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yıl sayısal bir değer olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed < 1970) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Yıl 1970 veya daha büyük olmalıdır',
      });
      return z.NEVER;
    }
    if (parsed > currentYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Yıl ${currentYear} veya daha küçük olmalıdır`,
      });
      return z.NEVER;
    }
    return val;
  }),
  
  length: z.string()
    .min(1, 'Uzunluk gereklidir')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Geçerli bir uzunluk değeri giriniz')
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 9999.99;
    }, 'Uzunluk 9999.99 metreden küçük olmalıdır'),
  
  beam: z.string()
    .min(1, 'Genişlik gereklidir')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Geçerli bir genişlik değeri giriniz')
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 9999.99;
    }, 'Genişlik 9999.99 metreden küçük olmalıdır'),
  
  draft: z.string()
    .min(1, 'Sükunet derinliği gereklidir')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Geçerli bir derinlik değeri giriniz')
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 9999.99;
    }, 'Derinlik 9999.99 metreden küçük olmalıdır'),
  
  condition: z.enum(['new', 'excellent', 'good', 'fair'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçiniz' })
  }),

  // Motor Bilgileri (Opsiyonel)
  engineBrand: z.string().max(100, 'Motor markası en fazla 100 karakter olabilir').optional(),
  
  engineHP: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 99999;
    }, 'Motor gücü 1-99999 HP arasında olmalıdır')
    .optional(),
  
  engineHours: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 999999;
    }, 'Motor saati 0-999999 arasında olmalıdır')
    .optional(),
  
  fuelType: z.enum(['diesel', 'petrol', 'electric', 'hybrid'], {
    errorMap: () => ({ message: 'Geçerli bir yakıt tipi seçiniz' })
  }).optional(),
  
  cruisingSpeed: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 999;
    }, 'Seyir hızı 1-999 knot arasında olmalıdır')
    .optional(),
  
  maxSpeed: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 999;
    }, 'Maksimum hız 1-999 knot arasında olmalıdır')
    .optional(),

  // Konaklama Bilgileri (Opsiyonel)
  cabinCount: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 99;
    }, 'Kabin sayısı 1-99 arasında olmalıdır')
    .optional(),
  
  bedCount: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 99;
    }, 'Yatak sayısı 1-99 arasında olmalıdır')
    .optional(),
  
  bathroomCount: z.string()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 99;
    }, 'Banyo sayısı 1-99 arasında olmalıdır')
    .optional(),

  // Ekipman (Opsiyonel)
  equipment: z.string()
    .max(2000, 'Ekipman listesi en fazla 2000 karakter olabilir')
    .optional(),
});

export type YachtListingFormData = z.infer<ReturnType<typeof getYachtListingSchema>>;
