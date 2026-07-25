import React from 'react';
import { ImagePreview } from '@/hooks/forms';

export interface FormImageUploadProps {
  images: File[];
  previews: ImagePreview[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  error?: string;
  maxFiles?: number;
  label?: string;
  className?: string;
}

export const FormImageUpload: React.FC<FormImageUploadProps> = ({
  images,
  previews,
  onImageChange,
  onRemoveImage,
  error,
  maxFiles = 15,
  label = 'İlan Resimleri',
  className = '',
}) => {
  return (
    <div className={className}>
      <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
        {label} (En fazla {maxFiles} adet)
      </label>
      <input
        type="file"
        id="images"
        name="images"
        multiple
        accept="image/*"
        onChange={onImageChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {images.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {images.length} adet resim seçildi
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={preview.id} className="relative group">
              <img
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove image ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FormImageUpload.displayName = 'FormImageUpload';
