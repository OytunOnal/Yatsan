'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    pendingListings: 0,
    approvedListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch stats from API
    // For now, mock data
    setStats({
      totalListings: 12,
      pendingListings: 3,
      approvedListings: 9,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz!</h1>
        <p className="text-gray-600 mt-2">Kontrol Paneli'nde güncel bilgilerinizi görebilirsiniz.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen İlan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Onaylanan İlan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approvedListings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/listings?new=true"
            className="flex items-center justify-center p-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl block mb-2">➕</span>
              <span className="font-medium">Yeni İlan Ekle</span>
            </div>
          </Link>

          <Link
            href="/dashboard/listings"
            className="flex items-center justify-center p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl block mb-2">📋</span>
              <span className="font-medium">İlanlarımı Yönet</span>
            </div>
          </Link>

          <Link
            href="/dashboard/messages"
            className="flex items-center justify-center p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl block mb-2">💬</span>
              <span className="font-medium">Mesajlar</span>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center justify-center p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className="text-center">
              <span className="text-2xl block mb-2">⚙️</span>
              <span className="font-medium">Ayarlar</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}