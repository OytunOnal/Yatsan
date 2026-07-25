import { CategoryNode } from './types';
import { MOTOR_BRANDS } from './brands';

export const teknikServisler: CategoryNode = {
  name: 'Teknik Servisler',
  icon: '🔧',
  description: 'Tekne bakım ve onarım hizmetleri',
  subcategories: [
    {
      name: 'Özel Servisler',
      description: 'Özel servis hizmetleri',
      subcategories: [
        {
          name: 'Motor Servisi',
          description: 'Motor bakım ve onarım',
          subcategories: [
            { name: 'Dıştan Motor Servisi', description: 'Outboard motor servisi' },
            { name: 'İçten Motor Servisi', description: 'Inboard motor servisi' },
            { name: 'Jet Motor Servisi', description: 'Jet motor servisi' },
            { name: 'Motor Revizyonu', description: 'Motor tamiri ve bakımı' },
          ]
        },
        {
          name: 'Elektrik Servisi',
          description: 'Elektrik arıza ve bakım',
          subcategories: [
            { name: 'Akü Servisi', description: 'Akü bakım ve test' },
            { name: 'Kablo Değişimi', description: 'Kablo yenileme' },
            { name: 'Aydınlatma Servisi', description: 'Aydınlatma tamiri' },
            { name: 'Panel Bakımı', description: 'Elektrik paneli bakımı' },
          ]
        },
        {
          name: 'Elektronik Servisi',
          description: 'Elektronik cihaz servisi',
          subcategories: [
            { name: 'GPS Servisi', description: 'GPS tamiri' },
            { name: 'Radar Servisi', description: 'Radar bakımı' },
            { name: 'VHF Servisi', description: 'VHF tamiri' },
            { name: 'Fish Finder Servisi', description: 'Balık bulucu tamiri' },
          ]
        },
        {
          name: 'Fiberglass Tamiri',
          description: 'Fiber tamir ve kaplama',
          subcategories: [
            { name: 'Gövde Tamiri', description: 'Tekne gövdesi tamiri' },
            { name: 'Gelcoat Uygulama', description: 'Gelcoat kaplama' },
            { name: 'Kozmetik Tamir', description: 'Kozmetik onarım' },
            { name: 'Yapısal Tamir', description: 'Yapısal onarım' },
          ]
        },
        {
          name: 'Boya ve Bakım Servisi',
          description: 'Boya ve bakım işleri',
          subcategories: [
            { name: 'Tekne Boyama', description: 'Tekne boyası' },
            { name: 'Antifouling', description: 'Antifouling uygulama' },
            { name: 'Cila', description: 'Tekne cila' },
            { name: 'Detaylı Temizlik', description: 'Detaylı temizlik' },
          ]
        },
        {
          name: 'Yelken Tamiri',
          description: 'Yelken tamir ve dikim',
          subcategories: [
            { name: 'Yelken Dikimi', description: 'Yelken dikim hizmeti' },
            { name: 'Yelken Tamiri', description: 'Yelken onarımı' },
            { name: 'Halat Değişimi', description: 'Halat yenileme' },
          ]
        },
        {
          name: 'Denize İndirme',
          description: 'Vinç ve indirme hizmeti',
          subcategories: [
            { name: 'Travel Lift', description: 'Travel lift ile indirme' },
            { name: 'Vinç Hizmeti', description: 'Vinç ile indirme' },
            { name: 'Denize İndirme', description: 'Suya indirme' },
            { name: 'Karaya Çıkarma', description: 'Karaya çıkarma' },
          ]
        },
        {
          name: 'Temizlik',
          description: 'Tekne temizlik hizmetleri',
          subcategories: [
            { name: 'Dış Temizlik', description: 'Tekne dış temizliği' },
            { name: 'İç Temizlik', description: 'Kabin temizliği' },
            { name: 'Halı Yıkama', description: 'Halı yıkama' },
            { name: 'Deri Bakımı', description: 'Deri koltuk bakımı' },
          ]
        },
        {
          name: 'Klima ve Soğutma',
          description: 'Klima bakım ve kurulum',
          subcategories: [
            { name: 'Klima Servisi', description: 'Klima bakımı' },
            { name: 'Klima Montajı', description: 'Klima kurulumu' },
            { name: 'Soğutucu Servisi', description: 'Soğutucu bakımı' },
          ]
        },
      ]
    },
    {
      name: 'Marka Yetkili Servisleri',
      description: 'Marka yetkili servisleri',
      subcategories: MOTOR_BRANDS.map(brand => ({ name: `${brand} Servisi`, description: `${brand} yetkili servisi` }))
    },
  ]
};
