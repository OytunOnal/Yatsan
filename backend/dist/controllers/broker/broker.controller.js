"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBrokerProfile = exports.getBrokerProfile = exports.registerBroker = void 0;
const db_1 = require("../../lib/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const schema_2 = require("../../db/schema");
const slug_1 = require("../utils/slug");
// ============================================
// BROKER REGISTRATION
// ============================================
const registerBroker = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { businessName, taxNumber, taxOffice, licenseNumber, licenseExpiry, profile, } = req.body;
        // Slug oluştur
        const baseSlug = (0, slug_1.generateSlug)(businessName);
        let slug = baseSlug;
        let counter = 1;
        // Benzersiz slug kontrolü
        while (true) {
            const existing = await db_1.db
                .select({ id: schema_1.brokers.id })
                .from(schema_1.brokers)
                .where((0, drizzle_orm_1.eq)(schema_1.brokers.slug, slug))
                .limit(1);
            if (existing.length === 0)
                break;
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        // Broker kaydı oluştur
        const newBroker = {
            id: (0, schema_2.generateId)(),
            userId,
            businessName,
            slug,
            taxNumber,
            taxOffice,
            licenseNumber,
            licenseExpiry: new Date(licenseExpiry),
            status: 'PENDING',
            rating: '0',
            reviewCount: 0,
            responseRate: '0',
        };
        const [broker] = await db_1.db.insert(schema_1.brokers).values(newBroker).returning();
        // Profil varsa oluştur
        if (profile) {
            const newProfile = {
                id: (0, schema_2.generateId)(),
                brokerId: broker.id,
                logo: profile.logo,
                coverImage: profile.coverImage,
                description: profile.description,
                specialties: profile.specialties ? JSON.stringify(profile.specialties) : null,
                languages: profile.languages ? JSON.stringify(profile.languages) : null,
                serviceAreas: profile.serviceAreas ? JSON.stringify(profile.serviceAreas) : null,
                website: profile.website,
                whatsapp: profile.whatsapp,
                workingHours: profile.workingHours ? JSON.stringify(profile.workingHours) : null,
                socialMedia: profile.socialMedia ? JSON.stringify(profile.socialMedia) : null,
                establishedYear: profile.establishedYear,
                teamSize: profile.teamSize,
                certifications: profile.certifications ? JSON.stringify(profile.certifications) : null,
                awards: profile.awards ? JSON.stringify(profile.awards) : null,
            };
            await db_1.db.insert(schema_1.brokerProfiles).values(newProfile);
        }
        res.status(201).json({
            message: 'Broker başvurunuz başarıyla alındı. Onay bekleniyor.',
            broker,
        });
    }
    catch (error) {
        console.error('Broker registration error:', error);
        res.status(500).json({ error: 'Broker kaydı başarısız' });
    }
};
exports.registerBroker = registerBroker;
// ============================================
// GET BROKER PROFILE (Own)
// ============================================
const getBrokerProfile = async (req, res) => {
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
        const [profile] = await db_1.db
            .select()
            .from(schema_1.brokerProfiles)
            .where((0, drizzle_orm_1.eq)(schema_1.brokerProfiles.brokerId, broker.id))
            .limit(1);
        res.json({
            broker,
            profile: profile || null,
        });
    }
    catch (error) {
        console.error('Get broker profile error:', error);
        res.status(500).json({ error: 'Profil alınamadı' });
    }
};
exports.getBrokerProfile = getBrokerProfile;
// ============================================
// UPDATE BROKER PROFILE
// ============================================
const updateBrokerProfile = async (req, res) => {
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
        const profileData = req.body;
        // Profil varsa güncelle, yoksa oluştur
        const [existingProfile] = await db_1.db
            .select()
            .from(schema_1.brokerProfiles)
            .where((0, drizzle_orm_1.eq)(schema_1.brokerProfiles.brokerId, broker.id))
            .limit(1);
        if (existingProfile) {
            await db_1.db
                .update(schema_1.brokerProfiles)
                .set({
                ...profileData,
                specialties: profileData.specialties ? JSON.stringify(profileData.specialties) : existingProfile.specialties,
                languages: profileData.languages ? JSON.stringify(profileData.languages) : existingProfile.languages,
                serviceAreas: profileData.serviceAreas ? JSON.stringify(profileData.serviceAreas) : existingProfile.serviceAreas,
                workingHours: profileData.workingHours ? JSON.stringify(profileData.workingHours) : existingProfile.workingHours,
                socialMedia: profileData.socialMedia ? JSON.stringify(profileData.socialMedia) : existingProfile.socialMedia,
                certifications: profileData.certifications ? JSON.stringify(profileData.certifications) : existingProfile.certifications,
                awards: profileData.awards ? JSON.stringify(profileData.awards) : existingProfile.awards,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema_1.brokerProfiles.id, existingProfile.id));
        }
        else {
            const newProfile = {
                id: (0, schema_2.generateId)(),
                brokerId: broker.id,
                logo: profileData.logo,
                coverImage: profileData.coverImage,
                description: profileData.description,
                specialties: profileData.specialties ? JSON.stringify(profileData.specialties) : null,
                languages: profileData.languages ? JSON.stringify(profileData.languages) : null,
                serviceAreas: profileData.serviceAreas ? JSON.stringify(profileData.serviceAreas) : null,
                website: profileData.website,
                whatsapp: profileData.whatsapp,
                workingHours: profileData.workingHours ? JSON.stringify(profileData.workingHours) : null,
                socialMedia: profileData.socialMedia ? JSON.stringify(profileData.socialMedia) : null,
                establishedYear: profileData.establishedYear,
                teamSize: profileData.teamSize,
                certifications: profileData.certifications ? JSON.stringify(profileData.certifications) : null,
                awards: profileData.awards ? JSON.stringify(profileData.awards) : null,
            };
            await db_1.db.insert(schema_1.brokerProfiles).values(newProfile);
        }
        res.json({ message: 'Profil güncellendi' });
    }
    catch (error) {
        console.error('Update broker profile error:', error);
        res.status(500).json({ error: 'Profil güncellenemedi' });
    }
};
exports.updateBrokerProfile = updateBrokerProfile;
