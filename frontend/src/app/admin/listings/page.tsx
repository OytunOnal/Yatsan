'use client';

import { useEffect, useState } from 'react';
import { getAdminPendingListings, adminApproveListing, adminRejectListing } from '@/lib/api';
import { Listing } from '@/lib/api';

export default function AdminListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, [page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getAdminPendingListings({ page, limit: 20 });
      setListings(response.listings);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || 'İlanlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      await adminApproveListing(id);
      setListings(listings.filter(l => l.id !== id));
    } catch (err: any) {
      alert(err.message || 'İlan onaylanırken hata oluştu');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!selectedListing || !rejectionReason.trim()) {
      alert('Lütfen red sebebini belirtin');
      return;
    }

    try {
      setProcessing(selectedListing.id);
      await adminRejectListing(selectedListing.id, { reason: rejectionReason });
      setListings(listings.filter(l => l.id !== selectedListing.id));
      setShowRejectModal(false);
      setSelectedListing(null);
      setRejectionReason('');
    } catch (err: any) {
      alert(err.message || 'İlan reddedilirken hata oluştu');
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (listing: any) => {
    setSelectedListing(listing);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedListing(null);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">İlan Moderasyonu</h1>
              <p className="mt-1 text-sm text-gray-500">Bekleyen ilanları inceleyin ve onaylayın</p>
            </div>
            <a
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Admin Panel
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <span className="text-6xl">📋</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Bekleyen İlan Yok</h3>
            <p className="mt-2 text-sm text-gray-500">Tüm ilanlar incelenmiş.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        listing.listingType === 'yacht' ? 'bg-blue-100 text-blue-800' :
                        listing.listingType === 'part' ? 'bg-green-100 text-green-800' :
                        listing.listingType === 'marina' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {listing.listingType === 'yacht' ? 'Yat' :
                         listing.listingType === 'part' ? 'Yedek Parça' :
                         listing.listingType === 'marina' ? 'Marina' : 'Mürettebat'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {listing.price.toLocaleString('tr-TR')} {listing.currency}
                    </p>
                    
                    {listing.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                    )}
                    
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <span>📍 {listing.location || 'Konum belirtilmemiş'}</span>
                      <span>👤 {listing.userFirstName} {listing.userLastName}</span>
                      <span>📧 {listing.userEmail}</span>
                    </div>

                    {listing.images && listing.images.length > 0 && (
                      <div className="mt-4 flex gap-2">
                        {listing.images.slice(0, 3).map((image: any) => (
                          <img
                            key={image.id}
                            src={image.url}
                            alt={listing.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <a
                      href={`/listings/${listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-center"
                    >
                      İncele
                    </a>
                    <button
                      onClick={() => handleApprove(listing.id)}
                      disabled={processing === listing.id}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === listing.id ? 'İşleniyor...' : '✓ Onayla'}
                    </button>
                    <button
                      onClick={() => openRejectModal(listing)}
                      disabled={processing === listing.id}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✗ Reddet
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Önceki
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İlanı Reddet</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>{selectedListing.title}</strong> başlıklı ilanı reddetmek istediğinizden emin misiniz?
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Red sebebini belirtin..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleReject}
                disabled={processing === selectedListing.id || !rejectionReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing === selectedListing.id ? 'İşleniyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
