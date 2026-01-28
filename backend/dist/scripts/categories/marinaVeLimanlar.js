"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marinaVeLimanlar = void 0;
exports.marinaVeLimanlar = {
    name: 'Marina ve Limanlar',
    icon: '⚓',
    description: 'Bağlama yeri ve liman hizmetleri',
    subcategories: [
        {
            name: 'Marinalar',
            description: 'Türkiye marinaları',
            subcategories: [
                {
                    name: 'Ege Bölgesi',
                    description: 'Ege bölgesi marinaları',
                    subcategories: [
                        { name: 'Muğla', description: 'Bodrum, Yalıkavak, Marmaris, Fethiye, Göcek' },
                        { name: 'İzmir', description: 'Alsancak, Levent, Çeşme' },
                        { name: 'Aydın', description: 'Kuşadası, Didim' },
                        { name: 'Manisa', description: 'Manisa marinaları' },
                    ]
                },
                {
                    name: 'Akdeniz Bölgesi',
                    description: 'Akdeniz bölgesi marinaları',
                    subcategories: [
                        { name: 'Antalya', description: 'Setur, Kemer, Kaş, Finike' },
                        { name: 'Mersin', description: 'Mersin marinaları' },
                        { name: 'Adana', description: 'Adana marinaları' },
                        { name: 'Hatay', description: 'İskenderun marinaları' },
                    ]
                },
                {
                    name: 'Marmara Bölgesi',
                    description: 'Marmara bölgesi marinaları',
                    subcategories: [
                        { name: 'İstanbul', description: 'İstanbul marinaları' },
                        { name: 'Bursa', description: 'Bursa marinaları' },
                        { name: 'Çanakkale', description: 'Çanakkale marinaları' },
                        { name: 'Balıkesir', description: 'Balıkesir marinaları' },
                    ]
                },
                {
                    name: 'Karadeniz Bölgesi',
                    description: 'Karadeniz bölgesi marinaları',
                    subcategories: [
                        { name: 'Samsun', description: 'Samsun marinaları' },
                        { name: 'Trabzon', description: 'Trabzon marinaları' },
                        { name: 'Sinop', description: 'Sinop marinaları' },
                        { name: 'Zonguldak', description: 'Zonguldak marinaları' },
                    ]
                },
            ]
        },
        {
            name: 'Limanlar',
            description: 'Liman hizmetleri',
            subcategories: [
                { name: 'Ticari Liman', description: 'Ticari limanlar' },
                { name: 'Balıkçı Limanı', description: 'Balıkçı limanları' },
                { name: 'Yolcu Limanı', description: 'Yolcu limanları' },
                { name: 'Yükleme Limanı', description: 'Yükleme limanları' },
            ]
        },
    ]
};
