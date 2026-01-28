'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserCategorySuggestions, type CategorySuggestion } from '@/lib/api';

export default function CategorySuggestionsPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await getUserCategorySuggestions();
      setSuggestions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Öneriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: 'Onaylandı', className: 'bg-green-100 text-green-800' },
      REJECTED: { label: 'Reddedildi', className: 'bg-red-100 text-red-800' },
      MERGED: { label: 'Birleştirildi', className: 'bg-blue-100 text-blue-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kategori Önerilerim</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gönderdiğiniz kategori önerilerini buradan takip edebilirsiniz
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Dashboard'a Dön
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Henüz öneriniz yok</h3>
            <p className="mt-2 text-sm text-gray-500">
              İlan oluştururken kategori bulamazsanız yeni kategori önerebilirsiniz.
            </p>
            <button
              onClick={() => router.push('/dashboard/listings/new')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Yeni İlan Oluştur
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{suggestion.name}</h3>
                      {getStatusBadge(suggestion.status)}
                    </div>
                    
                    {suggestion.description && (
                      <p className="text-gray-600 mb-3">{suggestion.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        <span className="font-medium">Önerilme:</span>{' '}
                        {formatDate(suggestion.createdAt)}
                      </span>
                      {suggestion.reviewedAt && (
                        <span>
                          <span className="font-medium">İncelenme:</span>{' '}
                          {formatDate(suggestion.reviewedAt)}
                        </span>
                      )}
                    </div>

                    {suggestion.status === 'REJECTED' && suggestion.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Red Sebebi:</strong> {suggestion.rejectionReason}
                        </p>
                      </div>
                    )}

                    {suggestion.status === 'APPROVED' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Onaylandı!</strong> Kategori öneriniz sisteme eklendi.
                        </p>
                      </div>
                    )}

                    {suggestion.status === 'MERGED' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Birleştirildi!</strong> Öneriniz mevcut bir kategoriyle birleştirildi.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
