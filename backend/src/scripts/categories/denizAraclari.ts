import { CategoryNode } from './types';
import { BOAT_BRANDS } from './brands';

export const denizAraclari: CategoryNode = {
  name: 'Deniz Araçları',
  icon: '🚤',
  description: 'Her türlü deniz aracı ilanları',
  subcategories: [
    {
      name: 'Satılık',
      description: 'Satılık deniz araçları',
      subcategories: [
        {
          name: 'Motoryat',
          description: 'Motor yatlar',
          subcategories: BOAT_BRANDS.map(brand => ({ name: brand, description: `${brand} motoryat` }))
        },
        {
          name: 'Yelkenli',
          description: 'Yelkenli tekneler',
          subcategories: BOAT_BRANDS.slice(0, 15).map(brand => ({ name: brand, description: `${brand} yelkenli` }))
        },
        {
          name: 'Katamaran',
          description: 'Çift gövdeli tekneler',
          subcategories: ['Lagoon', 'Fountaine Pajot', 'Leopard', 'Nautitech', 'Bali', 'Other'].map(b => ({ name: b, description: `${b} katamaran` }))
        },
        {
          name: 'Sürat Teknesi',
          description: 'Hızlı spor tekneleri',
          subcategories: ['MasterCraft', 'Malibu', 'Nautique', 'Supra', 'Moomba', 'Other'].map(b => ({ name: b, description: `${b} sürat teknesi` }))
        },
        {
          name: 'Bot',
          description: 'Küçük botlar',
          subcategories: ['Quicksilver', 'Bayliner', 'Sea Ray', 'Yamaha', 'Other'].map(b => ({ name: b, description: `${b} bot` }))
        },
        {
          name: 'Jet Ski',
          description: 'Su jetleri',
          subcategories: ['Yamaha', 'Sea-Doo', 'Kawasaki', 'Other'].map(b => ({ name: b, description: `${b} jet ski` }))
        },
        {
          name: 'Güverte Teknesi',
          description: 'Deck boat',
          subcategories: ['Bayliner', 'Yamaha', 'Other'].map(b => ({ name: b, description: `${b} deck boat` }))
        },
        {
          name: 'Sandal',
          description: 'Geleneksel sandallar',
          subcategories: [{ name: 'Geleneksel', description: 'Geleneksel sandal' }, { name: 'Modern', description: 'Modern sandal' }]
        },
        {
          name: 'Tur Teknesi',
          description: 'Tur ve gezi tekneleri',
          subcategories: [{ name: 'Günlük Tur', description: 'Günlük tur teknesi' }, { name: 'Konaklama', description: 'Konaklama tur teknesi' }]
        },
        {
          name: 'Gulet',
          description: 'Geleneksel Türk guletleri',
          subcategories: [{ name: 'Klasik', description: 'Klasik gulet' }, { name: 'Modern', description: 'Modern gulet' }]
        },
        {
          name: 'Balıkçı Teknesi',
          description: 'Balıkçılık amaçlı tekneler',
          subcategories: [{ name: 'Ticari', description: 'Ticari balıkçı teknesi' }, { name: 'Sport', description: 'Sport balıkçı teknesi' }]
        },
        {
          name: 'Şişme Bot',
          description: 'Şişme botlar ve RIB',
          subcategories: ['Zodiac', 'Highfield', 'Other'].map(b => ({ name: b, description: `${b} şişme bot` }))
        },
        {
          name: 'Yolcu Gemisi',
          description: 'Yolcu gemileri',
          subcategories: [{ name: 'Feribot', description: 'Feribot gemileri' }, { name: 'Yolcu Gemisi', description: 'Yolcu gemileri' }]
        },
        {
          name: 'Yük Gemisi',
          description: 'Yük gemileri ve tankerler',
          subcategories: [{ name: 'Yük Gemisi', description: 'Yük gemileri' }, { name: 'Tanker', description: 'Tanker gemiler' }]
        },
      ]
    },
    {
      name: 'Kiralık',
      description: 'Kiralık deniz araçları',
      subcategories: [
        {
          name: 'Motoryat',
          description: 'Motor yatlar',
          subcategories: BOAT_BRANDS.slice(0, 20).map(brand => ({ name: brand, description: `${brand} motoryat` }))
        },
        {
          name: 'Yelkenli',
          description: 'Yelkenli tekneler',
          subcategories: BOAT_BRANDS.slice(0, 15).map(brand => ({ name: brand, description: `${brand} yelkenli` }))
        },
        {
          name: 'Katamaran',
          description: 'Çift gövdeli tekneler',
          subcategories: ['Lagoon', 'Fountaine Pajot', 'Leopard', 'Nautitech', 'Bali', 'Other'].map(b => ({ name: b, description: `${b} katamaran` }))
        },
        {
          name: 'Gulet',
          description: 'Gulet kiralama',
          subcategories: [{ name: 'Kabin', description: 'Kabin kiralama' }, { name: 'Komple', description: 'Komple kiralama' }]
        },
        {
          name: 'Tur Teknesi',
          description: 'Tur tekneleri',
          subcategories: [{ name: 'Günlük', description: 'Günlük tur' }, { name: 'Haftalık', description: 'Haftalık tur' }]
        },
        {
          name: 'Jet Ski',
          description: 'Jet ski kiralama',
          subcategories: ['Yamaha', 'Sea-Doo', 'Kawasaki', 'Other'].map(b => ({ name: b, description: `${b} jet ski` }))
        },
      ]
    }
  ]
};
