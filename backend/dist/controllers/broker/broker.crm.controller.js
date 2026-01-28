"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivity = exports.getLeadActivities = exports.updateLead = exports.createLead = exports.getLeads = void 0;
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const schema_2 = require("../../db/schema");
// ============================================
// CRM: GET LEADS
// ============================================
const getLeads = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.userId, userId))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
        }
        const { status, priority, page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.crmLeads.brokerId, broker.id)];
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.crmLeads.status, status));
        }
        if (priority) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.crmLeads.priority, priority));
        }
        const leadsData = await db_1.db
            .select({
            id: schema_1.crmLeads.id,
            name: schema_1.crmLeads.name,
            email: schema_1.crmLeads.email,
            phone: schema_1.crmLeads.phone,
            source: schema_1.crmLeads.source,
            status: schema_1.crmLeads.status,
            priority: schema_1.crmLeads.priority,
            budget: schema_1.crmLeads.budget,
            interestedCategories: schema_1.crmLeads.interestedCategories,
            notes: schema_1.crmLeads.notes,
            estimatedValue: schema_1.crmLeads.estimatedValue,
            probability: schema_1.crmLeads.probability,
            expectedCloseDate: schema_1.crmLeads.expectedCloseDate,
            lastContactDate: schema_1.crmLeads.lastContactDate,
            nextFollowUp: schema_1.crmLeads.nextFollowUp,
            lostReason: schema_1.crmLeads.lostReason,
            createdAt: schema_1.crmLeads.createdAt,
            updatedAt: schema_1.crmLeads.updatedAt,
            listingTitle: schema_1.listings.title,
            listingId: schema_1.crmLeads.listingId,
        })
            .from(schema_1.crmLeads)
            .leftJoin(schema_1.listings, (0, drizzle_orm_1.eq)(schema_1.crmLeads.listingId, schema_1.listings.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.crmLeads.nextFollowUp), (0, drizzle_orm_1.desc)(schema_1.crmLeads.createdAt))
            .limit(Number(limit))
            .offset(offset);
        // JSON alanları parse et
        const leads = leadsData.map(lead => ({
            ...lead,
            budget: lead.budget ? JSON.parse(lead.budget) : null,
            interestedCategories: lead.interestedCategories ? JSON.parse(lead.interestedCategories) : null,
        }));
        // Toplam sayı
        const [totalCount] = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.crmLeads)
            .where((0, drizzle_orm_1.and)(...conditions));
        res.json({
            leads,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: totalCount?.count || 0,
                totalPages: Math.ceil((totalCount?.count || 0) / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({ error: 'Leadler alınamadı' });
    }
};
exports.getLeads = getLeads;
// ============================================
// CRM: CREATE LEAD
// ============================================
const createLead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.userId, userId))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
        }
        const { listingId, name, email, phone, source, priority = 'MEDIUM', budget, interestedCategories, notes, estimatedValue, probability, expectedCloseDate, } = req.body;
        const newLead = {
            id: (0, schema_2.generateId)(),
            brokerId: broker.id,
            listingId,
            userId: null, // Kayıtlı olmayan kullanıcılar için
            name,
            email,
            phone,
            source,
            status: 'NEW',
            priority,
            budget: budget ? JSON.stringify(budget) : null,
            interestedCategories: interestedCategories ? JSON.stringify(interestedCategories) : null,
            notes,
            estimatedValue,
            probability,
            expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        };
        const [lead] = await db_1.db.insert(schema_1.crmLeads).values(newLead).returning();
        res.status(201).json(lead);
    }
    catch (error) {
        console.error('Create lead error:', error);
        res.status(500).json({ error: 'Lead oluşturulamadı' });
    }
};
exports.createLead = createLead;
// ============================================
// CRM: UPDATE LEAD
// ============================================
const updateLead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.userId, userId))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
        }
        const { id } = req.params;
        const { status, priority, budget, interestedCategories, notes, estimatedValue, probability, expectedCloseDate, nextFollowUp, lostReason, } = req.body;
        // Lead'in bu broker'a ait olduğunu kontrol et
        const [existingLead] = await db_1.db
            .select()
            .from(schema_1.crmLeads)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.crmLeads.id, id), (0, drizzle_orm_1.eq)(schema_1.crmLeads.brokerId, broker.id)))
            .limit(1);
        if (!existingLead) {
            return res.status(404).json({ error: 'Lead bulunamadı' });
        }
        await db_1.db
            .update(schema_1.crmLeads)
            .set({
            status,
            priority,
            budget: budget ? JSON.stringify(budget) : existingLead.budget,
            interestedCategories: interestedCategories ? JSON.stringify(interestedCategories) : existingLead.interestedCategories,
            notes,
            estimatedValue,
            probability,
            expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : existingLead.expectedCloseDate,
            nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : existingLead.nextFollowUp,
            lostReason,
            lastContactDate: status !== existingLead.status ? new Date() : existingLead.lastContactDate,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.crmLeads.id, id));
        res.json({ message: 'Lead güncellendi' });
    }
    catch (error) {
        console.error('Update lead error:', error);
        res.status(500).json({ error: 'Lead güncellenemedi' });
    }
};
exports.updateLead = updateLead;
// ============================================
// CRM: GET LEAD ACTIVITIES
// ============================================
const getLeadActivities = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.userId, userId))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
        }
        const { leadId } = req.params;
        // Lead'in bu broker'a ait olduğunu kontrol et
        const [lead] = await db_1.db
            .select()
            .from(schema_1.crmLeads)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.crmLeads.id, leadId), (0, drizzle_orm_1.eq)(schema_1.crmLeads.brokerId, broker.id)))
            .limit(1);
        if (!lead) {
            return res.status(404).json({ error: 'Lead bulunamadı' });
        }
        const activities = await db_1.db
            .select()
            .from(schema_1.crmActivities)
            .where((0, drizzle_orm_1.eq)(schema_1.crmActivities.leadId, leadId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.crmActivities.createdAt));
        // JSON alanları parse et
        const parsedActivities = activities.map(activity => ({
            ...activity,
            attachments: activity.attachments ? JSON.parse(activity.attachments) : null,
        }));
        res.json(parsedActivities);
    }
    catch (error) {
        console.error('Get lead activities error:', error);
        res.status(500).json({ error: 'Aktiviteler alınamadı' });
    }
};
exports.getLeadActivities = getLeadActivities;
// ============================================
// CRM: CREATE ACTIVITY
// ============================================
const createActivity = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const [broker] = await db_1.db
            .select()
            .from(schema_1.brokers)
            .where((0, drizzle_orm_1.eq)(schema_1.brokers.userId, userId))
            .limit(1);
        if (!broker) {
            return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
        }
        const { leadId } = req.params;
        const { type, subject, description, duration, outcome, nextFollowUp, attachments } = req.body;
        // Lead'in bu broker'a ait olduğunu kontrol et
        const [lead] = await db_1.db
            .select()
            .from(schema_1.crmLeads)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.crmLeads.id, leadId), (0, drizzle_orm_1.eq)(schema_1.crmLeads.brokerId, broker.id)))
            .limit(1);
        if (!lead) {
            return res.status(404).json({ error: 'Lead bulunamadı' });
        }
        const newActivity = {
            id: (0, schema_2.generateId)(),
            leadId,
            brokerId: broker.id,
            type,
            subject,
            description,
            duration,
            outcome,
            nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
            attachments: attachments ? JSON.stringify(attachments) : null,
        };
        const [activity] = await db_1.db.insert(schema_1.crmActivities).values(newActivity).returning();
        // Lead'in lastContactDate ve nextFollowUp alanlarını güncelle
        await db_1.db
            .update(schema_1.crmLeads)
            .set({
            lastContactDate: new Date(),
            nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : lead.nextFollowUp,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.crmLeads.id, leadId));
        res.status(201).json(activity);
    }
    catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Aktivite oluşturulamadı' });
    }
};
exports.createActivity = createActivity;
