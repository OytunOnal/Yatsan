import Link from 'next/link';

export const metadata = {
  title: 'Gizlilik Politikası - TeknePazari',
  description: 'Kişisel verilerinizin korunması ve gizlilik politikamız hakkında bilgi alın.',
};

export default function PrivacyPage() {
  const lastUpdated = '23 Ocak 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
          <p className="text-gray-600">
            Son güncelleme: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Intro */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-900 mb-0">
              <strong>KVKK Bilgilendirme:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu
              kapsamında, kişisel verileriniz aşağıda açıklanan şekilde işlenmektedir.
              Platformumuzu kullanarak bu politikayı kabul etmiş sayılırsınız.
            </p>
          </div>

          {/* Sections */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Veri Sorumlusu</h2>
            <p className="text-gray-600 mb-4">
              6698 sayılı KVKK kapsamında, kişisel verilerinizin veri sorumlusu <strong>TeknePazari</strong>'dır.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="mb-2"><strong>Şirket:</strong> TeknePazari</p>
              <p className="mb-2"><strong>Adres:</strong> Teknopark İstanbul, Pendik / İstanbul, Türkiye</p>
              <p className="mb-2"><strong>E-posta:</strong> privacy@tekne pazari.com</p>
              <p className="mb-0"><strong>Telefon:</strong> +90 212 123 45 67</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Kişisel Veriler</h2>
            <p className="text-gray-600 mb-4">
              Platformumuzu kullandığınız aşağıdaki kişisel verileriniz toplanmaktadır:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Kimlik Bilgileri</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Ad, soyad</li>
                  <li>• TC Kimlik Numarası (fatura için)</li>
                  <li>• Doğum tarihi</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">İletişim Bilgileri</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• E-posta adresi</li>
                  <li>• Telefon numarası</li>
                  <li>• Adres bilgileri</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Hesap Bilgileri</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Kullanıcı adı</li>
                  <li>• Şifre (şifrelenmiş)</li>
                  <li>• Profil fotoğrafı</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">İşlem Bilgileri</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• İlan verileri</li>
                  <li>• Mesajlaşma geçmişi</li>
                  <li>• İşlem logları</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Verilerin İşlenme Amaçları</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz, aşağıdaki amaçlarla KVKK'nın 5. ve 6. maddeleri uyarınca işlenmektedir:
            </p>
            <ul className="space-y-3">
              {[
                { title: 'Üyelik İşlemleri', desc: 'Hesap oluşturma ve yönetimi' },
                { title: 'İlan Yönetimi', desc: 'İlan oluşturma, düzenleme ve yayınlanması' },
                { title: 'İletişim', desc: 'Kullanıcılar arası mesajlaşma sağlanması' },
                { title: 'Ödeme İşlemleri', desc: 'Premium hizmetlerin sunulması' },
                { title: 'Güvenlik', desc: 'Platform güvenliğinin sağlanması' },
                { title: 'Hukuki Yükümlülükler', desc: 'Kanuni yükümlülüklerin yerine getirilmesi' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </span>
                  <div>
                    <strong className="text-gray-900">{item.title}:</strong>
                    <span className="text-gray-600"> {item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Veri Aktarımı</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz, KVKK'nın 8. ve 9. maddeleri uyarınca aşağıdaki durumlarda aktarılabilir:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Yasal zorunluluklar halinde yetkili kurum ve kuruluşlarla</li>
              <li>• Hizmet sağlayıcılarımızla (ödeme, sunucu vb.)</li>
              <li>• İlan alıcı-satıcıları arasında (ilgili veriler)</li>
              <li>• Açık rızanız bulunan diğer durumlar</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Saklama Süresi</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz, ilgili amaç için gerektiği süre kadar saklanacaktır:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Üyelik hesabı: Hesap kapatılana kadar</li>
              <li>• İlan verileri: İlan yayın süresi + 3 yıl</li>
              <li>• Mesajlar: 2 yıl</li>
              <li>• Finansal kayıtlar: 10 yıl (VUK gereği)</li>
              <li>• Log kayıtları: 2 yıl</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. KVKK Haklarınız</h2>
            <p className="text-gray-600 mb-4">
              KVKK'nın 11. maddesi gereği, aşağıdaki haklara sahipsiniz:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
                'Kişisel verilerinizi işleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
                'Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı kişileri bilme',
                'Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme',
                'Kişisel verilerinizin silinmesini veya yok edilmesini isteme',
                'Kişisel verilerinizin otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
                'Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme',
              ].map((right) => (
                <div key={right} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{right}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 mb-2">
                <strong>Haklarınızı Kullanmak İçin:</strong>
              </p>
              <p className="text-blue-800 mb-0">
                Bu taleplerinizi <strong>privacy@tekne pazari.com</strong> e-posta adresi üzerinden veya
                aşağıdaki form ile bize iletebilirsiniz. Talebiniz en geç 30 gün içinde sonuçlandırılacaktır.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Çerez Politikası</h2>
            <p className="text-gray-600 mb-4">
              Platformumuz, kullanıcı deneyimini iyileştirmek için çerez kullanmaktadır:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Zorunlu Çerezler:</strong> Platformun çalışması için gerekli</li>
              <li>• <strong>Performans Çerezleri:</strong> Kullanım istatistikleri için</li>
              <li>• <strong>Hedefleme Çerezleri:</strong> Kişiselleştirilmiş içerik için</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Tarayıcınızın ayarlarından çerezleri yönetebilirsiniz.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Çocukların Gizliliği</h2>
            <p className="text-gray-600">
              Platformumuz 18 yaşından küçükler için tasarlanmamıştır. 18 yaşından küçüklerin
              kişisel verileri bilerek toplamıyoruz. Ebeveyn veya vasininin çocuğunun platformu
              kullandığını öğrenmesi durumunda, bizimle iletişime geçmesini rica ederiz.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Politika Değişiklikleri</h2>
            <p className="text-gray-600">
              Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler web sitemizde
              yayınlandığı tarihte yürürlüğe girer. Önemli değişikliklerde size e-posta ile bildirimde
              bulunuruz.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sorularınız mı var?</h2>
            <p className="text-gray-600 mb-6">
              Gizlilik politikası hakkında sorularınız için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center"
              >
                İletişime Geç
              </Link>
              <Link
                href="/faq"
                className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 text-center"
              >
                SSS Sayfası
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
