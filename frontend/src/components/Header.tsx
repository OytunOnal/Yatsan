'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <header className="h-16 bg-white border-b border-gray-200" />
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200' : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">TeknePazarı</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="İlan, kategori veya marka ara..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Post Ad Button - Desktop */}
            <Link
              href="/dashboard/listings/new"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>İlan Ver</span>
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-primary-600 border border-primary-600 hover:text-primary-700 hover:border-primary-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container py-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <input
                type="search"
                placeholder="İlan, kategori veya marka ara..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <Link
              href="/listings"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tüm İlanlar
            </Link>
            <Link
              href="/listings?category=YACHT"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Yatlar
            </Link>
            <Link
              href="/listings?category=PART"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Yedek Parça
            </Link>
            <Link
              href="/listings?category=MARINA"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marina
            </Link>
            <div className="divider my-3" />
            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-2 px-4 py-3 bg-accent-600 text-white rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              İlan Ver
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 bg-primary-600 text-white rounded-lg font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
