"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBrokerStatus = exports.getPendingBrokers = void 0;
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// ============================================
// ADMIN: GET PENDING BROKERS
// ============================================
const getPendingBrokers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const pendingBrokers = await db_1.db
            .select({
            id: schema_1.brokers.id,
            businessName: schema_1.brokers.businessName,
            slug: schema_1.brokers.slug,
            taxNumber: schema_1.brokers.taxNumber,
            taxOffice: schema_1.brokers.taxOffice,
            licenseNumber: schema_1.brokers.licenseNumber,
            licenseExpiry: schema_1.brokers.licenseExpiry,
            createdAt: schema_1.brokers.createdAt,
            userEmail: schema_1.users.email,
            userFirstName: schema_1.users.firstName,
            userLastName: schema_1.users.lastName,
            userPhone: schema_1.users.phone,
        })
            .from(schema_1.brokers)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.brokers.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.status, 'PENDING'))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.brokers.createdAt))
            .limit(limit)
            .offset(offset);
        const [totalCount] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.status, 'PENDING'));
        res.json({
            brokers: pendingBrokers,
            pagination: {
                page,
                limit,
                total: totalCount?.count || 0,
                totalPages: Math.ceil((totalCount?.count || 0) / limit),
            },
        });
    }
    catch (error) {
        console.error('Get pending brokers error:', error);
        res.status(500).json({ error: 'Bekleyen brokerlar alınamadı' });
    }
};
exports.getPendingBrokers = getPendingBrokers;
// ============================================
// ADMIN: APPROVE/REJECT BROKER
// ============================================
const updateBrokerStatus = async (req, res) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.id, id))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker bulunamadı' });
        }
        const updateData = {
            status,
            rejectionReason,
        };
        if (status === 'APPROVED') {
            updateData.verifiedAt = new Date();
            updateData.verifiedBy = adminId;
        }
        await db_1.db
            .update(schema_1.brokers)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.id, id));
        res.json({ message: `Broker ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}` });
    }
    catch (error) {
        console.error('Update broker status error:', error);
        res.status(500).json({ error: 'Broker durumu güncellenemedi' });
    }
};
exports.updateBrokerStatus = updateBrokerStatus;
