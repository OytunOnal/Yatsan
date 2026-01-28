'use client';

import { useState, useEffect } from 'react';
import { suggestCategory, getRootCategories, getChildCategories, type Category } from '@/lib/api';

interface CategorySuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultParentCategoryId?: string;
}

export default function CategorySuggestionModal({
  isOpen,
  onClose,
  onSuccess,
  defaultParentCategoryId,
}: CategorySuggestionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategoryId: defaultParentCategoryId || '',
    reason: '',
  });
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedRootCategory, setSelectedRootCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRootCategories();
      if (defaultParentCategoryId) {
        setFormData((prev) => ({ ...prev, parentCategoryId: defaultParentCategoryId }));
      }
    }
  }, [isOpen, defaultParentCategoryId]);

  const fetchRootCategories = async () => {
    setFetchingCategories(true);
    try {
      const response = await getRootCategories();
      setRootCategories(response.data);
      
      // Eğer default parent varsa, root kategoriyi bul
      if (defaultParentCategoryId) {
        const rootCat = response.data.find((c) => c.id === defaultParentCategoryId);
        if (rootCat) {
          setSelectedRootCategory(rootCat.id);
        }
      }
    } catch (err) {
      console.error('Kategoriler yüklenemedi:', err);
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleRootCategoryChange = async (rootId: string) => {
    setSelectedRootCategory(rootId);
    setFormData((prev) => ({ ...prev, parentCategoryId: '' }));
    
    if (rootId) {
      try {
        const response = await getChildCategories(rootId);
        setSubCategories(response.data);
      } catch (err) {
        console.error('Alt kategoriler yüklenemedi:', err);
      }
    } else {
      setSubCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await suggestCategory({
        name: formData.name,
        description: formData.description || undefined,
        parentCategoryId: formData.parentCategoryId,
        reason: formData.reason || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kategori önerisi gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      parentCategoryId: defaultParentCategoryId || '',
      reason: '',
    });
    setSelectedRootCategory('');
    setSubCategories([]);
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Yeni Kategori Öner</h2>
              <p className="text-sm text-gray-500">Aradığınız kategoriyi bulamadınız mı?</p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Öneriniz Alındı!</h3>
              <p className="text-gray-500">
                Kategori öneriniz incelendikten sonra size bildirim gönderilecektir.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Kategori Adı */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Örn: Jet Ski"
                  required
                  minLength={2}
                />
              </div>

              {/* Ana Kategori Seçimi */}
              <div>
                <label htmlFor="rootCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Ana Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="rootCategory"
                  value={selectedRootCategory}
                  onChange={(e) => handleRootCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={fetchingCategories}
                >
                  <option value="">Seçiniz</option>
                  {rootCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alt Kategori Seçimi */}
              {subCategories.length > 0 && (
                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Kategori
                  </label>
                  <select
                    id="subCategory"
                    value={formData.parentCategoryId}
                    onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seçiniz (Ana kategoriye eklenecek)</option>
                    {subCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Açıklama */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bu kategori hakkında bilgi verin..."
                />
              </div>

              {/* Neden Gerekli */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Neden Bu Kategori Gerekli?
                </label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bu kategorinin neden eklenmesi gerektiğini açıklayın..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Info Message */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Bilgi:</strong> Öneriniz admin tarafından incelendikten sonra onaylanacak
                  veya reddedilecektir. Sonuç size bildirim olarak iletilecektir.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : 'Öner'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
