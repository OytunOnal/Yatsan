import { useCallback } from 'react';

export interface UseFormHandlersReturn<T extends Record<string, any>> {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFieldChange: (fieldName: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFieldBlur: (fieldName: keyof T) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handlePaste: (fieldName: keyof T, maxLength: number) => (e: React.ClipboardEvent) => void;
  handleNumericKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface FormHandlersOptions<T extends Record<string, any>> {
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  maxLengths?: Partial<Record<keyof T, number>>;
}

/**
 * Form event handlers hook
 * Provides common form event handlers with maxLength and paste handling
 */
export function useFormHandlers<T extends Record<string, any>>(
  options: FormHandlersOptions<T>
): UseFormHandlersReturn<T> {
  const { setFormData, setFieldErrors, setError, maxLengths = {} } = options;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError?.('');
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, [setFormData, setFieldErrors, setError]);

  const handleFieldChange = useCallback((fieldName: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      let { value } = e.target;
      
      // maxLength kontrolü - paste durumunda da çalışır
      const maxLength = maxLengths[fieldName];
      if (maxLength && value.length > maxLength) {
        value = value.slice(0, maxLength);
      }
      
      setFormData(prev => ({ ...prev, [fieldName]: value }));
      // Değişiklik anında hata gösterme, sadece mevcut hatayı temizle
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName as string];
        return newErrors;
      });
      setError?.('');
  }, [setFormData, setFieldErrors, setError, maxLengths]);

  const handleFieldBlur = useCallback((fieldName: keyof T) => 
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      // Bu hook sadece state yönetimi sağlar, validasyon useFormValidation hook'a bırakılır
      // İsterseniz buraya validateField çağrısı ekleyebilirsiniz
    }, []);

  const handlePaste = useCallback((fieldName: keyof T, maxLength: number) => 
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const truncatedText = pastedText.slice(0, maxLength);
      
      // Mevcut değeri al
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      const currentValue = input.value;
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;
      
      // Yeni değeri oluştur
      const newValue = currentValue.slice(0, selectionStart) + truncatedText + currentValue.slice(selectionEnd);
      
      // maxLength kontrolü
      const finalValue = newValue.slice(0, maxLength);
      
      setFormData(prev => ({ ...prev, [fieldName]: finalValue }));
  }, [setFormData]);

  const handleNumericKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // İzin verilen tuşlar: rakamlar (0-9), backspace, delete, tab, arrow keys, enter, home, end, nokta
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', '.', ','
    ];

    // Ctrl/Cmd + A, C, V, X izin ver
    if (e.ctrlKey || e.metaKey) {
      if (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        return;
      }
    }

    // Rakam veya izin verilen tuş değilse engelle
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }, []);

  return {
    handleChange,
    handleFieldChange,
    handleFieldBlur,
    handlePaste,
    handleNumericKeyDown,
  };
}

// Common maxLength constants
export const COMMON_MAX_LENGTHS = {
  title: 200,
  description: 5000,
  location: 200,
  price: 10,
  year: 4,
  length: 6,
  beam: 6,
  draft: 6,
  engineBrand: 100,
  engineHP: 5,
  engineHours: 6,
  cruisingSpeed: 3,
  maxSpeed: 3,
  cabinCount: 2,
  bedCount: 2,
  bathroomCount: 2,
  equipment: 2000,
  brand: 100,
  model: 100,
  oemCode: 100,
  compatibility: 500,
  services: 2000,
  availability: 200,
  position: 100,
  certifications: 500,
  salary: 20,
  salaryCurrency: 10,
  salaryPeriod: 20,
  businessName: 200,
  yearsInBusiness: 2,
  authorizedBrands: 500,
  serviceArea: 200,
  emergencyPhone: 20,
  priceType: 20,
  hourlyRate: 10,
  minServiceFee: 10,
  workingHours: 100,
  website: 200,
  whatsapp: 20,
  facilityName: 200,
  securityFeatures: 1000,
  accessHours: 100,
  liftCapacity: 10,
  companyName: 200,
  agencyName: 200,
  licenseNumber: 50,
  insuranceType: 50,
  coverageTypes: 500,
  coverageArea: 200,
  premiumCalculation: 200,
  minPremium: 20,
  premiumPercentage: 10,
  contactPerson: 100,
  contactPhone: 20,
  contactEmail: 100,
  expertName: 100,
  expertiseType: 50,
  boatTypes: 200,
  reportTypes: 200,
  reportLanguages: 200,
  turnaroundTime: 100,
  basePrice: 20,
  pricePerMeter: 20,
  travelFee: 20,
  memberships: 500,
  phone: 20,
  email: 100,
  itemType: 50,
  yearPurchased: 4,
  usageFrequency: 50,
  originalPrice: 20,
  reasonForSelling: 500,
  dimensions: 50,
  weight: 10,
  color: 50,
  material: 50,
  accessoriesDescription: 500,
  tradeInterests: 500,
} as const;
