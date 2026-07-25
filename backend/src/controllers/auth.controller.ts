import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { EmailService } from '../services/email.service';
import { checkEmailRateLimit } from '../middleware/rateLimit';
import { eq, and, gt } from 'drizzle-orm';
import {
  registerSchema,
  loginSchema,
  verifySMSSchema,
  checkEmailSchema,
  checkPhoneSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation';
import { users } from '../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, userType, kvkkApproved } = registerSchema.parse(req.body);

    // Email kontrolü
    const existingUsers = await req.db.select().from(users).where(eq(users.email, email));
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email zaten kayıtlı' });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Email doğrulama token'ı oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // User oluştur
    const newUsers = await req.db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      userType,
      kvkkApproved,
      phoneVerified: false,
      resetPasswordToken: verificationToken,
      emailVerificationExpires: verificationExpires
    }).returning();

    const user = newUsers[0];

    // Email gönder
    const verificationLink = `http://localhost:3001/api/auth/confirm-email/${verificationToken}`;
    await EmailService.sendEmailConfirmationEmail(email, verificationLink);

    res.json({ success: true, message: 'Kayıt başarılı. Lütfen emailinizi doğrulayın.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // User bul
    const foundUsers = await req.db.select().from(users).where(eq(users.email, email));
    const user = foundUsers[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Geçersiz kullanıcı bilgileri' });
    }

    // Password kontrol et
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Geçersiz kullanıcı bilgileri' });
    }

    // Email doğrulanmış mı kontrol et
    if (!user.phoneVerified) {
      return res.status(401).json({ success: false, message: 'Lütfen emailinizi doğrulayın' });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, userType: user.userType }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifySMS = async (req: Request, res: Response) => {
  try {
    const { phone, code } = verifySMSSchema.parse(req.body);

    // Mock code kontrolü
    if (code !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid code' });
    }

    // User bul ve güncelle
    const updatedUsers = await req.db.update(users)
      .set({ phoneVerified: true })
      .where(eq(users.phone, phone))
      .returning();

    const user = updatedUsers[0];

    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, userType: user.userType }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = checkEmailSchema.parse(req.body);

    const existingUsers = await req.db.select().from(users).where(eq(users.email, email));
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email zaten kayıtlı' });
    }

    res.json({ success: true, message: 'Email kullanılabilir' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const checkPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = checkPhoneSchema.parse(req.body);

    const existingUsers = await req.db.select().from(users).where(eq(users.phone, phone));
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Telefon numarası zaten kayıtlı' });
    }

    res.json({ success: true, message: 'Telefon numarası kullanılabilir' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    if (!checkEmailRateLimit(email)) {
      return res.status(429).json({ success: false, message: 'Bu email için çok fazla şifre sıfırlama isteği yapıldı. Lütfen daha sonra tekrar deneyin.' });
    }

    const foundUsers = await req.db.select().from(users).where(eq(users.email, email));
    const user = foundUsers[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Bu email adresi ile kayıtlı bir hesap bulunamadı' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user
    await req.db.update(users)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      })
      .where(eq(users.id, user.id));

    // Send email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await EmailService.sendPasswordResetEmail(email, resetLink);

    res.json({ success: true, message: 'Şifre sıfırlama linki email adresinize gönderildi' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const foundUsers = await req.db.select().from(users).where(
      and(
        eq(users.resetPasswordToken, token),
        gt(users.resetPasswordExpires!, new Date())
      )
    );

    const user = foundUsers[0];

    if (!user) {
      return res.json({ valid: false, error: 'Token geçersiz veya süresi dolmuş' });
    }

    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const foundUsers = await req.db.select().from(users).where(
      and(
        eq(users.resetPasswordToken, token),
        gt(users.resetPasswordExpires!, new Date())
      )
    );

    const user = foundUsers[0];

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token geçersiz veya süresi dolmuş' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await req.db.update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        lastPasswordReset: new Date()
      })
      .where(eq(users.id, user.id));

    res.json({ success: true, message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const foundUsers = await req.db.select().from(users).where(
      eq(users.resetPasswordToken, token)
    );

    const user = foundUsers[0];

    if (!user) {
      return res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Geçersiz Token</h2>
          <p>Bu doğrulama linki geçersiz.</p>
          <a href="http://localhost:3000/">Ana Sayfaya Dön</a>
        </div>
      `);
    }

    // Check if verification has expired
    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      // Delete the user if verification expired
      await req.db.delete(users).where(eq(users.id, user.id));
      return res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Doğrulama Süresi Doldu</h2>
          <p>Bu doğrulama linkinin süresi dolmuş. Lütfen tekrar kayıt olun.</p>
          <a href="http://localhost:3000/register" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Tekrar Kayıt Ol</a>
        </div>
      `);
    }

    // Hesabı doğrula
    await req.db.update(users)
      .set({
        phoneVerified: true,
        resetPasswordToken: null,
        emailVerificationExpires: null
      })
      .where(eq(users.id, user.id));

    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>Email Doğrulandı!</h2>
        <p>Hesabınız başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.</p>
        <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Giriş Yap</a>
      </div>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>Hata</h2>
        <p>Bir hata oluştu. Lütfen tekrar deneyin.</p>
        <a href="http://localhost:3000/">Ana Sayfaya Dön</a>
      </div>
    `);
  }
};
