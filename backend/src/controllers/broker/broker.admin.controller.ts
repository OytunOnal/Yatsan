import { Request, Response } from 'express';
import { db } from '../../lib/db';
import { brokers, users } from '../../db/schema';
import { eq, desc, count } from 'drizzle-orm';

// ============================================
// ADMIN: GET PENDING BROKERS
// ============================================
export const getPendingBrokers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const pendingBrokers = await db
      .select({
        id: brokers.id,
        businessName: brokers.businessName,
        slug: brokers.slug,
        taxNumber: brokers.taxNumber,
        taxOffice: brokers.taxOffice,
        licenseNumber: brokers.licenseNumber,
        licenseExpiry: brokers.licenseExpiry,
        createdAt: brokers.createdAt,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userPhone: users.phone,
      })
      .from(brokers)
      .innerJoin(users, eq(brokers.userId, users.id))
      .where(eq(brokers.status, 'PENDING'))
      .orderBy(desc(brokers.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: count() })
      .from(brokers)
      .where(eq(brokers.status, 'PENDING'));

    res.json({
      brokers: pendingBrokers,
      pagination: {
        page,
        limit,
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get pending brokers error:', error);
    res.status(500).json({ error: 'Bekleyen brokerlar alınamadı' });
  }
};

// ============================================
// ADMIN: APPROVE/REJECT BROKER
// ============================================
export const updateBrokerStatus = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.id, id))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker bulunamadı' });
    }

    const updateData: any = {
      status,
      rejectionReason,
    };

    if (status === 'APPROVED') {
      updateData.verifiedAt = new Date();
      updateData.verifiedBy = adminId;
    }

    await db
      .update(brokers)
      .set(updateData)
      .where(eq(brokers.id, id));

    res.json({ message: `Broker ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}` });
  } catch (error) {
    console.error('Update broker status error:', error);
    res.status(500).json({ error: 'Broker durumu güncellenemedi' });
  }
};
