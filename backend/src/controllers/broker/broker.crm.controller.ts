import { Request, Response } from 'express';
import { db } from '../../lib/db';
import {
  brokers,
  crmLeads,
  crmActivities,
  listings,
  NewCrmLead,
  NewCrmActivity,
  LeadStatus,
  LeadPriority,
} from '../../db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { generateId } from '../../db/schema';

// ============================================
// CRM: GET LEADS
// ============================================
export const getLeads = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
    }

    const { status, priority, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = [eq(crmLeads.brokerId, broker.id)];

    if (status) {
      conditions.push(eq(crmLeads.status, status as LeadStatus));
    }

    if (priority) {
      conditions.push(eq(crmLeads.priority, priority as LeadPriority));
    }

    const leadsData = await db
      .select({
        id: crmLeads.id,
        name: crmLeads.name,
        email: crmLeads.email,
        phone: crmLeads.phone,
        source: crmLeads.source,
        status: crmLeads.status,
        priority: crmLeads.priority,
        budget: crmLeads.budget,
        interestedCategories: crmLeads.interestedCategories,
        notes: crmLeads.notes,
        estimatedValue: crmLeads.estimatedValue,
        probability: crmLeads.probability,
        expectedCloseDate: crmLeads.expectedCloseDate,
        lastContactDate: crmLeads.lastContactDate,
        nextFollowUp: crmLeads.nextFollowUp,
        lostReason: crmLeads.lostReason,
        createdAt: crmLeads.createdAt,
        updatedAt: crmLeads.updatedAt,
        listingTitle: listings.title,
        listingId: crmLeads.listingId,
      })
      .from(crmLeads)
      .leftJoin(listings, eq(crmLeads.listingId, listings.id))
      .where(and(...conditions))
      .orderBy(desc(crmLeads.nextFollowUp), desc(crmLeads.createdAt))
      .limit(Number(limit))
      .offset(offset);

    // JSON alanları parse et
    const leads = leadsData.map(lead => ({
      ...lead,
      budget: lead.budget ? JSON.parse(lead.budget) : null,
      interestedCategories: lead.interestedCategories ? JSON.parse(lead.interestedCategories) : null,
    }));

    // Toplam sayı
    const [totalCount] = await db
      .select({ count: count() })
      .from(crmLeads)
      .where(and(...conditions));

    res.json({
      leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Leadler alınamadı' });
  }
};

// ============================================
// CRM: CREATE LEAD
// ============================================
export const createLead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
    }

    const {
      listingId,
      name,
      email,
      phone,
      source,
      priority = 'MEDIUM',
      budget,
      interestedCategories,
      notes,
      estimatedValue,
      probability,
      expectedCloseDate,
    } = req.body;

    const newLead: NewCrmLead = {
      id: generateId(),
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

    const [lead] = await db.insert(crmLeads).values(newLead).returning();

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Lead oluşturulamadı' });
  }
};

// ============================================
// CRM: UPDATE LEAD
// ============================================
export const updateLead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
    }

    const { id } = req.params;
    const {
      status,
      priority,
      budget,
      interestedCategories,
      notes,
      estimatedValue,
      probability,
      expectedCloseDate,
      nextFollowUp,
      lostReason,
    } = req.body;

    // Lead'in bu broker'a ait olduğunu kontrol et
    const [existingLead] = await db
      .select()
      .from(crmLeads)
      .where(and(eq(crmLeads.id, id), eq(crmLeads.brokerId, broker.id)))
      .limit(1);

    if (!existingLead) {
      return res.status(404).json({ error: 'Lead bulunamadı' });
    }

    await db
      .update(crmLeads)
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
      .where(eq(crmLeads.id, id));

    res.json({ message: 'Lead güncellendi' });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Lead güncellenemedi' });
  }
};

// ============================================
// CRM: GET LEAD ACTIVITIES
// ============================================
export const getLeadActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
    }

    const { leadId } = req.params;

    // Lead'in bu broker'a ait olduğunu kontrol et
    const [lead] = await db
      .select()
      .from(crmLeads)
      .where(and(eq(crmLeads.id, leadId), eq(crmLeads.brokerId, broker.id)))
      .limit(1);

    if (!lead) {
      return res.status(404).json({ error: 'Lead bulunamadı' });
    }

    const activities = await db
      .select()
      .from(crmActivities)
      .where(eq(crmActivities.leadId, leadId))
      .orderBy(desc(crmActivities.createdAt));

    // JSON alanları parse et
    const parsedActivities = activities.map(activity => ({
      ...activity,
      attachments: activity.attachments ? JSON.parse(activity.attachments) : null,
    }));

    res.json(parsedActivities);
  } catch (error) {
    console.error('Get lead activities error:', error);
    res.status(500).json({ error: 'Aktiviteler alınamadı' });
  }
};

// ============================================
// CRM: CREATE ACTIVITY
// ============================================
export const createActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [broker] = await db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return res.status(404).json({ error: 'Broker kaydı bulunamadı' });
    }

    const { leadId } = req.params;
    const { type, subject, description, duration, outcome, nextFollowUp, attachments } = req.body;

    // Lead'in bu broker'a ait olduğunu kontrol et
    const [lead] = await db
      .select()
      .from(crmLeads)
      .where(and(eq(crmLeads.id, leadId), eq(crmLeads.brokerId, broker.id)))
      .limit(1);

    if (!lead) {
      return res.status(404).json({ error: 'Lead bulunamadı' });
    }

    const newActivity: NewCrmActivity = {
      id: generateId(),
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

    const [activity] = await db.insert(crmActivities).values(newActivity).returning();

    // Lead'in lastContactDate ve nextFollowUp alanlarını güncelle
    await db
      .update(crmLeads)
      .set({
        lastContactDate: new Date(),
        nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : lead.nextFollowUp,
      })
      .where(eq(crmLeads.id, leadId));

    res.status(201).json(activity);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Aktivite oluşturulamadı' });
  }
};
