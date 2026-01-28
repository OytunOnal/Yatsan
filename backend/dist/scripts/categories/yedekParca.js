"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yedekParca = void 0;
const brands_1 = require("./brands");
exports.yedekParca = {
    name: 'Yedek Parça',
    icon: '🔩',
    description: 'Orijinal ve muadil yedek parçalar',
    subcategories: [
        {
            name: 'Motor Yedek Parçaları',
            description: 'Motor yedek parçaları',
            subcategories: [
                { name: 'Dıştan Motor Yedek Parça', description: 'Dıştan motor yedek parçaları' },
                { name: 'İçten Motor Yedek Parça', description: 'İçten motor yedek parçaları' },
                { name: 'Piston & Segman', description: 'Piston ve segman setleri' },
                { name: 'Crankshaft', description: 'Krank mili' },
                { name: 'Valve & Spring', description: 'Valf ve yaylar' },
                { name: 'Gasket Set', description: 'Contalar' },
                { name: 'Yağ Pompası', description: 'Yağ pompaları' },
                { name: 'Su Pompası', description: 'Su pompaları' },
                { name: 'Yakıt Pompası', description: 'Yakıt pompaları' },
                { name: 'Turbocharger', description: 'Turbocharger' },
            ]
        },
        {
            name: 'Piston ve Segman',
            description: 'Piston ve segman setleri',
            subcategories: brands_1.MOTOR_BRANDS.map(brand => ({ name: brand, description: `${brand} piston ve segman` }))
        },
        {
            name: 'Filtreler',
            description: 'Çeşitli filtreler',
            subcategories: [
                { name: 'Yağ Filtresi', description: 'Yağ filtreleri' },
                { name: 'Yakıt Filtresi', description: 'Yakıt filtreleri' },
                { name: 'Hava Filtresi', description: 'Hava filtreleri' },
                { name: 'Su Filtresi', description: 'Su filtreleri' },
                { name: 'Sintine Filtresi', description: 'Sintine filtreleri' },
            ]
        },
        {
            name: 'Pompa',
            description: 'Her türlü pompa',
            subcategories: [
                { name: 'Yağ Pompası', description: 'Yağ pompaları' },
                { name: 'Su Pompası', description: 'Su pompaları' },
                { name: 'Yakıt Pompası', description: 'Yakıt pompaları' },
                { name: 'Bilge Pompası', description: 'Sintine pompaları' },
                { name: 'Diğer Pompalar', description: 'Diğer pompa türleri' },
            ]
        },
        {
            name: 'Elektronik Yedek Parçaları',
            description: 'Elektronik yedek parçaları',
            subcategories: [
                { name: 'Sensörler', description: 'Elektronik sensörler' },
                { name: 'Ekranlar', description: 'Ekranlar' },
                { name: 'Antenler', description: 'Antenler' },
                { name: 'Kablolar', description: 'Kablolar' },
                { name: 'Batarya', description: 'Bataryalar' },
            ]
        },
        {
            name: 'Elektrik Parçaları',
            description: 'Elektrik yedekleri',
            subcategories: [
                { name: 'Akü', description: 'Aküler' },
                { name: 'Alternatör', description: 'Şarj dinamosu' },
                { name: 'Marş Motoru', description: 'Marş motorları' },
                { name: 'Distribütör', description: 'Distribütör parçaları' },
                { name: 'Bobin', description: 'Bobinler' },
            ]
        },
        {
            name: 'Dümen Sistemi',
            description: 'Dümen parçaları',
            subcategories: [
                { name: 'Dümen', description: 'Dümenler' },
                { name: 'Dümen Mili', description: 'Dümen milleri' },
                { name: 'Seya Takımı', description: 'Seya takımları' },
                { name: 'Hydrolik', description: 'Hidrolik sistem parçaları' },
            ]
        },
        {
            name: 'Pervane',
            description: 'Pervaneler ve aksar',
            subcategories: [
                { name: 'Pervane', description: 'Tekne pervaneleri' },
                { name: 'Pervane Mili', description: 'Pervane milleri' },
                { name: 'Kampana', description: 'Kampana ve perya' },
                { name: 'Saplama', description: 'Saplamalar' },
            ]
        },
        {
            name: 'Hidrolik',
            description: 'Hidrolik parçalar',
            subcategories: [
                { name: 'Hidrolik Silindir', description: 'Hidrolik silindirler' },
                { name: 'Hidrolik Pompa', description: 'Hidrolik pompalar' },
                { name: 'Hidrolik Motor', description: 'Hidrolik motorlar' },
                { name: 'Hidrolik Yağ', description: 'Hidrolik yağlar' },
            ]
        },
        {
            name: 'Contalar',
            description: 'Motor ve sistem contaları',
            subcategories: [
                { name: 'Silindir Contası', description: 'Silindir contaları' },
                { name: 'Kapak Contası', description: 'Kapak contaları' },
                { name: 'Exhaust Conta', description: 'Egzoz contası' },
                { name: 'Vita Contası', description: 'Vita contası' },
                { name: 'Diğer Contalar', description: 'Diğer contalar' },
            ]
        },
        {
            name: 'Sensörler',
            description: 'Elektronik sensörler',
            subcategories: [
                { name: 'Sıcaklık Sensörü', description: 'Sıcaklık sensörleri' },
                { name: 'Basınç Sensörü', description: 'Basınç sensörleri' },
                { name: 'Seviye Sensörü', description: 'Seviye sensörleri' },
                { name: 'Hız Sensörü', description: 'Hız sensörleri' },
                { name: 'Oksijen Sensörü', description: 'Oksijen sensörleri' },
            ]
        },
        {
            name: 'Halat ve Zincir',
            description: 'Demirleme ekipmanı',
            subcategories: [
                { name: 'Halat', description: 'Deniz halatları' },
                { name: 'Zincir', description: 'Demirleme zincirleri' },
                { name: 'Şamandıra Halatı', description: 'Şamandıra halatları' },
            ]
        },
        {
            name: 'Çapa Parçaları',
            description: 'Çapa yedek parçaları',
            subcategories: [
                { name: 'Çapa', description: 'Çapa çeşitleri' },
                { name: 'Çapa Zinciri', description: 'Çapa zincirleri' },
                { name: 'Çapa Bağlantı', description: 'Çapa bağlantı parçaları' },
            ]
        },
        {
            name: 'Aydınlatma',
            description: 'Seyir ve iç aydınlatma',
            subcategories: [
                { name: 'Seyir Lambası', description: 'Seyir lambaları' },
                { name: 'Spot Işık', description: 'Spot ışıklar' },
                { name: 'LED Aydınlatma', description: 'LED aydınlatma' },
                { name: 'Ampul', description: 'Ampuller' },
            ]
        },
        {
            name: 'Güverte Ekipmanları',
            description: 'Güverte yedek parçaları',
            subcategories: [
                { name: 'Korkuluk', description: 'Korkuluk parçaları' },
                { name: 'Merdiven', description: 'Merdiven parçaları' },
                { name: 'Ring', description: 'Ringler' },
                { name: 'Lamba', description: 'Güverte lambaları' },
            ]
        },
        {
            name: 'Diğer Yedek Parçalar',
            description: 'Diğer yedek parçalar',
            subcategories: [
                { name: 'Filtreler', description: 'Çeşitli filtreler' },
                { name: 'Contalar', description: 'Contalar' },
                { name: 'Valf & Vana', description: 'Valf ve vanalar' },
                { name: 'Pompa Parçaları', description: 'Pompa parçaları' },
            ]
        },
    ]
};
