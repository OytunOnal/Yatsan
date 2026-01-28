import { Request, Response } from 'express';
import { db } from '../lib/db';
import { listings, users, messages, crmLeads, brokers, brokerReviews } from '../db/schema';
import { eq, and, desc, count, sql, gte, lte } from 'drizzle-orm';

// ============================================
// PLATFORM STATS
// ============================================
export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    // Kullanıcı istatistikleri
    const [userStats] = await db
      .select({
        totalUsers: count(),
        activeUsers: count(),
        newUsersThisMonth: count(),
      })
      .from(users)
      .where(eq(users.status, 'ACTIVE'));

    // İlan istatistikleri
    const [listingStats] = await db
      .select({
        totalListings: count(),
        pendingListings: count(),
        approvedListings: count(),
        rejectedListings: count(),
      })
      .from(listings);

    // Mesaj istatistikleri
    const [messageStats] = await db
      .select({
        totalMessages: count(),
        unreadMessages: count(),
      })
      .from(messages)
      .where(eq(messages.read, false));

    // Broker istatistikleri
    const [brokerStats] = await db
      .select({
        totalBrokers: count(),
        pendingBrokers: count(),
        approvedBrokers: count(),
      })
      .from(brokers);

    // Bu ayın başlangıcı
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    // Bu ay kayıt olan kullanıcılar
    const [newUsersThisMonth] = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.status, 'ACTIVE'),
          gte(users.createdAt, thisMonthStart)
        )
      );

    // Bu ay oluşturulan ilanlar
    const [newListingsThisMonth] = await db
      .select({ count: count() })
      .from(listings)
      .where(gte(listings.createdAt, thisMonthStart));

    res.json({
      users: {
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        newUsersThisMonth: newUsersThisMonth.count,
      },
      listings: {
        totalListings: listingStats.totalListings,
        pendingListings: listingStats.pendingListings,
        approvedListings: listingStats.approvedListings,
        rejectedListings: listingStats.rejectedListings,
        newListingsThisMonth: newListingsThisMonth.count,
      },
      messages: {
        totalMessages: messageStats.totalMessages,
        unreadMessages: messageStats.unreadMessages,
      },
      brokers: {
        totalBrokers: brokerStats.totalBrokers,
        pendingBrokers: brokerStats.pendingBrokers,
        approvedBrokers: brokerStats.approvedBrokers,
      },
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
};

// ============================================
// LISTING MODERATION
// ============================================
export const getPendingListings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const pendingListings = await db
      .select({
        id: listings.id,
        title: listings.title,
        price: listings.price,
        currency: listings.currency,
        listingType: listings.listingType,
        location: listings.location,
        createdAt: listings.createdAt,
        userId: listings.userId,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
      })
      .from(listings)
      .innerJoin(users, eq(listings.userId, users.id))
      .where(eq(listings.status, 'PENDING'))
      .orderBy(desc(listings.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: count() })
      .from(listings)
      .where(eq(listings.status, 'PENDING'));

    res.json({
      listings: pendingListings,
      pagination: {
        page,
        limit,
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get pending listings error:', error);
    res.status(500).json({ error: 'Bekleyen ilanlar alınamadı' });
  }
};

export const approveListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db
      .update(listings)
      .set({ status: 'APPROVED' })
      .where(eq(listings.id, id));

    res.json({ message: 'İlan onaylandı' });
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ error: 'İlan onaylanamadı' });
  }
};

export const rejectListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await db
      .update(listings)
      .set({
        status: 'REJECTED',
        rejectionReason: reason,
      })
      .where(eq(listings.id, id));

    res.json({ message: 'İlan reddedildi' });
  } catch (error) {
    console.error('Reject listing error:', error);
    res.status(500).json({ error: 'İlan reddedilemedi' });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const search = req.query.search as string;

    let conditions = [];

    if (status) {
      conditions.push(eq(users.status, status));
    }

    if (search) {
      // Arama koşulu - email, firstName veya lastName
      conditions.push(
        sql`(${users.email} ILIKE ${'%' + search + '%'} OR ${users.firstName} ILIKE ${'%' + search + '%'} OR ${users.lastName} ILIKE ${'%' + search + '%'})`
      );
    }

    const usersData = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        userType: users.userType,
        phoneVerified: users.phoneVerified,
        kvkkApproved: users.kvkkApproved,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalCount] = await db
      .select({ count: count() })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json({
      users: usersData,
      pagination: {
        page,
        limit,
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Kullanıcılar alınamadı' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db
      .update(users)
      .set({ status })
      .where(eq(users.id, id));

    res.json({ message: 'Kullanıcı durumu güncellendi' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Kullanıcı durumu güncellenemedi' });
  }
};

// ============================================
// REPORT MANAGEMENT
// ============================================
export const getReports = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    // Şimdilik boş bir liste döndürüyoruz
    // Report tablosu daha sonra eklenebilir
    res.json({
      reports: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Raporlar alınamadı' });
  }
};

// ============================================
// ANALYTICS
// ============================================
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Günlük ilan oluşturma istatistikleri
    const dailyListings = await db
      .select({
        date: sql<string>`DATE(${listings.createdAt})`,
        count: count(),
      })
      .from(listings)
      .where(gte(listings.createdAt, startDate))
      .groupBy(sql`DATE(${listings.createdAt})`)
      .orderBy(sql`DATE(${listings.createdAt})`);

    // Günlük kullanıcı kayıt istatistikleri
    const dailyUsers = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: count(),
      })
      .from(users)
      .where(gte(users.createdAt, startDate))
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);

    // İlan tipine göre dağılım
    const listingByType = await db
      .select({
        type: listings.listingType,
        count: count(),
      })
      .from(listings)
      .where(eq(listings.status, 'APPROVED'))
      .groupBy(listings.listingType);

    // Kullanıcı durumuna göre dağılım
    const usersByStatus = await db
      .select({
        status: users.status,
        count: count(),
      })
      .from(users)
      .groupBy(users.status);

    res.json({
      dailyListings,
      dailyUsers,
      listingByType,
      usersByStatus,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Analitik veriler alınamadı' });
  }
};
