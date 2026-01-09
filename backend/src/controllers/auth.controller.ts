import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/),
  userType: z.enum(['INDIVIDUAL', 'BROKER', 'SERVICE', 'ADMIN'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const verifySMSSchema = z.object({
  phone: z.string(),
  code: z.string()
});

const JWT_SECRET = 'your-secret-key'; // In production, use env

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phone, userType } = registerSchema.parse(req.body);

    // Email kontrolü
    const existingUser = await req.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // User oluştur
    const user = await req.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        userType
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