import { useState, useCallback } from 'react';

export interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

export interface UseImageUploadOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export interface UseImageUploadReturn {
  images: File[];
  previews: ImagePreview[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  error: string | null;
}

/**
 * Image upload hook with preview generation
 * @param options Configuration options
 * @returns Image upload handlers and state
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxFiles = 15,
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `Geçersiz dosya türü. İzin verilen türler: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Dosya boyutu ${maxSizeMB}MB'den küçük olmalıdır`;
    }

    return null;
  }, [allowedTypes, maxSizeMB]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Check max files limit
    if (images.length + files.length > maxFiles) {
      setError(`En fazla ${maxFiles} adet resim yükleyebilirsiniz`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    const newPreviews: ImagePreview[] = [];

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      validFiles.push(file);
      newPreviews.push({
        file,
        preview: generatePreview(file),
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      });
    }

    setImages(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [images.length, maxFiles, validateFile, generatePreview]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke URL to prevent memory leak
      if (prev[index]) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return newPreviews;
    });
  }, []);

  const clearImages = useCallback(() => {
    // Revoke all URLs to prevent memory leaks
    previews.forEach(p => URL.revokeObjectURL(p.preview));
    setImages([]);
    setPreviews([]);
    setError(null);
  }, [previews]);

  return {
    images,
    previews,
    handleImageChange,
    removeImage,
    clearImages,
    error,
  };
}
