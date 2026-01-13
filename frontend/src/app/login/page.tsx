'use client';

import { useEffect } from 'react';
import LoginForm from '../../components/forms/LoginForm';

export default function LoginPage() {
  useEffect(() => {
    // Sayfa yüklendiğinde header'daki giriş butonuna focus ver
    const loginButton = document.querySelector('a[href="/login"]') as HTMLAnchorElement;
    if (loginButton) {
      loginButton.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">Yatsan</span>
          </a>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Hoş Geldiniz
            </h1>
            <p className="text-gray-600">
              Hesabınıza giriş yaparak ilanlarınızı yönetin
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana sayfaya dön
          </a>
        </div>
      </div>
    </div>
  );
}
