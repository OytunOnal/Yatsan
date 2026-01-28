"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmail = exports.resetPassword = exports.validateResetToken = exports.forgotPassword = exports.checkPhone = exports.checkEmail = exports.verifySMS = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const email_service_1 = require("../services/email.service");
const rateLimit_1 = require("../middleware/rateLimit");
const drizzle_orm_1 = require("drizzle-orm");
const auth_validation_1 = require("../validations/auth.validation");
const schema_1 = require("../db/schema");
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, userType, kvkkApproved } = auth_validation_1.registerSchema.parse(req.body);
        // Email kontrolü
        const existingUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'Email zaten kayıtlı' });
        }
        // Password hash
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Email doğrulama token'ı oluştur
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // User oluştur
        const newUsers = await req.db.insert(schema_1.users).values({
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
        await email_service_1.EmailService.sendEmailConfirmationEmail(email, verificationLink);
        res.json({ success: true, message: 'Kayıt başarılı. Lütfen emailinizi doğrulayın.' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = auth_validation_1.loginSchema.parse(req.body);
        // User bul
        const foundUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        const user = foundUsers[0];
        if (!user) {
            return res.status(401).json({ success: false, message: 'Geçersiz kullanıcı bilgileri' });
        }
        // Password kontrol et
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Geçersiz kullanıcı bilgileri' });
        }
        // Email doğrulanmış mı kontrol et
        if (!user.phoneVerified) {
            return res.status(401).json({ success: false, message: 'Lütfen emailinizi doğrulayın' });
        }
        // JWT token oluştur
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            user: { id: user.id, email: user.email, userType: user.userType }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.login = login;
const verifySMS = async (req, res) => {
    try {
        const { phone, code } = auth_validation_1.verifySMSSchema.parse(req.body);
        // Mock code kontrolü
        if (code !== '123456') {
            return res.status(400).json({ success: false, message: 'Invalid code' });
        }
        // User bul ve güncelle
        const updatedUsers = await req.db.update(schema_1.users)
            .set({ phoneVerified: true })
            .where((0, drizzle_orm_1.eq)(schema_1.users.phone, phone))
            .returning();
        const user = updatedUsers[0];
        // JWT token oluştur
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            user: { id: user.id, email: user.email, userType: user.userType }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.verifySMS = verifySMS;
const checkEmail = async (req, res) => {
    try {
        const { email } = auth_validation_1.checkEmailSchema.parse(req.body);
        const existingUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'Email zaten kayıtlı' });
        }
        res.json({ success: true, message: 'Email kullanılabilir' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.checkEmail = checkEmail;
const checkPhone = async (req, res) => {
    try {
        const { phone } = auth_validation_1.checkPhoneSchema.parse(req.body);
        const existingUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.phone, phone));
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'Telefon numarası zaten kayıtlı' });
        }
        res.json({ success: true, message: 'Telefon numarası kullanılabilir' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.checkPhone = checkPhone;
const forgotPassword = async (req, res) => {
    try {
        const { email } = auth_validation_1.forgotPasswordSchema.parse(req.body);
        if (!(0, rateLimit_1.checkEmailRateLimit)(email)) {
            return res.status(429).json({ success: false, message: 'Bu email için çok fazla şifre sıfırlama isteği yapıldı. Lütfen daha sonra tekrar deneyin.' });
        }
        const foundUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        const user = foundUsers[0];
        if (!user) {
            return res.status(404).json({ success: false, message: 'Bu email adresi ile kayıtlı bir hesap bulunamadı' });
        }
        // Generate token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour
        // Update user
        await req.db.update(schema_1.users)
            .set({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        // Send email
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        await email_service_1.EmailService.sendPasswordResetEmail(email, resetLink);
        res.json({ success: true, message: 'Şifre sıfırlama linki email adresinize gönderildi' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const foundUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.resetPasswordToken, token), (0, drizzle_orm_1.gt)(schema_1.users.resetPasswordExpires, new Date())));
        const user = foundUsers[0];
        if (!user) {
            return res.json({ valid: false, error: 'Token geçersiz veya süresi dolmuş' });
        }
        res.json({ valid: true, email: user.email });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.validateResetToken = validateResetToken;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = auth_validation_1.resetPasswordSchema.parse(req.body);
        const foundUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.resetPasswordToken, token), (0, drizzle_orm_1.gt)(schema_1.users.resetPasswordExpires, new Date())));
        const user = foundUsers[0];
        if (!user) {
            return res.status(400).json({ success: false, message: 'Token geçersiz veya süresi dolmuş' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await req.db.update(schema_1.users)
            .set({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            lastPasswordReset: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        res.json({ success: true, message: 'Şifre başarıyla güncellendi' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.resetPassword = resetPassword;
const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const foundUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.resetPasswordToken, token));
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
            await req.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
            return res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Doğrulama Süresi Doldu</h2>
          <p>Bu doğrulama linkinin süresi dolmuş. Lütfen tekrar kayıt olun.</p>
          <a href="http://localhost:3000/register" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Tekrar Kayıt Ol</a>
        </div>
      `);
        }
        // Hesabı doğrula
        await req.db.update(schema_1.users)
            .set({
            phoneVerified: true,
            resetPasswordToken: null,
            emailVerificationExpires: null
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>Email Doğrulandı!</h2>
        <p>Hesabınız başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.</p>
        <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Giriş Yap</a>
      </div>
    `);
    }
    catch (error) {
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
exports.confirmEmail = confirmEmail;
