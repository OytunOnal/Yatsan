# TeknePazari - User Stories

## 👥 Kullanıcı Hikayeleri

Bu bölümde TeknePazari platformu için kullanıcı hikayeleri (user stories) ve kabul kriterleri (acceptance criteria) yer almaktadır.

---

## 📋 Format

```
[Başlık]
Kullanıcı Rolü: [Rol]
Kullanıcı Hikayesi: [Hikaye]
Kabul Kriterleri:
- [Kriter 1]
- [Kriter 2]
...
Öncelik: [Yüksek/Orta/Düşük]
```

---

## 1. KULLANICI KAYIT VE GİRİŞ

### US-1.1: Email ile Kayıt Ol
**Kullanıcı Rolü:** Misafir Kullanıcı
**Kullanıcı Hikayesi:** Bir misafir olarak, email adresimle kayıt olmak istiyorum ki platformu kullanabileyim.

**Kabul Kriterleri:**
- Email input alanı görünür
- "OTP Gönder" butonu tıklanabilir
- OTP gönderildiğinde success mesajı gösterilir
- OTP input alanı görünür
- Doğru OTP girildiğinde kullanıcı giriş yapar
- Yanlış OTP girildiğinde hata mesajı gösterilir
- OTP süresi dolduğunda "Yeniden Gönder" butonu aktif olur
**Öncelik:** Yüksek

### US-1.2: SMS ile Kayıt Ol
**Kullanıcı Rolü:** Misafir Kullanıcı
**Kullanıcı Hikayesi:** Bir misafir olarak, telefon numaramla kayıt olmak istiyorum ki platformu kullanabileyim.

**Kabul Kriterleri:**
- Telefon input alanı görünür
- Ülke kodu seçimi mümkündür (+90)
- "OTP Gönder" butonu tıklanabilir
- SMS OTP gönderildiğinde success mesajı gösterilir
- OTP input alanı görünür
- Doğru OTP girildiğinde kullanıcı giriş yapar
**Öncelik:** Yüksek

### US-1.3: Biometric ile Giriş Yap
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kayıtlı kullanıcı olarak, Face ID/Touch ID ile hızlıca giriş yapmak istiyorum.

**Kabul Kriterleri:**
- Biometric auth desteklenen cihazda seçenek görünür
- Face ID/Touch ID başarılı olduğunda giriş yapılır
- Biometric başarısız olduğunda PIN/password fallback gösterilir
**Öncelik:** Orta

---

## 2. İLAN ARAMA VE KEŞİF

### US-2.1: Ana Sayfada İlanları Görüntüle
**Kullanıcı Rolü:** Misafir/Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ana sayfada öne çıkan ilanları görmek istiyorum ki platformda neler olduğunu anlayayım.

**Kabul Kriterleri:**
- Premium ilanlar carousel'de gösterilir
- Kategori listesi görünür
- Trending ilanlar listelenir
- Her ilan kartında: fotoğraf, başlık, fiyat, lokasyon görünür
**Öncelik:** Yüksek

### US-2.2: İlan Arama Yap
**Kullanıcı Rolü:** Misafir/Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, anahtar kelime ile ilan aramak istiyorum ki aradığım tekneyi bulabileyim.

**Kabul Kriterleri:**
- Arama bar'ı ana sayfada görünür
- Anahtar kelime girilebilir
- Arama sonuçları listelenir
- Sonuç yoksa "Sonuç bulunamadı" mesajı gösterilir
- Voice search (mobil) çalışır
**Öncelik:** Yüksek

### US-2.3: Filtreleme Yap
**Kullanıcı Rolü:** Misafir/Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, filtreler kullanarak arama sonuçlarını daraltmak istiyorum.

**Kabul Kriterleri:**
- Filtre paneli açılır
- Kategori filtresi seçilebilir
- Fiyat aralığı belirlenebilir
- Lokasyon filtresi uygulanabilir
- Yıl filtresi uygulanabilir
- Marka filtresi uygulanabilir
- "Filtreleri Temizle" butonu çalışır
- Filtre uygulandığında sonuçlar güncellenir
**Öncelik:** Yüksek

