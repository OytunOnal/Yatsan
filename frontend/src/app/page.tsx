import HeroSection from '../components/HeroSection';
import CategoryCard from '../components/CategoryCard';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Search Bar */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="İlan ara..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                Ara
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Kategoriler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <CategoryCard
              icon={<span className="text-4xl">⛵</span>}
              title="Yat"
              description="Yat ilanlarını keşfedin ve hayalinizdeki tekneyi bulun."
            />
            <CategoryCard
              icon={<span className="text-4xl">🔧</span>}
              title="Parça"
              description="Yat parçaları ve aksesuarları için en iyi teklifler."
            />
            <CategoryCard
              icon={<span className="text-4xl">⚓</span>}
              title="Marina"
              description="Marina hizmetleri ve yer rezervasyonları."
            />
          </div>
        </div>
      </section>

      {/* Featured Listings Placeholder */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Öne Çıkan İlanlar
          </h2>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Öne çıkan ilanlar yakında burada görünecek.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-500">İlan Görseli</span>
                  </div>
                  <h3 className="font-semibold mb-2">İlan Başlığı {i}</h3>
                  <p className="text-gray-600 text-sm">İlan açıklaması burada olacak.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}