"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.getReports = exports.updateUserStatus = exports.getUsers = exports.rejectListing = exports.approveListing = exports.getPendingListings = exports.getPlatformStats = void 0;
const db_1 = require("../lib/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// ============================================
// PLATFORM STATS
// ============================================
const getPlatformStats = async (req, res) => {
    try {
        // Kullanıcı istatistikleri
        const [userStats] = await db_1.db
            .select({
            totalUsers: (0, drizzle_orm_1.count)(),
            activeUsers: (0, drizzle_orm_1.count)(),
            newUsersThisMonth: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.status, 'ACTIVE'));
        // İlan istatistikleri
        const [listingStats] = await db_1.db
            .select({
            totalListings: (0, drizzle_orm_1.count)(),
            pendingListings: (0, drizzle_orm_1.count)(),
            approvedListings: (0, drizzle_orm_1.count)(),
            rejectedListings: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.listings);
        // Mesaj istatistikleri
        const [messageStats] = await db_1.db
            .select({
            totalMessages: (0, drizzle_orm_1.count)(),
            unreadMessages: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.read, false));
        // Broker istatistikleri
        const [brokerStats] = await db_1.db
            .select({
            totalBrokers: (0, drizzle_orm_1.count)(),
            pendingBrokers: (0, drizzle_orm_1.count)(),
            approvedBrokers: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.brokers);
        // Bu ayın başlangıcı
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        // Bu ay kayıt olan kullanıcılar
        const [newUsersThisMonth] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.status, 'ACTIVE'), (0, drizzle_orm_1.gte)(schema_1.users.createdAt, thisMonthStart)));
        // Bu ay oluşturulan ilanlar
        const [newListingsThisMonth] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.gte)(schema_1.listings.createdAt, thisMonthStart));
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
    }
    catch (error) {
        console.error('Get platform stats error:', error);
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
};
exports.getPlatformStats = getPlatformStats;
// ============================================
// LISTING MODERATION
// ============================================
const getPendingListings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const pendingListings = await db_1.db
            .select({
            id: schema_1.listings.id,
            title: schema_1.listings.title,
            price: schema_1.listings.price,
            currency: schema_1.listings.currency,
            listingType: schema_1.listings.listingType,
            location: schema_1.listings.location,
            createdAt: schema_1.listings.createdAt,
            userId: schema_1.listings.userId,
            userEmail: schema_1.users.email,
            userFirstName: schema_1.users.firstName,
            userLastName: schema_1.users.lastName,
        })
            .from(schema_1.listings)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.listings.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.listings.status, 'PENDING'))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.listings.createdAt))
            .limit(limit)
            .offset(offset);
        const [totalCount] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.status, 'PENDING'));
        res.json({
            listings: pendingListings,
            pagination: {
                page,
                limit,
                total: totalCount?.count || 0,
                totalPages: Math.ceil((totalCount?.count || 0) / limit),
            },
        });
    }
    catch (error) {
        console.error('Get pending listings error:', error);
        res.status(500).json({ error: 'Bekleyen ilanlar alınamadı' });
    }
};
exports.getPendingListings = getPendingListings;
const approveListing = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.db
            .update(schema_1.listings)
            .set({ status: 'APPROVED' })
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id));
        res.json({ message: 'İlan onaylandı' });
    }
    catch (error) {
        console.error('Approve listing error:', error);
        res.status(500).json({ error: 'İlan onaylanamadı' });
    }
};
exports.approveListing = approveListing;
const rejectListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        await db_1.db
            .update(schema_1.listings)
            .set({
            status: 'REJECTED',
            rejectionReason: reason,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.listings.id, id));
        res.json({ message: 'İlan reddedildi' });
    }
    catch (error) {
        console.error('Reject listing error:', error);
        res.status(500).json({ error: 'İlan reddedilemedi' });
    }
};
exports.rejectListing = rejectListing;
// ============================================
// USER MANAGEMENT
// ============================================
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const status = req.query.status;
        const search = req.query.search;
        let conditions = [];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.users.status, status));
        }
        if (search) {
            // Arama koşulu - email, firstName veya lastName
            conditions.push((0, drizzle_orm_1.sql) `(${schema_1.users.email} ILIKE ${'%' + search + '%'} OR ${schema_1.users.firstName} ILIKE ${'%' + search + '%'} OR ${schema_1.users.lastName} ILIKE ${'%' + search + '%'})`);
        }
        const usersData = await db_1.db
            .select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            phone: schema_1.users.phone,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            userType: schema_1.users.userType,
            phoneVerified: schema_1.users.phoneVerified,
            kvkkApproved: schema_1.users.kvkkApproved,
            status: schema_1.users.status,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users)
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.users.createdAt))
            .limit(limit)
            .offset(offset);
        const [totalCount] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.users)
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined);
        res.json({
            users: usersData,
            pagination: {
                page,
                limit,
                total: totalCount?.count || 0,
                totalPages: Math.ceil((totalCount?.count || 0) / limit),
            },
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Kullanıcılar alınamadı' });
    }
};
exports.getUsers = getUsers;
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db_1.db
            .update(schema_1.users)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        res.json({ message: 'Kullanıcı durumu güncellendi' });
    }
    catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ error: 'Kullanıcı durumu güncellenemedi' });
    }
};
exports.updateUserStatus = updateUserStatus;
// ============================================
// REPORT MANAGEMENT
// ============================================
const getReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
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
    }
    catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Raporlar alınamadı' });
    }
};
exports.getReports = getReports;
// ============================================
// ANALYTICS
// ============================================
const getAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        // Günlük ilan oluşturma istatistikleri
        const dailyListings = await db_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${schema_1.listings.createdAt})`,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.gte)(schema_1.listings.createdAt, startDate))
            .groupBy((0, drizzle_orm_1.sql) `DATE(${schema_1.listings.createdAt})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${schema_1.listings.createdAt})`);
        // Günlük kullanıcı kayıt istatistikleri
        const dailyUsers = await db_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${schema_1.users.createdAt})`,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.gte)(schema_1.users.createdAt, startDate))
            .groupBy((0, drizzle_orm_1.sql) `DATE(${schema_1.users.createdAt})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${schema_1.users.createdAt})`);
        // İlan tipine göre dağılım
        const listingByType = await db_1.db
            .select({
            type: schema_1.listings.listingType,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.listings)
            .where((0, drizzle_orm_1.eq)(schema_1.listings.status, 'APPROVED'))
            .groupBy(schema_1.listings.listingType);
        // Kullanıcı durumuna göre dağılım
        const usersByStatus = await db_1.db
            .select({
            status: schema_1.users.status,
            count: (0, drizzle_orm_1.count)(),
        })
            .from(schema_1.users)
            .groupBy(schema_1.users.status);
        res.json({
            dailyListings,
            dailyUsers,
            listingByType,
            usersByStatus,
        });
    }
    catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Analitik veriler alınamadı' });
    }
};
exports.getAnalytics = getAnalytics;
