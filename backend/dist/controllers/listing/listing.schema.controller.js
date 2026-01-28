"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingTypeSchema = exports.getListingTypes = exports.getFilterSchema = void 0;
const listing_1 = require("../../handlers/listing");
// Get the singleton registry instance
const registry = listing_1.ListingHandlerRegistry.getInstance();
/**
 * Belirli bir listing type'ının filtre şemasını getir
 *
 * Bu endpoint frontend'in dinamik filtre UI oluşturması için
 * type-specific filtre şemasını döndürür.
 */
const getFilterSchema = async (req, res) => {
    try {
        const { type } = req.params;
        if (!registry.hasType(type)) {
            return res.status(404).json({ message: 'Listing type bulunamadı' });
        }
        const handler = registry.getHandler(type);
        const filters = handler.getFilterSchema();
        res.json({ filters });
    }
    catch (error) {
        console.error('Filtre şeması getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getFilterSchema = getFilterSchema;
/**
 * Tüm listing type'larını getir (frontend için)
 *
 * Bu endpoint frontend'in dinamik form oluşturması için
 * tüm listing type'larının şemalarını döndürür.
 */
const getListingTypes = async (req, res) => {
    try {
        const schemas = registry.getAllSchemas();
        res.json({ types: schemas });
    }
    catch (error) {
        console.error('Listing type\'ları getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListingTypes = getListingTypes;
/**
 * Belirli bir listing type'ının şemasını getir
 */
const getListingTypeSchema = async (req, res) => {
    try {
        const { type } = req.params;
        if (!registry.hasType(type)) {
            return res.status(404).json({ message: 'Listing type bulunamadı' });
        }
        const handler = registry.getHandler(type);
        const schema = handler.getSchema();
        res.json({ schema });
    }
    catch (error) {
        console.error('Listing type şeması getirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
exports.getListingTypeSchema = getListingTypeSchema;
