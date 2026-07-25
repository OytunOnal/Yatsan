'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    category: 'Genel',
    question: 'TeknePazari nedir?',
    answer: 'TeknePazari, deniz araçları, yedek parçalar, marina yerleri ve mürettebat ilanları için Türkiye\'nin en kapsamlı online pazar yeridir. Platformumuz, alıcıları ve satıcıları güvenli bir şekilde bir araya getirir.',
  },
  {
    id: '2',
    category: 'Genel',
    question: 'İlan vermek ücretli mi?',
    answer: 'Hayır, temel ilan verme ücretsizdir. İlanınızı ücretsiz olarak oluşturabilir ve binlerce potansiyel alıcıya ulaşabilirsiniz. İlanınızı daha görünür kılmak isterseniz, ücretli premium paketlerimizi de tercih edebilirsiniz.',
  },
  {
    id: '3',
    category: 'İlan Verme',
    question: 'İlan nasıl veririm?',
    answer: 'İlan vermek için öncelikle üye olmanız gerekir. Üyelik işlemi tamamlandıktan sonra "Yeni İlan" butonuna tıklayarak ilan türünüzü (Yat, Yedek Parça, Marina veya Mürettebat) seçin ve gerekli bilgileri doldurun.',
  },
  {
    id: '4',
    category: 'İlan Verme',
    question: 'İlanıma kaç resim ekleyebilirim?',
    answer: 'Her ilana en fazla 20 adet resim ekleyebilirsiniz. Yüksek kaliteli ve iyi aydınlatılmış fotoğraflar, ilanınızın daha dikkat çekmesini sağlar.',
  },
  {
    id: '5',
    category: 'İlan Verme',
    question: 'İlanımı nasıl düzenlerim veya silerim?',
    answer: 'İlanlarınızı Dashboard > İlanlarım sayfasından yönetebilirsiniz. İlanınızın detayına giderek "Düzenle" butonuyla içerik güncellemesi yapabilir veya "Sil" butonuyla ilanınızı kaldırabilirsiniz.',
  },
  {
    id: '6',
    category: 'Satın Alma',
    question: 'İlan sahibiyle nasıl iletişime geçerim?',
    answer: 'İlan detay sayfasında "İletişime Geç" butonunu tıklayarak ilan sahibine mesaj gönderebilirsiniz. Mesajlaşma sistemi üzerinden güvenli bir şekilde iletişim kurabilirsiniz.',
  },
  {
    id: '7',
    category: 'Satın Alma',
    question: 'İlanların doğruluğu nasıl kontrol ediliyor?',
    answer: 'Tüm ilanlar admin ekibimiz tarafından incelenir. Telefon numarası doğrulaması ve gerekli durumlarda ekspertiz hizmeti ile ilanların güvenilirliğini sağlıyoruz.',
  },
  {
    id: '8',
    category: 'Ödeme',
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Premium ilan paketleri için kredi kartı, banka transferi ve iyzico üzerinden güvenli ödeme seçeneklerimiz mevcuttur.',
  },
  {
    id: '9',
    category: 'Ödeme',
    question: 'Premium paketler neler içeriyor?',
    answer: 'Premium paketler ilanınızın öne çıkmasını sağlar. Özellikler arasında: Ana sayfada görüntüleme, aramalarda üst sırada çıkma, vurgulama ve daha fazla görünürlük yer alır.',
  },
  {
    id: '10',
    category: 'Güvenlik',
    question: 'KVKK uyumlu musunuz?',
    answer: 'Evet, platformumuz tamamen KVKK (Kişisel Verilerin Korunması Kanunu) uyumludur. Kişisel verileriniz 6698 sayılı kanuna uygun olarak işlenir ve korunur.',
  },
  {
    id: '11',
    category: 'Güvenlik',
    question: 'Verilerim güvende mi?',
    answer: 'Evet, SSL sertifikası ile şifrelenmiş bağlantı kullanıyoruz. Verileriniz güvenli sunucularda saklanır ve üçüncü şahıslarla paylaşılmaz.',
  },
  {
    id: '12',
    category: 'Teknik',
    question: 'Mobil uygulamanız var mı?',
    answer: 'Mobil uygulamamız şu anda geliştirme aşamasındadır. Yakında App Store ve Google Play\'den indirebilirsiniz. Şu anda mobil tarayıcı üzerinden platformumuzu kullanabilirsiniz.',
  },
];

const categories = ['Tümü', 'Genel', 'İlan Verme', 'Satın Alma', 'Ödeme', 'Güvenlik', 'Teknik'];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQs = activeCategory === 'Tümü' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const toggleAll = () => {
    if (openItems.size === filteredFAQs.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(filteredFAQs.map(f => f.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Platformumuz hakkında merak ettiğiniz her şeyi burada bulabilirsiniz.
            Aradığınız cevabı bulamazsanız, destek ekibimizle iletişime geçin.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenItems(new Set());
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Expand/Collapse All */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {openItems.size === filteredFAQs.length ? 'Tümünü Kapat' : 'Tümünü Aç'}
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${
                    openItems.has(faq.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openItems.has(faq.id) && (
                <div className="px-6 pb-4 pt-0">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cevabınızı bulamadınız mı?
          </h2>
          <p className="text-gray-600 mb-6">
            Destek ekibimiz size yardımcı olmak için hazır.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              İletişime Geç
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
