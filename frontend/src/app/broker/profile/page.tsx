'use client';

import { useEffect, useState } from 'react';
import { getBrokerProfile, updateBrokerProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function BrokerProfilePage() {
  const router = useRouter();
  const [broker, setBroker] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    logo: '',
    coverImage: '',
    description: '',
    specialties: [] as string[],
    languages: [] as string[],
    serviceAreas: [] as string[],
    website: '',
    whatsapp: '',
    establishedYear: '',
    teamSize: '',
    certifications: [] as string[],
    awards: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getBrokerProfile();
      setBroker(data.broker);
      setProfile(data.profile);

      if (data.profile) {
        setFormData({
          logo: data.profile.logo || '',
          coverImage: data.profile.coverImage || '',
          description: data.profile.description || '',
          specialties: data.profile.specialties || [],
          languages: data.profile.languages || [],
          serviceAreas: data.profile.serviceAreas || [],
          website: data.profile.website || '',
          whatsapp: data.profile.whatsapp || '',
          establishedYear: data.profile.establishedYear?.toString() || '',
          teamSize: data.profile.teamSize?.toString() || '',
          certifications: data.profile.certifications || [],
          awards: data.profile.awards || []
        });
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        router.push('/dashboard');
        return;
      }
      setError(err.message || 'Profil yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateBrokerProfile({
        ...formData,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (field: 'specialties' | 'languages' | 'serviceAreas' | 'certifications' | 'awards', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData({ ...formData, [field]: items });
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
              <h1 className="text-3xl font-bold text-gray-900">Kurumsal Profil</h1>
              <p className="mt-1 text-sm text-gray-500">
                {broker?.businessName || 'Kurumsal Hesap'}
              </p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {broker?.status === 'PENDING' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            ⏳ Hesabınız inceleniyor. Profil bilgilerinizi tamamladıktan sonra admin onayı bekleniyor.
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Profil başarıyla güncellendi!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo & Cover */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Görseller</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Şirket Bilgileri</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kuruluş Yılı</label>
                <input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2010"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Takım Büyüklüğü</label>
                <input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hakkında</h3>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şirketiniz hakkında bilgi verin..."
            />
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h3>
            <input
              type="text"
              value={formData.specialties.join(', ')}
              onChange={(e) => handleArrayChange('specialties', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Yat, Yelkenli, Motor, Kiralama..."
            />
            <p className="mt-1 text-sm text-gray-500">Virgülle ayırarak birden fazla alan ekleyin</p>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Diller</h3>
            <input
              type="text"
              value={formData.languages.join(', ')}
              onChange={(e) => handleArrayChange('languages', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Türkçe, İngilizce, Almanca..."
            />
            <p className="mt-1 text-sm text-gray-500">Virgülle ayırarak birden fazla dil ekleyin</p>
          </div>

          {/* Service Areas */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hizmet Bölgeleri</h3>
            <input
              type="text"
              value={formData.serviceAreas.join(', ')}
              onChange={(e) => handleArrayChange('serviceAreas', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="İstanbul, Bodrum, Marmaris..."
            />
            <p className="mt-1 text-sm text-gray-500">Virgülle ayırarak birden fazla bölge ekleyin</p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="905555555555"
                />
              </div>
            </div>
          </div>

          {/* Certifications & Awards */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sertifikalar & Ödüller</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sertifikalar</label>
                <input
                  type="text"
                  value={formData.certifications.join(', ')}
                  onChange={(e) => handleArrayChange('certifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ISO 9001, TÜRSAD..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ödüller</label>
                <input
                  type="text"
                  value={formData.awards.join(', ')}
                  onChange={(e) => handleArrayChange('awards', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yılın Brokeri 2023..."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <a
              href="/broker/dashboard"
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </a>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
