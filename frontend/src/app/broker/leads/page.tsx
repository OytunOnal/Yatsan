'use client';

import { useEffect, useState } from 'react';
import { getLeads, updateLead, getLeadActivities, createActivity } from '@/lib/api';
import { LeadStatus, LeadPriority } from '@/lib/api';

export default function BrokerLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<LeadPriority | ''>('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({
    type: 'call' as const,
    subject: '',
    description: '',
    outcome: 'neutral' as const
  });

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, priorityFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads({
        page,
        limit: 20,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined
      });
      setLeads(response.leads);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = async (lead: any) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
    try {
      const activityData = await getLeadActivities(lead.id);
      setActivities(activityData);
    } catch (err) {
      console.error(err);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLead(null);
    setActivities([]);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLead(leadId, { status: newStatus });
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriorityChange = async (leadId: string, newPriority: LeadPriority) => {
    try {
      await updateLead(leadId, { priority: newPriority });
      setLeads(leads.map(l => l.id === leadId ? { ...l, priority: newPriority } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, priority: newPriority });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openActivityModal = () => {
    setShowActivityModal(true);
  };

  const closeActivityModal = () => {
    setShowActivityModal(false);
    setActivityForm({
      type: 'call',
      subject: '',
      description: '',
      outcome: 'neutral'
    });
  };

  const handleCreateActivity = async () => {
    if (!selectedLead) return;

    try {
      const newActivity = await createActivity(selectedLead.id, activityForm);
      setActivities([newActivity, ...activities]);
      closeActivityModal();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusLabel = (status: LeadStatus): string => {
    const labels: Record<LeadStatus, string> = {
      'NEW': 'Yeni',
      'CONTACTED': 'İletişime Geçildi',
      'QUALIFIED': 'Nitelikli',
      'PROPOSAL': 'Teklif',
      'NEGOTIATION': 'Görüşme',
      'WON': 'Kazanıldı',
      'LOST': 'Kaybedildi'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: LeadStatus): string => {
    const colors: Record<LeadStatus, string> = {
      'NEW': 'bg-blue-100 text-blue-800',
      'CONTACTED': 'bg-purple-100 text-purple-800',
      'QUALIFIED': 'bg-green-100 text-green-800',
      'PROPOSAL': 'bg-yellow-100 text-yellow-800',
      'NEGOTIATION': 'bg-orange-100 text-orange-800',
      'WON': 'bg-green-200 text-green-900',
      'LOST': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: LeadPriority): string => {
    const labels: Record<LeadPriority, string> = {
      'LOW': 'Düşük',
      'MEDIUM': 'Orta',
      'HIGH': 'Yüksek',
      'URGENT': 'Acil'
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority: LeadPriority): string => {
    const colors: Record<LeadPriority, string> = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
              <h1 className="text-3xl font-bold text-gray-900">Lead Yönetimi</h1>
              <p className="mt-1 text-sm text-gray-500">CRM lead'lerini yönetin</p>
            </div>
            <a
              href="/broker/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Kurumsal Panel
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="NEW">Yeni</option>
              <option value="CONTACTED">İletişime Geçildi</option>
              <option value="QUALIFIED">Nitelikli</option>
              <option value="PROPOSAL">Teklif</option>
              <option value="NEGOTIATION">Görüşme</option>
              <option value="WON">Kazanıldı</option>
              <option value="LOST">Kaybedildi</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as LeadPriority | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="LOW">Düşük</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yüksek</option>
              <option value="URGENT">Acil</option>
            </select>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <span className="text-6xl">👥</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Lead Bulunamadı</h3>
            <p className="mt-2 text-sm text-gray-500">Henüz lead yok veya filtreleme sonucu boş.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaynak
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetailModal(lead)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      {lead.listingTitle && (
                        <div className="text-sm text-gray-500">{lead.listingTitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(lead.priority)}`}>
                        {getPriorityLabel(lead.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(lead);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Detayı</h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lead Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefon</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Kaynak</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.source}</p>
                </div>
                {selectedLead.listingTitle && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">İlgili İlan</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.listingTitle}</p>
                  </div>
                )}
              </div>

              {/* Status & Priority */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NEW">Yeni</option>
                    <option value="CONTACTED">İletişime Geçildi</option>
                    <option value="QUALIFIED">Nitelikli</option>
                    <option value="PROPOSAL">Teklif</option>
                    <option value="NEGOTIATION">Görüşme</option>
                    <option value="WON">Kazanıldı</option>
                    <option value="LOST">Kaybedildi</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Öncelik</label>
                  <select
                    value={selectedLead.priority}
                    onChange={(e) => handlePriorityChange(selectedLead.id, e.target.value as LeadPriority)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Düşük</option>
                    <option value="MEDIUM">Orta</option>
                    <option value="HIGH">Yüksek</option>
                    <option value="URGENT">Acil</option>
                  </select>
                </div>
                {selectedLead.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notlar</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activities */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900">Aktiviteler</h4>
                <button
                  onClick={openActivityModal}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                >
                  + Aktivite Ekle
                </button>
              </div>
              {activities.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Henüz aktivite yok</p>
              ) : (
                <div className="space-y-2">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">
                        {activity.type === 'call' ? '📞' :
                         activity.type === 'email' ? '📧' :
                         activity.type === 'meeting' ? '🤝' :
                         activity.type === 'note' ? '📝' :
                         activity.type === 'message' ? '💬' : '📱'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                        {activity.description && (
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
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

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Aktivite</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tür</label>
                <select
                  value={activityForm.type}
                  onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as any })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="call">📞 Telefon</option>
                  <option value="email">📧 Email</option>
                  <option value="meeting">🤝 Görüşme</option>
                  <option value="note">📝 Not</option>
                  <option value="message">💬 Mesaj</option>
                  <option value="whatsapp">📱 WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Konu</label>
                <input
                  type="text"
                  value={activityForm.subject}
                  onChange={(e) => setActivityForm({ ...activityForm, subject: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sonuç</label>
                <select
                  value={activityForm.outcome}
                  onChange={(e) => setActivityForm({ ...activityForm, outcome: e.target.value as any })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="neutral">Nötr</option>
                  <option value="positive">Olumlu</option>
                  <option value="negative">Olumsuz</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeActivityModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={handleCreateActivity}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
