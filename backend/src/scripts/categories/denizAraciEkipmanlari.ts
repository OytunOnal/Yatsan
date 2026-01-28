import { CategoryNode } from './types';

export const denizAraciEkipmanlari: CategoryNode = {
  name: 'Deniz Aracı Ekipmanları',
  icon: '⚙️',
  description: 'Tekne ekipman ve aksesuarları',
  subcategories: [
    {
      name: 'Boya ve Bakım',
      description: 'Gemi boyası, antifouling, vernik',
      subcategories: [
        { name: 'Gemi Boyası', description: 'Tekne boyaları' },
        { name: 'Antifouling', description: 'Deniz boyası' },
        { name: 'Vernik', description: 'Ahşap vernikleri' },
        { name: 'Temizlik Malzemeleri', description: 'Tekne temizlik ürünleri' },
        { name: 'Cila ve Koruma', description: 'Cila ve koruma ürünleri' },
        { name: 'Fırça ve Rulo', description: 'Boya fırçaları ve rulolar' },
      ]
    },
    {
      name: 'Demirleme ve Rıhtım',
      description: 'Çapa, zincir, halat',
      subcategories: [
        { name: 'Çapa', description: 'Çeşitli çapa türleri' },
        { name: 'Zincir', description: 'Demirleme zincirleri' },
        { name: 'Halat', description: 'Deniz halatları' },
        { name: 'Demirleme Şamandırası', description: 'Şamandıra ve işaretler' },
        { name: 'Rıhtım Fenerleri', description: 'Rıhtım aydınlatması' },
        { name: 'Bot Bağlama Ekipmanları', description: 'Bağlama malzemeleri' },
      ]
    },
    {
      name: 'Bumper ve Koruma',
      description: 'Bot koruma ekipmanları',
      subcategories: [
        { name: 'Fender', description: 'Bot fenderları' },
        { name: 'Koruma Köşeleri', description: 'Köşe korumaları' },
        { name: 'Bot Kılıfı', description: 'Tekne kılıfları' },
      ]
    },
    {
      name: 'Deniz Motorları',
      description: 'Dıştan ve içten motorlar',
      subcategories: [
        { name: 'Dıştan Takma Motor', description: 'Outboard motorlar' },
        { name: 'İçten Motor', description: 'Inboard motorlar' },
        { name: 'Jet Motoru', description: 'Jet motorları' },
        { name: 'Elektrikli Motor', description: 'Elektrikli deniz motorları' },
      ]
    },
    {
      name: 'Dümen ve Kumanda',
      description: 'Dümen ve kumanda sistemleri',
      subcategories: [
        { name: 'Dümen Sistemi', description: 'Dümen mekanizması' },
        { name: 'Direksiyon', description: 'Tekne direksiyonları' },
        { name: 'Kumanda Kolonu', description: 'Kumanda konsolları' },
        { name: 'Otomatik Pilot', description: 'Otopilot sistemleri' },
        { name: 'Joystick Kontrol', description: 'Joystick kumanda' },
      ]
    },
    {
      name: 'Elektrik',
      description: 'Akü, şarj, inverter',
      subcategories: [
        { name: 'Akü', description: 'Deniz aküleri' },
        { name: 'Şarj Cihazı', description: 'Akü şarj cihazları' },
        { name: 'İnverter', description: 'Power inverter' },
        { name: 'Kablo ve Konnektör', description: 'Elektrik kabloları' },
        { name: 'Sigorta ve Anahtar', description: 'Sigorta ve anahtarlar' },
        { name: 'Aydınlatma', description: 'Seyir ve iç aydınlatma' },
        { name: 'Güneş Paneli', description: 'Güneş enerji panelleri' },
      ]
    },
    {
      name: 'Elektronik',
      description: 'GPS, radar, VHF',
      subcategories: [
        { name: 'GPS', description: 'GPS cihazları' },
        { name: 'Fish Finder', description: 'Balık bulucular' },
        { name: 'Radar', description: 'Deniz radarları' },
        { name: 'VHF Radyo', description: 'VHF haberleşme' },
        { name: 'Chartplotter', description: 'Harita plotter' },
        { name: 'Sonar', description: 'Sonar cihazları' },
        { name: 'Autopilot', description: 'Otopilot sistemleri' },
      ]
    },
    {
      name: 'Giyim',
      description: 'Denizci giyim',
      subcategories: [
        { name: 'Denizci Montu', description: 'Su geçirmez montlar' },
        { name: 'Bot', description: 'Deniz botları' },
        { name: 'Eldiven', description: 'Deniz eldivenleri' },
        { name: 'Şapka', description: 'Güneş şapkaları' },
        { name: 'Güneş Gözlüğü', description: 'Deniz gözlükleri' },
        { name: 'Yüzme Ekipmanları', description: 'Yüzme malzemeleri' },
      ]
    },
    {
      name: 'Güvenlik',
      description: 'Can yeleği, can simidi',
      subcategories: [
        { name: 'Can Yeleği', description: 'Can yelekleri' },
        { name: 'Can Simidi', description: 'Can simitleri' },
        { name: 'Yangın Söndürücü', description: 'Yangın söndürme' },
        { name: 'Sinyal Ekipmanları', description: 'Acil durum sinyalleri' },
        { name: 'İlk Yardım Çantası', description: 'İlk yardım kitleri' },
        { name: 'Emergency Kit', description: 'Acil durum kitleri' },
      ]
    },
    {
      name: 'Güverte',
      description: 'Güverte ekipmanları',
      subcategories: [
        { name: 'Güverte Kaplama', description: 'Güverte zemin kaplama' },
        { name: 'Merdiven ve Ladder', description: 'Tekne merdivenleri' },
        { name: 'Korkuluk', description: 'Güverte korkulukları' },
        { name: 'Ring ve Tutunma', description: 'Tutunma yerleri' },
        { name: 'File ve Ağ', description: 'Güverte fileleri' },
        { name: 'Güverte Mobilyası', description: 'Güverte mobilyaları' },
      ]
    },
    {
      name: 'Havalandırma',
      description: 'Fan ve hava kanalları',
      subcategories: [
        { name: 'Fan', description: 'Havalandırma fanları' },
        { name: 'Hava Kanalı', description: 'Hava kanalları' },
        { name: 'Havalandırma Gridi', description: 'Havalandırma ızgaraları' },
        { name: 'Egzoz Sistemi', description: 'Egzoz sistemleri' },
      ]
    },
    {
      name: 'Hırdavat ve Tesisat',
      description: 'Vana, pompa, filtre',
      subcategories: [
        { name: 'Vana', description: 'Su vanaları' },
        { name: 'Pompa', description: 'Deniz pompaları' },
        { name: 'Filtre', description: 'Su filtreleri' },
        { name: 'Hortum', description: 'Deniz hortumları' },
        { name: 'Bağlantı Parçaları', description: 'Tesisat parçaları' },
        { name: 'Conta ve Keçe', description: 'Contalar ve keçeler' },
      ]
    },
    {
      name: 'Kabin ve Kamara',
      description: 'Mutfak, banyo, yatak',
      subcategories: [
        { name: 'Yatak ve Yastık', description: 'Kabin yatakları' },
        { name: 'Mutfak Ekipmanları', description: 'Deniz mutfağı' },
        { name: 'Banyo Ekipmanları', description: 'Deniz banyosu' },
        { name: 'Depolama', description: 'Kabin depolama' },
        { name: 'Perde ve Kumaş', description: 'Kabin tekstil' },
        { name: 'Kabin Aydınlatma', description: 'Kabin aydınlatması' },
      ]
    },
    {
      name: 'Motor Aksamı',
      description: 'Motor aksamı parçaları',
      subcategories: [
        { name: 'Piston', description: 'Motor pistonları' },
        { name: 'Silindir', description: 'Motor silindirleri' },
        { name: 'Segman', description: 'Motor segmanları' },
        { name: 'Yağ Filtresi', description: 'Yağ filtreleri' },
        { name: 'Yakıt Filtresi', description: 'Yakıt filtreleri' },
        { name: 'Buji', description: 'Motor bujileri' },
        { name: 'Şanzıman Parçaları', description: 'Şanzıman parçaları' },
        { name: 'Diğer', description: 'Diğer motor aksamı' },
      ]
    },
    {
      name: 'Yelken Donanımı',
      description: 'Yelken ekipmanları',
      subcategories: [
        { name: 'Yelken', description: 'Yelkenler' },
        { name: 'Yelken Halatı', description: 'Yelken halatları' },
        { name: 'Makara', description: 'Yelken makaraları' },
        { name: 'Vinç', description: 'Yelken vinçleri' },
        { name: 'Ors', description: 'Yelken orsları' },
        { name: 'Boom', description: 'Yelken boomu' },
        { name: 'Mast', description: 'Yelken direği' },
      ]
    },
    {
      name: 'Pis Su ve Tuvalet',
      description: 'Deniz tuvaleti',
      subcategories: [
        { name: 'Deniz Tuvaleti', description: 'Marin tuvaletler' },
        { name: 'Pis Su Tankı', description: 'Pis su tankları' },
        { name: 'Pis Su Pompası', description: 'Pis su pompaları' },
        { name: 'Pis Su Boru ve Fitting', description: 'Pis su boruları' },
        { name: 'Pis Su Kimyasal', description: 'Tuvalet kimyasalları' },
      ]
    },
    {
      name: 'Sintine',
      description: 'Sintine pompaları',
      subcategories: [
        { name: 'Sintine Pompası', description: 'Sintine pompası' },
        { name: 'Sintine Filtresi', description: 'Sintine filtresi' },
        { name: 'Sintine Alarm Sistemi', description: 'Sintine alarmı' },
        { name: 'Sintine Tankı', description: 'Sintine tankı' },
      ]
    },
    {
      name: 'Tatlı Su',
      description: 'Su sistemi',
      subcategories: [
        { name: 'Su Tankı', description: 'Tatlı su tankı' },
        { name: 'Su Pompası', description: 'Su pompası' },
        { name: 'Su Filtresi', description: 'Su filtresi' },
        { name: 'Su Isıtıcı', description: 'Su ısıtıcı' },
        { name: 'Su Arıtma Cihazı', description: 'Su arıtma' },
      ]
    },
    {
      name: 'Yakıt Sistemi',
      description: 'Yakıt tankı ve pompa',
      subcategories: [
        { name: 'Yakıt Tankı', description: 'Yakıt tankları' },
        { name: 'Yakıt Pompası', description: 'Yakıt pompaları' },
        { name: 'Yakıt Filtresi', description: 'Yakıt filtresi' },
        { name: 'Yakıt Hattı', description: 'Yakıt hatları' },
        { name: 'Seperator', description: 'Yakıt seperatörü' },
      ]
    },
    {
      name: 'Römork',
      description: 'Tekne römorkları',
      subcategories: [
        { name: 'Tekne Römorku', description: 'Tekne taşıma römorku' },
        { name: 'Jet Ski Römorku', description: 'Jet ski römorku' },
        { name: 'Römork Yedek Parça', description: 'Römork yedek parçaları' },
      ]
    },
    {
      name: 'Navigasyon',
      description: 'Harita, pusula, GPS',
      subcategories: [
        { name: 'Harita ve Çizelge', description: 'Deniz haritaları' },
        { name: 'Pusula', description: 'Deniz pusulaları' },
        { name: 'GPS Cihazı', description: 'Navigasyon GPS' },
        { name: 'Derinlik Ölçer', description: 'Derinlik ölçerler' },
        { name: 'Hız Ölçer', description: 'Hız ölçerler' },
      ]
    },
  ]
};
