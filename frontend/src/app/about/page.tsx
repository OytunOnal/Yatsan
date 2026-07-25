import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Türkiye'nin en kapsamlı denizcilik platformu
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              TeknePazarı, 2024 yılında denizcilik sektöründeki boşluğu doldurmak amacıyla kuruldu.
              Türkiye'nin dört bir yanındaki deniz tutkunlarını, yat sahiplerini, broker'ları ve
              hizmet sağlayıcıları bir araya getiren modern ve güvenilir bir platform oluşturduk.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Denizcilik sektörüne özgü ihtiyaçları karşılayan uzmanlaşmış bir pazar yeri geliştirdik.
              Yat satın almak, satmak veya kiralamak isteyenler için güvenli ve şeffaf bir ortam sağlıyoruz.
              10 ana kategori ve 1000+ alt kategori ile tekneler, yatlar, yedek parçalar, marina hizmetleri,
              mürettebat, sigorta, ekspertiz ve teknik servisler gibi tüm denizcilik ihtiyaçlarını tek
              platformda topluyoruz.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Türkiye'nin ilk ve en kapsamlı "Güvenli İlan ve Ekosistem Pazaryeri" olarak, telefon ve
              e-posta doğrulama, video doğrulama, HIN dekoder ve ekspertiz hizmetleri ile sektörde
              güven standartlarını yükseltiyoruz. Marina entegrasyonu, servis pazar yeri ve sigorta
              karşılaştırma gibi ekosistem hizmetlerimizle deniz ticaretini kolaylaştırıyoruz.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Misyonumuz</h3>
              <p className="text-gray-600">
                Denizcilik sektöründe alıcı ve satıcıları güvenle bir araya getirerek sektörün
                dijital dönüşümüne öncülük etmek. Dolandırıcılığı önlemek için teknoloji ve
                doğrulama sistemleri ile şeffaf, güvenilir ve kullanıcı dostu bir platformda
                tüm denizcilik ihtiyaçlarını tek çatı altında toplamak.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vizyonumuz</h3>
              <p className="text-gray-600">
                Türkiye denizcilik sektörünün ilk ve en kapsamlı "Güvenli İlan ve Ekosistem
                Pazaryeri" olmak. Denizcilik sektörüne özgü güven sistemleri, dikey uzmanlık
                ve ekosistem entegrasyonları ile pazar lideri olmak. Sektörde standartları
                belirleyerek deniz ticaretinin herkes için erişilebilir ve şeffaf olmasını sağlamak.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Değerlerimiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Güven</h3>
              <p className="text-sm text-gray-600">Kullanıcılarımızın güvenliği en önemli önceliğimiz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Şeffaflık</h3>
              <p className="text-sm text-gray-600">Açık ve net iletişim ile güven inşa ediyoruz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hız</h3>
              <p className="text-sm text-gray-600">Hızlı ve verimli hizmet sunuyoruz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Topluluk</h3>
              <p className="text-sm text-gray-600">Deniz tutkunlarını bir araya getiriyoruz</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-blue-100">Ana Kategori</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-blue-100">Alt Kategori</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">81</div>
                <div className="text-blue-100">Türkiye'nin İli</div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bizi Farklı Kılan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Güven Sistemleri</h3>
                  <p className="text-sm text-gray-600">
                    Telefon ve e-posta doğrulama, video doğrulama, HIN dekoder ve profesyonel
                    ekspertiz hizmetleri ile dolandırıcılığa karşı koruma sağlıyoruz.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ekosistem Entegrasyonu</h3>
                  <p className="text-sm text-gray-600">
                    Marina bağlama rezervasyonu, teknik servis randevu sistemi, sigorta karşılaştırma
                    ve ekspertiz hizmetleri ile tüm denizcilik ihtiyaçlarınız tek platformda.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dikey Uzmanlık</h3>
                  <p className="text-sm text-gray-600">
                    Denizcilik sektörüne özgü filtreler: su çekimi, motor saati, gövde malzemesi,
                    yakıt tipi gibi teknik detaylarla doğru ilanı bulun.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Değerleme</h3>
                  <p className="text-sm text-gray-600">
                    Yapay zeka destekli değerleme sistemi ile teknenizin tahmini piyasa değerini
                    öğrenin, doğru fiyata satış yapın.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aramıza Katılın</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            TeknePazarı ailesine katılın ve Türkiye'nin en kapsamlı denizcilik platformunun
            parçası olun. İlan verin, arama yapın veya hizmet sağlayıcı olarak ekosisteme dahil olun.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ücretsiz Üye Ol
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