### US-2.4: Sonuçları Sırala
**Kullanıcı Rolü:** Misafir/Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sonuçları sıralamak istiyorum ki en uygun ilanı bulabileyim.

**Kabul Kriterleri:**
- Sıralama dropdown'ı görünür
- "En yeni" seçilebilir
- "Fiyat (düşük-yüksek)" seçilebilir
- "Fiyat (yüksek-düşük)" seçilebilir
- "Popülerlik" seçilebilir
- Seçim yapıldığında sonuçlar yeniden sıralanır
**Öncelik:** Orta

### US-2.5: İlan Detayını Görüntüle
**Kullanıcı Rolü:** Misafir/Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilan detaylarını görmek istiyorum ki tekne hakkında bilgi alabileyim.

**Kabul Kriterleri:**
- İlan detay sayfası açılır
- Fotoğraf galerisi görünür
- Video varsa video player çalışır
- Tekne özellikleri tablosu görünür
- Satıcı bilgisi görünür
- Konum haritası gösterilir
- "İletişime Geç" butonu tıklanabilir
- "Favorilere Ekle" butonu çalışır
**Öncelik:** Yüksek

---

## 3. İLAN OLUŞTURMA

### US-3.1: İlan Oluşturma Sihirbazını Başlat
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, adım adım ilan oluşturmak istiyorum ki hiçbir adımı atlamayayım.

**Kabul Kriterleri:**
- "İlan Oluştur" butonu görünür
- İlk adım: Kategori seçimi ekranı açılır
- Progress bar gösterilir
- "İleri" ve "Geri" butonları çalışır
**Öncelik:** Yüksek

### US-3.2: Kategori Seç
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanım için doğru kategoriyi seçmek istiyorum.

**Kabul Kriterleri:**
- Ana kategori listesi görünür
- Kategori seçildiğinde subcategory listesi gösterilir
- Seçim yapıldığında "İleri" butonu aktif olur
**Öncelik:** Yüksek

### US-3.3: Fotoğraf Yükle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanıma fotoğraf eklemek istiyorum.

**Kabul Kriterleri:**
- "Fotoğraf Yükle" butonu görünür
- Dosya seçilebilir (web)
- Kamera ile çekilebilir (mobil)
- Galeri seçilebilir (mobil)
- Maksimum 50 fotoğraf yüklenebilir
- Fotoğraflar yeniden sıralanabilir
- Fotoğraf silinebilir
- Yükleme progress bar'ı gösterilir
**Öncelik:** Yüksek

### US-3.4: Video Yükle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanıma video eklemek istiyorum.

**Kabul Kriterleri:**
- "Video Yükle" butonu görünür
- Video kaydedilebilir (mobil)
- Video seçilebilir (web/mobil)
- Maksimum 3 video yüklenebilir
- Maksimum 60 saniye/video
- Yükleme progress bar'ı gösterilir
**Öncelik:** Orta

### US-3.5: Temel Bilgileri Gir
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanım için temel bilgileri girmek istiyorum.

**Kabul Kriterleri:**
- Başlık input'u görünür
- Açıklama textarea'sı görünür
- Fiyat input'u görünür
- Para birimi seçimi yapılabilir
- Yıl input'u görünür
- Lokasyon input'u görünür
- GPS ile konum alma (mobil) çalışır
- Zorunlu alanlar boş ise hata mesajı gösterilir
**Öncelik:** Yüksek

### US-3.6: Tekne Detaylarını Gir
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, tekne detaylarını girmek istiyorum.

**Kabul Kriterleri:**
- Marka dropdown'ı görünür
- Model input'u görünür
- Uzunluk, genişlik, draft input'ları görünür
- Motor bilgileri input'ları görünür
- Yakıt tipi seçimi yapılabilir
- Yakıt/su kapasitesi girilebilir
**Öncelik:** Yüksek

