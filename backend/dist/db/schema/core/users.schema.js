"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const generateId_1 = require("../utils/generateId");
// ============================================
// KULLANICI TABLOSU
// ============================================
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, generateId_1.generateId)()),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    phone: (0, pg_core_1.text)('phone').notNull().unique(),
    firstName: (0, pg_core_1.text)('first_name').notNull(),
    lastName: (0, pg_core_1.text)('last_name').notNull(),
    phoneVerified: (0, pg_core_1.boolean)('phone_verified').notNull().default(false),
    password: (0, pg_core_1.text)('password').notNull(),
    userType: (0, pg_core_1.text)('user_type').notNull(), // 'individual' | 'corporate'
    kvkkApproved: (0, pg_core_1.boolean)('kvkk_approved').notNull().default(false),
    status: (0, pg_core_1.text)('status').notNull().default('INACTIVE'), // 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    resetPasswordToken: (0, pg_core_1.text)('reset_password_token').unique(),
    resetPasswordExpires: (0, pg_core_1.timestamp)('reset_password_expires'),
    lastPasswordReset: (0, pg_core_1.timestamp)('last_password_reset'),
    emailVerificationExpires: (0, pg_core_1.timestamp)('email_verification_expires'),
}, (table) => ({
    emailIdx: (0, pg_core_1.index)('users_email_idx').on(table.email),
    phoneIdx: (0, pg_core_1.index)('users_phone_idx').on(table.phone),
}));
