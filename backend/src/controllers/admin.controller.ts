import { Request, Response } from 'express';
import { z } from 'zod';

const approveListingSchema = z.object({
  id: z.string(),
});

const rejectListingSchema = z.object({
  id: z.string(),
  reason: z.string(),
});

export const getPendingListings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const listings = await req.prisma.listing.findMany({
      where: { status: 'PENDING' },
      include: { images: true, user: { select: { id: true, email: true, userType: true } } },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await req.prisma.listing.count({ where: { status: 'PENDING' } });

    res.json({ listings, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveListing = async (req: Request, res: Response) => {
  try {
    const { id } = approveListingSchema.parse(req.body);

    const listing = await req.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'PENDING') {
      return res.status(400).json({ message: 'Listing is not pending' });
    }

    await req.prisma.listing.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    // Mock notification
    console.log(`Notification: Listing ${id} has been approved`);

    res.json({ message: 'Listing approved' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectListing = async (req: Request, res: Response) => {
  try {
    const { id, reason } = rejectListingSchema.parse(req.body);

    const listing = await req.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'PENDING') {
      return res.status(400).json({ message: 'Listing is not pending' });
    }

    await (req.prisma.listing.update as any)({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: reason }
    });

    // Mock notification
    console.log(`Notification: Listing ${id} has been rejected. Reason: ${reason}`);

    res.json({ message: 'Listing rejected' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};