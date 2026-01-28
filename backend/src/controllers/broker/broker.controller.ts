import { Request, Response } from 'express';
import { db } from '../../lib/db';
import {
  brokers,
  brokerProfiles,
  NewBroker,
  NewBrokerProfile,
} from '../../db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '../../db/schema';
import { generateSlug } from '../utils/slug';

// ============================================
// BROKER REGISTRATION
// ============================================
export const registerBroker = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      businessName,
      taxNumber,
      taxOffice,
      licenseNumber,
      licenseExpiry,
      profile,
    } = req.body;

    // Slug oluştur
    const baseSlug = generateSlug(businessName);
    let slug = baseSlug;
    let counter = 1;

    // Benzersiz slug kontrolü
    while (true) {
      const existing = await db
        .select({ id: brokers.id })
        .from(brokers)
        .where(eq(brokers.slug, slug))
        .limit(1);

      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Broker kaydı oluştur
    const newBroker: NewBroker = {
      id: generateId(),
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

    const [broker] = await db.insert(brokers).values(newBroker).returning();

    // Profil varsa oluştur
    if (profile) {
      const newProfile: NewBrokerProfile = {
        id: generateId(),
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

      await db.insert(brokerProfiles).values(newProfile);
    }

    res.status(201).json({
      message: 'Broker başvurunuz başarıyla alındı. Onay bekleniyor.',
      broker,
    });
  } catch (error) {
    console.error('Broker registration error:', error);
    res.status(500).json({ error: 'Broker kaydı başarısız' });
  }
};

// ============================================
// GET BROKER PROFILE (Own)
// ============================================
export const getBrokerProfile = async (req: Request, res: Response) => {
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

    const [profile] = await db
      .select()
      .from(brokerProfiles)
      .where(eq(brokerProfiles.brokerId, broker.id))
      .limit(1);

    res.json({
      broker,
      profile: profile || null,
    });
  } catch (error) {
    console.error('Get broker profile error:', error);
    res.status(500).json({ error: 'Profil alınamadı' });
  }
};

// ============================================
// UPDATE BROKER PROFILE
// ============================================
export const updateBrokerProfile = async (req: Request, res: Response) => {
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

    const profileData = req.body;

    // Profil varsa güncelle, yoksa oluştur
    const [existingProfile] = await db
      .select()
      .from(brokerProfiles)
      .where(eq(brokerProfiles.brokerId, broker.id))
      .limit(1);

    if (existingProfile) {
      await db
        .update(brokerProfiles)
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
        .where(eq(brokerProfiles.id, existingProfile.id));
    } else {
      const newProfile: NewBrokerProfile = {
        id: generateId(),
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

      await db.insert(brokerProfiles).values(newProfile);
    }

    res.json({ message: 'Profil güncellendi' });
  } catch (error) {
    console.error('Update broker profile error:', error);
    res.status(500).json({ error: 'Profil güncellenemedi' });
  }
};
