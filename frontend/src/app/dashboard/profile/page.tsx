'use client';

import { useEffect, useState } from 'react';
import { getProfile, updateProfile, UserProfile } from '@/lib/api';
import ProfileForm from '@/components/dashboard/profile/ProfileForm';
import PasswordForm from '@/components/dashboard/profile/PasswordForm';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data.user);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Profil yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }) => {
    try {
      setError(null);
      setSuccessMessage(null);
      const result = await updateProfile(data);
      setProfile(result.user);
      setSuccessMessage('Profil başarıyla güncellendi');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Profil güncellenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600 mt-1">Hesap bilgilerinizi yönetin</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="card p-4 border-l-4 border-success-500 bg-success-50">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-success-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-success-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card p-4 border-l-4 border-error-500">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-error-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-error-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
              {profile?.firstName?.charAt(0) || profile?.email.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {profile?.firstName && profile?.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile?.email}
              </h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Hesap Tipi</span>
              <span className="text-sm font-medium text-gray-900">
                {profile?.userType === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Telefon</span>
              <span className="text-sm font-medium text-gray-900">
                {profile?.phone || 'Belirtilmemiş'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Telefon Doğrulama</span>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                profile?.phoneVerified ? 'text-success-600' : 'text-warning-600'
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {profile?.phoneVerified ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  )}
                </svg>
                {profile?.phoneVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Hesap Durumu</span>
              <span className={`badge-${profile?.status === 'ACTIVE' ? 'success' : 'error'}`}>
                {profile?.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Kayıt Tarihi</span>
              <span className="text-sm font-medium text-gray-900">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR') : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bilgileri Düzenle</h3>
          <ProfileForm profile={profile} onSubmit={handleUpdateProfile} />
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
        <PasswordForm />
      </div>
    </div>
  );
}
