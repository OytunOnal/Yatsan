import { useState, useCallback } from 'react';

export interface FormStateOptions<T> {
  initialData: T;
}

export interface UseFormStateReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
  resetForm: () => void;
}

/**
 * Generic form state management hook
 * @param initialData Initial form data
 * @returns Form state and handlers
 */
export function useFormState<T extends Record<string, any>>(
  options: FormStateOptions<T>
): UseFormStateReturn<T> {
  const { initialData } = options;
  
  const [formData, setFormData] = useState<T>(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setFieldErrors({});
  }, [initialData]);

  return {
    formData,
    setFormData,
    fieldErrors,
    setFieldErrors,
    updateField,
    clearFieldError,
    clearAllErrors,
    resetForm,
  };
}
