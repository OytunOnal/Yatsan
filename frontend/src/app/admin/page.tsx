'use client';

import { useEffect, useState } from 'react';
import { getPlatformStats, getAdminAnalytics } from '@/lib/api';
import { PlatformStats } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, analyticsData] = await Promise.all([
          getPlatformStats(),
          getAdminAnalytics({ period: '30d' })
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err.message || 'Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats?.users.totalUsers || 0,
      change: `+${stats?.users.newUsersThisMonth || 0} bu ay`,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Aktif Kullanıcı',
      value: stats?.users.activeUsers || 0,
      change: '%75 aktif',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Toplam İlan',
      value: stats?.listings.totalListings || 0,
      change: `+${stats?.listings.newListingsThisMonth || 0} bu ay`,
      icon: '📋',
      color: 'bg-purple-500'
    },
    {
      title: 'Bekleyen İlan',
      value: stats?.listings.pendingListings || 0,
      change: 'Onay bekliyor',
      icon: '⏳',
      color: 'bg-yellow-500'
    },
    {
      title: 'Toplam Mesaj',
      value: stats?.messages.totalMessages || 0,
      change: `${stats?.messages.unreadMessages || 0} okunmamış`,
      icon: '💬',
      color: 'bg-pink-500'
    },
    {
      title: 'Toplam Broker',
      value: stats?.brokers.totalBrokers || 0,
      change: `${stats?.brokers.pendingBrokers || 0} bekleyen`,
      icon: '🏪',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Platform istatistikleri ve yönetim paneli</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value.toLocaleString('tr-TR')}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/admin/listings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📋</span>
              <div>
                <p className="font-medium text-gray-900">İlan Yönetimi</p>
                <p className="text-sm text-gray-500">{stats?.listings.pendingListings || 0} bekleyen</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <p className="font-medium text-gray-900">Kullanıcı Yönetimi</p>
                <p className="text-sm text-gray-500">{stats?.users.totalUsers || 0} kullanıcı</p>
              </div>
            </a>
            <a
              href="/admin/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📁</span>
              <div>
                <p className="font-medium text-gray-900">Kategori Yönetimi</p>
                <p className="text-sm text-gray-500">Önerileri değerlendir</p>
              </div>
            </a>
            <a
              href="/admin/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div>
                <p className="font-medium text-gray-900">Analitik</p>
                <p className="text-sm text-gray-500">Detaylı raporlar</p>
              </div>
            </a>
          </div>
        </div>

        {/* Charts Section */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Listings */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük İlanlar</h3>
              <div className="space-y-2">
                {analytics.dailyListings?.slice(-7).map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((item.count / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Listing by Type */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlanlara Göre Dağılım</h3>
              <div className="space-y-3">
                {analytics.listingByType?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{item.type === 'yacht' ? 'Yat' : item.type === 'part' ? 'Yedek Parça' : item.type === 'marina' ? 'Marina' : 'Mürettebat'}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${Math.min((item.count / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
