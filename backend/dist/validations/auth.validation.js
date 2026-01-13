"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.checkPhoneSchema = exports.checkEmailSchema = exports.verifySMSSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'Ad zorunludur'),
    lastName: zod_1.z.string().min(1, 'Soyad zorunludur'),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
        .min(8, 'Şifre en az 8 karakter olmalı')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
    phone: zod_1.z.string().regex(/^[\+]?[1-9][\d]{0,15}$/),
    userType: zod_1.z.enum(['INDIVIDUAL', 'BROKER', 'SERVICE', 'ADMIN']),
    kvkkApproved: zod_1.z.boolean()
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.verifySMSSchema = zod_1.z.object({
    phone: zod_1.z.string(),
    code: zod_1.z.string()
});
exports.checkEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.checkPhoneSchema = zod_1.z.object({
    phone: zod_1.z.string().regex(/^[\+]?[1-9][\d]{0,15}$/)
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    password: zod_1.z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    }),
    confirmPassword: zod_1.z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
