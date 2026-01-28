'use client';

import { useEffect, useState } from 'react';
import { getAdminReports } from '@/lib/api';

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [page, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAdminReports({
        page,
        limit: 20,
        status: statusFilter || undefined
      });
      setReports(response.reports);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || 'Raporlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (report: any) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  const getReportTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'listing': 'İlan Şikayeti',
      'user': 'Kullanıcı Şikayeti',
      'message': 'Mesaj Şikayeti',
      'broker': 'Broker Şikayeti'
    };
    return labels[type] || type;
  };

  const getReportStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'pending': 'Beklemede',
      'reviewing': 'İnceleniyor',
      'resolved': 'Çözüldü',
      'dismissed': 'Reddedildi'
    };
    return labels[status] || status;
  };

  const getReportStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewing': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'dismissed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
              <h1 className="text-3xl font-bold text-gray-900">Şikayet Yönetimi</h1>
              <p className="mt-1 text-sm text-gray-500">Kullanıcı şikayetlerini inceleyin ve çözün</p>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Durum:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tümü</option>
              <option value="pending">Beklemede</option>
              <option value="reviewing">İnceleniyor</option>
              <option value="resolved">Çözüldü</option>
              <option value="dismissed">Reddedildi</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <span className="text-6xl">📋</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Şikayet Bulunamadı</h3>
            <p className="mt-2 text-sm text-gray-500">Seçili kriterlere uygun şikayet yok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getReportStatusColor(report.status)}`}>
                        {getReportStatusLabel(report.status)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                        {getReportTypeLabel(report.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">{report.reason || 'Şikayet'}</h3>
                    
                    {report.description && (
                      <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                    )}

                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 Şikayetçi: {report.reporterName || 'Belirtilmemiş'}</span>
                      <span>📧 {report.reporterEmail || 'Belirtilmemiş'}</span>
                    </div>

                    {report.targetId && (
                      <div className="mt-2 text-sm text-gray-500">
                        🎯 Hedef ID: {report.targetId}
                      </div>
                    )}
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => openDetailModal(report)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      İncele
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

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Şikayet Detayı</h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <p className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded ${getReportStatusColor(selectedReport.status)}`}>
                  {getReportStatusLabel(selectedReport.status)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Tür</label>
                <p className="mt-1 text-sm text-gray-900">{getReportTypeLabel(selectedReport.type)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Sebep</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReport.reason || 'Belirtilmemiş'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Açıklama</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReport.description || 'Belirtilmemiş'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Şikayetçi</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.reporterName || 'Belirtilmemiş'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">E-posta</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.reporterEmail || 'Belirtilmemiş'}</p>
                </div>
              </div>

              {selectedReport.targetId && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Hedef ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.targetId}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedReport.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                {selectedReport.resolvedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Çözülme Tarihi</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedReport.resolvedAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                )}
              </div>

              {selectedReport.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notlar</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
