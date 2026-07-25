import { CategoryNode } from './types';

export const panayir: CategoryNode = {
  name: 'İkinci El Pazarı',
  icon: '🎪',
  description: 'Diğer kategorilerde yer almayan ikinci el ürünler',
  subcategories: [
    {
      name: 'Su Sporları Ekipmanları',
      description: 'İkinci el su sporları ekipmanları',
      subcategories: [
        { name: 'Wakeboard', description: 'İkinci el wakeboard' },
        { name: 'Wakesurf', description: 'İkinci el wakesurf' },
        { name: 'Water Ski', description: 'İkinci el water ski' },
        { name: 'Kano', description: 'İkinci el kano' },
        { name: 'Paddle Board', description: 'İkinci el paddle board (SUP)' },
        { name: 'Ring', description: 'İkinci el su ringi' },
        { name: 'Banana', description: 'İkinci el banana' },
        { name: 'Kneeboard', description: 'İkinci el kneeboard' },
        { name: 'Diğer', description: 'Diğer su sporları ekipmanları' },
      ]
    },
    {
      name: 'Balıkçılık Ekipmanları',
      description: 'İkinci el balıkçılık ekipmanları',
      subcategories: [
        { name: 'Olta', description: 'İkinci el olta' },
        { name: 'Misina', description: 'İkinci el misina' },
        { name: 'Kamış', description: 'İkinci el kamış' },
        { name: 'Makara', description: 'İkinci el makara' },
        { name: 'Yem', description: 'Balık yemi ve takımı' },
        { name: 'Balık Bulucu', description: 'İkinci el balık bulucu' },
        { name: 'Diğer', description: 'Diğer balıkçılık ekipmanları' },
      ]
    },
    {
      name: 'Mutfak Ekipmanları',
      description: 'İkinci el tekne mutfak ekipmanları',
      subcategories: [
        { name: 'Fırın', description: 'İkinci el deniz fırını' },
        { name: 'Ocak', description: 'İkinci el deniz ocağı' },
        { name: 'Buzdolabı', description: 'İkinci el deniz buzdolabı' },
        { name: 'Derin Dondurucu', description: 'İkinci el derin dondurucu' },
        { name: 'Mikrodalga', description: 'İkinci el mikrodalga' },
        { name: 'Kahve Makinesi', description: 'İkinci el kahve makinesi' },
        { name: 'Su Isıtıcı', description: 'İkinci el su ısıtıcı' },
        { name: 'Diğer', description: 'Diğer mutfak ekipmanları' },
      ]
    },
    {
      name: 'Eğlence Sistemleri',
      description: 'İkinci el eğlence sistemleri',
      subcategories: [
        { name: 'TV', description: 'İkinci el TV' },
        { name: 'Ses Sistemi', description: 'İkinci el ses sistemi' },
        { name: 'Hoparlör', description: 'İkinci el hoparlör' },
        { name: 'Projeksiyon', description: 'İkinci el projeksiyon' },
        { name: 'Oyun Konsolu', description: 'İkinci el oyun konsolu' },
        { name: 'Diğer', description: 'Diğer eğlence sistemleri' },
      ]
    },
    {
      name: 'Güverte Ekipmanları',
      description: 'İkinci el güverte ekipmanları',
      subcategories: [
        { name: 'Çapa', description: 'İkinci el çapa' },
        { name: 'Halat', description: 'İkinci el halat' },
        { name: 'Zincir', description: 'İkinci el zincir' },
        { name: 'Fener', description: 'İkinci el fener' },
        { name: 'Korkuluk', description: 'İkinci el korkuluk' },
        { name: 'Merdiven', description: 'İkinci el güverte merdiveni' },
        { name: 'Ring', description: 'İkinci el ring' },
        { name: 'Diğer', description: 'Diğer güverte ekipmanları' },
      ]
    },
    {
      name: 'Kabin Ekipmanları',
      description: 'İkinci el kabin ekipmanları',
      subcategories: [
        { name: 'Yatak', description: 'İkinci el yatak' },
        { name: 'Yastık', description: 'İkinci el yastık' },
        { name: 'Nevresim', description: 'İkinci el nevresim' },
        { name: 'Havlü', description: 'İkinci el havlu' },
        { name: 'Perde', description: 'İkinci el perde' },
        { name: 'Masa', description: 'İkinci el masa' },
        { name: 'Sandalye', description: 'İkinci el sandalye' },
        { name: 'Diğer', description: 'Diğer kabin ekipmanları' },
      ]
    },
    {
      name: 'Elektronik Ekipmanlar',
      description: 'İkinci el elektronik ekipmanlar',
      subcategories: [
        { name: 'GPS', description: 'İkinci el GPS' },
        { name: 'Radar', description: 'İkinci el radar' },
        { name: 'VHF', description: 'İkinci el VHF' },
        { name: 'Pusula', description: 'İkinci el pusula' },
        { name: 'Derinlik Ölçer', description: 'İkinci el derinlik ölçer' },
        { name: 'Hız Ölçer', description: 'İkinci el hız ölçer' },
        { name: 'Autopilot', description: 'İkinci el autopilot' },
        { name: 'Chartplotter', description: 'İkinci el chartplotter' },
        { name: 'Diğer', description: 'Diğer elektronik ekipmanlar' },
      ]
    },
    {
      name: 'Kıyafet ve Aksesuar',
      description: 'İkinci el denizcilik kıyafetleri',
      subcategories: [
        { name: 'Denizci Montu', description: 'İkinci el denizci montu' },
        { name: 'Yağmurluk', description: 'İkinci el yağmurluk' },
        { name: 'Bot', description: 'İkinci el denizci botu' },
        { name: 'Eldiven', description: 'İkinci el eldiven' },
        { name: 'Şapka', description: 'İkinci el denizci şapkası' },
        { name: 'Gözlük', description: 'İkinci el güneş gözlüğü' },
        { name: 'Can Yeleği', description: 'İkinci el can yeleği' },
        { name: 'Diğer', description: 'Diğer kıyafet ve aksesuarlar' },
      ]
    },
    {
      name: 'Oyuncak ve Eğlence',
      description: 'İkinci el deniz oyuncakları',
      subcategories: [
        { name: 'Jet Ski', description: 'İkinci el jet ski' },
        { name: 'Deniz Kaydı', description: 'İkinci el deniz kaydı' },
        { name: 'Şişme Bot', description: 'İkinci el şişme bot' },
        { name: 'Banana', description: 'İkinci el banana' },
        { name: 'Ring', description: 'İkinci el su ringi' },
        { name: 'Kano', description: 'İkinci el kano' },
        { name: 'Diğer', description: 'Diğer oyuncak ve eğlence' },
      ]
    },
    {
      name: 'Kitap ve Dergi',
      description: 'İkinci el denizcilik yayınları',
      subcategories: [
        { name: 'Denizcilik Kitabı', description: 'İkinci el denizcilik kitabı' },
        { name: 'Harita', description: 'İkinci el deniz haritası' },
        { name: 'Dergi', description: 'İkinci el denizcilik dergisi' },
        { name: 'Kılavuz', description: 'İkinci el seyir kılavuzu' },
        { name: 'Diğer', description: 'Diğer yayınlar' },
      ]
    },
    {
      name: 'Diğer Ürünler',
      description: 'Diğer ikinci el ürünler',
      subcategories: [
        { name: 'Sanat Eserleri', description: 'İkinci el deniz temalı sanat eserleri' },
        { name: 'Süs Eşyaları', description: 'İkinci el deniz süs eşyaları' },
        { name: 'Koleksiyon', description: 'İkinci el denizcilik koleksiyonu' },
        { name: 'Antika', description: 'İkinci el deniz antikaları' },
        { name: 'Diğer', description: 'Diğer ürünler' },
      ]
    },
  ]
};
