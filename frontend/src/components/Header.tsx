'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Initialize synchronously by checking localStorage immediately
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-blue-700">
            Yatsan
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center">
          <form action="/listings" method="GET" className="max-w-md w-full">
            <div className="flex">
              <input
                type="text"
                name="search"
                placeholder="İlan ara..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                Ara
              </button>
            </div>
          </form>
        </div>

        {/* Right: Nav and Hamburger */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/listings" className="text-gray-700 hover:text-primary">
              İlanlar
            </Link>
            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary">
                  Giriş
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-primary">
                  Hesap Aç
                </Link>
              </>
            )}
          </nav>
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}