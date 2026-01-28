'use client';

import { useEffect, useState } from 'react';
import { getAdminAnalytics } from '@/lib/api';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAdminAnalytics({ period });
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Analitik veriler yüklenirken hata oluştu');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analitik</h1>
              <p className="mt-1 text-sm text-gray-500">Platform performans metrikleri ve raporları</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
              </select>
              <a
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {analytics && (
          <div className="space-y-6">
            {/* Daily Listings Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük İlan Ekleme Trendi</h3>
              <div className="space-y-3">
                {analytics.dailyListings?.map((item: any, index: number) => {
                  const maxCount = Math.max(...analytics.dailyListings.map((d: any) => d.count), 1);
                  const percentage = (item.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div
                          className="bg-blue-600 h-6 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Users Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Kullanıcı Kayıt Trendi</h3>
              <div className="space-y-3">
                {analytics.dailyUsers?.map((item: any, index: number) => {
                  const maxCount = Math.max(...analytics.dailyUsers.map((d: any) => d.count), 1);
                  const percentage = (item.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div
                          className="bg-green-600 h-6 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Listing by Type */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Türüne Göre Dağılım</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.listingByType?.map((item: any, index: number) => {
                  const colors = [
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-purple-500',
                    'bg-orange-500'
                  ];
                  const typeNames: Record<string, string> = {
                    'yacht': 'Yat',
                    'part': 'Yedek Parça',
                    'marina': 'Marina',
                    'crew': 'Mürettebat'
                  };
                  
                  return (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`w-16 h-16 ${colors[index]} rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold`}>
                        {item.count}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{typeNames[item.type] || item.type}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Users by Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Durum Dağılımı</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.usersByStatus?.map((item: any, index: number) => {
                  const statusColors: Record<string, string> = {
                    'ACTIVE': 'bg-green-500',
                    'INACTIVE': 'bg-gray-400',
                    'SUSPENDED': 'bg-red-500'
                  };
                  const statusNames: Record<string, string> = {
                    'ACTIVE': 'Aktif',
                    'INACTIVE': 'Pasif',
                    'SUSPENDED': 'Askıya Alındı'
                  };
                  
                  return (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`w-16 h-16 ${statusColors[item.status] || 'bg-gray-400'} rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold`}>
                        {item.count}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{statusNames[item.status] || item.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Toplam İlan</p>
                    <p className="text-3xl font-bold mt-2">
                      {analytics.dailyListings?.reduce((sum: number, item: any) => sum + item.count, 0) || 0}
                    </p>
                  </div>
                  <span className="text-4xl">📋</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Toplam Yeni Kullanıcı</p>
                    <p className="text-3xl font-bold mt-2">
                      {analytics.dailyUsers?.reduce((sum: number, item: any) => sum + item.count, 0) || 0}
                    </p>
                  </div>
                  <span className="text-4xl">👥</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Ortalama Günlük İlan</p>
                    <p className="text-3xl font-bold mt-2">
                      {analytics.dailyListings?.length > 0 
                        ? Math.round(analytics.dailyListings.reduce((sum: number, item: any) => sum + item.count, 0) / analytics.dailyListings.length)
                        : 0}
                    </p>
                  </div>
                  <span className="text-4xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
