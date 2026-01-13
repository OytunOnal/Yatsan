"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const types_1 = require("../types");
const updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().min(10).optional(),
    email: zod_1.z.string().email().optional()
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6)
});
const getProfile = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const foundUsers = await req.db.select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            phone: schema_1.users.phone,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            userType: schema_1.users.userType,
            phoneVerified: schema_1.users.phoneVerified,
            kvkkApproved: schema_1.users.kvkkApproved,
            status: schema_1.users.status,
            createdAt: schema_1.users.createdAt,
            updatedAt: schema_1.users.updatedAt
        }).from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
            .limit(1);
        const user = foundUsers[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const data = updateProfileSchema.parse(req.body);
        // Check if email is already taken by another user
        if (data.email) {
            const existingUsers = await req.db.select().from(schema_1.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.email, data.email), (0, drizzle_orm_1.ne)(schema_1.users.id, userId)))
                .limit(1);
            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        // Check if phone is already taken by another user
        if (data.phone) {
            const existingUsers = await req.db.select().from(schema_1.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.phone, data.phone), (0, drizzle_orm_1.ne)(schema_1.users.id, userId)))
                .limit(1);
            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }
        const updatedUsers = await req.db.update(schema_1.users)
            .set(data)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
            .returning({
            id: schema_1.users.id,
            email: schema_1.users.email,
            phone: schema_1.users.phone,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            userType: schema_1.users.userType,
            phoneVerified: schema_1.users.phoneVerified,
            kvkkApproved: schema_1.users.kvkkApproved,
            status: schema_1.users.status,
            createdAt: schema_1.users.createdAt,
            updatedAt: schema_1.users.updatedAt
        });
        const updatedUser = updatedUsers[0];
        res.json({ user: updatedUser });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const userId = req.user.id;
        const data = changePasswordSchema.parse(req.body);
        // Get current user with password
        const foundUsers = await req.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
        const user = foundUsers[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Verify current password
        const isPasswordValid = await bcryptjs_1.default.compare(data.currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, 10);
        // Update password
        await req.db.update(schema_1.users)
            .set({
            password: hashedPassword,
            lastPasswordReset: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.changePassword = changePassword;