### US-3.7: İlanı Önizle ve Yayınla
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanımı yayınlamadan önce önizlemek istiyorum.

**Kabul Kriterleri:**
- Önizleme ekranı gösterilir
- Tüm bilgiler doğru görüntülenir
- "Düzenle" butonu ile geri dönülebilir
- "Yayınla" butonu ile ilan gönderilir
- "Taslak Kaydet" butonu ile taslak kaydedilir
- Yayınlandığında success mesajı gösterilir
**Öncelik:** Yüksek

---

## 4. FAVORİLER

### US-4.1: İlanı Favorilere Ekle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, beğendiğim ilanı favorilerime eklemek istiyorum.

**Kabul Kriterleri:**
- "Favorilere Ekle" butonu (heart icon) görünür
- Tıklandığında icon dolu olur
- Favori eklendiğinde success feedback gösterilir
**Öncelik:** Yüksek

### US-4.2: Favorilerimi Görüntüle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, favorilerimi görmek istiyorum.

**Kabul Kriterleri:**
- "Favorilerim" sayfası açılır
- Tüm favori ilanlar listelenir
- Her ilan kartı: fotoğraf, başlık, fiyat içerir
- "Favoriden Çıkar" butonu çalışır
- Favori yoksa "Henüz favoriniz yok" mesajı gösterilir
**Öncelik:** Yüksek

---

## 5. MESAJLAŞMA

### US-5.1: Satıcıyla İletişime Geç
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, satıcıyla mesajlaşmak istiyorum.

**Kabul Kriterleri:**
- "İletişime Geç" butonu görünür
- Tıklandığında mesajlaşma ekranı açılır
- İlan bilgisi mesaj başlığında gösterilir
- Mesaj input'u görünür
- "Gönder" butonu çalışır
- Mesaj gönderildiğinde listeye eklenir
**Öncelik:** Yüksek

### US-5.2: Mesajları Görüntüle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, tüm mesajlarımı görmek istiyorum.

**Kabul Kriterleri:**
- "Mesajlar" sayfası açılır
- Konuşma listesi görünür
- Her konuşma: avatar, isim, son mesaj, zaman içerir
- Okunmamış mesaj badge'i gösterilir
- Konuşmaya tıklandığında detay açılır
**Öncelik:** Yüksek

### US-5.3: Real-time Mesajlaşma
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, anlık mesajlaşmak istiyorum.

**Kabul Kriterleri:**
- WebSocket bağlantısı kurulur
- Karşı taraf mesaj gönderdiğinde anlık görünür
- Typing indicator gösterilir
- Mesaj okunduğunda "okundu" işareti görünür
**Öncelik:** Yüksek

---

## 6. İLAN YÖNETİMİ

### US-6.1: İlanlarımı Görüntüle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, tüm ilanlarımı görmek istiyorum.

**Kabul Kriterleri:**
- "İlanlarım" sayfası açılır
- Aktif ilanlar listelenir
- Bekleyen ilanlar listelenir
- Süresi dolmuş ilanlar listelenir
- Taslaklar listelenir
- Her ilan için: Düzenle, Yenile, Sil butonları çalışır
**Öncelik:** Yüksek

### US-6.2: İlanı Düzenle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanımı düzenlemek istiyorum.

**Kabul Kriterleri:**
- "Düzenle" butonu tıklanabilir
- Düzenleme formu açılır
- Mevcut bilgiler dolu gelir
- Değişiklikler kaydedilebilir
- Kaydedildiğinde success mesajı gösterilir
**Öncelik:** Yüksek

### US-6.3: İlanı Yenile
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanımı yenilemek istiyorum.

**Kabul Kriterleri:**
- "Yenile" butonu tıklanabilir
- Ücretsiz hakkı varsa yenilenir
- Ücretsiz hakkı yoksa ödeme ekranı açılır
- Ödeme başarılı olursa ilan yenilenir
**Öncelik:** Yüksek

### US-6.4: İlanı Sil
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanımı silmek istiyorum.

