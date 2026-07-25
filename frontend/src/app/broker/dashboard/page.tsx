'use client';

import { useEffect, useState } from 'react';
import { getBrokerProfile, getBrokerAnalytics, getLeads } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function BrokerDashboard() {
  const router = useRouter();
  const [broker, setBroker] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileData, analyticsData, leadsData] = await Promise.all([
        getBrokerProfile(),
        getBrokerAnalytics(),
        getLeads({ limit: 5 })
      ]);
      setBroker(profileData.broker);
      setAnalytics(analyticsData);
      setLeads(leadsData.leads);
    } catch (err: any) {
      if (err.response?.status === 403) {
        router.push('/dashboard');
        return;
      }
      setError(err.message || 'Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
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

  const statCards = [
    {
      title: 'Toplam İlan',
      value: analytics?.listings.totalListings || 0,
      icon: '📋',
      color: 'bg-blue-500'
    },
    {
      title: 'Toplam Görüntülenme',
      value: analytics?.listings.totalViews || 0,
      icon: '👁️',
      color: 'bg-green-500'
    },
    {
      title: 'Toplam Lead',
      value: analytics?.listings.totalLeads || 0,
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      title: 'Değerlendirme',
      value: analytics?.reviews.averageRating || 0,
      suffix: '/5',
      icon: '⭐',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kurumsal Panel</h1>
              <p className="mt-1 text-sm text-gray-500">
                {broker?.businessName || 'Kurumsal Hesap'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-sm font-medium rounded ${
                broker?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                broker?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {broker?.status === 'APPROVED' ? '✅ Onaylı' :
                 broker?.status === 'PENDING' ? '⏳ Onay Bekliyor' : '❌ Reddedildi'}
              </span>
              <a
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {broker?.status === 'PENDING' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            ⏳ Hesabınız inceleniyor. Admin onayı sonrası kurumsal özelliklere erişebileceksiniz.
          </div>
        )}

        {broker?.status === 'REJECTED' && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            ❌ Hesabınız reddedildi. {broker?.rejectionReason || 'Lütfen destek ile iletişime geçin.'}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value.toLocaleString('tr-TR')}{card.suffix || ''}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Son Lead'ler */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Son Lead'ler</h3>
              <a
                href="/broker/leads"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Tümünü Gör →
              </a>
            </div>
            {leads.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Henüz lead yok</p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      lead.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      lead.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.priority === 'HIGH' ? 'Yüksek' :
                       lead.priority === 'MEDIUM' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lead Durum Dağılımı */}
          {analytics?.leads.byStatus && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Durum Dağılımı</h3>
              <div className="space-y-3">
                {Object.entries(analytics.leads.byStatus).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {status === 'NEW' ? 'Yeni' :
                       status === 'CONTACTED' ? 'İletişime Geçildi' :
                       status === 'QUALIFIED' ? 'Nitelikli' :
                       status === 'PROPOSAL' ? 'Teklif' :
                       status === 'NEGOTIATION' ? 'Görüşme' :
                       status === 'WON' ? 'Kazanıldı' : 'Kaybedildi'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hızlı İşlemler */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/listings/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <p className="font-medium text-gray-900">Yeni İlan</p>
                <p className="text-sm text-gray-500">İlan oluşturun</p>
              </div>
            </a>
            <a
              href="/broker/leads"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <p className="font-medium text-gray-900">Lead Yönetimi</p>
                <p className="text-sm text-gray-500">CRM paneli</p>
              </div>
            </a>
            <a
              href="/broker/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <p className="font-medium text-gray-900">Profil Ayarları</p>
                <p className="text-sm text-gray-500">Kurumsal bilgiler</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
