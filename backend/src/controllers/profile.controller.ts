import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq, and, ne } from 'drizzle-orm';
import { users } from '../db/schema';
import { assertAuthenticated } from '../types';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

export const getProfile = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;

    const foundUsers = await req.db.select({
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
      updatedAt: users.updatedAt
    }).from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = foundUsers[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const data = updateProfileSchema.parse(req.body);

    // Check if email is already taken by another user
    if (data.email) {
      const existingUsers = await req.db.select().from(users)
        .where(and(eq(users.email, data.email), ne(users.id, userId)))
        .limit(1);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if phone is already taken by another user
    if (data.phone) {
      const existingUsers = await req.db.select().from(users)
        .where(and(eq(users.phone, data.phone), ne(users.id, userId)))
        .limit(1);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
    }

    const updatedUsers = await req.db.update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning({
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
        updatedAt: users.updatedAt
      });

    const updatedUser = updatedUsers[0];

    res.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    assertAuthenticated(req);
    const userId = req.user.id;
    const data = changePasswordSchema.parse(req.body);

    // Get current user with password
    const foundUsers = await req.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = foundUsers[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update password
    await req.db.update(users)
      .set({
        password: hashedPassword,
        lastPasswordReset: new Date()
      })
      .where(eq(users.id, userId));

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
