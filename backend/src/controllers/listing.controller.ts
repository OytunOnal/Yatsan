import { Request, Response } from 'express';
import { z } from 'zod';

const createListingSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.enum(['YACHT', 'PART', 'MARINA']),
  location: z.string().optional(),
  length: z.number().optional(),
  beam: z.number().optional(),
  year: z.number().optional(),
  engineHours: z.number().optional(),
  condition: z.string().optional(),
  brand: z.string().optional(),
  oemCode: z.string().optional(),
  maxLength: z.number().optional(),
  services: z.string().optional()
});

export const createListing = async (req: Request, res: Response) => {
  try {
    const data = createListingSchema.parse(req.body);

    // Category specific validation
    if (data.category === 'YACHT') {
      if (!data.length || !data.beam || !data.year || !data.engineHours) {
        return res.status(400).json({ message: 'Yacht requires length, beam, year, engineHours' });
      }
    } else if (data.category === 'PART') {
      if (!data.condition || !data.brand || !data.oemCode) {
        return res.status(400).json({ message: 'Part requires condition, brand, oemCode' });
      }
    } else if (data.category === 'MARINA') {
      if (!data.maxLength || !data.services) {
        return res.status(400).json({ message: 'Marina requires maxLength, services' });
      }
    }

    // Create listing
    const listing = await req.prisma.listing.create({
      data: {
        ...data,
        userId: req.user.id,
        status: 'PENDING'
      }
    });

    // Handle images
    if (req.files && Array.isArray(req.files)) {
      const images = req.files.map((file: Express.Multer.File, index: number) => ({
        url: `/uploads/${file.filename}`,
        orderIndex: index,
        listingId: listing.id
      }));
      await req.prisma.listingImage.createMany({ data: images });
    }

    res.status(201).json({ listing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, location, status, page = 1, limit = 20 } = req.query;

    const where: any = {};

    if (category) where.category = category;
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (location) where.location = { contains: location as string };
    if (status) where.status = status;
    else {
      // Sadece APPROVED, admin hariç
      if (req.user?.userType !== 'ADMIN') {
        where.status = 'APPROVED';
      }
    }

    const listings = await req.prisma.listing.findMany({
      where,
      include: { images: true, user: { select: { id: true, email: true, userType: true } } },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await req.prisma.listing.count({ where });

    res.json({ listings, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await req.prisma.listing.findUnique({
      where: { id },
      include: { images: true, user: { select: { id: true, email: true, userType: true } } }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const listing = await req.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Sadece sahibi veya admin
    if (listing.userId !== req.user.id && req.user.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedListing = await req.prisma.listing.update({
      where: { id },
      data
    });

    res.json({ listing: updatedListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await req.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Sadece sahibi veya admin
    if (listing.userId !== req.user.id && req.user.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await req.prisma.listing.update({
      where: { id },
      data: { status: 'DELETED' }
    });

    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};