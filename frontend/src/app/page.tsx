import HeroSection from '../components/HeroSection';
import CategoryCard from '../components/CategoryCard';

async function getCategoryCounts() {
  try {
    const res = await fetch('http://localhost:3001/api/listings?status=APPROVED', {
      cache: 'no-store',
    });
    const data = await res.json();
    const listings = data.listings || [];

    const counts = {
      YACHT: listings.filter((l: any) => l.listingType === 'yacht').length,
      PART: listings.filter((l: any) => l.listingType === 'part').length,
      MARINA: listings.filter((l: any) => l.listingType === 'marina').length,
      CREW: listings.filter((l: any) => l.listingType === 'crew').length,
    };

    return counts;
  } catch (error) {
    console.error('Failed to fetch category counts:', error);
    return { YACHT: 0, PART: 0, MARINA: 0, CREW: 0 };
  }
}

export default async function HomePage() {
  const counts = await getCategoryCounts();
  return (
    <div>
      <HeroSection />

      {/* Categories Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Kategorilere Göre İlanlar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun kategoriyi seçin, binlerce ilan arasından aradığınızı bulun.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <CategoryCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19.5v-15A2.5 2.5 0 015.5 2h13A2.5 2.5 0 0121 4.5v15a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5z" />
                </svg>
              }
              title="Yatlar"
              description="Sıfır ve ikinci el yat ilanları"
              category="YACHT"
              count={counts.YACHT}
              color="blue"
            />
            <CategoryCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Yedek Parça"
              description="Yat parçaları ve aksesuarlar"
              category="PART"
              count={counts.PART}
              color="orange"
            />
            <CategoryCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25A9.724 9.724 0 003.75 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-5.385-4.365-9.75-9.75-9.75z" />
                </svg>
              }
              title="Marina"
              description="Marina ve park yeri ilanları"
              category="MARINA"
              count={counts.MARINA}
              color="teal"
            />
            <CategoryCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Mürettebat"
              description="Kaptan ve gemi personeli ilanları"
              category="CREW"
              count={counts.CREW}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Son Eklenen İlanlar
              </h2>
              <p className="text-gray-600">
                En yeni ilanları keşfedin
              </p>
            </div>
            <a
              href="/listings"
              className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Tüm İlanlar
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Placeholder for featured listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-hover group cursor-pointer">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19.5v-15A2.5 2.5 0 015.5 2h13A2.5 2.5 0 0121 4.5v15a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="badge-primary">Yat</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    Örnek Yat İlanı {i}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">İstanbul, Türkiye</p>
                  <p className="text-lg font-bold text-primary-600">
                    €{50 * i},000
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <a
              href="/listings"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Tüm İlanlar
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Hemen İlan Verin, Satışa Başlayın
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Yatınızı, yedek parçalarınızı veya marina yerinizi binlerce potansiyel alıcıya ulaştırın.
              Ücretsiz ilan verin, kolayca satın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/dashboard/listings/new"
                className="btn-primary btn-lg"
              >
                Ücretsiz İlan Ver
              </a>
              <a
                href="/help"
                className="btn-outline btn-lg"
              >
                Nasıl Çalışır?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Güvenli Alışveriş</h3>
              <p className="text-sm text-gray-600">Doğrulanmış ilanlar</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ücretsiz İlan</h3>
              <p className="text-sm text-gray-600">Komisyon yok</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">7/24 Destek</h3>
              <p className="text-sm text-gray-600">Her zaman yanınızdayız</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">B2B & B2C</h3>
              <p className="text-sm text-gray-600">Herkes için açık</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
