'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBrokerBySlug, getBrokerListings, createBrokerReview } from '@/lib/api';

export default function BrokerStorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [broker, setBroker] = useState<any | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Review form
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brokerData, listingsData] = await Promise.all([
        getBrokerBySlug(slug),
        getBrokerListings(slug, { page, limit: 12 })
      ]);
      setBroker(brokerData.broker);
      setReviews(brokerData.reviews || []);
      setListings(listingsData.listings);
    } catch (err: any) {
      setError(err.message || 'Broker bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setError(null);

    try {
      await createBrokerReview({
        brokerId: broker?.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      });
      setReviewSuccess(true);
      setReviewForm({ rating: 5, title: '', comment: '' });
      setTimeout(() => setReviewSuccess(false), 3000);
      fetchData(); // Refresh to show new review
    } catch (err: any) {
      setError(err.response?.data?.message || 'Değerlendirme gönderilemedi');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !broker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Broker bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      {broker.coverImage && (
        <div className="h-64 bg-gray-200 relative">
          <img
            src={broker.coverImage}
            alt={broker.businessName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start gap-6">
            {broker.logo && (
              <div className="flex-shrink-0">
                <img
                  src={broker.logo}
                  alt={broker.businessName}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{broker.businessName}</h1>
              {broker.description && (
                <p className="mt-2 text-gray-600">{broker.description}</p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="font-medium text-gray-900">{broker.rating}</span>
                  <span className="text-gray-500">({broker.reviewCount} değerlendirme)</span>
                </div>
                {broker.responseRate && (
                  <div className="text-sm text-gray-500">
                    Yanıt Oranı: %{broker.responseRate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 flex flex-wrap gap-4">
            {broker.whatsapp && (
              <a
                href={`https://wa.me/${broker.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <span>💬</span> WhatsApp
              </a>
            )}
            {broker.website && (
              <a
                href={broker.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <span>🌐</span> Website
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {(broker.specialties && broker.specialties.length > 0) ||
             (broker.serviceAreas && broker.serviceAreas.length > 0) ||
             (broker.languages && broker.languages.length > 0) ? (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hakkımızda</h3>
                {broker.specialties && broker.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları</p>
                    <div className="flex flex-wrap gap-2">
                      {broker.specialties.map((spec: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {broker.serviceAreas && broker.serviceAreas.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Hizmet Bölgeleri</p>
                    <div className="flex flex-wrap gap-2">
                      {broker.serviceAreas.map((area: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {broker.languages && broker.languages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Diller</p>
                    <div className="flex flex-wrap gap-2">
                      {broker.languages.map((lang: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Listings */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlanlar ({listings.length})</h3>
              {listings.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Henüz ilan yok</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listings.map((listing) => (
                    <a
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {listing.images && listing.images.length > 0 && (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 truncate">{listing.title}</h4>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {listing.price.toLocaleString('tr-TR')} {listing.currency}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{listing.location || 'Konum belirtilmemiş'}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              {listings.length > 0 && listings.length >= 12 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    Daha Fazla Göster
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Değerlendirmeler</h3>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Henüz değerlendirme yok</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-500">
                          {'⭐'.repeat(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      {review.title && (
                        <p className="font-medium text-gray-900">{review.title}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                      {review.response && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <span className="font-medium">Yanıt:</span> {review.response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Değerlendirme Yap</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Puanınız</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className={`text-2xl ${reviewForm.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Harika deneyim"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yorumunuz</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deneyiminizi paylaşın..."
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                {reviewSuccess && (
                  <p className="text-sm text-green-600">Değerlendirmeniz için teşekkürler!</p>
                )}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            </div>

            {/* Certifications & Awards */}
            {(broker.certifications && broker.certifications.length > 0) ||
             (broker.awards && broker.awards.length > 0) ? (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sertifikalar & Ödüller</h3>
                {broker.certifications && broker.certifications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Sertifikalar</p>
                    <ul className="space-y-1">
                      {broker.certifications.map((cert: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <span>📜</span> {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {broker.awards && broker.awards.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Ödüller</p>
                    <ul className="space-y-1">
                      {broker.awards.map((award: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <span>🏆</span> {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
