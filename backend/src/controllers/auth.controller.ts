import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { EmailService } from '../services/email.service';
import { checkEmailRateLimit } from '../middleware/rateLimit';
import {
  registerSchema,
  loginSchema,
  verifySMSSchema,
  checkEmailSchema,
  checkPhoneSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation';

const JWT_SECRET = 'your-secret-key'; // In production, use env

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phone, userType, kvkkApproved } = registerSchema.parse(req.body);

    // Email kontrolü
    const existingUser = await req.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email zaten kayıtlı' });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // User oluştur
    const user = await req.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        userType,
        kvkkApproved
      }
    });

    // SMS doğrulama kodu
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Mock SMS gönder
    console.log(`SMS sent to ${phone}: Your verification code is ${smsCode}`);

    res.json({ success: true, userId: user.id, message: 'SMS gönderildi' });
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
    const user = await req.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Password kontrol et
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
    const user = await req.prisma.user.update({
      where: { phone },
      data: {
        phoneVerified: true
      }
    });

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

    const existingUser = await req.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
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

    const existingUser = await req.prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
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

    const user = await req.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, always return success
      return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user
    await req.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    // Send email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await EmailService.sendPasswordResetEmail(email, resetLink);

    res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
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

    const user = await req.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

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

    const user = await req.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token geçersiz veya süresi dolmuş' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await req.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        lastPasswordReset: new Date()
      }
    });

    res.json({ success: true, message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};