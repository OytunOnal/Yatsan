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
    <section className="bg-gradient-to-r from-blue-500 to-primary text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Türkiye'nin Denizcilik Platformu
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Yat, parça ve marina ilanlarınızı keşfedin. Güvenli ve kolay ticaret deneyimi yaşayın.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleIlanVer}
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            İlan Ver
          </button>
          <a
            href="/listings"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            İlan Ara
          </a>
        </div>
      </div>
    </section>
  );
}