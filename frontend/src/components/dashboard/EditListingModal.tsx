'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const editListingSchema = z.object({
  title: z.string().min(1, 'Başlık gerekli'),
  description: z.string().min(1, 'Açıklama gerekli'),
  price: z.number().min(0, 'Geçerli fiyat girin'),
  category: z.string().min(1, 'Kategori seçin'),
});

type EditListingFormData = z.infer<typeof editListingSchema>;

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onSave: (data: EditListingFormData) => void;
  isLoading?: boolean;
}

export default function EditListingModal({ isOpen, onClose, listing, onSave, isLoading = false }: EditListingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
  });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
      });
    }
  }, [listing, reset]);

  const onSubmit = (data: EditListingFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">İlanı Düzenle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Açıklama</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fiyat</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              {...register('category')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Seçin</option>
              <option value="Yat">Yat</option>
              <option value="Parça">Parça</option>
              <option value="Marina">Marina</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Güncelleniyor...
                </>
              ) : (
                'Güncelle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}