export default function KVKKPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Kişisel Verilerin Korunması Kanunu Aydınlatma Metni</h1>

      <div className="prose prose-lg">
        <p className="mb-4">
          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca,
          kişisel verilerinizin işlenmesi hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Veri Sorumlusu</h2>
        <p className="mb-4">
          Veri sorumlusu olarak [Şirket Adı], kişisel verilerinizin güvenliği ve gizliliği konusunda
          gerekli tüm tedbirleri almaktadır.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. İşlenen Kişisel Veriler</h2>
        <p className="mb-4">
          Platformumuz üzerinden sağladığınız ad, soyad, e-posta adresi, telefon numarası,
          kullanıcı tipi gibi bilgiler işlenmektedir.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
        <p className="mb-4">
          Kişisel verileriniz, üyelik işlemlerinin gerçekleştirilmesi, iletişim kurulması,
          hizmetlerin sunulması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Kişisel Verilerin Aktarılması</h2>
        <p className="mb-4">
          Kişisel verileriniz, yasal zorunluluklar ve hizmet sağlayıcılarımızla yapılan sözleşmeler
          çerçevesinde aktarılabilmektedir.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Haklarınız</h2>
        <p className="mb-4">
          KVKK'nın 11. maddesi uyarınca, kişisel verileriniz hakkında aşağıdaki haklara sahipsiniz:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
          <li>5. ve 6. maddelerde belirtilen işlemlerin üçüncü kişilere bildirilmesini isteme,</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,</li>
          <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. İletişim</h2>
        <p className="mb-4">
          Yukarıda belirtilen haklarınızı kullanmak için [iletişim bilgileri] adresinden bizimle iletişime geçebilirsiniz.
        </p>

        <p className="text-sm text-gray-600 mt-8">
          Bu metin son güncellenme tarihi: [Tarih]
        </p>
      </div>
    </div>
  );
}