**Kabul Kriterleri:**
- "Sil" butonu tıklanabilir
- Onay dialog'u gösterilir
- Onaylandığında ilan silinir
- Silindiğinde success mesajı gösterilir
**Öncelik:** Orta

---

## 7. ÖDEME

### US-7.1: Premium Paket Satın Al
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, premium paket satın almak istiyorum.

**Kabul Kriterleri:**
- Paket seçimi ekranı açılır
- Temel, Standart, Premium paketler görünür
- Her paketin özellikleri listelenir
- Fiyat görünür
- "Seç" butonu tıklanabilir
- Ödeme formu açılır
**Öncelik:** Yüksek

### US-7.2: Kredi Kartı ile Ödeme Yap
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, kredi kartı ile ödemek istiyorum.

**Kabul Kriterleri:**
- Kart numarası input'u görünür
- Son kullanma tarihi input'u görünür
- CVV input'u görünür
- Kart sahibi adı input'u görünür
- "Öde" butonu tıklanabilir
- Ödeme başarılı olursa success mesajı gösterilir
- Ödeme başarısız olursa hata mesajı gösterilir
**Öncelik:** Yüksek

### US-7.3: Doping Satın Al
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanımı öne çıkarmak istiyorum.

**Kabul Kriterleri:**
- "Öne Çıkarma" seçeneği görünür
- Günlük, haftalık, aylık seçenekler sunulur
- Fiyat gösterilir
- "Satın Al" butonu çalışır
- Satın alındığında ilan öne çıkar
**Öncelik:** Orta

---

## 8. BROKER ÖZELLİKLERİ

### US-8.1: Mağaza Sayfası Oluştur
**Kullanıcı Rolü:** Broker
**Kullanıcı Hikayesi:** Bir broker olarak, mağaza sayfası oluşturmak istiyorum.

**Kabul Kriterleri:**
- "Mağaza Oluştur" seçeneği görünür
- Logo yüklenebilir
- Kapak fotoğrafı yüklenebilir
- Mağaza adı girilebilir
- Açıklama girilebilir
- Sosyal medya linkleri eklenebilir
- Kaydedildiğinde mağaza sayfası oluşturulur
**Öncelik:** Yüksek

### US-8.2: Lead Takibi Yap
**Kullanıcı Rolü:** Broker
**Kullanıcı Hikayesi:** Bir broker olarak, lead'leri takip etmek istiyorum.

**Kabul Kriterleri:**
- "CRM" sayfası açılır
- Lead listesi görünür
- Lead detayları görüntülenebilir
- Not eklenebilir
- Follow-up tarihi belirlenebilir
**Öncelik:** Orta

### US-8.3: Performans Analitiklerini Görüntüle
**Kullanıcı Rolü:** Broker
**Kullanıcı Hikayesi:** Bir broker olarak, performansımı görmek istiyorum.

**Kabul Kriterleri:**
- "Analitik" sayfası açılır
- İlan görüntülenme sayıları gösterilir
- Tıklama sayıları gösterilir
- Conversion rate gösterilir
- Revenue gösterilir
- Grafikler ile görselleştirme yapılır
**Öncelik:** Orta

---

## 9. PUSH BİLDİRİMLER

### US-9.1: Yeni Mesaj Bildirimi Al
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, yeni mesaj geldiğinde bildirim almak istiyorum.

**Kabul Kriterleri:**
- Push notification gönderilir
- Bildirim başlığı: "Yeni mesajınız var"
- Bildirim içeriğinde gönderen ismi görünür
- Tıklandığında mesajlaşma ekranı açılır
**Öncelik:** Yüksek

### US-9.2: İlan Onay Bildirimi Al
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanım onaylandığında bildirim almak istiyorum.

**Kabul Kriterleri:**
- Push notification gönderilir
- Bildirim başlığı: "İlanınız yayında"
- Bildirim içeriğinde ilan adı görünür
- Tıklandığında ilan detay sayfası açılır
**Öncelik:** Yüksek

