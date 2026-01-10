import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/),
  userType: z.enum(['INDIVIDUAL', 'BROKER', 'SERVICE', 'ADMIN']),
  kvkkApproved: z.boolean()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const verifySMSSchema = z.object({
  phone: z.string(),
  code: z.string()
});

export const checkEmailSchema = z.object({
  email: z.string().email()
});

export const checkPhoneSchema = z.object({
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});