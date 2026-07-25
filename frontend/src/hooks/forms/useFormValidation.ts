import { useCallback, useMemo } from 'react';
import { z } from 'zod';

export interface ValidationResult {
  success: boolean;
  errors: Record<string, string>;
  data?: any;
}

export interface UseFormValidationReturn<T extends z.ZodSchema> {
  validate: (data: z.infer<T>) => ValidationResult;
  validateField: (fieldName: string, value: any, fullData?: z.infer<T>) => string | null;
  schema: T;
}

/**
 * Form validation hook using Zod schema
 * @param schema Zod validation schema
 * @returns Validation functions
 */
export function useFormValidation<T extends z.ZodSchema>(
  schema: T
): UseFormValidationReturn<T> {
  
  const validate = useCallback((data: z.infer<T>): ValidationResult => {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return {
          success: true,
          errors: {},
          data: result.data,
        };
      }
      
      // Convert Zod errors to field error map
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string;
          if (!errors[fieldName]) {
            errors[fieldName] = err.message;
          }
        }
      });
      
      return {
        success: false,
        errors,
      };
    } catch (err) {
      return {
        success: false,
        errors: { _form: 'Validasyon hatası oluştu' },
      };
    }
  }, [schema]);

  const validateField = useCallback((
    fieldName: string, 
    value: any,
    fullData?: z.infer<T>
  ): string | null => {
    try {
      // Eğer full data verilmişse, tüm veriyi valide et
      // Değilse, sadece bu alanı kontrol et
      const testData = fullData || { [fieldName]: value };
      const result = schema.safeParse(testData);
      
      if (result.success) {
        return null;
      }
      
      // Bu alana ait hatayı bul
      const fieldError = result.error.errors.find(
        err => err.path[0] === fieldName
      );
      
      return fieldError?.message || null;
    } catch (err) {
      return null;
    }
  }, [schema]);

  return {
    validate,
    validateField,
    schema,
  };
}

// Common validation schemas
export const commonSchemas = {
  requiredString: (fieldName: string, minLength = 1) => 
    z.string()
      .min(1, `${fieldName} gereklidir`)
      .min(minLength, `${fieldName} en az ${minLength} karakter olmalıdır`),
  
  optionalString: () => z.string().optional(),
  
  requiredNumber: (fieldName: string, min?: number, max?: number) => {
    let schema = z.string().min(1, `${fieldName} gereklidir`);
    return schema.transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} sayısal bir değer olmalıdır`,
        });
        return z.NEVER;
      }
      if (min !== undefined && parsed < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} en az ${min} olmalıdır`,
        });
        return z.NEVER;
      }
      if (max !== undefined && parsed > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} en fazla ${max} olmalıdır`,
        });
        return z.NEVER;
      }
      return val;
    });
  },

  optionalNumber: () => z.string().optional(),

  year: (fieldName: string, minYear = 1970, maxYear = new Date().getFullYear()) =>
    z.string().transform((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} gereklidir`,
        });
        return z.NEVER;
      }
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} sayısal bir değer olmalıdır`,
        });
        return z.NEVER;
      }
      if (parsed < minYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} ${minYear} veya daha büyük olmalıdır`,
        });
        return z.NEVER;
      }
      if (parsed > maxYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} ${maxYear} veya daha küçük olmalıdır`,
        });
        return z.NEVER;
      }
      return val;
    }),

  price: (fieldName: string, maxValue = 9999999999) =>
    z.string()
      .min(1, `${fieldName} gereklidir`)
      .transform((val, ctx) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed) || parsed <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Geçerli bir ${fieldName.toLowerCase()} giriniz`,
          });
          return z.NEVER;
        }
        if (parsed > maxValue) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${fieldName} ${maxValue.toLocaleString()}'dan küçük olmalıdır`,
          });
          return z.NEVER;
        }
        return val;
      }),

  currency: () => z.enum(['TRY', 'USD', 'EUR']),
};
