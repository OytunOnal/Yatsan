import Link from 'next/link';

export const metadata = {
  title: 'Kullanım Şartları - TeknePazari',
  description: 'TeknePazari platformunu kullanırken uymanız gereken şartlar ve koşullar.',
};

export default function TermsPage() {
  const lastUpdated = '23 Ocak 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Şartları</h1>
          <p className="text-gray-600">
            Son güncelleme: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Intro */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-900 mb-0">
              <strong>Önemli:</strong> TeknePazari platformunu kullanarak aşağıdaki kullanım şartlarını
              kabul etmiş sayılırsınız. Lütfen bu şartları dikkatlice okuyun.
            </p>
          </div>

          {/* Sections */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Kabul Edilmiş Şartlar</h2>
            <p className="text-gray-600 mb-4">
              TeknePazari platformuna ("Platform") erişerek ve kullanarak, bu kullanım şartlarını
              ("Şartlar") kabul etmiş olursunuz. Bu Şartları kabul etmiyorsanız, Platform'u kullanmamalısınız.
            </p>
            <p className="text-gray-600">
              Platform, 18 yaşından büyük kişiler tarafından kullanılmak üzere tasarlanmıştır.
              18 yaşından küçükler Platform'u kullanamaz.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hesap ve Güvenlik</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">2.1. Hesap Oluşturma</h3>
                <p className="text-gray-600">
                  Platform'da hesap oluşturmak için doğru, güncel ve tam bilgi sağlamalısınız.
                  Bilgilerinizde herhangi bir değişiklik olması durumunda, bu bilgileri derhal güncellemelisiniz.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">2.2. Hesap Güvenliği</h3>
                <p className="text-gray-600">
                  Hesabınızın güvenliğinden tamamen siz sorumlusunuz. Şifrenizin gizliliğini korumalı
                  ve hesabınıza yetkisiz erişimi önlemelisiniz. Hesabınızda yetkisiz bir kullanım
                  tespit ederseniz, derhal bize bildirmelisiniz.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">2.3. Hesap Limitleri</h3>
                <p className="text-gray-600">
                  Her kişi sadece bir hesap oluşturabilir. Birden fazla hesap oluşturulması
                  durumunda, Platform tüm hesapları kapatma hakkını saklı tutar.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. İlan Verme Kuralları</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">3.1. Doğru Bilgi</h3>
                <p className="text-gray-600">
                  İlanlarınızda doğru, eksiksiz ve yanıltıcı olmayan bilgi sağlamalısınız.
                  Yanlış veya yanıltıcı bilgi veren ilanlar kaldırılacaktır.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">3.2. Yasaklanmış İlanlar</h3>
                <p className="text-gray-600 mb-3">
                  Aşağıdaki türdeki ilanlar verilemez:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Yasa dışı ürün veya hizmetler</li>
                  <li>• Sahte veya kopya ürünler</li>
                  <li>• Başkasının mülkiyetindeki ürünler</li>
                  <li>• Çalıntı veya haksız yere elde edilmiş ürünler</li>
                  <li>• Tehlikeli veya zararlı maddeler</li>
                  <li>• Fikri mülkiyet haklarını ihlal eden içerikler</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">3.3. İlan Resimleri</h3>
                <p className="text-gray-600">
                  İlan resimleri gerçek ürünü yansıtmalıdır. Stok fotoğraf veya başka bir
                  ürüne ait resim kullanılamaz.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Yasaklanmış Davranışlar</h2>
            <p className="text-gray-600 mb-4">
              Platform'u kullanırken aşağıdaki davranışlarda bulunamazsınız:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Platformu yasa dışı amaçlarla kullanmak',
                'Başka kullanıcıların hesaplarına erişmeye çalışmak',
                'Otomatik sistemlerle Platform\'u taramak',
                'Spam, istenmeyen mesajlar göndermek',
                'Bilgisayar virüsü veya zararlı kod yaymak',
                'Platformun işleyişini bozacak davranışlarda bulunmak',
                'Başka kullanıcıların haklarını ihlal etmek',
                'Platform\'u ticari olmayan amaçlarla kullanmak',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Fikri Mülkiyet Hakları</h2>
            <p className="text-gray-600 mb-4">
              Platform'daki tüm içerikler (tasarım, metinler, görseller, logo vb.) TeknePazari'ya
              aittir veya lisans altında kullanılmaktadır. Bu içerikler telif hakkı ile korunmaktadır.
            </p>
            <p className="text-gray-600">
              Platform'da yayınlanan ilanların içeriğinden ilan sahibi sorumludur. İlan içeriğinin
              üçüncü şahısların haklarını ihlal etmesi durumunda, TeknePazari sorumlu tutulamaz.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Ücretler ve Ödemeler</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">6.1. Ücretsiz Hizmetler</h3>
                <p className="text-gray-600">
                  Temel ilan verme hizmeti ücretsizdir. Ücretsiz hesaplarla sınırlı sayıda ilan
                  verebilirsiniz.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">6.2. Ücretli Hizmetler</h3>
                <p className="text-gray-600">
                  Premium ilan paketleri ve ek hizmetler ücretlidir. Ücretler ödeme sırasında
                  bildirilir ve onayınızla birlikte ödeme yükümlülüğünü doğar.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">6.3. İade Politikası</h3>
                <p className="text-gray-600">
                  Ücretli hizmetlerin iadesi, hizmetin kullanılmaması durumunda 14 gün içinde
                  mümkündür. Kullanılmış hizmetler için iade yapılmaz.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sorumluluk Reddi</h2>
            <p className="text-gray-600 mb-4">
              Platform "olduğu gibi" sunulmaktadır. TeknePazari, Platform'un kesintisiz veya
              hatasız olacağını garanti etmez.
            </p>
            <p className="text-gray-600 mb-4">
              TeknePazari, aşağıdaki durumlarda sorumlu tutulamaz:
            </p>
            <ul className="text-gray-600 space-y-1">
              <li>• Kullanıcıların davranışlarından kaynaklanan zararlar</li>
              <li>• İlanların doğruluğu veya kalitesi</li>
              <li>• Kullanıcılar arası anlaşmazlıklar</li>
              <li>• Platform'a yetkisiz erişim veya saldırılar</li>
              <li>• Force majeure durumları (doğal afetler, savaş vb.)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Hesap Feshi ve İptal</h2>
            <p className="text-gray-600 mb-4">
              TeknePazari, aşağıdaki durumlarda hesabınızı askıya alabilir veya kapatabilir:
            </p>
            <ul className="text-gray-600 space-y-1">
              <li>• Bu Şartları ihlal etmeniz</li>
              <li>• Yasa dışı faaliyetlerde bulunmanız</li>
              <li>• Platform'u kötüye kullanmanız</li>
              <li>• Hesabınızın 6 ay boyunca aktif olmaması</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Hesabınızı istediğiniz zaman kapatabilirsiniz. Hesap kapatılması, aktif ilanlarınızın
              sona erdirilmesi anlamına gelir.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Değişiklikler</h2>
            <p className="text-gray-600">
              TeknePazari, bu Şartları herhangi bir zamanda değiştirme hakkını saklı tutar.
              Değişiklikler Platform'da yayınlandığı tarihte yürürlüğe girer. Değişikliklerden
              haberdar olmak için bu sayfayı düzenli olarak kontrol etmelisiniz.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Uygulanabilir Hukuk</h2>
            <p className="text-gray-600">
              Bu Şartlar ve Platform kullanımınız ile ilgili herhangi bir anlaşmazlık, Türkiye
              Cumhuriyeti yasalarına tabidir ve İstanbul mahkemelerinde çözümlenir.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. İletişim</h2>
            <p className="text-gray-600 mb-4">
              Bu Şartlar hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="mb-2"><strong>E-posta:</strong> legal@tekne pazari.com</p>
              <p className="mb-2"><strong>Adres:</strong> Teknopark İstanbul, Pendik / İstanbul, Türkiye</p>
              <p className="mb-0"><strong>Telefon:</strong> +90 212 123 45 67</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Şartları Kabul Ediyorum</h2>
            <p className="text-blue-900 mb-6">
              Platform'a kayıt olarak veya kullanarak, bu kullanım şartlarını okuduğunuzu,
              anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center"
              >
                Üye Ol ve Kabul Et
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 text-center"
              >
                Sorularınız mı var?
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