### US-9.3: Fiyat Düştü Bildirimi Al
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, favori ilanın fiyatı düştüğünde bildirim almak istiyorum.

**Kabul Kriterleri:**
- Push notification gönderilir
- Bildirim başlığı: "Fiyat düştü!"
- Bildirim içeriğinde yeni fiyat görünür
- Tıklandığında ilan detay sayfası açılır
**Öncelik:** Orta

---

## 10. PROFİL AYARLARI

### US-10.1: Profil Bilgilerini Güncelle
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, profil bilgilerimi güncellemek istiyorum.

**Kabul Kriterleri:**
- "Profil Ayarları" sayfası açılır
- İsim input'u görünür
- Avatar yüklenebilir
- "Kaydet" butonu çalışır
- Kaydedildiğinde success mesajı gösterilir
**Öncelik:** Orta

### US-10.2: Bildirim Tercihlerini Ayarla
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, bildirim tercihlerini ayarlamak istiyorum.

**Kabul Kriterleri:**
- "Bildirim Ayarları" sayfası açılır
- Push notifications toggle'ı çalışır
- Email notifications toggle'ı çalışır
- SMS notifications toggle'ı çalışır
- Kaydedildiğinde ayarlar güncellenir
**Öncelik:** Orta

---

## 11. GÜVENLİK

### US-11.1: Email Doğrula
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, email adresimi doğrulamak istiyorum.

**Kabul Kriterleri:**
- "Email Doğrula" seçeneği görünür
- "OTP Gönder" butonu tıklanabilir
- Email'e OTP gönderilir
- OTP girildiğinde email doğrulanır
- Doğrulandığında yeşil rozet görünür
**Öncelik:** Yüksek

### US-11.2: Telefon Doğrula
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, telefon numaramı doğrulamak istiyorum.

**Kabul Kriterleri:**
- "Telefon Doğrula" seçeneği görünür
- "OTP Gönder" butonu tıklanabilir
- SMS ile OTP gönderilir
- OTP girildiğinde telefon doğrulanır
- Doğrulandığında mavi rozet görünür
**Öncelik:** Yüksek

### US-11.3: Video Doğrulama Yap
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, video ile doğrulanmak istiyorum.

**Kabul Kriterleri:**
- "Video Doğrula" seçeneği görünür
- "Başla" butonu tıklanabilir
- Video call başlar
- Moderatör ile bağlantı kurulur
- Doğrulama başarılı olursa kamera rozeti görünür
**Öncelik:** Orta

---

## 12. SOSYAL ÖZELLİKLER

### US-12.1: İlanı Paylaş
**Kullanıcı Rolü:** Misafir/Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilanı paylaşmak istiyorum.

**Kabul Kriterleri:**
- "Paylaş" butonu görünür
- Tıklandığında paylaşım menüsü açılır
- Twitter seçilebilir
- Facebook seçilebilir
- WhatsApp seçilebilir
- Link kopyalanabilir
**Öncelik:** Orta

### US-12.2: Satıcıyı Değerlendir
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, satıcıyı değerlendirmek istiyorum.

**Kabul Kriterleri:**
- "Değerlendir" butonu görünür (işlem sonrası)
- Yıldız seçimi yapılabilir (1-5)
- Yorum yazılabilir
- Gönderildiğinde değerlendirme kaydedilir
**Öncelik:** Düşük

---

## 13. ADMIN ÖZELLİKLERİ

### US-13.1: İlanı Moderasyon
**Kullanıcı Rolü:** Admin
**Kullanıcı Hikayesi:** Bir admin olarak, ilanları moderasyon etmek istiyorum.

**Kabul Kriterleri:**
- "Moderasyon" sayfası açılır
- Bekleyen ilanlar listelenir
- İlan detayı görüntülenebilir
- "Onayla" butonu çalışır
- "Reddet" butonu çalışır
- Red nedeni girilebilir
**Öncelik:** Yüksek

