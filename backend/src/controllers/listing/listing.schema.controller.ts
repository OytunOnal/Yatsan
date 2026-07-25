import { Request, Response } from 'express';
import { ListingHandlerRegistry } from '../../handlers/listing';

// Get the singleton registry instance
const registry = ListingHandlerRegistry.getInstance();

/**
 * Belirli bir listing type'ının filtre şemasını getir
 *
 * Bu endpoint frontend'in dinamik filtre UI oluşturması için
 * type-specific filtre şemasını döndürür.
 */
export const getFilterSchema = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    if (!registry.hasType(type)) {
      return res.status(404).json({ message: 'Listing type bulunamadı' });
    }

    const handler = registry.getHandler(type);
    const filters = handler.getFilterSchema();

    res.json({ filters });
  } catch (error) {
    console.error('Filtre şeması getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Tüm listing type'larını getir (frontend için)
 * 
 * Bu endpoint frontend'in dinamik form oluşturması için
 * tüm listing type'larının şemalarını döndürür.
 */
export const getListingTypes = async (req: Request, res: Response) => {
  try {
    const schemas = registry.getAllSchemas();
    res.json({ types: schemas });
  } catch (error) {
    console.error('Listing type\'ları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Belirli bir listing type'ının şemasını getir
 */
export const getListingTypeSchema = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    if (!registry.hasType(type)) {
      return res.status(404).json({ message: 'Listing type bulunamadı' });
    }

    const handler = registry.getHandler(type);
    const schema = handler.getSchema();

    res.json({ schema });
  } catch (error) {
    console.error('Listing type şeması getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
