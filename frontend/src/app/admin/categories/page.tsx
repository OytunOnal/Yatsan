'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllCategorySuggestions,
  approveCategorySuggestion,
  rejectCategorySuggestion,
  mergeCategorySuggestion,
  type CategorySuggestion,
} from '@/lib/api';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mergeModal, setMergeModal] = useState<{
    isOpen: boolean;
    suggestionId: string;
    suggestionName: string;
  }>({ isOpen: false, suggestionId: '', suggestionName: '' });
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    suggestionId: string;
    reason: string;
  }>({ isOpen: false, suggestionId: '', reason: '' });

  useEffect(() => {
    fetchSuggestions();
  }, [statusFilter, page]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await getAllCategorySuggestions({ status: statusFilter, page, limit: 20 });
      setSuggestions(response.data);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Öneriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (suggestionId: string) => {
    setActionLoading(suggestionId);
    try {
      await approveCategorySuggestion(suggestionId);
      fetchSuggestions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Onaylama başarısız');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.reason.trim()) {
      alert('Lütfen red sebebini belirtin');
      return;
    }
    setActionLoading(rejectModal.suggestionId);
    try {
      await rejectCategorySuggestion(rejectModal.suggestionId, { reason: rejectModal.reason });
      setRejectModal({ isOpen: false, suggestionId: '', reason: '' });
      fetchSuggestions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Reddetme başarısız');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMerge = async (targetCategoryId: string) => {
    setActionLoading(mergeModal.suggestionId);
    try {
      await mergeCategorySuggestion(mergeModal.suggestionId, { existingCategoryId: targetCategoryId });
      setMergeModal({ isOpen: false, suggestionId: '', suggestionName: '' });
      fetchSuggestions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Birleştirme başarısız');
    } finally {
      setActionLoading(null);
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
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kategori Önerileri Yönetimi</h1>
              <p className="mt-1 text-sm text-gray-500">
                Kullanıcıların gönderdiği kategori önerilerini inceleyin
              </p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Durum:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PENDING">Beklemede</option>
              <option value="APPROVED">Onaylanan</option>
              <option value="REJECTED">Reddedilen</option>
              <option value="MERGED">Birleştirilen</option>
            </select>
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Bu durumda öneri yok</h3>
          </div>
        ) : (
          <>
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
                          <span className="font-medium">Öneren ID:</span> {suggestion.suggestedBy}
                        </span>
                        <span>
                          <span className="font-medium">Tarih:</span> {formatDate(suggestion.createdAt)}
                        </span>
                        {suggestion.reviewedAt && (
                          <span>
                            <span className="font-medium">İncelenme:</span> {formatDate(suggestion.reviewedAt)}
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
                    </div>

                    {/* Actions for pending suggestions */}
                    {suggestion.status === 'PENDING' && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(suggestion.id)}
                          disabled={actionLoading === suggestion.id}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === suggestion.id ? 'İşleniyor...' : 'Onayla'}
                        </button>
                        <button
                          onClick={() => setMergeModal({ isOpen: true, suggestionId: suggestion.id, suggestionName: suggestion.name })}
                          disabled={actionLoading === suggestion.id}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Birleştir
                        </button>
                        <button
                          onClick={() => setRejectModal({ isOpen: true, suggestionId: suggestion.id, reason: '' })}
                          disabled={actionLoading === suggestion.id}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                <span className="text-gray-600">
                  Sayfa {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setRejectModal({ isOpen: false, suggestionId: '', reason: '' })} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Öneriyi Reddet</h3>
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Red sebebini belirtin..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setRejectModal({ isOpen: false, suggestionId: '', reason: '' })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading === rejectModal.suggestionId}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === rejectModal.suggestionId ? 'İşleniyor...' : 'Reddet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {mergeModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMergeModal({ isOpen: false, suggestionId: '', suggestionName: '' })} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                "{mergeModal.suggestionName}" Önerisini Birleştir
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Bu öneriyi mevcut bir kategoriyle birleştirmek için kategori ID'sini girin:
              </p>
              <input
                type="text"
                placeholder="Kategori ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = (e.target as HTMLInputElement).value;
                    if (target) handleMerge(target);
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setMergeModal({ isOpen: false, suggestionId: '', suggestionName: '' })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Kategori ID"]') as HTMLInputElement;
                    if (input?.value) handleMerge(input.value);
                  }}
                  disabled={actionLoading === mergeModal.suggestionId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading === mergeModal.suggestionId ? 'İşleniyor...' : 'Birleştir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
