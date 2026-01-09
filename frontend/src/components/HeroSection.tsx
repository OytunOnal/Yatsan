import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-primary text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Türkiye'nin Denizcilik Platformu
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Yat, parça ve marina ilanlarınızı keşfedin. Güvenli ve kolay ticaret deneyimi yaşayın.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/ilan-ver"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            İlan Ver
          </Link>
          <Link
            href="/ilan-ara"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            İlan Ara
          </Link>
        </div>
      </div>
    </section>
  );
}