### US-13.2: Kullanıcı Yönetimi
**Kullanıcı Rolü:** Admin
**Kullanıcı Hikayesi:** Bir admin olarak, kullanıcıları yönetmek istiyorum.

**Kabul Kriterleri:**
- "Kullanıcılar" sayfası açılır
- Kullanıcı listesi görünür
- Kullanıcı detayı görüntülenebilir
- "Banla" butonu çalışır
- Ban nedeni girilebilir
**Öncelik:** Orta

### US-13.3: Platform İstatistiklerini Görüntüle
**Kullanıcı Rolü:** Admin
**Kullanıcı Hikayesi:** Bir admin olarak, platform istatistiklerini görmek istiyorum.

**Kabul Kriterleri:**
- "Dashboard" sayfası açılır
- Toplam kullanıcı sayısı gösterilir
- Toplam ilan sayısı gösterilir
- Aktif ilan sayısı gösterilir
- Revenue gösterilir
- Grafikler ile görselleştirme yapılır
**Öncelik:** Yüksek

### US-13.4: Kategori Önerilerini Yönet
**Kullanıcı Rolü:** Admin
**Kullanıcı Hikayesi:** Bir admin olarak, kullanıcıların kategori önerilerini yönetmek istiyorum.

**Kabul Kriterleri:**
- "Kategori Önerileri" sayfası açılır
- Bekleyen öneriler listelenir
- Her öneri için: kategori adı, açıklama, öneren kullanıcı, ilan sayısı görünür
- Benzer kategoriler gösterilir (otomatik eşleştirme önerisi)
- "Onayla" butonu çalışır → Yeni kategori oluşturulur
- "Reddet" butonu çalışır → Reddetme nedeni istenir
- "Birleştir" butonu çalışır → Mevcut kategori seçimi istenir
- 10+ ilan threshold bildirimi gösterilir
- Öneri durumu güncellendiğinde kullanıcıya bildirim gönderilir
**Öncelik:** Orta

---

## 14. KULLANICI TANIMLI KATEGORİ ÖNERİSİ

### US-14.1: Yeni Kategori Öner
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ilan oluştururken aradığım kategori yoksa yeni kategori önerebilmek istiyorum.

**Kabul Kriterleri:**
- Kategori seçimi ekranında "Yeni Kategori Öner" seçeneği görünür
- Tıklandığında modal açılır
- Kategori adı input'u zorunludur
- Açıklama input'u opsiyoneldir
- Ana kategori seçimi zorunludur
- "Öner" butonu tıklanabilir
- Öneri gönderildiğinde success mesajı gösterilir
- Günlük limit (3 öneri) aşılırsa hata mesajı gösterilir
**Öncelik:** Orta

### US-14.2: Kategori Öneri Durumunu Takip Et
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, kategori önerimin durumunu görmek istiyorum.

**Kabul Kriterleri:**
- "Kategori Önerilerim" sayfası açılır
- Tüm önerilerim listelenir
- Her öneri için: kategori adı, durum, ilan sayısı, tarih görünür
- Durumlar: Beklemede, Onaylandı, Reddedildi, Birleştirildi
- Onaylandığında bildirim alınır
- Reddedildiğinde sebep gösterilir
**Öncelik:** Düşük

### US-14.3: Önerilen Kategoride İlan Yayınla
**Kullanıcı Rolü:** Kayıtlı Kullanıcı
**Kullanıcı Hikayesi:** Bir kullanıcı olarak, önerdiğim kategoride ilan yayınlayabilmek istiyorum.

**Kabul Kriterleri:**
- Kategori önerisi "Beklemede" durumunda iken ilan oluşturulabilir
- İlan "Diğer - [Önerilen Kategori Adı]" altında yayınlanır
- Kategori onaylandığında ilan otomatik yeni kategoriye taşınır
- Kategori reddedildiğinde kullanıcı bilgilendirilir
**Öncelik:** Orta

---

*Son Güncelleme: 2026-01-23*
*Versiyon: 1.1 (Kullanıcı Tanımlı Alt Kategori Özelliği Eklendi)*
