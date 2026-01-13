'use client';

import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  const handleIlanVer = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard/listings/new');
    } else {
      router.push('/login?redirect=/dashboard/listings/new');
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
      <div className="container py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-sm font-medium">
              Türkiye'nin Denizcilik Pazar Yeri
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Hayalinizdeki Yatı
            <br />
            <span className="text-accent-400">Burada Bulun</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Sıfır ve ikinci el yatlar, yedek parçalar, marina yerleri ve mürettebat ilanları.
            Güvenli alışveriş, binlerce ilan.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form action="/listings" method="GET" className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Yat, parça veya marina ara..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                Ara
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleIlanVer}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ücretsiz İlan Ver
            </button>
            <a
              href="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              İlanları Keşfet
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-primary-200">Aktif İlan</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-primary-200">Marina</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm text-primary-200">Mutlu Kullanıcı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative h-16 bg-gray-50">
        <svg className="absolute top-0 left-0 w-full h-16 -translate-y-full text-gray-50 fill-current" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path d="M0,22L48,26.7C96,32,192,42,288,42.7C384,44,480,36,576,32C672,28,768,28,864,32C960,36,1056,44,1152,42.7C1248,42,1344,32,1392,26.7L1440,22L1440,54L1392,54C1344,54,1248,54,1152,54C1056,54,960,54,864,54C768,54,672,54,576,54C480,54,384,54,288,54C192,54,96,54,48,54L0,54Z" />
        </svg>
      </div>
    </section>
  );
}
