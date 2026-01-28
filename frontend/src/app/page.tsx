import HeroSection from '../components/HeroSection';
import CategorySidebar from '../components/CategorySidebar';

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        {/* Content Grid with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <CategorySidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Hero Section with Vitrin */}
            <HeroSection />

            {/* Quick Categories */}
            <section className="mt-8 bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">Popüler Kategoriler</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { icon: '⛵', name: 'Yatlar', href: '/listings?type=yacht', color: 'from-blue-500 to-blue-600' },
                    { icon: '⚙️', name: 'Parçalar', href: '/listings?type=part', color: 'from-gray-500 to-gray-600' },
                    { icon: '⚓', name: 'Marina', href: '/listings?type=marina', color: 'from-cyan-500 to-cyan-600' },
                    { icon: '👥', name: 'Mürettebat', href: '/listings?type=crew', color: 'from-purple-500 to-purple-600' },
                    { icon: '🔧', name: 'Ekipman', href: '/listings?type=equipment', color: 'from-orange-500 to-orange-600' },
                    { icon: '🛠️', name: 'Servis', href: '/listings?type=service', color: 'from-green-500 to-green-600' },
                  ].map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="group flex flex-col items-center p-4 bg-gray-50 hover:bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{category.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="mt-8 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwYzUuNTIzIDAgMTAtNC40NzcgMTAtMTBzLTQuNDc3LTEwLTEwLTEwLTEwIDQuNDc3LTEwIDEwIDQuNDc3IDEwIDEwIDEweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
              
              <div className="relative px-8 py-12 md:py-16">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Ücretsiz İlan Verin</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Hemen İlan Verin, Satışa Başlayın
                  </h2>
                  
                  <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                    Yatınızı, yedek parçalarınızı veya marina yerinizi binlerce potansiyel alıcıya ulaştırın. 
                    Ücretsiz ilan verin, kolayca satın.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href="/dashboard/listings/new"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ücretsiz İlan Ver
                    </a>
                    <a
                      href="/listings"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      İlanları Keşfet
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust Features */}
            <section className="mt-8 bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">Neden Yatsan?</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                      title: 'Güvenli Alışveriş',
                      description: 'Doğrulanmış ilanlar ve kullanıcılarla güvenli ticaret',
                      color: 'bg-blue-100 text-blue-600'
                    },
                    {
                      icon: (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ),
                      title: 'Ücretsiz İlan',
                      description: 'Komisyon yok, gizli ücret yok. Tamamen ücretsiz',
                      color: 'bg-green-100 text-green-600'
                    },
                    {
                      icon: (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ),
                      title: '7/24 Destek',
                      description: 'Her zaman yanınızdayız, sorularınızı cevaplıyoruz',
                      color: 'bg-purple-100 text-purple-600'
                    },
                    {
                      icon: (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      ),
                      title: 'B2B & B2C',
                      description: 'Bireysel ve kurumsal herkes için açık platform',
                      color: 'bg-orange-100 text-orange-600'
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { value: '500+', label: 'Aktif İlan', icon: '📋' },
                    { value: '50+', label: 'Marina', icon: '⚓' },
                    { value: '1000+', label: 'Kullanıcı', icon: '👥' },
                    { value: '24/7', label: 'Destek', icon: '💬' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-4xl mb-3">{stat.icon}</div>
                      <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
