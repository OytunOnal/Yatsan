'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNewMessage: true,
    emailNewListing: false,
    emailPromotional: false,
    pushNewMessage: true,
    pushNewListing: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-1">Hesap ve uygulama tercihlerinizi yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h2>
          <p className="text-sm text-gray-600 mb-6">
            Hangi bildirimleri almak istediğinizi seçin
          </p>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">E-posta Bildirimleri</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yeni Mesaj</p>
                    <p className="text-xs text-gray-500">Yeni mesaj aldığınızda e-posta bildirimi alın</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.emailNewMessage}
                      onChange={(e) => handleNotificationChange('emailNewMessage', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yeni İlan</p>
                    <p className="text-xs text-gray-500">İlgilendiğiniz kategorilerde yeni ilan eklendiğinde bildirim alın</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.emailNewListing}
                      onChange={(e) => handleNotificationChange('emailNewListing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Promosyonlar</p>
                    <p className="text-xs text-gray-500">Promosyon ve kampanya e-postaları alın</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.emailPromotional}
                      onChange={(e) => handleNotificationChange('emailPromotional', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tarayıcı Bildirimleri</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yeni Mesaj</p>
                    <p className="text-xs text-gray-500">Yeni mesajlar için tarayıcı bildirimi alın</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.pushNewMessage}
                      onChange={(e) => handleNotificationChange('pushNewMessage', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yeni İlan</p>
                    <p className="text-xs text-gray-500">İlgilendiğiniz ilanlar için bildirim alın</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifications.pushNewListing}
                      onChange={(e) => handleNotificationChange('pushNewListing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hesap Bilgileri</h2>
            <p className="text-sm text-gray-600 mb-4">
              Hesabınızla ilgili temel bilgiler
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Üyelik Tarihi</span>
                <span className="text-sm font-medium text-gray-900">Ocak 2024</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Hesap Durumu</span>
                <span className="badge-success">Aktif</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600">KVKK Onayı</span>
                <span className="badge-success">Onaylandı</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-6 border-l-4 border-error-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hesabı Sil</h2>
            <p className="text-sm text-gray-600 mb-4">
              Hesabınızı silerek tüm verilerinizi kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.
            </p>
            <button className="btn-outline border-error-500 text-error-600 hover:bg-error-50 hover:border-error-600">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary">
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}
